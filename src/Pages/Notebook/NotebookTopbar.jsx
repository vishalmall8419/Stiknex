import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { onBtnEnter, onBtnLeave } from "../../utils/gsapButtonHover";
import Style from "./NotebookTopbar.module.css";

const SHORTCUTS = [
  { keys: "Ctrl / Cmd + S", action: "Save now" },
  { keys: "Ctrl / Cmd + D", action: "Download .txt" },
  { keys: "Ctrl / Cmd + Shift + C", action: "Copy all text" },
  { keys: "Ctrl / Cmd + Shift + N", action: "New notebook" },
  { keys: "Ctrl / Cmd + .", action: "Toggle distraction-free mode" },
  { keys: "Ctrl / Cmd + ,", action: "Toggle settings" },
  { keys: "Esc", action: "Exit distraction-free / close panel" },
];

const UNICODE_CATEGORIES = [
  {
    id: "popular",
    label: "Popular",
    chars: ["😊", "😂", "🔥", "✨", "❤️", "👍", "🎉", "💡", "📌", "⭐", "🚀", "☕", "📝", "✅", "👏", "🙌", "💯", "🎯"],
  },
  {
    id: "symbols",
    label: "Symbols",
    chars: ["✓", "✗", "★", "☆", "♠", "♣", "♥", "♦", "♪", "♫", "⚡", "🔔", "🏷️", "💬", "☀️", "🌙", "☁️", "❄️"],
  },
  {
    id: "math",
    label: "Math",
    chars: ["∞", "∑", "π", "Ω", "µ", "Δ", "√", "≈", "≠", "±", "÷", "×", "≤", "≥", "∫", "∂", "∝", "∈"],
  },
  {
    id: "currency",
    label: "Currency",
    chars: ["₹", "$", "€", "£", "¥", "¢", "©", "®", "™", "°", "%", "‰", "§", "¶", "•", "†"],
  },
  {
    id: "arrows",
    label: "Arrows",
    chars: ["←", "↑", "→", "↓", "↔", "↕", "➔", "➜", "⇒", "⇐", "⬆️", "⬇️", "⬅️", "➡️", "▲", "▼"],
  },
];

const CLOCK_FORMAT_KEY = "notebookClockFormat";

const getSystemClockFormat = () => {
  try {
    const { hour12 } = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
    }).resolvedOptions();
    return hour12 ? "12" : "24";
  } catch {
    return "24";
  }
};

const loadClockFormat = () => {
  try {
    const saved = localStorage.getItem(CLOCK_FORMAT_KEY);
    if (saved === "12" || saved === "24") return saved;
  } catch {}
  return getSystemClockFormat();
};

const useClickOutside = (onOutside, extraRefs = []) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      const insideMain = ref.current && ref.current.contains(e.target);
      const insideExtra = extraRefs.some(
        (r) => r.current && r.current.contains(e.target),
      );
      if (!insideMain && !insideExtra) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside, ...extraRefs]);
  return ref;
};

const useAnchoredRect = (ref, isOpen) => {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setRect(null);
      return undefined;
    }

    const update = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, ref]);

  return rect;
};

