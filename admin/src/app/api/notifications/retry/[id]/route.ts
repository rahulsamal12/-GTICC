import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { dispatchApplicationNotification, getApplicationNotifications } from '@/lib/notifications';

// POST: Retry sending a decision email for an application
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
    const body = await req.json();
    const type = (body.type || 'business').toLowerCase();

    let application: any = null;
    let applicationType: 'BUSINESS' | 'LEADERSHIP' | 'GENERAL' = 'BUSINESS';
    let recipientName = '';
    let recipientEmail = '';
    let organizationName = '';
    let decision: 'ACCEPTED' | 'REJECTED' | null = null;
    let note: string | null = null;

    if (type === 'business') {
      applicationType = 'BUSINESS';
      application = await queryOne<any>(
        'SELECT id, rep_full_name, corporate_email, legal_entity_name, UPPER(status) as status, admin_notes FROM business_applications WHERE id = ?',
        [id]
      );
      if (application) {
        recipientName = application.rep_full_name;
        recipientEmail = application.corporate_email;
        organizationName = application.legal_entity_name;
        note = application.admin_notes;
        if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
          decision = application.status;
        }
      }
    } else if (type === 'leadership') {
      applicationType = 'LEADERSHIP';
      application = await queryOne<any>(
        'SELECT id, full_name, official_email, organization_firm, UPPER(status) as status, admin_notes FROM leadership_applications WHERE id = ?',
        [id]
      );
      if (application) {
        recipientName = application.full_name;
        recipientEmail = application.official_email;
        organizationName = application.organization_firm;
        note = application.admin_notes;
        if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
          decision = application.status;
        }
      }
    } else if (type === 'general') {
      applicationType = 'GENERAL';
      application = await queryOne<any>(
        'SELECT id, full_name, email, org_name, UPPER(status) as status, admin_notes FROM general_applications WHERE id = ?',
        [id]
      );
      if (application) {
        recipientName = application.full_name;
        recipientEmail = application.email;
        organizationName = application.org_name;
        note = application.admin_notes;
        if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
          decision = application.status;
        }
      }
    }

    if (!application) {
      return NextResponse.json({ error: 'Application record not found.' }, { status: 404 });
    }

    if (!decision) {
      return NextResponse.json(
        { error: `Cannot send email for application with status '${application.status}'. Decision must be ACCEPTED or REJECTED.` },
        { status: 400 }
      );
    }

    const emailResult = await dispatchApplicationNotification(
      {
        applicationId: id,
        applicationType,
        decision,
        recipientName,
        recipientEmail,
        organizationName,
        feedbackOrNote: note,
      },
      session.email,
      { forceRetry: true }
    );

    const notifications = await getApplicationNotifications(id);

    return NextResponse.json({
      success: emailResult.sent,
      email: emailResult,
      notifications,
      message: emailResult.sent
        ? `Decision email successfully sent via Brevo.`
        : `Email delivery attempt failed: ${emailResult.error}`,
    });
  } catch (err: any) {
    console.error('Retry notification error:', err);
    return NextResponse.json({ error: 'Failed to process email retry request.' }, { status: 500 });
  }
}

