import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../api/client';

export default function ContactUs() {
  const [interestType, setInterestType] = useState('');
  const [formData, setFormData] = useState({ name: '', organization: '', email: '', country: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError('');
    try {
      const response = await fetch(getApiUrl('/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interestType,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error occurred while storing enquiry.');
      }
      setReferenceId(result.referenceId || '');
      setSubmitted(true);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setServerError(err.message || 'Unable to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="site-content">
    <section className="gticc-hero gticc-contact-hero">
      <div className="container">
        <span className="sub-title"></span>
        <h1 className="title">Start a Strategic Collaboration</h1>
        <p style={{ fontSize: '28px' }}>Use this page for membership enquiries, delegation expressions of interest, partnership proposals, institutional visibility discussions, or trade and investment access conversations.</p>
      </div>
    </section>
    <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg1.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="container">
        <div className="row g-5 contact-section">
          <div className="col-lg-5 col-12">
            <div className="gticc-card mb-4 lead-routing-card">
              <h3>Lead Routing</h3>
              <ul className="gticc-list">
                <li style={{ fontSize: '24px' }}>Membership applications go to membership review.</li>
                <li style={{ fontSize: '24px' }}>Delegation enquiries go to programs and events.</li>
                <li style={{ fontSize: '24px' }}>Partnership proposals go to strategy.</li>
                <li style={{ fontSize: '24px' }}>Trade and investment enquiries go to business development.</li>
              </ul>
            </div>

          </div>
          <div className="col-lg-7 col-12">
            {submitted ? (
              <div className="gticc-card contact-form-card text-center p-5">
                <h3 style={{ color: '#C8A24A', marginBottom: '16px' }}>Enquiry Successfully Transmitted</h3>
                {referenceId && (
                  <p style={{ color: '#C8A24A', fontSize: '15px', fontFamily: 'monospace', margin: '12px 0' }}>
                    Reference ID: <strong>{referenceId}</strong>
                  </p>
                )}
                <p style={{ color: '#ffffff', fontSize: '18px' }}>
                  Thank you for contacting GTICC. Your strategic collaboration request has been routed to our executive triage committee.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn mt-4"
                  style={{ background: '#C8A24A', color: '#000', fontWeight: 'bold' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="gticc-card contact-form contact-form-card">
                {serverError && (
                  <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                    <strong>Submission Alert:</strong> {serverError}
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="contact-label text-white">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="contact-label text-white">Organization</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Organization"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="contact-label text-white">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="contact-label text-white">Country</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="contact-label text-white">Interest type</label>
                      <select
                        className="form-control"
                        required
                        value={interestType}
                        onChange={(e) => setInterestType(e.target.value)}
                        style={{ color: interestType ? '#000000' : undefined }}
                      >
                        <option value="">Interest type</option>
                        <option>Membership</option>
                        <option>Delegation / Trade Mission</option>
                        <option>Strategic Partnership</option>
                        <option>Investment / Trade Access</option>
                        <option>Institutional Positioning</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Tell us what you want to discuss"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button className="btn" type="submit" disabled={submitting}>
                      {submitting ? 'Transmitting...' : 'Submit Enquiry'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  </main>
  );
}
