import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { leadershipApplicationSchema } from '@/lib/validations';

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
        '(full_name LIKE ? OR official_email LIKE ? OR organization_firm LIKE ? OR current_designation LIKE ? OR id LIKE ?)'
      );
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
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
      `SELECT COUNT(*) as count FROM leadership_applications ${whereClause}`,
      params
    );
    const total = Number(countRow?.count || 0);

    const items = await query(
      `SELECT
        id,
        full_name                AS fullName,
        official_email           AS officialEmail,
        organization_firm        AS organizationFirm,
        current_designation      AS currentDesignation,
        country_code             AS countryCode,
        mobile_whatsapp          AS mobileWhatsApp,
        primary_industry_domain  AS primaryIndustryDomain,
        UPPER(status)            AS status,
        created_at               AS createdAt,
        reviewed_by              AS reviewedBy,
        reviewed_at              AS reviewedAt
      FROM leadership_applications
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
    console.error('Fetch leadership applications error:', error);
    return NextResponse.json({ error: 'Failed to retrieve responses.' }, { status: 500 });
  }
}

// POST: Public submission endpoint from LeadershipPositionOnboarding.jsx
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadershipApplicationSchema.safeParse(body);
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
      `SELECT id FROM leadership_applications
       WHERE official_email = ?
       AND created_at >= ?`,
      [data.officialEmail.toLowerCase().trim(), fiveMinutesAgo]
    );

    if (recent) {
      return NextResponse.json(
        {
          error:
            'An onboarding nomination for this official email was already submitted moments ago.',
        },
        { status: 409, headers: corsHeaders(req) }
      );
    }

    const id = crypto.randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await execute(
      `INSERT INTO leadership_applications (
        id, full_name, official_email, country_code, mobile_whatsapp,
        city_country, time_zone_gmt, current_designation, organization_firm, website,
        primary_industry_domain, other_industry_domain, strategic_engagement, geographic_markets,
        linkedin_url, executive_summary, candidate_name, attestation_date, digital_signature,
        attestation_official_email, attestation_check,
        profile_photo_url, profile_photo_name, professional_cert_url, professional_cert_name,
        status, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(3),NOW(3))`,
      [
        id,
        data.fullName.trim(),
        data.officialEmail.toLowerCase().trim(),
        data.countryCode.trim(),
        data.mobileWhatsApp.trim(),
        data.cityCountry.trim(),
        data.timeZoneGmt.trim(),
        data.currentDesignation.trim(),
        data.organizationFirm.trim(),
        data.website?.trim() || null,
        data.primaryIndustryDomain.trim(),
        data.otherIndustryDomain?.trim() || null,
        JSON.stringify(data.strategicEngagement),
        JSON.stringify(data.geographicMarkets),
        data.linkedInUrl?.trim() || null,
        data.executiveSummary.trim(),
        data.candidateName.trim(),
        data.attestationDate.trim(),
        data.digitalSignature.trim(),
        data.attestationOfficialEmail.toLowerCase().trim(),
        data.attestationCheck ? 1 : 0,
        data.profilePhotoUrl?.trim() || null,
        data.profilePhotoName?.trim() || null,
        data.professionalCertUrl?.trim() || null,
        data.professionalCertName?.trim() || null,
        'PENDING',
      ]
    );

    await logAuditEvent({
      adminEmail: 'public_system',
      action: 'SUBMIT_LEADERSHIP_APP',
      entityType: 'leadership_application',
      entityId: id,
      details: `Leadership nomination submitted for ${data.fullName.trim()} (${data.organizationFirm.trim()})`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: id,
        message: 'Your Leadership & Position Onboarding nomination has been securely recorded.',
      },
      { status: 201, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Leadership application submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected database error occurred while persisting your submission.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
