import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Global Trade & Investment Summit',
    category: 'Bilateral Conference',
    image: '/images/blog/blog-img1.webp',
    date: 'Annual Forum',
    description: 'High-level deliberations between international business councils, institutional partners, and corporate leaders.'
  },
  {
    id: 2,
    title: 'Trans-Atlantic Trade Delegation Roundtable',
    category: 'Executive Session',
    image: '/images/blog/blog-img2.webp',
    date: 'Delegation Mission',
    description: 'Closed-door ministerial and private sector roundtable addressing bilateral market access protocols.'
  },
  {
    id: 3,
    title: 'Cross-Border Commercial Matchmaking',
    category: 'Networking & B2B',
    image: '/images/blog/blog-img3.webp',
    date: 'Trade Matchmaking',
    description: 'Structured enterprise engagement connecting multinational exporters, importers, and regional distributors.'
  },
  {
    id: 4,
    title: 'Capital Markets & Infrastructure Dialogue',
    category: 'Leadership Panel',
    image: '/images/blog/blog-img4.webp',
    date: 'Investment Forum',
    description: 'Strategic panel discussions on blended finance, cross-border syndicate investments, and emerging corridors.'
  },
  {
    id: 5,
    title: 'Institutional Framework & Regulatory Seminar',
    category: 'Policy Seminar',
    image: '/images/blog/blog-img5.webp',
    date: 'Symposium',
    description: 'Multi-stakeholder seminar reviewing FDI governance, compliance frameworks, and trade dispute mechanisms.'
  },
  {
    id: 6,
    title: 'Global Trade Mission & Investor Reception',
    category: 'Trade Mission',
    image: '/images/blog/blog-img6.webp',
    date: 'Diplomatic Gala',
    description: 'Diplomatic reception and commercial delegate assembly celebrating bilateral economic partnerships.'
  }
];

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Bilateral Conference', 'Executive Session', 'Networking & B2B', 'Leadership Panel', 'Policy Seminar', 'Trade Mission'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <main className="site-content">
      {/* Hero Banner */}
      <section
        className="gticc-hero"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/insight_banner.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">News, delegation recaps, opportunity notes, and institutional announcements.</h1>
          <p style={{ fontSize: '24px', color: 'white' }}>
            This section is prepared as GTICC's future content engine for authority, activity, and search visibility.
          </p>
        </div>
      </section>

      {/* Existing Insights Overview Cards */}
      <section
        className="gticc-section"
        style={{
          backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg%209.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="gticc-card">
                <h4>Delegation Recaps</h4>
                <p style={{ fontSize: '24px' }}>Summaries of mission activity, participating sectors, and follow-up themes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="gticc-card">
                <h4>Opportunity Notes</h4>
                <p style={{ fontSize: '24px' }}>Market access, sector priorities, corridor signals, and partnership themes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="gticc-card">
                <h4>Institutional Updates</h4>
                <p style={{ fontSize: '24px' }}>Announcements, profile releases, programs, and strategic collaboration news.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Photo Gallery / Gallery Highlights Section */}
      <section
        className="gticc-section py-5"
        style={{
          background: 'linear-gradient(180deg, #07152b 0%, #0a1c38 50%, #061224 100%)',
          borderTop: '1px solid rgba(200, 162, 74, 0.25)',
          position: 'relative'
        }}
      >
        <div className="container py-4">
          {/* Section Header */}
          <div className="text-center mb-5">
            <span
              style={{
                color: '#C8A24A',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                display: 'inline-block',
                marginBottom: '8px'
              }}
            >
              Visual Highlights
            </span>
            <h2
              className="fw-bold"
              style={{
                color: '#ffffff',
                fontSize: '2.4rem',
                letterSpacing: '-0.5px'
              }}
            >
              Photo Gallery & Event Highlights
            </h2>
            <div
              style={{
                width: '60px',
                height: '3px',
                background: '#C8A24A',
                margin: '14px auto 18px'
              }}
            />
            <p
              className="mx-auto text-light"
              style={{
                maxWidth: '720px',
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: '1.05rem',
                lineHeight: 1.6
              }}
            >
              Capturing international trade delegations, multilateral forums, bilateral leadership roundtables, and high-impact commercial networking summits across global trade corridors.
            </p>

            {/* Category Filter Pills */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: activeCategory === cat ? '#C8A24A' : 'rgba(255, 255, 255, 0.05)',
                    color: activeCategory === cat ? '#081630' : '#e0e6ed',
                    border: `1px solid ${activeCategory === cat ? '#C8A24A' : 'rgba(200, 162, 74, 0.3)'}`,
                    borderRadius: '24px',
                    padding: '6px 18px',
                    fontSize: '0.85rem',
                    fontWeight: activeCategory === cat ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className="h-100 position-relative d-flex flex-column"
                  style={{
                    backgroundColor: 'rgba(10, 25, 48, 0.75)',
                    border: '1px solid rgba(200, 162, 74, 0.22)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(200, 162, 74, 0.65)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.5), 0 0 15px rgba(200, 162, 74, 0.15)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(200, 162, 74, 0.22)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  {/* Image Container with Fixed Ratio & Zoom Transition */}
                  <div
                    style={{
                      height: '240px',
                      width: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#051020'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/insight_banner.webp';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(6, 18, 36, 0.1) 40%, rgba(6, 18, 36, 0.85) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Category Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        backgroundColor: 'rgba(8, 22, 48, 0.88)',
                        color: '#C8A24A',
                        border: '1px solid #C8A24A',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {item.category}
                    </span>

                    {/* Date/Format Pill */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '14px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#f8fafc',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {item.date}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5
                      style={{
                        color: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        marginBottom: '10px'
                      }}
                    >
                      {item.title}
                    </h5>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.72)',
                        fontSize: '0.92rem',
                        lineHeight: 1.55,
                        marginBottom: 0
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-5 pt-3">
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                marginBottom: 0
              }}
            >
              * Official event albums and high-resolution gallery archives are continuously updated following verified bilateral missions and consortium assemblies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
