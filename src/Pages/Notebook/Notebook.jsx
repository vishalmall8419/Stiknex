import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";
import gsap from "gsap";
import NotebookTopbar from "./NotebookTopbar";
import NotebookBottomDock from "./NotebookBottomDock";
import { useNotebookTools } from "./useNotebookTools";
import NotebookSettingsPanel from "./NotebookSettingsPanel";
import VirtualKeyboard from "./VirtualKeyboard";
import RichTextToolbar from "./RichTextToolbar";
import NotebookContextMenu from "./NotebookContextMenu";
import ImageResizeOverlay from "./ImageResizeOverlay";
import NotebookDrawingCanvas from "./NotebookDrawingCanvas";
import PenControlsBar from "./PenControlsBar";
import PageSEO from "../../Component/SEO/PageSEO";
import Style from "./Notebook.module.css";
import { useAppContext } from "../../context/AppContext";
import NotebookSyncModal from "./NotebookSyncModal";
import TranslationModal from "./TranslationModal";
import CommentSidePanel from "./CommentSidePanel";
import ImageUrlModal from "./ImageUrlModal";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import {
  getSyncIdentity,
  joinPairingSession,
  pushToCloud,
  pullFromCloud,
} from "./notebookSyncManager";
import {
  processImageFile,
  plainTextToHtml,
  htmlToPlainText,
  insertImageAtCursor,
  convertSelectionToTodo,
  convertSelectionToNormalText,
  clearFormattingFromSelection,
  createTodoItem,
  placeCursorInTodo,
  applyHighlightColor,
  isSelectionHighlighted,
  toggleTodoSelection,
  toggleListSelection,
} from "./notebookEditorUtils";
import {
  saveImageToDb,
  getImageFromDb,
  deleteImageFromDb,
  saveExtendedNote,
  getExtendedNote,
  saveDrawingToDb,
  getDrawingFromDb,
  deleteDrawingFromDb,
} from "./notebookStorage";
import {
  handleRichClipboardPaste,
  handleTableKeyNavigation,
  insertTableRow,
  deleteTableRow,
  insertTableColumn,
  deleteTableColumn,
  deleteTable,
} from "./notebookClipboard";
import { NOTEBOOK_FONTS, lazyLoadFont } from "./notebookFonts";

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

  localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(migrated));
  return migrated;
};

const resolveActiveNotebook = (requestedId = null) => {
  const list = loadNotebooks();
  const savedActiveId = localStorage.getItem(ACTIVE_NOTEBOOK_KEY);
  const active =
    list.find((nb) => nb.id === requestedId) ||
    list.find((nb) => nb.id === savedActiveId) ||
    list[0];
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
  oswald: "'Oswald', sans-serif",
  merriweather: "'Merriweather', serif",
  playfair: "'Playfair Display', serif",
  fira: "'Fira Code', monospace",
  comic: "'Comic Sans MS', cursive, sans-serif",
};

const FONT_SIZES = { small: 15, medium: 19, large: 23, xlarge: 28 };
const WRITING_WIDTHS = {
  narrow: "min(860px, 90vw)",
  medium: "min(1240px, 93vw)",
  wide: "min(1720px, 96vw)",
};
const LINE_HEIGHTS = { compact: 1.5, comfortable: 1.85, spacious: 2.25 };

