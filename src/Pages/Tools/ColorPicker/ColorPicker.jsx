import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import ToolsStyle from "../Tools.module.css";

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
      case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
      case gN: h = (bN - rN) / d + 2; break;
      default: h = (rN - gN) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const ColorPicker = ({ darkMode }) => {
  const [hex, setHex] = useState("#4F5CFF");
  const [copiedField, setCopiedField] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (window.EyeDropper) setIsSupported(true);
  }, []);

  const isValidHex = /^#[0-9A-Fa-f]{6}$/i.test(hex) || /^#[0-9A-Fa-f]{3}$/i.test(hex);
  const safeHex = isValidHex ? (hex.length === 4 ? "#" + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3] : hex) : "#000000";
  
  const rgb = hexToRgb(safeHex);
  const hsl = rgbToHsl(rgb);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const tailwindBg = `bg-[${safeHex}]`;
  const tailwindText = `text-[${safeHex}]`;

  const handleCopy = async (value, field) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch {
      return;
    }
  };

  const handlePickColor = async () => {
    if (!window.EyeDropper) return;
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setHex(result.sRGBHex);
    } catch (e) {
      // User canceled or error
    }
  };

  const handleHexInput = (e) => {
    const val = e.target.value;
    if (val.startsWith("#") || val === "") setHex(val);
    else setHex("#" + val);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      
      {/* Visual Color Picker (React Colorful) */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-full sm:w-auto flex-shrink-0 mx-auto sm:mx-0">
          <HexColorPicker color={safeHex} onChange={setHex} style={{ width: "240px", height: "240px" }} />
        </div>
        
        <div className="flex flex-col gap-4 w-full flex-1">
          <div className="flex items-center gap-3">
            <div 
              className="w-16 h-16 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
              style={{ backgroundColor: safeHex }}
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={hex}
                onChange={handleHexInput}
                className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono text-lg font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors`}
              />
            </div>
          </div>
          
          <button
            onClick={handlePickColor}
            disabled={!isSupported}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isSupported 
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-eye-dropper"></i>
            {isSupported ? "Pick from Screen" : "EyeDropper not supported in this browser"}
          </button>
        </div>
      </div>

      {/* Snippets / Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {[
          { label: "HEX", value: safeHex.toUpperCase() },
          { label: "RGB", value: rgbString },
          { label: "HSL", value: hslString },
          { label: "Tailwind BG", value: tailwindBg },
        ].map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => handleCopy(item.value, item.label)}
            className="flex flex-col text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors relative group"
          >
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">{item.label}</div>
            <div className="font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">{item.value}</div>
            
            <div className={`absolute top-4 right-4 text-xs font-bold ${copiedField === item.label ? "text-green-500" : "text-transparent group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors"}`}>
              {copiedField === item.label ? "Copied!" : "Copy"}
            </div>
          </button>
        ))}
      </div>

      {/* Code Snippet Box (ColorZilla Style) */}
      <div className="bg-[#1e1e1e] rounded-xl p-4 border border-slate-800 relative font-mono text-sm shadow-inner">
        <div className="text-green-400 mb-1">/* Tailwind CSS Arbitrary Value */</div>
        <div className="text-sky-300">
          {".focus\\:bg-\\["}
          <span className="text-orange-300">
            {safeHex}
          </span>
          {"\\]\\:focus {"}
        </div>
        <div className="pl-4 text-slate-300">
          background-color: <span className="text-orange-300">{safeHex}</span>;
        </div>
        <div className="text-sky-300">{"}"}</div>
      </div>
      
    </div>
  );
};

export default ColorPicker;
