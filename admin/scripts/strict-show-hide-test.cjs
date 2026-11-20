const http = require('http');

async function runTestSuite() {
  console.log('=== STRICT GTICC SHOW/HIDE TEST SUITE ===');

  // Login as Admin
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
  console.log('Admin login successful.');

  const testRecords = [
    {
      name: 'raj kumar',
      id: 'a1b2e943-bcf2-45bf-b62c-e6e61e8b40f9',
    },
    {
      name: 'Apex Global Quantum Dynamics',
      id: 'bbf9b534-d605-4be9-aacc-4ff719de66f0',
    },
    {
      name: 'Audit Corp 1794825379456',
      id: '02d9f126-4956-499e-9a21-29625a6a65da',
    }
  ];

  async function getPublicDirectoryMembers() {
    return new Promise((resolve) => {
      http.get('http://localhost:5173/api/member-directory', (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data).members || []);
          } catch {
            resolve([]);
          }
        });
      });
    });
  }

  async function setVisibility(appId, visible) {
    const patchData = JSON.stringify({ visible });
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/member-directory/${appId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(patchData),
          'Cookie': adminCookie
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      });
      req.write(patchData);
      req.end();
    });
  }

  for (const record of testRecords) {
    console.log(`\n======================================================`);
    console.log(`Testing record: ${record.name} (ID: ${record.id})`);
    console.log(`======================================================`);

    // 1. Set to Show in Directory (visible = true)
    console.log(`1. Setting visible = true (Show in Directory)...`);
    const showRes = await setVisibility(record.id, true);
    console.log(`   PATCH response:`, showRes.status, showRes.body.message);

    // Verify in public directory
    let members = await getPublicDirectoryMembers();
    let found = members.find(m => m.applicationId === record.id || m.org_name.toLowerCase().trim() === record.name.toLowerCase().trim());
    console.log(`   Found in public directory after Show?:`, !!found);
    if (!found) {
      console.error(`   FAILURE: ${record.name} did not appear in public directory!`);
      process.exit(1);
    } else {
      console.log(`   Card Data:`, {
        org: found.org_name,
        rep: found.member_name,
        location: `${found.city}, ${found.country}`,
        sector: found.sector
      });
    }

    // 2. Set to Hide from Directory (visible = false)
    console.log(`2. Setting visible = false (Hide from Directory)...`);
    const hideRes = await setVisibility(record.id, false);
    console.log(`   PATCH response:`, hideRes.status, hideRes.body.message);

    // Verify removed from public directory
    members = await getPublicDirectoryMembers();
    found = members.find(m => m.applicationId === record.id || m.org_name.toLowerCase().trim() === record.name.toLowerCase().trim());
    console.log(`   Found in public directory after Hide?:`, !!found);
    if (found) {
      console.error(`   FAILURE: ${record.name} is still visible in public directory after Hide!`);
      process.exit(1);
    }

    // 3. Set to Show in Directory again (visible = true) to confirm re-appearance
    console.log(`3. Setting visible = true again (Show in Directory)...`);
    await setVisibility(record.id, true);
    members = await getPublicDirectoryMembers();
    found = members.find(m => m.applicationId === record.id || m.org_name.toLowerCase().trim() === record.name.toLowerCase().trim());
    console.log(`   Re-appeared in public directory?:`, !!found);
    if (!found) {
      console.error(`   FAILURE: ${record.name} failed to re-appear!`);
      process.exit(1);
    }
  }

  console.log(`\n======================================================`);
  console.log(`ALL 3 TEST APPLICATIONS VERIFIED ACCORDING TO REQUIREMENTS!`);
  console.log(`======================================================`);
}

runTestSuite().catch(console.error);
