import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Style from "./NotebookContextMenu.module.css";

const NotebookContextMenu = ({
  x,
  y,
  darkMode,
  tableCell,
  selectedText,
  onClose,
  onAddComment,
  onTranslate,
  onInsertImageUrl,
  onConvertToMultilevelList,
  onConvertToTodo,
  onConvertToBulletList,
  onConvertToNumberedList,
  onConvertToNormal,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onHighlight,
  onInsertImage,
  onClearFormat,
  onSelectAll,
  onInsertTableRowAbove,
  onInsertTableRowBelow,
  onDeleteTableRow,
  onInsertTableColumnRight,
  onDeleteTableColumn,
  onDeleteTable,
}) => {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ left: x, top: y, opacity: 0 });

  // After mount, measure the actual rendered menu size and clamp to viewport
  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const pad = 12;
    const rect = menuRef.current.getBoundingClientRect();
    const menuWidth = rect.width || 230;
    const menuHeight = rect.height || 300;

    let posX = x;
    let posY = y;

    if (posX + menuWidth > window.innerWidth - pad) {
      posX = window.innerWidth - menuWidth - pad;
    }
    if (posY + menuHeight > window.innerHeight - pad) {
      posY = window.innerHeight - menuHeight - pad;
    }
    setPos({
      left: Math.max(pad, posX),
      top: Math.max(pad, posY),
      opacity: 1,
    });
  }, [x, y]);

  useEffect(() => {
    const handleDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleAction = (callback) => {
    if (callback) callback();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={`${Style.menu} ${darkMode ? Style.darkMenu : ""}`}
      style={{ left: `${pos.left}px`, top: `${pos.top}px`, opacity: pos.opacity }}
      role="menu"
      aria-label="Notebook actions menu"
    >
      {/* 1. COMMENTS & TRANSLATION */}
      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onAddComment)}
        style={{ fontWeight: 600, color: "#818cf8" }}
      >
        <i className="fa-solid fa-comment-dots" style={{ color: "#818cf8" }}></i>
        <span>{selectedText ? "Add Comment on Selection" : "Add Comment to Line"}</span>
        <span className={Style.shortcut}>Alt+C</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onTranslate)}
        style={{ fontWeight: 500, color: "#38bdf8" }}
      >
        <i className="fa-solid fa-language" style={{ color: "#38bdf8" }}></i>
        <span>{selectedText ? "Translate Selection" : "Translate Text"}</span>
        <span className={Style.shortcut}>Alt+G</span>
      </button>

      <div className={Style.divider} />

      {/* 2. TABLE ACTIONS */}
      {tableCell && (
        <>
          <div className={Style.sectionTitle}>Table Actions</div>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onInsertTableRowBelow)}
          >
            <i className="fa-solid fa-arrows-down-to-line" style={{ color: "#16a34a" }}></i>
            <span>Insert Row Below</span>
          </button>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onInsertTableRowAbove)}
          >
            <i className="fa-solid fa-arrows-up-to-line" style={{ color: "#16a34a" }}></i>
            <span>Insert Row Above</span>
          </button>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onInsertTableColumnRight)}
          >
            <i className="fa-solid fa-table-columns" style={{ color: "#2563eb" }}></i>
            <span>Insert Column Right</span>
          </button>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onDeleteTableRow)}
          >
            <i className="fa-solid fa-trash-can" style={{ color: "#ea580c" }}></i>
            <span>Delete Row</span>
          </button>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onDeleteTableColumn)}
          >
            <i className="fa-solid fa-trash-can" style={{ color: "#ea580c" }}></i>
            <span>Delete Column</span>
          </button>
          <button
            type="button"
            className={Style.item}
            onClick={() => handleAction(onDeleteTable)}
          >
            <i className="fa-solid fa-trash" style={{ color: "#ef4444" }}></i>
            <span>Delete Table</span>
          </button>
          <div className={Style.divider} />
        </>
      )}

      {/* 3. LISTS & STRUCTURE */}
      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onConvertToTodo)}
      >
        <i className="fa-solid fa-list-check" style={{ color: "#16a34a" }}></i>
        <span>Convert to To-do</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onConvertToBulletList)}
      >
        <i className="fa-solid fa-list-ul" style={{ color: "#6366f1" }}></i>
        <span>Bulleted List (Unordered)</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onConvertToNumberedList)}
      >
        <i className="fa-solid fa-list-ol" style={{ color: "#2563eb" }}></i>
        <span>Numbered List (Ordered)</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onConvertToMultilevelList)}
      >
        <i className="fa-solid fa-bars-staggered" style={{ color: "#8b5cf6" }}></i>
        <span>Multilevel List (1., 1.1, 1.1.1)</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onConvertToNormal)}
      >
        <i className="fa-solid fa-paragraph"></i>
        <span>Convert to Normal Text</span>
      </button>

      <div className={Style.divider} />

      {/* 4. TEXT FORMATTING */}
      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onBold)}
      >
        <i className="fa-solid fa-bold"></i>
        <span>Bold</span>
        <span className={Style.shortcut}>Ctrl+B</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onItalic)}
      >
        <i className="fa-solid fa-italic"></i>
        <span>Italic</span>
        <span className={Style.shortcut}>Ctrl+I</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onUnderline)}
      >
        <i className="fa-solid fa-underline"></i>
        <span>Underline</span>
        <span className={Style.shortcut}>Ctrl+U</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onStrikethrough)}
      >
        <i className="fa-solid fa-strikethrough"></i>
        <span>Strikethrough</span>
        <span className={Style.shortcut}>Alt+K</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onHighlight)}
      >
        <i className="fa-solid fa-highlighter" style={{ color: "#eab308" }}></i>
        <span>Highlight</span>
      </button>

      <div className={Style.divider} />

      {/* 5. IMAGE INSERTION (BY LINK & LOCAL FILE) */}
      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onInsertImageUrl)}
      >
        <i className="fa-solid fa-link" style={{ color: "#a855f7" }}></i>
        <span>Insert Image via Link...</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onInsertImage)}
      >
        <i className="fa-solid fa-image" style={{ color: "#2563eb" }}></i>
        <span>Upload Local Image...</span>
      </button>

      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onClearFormat)}
      >
        <i className="fa-solid fa-eraser"></i>
        <span>Clear Formatting</span>
      </button>

      <div className={Style.divider} />

      {/* 6. SELECT ALL */}
      <button
        type="button"
        className={Style.item}
        onClick={() => handleAction(onSelectAll)}
      >
        <i className="fa-solid fa-object-ungroup"></i>
        <span>Select All</span>
        <span className={Style.shortcut}>Ctrl+A</span>
      </button>
    </div>
  );
};

export default NotebookContextMenu;
