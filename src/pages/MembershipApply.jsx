import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../api/client';

export default function MembershipApply() {
  // Dynamic SEO Setup
  useEffect(() => {
    document.title = "Apply for GTICC Membership | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Submit your membership application to join GTICC. Provide organization details, sector focus, and collaboration interests for our advisory board review.");
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    orgName: '',
    designation: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    website: '',
    linkedIn: '',
    plan: 'Business Starter - CAD $249/year',
    sector: '',
    orgType: 'Startup',
    primaryInterest: 'Networking',
    orgDescription: '',
    connectionsSeeking: '',
    consent: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');
    try {
      const response = await fetch(getApiUrl('/applications/general'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error occurred while storing application.');
      }
      setReferenceId(result.referenceId || '');
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to post application:', err);
      setServerError(err.message || 'Unable to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-content gticc-membership-page">
      <style>{`
        .gticc-membership-page .gticc-card {
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        .success-box {
          background: rgba(200, 162, 74, 0.08);
          border: 1px solid #C8A24A;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          margin-top: 20px;
        }

        .success-box h4 {
          color: #C8A24A;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .success-box p {
          color: #ffffff;
          font-size: 16px;
        }

        /* ── Apply Form: select dropdown — typography & alignment ── */

        /* Closed state: selected value display */
        .gticc-form select,
        .gticc-form select.form-control,
        .gticc-form select.form-control:focus,
        .gticc-form select.form-control:active {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          font-size: 18px !important;
          line-height: 1.4 !important;
          padding: 14px 50px 14px 18px !important;
          min-height: 64px !important;
          height: auto !important;
          display: flex !important;
          align-items: center !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          vertical-align: middle !important;
          box-sizing: border-box !important;
          appearance: auto !important;
          -webkit-appearance: auto !important;
        }

        /* Open state: every option in the native dropdown list */
        .gticc-form select option,
        .gticc-form select.form-control option {
          color: #000000 !important;
          background-color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          padding: 12px 18px !important;
        }

        /* Highlighted / selected option inside the open list */
        .gticc-form select option:checked,
        .gticc-form select option:hover,
        .gticc-form select option:focus,
        .gticc-form select option:active,
        .gticc-form select.form-control option:checked {
          color: #000000 !important;
          background-color: #e5e5e5 !important;
        }

        /* Tablet */
        @media (max-width: 991px) {
          .gticc-form select,
          .gticc-form select.form-control {
            font-size: 17px !important;
            padding: 13px 46px 13px 16px !important;
            min-height: 60px !important;
          }
        }

        /* Mobile */
        @media (max-width: 575px) {
          .gticc-form select,
          .gticc-form select.form-control {
            font-size: 16px !important;
            padding: 12px 42px 12px 14px !important;
            min-height: 56px !important;
          }
        }
      `}</style>

      {/* Hero Banner */}
      <section className="gticc-hero gticc-hero--fullscreen" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}>
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" style={{ fontSize: '48px', fontWeight: '800', margin: '0 auto 20px auto' }}>Apply for GTICC Membership</h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            Submit your membership application form with your organization details and areas of interest.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="#application-form" className="btn">Start Application</a>
            <a href="/membership/plans" className="btn btn-ghost">View Plans First</a>
          </div>
        </div>
      </section>


      {/* Form Section */}
      <section id="application-form" className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9">
              {formSubmitted ? (
                <div className="success-box">
                  <h4>Application Submitted Successfully</h4>
                  {referenceId && (
                    <p style={{ color: '#C8A24A', fontWeight: 'bold' }}>
                      Application Reference ID: <span className="font-monospace">{referenceId}</span>
                    </p>
                  )}
                  <p>Thank you for your application to join the Global Trade & Investment Collaboration Consortium (GTICC).</p>
                  <p>Our membership team will review your application details for fit, relevance, and completeness, and will contact you via email at <strong>{formData.email}</strong> shortly with further onboarding instructions.</p>
                  <button className="btn mt-3" onClick={() => setFormSubmitted(false)}>Submit Another Application</button>
                </div>
              ) : (
                <form className="gticc-card gticc-form" onSubmit={handleFormSubmit} style={{ border: '1px solid rgba(200, 162, 74, 0.25)', padding: '30px' }}>
                  {serverError && (
                    <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
                      <strong>Submission Alert:</strong> {serverError}
                    </div>
                  )}
                  <h3 className="text-white mb-4" style={{ fontSize: '24px', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Apply for GTICC Membership</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="text-white">Full Name</label>
                      <input className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="orgName" className="text-white">Organization Name</label>
                      <input className="form-control" id="orgName" name="orgName" value={formData.orgName} onChange={handleInputChange} type="text" required />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="designation" className="text-white">Designation / Title</label>
                      <input className="form-control" id="designation" name="designation" value={formData.designation} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="text-white">Email Address</label>
                      <input className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} type="email" required />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="text-white">Phone / WhatsApp</label>
                      <input className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="country" className="text-white">Country</label>
                      <input className="form-control" id="country" name="country" value={formData.country} onChange={handleInputChange} type="text" required />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="city" className="text-white">City</label>
                      <input className="form-control" id="city" name="city" value={formData.city} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="website" className="text-white">Website</label>
                      <input className="form-control" id="website" name="website" value={formData.website} onChange={handleInputChange} type="text" required />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="linkedIn" className="text-white">LinkedIn Profile</label>
                      <input className="form-control" id="linkedIn" name="linkedIn" value={formData.linkedIn} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="plan" className="text-white">Membership Plan Interested In</label>
                      <select className="form-control" id="plan" name="plan" value={formData.plan} onChange={handleInputChange} required style={{ color: '#ffffff' }}>
                        <option value="Student & Future Leader - CAD $50/year">Student & Future Leader - CAD $50/year</option>
                        <option value="Business Starter - CAD $249/year">Business Starter - CAD $249/year</option>
                        <option value="Professional Member - CAD $499/year">Professional Member - CAD $499/year</option>
                        <option value="Growth Member - CAD $799/year">Growth Member - CAD $799/year</option>
                        <option value="Corporate Member - CAD $849.50 first year; CAD $1,699/year thereafter">Corporate Member - CAD $849.50 first year; CAD $1,699/year thereafter</option>
                        <option value="Global Partner Member - CAD $1,999.50 first year; CAD $3,999/year thereafter">Global Partner Member - CAD $1,999.50 first year; CAD $3,999/year thereafter</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="sector" className="text-white">Industry / Sector</label>
                      <input className="form-control" id="sector" name="sector" value={formData.sector} onChange={handleInputChange} type="text" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="orgType" className="text-white">Type of Organization</label>
                      <select className="form-control" id="orgType" name="orgType" value={formData.orgType} onChange={handleInputChange} required style={{ color: '#ffffff' }}>
                        <option value="Student / Young Professional">Student / Young Professional</option>
                        <option value="Startup">Startup</option>
                        <option value="SME">SME</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Investor">Investor</option>
                        <option value="Institution">Institution</option>
                        <option value="Non-Profit">Non-Profit</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Government / Public Sector">Government / Public Sector</option>
                        <option value="Education / Training">Education / Training</option>
                        <option value="Trade / Sector Association">Trade / Sector Association</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="primaryInterest" className="text-white">Primary Interest</label>
                      <select className="form-control" id="primaryInterest" name="primaryInterest" value={formData.primaryInterest} onChange={handleInputChange} required style={{ color: '#ffffff' }}>
                        <option value="Networking">Networking</option>
                        <option value="Trade Connections">Trade Connections</option>
                        <option value="Investment Discussions">Investment Discussions</option>
                        <option value="Market Entry">Market Entry</option>
                        <option value="Sector Roundtables">Sector Roundtables</option>
                        <option value="Delegations">Delegations</option>
                        <option value="Business Visibility">Business Visibility</option>
                        <option value="Partnerships">Partnerships</option>
                        <option value="Events">Events</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Membership Directory">Membership Directory</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="orgDescription" className="text-white">Briefly describe your business or organization</label>
                      <textarea className="form-control" id="orgDescription" name="orgDescription" value={formData.orgDescription} onChange={handleInputChange} rows="4" required></textarea>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="connectionsSeeking" className="text-white">What type of connections are you seeking?</label>
                      <textarea className="form-control" id="connectionsSeeking" name="connectionsSeeking" value={formData.connectionsSeeking} onChange={handleInputChange} rows="4" required></textarea>
                    </div>
                    
                    <div className="col-md-12">
                      <label className="gticc-checkbox text-white-50" style={{ display: 'flex', gap: '10px', alignItems: 'start', cursor: 'pointer' }}>
                        <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} style={{ marginTop: '5px' }} required />
                        <span>I understand that GTICC facilitates connections, events, visibility, networking, and collaboration opportunities, and does not guarantee business outcomes, funding, contracts, investment, approvals, sales, or transactions.</span>
                      </label>
                    </div>
                    
                    <div className="col-md-12 mt-4">
                      <p className="gticc-small-disclaimer mb-3">
                        Taxes, if applicable, are extra. By submitting this form, you acknowledge GTICC's <Link to="/membership/membership-terms" style={{ color: '#C8A24A', textDecoration: 'underline' }}>Membership Terms</Link>.
                      </p>
                      <button className="btn" type="submit" style={{ width: '100%' }}>Submit Membership Application</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Disclaimer */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="gticc-card gticc-disclaimer-card" style={{ borderLeft: '4px solid #C8A24A', background: 'rgba(8, 22, 48, 0.3)' }}>
            <p className="gticc-small-disclaimer" style={{ fontSize: '17px', color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> GTICC is a facilitator and connector. GTICC membership provides access to networking, visibility, events, introductions, and collaboration opportunities. GTICC does not guarantee investment, funding, sales, contracts, approvals, or business outcomes. Members are responsible for their own due diligence and final decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
