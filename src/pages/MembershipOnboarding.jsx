import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MembershipOnboarding() {
  useEffect(() => {
    document.title = 'Membership Onboarding | GTICC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GTICC Membership Onboarding Portal. Select either Business Membership Onboarding or Leadership & Position Onboarding to complete your application.'
      );
    }
  }, []);

  const inlineStyles = `
    .onboarding-landing-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(200, 162, 74, 0.28);
      border-radius: 12px;
      padding: 40px 36px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .onboarding-landing-card:hover {
      border-color: #C8A24A;
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(200, 162, 74, 0.15);
      background: rgba(15, 23, 42, 0.85);
    }
    .onboarding-landing-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #C8A24A;
      background: rgba(200, 162, 74, 0.12);
      border: 1px solid rgba(200, 162, 74, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 18px;
    }
    .onboarding-landing-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 14px;
      line-height: 1.35;
    }
    .onboarding-landing-desc {
      color: rgba(255, 255, 255, 0.75);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 22px;
    }
    .onboarding-features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 28px 0;
    }
    .onboarding-features-list li {
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .onboarding-features-list li i {
      color: #C8A24A;
      margin-top: 3px;
      flex-shrink: 0;
    }
    .onboarding-meta-strip {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 18px;
      margin-bottom: 24px;
    }
    .onboarding-meta-tag {
      font-size: 12.5px;
      color: rgba(255, 255, 255, 0.6);
    }
    .onboarding-meta-tag strong {
      color: #C8A24A;
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
  `;

  return (
    <div className="site-content gticc-membership-page">
      <style>{inlineStyles}</style>

      {/* Hero Banner */}
      <section
        className="gticc-hero gticc-hero--fullscreen"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(8, 22, 48, 0.82), rgba(13, 17, 23, 0.92)), url("/membership_banner.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      >
        <div className="container text-center">
          <span className="sub-title">GTICC Membership Division</span>
          <h1 className="title" style={{ fontSize: '44px', fontWeight: '800', margin: '0 auto 16px auto' }}>
            Membership Onboarding
          </h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '840px', margin: '0 auto 26px auto' }}>
            Welcome to the GTICC onboarding portal. Please select the onboarding questionnaire that corresponds
            to your organization or executive capacity below.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="#onboarding-options" className="btn">Select an Onboarding Option</a>
            <Link to="/membership/apply" className="btn btn-ghost">Membership Apply</Link>
          </div>
        </div>
      </section>

      {/* Two Distinct Onboarding Options */}
      <section id="onboarding-options" className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ color: '#C8A24A', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Onboarding Portals
            </span>
            <h2 className="text-white mt-2 mb-3" style={{ fontSize: '32px', fontWeight: '800' }}>
              Select Your Onboarding Questionnaire
            </h2>
            <p className="text-white-50" style={{ maxWidth: '720px', margin: '0 auto', fontSize: '16px' }}>
              Choose your profile track to proceed to the dedicated, secure screening questionnaire.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Option 1: Business Membership Onboarding */}
            <div className="col-lg-6">
              <div className="onboarding-landing-card">
                <div>
                  <span className="onboarding-landing-badge">Option 01 — Corporate Entities</span>
                  <h3 className="onboarding-landing-title">
                    Business Membership Onboarding
                  </h3>
                  <p className="onboarding-landing-desc">
                    Tailored for business entities, manufacturers, exporters, and commercial enterprises seeking international trade matchmaking, buyer-seller connections, and cross-border expansion.
                  </p>

                  <div className="onboarding-meta-strip">
                    <div className="onboarding-meta-tag">
                      <strong>Target Time</strong>
                      Under 2.5 Minutes (10 Questions)
                    </div>
                    <div className="onboarding-meta-tag">
                      <strong>Administration</strong>
                      Global Trade &amp; Membership Division
                    </div>
                    <div className="onboarding-meta-tag">
                      <strong>Focus</strong>
                      Trade Screening &amp; Matchmaking
                    </div>
                  </div>

                  <ul className="onboarding-features-list">
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Registered entity profile, website URL &amp; corporate contact</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Industry sector, turnover tier &amp; regulatory EXIM status</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Target international markets &amp; commercial partnership goals</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Formal Corporate Authorization &amp; Signatory Submission</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/membership/business-onboarding"
                    className="btn w-100"
                    style={{ minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Open Business Membership Form <i className="fa-solid fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Option 2: Leadership & Position Onboarding */}
            <div className="col-lg-6">
              <div className="onboarding-landing-card">
                <div>
                  <span className="onboarding-landing-badge">Option 02 — Executive &amp; Council Candidates</span>
                  <h3 className="onboarding-landing-title">
                    Leadership &amp; Position Onboarding
                  </h3>
                  <p className="onboarding-landing-desc">
                    Confidential vetting and strategic affiliation questionnaire for executive council candidates, committee chairs, strategic advisors, and bilateral trade envoys.
                  </p>

                  <div className="onboarding-meta-strip">
                    <div className="onboarding-meta-tag">
                      <strong>Target Time</strong>
                      Under 2 Minutes (8 Questions)
                    </div>
                    <div className="onboarding-meta-tag">
                      <strong>Governance Body</strong>
                      GTICC Executive Secretariat
                    </div>
                    <div className="onboarding-meta-tag">
                      <strong>Focus</strong>
                      Strategic Affiliation &amp; Governance
                    </div>
                  </div>

                  <ul className="onboarding-features-list">
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Executive profile, legal honorific, organization &amp; designation</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Sector domain expertise &amp; operating time zone</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Strategic engagement nature &amp; geographic commercial influence</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Executive summary reference &amp; Candidate Attestation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/membership/leadership-onboarding"
                    className="btn w-100"
                    style={{ minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Open Leadership &amp; Position Form <i className="fa-solid fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Disclaimer */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            className="gticc-card gticc-disclaimer-card"
            style={{ borderLeft: '4px solid #C8A24A', background: 'rgba(8, 22, 48, 0.3)' }}
          >
            <p className="gticc-small-disclaimer" style={{ fontSize: '14.5px', color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> GTICC acts as a strategic global catalyst and trade facilitator. Membership provides access to trade networking, commercial visibility, bilateral delegations, and matchmaking introductions. Official leadership positions and committee chairs are conferred directly by the Executive Council based on candidate domain expertise, regional influence, and commercial track record.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
