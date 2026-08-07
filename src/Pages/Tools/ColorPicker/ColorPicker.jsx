import { useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHsl = ({ r, g, b }) => {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      default:
        h = (rN - gN) / d + 4;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const ColorPicker = ({ darkMode }) => {
  const [hex, setHex] = useState("#4F5CFF");
  const [copiedField, setCopiedField] = useState("");

  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);
  const rgb = isValidHex ? hexToRgb(hex) : { r: 0, g: 0, b: 0 };
  const hsl = isValidHex ? rgbToHsl(rgb) : { h: 0, s: 0, l: 0 };

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const handleCopy = async (value, field) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch {
      return;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setHex("#4F5CFF");
  };

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Pick a Color</label>
          <input
            type="color"
            value={isValidHex ? hex : "#4F5CFF"}
            onChange={(e) => setHex(e.target.value)}
            className={inputCls(darkMode)}
            style={{ height: "48px", padding: "0.3rem", cursor: "pointer" }}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>Hex Value</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputCls(darkMode)}
            placeholder="#4F5CFF"
          />
        </div>
      </div>

      <div className={ToolsStyle.resultGrid}>
        {[
          { label: "HEX", value: hex.toUpperCase() },
          { label: "RGB", value: rgbString },
          { label: "HSL", value: hslString },
        ].map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => handleCopy(item.value, item.label)}
            className={`${ToolsStyle.resultItem} ${
              darkMode ? ToolsStyle.darkResultItem : ""
            }`}
            style={{ textAlign: "left", cursor: "pointer", border: "none", width: "100%" }}
          >
            <div className={ToolsStyle.resultLabel}>
              {item.label} {copiedField === item.label ? "· Copied" : ""}
            </div>
            <div className={ToolsStyle.resultValue}>{item.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
