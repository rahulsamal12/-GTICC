import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'GTICC Privacy Policy | Global Trade and Investment Collaboration Consortium';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="site-content">
      <div className="container-fluid">
        <div className="item-efftect">
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
        </div>
      </div>

      {/* Banner */}
      <section>
        <div
          className="inner-banner bg-holder rounded-section jarallax"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(8, 19, 33, 0.94), rgba(6, 14, 24, 0.97)), url("/abou_banner.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="title">Privacy Policy</h1>
                <ul className="breadcrumb mb-0 mt-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/about-us">About Us</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    <span>Privacy Policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <div className="content-wrapper">
        <section className="space-ptb">
          <div className="container">
            {/* Top Navigation Row */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <Link
                to="/about-us"
                className="btn btn-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  fontSize: '14px',
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to About GTICC</span>
              </Link>
              <span
                style={{
                  color: '#C8A24A',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  background: 'rgba(200, 162, 74, 0.1)',
                  border: '1px solid rgba(200, 162, 74, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                }}
              >
                Last Updated: November 3, 2026
              </span>
            </div>

            {/* Document Card Container */}
            <div
              className="gticc-card"
              style={{
                background: '#0D1B2A',
                border: '1px solid #233147',
                borderRadius: '12px',
                padding: '40px 36px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
                color: '#F5F5F5',
              }}
            >
              <div className="border-bottom pb-4 mb-4" style={{ borderColor: 'rgba(200, 162, 74, 0.25) !important' }}>
                <span
                  style={{
                    color: '#C8A24A',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  GLOBAL TRADE AND INVESTMENT COLLABORATION CONSORTIUM (GTICC)
                </span>
                <h2 style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
                  GTICC Privacy Policy
                </h2>
                <p style={{ color: '#AAB4C3', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  Global Trade and Investment Collaboration Consortium (&ldquo;GTICC&rdquo;, &ldquo;the Chamber&rdquo;, &ldquo;we&rdquo;) respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, share, and protect personal information in connection with our services (&ldquo;Services&rdquo;).
                </p>
              </div>

              {/* Table of Contents */}
              <div
                style={{
                  background: '#132238',
                  border: '1px solid #233147',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '40px',
                }}
              >
                <h5 style={{ color: '#C8A24A', fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>
                  <i className="fa-solid fa-list-ol me-2"></i>Table of Contents
                </h5>
                <ol style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.9', margin: 0, paddingLeft: '22px' }}>
                  <li><a href="#privacy-sec-1" style={{ color: '#E2E8F0', textDecoration: 'none' }}>About Us and this Policy</a></li>
                  <li><a href="#privacy-sec-2" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Information We Collect</a></li>
                  <li><a href="#privacy-sec-3" style={{ color: '#E2E8F0', textDecoration: 'none' }}>How we use Information, and your consent</a></li>
                  <li><a href="#privacy-sec-4" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Member Directory and Public information</a></li>
                  <li><a href="#privacy-sec-5" style={{ color: '#E2E8F0', textDecoration: 'none' }}>When we Share Your Information</a></li>
                  <li><a href="#privacy-sec-6" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Cookies, analytics and electronic messages</a></li>
                  <li><a href="#privacy-sec-7" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Retention, security and breaches</a></li>
                  <li><a href="#privacy-sec-8" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Your rights, minors, changes and contact</a></li>
                  <li><a href="#privacy-sec-9" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Contact Us</a></li>
                </ol>
              </div>

              {/* Section 1 */}
              <div id="privacy-sec-1" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  1. About Us and this policy
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  Global Trade and Investment Collaboration Consortium is a not-for-profit chamber of commerce that connects, promotes and advocates for businesses and professionals in the Greater Toronto Area. We handle personal information only to serve our members, run our programs and pursue our mission.
                </p>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  This policy applies to personal information we collect through <a href="https://gticc.com" style={{ color: '#C8A24A', textDecoration: 'underline' }}>https://gticc.com</a>, our member directory, events, emails, social media pages and in-person interactions. It does not cover information our member businesses collect independently, or third-party websites linked from our site.
                </p>
                <div
                  style={{
                    background: '#132238',
                    borderLeft: '3px solid #C8A24A',
                    padding: '16px 20px',
                    borderRadius: '4px',
                  }}
                >
                  <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: '0 0 8px 0' }}>
                    <strong>Accountability.</strong> GTICC follows the ten fair information principles of the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial laws. Our Privacy Officer is responsible for this policy:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.8' }}>
                    <li><strong>Name &amp; title:</strong> Sulabh Kumar, Director</li>
                    <li><strong>Email:</strong> <a href="mailto:contact@gticc.com" style={{ color: '#C8A24A' }}>contact@gticc.com</a></li>
                    <li><strong>Mail:</strong> 125 Village Green Sq., Toronto, Canada</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div id="privacy-sec-2" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  2. Information we collect
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
                  We collect only what we need for the purposes in Section 3.
                </p>
                <div className="table-responsive mb-4" style={{ border: '1px solid #233147', borderRadius: '8px', overflow: 'hidden' }}>
                  <table className="table table-dark table-striped mb-0" style={{ background: '#132238', color: '#E2E8F0', fontSize: '14.5px' }}>
                    <thead>
                      <tr style={{ background: '#1c2d44', color: '#C8A24A', borderBottom: '2px solid #C8A24A' }}>
                        <th style={{ padding: '14px 18px', width: '32%', fontWeight: 700 }}>Source</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Membership applications and renewals
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Name, title, business name, business address, phone, email, website, industry, business size, membership tier, billing contact
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Member directory profiles
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Business description, logo, photos, hours, service areas, social media links, contact person details you choose to publish
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Events and programs
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Registration details, dietary or accessibility needs, attendance, photos and video taken at events
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Payments
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Transaction amount, date and status. Card numbers are handled by our payment processor, [processor name], and are not stored by GTICC
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Communications
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Messages, enquiries, survey responses, feedback, newsletter preferences
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Advocacy and committees
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          Views you share in consultations, committee participation, sponsorship and volunteer details
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', fontWeight: 600, color: '#FFFFFF' }}>
                          Website use
                        </td>
                        <td style={{ padding: '14px 18px', lineHeight: '1.7' }}>
                          IP address, browser and device type, pages visited, referring site, and cookie data (see Section 6)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>
                  We do not knowingly collect sensitive information such as health, financial account or government ID numbers, except where a specific program requires it and you are told why at the time.
                </p>
              </div>

              {/* Section 3 */}
              <div id="privacy-sec-3" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  3. How we use information, and your consent
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '12px' }}>
                  We use personal information to carry out the Chamber&apos;s objectives:
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Serve members:</strong> process applications, renewals and payments; manage member accounts and benefits.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Promote member businesses:</strong> publish and maintain the member directory, and feature members in newsletters, social media and spotlights.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Connect the business community:</strong> organize networking events, B2B introductions, trade missions, mentorship and education programs.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Advocate:</strong> gather member views on policy issues and represent the business community to governments and other bodies. Views are reported in aggregate unless you agree to be named.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Communicate:</strong> send operational notices, event information and, with consent, newsletters and promotions.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Improve and protect:</strong> analyze website use, plan programs, prevent fraud and meet legal, tax and audit obligations.
                  </li>
                </ul>
                <div
                  style={{
                    background: '#132238',
                    border: '1px solid #233147',
                    borderRadius: '8px',
                    padding: '18px 20px',
                  }}
                >
                  <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                    <strong>Consent:</strong> We collect, use and disclose personal information with your knowledge and consent. Consent is express when you tick a box or sign up. It is implied when the purpose is obvious, such as using your registration details to admit you to an event. You may withdraw consent at any time, subject to legal or contractual limits, by contacting the Privacy Officer. Withdrawal may mean we cannot provide some services, such as a directory listing.
                  </p>
                  <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                    We will ask for fresh consent before using information for a new purpose.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="privacy-sec-4" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  4. Member Directory and Public information
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  The member directory exists to make GTICC members easy to find and do business with, so profile content is public by design.
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Public by default:</strong> business name, logo, description, category, city, website and business contact details you enter.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Private by default:</strong> personal mobile numbers, home addresses, billing details and membership payment history. These are never shown in the directory.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Your control:</strong> you can edit or hide optional profile fields at any time through your account or by contacting us. Information about an individual employee is published only with that person&apos;s consent.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Reviews and comments:</strong> if the directory allows reviews, the reviewer&apos;s display name and review are public. See the Terms of Use for content rules.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Event photos:</strong> photos and video taken at public GTICC events may appear on our website and social media. Tell staff at the event or email us if you prefer not to be featured, and we will remove identifiable images on request where practical.
                  </li>
                </ul>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  We do not sell or rent the directory or member contact lists. Automated scraping of the directory for marketing is prohibited by our Terms of Use.
                </p>
              </div>

              {/* Section 5 */}
              <div id="privacy-sec-5" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  5. When we share information
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  GTICC does not sell personal information. We share it only as follows:
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    Service providers who host our website, process payments, send email, manage events or keep our books. They are bound by contract to use the information only for our services and to protect it.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Event partners and sponsors, limited to name, title and business name on attendee lists, and only where you were told at registration and could opt out.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Affiliated chamber networks such as [Ontario Chamber of Commerce / Canadian Chamber of Commerce, if applicable], where membership gives access to their benefit programs and you have agreed.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Governments and public bodies, only in aggregate or anonymized form for advocacy, unless you agree to be identified.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Legal reasons: to comply with law, a court order or a lawful request, to protect rights and safety.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Professional advisors.</strong> Our lawyers, auditors and IT security advisors may see personal information when needed for compliance, audits or security incidents, under confidentiality obligations.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Restructuring.</strong> If GTICC merges with, or transfers its activities to, another organization, personal information may be transferred under equivalent protections. We will notify members in advance and give you the chance to withdraw consent or close your account first, subject to legal obligations.
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    <strong>Storage outside Canada.</strong> [Where available, we host member data on servers in Canada.] Some providers, such as analytics tools, may store or process information outside Canada, for example in the United States. Information there is subject to that country&apos;s laws and may be accessed by its authorities. We choose providers with safeguards comparable to Canadian standards. Current providers include: [list hosting, email and payment providers].
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div id="privacy-sec-6" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  6. Cookies, analytics and electronic messages
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                  <strong>Cookies.</strong> We do not use cookies to sell advertising. We use three kinds:
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '14px' }}>
                  <li style={{ marginBottom: '6px' }}><strong>Essential:</strong> keep you logged in and the site secure. The site does not work properly without them.</li>
                  <li style={{ marginBottom: '6px' }}><strong>Preference:</strong> remember settings such as language or directory filters.</li>
                  <li style={{ marginBottom: '6px' }}><strong>Analytics:</strong> tools such as [Google Analytics / Microsoft Clarity] show how the site is used. We configure them to avoid collecting names or contact details.</li>
                </ul>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  You can block or delete cookies in your browser, use our cookie preference banner [if available], or use the analytics provider&apos;s opt-out tool. Opting out of analytics does not affect your membership or directory listing.
                </p>
                <div
                  style={{
                    background: '#132238',
                    border: '1px solid #233147',
                    borderRadius: '8px',
                    padding: '18px 20px',
                  }}
                >
                  <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                    <strong>Email and texts:</strong> We send commercial electronic messages, such as newsletters and event promotions, only with your consent as required by Canada&apos;s Anti-Spam Legislation (CASL):
                  </p>
                  <ul style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.7', margin: '0 0 10px 0', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '6px' }}>Express consent when you subscribe or tick an opt-in box.</li>
                    <li style={{ marginBottom: '6px' }}>Implied consent while you are a member and for the period CASL allows after membership ends or after you enquire about our services.</li>
                  </ul>
                  <p style={{ color: '#E2E8F0', fontSize: '14.5px', lineHeight: '1.7', margin: 0 }}>
                    Every message identifies GTICC, includes our mailing address and has a working unsubscribe link. Unsubscribe requests are processed within 10 business days. Operational messages, such as renewal notices and event confirmations, will still be sent.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="privacy-sec-7" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  7. Retention, security and breaches
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  <strong>Retention:</strong> We keep personal information only as long as needed for the purposes collected, then delete or anonymize it:
                </p>
                <div className="table-responsive mb-4" style={{ border: '1px solid #233147', borderRadius: '8px', overflow: 'hidden' }}>
                  <table className="table table-dark table-striped mb-0" style={{ background: '#132238', color: '#E2E8F0', fontSize: '14.5px' }}>
                    <thead>
                      <tr style={{ background: '#1c2d44', color: '#C8A24A', borderBottom: '2px solid #C8A24A' }}>
                        <th style={{ padding: '14px 18px', width: '45%', fontWeight: 700 }}>Record</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Kept for (Purpose)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Active member records</td>
                        <td style={{ padding: '14px 18px' }}>Length of membership</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Former member records</td>
                        <td style={{ padding: '14px 18px' }}>2 years after membership ends</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Financial and payment records</td>
                        <td style={{ padding: '14px 18px' }}>7 years, for tax and audit</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Event registrations</td>
                        <td style={{ padding: '14px 18px' }}>2 years after the event</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Newsletter-only contacts</td>
                        <td style={{ padding: '14px 18px' }}>Until you unsubscribe</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>Website analytics</td>
                        <td style={{ padding: '14px 18px' }}>Up to 26 months per visitor; aggregated statistics may be kept indefinitely</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    background: '#132238',
                    border: '1px solid #233147',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                    <strong>Security.</strong> We use safeguards suited to the sensitivity of the information:
                  </p>
                  <ul style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.7', margin: '0 0 12px 0', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '6px' }}><strong>Technical:</strong> encryption in transit (HTTPS) and, where our providers support it, at rest; multi-factor authentication on admin accounts; regular backups.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Administrative:</strong> access limited to staff and volunteers who need it; privacy training; confidentiality commitments from staff, directors and volunteers; periodic access reviews.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Physical:</strong> paper records kept in locked storage; hosting in providers&apos; secured data centres.</li>
                  </ul>
                  <p style={{ color: '#AAB4C3', fontSize: '14px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                    No system is completely secure, but we review our safeguards regularly and respond promptly to incidents.
                  </p>
                </div>

                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  <strong>Breaches.</strong> If a breach creates a real risk of significant harm, we will notify affected individuals and the Office of the Privacy Commissioner of Canada as soon as feasible, and keep a record of the breach as required under the applicable provisions of PIPEDA.
                </p>
              </div>

              {/* Section 8 */}
              <div id="privacy-sec-8" className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  8. Your rights, minors, changes and contact
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                  <strong>Your rights:</strong> Under PIPEDA and applicable Provincial laws, you may:
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '14px' }}>
                  <li style={{ marginBottom: '6px' }}>see the personal information we hold about you, and learn how it has been used and shared;</li>
                  <li style={{ marginBottom: '6px' }}>correct inaccurate or incomplete information, most of which you can update yourself in your member account;</li>
                  <li style={{ marginBottom: '6px' }}>withdraw consent or opt out of marketing messages;</li>
                  <li style={{ marginBottom: '6px' }}>ask us to delete your information, subject to legal and record-keeping requirements;</li>
                  <li style={{ marginBottom: '6px' }}>request a copy of your directory profile and member record in a common electronic format.</li>
                </ul>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  Send requests to the Privacy Officer. We will respond within 30 days and may ask you to verify your identity. Requests are free; for repeated or unusually large requests we may charge a reasonable fee, telling you the amount first.
                </p>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  <strong>Minors.</strong> Our services are for businesses and adults. We do not knowingly collect information from anyone under 18 without a parent&apos;s or guardian&apos;s consent, for example in youth entrepreneurship programs. If we learn we have collected a minor&apos;s information without that consent, we will delete it promptly.
                </p>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  <strong>Changes.</strong> We may update this policy as our programs or the law change. The effective date below shows the latest version. Material changes will be posted on the site and, for members, sent by email.
                </p>
              </div>

              {/* Section 9 / Contact Us */}
              <div
                id="privacy-sec-9"
                style={{
                  background: 'rgba(200, 162, 74, 0.08)',
                  border: '1px solid rgba(200, 162, 74, 0.3)',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
                  9. Contact Us
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  Contact our Privacy Officer first at <a href="mailto:contact@gticc.com" style={{ color: '#C8A24A', textDecoration: 'underline' }}>contact@gticc.com</a> or 125 Village Green Sq., Toronto, Canada. If you are not satisfied, you may contact the Office of the Privacy Commissioner of Canada at 1-800-282-1376.
                </p>
              </div>

              {/* Bottom Back Button */}
              <div className="mt-5 text-center">
                <Link
                  to="/about-us"
                  className="btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 30px',
                    fontSize: '15px',
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to About GTICC</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

