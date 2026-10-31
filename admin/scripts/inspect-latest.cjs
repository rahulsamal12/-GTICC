const fs = require('fs');
const mysql = require('mysql2/promise');

async function inspectLatest() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const [b] = await conn.query('SELECT id, legal_entity_name, corporate_email, status, created_at FROM business_applications ORDER BY created_at DESC LIMIT 3');
  console.log('--- LATEST BUSINESS APPLICATIONS ---');
  console.table(b);

  const [l] = await conn.query('SELECT id, full_name, official_email, status, created_at FROM leadership_applications ORDER BY created_at DESC LIMIT 3');
  console.log('--- LATEST LEADERSHIP APPLICATIONS ---');
  console.table(l);

  const [a] = await conn.query('SELECT id, admin_email, action, entity_type, entity_id, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5');
  console.log('--- LATEST AUDIT LOGS ---');
  console.table(a);

  await conn.end();
}

inspectLatest().catch(console.error);
