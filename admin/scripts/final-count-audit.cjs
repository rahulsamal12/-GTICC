const fs = require('fs');
const mysql = require('mysql2/promise');

async function checkFinalCounts() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);
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
  console.log('--- FINAL LIVE MYSQL COUNTS ---');
  for (const t of tables) {
    const [rows] = await conn.query('SELECT count(*) as cnt FROM `' + t + '`');
    console.log(t + ':', rows[0].cnt);
  }
  await conn.end();
}

checkFinalCounts().catch(console.error);
