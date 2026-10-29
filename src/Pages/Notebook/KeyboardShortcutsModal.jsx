import React, { useState } from 'react';
import Style from './KeyboardShortcutsModal.module.css';

const SHORTCUT_GROUPS = [
  {
    title: 'Ribbon & Topbar Alt Shortcuts',
    description: 'Press Alt to display keytips, then press a highlighted key. Alt+M keeps keytips visible in the menu:',
    items: [
      { key: 'Alt + S', desc: 'Open Notebook Settings panel' },
      { key: 'Alt + M', desc: 'Open More Options (...) menu' },
      { key: 'Alt + N', desc: 'Open My Notebooks drawer' },
      { key: 'Alt + Y', desc: 'Open Multi-Device Cloud Sync' },
      { key: 'Alt + Q', desc: 'Save Notebook immediately' },
      { key: 'Alt + Z', desc: 'Toggle Zen / Focus Mode' },
      { key: 'Alt + B', desc: 'Toggle Bold text formatting' },
      { key: 'Alt + I', desc: 'Toggle Italic text formatting' },
      { key: 'Alt + U', desc: 'Toggle Underline text formatting' },
      { key: 'Alt + K', desc: 'Toggle Strikethrough formatting' },
      { key: 'Alt + P', desc: 'Toggle Superscript (x²)' },
      { key: 'Alt + X', desc: 'Toggle Subscript (x₂)' },
      { key: 'Alt + L', desc: 'Align Left' },
      { key: 'Alt + E', desc: 'Align Center' },
      { key: 'Alt + R', desc: 'Align Right' },
      { key: 'Alt + J', desc: 'Justify Alignment' },
      { key: 'Alt + T', desc: 'Insert or toggle To-Do Checklist' },
      { key: 'Alt + 1', desc: 'Numbered list (Ordered list)' },
      { key: 'Alt + V', desc: 'Multilevel nested list (1. > 1.1)' },
      { key: 'Alt + O', desc: 'Bullet list (Unordered list)' },
      { key: 'Alt + C', desc: 'Add or open Comments panel' },
      { key: 'Alt + G', desc: 'Translate selected text' },
      { key: 'Alt + ?', desc: 'Open this Keyboard Shortcuts cheat sheet' },
    ],
  },
  {
    title: 'Standard Keyboard Shortcuts',
    description: 'Standard document editing & navigation shortcuts:',
    items: [
      { key: 'Ctrl + Z', desc: 'Undo last edit' },
      { key: 'Ctrl + Y / Ctrl + Shift + Z', desc: 'Redo last undone edit' },
      { key: 'Ctrl + B', desc: 'Bold' },
      { key: 'Ctrl + I', desc: 'Italic' },
      { key: 'Ctrl + U', desc: 'Underline' },
      { key: 'Ctrl + V', desc: 'Paste (Excel tables, Word rich-text, images)' },
      { key: 'Tab', desc: 'Navigate to next table cell / Indent list' },
      { key: 'Shift + Tab', desc: 'Navigate to previous table cell / Outdent list' },
      { key: 'Enter (in Checklist)', desc: 'Create new checklist item' },
      { key: 'Backspace (empty Checklist)', desc: 'Exit checklist mode back to normal paragraph' },
      { key: 'Space after "- " or "* "', desc: 'Auto-convert to Bullet list' },
      { key: 'Space after "1. "', desc: 'Auto-convert to Numbered list' },
      { key: 'Space after "[] "', desc: 'Auto-convert to To-Do Checklist' },
    ],
  },
];

const KeyboardShortcutsModal = ({ isOpen, onClose, darkMode }) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const normalizedFilter = filter.toLowerCase().trim();

  return (
    <div className={Style.backdrop} onClick={onClose}>
      <div
        className={`${Style.modal} ${darkMode ? Style.darkModal : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcutsModalTitle"
      >
        <div className={Style.header}>
          <div className={Style.headerLeft}>
            <div className={Style.iconBadge}>
              <i className="fa-solid fa-keyboard"></i>
            </div>
            <div>
              <h2 id="shortcutsModalTitle" className={Style.title}>Keyboard Shortcuts</h2>
              <p className={Style.subtitle}>MS Word ribbon & quick-editing hotkeys</p>
            </div>
          </div>
          <button type="button" className={Style.closeBtn} onClick={onClose} aria-label="Close dialog">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={Style.searchWrap}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            className={Style.searchInput}
            placeholder="Search shortcuts (e.g. bold, table, alt, list)…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          {filter && (
            <button type="button" className={Style.clearFilterBtn} onClick={() => setFilter('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className={Style.body}>
          {SHORTCUT_GROUPS.map((group, gIdx) => {
            const filteredItems = group.items.filter(
              (item) =>
                !normalizedFilter ||
                item.key.toLowerCase().includes(normalizedFilter) ||
                item.desc.toLowerCase().includes(normalizedFilter)
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className={Style.group}>
                <div className={Style.groupHeader}>
                  <h3 className={Style.groupTitle}>{group.title}</h3>
                  <span className={Style.groupDesc}>{group.description}</span>
                </div>
                <div className={Style.grid}>
                  {filteredItems.map((item, iIdx) => (
                    <div key={iIdx} className={Style.shortcutRow}>
                      <span className={Style.shortcutDesc}>{item.desc}</span>
                      <div className={Style.keyBadgeGroup}>
                        {item.key.split(' / ').map((subKey, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span className={Style.orSeparator}>or</span>}
                            <span className={Style.keyBadge}>{subKey}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={Style.footer}>
          <span className={Style.tip}>
            <i className="fa-solid fa-lightbulb"></i>
            Tip: Press <kbd className={Style.kbd}>Alt</kbd> anytime on desktop to reveal ribbon keytips.
          </span>
          <button type="button" className={Style.btnClose} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
