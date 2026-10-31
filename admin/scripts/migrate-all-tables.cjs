const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');

async function migrateAll(mySqlUrl) {
  const dbPath = path.join(__dirname, '../data/gticc_admin.db');
  if (!fs.existsSync(dbPath)) {
    console.error('Source SQLite database not found at:', dbPath);
    process.exit(1);
  }

  const sdb = new Database(dbPath, { readonly: true });
  console.log('Opened source SQLite database successfully in read-only mode.');

  console.log('Connecting to MySQL at:', mySqlUrl.replace(/:[^:@]+@/, ':****@'));
  const conn = await mysql.createConnection(mySqlUrl);
  console.log('Connected to MySQL successfully!');

  // Execute DDL within transaction / controlled execution
  const schemaSql = fs.readFileSync(path.join(__dirname, '../prisma/schema.sql'), 'utf8');
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    await conn.query(stmt);
  }

  // Ensure auxiliary tables matching SQLite schemas
  await conn.query(`
    CREATE TABLE IF NOT EXISTS general_applications (
      id VARCHAR(191) PRIMARY KEY,
      fullName VARCHAR(191) NOT NULL,
      orgName VARCHAR(191) NOT NULL,
      designation VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(191) NOT NULL,
      country VARCHAR(191) NOT NULL,
      city VARCHAR(191) NOT NULL,
      website VARCHAR(191) NULL,
      linkedin VARCHAR(191) NULL,
      plan VARCHAR(191) NOT NULL,
      sector VARCHAR(191) NOT NULL,
      orgType VARCHAR(191) NOT NULL,
      primaryInterest VARCHAR(191) NOT NULL,
      orgDescription TEXT NOT NULL,
      connectionsSeeking TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      adminNotes TEXT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      organization VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      country VARCHAR(191) NOT NULL,
      interestType VARCHAR(191) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'new',
      internalNotes TEXT NULL,
      assignedTo VARCHAR(191) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(191) PRIMARY KEY,
      orgName VARCHAR(191) NOT NULL,
      logo VARCHAR(255) NULL,
      memberName VARCHAR(191) NOT NULL,
      designation VARCHAR(191) NOT NULL,
      country VARCHAR(191) NOT NULL,
      city VARCHAR(191) NOT NULL,
      sector VARCHAR(191) NOT NULL,
      tier VARCHAR(191) NOT NULL,
      orgType VARCHAR(191) NOT NULL,
      services TEXT NULL,
      interests TEXT NULL,
      description TEXT NULL,
      website VARCHAR(255) NULL,
      linkedin VARCHAR(255) NULL,
      showPublicContact BOOLEAN NOT NULL DEFAULT true,
      isActive BOOLEAN NOT NULL DEFAULT true,
      verifiedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(191) PRIMARY KEY,
      adminId VARCHAR(191) NULL,
      adminEmail VARCHAR(191) NULL,
      action VARCHAR(191) NOT NULL,
      entityType VARCHAR(191) NOT NULL,
      entityId VARCHAR(191) NOT NULL,
      details JSON NULL,
      ipAddress VARCHAR(191) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('All MySQL target tables ensured.');

  // Begin transactional data migration
  await conn.beginTransaction();

  try {
    // 1. Admins
    const admins = sdb.prepare('SELECT * FROM admins').all();
    for (const a of admins) {
      const roleMap = { super_admin: 'SUPER_ADMIN', admin: 'ADMIN', reviewer: 'REVIEWER' };
      const mappedRole = roleMap[a.role] || 'ADMIN';
      await conn.query(`
        INSERT INTO admins (id, email, name, passwordHash, role, isActive, lastLoginAt, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), passwordHash=VALUES(passwordHash), role=VALUES(role), isActive=VALUES(isActive)
      `, [a.id, a.email, a.name, a.password_hash, mappedRole, a.is_active ? 1 : 0, a.last_login_at || null, a.created_at, a.updated_at]);
    }

    // 2. Business Applications
    const biz = sdb.prepare('SELECT * FROM business_applications').all();
    for (const b of biz) {
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

    // 3. Leadership Applications
    const lead = sdb.prepare('SELECT * FROM leadership_applications').all();
    for (const l of lead) {
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

    // 4. General Applications
    const gen = sdb.prepare('SELECT * FROM general_applications').all();
    for (const g of gen) {
      await conn.query(`
        INSERT INTO general_applications (
          id, fullName, orgName, designation, email, phone, country, city, website, linkedin,
          plan, sector, orgType, primaryInterest, orgDescription, connectionsSeeking, status, adminNotes, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status)
      `, [
        g.id, g.full_name, g.org_name, g.designation, g.email, g.phone, g.country, g.city, g.website, g.linkedin,
        g.plan, g.sector, g.org_type, g.primary_interest, g.org_description, g.connections_seeking, g.status, g.admin_notes, g.created_at, g.updated_at
      ]);
    }

    // 5. Contact Enquiries
    const enq = sdb.prepare('SELECT * FROM contact_enquiries').all();
    for (const e of enq) {
      await conn.query(`
        INSERT INTO contact_enquiries (
          id, name, organization, email, country, interestType, message, status, internalNotes, assignedTo, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status)
      `, [
        e.id, e.name, e.organization, e.email, e.country, e.interest_type, e.message, e.status, e.internal_notes, e.assigned_to, e.created_at, e.updated_at
      ]);
    }

    // 6. Members
    const mem = sdb.prepare('SELECT * FROM members').all();
    for (const m of mem) {
      await conn.query(`
        INSERT INTO members (
          id, orgName, logo, memberName, designation, country, city, sector, tier, orgType,
          services, interests, description, website, linkedin, showPublicContact, isActive, verifiedAt, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE orgName=VALUES(orgName)
      `, [
        m.id, m.org_name, m.logo, m.member_name, m.designation, m.country, m.city, m.sector, m.tier, m.org_type,
        m.services, m.interests, m.description, m.website, m.linkedin, m.show_public_contact ? 1 : 0, m.is_active ? 1 : 0, m.verified_at, m.created_at, m.updated_at
      ]);
    }

    // 7. Audit Logs
    const logs = sdb.prepare('SELECT * FROM audit_logs').all();
    for (const l of logs) {
      await conn.query(`
        INSERT INTO audit_logs (id, adminId, adminEmail, action, entityType, entityId, details, ipAddress, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE action=VALUES(action)
      `, [
        l.id, l.admin_id, l.admin_email, l.action, l.entity_type, l.entity_id,
        typeof l.details === 'string' ? l.details : JSON.stringify(l.details || {}),
        l.ip_address, l.created_at
      ]);
    }

    // 8. Application Reviews
    const reviews = sdb.prepare('SELECT * FROM application_reviews').all();
    for (const r of reviews) {
      await conn.query(`
        INSERT INTO application_reviews (id, applicationType, businessApplicationId, leadershipApplicationId, adminId, adminEmail, previousStatus, newStatus, reviewNote, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE reviewNote=VALUES(reviewNote)
      `, [
        r.id, r.application_type, r.business_application_id, r.leadership_application_id,
        r.admin_id, r.admin_email, r.previous_status, r.new_status, r.review_note, r.created_at
      ]);
    }

    await conn.commit();
    console.log('Transaction committed successfully.');

    // Count validation
    const counts = [
      { name: 'admins', src: admins.length },
      { name: 'business_applications', src: biz.length },
      { name: 'leadership_applications', src: lead.length },
      { name: 'general_applications', src: gen.length },
      { name: 'contact_enquiries', src: enq.length },
      { name: 'members', src: mem.length },
      { name: 'audit_logs', src: logs.length },
      { name: 'application_reviews', src: reviews.length }
    ];

    console.log('--- Record Count Parity Verification ---');
    let allMatched = true;
    for (const c of counts) {
      const [rows] = await conn.query(`SELECT count(*) as cnt FROM ${c.name}`);
      const dest = rows[0].cnt;
      const matched = c.src === dest;
      if (!matched) allMatched = false;
      console.log(`Table [${c.name}]: Source=${c.src} -> MySQL=${dest} | Match: ${matched ? 'OK' : 'MISMATCH'}`);
    }

    if (!allMatched) {
      throw new Error('Record count mismatch detected between SQLite and MySQL.');
    }
  } catch (err) {
    await conn.rollback();
    console.error('Migration transaction rolled back due to error:', err);
    throw err;
  } finally {
    sdb.close();
    await conn.end();
  }
}

if (require.main === module) {
  const url = process.env.DATABASE_URL || process.argv[2];
  if (!url) {
    console.log('Usage: node scripts/migrate-all-tables.cjs <DATABASE_URL>');
  } else {
    migrateAll(url).catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
  }
}

module.exports = { migrateAll };
