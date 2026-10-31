import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveSlider from '../components/ResponsiveSlider';

// DOCX Pricing Tiers
export const tiers = [
  {
    id: 'student',
    name: 'Student & Future Leader',
    price: 'CAD $50',
    frequency: 'year',
    renewal: 'CAD $50/year',
    bestFor: 'Students, young professionals, future leaders',
    audience: 'For students, young professionals, and future leaders who want early exposure to business, entrepreneurship, international collaboration, and professional networking.',
    includes: [
      'Student member profile',
      'Access to selected GTICC events at student rates',
      'Invitations to youth and future-leader sessions',
      'Access to selected webinars and learning sessions',
      'Volunteer and event participation opportunities',
      'Eligibility for mentorship-based introductions where available'
    ],
    cta: 'Apply as Student Member'
  },
  {
    id: 'starter',
    name: 'Business Starter',
    price: 'CAD $249',
    frequency: 'year',
    renewal: 'CAD $249/year',
    bestFor: 'New entrepreneurs, small businesses, solo professionals',
    audience: 'For new entrepreneurs, small business owners, and early-stage professionals who want to build visibility and start connecting with a wider business network.',
    includes: [
      'One member profile in the GTICC directory',
      'Business introduction post on GTICC digital channels',
      'Access to selected member events',
      'Member pricing for paid events and workshops',
      'Eligibility to participate in selected networking sessions',
      'Access to general member updates and opportunities',
      'Option to upgrade membership anytime'
    ],
    cta: 'Join as Business Starter'
  },
  {
    id: 'professional',
    name: 'Professional Member',
    price: 'CAD $499',
    frequency: 'year',
    renewal: 'CAD $499/year',
    bestFor: 'Consultants, advisors, service providers, independent professionals',
    audience: 'For consultants, advisors, service providers, independent professionals, and business specialists seeking credibility, visibility, and referral-based networking.',
    includes: [
      'One enhanced professional profile',
      'Listing under professional services or relevant sector category',
      'Access to member networking events',
      'Member pricing for workshops, delegations, and briefings',
      'One digital member spotlight per year',
      'Eligibility to participate in relevant expert panels or webinars',
      'Opportunity to offer member-to-member benefits or service discounts, subject to GTICC approval'
    ],
    cta: 'Join as Professional Member'
  },
  {
    id: 'growth',
    name: 'Growth Member',
    price: 'CAD $799',
    frequency: 'year',
    renewal: 'CAD $799/year',
    bestFor: 'SMEs, exporters, startups, growing companies',
    audience: 'For SMEs, exporters, startups, and growing companies looking to build visibility, identify potential partners, and explore cross-border collaboration.',
    includes: [
      'One company profile in the GTICC member directory',
      'One executive or founder profile',
      'Two complimentary passes to selected GTICC networking sessions annually',
      'Member pricing for all eligible GTICC events',
      'One annual business spotlight feature',
      'Eligibility to request facilitated introductions',
      'Access to sector roundtables where relevant',
      'Opportunity to submit business collaboration interests to GTICC'
    ],
    cta: 'Join as Growth Member'
  },
  {
    id: 'corporate',
    name: 'Corporate Member',
    price: 'CAD $849.50',
    frequency: 'first year',
    renewal: 'CAD $1,699/year thereafter',
    bestFor: 'Established companies, institutions, professional firms',
    audience: 'For established companies, institutions, professional firms, and organizations seeking stronger visibility and structured participation in GTICC activities.',
    isPromo: true,
    promoBadge: 'First-Year Launch Offer – 50% Off',
    includes: [
      'Up to two member profiles under one organization',
      'Enhanced company profile in the GTICC directory',
      'Priority listing in the relevant sector category',
      'Four complimentary passes to selected GTICC networking sessions annually',
      'Eligibility to request curated meetings, subject to relevance, availability, mutual interest, and consent',
      'Invitation eligibility for selected private roundtables and briefings',
      'Two digital visibility features annually',
      'Logo placement on the member page',
      'Opportunity to sponsor or co-host selected GTICC activities, subject to approval'
    ],
    cta: 'Join as Corporate Member'
  },
  {
    id: 'global-partner',
    name: 'Global Partner Member',
    price: 'CAD $1,999.50',
    frequency: 'first year',
    renewal: 'CAD $3,999/year thereafter',
    bestFor: 'Companies, investors, institutions, associations, sector partners',
    audience: 'For companies, investors, institutions, trade bodies, sector organizations, and strategic partners seeking deeper engagement, visibility, and curated access within GTICC’s collaboration network.',
    isPromo: true,
    promoBadge: 'First-Year Launch Offer – 50% Off',
    includes: [
      'Up to three member profiles under one organization',
      'Premium company profile in the GTICC directory',
      'Priority consideration for curated introduction requests',
      'Invitation eligibility for selected private roundtables, delegation briefings, and leadership sessions',
      'Six complimentary passes to selected GTICC networking sessions annually',
      'Four digital visibility features annually',
      'Logo placement on GTICC member and partner sections',
      'Opportunity to be featured in GTICC newsletters or sector updates',
      'Eligibility to propose sector roundtables, market-entry discussions, or collaboration briefings',
      'Priority access to sponsorship and co-hosting opportunities, subject to GTICC approval'
    ],
    cta: 'Apply as Global Partner Member'
  }
];

