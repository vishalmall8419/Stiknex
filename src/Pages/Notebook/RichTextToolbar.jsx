import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Style from "./RichTextToolbar.module.css";
import FontSelectorDropdown from "./FontSelectorDropdown";
import {
  toggleTodoSelection,
  toggleListSelection,
  toggleMultilevelList,
  isSelectionInMultilevelList,
  applyTextColor,
  applyHighlightColor,
  clearFormattingFromSelection,
  setBlockFormat,
  isSelectionInTodo,
  isSelectionHighlighted,
  isSelectionColored,
} from "./notebookEditorUtils";

const COLOR_PALETTE = [
  { name: "Default (Remove Color)", color: "inherit" },
  { name: "Black", color: "#111827" },
  { name: "Blue", color: "#2563eb" },
  { name: "Indigo", color: "#4f46e5" },
  { name: "Purple", color: "#9333ea" },
  { name: "Pink", color: "#db2777" },
  { name: "Red", color: "#dc2626" },
  { name: "Orange", color: "#ea580c" },
  { name: "Green", color: "#16a34a" },
  { name: "Teal", color: "#0d9488" },
];

const HIGHLIGHT_PALETTE = [
  { name: "None (Remove Highlight)", color: "transparent" },
  { name: "Yellow", color: "#fef08a" },
  { name: "Green", color: "#bbf7d0" },
  { name: "Blue", color: "#bfdbfe" },
  { name: "Pink", color: "#fbcfe8" },
  { name: "Orange", color: "#fed7aa" },
  { name: "Purple", color: "#e9d5ff" },
];

