import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Style from "./MonacoCodeEditor.module.css";

const DETECTED_LANGUAGES = [
  { id: "html", label: "HTML5" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "css", label: "CSS3" },
  { id: "python", label: "Python" },
  { id: "json", label: "JSON" },
  { id: "markdown", label: "Markdown" },
  { id: "sql", label: "SQL" },
  { id: "plaintext", label: "Plain Text" },
];

/**
 * Automatically inspects source code snippet and infers Monaco language
 */
function inferLanguage(code = "") {
  if (!code || !code.trim()) return "html";
  const trimmed = code.trim();
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    /^\s*<[a-z][\s\S]*>/i.test(trimmed)
  ) {
    return "html";
  }
  if (/(?:[.#][\w-]+\s*\{[\s\S]*\}|@media\b)/i.test(trimmed)) {
    return "css";
  }
  if (/(?:def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\()/i.test(trimmed)) {
    return "python";
  }
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {}
  }
  if (/(?:const|let|var|function|console\.log|document\.|=>)/.test(trimmed)) {
    return "javascript";
  }
  return "plaintext";
}

const MonacoCodeEditor = ({
  value = "",
  onChange,
  darkMode = false,
  onRunCode,
  onSwitchToRichText,
  readOnly = false,
  fontSize = 14,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => inferLanguage(value));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const lastEmittedValueRef = useRef(value);

  const activeLanguage = useMemo(() => {
    return selectedLanguage || inferLanguage(value);
  }, [selectedLanguage, value]);

  // Synchronize external value changes (e.g. note switch, cloud sync) without interfering with active typing
  useEffect(() => {
    if (editorRef.current) {
      if (value !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = value;
        const currentModelVal = editorRef.current.getValue();
        if (currentModelVal !== value) {
          editorRef.current.setValue(value || "");
        }
      }
    }
  }, [value]);

  // Shortcut: Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 50);
  }, []);

  const handleEditorMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Shortcut: Ctrl+Enter / Cmd+Enter to Run Code in New Tab
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        if (onRunCode) onRunCode();
      });

      // Shortcut: Alt+Shift+F to Format Document
      editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
        handleFormat();
      });

      // Shortcut: F11 or Esc to toggle Fullscreen
      editor.addCommand(monaco.KeyCode.F11, () => {
        toggleFullscreen();
      });
    },
    [onRunCode, toggleFullscreen]
  );

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
      // Ensure formatted code is captured and saved immediately
      setTimeout(() => {
        if (editorRef.current && onChange) {
          const formatted = editorRef.current.getValue() || "";
          lastEmittedValueRef.current = formatted;
          onChange(formatted);
        }
      }, 100);
    }
  };

  const handleEditorChange = (val) => {
    const newVal = val || "";
    lastEmittedValueRef.current = newVal;
    if (onChange) {
      onChange(newVal);
    }
  };

  return (
    <div
      className={`${Style.monacoContainer} ${darkMode ? Style.darkContainer : ""} ${
        isFullscreen ? Style.fullscreenContainer : ""
      }`}
    >
      {/* Top action header for Monaco Editor */}
      <div className={`${Style.monacoHeader} ${darkMode ? Style.darkHeader : ""}`}>
        <div className={Style.headerLeft}>
          <div className={Style.badge} title="Stiknex Editor">
            <i className="fa-solid fa-code"></i>
            <span className={Style.badgeText}>Stiknex Editor</span>
          </div>

          {/* Language selector */}
          <select
            value={activeLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className={`${Style.languageSelect} ${darkMode ? Style.darkSelect : ""}`}
            aria-label="Select Code Language"
          >
            {DETECTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className={Style.headerRight}>
          {/* Format Code */}
          <button
            type="button"
            onClick={handleFormat}
            className={`${Style.actionBtn} ${darkMode ? Style.darkActionBtn : ""}`}
            title="Format Code (Alt+Shift+F)"
            aria-label="Format Code"
          >
            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "#38bdf8" }}></i>
            <span className={Style.btnText}>Format</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`${Style.actionBtn} ${
              isFullscreen ? Style.fullscreenBtnActive : Style.fullscreenBtn
            } ${darkMode ? Style.darkActionBtn : ""}`}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand to Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Full Page"}
          >
            <i className={isFullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}></i>
            <span className={Style.btnText}>{isFullscreen ? "Exit Fullscreen" : "Full Page"}</span>
          </button>

          {/* Run Code in New Tab */}
          {onRunCode && (
            <button
              type="button"
              onClick={onRunCode}
              className={`${Style.actionBtn} ${Style.runBtn}`}
              title="Run HTML/CSS/JS in Live Preview Tab (Ctrl+Enter)"
              aria-label="Run Code"
            >
              <i className="fa-solid fa-play"></i>
              <span className={Style.btnText}>Run</span>
            </button>
          )}

          {/* Switch back to Rich Text Notepad */}
          {onSwitchToRichText && (
            <button
              type="button"
              onClick={onSwitchToRichText}
              className={`${Style.actionBtn} ${Style.switchBtn} ${darkMode ? Style.darkActionBtn : ""}`}
              title="Scroll up to Paper Notes (Code remains safely preserved)"
              aria-label="Paper Notes"
            >
              <i className="fa-solid fa-file-lines" style={{ color: "#f59e0b" }}></i>
              <span className={Style.btnText}>Paper Notes</span>
              <i className={`fa-solid fa-arrow-up ${Style.upArrow}`} style={{ fontSize: "10px", opacity: 0.8 }}></i>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Monaco Editor */}
      <div className={Style.editorArea}>
        <Editor
          height="100%"
          width="100%"
          language={activeLanguage}
          value={value}
          onChange={handleEditorChange}
          theme={darkMode ? "vs-dark" : "light"}
          onMount={handleEditorMount}
          loading={
            <div className={Style.loadingSkeleton}>
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-sky-500"></i>
              <span>Loading Stiknex Editor…</span>
            </div>
          }
          options={{
            readOnly,
            fontSize,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
            fontLigatures: true,
            tabSize: 2,
            insertSpaces: true,
            lineNumbers: "on",
            renderWhitespace: "selection",
            minimap: { enabled: true, maxColumn: 80 },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            folding: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnPaste: false,
            formatOnType: false,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonacoCodeEditor;
