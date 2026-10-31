const fs = require('fs');
const mysql = require('mysql2/promise');

async function validateIntegrity() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  console.log('=== FOREIGN KEY AND INTEGRITY VALIDATION ===');

  // 1. Foreign keys on application_reviews
  const [fkReviews] = await conn.query(`
    SELECT
      TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM
      INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
      TABLE_SCHEMA = 'gticc_db' AND TABLE_NAME = 'application_reviews' AND REFERENCED_TABLE_NAME IS NOT NULL;
  `);
  console.log('Foreign key constraints on application_reviews:');
  console.table(fkReviews);

  // 2. Validate all review records point to valid admin IDs
  const [orphanAdmins] = await conn.query(`
    SELECT r.id, r.admin_id FROM application_reviews r
    LEFT JOIN admins a ON r.admin_id = a.id
    WHERE a.id IS NULL;
  `);
  console.log('Orphan admin reviews count:', orphanAdmins.length);

  // 3. Validate all business review records point to valid business_applications IDs
  const [orphanBiz] = await conn.query(`
    SELECT r.id, r.business_application_id FROM application_reviews r
    LEFT JOIN business_applications b ON r.business_application_id = b.id
    WHERE r.business_application_id IS NOT NULL AND b.id IS NULL;
  `);
  console.log('Orphan business application reviews count:', orphanBiz.length);

  // 4. Validate all leadership review records point to valid leadership_applications IDs
  const [orphanLead] = await conn.query(`
    SELECT r.id, r.leadership_application_id FROM application_reviews r
    LEFT JOIN leadership_applications l ON r.leadership_application_id = l.id
    WHERE r.leadership_application_id IS NOT NULL AND l.id IS NULL;
  `);
  console.log('Orphan leadership application reviews count:', orphanLead.length);

  // 5. Check indexes on all tables
  const [indexes] = await conn.query(`
    SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, NON_UNIQUE
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = 'gticc_db'
    ORDER BY TABLE_NAME, INDEX_NAME;
  `);
  console.log(`Total indexes created in gticc_db: ${indexes.length}`);

  await conn.end();

  if (orphanAdmins.length === 0 && orphanBiz.length === 0 && orphanLead.length === 0) {
    console.log('DATA_INTEGRITY_VERIFIED: PASS');
  } else {
    throw new Error('Data integrity validation failed! Found orphaned records.');
  }
}

validateIntegrity().catch(err => {
  console.error(err);
  process.exit(1);
});
