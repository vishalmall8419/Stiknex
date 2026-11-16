import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Pipette,
  Layers,
  Sparkles,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  AlertCircle,
  Eye,
  Type,
  Maximize2,
  Box,
  Compass,
  Play
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   DESIGN & CSS GENERATORS METADATA
   ========================================================================================= */
const DESIGN_TOOLS = [
  { slug: "color-picker", title: "Color Picker", highlight: "INSPECTOR", tag: "Hex, RGB & HSL", desc: "Interactive color picker with harmonies, shades, and CSS exports", icon: <Palette size={16} /> },
  { slug: "hex-to-rgb", title: "HEX to RGB", highlight: "CONVERTER", tag: "RGB & RGBA", desc: "Convert hexadecimal web colors to RGB / RGBA values", icon: <Pipette size={16} /> },
  { slug: "rgb-to-hex", title: "RGB to HEX", highlight: "CONVERTER", tag: "#RRGGBB Format", desc: "Convert red, green, blue color channels into 6-digit hex codes", icon: <Pipette size={16} /> },
  { slug: "hsl-converter", title: "HSL Converter", highlight: "COLOR SPACE", tag: "Hue, Sat, Light", desc: "Transform between HSL, RGB, and HEX color spaces", icon: <Sliders size={16} /> },
  { slug: "contrast-checker", title: "Contrast Checker", highlight: "WCAG 2.1", tag: "AA & AAA Ratings", desc: "Test foreground and background text readability against WCAG standards", icon: <Eye size={16} /> },
  { slug: "gradient-generator", title: "CSS Gradient", highlight: "GENERATOR", tag: "Linear & Radial", desc: "Design multi-stop CSS gradients with angle controls and code export", icon: <Layers size={16} /> },
  { slug: "box-shadow-generator", title: "Box Shadow", highlight: "CSS STYLING", tag: "Blur, Spread & Inset", desc: "Create smooth, realistic multi-layer CSS box shadows", icon: <Box size={16} /> },
  { slug: "border-radius-generator", title: "Border Radius", highlight: "CSS CURVATURE", tag: "Independent Corners", desc: "Fine-tune 8-value CSS border radiuses with visual container preview", icon: <Compass size={16} /> },
  { slug: "css-clamp-generator", title: "CSS Clamp", highlight: "FLUID TYPOGRAPHY", tag: "clamp(min, val, max)", desc: "Calculate fluid typography and responsive spacing clamps without media queries", icon: <Type size={16} /> },
  { slug: "css-animation-previewer", title: "CSS Animations", highlight: "KEYFRAMES", tag: "Easing & Timing", desc: "Preview and customize CSS keyframe animations with one-click CSS export", icon: <Play size={16} /> }
];

