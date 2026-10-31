const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function migrate(mySqlUrl) {
  const jsonPath = path.join(__dirname, '../backups/sqlite_export.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Backup JSON not found at:', jsonPath);
    process.exit(1);
  }

  const dump = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded backup from ${dump.exportedAt}: ${dump.admins.length} admins, ${dump.businessApplications.length} business, ${dump.leadershipApplications.length} leadership`);

  console.log('Connecting to MySQL at:', mySqlUrl.replace(/:[^:@]+@/, ':****@'));
  const conn = await mysql.createConnection(mySqlUrl);
  console.log('Connected to MySQL successfully!');

  // Ensure DDL statements run
  const schemaSql = fs.readFileSync(path.join(__dirname, '../prisma/schema.sql'), 'utf8');
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    await conn.query(stmt);
  }
  console.log('Schema DDL verified in MySQL.');

  // Migrate Admins
  for (const a of dump.admins) {
    const roleMap = {
      super_admin: 'SUPER_ADMIN',
      admin: 'ADMIN',
      reviewer: 'REVIEWER'
    };
    const mappedRole = roleMap[a.role] || 'ADMIN';
    await conn.query(`
      INSERT INTO admins (id, email, name, passwordHash, role, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), passwordHash=VALUES(passwordHash), role=VALUES(role), isActive=VALUES(isActive)
    `, [a.id, a.email, a.name, a.password_hash, mappedRole, a.is_active ? 1 : 0, a.created_at, a.updated_at]);
  }
  console.log(`Migrated ${dump.admins.length} admins.`);

  // Migrate Business Applications
  for (const b of dump.businessApplications) {
    let status = 'PENDING';
    if (b.status === 'accepted') status = 'ACCEPTED';
    else if (b.status === 'rejected') status = 'REJECTED';

    await conn.query(`
      INSERT INTO business_applications (
        id, legalEntityName, corporateWebsite, repFullName, corporateTitle, corporateEmail,
        countryCode, directPhone, hqCityCountry, additionalLocations, primaryIndustrySector,
        otherIndustrySector, primaryBusinessModel, annualTurnover, eximStatus, targetMarkets,
        tradeObjectives, authOfficerName, authCorporateTitle, authCorporateEmail, authSubmissionDate,
        authSignatureSeal, affirmation, status, adminNotes, reviewedBy, reviewedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status=VALUES(status), adminNotes=VALUES(adminNotes)
    `, [
      b.id, b.legal_entity_name, b.corporate_website, b.rep_full_name, b.corporate_title, b.corporate_email,
      b.country_code, b.direct_phone, b.hq_city_country, b.additional_locations, b.primary_industry_sector,
      b.other_industry_sector, b.primary_business_model, b.annual_turnover, b.exim_status,
      typeof b.target_markets === 'string' ? b.target_markets : JSON.stringify(b.target_markets),
      typeof b.trade_objectives === 'string' ? b.trade_objectives : JSON.stringify(b.trade_objectives),
      b.auth_officer_name, b.auth_corporate_title, b.auth_corporate_email, b.auth_submission_date,
      b.auth_signature_seal, b.affirmation ? 1 : 0, status, b.admin_notes, b.reviewed_by, b.reviewed_at,
      b.created_at, b.updated_at
    ]);
  }
  console.log(`Migrated ${dump.businessApplications.length} business applications.`);

  // Migrate Leadership Applications
  for (const l of dump.leadershipApplications) {
    let status = 'PENDING';
    if (l.status === 'accepted') status = 'ACCEPTED';
    else if (l.status === 'rejected') status = 'REJECTED';

    await conn.query(`
      INSERT INTO leadership_applications (
        id, fullName, officialEmail, countryCode, mobileWhatsApp, cityCountry, timeZoneGmt,
        currentDesignation, organizationFirm, website, primaryIndustryDomain, otherIndustryDomain,
        strategicEngagement, geographicMarkets, linkedInUrl, executiveSummary, candidateName,
        attestationDate, digitalSignature, attestationOfficialEmail, attestationCheck, status,
        adminNotes, reviewedBy, reviewedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status=VALUES(status), adminNotes=VALUES(adminNotes)
    `, [
      l.id, l.full_name, l.official_email, l.country_code, l.mobile_whatsapp, l.city_country, l.time_zone_gmt,
      l.current_designation, l.organization_firm, l.website, l.primary_industry_domain, l.other_industry_domain,
      typeof l.strategic_engagement === 'string' ? l.strategic_engagement : JSON.stringify(l.strategic_engagement),
      typeof l.geographic_markets === 'string' ? l.geographic_markets : JSON.stringify(l.geographic_markets),
      l.linkedin_url, l.executive_summary, l.candidate_name, l.attestation_date, l.digital_signature,
      l.attestation_official_email, l.attestation_check ? 1 : 0, status, l.admin_notes, l.reviewed_by, l.reviewed_at,
      l.created_at, l.updated_at
    ]);
  }
  console.log(`Migrated ${dump.leadershipApplications.length} leadership applications.`);

  await conn.end();
  console.log('Migration to MySQL completed successfully!');
}

if (require.main === module) {
  const url = process.env.DATABASE_URL || process.argv[2];
  if (!url) {
    console.log('Usage: node scripts/migrate-sqlite-to-mysql.cjs <DATABASE_URL>');
  } else {
    migrate(url).catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
  }
}

module.exports = { migrate };
