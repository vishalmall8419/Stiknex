import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Copy,
  Check,
  ArrowRightLeft,
  Sparkles,
  Thermometer,
  Flame,
  Snowflake,
  History,
  Trash2,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  ArrowRight,
  Calculator
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";

/**
 * High-Precision Temperature Converter (Full-Page Desktop + Snug Mobile Chassis)
 * - Desktop View (>= lg): Full-screen dual-station layout with expansive inputs,
 *   simultaneous 3-way live scale, physical benchmarks, and companion History & Quick Actions panel.
 * - Mobile View (< lg): Snug handheld chassis with bottom safe clearance (pb-8) and slide-over panels.
 */

const UNITS = [
  { id: "c", label: "Celsius", symbol: "°C", color: "text-blue-500", desc: "Metric standard (water freezes at 0°, boils at 100°)" },
  { id: "f", label: "Fahrenheit", symbol: "°F", color: "text-amber-500", desc: "US customary (water freezes at 32°, boils at 212°)" },
  { id: "k", label: "Kelvin", symbol: "K", color: "text-purple-500", desc: "SI thermodynamic base unit (absolute zero at 0 K)" },
];

const toCelsius = (value, unit) => {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
};

const fromCelsius = (celsius, unit) => {
  if (unit === "c") return celsius;
  if (unit === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
};

const formatTemp = (n) => {
  if (!isFinite(n)) return "0";
  return Number((Math.round(n * 1000) / 1000).toFixed(3))
    .toString()
    .replace(/\.?0+$/, (m) => (m.includes(".") ? "" : m));
};

const BENCHMARKS = [
  { label: "Absolute Zero", c: -273.15, icon: Snowflake },
  { label: "Water Freezing", c: 0, icon: Snowflake },
  { label: "Room Temperature", c: 21, icon: Thermometer },
  { label: "Human Body Temp", c: 37, icon: Flame },
  { label: "Water Boiling", c: 100, icon: Flame },
];

const CONVERTER_CATEGORIES = [
  { slug: "length-converter", title: "Length" },
  { slug: "weight-converter", title: "Weight" },
  { slug: "temperature-converter", title: "Temperature" },
  { slug: "area-converter", title: "Area" },
  { slug: "volume-converter", title: "Volume" },
  { slug: "speed-converter", title: "Speed" },
  { slug: "pressure-converter", title: "Pressure" },
  { slug: "data-converter", title: "Storage" }
];

const RELATED_CONVERTERS = [
  { slug: "length-converter", title: "Length Converter", icon: "fa-solid fa-ruler", desc: "Meters, feet, inches, kilometers, miles, yards" },
  { slug: "weight-converter", title: "Weight & Mass Converter", icon: "fa-solid fa-weight-hanging", desc: "Kilograms, pounds, ounces, grams, stones, tons" },
  { slug: "pressure-converter", title: "Pressure Converter", icon: "fa-solid fa-compress", desc: "Bar, PSI, Pascal, Atmosphere, kPa" },
  { slug: "area-converter", title: "Area Converter", icon: "fa-solid fa-border-all", desc: "Square meters, square feet, acres, hectares" },
  { slug: "volume-converter", title: "Volume & Capacity", icon: "fa-solid fa-flask", desc: "Liters, gallons, milliliters, fluid ounces, cups" },
  { slug: "speed-converter", title: "Speed & Velocity", icon: "fa-solid fa-gauge-high", desc: "km/h, mph, knots, m/s, Mach speed" },
  { slug: "percentage-calculator", title: "Percentage Calculator", icon: "fa-solid fa-percent", desc: "Fast percentage of value, ratio, change, and discounts" },
  { slug: "basic-calculator", title: "Basic Calculator", icon: "fa-solid fa-calculator", desc: "Clean in-browser arithmetic with calculation tape" },
  { slug: "scientific-calculator", title: "Scientific Calculator", icon: "fa-solid fa-square-root-variable", desc: "High-precision trigonometry, logarithms, and powers" }
];

function formatHistoryTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

export default function TemperatureConverter({ tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();

  const [value, setValue] = useState("25");
  const [fromUnit, setFromUnit] = useState("c");
  const [toUnit, setToUnit] = useState("f");
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedUnitId, setCopiedUnitId] = useState(null);

  // Companion Panel Tab: 'history' | 'quick'
  const [companionTab, setCompanionTab] = useState("history");

  // Common UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Tactile Sound
  const audioCtxRef = useRef(null);
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(580, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(360, audioCtxRef.current.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.04);
      }
    } catch {
      // AudioContext
    }
  }, [soundEnabled]);

  // Persistent History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_temp_converter_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = useCallback((entry) => {
    setHistory((prev) => {
      const updated = [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...entry
        },
        ...prev.slice(0, 39)
      ];
      try {
        localStorage.setItem("stiknex_temp_converter_history", JSON.stringify(updated));
      } catch {
        // quota
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    playClickSound();
    setHistory([]);
    try {
      localStorage.removeItem("stiknex_temp_converter_history");
    } catch {
      // ignore
    }
  }, [playClickSound]);

  // Math conversions
  const numValue = Number(value);
  const isValid = value !== "" && !isNaN(numValue);
  const celsiusBase = isValid ? toCelsius(numValue, fromUnit) : 0;

  const targetValue = isValid ? fromCelsius(celsiusBase, toUnit) : 0;
  const targetFormatted = formatTemp(targetValue);

  const handleSwap = () => {
    playClickSound();
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyToClipboard = (text, isTarget = false, unitId = null, unitLabel = "") => {
    playClickSound();
    navigator.clipboard.writeText(String(text));
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
      saveToHistory({
        from: `${value}°${fromUnit.toUpperCase()}`,
        to: `${targetFormatted}°${toUnit.toUpperCase()}`,
        result: `${value}°${fromUnit.toUpperCase()} = ${targetFormatted}°${toUnit.toUpperCase()}`
      });
    }
    if (unitId) {
      setCopiedUnitId(unitId);
      setTimeout(() => setCopiedUnitId(null), 2000);
      saveToHistory({
        from: `${value}°${fromUnit.toUpperCase()}`,
        to: `${text}°${unitId.toUpperCase()}`,
        result: `${value}°${fromUnit.toUpperCase()} = ${text}°${unitId.toUpperCase()}`
      });
    }
  };

  const setBenchmark = (cVal) => {
    playClickSound();
    const valInFromUnit = fromCelsius(cVal, fromUnit);
    setValue(String(formatTemp(valInFromUnit)));
  };

  // Filtered sidebar
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return RELATED_CONVERTERS;
    const q = searchQuery.toLowerCase();
    return RELATED_CONVERTERS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      

      {/* ══════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR (FULL-WIDTH EXPANSIVE)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 shadow-xs dark:shadow-none transition-colors">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
            title="Open Tools Drawer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 ring-1 ring-white/20 shrink-0">
              <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Temperature <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 dark:from-orange-400 dark:to-rose-400">Converter</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/60 tracking-wider uppercase">
                  Thermodynamic
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Thermodynamic Scales &amp; Absolute Zero Reference Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Category Chips (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
          {CONVERTER_CATEGORIES.map((cat) => {
            const isCurrent = cat.slug === "temperature-converter";
            return (
              <Link
                key={cat.slug}
                to={`/${cat.slug}`}
                onClick={playClickSound}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isCurrent
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm shadow-black/5"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
              >
                {cat.title}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Temperature Conversion Guide (?)"
            aria-label="Open Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mobile History Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileHistoryOpen(true);
            }}
            className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="View History"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-orange-600 text-white flex items-center justify-center animate-pulse">
                {history.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Toggle Light / Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-600" />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN WORKSTATION LAYOUT (FULL-SCREEN EXPANSIVE ON DESKTOP)
      ══════════════════════════════════════════════════════════════════ */}
      <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* Full-Width 12-Column Grid on Desktop */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT / PRIMARY TERMINAL (8 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4 lg:space-y-6">
            
            {/* Dual Conversion Workstation Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
              
              {/* Presets Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400 font-bold mr-1">Benchmarks:</span>
                  {BENCHMARKS.map((b) => (
                    <button
                      key={b.label}
                      onClick={() => setBenchmark(b.c)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      {b.label} ({b.c}°C)
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setValue("");
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                >
                  Clear Value
                </button>
              </div>

              {/* Dual Conversion Panels (From & To) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                
                {/* FROM CARD */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        From Temperature
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Source
                      </span>
                    </div>

                    <input
                      type="number"
                      step="any"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter temp..."
                      className="w-full text-3xl sm:text-4xl font-black text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 pb-2 transition-colors font-mono"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Select Source Scale
                    </label>
                    <select
                      value={fromUnit}
                      onChange={(e) => {
                        playClickSound();
                        setFromUnit(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                    >
                      {UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SWAP BUTTON (Desktop Center) */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={handleSwap}
                    className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-4 border-white dark:border-slate-900"
                    title="Swap Scales"
                    aria-label="Swap Scales"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* MOBILE SWAP BUTTON */}
                <div className="flex md:hidden justify-center -my-2">
                  <button
                    onClick={handleSwap}
                    className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Scales
                  </button>
                </div>

                {/* TO CARD */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/30 dark:shadow-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Converted Target
                      </span>
                      <button
                        onClick={() => copyToClipboard(targetFormatted, true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                      >
                        {copiedTarget ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Result
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white break-words font-mono">
                      {targetFormatted} <span className="text-2xl font-bold text-indigo-500">{UNITS.find(u => u.id === toUnit)?.symbol}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Select Target Scale
                    </label>
                    <select
                      value={toUnit}
                      onChange={(e) => {
                        playClickSound();
                        setToUnit(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                    >
                      {UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* SIMULTANEOUS 3-WAY THERMODYNAMIC CARDS (Spans full left column) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Simultaneous 3-Way Thermodynamic View
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">Click any card to copy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {UNITS.map((u) => {
                  const val = isValid ? fromCelsius(celsiusBase, u.id) : 0;
                  const formatted = formatTemp(val);
                  const isSelected = u.id === toUnit;
                  const isSource = u.id === fromUnit;

                  return (
                    <div
                      key={u.id}
                      onClick={() => copyToClipboard(formatted, false, u.id, u.label)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-indigo-50/90 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 shadow-xs"
                          : isSource
                          ? "bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700"
                          : "bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {u.label}
                          </span>
                          {isSource && (
                            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              From
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              Target
                            </span>
                          )}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate mt-1 font-mono">
                          {formatted} <span className="text-base font-bold text-indigo-500">{u.symbol}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.desc}</p>
                      </div>

                      <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {copiedUnitId === u.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION PANEL (4 COLS ON DESKTOP, MATCHING MOCKUP)
          ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex col-span-4 flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
            
            {/* Companion Header: Tabs & Trash */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      playClickSound();
                      setCompanionTab("history");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      companionTab === "history"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>History ({history.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setCompanionTab("quick");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      companionTab === "quick"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Converters</span>
                  </button>
                </div>

                {companionTab === "history" && history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Companion Body */}
              <div className="mt-3 space-y-2 overflow-y-auto max-h-[500px] pr-1">
                {companionTab === "history" ? (
                  history.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      <Thermometer className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-bold">No Temperature History Yet</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                        Copying results will record them here automatically.
                      </p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1 hover:border-indigo-400 transition"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span className="truncate max-w-[150px]">{item.from}</span>
                          <span>{formatHistoryTime(item.timestamp)}</span>
                        </div>
                        <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-0.5">
                          <span className="truncate pr-2 font-mono">{item.result}</span>
                          <button
                            onClick={() => copyToClipboard(item.to, false, null)}
                            className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                            title="Copy result"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="space-y-1">
                    {RELATED_CONVERTERS.map((conv) => (
                      <Link
                        key={conv.slug}
                        to={`/${conv.slug}`}
                        onClick={playClickSound}
                        className="flex flex-col p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition group border border-transparent hover:border-indigo-200 dark:hover:border-slate-700"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                          <span>{conv.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {conv.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => copyToClipboard(targetFormatted, true)}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Result</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setHelpOpen(true);
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Formulas</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* BOTTOM SAFE-AREA FOOTER CLEARANCE */}
      <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Stiknex Temperature Engine • Absolute Zero &amp; Thermodynamic Scales
        </p>
      </footer>

      {/* UNIVERSAL STIKNEX TOOL SIDEBAR DRAWER */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_CONVERTERS}
        categoryTitle="Related Converters"
        onFeedback={openFeedback}
      />

      {/* MOBILE HISTORY SLIDE-OVER (< lg) */}
      <AnimatePresence>
        {mobileHistoryOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClickSound();
                setMobileHistoryOpen(false);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-84 max-w-[90vw] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Temperature History ({history.length})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Clear All History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      playClickSound();
                      setMobileHistoryOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <Thermometer className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No temperature history recorded yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="truncate max-w-[150px]">{item.from}</span>
                        <span>{formatHistoryTime(item.timestamp)}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-1">
                        <span className="truncate pr-2 font-mono">{item.result}</span>
                        <button
                          onClick={() => copyToClipboard(item.to, false, null)}
                          className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* HELP & FORMULA MODAL */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClickSound();
                setHelpOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Temperature Formulas
                  </h2>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    Celsius to Fahrenheit
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 dark:text-indigo-400">
                    °F = (°C × 9/5) + 32
                  </code>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    Fahrenheit to Celsius
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 dark:text-indigo-400">
                    °C = (°F − 32) × 5/9
                  </code>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    Celsius to Kelvin
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 dark:text-indigo-400">
                    K = °C + 273.15
                  </code>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
