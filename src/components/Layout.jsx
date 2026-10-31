import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // 1. Restore scroll position or move to a hash anchor after navigation.
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target) {
          const headerOffset = 120;
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }

    // 2. Clear any lingering backdrop or menu offcanvas states
    const backdrops = document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop');
    backdrops.forEach(el => el.remove());
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // 3. Trigger dynamic theme scripts re-initialization on DOM render
    const timer = setTimeout(() => {
      const POTENZA = window.POTENZA;
      if (POTENZA) {
        try {
          if (typeof POTENZA.counters === 'function') POTENZA.counters();
        } catch (e) { console.error('Error init counters:', e); }

        try {
          if (typeof POTENZA.wow === 'function') POTENZA.wow();
        } catch (e) { console.error('Error init wow:', e); }

        try {
          if (typeof POTENZA.progressBar === 'function') POTENZA.progressBar();
        } catch (e) { console.error('Error init progressBar:', e); }

        try {
          if (typeof POTENZA.customAccordion === 'function') POTENZA.customAccordion();
        } catch (e) { console.error('Error init accordion:', e); }

        try {
          if (typeof POTENZA.carousel === 'function') POTENZA.carousel();
        } catch (e) { console.error('Error init carousel:', e); }

        try {
          if (typeof POTENZA.portfolioFancy === 'function') POTENZA.portfolioFancy();
        } catch (e) { console.error('Error init portfolioFancy:', e); }

        try {
          if (typeof POTENZA.jarallaxBG === 'function') POTENZA.jarallaxBG();
        } catch (e) { console.error('Error init jarallaxBG:', e); }

        try {
          if (typeof POTENZA.mediaPopups === 'function') POTENZA.mediaPopups();
        } catch (e) { console.error('Error init mediaPopups:', e); }

        try {
          if (typeof POTENZA.mouseCursor === 'function') POTENZA.mouseCursor();
        } catch (e) { console.error('Error init mouseCursor:', e); }

        try {
          if (typeof POTENZA.goToTop === 'function') POTENZA.goToTop();
        } catch (e) { console.error('Error init goToTop:', e); }

        try {
          if (typeof POTENZA.isSticky === 'function') POTENZA.isSticky();
        } catch (e) { console.error('Error init isSticky:', e); }
      }
    }, 150); // Delay allows React router to completely paint the new route components

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <div id="page" className="main">
      {/* Global custom cursor markup */}
      <div id="cursor">
        <div className="cursor__circle"></div>
      </div>

      <Header />
      
      {/* Route-specific page contents */}
      <Outlet />
      
      <Footer />

      {/* Scroll-to-top action hook */}
      <div className="back-to-top">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
        </svg>
      </div>
    </div>
  );
}
