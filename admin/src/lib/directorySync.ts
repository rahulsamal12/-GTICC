import crypto from 'crypto';
import type { PoolConnection } from 'mysql2/promise';
import { execute, queryOne } from './db';

/**
 * Parses "City, Country" or returns defaults.
 */
export function parseHqLocation(hq?: string | null): { city: string; country: string } {
  if (!hq) return { city: 'Global', country: 'Global' };
  const parts = hq.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    const city = parts[0] || 'Global';
    const country = parts.slice(1).join(', ') || 'Global';
    return { city, country };
  }
  return { city: hq, country: hq };
}

/**
 * Formats JSON array or comma string into a clean human readable string
 */
export function formatArrayOrString(val: any): string {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.filter(Boolean).join(', ');
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).join(', ');
    } catch {
      // return as-is
    }
    return val;
  }
  return '';
}

/**
 * Synchronizes an accepted Business Application to the public `members` directory table.
 * If status is ACCEPTED, creates or updates the linked member directory record.
 * If status is REJECTED or anything else, deactivates / deletes from the public directory.
 */
export async function syncBusinessApplicationToDirectory(
  applicationId: string,
  conn?: PoolConnection
): Promise<{ memberId: string | null; action: 'created' | 'updated' | 'removed' | 'skipped' }> {
  const runner = conn || {
    query: async (sql: string, params: any[]) => execute(sql, params),
  };

  // Fetch full application data
  let app: any = null;
  if (conn) {
    const [rows] = await conn.query<any[]>(
      'SELECT * FROM business_applications WHERE id = ?',
      [applicationId]
    );
    app = rows && rows[0];
  } else {
    app = await queryOne<any>(
      'SELECT * FROM business_applications WHERE id = ?',
      [applicationId]
    );
  }

  if (!app) {
    return { memberId: null, action: 'skipped' };
  }

  const isAccepted = (app.status || '').toUpperCase() === 'ACCEPTED';
  const isVisible = app.directory_visible === 1 || app.directory_visible === true;

  // Check if member directory row already exists for this application
  let existingMember: any = null;
  if (conn) {
    const [mRows] = await conn.query<any[]>(
      'SELECT id, application_id FROM members WHERE application_id = ?',
      [applicationId]
    );
    existingMember = mRows && mRows[0];
  } else {
    existingMember = await queryOne<any>(
      'SELECT id, application_id FROM members WHERE application_id = ?',
      [applicationId]
    );
  }

  if (!isAccepted) {
    // If application is no longer accepted, ensure it is removed / deactivated from directory
    if (existingMember) {
      if (conn) {
        await conn.query('UPDATE members SET is_active = 0, directory_visible = 0, updated_at = NOW(3) WHERE id = ?', [existingMember.id]);
      } else {
        await execute('UPDATE members SET is_active = 0, directory_visible = 0, updated_at = NOW(3) WHERE id = ?', [existingMember.id]);
      }
      return { memberId: existingMember.id, action: 'removed' };
    }
    return { memberId: null, action: 'skipped' };
  }

  // Application IS ACCEPTED -> map fields
  const { city, country } = parseHqLocation(app.hq_city_country);
  const orgName = (app.legal_entity_name || 'Enterprise Member').trim();
  const memberName = (app.rep_full_name || app.auth_officer_name || 'Executive Representative').trim();
  const designation = (app.corporate_title || app.auth_corporate_title || 'Corporate Director').trim();
  const sector = (app.primary_industry_sector || 'Trade & Investment').trim();
  const tier = (app.annual_turnover || 'Corporate Member').trim();
  const orgType = (app.primary_business_model || 'Enterprise Corporation').trim();
  const services = formatArrayOrString(app.trade_objectives) || 'International Trade & Cross-Border Commerce';
  const interests = formatArrayOrString(app.target_markets) || 'Global Strategic Alliances';
  const description = `${orgName} operates in ${sector}, with primary engagement in ${orgType}. Registered headquarters located in ${app.hq_city_country || `${city}, ${country}`}.`;
  const website = app.corporate_website?.trim() || null;
  const logo = app.profile_photo_url || '/gticc_logo_new.webp';
  const directoryVisibleVal = isVisible ? 1 : 0;

  if (existingMember) {
    // Update existing member record
    const updateSql = `
      UPDATE members SET
        org_name = ?,
        logo = ?,
        member_name = ?,
        designation = ?,
        country = ?,
        city = ?,
        sector = ?,
        tier = ?,
        annual_turnover = ?,
        org_type = ?,
        exim_status = ?,
        services = ?,
        interests = ?,
        description = ?,
        website = ?,
        is_active = 1,
        directory_visible = ?,
        updated_at = NOW(3)
      WHERE id = ?
    `;
    const params = [
      orgName,
      logo,
      memberName,
      designation,
      country,
      city,
      sector,
      tier,
      app.annual_turnover || null,
      orgType,
      app.exim_status || null,
      services,
      interests,
      description,
      website,
      directoryVisibleVal,
      existingMember.id,
    ];

    if (conn) {
      await conn.query(updateSql, params);
    } else {
      await execute(updateSql, params);
    }

    return { memberId: existingMember.id, action: 'updated' };
  } else {
    // Create new member directory record
    const newMemberId = crypto.randomUUID();
    const insertSql = `
      INSERT INTO members (
        id, application_id, org_name, logo, member_name, designation,
        country, city, sector, tier, annual_turnover, org_type, exim_status,
        services, interests, description, website, linkedin,
        show_public_contact, is_active, directory_visible,
        verified_at, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,NOW(3),NOW(3),NOW(3))
    `;
    const params = [
      newMemberId,
      applicationId,
      orgName,
      logo,
      memberName,
      designation,
      country,
      city,
      sector,
      tier,
      app.annual_turnover || null,
      orgType,
      app.exim_status || null,
      services,
      interests,
      description,
      website,
      null, // linkedin
      1,    // show_public_contact
      directoryVisibleVal,
    ];

    if (conn) {
      await conn.query(insertSql, params);
    } else {
      await execute(insertSql, params);
    }

    return { memberId: newMemberId, action: 'created' };
  }
}

