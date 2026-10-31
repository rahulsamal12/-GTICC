import React from 'react';
import { Link } from 'react-router-dom';

export default function Insights() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/insight_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container"><span className="sub-title"></span>
                    <h1 className="title">News, delegation recaps, opportunity notes, and institutional announcements.</h1>
                    <p style={{ fontSize: '24px', color: 'white' }}>This section is prepared as GTICC's future content engine for authority, activity, and search
                        visibility.</p>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg%209.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Delegation Recaps</h4>
                                <p style={{ fontSize: '24px' }}>Summaries of mission activity, participating sectors, and follow-up themes.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Opportunity Notes</h4>
                                <p style={{ fontSize: '24px' }}>Market access, sector priorities, corridor signals, and partnership themes.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Institutional Updates</h4>
                                <p style={{ fontSize: '24px' }}>Announcements, profile releases, programs, and strategic collaboration news.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
  );
}
