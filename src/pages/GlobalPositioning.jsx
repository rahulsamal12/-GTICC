import React from 'react';
import { Link } from 'react-router-dom';

export default function GlobalPositioning() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/whatwedo_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <h1 className="title">Institutional Visibility with GTICC</h1>
                    <p style={{ fontSize: '24px' }}>Many jurisdictions, boards, and organizations lack structured international visibility. GTICC
                        supports positioning, exposure, convening access, delegation amplification, and strategic
                        introductions.</p><Link className="btn" to="/contact-us">Start a Strategic Collaboration</Link>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg2.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="gticc-card">
                                <h3>What GTICC Can Support</h3>
                                <ul className="gticc-list">
                                    <li style={{ fontSize: '24px' }}>International narrative support</li>
                                    <li style={{ fontSize: '24px' }}>Forum and delegation visibility</li>
                                    <li style={{ fontSize: '24px' }}>Strategic stakeholder outreach</li>
                                    <li style={{ fontSize: '24px' }}>Partnership introduction pathways</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="gticc-card">
                                <h3>What GTICC Does Not Claim</h3>
                                <ul className="gticc-list">
                                    <li style={{ fontSize: '24px' }}>No guaranteed political outcomes</li>
                                    <li style={{ fontSize: '24px' }}>No vanity media promises</li>
                                    <li style={{ fontSize: '24px' }}>No lobbying-first positioning</li>
                                    <li style={{ fontSize: '24px' }}>No invented proof or fake partnerships</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
  );
}
