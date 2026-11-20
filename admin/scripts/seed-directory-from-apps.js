const db = require('mysql2/promise');
const fs = require('fs');

let dbConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3307', 10),
  user: process.env.MYSQL_USER || 'gticc_app',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'gticc_db'
};

if (fs.existsSync('./.env')) {
  const envFile = fs.readFileSync('./.env', 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      const dbUrl = trimmed.replace('DATABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
      try {
        const parsed = new URL(dbUrl);
        dbConfig = {
          host: parsed.hostname,
          port: parseInt(parsed.port || '3306', 10),
          user: decodeURIComponent(parsed.username),
          password: decodeURIComponent(parsed.password),
          database: parsed.pathname.replace(/^\//, '')
        };
      } catch (e) {}
    }
  }
}

async function syncAll() {
  const conn = await db.createConnection(dbConfig);
  const [apps] = await conn.query("SELECT * FROM business_applications WHERE UPPER(status) = 'ACCEPTED'");
  console.log('Found accepted business apps:', apps.length);

  for (const app of apps) {
    const isVisible = app.directory_visible === 1 || app.directory_visible === true;
    const hq = app.hq_city_country || 'Global';
    const parts = hq.split(',').map((p) => p.trim());
    const city = parts[0] || 'Global';
    const country = parts.length > 1 ? parts.slice(1).join(', ') : 'Global';

    let services = '';
    try {
      const parsed = JSON.parse(app.trade_objectives);
      services = Array.isArray(parsed) ? parsed.join(', ') : app.trade_objectives;
    } catch {
      services = app.trade_objectives || '';
    }

    let interests = '';
    try {
      const parsed = JSON.parse(app.target_markets);
      interests = Array.isArray(parsed) ? parsed.join(', ') : app.target_markets;
    } catch {
      interests = app.target_markets || '';
    }

    const [existing] = await conn.query('SELECT id FROM members WHERE application_id = ?', [app.id]);
    if (existing && existing.length > 0) {
      await conn.query(
        `UPDATE members SET
          org_name = ?, logo = ?, member_name = ?, designation = ?,
          country = ?, city = ?, sector = ?, tier = ?, annual_turnover = ?,
          org_type = ?, exim_status = ?, services = ?, interests = ?,
          description = ?, website = ?, is_active = 1, directory_visible = ?, updated_at = NOW(3)
        WHERE id = ?`,
        [
          app.legal_entity_name,
          app.profile_photo_url || '/gticc_logo_new.webp',
          app.rep_full_name,
          app.corporate_title,
          country,
          city,
          app.primary_industry_sector,
          app.annual_turnover || 'Corporate Member',
          app.annual_turnover,
          app.primary_business_model || 'Enterprise Corporation',
          app.exim_status,
          services || 'International Trade & Cross-Border Commerce',
          interests || 'Global Strategic Alliances',
          app.legal_entity_name + ' operates in ' + app.primary_industry_sector + ' with headquarters in ' + hq,
          app.corporate_website || null,
          isVisible ? 1 : 0,
          existing[0].id,
        ]
      );
      console.log('Updated member for app:', app.id);
    } else {
      const crypto = require('crypto');
      const memId = crypto.randomUUID();
      await conn.query(
        `INSERT INTO members (
          id, application_id, org_name, logo, member_name, designation,
          country, city, sector, tier, annual_turnover, org_type, exim_status,
          services, interests, description, website, linkedin, show_public_contact,
          is_active, directory_visible, verified_at, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,1,?,NOW(3),NOW(3),NOW(3))`,
        [
          memId,
          app.id,
          app.legal_entity_name,
          app.profile_photo_url || '/gticc_logo_new.webp',
          app.rep_full_name,
          app.corporate_title,
          country,
          city,
          app.primary_industry_sector,
          app.annual_turnover || 'Corporate Member',
          app.annual_turnover,
          app.primary_business_model || 'Enterprise Corporation',
          app.exim_status,
          services || 'International Trade & Cross-Border Commerce',
          interests || 'Global Strategic Alliances',
          app.legal_entity_name + ' operates in ' + app.primary_industry_sector + ' with headquarters in ' + hq,
          app.corporate_website || null,
          null,
          isVisible ? 1 : 0,
        ]
      );
      console.log('Inserted member for app:', app.id, 'with id:', memId);
    }
  }
  await conn.end();
}

syncAll().catch(console.error);
