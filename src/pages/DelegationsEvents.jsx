import React, { useEffect, useRef, useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef(null);

  const toggleCard = (title) => {
    setExpandedCards((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  // Duplicate data to create a seamless infinite loop illusion
  const displayCards = [...EVENT_DATA, ...EVENT_DATA];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000); // 3 seconds pause before sliding

    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = () => {
    // Once we've animated fully into the cloned set (past the original 4 cards)
    // we seamlessly, instantly snap back to the start without animation.
    if (currentIndex >= EVENT_DATA.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      
      // Force reflow to ensure the instant snap is applied immediately
      if (trackRef.current) {
        // eslint-disable-next-line no-unused-expressions
        trackRef.current.offsetHeight; 
      }
    }
  };

  return (
    <main className="site-content">
      <section className="gticc-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/network_banner.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container"><span className="sub-title"></span>
          <h1 className="title">Curated programs for market access and institutional visibility.</h1>
          <p className="gticc-hero-desc">GTICC organizes delegation-led engagement through trade missions, investment roadshows, bilateral forums,
            sector programs, and special access events.</p><Link className="btn gticc-event-hero-cta" to="/contact-us">Start a Strategic Collaboration</Link>
        </div>
      </section>
      <section className="gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg10.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container overflow-hidden">
          <div className="gticc-carousel-container">
            <div 
              ref={trackRef} 
              className="gticc-carousel-track"
              style={{
                transform: `translateX(calc(-${currentIndex} * (var(--card-width) + var(--card-gap))))`,
                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
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
        </div>
      </section>
    </main>
  );
}
