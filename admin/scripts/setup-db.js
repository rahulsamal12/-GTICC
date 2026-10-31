const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/gticc_db';
  console.log('Connecting to MySQL using configured URL...');

  try {
    const conn = await mysql.createConnection(dbUrl);
    console.log('Successfully connected to MySQL database engine!');

    // Read DDL migration script
    const schemaSql = fs.readFileSync(path.join(__dirname, '../prisma/schema.sql'), 'utf8');
    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} schema migration statements...`);
    for (const stmt of statements) {
      await conn.query(stmt);
    }
    console.log('Database tables & constraints ensured!');

    // Check if initial admin exists
    const [rows] = await conn.query('SELECT id, email FROM admins WHERE email = ?', ['admin@gticc.org']);
    if (rows.length === 0) {
      const passwordHash = bcrypt.hashSync('GTICCAdmin2026!', 10);
      await conn.query(
        'INSERT INTO admins (id, email, name, passwordHash, role, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin-master-001', 'admin@gticc.org', 'GTICC Chief Administrator', passwordHash, 'SUPER_ADMIN', 1]
      );
      console.log('Provisioned initial administrator: admin@gticc.org / GTICCAdmin2026!');
    } else {
      console.log('Administrator admin@gticc.org already exists.');
    }

    await conn.end();
    console.log('Database setup and provisioning completed successfully!');
  } catch (err) {
    console.error('MySQL Setup Error:', err.message);
    process.exit(1);
  }
}

main();
