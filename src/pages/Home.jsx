import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import CounterAnimation from '../components/CounterAnimation';

const easeOut = [0.22, 1, 0.36, 1];

const heroGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOut },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 46 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.78, ease: easeOut },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: easeOut },
  },
};

const audienceItems = [
  {
    number: '01',
    icon: 'fa-landmark',
    title: 'Governments & Public Bodies',
    description: 'Institutional visibility, trade dialogue, delegation hosting, and structured international engagement.',
  },
  {
    number: '02',
    icon: 'fa-building',
    title: 'Private Member Companies',
    description: 'Market access support, partner introductions, and credible positioning across priority corridors.',
  },
  {
    number: '03',
    icon: 'fa-chart-line',
    title: 'Investors & Capital Partners',
    description: 'Curated exposure to prepared opportunities, strategic stakeholders, and cross-border growth themes.',
  },
  {
    number: '04',
    icon: 'fa-handshake-angle',
    title: 'Strategic Partners & Sponsors',
    description: 'High-trust collaboration pathways for forums, missions, visibility programs, and sector initiatives.',
  },
];

function RevealSection({ children, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      variants={shouldReduceMotion ? undefined : sectionReveal}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.22 }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const corridorSliderRef = useRef(null);
  const heroVisualRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroVisualRef,
    offset: ['start start', 'end start'],
  });
  const heroVisualY = useTransform(heroScrollProgress, [0, 1], [0, 42]);
  const heroVisualScale = useTransform(heroScrollProgress, [0, 1], [1, 1.035]);

  useEffect(() => {
    let featuresSwiper = null;
    let corridorSwiper = null;

    if (window.Swiper) {
      featuresSwiper = new window.Swiper('.features-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        breakpoints: {
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 3 },
        }
      });

      corridorSwiper = new window.Swiper('.corridor-swiper', {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        autoplay: {
          delay: 9000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 1000,
        pagination: {
          el: '.corridor-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
          1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
        }
      });
    }

    return () => {
      if (featuresSwiper && typeof featuresSwiper.destroy === 'function') {
        featuresSwiper.destroy(true, true);
      }
      if (corridorSwiper && typeof corridorSwiper.destroy === 'function') {
        corridorSwiper.destroy(true, true);
      }
    };
  }, []);

  return (
    <div className="site-content gticc-home-page">
      <style>{`
        /* Corridor Swiper Pagination Custom Styling */
        .corridor-swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
        }
        
        .corridor-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #ffffff !important;
          opacity: 0.4 !important;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 !important; /* Reset Swiper default margins */
        }
        
        .corridor-swiper-pagination .swiper-pagination-bullet-active {
          width: 12px;
          height: 12px;
          background-color: #D4AF37 !important;
          opacity: 1 !important;
        }

        /* Hero image container — override banner-bg min-height so full image is visible */
        .main-banner.main-banner-2 .gticc-photo-hero.banner-bg {
          min-height: 0 !important;
          overflow: hidden !important;
        }

        /* -------------------------------------------------- */
        /* Home Hero Proper Visual Fit Overrides              */
        /* -------------------------------------------------- */

        .main-banner.main-banner-2 .row {
          align-items: stretch !important;
        }

        /* Ensure both columns inside the hero row behave as flex containers */
        .main-banner.main-banner-2 .row > div {
          display: flex !important;
          flex-direction: column !important;
        }

        /* Set cards height clamp on screen sizes where both columns are visible (>=768px) */
        @media (min-width: 768px) {
          .main-banner.main-banner-2 .banner-conent,
          .main-banner.main-banner-2 .gticc-photo-hero.banner-bg {
            min-height: clamp(570px, 70vh, 720px) !important;
            flex: 1 !important;
            height: 100% !important; /* Stretch both cards to match the full height of the row */
          }
          
          /* Set padding for left content card with responsive vertical and horizontal clamp */
          .main-banner.main-banner-2 .banner-conent {
            padding: clamp(24px, 5vh, 44px) clamp(30px, 4vw, 60px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }
        }

        /* Hero Right Container Padding and Overflow */
        .main-banner.main-banner-2 .gticc-photo-hero.banner-bg {
          padding: 0 !important;
          overflow: hidden !important;
          min-height: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Hero Right Image Settings - Full fill with cover on desktop/laptop */
        .main-banner.main-banner-2 .gticc-photo-hero.banner-bg img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center center !important;
          display: block !important;
        }

        /* Hero Typography overrides with responsive clamp values */
        .main-banner.main-banner-2 .banner-conent .title {
          font-size: clamp(46px, 4vw, 68px) !important; /* Slightly decreased */
          line-height: 1.12 !important;
          margin-bottom: 10px !important;
        }

        .main-banner.main-banner-2 .banner-conent p.responsive-lead-text {
          font-size: clamp(18px, 1.25vw, 23px) !important; /* Slightly increased */
          line-height: 1.5 !important;
          margin-top: 10px !important;
        }

        /* Spacing for CTA elements to fit in height constraint */
        .main-banner.main-banner-2 .banner-conent .reviews-info {
          margin-top: 15px !important;
        }

        .main-banner.main-banner-2 .banner-conent .reviews-info .d-flex {
          gap: 10px !important;
          margin-top: 8px !important;
        }

        .main-banner.main-banner-2 .banner-conent .reviews-info p {
          margin-top: 2px !important;
        }

        /* Force visibility of animated elements inside the hero content to prevent WOW scroll observer bugs */
        .main-banner.main-banner-2 .banner-conent .wow {
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* Mobile/Tablet specific overrides (under 1024px) */
        @media (max-width: 1023px) {
          .main-banner.main-banner-2 .gticc-photo-hero.banner-bg img {
            object-fit: contain !important; /* Contain fit for tablet view if needed */
          }
        }

        /* Custom Learn More Link for Core Pillars Section */
        .gticc-impact-section .infobox {
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          cursor: pointer !important;
          transition: all 0.35s ease !important;
        }

        .gticc-impact-section .infobox-content {
          flex-grow: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .gticc-impact-section .infobox-footer {
          margin-top: auto !important;
          padding-top: 20px !important;
          text-align: left !important;
        }

        .gticc-impact-section .gticc-learn-more-link {
          display: inline-flex !important;
          align-items: center !important;
          color: #D4AF37 !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          text-decoration: none !important;
          transition: color 0.35s ease !important;
          line-height: 1 !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        .gticc-impact-section .gticc-learn-more-link .arrow-symbol {
          display: inline-block !important;
          margin-left: 6px !important;
          transition: transform 0.35s ease !important;
        }

        /* Core Pillars Hover Styles */
        .gticc-impact-section .infobox:hover {
          background: #D4AF37 !important;
          border-color: transparent !important;
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.45) !important;
        }

        .gticc-impact-section .infobox:hover .infobox-info {
          border-bottom-color: rgba(0, 0, 0, 0.15) !important;
        }

        .gticc-impact-section .infobox:hover .infobox-title {
          color: #000000 !important;
        }

        .gticc-impact-section .infobox:hover .infobox-description {
          color: #000000 !important;
        }

        .gticc-impact-section .infobox:hover .gticc-learn-more-link {
          color: #000000 !important;
        }

        .gticc-impact-section .infobox:hover .gticc-learn-more-link .arrow-symbol {
          transform: translateX(4px) !important;
        }

        /* ================================================ */
        /* Membership At A Glance — Gold Hover Cards        */
        /* ================================================ */
        .gticc-membership-card {
          display: flex !important;
          flex-direction: column !important;
          cursor: pointer !important;
          transition: all 0.35s ease !important;
        }

        .gticc-membership-card-body {
          flex-grow: 1 !important;
        }

        .gticc-membership-card-footer {
          margin-top: auto !important;
          padding-top: 16px !important;
        }

        .gticc-membership-card .gticc-membership-learn-more {
          display: inline-flex !important;
          align-items: center !important;
          color: #D4AF37 !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          text-decoration: none !important;
          transition: color 0.35s ease !important;
          line-height: 1 !important;
        }

        .gticc-membership-card .gticc-membership-learn-more .arrow-symbol {
          display: inline-block !important;
          margin-left: 6px !important;
          transition: transform 0.35s ease !important;
        }

        /* HOVER — Pure Gold */
        .gticc-membership-card:hover {
          background: #D4AF37 !important;
          border-color: transparent !important;
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.45) !important;
        }

        .gticc-membership-card:hover h5 {
          color: #000000 !important;
        }

        .gticc-membership-card:hover .gticc-membership-card-body p {
          color: #000000 !important;
        }

        .gticc-membership-card:hover .gticc-membership-learn-more {
          color: #000000 !important;
        }

        .gticc-membership-card:hover .gticc-membership-learn-more .arrow-symbol {
          transform: translateX(4px) !important;
        }
      `}</style>
      <div className="container-fluid">
        <motion.div
          className="item-efftect"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.25 }}
        >
          <div className="efftect overflow-hidden gticc-float-soft"></div>
          <div className="efftect overflow-hidden gticc-float-soft gticc-float-delay-1"></div>
          <div className="efftect overflow-hidden gticc-float-soft gticc-float-delay-2"></div>
          <div className="efftect overflow-hidden gticc-float-soft gticc-float-delay-3"></div>
          <div className="efftect overflow-hidden gticc-float-soft gticc-float-delay-4"></div>
        </motion.div>
      </div>

      {/*================================= Main Banner */}
      <motion.div
        className="main-banner main-banner-2"
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        variants={heroGroup}
      >
        <div className="container-fluid">
          <div className="row align-items-stretch">
            <div className="col-12 col-md-6 col-lg-6">
              <motion.div className="banner-conent h-100" variants={heroGroup}>
                <motion.h1 className="title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms" variants={shouldReduceMotion ? undefined : heroItem}>
                  Bridging Trade, Investment, and Strategic Access Across Borders.
                </motion.h1>
                <motion.p className="mb-0 wow fadeInUp responsive-lead-text" data-wow-delay="0.2s" data-wow-duration="1500ms" variants={shouldReduceMotion ? undefined : heroItem}>
                  A private global consortium for trade, investment, delegations, and international partnerships. Connecting governments, institutions, and investors for global opportunity.
                </motion.p>
                <motion.div className="reviews-info wow fadeInUp" data-wow-delay="0.4s" data-wow-duration="1500ms" variants={shouldReduceMotion ? undefined : heroItem}>
                  <div className="d-flex flex-column gap-3 align-items-start mt-3">
                    <div>
                      <Link className="btn gticc-hero-cta gticc-hero-cta-primary" to="/contact-us"> Start a Strategic Collaboration
                        <svg width="18px" height="18px" viewBox="0 0 32 32" version="1.1" className="ms-2">
                          <path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"></path>
                        </svg>
                      </Link>
                      <p className="text-white-50 mt-1 mb-0" style={{ fontSize: '13px', maxWidth: '420px', lineHeight: '1.4' }}>
                        Submit a partnership, delegation, trade, investment, or institutional collaboration inquiry for review by the GTICC team.
                      </p>
                    </div>
                    <div>
                      <Link className="btn btn-ghost gticc-hero-cta gticc-hero-cta-secondary" to="/membership"> Explore Membership </Link>
                      <p className="text-white-50 mt-1 mb-0" style={{ fontSize: '13px', maxWidth: '420px', lineHeight: '1.4' }}>
                        View membership plans, benefits, eligibility, directory access, and application details.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <div className="banner-shape" style={{ display: 'none' }}>
                  <img className="img-fluid" src="/images/banner/banner-02/pattern-bg.webp" alt="#" />
                </div>
              </motion.div>
            </div>
            <div className="col-12 col-md-6 col-lg-6 d-flex flex-column">
              <motion.div
                ref={heroVisualRef}
                className="banner-bg radius-20 wow pgsUpToDown animated gticc-photo-hero gticc-animated-hero-visual"
                style={{
                  visibility: 'visible',
                  y: shouldReduceMotion ? 0 : heroVisualY,
                  scale: shouldReduceMotion ? 1 : heroVisualScale,
                  background: '#061B33',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: '0',
                  padding: '0',
                  flex: '1'
                }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.95, ease: easeOut, delay: 0.22 }}
              >
                <img
                  src="/images/gticc_hero_connectivity.jpg"
                  alt="GTICC global connectivity - Toronto, India, UAE, UK Connecting GTICC Endless Opportunities"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center center',
                    display: 'block'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="credibility-ribbon bg-dark py-4 border-t border-b overflow-hidden"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: easeOut, delay: 0.42 }}
      >
        <div className="container-fluid px-0">
          <div className="credibility-slider-container">
            <div className="credibility-slider-track">
              {/* First Set */}
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-location-dot me-2 text-primary"></i>Canada-Based</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-lock me-2 text-primary"></i>Private Consortium</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-globe me-2 text-primary"></i>Global Reach</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-chart-line me-2 text-primary"></i>Trade & Investment</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-users-viewfinder me-2 text-primary"></i>Delegation-Led Access</span>
              </div>
              {/* Second Set for Infinite Loop */}
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-location-dot me-2 text-primary"></i>Canada-Based</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-lock me-2 text-primary"></i>Private Consortium</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-globe me-2 text-primary"></i>Global Reach</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-chart-line me-2 text-primary"></i>Trade & Investment</span>
              </div>
              <div className="credibility-slider-item">
                <span className="text-white d-block fw-bold"><i className="fa-solid fa-users-viewfinder me-2 text-primary"></i>Delegation-Led Access</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="content-wrapper">
        {/*================================= Phase 1.1: What GTICC Does */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">WHAT WE DO</span>
              <h2 className="title text-white">What GTICC Does</h2>
              <p className="responsive-lead-text text-white-50">
                Structured global collaboration across trade, investment, delegations, partnerships, and institutional engagement.
              </p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Trade & Investment Access', icon: 'fa-chart-line', desc: 'Facilitates structured opportunity access, enabling businesses and capital partners to identify and navigate priority corridors.' },
                { title: 'Delegation Support', icon: 'fa-users-viewfinder', desc: 'Coordinates curated B2B and B2G trade missions, investment roadshows, and international delegation activities.' },
                { title: 'Strategic Partnerships', icon: 'fa-handshake-angle', desc: 'Connects private consortia, government agencies, and industry leaders to structure cross-border joint initiatives.' },
                { title: 'Global Networking', icon: 'fa-globe', desc: 'Enables qualified introductions and high-trust peer connections through exclusive global forums.' },
                { title: 'Institutional Engagement', icon: 'fa-landmark', desc: 'Supports structured dialogues with public bodies, chambers, and academic institutions to align trade objectives.' },
                { title: 'Sector Collaboration', icon: 'fa-sitemap', desc: 'Coordinates focused roundtable and advisory pathways across key priority sectors and industries.' }
              ].map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '25px' }}>
                    <h4 style={{ color: '#C8A24A' }}><i className={`fa-solid ${card.icon} me-2`}></i>{card.title}</h4>
                    <p className="text-white-50 mb-0" style={{ fontSize: '16px' }}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 1.2: Who Can Join GTICC */}
        <RevealSection className="space-ptb bg-panel position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">ELIGIBILITY</span>
              <h2 className="title">Who Can Join GTICC</h2>
              <p className="responsive-lead-text">
                GTICC brings together leaders, capital, and institutional stakeholders to build high-trust international bridging networks.
              </p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Businesses & Exporters', desc: 'Enables companies to expand international reach, gain sector visibility, and participate in trade delegations.' },
                { title: 'Investors', desc: 'Connects capital partners and investment firms with prepared cross-border projects and qualified regional opportunities.' },
                { title: 'Government Bodies', desc: 'Supports public organizations in attracting foreign investment, hosting foreign delegates, and promoting local capabilities.' },
                { title: 'Chambers & Associations', desc: 'Facilitates collaboration agreements, allowing chambers to offer global network access to their local member base.' },
                { title: 'Universities & Institutions', desc: 'Coordinates research exchange pathways, policy dialogue support, and academic partnerships across corridors.' },
                { title: 'Strategic Partners', desc: 'Connects sponsors and key industry leaders to gain high-level brand positioning and support GTICC forums.' }
              ].map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.3)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '25px' }}>
                    <h5 style={{ color: '#C8A24A' }}>{card.title}</h5>
                    <p className="mb-0" style={{ fontSize: '16px' }}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 1.3: Countries & Global Corridors */}
        <RevealSection className="space-ptb gticc-corridor-showcase bg-dark rounded-section">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">GLOBAL REACH</span>
              <h2 className="title text-white">Connecting Regional Strengths With International Opportunity</h2>
              <p className="responsive-lead-text text-white-50">
                GTICC supports structured collaboration across priority markets, helping stakeholders explore introductions, visibility, delegation participation, and sector dialogue.
              </p>
            </div>
            <div className="swiper corridor-swiper mb-4" style={{ padding: '20px 0', overflow: 'hidden' }}>
              <div className="swiper-wrapper">
                {[
                  ['/Toronto.webp', 'Canada', 'Canada-based platform for international trade, investment, and collaboration pathways.'],
                  ['/images/Image%205.webp', 'India', 'Business, institutional, diaspora, and sector collaboration between India and global partners.'],
                  ['/UAE.webp', 'UAE', 'Gateway for forums, investment dialogue, delegation activity, and regional market visibility.'],
                  ['/uk.webp', 'United Kingdom', 'UK corridor access for trade, investment, delegations, and structured international collaboration.', 'gticc-home-corridor-card-bright'],
                  ['/singapore.webp', 'Singapore', 'Southeast Asia hub gateway, facilitating trade, investment access, and regional sector cooperation.']
                ].map(([image, title, copy, extraClass = '']) => (
                  <div className="swiper-slide" key={title} style={{ height: 'auto' }}>
                    <article className={`gticc-image-card gticc-home-corridor-card corridor-card region-card gticc-float-hover ${extraClass}`} style={{ height: '100%' }}>
                      <div className="corridor-card-image region-card-image">
                        <img src={image} alt={`${title} corridor visual`} loading="lazy" />
                      </div>
                      <div className="gticc-image-card-content">
                        <h3>{title}</h3>
                        <p>{copy}</p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
            <div className="corridor-swiper-pagination"></div>
            <div className="gticc-card text-center mt-4" style={{ background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '20px' }}>
              <p className="mb-0 text-white-50" style={{ fontSize: '16px', fontStyle: 'italic' }}>
                *Disclaimer: GTICC may support collaboration opportunities across additional international markets where relevant.
              </p>
            </div>
          </div>
        </RevealSection>

        {/*================================= Core Pillars Swiper (Preserved) */}
        <RevealSection className="space-pt gticc-impact-section" style={{ background: 'transparent' }}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title text-center">
                  <span className="gticc-section-kicker text-primary">CORE STRATEGY</span>
                  <h2 className="title">Core Pillars of Global Impact</h2>
                </div>
                <div className="swiper features-swiper mb-4 mb-sm-5" style={{ padding: '15px' }}>
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <Link to="/services/trade-investment-bridging" className="w-100 text-decoration-none d-block h-100">
                        <motion.div className="infobox h-100" whileHover={shouldReduceMotion ? undefined : { y: -8 }} transition={{ duration: 0.35, ease: easeOut }}>
                          <div className="infobox-info">
                            <h5 className="infobox-title mb-0">Trade & Investment Bridging</h5>
                          </div>
                          <div className="infobox-content">
                            <div className="infobox-description responsive-lead-text">Connecting stakeholders to convert international interest into real relationships and execution momentum.</div>
                          </div>
                          <div className="infobox-footer">
                            <span className="gticc-learn-more-link">
                              Learn More <span className="arrow-symbol">→</span>
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    </div>

                    <div className="swiper-slide">
                      <Link to="/services/delegations" className="w-100 text-decoration-none d-block h-100">
                        <motion.div className="infobox h-100" whileHover={shouldReduceMotion ? undefined : { y: -8 }} transition={{ duration: 0.35, ease: easeOut }}>
                          <div className="infobox-info">
                            <h5 className="infobox-title mb-0">Delegations & Market Access</h5>
                          </div>
                          <div className="infobox-content">
                            <div className="infobox-description responsive-lead-text">Curated trade missions and international delegations designed for high-level commercial outcomes.</div>
                          </div>
                          <div className="infobox-footer">
                            <span className="gticc-learn-more-link">
                              Learn More <span className="arrow-symbol">→</span>
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    </div>

                    <div className="swiper-slide">
                      <Link to="/membership" className="w-100 text-decoration-none d-block h-100">
                        <motion.div className="infobox h-100" whileHover={shouldReduceMotion ? undefined : { y: -8 }} transition={{ duration: 0.35, ease: easeOut }}>
                          <div className="infobox-info">
                            <h5 className="infobox-title mb-0">Membership & Strategic Network</h5>
                          </div>
                          <div className="infobox-content">
                            <div className="infobox-description responsive-lead-text">Exclusive gateway to a global network of governments, institutions, and private-sector partners.</div>
                          </div>
                          <div className="infobox-footer">
                            <span className="gticc-learn-more-link">
                              Learn More <span className="arrow-symbol">→</span>
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="gticc-card gticc-facilitator-note mt-4">
                  <p className="mb-0 responsive-lead-text">
                    GTICC is a facilitator and connector. We bring relevant stakeholders into meaningful conversations, support structured engagement, and create visibility for serious collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 1.4: Sectors Covered Preview */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">INDUSTRIES</span>
              <h2 className="title text-white">Sectors GTICC Supports</h2>
              <p className="responsive-lead-text text-white-50">
                A brief preview of the primary high-impact sectors facilitated across prioritised corridors.
              </p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Healthcare', icon: 'fa-user-doctor', desc: 'Supporting collaboration in medical technologies, research, and health system block integration.' },
                { title: 'Technology', icon: 'fa-microchip', desc: 'Connecting innovators across software engineering, artificial intelligence, and hardware priority themes.' },
                { title: 'Education', icon: 'fa-graduation-cap', desc: 'Facilitating academic partnerships, training initiatives, and exchange programs.' },
                { title: 'Infrastructure', icon: 'fa-road', desc: 'Connecting capital with transport, logistics hub, and smart city developments.' },
                { title: 'Energy', icon: 'fa-bolt', desc: 'Facilitating trade dialogue around green hydrogen, renewable grids, and transitional systems.' },
                { title: 'Manufacturing', icon: 'fa-industry', desc: 'Supporting supply chain resilience, advanced factory alignments, and industrial trade.' },
                { title: 'Trade & Investment', icon: 'fa-money-bill-trend-up', desc: 'Coordinating investment roadshows, B2B matchmaking, and bilateral trade facilitation.' }
              ].map((sector, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100 text-center" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '30px 20px' }}>
                    <div className="highlight-icon-wrapper mb-3" style={{ fontSize: '32px', color: '#C8A24A' }}>
                      <i className={`fa-solid ${sector.icon}`}></i>
                    </div>
                    <h5 style={{ color: '#ffffff' }}>{sector.title}</h5>
                    <p className="text-white-50 mb-0" style={{ fontSize: '15px' }}>{sector.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/sectors" className="btn btn-ghost">View All Sectors</Link>
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 1.5: How GTICC Works */}
        <RevealSection className="space-ptb bg-panel position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">PROCESS</span>
              <h2 className="title">How GTICC Works</h2>
              <p className="responsive-lead-text">
                GTICC operates through a structured process to ensure relevance and alignment for every incoming request.
              </p>
            </div>
            <div className="row g-4">
              {[
                { step: '01', title: 'Submit Inquiry', desc: 'Visitors submit a collaboration, membership, trade, investment, delegation, or partnership inquiry.' },
                { step: '02', title: 'Review & Qualification', desc: 'GTICC reviews the inquiry for relevance, sector fit, geography, and collaboration potential.' },
                { step: '03', title: 'Strategic Matching', desc: 'GTICC identifies potential partners, institutional links, or suitable membership tiers for the applicant.' },
                { step: '04', title: 'Facilitated Engagement', desc: 'Where appropriate, GTICC coordinates structured introductions, bilateral meetings, or follow-up conversations.' }
              ].map((step, idx) => (
                <div className="col-12 col-md-6 col-lg-3" key={idx}>
                  <div className="gticc-card h-100 text-center" style={{ background: 'rgba(6, 21, 46, 0.2)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '25px' }}>
                    <div className="step-num mb-2" style={{ fontSize: '28px', color: '#C8A24A', fontWeight: 'bold' }}>{step.step}</div>
                    <h5>{step.title}</h5>
                    <p className="mb-0" style={{ fontSize: '15px' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 2.6: Leadership & Governance */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">GOVERNANCE</span>
              <h2 className="title text-white">Leadership & Governance</h2>
              <p className="responsive-lead-text text-white-50">
                GTICC operates as a professional, credibility-first trade consortium under structured guidelines.
              </p>
            </div>
            <div className="row g-4 justify-content-center">
              {[
                { title: 'Executive Leadership', desc: 'Information will be published as official GTICC governance profiles become available.' },
                { title: 'Board of Directors', desc: 'Information will be published as official GTICC governance profiles become available.' },
                { title: 'Advisory Council', desc: 'Information will be published as official GTICC governance profiles become available.' }
              ].map((leader, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100 text-center" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '30px' }}>
                    <h5 style={{ color: '#C8A24A' }}>{leader.title}</h5>
                    <p className="text-white-50 mb-0" style={{ fontSize: '15px' }}>{leader.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 2.7: Institutional & Strategic Network */}
        <RevealSection className="space-ptb bg-panel position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">OUR NETWORK</span>
              <h2 className="title">Institutional & Strategic Network</h2>
              <p className="responsive-lead-text">
                Collaboration avenues connecting primary public, private, and academic stakeholders.
              </p>
            </div>
            <div className="row g-4 justify-content-center">
              {[
                'Government Partners',
                'Trade Organizations',
                'Industry Associations',
                'Academic Institutions',
                'Strategic Collaborators'
              ].map((net, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100 text-center" style={{ background: 'rgba(6, 21, 46, 0.2)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '25px' }}>
                    <h5 style={{ color: '#C8A24A' }}>{net}</h5>
                    <p className="mb-0 text-white-50" style={{ fontSize: '15px' }}>
                      Partner directory and profile details will be updated as GTICC publishes official network disclosures.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 2.8: Success Stories */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">CASE STUDIES</span>
              <h2 className="title text-white">Success Stories</h2>
            </div>
            <div className="gticc-card text-center" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '40px' }}>
              <p className="mb-0 text-white-50" style={{ fontSize: '18px', fontStyle: 'italic' }}>
                "Case studies and success stories will be published as GTICC-supported engagements are completed."
              </p>
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 2.9: Impact Dashboard */}
        <RevealSection className="space-ptb bg-panel position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">METRICS</span>
              <h2 className="title">Impact Dashboard</h2>
              <p className="responsive-lead-text">
                Demonstrated reach and facilitation indicators across priority channels.
              </p>
            </div>
            <div className="row g-4 text-center justify-content-center">
              {[
                { title: 'Countries Represented' },
                { title: 'Strategic Engagements' },
                { title: 'Delegations Facilitated' },
                { title: 'Sector Dialogues' },
                { title: 'Member Organizations' }
              ].map((metric, idx) => (
                <div className="col-12 col-sm-6 col-lg-2" key={idx}>
                  <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.2)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '20px 10px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C8A24A' }} className="mb-2">Coming Soon</div>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 3.10: Membership Snapshot */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">TIERS & PLANS</span>
              <h2 className="title text-white">Membership At A Glance</h2>
              <p className="responsive-lead-text text-white-50">
                Explore the formal membership packages designed to connect stakeholders across sectors.
              </p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Corporate Member', desc: 'Tailored for exporters and growing businesses seeking market entry, visibility, and trade B2B meetings.' },
                { title: 'Global Partner Member', desc: 'Designed for multinationals, developers, and investment funds looking for high-level corridor access.' },
                { title: 'Institutional Member', desc: 'For public entities, government bodies, chambers, and academic institutions to align trade block objectives.' },
                { title: 'Strategic Sponsor', desc: 'For industry champions seeking high-profile branding and sponsorship opportunities across GTICC initiatives.' }
              ].map((tier, idx) => (
                <div className="col-12 col-md-6 col-lg-3" key={idx}>
                  <div className="gticc-card gticc-membership-card h-100" style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', padding: '25px' }}>
                    <div className="gticc-membership-card-body">
                      <h5 style={{ color: '#C8A24A' }} className="mb-2">{tier.title}</h5>
                      <p className="text-white-50 mb-0" style={{ fontSize: '15px' }}>{tier.desc}</p>
                    </div>
                    <div className="gticc-membership-card-footer">
                      <Link to="/membership/plans" className="gticc-membership-learn-more">
                        Learn More <span className="arrow-symbol">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/membership" className="btn btn-ghost">Explore Membership Gateway</Link>
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 3.11: Why Join GTICC */}
        <RevealSection className="space-ptb bg-panel position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">BENEFITS</span>
              <h2 className="title">Why Join GTICC</h2>
              <p className="responsive-lead-text">
                Explore the key strategic advantages of participating in our global bridging network.
              </p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Global Visibility', icon: 'fa-eye', desc: 'Showcases company profiles to a qualified international audience.' },
                { title: 'Strategic Introductions', icon: 'fa-handshake', desc: 'Facilitates introductions to high-trust partners and stakeholders.' },
                { title: 'Delegation Opportunities', icon: 'fa-plane-departure', desc: 'Grants priority access to B2B trade missions and investment roadshows.' },
                { title: 'Sector Networking', icon: 'fa-network-wired', desc: 'Connects members with dedicated industry roundtables and expert councils.' },
                { title: 'Trade Access', icon: 'fa-arrow-trend-up', desc: 'Provides market intelligence and coordination support in focus corridors.' },
                { title: 'Investment Connections', icon: 'fa-vault', desc: 'Creates connection pathways to capital opportunities and project sponsors.' }
              ].map((benefit, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="gticc-card h-100" style={{ background: 'rgba(6, 21, 46, 0.3)', border: '1px solid rgba(200, 162, 74, 0.15)', padding: '25px' }}>
                    <h5 style={{ color: '#C8A24A' }}><i className={`fa-solid ${benefit.icon} me-2`}></i>{benefit.title}</h5>
                    <p className="mb-0 text-white-50" style={{ fontSize: '15px' }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/*================================= Phase 3.12: FAQ Preview */}
        <RevealSection className="space-ptb bg-dark rounded-section position-relative">
          <div className="container">
            <div className="section-title text-center">
              <span className="gticc-section-kicker text-primary">FAQS</span>
              <h2 className="title text-white">Frequently Asked Questions</h2>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-lg-10">
                <div className="accordion accordion-style-2" id="faqPreviewAccordion">
                  {[
                    { q: 'Who can join GTICC?', a: 'GTICC is open to exporters, businesses, capital partners, government agencies, academic institutions, and trade chambers.' },
                    { q: 'How are applications reviewed?', a: 'All applications undergo internal review for sector fit, priority corridor alignment, and suitability.' },
                    { q: 'What countries are covered?', a: 'GTICC primarily focuses on the Canada, India, UAE, Singapore, and United Kingdom corridors, with support for additional corridors where relevant.' },
                    { q: 'What sectors are covered?', a: 'Key sectors include Healthcare, Technology, Education, Infrastructure, Energy, Manufacturing, and Trade & Investment.' },
                    { q: 'Does GTICC guarantee business outcomes?', a: 'No. GTICC facilitates collaboration pathways but does not guarantee contracts, approvals, funding, partnerships, or commercial outcomes.' }
                  ].map((item, idx) => (
                    <div className="accordion-item" key={idx} style={{ background: 'rgba(6, 21, 46, 0.6)', border: '1px solid rgba(200, 162, 74, 0.2)', marginBottom: '15px', borderRadius: '4px' }}>
                      <h2 className="accordion-header" id={`headingFAQ-${idx}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseFAQ-${idx}`} aria-expanded="false" aria-controls={`collapseFAQ-${idx}`} style={{ background: 'transparent', color: '#ffffff', fontSize: '18px', padding: '20px' }}>
                          {item.q}
                        </button>
                      </h2>
                      <div id={`collapseFAQ-${idx}`} className="accordion-collapse collapse" aria-labelledby={`headingFAQ-${idx}`} data-bs-parent="#faqPreviewAccordion">
                        <div className="accordion-body text-white-50" style={{ padding: '0 20px 20px 20px', fontSize: '16px' }}>
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
