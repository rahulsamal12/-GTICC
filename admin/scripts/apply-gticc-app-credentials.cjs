const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

async function main() {
  const credPath = path.join(__dirname, '../.mysql_credential');
  if (!fs.existsSync(credPath)) {
    console.error('FAIL: .mysql_credential not found');
    process.exit(1);
  }

  const rootPass = fs.readFileSync(credPath, 'utf8').trim();
  if (!rootPass) {
    console.error('FAIL: .mysql_credential is empty');
    process.exit(1);
  }

  // 1. Connect as root to 127.0.0.1:3306
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: rootPass,
    });
    console.log('STEP_1_ROOT_CONN: PASS (Authenticated as root)');
  } catch (err) {
    console.error('STEP_1_ROOT_CONN: FAIL ->', err.message);
    process.exit(1);
  }

  // 2. Generate strong, unique password for gticc_app (32 hex characters)
  const appPassword = crypto.randomBytes(24).toString('hex') + '!2026';
  
  try {
    // Update only 'gticc_app'@'localhost'
    const escPass = appPassword.replace(/'/g, "''");
    await rootConn.query(`ALTER USER 'gticc_app'@'localhost' IDENTIFIED BY '${escPass}';`);
    await rootConn.query('FLUSH PRIVILEGES;');
    console.log('STEP_2_UPDATE_GTICC_APP: PASS (Password updated for gticc_app@localhost)');
  } catch (err) {
    console.error('STEP_2_UPDATE_GTICC_APP: FAIL ->', err.message);
    await rootConn.end();
    process.exit(1);
  } finally {
    await rootConn.end();
  }

  // 3. Verify gticc_app using a fresh independent connection to gticc_db
  let appConn;
  try {
    appConn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'gticc_app',
      password: appPassword,
      database: 'gticc_db'
    });

    const [rows] = await appConn.query('SELECT DATABASE() AS active_db, USER() AS logged_user;');
    const activeDb = rows[0]?.active_db;
    const currentUser = rows[0]?.logged_user;

    if (activeDb === 'gticc_db' && currentUser?.startsWith('gticc_app@')) {
      console.log(`STEP_3_APP_VERIFY: PASS (Authenticated as ${currentUser} on database ${activeDb})`);
    } else {
      throw new Error(`Unexpected query response: db=${activeDb}, user=${currentUser}`);
    }
    await appConn.end();
  } catch (err) {
    console.error('STEP_3_APP_VERIFY: FAIL ->', err.code, err.message);
    process.exit(1);
  }

  // 4. Update .env securely, preserving existing configuration
  try {
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const encodedUser = encodeURIComponent('gticc_app');
    const encodedPass = encodeURIComponent(appPassword);
    const databaseUrl = `mysql://${encodedUser}:${encodedPass}@127.0.0.1:3306/gticc_db`;

    let lines = envContent.split('\n');
    let dbUrlReplaced = false;
    let newLines = [];

    for (const line of lines) {
      if (line.trim().startsWith('DATABASE_URL=')) {
        newLines.push(`DATABASE_URL="${databaseUrl}"`);
        dbUrlReplaced = true;
      } else if (line.trim().startsWith('MYSQL_USER=')) {
        newLines.push('MYSQL_USER=gticc_app');
      } else if (line.trim().startsWith('MYSQL_PASSWORD=')) {
        newLines.push(`MYSQL_PASSWORD="${appPassword}"`);
      } else {
        newLines.push(line);
      }
    }

    if (!dbUrlReplaced) {
      newLines.push(`DATABASE_URL="${databaseUrl}"`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
    console.log('STEP_4_ENV_UPDATE: PASS (Preserved settings and updated DATABASE_URL in .env)');
  } catch (err) {
    console.error('STEP_4_ENV_UPDATE: FAIL ->', err.message);
    process.exit(1);
  }

  console.log('CORRECTIVE_ACTION_COMPLETE: All safeguards satisfied.');
}

main();
