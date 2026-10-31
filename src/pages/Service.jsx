import React from 'react';
import { Link } from 'react-router-dom';

export default function Service() {
  return (
    <main className="site-content">
      <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/whatwedo_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="sub-title">[ What We Do ]</span>
          <h1 className="title">A structured platform for trade, investment, delegations, and international access.</h1>
          <p>GTICC organizes its work through five core pillars designed to create credibility, access, visibility, and commercial momentum across borders.</p>
        </div>
      </section>
      <section className="gticc-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/services/trade-investment-bridging"><h3>Trade & Investment Bridging</h3><p>The master GTICC identity: connecting stakeholders across markets and opportunity corridors.</p></Link></div>
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/services/delegations"><h3>Delegations & Trade Missions</h3><p>Curated inbound, outbound, bilateral, sector-focused, and investment-linked programs.</p></Link></div>
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/services/strategic-partnerships"><h3>Strategic Partnerships</h3><p>Country collaborations, co-hosted programs, sponsor relationships, and corridor initiatives.</p></Link></div>
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/services/global-positioning"><h3>Global Positioning</h3><p>Institutional visibility, convening access, international narrative support, and delegation amplification.</p></Link></div>
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/services/projects-execution"><h3>Projects & Execution Support</h3><p>Selective downstream support for structured opportunities and cross-border coordination.</p></Link></div>
            <div className="col-lg-4 col-md-6"><Link className="gticc-card d-block" to="/membership"><h3>Membership Gateway</h3><p>The commercial access model for companies, institutions, investors, and strategic partners.</p></Link></div>
          </div>
        </div>
      </section>

      <section className="gticc-section bg-panel" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="gticc-section-kicker" style={{ color: '#C8A24A' }}>PROGRAMS & CORE OFFERINGS</span>
            <h2 className="title">Structured Activities & Facilitation</h2>
            <p className="responsive-lead-text">
              Detailed descriptions of the core coordination support provided across the GTICC network.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                title: 'Trade Missions',
                desc: 'GTICC facilitates and coordinates inbound and outbound trade missions, bringing qualified corporate and public partners together to explore cross-border growth. GTICC coordinates agendas and local introductions but does not guarantee buyers, contracts, or business transactions.'
              },
              {
                title: 'Investment Matchmaking',
                desc: 'GTICC enables structured exposure and introduction pathways between capital partners and prepared project portfolios. GTICC does not guarantee funding, investment closure, or regulatory approvals.'
              },
              {
                title: 'Delegation Coordination',
                desc: 'GTICC coordinates bilateral, delegation-led access programs for municipal, regional, and national trade representations. GTICC helps structure meeting schedules and local representation but does not guarantee political or economic outcomes.'
              },
              {
                title: 'Government & Institutional Engagement',
                desc: 'GTICC provides a pathway for institutional members to align with regulatory, diaspora, and public sector stakeholders to establish credibility and visibility in target corridors.'
              },
              {
                title: 'Business Networking',
                desc: 'GTICC structures high-value networking environments (such as forums, workshops, and roundtables) to facilitate peer-to-peer dialogues and connection opportunities between qualified leaders.'
              },
              {
                title: 'Strategic Partnerships',
                desc: 'GTICC supports multi-sector, corridor-specific collaboration agreements and joint initiatives, enabling organizations to coordinate efforts and pool resources effectively.'
              },
              {
                title: 'Member Visibility',
                desc: 'GTICC provides registered members with directory profiles, platform highlighting, and publication features to support high-trust positioning across international markets.'
              },
              {
                title: 'Sector Dialogue',
                desc: 'GTICC organises themed roundtables and panels to align sector-specific priorities across industries like healthcare, technology, infrastructure, energy, and logistics.'
              }
            ].map((program, idx) => (
              <div className="col-12 col-md-6" key={idx}>
                <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.2)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '30px' }}>
                  <h4 style={{ color: '#C8A24A' }} className="mb-2">{program.title}</h4>
                  <p style={{ fontSize: '16px', lineHeight: '1.6' }} className="text-white-50 mb-0">{program.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="gticc-card mt-5" style={{ borderLeft: '4px solid #C8A24A', background: 'rgba(8, 22, 48, 0.3)', padding: '25px' }}>
            <p className="mb-0 text-white-50" style={{ fontSize: '15px' }}>
              <strong>Important Mandate Note:</strong> GTICC serves solely as a coordinator and facilitator. All final agreements, negotiation processes, financial due diligence, and legal transactions remain the direct and sole responsibility of the participating members and third parties. GTICC does not guarantee approvals, buyer acquisition, funding, or commercial success.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
