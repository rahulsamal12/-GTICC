import { Link } from 'react-router-dom';

export default function Footer() {
  const footerDisclaimer = [
    "GTICC is a private global collaboration platform that facilitates business networking, introductions, sector dialogue, events, delegation participation, and collaboration pathways.",
    "GTICC does not provide legal, financial, tax, immigration, regulatory, investment, procurement, or government approval advice.",
    "GTICC does not guarantee investment, contracts, sales, funding, buyers, approvals, partnerships, or commercial outcomes.",
    "All parties are responsible for their own due diligence, negotiations, agreements, compliance, and business decisions."
  ];

  return (
    <footer className="site-footer footer-dark">
      <div className="footer-main">
        <div className="container">
          <div className="grid-wrapper grid-xl-5 grid-md-2 grid-xs-1">
            <div className="item">
              <Link className="footer-logo" to="/">
                <img className="img-fluid" src="/gticc_logo_footer.webp?v=3" alt="GTICC logo" />
              </Link>
              <p className="mt-4 gticc-footer-consortium-text">
                Global Trade & Investment Collaboration Consortium.
              </p>
            </div>

            <div className="item">
              <div className="widget-menu">
                <h5 className="widget-title">What We Do</h5>
                <ul className="list-unstyled">
                  <li><Link to="/services/trade-investment-bridging">Trade & Investment</Link></li>
                  <li><Link to="/services/delegations">Delegations</Link></li>
                  <li><Link to="/services/strategic-partnerships">Strategic Partnerships</Link></li>
                  <li><Link to="/services/global-positioning">Global Positioning</Link></li>
                  <li><Link to="/services/projects-execution">Projects & Initiatives</Link></li>
                </ul>
              </div>
            </div>

            <div className="item">
              <div className="widget-menu">
                <h5 className="widget-title">Sectors</h5>
                <ul className="list-unstyled">
                  <li><Link to="/sectors">Healthcare</Link></li>
                  <li><Link to="/sectors">Technology</Link></li>
                  <li><Link to="/sectors">Education</Link></li>
                  <li><Link to="/sectors">Infrastructure</Link></li>
                  <li><Link to="/sectors">Energy</Link></li>
                  <li><Link to="/sectors">Manufacturing</Link></li>
                </ul>
              </div>
            </div>

            <div className="item">
              <div className="widget-menu">
                <h5 className="widget-title">Global Network</h5>
                <ul className="list-unstyled">
                  <li><Link to="/about-us">About GTICC</Link></li>
                  <li><Link to="/membership">Membership</Link></li>
                  <li><Link to="/membership/member-directory">Members Directory</Link></li>
                  <li><Link to="/delegations-events">Events & Delegations</Link></li>
                  <li><Link to="/insights">Insights</Link></li>
                  <li><Link to="/membership/membership-terms">Membership Terms</Link></li>
                </ul>
              </div>
            </div>

            <div className="item">
              <div className="widget">
                <h5 className="widget-title">Contact</h5>
              </div>
              <div className="contact-info-box">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <div className="d-flex align-items-start">
                      <i className="fa-solid fa-envelope text-primary me-3 mt-1"></i>
                      <a
                        href="mailto:contact@gticc.com"
                        className="contact-email"
                        style={{ color: '#FFFFFF', fontWeight: '500', opacity: 1 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                        onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                      >contact@gticc.com</a>
                    </div>
                  </li>
                  <li className="mb-2">
                    <div className="d-flex align-items-start">
                      <i className="fa-solid fa-phone text-primary me-3 mt-1"></i>
                      <a href="tel:+14374457235" className="text-white">+1 (437) 445-7235</a>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-start">
                      <i className="fa-solid fa-location-dot text-primary me-3 mt-1"></i>
                      <div>
                        <span className="d-block text-white fw-bold mb-1">Toronto Office</span>
                        <span className="footer-address">
                          125 Village Green Sq<br />
                          Toronto<br />
                          Canada
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        <div className="gticc-footer-disclaimer">
          <ul className="footer-disclaimer-list">
            {footerDisclaimer.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-md-12">
              <div className="marquee-wrapper marquee-style-3 marquee-fade" style={{ userSelect: 'none' }}>
                <div className="marquee-inner">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="marquee-item">
                      <span className="title">GTICC</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      <div className="footer-copyright">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright-info">
                &copy; {new Date().getFullYear()} GTICC. All Rights Reserved.
                <span className="mx-2">•</span>
                <a
                  href="http://localhost:3001/login"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#C8A24A', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  <i className="fa-solid fa-lock me-1"></i>Executive Admin Console
                </a>
              </p>
            </div>
            <div className="col-md-6 mt-2 mt-md-0 text-md-end">
              <div className="widget-social">
                <span className="follow-title">Follow us</span>
                <ul className="social-icon">
                  <li><a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
