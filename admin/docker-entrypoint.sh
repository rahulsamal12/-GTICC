#!/bin/sh
set -e

echo "==> Starting GTICC Admin Panel container entrypoint..."

# Wait for MySQL database to become responsive
echo "==> Waiting for MySQL database to become ready..."
node -e "
const mysql = require('mysql2/promise');

function getConnectionConfig() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && typeof dbUrl === 'string' && dbUrl.trim().length > 0) {
    return dbUrl;
  }
  return {
    host: process.env.MYSQL_HOST || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'gticc_app',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'gticc_db',
    connectTimeout: 5000
  };
}

async function check(retries = 30) {
  const config = getConnectionConfig();
  for (let i = 0; i < retries; i++) {
    let conn;
    try {
      conn = await mysql.createConnection(config);
      await conn.query('SELECT 1');
      await conn.end();
      console.log('==> MySQL database is online and accepting connections!');
      return true;
    } catch (err) {
      const sanitizedMsg = (err && typeof err.message === 'string')
        ? err.message.replace(/:[^:@]+@/, ':****@')
        : 'Unknown connection error';
      console.log('    Waiting for MySQL... (' + (i + 1) + '/' + retries + '): ' + sanitizedMsg);
      if (conn) {
        try { await conn.end(); } catch (_) {}
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.error('==> ERROR: Could not connect to MySQL after ' + retries + ' attempts.');
  process.exit(1);
}
check();
"

# Check if tables already exist — if so, skip setup-db.js to avoid
# running the old schema.sql (camelCase) against live snake_case data
echo "==> Checking if schema tables already exist..."
TABLE_COUNT=$(node -e "
const mysql = require('mysql2/promise');

function getConnectionConfig() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && typeof dbUrl === 'string' && dbUrl.trim().length > 0) {
    return dbUrl;
  }
  return {
    host: process.env.MYSQL_HOST || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'gticc_app',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'gticc_db',
    connectTimeout: 5000
  };
}

async function countTables() {
  const conn = await mysql.createConnection(getConnectionConfig());
  const [rows] = await conn.query(
    'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name IN (\"admins\",\"business_applications\",\"leadership_applications\",\"general_applications\",\"contact_enquiries\",\"members\",\"audit_logs\",\"application_reviews\",\"application_notifications\")'
  );
  await conn.end();
  process.stdout.write(String(rows[0].cnt));
}
countTables().catch(() => process.stdout.write('0'));
")

echo "==> Found ${TABLE_COUNT}/9 expected tables in the database."

if [ "$TABLE_COUNT" -lt "9" ]; then
  echo "==> Schema not fully initialized — running setup-db.js to provision tables and admin..."
  node scripts/setup-db.js
else
  echo "==> All 8 tables already exist — skipping setup-db.js. Existing data preserved."
fi

# Ensure Prisma client matches current environment
echo "==> Verifying Prisma Client generation..."
npx prisma generate

echo "==> Launching GTICC Next.js Application server..."
exec npm run start -- -p 3000 -H 0.0.0.0
