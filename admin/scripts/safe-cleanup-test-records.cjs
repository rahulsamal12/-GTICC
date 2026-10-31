const fs = require('fs');
const mysql = require('mysql2/promise');

async function cleanTestRecords() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  console.log('=== CLEANING TEST RECORDS ===');

  const bizId = 'ede00940-d5c9-45c0-8f92-214183361856';
  const leadId = '5b85ce7f-954d-4461-9ba7-fed3262252ef';

  // Delete reviews if any
  await conn.query('DELETE FROM application_reviews WHERE business_application_id = ?', [bizId]);
  await conn.query('DELETE FROM application_reviews WHERE leadership_application_id = ?', [leadId]);

  // Delete business test record
  const [bRes] = await conn.query('DELETE FROM business_applications WHERE id = ?', [bizId]);
  console.log(`Deleted business application ${bizId}: affectedRows = ${bRes.affectedRows}`);

  // Delete leadership test record
  const [lRes] = await conn.query('DELETE FROM leadership_applications WHERE id = ?', [leadId]);
  console.log(`Deleted leadership application ${leadId}: affectedRows = ${lRes.affectedRows}`);

  console.log('\n--- VERIFYING RESTORED TABLE ROW COUNTS ---');
  const tables = [
    'admins',
    'application_reviews',
    'audit_logs',
    'business_applications',
    'contact_enquiries',
    'general_applications',
    'leadership_applications',
    'members'
  ];

  for (const tbl of tables) {
    const [cnt] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
    console.log(`${tbl}: ${cnt[0].cnt}`);
  }

  await conn.end();
}

cleanTestRecords().catch(console.error);
