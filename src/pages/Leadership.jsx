import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Leadership() {
  useEffect(() => {
    document.title = 'GTICC Leadership | Global Trade and Investment Collaboration Consortium';
  }, []);

  return (
    <div className="site-content">
      <div className="container-fluid">
        <div className="item-efftect">
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
          <div className="efftect overflow-hidden"></div>
        </div>
      </div>

      <section>
        <div
          className="inner-banner bg-holder rounded-section jarallax"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(13,17,23,0.88), rgba(13,17,23,0.75)), url("/abou_banner.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="title">Leadership Overview</h1>
                <ul className="breadcrumb mb-0 mt-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/about-us">About Us</Link>
                  </li>
                  <li className="breadcrumb-item active"><span>Leadership</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper">
        <section className="space-ptb">
          <div className="container">
            <div className="section-title text-center mb-5">
              <span className="gticc-section-kicker" style={{ color: '#C8A24A' }}>GTICC LEADERSHIP</span>
              <h2 className="title">Leadership Overview</h2>
              <p className="responsive-lead-text text-white-50 mt-3" style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
                GTICC leadership information will be updated once officially published.
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {[
                { title: 'Executive Leadership', desc: 'Details of the executive directors and managing officers will be updated once officially published.' },
                { title: 'Board of Directors', desc: 'Board representation and corporate directors will be updated once officially published.' },
                { title: 'Strategic Coordination', desc: 'Advisory and coordinator directory profiles will be updated once officially published.' },
                { title: 'Governance Oversight', desc: 'Internal audit and administrative committee listings will be updated once officially published.' }
              ].map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-3" key={idx}>
                  <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '30px' }}>
                    <h5 style={{ color: '#C8A24A', marginBottom: '15px' }}>{card.title}</h5>
                    <p className="text-white-50 mb-0" style={{ fontSize: '15px', lineHeight: '1.6' }}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
