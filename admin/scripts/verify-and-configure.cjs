const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const credPath = path.join(__dirname, '../.mysql_credential');
  if (!fs.existsSync(credPath)) {
    console.error('ERROR: Credential file .mysql_credential not found.');
    process.exit(1);
  }

  const raw = fs.readFileSync(credPath, 'utf8').trim();
  if (!raw) {
    console.error('ERROR: .mysql_credential is empty.');
    process.exit(1);
  }

  // Parse lines or format (supports simple password on line 1, or user:password)
  let user = 'gticc_app';
  let password = raw;
  if (raw.includes(':') && !raw.startsWith('mysql://')) {
    const parts = raw.split(':');
    user = parts[0].trim();
    password = parts.slice(1).join(':').trim();
  }

  console.log(`Connecting to MySQL (127.0.0.1:3306) as user: [${user}]...`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: user,
      password: password,
    });
    console.log('SUCCESS: Authenticated to MySQL server at 127.0.0.1:3306!');
  } catch (err) {
    console.error('CONNECTION_FAILED: Access denied or unable to connect:', err.message);
    process.exit(1);
  }

  try {
    // 1. Ensure gticc_db exists
    await conn.query('CREATE DATABASE IF NOT EXISTS gticc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('SUCCESS: Database gticc_db verified/created.');

    // 2. Switch to gticc_db
    await conn.changeUser({ database: 'gticc_db' });
    console.log('SUCCESS: Connected to gticc_db successfully.');

    // 3. Inspect existing tables in gticc_db
    const [existingTables] = await conn.query('SHOW TABLES;');
    console.log(`CURRENT_TABLES_IN_GTICC_DB: ${existingTables.length} tables found.`);
    if (existingTables.length > 0) {
      console.log('Existing tables:', existingTables.map(r => Object.values(r)[0]).join(', '));
    }

    // 4. Generate fresh secrets for .env
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(password);
    const databaseUrl = `mysql://${encodedUser}:${encodedPass}@127.0.0.1:3306/gticc_db`;

    const envContent = [
      '# ========================================================',
      '# GTICC Admin Panel Environment Configuration (Local Node.js)',
      '# Generated securely - Do not commit to source control',
      '# ========================================================',
      '',
      `DATABASE_URL="${databaseUrl}"`,
      `JWT_SECRET="${jwtSecret}"`,
      'PORT=3000',
      'NODE_ENV="development"',
      'ALLOWED_ORIGIN="http://localhost:5173"',
      'NEXT_PUBLIC_SITE_URL="http://localhost:5173"',
      '',
    ].join('\n');

    const envPath = path.join(__dirname, '../.env');
    fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });
    console.log('SUCCESS: .env file created with verified credentials and fresh JWT secret.');

    // 5. Clean up the credential file safely
    fs.unlinkSync(credPath);
    console.log('SUCCESS: .mysql_credential file removed safely.');

    await conn.end();
  } catch (err) {
    console.error('CONFIG_ERROR:', err.message);
    if (conn) await conn.end();
    process.exit(1);
  }
}

main();
