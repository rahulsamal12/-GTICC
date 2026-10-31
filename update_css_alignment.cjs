const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'public/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');
const idx = css.indexOf('/* Custom Header & Logo Sizing Overrides */');

if (idx === -1) {
  console.error('Target overrides section not found');
  process.exit(1);
}

const newStyles = `/* Custom Header & Logo Sizing Overrides */

/* Mobile (< 768px) override for header layout */
@media (max-width: 767px) {
  /* Override header and navbar min-height and padding on mobile */
  .header.header-sticky .navbar,
  .header.header-sticky.is-sticky .navbar,
  .header.header-sticky.is-sticky.sticky-show .navbar,
  header.header.header-sticky .navbar,
  header.header.header-sticky.is-sticky .navbar,
  header.header.header-sticky.is-sticky.sticky-show .navbar {
    min-height: 92px !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  .header.header-sticky .main-header,
  .header.header-sticky.is-sticky .main-header,
  .header.header-sticky.is-sticky.sticky-show .main-header,
  header.header.header-sticky .main-header,
  header.header.header-sticky.is-sticky .main-header,
  header.header.header-sticky.is-sticky.sticky-show .main-header {
    min-height: 92px !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Center the mobile logo brand wrapper */
  header.header.header-sticky .mobile-nav-wrapper .navbar-brand,
  header.header.header-sticky.is-sticky .mobile-nav-wrapper .navbar-brand,
  header.header.header-sticky.is-sticky.sticky-show .mobile-nav-wrapper .navbar-brand {
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Keep mobile logo size original template standard and constant when scrolled */
  header.header.header-sticky .mobile-nav-wrapper .navbar-brand,
  header.header.header-sticky .mobile-nav-wrapper .navbar-brand img,
  header.header.header-sticky.is-sticky .mobile-nav-wrapper .navbar-brand,
  header.header.header-sticky.is-sticky .mobile-nav-wrapper .navbar-brand img {
    width: 225px !important;
    min-width: 225px !important;
    max-width: 225px !important;
    height: 73px !important;
    min-height: 73px !important;
    max-height: 73px !important;
    object-fit: contain !important;
  }

  /* Position mobile hamburger on the far right */
  header.header.header-sticky .mobile-nav-wrapper .action-group,
  header.header.header-sticky.is-sticky .mobile-nav-wrapper .action-group {
    position: absolute !important;
    right: 16px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 !important;
  }
}

/* Desktop & Tablet (>= 768px) Split Navigation Layout */
@media (min-width: 768px) {
  /* Override main-header styling to disable template grid layouts completely and force full-width flex */
  header.header.header-sticky .main-header,
  header.header.header-sticky.is-sticky .main-header,
  header.header.header-sticky.is-sticky.sticky-show .main-header,
  .header.header-sticky .main-header,
  .header.header-sticky.is-sticky .main-header,
  .header.header-sticky.is-sticky.sticky-show .main-header {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    min-height: 92px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    grid-template-columns: none !important;
    gap: 0 !important;
    column-gap: normal !important;
  }

  /* Force the desktop nav wrapper to use a single flex row layout with items centered */
  header.header.header-sticky .main-header .desktop-nav-wrapper {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    position: relative !important;
    grid-template-columns: none !important;
    gap: 0 !important;
  }

  /* Left navigation menu styling - takes 1/2 of remaining space to balance centering */
  /* Restored gap spacing of 15px */
  header.header.header-sticky .main-header .desktop-nav-wrapper .left-nav {
    flex: 0 1 auto !important;
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    gap: 0 15px !important;
  }

  /* Centered logo brand wrapper - shifted 30px to the right for optical/visual balance */
  header.header.header-sticky .main-header .desktop-nav-wrapper .centered-logo-brand,
  header.header.header-sticky.is-sticky .main-header .desktop-nav-wrapper .centered-logo-brand,
  header.header.header-sticky.is-sticky.sticky-show .main-header .desktop-nav-wrapper .centered-logo-brand {
    position: absolute !important;
    left: calc(50% + 30px) !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 10 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Right navigation and actions wrapper - takes 1/2 of remaining space to balance centering */
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper {
    flex: 0 1 auto !important;
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-end !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
    right: auto !important;
    top: auto !important;
    transform: none !important;
  }

  /* Right navigation list styling - reverted to the original gap spacing of 15px */
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .right-nav {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    flex-wrap: nowrap !important;
    gap: 0 15px !important;
  }

  /* Inline Actions (Search & Hamburger) styling - horizontally inline immediately after right-nav */
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
    margin-left: 20px !important;
    padding: 0 !important;
    position: relative !important;
    right: auto !important;
    top: auto !important;
    transform: none !important;
  }

  /* Reset layout margins/paddings and align everything to center of the row */
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search,
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search ul,
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search ul li {
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: auto !important;
    line-height: 1 !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search ul li a {
    font-size: 22px !important;
    color: #F4F7FA !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 10px !important;
    margin: 0 !important;
    height: auto !important;
    line-height: 1 !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .menu-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
    margin-left: 10px !important;
    padding: 0 !important;
    position: relative !important;
    right: auto !important;
    top: auto !important;
    transform: none !important;
    height: auto !important;
    line-height: 1 !important;
  }

  /* Force display of search and desktop hamburger inline actions on tablet/desktop */
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search,
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .menu-btn {
    display: flex !important;
  }

  /* Enlarged logo dimensions on desktop (increased by 12.5% to 315px) constant when scrolled */
  header.header.header-sticky .desktop-nav-wrapper .centered-logo-brand img,
  header.header.header-sticky .desktop-nav-wrapper .centered-logo-brand img.navbar-logo,
  header.header.header-sticky.is-sticky .desktop-nav-wrapper .centered-logo-brand img,
  header.header.header-sticky.is-sticky .desktop-nav-wrapper .centered-logo-brand img.navbar-logo {
    width: 315px !important;
    min-width: 315px !important;
    max-width: 315px !important;
    height: 92px !important;
    min-height: 92px !important;
    max-height: 92px !important;
    object-fit: contain !important;
  }
}

/* Tablet viewport (768px - 991px) specific overrides to fit all inline */
@media (min-width: 768px) and (max-width: 991px) {
  header.header.header-sticky .main-header {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .left-nav,
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .right-nav {
    gap: 0 4px !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .navbar-nav>li .nav-link {
    font-size: 11.5px !important;
    padding-left: 2px !important;
    padding-right: 2px !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions {
    margin-left: 8px !important;
  }

  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .desktop-inline-actions .search ul li a {
    font-size: 18px !important;
    padding: 0 4px !important;
  }

  header.header.header-sticky .desktop-nav-wrapper .centered-logo-brand img,
  header.header.header-sticky .desktop-nav-wrapper .centered-logo-brand img.navbar-logo,
  header.header.header-sticky.is-sticky .desktop-nav-wrapper .centered-logo-brand img,
  header.header.header-sticky.is-sticky .desktop-nav-wrapper .centered-logo-brand img.navbar-logo {
    width: 205px !important;
    min-width: 205px !important;
    max-width: 205px !important;
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
  }
}

/* Responsive spacing overrides for laptop viewports (992px - 1599px) to prevent absolute logo overlap */
@media (min-width: 992px) and (max-width: 1599px) {
  header.header.header-sticky .main-header .desktop-nav-wrapper .navbar-nav>li .nav-link {
    font-size: 15px !important;
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  header.header.header-sticky .main-header .desktop-nav-wrapper .right-nav-wrapper .right-nav,
  header.header.header-sticky .main-header .desktop-nav-wrapper .left-nav {
    gap: 0 10px !important;
  }
}
`;

fs.writeFileSync(cssPath, css.substring(0, idx) + newStyles);
console.log('CSS overrides successfully updated!');
