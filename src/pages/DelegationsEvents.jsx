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
  const totalItems = EVENT_DATA.length;
  // Duplicate into 3 sets so index can seamlessly step forward and backward indefinitely
  const displayCards = [...EVENT_DATA, ...EVENT_DATA, ...EVENT_DATA];

  // Start at the middle set
  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isTransitioningRef = useRef(false);
  const autoPlayTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const trackRef = useRef(null);

  // Touch tracking
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const toggleCard = (title) => {
    setExpandedCards((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  // Move forward by one card
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Move backward by one card
  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Fast, continuous automatic right-to-left scrolling (1.4s per card = ~5.6s full 4-card cycle)
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return undefined;
    }

    autoPlayTimerRef.current = setInterval(() => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setTransitionEnabled(true);
      setCurrentIndex((prev) => prev + 1);
    }, 1400);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isHovered]);

  // Seamless snap when sliding outside middle set
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;

    if (currentIndex >= totalItems * 2) {
      setTransitionEnabled(false);
      setCurrentIndex((prev) => prev - totalItems);
    } else if (currentIndex < totalItems) {
      setTransitionEnabled(false);
      setCurrentIndex((prev) => prev + totalItems);
    }
  };

  // Re-enable CSS transition on next render frame after silent snap
  useEffect(() => {
    if (!transitionEnabled && trackRef.current) {
      // Force reflow to immediately commit position without animation
      // eslint-disable-next-line no-unused-expressions
      trackRef.current.offsetHeight;
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
        isTransitioningRef.current = false;
      });
    }
  }, [transitionEnabled]);

  // User manual interaction pauses auto-scroll and resumes smoothly after 2.5 seconds
  const pauseAndResumeAfterDelay = useCallback(() => {
    setIsHovered(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 2500);
  }, []);

  const onManualNext = () => {
    handleNext();
    pauseAndResumeAfterDelay();
  };

  const onManualPrev = () => {
    handlePrev();
    pauseAndResumeAfterDelay();
  };

  // Touch handlers for mobile swipe
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
    pauseAndResumeAfterDelay();
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
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
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
              onClick={onManualPrev}
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
                  transition: transitionEnabled ? 'transform 0.48s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
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
              onClick={onManualNext}
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
