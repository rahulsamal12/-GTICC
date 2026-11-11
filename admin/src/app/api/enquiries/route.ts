import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { sendBrevoEmail, buildEnquiryNotificationEmail } from '@/lib/brevo';

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
    const status = searchParams.get('status')?.trim() || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
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

    if (status && status !== 'ALL') {
      // Support matching exact status or case-insensitive status
      conditions.push('(LOWER(status) = LOWER(?) OR status = ?)');
      params.push(status, status);
    }

    if (startDate) {
      conditions.push('created_at >= ?');
      params.push(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push('created_at <= ?');
      params.push(end.toISOString());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM contact_enquiries ${whereClause}`,
      params
    );
    const total = countRow?.total || 0;

    // Status counter summary
    const statusCounts = await query<{ status: string; count: number }>(
      `SELECT status, COUNT(*) as count FROM contact_enquiries GROUP BY status`
    );

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
        email_status    AS emailStatus,
        email_message_id AS emailMessageId,
        email_error     AS emailError,
        email_sent_at   AS emailSentAt,
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
      statusCounts,
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

    // 1. Permanent database insertion FIRST (Guarantees enquiry is not lost even if email fails)
    await execute(
      `INSERT INTO contact_enquiries (
        id, name, organization, email, country, interest_type, message, status, email_status, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,'PENDING',NOW(3),NOW(3))`,
      [
        id,
        name.trim(),
        organization.trim(),
        email.toLowerCase().trim(),
        country?.trim() || null,
        interestType.trim(),
        message.trim(),
        'New',
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

    // 2. Format submission date for notification (IST)
    const nowIst = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date());

    // 3. Attempt automated email dispatch to gticcofficial@gmail.com
    const emailPayload = buildEnquiryNotificationEmail({
      enquiryId: id,
      name: name.trim(),
      organization: organization.trim(),
      email: email.toLowerCase().trim(),
      country: country?.trim() || null,
      interestType: interestType.trim(),
      message: message.trim(),
      submittedAt: nowIst,
    });

    let emailResult = { sent: false, messageId: '', error: '' };
    try {
      const sendRes = await sendBrevoEmail({
        to: [{ email: 'gticcofficial@gmail.com', name: 'GTICC Official Desk' }],
        replyTo: { email: email.toLowerCase().trim(), name: name.trim() },
        subject: emailPayload.subject,
        htmlContent: emailPayload.html,
        textContent: emailPayload.text,
      });

      if (sendRes.success) {
        emailResult.sent = true;
        emailResult.messageId = sendRes.messageId || 'SENT';
        await execute(
          `UPDATE contact_enquiries SET email_status = 'SENT', email_message_id = ?, email_sent_at = NOW(3) WHERE id = ?`,
          [emailResult.messageId, id]
        );
      } else {
        emailResult.error = sendRes.error || 'Failed to dispatch email';
        await execute(
          `UPDATE contact_enquiries SET email_status = 'FAILED', email_error = ? WHERE id = ?`,
          [emailResult.error, id]
        );
      }
    } catch (mailErr: any) {
      console.error('[Enquiry Email Exception]:', mailErr);
      emailResult.error = mailErr.message || 'Network exception during email dispatch';
      await execute(
        `UPDATE contact_enquiries SET email_status = 'FAILED', email_error = ? WHERE id = ?`,
        [emailResult.error, id]
      );
    }

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        emailResult,
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
