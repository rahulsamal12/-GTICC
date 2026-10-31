const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/gticc_admin.db');
const db = new Database(dbPath);

console.log('Opened database at:', dbPath);
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables found:', tables.map(t => t.name));

for (const t of tables) {
  const count = db.prepare(`SELECT count(*) as c FROM "${t.name}"`).get();
  console.log(`Table [${t.name}]: ${count.c} rows`);
  if (count.c > 0 && count.c < 10) {
    const rows = db.prepare(`SELECT * FROM "${t.name}" LIMIT 3`).all();
    console.log(` Sample rows from ${t.name}:`, JSON.stringify(rows, null, 2));
  }
}
