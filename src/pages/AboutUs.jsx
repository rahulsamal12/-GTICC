import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <main className="site-content">
      <style>{`
        .gticc-about-clickable-card {
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          cursor: pointer !important;
          transition: all 0.35s ease !important;
        }

        .gticc-about-card-desc {
          flex-grow: 1 !important;
        }

        .gticc-about-card-footer {
          margin-top: auto !important;
          padding-top: 20px !important;
          text-align: left !important;
        }

        .gticc-about-clickable-card .gticc-learn-more-link {
          display: inline-flex !important;
          align-items: center !important;
          color: #D4AF37 !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          text-decoration: none !important;
          transition: color 0.35s ease !important;
          line-height: 1 !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        .gticc-about-clickable-card .gticc-learn-more-link .arrow-symbol {
          display: inline-block !important;
          margin-left: 6px !important;
          transition: transform 0.35s ease !important;
        }

        /* Hover Styles - Pure Gold Version */
        .gticc-about-clickable-card:hover {
          background: #D4AF37 !important;
          border-color: transparent !important;
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.45) !important;
          transform: translateY(-8px) !important;
        }

        .gticc-about-clickable-card:hover h4 {
          color: #000000 !important;
        }

        .gticc-about-clickable-card:hover .gticc-about-card-desc {
          color: #000000 !important;
        }

        .gticc-about-clickable-card:hover .gticc-learn-more-link {
          color: #000000 !important;
        }

        .gticc-about-clickable-card:hover .gticc-learn-more-link .arrow-symbol {
          transform: translateX(4px) !important;
        }
      `}</style>

      {/* ================================= Hero */}
      <section
        className="gticc-hero gticc-about-hero"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(8,12,20,0.72), rgba(8,12,20,0.55)), url(/about_canada_banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <h1 className="title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
            A private global trade and investment bridging consortium.
          </h1>
          <p className="wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1500ms">
            GTICC is Canada-based and globally oriented, built to connect governments,
            institutions, investors, member companies, and strategic partners through
            structured international engagement.
          </p>
          <div className="wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms">
            <Link className="btn" to="/contact-us">
              Start a Strategic Collaboration
              <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32" className="ms-2">
                <path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================= Who We Are */}
      <section className="gticc-section gticc-about-intro-section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <h2 className="title">GTICC converts international interest into real access.</h2>
            </div>
            <div className="col-lg-7">
              <p style={{ fontSize: '22px', lineHeight: '1.7' }}>
                GTICC is not a non-profit chamber, a casual network, or a conventional
                consulting firm. It is a commercial consortium platform for trade,
                investment, delegations, strategic partnerships, institutional visibility,
                and default execution support.
              </p>
              <p style={{ fontSize: '22px', lineHeight: '1.7' }}>
                Our role is to create credibility-first pathways where serious stakeholders
                can identify opportunities, participate in curated programs, build
                relationships, and move toward practical commercial outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= What GTICC Is / Is Not */}
      <section className="gticc-section bg-panel gticc-about-definition-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="gticc-card">
                <h3>What GTICC Is</h3>
                <ul className="gticc-list">
                  <li>A private global platform for trade and investment bridging.</li>
                  <li>A membership-led access model for serious international stakeholders.</li>
                  <li>A facilitator of curated delegations, trade missions, and institutional visibility.</li>
                  <li>A strategic partner for cross-border opportunity origination and follow-up.</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="gticc-card">
                <h3>What GTICC Is Not</h3>
                <ul className="gticc-list">
                  <li>Not a local networking association or generic chamber clone.</li>
                  <li>Not a lobbying-first organization or political promise platform.</li>
                  <li>Not an everything-for-everyone consultancy.</li>
                  <li>Not an event-only brand built around posters and one-off activity.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= Operating Model */}
      <section className="gticc-section gticc-operating-model-section gticc-about-operating-section">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="title">
              Membership, delegations, partnerships, positioning, and execution support work together.
            </h2>
          </div>
          <div className="gticc-operating-model-layout">
            <div className="gticc-process">
              <div className="gticc-card">
                <h4>Membership Gateway</h4>
                <p>
                  Members gain structured access to programs, introductions, visibility,
                  and opportunity pathways.
                </p>
              </div>
              <div className="gticc-card">
                <h4>Delegation Activity</h4>
                <p>
                  Paid trade missions, investment roadshows, and curated forums create
                  movement and qualified engagement.
                </p>
              </div>
              <div className="gticc-card">
                <h4>Strategic Facilitation</h4>
                <p>
                  GTICC supports partnerships, institutional positioning, and default
                  downstream execution where appropriate.
                </p>
              </div>
            </div>
            <div className="gticc-operating-model-visual">
              <img src="/3d global.webp" alt="3D global trade and investment network visual" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================= Governance & Credibility */}
      <section className="gticc-section bg-dark position-relative" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="gticc-section-kicker" style={{ color: '#C8A24A' }}>GOVERNANCE & TRANSPARENCY</span>
            <h2 className="title text-white">Consortium Credibility & Mandate</h2>
          </div>
          
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '30px' }}>
                <h3 style={{ color: '#C8A24A' }}><i className="fa-solid fa-bullseye me-2"></i>Mission</h3>
                <p className="text-white-50" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  GTICC facilitates structured cross-border collaborations, helping stakeholders navigate trade block dynamics, build institutional visibility, and access international investment opportunities.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '30px' }}>
                <h3 style={{ color: '#C8A24A' }}><i className="fa-solid fa-eye me-2"></i>Vision</h3>
                <p className="text-white-50" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  To serve as a high-trust, execution-oriented global bridging consortium that enables sustainable and credible partnerships across key priority corridors.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.3)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '30px' }}>
                <h4 style={{ color: '#C8A24A' }}>Governance Structure</h4>
                <p style={{ fontSize: '16px' }} className="text-white-50 mb-0">
                  GTICC is governed by structured internal guidelines designed to maintain high standards of transparency, confidentiality, and commercial relevance. Detailed governance framework publications will be updated as officially released.
                </p>
              </div>
            </div>
             <div className="col-lg-4 col-md-6">
               <Link to="/about-us/leadership" className="w-100 text-decoration-none d-block h-100">
                 <div className="gticc-card h-100 gticc-about-clickable-card" style={{ background: 'rgba(6, 21, 46, 0.3)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '30px' }}>
                   <h4 style={{ color: '#C8A24A' }}>Leadership Overview</h4>
                   <p style={{ fontSize: '16px' }} className="text-white-50 mb-0 gticc-about-card-desc">
                     Leadership information will be updated once officially published by GTICC.
                   </p>
                   <div className="gticc-about-card-footer">
                     <span className="gticc-learn-more-link">
                       Learn More <span className="arrow-symbol">→</span>
                     </span>
                   </div>
                 </div>
               </Link>
             </div>
             <div className="col-lg-4 col-md-12">
               <Link to="/about-us/advisory-council" className="w-100 text-decoration-none d-block h-100">
                 <div className="gticc-card h-100 gticc-about-clickable-card" style={{ background: 'rgba(6, 21, 46, 0.3)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '30px' }}>
                   <h4 style={{ color: '#C8A24A' }}>Advisory Council</h4>
                   <p style={{ fontSize: '16px' }} className="text-white-50 mb-0 gticc-about-card-desc">
                     Advisory Council details will be updated as GTICC publishes official governance and advisory information.
                   </p>
                   <div className="gticc-about-card-footer">
                     <span className="gticc-learn-more-link">
                       Learn More <span className="arrow-symbol">→</span>
                     </span>
                   </div>
                 </div>
               </Link>
             </div>
          </div>

          <div className="gticc-card" style={{ background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.25)', padding: '30px' }}>
            <h4 style={{ color: '#C8A24A' }}><i className="fa-solid fa-shield-halved me-2"></i>Transparency Statement</h4>
            <p style={{ fontSize: '17px', lineHeight: '1.7' }} className="text-white-50">
              GTICC is a private consortium and operates independently. All B2B, B2G, and B2C activities are coordinated on a structured fee-for-service or membership-access basis.
            </p>
            <p style={{ fontSize: '17px', lineHeight: '1.7' }} className="text-white-50 mb-0">
              <strong>Legal Disclaimer:</strong> GTICC facilitates introductions and collaboration pathways but does not guarantee funding, approvals, buyers, contracts, partnerships, or commercial outcomes. All formal engagements are subject to internal review and qualification.
            </p>
          </div>

          {/* Legal Governance & Policy Access Buttons */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
            <Link
              to="/terms-of-use"
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.4px',
              }}
            >
              <i className="fa-solid fa-file-contract" style={{ color: '#C8A24A' }}></i>
              <span>Terms of Use</span>
            </Link>
            <Link
              to="/privacy-policy"
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.4px',
              }}
            >
              <i className="fa-solid fa-user-shield" style={{ color: '#C8A24A' }}></i>
              <span>Privacy Policy</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================= CTA Strip */}
      <section className="gticc-section bg-panel gticc-about-cta-section">
        <div className="container text-center">
          <h2 className="title mb-4">Ready to access structured global opportunities?</h2>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link className="btn" to="/membership">
              Explore Membership
              <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32" className="ms-2">
                <path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z" />
              </svg>
            </Link>
            <Link className="btn btn-ghost" to="/contact-us">
              Start a Strategic Collaboration
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