export const comparisonRows = [
  {
    benefit: 'Member directory listing',
    values: ['Basic', 'Basic', 'Professional', 'Company + founder', 'Enhanced', 'Premium']
  },
  {
    benefit: 'Digital introduction post',
    values: ['No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes']
  },
  {
    benefit: 'Member pricing for events',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes']
  },
  {
    benefit: 'Complimentary event passes',
    values: ['Student rates', 'No', 'No', '2/year', '4/year', '6/year']
  },
  {
    benefit: 'Business spotlight',
    values: ['No', 'No', '1/year', '1/year', '2/year', '4/year']
  },
  {
    benefit: 'Curated introduction request eligibility',
    values: ['Limited', 'Limited', 'Yes', 'Yes', 'Priority request', 'Priority request']
  },
  {
    benefit: 'Roundtable participation eligibility',
    values: ['Limited', 'Limited', 'Selected', 'Selected', 'Priority consideration', 'Priority consideration']
  },
  {
    benefit: 'Organization profiles included',
    values: ['1 individual', '1 business', '1 professional', '1 company + founder', 'Up to 2 profiles', 'Up to 3 profiles']
  },
  {
    benefit: 'Logo placement on membership page',
    values: ['No', 'No', 'No', 'No', 'Yes', 'Premium placement']
  },
  {
    benefit: 'Co-hosting opportunity eligibility',
    values: ['No', 'No', 'Limited', 'Limited', 'Eligible', 'Priority eligible']
  },
  {
    benefit: 'Delegation briefing eligibility',
    values: ['No', 'No', 'Selected', 'Selected', 'Selected', 'Priority consideration']
  }
];

// DOCX Why Join GTICC
export const benefits = [
  {
    title: 'Business Visibility',
    description: 'Showcase your organization, services, leadership, and sector focus through GTICC’s member platform.'
  },
  {
    title: 'Curated Introduction Requests',
    description: 'Request facilitated introductions to relevant businesses, institutions, service providers, sector leaders, and collaboration partners. Introductions are subject to relevance, availability, mutual interest, and consent.'
  },
  {
    title: 'Events & Roundtables',
    description: 'Participate in GTICC networking sessions, business briefings, sector roundtables, delegation meetings, and member-only sessions.'
  },
  {
    title: 'Global Collaboration Access',
    description: 'Engage with opportunities connected to Canada and international markets through GTICC’s network.'
  },
  {
    title: 'Member Directory Listing',
    description: 'Create a professional member profile so other members and visitors can understand your business and connect.'
  },
  {
    title: 'Sector Participation',
    description: 'Join conversations and initiatives across trade, investment, healthcare, technology, education, infrastructure, startups, and professional services.'
  }
];

// DOCX FAQ Section
export const faqs = [
  {
    q: 'Is GTICC a chamber of commerce?',
    a: 'GTICC is not a chamber of commerce. GTICC is a private global trade and investment collaboration consortium that facilitates business connections, networking, visibility, events, and cross-border collaboration opportunities.'
  },
  {
    q: 'Does membership guarantee business deals?',
    a: 'No. Membership does not guarantee deals, sales, contracts, investment, government approvals, funding, buyers, immigration outcomes, or business results.'
  },
  {
    q: 'Can GTICC introduce me to investors or partners?',
    a: 'GTICC may facilitate introduction requests where relevant and appropriate. All introductions depend on fit, availability, mutual interest, and consent.'
  },
  {
    q: 'Are memberships annual?',
    a: 'Yes. GTICC memberships are annual and renew yearly unless cancelled according to GTICC membership terms.'
  },
  {
    q: 'Can I upgrade my membership?',
    a: 'Yes. Members may request an upgrade at any time. Upgrade approval and fee adjustment are subject to GTICC membership administration.'
  },
  {
    q: 'Are membership fees refundable?',
    a: 'Membership fees are non-refundable once membership access, listing, visibility, event access, onboarding, or benefits have started.'
  },
  {
    q: 'Does the first-year launch offer apply to every membership tier?',
    a: 'No. The first-year 50% launch offer applies only to Corporate Member and Global Partner Member plans.'
  },
  {
    q: 'What happens after the first-year launch offer?',
    a: 'After the first year, Corporate Member and Global Partner Member plans renew at the regular annual fee unless cancelled according to GTICC membership terms.'
  },
  {
    q: 'Can GTICC reject a membership application?',
    a: 'Yes. GTICC may approve, decline, defer, or request additional information for any membership application.'
  },
  {
    q: 'Can members use the GTICC logo?',
    a: 'Members may only use GTICC membership badges, logos, or marks according to written GTICC brand-use guidelines and approval.'
  }
];

