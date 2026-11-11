import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, withTransaction, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { reviewStatusSchema, businessApplicationSchema } from '@/lib/validations';
import { dispatchApplicationNotification, getApplicationNotifications } from '@/lib/notifications';

// CORS headers for public website communication
function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
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

// GET: Single Business Application full detail + review history (Admin or Applicant review)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = getSessionAdmin(req);

    const application = await queryOne<Record<string, unknown>>(
      `SELECT
        id,
        legal_entity_name        AS legalEntityName,
        corporate_website        AS corporateWebsite,
        rep_full_name            AS repFullName,
        corporate_title          AS corporateTitle,
        corporate_email          AS corporateEmail,
        country_code             AS countryCode,
        direct_phone             AS directPhone,
        hq_city_country          AS hqCityCountry,
        additional_locations     AS additionalLocations,
        primary_industry_sector  AS primaryIndustrySector,
        other_industry_sector    AS otherIndustrySector,
        primary_business_model   AS primaryBusinessModel,
        annual_turnover          AS annualTurnover,
        exim_status              AS eximStatus,
        target_markets           AS targetMarkets,
        trade_objectives         AS tradeObjectives,
        auth_officer_name        AS authOfficerName,
        auth_corporate_title     AS authCorporateTitle,
        auth_corporate_email     AS authCorporateEmail,
        auth_submission_date     AS authSubmissionDate,
        auth_signature_seal      AS authSignatureSeal,
        affirmation,
        terms_accepted           AS termsAccepted,
        privacy_acknowledged     AS privacyAcknowledged,
        terms_accepted_at        AS termsAcceptedAt,
        privacy_acknowledged_at  AS privacyAcknowledgedAt,
        legal_version            AS legalVersion,
        profile_photo_url        AS profilePhotoUrl,
        profile_photo_name       AS profilePhotoName,
        professional_cert_url    AS professionalCertUrl,
        professional_cert_name   AS professionalCertName,
        UPPER(status)            AS status,
        admin_notes              AS adminNotes,
        reviewed_by              AS reviewedBy,
        reviewed_at              AS reviewedAt,
        created_at               AS createdAt,
        updated_at               AS updatedAt
      FROM business_applications WHERE id = ?`,
      [id]
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404, headers: corsHeaders(req) });
    }

    // Parse JSON array fields
    if (typeof application.targetMarkets === 'string') {
      try { application.targetMarkets = JSON.parse(application.targetMarkets); } catch { /* keep as string */ }
    }
    if (typeof application.tradeObjectives === 'string') {
      try { application.tradeObjectives = JSON.parse(application.tradeObjectives); } catch { /* keep as string */ }
    }

    let reviews: any[] = [];
    let notifications: any[] = [];

    // Only attach admin reviews and notifications if authenticated as admin
    if (session) {
      reviews = await query(
        `SELECT
          id,
          application_type    AS applicationType,
          admin_id            AS adminId,
          admin_email         AS adminEmail,
          previous_status     AS previousStatus,
          new_status          AS newStatus,
          review_note         AS reviewNote,
          created_at          AS createdAt
        FROM application_reviews
        WHERE business_application_id = ?
        ORDER BY created_at DESC`,
        [id]
      );
      notifications = await getApplicationNotifications(id);
    }

    return NextResponse.json(
      { application: { ...application, reviews, notifications } },
      { headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Fetch business application detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve application details.' }, { status: 500, headers: corsHeaders(req) });
  }
}

// PATCH: Review action (Accept, Reject, Return to Pending) with review note and audit trail
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

    let previousStatus = '';
    let applicantFullName = '';
    let applicantCorporateEmail = '';
    let entityName = '';
    let isAlreadySameFinalDecision = false;
    const reviewId = crypto.randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // Execute status update, review record, and audit log in a single transaction with row locking
    await withTransaction(async (conn) => {
      // Row lock the application to prevent concurrent race conditions
      const [rows] = await conn.query<any[]>(
        'SELECT id, status, admin_notes, rep_full_name, corporate_email, legal_entity_name FROM business_applications WHERE id = ? FOR UPDATE',
        [id]
      );

      if (!rows || rows.length === 0) {
        throw { statusCode: 404, message: 'Application not found.' };
      }

      const existing = rows[0];
      previousStatus = (existing.status || '').toUpperCase();
      applicantFullName = existing.rep_full_name;
      applicantCorporateEmail = existing.corporate_email;
      entityName = existing.legal_entity_name;

      // 1. Prohibit reversing final decisions:
      // ACCEPTED -> REJECTED is forbidden
      if (previousStatus === 'ACCEPTED' && newStatus === 'REJECTED') {
        throw {
          statusCode: 409,
          message: 'This application has already been accepted. Final decisions cannot be changed.',
        };
      }

      // REJECTED -> ACCEPTED is forbidden
      if (previousStatus === 'REJECTED' && newStatus === 'ACCEPTED') {
        throw {
          statusCode: 409,
          message: 'This application has already been rejected. Final decisions cannot be changed.',
        };
      }

      // Reversal back to PENDING from any finalized state is strictly forbidden
      if ((previousStatus === 'ACCEPTED' || previousStatus === 'REJECTED') && newStatus === 'PENDING') {
        throw {
          statusCode: 409,
          message: `This application has already been ${previousStatus.toLowerCase()}. Final decisions cannot be returned to pending.`,
        };
      }

      // ACCEPTED -> ACCEPTED or REJECTED -> REJECTED: idempotent no-op (no new email or state mutation)
      if (previousStatus === newStatus && (newStatus === 'ACCEPTED' || newStatus === 'REJECTED')) {
        isAlreadySameFinalDecision = true;
        return;
      }

      // Valid transition from PENDING -> ACCEPTED or PENDING -> REJECTED
      await conn.query(
        `UPDATE business_applications
         SET status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = NOW(3), updated_at = NOW(3)
         WHERE id = ?`,
        [
          newStatus,
          note ? note.trim() : existing.admin_notes,
          session.email,
          id
        ]
      );

      await conn.query(
        `INSERT INTO application_reviews
           (id, application_type, business_application_id, admin_id, admin_email,
            previous_status, new_status, review_note, created_at)
         VALUES (?,?,?,?,?,?,?,?,NOW(3))`,
        [
          reviewId,
          'BUSINESS',
          id,
          session.id,
          session.email,
          previousStatus,
          newStatus,
          note ? note.trim() : null,
        ]
      );

      await logAuditEvent({
        adminId: session.id,
        adminEmail: session.email,
        action: 'UPDATE_APPLICATION_STATUS',
        entityType: 'business_application',
        entityId: id,
        details: `Business application status changed from ${previousStatus} to ${newStatus}.${note ? ` Note: ${note.trim()}` : ''}`,
        ipAddress: ip,
      }, conn);
    });

    if (isAlreadySameFinalDecision) {
      const currentApp = await queryOne(
        'SELECT *, UPPER(status) as status FROM business_applications WHERE id = ?',
        [id]
      );
      const notifications = await getApplicationNotifications(id);
      return NextResponse.json({
        success: true,
        application: { ...(currentApp as object), notifications },
        email: { sent: false, skipped: true, reason: `Application is already ${newStatus}.` },
        message: `This application is already ${newStatus}. No changes or duplicate emails were made.`,
      });
    }

    // Send Brevo notification if valid fresh decision transition
    let emailResult = null;
    if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
      emailResult = await dispatchApplicationNotification(
        {
          applicationId: id,
          applicationType: 'BUSINESS',
          decision: newStatus,
          recipientName: applicantFullName,
          recipientEmail: applicantCorporateEmail,
          organizationName: entityName,
          feedbackOrNote: note,
        },
        session.email
      );
    }

    const updatedApplication = await queryOne(
      'SELECT *, UPPER(status) as status FROM business_applications WHERE id = ?',
      [id]
    );

    const notifications = await getApplicationNotifications(id);

    return NextResponse.json({
      success: true,
      application: { ...(updatedApplication as object), notifications },
      review: { id: reviewId, previousStatus, newStatus },
      email: emailResult,
      message: `Application marked as ${newStatus} successfully.${
        emailResult?.sent
          ? ' Decision email sent via Brevo.'
          : emailResult?.status === 'FAILED'
          ? ` (Email notification could not be sent: ${emailResult.error})`
          : ''
      }`,
    });
  } catch (error: any) {
    if (error?.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Update business application status error:', error);
    return NextResponse.json({ error: 'Failed to update application status.' }, { status: 500 });
  }
}

// PUT: Applicant modifies their existing submission via Review & Modify
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await queryOne<{
      id: string;
      profile_photo_url: string | null;
      profile_photo_name: string | null;
      professional_cert_url: string | null;
      professional_cert_name: string | null;
      status: string;
    }>(
      `SELECT id, profile_photo_url, profile_photo_name, professional_cert_url, professional_cert_name, status
       FROM business_applications WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json(
        { error: 'Application record not found.' },
        { status: 404, headers: corsHeaders(req) }
      );
    }

    const parsed = businessApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed on updated submission data.',
          details: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    const data = parsed.data;

    // Preserve existing uploaded documents unless explicitly modified or cleared
    const profilePhotoUrl =
      data.profilePhotoUrl !== undefined ? data.profilePhotoUrl?.trim() || null : existing.profile_photo_url;
    const profilePhotoName =
      data.profilePhotoName !== undefined ? data.profilePhotoName?.trim() || null : existing.profile_photo_name;
    const professionalCertUrl =
      data.professionalCertUrl !== undefined ? data.professionalCertUrl?.trim() || null : existing.professional_cert_url;
    const professionalCertName =
      data.professionalCertName !== undefined ? data.professionalCertName?.trim() || null : existing.professional_cert_name;

    await withTransaction(async (conn) => {
      await conn.query(
        `UPDATE business_applications SET
          legal_entity_name = ?,
          corporate_website = ?,
          rep_full_name = ?,
          corporate_title = ?,
          corporate_email = ?,
          country_code = ?,
          direct_phone = ?,
          hq_city_country = ?,
          additional_locations = ?,
          primary_industry_sector = ?,
          other_industry_sector = ?,
          primary_business_model = ?,
          annual_turnover = ?,
          exim_status = ?,
          target_markets = ?,
          trade_objectives = ?,
          auth_officer_name = ?,
          auth_corporate_title = ?,
          auth_corporate_email = ?,
          auth_submission_date = ?,
          auth_signature_seal = ?,
          affirmation = ?,
          terms_accepted = ?,
          privacy_acknowledged = ?,
          profile_photo_url = ?,
          profile_photo_name = ?,
          professional_cert_url = ?,
          professional_cert_name = ?,
          updated_at = NOW(3)
        WHERE id = ?`,
        [
          data.legalEntityName.trim(),
          data.corporateWebsite.trim(),
          data.repFullName.trim(),
          data.corporateTitle.trim(),
          data.corporateEmail.toLowerCase().trim(),
          data.countryCode.trim(),
          data.directPhone.trim(),
          data.hqCityCountry.trim(),
          data.additionalLocations?.trim() || null,
          data.primaryIndustrySector.trim(),
          data.otherIndustrySector?.trim() || null,
          data.primaryBusinessModel.trim(),
          data.annualTurnover.trim(),
          data.eximStatus.trim(),
          JSON.stringify(data.targetMarkets),
          JSON.stringify(data.tradeObjectives),
          data.authOfficerName.trim(),
          data.authCorporateTitle.trim(),
          data.authCorporateEmail.toLowerCase().trim(),
          data.authSubmissionDate.trim(),
          data.authSignatureSeal.trim(),
          data.affirmation ? 1 : 0,
          data.termsAccepted ? 1 : 0,
          data.privacyAcknowledged ? 1 : 0,
          profilePhotoUrl,
          profilePhotoName,
          professionalCertUrl,
          professionalCertName,
          id,
        ]
      );
    });

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminEmail: 'public_system',
      action: 'UPDATE_BUSINESS_APP',
      entityType: 'business_application',
      entityId: id,
      details: `Business application updated via Review & Modify for ${data.legalEntityName.trim()} (${data.corporateEmail.toLowerCase().trim()})`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        message: 'Your business membership onboarding application has been successfully updated.',
      },
      { status: 200, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Update business application via Review & Modify error:', error);
    return NextResponse.json(
      { error: 'An unexpected database error occurred while updating your submission.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
