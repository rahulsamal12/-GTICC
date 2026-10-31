import React, { useState, useEffect, useRef } from 'react';

function ActiveSlider({ items, slidesPerView, itemClassName }) {
  const totalItems = items.length;
  const [virtualIndex, setVirtualIndex] = useState(slidesPerView);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startXRef = useRef(0);
  const trackRef = useRef(null);

  // If items change (e.g. filtered), reset index
  useEffect(() => {
    setVirtualIndex(slidesPerView);
    setTransitionEnabled(true);
    setIsTransitioning(false);
    setDragOffset(0);
    setIsDragging(false);
  }, [totalItems, slidesPerView]);

  // Handle CSS transition cleanup for loop jumps
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setVirtualIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setVirtualIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    
    if (virtualIndex >= totalItems + slidesPerView) {
      setTransitionEnabled(false);
      setVirtualIndex(virtualIndex - totalItems);
    } else if (virtualIndex < slidesPerView) {
      setTransitionEnabled(false);
      setVirtualIndex(virtualIndex + totalItems);
    }
  };

  // Touch and mouse drag handlers
  const handleDragStart = (clientX) => {
    if (isTransitioning) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) {
      handleNext();
    } else if (dragOffset > 60) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const handleMouseDown = (e) => {
    // Only drag with left mouse button click
    if (e.button !== 0) return;
    handleDragStart(e.clientX);
  };
  const handleMouseMove = (e) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Clone slides for loop
  const clonesStart = items.slice(-slidesPerView);
  const clonesEnd = items.slice(0, slidesPerView);
  const slides = [...clonesStart, ...items, ...clonesEnd];

  const activeDotIndex = (virtualIndex - slidesPerView + totalItems) % totalItems;

  const goToDot = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setVirtualIndex(index + slidesPerView);
  };

  // Width of each slide in flex track
  const slideWidth = `calc((100% - ${(slidesPerView - 1) * 24}px) / ${slidesPerView})`;

  return (
    <div className="responsive-slider-container">
      <style>{`
        .responsive-slider-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 12px 0 20px 0;
          box-sizing: border-box;
        }
        .responsive-slider-track {
          display: flex;
          align-items: stretch;
          gap: 24px;
          width: 100%;
          box-sizing: border-box;
          will-change: transform;
        }
        .responsive-slider-slide {
          flex-shrink: 0;
          display: flex;
          box-sizing: border-box;
          user-select: none;
        }
        .responsive-slider-slide > * {
          width: 100% !important;
          height: 100% !important;
          flex: 1 !important;
        }
        .responsive-slider-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
        }
        .responsive-slider-arrow {
          background: rgba(200, 162, 74, 0.08);
          border: 1px solid rgba(200, 162, 74, 0.25);
          color: #C8A24A;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          user-select: none;
          padding: 0;
        }
        .responsive-slider-arrow:hover {
          background: #C8A24A;
          color: #030d1e;
          box-shadow: 0 0 15px rgba(200, 162, 74, 0.42);
        }
        .responsive-slider-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .responsive-slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          border: none;
          padding: 0;
        }
        .responsive-slider-dot.active {
          background: #C8A24A;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
      <div 
        ref={trackRef}
        className="responsive-slider-track"
        style={{
          transform: `translate3d(calc(-${virtualIndex} * ((${100}% - ${(slidesPerView - 1) * 24}px) / ${slidesPerView} + 24px) + ${dragOffset}px), 0px, 0px)`,
          transition: transitionEnabled && !isDragging ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`responsive-slider-slide ${itemClassName}`}
            style={{ width: slideWidth }}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="responsive-slider-controls">
        <button className="responsive-slider-arrow" onClick={handlePrev} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className="responsive-slider-dots">
          {items.map((_, idx) => (
            <button 
              key={idx}
              className={`responsive-slider-dot ${idx === activeDotIndex ? 'active' : ''}`}
              onClick={() => goToDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button className="responsive-slider-arrow" onClick={handleNext} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ResponsiveSlider({ children, desktopClass, itemClassName = "" }) {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = React.Children.toArray(children).filter(Boolean);
  const totalItems = items.length;

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  if (isDesktop || totalItems === 0) {
    return (
      <div className={desktopClass}>
        {items}
      </div>
    );
  }

  const slidesPerView = isTablet ? 2 : 1;

  // If there are fewer or equal items to what is displayed, render them statically centered
  if (totalItems <= slidesPerView) {
    const slideWidth = `calc((100% - ${(slidesPerView - 1) * 24}px) / ${slidesPerView})`;
    return (
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'nowrap', width: '100%' }}>
        {items.map((item, index) => (
          <div key={index} style={{ width: slideWidth, flexShrink: 0 }}>
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ActiveSlider 
      items={items} 
      slidesPerView={slidesPerView} 
      itemClassName={itemClassName} 
    />
  );
}
