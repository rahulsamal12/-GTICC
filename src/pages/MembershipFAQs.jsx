import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faqs } from './MembershipPlans';

export default function MembershipFAQs() {
  // Dynamic SEO Setup
  useEffect(() => {
    document.title = "GTICC Membership FAQs | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Find answers to frequently asked questions about GTICC membership tiers, refund policy, introductions, and how we coordinate global trade forums.");
    }
  }, []);

  return (
    <div className="site-content gticc-membership-page">
      {/* Hero Banner */}
      <section className="gticc-hero gticc-hero--fullscreen" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}>
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" style={{ fontSize: '48px', fontWeight: '800', margin: '0 auto 20px auto' }}>Membership FAQs</h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            Find answers about GTICC membership, applications, renewals, launch offers, refunds, introductions, and member responsibilities.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="/membership/apply" className="btn">Apply for Membership</a>
            <a href="/membership/plans" className="btn btn-ghost">View Plans</a>
          </div>
        </div>
      </section>


      {/* Accordion FAQs */}
      <section className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title text-white">Frequently Asked Questions</h2>
            <p className="text-white-50 mt-2">Everything you need to know about the membership pathways and collaboration terms.</p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="accordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item" key={index} style={{ background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.15)', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                    <h3 className="accordion-header">
                      <button 
                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`} 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#membershipFaq${index}`}
                        style={{ background: 'transparent', color: '#ffffff', fontWeight: '600', padding: '20px' }}
                      >
                        {faq.q}
                      </button>
                    </h3>
                    <div id={`membershipFaq${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}>
                      <div className="accordion-body" style={{ padding: '0 20px 20px 20px', borderTop: 'none' }}>
                        <p style={{ color: '#d1d8e0', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Final CTA */}
      <section className="space-ptb bg-dark rounded-section text-center">
        <div className="container">
          <h2 className="title text-white mb-3">Still Have Questions?</h2>
          <p className="responsive-lead-text text-white-50 max-w-600 mb-4" style={{ margin: '0 auto 30px auto' }}>
            Our trade relations team is here to help clarify plan features, corporate profiles, and onboarding options.
          </p>
          <div className="gticc-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link className="btn" to="/membership/apply">Apply for Membership</Link>
            <Link className="btn btn-ghost" to="/contact-us">Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
