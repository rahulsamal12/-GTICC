const Database = require('better-sqlite3');
const db = new Database('D:/GTICC1/admin/backups/gticc_admin_backup_pre_mysql.db', { readonly: true });
const tables = [
  'admins',
  'business_applications',
  'leadership_applications',
  'general_applications',
  'contact_enquiries',
  'members',
  'audit_logs',
  'application_reviews'
];

for (const t of tables) {
  console.log('==============================');
  console.log('TABLE: ' + t);
  console.log('==============================');
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name=?").get(t);
  console.log(schema ? schema.sql : 'NOT FOUND');
  const indexes = db.prepare("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name=?").all(t);
  if (indexes.length > 0) {
    console.log('--- Indexes ---');
    indexes.forEach(idx => { if (idx.sql) console.log(idx.sql); });
  }
}
db.close();
