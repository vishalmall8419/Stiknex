import { useState, useMemo } from "react";
import { Copy, Check, Palette, Sliders, Sun, Moon, Wand2, Eye } from "lucide-react";
import ColorPicker from "../ColorPicker/ColorPicker";

export default function DesignEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "color-picker" || toolId === "color-picker") {
    return <ColorPicker />;
  }
  if (slug === "contrast-checker") return <ContrastCheckerTool copyText={copyText} copied={copied} />;
  if (slug === "gradient-generator") return <GradientGeneratorTool copyText={copyText} copied={copied} />;
  if (slug === "box-shadow-generator") return <BoxShadowTool copyText={copyText} copied={copied} />;
  if (slug === "border-radius-generator") return <BorderRadiusTool copyText={copyText} copied={copied} />;
  if (slug === "css-clamp-generator") return <CssClampTool copyText={copyText} copied={copied} />;
  if (slug === "css-animation-previewer") return <AnimationPreviewTool copyText={copyText} copied={copied} />;
  if (slug === "hex-to-rgb" || slug === "rgb-to-hex" || slug === "hsl-converter") {
    return <ColorConversionsTool copyText={copyText} copied={copied} />;
  }

  return <ColorPicker />;
}

// ============================================================================
// BIG TOOL: WCAG COLOR CONTRAST CHECKER
// ============================================================================
function ContrastCheckerTool({ copyText, copied }) {
  const [fg, setFg] = useState("#4F46E5");
  const [bg, setBg] = useState("#FFFFFF");

  const hexToLuminance = (hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;

    const [R, G, B] = [r, g, b].map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const ratio = useMemo(() => {
    try {
      const l1 = hexToLuminance(fg);
      const l2 = hexToLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
    } catch {
      return 1;
    }
  }, [fg, bg]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-500">Text Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="w-24 px-2 py-1 font-mono text-xs uppercase font-bold" />
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-500">Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="w-24 px-2 py-1 font-mono text-xs uppercase font-bold" />
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl border flex items-center justify-between shadow-xl" style={{ backgroundColor: bg, color: fg }}>
        <div>
          <span className="text-xs font-bold uppercase block opacity-80">Live Contrast Preview</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1">Legibility Sample Text</h2>
          <p className="text-sm mt-1 opacity-90">WCAG 2.1 compliance verified.</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black">{ratio}:1</span>
          <span className="text-xs block mt-1 font-bold">{ratio >= 4.5 ? "✅ Passes AA" : "❌ Fails AA"}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: GRADIENT GENERATOR
// ============================================================================
function GradientGeneratorTool({ copyText, copied }) {
  const [c1, setC1] = useState("#4F46E5");
  const [c2, setC2] = useState("#06B6D4");
  const [angle, setAngle] = useState(135);

  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Color 1</label>
          <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Color 2</label>
          <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Angle ({angle}°)</label>
          <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full mt-2" />
        </div>
      </div>

      <div className="w-full h-56 rounded-3xl shadow-xl flex items-center justify-center text-white font-black text-xl" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}>
        Gradient Preview
      </div>

      <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-mono text-xs">
        <span>{css}</span>
        <button onClick={() => copyText(css)} className="px-4 py-2 bg-indigo-600 rounded-xl font-bold flex items-center gap-1.5 shrink-0 ml-4">
          <Copy size={14} /> Copy CSS
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: BOX SHADOW GENERATOR
// ============================================================================
function BoxShadowTool({ copyText, copied }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(0.2);

  const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity});`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border text-xs font-bold">
        <div>
          <span>Offset X: {x}px</span>
          <input type="range" min="-50" max="50" value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <span>Offset Y: {y}px</span>
          <input type="range" min="-50" max="50" value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <span>Blur: {blur}px</span>
          <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <span>Spread: {spread}px</span>
          <input type="range" min="-30" max="30" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full mt-1" />
        </div>
      </div>

      <div className="p-16 bg-slate-100 dark:bg-slate-950 rounded-3xl flex items-center justify-center">
        <div
          className="w-48 h-32 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-800 dark:text-white"
          style={{ boxShadow: `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})` }}
        >
          Preview Box
        </div>
      </div>

      <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-mono text-xs">
        <span>{css}</span>
        <button onClick={() => copyText(css)} className="px-4 py-2 bg-indigo-600 rounded-xl font-bold flex items-center gap-1.5 shrink-0 ml-4">
          <Copy size={14} /> Copy CSS
        </button>
      </div>
    </div>
  );
}

// Helpers
function BorderRadiusTool({ copyText }) {
  const [tl, setTl] = useState(30);
  const [tr, setTr] = useState(70);
  const [br, setBr] = useState(70);
  const [bl, setBl] = useState(30);

  const radius = `${tl}% ${100 - tl}% ${br}% ${100 - br}% / ${100 - bl}% ${tr}% ${100 - tr}% ${bl}%`;
  const css = `border-radius: ${radius};`;

  return (
    <div className="space-y-6">
      <div className="p-12 bg-slate-100 rounded-3xl flex items-center justify-center">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl" style={{ borderRadius: radius }} />
      </div>
      <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-mono text-xs">
        <span className="truncate mr-4">{css}</span>
        <button onClick={() => copyText(css)} className="px-4 py-2 bg-indigo-600 rounded-xl font-bold shrink-0">Copy</button>
      </div>
    </div>
  );
}

function CssClampTool({ copyText }) {
  const [minFont, setMinFont] = useState(16);
  const [maxFont, setMaxFont] = useState(32);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1280);

  const clampCss = useMemo(() => {
    const slope = (maxFont - minFont) / (maxVw - minVw);
    const yAxis = -minVw * slope + minFont;
    return `font-size: clamp(${minFont}px, ${(yAxis / 16).toFixed(3)}rem + ${(slope * 100).toFixed(3)}vw, ${maxFont}px);`;
  }, [minFont, maxFont, minVw, maxVw]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border text-xs font-bold">
        <div>Min Font: {minFont}px</div>
        <div>Max Font: {maxFont}px</div>
        <div>Min Viewport: {minVw}px</div>
        <div>Max Viewport: {maxVw}px</div>
      </div>
      <div className="p-5 bg-indigo-600 text-white rounded-2xl flex items-center justify-between font-mono text-xs">
        <span className="truncate mr-4">{clampCss}</span>
        <button onClick={() => copyText(clampCss)} className="px-4 py-2 bg-white text-indigo-700 font-bold rounded-xl shrink-0">Copy</button>
      </div>
    </div>
  );
}

function AnimationPreviewTool() {
  const [anim, setAnim] = useState("animate-bounce");
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2">
        {["animate-bounce", "animate-pulse", "animate-spin"].map((a) => (
          <button key={a} onClick={() => setAnim(a)} className={`px-4 py-2 rounded-xl text-xs font-bold ${anim === a ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
            {a.replace("animate-", "")}
          </button>
        ))}
      </div>
      <div className="p-16 bg-slate-100 rounded-3xl flex items-center justify-center">
        <div className={`w-20 h-20 bg-indigo-600 rounded-2xl shadow-lg ${anim}`} />
      </div>
    </div>
  );
}

function ColorConversionsTool({ copyText }) {
  const [hex, setHex] = useState("#4F46E5");
  const rgb = useMemo(() => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const r = parseInt(c.substr(0, 2), 16) || 0;
    const g = parseInt(c.substr(2, 2), 16) || 0;
    const b = parseInt(c.substr(4, 2), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  }, [hex]);

  return (
    <div className="space-y-6">
      <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full p-3 border rounded-xl font-bold text-lg" />
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-mono text-sm">
        <span>{rgb}</span>
        <button onClick={() => copyText(rgb)} className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold">Copy</button>
      </div>
    </div>
  );
}
