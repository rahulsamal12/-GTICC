import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

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

// GET: Public active members directory
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get('sector')?.trim() || '';
    const tier = searchParams.get('tier')?.trim() || '';
    const orgType = searchParams.get('orgType')?.trim() || '';

    const conditions: string[] = ['is_active = 1'];
    const params: string[] = [];

    if (sector && sector !== 'All') {
      conditions.push('sector = ?');
      params.push(sector);
    }
    if (tier && tier !== 'All') {
      conditions.push('tier = ?');
      params.push(tier);
    }
    if (orgType && orgType !== 'All') {
      conditions.push('org_type = ?');
      params.push(orgType);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const members = await query(
      `SELECT
        id,
        org_name        AS org_name,
        logo,
        member_name     AS member_name,
        designation,
        country,
        city,
        sector,
        tier,
        org_type        AS org_type,
        services,
        interests,
        description,
        website,
        linkedin,
        show_public_contact,
        verified_at,
        created_at
      FROM members
      ${whereClause}
      ORDER BY org_name ASC`,
      params
    );

    return NextResponse.json({ members }, { headers: corsHeaders(req) });
  } catch (error: any) {
    console.error('Fetch members directory error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve members directory from MySQL.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
