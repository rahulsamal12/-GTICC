const fs = require('fs');
const mysql = require('mysql2/promise');

async function cleanTest1Records() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const bizId = 'b1e98737-f8b4-4805-9579-530e290f80a4';
  const leadId = '910cbcdf-43f9-43fb-9c15-bddb1b2dcbcc';

  console.log('=== CLEANING TEST1 RECORDS FROM MYSQL ===');

  await conn.query('DELETE FROM business_applications WHERE id = ?', [bizId]);
  console.log('Deleted test1 business application:', bizId);

  await conn.query('DELETE FROM leadership_applications WHERE id = ?', [leadId]);
  console.log('Deleted test1 leadership application:', leadId);

  const tables = [
    'admins',
    'business_applications',
    'leadership_applications',
    'general_applications',
    'contact_enquiries',
    'members',
    'audit_logs',
    'application_reviews'
  ];

  console.log('--- RE-VERIFYING BASELINE RECORD COUNTS ---');
  let allMatched = true;
  const expected = {
    admins: 2,
    business_applications: 4,
    leadership_applications: 1,
    general_applications: 2,
    contact_enquiries: 4,
    members: 5,
    audit_logs: 11,
    application_reviews: 4
  };

  for (const t of tables) {
    const [rows] = await conn.query('SELECT count(*) as cnt FROM `' + t + '`');
    const cnt = rows[0].cnt;
    const match = cnt === expected[t];
    if (!match) allMatched = false;
    console.log(`Table [${t}]: Current=${cnt} | Expected=${expected[t]} | Match: ${match ? 'OK' : 'MISMATCH'}`);
  }

  await conn.end();

  if (allMatched) {
    console.log('CLEANUP_SUCCESS: Exact baseline record counts restored without deleting any original applications.');
  } else {
    throw new Error('Baseline row count mismatch detected!');
  }
}

cleanTest1Records().catch(console.error);
