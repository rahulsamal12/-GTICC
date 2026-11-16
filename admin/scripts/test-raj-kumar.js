const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection('mysql://gticc_app:e9c4ca1cea2631793453a5e62b8fc054586a1222a5a53e9cGticc2026!@127.0.0.1:3307/gticc_db');
  const targetId = 'e6d682dc-a3c4-4c5b-8b5b-c4f7ad12cb88';
  console.log('Testing Target Application:', targetId);
  
  // Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gticc.org', password: 'GTICCAdmin2026!' })
  });
  const cookie = loginRes.headers.get('set-cookie').split(';')[0];
  
  // Test 1: Accepted + Visible
  console.log('\n[TEST 1] Accepted + Visible:');
  await fetch('http://localhost:3000/api/member-directory/' + targetId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: true })
  });
  let res = await (await fetch('http://localhost:3000/api/member-directory')).json();
  let found = res.members.find(m => m.applicationId === targetId);
  console.log('Present in public directory?', Boolean(found), found ? found.org_name : 'NOT FOUND');
  
  // Test 2: Accepted + Hidden
  console.log('\n[TEST 2] Accepted + Hidden:');
  await fetch('http://localhost:3000/api/member-directory/' + targetId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: false })
  });
  res = await (await fetch('http://localhost:3000/api/member-directory')).json();
  found = res.members.find(m => m.applicationId === targetId);
  console.log('Present in public directory after hide?', Boolean(found));
  
  // Test 3: Hidden + Visible again
  console.log('\n[TEST 3] Hidden + Visible again:');
  await fetch('http://localhost:3000/api/member-directory/' + targetId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: true })
  });
  res = await (await fetch('http://localhost:3000/api/member-directory')).json();
  found = res.members.find(m => m.applicationId === targetId);
  console.log('Present in public directory after re-enabling?', Boolean(found), found ? found.org_name : 'NOT FOUND');
  
  // Test 4: Pending application
  console.log('\n[TEST 4] Pending -> Does not appear:');
  const [pendingApps] = await conn.query("SELECT id, legal_entity_name FROM business_applications WHERE status = 'PENDING' LIMIT 1");
  if (pendingApps.length > 0) {
    const pApp = pendingApps[0];
    const pFound = res.members.find(m => m.applicationId === pApp.id);
    console.log('Pending app ' + pApp.legal_entity_name + ' in public directory?', Boolean(pFound));
  }
  
  // Test 5: Rejected application
  console.log('\n[TEST 5] Rejected -> Does not appear:');
  const [rejectedApps] = await conn.query("SELECT id, legal_entity_name FROM business_applications WHERE status = 'REJECTED' LIMIT 1");
  if (rejectedApps.length > 0) {
    const rApp = rejectedApps[0];
    const rFound = res.members.find(m => m.applicationId === rApp.id);
    console.log('Rejected app ' + rApp.legal_entity_name + ' in public directory?', Boolean(rFound));
  }
  
  // Test 6: Check fields of raj kumar singh
  console.log('\n[FIELDS MAPPING FOR raj kumar singh]:');
  console.log(JSON.stringify(found, null, 2));
  
  await conn.end();
})();
