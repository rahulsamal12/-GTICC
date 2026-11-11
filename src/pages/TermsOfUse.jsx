import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  useEffect(() => {
    document.title = 'GTICC Terms of Use | Global Trade and Investment Collaboration Consortium';
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
                <h1 className="title">Terms of Use</h1>
                <ul className="breadcrumb mb-0 mt-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/about-us">About Us</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    <span>Terms of Use</span>
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
                  GTICC Terms of Use
                </h2>
                <p style={{ color: '#AAB4C3', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  Welcome to Global Trade and Investment Collaboration Consortium (&ldquo;GTICC&rdquo;). Please read these Terms of Service (&ldquo;Terms&rdquo;) and our Privacy Policy before using the GTICC website. These Terms govern your use of our <a href="https://gticc.com" style={{ color: '#C8A24A', textDecoration: 'underline' }}>https://gticc.com</a>, the GTICC member directory, and related services. By using the site or becoming a member, you agree to be bound by these Terms, including our Privacy Policy and any additional agreements referenced herein to these and to our Privacy Policy. If you do not agree, do not use the site.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  1. Acceptance and eligibility
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  GTICC is a not-for-profit chamber of commerce. Our mission is to connect, promote and advocate for businesses in the Greater Toronto Area. Membership is also governed by GTICC&apos;s by-laws and membership policies; if they conflict with these Terms, the by-laws prevail.
                </p>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '14px' }}>
                  You must be at least 18 and able to form a binding contract. If you act for a business, you confirm you are authorized to bind it, and &ldquo;you&rdquo; includes that business.
                </p>
                <div
                  style={{
                    background: '#132238',
                    borderLeft: '3px solid #C8A24A',
                    padding: '14px 18px',
                    borderRadius: '4px',
                    marginBottom: '14px',
                  }}
                >
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Definitions:</strong>
                  <ul style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
                    <li><strong>&ldquo;Site&rdquo;</strong> means gticc.com and its member directory.</li>
                    <li><strong>&ldquo;Member&rdquo;</strong> means a business, organization or individual with a current GTICC membership.</li>
                    <li><strong>&ldquo;Member Content&rdquo;</strong> means anything you submit, such as profile text, logos, photos and reviews.</li>
                  </ul>
                </div>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  <strong>Additional terms:</strong> Some programs, events, sponsorships and member benefits have their own terms, shown when you sign up. Those terms form part of these Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  2. Accounts and membership
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '14px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Accounts:</strong> Keep your login details confidential and your information accurate. You are responsible for activity under your account. Tell us promptly at <a href="mailto:info@gticc.com" style={{ color: '#C8A24A' }}>info@gticc.com</a> if you suspect unauthorized use.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Membership approval:</strong> Applications are reviewed by GTICC and may be accepted or declined at the Chamber&apos;s discretion, consistent with its by-laws and anti-discrimination obligations.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Fees:</strong> Membership fees are listed on our membership page in Canadian dollars, plus applicable taxes. Membership runs for [12 months from the start date / the calendar year].
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Renewal:</strong> Memberships renew automatically and we will email a reminder at least 30 days before renewal OR Memberships do not renew automatically and we will invite you to renew.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Cancellation and refunds:</strong> You may cancel at any time by emailing <a href="mailto:info@gticc.com" style={{ color: '#C8A24A' }}>info@gticc.com</a>. Your benefits continue until the end of the paid term. Fees are non-refundable except within 14 days of first joining, if no benefits have been used . Event tickets and sponsorships follow their own terms contained in the respective refund policy.
                  </li>
                </ul>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  Member benefits may change over time. We will give reasonable notice of material changes.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  3. Member directory listings and reviews
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Your listing:</strong> You are responsible for everything in your directory profile. It must be accurate, current, lawful and about your own business. You must hold any license or registration your profession requires and must not claim credentials, awards or affiliations you do not have.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Regulated professionals:</strong> Members in regulated Professions, such as law, accounting, real estate, insurance, immigration consulting and health care, remain responsible for following their regulator&apos;s advertising and conduct rules in their listings. If these Terms conflict with those professional obligations, the professional obligations prevail.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Our editorial rights:</strong> GTICC may edit formatting, categorize listings, and refuse, hide or remove content that breaks these Terms or could harm the Chamber&apos;s reputation. A listing does not guarantee placement, ranking or any number of leads.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Reviews:</strong> If we decide to activate Reviews on our website, reviews you write must reflect a genuine experience with the business. You may not review your own business, a competitor, or a business you are paid to review, and members may not offer incentives for positive reviews. GTICC may remove reviews that are fake, abusive, off-topic or disclose personal information, but does not endorse, justify or verify every review.
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    <strong>Directory data:</strong> Directory information is provided to help people find and do business with members. You may not scrape, harvest or bulk-copy it, or use it to send unsolicited commercial messages in breach of Canada&apos;s Anti-Spam Legislation (CASL).
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  4. Acceptable use and member conduct
                </h4>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', marginBottom: '12px' }}>
                  GTICC&apos;s value depends on trust between members. When using the site or taking part in Chamber activities, you agree not to:
                </p>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '14px' }}>
                  <li style={{ marginBottom: '6px' }}>post false, misleading, defamatory, discriminatory, harassing or obscene content.</li>
                  <li style={{ marginBottom: '6px' }}>infringe anyone&apos;s intellectual property or privacy or post others&apos; personal information without consent.</li>
                  <li style={{ marginBottom: '6px' }}>send spam or unsolicited bulk messages to members or use member contacts gathered through GTICC for that purpose.</li>
                  <li style={{ marginBottom: '6px' }}>impersonate any person or business or misrepresent an affiliation with GTICC.</li>
                  <li style={{ marginBottom: '6px' }}>upload malware, probe or breach site security, or use bots and scrapers.</li>
                  <li style={{ marginBottom: '6px' }}>use GTICC platforms or events for political campaigning, multi-level-marketing recruitment or illegal activity.</li>
                  <li style={{ marginBottom: '6px' }}>speak or act on behalf of the Chamber without written authorization.</li>
                </ul>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                  Members are expected to deal honestly and professionally with each other and the public. GTICC may follow its by-laws to address complaints about member conduct.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  5. Events and programs
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Registration and tickets:</strong> Event fees, member pricing and refund deadlines are shown on each event page. Unless stated otherwise, tickets are refundable up to 2 days before the event and transferable to a colleague at no cost.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Changes:</strong> GTICC may change speakers, venues, dates or formats, or cancel an event. If we cancel, we will refund the ticket price; we are not responsible for travel or other costs.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Conduct:</strong> Attendees must follow venue rules and the code of conduct. GTICC may refuse entry or remove anyone behaving inappropriately, without refund.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Photos and recordings:</strong> Events may be photographed or recorded for Chamber promotion, as explained in the Privacy Policy. Let staff know if you prefer not to appear.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Speakers and sponsors:</strong> Views expressed by speakers, sponsors or members at events are their own and not GTICC&apos;s.
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    <strong>Advocacy:</strong> GTICC advocacy positions are set by its Board. Taking part in a consultation does not mean the Chamber will adopt your view.
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  6. Intellectual property
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>GTICC content:</strong> The site&apos;s text, design, graphics, publications and the GTICC name and logo belong to GTICC or its licensors. You may view and share pages for personal or internal business use with attribution. Any other copying, republishing or commercial use needs our written permission.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Use of the site:</strong> We give you a personal, non-exclusive, revocable license to use the site for its intended purpose. You may not copy or rebuild the site or directory, reverse engineer it, use it to build a competing directory, or share your member login with people outside your organization.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>&ldquo;Proud Member&rdquo; badge:</strong> Members in good standing may display the GTICC member badge on their website and materials, in the form we supply, to show membership. You may not alter it, suggest GTICC endorses your products, or use it after membership ends.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Your content:</strong> You keep ownership of the logos, photos, text and reviews you submit. You give GTICC a non-exclusive, royalty-free license to host, display, format and share that content on the site, in newsletters and on Chamber social media for as long as it is posted and for a reasonable period after, to promote you and the Chamber. You confirm you have the rights to everything you submit.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Feedback:</strong> Suggestions you give us about the site or Chamber programs may be used to improve them without payment or attribution.
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    <strong>Copyright complaints:</strong> If you believe content on the site infringes your rights, email <a href="mailto:info@gticc.com" style={{ color: '#C8A24A' }}>info@gticc.com</a> with details and we will review it promptly.
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  7. Disclaimers, liability and indemnity
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>No endorsement:</strong> Membership, a directory listing, a review or an award does not mean GTICC endorses, certifies or guarantees a member&apos;s products, services, licenses or conduct. Do your own due diligence before hiring or partnering with any business. Agreements between members, or between members and the public, are solely between those parties.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Independence:</strong> GTICC is an independent not-for-profit entity. It is neither a government agency nor affiliated with any Government department, regulator or licensing body, and it does not verify members&apos; professional licenses or insurance.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Information only:</strong> Content on the site, in newsletters and at events is for general information, not legal, financial, tax or professional advice.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>&ldquo;As is&rdquo; service:</strong> The site is provided as is and as available. We do not promise it will be error-free or uninterrupted, or that directory listings are complete or accurate.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Limitation of liability:</strong> To the extent the law allows, GTICC, its directors, officers, staff and volunteers are not liable for indirect, incidental or consequential losses, lost profits or lost data. GTICC&apos;s total liability for any claim is limited to the greater of the fees you paid GTICC in the 12 months before the claim or $500 CAD. These limits are an essential part of the arrangement between us. Nothing here limits liability that cannot be limited by law.
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    <strong>Indemnity:</strong> You agree to cover GTICC&apos;s reasonable losses and legal costs arising from your content, your breach of these Terms, or your dealings with other members or the public. We will notify you promptly of any such claim and may take part in the defense with our own counsel.
                  </li>
                </ul>
              </div>

              {/* Section 8 */}
              <div className="mb-5">
                <h4 style={{ color: '#C8A24A', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                  8. Suspension, governing law, changes and contact
                </h4>
                <ul style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '14px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Suspension and termination:</strong> GTICC may suspend or remove a listing or account, or end a membership, for a serious or repeated breach of these Terms or the by-laws or for any illegitimate act, following the process in the by-laws where it applies. Membership fees are not refunded on termination for breach, and any unpaid fees remain due. When a membership ends, the directory listing is removed, and you may ask us for a copy of your profile content within 30 days. Sections 3 (directory data), 6, 7 and 8 survive termination.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Third-party links:</strong> Links to member or other websites are for convenience; GTICC is not responsible for their content or practices.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Governing law:</strong> These Terms are governed by the laws of Ontario and the federal laws of Canada that apply there. Disputes will be heard in the courts of Toronto, Ontario. We encourage you to contact us first so we can try to resolve concerns informally.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Changes:</strong> We may update these Terms. The effective date below shows the current version, and members will be emailed about material changes. Continued use after the effective date means you accept the update.
                  </li>
                </ul>

                <div
                  style={{
                    background: '#132238',
                    border: '1px solid #233147',
                    borderRadius: '8px',
                    padding: '20px',
                    marginTop: '20px',
                  }}
                >
                  <h5 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>General:</h5>
                  <ul style={{ color: '#CBD5E1', fontSize: '14.5px', lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '6px' }}><strong>Entire agreement:</strong> these Terms, the Privacy Policy, GTICC&apos;s by-laws and any program terms are the whole agreement between us on their subject.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Severability and waiver:</strong> if any part is unenforceable, the rest stays in effect; not enforcing a term is not a waiver.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Assignment:</strong> you may not transfer your membership or these Terms without our written consent. GTICC may assign them in a merger or restructuring.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Force majeure:</strong> neither party is liable for delays caused by events beyond its reasonable control, such as public health orders or severe weather affecting events.</li>
                    <li style={{ marginBottom: '6px' }}><strong>Electronic communications:</strong> you agree to receive notices from us electronically. Promotional messages follow the consent rules in our Privacy Policy.</li>
                    <li style={{ marginBottom: '0' }}><strong>Language:</strong> these Terms are written in English. Translations are for convenience; the English version governs.</li>
                  </ul>
                </div>
              </div>

              {/* Official Contact Box */}
              <div
                style={{
                  background: 'rgba(200, 162, 74, 0.08)',
                  border: '1px solid rgba(200, 162, 74, 0.3)',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h5 style={{ color: '#C8A24A', fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>
                  <i className="fa-solid fa-building me-2"></i>Official Contact
                </h5>
                <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                  <strong>Global Trade and Investment Collaboration Consortium</strong><br />
                  125 Village Green Sq., Toronto, Canada<br />
                  Email: <a href="mailto:info@gticc.com" style={{ color: '#C8A24A', textDecoration: 'underline' }}>info@gticc.com</a><br />
                  <span style={{ color: '#AAB4C3', fontSize: '13.5px', marginTop: '6px', display: 'inline-block' }}>
                    Effective date: November 3, 2026. Last updated: November 3, 2026.
                  </span>
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
