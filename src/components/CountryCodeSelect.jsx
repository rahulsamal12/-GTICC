import React, { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { countries } from '../data/countries';

/**
 * Reusable Searchable Country Code Selector
 * Standardized to match GTICC dark charcoal/navy styling:
 * - Trigger background: #202936 (matching native .form-control)
 * - Focused trigger: #232D3B with #D6A43B border & 3px focus ring
 * - Border: 1px solid #2A3649 (normal) / 1px solid #D6A43B (open/focused)
 * - Border radius: 8px (matching other form inputs)
 * - Dimensions: minHeight 46px, padding 10px 14px, fontSize 13.5px, lineHeight 1.5
 * - Typography: #F5F5F5 primary text
 * - Placeholder: #AAB4C3 at 0.8 opacity
 * - Gold accent (#D6A43B) strictly for focus border, chevron indicator, and dial badge
 * - Dropdown menu: Rendered via React Portal (document.body) to avoid stacking context issues
 * - Menu surface: Solid #171D25 with 1px solid #2A3649 border and solid dark background
 * - Search bar: #202936 with 1px solid #2A3649 and #F5F5F5 text
 * - Option items: #171D25 default / #232D3B hover / #283344 selected with #D6A43B indicator
 */
export default function CountryCodeSelect({
  value = '',
  onChange,
  id = 'country-code-select',
  name = 'countryCode',
  hasError = false,
  required = false,
  disabled = false,
  placeholder = 'Select country code',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const dropdownRef = useRef(null);

  // Portal positioning state
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 320,
    maxHeight: 320,
  });

  // Normalize current selected country from value
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    const clean = value.trim();
    // Exact dialCode match; if multiple, prefer major common countries
    const matches = countries.filter((c) => c.dialCode === clean);
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    // Tie-breakers for shared codes like +1, +44, +7
    if (clean === '+1') return matches.find((c) => c.code === 'US') || matches[0];
    if (clean === '+44') return matches.find((c) => c.code === 'GB') || matches[0];
    if (clean === '+7') return matches.find((c) => c.code === 'RU') || matches[0];
    return matches[0];
  }, [value]);

  // Filtered and ranked countries based on search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return countries;

    const rank = (c) => {
      const name = c.name.toLowerCase();
      const code = c.code.toLowerCase();
      const dial = c.dialCode.toLowerCase();
      const dialClean = dial.replace('+', '');
      const qClean = q.replace('+', '');

      if (code === q) return 1;
      if (dial === q || dialClean === qClean) return 2;
      if (name === q) return 3;
      if (name.startsWith(q)) return 4;
      if (code.startsWith(q)) return 5;
      if (dialClean.startsWith(qClean)) return 6;
      return 7;
    };

    return countries
      .filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const codeMatch = c.code.toLowerCase().includes(q);
        const dialClean = c.dialCode.replace('+', '').toLowerCase();
        const dialMatch = c.dialCode.toLowerCase().includes(q) || dialClean.includes(q.replace('+', ''));
        return nameMatch || codeMatch || dialMatch;
      })
      .sort((a, b) => rank(a) - rank(b));
  }, [searchQuery]);

  // Keep highlighted item reset on query change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Calculate dropdown coordinates relative to viewport / body
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuDesiredHeight = 320;

    let top = 0;
    let maxHeight = menuDesiredHeight;

    // Flip upward if space below is limited
    if (spaceBelow < 220 && spaceAbove > spaceBelow) {
      maxHeight = Math.min(menuDesiredHeight, spaceAbove - 16);
      top = rect.top + window.scrollY - maxHeight - 6;
    } else {
      maxHeight = Math.min(menuDesiredHeight, spaceBelow - 16);
      top = rect.bottom + window.scrollY + 6;
    }

    // Minimum 320px width for comfortable reading of country names, or match trigger if wider
    let width = Math.max(320, rect.width);
    if (width > viewportWidth - 24) {
      width = viewportWidth - 24;
    }

    let left = rect.left + window.scrollX;
    if (left + width > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - width - 12 + window.scrollX);
    }

    setMenuPosition({
      top: Math.max(0, top),
      left: Math.max(0, left),
      width,
      maxHeight: Math.max(180, maxHeight),
    });
  }, []);

  // Update positioning on open, scroll, or resize
  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  // Handle outside click to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);

      if (!clickedTrigger && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex];
      if (highlightedEl && typeof highlightedEl.scrollIntoView === 'function') {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (country, e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (onChange) {
      onChange(country.dialCode, country);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (filteredCountries[highlightedIndex]) {
        handleSelect(filteredCountries[highlightedIndex], e);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="gticc-country-select-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
      }}
    >
      {/* Hidden input to ensure native form access / required validation */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      {/* Trigger Button - Standardized to match native .form-control */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Country Code"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: isOpen ? '#232D3B' : '#202936',
          border: hasError
            ? '1px solid #ef4444'
            : isOpen
            ? '1px solid #D6A43B'
            : '1px solid #2A3649',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(214, 164, 59, 0.15)'
            : hasError
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
            : 'none',
          borderRadius: '8px',
          color: selectedCountry || value ? '#F5F5F5' : '#AAB4C3',
          fontSize: '13.5px',
          fontFamily: 'inherit',
          lineHeight: '1.5',
          minHeight: '46px',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0.15s ease-in-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {selectedCountry ? (
            <>
              <img
                src={`/flags/${selectedCountry.code.toLowerCase()}.svg`}
                alt=""
                style={{
                  width: '20px',
                  height: '15px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  flexShrink: 0,
                  display: 'inline-block',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'inline';
                  }
                }}
              />
              <span style={{ fontSize: '16px', lineHeight: 1, display: 'none' }} aria-hidden="true">
                {selectedCountry.flag}
              </span>
              <span style={{ fontWeight: '600', color: '#D6A43B', fontSize: '13.5px' }}>
                {selectedCountry.dialCode}
              </span>
              <span
                style={{
                  color: '#AAB4C3',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '120px',
                }}
              >
                ({selectedCountry.code})
              </span>
            </>
          ) : value ? (
            <span style={{ fontWeight: '600', color: '#D6A43B', fontSize: '13.5px' }}>{value}</span>
          ) : (
            <span style={{ color: '#AAB4C3', fontSize: '13px', opacity: 0.8 }}>{placeholder}</span>
          )}
        </div>

        {/* Dropdown chevron matching gold accent */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D6A43B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: '6px',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu rendered via Portal attached to document.body */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
              maxHeight: `${menuPosition.maxHeight}px`,
              zIndex: 999999,
              backgroundColor: '#171D25',
              opacity: 1,
              border: '1px solid #2A3649',
              borderRadius: '8px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(42, 54, 73, 0.4)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              boxSizing: 'border-box',
            }}
          >
            {/* Custom Scrollbar Styles matching the dark charcoal theme */}
            <style>{`
              .gticc-cc-scroll::-webkit-scrollbar {
                width: 7px;
              }
              .gticc-cc-scroll::-webkit-scrollbar-track {
                background: #171D25;
              }
              .gticc-cc-scroll::-webkit-scrollbar-thumb {
                background: #2A3649;
                border-radius: 4px;
              }
              .gticc-cc-scroll::-webkit-scrollbar-thumb:hover {
                background: #D6A43B;
              }
            `}</style>

            {/* Fixed Search Header */}
            <div
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #2A3649',
                backgroundColor: '#171D25',
                flexShrink: 0,
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D6A43B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: 'absolute', left: '11px', pointerEvents: 'none' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search country, code, or +dial..."
                  aria-label="Search countries"
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    backgroundColor: '#202936',
                    border: '1px solid #2A3649',
                    borderRadius: '6px',
                    color: '#F5F5F5',
                    fontSize: '12.5px',
                    outline: 'none',
                    lineHeight: '1.5',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSearchQuery('');
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#AAB4C3',
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: '2px 4px',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Countries List with Solid Row Backgrounds */}
            <div
              ref={listRef}
              className="gticc-cc-scroll"
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '4px 0',
                backgroundColor: '#171D25',
              }}
            >
              {filteredCountries.length === 0 ? (
                <div
                  style={{
                    padding: '24px 14px',
                    textAlign: 'center',
                    backgroundColor: '#171D25',
                    color: '#AAB4C3',
                    fontSize: '12.5px',
                  }}
                >
                  No matching country found for "{searchQuery}".
                </div>
              ) : (
                filteredCountries.map((country, index) => {
                  const isSelected = selectedCountry?.code === country.code;
                  const isHighlighted = highlightedIndex === index;

                  // Matched directly to form surface theme:
                  // Normal: #171D25
                  // Hover/Highlighted: #232D3B (subtle natural dark charcoal lift)
                  // Selected: #283344 with #D6A43B left accent border
                  const rowBg = isSelected
                    ? '#283344'
                    : isHighlighted
                    ? '#232D3B'
                    : '#171D25';

                  return (
                    <div
                      key={`${country.code}-${country.dialCode}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(country, e);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        margin: '2px 6px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: rowBg,
                        borderLeft: isSelected
                          ? '3.5px solid #D6A43B'
                          : isHighlighted
                          ? '3.5px solid #3B4B63'
                          : '3.5px solid transparent',
                        transition: 'background-color 0.12s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, flex: 1 }}>
                        <img
                          src={`/flags/${country.code.toLowerCase()}.svg`}
                          alt=""
                          style={{
                            width: '20px',
                            height: '15px',
                            objectFit: 'cover',
                            borderRadius: '2px',
                            flexShrink: 0,
                            display: 'inline-block',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'inline';
                            }
                          }}
                        />
                        <span style={{ fontSize: '17px', lineHeight: 1, display: 'none' }} aria-hidden="true">
                          {country.flag}
                        </span>
                        <span
                          style={{
                            color: '#F5F5F5',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {country.name}
                        </span>
                        <span
                          style={{
                            color: '#AAB4C3',
                            fontSize: '11.5px',
                            fontFamily: 'monospace',
                            marginLeft: '2px',
                            opacity: 0.85,
                          }}
                        >
                          ({country.code})
                        </span>
                      </div>

                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: '600',
                          fontSize: '11.5px',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          backgroundColor: '#202936',
                          color: isSelected ? '#D6A43B' : '#F5F5F5',
                          border: isSelected ? '1px solid #D6A43B' : '1px solid #2A3649',
                          marginLeft: '8px',
                          flexShrink: 0,
                        }}
                      >
                        {country.dialCode}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
