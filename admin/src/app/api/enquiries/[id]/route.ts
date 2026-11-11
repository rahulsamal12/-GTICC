import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { sendBrevoEmail, buildEnquiryNotificationEmail } from '@/lib/brevo';

// GET: Single Enquiry full details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const enquiry = await queryOne<Record<string, unknown>>(
      `SELECT
        id,
        name,
        organization,
        email,
        country,
        interest_type     AS interestType,
        message,
        status,
        email_status      AS emailStatus,
        email_message_id  AS emailMessageId,
        email_error       AS emailError,
        email_sent_at     AS emailSentAt,
        internal_notes    AS internalNotes,
        assigned_to       AS assignedTo,
        created_at        AS createdAt,
        updated_at        AS updatedAt
      FROM contact_enquiries WHERE id = ?`,
      [id]
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ enquiry });
  } catch (error: any) {
    console.error('Fetch single enquiry error:', error);
    return NextResponse.json({ error: 'Failed to retrieve enquiry details.' }, { status: 500 });
  }
}

// PATCH: Update status, internal notes, or assigned officer
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, internalNotes, assignedTo } = body;

    const existing = await queryOne<any>(
      `SELECT id, status, internal_notes, assigned_to FROM contact_enquiries WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    const newStatus = status !== undefined ? status : existing.status;
    const newNotes = internalNotes !== undefined ? internalNotes : existing.internal_notes;
    const newAssignedTo = assignedTo !== undefined ? assignedTo : existing.assigned_to;

    await execute(
      `UPDATE contact_enquiries
       SET status = ?, internal_notes = ?, assigned_to = ?, updated_at = NOW(3)
       WHERE id = ?`,
      [newStatus, newNotes, newAssignedTo, id]
    );

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminEmail: session.email,
      action: 'UPDATE_ENQUIRY',
      entityType: 'contact_enquiry',
      entityId: id,
      details: `Updated enquiry status to "${newStatus}"`,
      ipAddress: ip,
    });

    const updated = await queryOne(
      `SELECT
        id,
        name,
        organization,
        email,
        country,
        interest_type     AS interestType,
        message,
        status,
        email_status      AS emailStatus,
        email_message_id  AS emailMessageId,
        email_error       AS emailError,
        email_sent_at     AS emailSentAt,
        internal_notes    AS internalNotes,
        assigned_to       AS assignedTo,
        created_at        AS createdAt,
        updated_at        AS updatedAt
      FROM contact_enquiries WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      enquiry: updated,
      message: 'Enquiry updated successfully.',
    });
  } catch (error: any) {
    console.error('Update enquiry error:', error);
    return NextResponse.json({ error: 'Failed to update enquiry.' }, { status: 500 });
  }
}

// DELETE: Delete enquiry record with admin authorization
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await queryOne<any>(
      `SELECT id, name, organization FROM contact_enquiries WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    await execute(`DELETE FROM contact_enquiries WHERE id = ?`, [id]);

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminEmail: session.email,
      action: 'DELETE_ENQUIRY',
      entityType: 'contact_enquiry',
      entityId: id,
      details: `Deleted contact enquiry for ${existing.name} (${existing.organization})`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete enquiry error:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry.' }, { status: 500 });
  }
}

// POST: Resend/Retry email notification for this enquiry
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const enquiry = await queryOne<any>(
      `SELECT * FROM contact_enquiries WHERE id = ?`,
      [id]
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    const nowIst = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(enquiry.created_at || new Date()));

    const emailPayload = buildEnquiryNotificationEmail({
      enquiryId: enquiry.id,
      name: enquiry.name,
      organization: enquiry.organization,
      email: enquiry.email,
      country: enquiry.country,
      interestType: enquiry.interest_type,
      message: enquiry.message,
      submittedAt: nowIst,
    });

    const sendRes = await sendBrevoEmail({
      to: [{ email: 'gticcofficial@gmail.com', name: 'GTICC Official Desk' }],
      replyTo: { email: enquiry.email, name: enquiry.name },
      subject: emailPayload.subject,
      htmlContent: emailPayload.html,
      textContent: emailPayload.text,
    });

    if (sendRes.success) {
      const messageId = sendRes.messageId || 'SENT';
      await execute(
        `UPDATE contact_enquiries SET email_status = 'SENT', email_message_id = ?, email_error = NULL, email_sent_at = NOW(3) WHERE id = ?`,
        [messageId, id]
      );

      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
      await logAuditEvent({
        adminEmail: session.email,
        action: 'RESEND_ENQUIRY_NOTIFICATION',
        entityType: 'contact_enquiry',
        entityId: id,
        details: `Resent notification email to gticcofficial@gmail.com (Message ID: ${messageId})`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: 'Notification email successfully resent to gticcofficial@gmail.com.',
        messageId,
      });
    } else {
      const errorMsg = sendRes.error || 'Failed to dispatch email';
      await execute(
        `UPDATE contact_enquiries SET email_status = 'FAILED', email_error = ? WHERE id = ?`,
        [errorMsg, id]
      );

      return NextResponse.json({
        success: false,
        error: errorMsg,
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Resend enquiry notification error:', error);
    return NextResponse.json({ error: 'Failed to resend notification.' }, { status: 500 });
  }
}