export default function MembershipPlans() {
  // Dynamic SEO Setup
  useEffect(() => {
    document.title = "GTICC Membership Plans | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore our structured membership pricing tiers, comparison tables, and detailed plan benefits. Select a plan to scale your global visibility and cross-border trade networks.");
    }
  }, []);

  return (
    <div className="site-content gticc-membership-page">
      <style>{`
        .gticc-membership-page .gticc-card {
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
        
        .gticc-membership-page .grid-wrapper {
          perspective: 1200px !important;
        }
        
        .gticc-membership-page .gticc-card:hover {
          transform: translateY(-8px) scale(1.015) !important;
          border-color: rgba(255, 223, 137, 0.9) !important;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4), 0 0 28px rgba(200, 162, 74, 0.42) !important;
        }

        /* Badge — in-flow, centred above plan title on promo cards */
        .pricing-card-badge {
          display: block;
          width: fit-content;
          margin: 0 auto 20px auto;
          background: #C8A24A;
          color: #030d1e;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.4px;
          padding: 10px 20px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(200, 162, 74, 0.45);
          white-space: nowrap;
          text-align: center;
          line-height: 1;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .pricing-card-badge {
            font-size: 13px;
            padding: 8px 16px;
            margin-bottom: 16px;
          }
        }
        
        .price-text-large {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
        }

        .price-text-frequency {
          font-size: 16px;
          color: #a4b0be;
          font-weight: 400;
        }
        
        .renewal-text {
          font-size: 13px;
          color: #C8A24A;
          margin-top: 5px;
          font-weight: 600;
        }

        .includes-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
          text-align: left;
        }

        .includes-list li {
          font-size: 15px;
          margin-bottom: 12px;
          color: #d1d8e0;
          position: relative;
          padding-left: 24px;
        }

        .includes-list li::before {
          content: '✓';
          color: #C8A24A;
          font-weight: bold;
          position: absolute;
          left: 0;
          top: 0;
        }

        .gticc-table-container {
          overflow-x: auto;
          background: rgba(8, 22, 48, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(200, 162, 74, 0.15);
          padding: 10px;
        }

        .gticc-table {
          width: 100%;
          border-collapse: collapse;
          color: #ffffff;
          font-size: 15px;
          min-width: 900px;
        }

        .gticc-table th, .gticc-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .gticc-table th {
          background: rgba(200, 162, 74, 0.08);
          color: #C8A24A;
          font-weight: 700;
          border-bottom: 2px solid rgba(200, 162, 74, 0.3);
        }

        .gticc-table tr:hover {
          background: rgba(200, 162, 74, 0.03);
        }

        .gticc-table td:first-child {
          font-weight: 600;
          color: #ffffff;
        }

        .gticc-card.highlighted-gold-border {
          border: 2px solid rgba(200, 162, 74, 0.7) !important;
          background: linear-gradient(135deg, rgba(8, 22, 48, 0.85), rgba(20, 30, 55, 0.95)) !important;
        }

        /* Align INCLUDES: label — only applied to last-row cards via inline style */
        .pricing-card-top {
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* Hero Banner */}
      <section className="gticc-hero gticc-hero--fullscreen" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}>
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" style={{ fontSize: '48px', fontWeight: '800', margin: '0 auto 20px auto' }}>Membership Plans &amp; Pricing</h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Choose the membership tier designed to fit your organization's business, trade, and collaboration objectives.
          </p>
          <div className="gticc-actions mt-4" style={{ justifyContent: 'center' }}>
            <a href="#pricing-cards" className="btn">View Plans</a>
            <a href="/membership/apply" className="btn btn-ghost">Apply Now</a>
          </div>
        </div>
      </section>


      {/* Pricing Cards */}
      <section id="pricing-cards" className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title text-white">Consortium Membership Tiers</h2>
            <p className="text-white-50 mt-2">Select the plan that matches your organization, role, or collaboration goals.</p>
          </div>
          <ResponsiveSlider desktopClass="grid-wrapper grid-xl-3 grid-md-2 grid-xs-1">
            {tiers.map((tier) => (
              <div 
                className={`gticc-card gticc-tier-card ${tier.isPromo ? 'highlighted-gold-border' : ''}`} 
                key={tier.id} 
                style={{ position: 'relative', overflow: 'hidden', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'between', padding: '24px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top content block — min-height only on last-row cards to align INCLUDES: */}
                  <div
                    className="pricing-card-top"
                    style={{
                      ...(tier.id === 'growth' ? { paddingTop: '54px' } : {}),
                      ...(['growth', 'corporate', 'global'].includes(tier.id) ? { minHeight: '320px' } : {})
                    }}
                  >
                    {tier.isPromo && <span className="pricing-card-badge">{tier.promoBadge}</span>}
                    <h3 className="text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', marginTop: 0 }}>{tier.name}</h3>
                    <div className="mb-3">
                      <span className="price-text-large">{tier.price}</span>
                      <span className="price-text-frequency">/{tier.frequency}</span>
                      {tier.isPromo && <div className="renewal-text">Renewal: {tier.renewal}</div>}
                    </div>
                    <p className="text-white-50 mb-3" style={{ fontSize: '15px' }}>{tier.audience}</p>
                  </div>
                  {/* INCLUDES section — always starts at the same vertical position */}
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0 0 12px 0' }} />
                  <p className="text-white font-weight-bold mb-2" style={{ fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Includes:</p>
                  <ul className="includes-list">
                    {tier.includes.map((incl, idx) => (
                      <li key={idx}>{incl}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4">
                  <Link to="/membership/apply" className="btn btn-ghost w-100" style={{ textAlign: 'center' }}>{tier.cta}</Link>
                </div>
              </div>
            ))}
          </ResponsiveSlider>

          <div className="text-center mt-5 text-white-50" style={{ maxWidth: '800px', margin: '40px auto 0 auto', fontSize: '15px', lineHeight: '1.6' }}>
            <p>
              <strong>First-Year Launch Offer:</strong> Corporate Member and Global Partner Member receive 50% off the first year. The regular annual fee applies from the second year onward unless membership is cancelled according to GTICC membership terms. Taxes, if applicable, are extra.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-ptb">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title">Plan Comparison Table</h2>
            <p className="text-white-50 mt-2">Compare detailed benefits across all membership tiers.</p>
          </div>
          
          <div className="gticc-table-container">
            <table className="gticc-table">
              <thead>
                <tr>
                  <th>Benefit</th>
                  <th>Student</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Growth</th>
                  <th>Corporate</th>
                  <th>Global Partner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.benefit}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} style={{ color: val === 'No' ? '#ff7675' : '#ffffff' }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed Plans Blocks */}
      <section className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title text-white">Detailed Membership Deliverables</h2>
            <p className="text-white-50 mt-2">A detailed breakdown of all features and services included in each plan.</p>
          </div>
          
          <ResponsiveSlider desktopClass="row g-4">
            {tiers.map((tier) => (
              <div className="col-lg-6" key={tier.id}>
                <div className="gticc-card h-100 p-4" style={{ background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.15)' }}>
                  <h4 className="text-white mb-2" style={{ fontSize: '22px', color: '#C8A24A' }}>{tier.name} Plan Details</h4>
                  <p className="text-white-50 mb-3" style={{ fontSize: '15px' }}>{tier.audience}</p>
                  <p className="text-white font-weight-bold mb-2">Detailed Deliverables:</p>
                  <div className="row">
                    {tier.includes.map((incl, idx) => (
                      <div className="col-md-6 mb-2 text-white-50" key={idx} style={{ fontSize: '14px', display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#C8A24A' }}>•</span>
                        <span>{incl}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3" style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                    <strong style={{ color: '#C8A24A' }}>Fee Model:</strong>{' '}
                    <strong>{tier.price}/{tier.frequency}</strong>
                    {tier.isPromo && (
                      <span style={{ fontWeight: '400', fontSize: '15px', color: '#a4b0be', marginLeft: '6px' }}>
                        (Renewal: {tier.renewal})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ResponsiveSlider>
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
