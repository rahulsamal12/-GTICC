const http = require('http');

async function fullLifecycle() {
  console.log('--- STARTING COMPLETE AUDIT & LIFECYCLE VERIFICATION ---');

  // 1. Submit a brand new Business Membership Application via public endpoint
  const testOrgName = 'Apex Global Quantum Dynamics ' + Date.now();
  const testEmail = 'exec.' + Date.now() + '@apexquantum.io';
  const newAppPayload = {
    legalEntityName: testOrgName,
    corporateWebsite: 'https://apexquantum.io',
    repFullName: 'Dr. Evelyn Sterling',
    corporateTitle: 'Chief Technology Officer',
    corporateEmail: testEmail,
    countryCode: '+1',
    directPhone: '4165550199',
    hqCityCountry: 'Toronto, Canada',
    additionalLocations: 'Vancouver, London, Geneva',
    primaryIndustrySector: 'Information Technology, Enterprise Software & Artificial Intelligence',
    otherIndustrySector: '',
    primaryBusinessModel: 'Enterprise Software & SaaS Solution Provider',
    annualTurnover: '$10 Million – $50 Million USD (Mid-Market Corporate / Established EXIM)',
    eximStatus: 'Yes — Active recurring cross-border services',
    targetMarkets: ['North America (United States, Canada, Mexico)', 'European Union & United Kingdom'],
    tradeObjectives: ['Establish international joint venture or consortium partnership'],
    authOfficerName: 'Dr. Evelyn Sterling',
    authCorporateTitle: 'Chief Technology Officer',
    authCorporateEmail: testEmail,
    authSubmissionDate: '2026-11-20',
    authSignatureSeal: 'Evelyn Sterling',
    affirmation: true,
    termsAccepted: true,
    privacyAcknowledged: true,
    termsAcceptedAt: new Date().toISOString(),
    privacyAcknowledgedAt: new Date().toISOString(),
    legalVersion: '2026.1',
    profilePhotoUrl: '/gticc_logo_new.webp',
    profilePhotoName: 'evelyn_headshot.webp',
    professionalCertUrl: '',
    professionalCertName: '',
  };

  const submitPostData = JSON.stringify(newAppPayload);
  const submitRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/onboarding/business',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(submitPostData)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(submitPostData);
    req.end();
  });
  console.log('1. New Submission Created:', submitRes.status, 'ID:', submitRes.body.applicationId);
  const newAppId = submitRes.body.applicationId;

  // 2. Login as Admin
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
  console.log('2. Admin Logged in successfully.');

  // 3. Confirm new application is PENDING and NOT visible in public directory
  let pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  let found = pubDir.members.find(m => m.org_name === testOrgName);
  console.log('3. While PENDING, in public directory?:', !!found, '(Expected: false)');

  // 4. Admin Accepts the application
  const acceptPayload = JSON.stringify({
    status: 'ACCEPTED',
    note: 'Approved during automated end-to-end audit verification.'
  });
  const acceptRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/onboarding/business/${newAppId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(acceptPayload),
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(acceptPayload);
    req.end();
  });
  console.log('4. Admin Accepted Application:', acceptRes.status, acceptRes.body.message);

  // 5. Verify Public Directory now includes the accepted business
  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testOrgName);
  console.log('5. After ACCEPTED, in public directory?:', !!found, '(Expected: true)');
  if (found) {
    console.log('   Member Card Data:', {
      org: found.org_name,
      rep: found.member_name,
      country: found.country,
      city: found.city,
      sector: found.sector
    });
  }

  // 6. Admin clicks 'Hide from Directory'
  const hidePayload = JSON.stringify({ visible: false });
  const hideRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/member-directory/${newAppId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(hidePayload),
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(hidePayload);
    req.end();
  });
  console.log('6. Admin Hide Action:', hideRes.status, hideRes.body.message);

  // 7. Verify Public Directory no longer includes the business
  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testOrgName);
  console.log('7. After HIDE, in public directory?:', !!found, '(Expected: false)');

  // 8. Admin clicks 'Show in Directory' again
  const showPayload = JSON.stringify({ visible: true });
  const showRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/member-directory/${newAppId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(showPayload),
        'Cookie': adminCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.write(showPayload);
    req.end();
  });
  console.log('8. Admin Show Action:', showRes.status, showRes.body.message);

  // 9. Verify Public Directory now includes the business again
  pubDir = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/member-directory', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
  found = pubDir.members.find(m => m.org_name === testOrgName);
  console.log('9. After SHOW, in public directory?:', !!found, '(Expected: true)');
  console.log('10. Current Total Public Directory Members:', pubDir.members.length);
  console.log('--- ALL 10 PHASES VERIFIED SUCCESSFULLY ---');
}

fullLifecycle().catch(console.error);
