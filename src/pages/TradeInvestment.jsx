import React from 'react';
import { Link } from 'react-router-dom';

export default function TradeInvestment() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/whatwedo_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <h1 className="title">The intellectual center of GTICC's platform.</h1>
                    <p style={{ fontSize: '24px' }}>GTICC connects governments, institutions, investors, member companies, and strategic partners
                        through a credibility-first process that turns global interest into qualified conversations and
                        practical next steps.</p><Link className="btn" to="/contact-us">Start a Strategic Collaboration</Link>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg2.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Use Cases</h4>
                                <ul className="gticc-list">
                                    <li style={{ fontSize: '24px' }}>Market-entry access</li>
                                    <li style={{ fontSize: '24px' }}>Investment attraction</li>
                                    <li style={{ fontSize: '24px' }}>Partner identification</li>
                                    <li style={{ fontSize: '24px' }}>Cross-border opportunity curation</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Stakeholders</h4>
                                <ul className="gticc-list">
                                    <li style={{ fontSize: '24px' }}>Governments and public bodies</li>
                                    <li style={{ fontSize: '24px' }}>Member companies</li>
                                    <li style={{ fontSize: '24px' }}>Investors and capital partners</li>
                                    <li style={{ fontSize: '24px' }}>Institutions and sponsors</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Value Created</h4>
                                <ul className="gticc-list">
                                    <li style={{ fontSize: '24px' }}>Structured visibility</li>
                                    <li style={{ fontSize: '24px' }}>Qualified introductions</li>
                                    <li style={{ fontSize: '24px' }}>Delegation pathways</li>
                                    <li style={{ fontSize: '24px' }}>Follow-up momentum</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
  );
}
