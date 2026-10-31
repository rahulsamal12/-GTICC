const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');

async function migrate() {
  const sqlitePath = 'D:/GTICC1/admin/backups/gticc_admin_backup_pre_mysql.db';
  if (!fs.existsSync(sqlitePath)) {
    throw new Error('SQLite backup not found at: ' + sqlitePath);
  }

  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  if (!match) throw new Error('DATABASE_URL not found in .env');
  const mysqlUrl = match[1];

  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection(mysqlUrl);
  console.log('Connected to MySQL successfully!');

  const sdb = new Database(sqlitePath, { readonly: true });
  console.log('Opened SQLite backup in read-only mode.');

  // Clean tables if empty before creating fresh schema
  console.log('Ensuring clean MySQL schema for all 8 tables...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');
  await conn.query('DROP TABLE IF EXISTS application_reviews;');
  await conn.query('DROP TABLE IF EXISTS audit_logs;');
  await conn.query('DROP TABLE IF EXISTS members;');
  await conn.query('DROP TABLE IF EXISTS contact_enquiries;');
  await conn.query('DROP TABLE IF EXISTS general_applications;');
  await conn.query('DROP TABLE IF EXISTS leadership_applications;');
  await conn.query('DROP TABLE IF EXISTS business_applications;');
  await conn.query('DROP TABLE IF EXISTS admins;');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191) UNIQUE NOT NULL,
      password_hash VARCHAR(191) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'reviewer',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      last_login_at VARCHAR(191) NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS business_applications (
      id VARCHAR(191) PRIMARY KEY,
      legal_entity_name VARCHAR(191) NOT NULL,
      corporate_website VARCHAR(191) NULL,
      rep_full_name VARCHAR(191) NOT NULL,
      corporate_title VARCHAR(191) NOT NULL,
      corporate_email VARCHAR(191) NOT NULL,
      country_code VARCHAR(50) NOT NULL,
      direct_phone VARCHAR(100) NOT NULL,
      hq_city_country VARCHAR(191) NOT NULL,
      additional_locations TEXT NULL,
      primary_industry_sector VARCHAR(191) NOT NULL,
      other_industry_sector VARCHAR(191) NULL,
      primary_business_model VARCHAR(191) NOT NULL,
      annual_turnover VARCHAR(191) NOT NULL,
      exim_status VARCHAR(191) NOT NULL,
      target_markets JSON NOT NULL,
      trade_objectives JSON NOT NULL,
      auth_officer_name VARCHAR(191) NOT NULL,
      auth_corporate_title VARCHAR(191) NOT NULL,
      auth_corporate_email VARCHAR(191) NOT NULL,
      auth_submission_date VARCHAR(191) NOT NULL,
      auth_signature_seal VARCHAR(191) NOT NULL,
      affirmation TINYINT(1) NOT NULL DEFAULT 1,
      status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
      admin_notes TEXT NULL,
      reviewed_by VARCHAR(191) NULL,
      reviewed_at VARCHAR(191) NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL,
      INDEX idx_biz_status (status),
      INDEX idx_biz_email (corporate_email),
      INDEX idx_biz_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS leadership_applications (
      id VARCHAR(191) PRIMARY KEY,
      full_name VARCHAR(191) NOT NULL,
      official_email VARCHAR(191) NOT NULL,
      country_code VARCHAR(50) NOT NULL,
      mobile_whatsapp VARCHAR(100) NOT NULL,
      city_country VARCHAR(191) NOT NULL,
      time_zone_gmt VARCHAR(100) NOT NULL,
      current_designation VARCHAR(191) NOT NULL,
      organization_firm VARCHAR(191) NOT NULL,
      website VARCHAR(191) NULL,
      primary_industry_domain VARCHAR(191) NOT NULL,
      other_industry_domain VARCHAR(191) NULL,
      strategic_engagement JSON NOT NULL,
      geographic_markets JSON NOT NULL,
      linkedin_url VARCHAR(255) NULL,
      executive_summary TEXT NULL,
      candidate_name VARCHAR(191) NOT NULL,
      attestation_date VARCHAR(191) NOT NULL,
      digital_signature VARCHAR(191) NOT NULL,
      attestation_official_email VARCHAR(191) NOT NULL,
      attestation_check TINYINT(1) NOT NULL DEFAULT 1,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      admin_notes TEXT NULL,
      reviewed_by VARCHAR(191) NULL,
      reviewed_at VARCHAR(191) NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL,
      INDEX idx_lead_status (status),
      INDEX idx_lead_email (official_email),
      INDEX idx_lead_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS general_applications (
      id VARCHAR(191) PRIMARY KEY,
      full_name VARCHAR(191) NOT NULL,
      org_name VARCHAR(191) NOT NULL,
      designation VARCHAR(191) NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(100) NULL,
      country VARCHAR(191) NULL,
      city VARCHAR(191) NULL,
      website VARCHAR(255) NULL,
      linkedin VARCHAR(255) NULL,
      plan VARCHAR(191) NOT NULL,
      sector VARCHAR(191) NULL,
      org_type VARCHAR(191) NULL,
      primary_interest VARCHAR(191) NULL,
      org_description TEXT NULL,
      connections_seeking TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      admin_notes TEXT NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL,
      INDEX idx_gen_status (status),
      INDEX idx_gen_email (email),
      INDEX idx_gen_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      organization VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      country VARCHAR(191) NULL,
      interest_type VARCHAR(191) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'new',
      internal_notes TEXT NULL,
      assigned_to VARCHAR(191) NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL,
      INDEX idx_enq_status (status),
      INDEX idx_enq_email (email),
      INDEX idx_enq_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(191) PRIMARY KEY,
      org_name VARCHAR(191) NOT NULL,
      logo VARCHAR(255) NULL,
      member_name VARCHAR(191) NOT NULL,
      designation VARCHAR(191) NOT NULL,
      country VARCHAR(191) NOT NULL,
      city VARCHAR(191) NOT NULL,
      sector VARCHAR(191) NOT NULL,
      tier VARCHAR(191) NOT NULL,
      org_type VARCHAR(191) NOT NULL,
      services TEXT NULL,
      interests TEXT NULL,
      description TEXT NULL,
      website VARCHAR(255) NULL,
      linkedin VARCHAR(255) NULL,
      show_public_contact TINYINT(1) NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      verified_at VARCHAR(191) NOT NULL,
      created_at VARCHAR(191) NOT NULL,
      updated_at VARCHAR(191) NOT NULL,
      INDEX idx_mem_active (is_active),
      INDEX idx_mem_tier (tier)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(191) PRIMARY KEY,
      admin_id VARCHAR(191) NULL,
      admin_email VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL,
      entity_type VARCHAR(191) NOT NULL,
      entity_id VARCHAR(191) NULL,
      details TEXT NULL,
      ip_address VARCHAR(191) NULL,
      created_at VARCHAR(191) NOT NULL,
      INDEX idx_audit_admin (admin_id),
      INDEX idx_audit_action (action),
      INDEX idx_audit_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS application_reviews (
      id VARCHAR(191) PRIMARY KEY,
      application_type VARCHAR(191) NOT NULL,
      business_application_id VARCHAR(191) NULL,
      leadership_application_id VARCHAR(191) NULL,
      admin_id VARCHAR(191) NOT NULL,
      admin_email VARCHAR(191) NOT NULL,
      previous_status VARCHAR(50) NOT NULL,
      new_status VARCHAR(50) NOT NULL,
      review_note TEXT NULL,
      created_at VARCHAR(191) NOT NULL,
      INDEX idx_rev_biz (business_application_id),
      INDEX idx_rev_lead (leadership_application_id),
      INDEX idx_rev_admin (admin_id),
      INDEX idx_rev_created_at (created_at),
      CONSTRAINT fk_rev_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_rev_biz FOREIGN KEY (business_application_id) REFERENCES business_applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_rev_lead FOREIGN KEY (leadership_application_id) REFERENCES leadership_applications(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('All MySQL target tables created with foreign keys and indexes.');

  // Transactional Migration
  console.log('Beginning transactional migration...');
  await conn.beginTransaction();

  try {
    // 1. Admins
    const admins = sdb.prepare('SELECT * FROM admins').all();
    for (const a of admins) {
      await conn.query(
        `INSERT INTO admins (id, name, email, password_hash, role, is_active, last_login_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role), is_active=VALUES(is_active)`,
        [a.id, a.name, a.email, a.password_hash, a.role, a.is_active ? 1 : 0, a.last_login_at || null, a.created_at, a.updated_at]
      );
    }

    // 2. Business Applications
    const biz = sdb.prepare('SELECT * FROM business_applications').all();
    for (const b of biz) {
      await conn.query(
        `INSERT INTO business_applications (
          id, legal_entity_name, corporate_website, rep_full_name, corporate_title,
          corporate_email, country_code, direct_phone, hq_city_country, additional_locations,
          primary_industry_sector, other_industry_sector, primary_business_model, annual_turnover,
          exim_status, target_markets, trade_objectives, auth_officer_name, auth_corporate_title,
          auth_corporate_email, auth_submission_date, auth_signature_seal, affirmation, status,
          admin_notes, reviewed_by, reviewed_at, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE status=VALUES(status), admin_notes=VALUES(admin_notes)`,
        [
          b.id, b.legal_entity_name, b.corporate_website, b.rep_full_name, b.corporate_title,
          b.corporate_email, b.country_code, b.direct_phone, b.hq_city_country, b.additional_locations,
          b.primary_industry_sector, b.other_industry_sector, b.primary_business_model, b.annual_turnover,
          b.exim_status,
          typeof b.target_markets === 'string' ? b.target_markets : JSON.stringify(b.target_markets),
          typeof b.trade_objectives === 'string' ? b.trade_objectives : JSON.stringify(b.trade_objectives),
          b.auth_officer_name, b.auth_corporate_title, b.auth_corporate_email, b.auth_submission_date,
          b.auth_signature_seal, b.affirmation ? 1 : 0, b.status, b.admin_notes, b.reviewed_by, b.reviewed_at,
          b.created_at, b.updated_at
        ]
      );
    }

    // 3. Leadership Applications
    const lead = sdb.prepare('SELECT * FROM leadership_applications').all();
    for (const l of lead) {
      await conn.query(
        `INSERT INTO leadership_applications (
          id, full_name, official_email, country_code, mobile_whatsapp,
          city_country, time_zone_gmt, current_designation, organization_firm, website,
          primary_industry_domain, other_industry_domain, strategic_engagement, geographic_markets,
          linkedin_url, executive_summary, candidate_name, attestation_date, digital_signature,
          attestation_official_email, attestation_check, status, admin_notes, reviewed_by, reviewed_at,
          created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE status=VALUES(status), admin_notes=VALUES(admin_notes)`,
        [
          l.id, l.full_name, l.official_email, l.country_code, l.mobile_whatsapp,
          l.city_country, l.time_zone_gmt, l.current_designation, l.organization_firm, l.website,
          l.primary_industry_domain, l.other_industry_domain,
          typeof l.strategic_engagement === 'string' ? l.strategic_engagement : JSON.stringify(l.strategic_engagement),
          typeof l.geographic_markets === 'string' ? l.geographic_markets : JSON.stringify(l.geographic_markets),
          l.linkedin_url, l.executive_summary, l.candidate_name, l.attestation_date, l.digital_signature,
          l.attestation_official_email, l.attestation_check ? 1 : 0, l.status, l.admin_notes, l.reviewed_by, l.reviewed_at,
          l.created_at, l.updated_at
        ]
      );
    }

    // 4. General Applications
    const gen = sdb.prepare('SELECT * FROM general_applications').all();
    for (const g of gen) {
      await conn.query(
        `INSERT INTO general_applications (
          id, full_name, org_name, designation, email, phone, country, city,
          website, linkedin, plan, sector, org_type, primary_interest, org_description,
          connections_seeking, status, admin_notes, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE status=VALUES(status)`,
        [
          g.id, g.full_name, g.org_name, g.designation, g.email, g.phone, g.country, g.city,
          g.website, g.linkedin, g.plan, g.sector, g.org_type, g.primary_interest, g.org_description,
          g.connections_seeking, g.status, g.admin_notes, g.created_at, g.updated_at
        ]
      );
    }

    // 5. Contact Enquiries
    const enq = sdb.prepare('SELECT * FROM contact_enquiries').all();
    for (const e of enq) {
      await conn.query(
        `INSERT INTO contact_enquiries (
          id, name, organization, email, country, interest_type, message, status,
          internal_notes, assigned_to, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE status=VALUES(status)`,
        [
          e.id, e.name, e.organization, e.email, e.country, e.interest_type, e.message, e.status,
          e.internal_notes, e.assigned_to, e.created_at, e.updated_at
        ]
      );
    }

    // 6. Members
    const mem = sdb.prepare('SELECT * FROM members').all();
    for (const m of mem) {
      await conn.query(
        `INSERT INTO members (
          id, org_name, logo, member_name, designation, country, city, sector, tier,
          org_type, services, interests, description, website, linkedin, show_public_contact,
          is_active, verified_at, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE org_name=VALUES(org_name)`,
        [
          m.id, m.org_name, m.logo, m.member_name, m.designation, m.country, m.city, m.sector, m.tier,
          m.org_type, m.services, m.interests, m.description, m.website, m.linkedin,
          m.show_public_contact ? 1 : 0, m.is_active ? 1 : 0, m.verified_at, m.created_at, m.updated_at
        ]
      );
    }

    // 7. Audit Logs
    const logs = sdb.prepare('SELECT * FROM audit_logs').all();
    for (const a of logs) {
      await conn.query(
        `INSERT INTO audit_logs (id, admin_id, admin_email, action, entity_type, entity_id, details, ip_address, created_at)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE action=VALUES(action)`,
        [a.id, a.admin_id, a.admin_email, a.action, a.entity_type, a.entity_id, a.details, a.ip_address, a.created_at]
      );
    }

    // 8. Application Reviews (Respecting Foreign Keys)
    const reviews = sdb.prepare('SELECT * FROM application_reviews').all();
    for (const r of reviews) {
      await conn.query(
        `INSERT INTO application_reviews (
          id, application_type, business_application_id, leadership_application_id,
          admin_id, admin_email, previous_status, new_status, review_note, created_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE review_note=VALUES(review_note)`,
        [
          r.id, r.application_type, r.business_application_id || null, r.leadership_application_id || null,
          r.admin_id, r.admin_email, r.previous_status, r.new_status, r.review_note, r.created_at
        ]
      );
    }

    await conn.commit();
    console.log('TRANSACTION_COMMITTED: All 8 tables successfully committed to MySQL.');

    // Count and Parity Verification
    const tables = [
      { name: 'admins', src: admins.length },
      { name: 'business_applications', src: biz.length },
      { name: 'leadership_applications', src: lead.length },
      { name: 'general_applications', src: gen.length },
      { name: 'contact_enquiries', src: enq.length },
      { name: 'members', src: mem.length },
      { name: 'audit_logs', src: logs.length },
      { name: 'application_reviews', src: reviews.length }
    ];

    console.log('--- Row Count Parity Verification ---');
    let allMatched = true;
    for (const t of tables) {
      const [rows] = await conn.query('SELECT count(*) as cnt FROM `' + t.name + '`');
      const dest = rows[0].cnt;
      const matched = dest === t.src;
      if (!matched) allMatched = false;
      console.log(`Table [${t.name}]: Source=${t.src} -> MySQL=${dest} | Match: ${matched ? 'OK' : 'MISMATCH'}`);
    }

    if (!allMatched) {
      throw new Error('Row count mismatch detected between SQLite and MySQL!');
    }

    // Spot-check key representative values
    console.log('--- Spot-check Key Representative Records ---');
    const [adminCheck] = await conn.query('SELECT id, email, role FROM admins WHERE id = ?', ['admin-1']);
    console.log('Master Admin Spot-check:', adminCheck[0]);

    const [bizCheck] = await conn.query('SELECT id, legal_entity_name, corporate_email, status FROM business_applications WHERE id = ?', ['biz-app-101']);
    console.log('Biz App Spot-check:', bizCheck[0]);

    const [revCheck] = await conn.query('SELECT id, application_type, business_application_id, admin_id, new_status FROM application_reviews WHERE business_application_id = ?', ['biz-app-101']);
    console.log('Reviews Spot-check count:', revCheck.length, 'records for biz-app-101');

    console.log('PHASE_1_MIGRATION_SUCCESS');
  } catch (err) {
    await conn.rollback();
    console.error('MIGRATION_FAILED_ROLLED_BACK:', err);
    throw err;
  } finally {
    sdb.close();
    await conn.end();
  }
}

migrate().catch(e => {
  console.error('Fatal migration error:', e);
  process.exit(1);
});
