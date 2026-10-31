import React, { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getTimezoneOptions } from '../data/timezones';

/**
 * Professional, Searchable, Scrollable Time Zone Selector with React Portal Positioning
 *
 * Theme-matched to GTICC dark charcoal/navy styling:
 * - Trigger background: #202936 (matching native form-control)
 * - Focused trigger: #232D3B with #D6A43B border & 3px focus ring
 * - Border: 1px solid #2A3649 (normal) / 1px solid #D6A43B (open/focused)
 * - Border radius: 8px (matching other form inputs)
 * - Typography: #F5F5F5 primary text, 13.5px font-size, 1.5 line-height
 * - Placeholder: #AAB4C3 at 0.8 opacity
 * - Gold accent (#D6A43B) strictly for border focus, dropdown arrow, and offset badge
 * - Dropdown container: #171D25 (matching form surface) with 1px solid #2A3649
 * - Search bar: #202936 with 1px solid #2A3649 and #F5F5F5 text
 * - Option item default: #171D25
 * - Option item hover: #232D3B (subtle natural dark charcoal lift)
 * - Option item selected: #283344 with #D6A43B left accent border
 */
export default function TimezoneSelect({
  value = '',
  onChange,
  id = 'timezone-select',
  name = 'timeZoneGmt',
  hasError = false,
  required = false,
  disabled = false,
  placeholder = 'Select operating time zone...',
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
    width: 0,
    maxHeight: 340,
  });

  // Generate complete timezone dataset (423 time zones)
  const timezoneList = useMemo(() => {
    return getTimezoneOptions();
  }, []);

  // Determine currently selected timezone object from incoming value string
  const selectedTimezone = useMemo(() => {
    if (!value) return null;
    const clean = value.trim();

    // Exact match on value e.g. "Asia/Kolkata (GMT+05:30)" or label
    let found = timezoneList.find(
      (t) => t.value === clean || t.label === clean || t.iana === clean
    );
    if (found) return found;

    // Partial match if stored as e.g. "Asia/Kolkata" or "GMT+5:30"
    found = timezoneList.find(
      (t) => clean.startsWith(t.iana) || (clean.includes(t.iana) && clean.includes(t.gmtOffset))
    );
    return found || null;
  }, [value, timezoneList]);

  // Filtered timezone list based on search query
  const filteredTimezones = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return timezoneList;

    const qClean = q.replace(/[^a-z0-9]/g, '');

    return timezoneList.filter((tz) => {
      const cityMatch = tz.city.toLowerCase().includes(q);
      const nameMatch = tz.primaryName.toLowerCase().includes(q);
      const countryMatch = tz.country.toLowerCase().includes(q);
      const ianaMatch = tz.iana.toLowerCase().includes(q);
      const gmtMatch = tz.gmtOffset.toLowerCase().includes(q);
      const labelMatch = tz.label.toLowerCase().includes(q);

      // Cleaned alphanumeric match (e.g. typing "gmt530" or "kolkata")
      const labelClean = tz.label.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanMatch = labelClean.includes(qClean);

      return (
        cityMatch ||
        nameMatch ||
        countryMatch ||
        ianaMatch ||
        gmtMatch ||
        labelMatch ||
        cleanMatch
      );
    });
  }, [searchQuery, timezoneList]);

  // Reset highlight when search query changes
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
    const menuDesiredHeight = 340;

    let top = 0;
    let maxHeight = menuDesiredHeight;

    // If space below is limited (< 220px) and space above is larger, show above trigger
    if (spaceBelow < 220 && spaceAbove > spaceBelow) {
      maxHeight = Math.min(menuDesiredHeight, spaceAbove - 16);
      top = rect.top + window.scrollY - maxHeight - 6;
    } else {
      maxHeight = Math.min(menuDesiredHeight, spaceBelow - 16);
      top = rect.bottom + window.scrollY + 6;
    }

    // Horizontal boundaries: ensure it matches trigger width and stays within screen
    let left = rect.left + window.scrollX;
    let width = rect.width;
    const minWidth = Math.min(320, viewportWidth - 24);

    if (width < minWidth) {
      width = minWidth;
    }

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

  // Close dropdown on outside click
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

  // Auto-focus search input when opened
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
    if (isOpen && listRef.current && listRef.current.children) {
      const el = listRef.current.children[highlightedIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (tz) => {
    if (onChange) {
      // Save formatted value: e.g. "Asia/Kolkata (GMT+05:30)"
      onChange(tz.value, tz);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredTimezones.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTimezones[highlightedIndex]) {
        handleSelect(filteredTimezones[highlightedIndex]);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', userSelect: 'none' }}
      className="gticc-timezone-selector"
    >
      {/* Hidden input to ensure native form serialization & validation */}
      <input
        type="hidden"
        name={name}
        id={id}
        value={value}
        required={required}
      />

      {/* Trigger Button - Matched identically to native .form-control */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOpen ? '#232D3B' : '#202936',
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
          padding: '10px 14px',
          color: selectedTimezone ? '#F5F5F5' : '#AAB4C3',
          fontSize: '13.5px',
          lineHeight: '1.5',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0.15s ease-in-out',
          textAlign: 'left',
          minHeight: '46px',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginRight: '8px',
            color: selectedTimezone ? '#F5F5F5' : '#AAB4C3',
            opacity: selectedTimezone ? 1 : 0.8,
            fontWeight: selectedTimezone ? '500' : '400',
          }}
        >
          {selectedTimezone ? selectedTimezone.label : placeholder}
        </span>

        {/* Clear Dropdown Arrow & Optional GMT Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {selectedTimezone && (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '4px',
                background: '#171D25',
                color: '#D6A43B',
                border: '1px solid #2A3649',
                fontWeight: '600',
              }}
            >
              {selectedTimezone.gmtOffset}
            </span>
          )}
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
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu rendered via Portal attached to document.body */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
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
              .gticc-tz-scroll::-webkit-scrollbar {
                width: 7px;
              }
              .gticc-tz-scroll::-webkit-scrollbar-track {
                background: #171D25;
              }
              .gticc-tz-scroll::-webkit-scrollbar-thumb {
                background: #2A3649;
                border-radius: 4px;
              }
              .gticc-tz-scroll::-webkit-scrollbar-thumb:hover {
                background: #D6A43B;
              }
            `}</style>

            {/* Search Header - Solid #171D25 */}
            <div
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #2A3649',
                backgroundColor: '#171D25',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
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
                  placeholder="Search city, country, UTC offset, or timezone..."
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
                    onClick={() => setSearchQuery('')}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#AAB4C3',
                  marginTop: '7px',
                  paddingLeft: '2px',
                  paddingRight: '2px',
                  fontWeight: '500',
                }}
              >
                <span>{filteredTimezones.length} time zones available</span>
                <span style={{ color: '#D6A43B' }}>Use ↑ ↓ and Enter to select</span>
              </div>
            </div>

            {/* Vertically Scrollable List - Solid #171D25 */}
            <div
              ref={listRef}
              role="listbox"
              className="gticc-tz-scroll"
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '4px 0',
                backgroundColor: '#171D25',
              }}
            >
              {filteredTimezones.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: '#AAB4C3',
                    fontSize: '12.5px',
                    backgroundColor: '#171D25',
                  }}
                >
                  No matching time zones found for "{searchQuery}".
                </div>
              ) : (
                filteredTimezones.map((tz, index) => {
                  const isSelected = selectedTimezone && selectedTimezone.iana === tz.iana;
                  const isHighlighted = highlightedIndex === index;

                  // Matched directly to form surface theme:
                  // Normal: transparent / #171D25
                  // Hover/Highlighted: #232D3B (subtle natural dark charcoal lift)
                  // Selected: #283344 with #D6A43B left accent border
                  const itemBg = isSelected
                    ? '#283344'
                    : isHighlighted
                    ? '#232D3B'
                    : '#171D25';

                  return (
                    <div
                      key={tz.iana}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(tz)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        padding: '9px 12px',
                        margin: '2px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: itemBg,
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease',
                        borderLeft: isSelected
                          ? '3.5px solid #D6A43B'
                          : isHighlighted
                          ? '3.5px solid #3B4B63'
                          : '3.5px solid transparent',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          marginRight: '12px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span
                            style={{
                              color: '#F5F5F5',
                              fontSize: '13px',
                              fontWeight: isSelected ? '600' : '500',
                            }}
                          >
                            {tz.primaryName}
                          </span>
                          <span
                            style={{
                              color: '#AAB4C3',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                            }}
                          >
                            — {tz.iana}
                          </span>
                        </div>
                        <span
                          style={{
                            color: '#AAB4C3',
                            fontSize: '11px',
                            marginTop: '2px',
                            opacity: 0.85,
                          }}
                        >
                          {tz.country} {tz.hasDst ? '• Seasonal Daylight Saving' : ''}
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
                          flexShrink: 0,
                        }}
                      >
                        {tz.gmtOffset}
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
