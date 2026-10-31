const fs = require('fs');
const mysql = require('mysql2/promise');

async function clean() {
  const envText = fs.readFileSync('D:/GTICC1/admin/.env', 'utf8');
  const match = envText.match(/DATABASE_URL="([^"]+)"/);
  const conn = await mysql.createConnection(match[1]);

  const testLeadId = '2e0a074b-1e1e-447d-9081-2ecd78c4489c';
  const testGeneralEmail = 'amira.patel@aegis-horizon-audit.example';
  const testContactEmail = 'david.chen@pacific-trade-audit.example';

  const [recentC] = await conn.query('SELECT id, name, email FROM contact_enquiries ORDER BY created_at DESC LIMIT 3');
  console.log('Recent contact enquiries:', recentC);

  const [rRes] = await conn.query('DELETE FROM application_reviews WHERE leadership_application_id = ?', [testLeadId]);
  const [lRes] = await conn.query('DELETE FROM leadership_applications WHERE id = ?', [testLeadId]);
  const [gRes] = await conn.query('DELETE FROM general_applications WHERE email = ?', [testGeneralEmail]);
  const [cRes] = await conn.query('DELETE FROM contact_enquiries WHERE email LIKE ?', ['%pacific-trade%']);
  const [aRes] = await conn.query('DELETE FROM audit_logs WHERE entity_id = ? OR details LIKE ? OR details LIKE ?', [
    testLeadId,
    `%${testGeneralEmail}%`,
    `%pacific-trade%`
  ]);

  console.log(`Cleaned test records:`);
  console.log(`- application_reviews deleted: ${rRes.affectedRows}`);
  console.log(`- leadership_applications deleted: ${lRes.affectedRows}`);
  console.log(`- general_applications deleted: ${gRes.affectedRows}`);
  console.log(`- contact_enquiries deleted: ${cRes.affectedRows}`);
  console.log(`- audit_logs deleted: ${aRes.affectedRows}`);

  await conn.end();
}

clean().catch(console.error);
