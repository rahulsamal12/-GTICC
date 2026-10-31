const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function applyMigrations() {
  console.log('=== GTICC REPEATABLE MYSQL MIGRATION RUNNER ===');
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) throw new Error('.env file missing');

  const envText = fs.readFileSync(envPath, 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  if (!match) throw new Error('DATABASE_URL not found in .env');

  const conn = await mysql.createConnection({
    uri: match[1],
    multipleStatements: true,
  });

  try {
    const migrationFile = path.join(__dirname, '../migrations/001_init_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log(`Applying migration: 001_init_schema.sql...`);
    await conn.query(sql);
    console.log('Migration applied successfully!');

    // Verify all 8 tables
    const [tables] = await conn.query('SHOW TABLES');
    const tableList = tables.map(t => Object.values(t)[0]);
    console.log('\nVerified tables in gticc_db:');
    console.log(tableList);

    const required = [
      'admins',
      'business_applications',
      'leadership_applications',
      'general_applications',
      'contact_enquiries',
      'members',
      'audit_logs',
      'application_reviews',
    ];

    const missing = required.filter(t => !tableList.includes(t));
    if (missing.length > 0) {
      throw new Error(`Missing tables after migration: ${missing.join(', ')}`);
    }

    console.log('\nAll 8 required tables exist and are verified.');
  } finally {
    await conn.end();
  }
}

applyMigrations().catch(err => {
  console.error('Migration Runner Error:', err);
  process.exit(1);
});