const BLOCK_OPTIONS = [
  { label: "Normal text", value: "p" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
];

const TOOLBAR_PAPER_OPTIONS = [
  { id: "dotted", label: "Dotted Grid", icon: "fa-solid fa-braille" },
  { id: "ruled", label: "Ruled Lines", icon: "fa-solid fa-bars" },
  { id: "grid", label: "Square Grid", icon: "fa-solid fa-border-all" },
  { id: "graph", label: "Graph Paper", icon: "fa-solid fa-table-cells" },
  { id: "blank", label: "Plain / Blank", icon: "fa-regular fa-square" },
  { id: "sepia", label: "Vintage Sepia", icon: "fa-solid fa-scroll" },
  { id: "dark", label: "Dark Paper", icon: "fa-solid fa-moon" },
];

const RichTextToolbar = ({
  darkMode,
  editorRef,
  onInsertImage,
  onContentChange,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  isPenMode = false,
  onTogglePenMode,
  penTool = "pen",
  onSetPenTool,
  autoHide = false,
  paperType = "dotted",
  onSelectPaperType,
  readMode = false,
  onToggleReadMode,
  bookLayout = false,
  onToggleBookLayout,
  commentsCount = 0,
  onOpenComments,
  onOpenTranslate,
  onOpenImageUrl,
  onOpenShortcuts,
  onDismissAltKeytips,
  altShortcutsEnabled = true,
  fontFamily = "inter",
  onSelectFontFamily,
  altKeyActive: propAltKeyActive,
}) => {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    superscript: false,
    subscript: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    formatBlock: "p",
    isTodo: false,
    isBulletList: false,
    isNumberedList: false,
    isMultilevel: false,
  });

  const [localAltKeyActive, setLocalAltKeyActive] = useState(false);
  const altKeyActive = propAltKeyActive !== undefined ? propAltKeyActive : localAltKeyActive;
  const setAltKeyActive = setLocalAltKeyActive;

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);
  const [blockDropdownOpen, setBlockDropdownOpen] = useState(false);
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#fef08a");
  const [currentTextColor, setCurrentTextColor] = useState("#dc2626");

  const blockWrapRef = useRef(null);
  const [blockRect, setBlockRect] = useState(null);

  const colorWrapRef = useRef(null);
  const [colorRect, setColorRect] = useState(null);

  const highlightWrapRef = useRef(null);
  const [highlightRect, setHighlightRect] = useState(null);

  const paperWrapRef = useRef(null);
  const paperPortalRef = useRef(null);
  const [paperRect, setPaperRect] = useState(null);
  const [paperPickerOpen, setPaperPickerOpen] = useState(false);

  const togglePaperPicker = useCallback(() => {
    if (paperPickerOpen) {
      setPaperPickerOpen(false);
    } else {
      if (paperWrapRef.current) {
        setPaperRect(paperWrapRef.current.getBoundingClientRect());
      }
      setPaperPickerOpen(true);
      setColorPickerOpen(false);
      setHighlightPickerOpen(false);
      setBlockDropdownOpen(false);
    }
  }, [paperPickerOpen]);

  const toggleBlockDropdown = useCallback(() => {
    if (blockDropdownOpen) {
      setBlockDropdownOpen(false);
    } else {
      if (blockWrapRef.current) {
        setBlockRect(blockWrapRef.current.getBoundingClientRect());
      }
      setBlockDropdownOpen(true);
      setColorPickerOpen(false);
      setHighlightPickerOpen(false);
    }
  }, [blockDropdownOpen]);

  const toggleColorPicker = useCallback(() => {
    saveSelection();
    if (colorPickerOpen) {
      setColorPickerOpen(false);
    } else {
      if (colorWrapRef.current) {
        setColorRect(colorWrapRef.current.getBoundingClientRect());
      }
      setColorPickerOpen(true);
      setHighlightPickerOpen(false);
      setBlockDropdownOpen(false);
    }
  }, [colorPickerOpen]);

  const toggleHighlightPicker = useCallback(() => {
    saveSelection();
    if (highlightPickerOpen) {
      setHighlightPickerOpen(false);
    } else {
      if (highlightWrapRef.current) {
        setHighlightRect(highlightWrapRef.current.getBoundingClientRect());
      }
      setHighlightPickerOpen(true);
      setColorPickerOpen(false);
      setBlockDropdownOpen(false);
    }
  }, [highlightPickerOpen]);

  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);

  const saveSelection = useCallback(() => {
    const editor = editorRef?.current;
    if (!editor) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, [editorRef]);

  // Restore saved selection range to ensure commands target the exact selection
  const restoreSavedRange = useCallback(() => {
    const editor = editorRef?.current;
    if (!editor || !savedRangeRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, [editorRef]);

  // Check active format states
  const checkActiveFormats = useCallback(() => {
    const editor = editorRef?.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    if (!editor.contains(sel.anchorNode)) return;

    // Save active range
    savedRangeRef.current = sel.getRangeAt(0).cloneRange();

    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");
      const isStrike = document.queryCommandState("strikeThrough");
      const isSuper = document.queryCommandState("superscript");
      const isSub = document.queryCommandState("subscript");
      const isJustLeft = document.queryCommandState("justifyLeft");
      const isJustCenter = document.queryCommandState("justifyCenter");
      const isJustRight = document.queryCommandState("justifyRight");
      const isJustFull = document.queryCommandState("justifyFull");
      const rawBlock = (
        document.queryCommandValue("formatBlock") || "p"
      ).toLowerCase();
      const inTodo = isSelectionInTodo(editor);
      const isBulletList = document.queryCommandState("insertUnorderedList");
      const isNumberedList = document.queryCommandState("insertOrderedList");
      const isMultilevel = isSelectionInMultilevelList(editor);
      const isHighlight = isSelectionHighlighted(editor);
      const isColor = isSelectionColored(editor);

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikeThrough: isStrike,
        superscript: isSuper,
        subscript: isSub,
        justifyLeft: isJustLeft,
        justifyCenter: isJustCenter,
        justifyRight: isJustRight,
        justifyFull: isJustFull,
        formatBlock: rawBlock,
        isTodo: inTodo,
        isBulletList,
        isNumberedList,
        isMultilevel,
        isHighlight,
        isColor,
      });
    } catch {}
  }, [editorRef]);

    // Listen to selection changes
  useEffect(() => {
    document.addEventListener("selectionchange", checkActiveFormats);
    return () =>
      document.removeEventListener("selectionchange", checkActiveFormats);
  }, [checkActiveFormats]);

  // ============================================================
  // 10-Second Auto-Hide Engine for Formatting Toolbar
  // ============================================================
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const autoHideTimerRef = useRef(null);
  const isHoveringRef = useRef(false);

  const hasActiveDropdown = Boolean(
    colorPickerOpen ||
    highlightPickerOpen ||
    blockDropdownOpen ||
    paperPickerOpen
  );
  const hasActiveDropdownRef = useRef(hasActiveDropdown);
  hasActiveDropdownRef.current = hasActiveDropdown;

  // Start or reset 10-second countdown to slide formatting bar up
  const start10SecondTimer = useCallback(() => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    if (!autoHide) {
      setIsToolbarVisible(true);
      return;
    }
    autoHideTimerRef.current = setTimeout(() => {
      // Hide ONLY if user is not hovering the toolbar and no dropdown is open
      if (!isHoveringRef.current && !hasActiveDropdownRef.current) {
        setIsToolbarVisible(false);
      }
    }, 10000); // 10 seconds
  }, [autoHide]);

  // When autoHide toggles:
  // If true -> keep visible initially, start 10s timer
  // If false (pinned) -> cancel timer, remain permanently fixed
  useEffect(() => {
    if (autoHide) {
      setIsToolbarVisible(true);
      start10SecondTimer();
    } else {
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
      setIsToolbarVisible(true);
    }
    return () => {
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [autoHide, start10SecondTimer]);

  // When dropdowns open, keep visible; when closed, restart 10s countdown
  useEffect(() => {
    if (hasActiveDropdown) {
      setIsToolbarVisible(true);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    } else if (autoHide && !isHoveringRef.current) {
      start10SecondTimer();
    }
  }, [hasActiveDropdown, autoHide, start10SecondTimer]);

  // Mouse enters toolbar: pause countdown, stay visible
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    setIsToolbarVisible(true);
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
  };

  // Mouse leaves toolbar: start 10s countdown
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    start10SecondTimer();
  };

  // Proximity detector: if mouse enters top area (<= 96px from top), slide toolbar down for 10s
  useEffect(() => {
    if (!autoHide) return;
    const handleMouseMove = (e) => {
      if (e.clientY <= 96) {
        setIsToolbarVisible(true);
        start10SecondTimer();
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [autoHide, start10SecondTimer]);

  // Click outside listener to dismiss popovers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest(`.${Style.popoverWrapper}`) &&
        !e.target.closest(`.${Style.palettePopover}`) &&
        !e.target.closest(`.${Style.blockMenu}`) &&
        !e.target.closest(`.${Style.paperMenu}`) &&
        (!paperPortalRef.current || !paperPortalRef.current.contains(e.target))
      ) {
        setColorPickerOpen(false);
        setHighlightPickerOpen(false);
        setBlockDropdownOpen(false);
        setPaperPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Update dropdown & palette positions on resize or scroll
  useEffect(() => {
    if (!blockDropdownOpen && !colorPickerOpen && !highlightPickerOpen && !paperPickerOpen) return;
    const updateRects = () => {
      if (blockDropdownOpen && blockWrapRef.current) {
        setBlockRect(blockWrapRef.current.getBoundingClientRect());
      }
      if (colorPickerOpen && colorWrapRef.current) {
        setColorRect(colorWrapRef.current.getBoundingClientRect());
      }
      if (highlightPickerOpen && highlightWrapRef.current) {
        setHighlightRect(highlightWrapRef.current.getBoundingClientRect());
      }
      if (paperPickerOpen && paperWrapRef.current) {
        setPaperRect(paperWrapRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", updateRects);
    window.addEventListener("scroll", updateRects, true);
    return () => {
      window.removeEventListener("resize", updateRects);
      window.removeEventListener("scroll", updateRects, true);
    };
  }, [blockDropdownOpen, colorPickerOpen, highlightPickerOpen, paperPickerOpen]);

  // Execute standard inline formatting toggle (Bold, Italic, Underline, Strike)
  const executeToggleFormat = (cmd) => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    editor.focus();

    try {
      document.execCommand(cmd, false, null);
    } catch {}

    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Multilevel list (1. > 1.1 > 1.1.1)
  const handleToggleMultilevelList = () => {
    restoreSavedRange();
    toggleMultilevelList(editorRef.current);
    if (onContentChange) onContentChange(true);
    setTimeout(checkActiveFormats, 20);
  };

  // Font family change
  const handleSelectFont = (font) => {
    const editor = editorRef?.current;
    if (editor) {
      restoreSavedRange();
      editor.focus();
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && editor.contains(sel.anchorNode)) {
        try {
          document.execCommand("fontName", false, font.name);
        } catch {
          const span = document.createElement("span");
          span.style.fontFamily = font.family;
          const range = sel.getRangeAt(0);
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
        if (onContentChange) onContentChange(true);
      }
    }
    if (onSelectFontFamily) {
      onSelectFontFamily(font.id);
    }
  };

  // Block change (Normal / H1 / H2 / H3)
  const handleSelectBlock = (tag) => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    setBlockFormat(editor, tag);
    setBlockDropdownOpen(false);
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Text color (Apply or Remove)
  const handleApplyColor = (color) => {
    const editor = editorRef?.current;
    if (!editor) return;
    editor.focus();
    restoreSavedRange();
    applyTextColor(editor, color);
    if (color !== "inherit") setCurrentTextColor(color);
    setColorPickerOpen(false);
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Direct highlight button toggle (Clicking highlights selected text or removes highlight)
  const handleToggleHighlight = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    editor.focus();
    restoreSavedRange();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      toggleHighlightPicker();
      return;
    }

    if (activeFormats.isHighlight) {
      applyHighlightColor(editor, "transparent");
    } else {
      applyHighlightColor(editor, currentHighlightColor || "#fef08a");
    }

    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Direct text color button toggle
  const handleToggleTextColor = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    editor.focus();
    restoreSavedRange();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      toggleColorPicker();
      return;
    }

    if (activeFormats.isColor) {
      applyTextColor(editor, "inherit");
    } else {
      applyTextColor(editor, currentTextColor || "#dc2626");
    }

    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Highlight color (Apply or Remove)
  const handleApplyHighlight = (color) => {
    const editor = editorRef?.current;
    if (!editor) return;
    editor.focus();
    restoreSavedRange();
    applyHighlightColor(editor, color);
    if (color !== "transparent") setCurrentHighlightColor(color);
    setHighlightPickerOpen(false);
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // To-Do Toggle: converts normal text to to-do, or converts existing to-do BACK to normal text!
  const handleToggleTodo = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    toggleTodoSelection(editor);
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Bulleted (Unordered) List Toggle
  const handleToggleBulletList = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    toggleListSelection(editor, "unordered");
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Numbered (Ordered) List Toggle
  const handleToggleNumberedList = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    toggleListSelection(editor, "ordered");
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // Clear all formatting
  const handleClearFormat = () => {
    const editor = editorRef?.current;
    if (!editor) return;
    restoreSavedRange();
    clearFormattingFromSelection(editor);
    checkActiveFormats();
    if (onContentChange) onContentChange(true);
  };

  // File input
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && onInsertImage) {
      onInsertImage(files);
    }
    e.target.value = "";
  };

  const currentBlockLabel =
    BLOCK_OPTIONS.find((b) => b.value === activeFormats.formatBlock)?.label ||
    "Normal text";


  // MS Word Ribbon Alt Key Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Alt") {
        if (!isInput && propAltKeyActive === undefined) {
          e.preventDefault();
          setAltKeyActive((prev) => !prev);
        }
        return;
      }

      if (e.key === "Escape" && altKeyActive) {
        if (onDismissAltKeytips) onDismissAltKeytips();
        else setAltKeyActive(false);
        return;
      }

      if (altShortcutsEnabled && (altKeyActive || e.altKey) && !isInput) {
        const k = e.key.toLowerCase();
        let handled = true;
        switch (k) {
          case "b": executeToggleFormat("bold"); break;
          case "i": executeToggleFormat("italic"); break;
          case "u": executeToggleFormat("underline"); break;
          case "k": executeToggleFormat("strikeThrough"); break;
          case "p": executeToggleFormat("superscript"); break;
          case "x": executeToggleFormat("subscript"); break;
          case "l": executeToggleFormat("justifyLeft"); break;
          case "e": executeToggleFormat("justifyCenter"); break;
          case "r": executeToggleFormat("justifyRight"); break;
          case "j": executeToggleFormat("justifyFull"); break;
          case "t": handleToggleTodo(); break;
          case "o": handleToggleBulletList(); break;
          case "n": handleToggleNumberedList(); break;
          case "c": onOpenComments && onOpenComments(); break;
          case "g": onOpenTranslate && onOpenTranslate(); break;
          case "v": handleToggleMultilevelList(); break;
          case "d": onToggleReadMode && onToggleReadMode(); break;
          case "?": onOpenShortcuts && onOpenShortcuts(); break;
          default: handled = false;
        }
        if (handled) {
          e.preventDefault();
          if (onDismissAltKeytips) onDismissAltKeytips();
          else setAltKeyActive(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [altKeyActive, altShortcutsEnabled, onDismissAltKeytips, onOpenComments, onOpenTranslate, onToggleBookLayout, onToggleReadMode, onOpenShortcuts, propAltKeyActive]);

  return (
    <div
      className={`${Style.toolbar} ${darkMode ? Style.darkToolbar : ""} ${
        autoHide ? Style.autoHideMode : ""
      } ${
        autoHide
          ? isToolbarVisible || hasActiveDropdown
            ? Style.autoHideVisible
            : Style.autoHideHidden
          : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label="Rich text editor formatting"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />



      {/* 240+ Fonts Searchable Dropdown */}
      <FontSelectorDropdown
        currentFont={fontFamily}
        onSelectFont={handleSelectFont}
        darkMode={darkMode}
      />

      <div className={Style.divider} />

      {/* Text Style Dropdown (Non-blurring custom dropdown) */}
      <div className={Style.popoverWrapper} ref={blockWrapRef}>
        <button
          type="button"
          className={`${Style.blockDropdownBtn} ${
            darkMode ? Style.darkBlockDropdownBtn : ""
          } ${blockDropdownOpen ? Style.activeBlockDropdownBtn : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockDropdown();
          }}
          onClick={(e) => {
            e.preventDefault();
            toggleBlockDropdown();
          }}
          title="Text Style"
          aria-label="Text Style"
        >
          <span>{currentBlockLabel}</span>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }}></i>
        </button>

        {blockDropdownOpen &&
          blockRect &&
          createPortal(
            <div
              className={`${Style.palettePopover} ${Style.blockMenu} ${
                darkMode ? Style.darkPalettePopover : ""
              }`}
              style={{
                position: "fixed",
                top: blockRect.bottom + 6,
                left: Math.max(8, Math.min(blockRect.left, (window.innerWidth || 360) - 200)),
                zIndex: 99999,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {BLOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${Style.blockMenuItem} ${
                    activeFormats.formatBlock === opt.value
                      ? Style.activeBlockMenuItem
                      : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectBlock(opt.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectBlock(opt.value);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>,
            document.body,
          )}
      </div>

      <div className={Style.divider} />

      {/* Inline Formats: Bold, Italic, Underline, Strikethrough, Superscript, Subscript */}
      <div className={Style.group}>
        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.bold ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("bold");
          }}
          title="Bold (Ctrl+B / Alt+B)"
          aria-label="Bold"
        >
          <i className="fa-solid fa-bold"></i>
          {altKeyActive && <span className={Style.keytipBadge}>B</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.italic ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("italic");
          }}
          title="Italic (Ctrl+I / Alt+I)"
          aria-label="Italic"
        >
          <i className="fa-solid fa-italic"></i>
          {altKeyActive && <span className={Style.keytipBadge}>I</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.underline ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("underline");
          }}
          title="Underline (Ctrl+U / Alt+U)"
          aria-label="Underline"
        >
          <i className="fa-solid fa-underline"></i>
          {altKeyActive && <span className={Style.keytipBadge}>U</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.strikeThrough ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("strikeThrough");
          }}
          title="Strikethrough (Alt+K)"
          aria-label="Strikethrough"
        >
          <i className="fa-solid fa-strikethrough"></i>
          {altKeyActive && <span className={Style.keytipBadge}>K</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.superscript ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("superscript");
          }}
          title="Superscript x² (Alt+P)"
          aria-label="Superscript"
        >
          <i className="fa-solid fa-superscript"></i>
          {altKeyActive && <span className={Style.keytipBadge}>P</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.subscript ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("subscript");
          }}
          title="Subscript x₂ (Alt+X)"
          aria-label="Subscript"
        >
          <i className="fa-solid fa-subscript"></i>
          {altKeyActive && <span className={Style.keytipBadge}>X</span>}
        </button>
      </div>

      <div className={Style.divider} />

      {/* Alignment Controls: Left, Center, Right, Justify */}
      <div className={Style.group}>
        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.justifyLeft ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("justifyLeft");
          }}
          title="Align Left (Alt+L)"
          aria-label="Align Left"
        >
          <i className="fa-solid fa-align-left"></i>
          {altKeyActive && <span className={Style.keytipBadge}>L</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.justifyCenter ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("justifyCenter");
          }}
          title="Align Center (Alt+E)"
          aria-label="Align Center"
        >
          <i className="fa-solid fa-align-center"></i>
          {altKeyActive && <span className={Style.keytipBadge}>E</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.justifyRight ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("justifyRight");
          }}
          title="Align Right (Alt+R)"
          aria-label="Align Right"
        >
          <i className="fa-solid fa-align-right"></i>
          {altKeyActive && <span className={Style.keytipBadge}>R</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.justifyFull ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("justifyFull");
          }}
          title="Justify (Alt+J)"
          aria-label="Justify"
        >
          <i className="fa-solid fa-align-justify"></i>
          {altKeyActive && <span className={Style.keytipBadge}>J</span>}
        </button>
      </div>

      <div className={Style.divider} />

      {/* Text color picker with split button */}
      <div className={Style.popoverWrapper} ref={colorWrapRef}>
        <div className={Style.splitToolBtnGroup}>
          <button
            type="button"
            className={`${Style.toolBtn} ${
              activeFormats.isColor ? Style.activeToolBtn : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => {
              e.preventDefault();
              handleToggleTextColor();
            }}
            title="Text color (Click to apply color)"
            aria-label="Text color"
          >
            <i className="fa-solid fa-font"></i>
            <span
              className={Style.colorBar}
              style={{ backgroundColor: currentTextColor || "#dc2626" }}
            />
          </button>
          <button
            type="button"
            className={`${Style.toolBtnChevron} ${
              colorPickerOpen ? Style.activeToolBtn : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleColorPicker();
            }}
            title="Text color options"
            aria-label="Text color options"
          >
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>

        {colorPickerOpen &&
          colorRect &&
          createPortal(
            <div
              className={`${Style.palettePopover} ${
                darkMode ? Style.darkPalettePopover : ""
              }`}
              style={{
                position: "fixed",
                top: colorRect.bottom + 6,
                left: Math.max(8, Math.min(colorRect.left, (window.innerWidth || 360) - 240)),
                zIndex: 99999,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className={Style.paletteTitle}>Text Color</div>
              <div className={Style.paletteGrid}>
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={Style.colorSwatch}
                    style={{
                      backgroundColor:
                        c.color === "inherit"
                          ? darkMode
                            ? "#fff"
                            : "#111"
                          : c.color,
                      outline:
                        currentTextColor === c.color ? "2px solid #6366f1" : "none",
                      outlineOffset: "1px",
                    }}
                    title={c.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyColor(c.color);
                    }}
                  />
                ))}
              </div>
              <div className={Style.customColorRow}>
                <label className={Style.customColorLabel}>
                  <input
                    type="color"
                    value={
                      currentTextColor?.startsWith("#")
                        ? currentTextColor
                        : "#dc2626"
                    }
                    onChange={(e) => handleApplyColor(e.target.value)}
                    className={Style.customColorInput}
                  />
                  <span>Custom Color...</span>
                </label>
              </div>
            </div>,
            document.body,
          )}
      </div>

      {/* Highlighter color picker with split button (Click highlights selected text directly!) */}
      <div className={Style.popoverWrapper} ref={highlightWrapRef}>
        <div className={Style.splitToolBtnGroup}>
          <button
            type="button"
            className={`${Style.toolBtn} ${
              activeFormats.isHighlight ? Style.activeToolBtn : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => {
              e.preventDefault();
              handleToggleHighlight();
            }}
            title="Highlight text (Click to highlight / remove)"
            aria-label="Highlight text"
          >
            <i className="fa-solid fa-highlighter"></i>
            <span
              className={Style.colorBar}
              style={{ backgroundColor: currentHighlightColor || "#fef08a" }}
            />
          </button>
          <button
            type="button"
            className={`${Style.toolBtnChevron} ${
              highlightPickerOpen ? Style.activeToolBtn : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleHighlightPicker();
            }}
            title="Highlight color options"
            aria-label="Highlight color options"
          >
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>

        {highlightPickerOpen &&
          highlightRect &&
          createPortal(
            <div
              className={`${Style.palettePopover} ${
                darkMode ? Style.darkPalettePopover : ""
              }`}
              style={{
                position: "fixed",
                top: highlightRect.bottom + 6,
                left: Math.max(8, Math.min(highlightRect.left, (window.innerWidth || 360) - 240)),
                zIndex: 99999,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className={Style.paletteTitle}>Highlight Color</div>
              <div className={Style.paletteGrid}>
                {HIGHLIGHT_PALETTE.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={Style.colorSwatch}
                    style={{
                      backgroundColor:
                        c.color === "transparent" ? "transparent" : c.color,
                      border:
                        c.color === "transparent"
                          ? "1px dashed #999"
                          : "1px solid rgba(0,0,0,0.15)",
                      outline:
                        currentHighlightColor === c.color &&
                        c.color !== "transparent"
                          ? "2px solid #6366f1"
                          : "none",
                      outlineOffset: "1px",
                    }}
                    title={c.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyHighlight(c.color);
                    }}
                  />
                ))}
              </div>
              <div className={Style.customColorRow}>
                <label className={Style.customColorLabel}>
                  <input
                    type="color"
                    value={
                      currentHighlightColor?.startsWith("#")
                        ? currentHighlightColor
                        : "#fef08a"
                    }
                    onChange={(e) => handleApplyHighlight(e.target.value)}
                    className={Style.customColorInput}
                  />
                  <span>Custom Color...</span>
                </label>
              </div>
            </div>,
            document.body,
          )}
      </div>

      <div className={Style.divider} />

      {/* Checklist / To-do button: Toggles To-do On/Off */}
      <div className={Style.group}>
        <button
          type="button"
          className={`${Style.toolBtn} ${Style.todoBtn} ${
            activeFormats.isTodo ? Style.activeTodoBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            handleToggleTodo();
          }}
          title={
            activeFormats.isTodo
              ? "Remove To-do (Convert to Normal Text)"
              : "Convert to To-do Checklist"
          }
          aria-label="To-Do"
        >
          <i className="fa-solid fa-list-check"></i>
          <span className={Style.btnLabel}>
            {activeFormats.isTodo ? "To-Do ✓" : "To-Do"}
          </span>
        </button>
      </div>

      {/* Bulleted & Numbered Lists */}
      <div className={Style.group}>
        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.isBulletList ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            saveSelection();
            e.preventDefault();
          }}
          onClick={handleToggleBulletList}
          title={
            activeFormats.isBulletList
              ? "Remove Bulleted List"
              : "Bulleted List (Unordered)"
          }
          aria-label="Bulleted List"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.isNumberedList ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            saveSelection();
            e.preventDefault();
          }}
          onClick={handleToggleNumberedList}
          title={
            activeFormats.isNumberedList
              ? "Remove Numbered List"
              : "Numbered List (Ordered / Alt+N)"
          }
          aria-label="Numbered List"
        >
          <i className="fa-solid fa-list-ol"></i>
          {altKeyActive && <span className={Style.keytipBadge}>N</span>}
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            activeFormats.isMultilevel ? Style.activeToolBtn : ""
          }`}
          onMouseDown={(e) => {
            saveSelection();
            e.preventDefault();
          }}
          onClick={handleToggleMultilevelList}
          title={
            activeFormats.isMultilevel
              ? "Remove Multilevel List"
              : "Multilevel List (1. > 1.1 > 1.1.1 / Alt+V)"
          }
          aria-label="Multilevel List"
          style={{ position: "relative" }}
        >
          <i className="fa-solid fa-bars-staggered"></i>
          <span style={{ fontSize: "9px", fontWeight: "700", marginLeft: "2px", opacity: 0.9 }}>1.1</span>
          {altKeyActive && <span className={Style.keytipBadge}>V</span>}
        </button>

        {/* Indent / Outdent nested list formatting */}
        <button
          type="button"
          className={Style.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("outdent");
          }}
          title="Decrease Indent / Outdent (Shift+Tab)"
          aria-label="Decrease Indent"
        >
          <i className="fa-solid fa-outdent"></i>
        </button>

        <button
          type="button"
          className={Style.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            executeToggleFormat("indent");
          }}
          title="Increase Indent / Nested List (Tab)"
          aria-label="Increase Indent"
        >
          <i className="fa-solid fa-indent"></i>
        </button>
      </div>

      <div className={Style.divider} />

      {/* Digital Pen & Eraser Tools */}
      <div className={Style.group}>
        {/* Pen / Drawing Mode Toggle */}
        <button
          type="button"
          className={`${Style.toolBtn} ${Style.penBtn} ${
            isPenMode && penTool === "pen" ? Style.activePenBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (isPenMode) {
              if (penTool === "eraser") {
                if (onSetPenTool) onSetPenTool("pen");
              } else {
                if (onTogglePenMode) onTogglePenMode();
              }
            } else {
              if (onTogglePenMode) onTogglePenMode();
              if (onSetPenTool) onSetPenTool("pen");
            }
          }}
          title={
            isPenMode && penTool === "pen"
              ? "Pen active (Click to exit drawing mode)"
              : "Pen Tool (Write & Sketch on paper)"
          }
          aria-label="Pen"
        >
          <i className="fa-solid fa-pen-nib"></i>
          <span className={Style.btnLabel}>
            {isPenMode && penTool === "pen" ? "Pen ON" : "Pen"}
          </span>
        </button>

        {/* Eraser Tool */}
        <button
          type="button"
          className={`${Style.toolBtn} ${Style.eraserBtn} ${
            isPenMode && penTool === "eraser" ? Style.activeEraserBtn : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (isPenMode) {
              if (penTool === "eraser") {
                if (onSetPenTool) onSetPenTool("pen");
              } else {
                if (onSetPenTool) onSetPenTool("eraser");
              }
            } else {
              const sel = window.getSelection();
              if (
                sel &&
                !sel.isCollapsed &&
                editorRef?.current?.contains(sel.anchorNode)
              ) {
                handleClearFormat();
              } else {
                if (onTogglePenMode) onTogglePenMode();
                if (onSetPenTool) onSetPenTool("eraser");
              }
            }
          }}
          title={
            isPenMode && penTool === "eraser"
              ? "Eraser active (Click to switch back to Pen)"
              : "Eraser Tool (Erase drawing strokes or clear formatting)"
          }
          aria-label="Eraser"
        >
          <i className="fa-solid fa-eraser"></i>
          <span className={Style.btnLabel}>
            {isPenMode && penTool === "eraser" ? "Eraser ON" : "Eraser"}
          </span>
        </button>
      </div>

      <div className={Style.divider} />

      {/* Insert image group (From Device & From URL) */}
      <div className={Style.group}>
        <button
          type="button"
          className={Style.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          title="Insert image from computer"
          aria-label="Insert image from computer"
        >
          <i className="fa-solid fa-image"></i>
        </button>

        {onOpenImageUrl && (
          <button
            type="button"
            className={Style.toolBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenImageUrl();
            }}
            title="Insert image from web address (URL)"
            aria-label="Insert image from URL"
          >
            <i className="fa-solid fa-link"></i>
          </button>
        )}
      </div>

      {/* Comments, Translation, Book Mode, Read Mode, Shortcuts */}
      <div className={Style.divider} />
      <div className={Style.group}>
        {onOpenComments && (
          <button
            type="button"
            className={Style.toolBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenComments();
            }}
            title="Comments & Annotations (Alt+C)"
            aria-label="Comments"
          >
            <i className="fa-regular fa-comment-dots"></i>
            {commentsCount > 0 && (
              <span className={Style.commentsBadge}>{commentsCount}</span>
            )}
            {altKeyActive && <span className={Style.keytipBadge}>C</span>}
          </button>
        )}

        {onOpenTranslate && (
          <button
            type="button"
            className={Style.toolBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenTranslate();
            }}
            title="Translate selected text (Alt+G)"
            aria-label="Translate text"
          >
            <i className="fa-solid fa-language"></i>
            {altKeyActive && <span className={Style.keytipBadge}>G</span>}
          </button>
        )}

        {/* Book layout & Read mode removed per user request */}
      </div>

      {/* Quick Paper Style Selector */}
      {onSelectPaperType && (
        <>
          <div className={Style.divider} />
          <div className={Style.popoverWrapper} ref={paperWrapRef}>
            <button
              type="button"
              className={`${Style.toolBtn} ${Style.paperBtn} ${paperPickerOpen ? Style.activeToolBtn : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                togglePaperPicker();
              }}
              title="Paper Style Background"
              aria-label="Paper Style"
            >
              <i className="fa-solid fa-file-lines"></i>
              <span className={Style.btnLabel}>
                {TOOLBAR_PAPER_OPTIONS.find((p) => p.id === paperType)?.label.split(" ")[0] || "Paper"}
              </span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: "9px", marginLeft: "3px", opacity: 0.7 }}></i>
            </button>

            {paperPickerOpen &&
              paperRect &&
              createPortal(
                <div
                  ref={paperPortalRef}
                  className={`${Style.paperMenu} ${darkMode ? Style.darkPaperMenu : ""}`}
                  style={{
                    position: "fixed",
                    top: paperRect.bottom + 6,
                    left: Math.max(8, Math.min(paperRect.left, (window.innerWidth || 360) - 185)),
                    zIndex: 99999,
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className={Style.paperMenuTitle}>
                    Paper Style
                  </div>
                  {TOOLBAR_PAPER_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${Style.paperMenuItem} ${paperType === opt.id ? Style.activePaperMenuItem : ""}`}
                      onClick={() => {
                        onSelectPaperType(opt.id);
                        setPaperPickerOpen(false);
                      }}
                    >
                      <i className={opt.icon} style={{ width: "16px", textAlign: "center", marginRight: "8px" }}></i>
                      <span>{opt.label}</span>
                      {paperType === opt.id && (
                        <i className="fa-solid fa-check" style={{ marginLeft: "auto", color: "#6366f1" }}></i>
                      )}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default RichTextToolbar;
