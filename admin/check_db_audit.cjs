const Database = require('better-sqlite3');
const db = new Database('./data/gticc_admin.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));

const admins = db.prepare('SELECT id, name, email, role, is_active FROM admins').all();
console.log('\nAdmins:');
admins.forEach(a => console.log(' -', a.email, '|', a.role, '| active:', a.is_active));

const biz = db.prepare('SELECT COUNT(*) as c FROM business_applications').get();
const lead = db.prepare('SELECT COUNT(*) as c FROM leadership_applications').get();

let rev = { c: 'TABLE_MISSING' };
try { rev = db.prepare('SELECT COUNT(*) as c FROM application_reviews').get(); } catch(e) { console.log('ERROR - application_reviews NOT found:', e.message); }

console.log('\nBusiness Apps:', biz.c);
console.log('Leadership Apps:', lead.c);
console.log('Application Reviews:', rev.c);
