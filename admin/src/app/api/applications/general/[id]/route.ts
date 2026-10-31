import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, withTransaction, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { reviewStatusSchema } from '@/lib/validations';
import { dispatchApplicationNotification, getApplicationNotifications } from '@/lib/notifications';

// GET: Single General Application full detail + notification history
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

    const application = await queryOne<Record<string, unknown>>(
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
        UPPER(status)   AS status,
        admin_notes     AS adminNotes,
        created_at      AS createdAt,
        updated_at      AS updatedAt
      FROM general_applications WHERE id = ?`,
      [id]
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    const notifications = await getApplicationNotifications(id);

    return NextResponse.json({ application: { ...application, notifications } });
  } catch (error: any) {
    console.error('Fetch general application detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve application details.' }, { status: 500 });
  }
}

// PATCH: Review action (Accept, Reject, Return to Pending) with Brevo notification dispatch
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
    const parsed = reviewStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid status transition.' },
        { status: 400 }
      );
    }

    const { status: newStatus, note } = parsed.data;

    const existing = await queryOne<{
      id: string;
      status: string;
      admin_notes: string | null;
      full_name: string;
      email: string;
      org_name: string;
    }>(
      'SELECT id, status, admin_notes, full_name, email, org_name FROM general_applications WHERE id = ?',
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    const previousStatus = existing.status.toUpperCase();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await withTransaction(async (conn) => {
      await conn.query(
        `UPDATE general_applications
         SET status = ?, admin_notes = ?, updated_at = NOW(3)
         WHERE id = ?`,
        [
          newStatus,
          note ? note.trim() : existing.admin_notes,
          id
        ]
      );

      await logAuditEvent({
        adminId: session.id,
        adminEmail: session.email,
        action: 'UPDATE_APPLICATION_STATUS',
        entityType: 'general_application',
        entityId: id,
        details: `General application status changed from ${previousStatus} to ${newStatus}.${note ? ` Note: ${note.trim()}` : ''}`,
        ipAddress: ip,
      }, conn);
    });

    // Send Brevo notification if decision is ACCEPTED or REJECTED
    let emailResult = null;
    if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
      emailResult = await dispatchApplicationNotification(
        {
          applicationId: id,
          applicationType: 'GENERAL',
          decision: newStatus,
          recipientName: existing.full_name,
          recipientEmail: existing.email,
          organizationName: existing.org_name,
          feedbackOrNote: note,
        },
        session.email
      );
    }

    const updatedApplication = await queryOne(
      'SELECT *, UPPER(status) as status FROM general_applications WHERE id = ?',
      [id]
    );

    const notifications = await getApplicationNotifications(id);

    return NextResponse.json({
      success: true,
      application: { ...(updatedApplication as object), notifications },
      review: { previousStatus, newStatus },
      email: emailResult,
      message: `Membership application marked as ${newStatus} successfully.${
        emailResult?.sent
          ? ' Decision email sent via Brevo.'
          : emailResult?.status === 'FAILED'
          ? ` (Email notification could not be sent: ${emailResult.error})`
          : ''
      }`,
    });
  } catch (error: any) {
    console.error('Update general application status error:', error);
    return NextResponse.json({ error: 'Failed to update application status.' }, { status: 500 });
  }
}

