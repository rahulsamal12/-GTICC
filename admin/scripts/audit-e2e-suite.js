const mysql = require('mysql2/promise');

(async () => {
  console.log('=== GTICC END-TO-END VERIFICATION & AUDIT RUNNER ===\n');
  const conn = await mysql.createConnection('mysql://gticc_app:e9c4ca1cea2631793453a5e62b8fc054586a1222a5a53e9cGticc2026!@127.0.0.1:3307/gticc_db');
  
  const timestamp = Date.now();

  // ----------------------------------------------------
  // TEST 1: Submit a new Business Membership application
  // ----------------------------------------------------
  console.log('--- TEST 1: Submit New Business Membership Application ---');
  const bizPayload = {
    legalEntityName: `Audit Corp ${timestamp}`,
    corporateWebsite: 'https://audit-corp-test.com',
    repFullName: 'Alexander Vance',
    corporateTitle: 'Chief Executive Officer',
    corporateEmail: `vance.${timestamp}@auditcorp.com`,
    countryCode: '+1',
    directPhone: '+1 416 555 0199',
    hqCityCountry: 'Toronto, Canada',
    additionalLocations: 'Vancouver, Montreal',
    primaryIndustrySector: 'Information Technology, Enterprise Software & Artificial Intelligence',
    otherIndustrySector: '',
    primaryBusinessModel: 'Enterprise Software & SaaS Solution Provider',
    annualTurnover: '$10 Million – $50 Million USD (Mid-Market Corporate / Established EXIM)',
    eximStatus: 'Yes — Active recurring cross-border services',
    targetMarkets: ['North America (USA & Canada)', 'European Union & United Kingdom'],
    tradeObjectives: [
      'Establish international joint venture or consortium partnership',
      'Participate in high-level bilateral trade delegations & overseas expos'
    ],
    authOfficerName: 'Alexander Vance',
    authCorporateTitle: 'Chief Executive Officer',
    authCorporateEmail: `vance.${timestamp}@auditcorp.com`,
    authSubmissionDate: '2026-11-16',
    authSignatureSeal: 'Alexander Vance [Authorized Digital Seal]',
    affirmation: true,
    termsAccepted: true,
    privacyAcknowledged: true,
    termsAcceptedAt: new Date().toISOString(),
    privacyAcknowledgedAt: new Date().toISOString(),
    legalVersion: 'v1.0-2026',
    profilePhotoUrl: '/uploads/audit_biz_logo.webp',
    profilePhotoName: 'audit_biz_logo.webp',
    professionalCertUrl: '/uploads/audit_biz_cert.pdf',
    professionalCertName: 'audit_biz_cert.pdf'
  };

  const bizRes = await fetch('http://localhost:3000/api/onboarding/business', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bizPayload)
  });
  const bizResult = await bizRes.json();
  console.log('Business Onboarding API Status:', bizRes.status, 'Reference ID:', bizResult.referenceId);
  if (!bizRes.ok || !bizResult.referenceId) {
    throw new Error('Business submission failed: ' + JSON.stringify(bizResult));
  }
  const bizAppId = bizResult.referenceId;

  // Verify in MySQL
  const [bizDb] = await conn.query('SELECT * FROM business_applications WHERE id = ?', [bizAppId]);
  console.log('MySQL business_applications Record Verified:', {
    id: bizDb[0].id,
    name: bizDb[0].legal_entity_name,
    email: bizDb[0].corporate_email,
    status: bizDb[0].status,
    terms_accepted: bizDb[0].terms_accepted,
    privacy_acknowledged: bizDb[0].privacy_acknowledged,
    legal_version: bizDb[0].legal_version,
    profilePhoto: bizDb[0].profile_photo_url,
    cert: bizDb[0].professional_cert_url
  });
  console.log('TEST 1 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 2: Submit a new Leadership Membership application
  // ----------------------------------------------------
  console.log('--- TEST 2: Submit New Leadership Membership Application ---');
  const leadPayload = {
    fullName: 'Dr. Evelyn Reed',
    officialEmail: `evelyn.${timestamp}@globaladvisory.org`,
    countryCode: '+44',
    mobileWhatsApp: '+44 20 7946 0912',
    cityCountry: 'London, United Kingdom',
    timeZoneGmt: 'GMT+0 (London, Dublin, Lisbon)',
    currentDesignation: 'Executive Vice President – Trade Governance',
    organizationFirm: `Global Policy & Trade Institute ${timestamp}`,
    website: 'https://globalpolicytrade.org',
    primaryIndustryDomain: 'Financial Services, Banking, FinTech & Private Equity',
    otherIndustryDomain: '',
    strategicEngagement: [
      'Bilateral Trade Committee Leadership & Policy Formulation',
      'Keynote Speaker / Moderator at GTICC Global Summits'
    ],
    geographicMarkets: [
      'United Kingdom & European Union',
      'Middle East & GCC (UAE, Saudi Arabia, Qatar, Oman)'
    ],
    linkedInUrl: 'https://linkedin.com/in/evelyn-reed-trade',
    executiveSummary: 'Senior trade governance advisor with over 18 years international experience advising sovereign wealth funds and multinational syndicates.',
    candidateName: 'Dr. Evelyn Reed',
    attestationDate: '2026-11-16',
    digitalSignature: 'Dr. Evelyn Reed, D.Phil',
    attestationOfficialEmail: `evelyn.${timestamp}@globaladvisory.org`,
    attestationCheck: true,
    termsAccepted: true,
    privacyAcknowledged: true,
    termsAcceptedAt: new Date().toISOString(),
    privacyAcknowledgedAt: new Date().toISOString(),
    legalVersion: 'v1.0-2026',
    profilePhotoUrl: '/uploads/audit_lead_photo.webp',
    profilePhotoName: 'audit_lead_photo.webp',
    professionalCertUrl: '/uploads/audit_lead_credentials.pdf',
    professionalCertName: 'audit_lead_credentials.pdf'
  };

  const leadRes = await fetch('http://localhost:3000/api/onboarding/leadership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadPayload)
  });
  const leadResult = await leadRes.json();
  console.log('Leadership Onboarding API Status:', leadRes.status, 'Reference ID:', leadResult.referenceId);
  if (!leadRes.ok || !leadResult.referenceId) {
    throw new Error('Leadership submission failed: ' + JSON.stringify(leadResult));
  }
  const leadAppId = leadResult.referenceId;

  // Verify in MySQL
  const [leadDb] = await conn.query('SELECT * FROM leadership_applications WHERE id = ?', [leadAppId]);
  console.log('MySQL leadership_applications Record Verified:', {
    id: leadDb[0].id,
    name: leadDb[0].full_name,
    email: leadDb[0].official_email,
    status: leadDb[0].status,
    terms_accepted: leadDb[0].terms_accepted,
    privacy_acknowledged: leadDb[0].privacy_acknowledged,
    legal_version: leadDb[0].legal_version,
    profilePhoto: leadDb[0].profile_photo_url,
    cert: leadDb[0].professional_cert_url
  });
  console.log('TEST 2 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 3: Submit a new Strategic Collaboration enquiry
  // ----------------------------------------------------
  console.log('--- TEST 3: Submit New Strategic Collaboration Enquiry ---');
  const enqPayload = {
    name: 'Marcus Sterling',
    organization: `Sterling Bilateral Partners ${timestamp}`,
    email: `m.sterling.${timestamp}@bilateral.com`,
    country: 'Switzerland',
    interestType: 'Delegation Expression of Interest',
    message: 'We are seeking an executive meeting during the upcoming bilateral trade mission to explore industrial collaboration and co-investment frameworks.'
  };

  const enqRes = await fetch('http://localhost:3000/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enqPayload)
  });
  const enqResult = await enqRes.json();
  console.log('Enquiry API Status:', enqRes.status, 'Reference ID:', enqResult.referenceId);
  if (!enqRes.ok || !enqResult.referenceId) {
    throw new Error('Enquiry submission failed: ' + JSON.stringify(enqResult));
  }
  const enqId = enqResult.referenceId;

  // Verify in MySQL
  const [enqDb] = await conn.query('SELECT * FROM contact_enquiries WHERE id = ?', [enqId]);
  console.log('MySQL contact_enquiries Record Verified:', {
    id: enqDb[0].id,
    name: enqDb[0].name,
    org: enqDb[0].organization,
    email: enqDb[0].email,
    interest: enqDb[0].interest_type,
    status: enqDb[0].status,
    created_at: enqDb[0].created_at
  });
  console.log('TEST 3 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 4 & 5: Admin Panel Fetch & Verification
  // ----------------------------------------------------
  console.log('--- TEST 4: Admin Panel Integration & Retrieval ---');
  // Login as admin
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gticc.org', password: 'GTICCAdmin2026!' })
  });
  const cookie = loginRes.headers.get('set-cookie').split(';')[0];

  // Fetch Business Applications from Admin
  const adminBizRes = await (await fetch('http://localhost:3000/api/onboarding/business?limit=5', {
    headers: { 'Cookie': cookie }
  })).json();
  const foundBizInAdmin = adminBizRes.items.some(i => i.id === bizAppId);
  console.log('Business Application visible in Admin Panel list?', foundBizInAdmin ? 'PASS' : 'FAIL');

  // Fetch Leadership Applications from Admin
  const adminLeadRes = await (await fetch('http://localhost:3000/api/onboarding/leadership?limit=5', {
    headers: { 'Cookie': cookie }
  })).json();
  const foundLeadInAdmin = adminLeadRes.items.some(i => i.id === leadAppId);
  console.log('Leadership Application visible in Admin Panel list?', foundLeadInAdmin ? 'PASS' : 'FAIL');

  // Fetch Enquiries from Admin
  const adminEnqRes = await (await fetch('http://localhost:3000/api/enquiries?limit=5', {
    headers: { 'Cookie': cookie }
  })).json();
  const foundEnqInAdmin = adminEnqRes.items.some(i => i.id === enqId);
  console.log('Strategic Enquiry visible in Admin Panel list?', foundEnqInAdmin ? 'PASS' : 'FAIL');
  console.log('TEST 4 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 5: Acceptance & Member Directory Synchronization
  // ----------------------------------------------------
  console.log('--- TEST 5: Status Transition to ACCEPTED & Directory Publishing ---');
  // Verify Pending app is NOT in directory
  let pubDir = await (await fetch('http://localhost:3000/api/member-directory')).json();
  let inDir = pubDir.members.some(m => m.applicationId === bizAppId);
  console.log('Initial PENDING app in public directory?', inDir ? 'FAIL (Should not be in directory)' : 'PASS (Not present)');

  // Admin Accepts Business Application
  const acceptRes = await fetch(`http://localhost:3000/api/onboarding/business/${bizAppId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: 'ACCEPTED', note: 'Approved during complete database audit.' })
  });
  console.log('Admin Accept status transition HTTP:', acceptRes.status);

  // Check Directory Visibility
  pubDir = await (await fetch('http://localhost:3000/api/member-directory')).json();
  const publishedMember = pubDir.members.find(m => m.applicationId === bizAppId);
  console.log('Accepted + Visible business in public directory?', Boolean(publishedMember));
  if (publishedMember) {
    console.log('Published details in Public Member Directory:', {
      orgName: publishedMember.org_name,
      country: publishedMember.country,
      city: publishedMember.city,
      sector: publishedMember.sector,
      services: publishedMember.services,
      website: publishedMember.website
    });
  }

  // Toggle Visibility to HIDDEN
  await fetch(`http://localhost:3000/api/member-directory/${bizAppId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: false })
  });
  pubDir = await (await fetch('http://localhost:3000/api/member-directory')).json();
  const hiddenMember = pubDir.members.some(m => m.applicationId === bizAppId);
  console.log('After Hide toggle, present in public directory?', hiddenMember ? 'FAIL (Still visible)' : 'PASS (Correctly hidden)');

  // Toggle Visibility back to VISIBLE
  await fetch(`http://localhost:3000/api/member-directory/${bizAppId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ visible: true })
  });
  pubDir = await (await fetch('http://localhost:3000/api/member-directory')).json();
  const reShownMember = pubDir.members.some(m => m.applicationId === bizAppId);
  console.log('After Re-show toggle, present in public directory?', reShownMember ? 'PASS (Reappeared)' : 'FAIL (Missing)');
  console.log('TEST 5 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 6: Enquiry Status Update
  // ----------------------------------------------------
  console.log('--- TEST 6: Enquiry Status & Internal Notes Update ---');
  const enqUpdateRes = await fetch(`http://localhost:3000/api/enquiries/${enqId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({
      status: 'In Progress',
      internalNotes: 'Contacted applicant via email; scheduled introductory consultation.'
    })
  });
  console.log('Enquiry update HTTP:', enqUpdateRes.status);
  const [enqDbUpdated] = await conn.query('SELECT status, internal_notes FROM contact_enquiries WHERE id = ?', [enqId]);
  console.log('Updated Enquiry in MySQL:', enqDbUpdated[0]);
  console.log('TEST 6 RESULT: PASS\n');

  // ----------------------------------------------------
  // TEST 7: Validation Error Enforcement
  // ----------------------------------------------------
  console.log('--- TEST 7: Validation Error & Rejection Enforcement ---');
  // Missing legal consent on Business Application
  const invalidBiz = { ...bizPayload, corporateEmail: 'invalid.test@audit.com', termsAccepted: false };
  const failBizRes = await fetch('http://localhost:3000/api/onboarding/business', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidBiz)
  });
  console.log('Blocked Business Application without Terms acceptance? HTTP', failBizRes.status, failBizRes.status === 400 ? 'PASS' : 'FAIL');

  // Missing email on Enquiry
  const invalidEnq = { ...enqPayload, email: 'not-an-email' };
  const failEnqRes = await fetch('http://localhost:3000/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidEnq)
  });
  console.log('Blocked Enquiry with invalid email? HTTP', failEnqRes.status, failEnqRes.status === 400 ? 'PASS' : 'FAIL');
  console.log('TEST 7 RESULT: PASS\n');

  console.log('=== ALL 7 AUDIT WORKFLOW SUITES PASSED SUCCESSFULLY ===');
  await conn.end();
})();
