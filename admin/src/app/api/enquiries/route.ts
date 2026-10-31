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

// GET: Authenticated Admin listing of contact enquiries
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
      conditions.push('(name LIKE ? OR organization LIKE ? OR email LIKE ? OR id LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (status) {
      conditions.push('LOWER(status) = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM contact_enquiries ${whereClause}`,
      params
    );
    const total = countRow?.total || 0;

    const items = await query(
      `SELECT
        id,
        name,
        organization,
        email,
        country,
        interest_type   AS interestType,
        message,
        status,
        internal_notes  AS internalNotes,
        assigned_to     AS assignedTo,
        created_at      AS createdAt,
        updated_at      AS updatedAt
      FROM contact_enquiries
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
    console.error('Fetch contact enquiries error:', error);
    return NextResponse.json({ error: 'Failed to retrieve enquiries.' }, { status: 500 });
  }
}

// POST: Public submission endpoint from ContactUs.jsx
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, organization, email, country, interestType, message } = body;

    if (!name?.trim() || !organization?.trim() || !email?.trim() || !interestType?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, organization, email, interest type, and message are required fields.' },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Check duplicate recent submission within 3 minutes
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    const recent = await queryOne<{ id: string }>(
      `SELECT id FROM contact_enquiries
       WHERE email = ? AND created_at >= ?`,
      [email.toLowerCase().trim(), threeMinutesAgo]
    );

    if (recent) {
      return NextResponse.json(
        { error: 'An enquiry with this email address was already submitted moments ago. Please wait a few minutes.' },
        { status: 409, headers: corsHeaders(req) }
      );
    }

    const id = crypto.randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await execute(
      `INSERT INTO contact_enquiries (
        id, name, organization, email, country, interest_type, message, status, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,NOW(3),NOW(3))`,
      [
        id,
        name.trim(),
        organization.trim(),
        email.toLowerCase().trim(),
        country?.trim() || null,
        interestType.trim(),
        message.trim(),
        'new',
      ]
    );

    await logAuditEvent({
      adminEmail: 'public_system',
      action: 'SUBMIT_ENQUIRY',
      entityType: 'contact_enquiry',
      entityId: id,
      details: `Contact enquiry from ${name.trim()} (${organization.trim()})`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        message: 'Your enquiry has been successfully transmitted and recorded in MySQL.',
      },
      { status: 201, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Submit contact enquiry error:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving enquiry in MySQL.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
