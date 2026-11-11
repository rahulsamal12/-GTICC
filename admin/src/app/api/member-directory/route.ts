import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
 * GET: Public Member Directory
 * Returns ONLY businesses that are:
 * 1. is_active = 1
 * 2. directory_visible = 1
 * Joined with business_applications status = 'ACCEPTED'
 * NEVER exposes sensitive/confidential onboarding information (e.g., passwords, personal phone, uploaded passport/docs).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get('sector')?.trim() || '';
    const tier = searchParams.get('tier')?.trim() || '';
    const orgType = searchParams.get('orgType')?.trim() || '';
    const country = searchParams.get('country')?.trim() || '';
    const city = searchParams.get('city')?.trim() || '';

    const conditions: string[] = [
      'm.is_active = 1',
      'm.directory_visible = 1',
      '(ba.status IS NULL OR UPPER(ba.status) = "ACCEPTED")',
      '(ba.directory_visible IS NULL OR ba.directory_visible = 1)',
    ];
    const params: string[] = [];

    if (sector && sector !== 'All') {
      conditions.push('m.sector = ?');
      params.push(sector);
    }
    if (tier && tier !== 'All') {
      conditions.push('m.tier = ?');
      params.push(tier);
    }
    if (orgType && orgType !== 'All') {
      conditions.push('m.org_type = ?');
      params.push(orgType);
    }
    if (country && country !== 'All') {
      conditions.push('m.country = ?');
      params.push(country);
    }
    if (city && city !== 'All') {
      conditions.push('m.city = ?');
      params.push(city);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const members = await query(
      `SELECT
        m.id,
        m.application_id        AS applicationId,
        m.org_name              AS org_name,
        COALESCE(m.logo, '/gticc_logo_new.webp') AS logo,
        m.member_name           AS member_name,
        m.designation,
        m.country,
        m.city,
        m.sector,
        m.tier,
        m.annual_turnover       AS annualTurnover,
        m.org_type              AS org_type,
        m.exim_status           AS eximStatus,
        m.services,
        m.interests,
        m.description,
        m.website,
        m.linkedin,
        m.show_public_contact,
        m.verified_at,
        m.created_at
      FROM members m
      LEFT JOIN business_applications ba ON m.application_id = ba.id
      ${whereClause}
      ORDER BY m.org_name ASC`,
      params
    );

    return NextResponse.json({ members }, { headers: corsHeaders(req) });
  } catch (error: any) {
    console.error('Fetch member directory error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve member directory from database.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
