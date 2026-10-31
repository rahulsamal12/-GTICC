export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionAdmin } from '@/lib/auth';
import { queryOne } from '@/lib/db';


type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
};

export async function GET(req: NextRequest) {
  try {
    const session = getSessionAdmin(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const admin = await queryOne<AdminRow>(
      'SELECT id, name, email, role, is_active, last_login_at, created_at FROM admins WHERE id = ?',
      [session.id]
    );

    if (!admin || !admin.is_active) {
      return NextResponse.json(
        { authenticated: false, error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role.toUpperCase(),
        isActive: Boolean(admin.is_active),
        lastLoginAt: admin.last_login_at,
        createdAt: admin.created_at,
      },
    });
  } catch (error: any) {
    console.error('Session verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
