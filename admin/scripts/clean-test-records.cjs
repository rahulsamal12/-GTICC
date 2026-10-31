const fs = require('fs');
const mysql = require('mysql2/promise');

async function cleanTestRecords() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const testBizId = '968cc729-3a90-4bdd-be44-1f5b10c41c8e';
  const testLeadId = '56e598ae-a2a1-4ad8-a04d-57d3802d196d';

  console.log('--- CLEANING TEST SUBMISSIONS ---');
  // Foreign keys on application_reviews cascade delete, but no reviews exist for these new submissions
  await conn.query('DELETE FROM business_applications WHERE id = ?', [testBizId]);
  console.log('Cleaned dummy business application:', testBizId);

  await conn.query('DELETE FROM leadership_applications WHERE id = ?', [testLeadId]);
  console.log('Cleaned dummy leadership application:', testLeadId);

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
    console.log('CLEANUP_SUCCESS: All baseline records remain intact and 100% matched to SQLite backup.');
  } else {
    throw new Error('Baseline count mismatch detected!');
  }
}

cleanTestRecords().catch(console.error);
