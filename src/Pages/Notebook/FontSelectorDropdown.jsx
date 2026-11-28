import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NOTEBOOK_FONTS, FONT_CATEGORIES, lazyLoadFont } from './notebookFonts';
import Style from './FontSelectorDropdown.module.css';

const FontSelectorDropdown = ({ currentFont, onSelectFont, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [triggerRect, setTriggerRect] = useState(null);

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const activeFontObj = useMemo(() => {
    if (!currentFont) return NOTEBOOK_FONTS[0];
    const clean = currentFont.replace(/['"]/g, '').toLowerCase();
    return (
      NOTEBOOK_FONTS.find(
        (f) => f.id.toLowerCase() === clean || f.name.toLowerCase() === clean
      ) || NOTEBOOK_FONTS[0]
    );
  }, [currentFont]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
      setIsOpen(true);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const filteredFonts = useMemo(() => {
    let list = NOTEBOOK_FONTS;
    if (activeCategory !== 'all') {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleSelect = (font) => {
    if (font.isGoogle) {
      lazyLoadFont(font.name);
    }
    onSelectFont(font);
    setIsOpen(false);
  };

  return (
    <div className={Style.container} ref={triggerRef}>
      <button
        type="button"
        className={`${Style.triggerBtn} ${isOpen ? Style.activeTrigger : ''}`}
        onClick={toggleDropdown}
        title="Change Font Family (240+ Fonts)"
        aria-label="Font Family Selector"
      >
        <span className={Style.fontName} style={{ fontFamily: activeFontObj.family }}>
          {activeFontObj.name}
        </span>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', opacity: 0.7 }}></i>
      </button>

      {isOpen &&
        triggerRect &&
        createPortal(
          <div
            ref={popoverRef}
            className={`${Style.popover} ${darkMode ? Style.darkPopover : ''}`}
            style={{
              position: 'fixed',
              top: triggerRect.bottom + 6,
              left: Math.max(8, Math.min(triggerRect.left, (window.innerWidth || 360) - 290)),
              zIndex: 99999,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className={Style.searchBox}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className={Style.searchInput}
                placeholder="Search 240+ fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className={Style.clearBtn}
                  onClick={() => setSearchQuery('')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className={Style.categoryRow}>
              {FONT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${Style.catPill} ${
                    activeCategory === cat.id ? Style.activeCatPill : ''
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Font List */}
            <div className={Style.fontList}>
              {filteredFonts.length === 0 ? (
                <div className={Style.noResults}>No fonts matching "{searchQuery}"</div>
              ) : (
                filteredFonts.map((font) => {
                  const isSelected = activeFontObj.id === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      className={`${Style.fontItem} ${isSelected ? Style.activeFontItem : ''}`}
                      onClick={() => handleSelect(font)}
                      onMouseEnter={() => {
                        if (font.isGoogle) lazyLoadFont(font.name);
                      }}
                    >
                      <span
                        className={Style.fontItemPreview}
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </span>
                      <span className={Style.fontTag}>{font.category}</span>
                      {isSelected && (
                        <i className="fa-solid fa-check" style={{ color: '#6366f1', marginLeft: '6px' }}></i>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default FontSelectorDropdown;
