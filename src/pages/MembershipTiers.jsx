import React from 'react';
import { Link } from 'react-router-dom';
import { tiers } from './Membership';

export default function MembershipTiers() {
  return (
    <div className="site-content gticc-membership-page">
      <section className="gticc-hero gticc-membership-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">Choose the Membership Pathway That Fits Your Role</h1>
          <p className="responsive-lead-text">
            Membership categories are reviewed by application and aligned to audience, purpose, collaboration fit, and strategic relevance.
          </p>
        </div>
      </section>

      <section className="space-ptb gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg7.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container">
          <div className="grid-wrapper grid-xl-3 grid-md-2 grid-xs-1">
            {tiers.map((tier) => (
              <div className="gticc-card gticc-tier-card" key={tier.name}>
                <h3>{tier.name}</h3>
                <p><strong>Audience:</strong> {tier.audience}</p>
                <p><strong>Core Purpose:</strong> {tier.purpose}</p>
                <p className="gticc-small-disclaimer">By Application</p>
                <Link to="/membership-inquiry" className="btn btn-ghost">{tier.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
