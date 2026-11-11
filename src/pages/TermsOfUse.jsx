import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function TermsOfUse() {
  useEffect(() => {
    document.title = 'GTICC Terms of Use | Global Trade and Investment Collaboration Consortium';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="site-content gticc-legal-page">
      {/* Minimal Top Header - Clean, professional, no yellow/gold banner box */}
      <header className="gticc-legal-header">
        <div className="container">
          <span className="gticc-legal-kicker">Legal &amp; Compliance</span>
          <h1 className="gticc-legal-title">Terms of Use</h1>
          <p className="gticc-legal-subtitle">
            Global Trade and Investment Collaboration Consortium terms, agreements, member standards, and platform usage policies.
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
              <h2>GTICC Terms of Use</h2>
              <p className="gticc-legal-lead">
                Welcome to Global Trade and Investment Collaboration Consortium (&ldquo;GTICC&rdquo;). Please read these Terms of Service (&ldquo;Terms&rdquo;) and our Privacy Policy before using the GTICC website. These Terms govern your use of our <a href="https://gticc.com">https://gticc.com</a>, the GTICC member directory, and related services. By using the site or becoming a member, you agree to be bound by these Terms, including our Privacy Policy and any additional agreements referenced herein to these and to our Privacy Policy. If you do not agree, do not use the site.
              </p>
            </div>

            {/* Section 1 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">1.</span>
                <span>Acceptance and eligibility</span>
              </h3>
              <p>
                GTICC is a not-for-profit chamber of commerce. Our mission is to connect, promote and advocate for businesses in the Greater Toronto Area. Membership is also governed by GTICC&apos;s by-laws and membership policies; if they conflict with these Terms, the by-laws prevail.
              </p>
              <p>
                You must be at least 18 and able to form a binding contract. If you act for a business, you confirm you are authorized to bind it, and &ldquo;you&rdquo; includes that business.
              </p>
              <div className="gticc-legal-box">
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px', fontSize: '14.5px' }}>Definitions:</strong>
                <ul className="gticc-legal-list" style={{ margin: 0 }}>
                  <li><strong>&ldquo;Site&rdquo;</strong> means gticc.com and its member directory.</li>
                  <li><strong>&ldquo;Member&rdquo;</strong> means a business, organization or individual with a current GTICC membership.</li>
                  <li><strong>&ldquo;Member Content&rdquo;</strong> means anything you submit, such as profile text, logos, photos and reviews.</li>
                </ul>
              </div>
              <p style={{ margin: 0 }}>
                <strong>Additional terms:</strong> Some programs, events, sponsorships and member benefits have their own terms, shown when you sign up. Those terms form part of these Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">2.</span>
                <span>Accounts and membership</span>
              </h3>
              <ul className="gticc-legal-list">
                <li>
                  <strong>Accounts:</strong> Keep your login details confidential and your information accurate. You are responsible for activity under your account. Tell us promptly at <a href="mailto:info@gticc.com">info@gticc.com</a> if you suspect unauthorized use.
                </li>
                <li>
                  <strong>Membership approval:</strong> Applications are reviewed by GTICC and may be accepted or declined at the Chamber&apos;s discretion, consistent with its by-laws and anti-discrimination obligations.
                </li>
                <li>
                  <strong>Fees:</strong> Membership fees are listed on our membership page in Canadian dollars, plus applicable taxes. Membership runs for [12 months from the start date / the calendar year].
                </li>
                <li>
                  <strong>Renewal:</strong> Memberships renew automatically and we will email a reminder at least 30 days before renewal OR Memberships do not renew automatically and we will invite you to renew.
                </li>
                <li>
                  <strong>Cancellation and refunds:</strong> You may cancel at any time by emailing <a href="mailto:info@gticc.com">info@gticc.com</a>. Your benefits continue until the end of the paid term. Fees are non-refundable except within 14 days of first joining, if no benefits have been used . Event tickets and sponsorships follow their own terms contained in the respective refund policy.
                </li>
              </ul>
              <p style={{ margin: 0 }}>
                Member benefits may change over time. We will give reasonable notice of material changes.
              </p>
            </section>

            {/* Section 3 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">3.</span>
                <span>Member directory listings and reviews</span>
              </h3>
              <ul className="gticc-legal-list" style={{ margin: 0 }}>
                <li>
                  <strong>Your listing:</strong> You are responsible for everything in your directory profile. It must be accurate, current, lawful and about your own business. You must hold any license or registration your profession requires and must not claim credentials, awards or affiliations you do not have.
                </li>
                <li>
                  <strong>Regulated professionals:</strong> Members in regulated Professions, such as law, accounting, real estate, insurance, immigration consulting and health care, remain responsible for following their regulator&apos;s advertising and conduct rules in their listings. If these Terms conflict with those professional obligations, the professional obligations prevail.
                </li>
                <li>
                  <strong>Our editorial rights:</strong> GTICC may edit formatting, categorize listings, and refuse, hide or remove content that breaks these Terms or could harm the Chamber&apos;s reputation. A listing does not guarantee placement, ranking or any number of leads.
                </li>
                <li>
                  <strong>Reviews:</strong> If we decide to activate Reviews on our website, reviews you write must reflect a genuine experience with the business. You may not review your own business, a competitor, or a business you are paid to review, and members may not offer incentives for positive reviews. GTICC may remove reviews that are fake, abusive, off-topic or disclose personal information, but does not endorse, justify or verify every review.
                </li>
                <li>
                  <strong>Directory data:</strong> Directory information is provided to help people find and do business with members. You may not scrape, harvest or bulk-copy it, or use it to send unsolicited commercial messages in breach of Canada&apos;s Anti-Spam Legislation (CASL).
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">4.</span>
                <span>Acceptable use and member conduct</span>
              </h3>
              <p>
                GTICC&apos;s value depends on trust between members. When using the site or taking part in Chamber activities, you agree not to:
              </p>
              <ul className="gticc-legal-list">
                <li>post false, misleading, defamatory, discriminatory, harassing or obscene content.</li>
                <li>infringe anyone&apos;s intellectual property or privacy or post others&apos; personal information without consent.</li>
                <li>send spam or unsolicited bulk messages to members or use member contacts gathered through GTICC for that purpose.</li>
                <li>impersonate any person or business or misrepresent an affiliation with GTICC.</li>
                <li>upload malware, probe or breach site security, or use bots and scrapers.</li>
                <li>use GTICC platforms or events for political campaigning, multi-level-marketing recruitment or illegal activity.</li>
                <li>speak or act on behalf of the Chamber without written authorization.</li>
              </ul>
              <p style={{ margin: 0 }}>
                Members are expected to deal honestly and professionally with each other and the public. GTICC may follow its by-laws to address complaints about member conduct.
              </p>
            </section>

            {/* Section 5 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">5.</span>
                <span>Events and programs</span>
              </h3>
              <ul className="gticc-legal-list" style={{ margin: 0 }}>
                <li>
                  <strong>Registration and tickets:</strong> Event fees, member pricing and refund deadlines are shown on each event page. Unless stated otherwise, tickets are refundable up to 2 days before the event and transferable to a colleague at no cost.
                </li>
                <li>
                  <strong>Changes:</strong> GTICC may change speakers, venues, dates or formats, or cancel an event. If we cancel, we will refund the ticket price; we are not responsible for travel or other costs.
                </li>
                <li>
                  <strong>Conduct:</strong> Attendees must follow venue rules and the code of conduct. GTICC may refuse entry or remove anyone behaving inappropriately, without refund.
                </li>
                <li>
                  <strong>Photos and recordings:</strong> Events may be photographed or recorded for Chamber promotion, as explained in the Privacy Policy. Let staff know if you prefer not to appear.
                </li>
                <li>
                  <strong>Speakers and sponsors:</strong> Views expressed by speakers, sponsors or members at events are their own and not GTICC&apos;s.
                </li>
                <li>
                  <strong>Advocacy:</strong> GTICC advocacy positions are set by its Board. Taking part in a consultation does not mean the Chamber will adopt your view.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">6.</span>
                <span>Intellectual property</span>
              </h3>
              <ul className="gticc-legal-list" style={{ margin: 0 }}>
                <li>
                  <strong>GTICC content:</strong> The site&apos;s text, design, graphics, publications and the GTICC name and logo belong to GTICC or its licensors. You may view and share pages for personal or internal business use with attribution. Any other copying, republishing or commercial use needs our written permission.
                </li>
                <li>
                  <strong>Use of the site:</strong> We give you a personal, non-exclusive, revocable license to use the site for its intended purpose. You may not copy or rebuild the site or directory, reverse engineer it, use it to build a competing directory, or share your member login with people outside your organization.
                </li>
                <li>
                  <strong>&ldquo;Proud Member&rdquo; badge:</strong> Members in good standing may display the GTICC member badge on their website and materials, in the form we supply, to show membership. You may not alter it, suggest GTICC endorses your products, or use it after membership ends.
                </li>
                <li>
                  <strong>Your content:</strong> You keep ownership of the logos, photos, text and reviews you submit. You give GTICC a non-exclusive, royalty-free license to host, display, format and share that content on the site, in newsletters and on Chamber social media for as long as it is posted and for a reasonable period after, to promote you and the Chamber. You confirm you have the rights to everything you submit.
                </li>
                <li>
                  <strong>Feedback:</strong> Suggestions you give us about the site or Chamber programs may be used to improve them without payment or attribution.
                </li>
                <li>
                  <strong>Copyright complaints:</strong> If you believe content on the site infringes your rights, email <a href="mailto:info@gticc.com">info@gticc.com</a> with details and we will review it promptly.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">7.</span>
                <span>Disclaimers, liability and indemnity</span>
              </h3>
              <ul className="gticc-legal-list" style={{ margin: 0 }}>
                <li>
                  <strong>No endorsement:</strong> Membership, a directory listing, a review or an award does not mean GTICC endorses, certifies or guarantees a member&apos;s products, services, licenses or conduct. Do your own due diligence before hiring or partnering with any business. Agreements between members, or between members and the public, are solely between those parties.
                </li>
                <li>
                  <strong>Independence:</strong> GTICC is an independent not-for-profit entity. It is neither a government agency nor affiliated with any Government department, regulator or licensing body, and it does not verify members&apos; professional licenses or insurance.
                </li>
                <li>
                  <strong>Information only:</strong> Content on the site, in newsletters and at events is for general information, not legal, financial, tax or professional advice.
                </li>
                <li>
                  <strong>&ldquo;As is&rdquo; service:</strong> The site is provided as is and as available. We do not promise it will be error-free or uninterrupted, or that directory listings are complete or accurate.
                </li>
                <li>
                  <strong>Limitation of liability:</strong> To the extent the law allows, GTICC, its directors, officers, staff and volunteers are not liable for indirect, incidental or consequential losses, lost profits or lost data. GTICC&apos;s total liability for any claim is limited to the greater of the fees you paid GTICC in 12 months before the claim or $500 CAD. These limits are an essential part of the arrangement between us. Nothing here limits liability that cannot be limited by law.
                </li>
                <li>
                  <strong>Indemnity:</strong> You agree to cover GTICC&apos;s reasonable losses and legal costs arising from your content, your breach of these Terms, or your dealings with other members or the public. We will notify you promptly of any such claim and may take part in the defense with our own counsel.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="gticc-legal-section">
              <h3 className="gticc-legal-sec-title">
                <span className="gticc-legal-sec-num">8.</span>
                <span>Suspension, governing law, changes and contact</span>
              </h3>
              <ul className="gticc-legal-list">
                <li>
                  <strong>Suspension and termination:</strong> GTICC may suspend or remove a listing or account, or end a membership, for a serious or repeated breach of these Terms or the by-laws or for any illegitimate act, following the process in the by-laws where it applies. Membership fees are not refunded on termination for breach, and any unpaid fees remain due. When a membership ends, the directory listing is removed, and you may ask us for a copy of your profile content within 30 days. Sections 3 (directory data), 6, 7 and 8 survive termination.
                </li>
                <li>
                  <strong>Third-party links:</strong> Links to member or other websites are for convenience; GTICC is not responsible for their content or practices.
                </li>
                <li>
                  <strong>Governing law:</strong> These Terms are governed by the laws of Ontario and the federal laws of Canada that apply there. Disputes will be heard in the courts of Toronto, Ontario. We encourage you to contact us first so we can try to resolve concerns informally.
                </li>
                <li>
                  <strong>Changes:</strong> We may update these Terms. The effective date below shows the current version, and members will be emailed about material changes. Continued use after the effective date means you accept the update.
                </li>
              </ul>

              <div className="gticc-legal-box" style={{ marginTop: '20px' }}>
                <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '15px', marginBottom: '12px' }}>General:</strong>
                <ul className="gticc-legal-list" style={{ margin: 0 }}>
                  <li><strong>Entire agreement:</strong> these Terms, the Privacy Policy, GTICC&apos;s by-laws and any program terms are the whole agreement between us on their subject.</li>
                  <li><strong>Severability and waiver:</strong> if any part is unenforceable, the rest stays in effect; not enforcing a term is not a waiver.</li>
                  <li><strong>Assignment:</strong> you may not transfer your membership or these Terms without our written consent. GTICC may assign them in a merger or restructuring.</li>
                  <li><strong>Force majeure:</strong> neither party is liable for delays caused by events beyond its reasonable control, such as public health orders or severe weather affecting events.</li>
                  <li><strong>Electronic communications:</strong> you agree to receive notices from us electronically. Promotional messages follow the consent rules in our Privacy Policy.</li>
                  <li><strong>Language:</strong> these Terms are written in English. Translations are for convenience; the English version governs.</li>
                </ul>
              </div>
            </section>

            {/* Official Contact Box */}
            <div className="gticc-legal-contact-box">
              <h4 className="gticc-legal-contact-title">
                <i className="fa-solid fa-building"></i>
                <span>Official Contact</span>
              </h4>
              <p style={{ margin: 0 }}>
                <strong>Global Trade and Investment Collaboration Consortium</strong><br />
                125 Village Green Sq., Toronto, Canada<br />
                Email: <a href="mailto:info@gticc.com">info@gticc.com</a><br />
                <span style={{ color: '#94A3B8', fontSize: '13.5px', marginTop: '6px', display: 'inline-block' }}>
                  Effective date: November 3, 2026. Last updated: November 3, 2026.
                </span>
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
