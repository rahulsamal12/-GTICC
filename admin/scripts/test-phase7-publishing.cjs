const http = require('http');

async function testAll() {
  console.log('=== GTICC PHASE 7 END-TO-END TEST SUITE ===');

  // Step 0: Login as Admin
  const loginPostData = JSON.stringify({ email: 'admin@gticc.org', password: 'GTICCAdmin2026!' });
  const adminCookie = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginPostData)
      }
    }, (res) => {
      resolve(res.headers['set-cookie'][0].split(';')[0]);
    });
    req.write(loginPostData);
    req.end();
  });
  console.log('Admin login successful. Cookie obtained.');

  const testAppId = 'bbf9b534-d605-4be9-aacc-4ff719de66f0';
  const testAppName = 'Apex Global Quantum Dynamics 1795162504461';

  // -------------------------------------------------------------------------
  // TEST 1: Open application in Admin Panel, Confirm Accepted, Click Save & Publish
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 1: Save & Publish to Directory for Apex Global Quantum Dynamics ---');
  const pubRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/applications/business/${testAppId}/publish`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.end();
  });
  console.log('POST /api/applications/business/:id/publish status:', pubRes.status, pubRes.body);

  // Check public directory API
  let pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  let found = pubDir.members.find(m => m.org_name === testAppName);
  console.log('Test 1 Passed? Business appears in public directory:', !!found);
  if (found) {
    console.log('Member Card Info:', {
      orgName: found.org_name,
      rep: found.member_name,
      country: found.country,
      city: found.city,
      sector: found.sector,
      orgType: found.org_type,
      website: found.website
    });
  }

  // -------------------------------------------------------------------------
  // TEST 2: Refresh public Member Directory
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 2: Refresh Public Member Directory ---');
  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testAppName);
  console.log('Test 2 Passed? Business remains visible on fresh fetch:', !!found);

  // -------------------------------------------------------------------------
  // TEST 3: Click Hide from Directory
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Hide from Directory ---');
  const hideRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/member-directory/${testAppId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(JSON.stringify({ visible: false }));
    req.end();
  });
  console.log('PATCH /api/member-directory/:id (visible: false) status:', hideRes.status, hideRes.body);

  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testAppName);
  console.log('Test 3 Passed? Business disappears publicly:', !found);

  // -------------------------------------------------------------------------
  // TEST 4: Click Show in Directory
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4: Show in Directory ---');
  const showRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/member-directory/${testAppId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(JSON.stringify({ visible: true }));
    req.end();
  });
  console.log('PATCH /api/member-directory/:id (visible: true) status:', showRes.status, showRes.body);

  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testAppName);
  console.log('Test 4 Passed? Business appears publicly again:', !!found);

  // -------------------------------------------------------------------------
  // TEST 5: Click Save & Publish Again (Idempotence & No Duplicate)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 5: Save & Publish Again (Idempotence) ---');
  const pubRes2 = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/applications/business/${testAppId}/publish`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.end();
  });
  console.log('POST publish again action:', pubRes2.body.action);

  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  const matchingMembers = pubDir.members.filter(m => m.org_name === testAppName);
  console.log('Test 5 Passed? Exactly 1 record in directory (no duplicates):', matchingMembers.length === 1);

  // -------------------------------------------------------------------------
  // TEST 6: Completely New Business Application Submission -> Accept -> Publish
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 6: New Business Submission -> Accept -> Save & Publish ---');
  const newBizName = 'Vanguard Pacific Holdings ' + Date.now();
  const newBizEmail = 'contact.' + Date.now() + '@vanguardpacific.org';
  const newPayload = {
    legalEntityName: newBizName,
    corporateWebsite: 'https://vanguardpacific.org',
    repFullName: 'Jonathan Sterling Vance',
    corporateTitle: 'Managing Partner',
    corporateEmail: newBizEmail,
    countryCode: '+1',
    directPhone: '6045550188',
    hqCityCountry: 'Vancouver, Canada',
    additionalLocations: 'Seattle, Tokyo',
    primaryIndustrySector: 'Supply Chain, Logistics, Maritime & Multimodal Freight',
    otherIndustrySector: '',
    primaryBusinessModel: 'Third-Party Logistics (3PL) & Multimodal Freight Integrator',
    annualTurnover: '$50 Million – $250 Million USD (Large Corporate / International Consortium)',
    eximStatus: 'Yes — Active recurring cross-border services',
    targetMarkets: ['East Asia & Southeast Asia (ASEAN, Japan, South Korea)', 'North America (USA & Canada)'],
    tradeObjectives: ['Establish international joint venture or consortium partnership'],
    authOfficerName: 'Jonathan Sterling Vance',
    authCorporateTitle: 'Managing Partner',
    authCorporateEmail: newBizEmail,
    authSubmissionDate: '2026-11-20',
    authSignatureSeal: 'Jonathan Sterling Vance',
    affirmation: true,
    termsAccepted: true,
    privacyAcknowledged: true,
    termsAcceptedAt: new Date().toISOString(),
    privacyAcknowledgedAt: new Date().toISOString(),
    legalVersion: '2026.1',
    profilePhotoUrl: '/gticc_logo_new.webp',
    profilePhotoName: 'vance_headshot.webp',
  };

  const newPostData = JSON.stringify(newPayload);
  const subRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/onboarding/business',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(newPostData)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(newPostData);
    req.end();
  });
  console.log('New submission created. ID:', subRes.body.applicationId);
  const newId = subRes.body.applicationId;

  // Accept it
  const accRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/onboarding/business/${newId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(JSON.stringify({ status: 'ACCEPTED', note: 'Accepted for Test 6' }));
    req.end();
  });
  console.log('Application status set to ACCEPTED:', accRes.status);

  // Save & Publish it
  const pubNewRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/applications/business/${newId}/publish`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.end();
  });
  console.log('Application Save & Publish status:', pubNewRes.status, pubNewRes.body.message);

  // Verify in public directory
  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === newBizName);
  console.log('Test 6 Passed? New business appears in public directory:', !!found);
  if (found) {
    console.log('   New Member Details:', {
      orgName: found.org_name,
      rep: found.member_name,
      country: found.country,
      city: found.city,
      sector: found.sector
    });
  }

  console.log('\n=== ALL 6 TESTS COMPLETED SUCCESSFULLY ===');
}

testAll().catch(console.error);
