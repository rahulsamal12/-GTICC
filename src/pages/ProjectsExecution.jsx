import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectsExecution() {
  return (
    <main className="site-content">
            <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/project_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container"><span className="sub-title"></span>
                    <h1 className="title">Structured collaboration opportunities across priority sectors.</h1>
                    <p style={{ fontSize: '24px' }}>Where relevant, GTICC may support opportunity exploration with structuring, coordination,
                        stakeholder alignment, and execution-oriented follow-up.</p><Link className="btn"
                        to="/contact-us">Start a Strategic Collaboration</Link>
                </div>
            </section>
            <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg5.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Selective Support</h4>
                                <p style={{ fontSize: '24px' }}>GTICC participates where fit, credibility, stakeholder alignment, and practical value
                                    are clear.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card">
                                <h4>Structured Coordination</h4>
                                <p style={{ fontSize: '24px' }}>Support can include documentation, stakeholder follow-up, milestone clarity, and
                                    partner alignment.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gticc-card"> 
                                <h4>Governance Orientation</h4>
                                <p style={{ fontSize: '24px' }}>Claims are disciplined, process is measured, and commercial execution is handled with
                                    seriousness.</p>
                            </div>
                        </div>
                    </div>
                    <div className="gticc-card gticc-disclaimer-card mt-5">
                        <p>
                            Projects, initiatives, opportunity descriptions, sector themes, and collaboration areas listed on this website are provided for informational and exploratory purposes. They do not constitute an offer, solicitation, investment recommendation, legal advice, financial advice, or binding commercial opportunity. GTICC does not guarantee the accuracy, completeness, viability, financing, execution, approval, or commercial success of any project or opportunity. Interested parties must conduct their own due diligence.
                        </p>
                    </div>
                </div>
            </section>
        </main>
  );
}
