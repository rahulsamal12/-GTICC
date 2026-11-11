import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { syncBusinessApplicationToDirectory } from '@/lib/directorySync';

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, PATCH, PUT, OPTIONS',
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
 * PATCH: Toggle directory visibility (Show / Hide) for an approved member directory listing
 * Requires valid Admin session.
 */
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
    const visible = Boolean(body.visible);

    // Check if record exists either as member id or application id
    const member = await queryOne<any>(
      'SELECT id, application_id, org_name, directory_visible FROM members WHERE id = ? OR application_id = ?',
      [id, id]
    );

    if (!member) {
      // Check if it's an accepted application that hasn't been synced to members yet
      const app = await queryOne<any>(
        'SELECT id, legal_entity_name, status, directory_visible FROM business_applications WHERE id = ?',
        [id]
      );

      if (!app) {
        return NextResponse.json({ error: 'Member directory record or application not found.' }, { status: 404 });
      }

      if ((app.status || '').toUpperCase() !== 'ACCEPTED') {
        return NextResponse.json(
          { error: `Cannot toggle directory visibility for application with status '${app.status}'. Only ACCEPTED applications can be shown in the directory.` },
          { status: 400 }
        );
      }

      // Update business_applications directory_visible
      await execute('UPDATE business_applications SET directory_visible = ?, updated_at = NOW(3) WHERE id = ?', [visible ? 1 : 0, app.id]);
      await syncBusinessApplicationToDirectory(app.id);

      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
      await logAuditEvent({
        adminId: session.id,
        adminEmail: session.email,
        action: 'UPDATE_DIRECTORY_VISIBILITY',
        entityType: 'member_directory',
        entityId: app.id,
        details: `Directory visibility for ${app.legal_entity_name} set to ${visible ? 'VISIBLE' : 'HIDDEN'}`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        visible,
        message: `Member listing visibility set to ${visible ? 'Visible' : 'Hidden'} in public directory.`,
      });
    }

    // Update both members and business_applications if linked
    const directoryVisibleVal = visible ? 1 : 0;
    await execute('UPDATE members SET directory_visible = ?, updated_at = NOW(3) WHERE id = ?', [directoryVisibleVal, member.id]);

    if (member.application_id) {
      await execute('UPDATE business_applications SET directory_visible = ?, updated_at = NOW(3) WHERE id = ?', [directoryVisibleVal, member.application_id]);
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminId: session.id,
      adminEmail: session.email,
      action: 'UPDATE_DIRECTORY_VISIBILITY',
      entityType: 'member_directory',
      entityId: member.id,
      details: `Directory visibility for ${member.org_name} set to ${visible ? 'VISIBLE' : 'HIDDEN'}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      memberId: member.id,
      visible,
      message: `Member listing visibility set to ${visible ? 'Visible' : 'Hidden'} in public directory.`,
    });
  } catch (error: any) {
    console.error('Update directory visibility error:', error);
    return NextResponse.json(
      { error: 'Failed to update member directory visibility in database.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Edit Published Business Information
 * Admin can edit publicly displayed details (orgName, memberName, designation, sector, city, country, services, interests, description, website, etc.)
 */
export async function PUT(
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

    const member = await queryOne<any>(
      'SELECT id, application_id, org_name FROM members WHERE id = ? OR application_id = ?',
      [id, id]
    );

    if (!member) {
      return NextResponse.json({ error: 'Member listing not found.' }, { status: 404 });
    }

    const orgName = body.orgName !== undefined ? body.orgName.trim() : member.org_name;
    const memberName = body.memberName !== undefined ? body.memberName.trim() : member.member_name;
    const designation = body.designation !== undefined ? body.designation.trim() : member.designation;
    const country = body.country !== undefined ? body.country.trim() : member.country;
    const city = body.city !== undefined ? body.city.trim() : member.city;
    const sector = body.sector !== undefined ? body.sector.trim() : member.sector;
    const tier = body.tier !== undefined ? body.tier.trim() : member.tier;
    const orgType = body.orgType !== undefined ? body.orgType.trim() : member.org_type;
    const services = body.services !== undefined ? body.services.trim() : member.services;
    const interests = body.interests !== undefined ? body.interests.trim() : member.interests;
    const description = body.description !== undefined ? body.description.trim() : member.description;
    const website = body.website !== undefined ? body.website.trim() : (member.website || null);
    const linkedin = body.linkedin !== undefined ? body.linkedin.trim() : (member.linkedin || null);
    const logo = body.logo !== undefined ? body.logo.trim() : (member.logo || '/gticc_logo_new.webp');

    await execute(
      `UPDATE members SET
        org_name = ?,
        member_name = ?,
        designation = ?,
        country = ?,
        city = ?,
        sector = ?,
        tier = ?,
        org_type = ?,
        services = ?,
        interests = ?,
        description = ?,
        website = ?,
        linkedin = ?,
        logo = ?,
        updated_at = NOW(3)
      WHERE id = ?`,
      [
        orgName || 'Enterprise Member',
        memberName || 'Representative',
        designation || 'Director',
        country || 'Global',
        city || 'Global',
        sector || 'Trade & Investment',
        tier || 'Corporate Member',
        orgType || 'Enterprise Corporation',
        services || '',
        interests || '',
        description || '',
        website || null,
        linkedin || null,
        logo || '/gticc_logo_new.webp',
        member.id,
      ]
    );

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminId: session.id,
      adminEmail: session.email,
      action: 'EDIT_PUBLISHED_MEMBER',
      entityType: 'member_directory',
      entityId: member.id,
      details: `Published directory information updated for ${orgName}`,
      ipAddress: ip,
    });

    const updated = await queryOne('SELECT * FROM members WHERE id = ?', [member.id]);

    return NextResponse.json({
      success: true,
      member: updated,
      message: 'Published member information updated successfully.',
    });
  } catch (error: any) {
    console.error('Update published member error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update published business information.' }, { status: 500 });
  }
}