const DEFAULT_SETTINGS = {
  fontFamily: "inter",
  fontSize: "medium",
  writingWidth: "medium",
  lineHeight: "comfortable",
  wordWrap: true,
  paperType: "dotted",
  autoSave: true,
  showStats: true,
  autoHideNavbar: false,
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    // Auto-migrate legacy default 'caveat' to 'inter'
    if (parsed.fontFamily === "caveat") {
      parsed.fontFamily = "inter";
      try {
        localStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify({ ...DEFAULT_SETTINGS, ...parsed }),
        );
      } catch {}
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const countWords = (text) => {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
};

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
  // Shared audio, timer, snapshots and unicode tools
  const location = useLocation();

  const [notebooks, setNotebooks] = useState(
    () => resolveActiveNotebook(location.state?.quickSearchNotebookId).list,
  );
  const [activeNotebookId, setActiveNotebookId] = useState(
    () => resolveActiveNotebook(location.state?.quickSearchNotebookId).active.id,
  );
  const [text, setText] = useState(
    () => resolveActiveNotebook(location.state?.quickSearchNotebookId).active.content || "",
  );
  const [title, setTitle] = useState(
    () => resolveActiveNotebook(location.state?.quickSearchNotebookId).active.title || DEFAULT_NOTEBOOK_TITLE,
  );
  const [settings, setSettings] = useState(loadSettings);
  const [isZenMode, setIsZenMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const [virtualKeyboardOpen, setVirtualKeyboardOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [altKeyActive, setAltKeyActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState(() => (getSyncIdentity() ? "synced" : "idle"));
  const cloudSyncTimeoutRef = useRef(null);

  // Read mode, Book layout, Comments & Translation modals
  const [readMode, setReadMode] = useState(false);
  const [bookLayout, setBookLayout] = useState(false);
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [translationModalOpen, setTranslationModalOpen] = useState(false);
  const [selectedTextForTranslate, setSelectedTextForTranslate] = useState("");
  const [imageUrlModalOpen, setImageUrlModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });

  // Selected image for resizing and controls
  const [selectedImage, setSelectedImage] = useState(null);

  // Search state
  const [searchOpen, setSearchOpen] = useState(
    () => Boolean(location.state?.quickSearchNotebookId),
  );
  const [searchQuery, setSearchQuery] = useState(
    () => location.state?.quickSearchQuery || "",
  );
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);

  // Stats
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Pen / Drawing Canvas state
  const [isPenMode, setIsPenMode] = useState(false);
  const [penTool, setPenTool] = useState("pen");
  const [penColor, setPenColor] = useState("#111827");
  const [penWidth, setPenWidth] = useState(3);
  const drawingCanvasRef = useRef(null);

  const editorRef = useRef(null);
  const paperAreaRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const statsPillRef = useRef(null);
  const statsContentRef = useRef(null);

  const handleStatsMouseEnter = useCallback(() => {
    if (!statsPillRef.current || !statsContentRef.current) return;
    gsap.killTweensOf([statsPillRef.current, statsContentRef.current]);
    const targetWidth = statsContentRef.current.scrollWidth + 44;
    gsap.to(statsPillRef.current, {
      width: Math.max(320, targetWidth),
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(statsContentRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.25,
      delay: 0.05,
      ease: "power2.out",
    });
  }, []);

  const handleStatsMouseLeave = useCallback(() => {
    if (!statsPillRef.current || !statsContentRef.current) return;
    gsap.killTweensOf([statsPillRef.current, statsContentRef.current]);
    gsap.to(statsContentRef.current, {
      opacity: 0,
      x: 8,
      duration: 0.15,
      ease: "power2.in",
    });
    gsap.to(statsPillRef.current, {
      width: 38,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, []);

  useEffect(() => {
    if (statsPillRef.current && statsContentRef.current) {
      gsap.set(statsPillRef.current, { width: 38 });
      gsap.set(statsContentRef.current, { opacity: 0, x: 8 });
    }
  }, []);
  const notebookTools = useNotebookTools({ text, setText, editorRef, title });

  // Undo / Redo history state
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isHistoryNavigatingRef = useRef(false);
  const historyDebounceRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleStrokeEnd = useCallback(() => {
    if (!drawingCanvasRef.current) return;
    try {
      const dataUrl = drawingCanvasRef.current.toDataURL();
      saveDrawingToDb(activeNotebookId, dataUrl);
    } catch {}
  }, [activeNotebookId]);

  const handleClearDrawing = useCallback(() => {
    if (!drawingCanvasRef.current) return;
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    deleteDrawingFromDb(activeNotebookId);
  }, [activeNotebookId]);

  // Helper to update text statistics from innerText
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const plain = editorRef.current.innerText || "";
    const clean = plain.replace(/\u200B/g, "").trim();
    setCharCount(clean.length);
    setWordCount(countWords(clean));
    editorRef.current.setAttribute("data-empty", clean === "" ? "true" : "false");
  }, []);

  // Save content to localStorage and IndexedDB
  const persistContent = useCallback(
    async (htmlToSave) => {
      let localSaved = false;
      try {
        localStorage.setItem(TEXT_KEY, htmlToSave);
        setNotebooks((prev) => {
          const updated = prev.map((nb) =>
            nb.id === activeNotebookId
              ? { ...nb, content: htmlToSave, updatedAt: Date.now() }
              : nb,
          );
          localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(updated));
          return updated;
        });
        localSaved = true;
      } catch (err) {
        console.warn("localStorage quota exceeded, using IndexedDB:", err);
      }

      // High-capacity backing store in IndexedDB
      await saveExtendedNote(activeNotebookId, htmlToSave);

      // Lightweight fallback if localStorage threw quota error
      if (!localSaved) {
        try {
          const lightweight = htmlToSave.replace(
            /src="data:image\/[^"]+"/g,
            'src=""',
          );
          setNotebooks((prev) => {
            const updated = prev.map((nb) =>
              nb.id === activeNotebookId
                ? { ...nb, content: lightweight, updatedAt: Date.now() }
                : nb,
            );
            localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(updated));
            return updated;
          });
        } catch {}
      }

      setSaveState("saved");
    },
    [activeNotebookId],
  );

  // Push new snapshot to history
  const pushHistorySnapshot = useCallback((html) => {
    if (isHistoryNavigatingRef.current) return;
    if (!html) return;

    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;

    // Skip identical consecutive snapshots
    if (currentIndex >= 0 && history[currentIndex] === html) {
      return;
    }

    const nextHistory = history.slice(0, currentIndex + 1);
    nextHistory.push(html);

    if (nextHistory.length > 60) {
      nextHistory.shift();
    }

    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // Undo action
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;

    isHistoryNavigatingRef.current = true;
    historyIndexRef.current -= 1;
    const prevHtml = historyRef.current[historyIndexRef.current];

    if (editorRef.current && prevHtml !== undefined) {
      editorRef.current.innerHTML = prevHtml;
      setText(prevHtml);
      updateStats();
      persistContent(prevHtml);
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

    setTimeout(() => {
      isHistoryNavigatingRef.current = false;
    }, 40);
  }, [persistContent, updateStats]);

  // Redo action
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    isHistoryNavigatingRef.current = true;
    historyIndexRef.current += 1;
    const nextHtml = historyRef.current[historyIndexRef.current];

    if (editorRef.current && nextHtml !== undefined) {
      editorRef.current.innerHTML = nextHtml;
      setText(nextHtml);
      updateStats();
      persistContent(nextHtml);
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

    setTimeout(() => {
      isHistoryNavigatingRef.current = false;
    }, 40);
  }, [persistContent, updateStats]);

  // Synchronize localStorage list & title
  useEffect(() => {
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebooks));
    window.dispatchEvent(new Event("stiknex_notebooks_updated"));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_NOTEBOOK_KEY, activeNotebookId);
  }, [activeNotebookId]);

  useEffect(() => {
    localStorage.setItem(TITLE_KEY, title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateTitle = (newTitle) => {
    setTitle(newTitle);
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId ? { ...nb, title: newTitle } : nb,
      ),
    );
  };

  // Trigger content change: updates stats, updates text state, records history, debounces autosave
  const handleContentChange = useCallback((isImmediate = false) => {
    if (!editorRef.current) return;
    updateStats();
    const currentHtml = editorRef.current.innerHTML;
    setText(currentHtml);

    // Push into history stack
    if (isImmediate) {
      clearTimeout(historyDebounceRef.current);
      pushHistorySnapshot(currentHtml);
    } else {
      clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = setTimeout(() => {
        pushHistorySnapshot(currentHtml);
      }, 350);
    }

    if (!settings.autoSave) {
      setSaveState("off");
      return;
    }

    setSaveState("saving");
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      persistContent(currentHtml);
    }, 400);

    // Debounce encrypted cloud sync if enabled
    if (getSyncIdentity()) {
      setSyncStatus("syncing");
      clearTimeout(cloudSyncTimeoutRef.current);
      cloudSyncTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await pushToCloud();
          if (res?.success) {
            setSyncStatus("synced");
          } else if (res?.reason === "Offline") {
            setSyncStatus("offline");
          } else {
            setSyncStatus("idle");
          }
        } catch {
          setSyncStatus("idle");
        }
      }, 2500);
    }
  }, [settings.autoSave, persistContent, updateStats, pushHistorySnapshot]);

  // Load saved comments for active note
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`nb_comments_${activeNotebookId}`);
      if (raw) {
        setComments(JSON.parse(raw));
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
  }, [activeNotebookId]);

  const saveComments = useCallback((newComments) => {
    setComments(newComments);
    try {
      localStorage.setItem(`nb_comments_${activeNotebookId}`, JSON.stringify(newComments));
    } catch {}
  }, [activeNotebookId]);

  // Handle Translate button click
  const handleOpenTranslate = useCallback(() => {
    const sel = window.getSelection();
    let text = "";
    if (sel && !sel.isCollapsed && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      text = sel.toString().trim();
    }
    setSelectedTextForTranslate(text);
    setTranslationModalOpen(true);
  }, []);

  // Replace selected text with translation
  const handleReplaceTranslation = useCallback((translated) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    try {
      document.execCommand("insertText", false, translated);
    } catch {
      editor.innerHTML += `<p>${translated}</p>`;
    }
    handleContentChange(true);
  }, [handleContentChange]);

  // Insert translation below
  const handleInsertTranslationBelow = useCallback((translated) => {
    const editor = editorRef.current;
    if (!editor) return;
    const p = document.createElement("p");
    p.textContent = translated;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.collapse(false);
      range.insertNode(p);
    } else {
      editor.appendChild(p);
    }
    handleContentChange(true);
  }, [handleContentChange]);

  // Add Comment on selected text from context menu or toolbar
  const handleAddCommentFromSelection = useCallback((savedRange, selectedText) => {
    if (!savedRange || !selectedText) {
      setCommentPanelOpen(true);
      return;
    }
    const commentId = 'cmt_' + Date.now();
    const mark = document.createElement("mark");
    mark.className = "nb-comment-anchor";
    mark.setAttribute("data-comment-id", commentId);
    mark.textContent = selectedText;
    try {
      savedRange.deleteContents();
      savedRange.insertNode(mark);
      handleContentChange(true);
    } catch {}

    const newComment = {
      id: commentId,
      quote: selectedText,
      text: "",
      author: "You",
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    saveComments([...comments, newComment]);
    setActiveCommentId(commentId);
    setCommentPanelOpen(true);
  }, [comments, saveComments, handleContentChange]);

  // Add Comment on selected text
  const handleAddComment = useCallback((textBody) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const commentId = 'cmt_' + Date.now();
    const sel = window.getSelection();
    let quote = "";

    if (sel && !sel.isCollapsed && editor.contains(sel.anchorNode)) {
      quote = sel.toString().trim();
      const range = sel.getRangeAt(0);
      const mark = document.createElement("mark");
      mark.className = "nb-comment-anchor";
      mark.setAttribute("data-comment-id", commentId);
      mark.textContent = quote;
      range.deleteContents();
      range.insertNode(mark);
      handleContentChange(true);
    }

    const newComment = {
      id: commentId,
      quote,
      text: textBody,
      author: "You",
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    saveComments([...comments, newComment]);
  }, [comments, saveComments, handleContentChange]);

  // Delete comment & unwrap mark anchor
  const handleDeleteComment = useCallback((commentId) => {
    const editor = editorRef.current;
    if (editor) {
      const mark = editor.querySelector(`mark[data-comment-id="${commentId}"]`);
      if (mark) {
        const textNode = document.createTextNode(mark.textContent || "");
        mark.parentNode && mark.parentNode.replaceChild(textNode, mark);
        handleContentChange(true);
      }
    }
    saveComments(comments.filter((c) => c.id !== commentId));
  }, [comments, saveComments, handleContentChange]);

  // Toggle resolve comment
  const handleToggleResolveComment = useCallback((commentId) => {
    saveComments(
      comments.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
    );
  }, [comments, saveComments]);

  // Click on comment anchor in paper opens side panel
  const handleCommentAnchorClick = useCallback((commentId) => {
    setActiveCommentId(commentId);
    setCommentPanelOpen(true);
  }, []);

  // Insert image from URL
  const handleInsertImageFromUrl = useCallback(({ url, alt, alignment, width }) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const img = document.createElement("img");
    img.src = url;
    img.alt = alt || "Notebook Image";
    img.className = `nb-resizable-image align-${alignment || "center"}`;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "12px auto";
    if (width) {
      img.style.width = width;
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const p = document.createElement("p");
      p.appendChild(img);
      range.insertNode(p);
    } else {
      const p = document.createElement("p");
      p.appendChild(img);
      editor.appendChild(p);
    }

    handleContentChange(true);
  }, [handleContentChange]);

  // Load active note on initial render or when active notebook changes
  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      // 1. Try IndexedDB first
      let rawContent = await getExtendedNote(activeNotebookId);

      // 2. Fallback to localStorage notebook record
      if (!rawContent) {
        const found = notebooks.find((nb) => nb.id === activeNotebookId);
        rawContent = found ? found.content : "";
      }

      if (cancelled) return;

      // Convert legacy plain text to safe HTML
      const html = plainTextToHtml(rawContent || "");

      if (editorRef.current) {
        editorRef.current.innerHTML = html;

        // Rehydrate images whose src might have been stripped from localStorage
        const imgs = editorRef.current.querySelectorAll("img[data-img-id]");
        for (const img of imgs) {
          if (
            !img.src ||
            img.src === window.location.href ||
            img.src.endsWith('""')
          ) {
            const imgId = img.getAttribute("data-img-id");
            if (imgId) {
              const data = await getImageFromDb(imgId);
              if (data && !cancelled) {
                img.src = data;
              }
            }
          }
        }

        updateStats();
      }

      setText(html);
      setSelectedImage(null);
      isInitialLoadRef.current = false;

      // Initialize Undo/Redo history for this note
      historyRef.current = [html];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);

      // Rehydrate drawings from IndexedDB
      try {
        const drawingData = await getDrawingFromDb(activeNotebookId);
        if (drawingCanvasRef.current && !cancelled) {
          const canvas = drawingCanvasRef.current;
          if (drawingData) {
            if (canvas.loadFromDataURL) {
              canvas.loadFromDataURL(drawingData);
            } else {
              const img = new Image();
              img.onload = () => {
                if (!cancelled) {
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0);
                }
              };
              img.src = drawingData;
            }
          } else {
            if (canvas.clear) {
              canvas.clear();
            } else {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load drawing:", err);
      }
    }

    loadContent();

    return () => {
      cancelled = true;
      clearTimeout(saveTimeoutRef.current);
    };
  }, [activeNotebookId, updateStats]);

  // Handle QR Pairing deep link on Device B (e.g. /notebook?pair=...#...)
  useEffect(() => {
    const handlePairingDeepLink = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pairingId = urlParams.get("pair");
      const hash = window.location.hash ? window.location.hash.substring(1) : "";

      if (pairingId && hash) {
        setSyncStatus("syncing");
        swal({
          title: "Connecting Device...",
          text: "Securing end-to-end encrypted connection with your other device.",
          buttons: false,
          closeOnClickOutside: false,
          closeOnEsc: false,
        });

        try {
          const res = await joinPairingSession(pairingId, hash);
          if (res?.success) {
            // Pull latest notes
            const syncRes = await pullFromCloud(res.identity);
            if (syncRes?.success) {
              const list = loadNotebooks();
              if (list.length > 0) {
                setNotebooks(list);
                const active = list[0];
                setActiveNotebookId(active.id);
                setTitle(active.title);
                setText(active.content || "");
                if (editorRef.current) {
                  editorRef.current.innerHTML = plainTextToHtml(active.content || "");
                }
              }
            }
            setSyncStatus("synced");
            window.history.replaceState({}, document.title, window.location.pathname);
            swal({
              title: "Device Paired!",
              text: "Your notebook is now synchronized with zero-knowledge end-to-end encryption.",
              icon: "success",
              timer: 3500,
              buttons: false,
            });
          } else {
            setSyncStatus("idle");
            swal({
              title: "Pairing Failed",
              text: res?.error || "The pairing session may have expired or is invalid.",
              icon: "error",
            });
          }
        } catch (err) {
          setSyncStatus("idle");
          swal({
            title: "Pairing Error",
            text: err.message || "Could not connect to device.",
            icon: "error",
          });
        }
      }
    };

    handlePairingDeepLink();
  }, []);

  // Handle background remote sync notifications and online event
  useEffect(() => {
    const handleRemoteSync = (e) => {
      const payload = e.detail?.remotePayload;
      if (!payload) return;
      if (Array.isArray(payload.notebooks) && payload.notebooks.length > 0) {
        setNotebooks(payload.notebooks);
        const active = payload.notebooks.find((nb) => nb.id === activeNotebookId) || payload.notebooks[0];
        if (active) {
          setTitle(active.title);
          setText(active.content || "");
          if (editorRef.current && editorRef.current.innerHTML !== active.content) {
            editorRef.current.innerHTML = plainTextToHtml(active.content || "");
          }
        }
      }
      setSyncStatus("synced");
    };

    const handleOnline = () => {
      if (getSyncIdentity()) {
        pullFromCloud().then((res) => {
          if (res?.success) setSyncStatus("synced");
        });
      }
    };

    window.addEventListener("stiknex_notebook_synced", handleRemoteSync);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("stiknex_notebook_synced", handleRemoteSync);
      window.removeEventListener("online", handleOnline);
    };
  }, [activeNotebookId]);

  const handleNewNotebook = () => {
    const newNotebook = {
      id: genId(),
      title: nextNotebookTitle(notebooks),
      content: "<p><br></p>",
      updatedAt: Date.now(),
    };
    setNotebooks((prev) => [newNotebook, ...prev]);
    setActiveNotebookId(newNotebook.id);
    setTitle(newNotebook.title);
  };

  const handleSwitchNotebook = (id) => {
    if (id === activeNotebookId) return;
    const target = notebooks.find((nb) => nb.id === id);
    if (!target) return;
    setActiveNotebookId(id);
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

      deleteDrawingFromDb(id);

      if (remaining.length === 0) {
        handleClearDrawing();
        const fresh = {
          id: genId(),
          title: DEFAULT_NOTEBOOK_TITLE,
          content: "<p><br></p>",
          updatedAt: Date.now(),
        };
        setNotebooks([fresh]);
        setActiveNotebookId(fresh.id);
        setTitle(fresh.title);
        return;
      }

      setNotebooks(remaining);
      if (wasActive) {
        const next = remaining[0];
        setActiveNotebookId(next.id);
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
    if (editorRef.current) {
      persistContent(editorRef.current.innerHTML);
    }
  };

  const handleCopy = async () => {
    if (!editorRef.current) return;
    const cleanText = htmlToPlainText(editorRef.current.innerHTML);
    if (!cleanText.trim()) return;
    try {
      await navigator.clipboard.writeText(cleanText);
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
    if (!editorRef.current || editorRef.current.innerText.trim() === "") return;
    swal({
      title: "Clear Notebook?",
      text: "Everything you've written here will be permanently erased.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willClear) => {
      if (willClear) {
        editorRef.current.innerHTML = "<p><br></p>";
        setText("<p><br></p>");
        persistContent("<p><br></p>");
        updateStats();
        handleClearDrawing();
        swal({
          title: "Cleared!",
          text: "Your notebook is empty now.",
          icon: "success",
        });
      }
    });
  };

  const handleDownload = () => {
    if (!editorRef.current) return;
    const cleanText = htmlToPlainText(editorRef.current.innerHTML);
    if (!cleanText.trim()) return;
    const blob = new Blob([cleanText], { type: "text/plain;charset=utf-8" });
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
    const plain = editorRef.current ? htmlToPlainText(editorRef.current.innerHTML) : "";
    const shareData = {
      title: `${title} — Stiknex Notebook`,
      text: plain.slice(0, 200) || "Check out Stiknex — a free online notebook & writing app.",
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

  // Search matches based on plain text
  const plainForSearch = useMemo(
    () => (editorRef.current ? editorRef.current.innerText : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, searchQuery],
  );

  const searchMatches = useMemo(
    () => findMatches(plainForSearch, searchQuery),
    [plainForSearch, searchQuery],
  );

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
    setSearchMatchIndex(
      (i) => (i - 1 + searchMatches.length) % searchMatches.length,
    );
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchMatchIndex(0);
  };

  useEffect(() => {
    const handleQuickSearchNotebook = (event) => {
      const { quickSearchNotebookId, quickSearchQuery } = event.detail || {};
      const requestedNotebook = notebooks.find(
        (notebook) => notebook.id === quickSearchNotebookId,
      );
      if (!requestedNotebook) return;
      setActiveNotebookId(requestedNotebook.id);
      setTitle(requestedNotebook.title || DEFAULT_NOTEBOOK_TITLE);
      setSearchQuery(quickSearchQuery || "");
      setSearchMatchIndex(0);
      setSearchOpen(true);
    };
    window.addEventListener("stiknex_quick_search_notebook", handleQuickSearchNotebook);
    return () => window.removeEventListener("stiknex_quick_search_notebook", handleQuickSearchNotebook);
  }, [notebooks]);

  const handleToggleSearch = () => setSearchOpen((v) => !v);

  // Native CSS background-attachment: local seamlessly syncs ruled lines with scrolling
  const handleEditorScroll = () => {};

  const handleOpenVirtualKeyboard = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(
      navigator.userAgent,
    );
    if (isMobile) {
      editorRef.current?.focus();
      return;
    }
    if (typeof navigator !== "undefined" && "virtualKeyboard" in navigator) {
      try {
        navigator.virtualKeyboard.overlaysContent = true;
        navigator.virtualKeyboard.show();
        editorRef.current?.focus();
        return;
      } catch {}
    }
    setVirtualKeyboardOpen(true);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const onKeyDown = (e) => {
      const meta = e.ctrlKey || e.metaKey;

      // Toggle ribbon Alt keytips across topbar & toolbar
      if (e.key === "Alt") {
        const tag = e.target.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
          e.preventDefault();
          setAltKeyActive((prev) => !prev);
          return;
        }
      }

      if (e.key === "Escape") {
        if (altKeyActive) setAltKeyActive(false);
        if (selectedImage) setSelectedImage(null);
        if (contextMenu.open) setContextMenu((prev) => ({ ...prev, open: false }));
        if (isZenMode) setIsZenMode(false);
        if (settingsOpen) setSettingsOpen(false);
        if (moreMenuOpen) setMoreMenuOpen(false);
        if (drawerOpen) setDrawerOpen(false);
        if (searchOpen) handleSearchClose();
        return;
      }

      // The open menu owns its keytips; avoid competing topbar/ribbon shortcuts.
      if (!moreMenuOpen && (altKeyActive || e.altKey) && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        const k = e.key.toLowerCase();
        let handled = true;
        switch (k) {
          case "s":
            setSettingsOpen((v) => !v);
            setMoreMenuOpen(false);
            setDrawerOpen(false);
            break;
          case "m":
            setMoreMenuOpen((v) => !v);
            setSettingsOpen(false);
            setDrawerOpen(false);
            break;
          case "n":
            setDrawerOpen((v) => !v);
            setMoreMenuOpen(false);
            setSettingsOpen(false);
            break;
          case "y":
            setSyncModalOpen(true);
            setMoreMenuOpen(false);
            break;
          case "q":
            handleContentChange(true);
            break;
          case "z":
            toggleZenMode();
            break;
          default:
            handled = false;
        }
        if (handled) {
          e.preventDefault();
          if (k !== "m") setAltKeyActive(false);
          return;
        }
      }

      // Hotkeys for ... menu options
      if (meta && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setMoreMenuOpen && setMoreMenuOpen(false);
        notebookTools.snapshots && notebookTools.takeSnapshot();
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleShare();
        return;
      }
      if (meta && e.shiftKey && (e.key === "Delete" || e.key.toLowerCase() === "x")) {
        e.preventDefault();
        handleDelete();
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        updateSetting("autoHideNavbar", !settings.autoHideNavbar);
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        notebookTools.handleInsertUnicode && notebookTools.handleInsertUnicode("✨");
        return;
      }
      if (meta && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsVirtualKeyboardOpen((v) => !v);
        return;
      }
      if (meta && e.key === "/") {
        e.preventDefault();
        setShortcutsModalOpen((v) => !v);
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        notebookTools.toggleTimer();
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        notebookTools.toggleMusic();
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        notebookTools.handleReadAloud();
        return;
      }
      if ((e.altKey && e.key.toLowerCase() === "y") || (meta && e.altKey && e.key.toLowerCase() === "s")) {
        e.preventDefault();
        setSyncModalOpen(true);
        return;
      }

      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleManualSave();
      } else if (meta && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (
        (meta && e.key.toLowerCase() === "y") ||
        (meta && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
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
      } else if (
        meta &&
        (e.key.toLowerCase() === "b" ||
          e.key.toLowerCase() === "i" ||
          e.key.toLowerCase() === "u")
      ) {
        setTimeout(handleContentChange, 30);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Editor Click Handler: checkbox toggling & image selection
  const handleEditorClick = (e) => {
    // Checkbox toggle
    if (e.target.matches("input[type='checkbox'].nb-todo-cb")) {
      const item = e.target.closest(".nb-todo-item");
      if (item) {
        if (e.target.checked) {
          e.target.setAttribute("checked", "true");
          item.classList.add("nb-todo-completed");
        } else {
          e.target.removeAttribute("checked");
          item.classList.remove("nb-todo-completed");
        }
        handleContentChange();
      }
      return;
    }

    // Image click
    if (e.target.tagName === "IMG") {
      setSelectedImage(e.target);
      return;
    }

    // Comment anchor click
    const commentAnchor = e.target.closest(".nb-comment-anchor");
    if (commentAnchor) {
      const cId = commentAnchor.getAttribute("data-comment-id");
      if (cId) {
        handleCommentAnchorClick(cId);
        return;
      }
    }

    // Deselect image when clicking away
    if (selectedImage && !e.target.closest(".nb-resizable-image")) {
      setSelectedImage(null);
    }
  };

  // Key handling inside contenteditable (Enter & Backspace for To-dos and Markdown lists)
  const handleEditorKeyDown = (e) => {
    // 1. Table navigation via Tab and Shift+Tab
    if (handleTableKeyNavigation(e, editorRef.current, handleContentChange)) {
      return;
    }

    // Auto markdown lists on Space: "- " / "* " -> bullet list, "1. " -> numbered list, "[] " -> todo
    if (e.key === " " && !e.shiftKey) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        if (node && node.nodeType === Node.TEXT_NODE && range.startOffset <= 4) {
          const textBefore = node.textContent.substring(0, range.startOffset);
          if (textBefore === "-" || textBefore === "*") {
            e.preventDefault();
            node.textContent = node.textContent.substring(range.startOffset);
            document.execCommand("insertUnorderedList", false, null);
            handleContentChange();
            return;
          } else if (textBefore === "1.") {
            e.preventDefault();
            node.textContent = node.textContent.substring(range.startOffset);
            document.execCommand("insertOrderedList", false, null);
            handleContentChange();
            return;
          } else if (textBefore === "[]") {
            e.preventDefault();
            node.textContent = node.textContent.substring(range.startOffset);
            convertSelectionToTodo(editorRef.current);
            handleContentChange();
            return;
          }
        }
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      // Check if caret is inside a todo item
      let node = range.startContainer;
      let todoItem = null;
      while (node && node !== editorRef.current) {
        if (node.classList && node.classList.contains("nb-todo-item")) {
          todoItem = node;
          break;
        }
        node = node.parentNode;
      }

      if (todoItem) {
        const textSpan = todoItem.querySelector(".nb-todo-text");
        const itemText = textSpan ? textSpan.innerText.trim() : "";

        // If current todo item is empty, exit checklist mode and convert to paragraph
        if (!itemText || itemText === "") {
          e.preventDefault();
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          todoItem.parentNode.replaceChild(p, todoItem);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          handleContentChange();
          return;
        }

        // If todo item has text, create a new empty todo item below
        e.preventDefault();
        const nextTodo = createTodoItem("");
        if (todoItem.nextSibling) {
          todoItem.parentNode.insertBefore(nextTodo, todoItem.nextSibling);
        } else {
          todoItem.parentNode.appendChild(nextTodo);
        }
        placeCursorInTodo(nextTodo);
        handleContentChange();
        return;
      }
    }

    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      let node = range.startContainer;
      let todoItem = null;
      while (node && node !== editorRef.current) {
        if (node.classList && node.classList.contains("nb-todo-item")) {
          todoItem = node;
          break;
        }
        node = node.parentNode;
      }

      if (todoItem) {
        const textSpan = todoItem.querySelector(".nb-todo-text");
        const itemText = textSpan ? textSpan.innerText.trim() : "";
        if (!itemText || itemText === "") {
          e.preventDefault();
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          todoItem.parentNode.replaceChild(p, todoItem);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          handleContentChange();
        }
      }
    }
  };

  // Paste handler: handles rich tables (Excel, Word, Docs, Sheets), formatted text, and pure images
  const handleEditorPaste = async (e) => {
    // 1. Try rich clipboard paste first (preserves Excel tables, Word docs, Google Docs, TSV, HTML)
    const handledRich = await handleRichClipboardPaste(
      e,
      editorRef.current,
      saveImageToDb,
      handleContentChange,
    );
    if (handledRich) return;

    // 2. Fallback: Standalone image file or screenshot paste (e.g. Snipping tool / PrintScreen)
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = Array.from(clipboardData.items || []);
    const imageItems = items.filter(
      (item) => item.type && item.type.startsWith("image/"),
    );

    if (imageItems.length > 0) {
      e.preventDefault();
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          try {
            const { dataUrl } = await processImageFile(file);
            const imgId = `img_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2, 7)}`;
            await saveImageToDb(imgId, dataUrl);
            insertImageAtCursor(editorRef.current, dataUrl, imgId);
            handleContentChange();
          } catch (err) {
            console.error("Failed to process pasted image:", err);
          }
        }
      }
      return;
    }
  };

  // Drop handler: drag and drop images directly into editor
  const handleEditorDrop = async (e) => {
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter(
      (f) => f.type && f.type.startsWith("image/"),
    );

    if (imageFiles.length > 0) {
      e.preventDefault();
      // Move caret to drop position if supported
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      for (const file of imageFiles) {
        try {
          const { dataUrl } = await processImageFile(file);
          const imgId = `img_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`;
          await saveImageToDb(imgId, dataUrl);
          insertImageAtCursor(editorRef.current, dataUrl, imgId);
          handleContentChange();
        } catch (err) {
          console.error("Failed to drop image:", err);
        }
      }
    }
  };

  // Toolbar image file selection
  const handleToolbarInsertImage = async (files) => {
    const fileList = Array.from(files || []);
    for (const file of fileList) {
      if (file.type && file.type.startsWith("image/")) {
        try {
          const { dataUrl } = await processImageFile(file);
          const imgId = `img_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`;
          await saveImageToDb(imgId, dataUrl);
          insertImageAtCursor(editorRef.current, dataUrl, imgId);
          handleContentChange();
        } catch (err) {
          console.error("Failed to insert image:", err);
        }
      }
    }
  };

  // Context Menu handler
  const handleEditorContextMenu = (e) => {
    e.preventDefault();
    // Detect if right click was inside a table cell
    let target = e.target;
    let tableCell = null;
    while (target && target !== editorRef.current) {
      if (target.nodeName === "TD" || target.nodeName === "TH") {
        tableCell = target;
        break;
      }
      target = target.parentNode;
    }

    // Capture currently selected text and Range before context menu opens
    const sel = window.getSelection();
    let selectedText = "";
    let savedRange = null;

    if (sel && sel.rangeCount > 0 && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode)) {
      selectedText = sel.toString().trim();
      savedRange = sel.getRangeAt(0).cloneRange();
    } else {
      // If user right-clicked without highlighting, capture the target line/element text
      const lineEl = target?.closest ? target.closest("p, div, li, td, th") : null;
      if (lineEl && lineEl !== editorRef.current && lineEl.textContent.trim()) {
        selectedText = lineEl.textContent.trim();
        const r = document.createRange();
        r.selectNodeContents(lineEl);
        savedRange = r;
      }
    }

    setContextMenu({
      open: true,
      x: e.clientX,
      y: e.clientY,
      tableCell,
      selectedText,
      savedRange,
    });
  };

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const fontSizePx = FONT_SIZES[settings.fontSize];
  const lineHeightMultiplier = LINE_HEIGHTS[settings.lineHeight];
  const lineHeightPx = Math.round(fontSizePx * lineHeightMultiplier);
  const writingWidthPx = WRITING_WIDTHS[settings.writingWidth];

  // Lazy load Google web font on demand
  useEffect(() => {
    if (settings.fontFamily) {
      lazyLoadFont(settings.fontFamily);
    }
  }, [settings.fontFamily]);

  const selectedFontObj = NOTEBOOK_FONTS.find((f) => f.id === settings.fontFamily);
  const activeFontFamilyCss = selectedFontObj
    ? selectedFontObj.family
    : (FONT_FAMILIES[settings.fontFamily] || FONT_FAMILIES.inter);

  const editorVars = useMemo(
    () => ({
      "--nb-font-family": activeFontFamilyCss,
      "--nb-font-size": `${fontSizePx}px`,
      "--nb-line-height": `${lineHeightPx}px`,
      "--nb-writing-width": writingWidthPx,
    }),
    [activeFontFamilyCss, fontSizePx, lineHeightPx, writingWidthPx],
  );

  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <div
      className={`${Style.notebookPage} ${
        darkMode ? Style.darkNotebookPage : ""
      } ${isZenMode ? Style.zenMode : ""}`}
    >
      <PageSEO
        title="Free Online Notebook & Digital Note Editor | Stiknex"
        description="Write, organize and save your notes in Stiknex's free online notebook. Rich text editor with headings, lists, bold, italic formatting, images, and to-do checklists. No sign-up required."
        path="/online-notebook"
        type="webapp"
        keywords="online notebook, free digital notebook, note editor, rich text editor, online notepad, free notepad, note taking app online, resizable images notebook, checklist notebook"
      />

      {darkMode && (
        <style>{`
          .swal-modal { background-color: #2a2a2a; border: 1px solid #444; }
          .swal-title { color: #ffffff; }
          .swal-text { color: #cccccc; }
          .swal-button { background-color: #444444; color: #ffffff; text-shadow: none; border: none; box-shadow: none; }
          .swal-button:not([disabled]):hover { background-color: #555555; }
          .swal-button--danger { background-color: #e64942; }
          .swal-button--danger:not([disabled]):hover { background-color: #ff5e57; }
        `}</style>
      )}

      {!isZenMode && (
        <NotebookTopbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          autoHideNavbar={Boolean(settings.autoHideNavbar)}
          onToggleAutoHideNavbar={() => updateSetting("autoHideNavbar", !settings.autoHideNavbar)}
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
          saveState={saveState}
          text={text}
          setText={setText}
          textareaRef={editorRef}
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
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          musicOn={notebookTools.musicOn}
          onToggleMusic={notebookTools.toggleMusic}
          isReading={notebookTools.isReading}
          onReadAloud={notebookTools.handleReadAloud}
          timerRunning={notebookTools.timerRunning}
          elapsedMs={notebookTools.elapsedMs}
          onToggleTimer={notebookTools.toggleTimer}
          onResetTimer={notebookTools.resetTimer}
          snapshots={notebookTools.snapshots}
          onTakeSnapshot={notebookTools.takeSnapshot}
          onRestoreSnapshot={notebookTools.restoreSnapshot}
          onDeleteSnapshot={notebookTools.deleteSnapshot}
          onDeleteAllSnapshots={notebookTools.deleteAllSnapshots}
          onInsertUnicode={notebookTools.handleInsertUnicode}
          onSaveNow={() => handleContentChange(true)}
          syncStatus={syncStatus}
          onOpenSyncModal={() => setSyncModalOpen(true)}
          onDismissAltKeytips={() => setAltKeyActive(false)}
          altKeyActive={altKeyActive}
          altShortcutsEnabled={!moreMenuOpen}
          moreMenuOpen={moreMenuOpen}
          onToggleMoreMenu={setMoreMenuOpen}
          drawerOpen={drawerOpen}
          onToggleDrawer={setDrawerOpen}
        />
      )}

      {/* Selected text formatting toolbar */}
      {!isZenMode && !readMode && (
        <RichTextToolbar
          darkMode={darkMode}
          editorRef={editorRef}
          onInsertImage={handleToolbarInsertImage}
          onContentChange={(immediate = false) => handleContentChange(immediate)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          isPenMode={isPenMode}
          onTogglePenMode={() => setIsPenMode((v) => !v)}
          penTool={penTool}
          onSetPenTool={setPenTool}
          autoHide={Boolean(settings.autoHideNavbar)}
          paperType={settings.paperType || "dotted"}
          onSelectPaperType={(t) => updateSetting("paperType", t)}
          readMode={readMode}
          onToggleReadMode={() => setReadMode((v) => !v)}
          bookLayout={bookLayout}
          onToggleBookLayout={() => setBookLayout((v) => !v)}
          commentsCount={comments.filter((c) => !c.resolved).length}
          onOpenComments={() => setCommentPanelOpen((v) => !v)}
          onOpenTranslate={handleOpenTranslate}
          onOpenImageUrl={() => setImageUrlModalOpen(true)}
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
          onDismissAltKeytips={() => setAltKeyActive(false)}
          fontFamily={settings.fontFamily || "inter"}
          onSelectFontFamily={(f) => updateSetting("fontFamily", f)}
          altKeyActive={altKeyActive && !moreMenuOpen}
        />
      )}

      {/* Paper Writing Area */}
      <div
        ref={paperAreaRef}
        className={`${Style.paperArea} ${
          darkMode ? Style.darkPaperArea : ""
        } ${
          Style[`paper${(settings.paperType || "dotted").charAt(0).toUpperCase() + (settings.paperType || "dotted").slice(1)}`] || Style.paperDotted
        }`}
        style={editorVars}
        onScroll={handleEditorScroll}
        onContextMenu={handleEditorContextMenu}
      >
        <div className={Style.paperColumn}>
          <div className={Style.marginLine}></div>
          <div className={Style.editorWrap}>
            <div
              ref={editorRef}
              className={`${Style.editor} ${bookLayout ? Style.bookMode : ""}`}
              contentEditable={!readMode}
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              onClick={handleEditorClick}
              onKeyDown={handleEditorKeyDown}
              onPaste={handleEditorPaste}
              onDrop={handleEditorDrop}
              onDragOver={(e) => e.preventDefault()}
              data-placeholder="Start writing, pasting images, or make a to-do list…"
              spellCheck={true}
              style={{
                ...editorVars,
                fontFamily: editorVars["--nb-font-family"],
                fontSize: editorVars["--nb-font-size"],
                lineHeight: editorVars["--nb-line-height"],
                whiteSpace: settings.wordWrap ? "pre-wrap" : "pre",
                overflowX: settings.wordWrap ? "hidden" : "auto",
              }}
            />

            {/* Seamless Digital Ink Drawing Layer */}
            <NotebookDrawingCanvas
              isActive={isPenMode}
              tool={penTool}
              color={penColor}
              strokeWidth={penWidth}
              canvasRef={drawingCanvasRef}
              onStrokeEnd={handleStrokeEnd}
            />
          </div>
        </div>

        {/* Resizable Image Overlay */}
        {selectedImage && (
          <ImageResizeOverlay
            targetImg={selectedImage}
            paperAreaRef={paperAreaRef}
            darkMode={darkMode}
            onImageChanged={handleContentChange}
            onDeleteImage={(imgId) => {
              if (imgId) deleteImageFromDb(imgId);
              setSelectedImage(null);
              handleContentChange();
            }}
            onDeselect={() => setSelectedImage(null)}
          />
        )}
      </div>

      {/* Floating Pen Controls Bar when in drawing mode */}
      {isPenMode && (
        <PenControlsBar
          darkMode={darkMode}
          tool={penTool}
          setTool={setPenTool}
          color={penColor}
          setColor={setPenColor}
          strokeWidth={penWidth}
          setStrokeWidth={setPenWidth}
          onClearDrawing={handleClearDrawing}
          onClose={() => setIsPenMode(false)}
        />
      )}

      {/* Right-click Context Menu */}
      {contextMenu.open && (
        <NotebookContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          darkMode={darkMode}
          tableCell={contextMenu.tableCell}
          onClose={() => setContextMenu((prev) => ({ ...prev, open: false }))}
          onInsertTableRowAbove={() => {
            if (contextMenu.tableCell) {
              insertTableRow(contextMenu.tableCell, "above");
              handleContentChange();
            }
          }}
          onInsertTableRowBelow={() => {
            if (contextMenu.tableCell) {
              insertTableRow(contextMenu.tableCell, "below");
              handleContentChange();
            }
          }}
          onDeleteTableRow={() => {
            if (contextMenu.tableCell) {
              deleteTableRow(contextMenu.tableCell);
              handleContentChange();
            }
          }}
          onInsertTableColumnRight={() => {
            if (contextMenu.tableCell) {
              insertTableColumn(contextMenu.tableCell, "right");
              handleContentChange();
            }
          }}
          onDeleteTableColumn={() => {
            if (contextMenu.tableCell) {
              deleteTableColumn(contextMenu.tableCell);
              handleContentChange();
            }
          }}
          onDeleteTable={() => {
            if (contextMenu.tableCell) {
              deleteTable(contextMenu.tableCell);
              handleContentChange();
            }
          }}
          selectedText={contextMenu.selectedText}
          onAddComment={() => {
            handleAddCommentFromSelection(contextMenu.savedRange, contextMenu.selectedText);
          }}
          onTranslate={() => {
            if (contextMenu.selectedText) {
              setSelectedTextForTranslate(contextMenu.selectedText);
            }
            setTranslationModalOpen(true);
          }}
          onInsertImageUrl={() => {
            setImageUrlModalOpen(true);
          }}
          onConvertToMultilevelList={() => {
            toggleMultilevelList(editorRef.current);
            handleContentChange();
          }}
          onConvertToTodo={() => {
            convertSelectionToTodo(editorRef.current);
            handleContentChange();
          }}
          onConvertToBulletList={() => {
            toggleListSelection(editorRef.current, "unordered");
            handleContentChange();
          }}
          onConvertToNumberedList={() => {
            toggleListSelection(editorRef.current, "ordered");
            handleContentChange();
          }}
          onConvertToNormal={() => {
            convertSelectionToNormalText(editorRef.current);
            handleContentChange();
          }}
          onBold={() => {
            document.execCommand("bold");
            handleContentChange();
          }}
          onItalic={() => {
            document.execCommand("italic");
            handleContentChange();
          }}
          onUnderline={() => {
            document.execCommand("underline");
            handleContentChange();
          }}
          onStrikethrough={() => {
            document.execCommand("strikeThrough");
            handleContentChange();
          }}
          onHighlight={() => {
            const editor = editorRef.current;
            if (editor) {
              if (isSelectionHighlighted(editor)) {
                applyHighlightColor(editor, "transparent");
              } else {
                applyHighlightColor(editor, "#fef08a");
              }
              handleContentChange();
            }
          }}
          onInsertImage={() => {
            // Trigger image file picker
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              if (e.target.files) handleToolbarInsertImage(e.target.files);
            };
            input.click();
          }}
          onClearFormat={() => {
            clearFormattingFromSelection(editorRef.current);
            handleContentChange();
          }}
          onSelectAll={() => {
            document.execCommand("selectAll");
          }}
        />
      )}

      {/* Floating Status Pill for Desktop (Hidden on Mobile via CSS) */}
      {!isZenMode && settings.showStats && (
        <div
          ref={statsPillRef}
          className={`${Style.statusPill} ${
            darkMode ? Style.darkStatusPill : ""
          }`}
          role="status"
          aria-label="Notebook statistics and save state"
          onMouseEnter={handleStatsMouseEnter}
          onMouseLeave={handleStatsMouseLeave}
        >
          <div ref={statsContentRef} className={Style.statusPillContent}>
            <span>{charCount} chars</span>
            <span className={Style.dot}>•</span>
            <span>{wordCount} words</span>
            <span className={Style.dot}>•</span>
            <span>{readingTime} min read</span>
            <span className={Style.dot}>•</span>
            <span className={Style.saveIndicator}>
              {saveState === "saving" && (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Saving…
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
          </div>

          <div className={Style.statusPillIcon} title="Notebook statistics & autosave">
            <i className="fa-solid fa-chart-simple"></i>
          </div>
        </div>
      )}

      {/* Universal Beautiful Bottom Tab / Dock (Exclusively for Mobile / Phone View) */}
      {!isZenMode && (
        <NotebookBottomDock
          darkMode={darkMode}
          onOpenSyncModal={() => setSyncModalOpen(true)}
          syncStatus={syncStatus}
          toggleDarkMode={toggleDarkMode}
          isZenMode={isZenMode}
          onToggleZenMode={toggleZenMode}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((v) => !v)}
          wordCount={wordCount}
          charCount={charCount}
          readingTime={readingTime}
          saveState={saveState}
          editorRef={editorRef}
          text={text}
          setText={setText}
          title={title}
          onContentChange={handleContentChange}
          notebooks={notebooks}
          activeNotebookId={activeNotebookId}
          onNewNotebook={handleNewNotebook}
          onSwitchNotebook={handleSwitchNotebook}
          onDeleteNotebook={handleDeleteNotebook}
          onDeleteNote={handleDelete}
          onCopyNote={handleCopy}
          copied={copied}
          onDownloadNote={handleDownload}
          onShareNote={handleShare}
          searchOpen={searchOpen}
          onToggleSearch={handleToggleSearch}
          musicOn={notebookTools.musicOn}
          toggleMusic={notebookTools.toggleMusic}
          isReading={notebookTools.isReading}
          handleReadAloud={notebookTools.handleReadAloud}
          timerRunning={notebookTools.timerRunning}
          elapsedMs={notebookTools.elapsedMs}
          toggleTimer={notebookTools.toggleTimer}
          resetTimer={notebookTools.resetTimer}
          snapshots={notebookTools.snapshots}
          takeSnapshot={notebookTools.takeSnapshot}
          restoreSnapshot={notebookTools.restoreSnapshot}
          deleteSnapshot={notebookTools.deleteSnapshot}
          deleteAllSnapshots={notebookTools.deleteAllSnapshots}
          handleInsertUnicode={notebookTools.handleInsertUnicode}
        />
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
          textareaRef={editorRef}
          onClose={() => setVirtualKeyboardOpen(false)}
        />
      )}

      {/* Floating Exit Read Mode Pill */}
      {readMode && (
        <button
          type="button"
          className={Style.exitReadModePill}
          onClick={() => setReadMode(false)}
          title="Exit Read Mode (Alt+D or Esc)"
          aria-label="Exit Read Mode"
        >
          <i className="fa-solid fa-pen-to-square"></i>
          <span>Exit Read Mode</span>
        </button>
      )}

      {/* Slide-out Comments Side Panel */}
      <CommentSidePanel
        isOpen={commentPanelOpen}
        onClose={() => setCommentPanelOpen(false)}
        comments={comments}
        activeCommentId={activeCommentId}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onToggleResolve={handleToggleResolveComment}
        darkMode={darkMode}
      />

      {/* Translation Modal */}
      <TranslationModal
        isOpen={translationModalOpen}
        onClose={() => setTranslationModalOpen(false)}
        initialText={selectedTextForTranslate}
        onReplaceText={handleReplaceTranslation}
        onInsertBelow={handleInsertTranslationBelow}
        darkMode={darkMode}
      />

      {/* Insert Image from URL Modal */}
      <ImageUrlModal
        isOpen={imageUrlModalOpen}
        onClose={() => setImageUrlModalOpen(false)}
        onInsert={handleInsertImageFromUrl}
        darkMode={darkMode}
      />

      {/* MS Word Ribbon Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        darkMode={darkMode}
      />

      <NotebookSyncModal
        isOpen={syncModalOpen}
        onClose={() => {
          setSyncModalOpen(false);
          setSyncStatus(getSyncIdentity() ? "synced" : "idle");
        }}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Notebook;
