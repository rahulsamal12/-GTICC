import React from 'react';
import { Link } from 'react-router-dom';

export default function Delegations() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/whatwedo_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <h1 className="title">Delegations as a serious product line, not a vague event category.</h1>
                    <p style={{ fontSize: '24px' }}>GTICC supports inbound, outbound, bilateral, sector-focused, and investment-linked missions with
                        participant curation, program coordination, meeting facilitation, and post-mission follow-up.
                    </p><Link className="btn" to="/contact-us">Start a Strategic Collaboration</Link>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg2.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="gticc-process">
                        <div className="gticc-card">
                            <h4>Identify Opportunity</h4>
                            <p style={{ fontSize: '24px' }}>Define the market, sector, jurisdiction, or investment theme.</p>
                        </div>
                        <div className="gticc-card">
                            <h4>Curate Participants</h4>
                            <p style={{ fontSize: '24px' }}>Filter stakeholders by relevance, readiness, and credibility.</p>
                        </div>
                        <div className="gticc-card">
                            <h4>Coordinate Mission</h4>
                            <p style={{ fontSize: '24px' }}>Build the program, meetings, forums, and visibility moments.</p>
                        </div>
                        <div className="gticc-card">
                            <h4>Facilitate Meetings</h4>
                            <p style={{ fontSize: '24px' }}>Create structured rooms for qualified international engagement.</p>
                        </div>
                        <div className="gticc-card">
                            <h4>Follow Up</h4>
                            <p style={{ fontSize: '24px' }}>Support next steps, introductions, documentation, and opportunity tracking.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
  );
}
