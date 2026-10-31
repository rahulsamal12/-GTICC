import React from 'react';
import { Link } from 'react-router-dom';

export default function MembershipResources() {
  return (
    <div className="site-content gticc-membership-page">
      <section className="gticc-hero gticc-membership-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">Resources for Members and Collaboration Partners</h1>
          <p className="responsive-lead-text">
            Access member network pathways, directory visibility, collaboration disclaimers, and next steps for structured GTICC engagement.
          </p>
        </div>
      </section>

      <section className="space-ptb gticc-membership-resources-section gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg6.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="gticc-card gticc-resource-card h-100">
                <h3>Members Directory</h3>
                <p>Explore approved members, organizations, and partners participating in GTICC's global collaboration network.</p>
                <Link className="btn btn-ghost" to="/members">View Members Directory</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="gticc-card gticc-resource-card h-100">
                <h3>Membership Terms</h3>
                <p>Review the access-based nature of membership, member responsibilities, disclaimers, and participation terms.</p>
                <Link className="btn btn-ghost" to="/membership-terms">Read Terms</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="gticc-card gticc-resource-card h-100">
                <h3>Apply or Update Interest</h3>
                <p>Submit your membership inquiry, organization profile, sector focus, and collaboration objectives.</p>
                <Link className="btn btn-ghost" to="/membership-inquiry">Submit Inquiry</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
