import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import swal from "sweetalert";
import {
  Home,
  BookOpen,
  PenTool,
  Wrench,
  Sparkles,
  Menu as MenuIcon,
  Plus,
  Cloud,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Clock,
  History,
  FileDown,
  Share2,
  Sliders,
  Trash2,
  Sun,
  Moon,
  Copy,
  Check,
  X,
  AudioLines
} from "lucide-react";
import Style from "./NotebookBottomDock.module.css";
import { UNICODE_CATEGORIES, formatElapsed } from "./useNotebookTools";

/**
 * NotebookBottomDock
 * 
 * Redesigned for Notepad to strictly match Reference Image (media_1795076702617_a5a584fa.png):
 * - Unified morphing active capsule dock: Active tab ("Notes") expands into an obsidian/dark rounded pill with icon + label.
 * - Inactive tabs ("Home", "Board", "Tools", "Menu") show clean outline icons.
 * - Clicking "Menu" pops up the elevated Action Sheet directly above the dock (media_1795076702616_dfecb02e.png)
 *   tailored specifically for Notepad (+ New Note, Saved Notes, Zen Mode, Search, Snapshots, Symbols, Focus Audio, Download, Theme).
 * - Strictly phone-only (hidden on desktop screens >= 768px, visible on mobile <= 768px).
 */
