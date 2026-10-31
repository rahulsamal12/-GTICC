const fs = require('fs');
const mysql = require('mysql2/promise');

async function inspectArchitecture() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  if (!match) throw new Error('DATABASE_URL not found in .env');

  const conn = await mysql.createConnection(match[1]);

  console.log('--- SHOW DATABASES ---');
  const [dbs] = await conn.query('SHOW DATABASES');
  console.log(dbs.map(d => Object.values(d)[0]));

  console.log('\n--- SHOW TABLES IN gticc_db ---');
  const [tables] = await conn.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  console.log(tableNames);

  console.log('\n--- ROW COUNTS PER TABLE ---');
  for (const tbl of tableNames) {
    const [countRes] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
    console.log(`${tbl}: ${countRes[0].cnt}`);
  }

  await conn.end();
}

inspectArchitecture().catch(console.error);
