import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';

// CORS headers
function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

/**
 * GET: Admin Member Directory Management
 * Returns all approved / published members with linked onboarding application data,
 * status, visibility, and contact information.
 */
export async function GET(req: NextRequest) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const visibility = searchParams.get('visibility')?.trim() || '';
    const sector = searchParams.get('sector')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push(
        '(m.org_name LIKE ? OR m.member_name LIKE ? OR m.sector LIKE ? OR m.country LIKE ? OR m.city LIKE ? OR ba.corporate_email LIKE ?)'
      );
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s);
    }

    if (visibility === 'visible') {
      conditions.push('m.directory_visible = 1 AND m.is_active = 1');
    } else if (visibility === 'hidden') {
      conditions.push('(m.directory_visible = 0 OR m.is_active = 0)');
    }

    if (sector && sector !== 'All') {
      conditions.push('m.sector = ?');
      params.push(sector);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await queryOne<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM members m
       LEFT JOIN business_applications ba ON m.application_id = ba.id
       ${whereClause}`,
      params
    );
    const total = Number(countRow?.count || 0);

    const items = await query(
      `SELECT
        m.id,
        m.application_id        AS applicationId,
        m.org_name              AS orgName,
        m.logo,
        m.member_name           AS memberName,
        m.designation,
        m.country,
        m.city,
        m.sector,
        m.tier,
        m.org_type              AS orgType,
        m.services,
        m.interests,
        m.description,
        m.website,
        m.linkedin,
        m.show_public_contact   AS showPublicContact,
        m.is_active             AS isActive,
        m.directory_visible     AS directoryVisible,
        m.created_at            AS createdAt,
        m.updated_at            AS updatedAt,
        ba.corporate_email      AS corporateEmail,
        ba.direct_phone         AS directPhone,
        UPPER(COALESCE(ba.status, 'ACCEPTED')) AS applicationStatus,
        ba.created_at           AS submissionDate
      FROM members m
      LEFT JOIN business_applications ba ON m.application_id = ba.id
      ${whereClause}
      ORDER BY m.updated_at DESC, m.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, skip]
    );

    return NextResponse.json({
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    }, { headers: corsHeaders(req) });
  } catch (error: any) {
    console.error('Admin member directory fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve directory records.' }, { status: 500 });
  }
}
