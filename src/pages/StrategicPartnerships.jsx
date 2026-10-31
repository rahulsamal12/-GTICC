import React from 'react';
import { Link } from 'react-router-dom';

export default function StrategicPartnerships() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/whatwedo_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <h1 className="title">A platform for alliances, not just enquiries.</h1>
                    <p style={{ fontSize: '24px' }}>GTICC builds partnerships around market access, country collaborations, co-hosted programs,
                        sponsorships, corridor initiatives, and curated opportunity development.</p><Link className="btn"
                        to="/contact-us">Start a Strategic Collaboration</Link>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg2.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Partner Categories</h4>
                                <p style={{ fontSize: '24px' }}>Governments, institutions, sponsors, trade bodies, investors, corporate partners, and
                                    program collaborators.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Partnership Formats</h4>
                                <p style={{ fontSize: '24px' }}>Co-hosted events, country programs, market access initiatives, delegation support,
                                    and sector campaigns.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Expected Value</h4>
                                <p style={{ fontSize: '24px' }}>Shared visibility, qualified rooms, structured follow-up, and international
                                    relevance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
  );
}
