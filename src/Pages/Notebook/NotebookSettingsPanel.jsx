import { useEffect, useRef } from "react";
import Style from "./NotebookSettingsPanel.module.css";

const FONT_OPTIONS = [
  { id: "poppins", label: "Poppins", family: "'Poppins', sans-serif" },
  { id: "inter", label: "Inter", family: "'Inter', sans-serif" },
  { id: "roboto", label: "Roboto", family: "'Roboto', sans-serif" },
  { id: "nunito", label: "Nunito", family: "'Nunito', sans-serif" },
  { id: "caveat", label: "Caveat", family: "'Caveat', cursive" },
  { id: "kalam", label: "Kalam", family: "'Kalam', cursive" },
  { id: "patrick", label: "Patrick Hand", family: "'Patrick Hand', cursive" },
];

const SIZE_OPTIONS = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
  { id: "xlarge", label: "Extra Large" },
];

const WIDTH_OPTIONS = [
  { id: "narrow", label: "Narrow" },
  { id: "medium", label: "Medium" },
  { id: "wide", label: "Wide" },
];

const LINE_HEIGHT_OPTIONS = [
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
  { id: "spacious", label: "Spacious" },
];

const NotebookSettingsPanel = ({
  darkMode,
  settings,
  onChange,
  onClose,
  toggleDarkMode,
}) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className={`${Style.panel} ${darkMode ? Style.darkPanel : ""}`}
    >
      <div className={Style.panelHeader}>
        <span>Settings</span>
        <button
          type="button"
          className={Style.closeBtn}
          onClick={onClose}
          aria-label="Close settings"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className={Style.section}>
        <p className={Style.sectionLabel}>Font Family</p>
        <div className={Style.fontGrid}>
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.id}
              type="button"
              style={{ fontFamily: font.family }}
              className={`${Style.optionBtn} ${
                settings.fontFamily === font.id ? Style.optionActive : ""
              }`}
              onClick={() => onChange("fontFamily", font.id)}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className={Style.section}>
        <p className={Style.sectionLabel}>Font Size</p>
        <div className={Style.pillRow}>
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${Style.optionBtn} ${
                settings.fontSize === opt.id ? Style.optionActive : ""
              }`}
              onClick={() => onChange("fontSize", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={Style.section}>
        <p className={Style.sectionLabel}>Theme</p>
        <div className={Style.pillRow}>
          <button
            type="button"
            className={`${Style.optionBtn} ${!darkMode ? Style.optionActive : ""}`}
            onClick={() => darkMode && toggleDarkMode()}
          >
            <i className="fa-solid fa-sun"></i> Light
          </button>
          <button
            type="button"
            className={`${Style.optionBtn} ${darkMode ? Style.optionActive : ""}`}
            onClick={() => !darkMode && toggleDarkMode()}
          >
            <i className="fa-solid fa-moon"></i> Dark
          </button>
        </div>
      </div>

      <div className={Style.section}>
        <p className={Style.sectionLabel}>Writing Width</p>
        <div className={Style.pillRow}>
          {WIDTH_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${Style.optionBtn} ${
                settings.writingWidth === opt.id ? Style.optionActive : ""
              }`}
              onClick={() => onChange("writingWidth", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={Style.section}>
        <p className={Style.sectionLabel}>Line Height</p>
        <div className={Style.pillRow}>
          {LINE_HEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${Style.optionBtn} ${
                settings.lineHeight === opt.id ? Style.optionActive : ""
              }`}
              onClick={() => onChange("lineHeight", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={Style.section}>
        <div className={Style.switchRow}>
          <span>Word Wrap</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.wordWrap}
            className={`${Style.switch} ${settings.wordWrap ? Style.switchOn : ""}`}
            onClick={() => onChange("wordWrap", !settings.wordWrap)}
          >
            <span className={Style.switchKnob}></span>
          </button>
        </div>

        <div className={Style.switchRow}>
          <span>Auto Save</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.autoSave}
            className={`${Style.switch} ${settings.autoSave ? Style.switchOn : ""}`}
            onClick={() => onChange("autoSave", !settings.autoSave)}
          >
            <span className={Style.switchKnob}></span>
          </button>
        </div>

        <div className={Style.switchRow}>
          <span>Show Notebook Statistics</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showStats}
            className={`${Style.switch} ${settings.showStats ? Style.switchOn : ""}`}
            onClick={() => onChange("showStats", !settings.showStats)}
          >
            <span className={Style.switchKnob}></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotebookSettingsPanel;