import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { businessApplicationSchema } from '@/lib/validations';

// CORS headers for public website communication
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

// GET: Admin responses listing with search, status filters, and pagination
export async function GET(req: NextRequest) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.toUpperCase() || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push(
        '(legal_entity_name LIKE ? OR corporate_email LIKE ? OR rep_full_name LIKE ? OR id LIKE ?)'
      );
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      conditions.push('UPPER(status) = ?');
      params.push(status);
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

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countRow = await queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM business_applications ${whereClause}`,
      params
    );
    const total = Number(countRow?.count || 0);

    const items = await query(
      `SELECT
        id,
        legal_entity_name     AS legalEntityName,
        corporate_email       AS corporateEmail,
        rep_full_name         AS repFullName,
        corporate_title       AS corporateTitle,
        country_code          AS countryCode,
        direct_phone          AS directPhone,
        primary_industry_sector AS primaryIndustrySector,
        UPPER(status)         AS status,
        created_at            AS createdAt,
        reviewed_by           AS reviewedBy,
        reviewed_at           AS reviewedAt
      FROM business_applications
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
    console.error('Fetch business applications error:', error);
    return NextResponse.json({ error: 'Failed to retrieve responses.' }, { status: 500 });
  }
}

// POST: Public submission endpoint from BusinessMembershipOnboarding.jsx
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = businessApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed on submission data.',
          details: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    const data = parsed.data;

    // Check duplicate recent submission within 5 minutes (300000 ms)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recent = await queryOne<{ id: string }>(
      `SELECT id FROM business_applications
       WHERE corporate_email = ? AND legal_entity_name = ?
       AND created_at >= ?`,
      [
        data.corporateEmail.toLowerCase().trim(),
        data.legalEntityName.trim(),
        fiveMinutesAgo
      ]
    );

    if (recent) {
      return NextResponse.json(
        {
          error:
            'A business onboarding application for this organization and corporate email was already submitted within the last 5 minutes. To prevent duplicate submissions, please allow 5 minutes between submissions or contact gticcofficial@gmail.com for revisions.',
        },
        { status: 409, headers: corsHeaders(req) }
      );
    }

    const id = crypto.randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await execute(
      `INSERT INTO business_applications (
        id, legal_entity_name, corporate_website, rep_full_name, corporate_title,
        corporate_email, country_code, direct_phone, hq_city_country, additional_locations,
        primary_industry_sector, other_industry_sector, primary_business_model, annual_turnover,
        exim_status, target_markets, trade_objectives, auth_officer_name, auth_corporate_title,
        auth_corporate_email, auth_submission_date, auth_signature_seal, affirmation,
        profile_photo_url, profile_photo_name, professional_cert_url, professional_cert_name,
        status, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(3),NOW(3))`,
      [
        id,
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
        data.profilePhotoUrl?.trim() || null,
        data.profilePhotoName?.trim() || null,
        data.professionalCertUrl?.trim() || null,
        data.professionalCertName?.trim() || null,
        'PENDING',
      ]
    );

    await logAuditEvent({
      adminEmail: 'public_system',
      action: 'SUBMIT_BUSINESS_APP',
      entityType: 'business_application',
      entityId: id,
      details: `Business application submitted for ${data.legalEntityName.trim()} (${data.corporateEmail.toLowerCase().trim()})`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        message: 'Your Business Membership Onboarding application has been securely recorded.',
      },
      { status: 201, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Business application submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected database error occurred while persisting your submission.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
