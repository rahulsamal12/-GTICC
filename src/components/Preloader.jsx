import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Preloader.css';

export default function Preloader() {
  const location = useLocation();

  // We show the preloader only when the application is initially loaded or refreshed, 
  // and the entry route matches the Home page (/).
  const [shouldShow, setShouldShow] = useState(() => {
    const isHome = window.location.pathname === '/' || location.pathname === '/';
    return isHome;
  });

  const [fadeProp, setFadeProp] = useState('fade-in');

  useEffect(() => {
    if (!shouldShow) return;

    // Add scroll locking to prevent scrolling while preloader is active
    document.body.classList.add('preloader-active');

    // Smoothly initiate fade-out after 3500ms
    const fadeTimer = setTimeout(() => {
      setFadeProp('fade-out');
      // Release scroll block so user can scroll during and after transition
      document.body.classList.remove('preloader-active');
    }, 3500);

    // Completely unmount the preloader component after the fade animation completes (4300ms)
    const removeTimer = setTimeout(() => {
      setShouldShow(false);
    }, 4300);

    // Cleanup timers and styles on component unmount
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.classList.remove('preloader-active');
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div className={`gticc-preloader ${fadeProp}`} id="gticc-preloader-overlay">
      <div className="gticc-preloader-content">
        <div className="gticc-preloader-logo-wrapper">
          <img
            src="/images/gticc_dark_preloader.png"
            alt="GTICC Logo"
            className="gticc-preloader-logo"
          />
        </div>
        <div className="gticc-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
