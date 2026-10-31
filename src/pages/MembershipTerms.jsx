import React, { useEffect, useRef, useState, useCallback } from 'react';

const terms = [
  { icon: 'fa-calendar-check', title: 'Annual Membership',        copy: 'GTICC memberships are annual. Benefits are available during the active membership period according to the selected tier.' },
  { icon: 'fa-user-check',     title: 'Approval of Membership',   copy: 'Applications are subject to review and approval. GTICC may approve, decline, defer, or request additional information.' },
  { icon: 'fa-tag',            title: 'First-Year Launch Offer',  copy: 'The 50% launch offer applies to Corporate Member and Global Partner plans — first year only. Regular fees apply from year two.' },
  { icon: 'fa-receipt',        title: 'Taxes',                    copy: 'Membership fees are listed in Canadian dollars. Applicable taxes, if any, are charged separately at checkout.' },
  { icon: 'fa-chart-bar',      title: 'No Guaranteed Outcomes',   copy: 'Membership provides networking access and visibility. GTICC does not guarantee investment, contracts, sales, or funding.' },
  { icon: 'fa-handshake',      title: 'Facilitation Role',        copy: 'GTICC acts as a facilitator and connector — not a party to member negotiations, agreements, or disputes.' },
  { icon: 'fa-magnifying-glass', title: 'Due Diligence',          copy: 'Members are responsible for their own due diligence, legal review, financial review, compliance, and final business decisions.' },
  { icon: 'fa-people-arrows',  title: 'Introductions',            copy: 'Meeting requests, roundtable invitations, and delegation opportunities are subject to relevance, availability, and mutual interest.' },
  { icon: 'fa-money-bill-wave', title: 'Refunds',                 copy: 'Fees are non-refundable once access, onboarding, listing, visibility, events, or other benefits have commenced.' },
  { icon: 'fa-shield-halved',  title: 'Member Conduct',           copy: 'Members must act professionally. GTICC may suspend or terminate membership for misconduct or misrepresentation.' },
  { icon: 'fa-trademark',      title: 'Use of GTICC Name',        copy: 'Members may not use the GTICC name or logo to imply endorsement or guaranteed business relationship without written approval.' },
  { icon: 'fa-rotate',         title: 'Benefit Changes',          copy: 'GTICC may update membership benefits, events, directory features, pricing, and participation criteria from time to time.' },
];

// Splits an array into chunks of `size`
function chunk(arr, size) {
  const pages = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages;
}

function getLayout(width) {
  if (width >= 1024) return { cols: 3, rows: 2, perPage: 6 };   // Desktop / Laptop
  if (width >= 768)  return { cols: 2, rows: 2, perPage: 4 };   // Tablet
  return               { cols: 1, rows: 1, perPage: 1 };          // Mobile
}

