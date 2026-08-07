import { useEffect, useMemo, useRef, useState } from "react";
import swal from "sweetalert";
import Layout from "../../Component/Layout/Layout";
import NotebookTopbar from "./NotebookTopbar";
import NotebookSettingsPanel from "./NotebookSettingsPanel";
import VirtualKeyboard from "./VirtualKeyboard";
import PageSEO from "../../Component/SEO/PageSEO";
import Style from "./Notebook.module.css";

const TEXT_KEY = "notebookContent";
const TITLE_KEY = "notebookTitle";
const SETTINGS_KEY = "notebookSettings";
const NOTEBOOKS_KEY = "stiknexNotebooks";
const ACTIVE_NOTEBOOK_KEY = "stiknexActiveNotebookId";
const DEFAULT_NOTEBOOK_TITLE = "Stiknex Notebook";

const genId = () =>
  `nb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const nextNotebookTitle = (existing) =>
  existing.length === 0
    ? DEFAULT_NOTEBOOK_TITLE
    : `${DEFAULT_NOTEBOOK_TITLE} ${existing.length + 1}`;

// Loads the notebook list, migrating older single-notebook storage
// (notebookContent / notebookTitle) into the new list the first time.
const loadNotebooks = () => {
  try {
    const raw = localStorage.getItem(NOTEBOOKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* fall through to migration */
  }

  const legacyText = localStorage.getItem(TEXT_KEY) || "";
  const legacyTitle = localStorage.getItem(TITLE_KEY);

  const migrated = [
    {
      id: genId(),
      title:
        !legacyTitle || legacyTitle === "Untitled Notebook"
          ? DEFAULT_NOTEBOOK_TITLE
          : legacyTitle,
      content: legacyText,
      updatedAt: Date.now(),
    },
  ];

  // Persist immediately so repeated calls (across the several lazy
  // useState initializers below) resolve to the same notebook ids.
  localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(migrated));
  return migrated;
};

// Resolves { list, active } from storage without needing a ref,
// so it's safe to call from multiple lazy useState initializers.
const resolveActiveNotebook = () => {
  const list = loadNotebooks();
  const savedActiveId = localStorage.getItem(ACTIVE_NOTEBOOK_KEY);
  const active = list.find((nb) => nb.id === savedActiveId) || list[0];
  return { list, active };
};

const FONT_FAMILIES = {
  poppins: "'Poppins', sans-serif",
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  nunito: "'Nunito', sans-serif",
  caveat: "'Caveat', cursive",
  kalam: "'Kalam', cursive",
  patrick: "'Patrick Hand', cursive",
};

const FONT_SIZES = { small: 15, medium: 19, large: 23, xlarge: 28 };
const WRITING_WIDTHS = { narrow: 640, medium: 820, wide: 1100 };
const LINE_HEIGHTS = { compact: 1.5, comfortable: 1.85, spacious: 2.25 };

const DEFAULT_SETTINGS = {
  fontFamily: "caveat",
  fontSize: "medium",
  writingWidth: "medium",
  lineHeight: "comfortable",
  wordWrap: true,
  autoSave: true,
  showStats: true,
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const countWords = (text) => {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
};

// Finds every case-insensitive occurrence of `query` in `text`.
// Used for search highlighting only — never mutates content or
// touches the textarea's selection/cursor.
const findMatches = (text, query) => {
  if (!query) return [];
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  const results = [];
  let from = 0;
  while (true) {
    const idx = t.indexOf(q, from);
    if (idx === -1) break;
    results.push({ start: idx, end: idx + q.length });
    from = idx + q.length;
  }
  return results;
};

const Notebook = () => {
  const [notebooks, setNotebooks] = useState(
    () => resolveActiveNotebook().list,
  );
  const [activeNotebookId, setActiveNotebookId] = useState(
    () => resolveActiveNotebook().active.id,
  );
  const [text, setText] = useState(
    () => resolveActiveNotebook().active.content || "",
  );
  const [title, setTitle] = useState(
    () => resolveActiveNotebook().active.title || DEFAULT_NOTEBOOK_TITLE,
  );
  const [settings, setSettings] = useState(loadSettings);
  const [isZenMode, setIsZenMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const [virtualKeyboardOpen, setVirtualKeyboardOpen] = useState(false);

  // Search — lifted here (rather than kept inside the topbar) so the
  // matches can be painted onto a highlight layer behind the textarea
  // without ever touching the textarea's real selection/cursor.
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);

  const textareaRef = useRef(null);
  const highlightLayerRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_NOTEBOOK_KEY, activeNotebookId);
  }, [activeNotebookId]);

  useEffect(() => {
    localStorage.setItem(TITLE_KEY, title);
  }, [title]);

  const updateTitle = (newTitle) => {
    setTitle(newTitle);
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId ? { ...nb, title: newTitle } : nb,
      ),
    );
  };

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!settings.autoSave) {
      setSaveState("off");
      return;
    }
    setSaveState("saving");
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(TEXT_KEY, text);
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === activeNotebookId
            ? { ...nb, content: text, updatedAt: Date.now() }
            : nb,
        ),
      );
      setSaveState("saved");
    }, 400);
    return () => clearTimeout(saveTimeoutRef.current);
  }, [text, settings.autoSave, activeNotebookId]);

  const persistActiveContent = (nextText, extra = {}) => {
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId
          ? { ...nb, content: nextText, updatedAt: Date.now(), ...extra }
          : nb,
      ),
    );
  };

  const handleNewNotebook = () => {
    const newNotebook = {
      id: genId(),
      title: nextNotebookTitle(notebooks),
      content: "",
      updatedAt: Date.now(),
    };
    setNotebooks((prev) => [newNotebook, ...prev]);
    setActiveNotebookId(newNotebook.id);
    setText("");
    setTitle(newNotebook.title);
  };

  const handleSwitchNotebook = (id) => {
    if (id === activeNotebookId) return;
    const target = notebooks.find((nb) => nb.id === id);
    if (!target) return;
    setActiveNotebookId(id);
    setText(target.content || "");
    setTitle(target.title || DEFAULT_NOTEBOOK_TITLE);
  };

  const handleDeleteNotebook = (id) => {
    const target = notebooks.find((nb) => nb.id === id);
    if (!target) return;

    swal({
      title: "Delete Notebook?",
      text: `"${
        target.title || DEFAULT_NOTEBOOK_TITLE
      }" will be permanently deleted. This can't be undone.`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) return;

      const remaining = notebooks.filter((nb) => nb.id !== id);
      const wasActive = id === activeNotebookId;

      if (remaining.length === 0) {
        // Never leave the notebook with nothing to show — spin up a
        // fresh default notebook in its place.
        const fresh = {
          id: genId(),
          title: DEFAULT_NOTEBOOK_TITLE,
          content: "",
          updatedAt: Date.now(),
        };
        setNotebooks([fresh]);
        setActiveNotebookId(fresh.id);
        setText("");
        setTitle(fresh.title);
        return;
      }

      setNotebooks(remaining);
      if (wasActive) {
        const next = remaining[0];
        setActiveNotebookId(next.id);
        setText(next.content || "");
        setTitle(next.title || DEFAULT_NOTEBOOK_TITLE);
      }
    });
  };

  useEffect(() => {
    document.body.style.overflow = isZenMode ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isZenMode]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleManualSave = () => {
    localStorage.setItem(TEXT_KEY, text);
    persistActiveContent(text);
    setSaveState("saved");
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      swal({
        title: "Copy failed",
        text: "Your browser blocked clipboard access.",
        icon: "warning",
      });
    }
  };

  const handleDelete = () => {
    if (!text) return;
    swal({
      title: "Clear Notebook?",
      text: "Everything you've written here will be permanently erased.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willClear) => {
      if (willClear) {
        setText("");
        localStorage.setItem(TEXT_KEY, "");
        persistActiveContent("");
        swal({
          title: "Cleared!",
          text: "Your notebook is empty now.",
          icon: "success",
        });
      }
    });
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.trim() || "notebook"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${title} — Stiknex Notebook`,
      text: text.slice(0, 200) || "Check out Stiknex — a free sticky notes & writing app.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        return;
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        swal({
          title: "Link copied",
          text: "The notebook link has been copied to your clipboard.",
          icon: "success",
        });
      } catch {
        swal({
          title: "Share unavailable",
          text: "Your browser does not support sharing or clipboard access.",
          icon: "info",
        });
      }
    }
  };

  const toggleZenMode = () => setIsZenMode((v) => !v);

  const searchMatches = useMemo(
    () => findMatches(text, searchQuery),
    [text, searchQuery],
  );

  // Typing into the search box must NEVER move the caret or steal
  // focus from wherever the user was writing — it only recomputes
  // which ranges get highlighted.
  const handleSearchQueryChange = (value) => {
    setSearchQuery(value);
    setSearchMatchIndex(0);
  };

  const handleSearchNext = () => {
    if (searchMatches.length === 0) return;
    setSearchMatchIndex((i) => (i + 1) % searchMatches.length);
  };

  const handleSearchPrev = () => {
    if (searchMatches.length === 0) return;
    setSearchMatchIndex((i) => (i - 1 + searchMatches.length) % searchMatches.length);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchMatchIndex(0);
  };

  const handleToggleSearch = () => setSearchOpen((v) => !v);

  // Scrolls the current match into view — scrollTop only, never
  // selection/focus — so the user's typing position is preserved.
  useEffect(() => {
    if (!searchOpen || searchMatches.length === 0) return;
    const m = searchMatches[searchMatchIndex];
    const ta = textareaRef.current;
    if (!m || !ta) return;
    const before = text.slice(0, m.start);
    const lineNumber = before.split("\n").length - 1;
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 24;
    const nextScrollTop = Math.max(
      0,
      lineNumber * lineHeight - ta.clientHeight / 2,
    );
    ta.scrollTop = nextScrollTop;
    if (highlightLayerRef.current) {
      highlightLayerRef.current.scrollTop = nextScrollTop;
      highlightLayerRef.current.scrollLeft = ta.scrollLeft;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMatchIndex, searchMatches, searchOpen]);

  const handleEditorScroll = () => {
    const ta = textareaRef.current;
    const layer = highlightLayerRef.current;
    if (!ta || !layer) return;
    layer.scrollTop = ta.scrollTop;
    layer.scrollLeft = ta.scrollLeft;
  };

  // Builds the mirrored content for the highlight layer: plain text
  // with matched ranges wrapped in <mark>. This is display-only and
  // is never written back into the notebook content.
  const renderHighlightedText = () => {
    if (searchMatches.length === 0) return text;
    const segments = [];
    let cursor = 0;
    searchMatches.forEach((m, i) => {
      if (m.start > cursor) segments.push(text.slice(cursor, m.start));
      segments.push(
        <mark
          key={`match-${m.start}`}
          className={
            i === searchMatchIndex ? Style.searchMatchActive : Style.searchMatch
          }
        >
          {text.slice(m.start, m.end)}
        </mark>,
      );
      cursor = m.end;
    });
    if (cursor < text.length) segments.push(text.slice(cursor));
    return segments;
  };

  const handleOpenVirtualKeyboard = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(
      navigator.userAgent,
    );
    if (isMobile) {
      textareaRef.current?.focus();
      return;
    }
    if (typeof navigator !== "undefined" && "virtualKeyboard" in navigator) {
      try {
        navigator.virtualKeyboard.overlaysContent = true;
        navigator.virtualKeyboard.show();
        textareaRef.current?.focus();
        return;
      } catch {
        // fall through to the in-app fallback keyboard
      }
    }
    setVirtualKeyboardOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const meta = e.ctrlKey || e.metaKey;

      if (e.key === "Escape") {
        if (isZenMode) setIsZenMode(false);
        if (settingsOpen) setSettingsOpen(false);
        if (searchOpen) handleSearchClose();
        return;
      }

      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleManualSave();
      } else if (meta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDownload();
      } else if (meta && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      } else if (meta && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewNotebook();
      } else if (meta && e.key === ".") {
        e.preventDefault();
        toggleZenMode();
      } else if (meta && e.key === ",") {
        e.preventDefault();
        setSettingsOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const charCount = text.length;
  const wordCount = countWords(text);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const fontSizePx = FONT_SIZES[settings.fontSize];
  const lineHeightMultiplier = LINE_HEIGHTS[settings.lineHeight];
  const lineHeightPx = Math.round(fontSizePx * lineHeightMultiplier);
  const writingWidthPx = WRITING_WIDTHS[settings.writingWidth];

  const editorVars = useMemo(
    () => ({
      "--nb-font-family": FONT_FAMILIES[settings.fontFamily],
      "--nb-font-size": `${fontSizePx}px`,
      "--nb-line-height": `${lineHeightPx}px`,
      "--nb-writing-width": `${writingWidthPx}px`,
    }),
    [settings.fontFamily, fontSizePx, lineHeightPx, writingWidthPx],
  );

  return (
    <Layout hideNavbar hideSidebar hideCoffeeButton={isZenMode}>
      {(darkMode, toggleDarkMode) => (
        <div
          className={`${Style.notebookPage} ${
            darkMode ? Style.darkNotebookPage : ""
          } ${isZenMode ? Style.zenMode : ""}`}
        >
          <PageSEO
            title="Notebook — Distraction-Free Writing"
            description="A clean, minimal notebook for journaling, essays, and longer writing. Auto-saves locally as you type — no account needed."
            path="/notebook"
          />

          {!isZenMode && (
            <NotebookTopbar
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              title={title}
              onTitleChange={updateTitle}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onCopy={handleCopy}
              copied={copied}
              onShare={handleShare}
              settingsOpen={settingsOpen}
              onToggleSettings={() => setSettingsOpen((v) => !v)}
              isZenMode={isZenMode}
              onToggleZenMode={toggleZenMode}
              wordCount={wordCount}
              charCount={charCount}
              text={text}
              setText={setText}
              textareaRef={textareaRef}
              notebooks={notebooks}
              activeNotebookId={activeNotebookId}
              onNewNotebook={handleNewNotebook}
              onSwitchNotebook={handleSwitchNotebook}
              onDeleteNotebook={handleDeleteNotebook}
              onOpenVirtualKeyboard={handleOpenVirtualKeyboard}
              searchOpen={searchOpen}
              onToggleSearch={handleToggleSearch}
              searchQuery={searchQuery}
              onSearchQueryChange={handleSearchQueryChange}
              searchMatches={searchMatches}
              searchMatchIndex={searchMatchIndex}
              onSearchNext={handleSearchNext}
              onSearchPrev={handleSearchPrev}
              onSearchClose={handleSearchClose}
            />
          )}

          <div
            className={`${Style.paperArea} ${
              darkMode ? Style.darkPaperArea : ""
            }`}
            style={editorVars}
          >
            <div className={Style.paperColumn}>
              <div className={Style.marginLine}></div>
              <div className={Style.editorWrap}>
                {searchOpen && searchQuery !== "" && (
                  <div
                    ref={highlightLayerRef}
                    className={`${Style.editorHighlightLayer} ${
                      darkMode ? Style.darkEditorHighlightLayer : ""
                    }`}
                    style={{
                      whiteSpace: settings.wordWrap ? "pre-wrap" : "pre",
                      overflowX: settings.wordWrap ? "hidden" : "auto",
                    }}
                    aria-hidden="true"
                  >
                    {renderHighlightedText()}
                    {text.endsWith("\n") ? " " : null}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  className={Style.editor}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onScroll={handleEditorScroll}
                  placeholder="Start writing…"
                  spellCheck={true}
                  autoFocus={isZenMode}
                  wrap={settings.wordWrap ? "soft" : "off"}
                  style={{
                    whiteSpace: settings.wordWrap ? "pre-wrap" : "pre",
                    overflowX: settings.wordWrap ? "hidden" : "auto",
                  }}
                />
              </div>
            </div>
          </div>

          {!isZenMode && (
            <div
              className={`${Style.statusPill} ${
                darkMode ? Style.darkStatusPill : ""
              }`}
            >
              {settings.showStats && (
                <>
                  <span>{charCount} chars</span>
                  <span className={Style.dot}>•</span>
                  <span>{wordCount} words</span>
                  <span className={Style.dot}>•</span>
                </>
              )}
              <span>{readingTime} min read</span>
              {settings.showStats && (
                <>
                  <span className={Style.dot}>•</span>
                  <span className={Style.saveIndicator}>
                    {saveState === "saving" && (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i> Saving
                      </>
                    )}
                    {saveState === "saved" && (
                      <>
                        <i className="fa-solid fa-check"></i> Saved
                      </>
                    )}
                    {saveState === "off" && (
                      <>
                        <i className="fa-solid fa-pause"></i> Autosave off
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          )}

          {isZenMode && (
            <button
              type="button"
              className={`${Style.zenExit} ${
                darkMode ? Style.darkZenExit : ""
              }`}
              onClick={toggleZenMode}
              title="Exit distraction-free mode (Esc)"
              aria-label="Exit distraction-free mode"
            >
              <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
            </button>
          )}

          {settingsOpen && (
            <NotebookSettingsPanel
              darkMode={darkMode}
              settings={settings}
              onChange={updateSetting}
              onClose={() => setSettingsOpen(false)}
              toggleDarkMode={toggleDarkMode}
            />
          )}

          {virtualKeyboardOpen && (
            <VirtualKeyboard
              darkMode={darkMode}
              text={text}
              setText={setText}
              textareaRef={textareaRef}
              onClose={() => setVirtualKeyboardOpen(false)}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default Notebook;