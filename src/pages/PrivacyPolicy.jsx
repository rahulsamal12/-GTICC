import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'GTICC Privacy Policy | Global Trade and Investment Collaboration Consortium';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="site-content gticc-legal-page">
      {/* Minimal Top Header - Clean, professional, no yellow/gold banner box */}
      <header className="gticc-legal-header">
        <div className="container">
          <span className="gticc-legal-kicker">Data Protection &amp; Governance</span>
          <h1 className="gticc-legal-title">Privacy Policy</h1>
          <p className="gticc-legal-subtitle">
            How Global Trade and Investment Collaboration Consortium collects, protects, manages, and uses member and visitor information.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="content-wrapper">
        <div className="container">
          {/* Sub Navigation Bar */}
          <div className="gticc-legal-nav-bar">
            <Link to="/about-us" className="gticc-legal-btn">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to About GTICC</span>
            </Link>
            <span className="gticc-legal-badge">
              <i className="fa-regular fa-clock"></i>
              Last Updated: November 3, 2026
            </span>
          </div>

          {/* Document Card Container */}
          <article className="gticc-legal-card">
            <div className="gticc-legal-card-header">
              <span className="gticc-legal-kicker" style={{ marginBottom: '6px' }}>
                GLOBAL TRADE AND INVESTMENT COLLABORATION CONSORTIUM (GTICC)
              </span>
              <h2>GTICC Privacy Policy</h2>
              <p className="gticc-legal-lead">
                Global Trade and Investment Collaboration Consortium (&ldquo;GTICC&rdquo;, &ldquo;the Chamber&rdquo;, &ldquo;we&rdquo;) respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, share, and protect personal information in connection with our services (&ldquo;Services&rdquo;).
              </p>
            </div>

            {/* Table of Contents */}
            <nav aria-label="Table of contents" className="gticc-legal-toc">
              <h4 className="gticc-legal-toc-title">
                <i className="fa-solid fa-list-ol"></i>
                <span>Table of Contents</span>
              </h4>
              <ol>
                <li><a href="#privacy-sec-1">About Us and this Policy</a></li>
                <li><a href="#privacy-sec-2">Information We Collect</a></li>
                <li><a href="#privacy-sec-3">How we use Information, and your consent</a></li>
                <li><a href="#privacy-sec-4">Member Directory and Public information</a></li>
                <li><a href="#privacy-sec-5">When we Share Your Information</a></li>
                <li><a href="#privacy-sec-6">Cookies, analytics and electronic messages</a></li>
                <li><a href="#privacy-sec-7">Retention, security and breaches</a></li>
                <li><a href="#privacy-sec-8">Your rights, minors, changes and contact</a></li>
                <li><a href="#privacy-sec-9">Contact Us</a></li>
              </ol>
            </nav>

            {/* Section 1 */}
            <section id="privacy-sec-1" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">1.</span>
                <span>About Us and this policy</span>
              </h3>
              <p>
                Global Trade and Investment Collaboration Consortium is a not-for-profit chamber of commerce that connects, promotes and advocates for businesses and professionals in the Greater Toronto Area. We handle personal information only to serve our members, run our programs and pursue our mission.
              </p>
              <p>
                This policy applies to personal information we collect through <a href="https://gticc.com">https://gticc.com</a>, our member directory, events, emails, social media pages and in-person interactions. It does not cover information our member businesses collect independently, or third-party websites linked from our site.
              </p>
              <div className="gticc-legal-box">
                <p style={{ margin: '0 0 8px 0' }}>
                  <strong>Accountability.</strong> GTICC follows the ten fair information principles of the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial laws. Our Privacy Officer is responsible for this policy:
                </p>
                <ul className="gticc-legal-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><strong>Name &amp; title:</strong> Sulabh Kumar, Director</li>
                  <li><strong>Email:</strong> <a href="mailto:contact@gticc.com">contact@gticc.com</a></li>
                  <li><strong>Mail:</strong> 125 Village Green Sq., Toronto, Canada</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="privacy-sec-2" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">2.</span>
                <span>Information we collect</span>
              </h3>
              <p>
                We collect only what we need for the purposes in Section 3.
              </p>
              <div className="table-responsive gticc-legal-table-wrapper">
                <table className="gticc-legal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '34%' }}>Source</th>
                      <th>Information</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Membership applications and renewals</td>
                      <td>Name, title, business name, business address, phone, email, website, industry, business size, membership tier, billing contact</td>
                    </tr>
                    <tr>
                      <td>Member directory profiles</td>
                      <td>Business description, logo, photos, hours, service areas, social media links, contact person details you choose to publish</td>
                    </tr>
                    <tr>
                      <td>Events and programs</td>
                      <td>Registration details, dietary or accessibility needs, attendance, photos and video taken at events</td>
                    </tr>
                    <tr>
                      <td>Payments</td>
                      <td>Transaction amount, date and status. Card numbers are handled by our payment processor, [processor name], and are not stored by GTICC</td>
                    </tr>
                    <tr>
                      <td>Communications</td>
                      <td>Messages, enquiries, survey responses, feedback, newsletter preferences</td>
                    </tr>
                    <tr>
                      <td>Advocacy and committees</td>
                      <td>Views you share in consultations, committee participation, sponsorship and volunteer details</td>
                    </tr>
                    <tr>
                      <td>Website use</td>
                      <td>IP address, browser and device type, pages visited, referring site, and cookie data (see Section 6)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '14.5px', fontStyle: 'italic', margin: 0 }}>
                We do not knowingly collect sensitive information such as health, financial account or government ID numbers, except where a specific program requires it and you are told why at the time.
              </p>
            </section>

            {/* Section 3 */}
            <section id="privacy-sec-3" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">3.</span>
                <span>How we use information, and your consent</span>
              </h3>
              <p>
                We use personal information to carry out the Chamber&apos;s objectives:
              </p>
              <ul className="gticc-legal-list">
                <li>
                  <strong>Serve members:</strong> process applications, renewals and payments; manage member accounts and benefits.
                </li>
                <li>
                  <strong>Promote member businesses:</strong> publish and maintain the member directory, and feature members in newsletters, social media and spotlights.
                </li>
                <li>
                  <strong>Connect the business community:</strong> organize networking events, B2B introductions, trade missions, mentorship and education programs.
                </li>
                <li>
                  <strong>Advocate:</strong> gather member views on policy issues and represent the business community to governments and other bodies. Views are reported in aggregate unless you agree to be named.
                </li>
                <li>
                  <strong>Communicate:</strong> send operational notices, event information and, with consent, newsletters and promotions.
                </li>
                <li>
                  <strong>Improve and protect:</strong> analyze website use, plan programs, prevent fraud and meet legal, tax and audit obligations.
                </li>
              </ul>
              <div className="gticc-legal-box">
                <p style={{ marginBottom: '8px' }}>
                  <strong>Consent:</strong> We collect, use and disclose personal information with your knowledge and consent. Consent is express when you tick a box or sign up. It is implied when the purpose is obvious, such as using your registration details to admit you to an event. You may withdraw consent at any time, subject to legal or contractual limits, by contacting the Privacy Officer. Withdrawal may mean we cannot provide some services, such as a directory listing.
                </p>
                <p style={{ margin: 0 }}>
                  We will ask for fresh consent before using information for a new purpose.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="privacy-sec-4" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">4.</span>
                <span>Member Directory and Public information</span>
              </h3>
              <p>
                The member directory exists to make GTICC members easy to find and do business with, so profile content is public by design.
              </p>
              <ul className="gticc-legal-list">
                <li>
                  <strong>Public by default:</strong> business name, logo, description, category, city, website and business contact details you enter.
                </li>
                <li>
                  <strong>Private by default:</strong> personal mobile numbers, home addresses, billing details and membership payment history. These are never shown in the directory.
                </li>
                <li>
                  <strong>Your control:</strong> you can edit or hide optional profile fields at any time through your account or by contacting us. Information about an individual employee is published only with that person&apos;s consent.
                </li>
                <li>
                  <strong>Reviews and comments:</strong> if the directory allows reviews, the reviewer&apos;s display name and review are public. See the Terms of Use for content rules.
                </li>
                <li>
                  <strong>Event photos:</strong> photos and video taken at public GTICC events may appear on our website and social media. Tell staff at the event or email us if you prefer not to be featured, and we will remove identifiable images on request where practical.
                </li>
              </ul>
              <p style={{ margin: 0 }}>
                We do not sell or rent the directory or member contact lists. Automated scraping of the directory for marketing is prohibited by our Terms of Use.
              </p>
            </section>

            {/* Section 5 */}
            <section id="privacy-sec-5" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">5.</span>
                <span>When we share information</span>
              </h3>
              <p>
                GTICC does not sell personal information. We share it only as follows:
              </p>
              <ul className="gticc-legal-list">
                <li>
                  Service providers who host our website, process payments, send email, manage events or keep our books. They are bound by contract to use the information only for our services and to protect it.
                </li>
                <li>
                  Event partners and sponsors, limited to name, title and business name on attendee lists, and only where you were told at registration and could opt out.
                </li>
                <li>
                  Affiliated chamber networks such as [Ontario Chamber of Commerce / Canadian Chamber of Commerce, if applicable], where membership gives access to their benefit programs and you have agreed.
                </li>
                <li>
                  Governments and public bodies, only in aggregate or anonymized form for advocacy, unless you agree to be identified.
                </li>
                <li>
                  Legal reasons: to comply with law, a court order or a lawful request, to protect rights and safety.
                </li>
                <li>
                  <strong>Professional advisors.</strong> Our lawyers, auditors and IT security advisors may see personal information when needed for compliance, audits or security incidents, under confidentiality obligations.
                </li>
                <li>
                  <strong>Restructuring.</strong> If GTICC merges with, or transfers its activities to, another organization, personal information may be transferred under equivalent protections. We will notify members in advance and give you the chance to withdraw consent or close your account first, subject to legal obligations.
                </li>
                <li>
                  <strong>Storage outside Canada.</strong> [Where available, we host member data on servers in Canada.] Some providers, such as analytics tools, may store or process information outside Canada, for example in the United States. Information there is subject to that country&apos;s laws and may be accessed by its authorities. We choose providers with safeguards comparable to Canadian standards. Current providers include: [list hosting, email and payment providers].
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="privacy-sec-6" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">6.</span>
                <span>Cookies, analytics and electronic messages</span>
              </h3>
              <p>
                <strong>Cookies.</strong> We do not use cookies to sell advertising. We use three kinds:
              </p>
              <ul className="gticc-legal-list">
                <li><strong>Essential:</strong> keep you logged in and the site secure. The site does not work properly without them.</li>
                <li><strong>Preference:</strong> remember settings such as language or directory filters.</li>
                <li><strong>Analytics:</strong> tools such as [Google Analytics / Microsoft Clarity] show how the site is used. We configure them to avoid collecting names or contact details.</li>
              </ul>
              <p>
                You can block or delete cookies in your browser, use our cookie preference banner [if available], or use the analytics provider&apos;s opt-out tool. Opting out of analytics does not affect your membership or directory listing.
              </p>
              <div className="gticc-legal-box">
                <p style={{ marginBottom: '10px' }}>
                  <strong>Email and texts:</strong> We send commercial electronic messages, such as newsletters and event promotions, only with your consent as required by Canada&apos;s Anti-Spam Legislation (CASL):
                </p>
                <ul className="gticc-legal-list" style={{ margin: '0 0 10px 0' }}>
                  <li>Express consent when you subscribe or tick an opt-in box.</li>
                  <li>Implied consent while you are a member and for the period CASL allows after membership ends or after you enquire about our services.</li>
                </ul>
                <p style={{ margin: 0 }}>
                  Every message identifies GTICC, includes our mailing address and has a working unsubscribe link. Unsubscribe requests are processed within 10 business days. Operational messages, such as renewal notices and event confirmations, will still be sent.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="privacy-sec-7" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">7.</span>
                <span>Retention, security and breaches</span>
              </h3>
              <p>
                <strong>Retention:</strong> We keep personal information only as long as needed for the purposes collected, then delete or anonymize it:
              </p>
              <div className="table-responsive gticc-legal-table-wrapper">
                <table className="gticc-legal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Record</th>
                      <th>Kept for (Purpose)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Active member records</td>
                      <td>Length of membership</td>
                    </tr>
                    <tr>
                      <td>Former member records</td>
                      <td>2 years after membership ends</td>
                    </tr>
                    <tr>
                      <td>Financial and payment records</td>
                      <td>7 years, for tax and audit</td>
                    </tr>
                    <tr>
                      <td>Event registrations</td>
                      <td>2 years after the event</td>
                    </tr>
                    <tr>
                      <td>Newsletter-only contacts</td>
                      <td>Until you unsubscribe</td>
                    </tr>
                    <tr>
                      <td>Website analytics</td>
                      <td>Up to 26 months per visitor; aggregated statistics may be kept indefinitely</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="gticc-legal-box">
                <p style={{ marginBottom: '10px' }}>
                  <strong>Security.</strong> We use safeguards suited to the sensitivity of the information:
                </p>
                <ul className="gticc-legal-list" style={{ margin: '0 0 12px 0' }}>
                  <li><strong>Technical:</strong> encryption in transit (HTTPS) and, where our providers support it, at rest; multi-factor authentication on admin accounts; regular backups.</li>
                  <li><strong>Administrative:</strong> access limited to staff and volunteers who need it; privacy training; confidentiality commitments from staff, directors and volunteers; periodic access reviews.</li>
                  <li><strong>Physical:</strong> paper records kept in locked storage; hosting in providers&apos; secured data centres.</li>
                </ul>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
                  No system is completely secure, but we review our safeguards regularly and respond promptly to incidents.
                </p>
              </div>

              <p style={{ margin: 0 }}>
                <strong>Breaches.</strong> If a breach creates a real risk of significant harm, we will notify affected individuals and the Office of the Privacy Commissioner of Canada as soon as feasible, and keep a record of the breach as required under the applicable provisions of PIPEDA.
              </p>
            </section>

            {/* Section 8 */}
            <section id="privacy-sec-8" className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">8.</span>
                <span>Your rights, minors, changes and contact</span>
              </h3>
              <p style={{ marginBottom: '10px' }}>
                <strong>Your rights:</strong> Under PIPEDA and applicable Provincial laws, you may:
              </p>
              <ul className="gticc-legal-list">
                <li>see the personal information we hold about you, and learn how it has been used and shared;</li>
                <li>correct inaccurate or incomplete information, most of which you can update yourself in your member account;</li>
                <li>withdraw consent or opt out of marketing messages;</li>
                <li>ask us to delete your information, subject to legal and record-keeping requirements;</li>
                <li>request a copy of your directory profile and member record in a common electronic format.</li>
              </ul>
              <p>
                Send requests to the Privacy Officer. We will respond within 30 days and may ask you to verify your identity. Requests are free; for repeated or unusually large requests we may charge a reasonable fee, telling you the amount first.
              </p>
              <p>
                <strong>Minors.</strong> Our services are for businesses and adults. We do not knowingly collect information from anyone under 18 without a parent&apos;s or guardian&apos;s consent, for example in youth entrepreneurship programs. If we learn we have collected a minor&apos;s information without that consent, we will delete it promptly.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Changes.</strong> We may update this policy as our programs or the law change. The effective date below shows the latest version. Material changes will be posted on the site and, for members, sent by email.
              </p>
            </section>

            {/* Section 9 / Contact Us */}
            <div id="privacy-sec-9" className="gticc-legal-contact-box">
              <h4 className="gticc-legal-contact-title">
                <i className="fa-solid fa-shield-halved"></i>
                <span>9. Contact Us</span>
              </h4>
              <p style={{ margin: 0 }}>
                Contact our Privacy Officer first at <a href="mailto:contact@gticc.com">contact@gticc.com</a> or 125 Village Green Sq., Toronto, Canada. If you are not satisfied, you may contact the Office of the Privacy Commissioner of Canada at 1-800-282-1376.
              </p>
            </div>

            {/* Bottom Back Button */}
            <div className="mt-5 text-center">
              <Link to="/about-us" className="gticc-legal-btn gticc-legal-btn-lg">
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to About GTICC</span>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
