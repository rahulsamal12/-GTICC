const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection('mysql://gticc_app:e9c4ca1cea2631793453a5e62b8fc054586a1222a5a53e9cGticc2026!@127.0.0.1:3307/gticc_db');
  
  // 1. Pick an accepted application
  const [apps] = await conn.query("SELECT ba.id, ba.legal_entity_name, ba.status, ba.directory_visible, m.id as member_id, m.org_name as member_org_name, m.directory_visible as m_dir_vis FROM business_applications ba JOIN members m ON ba.id = m.application_id WHERE ba.status = 'ACCEPTED' LIMIT 1");
  const target = apps[0];
  console.log('Target Application Under Test:');
  console.log({
    appId: target.id,
    appName: target.legal_entity_name,
    status: target.status,
    memberId: target.member_id,
    memberOrgName: target.member_org_name
  });
  
  // Login as admin
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gticc.org', password: 'GTICCAdmin2026!' })
  });
  const cookie = loginRes.headers.get('set-cookie').split(';')[0];
  
  // ==========================================
  // SCENARIO 1: ACCEPTED + HIDE
  // ==========================================
  console.log('\n--- SCENARIO 1: ACCEPTED + HIDE ---');
  const hideRes = await fetch('http://localhost:3000/api/member-directory/' + target.id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: false })
  });
  const hideBody = await hideRes.json();
  console.log('Admin PATCH (visible: false) -> HTTP', hideRes.status, hideBody.message);

  const [dbAfterHide] = await conn.query('SELECT ba.id, ba.status, ba.directory_visible as ba_vis, m.directory_visible as m_vis FROM business_applications ba JOIN members m ON ba.id = m.application_id WHERE ba.id = ?', [target.id]);
  console.log('Database Persistence: ba.directory_visible =', dbAfterHide[0].ba_vis, '| m.directory_visible =', dbAfterHide[0].m_vis);

  const pubAfterHide = await (await fetch('http://localhost:3000/api/member-directory')).json();
  const foundInPubHide = pubAfterHide.members.some(m => m.applicationId === target.id || m.id === target.member_id);
  console.log('Verification: Business in public directory after Hide?', foundInPubHide ? 'FAIL (Still visible)' : 'PASS (Correctly hidden)');

  // ==========================================
  // SCENARIO 2: ACCEPTED + SHOW (REAPPLY VISIBILITY)
  // ==========================================
  console.log('\n--- SCENARIO 2: ACCEPTED + SHOW ---');
  const showRes = await fetch('http://localhost:3000/api/member-directory/' + target.id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: true })
  });
  const showBody = await showRes.json();
  console.log('Admin PATCH (visible: true) -> HTTP', showRes.status, showBody.message);

  const [dbAfterShow] = await conn.query('SELECT ba.id, ba.status, ba.directory_visible as ba_vis, m.directory_visible as m_vis FROM business_applications ba JOIN members m ON ba.id = m.application_id WHERE ba.id = ?', [target.id]);
  console.log('Database Persistence: ba.directory_visible =', dbAfterShow[0].ba_vis, '| m.directory_visible =', dbAfterShow[0].m_vis);

  const pubAfterShow = await (await fetch('http://localhost:3000/api/member-directory')).json();
  const foundInPubShow = pubAfterShow.members.some(m => m.applicationId === target.id || m.id === target.member_id);
  console.log('Verification: Business in public directory after Show?', foundInPubShow ? 'PASS (Correctly visible)' : 'FAIL (Not visible)');

  // ==========================================
  // SCENARIO 3: PENDING + SHOW ATTEMPT
  // ==========================================
  console.log('\n--- SCENARIO 3: PENDING + SHOW ATTEMPT ---');
  const [pendingApps] = await conn.query("SELECT id, legal_entity_name, status FROM business_applications WHERE status = 'PENDING' LIMIT 1");
  if (pendingApps.length > 0) {
    const pendingTarget = pendingApps[0];
    const pendingShowRes = await fetch('http://localhost:3000/api/member-directory/' + pendingTarget.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ visible: true })
    });
    const pendingData = await pendingShowRes.json();
    console.log('Attempting to show PENDING app -> HTTP', pendingShowRes.status, pendingData.error);
    console.log('Verification: Blocked unapproved app publication?', pendingShowRes.status === 400 ? 'PASS' : 'FAIL');
  }

  // ==========================================
  // SCENARIO 4: REJECTED APPLICATIONS IN PUBLIC DIRECTORY
  // ==========================================
  console.log('\n--- SCENARIO 4: REJECTED APPLICATIONS IN PUBLIC DIRECTORY ---');
  const [rejectedAppIds] = await conn.query("SELECT id FROM business_applications WHERE status = 'REJECTED'");
  const rejIds = rejectedAppIds.map(r => r.id);
  const foundRejectedInPub = pubAfterShow.members.some(m => rejIds.includes(m.applicationId));
  console.log('Rejected Application IDs count:', rejIds.length);
  console.log('Verification: Are any rejected apps in the public directory?', foundRejectedInPub ? 'FAIL (Rejected app published)' : 'PASS (0 rejected apps published)');

  // ==========================================
  // SCENARIO 5: MULTIPLE BUSINESSES INDEPENDENCE
  // ==========================================
  console.log('\n--- SCENARIO 5: MULTIPLE BUSINESSES INDEPENDENCE ---');
  const [twoApps] = await conn.query("SELECT id, legal_entity_name FROM business_applications WHERE status = 'ACCEPTED' LIMIT 2");
  if (twoApps.length >= 2) {
    const appA = twoApps[0];
    const appB = twoApps[1];

    // Set A to hide, B to show
    await fetch('http://localhost:3000/api/member-directory/' + appA.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ visible: false })
    });
    await fetch('http://localhost:3000/api/member-directory/' + appB.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ visible: true })
    });

    const [dbA] = await conn.query('SELECT directory_visible FROM business_applications WHERE id = ?', [appA.id]);
    const [dbB] = await conn.query('SELECT directory_visible FROM business_applications WHERE id = ?', [appB.id]);
    console.log(`App A (${appA.legal_entity_name}) visibility:`, dbA[0].directory_visible);
    console.log(`App B (${appB.legal_entity_name}) visibility:`, dbB[0].directory_visible);
    console.log('Verification: Independent state per record?', (dbA[0].directory_visible === 0 && dbB[0].directory_visible === 1) ? 'PASS' : 'FAIL');

    // Restore App A back to show
    await fetch('http://localhost:3000/api/member-directory/' + appA.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ visible: true })
    });
  }

  // ==========================================
  // SCENARIO 6: SEARCH & FILTERS ON PUBLIC DIRECTORY
  // ==========================================
  console.log('\n--- SCENARIO 6: PUBLIC DIRECTORY FILTERING ---');
  const allPub = await (await fetch('http://localhost:3000/api/member-directory')).json();
  console.log('Total verified public directory members available:', allPub.members.length);
  const sampleMember = allPub.members[0];
  console.log(`Filtering by country: ${sampleMember.country}...`);
  const filteredRes = await (await fetch(`http://localhost:3000/api/member-directory?country=${encodeURIComponent(sampleMember.country)}`)).json();
  const allMatchCountry = filteredRes.members.every(m => m.country === sampleMember.country);
  console.log('All filtered items match queried country?', allMatchCountry ? 'PASS' : 'FAIL', `(Count: ${filteredRes.members.length})`);

  await conn.end();
})();
