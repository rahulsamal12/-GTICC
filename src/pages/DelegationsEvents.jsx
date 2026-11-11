import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const EVENT_DATA = [
  {
    title: 'Inbound Missions',
    image: '/bound_mission_clean_3D_low_mb.jpg.webp',
    alt: 'Toronto inbound mission visual',
    desc: 'Host qualified international stakeholders around opportunities, sectors, and partnerships.',
    className: '',
  },
  {
    title: 'Outbound Missions',
    image: '/Outbound_Mission_511x486_LowMB.jpg.webp',
    alt: 'India outbound mission visual',
    desc: 'Support members and partners entering priority markets through curated access.',
    className: ' gticc-event-outbound-card',
  },
  {
    title: 'Investment Roadshows',
    image: '/Investment_Roadshow_Clean_3D_LowMB.jpg.webp',
    alt: 'UAE investment roadshow visual',
    desc: 'Connect capital partners with prepared opportunities and credible institutional stakeholders.',
    className: ' gticc-event-investment-card',
  },
  {
    title: 'Forums',
    image: '/Forums_511x486_LowMB.jpg.webp',
    alt: 'Global forum network visual',
    desc: 'Build diplomatic-commercial environments for serious conversations and follow-up.',
    className: '',
  },
];

export default function DelegationsEvents() {
  const [expandedCards, setExpandedCards] = useState({});
  const [currentIndex, setCurrentIndex] = useState(EVENT_DATA.length); // Start at middle set (index 4)
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

  // Duplicate data into 3 sets to enable seamless bidirectional infinite looping
  const displayCards = [...EVENT_DATA, ...EVENT_DATA, ...EVENT_DATA];

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

  // Continuous auto-scrolling (4.2 seconds interval for responsive auto-slide)
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return undefined;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 4200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isHovered, currentIndex]);

  const handleTransitionEnd = () => {
    const totalLength = EVENT_DATA.length;
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
      `}</style>

      <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/network_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">Curated programs for market access and institutional visibility.</h1>
          <p className="gticc-hero-desc">
            GTICC organizes delegation-led engagement through trade missions, investment roadshows, bilateral forums,
            sector programs, and special access events.
          </p>
          <Link className="btn gticc-event-hero-cta" to="/contact-us">Start a Strategic Collaboration</Link>
        </div>
      </section>

      <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg10.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
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
              aria-label="Previous program"
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
                {displayCards.map((card, index) => (
                  <article className={`gticc-image-card gticc-event-card${card.className} gticc-carousel-slide ${expandedCards[card.title] ? ' is-expanded' : ''}`} key={`${card.title}-${index}`}>
                    <img src={card.image} alt={card.alt} loading="lazy" />
                    <div className="gticc-image-card-content">
                      <h4>{card.title}</h4>
                      <p className="gticc-card-desc">{card.desc}</p>
                      <button className="gticc-event-read-more" type="button" onClick={() => toggleCard(card.title)}>
                        {expandedCards[card.title] ? 'Show Less' : 'Read More'}
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
              aria-label="Next program"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
