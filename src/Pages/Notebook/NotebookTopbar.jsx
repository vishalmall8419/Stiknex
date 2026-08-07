import { useEffect, useRef, useState } from "react";
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

// Current Time — 12h / 24h format preference, persisted the same
// way other Notebook prefs are (a plain localStorage key).
const CLOCK_FORMAT_KEY = "notebookClockFormat";

// No saved preference yet → default to whatever format the user's
// own browser/locale normally uses for the time.
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
  } catch {
    /* localStorage unavailable — fall back to system default */
  }
  return getSystemClockFormat();
};

// `extraRefs` lets a portaled overlay (rendered outside `ref`'s DOM
// subtree, e.g. via createPortal to document.body) still count as
// "inside" for outside-click detection.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOutside, ...extraRefs]);
  return ref;
};

// The topbar scrolls horizontally (overflow-x: auto), which per the
// CSS spec forces overflow-y to compute to `auto` as well — so any
// dropdown/popover/tooltip rendered *inside* the topbar gets clipped
// by that scroll container, even though it's only meant to scroll
// sideways. This hook tracks a trigger element's live viewport rect
// so its overlay can instead be rendered in a portal (outside the
// clipping container) and positioned to match exactly where it would
// have appeared, updating as the topbar/page scrolls or resizes.
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
    // capture: true so this also catches scroll events from the
    // topbar's own internal horizontal scroll container.
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
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const suffix = hours24 >= 12 ? "PM" : "AM";
    return `${pad(hours12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${suffix}`;
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const NotebookTopbar = ({
  darkMode,
  toggleDarkMode,
  title,
  onTitleChange,
  onDelete,
  onDownload,
  onCopy,
  copied,
  onShare,
  settingsOpen,
  onToggleSettings,
  isZenMode,
  onToggleZenMode,
  wordCount,
  charCount,
  text,
  notebooks,
  activeNotebookId,
  onNewNotebook,
  onSwitchNotebook,
  onOpenVirtualKeyboard,
  searchOpen,
  onToggleSearch,
  searchQuery,
  onSearchQueryChange,
  searchMatches,
  searchMatchIndex,
  onSearchNext,
  onSearchPrev,
  onSearchClose,
}) => {
  const [titleMenuOpen, setTitleMenuOpen] = useState(false);
  const [notebookListOpen, setNotebookListOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const focusSoundRef = useRef(null);

  // Timer (was: live clock popover)
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerStartRef = useRef(null);

  // Current Time — a separate, always-ticking compact digital clock.
  // Independent of the Timer above; never replaces it.
  const [now, setNow] = useState(() => new Date());
  const [clockFormat, setClockFormat] = useState(loadClockFormat);
  const [clockMenuOpen, setClockMenuOpen] = useState(false);

  // Read aloud
  const [isReading, setIsReading] = useState(false);

  // Refs on the portaled overlay content itself, so outside-click
  // detection still treats clicks inside the (now portaled) menu /
  // popovers as "inside" even though they're no longer DOM
  // descendants of the trigger wrapper.
  const titleMenuPortalRef = useRef(null);
  const timerPortalRef = useRef(null);
  const clockPortalRef = useRef(null);
  const searchPortalRef = useRef(null);
  const shortcutsPortalRef = useRef(null);

  const titleMenuRef = useClickOutside(() => {
    setTitleMenuOpen(false);
    setNotebookListOpen(false);
  }, [titleMenuPortalRef]);
  const timerRef = useClickOutside(() => setTimerOpen(false), [timerPortalRef]);
  const clockRef = useClickOutside(() => setClockMenuOpen(false), [clockPortalRef]);
  const shortcutsRef = useClickOutside(
    () => setShortcutsOpen(false),
    [shortcutsPortalRef],
  );
  const searchRef = useClickOutside(() => onSearchClose(), [searchPortalRef]);

  // Live viewport rects for each trigger, used to position the
  // portaled overlays so they land exactly where the old in-flow
  // absolutely-positioned versions used to.
  const titleMenuRect = useAnchoredRect(titleMenuRef, titleMenuOpen);
  const timerRect = useAnchoredRect(timerRef, timerOpen);
  const clockRect = useAnchoredRect(clockRef, clockMenuOpen);
  const searchRect = useAnchoredRect(searchRef, searchOpen);
  const shortcutsRect = useAnchoredRect(shortcutsRef, shortcutsOpen);

  // Tooltips were pure-CSS (::after on hover), which meant they were
  // clipped by the same topbar scroll container. They're now driven
  // from JS (delegated hover/focus on the topbar) and rendered in a
  // portal, positioned from the hovered trigger's live rect.
  const [tooltip, setTooltip] = useState(null); // { text, rect }
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

  useEffect(() => {
    if (!tooltip) return undefined;
    const update = () => {
      if (tooltipElRef.current) {
        setTooltip((t) => t && { ...t, rect: tooltipElRef.current.getBoundingClientRect() });
      }
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltip !== null]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    timerStartRef.current = Date.now() - elapsedMs;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - timerStartRef.current);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLOCK_FORMAT_KEY, clockFormat);
    } catch {
      /* localStorage unavailable — preference just won't persist */
    }
  }, [clockFormat]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Focus sound — a soft, generated ambient noise bed (no external
  // audio files needed). Starts/stops with the toolbar toggle and is
  // always torn down on unmount so it never keeps playing in the background.
  useEffect(() => {
    if (!musicOn) {
      if (focusSoundRef.current) {
        focusSoundRef.current.stop();
        focusSoundRef.current = null;
      }
      return undefined;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    // Brown noise: smoother/softer than white noise, better for focus.
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;

    const gain = ctx.createGain();
    gain.gain.value = 0.06;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    focusSoundRef.current = {
      stop: () => {
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
        ctx.close();
      },
    };

    return () => {
      if (focusSoundRef.current) {
        focusSoundRef.current.stop();
        focusSoundRef.current = null;
      }
    };
  }, [musicOn]);

  const handleReadAloud = () => {
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
      setIsReading(false);
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
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const toggleTimer = () => setTimerRunning((v) => !v);
  const resetTimer = () => {
    setTimerRunning(false);
    setElapsedMs(0);
  };

  const commitRename = () => {
    const next = draftTitle.trim() || "Stiknex Notebook";
    onTitleChange(next);
    setRenaming(false);
  };

  return (
    <div
      className={Style.topbar}
      onMouseOver={handleTopbarMouseOver}
      onMouseOut={handleTopbarMouseOut}
      onFocus={handleTopbarFocus}
      onBlur={handleTopbarBlur}
    >
      <div className={Style.left}>
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
          <span className={Style.title} onDoubleClick={() => setRenaming(true)}>
            {title}
          </span>
        )}

        <div className={Style.titleMenuWrap} ref={titleMenuRef}>
          <button
            type="button"
            className={Style.iconBtn}
            onClick={() => setTitleMenuOpen((v) => !v)}
            aria-label="Notebook menu"
            data-tip="Notebook menu"
          >
            <i className="fa-solid fa-chevron-down"></i>
          </button>

          {titleMenuOpen &&
            titleMenuRect &&
            createPortal(
              <div
                ref={titleMenuPortalRef}
                className={Style.titleMenu}
                style={{
                  position: "fixed",
                  top: titleMenuRect.bottom + 10,
                  left: titleMenuRect.left,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setDraftTitle(title);
                    setRenaming(true);
                    setTitleMenuOpen(false);
                  }}
                >
                  <i className="fa-solid fa-pen"></i> Rename
                </button>

                <button
                  type="button"
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onClick={() => {
                    onNewNotebook();
                    setTitleMenuOpen(false);
                  }}
                >
                  <i className="fa-solid fa-plus"></i> New Notebook
                </button>

                <button
                  type="button"
                  onClick={() => setNotebookListOpen((v) => !v)}
                >
                  <i
                    className={`fa-solid fa-chevron-${
                      notebookListOpen ? "up" : "down"
                    }`}
                  ></i>
                  Existing Notebooks
                </button>

                {notebookListOpen && (
                  <div className={Style.notebookList}>
                    {notebooks.map((nb) => (
                      <button
                        type="button"
                        key={nb.id}
                        className={`${Style.notebookListItem} ${
                          nb.id === activeNotebookId
                            ? Style.notebookListItemActive
                            : ""
                        }`}
                        onClick={() => {
                          onSwitchNotebook(nb.id);
                          setTitleMenuOpen(false);
                          setNotebookListOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-book"></i>
                        <span>{nb.title || "Stiknex Notebook"}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className={Style.titleMenuStats}>
                  {wordCount} words · {charCount} characters
                </div>
              </div>,
              document.body,
            )}
        </div>
      </div>

      <div className={Style.toolGroup}>
        <button
          type="button"
          className={Style.iconBtn}
          data-tip="Delete"
          onClick={onDelete}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>

        <button
          type="button"
          className={Style.iconBtn}
          data-tip="Download"
          onClick={onDownload}
        >
          <i className="fa-solid fa-download"></i>
        </button>

        <button
          type="button"
          className={Style.iconBtn}
          data-tip={copied ? "Copied!" : "Copy"}
          onClick={onCopy}
        >
          <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
        </button>

        <button
          type="button"
          className={`${Style.iconBtn} ${settingsOpen ? Style.iconBtnActive : ""}`}
          data-tip="Notebook Settings"
          onClick={onToggleSettings}
        >
          <i className="fa-solid fa-sliders"></i>
        </button>

        <button
          type="button"
          className={`${Style.iconBtn} ${musicOn ? Style.iconBtnActive : ""}`}
          data-tip={musicOn ? "Focus sound: on" : "Focus sound: off"}
          onClick={() => {
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
          <i className={`fa-solid ${musicOn ? "fa-music" : "fa-volume-xmark"}`}></i>
        </button>

        <button
          type="button"
          className={`${Style.iconBtn} ${isReading ? Style.iconBtnActive : ""}`}
          data-tip={isReading ? "Stop Reading" : "Read Aloud"}
          onClick={handleReadAloud}
        >
          <i className={`fa-solid ${isReading ? "fa-stop" : "fa-volume-high"}`}></i>
        </button>

        <div className={Style.popoverWrap} ref={timerRef}>
          <button
            type="button"
            className={`${Style.iconBtn} ${timerOpen ? Style.iconBtnActive : ""}`}
            data-tip="Timer"
            onClick={() => setTimerOpen((v) => !v)}
          >
            <i className="fa-solid fa-stopwatch"></i>
          </button>
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
                    onClick={toggleTimer}
                  >
                    <i className={`fa-solid ${timerRunning ? "fa-pause" : "fa-play"}`}></i>
                    {timerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    type="button"
                    className={Style.timerBtn}
                    onMouseEnter={onBtnEnter}
                    onMouseLeave={onBtnLeave}
                    onClick={resetTimer}
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset
                  </button>
                </div>
              </div>,
              document.body,
            )}
        </div>

        <div className={Style.popoverWrap} ref={clockRef}>
          <button
            type="button"
            className={`${Style.iconBtn} ${Style.clockBtn} ${
              clockMenuOpen ? Style.iconBtnActive : ""
            }`}
            data-tip="Current Time"
            aria-label="Current time"
            onClick={() => setClockMenuOpen((v) => !v)}
          >
            <i className="fa-solid fa-clock"></i>
            <span className={Style.clockBtnTime}>{formatClock(now, clockFormat)}</span>
          </button>
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
        </div>

        <div className={Style.popoverWrap} ref={searchRef}>
          <button
            type="button"
            className={`${Style.iconBtn} ${searchOpen ? Style.iconBtnActive : ""}`}
            data-tip="Search"
            onClick={onToggleSearch}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
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
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.shiftKey ? onSearchPrev() : onSearchNext();
                      }
                      if (e.key === "Escape") onSearchClose();
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
        </div>

        <button
          type="button"
          className={Style.iconBtn}
          data-tip="Share"
          onClick={onShare}
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>

      <div className={Style.right}>
        <button
          type="button"
          className={Style.iconBtn}
          data-tip={darkMode ? "Light mode" : "Dark mode"}
          onClick={toggleDarkMode}
        >
          <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        <button
          type="button"
          className={Style.iconBtn}
          data-tip={isZenMode ? "Exit Fullscreen" : "Fullscreen"}
          onClick={onToggleZenMode}
        >
          <i className={`fa-solid ${isZenMode ? "fa-compress" : "fa-expand"}`}></i>
        </button>

        <button
          type="button"
          className={Style.iconBtn}
          data-tip="Virtual Keyboard"
          onClick={onOpenVirtualKeyboard}
        >
          <i className="fa-solid fa-keyboard"></i>
        </button>

        <div className={Style.popoverWrap} ref={shortcutsRef}>
          <button
            type="button"
            className={`${Style.iconBtn} ${shortcutsOpen ? Style.iconBtnActive : ""}`}
            data-tip="Keyboard Shortcuts"
            onClick={() => setShortcutsOpen((v) => !v)}
          >
            <i className="fa-solid fa-circle-question"></i>
          </button>
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
        </div>

        <Link to="/about" className={Style.iconBtn} data-tip="About">
          <i className="fa-solid fa-circle-info"></i>
        </Link>
      </div>

      {tooltip &&
        createPortal(
          <div
            className={`${Style.tooltipBubble} ${
              !darkMode ? Style.tooltipBubbleLight : ""
            }`}
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
    </div>
  );
};

export default NotebookTopbar;