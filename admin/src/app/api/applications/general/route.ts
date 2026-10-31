import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}

// GET: Authenticated Admin listing of general applications
export async function GET(req: NextRequest) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.toLowerCase() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push('(full_name LIKE ? OR org_name LIKE ? OR email LIKE ? OR id LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (status) {
      conditions.push('LOWER(status) = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM general_applications ${whereClause}`,
      params
    );
    const total = countRow?.total || 0;

    const items = await query(
      `SELECT
        id,
        full_name       AS fullName,
        org_name        AS orgName,
        designation,
        email,
        phone,
        country,
        city,
        website,
        linkedin,
        plan,
        sector,
        org_type        AS orgType,
        primary_interest AS primaryInterest,
        org_description AS orgDescription,
        connections_seeking AS connectionsSeeking,
        status,
        admin_notes     AS adminNotes,
        created_at      AS createdAt,
        updated_at      AS updatedAt
      FROM general_applications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, skip]
    );

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch general applications error:', error);
    return NextResponse.json({ error: 'Failed to retrieve applications.' }, { status: 500 });
  }
}

// POST: Public submission endpoint from MembershipApply.jsx
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      orgName,
      designation,
      email,
      phone,
      country,
      city,
      website,
      linkedin,
      plan,
      sector,
      orgType,
      primaryInterest,
      orgDescription,
      connectionsSeeking,
    } = body;

    if (!fullName?.trim() || !orgName?.trim() || !email?.trim() || !plan?.trim()) {
      return NextResponse.json(
        { error: 'Full name, organization name, email, and plan tier are required fields.' },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid corporate or professional email address.' },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Check duplicate recent submission within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recent = await queryOne<{ id: string }>(
      `SELECT id FROM general_applications
       WHERE email = ? AND org_name = ? AND created_at >= ?`,
      [email.toLowerCase().trim(), orgName.trim(), fiveMinutesAgo]
    );

    if (recent) {
      return NextResponse.json(
        { error: 'A membership application for this email and organization was already submitted moments ago.' },
        { status: 409, headers: corsHeaders(req) }
      );
    }

    const id = crypto.randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await execute(
      `INSERT INTO general_applications (
        id, full_name, org_name, designation, email, phone, country, city,
        website, linkedin, plan, sector, org_type, primary_interest,
        org_description, connections_seeking, status, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(3),NOW(3))`,
      [
        id,
        fullName.trim(),
        orgName.trim(),
        designation?.trim() || null,
        email.toLowerCase().trim(),
        phone?.trim() || null,
        country?.trim() || null,
        city?.trim() || null,
        website?.trim() || null,
        linkedin?.trim() || null,
        plan.trim(),
        sector?.trim() || null,
        orgType?.trim() || null,
        primaryInterest?.trim() || null,
        orgDescription?.trim() || null,
        connectionsSeeking?.trim() || null,
        'pending',
      ]
    );

    await logAuditEvent({
      adminEmail: 'public_system',
      action: 'SUBMIT_GENERAL_APP',
      entityType: 'general_application',
      entityId: id,
      details: `General application submitted for ${fullName.trim()} (${orgName.trim()})`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        message: 'Your membership application has been successfully submitted and stored in MySQL.',
      },
      { status: 201, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Submit general application error:', error);
    return NextResponse.json(
      { error: 'Internal server error while storing application in MySQL.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
