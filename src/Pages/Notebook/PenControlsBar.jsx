import React from "react";
import { createPortal } from "react-dom";
import Style from "./PenControlsBar.module.css";

const PEN_COLORS = [
  { name: "Black", color: "#111827" },
  { name: "Blue", color: "#2563eb" },
  { name: "Red", color: "#dc2626" },
  { name: "Green", color: "#16a34a" },
  { name: "Yellow", color: "#eab308" },
  { name: "Purple", color: "#9333ea" },
];

const STROKE_WIDTHS = [
  { label: "Fine", width: 2 },
  { label: "Medium", width: 4 },
  { label: "Bold", width: 8 },
];

const PenControlsBar = ({
  darkMode,
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onClearDrawing,
  onClose,
}) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`${Style.penBar} ${darkMode ? Style.darkPenBar : ""}`}
      role="toolbar"
      aria-label="Pen drawing controls"
    >
      {/* Tool Selector: Pen, Highlighter, Eraser */}
      <div className={Style.toolGroup}>
        <button
          type="button"
          className={`${Style.toolBtn} ${
            tool === "pen" ? Style.activeToolBtn : ""
          }`}
          onClick={() => setTool("pen")}
          title="Pen Tool (Draw & Write)"
        >
          <i className="fa-solid fa-pen-nib"></i>
          <span className={Style.btnLabel}>Pen</span>
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            tool === "highlighter" ? Style.activeToolBtn : ""
          }`}
          onClick={() => setTool("highlighter")}
          title="Highlighter Tool"
        >
          <i className="fa-solid fa-highlighter"></i>
          <span className={Style.btnLabel}>Highlight</span>
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${
            tool === "eraser" ? Style.activeToolBtn : ""
          }`}
          onClick={() => setTool("eraser")}
          title="Eraser Tool (Erase Drawing)"
        >
          <i className="fa-solid fa-eraser"></i>
          <span className={Style.btnLabel}>Eraser</span>
        </button>
      </div>

      <div className={Style.divider} />

      {/* Colors (active in pen & highlighter modes) */}
      {tool !== "eraser" && (
        <>
          <div className={Style.colorGroup}>
            {PEN_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`${Style.colorDot} ${
                  color === c.color ? Style.activeColorDot : ""
                }`}
                style={{ backgroundColor: c.color }}
                onClick={() => setColor(c.color)}
                title={c.name}
              />
            ))}
          </div>

          <div className={Style.divider} />

          {/* Stroke Widths */}
          <div className={Style.widthGroup}>
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.label}
                type="button"
                className={`${Style.widthBtn} ${
                  strokeWidth === sw.width ? Style.activeWidthBtn : ""
                }`}
                onClick={() => setStrokeWidth(sw.width)}
                title={`${sw.label} stroke width`}
              >
                <span
                  className={Style.widthIndicator}
                  style={{
                    width: `${sw.width * 2 + 2}px`,
                    height: `${sw.width * 2 + 2}px`,
                    backgroundColor: color,
                  }}
                />
              </button>
            ))}
          </div>

          <div className={Style.divider} />
        </>
      )}

      {/* Clear Drawing & Done */}
      <div className={Style.toolGroup}>
        <button
          type="button"
          className={`${Style.toolBtn} ${Style.clearBtn}`}
          onClick={onClearDrawing}
          title="Clear all drawings from page"
        >
          <i className="fa-solid fa-trash-can"></i>
          <span className={Style.btnLabel}>Clear</span>
        </button>

        <button
          type="button"
          className={`${Style.toolBtn} ${Style.doneBtn}`}
          onClick={onClose}
          title="Done (Return to typing)"
        >
          <i className="fa-solid fa-check"></i>
          <span className={Style.btnLabel}>Done</span>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PenControlsBar;

