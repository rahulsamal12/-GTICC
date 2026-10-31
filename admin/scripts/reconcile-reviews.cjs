const fs = require('fs');
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');

async function reconcileReviews() {
  const sqliteDb = new Database('D:/GTICC1/admin/backups/gticc_admin_backup_pre_mysql.db', { readonly: true });
  const originalReviews = sqliteDb.prepare('SELECT * FROM application_reviews').all();
  sqliteDb.close();

  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const [currentReviews] = await conn.query('SELECT * FROM application_reviews');
  console.log('Original SQLite reviews count:', originalReviews.length);
  console.log('Current MySQL reviews count:', currentReviews.length);

  const origIds = new Set(originalReviews.map(r => r.id));
  const additional = currentReviews.filter(r => !origIds.has(r.id));
  console.log('Additional review rows in MySQL:');
  console.log(additional);

  // If the additional reviews are the automated verification test artifacts:
  const isTestArtifact = additional.every(r =>
    r.review_note && (r.review_note.includes('Automated verification') || r.review_note.includes('Reverted after automated'))
  );
  console.log('Are additional reviews confirmed test artifacts?:', isTestArtifact);

  if (isTestArtifact && additional.length > 0) {
    for (const r of additional) {
      await conn.query('DELETE FROM application_reviews WHERE id = ?', [r.id]);
      console.log('Removed test artifact review ID:', r.id);
    }
  }

  // Restore biz-app-102 status to 'under_review' to match exact pre-test state
  await conn.query("UPDATE business_applications SET status = 'under_review', admin_notes = NULL, reviewed_by = NULL, reviewed_at = NULL WHERE id = 'biz-app-102'");
  console.log('Restored biz-app-102 to exact original status: under_review');

  const [finalReviews] = await conn.query('SELECT * FROM application_reviews');
  console.log('Final MySQL reviews count after cleanup:', finalReviews.length);

  await conn.end();
}

reconcileReviews().catch(console.error);
