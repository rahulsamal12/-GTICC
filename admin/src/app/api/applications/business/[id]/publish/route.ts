import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, logAuditEvent } from '@/lib/db';
import { getSessionAdmin } from '@/lib/auth';
import { syncBusinessApplicationToDirectory } from '@/lib/directorySync';

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
 * POST /api/applications/business/[id]/publish
 * Save & Publish to Directory:
 * 1. Checks that the application exists and is in status 'ACCEPTED'.
 * 2. Marks business_applications: is_published = 1, directory_visible = 1, published_at = NOW(3).
 * 3. Syncs full application details into the `members` directory table.
 * 4. Records audit log entry.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionAdmin(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized access. Only authenticated GTICC administrators may publish members.' },
      { status: 401, headers: corsHeaders(req) }
    );
  }

  try {
    const { id } = await params;

    // Fetch the business application
    const app = await queryOne<any>(
      `SELECT id, legal_entity_name, rep_full_name, status, is_published, directory_visible
       FROM business_applications
       WHERE id = ?`,
      [id]
    );

    if (!app) {
      return NextResponse.json(
        { error: 'Business membership application not found.' },
        { status: 404, headers: corsHeaders(req) }
      );
    }

    const currentStatus = (app.status || '').toUpperCase();
    if (currentStatus !== 'ACCEPTED') {
      return NextResponse.json(
        {
          error: `Cannot publish application with status '${app.status}'. Only ACCEPTED applications can be published to the Member Directory. Please review and accept the application first.`
        },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Persist published and visible status in MySQL
    await execute(
      `UPDATE business_applications
       SET is_published = 1, directory_visible = 1, published_at = COALESCE(published_at, NOW(3)), updated_at = NOW(3)
       WHERE id = ?`,
      [id]
    );

    // Sync all application fields directly into the members directory catalog
    const syncResult = await syncBusinessApplicationToDirectory(id);

    // Audit log
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    await logAuditEvent({
      adminId: session.id,
      adminEmail: session.email,
      action: 'SAVE_AND_PUBLISH_DIRECTORY',
      entityType: 'business_application',
      entityId: id,
      details: `Saved and published ${app.legal_entity_name} to the public Member Directory. Member ID: ${syncResult.memberId} (${syncResult.action}).`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        published: true,
        visible: true,
        memberId: syncResult.memberId,
        action: syncResult.action,
        message: `Successfully saved and published "${app.legal_entity_name}" to the public Member Directory.`,
      },
      { headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error('Save & publish error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while saving and publishing to the directory.' },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}
