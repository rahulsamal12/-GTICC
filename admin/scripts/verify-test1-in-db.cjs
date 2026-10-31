const fs = require('fs');
const mysql = require('mysql2/promise');

async function verifySubmissionsInDb() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const bizId = 'b1e98737-f8b4-4805-9579-530e290f80a4';
  const leadId = '910cbcdf-43f9-43fb-9c15-bddb1b2dcbcc';

  console.log('=== VERIFYING TEST1 SUBMISSIONS IN MYSQL ===');

  const [biz] = await conn.query('SELECT id, legal_entity_name, corporate_email, status, created_at FROM business_applications WHERE id = ?', [bizId]);
  console.log('Business Record:', biz[0]);

  const [lead] = await conn.query('SELECT id, full_name, official_email, status, created_at FROM leadership_applications WHERE id = ?', [leadId]);
  console.log('Leadership Record:', lead[0]);

  const [bizCount] = await conn.query('SELECT count(*) as cnt FROM business_applications');
  const [leadCount] = await conn.query('SELECT count(*) as cnt FROM leadership_applications');
  console.log(`Current Row Counts -> business_applications: ${bizCount[0].cnt} (Before: 4), leadership_applications: ${leadCount[0].cnt} (Before: 1)`);

  await conn.end();
}

verifySubmissionsInDb().catch(console.error);