export default function MembershipTerms() {
  const swiperRef    = useRef(null);
  const instanceRef  = useRef(null);
  const [layout, setLayout] = useState(() => getLayout(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  ));

  /* SEO */
  useEffect(() => {
    document.title = 'GTICC Membership Terms | Global Trade & Investment Collaboration Consortium';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Review the official membership terms, facilitation boundaries, code of conduct, and legal disclaimers for GTICC consortium members.');
  }, []);

  /* Track viewport width */
  useEffect(() => {
    const onResize = () => {
      const next = getLayout(window.innerWidth);
      setLayout(prev =>
        prev.perPage !== next.perPage ? next : prev
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Init / reinit Swiper whenever layout (perPage) changes */
  const initSwiper = useCallback(() => {
    if (!swiperRef.current || !window.Swiper) return;

    // Destroy old instance
    if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
      instanceRef.current.destroy(true, true);
      instanceRef.current = null;
    }

    instanceRef.current = new window.Swiper(swiperRef.current, {
      loop:          true,
      speed:         800,
      slidesPerView: 1,
      spaceBetween:  0,
      autoplay: {
        delay:                  5000,
        disableOnInteraction:   false,
        pauseOnMouseEnter:      true,
      },
      pagination: {
        el:        swiperRef.current.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  }, []);                         // no deps — layout changes trigger re-render which remounts

  useEffect(() => {
    const t = setTimeout(initSwiper, 80);
    return () => {
      clearTimeout(t);
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy(true, true);
      }
    };
  }, [layout, initSwiper]);       // re-run whenever layout changes

  /* Build page slides */
  const pages = chunk(terms, layout.perPage);

  return (
    <div className="site-content gticc-membership-terms-page">

      {/* Hero */}
      <section
        className="gticc-hero gticc-hero--fullscreen"
        style={{
          backgroundImage: 'linear-gradient(135deg,rgba(8,22,48,.78),rgba(13,17,23,.9)),url("/membership_banner.webp")',
          backgroundSize: 'cover', backgroundPosition: 'center', width: '100%',
        }}
      >
        <div className="container text-center">
          <h1 className="title" style={{ fontSize: '48px', fontWeight: 800, margin: '0 auto 20px' }}>
            Membership Terms
          </h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: 800, margin: '0 auto 30px' }}>
            Review GTICC annual membership terms, approval process, launch offer, taxes, refunds, member conduct, and legal-safe membership conditions.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="/membership/apply"  className="btn">Apply for Membership</a>
            <a href="/membership/plans"  className="btn btn-ghost">View Plans</a>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section
        className="gticc-terms-carousel-section space-ptb gticc-section"
        style={{
          backgroundImage: 'linear-gradient(rgba(8,22,48,.88),rgba(8,22,48,.88)),url("/bg7.webp")',
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
          overflow: 'hidden',
        }}
      >
        <div className="container-fluid px-3 px-md-4 px-xl-5">

          {/* Heading */}
          <div className="text-center mb-4">
            <span className="gticc-section-kicker">MEMBERSHIP CONDITIONS</span>
            <h2 className="title text-white mt-1" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>
              Terms &amp; Conditions
            </h2>
            <p className="text-white-50" style={{ maxWidth: 620, margin: '0 auto', fontSize: 16 }}>
              All membership plans are subject to the following terms.
            </p>
          </div>

          {/* Swiper — each slide is a full grid page */}
          <div
            className="swiper gticc-terms-swiper"
            ref={swiperRef}
            style={{ overflow: 'hidden', padding: '8px 4px 60px 4px' }}
          >
            <div className="swiper-wrapper">
              {pages.map((page, pageIdx) => (
                <div className="swiper-slide" key={pageIdx}>
                  <div
                    className="gticc-terms-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${layout.rows}, auto)`,
                      gap: '20px',
                    }}
                  >
                    {page.map((term, i) => {
                      const globalIdx = pageIdx * layout.perPage + i;
                      return (
                        <article className="gticc-term-card-v2" key={globalIdx}>
                          <div className="gticc-term-card-icon">
                            <i className={`fa-solid ${term.icon}`}></i>
                          </div>
                          <h3 className="gticc-term-card-title">{term.title}</h3>
                          <p  className="gticc-term-card-body">{term.copy}</p>
                          <div className="gticc-term-card-number">
                            {String(globalIdx + 1).padStart(2, '0')}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots only — no visible arrows */}
            <div className="swiper-pagination gticc-terms-pagination"></div>
          </div>

        </div>
      </section>

      {/* Disclaimer */}
      <section
        className="gticc-section"
        style={{
          backgroundImage: 'linear-gradient(rgba(8,22,48,.92),rgba(8,22,48,.92)),url("/bg7.webp")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          paddingTop: 0, paddingBottom: 60,
        }}
      >
        <div className="container">
          <div className="gticc-card gticc-disclaimer-card"
            style={{ background: 'rgba(8,22,48,.4)', border: '1px solid rgba(200,162,74,.15)' }}
          >
            <p className="gticc-small-disclaimer" style={{ fontSize: 16, color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> GTICC is a facilitator and connector. Membership provides access to networking,
              visibility, events, introductions, and collaboration opportunities. GTICC does not guarantee investment,
              funding, sales, contracts, approvals, or business outcomes. Members are responsible for their own due
              diligence and final decisions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
