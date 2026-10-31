const fs = require('fs');
const mysql = require('mysql2/promise');

async function clean() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const testId = '81bf1bf6-495a-41db-a8a6-3a981d907a21';
  const [rRes] = await conn.query('DELETE FROM application_reviews WHERE business_application_id = ?', [testId]);
  const [bRes] = await conn.query('DELETE FROM business_applications WHERE id = ?', [testId]);
  const [aRes] = await conn.query('DELETE FROM audit_logs WHERE entity_id = ?', [testId]);

  console.log(`Cleaned test record ${testId}:`);
  console.log(`- application_reviews deleted: ${rRes.affectedRows}`);
  console.log(`- business_applications deleted: ${bRes.affectedRows}`);
  console.log(`- audit_logs deleted: ${aRes.affectedRows}`);

  await conn.end();
}

clean().catch(console.error);