export default function DesignEngine({ slug = "color-picker", toolId = "color-picker" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "color-picker");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
    }
  }, [slug]);

  const handleSelectTool = (targetSlug) => {
    setActiveSlug(targetSlug);
    window.history.replaceState(null, "", `/${targetSlug}`);
  };

  const copyText = useCallback((txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentTool = useMemo(() => {
    return DESIGN_TOOLS.find((t) => t.slug === activeSlug) || DESIGN_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return DESIGN_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Design & Styling Tools"
        onFeedback={openFeedback}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Tools Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/tools" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
            <span>Tools</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white capitalize">Design</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/tools"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            All 200 Tools
          </Link>
        </div>
      </header>

      {/* Horizontal Tool Selector Tab Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {DESIGN_TOOLS.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <button
                key={tool.slug}
                onClick={() => handleSelectTool(tool.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                {currentTool.highlight}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{currentTool.tag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {currentTool.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={13} /> 100% Client-Side CSS
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "color-picker" && <ColorPickerTool copyText={copyText} copied={copied} />}
          {activeSlug === "hex-to-rgb" && <HexToRgbTool copyText={copyText} copied={copied} />}
          {activeSlug === "rgb-to-hex" && <RgbToHexTool copyText={copyText} copied={copied} />}
          {activeSlug === "hsl-converter" && <HslConverterTool copyText={copyText} copied={copied} />}
          {activeSlug === "contrast-checker" && <ContrastCheckerTool copyText={copyText} copied={copied} />}
          {activeSlug === "gradient-generator" && <GradientGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "box-shadow-generator" && <BoxShadowTool copyText={copyText} copied={copied} />}
          {activeSlug === "border-radius-generator" && <BorderRadiusTool copyText={copyText} copied={copied} />}
          {activeSlug === "css-clamp-generator" && <CssClampTool copyText={copyText} copied={copied} />}
          {activeSlug === "css-animation-previewer" && <CssAnimationTool copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================================
   TOOL 1: COLOR PICKER & INSPECTOR
   ========================================================================================= */
function ColorPickerTool({ copyText, copied }) {
  const [color, setColor] = useState("#4f46e5");

  const colorData = useMemo(() => {
    let hex = color.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;

    // Convert to HSL
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    return {
      hex: `#${hex.toUpperCase()}`,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      r, g, b
    };
  }, [color]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-20 rounded-2xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Select Color Swatch</span>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-mono text-base font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "HEX Code", val: colorData.hex },
              { label: "RGB Value", val: colorData.rgb },
              { label: "HSL Value", val: colorData.hsl }
            ].map((fmt) => (
              <div key={fmt.label} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{fmt.label}: <strong className="text-slate-900 dark:text-white font-mono">{fmt.val}</strong></span>
                <button onClick={() => copyText(fmt.val)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  <Copy size={13} /> Copy
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Large Preview */}
        <div
          className="h-64 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-white text-center transition-colors border"
          style={{ backgroundColor: color }}
        >
          <span className="text-2xl font-black font-mono drop-shadow">{colorData.hex}</span>
          <span className="text-sm font-bold font-mono opacity-90 drop-shadow">{colorData.rgb}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 2 & 3: HEX TO RGB & RGB TO HEX
   ========================================================================================= */
function HexToRgbTool({ copyText, copied }) {
  const [hex, setHex] = useState("#4F46E5");
  const rgb = useMemo(() => {
    let clean = hex.replace("#", "").trim();
    if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
    if (clean.length !== 6) return null;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return `rgb(${r}, ${g}, ${b})`;
  }, [hex]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">HEX Color Input</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border rounded-2xl font-mono text-xl font-bold"
          />
        </div>
        <div className="p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-200 uppercase font-bold block mb-1">RGB Output</span>
            <span className="font-mono text-xl font-bold">{rgb || "Invalid Hex"}</span>
          </div>
          {rgb && (
            <button onClick={() => copyText(rgb)} className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow">
              {copied ? "Copied" : "Copy RGB"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RgbToHexTool({ copyText, copied }) {
  const [r, setR] = useState(79);
  const [g, setG] = useState(70);
  const [b, setB] = useState(229);

  const hex = useMemo(() => {
    const toHex = (n) => {
      const val = Math.min(255, Math.max(0, Number(n) || 0));
      return val.toString(16).padStart(2, "0").toUpperCase();
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, [r, g, b]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Red (0-255)</label>
          <input
            type="number"
            min="0"
            max="255"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Green (0-255)</label>
          <input
            type="number"
            min="0"
            max="255"
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Blue (0-255)</label>
          <input
            type="number"
            min="0"
            max="255"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-bold"
          />
        </div>
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between">
        <div>
          <span className="text-xs text-indigo-200 uppercase font-bold block mb-1">Calculated HEX Code</span>
          <span className="font-mono text-2xl font-black">{hex}</span>
        </div>
        <button onClick={() => copyText(hex)} className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow">
          {copied ? "Copied" : "Copy HEX"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 4: HSL CONVERTER
   ========================================================================================= */
function HslConverterTool({ copyText, copied }) {
  const [h, setH] = useState(243);
  const [s, setS] = useState(75);
  const [l, setL] = useState(59);

  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 flex justify-between">
              <span>Hue: {h}°</span>
            </label>
            <input type="range" min="0" max="360" value={h} onChange={(e) => setH(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 flex justify-between">
              <span>Saturation: {s}%</span>
            </label>
            <input type="range" min="0" max="100" value={s} onChange={(e) => setS(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 flex justify-between">
              <span>Lightness: {l}%</span>
            </label>
            <input type="range" min="0" max="100" value={l} onChange={(e) => setL(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div
          className="h-44 rounded-3xl shadow-xl flex items-center justify-center text-white font-mono font-bold text-lg border"
          style={{ backgroundColor: hslStr }}
        >
          {hslStr}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 5: WCAG CONTRAST CHECKER
   ========================================================================================= */
function ContrastCheckerTool({ copyText, copied }) {
  const [fg, setFg] = useState("#FFFFFF");
  const [bg, setBg] = useState("#4F46E5");

  const getLuminance = (hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const ratio = useMemo(() => {
    try {
      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const brightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);
      return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
    } catch {
      return "0";
    }
  }, [fg, bg]);

  const numRatio = Number(ratio);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">Text Color (Foreground)</label>
              <input
                type="text"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-mono text-xs font-bold"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">Background Color</label>
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl font-mono text-xs font-bold"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Contrast Ratio</span>
              <span className="text-3xl font-black font-mono text-indigo-400">{ratio} : 1</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className={`p-3 rounded-xl border ${numRatio >= 4.5 ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-rose-950/40 border-rose-800 text-rose-400"}`}>
                Normal Text (AA ≥ 4.5): {numRatio >= 4.5 ? "PASS" : "FAIL"}
              </div>
              <div className={`p-3 rounded-xl border ${numRatio >= 7 ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-rose-950/40 border-rose-800 text-rose-400"}`}>
                Normal Text (AAA ≥ 7.0): {numRatio >= 7 ? "PASS" : "FAIL"}
              </div>
            </div>
          </div>
        </div>

        {/* Live Visual Card */}
        <div
          className="h-56 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center border"
          style={{ backgroundColor: bg, color: fg }}
        >
          <h3 className="text-xl font-bold">The quick brown fox jumps over the lazy dog.</h3>
          <p className="text-xs mt-2 opacity-90">Previewing real font contrast for readability.</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 6: CSS GRADIENT GENERATOR
   ========================================================================================= */
function GradientGeneratorTool({ copyText, copied }) {
  const [color1, setColor1] = useState("#4f46e5");
  const [color2, setColor2] = useState("#06b6d4");
  const [angle, setAngle] = useState(135);

  const css = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">Color 1</label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 rounded-xl cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">Color 2</label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Angle: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border flex items-center justify-between">
            <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 break-all">{css}</code>
            <button onClick={() => copyText(`background: ${css};`)} className="text-xs font-bold text-indigo-600 ml-2">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="h-56 rounded-3xl shadow-2xl border" style={{ background: css }} />
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 7: BOX SHADOW GENERATOR
   ========================================================================================= */
function BoxShadowTool({ copyText, copied }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [shadowColor, setShadowColor] = useState("rgba(0,0,0,0.2)");

  const css = `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block">X Offset: {x}px</label>
              <input type="range" min="-50" max="50" value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block">Y Offset: {y}px</label>
              <input type="range" min="-50" max="50" value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block">Blur Radius: {blur}px</label>
              <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block">Spread: {spread}px</label>
              <input type="range" min="-30" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border flex items-center justify-between">
            <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">box-shadow: {css};</code>
            <button onClick={() => copyText(`box-shadow: ${css};`)} className="text-xs font-bold text-indigo-600">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="flex justify-center p-8">
          <div className="w-48 h-48 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center font-bold text-xs" style={{ boxShadow: css }}>
            Shadow Preview
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 8: BORDER RADIUS GENERATOR
   ========================================================================================= */
function BorderRadiusTool({ copyText, copied }) {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);

  const css = `${tl}px ${tr}px ${br}px ${bl}px`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block">Top Left: {tl}px</label>
            <input type="range" min="0" max="100" value={tl} onChange={(e) => setTl(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block">Top Right: {tr}px</label>
            <input type="range" min="0" max="100" value={tr} onChange={(e) => setTr(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block">Bottom Left: {bl}px</label>
            <input type="range" min="0" max="100" value={bl} onChange={(e) => setBl(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block">Bottom Right: {br}px</label>
            <input type="range" min="0" max="100" value={br} onChange={(e) => setBr(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xl transition-all" style={{ borderRadius: css }}>
            Preview Box
          </div>
          <button onClick={() => copyText(`border-radius: ${css};`)} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            <Copy size={13} /> Copy <code>border-radius: {css};</code>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 9: CSS CLAMP GENERATOR (FLUID TYPOGRAPHY)
   ========================================================================================= */
function CssClampTool({ copyText, copied }) {
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(32);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1280);

  const clampValue = useMemo(() => {
    const slope = (maxSize - minSize) / (maxVw - minVw);
    const yAxisIntersection = -minVw * slope + minSize;
    const preferredVw = (slope * 100).toFixed(2);
    const preferredRem = (yAxisIntersection / 16).toFixed(3);
    const minRem = (minSize / 16).toFixed(2);
    const maxRem = (maxSize / 16).toFixed(2);
    return `clamp(${minRem}rem, ${preferredRem}rem + ${preferredVw}vw, ${maxRem}rem)`;
  }, [minSize, maxSize, minVw, maxVw]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Min Font (px)</label>
          <input type="number" value={minSize} onChange={(e) => setMinSize(Number(e.target.value))} className="w-full px-4 py-2 border rounded-xl font-bold" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Max Font (px)</label>
          <input type="number" value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} className="w-full px-4 py-2 border rounded-xl font-bold" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Min Viewport (px)</label>
          <input type="number" value={minVw} onChange={(e) => setMinVw(Number(e.target.value))} className="w-full px-4 py-2 border rounded-xl font-bold" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Max Viewport (px)</label>
          <input type="number" value={maxVw} onChange={(e) => setMaxVw(Number(e.target.value))} className="w-full px-4 py-2 border rounded-xl font-bold" />
        </div>
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between">
        <div>
          <span className="text-xs text-indigo-200 uppercase font-bold block mb-1">Generated Fluid Clamp</span>
          <code className="text-base sm:text-lg font-mono font-bold">{clampValue}</code>
        </div>
        <button onClick={() => copyText(`font-size: ${clampValue};`)} className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow">
          {copied ? "Copied" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 10: CSS ANIMATION PREVIEWER
   ========================================================================================= */
function CssAnimationTool({ copyText, copied }) {
  const [anim, setAnim] = useState("pulse");
  const [duration, setDuration] = useState(1.5);

  const ANIMATIONS = ["pulse", "bounce", "spin", "ping"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border">
        <div className="flex gap-2">
          {ANIMATIONS.map((a) => (
            <button
              key={a}
              onClick={() => setAnim(a)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${anim === a ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"}`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Duration: {duration}s</span>
          <input type="range" min="0.5" max="3" step="0.1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-24 accent-indigo-600" />
        </div>
      </div>

      <div className="h-56 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center">
        <div
          className={`w-24 h-24 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl shadow-xl flex items-center justify-center text-white font-bold text-xs ${
            anim === "pulse" ? "animate-pulse" : anim === "bounce" ? "animate-bounce" : anim === "spin" ? "animate-spin" : "animate-ping"
          }`}
          style={{ animationDuration: `${duration}s` }}
        >
          {anim}
        </div>
      </div>
    </div>
  );
}
