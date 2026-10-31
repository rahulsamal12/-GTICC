const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);
  
  const [b] = await conn.query('SELECT id, legal_entity_name, corporate_email, status FROM business_applications');
  console.log('Business applications:');
  console.table(b);

  const [l] = await conn.query('SELECT id, full_name, professional_email, status FROM leadership_applications');
  console.log('Leadership applications:');
  console.table(l);

  await conn.end();
}

main().catch(console.error);
