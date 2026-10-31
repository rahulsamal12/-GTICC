const fs = require('fs');
const mysql = require('mysql2/promise');

async function testFromEnv() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  if (!match) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }
  const dbUrl = match[1];
  console.log('Testing independent connection using DATABASE_URL parsed from .env...');
  const conn = await mysql.createConnection(dbUrl);
  const [rows] = await conn.query('SELECT DATABASE() AS current_database, USER() AS logged_user, 1 + 1 AS healthcheck');
  console.log('Query result:', rows[0]);
  await conn.end();
  console.log('ENV_CONNECTION_VERIFIED: PASS');
}

testFromEnv().catch(err => {
  console.error('ENV_CONNECTION_FAIL:', err.message);
  process.exit(1);
});
