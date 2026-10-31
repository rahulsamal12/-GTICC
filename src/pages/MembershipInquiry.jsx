import React from 'react';
import { Link } from 'react-router-dom';
import { tiers } from './Membership';

export default function MembershipInquiry() {
  return (
    <div className="site-content gticc-membership-page gticc-membership-inquiry-page">
      <section className="gticc-hero gticc-membership-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">Submit Membership Inquiry</h1>
          <p className="responsive-lead-text">
            Share your organization profile, sector focus, region of interest, and collaboration objectives for membership review.
          </p>
        </div>
      </section>

      <section className="space-ptb">
        <div className="container">
          <form className="gticc-card gticc-form" onSubmit={(event) => event.preventDefault()}>
            <div className="row g-3">
              {['Full name', 'Title / designation', 'Organization name', 'Email address', 'Phone / WhatsApp', 'Website', 'Country / region', 'Sector'].map((field) => (
                <div className="col-md-6" key={field}>
                  <label>{field}</label>
                  <input className="form-control" type={field === 'Email address' ? 'email' : 'text'} required />
                </div>
              ))}
              <div className="col-md-6">
                <label>Membership tier of interest</label>
                <select className="form-control" required>
                  {tiers.map((tier) => <option key={tier.name}>{tier.name}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label>Type of interest</label>
                <select className="form-control" required>
                  <option>Trade</option>
                  <option>Investment</option>
                  <option>Partnerships</option>
                  <option>Market entry</option>
                  <option>Delegation</option>
                  <option>Event participation</option>
                  <option>Institutional collaboration</option>
                  <option>Startup support</option>
                  <option>Professional services</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-12">
                <label>Brief organization profile</label>
                <textarea className="form-control" rows="4" required></textarea>
              </div>
              <div className="col-md-12">
                <label>What kind of connections or collaboration are you seeking?</label>
                <textarea className="form-control" rows="4" required></textarea>
              </div>
              <div className="col-md-12">
                <label className="gticc-checkbox">
                  <input type="checkbox" required />
                  <span>I understand that GTICC facilitates introductions and collaboration opportunities but does not guarantee business outcomes, investment, contracts, sales, approvals, or partnerships.</span>
                </label>
              </div>
              <div className="col-md-12">
                <p className="gticc-small-disclaimer">
                  By submitting this form, you acknowledge GTICC's <Link to="/membership-terms">Membership Terms</Link>. Terms and Privacy Policy links should be reviewed by GTICC legal counsel before publication.
                </p>
                <button className="btn" type="submit">Submit Membership Inquiry</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
