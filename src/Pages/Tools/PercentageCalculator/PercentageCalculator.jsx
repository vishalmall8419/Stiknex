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
  Percent,
  Sparkles,
  ArrowRight,
  RotateCcw,
  History,
  Trash2,
  Clock,
  Volume2,
  VolumeX,
  Layers,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Calculator
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";

/**
 * Enterprise Percentage Calculator Workstation
 * Full-Page Desktop View (>= lg) + Snug Mobile Chassis (< lg)
 * - Desktop: Full-page dual-station layout with expansive inputs, live formula breakdowns,
 *   common real-world percentage scenarios, and permanent companion History & Quick Actions panel.
 * - Mobile: Pinned snug handheld chassis with bottom safe clearance (pb-8) and slide-over panels.
 */

const RELATED_CALCULATORS = [
  { slug: "basic-calculator", title: "Basic Calculator", icon: "fa-solid fa-calculator", desc: "Instant arithmetic with calculation tape" },
  { slug: "scientific-calculator", title: "Scientific Calculator", icon: "fa-solid fa-square-root-variable", desc: "Trigonometry, logarithms, powers, and roots" },
  { slug: "age-calculator", title: "Age Calculator", icon: "fa-solid fa-cake-candles", desc: "Exact chronological age and milestone metrics" },
  { slug: "date-difference-calculator", title: "Date Calculator", icon: "fa-solid fa-calendar-days", desc: "Calendar and working business days between dates" },
  { slug: "time-calculator", title: "Time Calculator", icon: "fa-solid fa-clock", desc: "Add, subtract, and convert hours, minutes, and seconds" },
  { slug: "unit-converter", title: "Unit Converter", icon: "fa-solid fa-ruler-combined", desc: "Universal converter for length, mass, and volume" }
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

export default function PercentageCalculator({ tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  // Modes: 'basic' (X% of Y) | 'ratio' (X is what % of Y) | 'change' (% change) | 'discount' (Discount & Tip)
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode");
      if (m && ["basic", "ratio", "change", "discount"].includes(m)) return m;
    }
    return "basic";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode");
      if (m && ["basic", "ratio", "change", "discount"].includes(m)) {
        setMode(m);
      }
    }
  }, []);

  const handleSwitchMode = (mId) => {
    playClickSound();
    setMode(mId);
    if (mId === "discount") {
      navigate("/discount-calculator");
    } else {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("mode", mId);
        window.history.replaceState({}, "", url.pathname + url.search);
      } catch {}
    }
  };

  // Mode 1: What is X% of Y?
  const [p1, setP1] = useState(15);
  const [v1, setV1] = useState(250);

  // Mode 2: X is what % of Y?
  const [x2, setX2] = useState(45);
  const [y2, setY2] = useState(180);

  // Mode 3: % Increase / Decrease from A to B
  const [fromVal, setFromVal] = useState(80);
  const [toVal, setToVal] = useState(120);

  // Mode 4: Discount & Tip
  const [billPrice, setBillPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [tipPercent, setTipPercent] = useState(15);

  // Companion Panel Tab
  const [companionTab, setCompanionTab] = useState("history");

  // Common UI State
  const [copied, setCopied] = useState(false);
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
        osc.frequency.setValueAtTime(540, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, audioCtxRef.current.currentTime + 0.04);
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
      const saved = localStorage.getItem("stiknex_percentage_calc_history");
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
        localStorage.setItem("stiknex_percentage_calc_history", JSON.stringify(updated));
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
      localStorage.removeItem("stiknex_percentage_calc_history");
    } catch {
      // ignore
    }
  }, [playClickSound]);

  // Calculations
  const res1 = useMemo(() => {
    const p = parseFloat(p1) || 0;
    const v = parseFloat(v1) || 0;
    return Number(((p / 100) * v).toFixed(4));
  }, [p1, v1]);

  const res2 = useMemo(() => {
    const x = parseFloat(x2) || 0;
    const y = parseFloat(y2) || 0;
    if (y === 0) return 0;
    return Number(((x / y) * 100).toFixed(4));
  }, [x2, y2]);

  const res3 = useMemo(() => {
    const f = parseFloat(fromVal) || 0;
    const t = parseFloat(toVal) || 0;
    if (f === 0) return { diff: 0, percent: 0, isIncrease: true };
    const diff = t - f;
    const percent = (diff / Math.abs(f)) * 100;
    return {
      diff: Number(diff.toFixed(4)),
      percent: Number(percent.toFixed(2)),
      isIncrease: diff >= 0
    };
  }, [fromVal, toVal]);

  const res4 = useMemo(() => {
    const bill = parseFloat(billPrice) || 0;
    const discP = parseFloat(discountPercent) || 0;
    const tipP = parseFloat(tipPercent) || 0;

    const discountAmount = Number(((discP / 100) * bill).toFixed(2));
    const priceAfterDiscount = Math.max(0, Number((bill - discountAmount).toFixed(2)));
    const tipAmount = Number(((tipP / 100) * priceAfterDiscount).toFixed(2));
    const finalTotal = Number((priceAfterDiscount + tipAmount).toFixed(2));

    return {
      discountAmount,
      priceAfterDiscount,
      tipAmount,
      finalTotal
    };
  }, [billPrice, discountPercent, tipPercent]);

  // Active Result text
  const activeResultText = useMemo(() => {
    if (mode === "basic") return `${res1}`;
    if (mode === "ratio") return `${res2}%`;
    if (mode === "change") return `${res3.isIncrease ? "+" : ""}${res3.percent}%`;
    if (mode === "discount") return `$${res4.finalTotal}`;
    return "";
  }, [mode, res1, res2, res3, res4]);

  const handleCopy = useCallback((customText = null) => {
    playClickSound();
    const textToCopy = customText || activeResultText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(String(textToCopy).replace(/,/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (mode === "basic") {
      saveToHistory({
        mode: "X% of Y",
        label: `${p1}% of ${v1}`,
        result: String(res1)
      });
    } else if (mode === "ratio") {
      saveToHistory({
        mode: "What %",
        label: `${x2} out of ${y2}`,
        result: `${res2}%`
      });
    } else if (mode === "change") {
      saveToHistory({
        mode: "% Change",
        label: `${fromVal} to ${toVal}`,
        result: `${res3.isIncrease ? "+" : ""}${res3.percent}%`
      });
    } else if (mode === "discount") {
      saveToHistory({
        mode: "Discount & Tip",
        label: `$${billPrice} (-${discountPercent}%, +${tipPercent}% tip)`,
        result: `$${res4.finalTotal}`
      });
    }
  }, [playClickSound, activeResultText, mode, p1, v1, res1, x2, y2, res2, fromVal, toVal, res3, billPrice, discountPercent, tipPercent, res4, saveToHistory]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return RELATED_CALCULATORS;
    const q = searchQuery.toLowerCase();
    return RELATED_CALCULATORS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      

      {/* ══════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR (FULL-WIDTH EXPANSIVE)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 shadow-xs dark:shadow-none transition-colors">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
            title="Open Tools Drawer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Percentage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Calculator</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 tracking-wider uppercase">
                  Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Proportions, Discounts, Markups &amp; Growth Rates
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Selector Tabs (Desktop Segmented Control) */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
          {[
            { id: "basic", label: "X% of Y" },
            { id: "ratio", label: "What %" },
            { id: "change", label: "% Change" },
            { id: "discount", label: "Discount & Tip" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleSwitchMode(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                mode === m.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-black/5"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help & Formulas Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Formulas & Real-World Guide (?)"
            aria-label="Open Formulas & Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mobile History Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileHistoryOpen(true);
            }}
            className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="View History"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Toggle Light / Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
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
            
            {/* Mobile Mode Switcher (< md) */}
            <div className="md:hidden grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold">
              {[
                { id: "basic", label: "X% of Y" },
                { id: "ratio", label: "What %" },
                { id: "change", label: "% Change" },
                { id: "discount", label: "Discount" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSwitchMode(m.id)}
                  className={`py-1.5 px-1 rounded-xl transition cursor-pointer text-center ${
                    mode === m.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Main Interactive Calculation Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
              
              {/* MODE 1: X% of Y */}
              {mode === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Percentage (%)
                      </label>
                      <input
                        type="number"
                        value={p1}
                        onChange={(e) => {
                          playClickSound();
                          setP1(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                      {/* Quick Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                        {[5, 10, 15, 20, 25, 50, 75].map((val) => (
                          <button
                            key={val}
                            onClick={() => {
                              playClickSound();
                              setP1(val);
                            }}
                            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Of Number / Value (Y)
                      </label>
                      <input
                        type="number"
                        value={v1}
                        onChange={(e) => {
                          playClickSound();
                          setV1(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                        {[50, 100, 250, 500, 1000].map((val) => (
                          <button
                            key={val}
                            onClick={() => {
                              playClickSound();
                              setV1(val);
                            }}
                            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: X is what % of Y? */}
              {mode === "ratio" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Part Value (X)
                      </label>
                      <input
                        type="number"
                        value={x2}
                        onChange={(e) => {
                          playClickSound();
                          setX2(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Total Whole Value (Y)
                      </label>
                      <input
                        type="number"
                        value={y2}
                        onChange={(e) => {
                          playClickSound();
                          setY2(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: % Change */}
              {mode === "change" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Initial Value (A)
                      </label>
                      <input
                        type="number"
                        value={fromVal}
                        onChange={(e) => {
                          playClickSound();
                          setFromVal(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Final Value (B)
                      </label>
                      <input
                        type="number"
                        value={toVal}
                        onChange={(e) => {
                          playClickSound();
                          setToVal(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 4: Discount & Tip */}
              {mode === "discount" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Original Bill ($)
                      </label>
                      <input
                        type="number"
                        value={billPrice}
                        onChange={(e) => {
                          playClickSound();
                          setBillPrice(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => {
                          playClickSound();
                          setDiscountPercent(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Tip (%)
                      </label>
                      <input
                        type="number"
                        value={tipPercent}
                        onChange={(e) => {
                          playClickSound();
                          setTipPercent(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* HERO RESULT DISPLAY */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/30 dark:shadow-none text-center relative">
                <div className="flex justify-end mb-1">
                  <button
                    onClick={() => handleCopy()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Result"}</span>
                  </button>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  {mode === "basic" && `Calculation: ${p1}% of ${v1}`}
                  {mode === "ratio" && `Percentage Share: ${x2} in ${y2}`}
                  {mode === "change" && `Shift from ${fromVal} to ${toVal}`}
                  {mode === "discount" && `Final Payable Total`}
                </span>

                <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight font-mono">
                  {activeResultText}
                </div>

                {/* Mathematical Formula Footnote */}
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {mode === "basic" && `Formula: (${p1} ÷ 100) × ${v1} = ${res1}`}
                  {mode === "ratio" && `Formula: (${x2} ÷ ${y2}) × 100 = ${res2}%`}
                  {mode === "change" && (
                    <>
                      {res3.isIncrease ? "📈 Increase of" : "📉 Decrease of"}{" "}
                      <strong>{Math.abs(res3.percent)}%</strong> (Absolute change: {res3.diff})
                    </>
                  )}
                  {mode === "discount" && (
                    <>
                      Savings: <strong>${res4.discountAmount}</strong> • Discounted: ${res4.priceAfterDiscount} • Tip: ${res4.tipAmount}
                    </>
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION PANEL (4 COLS ON DESKTOP, MATCHING MOCKUP)
          ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex col-span-4 flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
            
            {/* Companion Header */}
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
                    <span>Calculators</span>
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
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-bold">No History Yet</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                        Copying percentage results will save them here automatically.
                      </p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1 hover:border-indigo-400 transition"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">{item.mode}</span>
                          <span>{formatHistoryTime(item.timestamp)}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.label}
                        </div>
                        <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-0.5">
                          <span className="truncate pr-2 font-mono">{item.result}</span>
                          <button
                            onClick={() => handleCopy(item.result)}
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
                    {RELATED_CALCULATORS.map((calc) => (
                      <Link
                        key={calc.slug}
                        to={`/${calc.slug}`}
                        onClick={playClickSound}
                        className="flex flex-col p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition group border border-transparent hover:border-indigo-200 dark:hover:border-slate-700"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                          <span>{calc.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {calc.desc}
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
                onClick={() => handleCopy()}
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
          Stiknex Percentage Engine • Fast Ratios, Growth &amp; Financial Percentages
        </p>
      </footer>

      {/* FLOATABLE / DRAGGABLE HELP (?) BUTTON */}
      <motion.button
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          playClickSound();
          setHelpOpen(true);
        }}
        className="fixed top-20 right-4 z-40 p-3 rounded-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-indigo-500/20 cursor-grab active:cursor-grabbing transition-colors"
        title="Percentage Formulas (Drag anywhere)"
        aria-label="Help Guide"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      {/* UNIVERSAL STIKNEX TOOL SIDEBAR DRAWER */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_CALCULATORS}
        categoryTitle="Related Calculators"
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
                    Percentage History ({history.length})
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
                    <Percent className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No calculations recorded yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">{item.mode}</span>
                        <span>{formatHistoryTime(item.timestamp)}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.label}
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-1">
                        <span className="truncate pr-2 font-mono">{item.result}</span>
                        <button
                          onClick={() => handleCopy(item.result)}
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
                  <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Percentage Formulas
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

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {/* Mathematical Formulas Section */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Core Formulas
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      What is X% of Y?
                    </h3>
                    <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-indigo-600 dark:text-indigo-400">
                      Result = (X / 100) × Y
                    </code>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      X is what % of Y?
                    </h3>
                    <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-indigo-600 dark:text-indigo-400">
                      Result = (X / Y) × 100
                    </code>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      Percentage Increase / Decrease
                    </h3>
                    <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-indigo-600 dark:text-indigo-400">
                      % Change = [(New Value − Old Value) / |Old Value|] × 100
                    </code>
                  </div>
                </div>

                {/* Real-World Scenarios Guide (Moved to Help Dialog per user request) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Common Real-World Formulas &amp; Scenarios
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        GST / Sales Tax
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Add standard 5%, 12%, 18% or 28% tax by using &ldquo;X% of Y&rdquo; and adding the result to base price.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        Salary / Stock Growth
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Compare historical vs current stock price or salary hike using &ldquo;% Change&rdquo; mode for instant YoY rates.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        Exam Grades &amp; Ratios
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Compute your score percentage by entering marks scored in Part (X) and maximum marks in Total (Y).
                      </p>
                    </div>
                  </div>
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
