export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne, execute, logAuditEvent } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

// In-memory rate limiting map for login attempts: IP/email -> { count, firstAttempt }
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

function checkRateLimit(key: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return { limited: false };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return { limited: false };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds: retryAfter };
  }

  record.count += 1;
  return { limited: false };
}

function clearRateLimit(key: string) {
  loginAttempts.delete(key);
}

type AdminRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: number;
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const rateLimitKey = `${ip}:${email.toLowerCase().trim()}`;

    const limitStatus = checkRateLimit(rateLimitKey);
    if (limitStatus.limited) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${limitStatus.retryAfterSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(limitStatus.retryAfterSeconds || 60),
          },
        }
      );
    }

    const admin = await queryOne<AdminRow>(
      'SELECT * FROM admins WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!admin || !admin.is_active) {
      await logAuditEvent({
        adminEmail: email.toLowerCase().trim(),
        action: 'FAILED_LOGIN',
        entityType: 'admin',
        details: 'Failed login attempt: user not found or inactive.',
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Invalid official credentials or account is suspended.' },
        { status: 401 }
      );
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      await logAuditEvent({
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'FAILED_LOGIN',
        entityType: 'admin',
        entityId: admin.id,
        details: 'Failed login attempt: incorrect password.',
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Invalid official credentials.' },
        { status: 401 }
      );
    }

    // Login successful: reset rate limit attempts
    clearRateLimit(rateLimitKey);

    // Update last login timestamp
    await execute(
      'UPDATE admins SET last_login_at = NOW(3) WHERE id = ?',
      [admin.id]
    );

    // Log successful login audit event
    await logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'LOGIN',
      entityType: 'admin',
      entityId: admin.id,
      details: 'Administrator logged in successfully.',
      ipAddress: ip,
    });

    const role = admin.role.toUpperCase() as 'SUPER_ADMIN' | 'ADMIN' | 'REVIEWER';

    const token = signToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role,
      },
    });

    res.cookies.set('gticc_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server authentication error.' },
      { status: 500 }
    );
  }
}
