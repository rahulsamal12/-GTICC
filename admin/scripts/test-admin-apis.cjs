const http = require('http');

async function testApi() {
  console.log('=== PHASE 3 AUTOMATED API INTEGRATION TESTS ===');

  // Helper for requests
  function request(options, data) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, headers: res.headers, raw: body });
          }
        });
      });
      req.on('error', reject);
      if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
      req.end();
    });
  }

  // 1. Test Admin Login
  console.log('1. Testing Admin Login (/api/auth/login)...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@gticc.org', password: 'GTICCAdmin2026!' });

  console.log('Login HTTP Status:', loginRes.status);
  console.log('Login Response:', loginRes.body);

  if (loginRes.status !== 200 || !loginRes.body.success) {
    throw new Error('Admin login test failed!');
  }

  // Extract auth cookie
  const cookieHeader = loginRes.headers['set-cookie'];
  const tokenCookie = cookieHeader ? cookieHeader[0].split(';')[0] : '';
  console.log('Extracted cookie:', tokenCookie.startsWith('gticc_admin_token=') ? 'OK' : 'MISSING');

  // 2. Test /api/auth/me
  console.log('2. Testing /api/auth/me...');
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('/api/auth/me Status:', meRes.status);
  console.log('/api/auth/me Response:', meRes.body);

  if (meRes.status !== 200 || meRes.body.user?.email !== 'admin@gticc.org') {
    throw new Error('/api/auth/me verification failed!');
  }

  // 3. Test Business Applications Listing
  console.log('3. Testing /api/onboarding/business Listing...');
  const bizListRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/business?page=1&limit=15',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('Business List Status:', bizListRes.status);
  console.log('Business List Total:', bizListRes.body.pagination?.total, 'Items count:', bizListRes.body.items?.length);

  if (bizListRes.status !== 200 || !Array.isArray(bizListRes.body.items) || bizListRes.body.pagination?.total < 1) {
    throw new Error('Business listing parity failed!');
  }

  // 4. Test Leadership Applications Listing
  console.log('4. Testing /api/onboarding/leadership Listing...');
  const leadListRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/leadership?page=1&limit=15',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('Leadership List Status:', leadListRes.status);
  console.log('Leadership List Total:', leadListRes.body.pagination?.total, 'Items count:', leadListRes.body.items?.length);

  if (leadListRes.status !== 200 || !Array.isArray(leadListRes.body.items) || leadListRes.body.pagination?.total < 1) {
    throw new Error('Leadership listing parity failed!');
  }

  // 5. Test Single Business Application Detail
  console.log('5. Testing Business Detail (/api/onboarding/business/biz-app-101)...');
  const bizDetailRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/business/biz-app-101',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('Business Detail Status:', bizDetailRes.status);
  console.log('Entity Name:', bizDetailRes.body.application?.legalEntityName);
  console.log('Reviews Count:', bizDetailRes.body.application?.reviews?.length);

  if (bizDetailRes.status !== 200 || !bizDetailRes.body.application) {
    throw new Error('Business detail view failed!');
  }

  // 6. Test Single Leadership Application Detail
  console.log('6. Testing Leadership Detail (/api/onboarding/leadership/lead-app-201)...');
  const leadDetailRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/leadership/lead-app-201',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('Leadership Detail Status:', leadDetailRes.status);
  console.log('Candidate Name:', leadDetailRes.body.application?.fullName);

  if (leadDetailRes.status !== 200 || !leadDetailRes.body.application) {
    throw new Error('Leadership detail view failed!');
  }

  // 7. Test Review Action & Persistence (Test on biz-app-102 which is currently under_review)
  console.log('7. Testing Review Status Action (PATCH /api/onboarding/business/biz-app-102)...');
  const patchRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/business/biz-app-102',
    method: 'PATCH',
    headers: {
      'Cookie': tokenCookie,
      'Content-Type': 'application/json'
    }
  }, {
    status: 'ACCEPTED',
    note: 'Automated verification test approval'
  });
  console.log('PATCH Status:', patchRes.status);
  console.log('PATCH Response:', patchRes.body);

  if (patchRes.status !== 200 || !patchRes.body.success) {
    throw new Error('Review status action failed!');
  }

  // Re-fetch detail to verify persistence
  const verifyPatch = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/business/biz-app-102',
    method: 'GET',
    headers: { 'Cookie': tokenCookie }
  });
  console.log('Verified Updated Status:', verifyPatch.body.application?.status);
  console.log('Verified Latest Review Note:', verifyPatch.body.application?.reviews?.[0]?.reviewNote);

  if (verifyPatch.body.application?.status !== 'ACCEPTED') {
    throw new Error('Status update persistence check failed!');
  }

  // Revert status back to PENDING so existing data remains clean
  console.log('8. Reverting biz-app-102 back to PENDING...');
  await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/onboarding/business/biz-app-102',
    method: 'PATCH',
    headers: {
      'Cookie': tokenCookie,
      'Content-Type': 'application/json'
    }
  }, {
    status: 'PENDING',
    note: 'Reverted after automated verification'
  });

  console.log('ALL_API_TESTS_PASSED: PASS');
}

testApi().catch(err => {
  console.error('API_TEST_FAILED:', err);
  process.exit(1);
});
