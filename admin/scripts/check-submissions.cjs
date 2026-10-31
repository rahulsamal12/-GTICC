const fs = require('fs');
const mysql = require('mysql2/promise');

async function checkSubmissions() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const [biz] = await conn.query('SELECT id, legal_entity_name, corporate_email, status, created_at FROM business_applications WHERE id = ?', ['968cc729-3a90-4bdd-be44-1f5b10c41c8e']);
  console.log('Business submission in MySQL:');
  console.log(biz[0]);

  const [lead] = await conn.query('SELECT id, full_name, official_email, status, created_at FROM leadership_applications WHERE id = ?', ['56e598ae-a2a1-4ad8-a04d-57d3802d196d']);
  console.log('Leadership submission in MySQL:');
  console.log(lead[0]);

  const [bizCount] = await conn.query('SELECT count(*) as cnt FROM business_applications');
  const [leadCount] = await conn.query('SELECT count(*) as cnt FROM leadership_applications');
  console.log('Total business applications in MySQL:', bizCount[0].cnt);
  console.log('Total leadership applications in MySQL:', leadCount[0].cnt);

  await conn.end();
}

checkSubmissions().catch(console.error);