const NotebookBottomDock = ({
  darkMode,
  toggleDarkMode,
  onOpenSyncModal,
  syncStatus = "idle",
  isZenMode,
  onToggleZenMode,
  settingsOpen,
  onToggleSettings,
  wordCount = 0,
  charCount = 0,
  readingTime = 1,
  saveState,
  isPenMode,
  onTogglePenMode,
  onInsertImage,
  onToggleTodo,
  notebooks = [],
  activeNotebookId,
  onNewNotebook,
  onSwitchNotebook,
  onDeleteNotebook,
  onDeleteNote,
  onCopyNote,
  copied,
  onDownloadNote,
  onShareNote,
  searchOpen,
  onToggleSearch,
  musicOn,
  toggleMusic,
  isReading,
  handleReadAloud,
  timerRunning,
  elapsedMs = 0,
  toggleTimer,
  resetTimer,
  snapshots = [],
  takeSnapshot,
  restoreSnapshot,
  deleteSnapshot,
  deleteAllSnapshots,
  handleInsertUnicode,
}) => {
  const location = useLocation();

  // Panels & sub-sheets state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notebooksSheetOpen, setNotebooksSheetOpen] = useState(false);
  const [snapshotsSheetOpen, setSnapshotsSheetOpen] = useState(false);
  const [unicodeSheetOpen, setUnicodeSheetOpen] = useState(false);
  const [unicodeCategory, setUnicodeCategory] = useState("popular");
  const [snapshotsSearch, setSnapshotsSearch] = useState("");

  const closeAllSheets = () => {
    setIsMenuOpen(false);
    setNotebooksSheetOpen(false);
    setSnapshotsSheetOpen(false);
    setUnicodeSheetOpen(false);
  };

  // Close menus when entering zen mode or drawing mode
  useEffect(() => {
    if (isZenMode || isPenMode) {
      closeAllSheets();
    }
  }, [isZenMode, isPenMode]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeAllSheets();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isZenMode || isPenMode || settingsOpen) return null;

  const isFullDrawerOpen =
    notebooksSheetOpen || snapshotsSheetOpen || unicodeSheetOpen;

  return (
    <>
      {/* Dimmed backdrop ONLY when a full drawer/sheet (Notebooks, Snapshots, Symbols) is open */}
      <AnimatePresence>
        {isFullDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={Style.overlayBackdrop}
            onClick={closeAllSheets}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Invisible tap-to-dismiss layer when Menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Bottom Dock Container - Strictly Mobile (< 768px: md:hidden) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none md:hidden"
        style={{ bottom: "max(14px, env(safe-area-inset-bottom, 14px))" }}
        role="navigation"
        aria-label="Notepad mobile navigation"
      >
        {/* ============================================================
            SLEEK ELEVATED QUICK ACTIONS CAPSULE (TAILORED FOR NOTEPAD)
            Matches Reference Image & UniversalMobileBottomNav
            ============================================================ */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="mb-3 p-2 sm:p-2.5 rounded-3xl bg-[#18202F]/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/10 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center gap-1.5 sm:gap-2 pointer-events-auto max-w-[94vw] overflow-x-auto no-scrollbar"
            >
              {/* 1. New Note */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onNewNotebook) onNewNotebook();
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="Create New Note"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-300">New</span>
              </button>

              {/* 2. My Notes */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setNotebooksSheetOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="My Saved Notes"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-300">Notes</span>
              </button>

              {/* 3. Zen Mode */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onToggleZenMode) onToggleZenMode();
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="Zen Focus Mode"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Maximize2 size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-300">Zen</span>
              </button>

              {/* 4. Find in Note */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onToggleSearch) onToggleSearch();
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="Search in Note"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-300">Find</span>
              </button>

              {/* 5. Focus Audio */}
              <button
                type="button"
                onClick={() => {
                  if (toggleMusic) toggleMusic();
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="Focus Ambient Audio"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${musicOn ? "bg-emerald-500/25 text-emerald-300" : "bg-white/10 text-slate-300"} group-hover:scale-110 transition-transform`}>
                  <AudioLines size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-300">{musicOn ? "Audio ON" : "Audio"}</span>
              </button>

              {/* 6. Theme Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (toggleDarkMode) toggleDarkMode();
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-white/10 text-white transition-all cursor-pointer shrink-0 group"
                title="Toggle Theme"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-300">{darkMode ? "Light" : "Dark"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================
            UNIFIED BOTTOM BAR DOCK (MORPHING CAPSULE PILL)
            Strictly matches Reference Image (media_1795076702617_a5a584fa.png)
            ============================================================ */}
        <nav
          className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_45px_rgba(15,23,42,0.15)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
          role="navigation"
          aria-label="Notepad mobile navigation"
        >
          {/* 1. Home */}
          <Link
            to="/"
            className="p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Home"
            aria-label="Home"
          >
            <Home size={18} className="shrink-0 stroke-[2.2]" />
          </Link>

          {/* 2. Notes (ACTIVE TAB ON NOTEPAD PAGE) */}
          <button
            type="button"
            onClick={() => {
              if (isMenuOpen) {
                setIsMenuOpen(false);
              } else {
                setNotebooksSheetOpen(true);
              }
            }}
            className={`relative flex items-center select-none transition-all cursor-pointer ${
              !isMenuOpen
                ? "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white dark:text-slate-900 font-bold text-xs sm:text-sm gap-2"
                : "p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
            title="Notes (Active) - Tap to switch notebooks"
            aria-label="Notes"
          >
            {!isMenuOpen && (
              <motion.div
                layoutId="activeNotebookBottomPill"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-[#18202F] dark:bg-white rounded-full -z-10 shadow-md"
              />
            )}
            <BookOpen size={18} className="shrink-0 stroke-[2.2]" />
            {!isMenuOpen && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="whitespace-nowrap tracking-tight"
              >
                Notes
              </motion.span>
            )}
          </button>

          {/* 3. Whiteboard */}
          <Link
            to="/whiteboard"
            className="p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Whiteboard"
            aria-label="Whiteboard"
          >
            <PenTool size={18} className="shrink-0 stroke-[2.2]" />
          </Link>

          {/* 4. Tools */}
          <Link
            to="/tools"
            className="p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Tools"
            aria-label="Tools"
          >
            <Wrench size={18} className="shrink-0 stroke-[2.2]" />
          </Link>

          {/* 5. Menu / Tools trigger */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setNotebooksSheetOpen(false);
              setSnapshotsSheetOpen(false);
              setUnicodeSheetOpen(false);
            }}
            className={`relative flex items-center select-none transition-all cursor-pointer ${
              isMenuOpen
                ? "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white dark:text-slate-900 font-bold text-xs sm:text-sm gap-2"
                : "p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
            title="Notepad Quick Tools"
            aria-label="Notepad Quick Tools"
          >
            {isMenuOpen && (
              <motion.div
                layoutId="activeNotebookBottomPill"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-[#18202F] dark:bg-white rounded-full -z-10 shadow-md"
              />
            )}
            {isMenuOpen ? (
              <X size={18} className="shrink-0 stroke-[2.2]" />
            ) : (
              <MenuIcon size={18} className="shrink-0 stroke-[2.2]" />
            )}
            {isMenuOpen && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="whitespace-nowrap tracking-tight"
              >
                Menu
              </motion.span>
            )}
          </button>
        </nav>
      </div>

      {/* ============================================================
          SAVED NOTEBOOKS SWITCHER SHEET
          ============================================================ */}
      {notebooksSheetOpen && (
        <div className={Style.drawerSheet}>
          <div className={Style.sheetHandle} />
          <div className={Style.drawerHeader}>
            <div className={Style.sheetHeaderTitle}>
              <i className="fa-solid fa-book-bookmark"></i>
              <span className={Style.drawerTitle}>Saved Notebooks</span>
            </div>
            <button
              type="button"
              className={Style.drawerClose}
              onClick={() => setNotebooksSheetOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Top Prominent + New Notebook Button */}
          <div className={Style.drawerTopAction}>
            <button
              type="button"
              className={Style.drawerNewBtn}
              onClick={() => {
                setNotebooksSheetOpen(false);
                if (onNewNotebook) onNewNotebook();
              }}
            >
              <i className="fa-solid fa-plus"></i> + New Notebook
            </button>
          </div>

          <div className={Style.drawerList}>
            {notebooks && notebooks.length > 0 ? (
              notebooks.map((nb) => {
                const isActive = nb.id === activeNotebookId;
                return (
                  <div
                    key={nb.id}
                    className={`${Style.drawerItemRow} ${
                      isActive ? Style.activeDrawerRow : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={Style.drawerItemSelect}
                      onClick={() => {
                        if (onSwitchNotebook) onSwitchNotebook(nb.id);
                        setNotebooksSheetOpen(false);
                      }}
                    >
                      <i className="fa-solid fa-book"></i>
                      <span className={Style.drawerItemTitle}>
                        {nb.title || "Untitled Notebook"}
                      </span>
                      {isActive && (
                        <span className={Style.activeCheckPill}>Active</span>
                      )}
                    </button>

                    {onDeleteNotebook && (
                      <button
                        type="button"
                        className={Style.drawerItemDelete}
                        title={`Delete ${nb.title || "notebook"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          swal({
                            title: "Delete notebook?",
                            text: `Are you sure you want to delete "${nb.title || "Untitled"}"?`,
                            icon: "warning",
                            buttons: ["Cancel", "Delete"],
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {
                              onDeleteNotebook(nb.id);
                            }
                          });
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={Style.emptyStateText}>
                No saved notebooks found.
              </div>
            )}
          </div>

          <div className={Style.drawerFooter}>
            <span className={Style.drawerCountText}>
              {notebooks.length} total saved notes
            </span>
          </div>
        </div>
      )}

      {/* ============================================================
          SNAPSHOTS HISTORY SHEET
          ============================================================ */}
      {snapshotsSheetOpen && (
        <div className={Style.drawerSheet}>
          <div className={Style.sheetHandle} />
          <div className={Style.drawerHeader}>
            <div className={Style.sheetHeaderTitle}>
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span className={Style.drawerTitle}>Snapshots History</span>
            </div>
            <button
              type="button"
              className={Style.drawerClose}
              onClick={() => setSnapshotsSheetOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className={Style.snapshotsToolbar}>
            <button
              type="button"
              className={Style.takeSnapshotBtn}
              onClick={() => {
                if (takeSnapshot) takeSnapshot();
              }}
            >
              <i className="fa-solid fa-camera"></i> + Take Snapshot
            </button>
            <input
              type="text"
              placeholder="Search snapshots..."
              className={Style.snapshotsSearchInput}
              value={snapshotsSearch}
              onChange={(e) => setSnapshotsSearch(e.target.value)}
            />
          </div>

          <div className={Style.drawerList}>
            {snapshots && snapshots.length > 0 ? (
              snapshots
                .filter(
                  (s) =>
                    s.text?.toLowerCase().includes(snapshotsSearch.toLowerCase()) ||
                    s.title?.toLowerCase().includes(snapshotsSearch.toLowerCase())
                )
                .map((snap) => (
                  <div key={snap.id} className={Style.snapshotItem}>
                    <div className={Style.snapshotInfo}>
                      <strong>{snap.title || "Stiknex Note"}</strong>
                      <p>
                        {snap.text.slice(0, 90)}
                        {snap.text.length > 90 ? "..." : ""}
                      </p>
                      <small>{new Date(snap.timestamp).toLocaleString()}</small>
                    </div>
                    <div className={Style.snapshotActions}>
                      <button
                        type="button"
                        title="Restore"
                        className={Style.snapActionBtn}
                        onClick={() => {
                          if (restoreSnapshot) restoreSnapshot(snap.text);
                          setSnapshotsSheetOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-rotate-left"></i>
                      </button>
                      <button
                        type="button"
                        title="Copy"
                        className={Style.snapActionBtn}
                        onClick={() => {
                          navigator.clipboard.writeText(snap.text);
                          swal("Copied", "Snapshot text copied to clipboard", "success");
                        }}
                      >
                        <i className="fa-regular fa-copy"></i>
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        className={`${Style.snapActionBtn} ${Style.dangerIcon}`}
                        onClick={() => {
                          if (deleteSnapshot) deleteSnapshot(snap.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className={Style.emptyStateText}>
                No snapshots taken yet. Tap "+ Take Snapshot" above to save the current note version.
              </div>
            )}
          </div>

          <div className={Style.drawerFooter}>
            <span className={Style.drawerCountText}>
              {snapshots.length} snapshots saved
            </span>
            {snapshots.length > 0 && (
              <button
                type="button"
                className={Style.dangerTextBtn}
                onClick={() => {
                  swal({
                    title: "Delete all snapshots?",
                    text: "This cannot be undone.",
                    icon: "warning",
                    buttons: ["Cancel", "Delete All"],
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete && deleteAllSnapshots) {
                      deleteAllSnapshots();
                    }
                  });
                }}
              >
                <i className="fa-solid fa-trash"></i> Delete All
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          SYMBOLS & EMOJIS (UNICODE) SHEET
          ============================================================ */}
      {unicodeSheetOpen && (
        <div className={Style.drawerSheet}>
          <div className={Style.sheetHandle} />
          <div className={Style.drawerHeader}>
            <div className={Style.sheetHeaderTitle}>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>Ω</span>
              <span className={Style.drawerTitle}>Insert Symbol / Emoji</span>
            </div>
            <button
              type="button"
              className={Style.drawerClose}
              onClick={() => setUnicodeSheetOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Category Tabs */}
          <div className={Style.unicodeTabs}>
            {UNICODE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${Style.unicodeTabBtn} ${
                  unicodeCategory === cat.id ? Style.unicodeTabBtnActive : ""
                }`}
                onClick={() => setUnicodeCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Unicode Grid */}
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
                  if (handleInsertUnicode) handleInsertUnicode(char);
                }}
              >
                {char}
              </button>
            ))}
          </div>

          <div className={Style.drawerFooter}>
            <span className={Style.drawerCountText}>
              Tap any symbol to insert into note
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default NotebookBottomDock;
