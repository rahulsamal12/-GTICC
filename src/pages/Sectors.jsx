import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SECTOR_DATA = [
  ['/infrastructure_logistics_low_mb.jpg.webp', 'Infrastructure & Logistics', 'Ports, transport, corridors, industrial zones, and cross-border delivery.'],
  ['/green_energy_investment_low_mb.jpg.webp', 'Green Energy & Investment', 'Clean energy, solar, cables, technology, and transition-linked partnerships.'],
  ['/technology_innovation_3D_low_mb.jpg.webp', 'Technology & Innovation', 'Digital platforms, institutional modernization, and international collaboration.'],
  ['/healthcare_education_3D_low_mb.jpg.webp', 'Healthcare & Education', 'Institutional partnerships, capacity building, and service-sector exchange.'],
  ['/agriculture_industry_3D_low_mb.jpg.webp', 'Agriculture & Industry', 'Food systems, manufacturing, export pathways, and industrial collaboration.'],
  ['/global_trade_corridors_3D_low_mb.jpg.webp', 'Global Trade Corridors', 'Investment attraction, supply chains, and responsible project visibility across markets.'],
];

export default function Sectors() {
  const [expandedCards, setExpandedCards] = useState({});
  const [currentIndex, setCurrentIndex] = useState(SECTOR_DATA.length); // Start at middle set (index 6)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const isNavigatingRef = useRef(false);

  // Touch tracking for swipe support
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const toggleCard = (title) => {
    setExpandedCards((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  // Duplicate data into 3 sets to enable seamless infinite loop in both directions
  const displayCards = [...SECTOR_DATA, ...SECTOR_DATA, ...SECTOR_DATA];

  const handleNext = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 450);
  }, []);

  const handlePrev = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 450);
  }, []);

  // Smooth, continuous automatic scrolling (4.2 seconds interval for responsive auto-slide)
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return undefined;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isHovered, currentIndex]);

  const handleTransitionEnd = () => {
    const totalLength = SECTOR_DATA.length;
    // Slid past the end of the middle set
    if (currentIndex >= totalLength * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalLength);
    } 
    // Slid before the start of the middle set
    else if (currentIndex < totalLength) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalLength);
    }
  };

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + SECTOR_DATA.length);
  };

  // Force reflow to instantly snap index without visible transition animation
  useEffect(() => {
    if (!isTransitioning && trackRef.current) {
      // eslint-disable-next-line no-unused-expressions
      trackRef.current.offsetHeight; 
      setIsTransitioning(true);
    }
  }, [isTransitioning]);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
    setIsHovered(true);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    // Resume auto-scrolling shortly after touch interaction
    setTimeout(() => {
      setIsHovered(false);
    }, 1500);
  };

  return (
    <main className="site-content">
      <style>{`
        .gticc-carousel-wrapper {
          position: relative;
          width: 100%;
          padding: 0 54px;
        }

        .gticc-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #0B1728;
          border: 1.5px solid #C8A24A;
          color: #D4AF37;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
          outline: none;
          padding: 0;
        }

        .gticc-carousel-arrow:hover {
          background: #C8A24A;
          color: #071322;
          border-color: #D4AF37;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 8px 24px rgba(200, 162, 74, 0.4);
        }

        .gticc-carousel-arrow:active {
          transform: translateY(-50%) scale(0.96);
        }

        .gticc-carousel-arrow i,
        .gticc-carousel-arrow svg {
          font-size: 18px;
          line-height: 1;
          pointer-events: none;
        }

        .gticc-carousel-arrow-prev {
          left: 0;
        }

        .gticc-carousel-arrow-next {
          right: 0;
        }

        @media (max-width: 991px) {
          .gticc-carousel-wrapper {
            padding: 0 46px;
          }
          .gticc-carousel-arrow {
            width: 40px;
            height: 40px;
          }
          .gticc-carousel-arrow i {
            font-size: 15px;
          }
        }

        @media (max-width: 576px) {
          .gticc-carousel-wrapper {
            padding: 0 38px;
          }
          .gticc-carousel-arrow {
            width: 36px;
            height: 36px;
          }
          .gticc-carousel-arrow i {
            font-size: 14px;
          }
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          gap: 12px;
        }

        .dot-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background-color: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          padding: 0;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .dot-indicator:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }

        .dot-indicator.active {
          background-color: #C8A24A;
          transform: scale(1.25);
        }

        .gticc-sector-card .gticc-image-card-content {
          flex-grow: 1 !important;
        }

        /* Hide description text by default */
        .gticc-sector-card .gticc-image-card-content p {
          display: none !important;
        }

        /* Show description when card is expanded */
        .gticc-sector-card.is-expanded .gticc-image-card-content p {
          display: block !important;
          -webkit-line-clamp: unset !important;
        }
      `}</style>

      <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.82), rgba(13, 17, 23, 0.9)), url("/sector_bannner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="title">Sector breadth with strategic discipline.</h1>
          <p style={{ fontSize: '24px', color: 'white' }}>
            GTICC is sector-agnostic where opportunity, credibility, and partnerships align, while
            maintaining clear priority clusters for trade and investment engagement.
          </p>
        </div>
      </section>

      <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg3.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container">
          <div 
            className="gticc-carousel-wrapper" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Navigation Arrow */}
            <button
              type="button"
              className="gticc-carousel-arrow gticc-carousel-arrow-prev"
              onClick={handlePrev}
              aria-label="Previous sector"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {/* Carousel container */}
            <div className="gticc-carousel-container overflow-hidden">
              <div 
                ref={trackRef} 
                className="gticc-carousel-track"
                style={{
                  transform: `translateX(calc(-${currentIndex} * (var(--card-width) + var(--card-gap))))`,
                  transition: isTransitioning ? 'transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {displayCards.map(([image, title, copy], index) => (
                  <article className={`gticc-image-card gticc-sector-card gticc-carousel-slide${expandedCards[title] ? ' is-expanded' : ''}`} key={`${title}-${index}`}>
                    <img src={image} alt={`${title} sector visual`} loading="lazy" />
                    <div className="gticc-image-card-content">
                      <h4>{title}</h4>
                      <p style={{ fontSize: '15px' }}>{copy}</p>
                      <button
                        className="gticc-sector-read-more"
                        type="button"
                        onClick={() => toggleCard(title)}
                      >
                        {expandedCards[title] ? 'Show Less' : 'Read More'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              className="gticc-carousel-arrow gticc-carousel-arrow-next"
              onClick={handleNext}
              aria-label="Next sector"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="carousel-dots">
            {SECTOR_DATA.map((_, index) => (
              <button
                key={index}
                className={`dot-indicator ${(currentIndex % SECTOR_DATA.length) === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Bottom text blocks */}
          <div className="row mt-5 pt-4 text-center justify-content-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="col-md-4 mb-4 mb-md-0">
              <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)', padding: '0 15px' }}>
                Our sectors represent the pillars of global transformation and inclusive growth.
              </p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)', padding: '0 15px' }}>
                We connect opportunity with capability across borders.
              </p>
            </div>
            <div className="col-md-4">
              <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)', padding: '0 15px' }}>
                Partner with us to build resilient, future-ready economies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
