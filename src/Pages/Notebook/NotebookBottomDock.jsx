import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import swal from "sweetalert";
import Style from "./NotebookBottomDock.module.css";
import { UNICODE_CATEGORIES, formatElapsed } from "./useNotebookTools";

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

  const isNotebookActive =
    location.pathname === "/online-notebook" || location.pathname === "/notebook";

  const anySheetOpen =
    isMenuOpen || notebooksSheetOpen || snapshotsSheetOpen || unicodeSheetOpen;

  return (
    <>
      {/* Dimmed backdrop when any sheet or drawer is open */}
      {anySheetOpen && (
        <div
          className={Style.overlayBackdrop}
          onClick={closeAllSheets}
          aria-hidden="true"
        />
      )}

      <div
        className={`${Style.dockWrapper} ${darkMode ? Style.darkDock : ""}`}
        role="navigation"
        aria-label="Mobile application navigation"
      >
        {/* ============================================================
            1. FLOATING NAVIGATION CAPSULE (PILL)
            ============================================================ */}
        <nav className={Style.navPill}>
          {/* Home */}
          <Link
            to="/"
            className={`${Style.tabItem} ${
              location.pathname === "/" ? Style.activeTab : ""
            }`}
            title="Home"
            aria-label="Home"
          >
            <i className={`fa-solid fa-house ${Style.tabIcon}`}></i>
            <span className={Style.tabLabel}>Home</span>
          </Link>

          {/* Notebooks List Switcher */}
          <button
            type="button"
            className={`${Style.tabItem} ${
              isNotebookActive ? Style.activeTab : ""
            }`}
            onClick={() => {
              const next = !notebooksSheetOpen;
              closeAllSheets();
              setNotebooksSheetOpen(next);
            }}
            title="Notebooks"
            aria-label="Notebooks"
          >
            <i className={`fa-solid fa-book-bookmark ${Style.tabIcon}`}></i>
            <span className={Style.tabLabel}>Notes</span>
          </button>

          {/* Whiteboard */}
          <Link
            to="/whiteboard"
            className={`${Style.tabItem} ${
              location.pathname === "/whiteboard" ? Style.activeTab : ""
            }`}
            title="Whiteboard"
            aria-label="Whiteboard"
          >
            <i className={`fa-solid fa-pen-nib ${Style.tabIcon}`}></i>
            <span className={Style.tabLabel}>Board</span>
          </Link>

          {/* Tools */}
          <Link
            to="/tools"
            className={`${Style.tabItem} ${
              location.pathname === "/tools" ? Style.activeTab : ""
            }`}
            title="Tools"
            aria-label="Tools"
          >
            <i className={`fa-solid fa-toolbox ${Style.tabIcon}`}></i>
            <span className={Style.tabLabel}>Tools</span>
          </Link>
        </nav>

        {/* ============================================================
            2. FLOATING ACTION BUTTON (CIRCULAR FAB '+')
            ============================================================ */}
        <button
          type="button"
          className={`${Style.fabBtn} ${isMenuOpen ? Style.fabActive : ""}`}
          onClick={() => {
            const next = !isMenuOpen;
            closeAllSheets();
            setIsMenuOpen(next);
          }}
          title={isMenuOpen ? "Close menu" : "Open Actions & Tools"}
          aria-label={isMenuOpen ? "Close menu" : "Open Actions & Tools"}
        >
          <span className={Style.fabIcon}>
            <i className="fa-solid fa-plus"></i>
          </span>
        </button>

        {/* ============================================================
            3. MAIN SPEED-DIAL ACTION SHEET (ALL NAVBAR TOOLS)
            ============================================================ */}
        {isMenuOpen && (
          <div className={Style.actionSheet}>
            <div className={Style.sheetHandle} />

            <div className={Style.sheetHeader}>
              <div className={Style.sheetHeaderTitle}>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Quick Actions & Tools</span>
              </div>
              <button
                type="button"
                className={Style.sheetCloseBtn}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={Style.sheetContent}>
              {/* --- HERO: + NEW NOTEPAD (PROMINENT CALLOUT) --- */}
              <button
                type="button"
                className={Style.heroNewBtn}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onNewNotebook) onNewNotebook();
                }}
              >
                <div className={Style.heroNewIcon}>
                  <i className="fa-solid fa-plus"></i>
                </div>
                <div className={Style.heroNewText}>
                  <strong>+ New Notepad</strong>
                  <span>Create a brand new empty note</span>
                </div>
                <i className={`fa-solid fa-arrow-right ${Style.heroNewArrow}`}></i>
              </button>

              {/* Cloud Sync & QR Pairing (Mobile) */}
              {onOpenSyncModal && (
                <button
                  type="button"
                  className={Style.heroNewBtn}
                  style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    marginTop: "8px",
                  }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSyncModal();
                  }}
                >
                  <div
                    className={Style.heroNewIcon}
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                    }}
                  >
                    <i
                      className={`fa-solid ${
                        syncStatus === "syncing"
                          ? "fa-rotate fa-spin"
                          : syncStatus === "synced"
                          ? "fa-cloud-arrow-up"
                          : "fa-cloud"
                      }`}
                    ></i>
                  </div>
                  <div className={Style.heroNewText}>
                    <strong>Cloud Sync & QR Connect</strong>
                    <span>
                      {syncStatus === "synced"
                        ? "Notes Synced (AES-256-GCM)"
                        : syncStatus === "syncing"
                        ? "Syncing notes with cloud..."
                        : "Connect phone / second device"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: syncStatus === "synced" ? "#22c55e" : "#818cf8",
                      background: "rgba(255, 255, 255, 0.08)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      marginLeft: "auto",
                    }}
                  >
                    {syncStatus === "synced" ? "Synced" : "Connect"}
                  </span>
                </button>
              )}

              {/* Search in Note */}
              {onToggleSearch && (
                <button
                  type="button"
                  className={Style.searchBarTrigger}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleSearch();
                  }}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Search in Note...</span>
                  <span className={Style.searchShortcutBadge}>Find</span>
                </button>
              )}

              {/* --- SECTION 2: AUDIO & FOCUS SUITE --- */}
              <div className={Style.sectionTitle}>Audio & Focus Suite</div>
              <div className={Style.focusRow}>
                {/* Focus Sound */}
                <button
                  type="button"
                  className={`${Style.toolCard} ${musicOn ? Style.cardActive : ""}`}
                  onClick={() => {
                    if (toggleMusic) toggleMusic();
                  }}
                >
                  <div className={Style.toolCardLeft}>
                    <span
                      className={`${Style.gridIcon} ${
                        musicOn ? Style.activeSoundIcon : Style.purpleIcon
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          musicOn ? "fa-music" : "fa-volume-xmark"
                        }`}
                      ></i>
                    </span>
                    <div className={Style.toolCardText}>
                      <strong>Focus Sound</strong>
                      <small>{musicOn ? "Ambient Brown Noise (Active)" : "Soft soothing background"}</small>
                    </div>
                  </div>
                  <span className={`${Style.statusBadge} ${musicOn ? Style.badgeActive : ""}`}>
                    {musicOn ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Read Aloud */}
                <button
                  type="button"
                  className={`${Style.toolCard} ${isReading ? Style.cardActive : ""}`}
                  onClick={() => {
                    if (handleReadAloud) handleReadAloud();
                  }}
                >
                  <div className={Style.toolCardLeft}>
                    <span
                      className={`${Style.gridIcon} ${
                        isReading ? Style.activeSoundIcon : Style.roseIcon
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          isReading ? "fa-stop" : "fa-volume-high"
                        }`}
                      ></i>
                    </span>
                    <div className={Style.toolCardText}>
                      <strong>Read Aloud</strong>
                      <small>{isReading ? "Speaking note text..." : "Text-to-speech reader"}</small>
                    </div>
                  </div>
                  <span className={`${Style.statusBadge} ${isReading ? Style.badgeActive : ""}`}>
                    {isReading ? "Stop" : "Read"}
                  </span>
                </button>

                {/* Focus Timer / Stopwatch */}
                <div className={Style.timerCard}>
                  <div className={Style.toolCardLeft}>
                    <span className={`${Style.gridIcon} ${Style.amberIcon}`}>
                      <i className="fa-solid fa-stopwatch"></i>
                    </span>
                    <div className={Style.toolCardText}>
                      <strong>Focus Timer</strong>
                      <span className={Style.liveTimerText}>
                        {formatElapsed(elapsedMs)}
                      </span>
                    </div>
                  </div>
                  <div className={Style.timerActions}>
                    <button
                      type="button"
                      className={Style.timerActionBtn}
                      onClick={toggleTimer}
                      title={timerRunning ? "Pause" : "Start"}
                    >
                      <i
                        className={`fa-solid ${
                          timerRunning ? "fa-pause" : "fa-play"
                        }`}
                      ></i>
                    </button>
                    <button
                      type="button"
                      className={Style.timerActionBtn}
                      onClick={resetTimer}
                      title="Reset timer"
                    >
                      <i className="fa-solid fa-rotate-left"></i>
                    </button>
                  </div>
                </div>

                {/* Zen Mode */}
                {onToggleZenMode && (
                  <button
                    type="button"
                    className={Style.toolCard}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleZenMode();
                    }}
                  >
                    <div className={Style.toolCardLeft}>
                      <span className={`${Style.gridIcon} ${Style.tealIcon}`}>
                        <i className="fa-solid fa-bullseye"></i>
                      </span>
                      <div className={Style.toolCardText}>
                        <strong>Distraction-Free Mode</strong>
                        <small>Full-screen clean writing view</small>
                      </div>
                    </div>
                    <i className="fa-solid fa-expand" style={{ color: "#9ca3af" }}></i>
                  </button>
                )}
              </div>

              {/* --- SECTION 3: REVISIONS & SYMBOLS --- */}
              <div className={Style.sectionTitle}>Revisions & Characters</div>
              <div className={Style.actionList}>
                {/* Snapshots */}
                <button
                  type="button"
                  className={Style.actionRow}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSnapshotsSheetOpen(true);
                  }}
                >
                  <div className={Style.actionRowLeft}>
                    <span className={`${Style.gridIcon} ${Style.cyanIcon}`}>
                      <i className="fa-solid fa-clock-rotate-left"></i>
                    </span>
                    <span>Note Snapshots History</span>
                  </div>
                  <span className={Style.actionCountBadge}>
                    {snapshots ? snapshots.length : 0}
                  </span>
                </button>

                {/* Symbols & Emojis */}
                <button
                  type="button"
                  className={Style.actionRow}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setUnicodeSheetOpen(true);
                  }}
                >
                  <div className={Style.actionRowLeft}>
                    <span className={`${Style.gridIcon} ${Style.purpleIcon}`}>
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>Ω</span>
                    </span>
                    <span>Symbols & Emojis (Unicode)</span>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: "#9ca3af", fontSize: "12px" }}></i>
                </button>
              </div>

              {/* --- SECTION 4: FILE MANAGEMENT & ACTIONS --- */}
              <div className={Style.sectionTitle}>Manage & Export</div>
              <div className={Style.actionList}>
                {/* Copy All Text */}
                {onCopyNote && (
                  <button
                    type="button"
                    className={Style.actionRow}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onCopyNote();
                    }}
                  >
                    <div className={Style.actionRowLeft}>
                      <span className={`${Style.gridIcon} ${Style.blueIcon}`}>
                        <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
                      </span>
                      <span>{copied ? "Copied to Clipboard!" : "Copy All Note Text"}</span>
                    </div>
                  </button>
                )}

                {/* Download Note */}
                {onDownloadNote && (
                  <button
                    type="button"
                    className={Style.actionRow}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDownloadNote();
                    }}
                  >
                    <div className={Style.actionRowLeft}>
                      <span className={`${Style.gridIcon} ${Style.greenIcon}`}>
                        <i className="fa-solid fa-download"></i>
                      </span>
                      <span>Download Note (.txt)</span>
                    </div>
                  </button>
                )}

                {/* Share Note */}
                {onShareNote && (
                  <button
                    type="button"
                    className={Style.actionRow}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onShareNote();
                    }}
                  >
                    <div className={Style.actionRowLeft}>
                      <span className={`${Style.gridIcon} ${Style.indigoIcon}`}>
                        <i className="fa-solid fa-share-nodes"></i>
                      </span>
                      <span>Share Note</span>
                    </div>
                  </button>
                )}

                {/* Settings & Fonts */}
                {onToggleSettings && (
                  <button
                    type="button"
                    className={Style.actionRow}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleSettings();
                    }}
                  >
                    <div className={Style.actionRowLeft}>
                      <span className={`${Style.gridIcon} ${Style.roseIcon}`}>
                        <i className="fa-solid fa-sliders"></i>
                      </span>
                      <span>Settings & Fonts (Inter, Caveat, etc.)</span>
                    </div>
                  </button>
                )}

                {/* Clear Note */}
                {onDeleteNote && (
                  <button
                    type="button"
                    className={`${Style.actionRow} ${Style.dangerRow}`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteNote();
                    }}
                  >
                    <div className={Style.actionRowLeft}>
                      <span className={`${Style.gridIcon} ${Style.dangerIcon}`}>
                        <i className="fa-solid fa-trash-can"></i>
                      </span>
                      <span>Clear Note Content</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Stats Footer */}
              <div className={Style.sheetStatsFooter}>
                <span>{charCount} characters</span>
                <span>•</span>
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{readingTime}m read</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            4. SAVED NOTEBOOKS SWITCHER SHEET
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
            5. SNAPSHOTS HISTORY SHEET
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
            6. SYMBOLS & EMOJIS (UNICODE) SHEET
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
      </div>
    </>
  );
};

export default NotebookBottomDock;
