import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const [mobileOnboardingOpen, setMobileOnboardingOpen] = React.useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const isSectionActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const isWhatWeDoActive = () => {
    const projectPaths = ['/services/projects-execution', '/services/projects-initiatives'];
    return location.pathname.startsWith('/services') && !projectPaths.includes(location.pathname) ? 'active' : '';
  };

  const isProjectsActive = () => {
    return ['/services/projects-execution', '/services/projects-initiatives'].includes(location.pathname) ? 'active' : '';
  };

  const isNetworkActive = () => {
    return location.pathname === '/delegations-events' ? 'active' : '';
  };

  // Returns inline style for active dropdown item inside Membership menu
  const activeDropdownStyle = (path) => {
    const isCurrentPage = location.pathname === path;
    return isCurrentPage
      ? {
          color: '#C8A24A',
          borderLeft: '3px solid #C8A24A',
          background: 'rgba(200, 162, 74, 0.10)',
          paddingLeft: '14px',
          boxShadow: 'inset 0 0 12px rgba(200, 162, 74, 0.08)',
          fontWeight: '700',
          borderRadius: '4px',
        }
      : { fontSize: '20px' };
  };

  const closeMenu = () => {
    const offcanvasElement = document.getElementById('menuOffcanvas');
    if (offcanvasElement) {
      const closeBtn = offcanvasElement.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
      }
    }
  };

  return (
    <>
      <header className="header header-sticky gticc-two-row-header">
        {/* UPPER HEADER (BRANDING SECTION) */}
        <div className="header-upper-row">
          <div className="container-fluid d-flex justify-content-center align-items-center h-100 position-relative">
            <Link className="navbar-brand logo-container upper-navbar-logo responsive-logo" to="/">
              <picture>
                <source media="(max-width: 1023px)" srcSet="/gticc_logo_mobile_tablet.png" />
                <img className="img-fluid navbar-logo" src="/gticc_logo_horizontal_wide.png" alt="GTICC logo" />
              </picture>
            </Link>

            {/* Tablet and Mobile Actions (Search & Hamburger) */}
            <div className="tablet-mobile-actions">
              {/* Search Icon */}
              <div className="search">
                <ul className="list-unstyled mb-0">
                  <li className="dropdown nav-item header-search">
                    <a href="#search" style={{ fontSize: '22px' }}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                  </li>
                </ul>
              </div>
              {/* Hamburger for Tablet (>= 768px) */}
              <div className="mobile-hamburger d-none d-md-block">
                <button className="hamburger" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{ border: 'none', background: 'transparent', padding: '10px' }}>
                  <span className="hamburger-container">
                    <span className="hamburger-inner"></span>
                    <span className="hamburger-hidden"></span>
                  </span>
                </button>
              </div>
              {/* Hamburger for Mobile (< 768px) */}
              <div className="mobile-hamburger d-block d-md-none">
                <button className="hamburger" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanvas" aria-controls="menuOffcanvas" style={{ border: 'none', background: 'transparent', padding: '10px' }}>
                  <span className="hamburger-container">
                    <span className="hamburger-inner"></span>
                    <span className="hamburger-hidden"></span>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* LOWER HEADER (NAVIGATION SECTION) */}
        <div className="header-lower-row">
          <div className="container-fluid d-flex align-items-center h-100 position-relative">
            
            {/* Desktop & Tablet Navigation Layout (>= 768px) */}
            <div className="d-none d-md-flex align-items-center justify-content-center w-100 h-100 position-relative lower-desktop-nav-wrapper">
              <nav className="navbar navbar-expand-md p-0 w-100 d-flex align-items-center justify-content-center">
                
                {/* Centered Navigation Menu */}
                <div className="navbar-collapse-wrapper d-flex justify-content-center">
                  <ul className="nav navbar-nav main-nav shift">
                    <li className={`nav-item ${isActive('/')}`}>
                      <Link className="nav-link gticc-nav-link" to="/">Home</Link>
                    </li>
                    <li className={`nav-item ${isActive('/about-us')}`}>
                      <Link className="nav-link gticc-nav-link" to="/about-us">
                        <span className="d-none d-xl-inline">About GTICC</span>
                        <span className="d-inline d-xl-none">About</span>
                      </Link>
                    </li>
                    <li className={`nav-item dropdown ${isWhatWeDoActive()}`}>
                      <Link className="nav-link gticc-nav-link" to="/services" data-bs-toggle="dropdown">
                        What We Do<i className="fa-solid fa-chevron-down" style={{ marginLeft: '6px' }}></i>
                      </Link>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/services/trade-investment-bridging" style={{ fontSize: '20px' }}><span>Trade & Investment Bridging</span></Link></li>
                        <li><Link className="dropdown-item" to="/services/delegations" style={{ fontSize: '20px' }}><span>Delegations & Trade Missions</span></Link></li>
                        <li><Link className="dropdown-item" to="/services/strategic-partnerships" style={{ fontSize: '20px' }}><span>Strategic Partnerships</span></Link></li>
                        <li><Link className="dropdown-item" to="/services/global-positioning" style={{ fontSize: '20px' }}><span>Global Positioning for Institutions</span></Link></li>
                      </ul>
                    </li>
                    <li className={`nav-item ${isActive('/sectors')}`}>
                      <Link className="nav-link gticc-nav-link" to="/sectors">Sectors</Link>
                    </li>
                    <li className={`nav-item ${isProjectsActive()}`}>
                      <Link className="nav-link gticc-nav-link" to="/services/projects-execution">
                        <span className="d-none d-xl-inline">Projects & Initiatives</span>
                        <span className="d-inline d-xl-none">Projects</span>
                      </Link>
                    </li>
                    <li className={`nav-item dropdown ${isSectionActive('/membership')}`}>
                      <Link className="nav-link gticc-nav-link" to="/membership" data-bs-toggle="dropdown">
                        Membership<i className="fa-solid fa-chevron-down" style={{ marginLeft: '6px' }}></i>
                      </Link>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/membership/plans" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/plans') }}><span>Membership Plans</span></Link></li>
                        <li><Link className="dropdown-item" to="/membership/benefits" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/benefits') }}><span>Membership Benefits</span></Link></li>
                        <li><Link className="dropdown-item" to="/membership/member-directory" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/member-directory') }}><span>Member Directory</span></Link></li>
                        <li><Link className="dropdown-item" to="/membership/apply" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/apply') }}><span>Membership Apply</span></Link></li>
                        
                        {/* Membership Onboarding with nested Submenu */}
                        <li className="dropdown-submenu">
                          <Link
                            className="dropdown-item"
                            to="/membership/onboarding"
                            style={{
                              fontSize: '20px',
                              ...activeDropdownStyle('/membership/onboarding'),
                            }}
                          >
                            <span>Membership Onboarding</span>
                            <i className="fa-solid fa-chevron-right submenu-caret"></i>
                          </Link>
                          <ul className="submenu-dropdown">
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/membership/business-onboarding"
                                style={{
                                  fontSize: '18px',
                                  ...activeDropdownStyle('/membership/business-onboarding'),
                                }}
                              >
                                <span>Business Membership Onboarding</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/membership/leadership-onboarding"
                                style={{
                                  fontSize: '18px',
                                  ...activeDropdownStyle('/membership/leadership-onboarding'),
                                }}
                              >
                                <span>Leadership &amp; Position Onboarding</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li><Link className="dropdown-item" to="/membership/faqs" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/faqs') }}><span>FAQs</span></Link></li>
                        <li><Link className="dropdown-item" to="/membership/membership-terms" style={{ fontSize: '20px', ...activeDropdownStyle('/membership/membership-terms') }}><span>Membership Terms</span></Link></li>
                      </ul>
                    </li>
                    <li className={`nav-item dropdown ${isNetworkActive()}`}>
                      <Link className="nav-link gticc-nav-link" to="/delegations-events" data-bs-toggle="dropdown">
                        Network<i className="fa-solid fa-chevron-down" style={{ marginLeft: '6px' }}></i>
                      </Link>
                      <ul className="dropdown-menu">
                        <li><Link className={`dropdown-item ${isActive('/delegations-events')}`} to="/delegations-events" style={{ fontSize: '20px' }}><span>Events & Delegations</span></Link></li>
                      </ul>
                    </li>
                    <li className={`nav-item ${isActive('/insights')}`}>
                      <Link className="nav-link gticc-nav-link" to="/insights">Insights</Link>
                    </li>
                  </ul>
                </div>

                {/* Right Actions (Search & Hamburger) */}
                <div className="desktop-inline-actions position-absolute right-0 end-0 d-flex align-items-center">
                  <div className="search">
                    <ul className="list-unstyled mb-0">
                      <li className="dropdown nav-item header-search">
                        <a href="#search" style={{ fontSize: '22px' }}>
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <a className="menu-btn hamburger" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <span className="hamburger-container">
                      <span className="hamburger-inner"></span>
                      <span className="hamburger-hidden"></span>
                    </span>
                  </a>
                </div>

              </nav>
            </div>

            {/* Mobile Navigation Layout (< 768px) */}
            <div className="d-flex d-md-none align-items-center justify-content-center w-100 h-100 position-relative mobile-nav-wrapper">
              <div className="mobile-action-group d-flex align-items-center justify-content-center gap-4">
                {/* Search Icon */}
                <div className="search">
                  <ul className="list-unstyled mb-0">
                    <li className="dropdown nav-item header-search">
                      <a href="#search" style={{ fontSize: '22px' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Hamburger Icon */}
                <div className="mobile-hamburger">
                  <button className="hamburger" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanvas" aria-controls="menuOffcanvas" style={{ border: 'none', background: 'transparent', padding: '10px' }}>
                    <span className="hamburger-container">
                      <span className="hamburger-inner"></span>
                      <span className="hamburger-hidden"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Menu OffCanvas */}
      <div className="offcanvas main-menu-offcanvas offcanvas-end" tabIndex="-1" id="menuOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbar2Label" style={{ fontSize: '22px' }}>Main Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark" style={{ fontSize: '22px' }}></i>
          </button>
        </div>
        <div className="offcanvas-body lenis-scroll-disable">
          <div className="body-inner h-100 pe-3 lenis-scroll-disable">
            <nav className="navbar h-100">
              <ul className="navbar-nav h-100">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={closeMenu} style={{ fontSize: '21px' }}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about-us" onClick={closeMenu} style={{ fontSize: '21px' }}>About GTICC</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '21px' }}>What We Do</a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/services/trade-investment-bridging" onClick={closeMenu} style={{ fontSize: '20px' }}><span>Trade & Investment Bridging</span></Link></li>
                    <li><Link className="dropdown-item" to="/services/delegations" onClick={closeMenu} style={{ fontSize: '20px' }}><span>Delegations & Trade Missions</span></Link></li>
                    <li><Link className="dropdown-item" to="/services/strategic-partnerships" onClick={closeMenu} style={{ fontSize: '20px' }}><span>Strategic Partnerships</span></Link></li>
                    <li><Link className="dropdown-item" to="/services/global-positioning" onClick={closeMenu} style={{ fontSize: '20px' }}><span>Global Positioning for Institutions</span></Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sectors" onClick={closeMenu} style={{ fontSize: '21px' }}>Sectors</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/services/projects-execution" onClick={closeMenu} style={{ fontSize: '21px' }}>Projects & Initiatives</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '21px' }}>Membership</a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/membership/plans" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/plans') }}><span>Membership Plans</span></Link></li>
                    <li><Link className="dropdown-item" to="/membership/benefits" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/benefits') }}><span>Membership Benefits</span></Link></li>
                    <li><Link className="dropdown-item" to="/membership/member-directory" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/member-directory') }}><span>Member Directory</span></Link></li>
                    <li><Link className="dropdown-item" to="/membership/apply" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/apply') }}><span>Membership Apply</span></Link></li>
                    
                    {/* Membership Onboarding with nested Submenu in Mobile */}
                    <li>
                      <div className="mobile-submenu-toggle">
                        <Link
                          className="dropdown-item"
                          to="/membership/onboarding"
                          onClick={closeMenu}
                          style={{
                            fontSize: '20px',
                            flexGrow: 1,
                            ...activeDropdownStyle('/membership/onboarding'),
                          }}
                        >
                          <span>Membership Onboarding</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMobileOnboardingOpen((prev) => !prev);
                          }}
                          aria-label="Toggle Onboarding Submenu"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#C8A24A',
                            padding: '10px 14px',
                            fontSize: '16px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className={`fa-solid fa-chevron-${mobileOnboardingOpen ? 'up' : 'down'}`}></i>
                        </button>
                      </div>
                      {mobileOnboardingOpen && (
                        <ul className="mobile-submenu-list">
                          <li>
                            <Link
                              to="/membership/business-onboarding"
                              onClick={closeMenu}
                              style={
                                location.pathname === '/membership/business-onboarding'
                                  ? { color: '#C8A24A', fontWeight: '700' }
                                  : {}
                              }
                            >
                              Business Membership Onboarding
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/membership/leadership-onboarding"
                              onClick={closeMenu}
                              style={
                                location.pathname === '/membership/leadership-onboarding'
                                  ? { color: '#C8A24A', fontWeight: '700' }
                                  : {}
                              }
                            >
                              Leadership &amp; Position Onboarding
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>

                    <li><Link className="dropdown-item" to="/membership/faqs" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/faqs') }}><span>FAQs</span></Link></li>
                    <li><Link className="dropdown-item" to="/membership/membership-terms" onClick={closeMenu} style={{ fontSize: '20px', ...activeDropdownStyle('/membership/membership-terms') }}><span>Membership Terms</span></Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/delegations-events" onClick={closeMenu} style={{ fontSize: '21px' }}>Events & Delegations</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/insights" onClick={closeMenu} style={{ fontSize: '21px' }}>Insights</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact-us" onClick={closeMenu} style={{ fontSize: '21px' }}>Contact Us</Link>
                </li>
              </ul>
            </nav>
            {/* Contact details in mobile menu */}
            <div className="mobile-menu-contact" style={{ borderTop: '1px solid rgba(200,162,74,0.2)', marginTop: '20px', paddingTop: '20px' }}>
              {/* LinkedIn */}
              <div className="d-flex align-items-center mb-3">
                <i className="icon me-3" style={{ minWidth: '22px' }}>
                  <svg width="20" height="20" fill="#D4AF37" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>
                </i>
                <a
                  href="https://www.linkedin.com/company/gticc"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                >LinkedIn</a>
              </div>
              {/* Email */}
              <div className="d-flex align-items-center mb-3">
                <i className="fa-solid fa-envelope me-3" style={{ fontSize: '18px', color: '#D4AF37', minWidth: '22px' }}></i>
                <a
                  href="mailto:contact@gticc.com"
                  style={{ fontSize: '17px', color: '#FFFFFF', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                >contact@gticc.com</a>
              </div>
              {/* Phone */}
              <div className="d-flex align-items-center mb-3">
                <i className="fa-solid fa-phone me-3" style={{ fontSize: '18px', color: '#D4AF37', minWidth: '22px' }}></i>
                <a
                  href="tel:+14374457235"
                  style={{ fontSize: '17px', color: '#FFFFFF', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                >+1 (437) 445-7235</a>
              </div>
              {/* Toronto Office */}
              <div className="d-flex align-items-start">
                <i className="fa-solid fa-location-dot me-3 mt-1" style={{ fontSize: '18px', color: '#D4AF37', minWidth: '22px' }}></i>
                <div>
                  <span className="d-block fw-bold" style={{ fontSize: '17px', color: '#FFFFFF' }}>Toronto Office</span>
                  <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)' }}>
                    125 Village Green Sq<br />Toronto<br />Canada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Popup */}
      <div id="search">
        <button type="button" className="close"></button>
        <div className="search-inner">
          <h2 className="title">Search here...</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Search" />
            <button type="submit" className="search-btn btn"><span>Search</span></button>
          </form>
        </div>
      </div>

      {/* Right menu sidepanel */}
      <div className="offcanvas offcanvas-end header-sidepanel bg-white" tabIndex="-1" id="offcanvasRight">
        <div className="offcanvas-header text-end justify-content-end">
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark" style={{ fontSize: '22px' }}></i>
          </button>
        </div>
        <div className="offcanvas-body lenis-scroll-disable">
          <div className="sidebar-menu h-100 d-flex flex-column">
            <div className="about-us-box">
              <h5 className="title" style={{ fontSize: '20px' }}>Scalable Business for Startups</h5>
              <p style={{ fontSize: '17px' }}>Get the oars in the water and start rowing. Execution is the single biggest factor in achievement so the faster and better your execution.</p>
            </div>

            <div className="widget-social">
              <ul className="social-icon">
                <li>
                  <i className="icon">
                    <svg width="22" height="22" fill="#D4AF37" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>
                  </i>
                  <a
                    href="https://www.linkedin.com/company/gticc"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '500' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                    onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                  >LinkedIn</a>
                </li>
              </ul>
            </div>
            <div className="contact-info-box">
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fa-solid fa-envelope text-primary me-3 mt-1" style={{ fontSize: '18px' }}></i>
                    <a
                      href="mailto:contact@gticc.com"
                      className="contact-email"
                      style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '500', opacity: 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                    >contact@gticc.com</a>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fa-solid fa-phone text-primary me-3 mt-1" style={{ fontSize: '18px' }}></i>
                    <a href="tel:+14374457235" style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '500' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                    >+1 (437) 445-7235</a>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-start">
                    <i className="fa-solid fa-location-dot text-primary me-3 mt-1" style={{ fontSize: '18px' }}></i>
                    <div>
                      <span className="d-block fw-bold mb-1" style={{ fontSize: '18px', color: '#FFFFFF' }}>Toronto Office</span>
                      <span className="footer-address" style={{ fontSize: '17px' }}>
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
      </div>
    </>
  );
}
