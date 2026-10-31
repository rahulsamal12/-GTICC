import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { benefits, comparisonRows } from './MembershipPlans';
import ResponsiveSlider from '../components/ResponsiveSlider';

export default function MembershipBenefits() {
  // Dynamic SEO Setup
  useEffect(() => {
    document.title = "GTICC Membership Benefits | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Discover the professional benefits of GTICC membership, including global business visibility, curated introductions, sector roundtables, delegation missions, and directory listings.");
    }
  }, []);

  return (
    <div className="site-content gticc-membership-page">
      <style>{`
        .gticc-membership-page .gticc-card,
        .gticc-membership-page .infobox {
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
        
        .gticc-membership-page .infobox:hover {
          transform: translateY(-12px) rotateX(4deg) rotateY(2deg) scale(1.025) !important;
          border-color: rgba(255, 223, 137, 0.98) !important;
          box-shadow: 0 30px 68px rgba(0, 0, 0, 0.48), 0 0 35px rgba(200, 162, 74, 0.52) !important;
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
      `}</style>

      {/* Hero Banner */}
      <section className="gticc-hero gticc-hero--fullscreen" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}>
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" style={{ fontSize: '48px', fontWeight: '800', margin: '0 auto 20px auto' }}>Membership Built for Global Business Connections</h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            GTICC membership helps organizations and professionals become part of a cross-border business network focused on trade, investment, innovation, sector collaboration, and market access.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="/membership/apply" className="btn">Apply for Membership</a>
            <a href="/membership/plans" className="btn btn-ghost">View Plans</a>
          </div>
        </div>
      </section>


      {/* Why Join / Benefit Cards */}
      <section className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title text-white">Why Join GTICC</h2>
            <p className="text-white-50 mt-2">GTICC membership helps organizations and professionals become part of a cross-border business network focused on trade, investment, innovation, sector collaboration, and market access.</p>
          </div>
          
          <ResponsiveSlider desktopClass="grid-wrapper grid-xl-3 grid-md-2 grid-xs-1">
            {benefits.map((benefit) => (
              <div className="infobox" key={benefit.title} style={{ padding: '24px', background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.15)' }}>
                <div className="infobox-info">
                  <h5 className="infobox-title" style={{ color: '#C8A24A' }}>{benefit.title}</h5>
                </div>
                <div className="infobox-content mt-2">
                  <p className="text-white-50" style={{ fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </ResponsiveSlider>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-ptb">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title">Benefit Comparison matrix</h2>
            <p className="text-white-50 mt-2">Compare membership privileges across different tiers.</p>
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
      <section className="space-ptb bg-dark rounded-section">
        <div className="container text-center">
          <h2 className="title text-white mb-3">Ready to Connect Globally?</h2>
          <p className="responsive-lead-text text-white-50 max-w-600 mb-4" style={{ margin: '0 auto 30px auto' }}>
            Submit your membership application to join our structured cross-border business network.
          </p>
          <Link className="btn" to="/membership/apply">Apply for Membership</Link>
        </div>
      </section>
    </div>
  );
}