const formatElapsed = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const formatClock = (date, format) => {
  const pad = (n) => String(n).padStart(2, "0");
  if (format === "12") {
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${pad(hours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const NotebookTopbar = ({
  darkMode,
  altKeyActive = false,
  onToggleSettings,
  settingsOpen,
  autoHideNavbar,
  onToggleAutoHideNavbar,
  musicOn,
  setMusicOn,
  isReading: propIsReading,
  onReadAloud,
  title,
  setTitle,
  onTitleChange,
  onDelete,
  onDownload,
  onCopy,
  onShare,
  onToggleZenMode,
  wordCount,
  charCount,
  saveState = "saved",
  text,
  setText,
  textareaRef,
  notebooks = [],
  activeNotebookId,
  onNewNotebook,
  onSwitchNotebook,
  onDeleteNotebook,
  onOpenVirtualKeyboard,
  searchOpen,
  onToggleSearch,
  searchQuery,
  onSearchQueryChange,
  searchMatches = [],
  searchMatchIndex = 0,
  onSearchNext,
  onSearchPrev,
  onSearchClose,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  timerRunning: propTimerRunning,
  elapsedMs: propElapsedMs,
  onToggleTimer: propToggleTimer,
  onResetTimer: propResetTimer,
  snapshots: propSnapshots,
  onTakeSnapshot: propTakeSnapshot,
  onRestoreSnapshot: propRestoreSnapshot,
  onDeleteSnapshot: propDeleteSnapshot,
  onDeleteAllSnapshots: propDeleteAllSnapshots,
  onInsertUnicode: propInsertUnicode,
  onSaveNow,
  onOpenSyncModal,
  onDismissAltKeytips,
  syncStatus = "idle",
  moreMenuOpen: propMoreMenuOpen,
  onToggleMoreMenu,
  drawerOpen: propDrawerOpen,
  onToggleDrawer,
}) => {
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title || "");
  const [copied, setCopied] = useState(false);

  // Sliding Drawer for all notebooks
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const drawerOpen = propDrawerOpen !== undefined ? propDrawerOpen : internalDrawerOpen;
  const setDrawerOpen = (updater) => {
    const next = typeof updater === "function" ? updater(drawerOpen) : updater;
    if (onToggleDrawer) onToggleDrawer(next);
    setInternalDrawerOpen(next);
  };
  const [drawerSearch, setDrawerSearch] = useState("");

  // More Options Menu (...)
  const [internalMoreMenuOpen, setInternalMoreMenuOpen] = useState(false);
  const moreMenuOpen = propMoreMenuOpen !== undefined ? propMoreMenuOpen : internalMoreMenuOpen;
  const showTopbarKeytips = altKeyActive && !moreMenuOpen;
  const setMoreMenuOpen = (updater) => {
    const next = typeof updater === "function" ? updater(moreMenuOpen) : updater;
    if (onToggleMoreMenu) onToggleMoreMenu(next);
    setInternalMoreMenuOpen(next);
  };
  const moreBtnRef = useRef(null);
  const moreMenuPortalRef = useRef(null);
  const moreMenuRef = useClickOutside(() => setMoreMenuOpen(false), [moreMenuPortalRef]);
  const moreMenuRect = useAnchoredRect(moreBtnRef, moreMenuOpen);

  // Fallback states for Timer
  const [internalTimerRunning, setInternalTimerRunning] = useState(false);
  const [internalElapsedMs, setInternalElapsedMs] = useState(0);
  const [timerOpen, setTimerOpen] = useState(false);

  const timerRunning = propTimerRunning !== undefined ? propTimerRunning : internalTimerRunning;
  const elapsedMs = propElapsedMs !== undefined ? propElapsedMs : internalElapsedMs;

  const handleToggleTimer = () => {
    if (propToggleTimer) propToggleTimer();
    else setInternalTimerRunning((v) => !v);
  };

  const handleResetTimer = () => {
    if (propResetTimer) propResetTimer();
    else {
      setInternalTimerRunning(false);
      setInternalElapsedMs(0);
    }
  };

  useEffect(() => {
    if (propTimerRunning !== undefined) return undefined;
    if (!internalTimerRunning) return undefined;
    const t = setInterval(() => {
      setInternalElapsedMs((ms) => ms + 1000);
    }, 1000);
    return () => clearInterval(t);
  }, [internalTimerRunning, propTimerRunning]);

  // Current Time Clock
  const [now, setNow] = useState(() => new Date());
  const [clockFormat, setClockFormat] = useState(loadClockFormat);
  const [clockMenuOpen, setClockMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLOCK_FORMAT_KEY, clockFormat);
    } catch {}
  }, [clockFormat]);

  // Snapshots
  const [snapshotsOpen, setSnapshotsOpen] = useState(false);
  const [internalSnapshots, setInternalSnapshots] = useState(() =>
    JSON.parse(localStorage.getItem("stiknexSnapshots") || "[]")
  );
  const snapshots = propSnapshots !== undefined ? propSnapshots : internalSnapshots;
  const [snapshotsSearch, setSnapshotsSearch] = useState("");
  const snapshotsPortalRef = useRef(null);

  // Special Characters / Emojis
  const [unicodeOpen, setUnicodeOpen] = useState(false);
  const [unicodeCategory, setUnicodeCategory] = useState("popular");
  const unicodeBtnRef = useRef(null);
  const unicodePortalRef = useRef(null);

  const handleInsertUnicode = (char) => {
    const ta = textareaRef && textareaRef.current;
    if (ta) {
      const start = typeof ta.selectionStart === "number" ? ta.selectionStart : (text || "").length;
      const end = typeof ta.selectionEnd === "number" ? ta.selectionEnd : start;
      const currentText = typeof text === "string" ? text : "";
      const newText = currentText.substring(0, start) + char + currentText.substring(end);
      setText(newText);
      const newCursor = start + char.length;
      setTimeout(() => {
        try {
          ta.focus();
          ta.setSelectionRange(newCursor, newCursor);
        } catch {}
      }, 0);
    } else {
      setText((prev) => (prev || "") + char);
    }
  };

  // Read aloud TTS
  const [internalIsReading, setInternalIsReading] = useState(false);
  const isReading = propIsReading !== undefined ? propIsReading : internalIsReading;

  const handleReadAloud = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      swal({
        title: "Not supported",
        text: "Your browser doesn't support Read Aloud.",
        icon: "warning",
      });
      return;
    }
    if (isReading) {
      window.speechSynthesis.cancel();
      setInternalIsReading(false);
      return;
    }
    if (!text || !text.trim()) {
      swal({
        title: "Nothing to read",
        text: "Your notebook is empty.",
        icon: "info",
      });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setInternalIsReading(false);
    utterance.onerror = () => setInternalIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setInternalIsReading(true);
  }, [isReading, text]);

  const triggerReadAloud = () => {
    if (onReadAloud) onReadAloud();
    else handleReadAloud();
  };

  // Full Keyboard Navigation for More Options Menu (...)
  useEffect(() => {
    if (!moreMenuOpen) return;

    // Auto-focus first menu item when menu opens
    const timer = setTimeout(() => {
      const firstItem = moreMenuPortalRef.current?.querySelector("button");
      if (firstItem) firstItem.focus();
    }, 40);

    const handleMenuKeyDown = (e) => {
      if (!moreMenuPortalRef.current) return;
      const items = Array.from(
        moreMenuPortalRef.current.querySelectorAll("button")
      );
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setMoreMenuOpen(false);
        moreBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + items.length) % items.length
          : (currentIndex + 1) % items.length;
        items[nextIndex].focus();
        return;
      }

      // Single-letter hotkeys inside open menu
      const letter = e.key.toLowerCase();
      const hotkeyMap = {
        q: () => { setMoreMenuOpen(false); onOpenSyncModal && onOpenSyncModal(); },
        f: () => { setMoreMenuOpen(false); onToggleSearch && onToggleSearch(); },
        d: () => { setMoreMenuOpen(false); onDownload && onDownload(); },
        c: () => { setMoreMenuOpen(false); onCopy && onCopy(); setCopied(true); setTimeout(() => setCopied(false), 1500); },
        h: () => { setMoreMenuOpen(false); setSnapshotsOpen(true); },
        s: () => { setMoreMenuOpen(false); onShare && onShare(); },
        x: () => { setMoreMenuOpen(false); onDelete && onDelete(); },
        p: () => { setMoreMenuOpen(false); onToggleAutoHideNavbar && onToggleAutoHideNavbar(); },
        z: () => { setMoreMenuOpen(false); onToggleZenMode && onToggleZenMode(); },
        e: () => { setMoreMenuOpen(false); setUnicodeOpen(true); },
        k: () => { setMoreMenuOpen(false); onOpenVirtualKeyboard && onOpenVirtualKeyboard(); },
        "/": () => { setMoreMenuOpen(false); setShortcutsOpen(true); },
        "?": () => { setMoreMenuOpen(false); setShortcutsOpen(true); },
        t: () => { setMoreMenuOpen(false); setTimerOpen(true); },
        o: () => { setMoreMenuOpen(false); setClockMenuOpen(true); },
        m: () => {
          setMoreMenuOpen(false);
          if (onDismissAltKeytips) onDismissAltKeytips();
          if (!musicOn && !(window.AudioContext || window.webkitAudioContext)) {
            swal({ title: "Not supported", text: "Your browser doesn't support Focus Sound.", icon: "warning" });
            return;
          }
          setMusicOn((v) => !v);
        },
        r: () => { setMoreMenuOpen(false); triggerReadAloud(); },
      };

      if (hotkeyMap[letter]) {
        e.preventDefault();
        hotkeyMap[letter]();
        if (letter !== "m" && onDismissAltKeytips) onDismissAltKeytips();
      }
    };

    window.addEventListener("keydown", handleMenuKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleMenuKeyDown);
    };
  }, [
    moreMenuOpen,
    onOpenSyncModal,
    onToggleSearch,
    onDownload,
    onCopy,
    onShare,
    onDelete,
    onToggleAutoHideNavbar,
    onToggleZenMode,
    onOpenVirtualKeyboard,
    onDismissAltKeytips,
    musicOn,
    setMusicOn,
    triggerReadAloud,
  ]);

  // Full Keyboard Navigation for Sliding Drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const handleDrawerKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleDrawerKeyDown);
    return () => window.removeEventListener("keydown", handleDrawerKeyDown);
  }, [drawerOpen]);

  // Keyboard shortcuts popup
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const shortcutsPortalRef = useRef(null);

  // Outside click & portal tracking
  const timerPortalRef = useRef(null);
  const clockPortalRef = useRef(null);
  const searchPortalRef = useRef(null);

  const timerRef = useClickOutside(() => setTimerOpen(false), [timerPortalRef]);
  const clockRef = useClickOutside(() => setClockMenuOpen(false), [clockPortalRef]);
  const shortcutsRef = useClickOutside(() => setShortcutsOpen(false), [shortcutsPortalRef]);
  const searchRef = useClickOutside(() => onSearchClose && onSearchClose(), [searchPortalRef]);
  const unicodeRef = useClickOutside(() => setUnicodeOpen(false), [unicodePortalRef]);

  const timerRect = useAnchoredRect(timerRef, timerOpen);
  const clockRect = useAnchoredRect(clockRef, clockMenuOpen);
  const searchRect = useAnchoredRect(searchRef, searchOpen);
  const shortcutsRect = useAnchoredRect(shortcutsRef, shortcutsOpen);
  const unicodeRect = useAnchoredRect(unicodeBtnRef, unicodeOpen);

  // Tooltips
  const [tooltip, setTooltip] = useState(null);
  const tooltipElRef = useRef(null);

  const showTooltipFor = (el) => {
    if (!el || !el.getAttribute("data-tip")) return;
    tooltipElRef.current = el;
    setTooltip({ text: el.getAttribute("data-tip"), rect: el.getBoundingClientRect() });
  };
  const hideTooltip = () => {
    tooltipElRef.current = null;
    setTooltip(null);
  };

  const handleTopbarMouseOver = (e) => {
    const el = e.target.closest("[data-tip]");
    if (el) showTooltipFor(el);
  };
  const handleTopbarMouseOut = (e) => {
    const el = e.target.closest("[data-tip]");
    if (el && !el.contains(e.relatedTarget)) hideTooltip();
  };
  const handleTopbarFocus = (e) => {
    const el = e.target.closest("[data-tip]");
    if (el) showTooltipFor(el);
  };
  const handleTopbarBlur = () => hideTooltip();

  const commitRename = () => {
    const trimmed = draftTitle.trim();
    if (trimmed) {
      if (setTitle) setTitle(trimmed);
      else if (onTitleChange) onTitleChange(trimmed);
    } else {
      setDraftTitle(title);
    }
    setRenaming(false);
  };

  const handleQuickSave = () => {
    if (onSaveNow) {
      onSaveNow();
    } else if (propTakeSnapshot) {
      propTakeSnapshot();
    }
    swal({
      title: "Saved",
      text: "All notebook changes have been saved to local storage.",
      icon: "success",
      timer: 1200,
      buttons: false,
    });
  };

  const filteredNotebooks = notebooks.filter(
    (nb) => !drawerSearch || (nb.title || "").toLowerCase().includes(drawerSearch.toLowerCase())
  );

  return (
    <header
      className={Style.topbar}
      onMouseOver={handleTopbarMouseOver}
      onMouseOut={handleTopbarMouseOut}
      onFocus={handleTopbarFocus}
      onBlur={handleTopbarBlur}
    >
      {/* ============================================================
          LEFT SECTION (Home, Notebooks Drawer, Title + Save Subtitle)
          ============================================================ */}
      <div className={Style.left}>
        {/* 1. Home Link */}
        <Link
          to="/"
          className={Style.iconBtn}
          data-tip="Back to Home"
          aria-label="Back to Home"
        >
          <i className="fa-solid fa-house"></i>
        </Link>

        {/* 2. Notebooks Drawer Toggle */}
        <button
          type="button"
          className={`${Style.iconBtn} ${drawerOpen ? Style.iconBtnActive : ""}`}
          onClick={() => setDrawerOpen((v) => !v)}
          data-tip="My Notebooks"
          aria-label="My Notebooks"
        >
          <i className="fa-solid fa-book-bookmark"></i>
          {showTopbarKeytips && <span className={Style.altKeytip}>N</span>}
        </button>

        {/* Vertical Divider */}
        <div className={Style.navDivider} />

        {/* 3. Title & Save Subtitle Stack */}
        <div className={Style.titleStack}>
          <div className={Style.titleRow}>
            {renaming ? (
              <input
                autoFocus
                className={Style.titleInput}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") {
                    setDraftTitle(title);
                    setRenaming(false);
                  }
                }}
              />
            ) : (
              <span
                className={Style.titleText}
                onClick={() => {
                  setDraftTitle(title);
                  setRenaming(true);
                }}
                data-tip="Click to rename notebook"
              >
                {title || "Stiknex Notebook"}
              </span>
            )}
          </div>

          <div className={Style.saveSubtitle}>
            {saveState === "saving" && (
              <span className={Style.saveSubtitleSaving}>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
              </span>
            )}
            {saveState === "saved" && (
              <span className={Style.saveSubtitleSaved}>
                <i className="fa-solid fa-check"></i> All changes saved
              </span>
            )}
            {saveState === "off" && (
              <span className={Style.saveSubtitleOff}>
                Autosave off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT SECTION (Undo, Redo, Quick Save, More ...)
          ============================================================ */}
      <div className={Style.right}>
        {/* Undo */}
        {onUndo && (
          <button
            type="button"
            className={Style.iconBtn}
            data-tip="Undo (Ctrl+Z)"
            aria-label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            style={{ opacity: canUndo ? 1 : 0.4 }}
          >
            <i className="fa-solid fa-rotate-left"></i>
          </button>
        )}

        {/* Redo */}
        {onRedo && (
          <button
            type="button"
            className={Style.iconBtn}
            data-tip="Redo (Ctrl+Y)"
            aria-label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            style={{ opacity: canRedo ? 1 : 0.4 }}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        )}

        {/* Quick Save */}
        <button
          type="button"
          className={Style.iconBtn}
          data-tip="Save now (Ctrl+S)"
          aria-label="Save now"
          onClick={handleQuickSave}
        >
          <i className="fa-solid fa-floppy-disk"></i>
          {showTopbarKeytips && <span className={Style.altKeytip}>Q</span>}
        </button>

        {/* Cloud Sync & QR Pairing */}
        <button
          type="button"
          className={Style.iconBtn}
          data-tip={
            syncStatus === "syncing"
              ? "Syncing with cloud..."
              : syncStatus === "synced"
              ? "Cloud Synced (Encrypted / Alt+Y)"
              : "Multi-Device Sync & QR Pairing (Alt+Y)"
          }
          aria-label="Cloud Sync"
          onClick={onOpenSyncModal}
          style={{ position: "relative" }}
        >
          <i
            className={`fa-solid ${
              syncStatus === "syncing"
                ? "fa-rotate fa-spin"
                : syncStatus === "synced"
                ? "fa-cloud-arrow-up"
                : "fa-cloud"
            }`}
            style={{
              color: syncStatus === "synced" ? "#22c55e" : syncStatus === "syncing" ? "#818cf8" : "inherit",
            }}
          ></i>
          {showTopbarKeytips && <span className={Style.altKeytip}>Y</span>}
        </button>

        {/* Notebook Settings Button directly on first navbar beside ... */}
        <button
          type="button"
          className={`${Style.iconBtn} ${settingsOpen ? Style.iconBtnActive : ""}`}
          data-tip="Notebook Settings (Ctrl+, / Alt+S)"
          aria-label="Notebook Settings"
          onClick={() => {
            if (onToggleSettings) onToggleSettings();
          }}
          style={{ position: "relative" }}
        >
          <i className="fa-solid fa-sliders"></i>
          {showTopbarKeytips && <span className={Style.altKeytip}>S</span>}
        </button>

        {/* More Options Menu (...) */}
        <div className={Style.popoverWrap} ref={moreMenuRef}>
          <button
            ref={moreBtnRef}
            type="button"
            className={`${Style.iconBtn} ${moreMenuOpen ? Style.iconBtnActive : ""}`}
            data-tip="More options (Alt+M)"
            aria-label="More options"
            onClick={() => setMoreMenuOpen((v) => !v)}
            style={{ position: "relative" }}
          >
            <i className="fa-solid fa-ellipsis"></i>
            {showTopbarKeytips && <span className={Style.altKeytip}>M</span>}
          </button>

          {moreMenuOpen &&
            moreMenuRect &&
            createPortal(
              <div
                ref={moreMenuPortalRef}
                className={Style.moreMenu}
                style={{
                  top: moreMenuRect.bottom + 8,
                  right: Math.max(8, window.innerWidth - moreMenuRect.right - 8),
                }}
              >
                {/* CATEGORY 1: NOTEBOOK & FILES */}
                <div className={Style.moreMenuSectionTitle}>Notebook & Files</div>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onOpenSyncModal) onOpenSyncModal();
                  }}
                >
                  <i className={`fa-solid fa-qrcode ${Style.moreMenuIcon}`} style={{ color: "#818cf8" }}></i>
                  <span>Connect Another Device</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "Q" : "QR Sync"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onToggleSearch) onToggleSearch();
                  }}
                >
                  <i className={`fa-solid fa-magnifying-glass ${Style.moreMenuIcon}`}></i>
                  <span>Find in Notes</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "F" : "Ctrl+F"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onDownload) onDownload();
                  }}
                >
                  <i className={`fa-solid fa-download ${Style.moreMenuIcon}`}></i>
                  <span>Download / Export</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "D" : "Ctrl+D"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onCopy) onCopy();
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"} ${Style.moreMenuIcon}`}></i>
                  <span>{copied ? "Copied!" : "Copy All Text"}</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "C" : "Ctrl+Shift+C"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setSnapshotsOpen(true);
                  }}
                >
                  <i className={`fa-solid fa-clock-rotate-left ${Style.moreMenuIcon}`}></i>
                  <span>Snapshots & History</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "H" : "Ctrl+Shift+H"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onShare) onShare();
                  }}
                >
                  <i className={`fa-solid fa-share-nodes ${Style.moreMenuIcon}`}></i>
                  <span>Share Notebook</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "S" : "Ctrl+Shift+S"}</span>
                </button>
                <button
                  type="button"
                  className={`${Style.moreMenuItem} ${Style.moreMenuItemDanger}`}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onDelete) onDelete();
                  }}
                >
                  <i className={`fa-solid fa-trash-can ${Style.moreMenuIcon}`}></i>
                  <span>Delete Notebook</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "X" : "Ctrl+Shift+X"}</span>
                </button>

                <div className={Style.moreMenuDivider} />

                {/* CATEGORY 2: WRITING & ENVIRONMENT */}
                <div className={Style.moreMenuSectionTitle}>Writing & Layout</div>
                {onToggleAutoHideNavbar && (
                  <button
                    type="button"
                    className={Style.moreMenuItem}
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onToggleAutoHideNavbar();
                    }}
                  >
                    <i
                      className={`fa-solid fa-thumbtack ${Style.moreMenuIcon}`}
                      style={{
                        transform: autoHideNavbar ? "rotate(45deg)" : "none",
                        color: autoHideNavbar ? "#818cf8" : undefined,
                      }}
                    ></i>
                    <span>{autoHideNavbar ? "Pin Formatting Bar" : "Auto-Hide Formatting Bar (10s)"}</span>
                    <span className={Style.moreMenuBadge}>{altKeyActive ? "P" : "Ctrl+Shift+P"}</span>
                  </button>
                )}
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (onToggleZenMode) onToggleZenMode();
                  }}
                >
                  <i className={`fa-solid fa-bullseye ${Style.moreMenuIcon}`}></i>
                  <span>Focus Mode (Zen)</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "Z" : "Ctrl+."}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setUnicodeOpen(true);
                  }}
                >
                  <span className={Style.moreMenuIcon} style={{ fontWeight: "700" }}>Ω</span>
                  <span>Insert Symbol / Emoji</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "E" : "Ctrl+Shift+E"}</span>
                </button>
                {onOpenVirtualKeyboard && (
                  <button
                    type="button"
                    className={Style.moreMenuItem}
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onOpenVirtualKeyboard();
                    }}
                  >
                    <i className={`fa-solid fa-keyboard ${Style.moreMenuIcon}`}></i>
                    <span>Virtual Keyboard</span>
                    <span className={Style.moreMenuBadge}>{altKeyActive ? "K" : "Ctrl+K"}</span>
                  </button>
                )}
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setShortcutsOpen(true);
                  }}
                >
                  <i className={`fa-solid fa-circle-question ${Style.moreMenuIcon}`}></i>
                  <span>Keyboard Shortcuts</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "?" : "Ctrl+/"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                >
                  <i className={`fa-solid fa-expand ${Style.moreMenuIcon}`}></i>
                  <span>Toggle Full Screen</span>
                  <span className={Style.moreMenuBadge}>F11</span>
                </button>

                <div className={Style.moreMenuDivider} />

                {/* CATEGORY 3: FOCUS TOOLS */}
                <div className={Style.moreMenuSectionTitle}>Focus Tools</div>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setTimerOpen(true);
                  }}
                >
                  <i className={`fa-solid fa-stopwatch ${Style.moreMenuIcon}`}></i>
                  <span>Stopwatch Timer</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "T" : "Ctrl+Shift+T"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setClockMenuOpen(true);
                  }}
                >
                  <i className={`fa-solid fa-clock ${Style.moreMenuIcon}`}></i>
                  <span>Digital Clock</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "O" : "Ctrl+Shift+O"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (!musicOn && !(window.AudioContext || window.webkitAudioContext)) {
                      swal({
                        title: "Not supported",
                        text: "Your browser doesn't support Focus Sound.",
                        icon: "warning",
                      });
                      return;
                    }
                    setMusicOn((v) => !v);
                  }}
                >
                  <i className={`fa-solid ${musicOn ? "fa-music" : "fa-volume-xmark"} ${Style.moreMenuIcon}`}></i>
                  <span>Focus Sound: {musicOn ? "ON" : "OFF"}</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "M" : "Ctrl+Shift+M"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    triggerReadAloud();
                  }}
                >
                  <i className={`fa-solid ${isReading ? "fa-stop" : "fa-volume-high"} ${Style.moreMenuIcon}`}></i>
                  <span>{isReading ? "Stop Reading" : "Read Aloud (TTS)"}</span>
                  <span className={Style.moreMenuBadge}>{altKeyActive ? "R" : "Ctrl+Shift+R"}</span>
                </button>
                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={async () => {
                    setMoreMenuOpen(false);
                    if ("documentPictureInPicture" in window) {
                      try {
                        const pipWindow = await window.documentPictureInPicture.requestWindow({
                          width: 500,
                          height: 600,
                        });
                        const style = pipWindow.document.createElement("style");
                        style.textContent = `
                          body { margin: 0; background: #2c2c33; display: flex; flex-direction: column; height: 100vh; }
                          textarea { flex: 1; background: transparent; color: #fff; border: none; outline: none; padding: 20px; font-size: 18px; font-family: sans-serif; resize: none; }
                        `;
                        pipWindow.document.head.appendChild(style);
                        const ta = pipWindow.document.createElement("textarea");
                        ta.value = text;
                        ta.placeholder = "Floating notes...";
                        ta.addEventListener("input", (e) => {
                          setText(e.target.value);
                        });
                        const syncInterval = setInterval(() => {
                          if (textareaRef.current && ta.value !== textareaRef.current.value) {
                            ta.value = textareaRef.current.value;
                          }
                        }, 500);
                        pipWindow.addEventListener("pagehide", () => {
                          clearInterval(syncInterval);
                        });
                        pipWindow.document.body.appendChild(ta);
                      } catch (e) {
                        console.error(e);
                      }
                    } else {
                      swal("Not Supported", "Picture-in-Picture is not supported in this browser.", "info");
                    }
                  }}
                >
                  <i className={`fa-regular fa-window-restore ${Style.moreMenuIcon}`}></i>
                  <span>Floating Window (PiP)</span>
                  <span className={Style.moreMenuBadge}>Ctrl+Shift+W</span>
                </button>

                {/* CATEGORY 4: MORE STIKNEX APPS & TOOLS */}
                <div className={Style.moreMenuDivider}></div>
                <div className={Style.moreMenuSectionTitle}>Apps & Tools</div>
                <Link
                  to="/sticky-notes"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-note-sticky ${Style.moreMenuIcon}`}></i>
                  <span>Sticky Notes</span>
                </Link>
                <Link
                  to="/whiteboard"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-chalkboard ${Style.moreMenuIcon}`}></i>
                  <span>Whiteboard</span>
                </Link>
                <Link
                  to="/tools"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-toolbox ${Style.moreMenuIcon}`}></i>
                  <span>Productivity Tools</span>
                </Link>
                <Link
                  to="/blog"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-newspaper ${Style.moreMenuIcon}`}></i>
                  <span>Blog & Articles</span>
                </Link>
                <Link
                  to="/buy-me-a-coffee"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-heart ${Style.moreMenuIcon}`}></i>
                  <span>Support Stiknex</span>
                </Link>

                <div className={Style.moreMenuDivider}></div>

                <button
                  type="button"
                  className={Style.moreMenuItem}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    window.dispatchEvent(new Event("stiknex_open_feedback"));
                  }}
                >
                  <i className={`fa-solid fa-message ${Style.moreMenuIcon}`}></i>
                  <span>Message & Feedback</span>
                </button>

                <Link
                  to="/about"
                  className={Style.moreMenuItem}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <i className={`fa-solid fa-circle-info ${Style.moreMenuIcon}`}></i>
                  <span>About Stiknex</span>
                </Link>
              </div>,
              document.body,
            )}
        </div>
      </div>

      {/* ============================================================
          SLIDING NOTEBOOKS DRAWER MODAL
          ============================================================ */}
      {drawerOpen &&
        createPortal(
          <div
            className={Style.drawerOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setDrawerOpen(false);
            }}
          >
            <div className={Style.drawer}>
              <div className={Style.drawerHeader}>
                <div className={Style.drawerTitle}>
                  <i className="fa-solid fa-book-bookmark" style={{ color: "#818cf8" }}></i>
                  <span>My Notebooks ({notebooks.length})</span>
                </div>
                <button
                  type="button"
                  className={Style.newNotebookBtn}
                  onClick={() => {
                    if (onNewNotebook) onNewNotebook();
                    setDrawerOpen(false);
                  }}
                >
                  <i className="fa-solid fa-plus"></i> New
                </button>
              </div>

              <div className={Style.drawerSearch}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search notebooks..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setDrawerOpen(false);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const first = e.currentTarget.closest(`.${Style.drawer}`)?.querySelector(`.${Style.drawerItem}`);
                      if (first) first.focus();
                    }
                  }}
                />
              </div>

              <div className={Style.drawerList}>
                {filteredNotebooks.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "2rem 1rem", fontSize: "13px" }}>
                    No notebooks found
                  </div>
                ) : (
                  filteredNotebooks.map((nb) => {
                    const isActive = nb.id === activeNotebookId;
                    return (
                      <div
                        key={nb.id}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open notebook ${nb.title || 'Stiknex Notebook'}`}
                        className={`${Style.drawerItem} ${isActive ? Style.drawerItemActive : ""}`}
                        onClick={() => {
                          if (onSwitchNotebook) onSwitchNotebook(nb.id);
                          setDrawerOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (onSwitchNotebook) onSwitchNotebook(nb.id);
                            setDrawerOpen(false);
                          } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            const next = e.currentTarget.nextElementSibling;
                            if (next && next.classList.contains(Style.drawerItem)) next.focus();
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            const prev = e.currentTarget.previousElementSibling;
                            if (prev && prev.classList.contains(Style.drawerItem)) prev.focus();
                            else e.currentTarget.closest(`.${Style.drawer}`)?.querySelector(`.${Style.drawerSearch} input`)?.focus();
                          } else if (e.key === "Escape") {
                            setDrawerOpen(false);
                          }
                        }}
                      >
                        <div className={Style.drawerItemInfo}>
                          <span className={Style.drawerItemTitle}>
                            <i className="fa-solid fa-file-lines" style={{ marginRight: "8px", opacity: 0.7 }}></i>
                            {nb.title || "Stiknex Notebook"}
                          </span>
                          <span className={Style.drawerItemMeta}>
                            {nb.updatedAt ? new Date(nb.updatedAt).toLocaleDateString() : "Just now"}
                          </span>
                        </div>
                        {notebooks.length > 1 && (
                          <button
                            type="button"
                            className={Style.drawerItemDelete}
                            title="Delete Notebook"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDeleteNotebook) onDeleteNotebook(nb.id);
                            }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ============================================================
          PORTAL OVERLAYS (Timer, Clock, Search, Shortcuts, Emojis, Snapshots)
          ============================================================ */}

      {/* Timer Popover */}
      {timerOpen &&
        timerRect &&
        createPortal(
          <div
            ref={timerPortalRef}
            className={Style.popover}
            style={{
              position: "fixed",
              top: timerRect.bottom + 10,
              right: window.innerWidth - timerRect.right - 8,
            }}
          >
            <span className={Style.clockTime}>{formatElapsed(elapsedMs)}</span>
            <div className={Style.timerControls}>
              <button
                type="button"
                className={Style.timerBtn}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
                onClick={handleToggleTimer}
              >
                <i className={`fa-solid ${timerRunning ? "fa-pause" : "fa-play"}`}></i>
                {timerRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                className={Style.timerBtn}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
                onClick={handleResetTimer}
              >
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Digital Clock Popover */}
      {clockMenuOpen &&
        clockRect &&
        createPortal(
          <div
            ref={clockPortalRef}
            className={`${Style.popover} ${Style.clockPopover}`}
            style={{
              position: "fixed",
              top: clockRect.bottom + 10,
              right: window.innerWidth - clockRect.right - 8,
            }}
          >
            <span className={Style.clockTime}>{formatClock(now, clockFormat)}</span>
            <div className={Style.clockFormatToggle}>
              <button
                type="button"
                className={`${Style.clockFormatOption} ${
                  clockFormat === "12" ? Style.clockFormatOptionActive : ""
                }`}
                onClick={() => setClockFormat("12")}
                aria-pressed={clockFormat === "12"}
              >
                12-Hour
              </button>
              <button
                type="button"
                className={`${Style.clockFormatOption} ${
                  clockFormat === "24" ? Style.clockFormatOptionActive : ""
                }`}
                onClick={() => setClockFormat("24")}
                aria-pressed={clockFormat === "24"}
              >
                24-Hour
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Search Popover */}
      {searchOpen &&
        searchRect &&
        createPortal(
          <div
            ref={searchPortalRef}
            className={`${Style.popover} ${Style.searchPopover}`}
            style={{
              position: "fixed",
              top: searchRect.bottom + 10,
              right: window.innerWidth - searchRect.right - 8,
            }}
          >
            <div className={Style.searchInputRow}>
              <input
                autoFocus
                type="text"
                className={Style.searchInput}
                placeholder="Search notebook…"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange && onSearchQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.shiftKey ? onSearchPrev && onSearchPrev() : onSearchNext && onSearchNext();
                  }
                  if (e.key === "Escape") onSearchClose && onSearchClose();
                }}
              />
              <button
                type="button"
                className={Style.searchCloseBtn}
                onClick={onSearchClose}
                aria-label="Close search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className={Style.searchStatusRow}>
              {searchQuery === "" ? (
                <span className={Style.searchStatus}>Type to search</span>
              ) : searchMatches.length === 0 ? (
                <span className={Style.searchStatus}>No matches</span>
              ) : (
                <span className={Style.searchStatus}>
                  {searchMatchIndex + 1} of {searchMatches.length}
                </span>
              )}

              <div className={Style.searchNavBtns}>
                <button
                  type="button"
                  className={Style.timerBtn}
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onClick={onSearchPrev}
                  disabled={searchMatches.length === 0}
                  aria-label="Previous match"
                >
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button
                  type="button"
                  className={Style.timerBtn}
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onClick={onSearchNext}
                  disabled={searchMatches.length === 0}
                  aria-label="Next match"
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Snapshots Modal */}
      {snapshotsOpen &&
        createPortal(
          <div
            className={Style.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSnapshotsOpen(false);
            }}
          >
            <div ref={snapshotsPortalRef} className={`${Style.snapshotsModal} ${darkMode ? Style.snapshotsModalDark : ""}`}>
              <div className={Style.snapshotsHeader}>
                <h3>Snapshots</h3>
                <button className={Style.snapshotsClose} onClick={() => setSnapshotsOpen(false)}>&times;</button>
              </div>
              <div className={Style.snapshotsToolbar}>
                <button
                  className={Style.snapshotsTakeBtn}
                  onClick={() => {
                    const newSnapshot = {
                      id: Date.now().toString(),
                      text: (textareaRef && textareaRef.current?.value) || text || "",
                      title: title || "Stiknex Notebook",
                      timestamp: Date.now(),
                    };
                    const newSnapshots = [newSnapshot, ...snapshots];
                    if (propTakeSnapshot) propTakeSnapshot();
                    else {
                      setInternalSnapshots(newSnapshots);
                      localStorage.setItem("stiknexSnapshots", JSON.stringify(newSnapshots));
                    }
                  }}
                >
                  + Take Snapshot
                </button>
                <input
                  type="text"
                  placeholder="Search snapshots..."
                  className={Style.snapshotsSearch}
                  value={snapshotsSearch}
                  onChange={(e) => setSnapshotsSearch(e.target.value)}
                />
              </div>
              <div className={Style.snapshotsList}>
                {snapshots
                  .filter(
                    (s) =>
                      s.text?.toLowerCase().includes(snapshotsSearch.toLowerCase()) ||
                      s.title?.toLowerCase().includes(snapshotsSearch.toLowerCase())
                  )
                  .map((snap) => (
                    <div key={snap.id} className={Style.snapshotItem}>
                      <div className={Style.snapshotInfo}>
                        <strong>{snap.title}</strong>
                        <p>{snap.text.slice(0, 100)}{snap.text.length > 100 ? "..." : ""}</p>
                        <small>{new Date(snap.timestamp).toLocaleString()}</small>
                      </div>
                      <div className={Style.snapshotActions}>
                        <button
                          title="Restore"
                          onClick={() => {
                            if (propRestoreSnapshot) propRestoreSnapshot(snap);
                            else setText(snap.text);
                            setSnapshotsOpen(false);
                          }}
                        >
                          <i className="fa-solid fa-rotate-left"></i>
                        </button>
                        <button
                          title="Copy"
                          onClick={() => {
                            navigator.clipboard.writeText(snap.text);
                            swal("Copied", "Snapshot text copied to clipboard", "success");
                          }}
                        >
                          <i className="fa-regular fa-copy"></i>
                        </button>
                        <button
                          title="Delete"
                          className={Style.deleteBtn}
                          onClick={() => {
                            if (propDeleteSnapshot) propDeleteSnapshot(snap.id);
                            else {
                              const newSnapshots = snapshots.filter((s) => s.id !== snap.id);
                              setInternalSnapshots(newSnapshots);
                              localStorage.setItem("stiknexSnapshots", JSON.stringify(newSnapshots));
                            }
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={Style.snapshotsFooter}>
                <span>{snapshots.length} snapshots</span>
                <div>
                  <button
                    className={Style.snapshotsDeleteAll}
                    onClick={() => {
                      if (propDeleteAllSnapshots) propDeleteAllSnapshots();
                      else {
                        setInternalSnapshots([]);
                        localStorage.setItem("stiknexSnapshots", "[]");
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash"></i> Delete All
                  </button>
                  <button className={Style.snapshotsCloseBtn} onClick={() => setSnapshotsOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Keyboard Shortcuts Popover */}
      {shortcutsOpen &&
        shortcutsRect &&
        createPortal(
          <div
            ref={shortcutsPortalRef}
            className={`${Style.popover} ${Style.shortcutsPopover}`}
            style={{
              position: "fixed",
              top: shortcutsRect.bottom + 10,
              right: window.innerWidth - shortcutsRect.right - 8,
            }}
          >
            {SHORTCUTS.map((s) => (
              <div key={s.keys} className={Style.shortcutRow}>
                <kbd>{s.keys}</kbd>
                <span>{s.action}</span>
              </div>
            ))}
          </div>,
          document.body,
        )}

      {/* Insert Unicode / Emojis Popover */}
      {unicodeOpen &&
        unicodeRect &&
        createPortal(
          <div
            ref={unicodePortalRef}
            className={`${Style.popover} ${Style.unicodePopover} ${darkMode ? Style.unicodePopoverDark : ""}`}
            style={{
              position: "fixed",
              top: unicodeRect.bottom + 10,
              right: Math.max(8, window.innerWidth - unicodeRect.right - 8),
            }}
          >
            <div className={Style.unicodeHeader}>
              <div className={Style.unicodeHeaderTitle}>
                <span className={Style.unicodeHeaderIcon}>Ω</span>
                <span>Symbols & Emojis</span>
              </div>
              <button
                type="button"
                className={Style.unicodeCloseBtn}
                onClick={() => setUnicodeOpen(false)}
                aria-label="Close symbols menu"
              >
                ✕
              </button>
            </div>

            <div className={Style.unicodeTabs}>
              {UNICODE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${Style.unicodeTabBtn} ${unicodeCategory === cat.id ? Style.unicodeTabBtnActive : ""}`}
                  onClick={() => setUnicodeCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={Style.unicodeGrid}>
              {(
                UNICODE_CATEGORIES.find((c) => c.id === unicodeCategory)?.chars ||
                UNICODE_CATEGORIES[0].chars
              ).map((char, i) => (
                <button
                  key={`${unicodeCategory}_${i}`}
                  type="button"
                  className={Style.unicodeCharBtn}
                  title={`Insert ${char}`}
                  onClick={() => {
                    if (propInsertUnicode) propInsertUnicode(char);
                    else handleInsertUnicode(char);
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {/* Tooltip Bubble */}
      {tooltip &&
        createPortal(
          <div
            className={`${Style.tooltipBubble} ${!darkMode ? Style.tooltipBubbleLight : ""}`}
            style={{
              position: "fixed",
              top: tooltip.rect.bottom + 8,
              left: tooltip.rect.left + tooltip.rect.width / 2,
            }}
          >
            {tooltip.text}
          </div>,
          document.body,
        )}
    </header>
  );
};

export default NotebookTopbar;
