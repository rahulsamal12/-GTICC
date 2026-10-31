const fs = require('fs');
const mysql = require('mysql2/promise');

async function checkAndBackupTarget() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  if (!match) throw new Error('DATABASE_URL not found in .env');

  const conn = await mysql.createConnection(match[1]);
  const [tables] = await conn.query('SHOW TABLES');
  console.log('Target MySQL table count:', tables.length);

  const backupData = {};
  if (tables.length > 0) {
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [rows] = await conn.query('SELECT * FROM `' + tableName + '`');
      backupData[tableName] = rows;
      console.log('Backed up table ' + tableName + ' with ' + rows.length + ' rows.');
    }
  } else {
    console.log('Target MySQL database is currently empty (0 tables).');
  }

  const backupPath = 'D:/GTICC1/admin/backups/mysql_target_pre_migration_backup.json';
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
  console.log('Saved target MySQL snapshot to:', backupPath);

  await conn.end();
}

checkAndBackupTarget().catch(err => {
  console.error('Target check/backup failed:', err);
  process.exit(1);
});
