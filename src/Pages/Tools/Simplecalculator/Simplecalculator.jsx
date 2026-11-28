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
  Calculator,
  ArrowRight,
  Sparkles,
  BookOpen,
  PenTool,
  StickyNote,
  Home,
  Wrench,
  Newspaper,
  Coffee,
  Info,
  ShieldCheck,
  Keyboard,
  RotateCcw,
  History,
  Trash2,
  Clock,
  CornerDownLeft,
  Delete,
  Volume2,
  VolumeX,
  ClipboardPaste
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";

/**
 * Mobile-First Neumorphic Phone Calculator with History & Desktop Companion
 * Exactly matches the reference image design in both Light & Dark modes:
 * - Handheld rounded phone-chassis aesthetic (rounded-[38px] / rounded-[42px])
 * - Fullscreen mobile app: Keypad anchored at bottom, all space given to expression typing
 * - UI never jumps or shifts when numbers/operators are typed ("taki bad me ui na hile")
 * - Desktop companion side-panel for History on wide screens (>= lg)
 * - Persistent calculation history stored in localStorage (stiknex_calc_history)
 * - Multi-line wrapped expression display (no '...' truncation)
 * - 16-digit limit per number segment (without arithmetic operator)
 * - Tactile squircle keys with active operator glowing highlight
 * - Sliding Sidebar Drawer with Universal Search, Feedback & Related Tools
 * - Floatable / Draggable Help (?) button opening comprehensive modal
 * - 100% crawlable semantic SEO markup in DOM for search engines & assistive tech
 */

const KEYPAD_ROWS = [
  [
    { label: "AC", type: "function", action: "clear" },
    { label: "\u00B1", type: "function", action: "negate" },
    { label: "%", type: "function", action: "percent" },
    { label: "DEL", type: "function", action: "backspace", isBackspace: true }
  ],
  [
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "\u00F7", type: "operator" }
  ],
  [
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "\u00D7", type: "operator" }
  ],
  [
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "\u2212", type: "operator" }
  ],
  [
    { label: "0", type: "number" },
    { label: ".", type: "number" },
    { label: "+", type: "operator" },
    { label: "=", type: "equal" }
  ]
];

// Curated Related Tools for Rich Interlinking
const RELATED_CALCULATORS = [
  {
    slug: "scientific-calculator",
    title: "Scientific Calculator",
    icon: "fa-solid fa-calculator",
    desc: "Trigonometry, logarithms, powers, and engineering math."
  },
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    icon: "fa-solid fa-percent",
    desc: "Calculate percentage changes, increases, and fractional proportions."
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    icon: "fa-solid fa-cake-candles",
    desc: "Calculate exact age in years, months, days, and total hours."
  },
  {
    slug: "date-difference-calculator",
    title: "Date Difference Calculator",
    icon: "fa-solid fa-calendar-days",
    desc: "Measure days, calendar weeks, and business days between dates."
  },
  {
    slug: "discount-calculator",
    title: "Discount Calculator",
    icon: "fa-solid fa-tags",
    desc: "Instant sale savings, percentage off, and final price breakdown."
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    icon: "fa-solid fa-ruler-combined",
    desc: "Convert length, mass, temperature, area, volume, and data sizes."
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    icon: "fa-solid fa-weight-scale",
    desc: "Body Mass Index assessment with WHO health category classifications."
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator",
    icon: "fa-solid fa-receipt",
    desc: "Split restaurant bills and calculate gratuity per person."
  },
  {
    slug: "time-calculator",
    title: "Time Calculator",
    icon: "fa-solid fa-clock",
    desc: "Add, subtract, and convert hours, minutes, and seconds."
  }
];

// Helper to format numbers with commas for display (e.g. 12454 -> 12,454)
function formatNumberWithCommas(value) {
  if (value === "" || value === null || value === undefined) return "0";
  if (value === "Error" || value === "Infinity" || value === "-Infinity") return value;

  const str = String(value);
  const parts = str.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// Helper to format relative history timestamps
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

export default function SimpleCalculator({ tool, seoData }) {
  const { darkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  const [expr, setExpr] = useState("");
  const [lastCalculated, setLastCalculated] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedItemIdx, setCopiedItemIdx] = useState(null);

  // History state with localStorage persistence
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_calc_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal, Drawer & Responsive States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("howTo");
  const [isDesktop, setIsDesktop] = useState(false);
  const [companionTab, setCompanionTab] = useState("history");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio click synthesizer
  const audioCtxRef = useRef(null);
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }, [soundEnabled]);

  const constraintsRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Screen size listener for desktop companion mode
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Safe evaluation
  const safeEval = useCallback((input) => {
    try {
      if (!input || input.trim() === "") return "";

      const sanitized = input
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/%/g, "/100");

      // Validate allowed mathematical characters only
      if (!/^[0-9+\-*/.() ]*$/.test(sanitized)) {
        return "";
      }

      // Avoid trailing operators during evaluation
      const cleanExpr = sanitized.replace(/[+\-*/.]+$/, "");
      if (!cleanExpr) return "";

      // Evaluate safely
      const result = Function(`"use strict"; return (${cleanExpr})`)();

      if (typeof result !== "number" || !isFinite(result)) {
        return "Error";
      }

      // Round to 10 decimal places to eliminate floating point quirks
      const rounded = Math.round(result * 1e10) / 1e10;
      return rounded;
    } catch {
      return "";
    }
  }, []);

  // Live evaluated preview value
  const liveResult = useMemo(() => {
    if (!expr) return "0";
    const evaluated = safeEval(expr);
    return evaluated === "" ? (lastCalculated !== null ? lastCalculated : "0") : evaluated;
  }, [expr, safeEval, lastCalculated]);

  // Formatted display string
  const formattedResult = useMemo(() => {
    return formatNumberWithCommas(liveResult);
  }, [liveResult]);

  // Active number segment digit count (max 16 digits per number without operator)
  const currentSegmentDigits = useMemo(() => {
    if (!expr) return 0;
    const segments = expr.split(/[\u00F7\u00D7\u2212+]/);
    const lastSeg = segments[segments.length - 1] || "";
    return (lastSeg.match(/\d/g) || []).length;
  }, [expr]);

  // Active trailing operator for visual highlight
  const activeOperator = useMemo(() => {
    if (!expr) return null;
    const lastChar = expr.slice(-1);
    return ["\u00F7", "\u00D7", "\u2212", "+"].includes(lastChar) ? lastChar : null;
  }, [expr]);

  // Save calculation to History & localStorage
  const saveToHistory = useCallback((expression, resultVal) => {
    if (!expression || expression === String(resultVal)) return;
    const item = {
      id: "calc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      expression: String(expression).trim(),
      result: String(resultVal),
      timestamp: new Date().toISOString()
    };
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].expression === item.expression && prev[0].result === item.result) {
        return prev;
      }
      const updated = [item, ...prev].slice(0, 50);
      try {
        localStorage.setItem("stiknex_calc_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save history to localStorage", e);
      }
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("stiknex_calc_history");
    } catch (e) {
      console.warn("Could not clear history", e);
    }
  }, []);

  // Delete single history item
  const deleteHistoryItem = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("stiknex_calc_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Recall item to expression or result
  const restoreHistoryItem = useCallback((item, type = "result") => {
    if (type === "expression") {
      setExpr(item.expression);
      setLastCalculated(null);
    } else {
      setExpr(item.result);
      setLastCalculated(item.result);
    }
    if (!isDesktop) {
      setIsHistoryOpen(false);
    }
  }, [isDesktop]);

  // Copy single history item
  const copyHistoryResult = useCallback((txt, idx, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(String(txt));
    setCopiedItemIdx(idx);
    setTimeout(() => setCopiedItemIdx(null), 1800);
  }, []);

  // Micro-haptic tactile feedback
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  }, []);

  // Button press handler
  const handlePress = useCallback((item) => {
    triggerHaptic();
    const { label, action, type } = item;

    if (action === "clear") {
      setExpr("");
      setLastCalculated(null);
      return;
    }

    if (action === "backspace") {
      setExpr((prev) => (prev.length > 0 ? prev.slice(0, -1) : ""));
      return;
    }

    if (action === "negate") {
      setExpr((prev) => {
        if (!prev) return "\u2212";
        const match = prev.match(/([\u2212\-+?[0-9.]+)$/);
        if (match) {
          const num = match[1];
          const toggled = num.startsWith("-") || num.startsWith("\u2212") ? num.slice(1) : `\u2212${num}`;
          return prev.slice(0, prev.length - num.length) + toggled;
        }
        return prev + "\u2212";
      });
      return;
    }

    if (action === "percent") {
      setExpr((prev) => (prev ? `${prev}%` : ""));
      return;
    }

    if (type === "equal") {
      const evaluated = safeEval(expr);
      if (evaluated !== "" && evaluated !== "Error") {
        saveToHistory(expr, evaluated);
        setLastCalculated(evaluated);
        setExpr(String(evaluated));
      }
      return;
    }

    // Numbers & Operators
    setExpr((prev) => {
      // 1. Operators handling
      const operators = ["\u00F7", "\u00D7", "\u2212", "+"];
      if (operators.includes(label)) {
        if (!prev && label === "\u2212") return "\u2212"; // Allow leading minus
        if (!prev) return "";
        const lastChar = prev.slice(-1);
        if (operators.includes(lastChar)) {
          return prev.slice(0, -1) + label; // Replace operator
        }
        return prev + label;
      }

      // 2. Active number segment
      const segments = prev.split(/[\u00F7\u00D7\u2212+]/);
      const lastSegment = segments[segments.length - 1] || "";

      // Decimal point check
      if (label === ".") {
        if (lastSegment && lastSegment.includes(".")) return prev;
        if (!lastSegment) return prev + "0.";
        return prev + ".";
      }

      // Digits (0-9): Max 16 digits per number segment without an arithmetic operator
      if (/^[0-9]$/.test(label)) {
        const digitCount = (lastSegment.match(/\d/g) || []).length;
        if (digitCount >= 16) {
          return prev;
        }

        // Prevent duplicate leading zeros ("00")
        if (lastSegment === "0" && label === "0") {
          return prev;
        }
        if (lastSegment === "0" && label !== "0") {
          return prev.slice(0, -1) + label;
        }

        return prev + label;
      }

      return prev;
    });
  }, [expr, safeEval, saveToHistory, triggerHaptic]);

  // Copy result to clipboard
  const copyResult = () => {
    const textToCopy = String(liveResult).replace(/,/g, "");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Physical Keyboard listener
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isDrawerOpen || isHelpOpen) {
        if (e.key === "Escape") {
          setIsDrawerOpen(false);
          setIsHelpOpen(false);
        }
        return;
      }

      if (e.key === "Escape") {
        if (isHistoryOpen) {
          setIsHistoryOpen(false);
          return;
        }
      }

      // Toggle history via 'h' or 'H'
      if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
        return;
      }

      const keyMap = {
        "*": { label: "\u00D7", type: "operator" },
        "/": { label: "\u00F7", type: "operator" },
        "-": { label: "\u2212", type: "operator" },
        "+": { label: "+", type: "operator" },
        "Enter": { label: "=", type: "equal" },
        "=": { label: "=", type: "equal" },
        "%": { label: "%", type: "function", action: "percent" },
        "Backspace": { label: "DEL", type: "function", action: "backspace", isBackspace: true },
        "Delete": { label: "AC", type: "function", action: "clear" },
        "Escape": { label: "AC", type: "function", action: "clear" },
        "c": { label: "AC", type: "function", action: "clear" },
        "C": { label: "AC", type: "function", action: "clear" },
        "?": { action: "open_help" }
      };

      if (e.key === "?") {
        e.preventDefault();
        setIsHelpOpen(true);
        return;
      }

      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        handlePress({ label: e.key, type: "number" });
      } else if (keyMap[e.key]) {
        e.preventDefault();
        handlePress(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePress, isDrawerOpen, isHelpOpen, isHistoryOpen]);

  // Handle Quick Search trigger
  const triggerQuickSearch = () => {
    setIsDrawerOpen(false);
    window.dispatchEvent(new Event("stiknex_open_quick_search"));
  };

  // Handle Feedback trigger
  const triggerFeedback = () => {
    setIsDrawerOpen(false);
    window.dispatchEvent(new Event("stiknex_open_feedback"));
  };

  return (
    <div className="fixed inset-0 lg:relative lg:inset-auto w-full h-[100dvh] lg:min-h-screen pb-14 md:pb-0 flex flex-col justify-between overflow-y-auto no-scrollbar select-none font-sans bg-gradient-to-b from-[#EBF2F9] via-[#E2EDF7] to-[#D6E5F2] dark:from-[#0E141D] dark:via-[#0A0E15] dark:to-[#070A0E] text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* ─── DESKTOP FULL-SCREEN WORKSTATION (>= lg) ─── */}
      {isDesktop ? (
        <div className="w-full flex-1 flex flex-col justify-between min-h-0">
          {/* Top Full-Width Sticky Navigation Header */}
          <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xs dark:shadow-none transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
                title="Open Stiknex Menu & Tools"
                aria-label="Open Stiknex Menu"
              >
                <Menu size={20} className="group-hover:scale-105 transition-transform" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/20 shrink-0">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 uppercase leading-none">
                      <span>Basic</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Calculator</span>
                    </h1>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 tracking-wider uppercase">
                      Arithmetic Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                    Instant In-Browser Arithmetic with Persistent Calculation Tape
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                title="Toggle Light / Dark Theme"
              >
                {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                  soundEnabled
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}
                title={soundEnabled ? "Mute audio" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              <button
                type="button"
                onClick={() => handlePress({ label: "AC", type: "function", action: "clear" })}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                title="Reset (AC)"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsHelpOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                title="Help & Keyboard Shortcuts (?)"
              >
                <HelpCircle size={15} />
              </button>
            </div>
          </div>

          {/* Main Full-Width Desktop Workstation */}
          <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between min-h-0">
            <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">
              {/* LEFT COLUMN: DESKTOP KEYPAD TERMINAL (7 or 8 COLS) */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-4 rounded-3xl p-5 lg:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/70 dark:border-white/5 bg-[#EBF2F9]/90 dark:bg-[#0D141F] flex-1">
                {/* Screen Display Area */}
                <div className="w-full rounded-2xl p-5 bg-white/95 dark:bg-[#070C13] border border-white/90 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-black/50 text-right flex flex-col justify-between min-h-[160px]">
                  {/* Top Sub-Row: Copy Button & Status Badges */}
                  <div className="shrink-0 flex items-center justify-between pb-1.5 text-xs">
                    <button
                      type="button"
                      onClick={copyResult}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 shadow-xs dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300 dark:hover:text-blue-400"
                      title="Copy calculated result"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copied ? "Copied" : "Copy Result"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {activeOperator && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500 text-white shadow-xs">
                          {activeOperator}
                        </span>
                      )}
                      {currentSegmentDigits >= 14 && (
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10">
                          {currentSegmentDigits}/16 digits
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expression Tape */}
                  <div className="flex-1 min-h-[26px] flex flex-col justify-end text-right overflow-y-auto no-scrollbar py-0.5">
                    <div className="text-xl sm:text-2xl font-mono font-medium text-slate-500 dark:text-slate-400 tracking-wider break-all leading-relaxed text-right select-text">
                      {expr || (lastCalculated !== null ? String(lastCalculated) : " ")}
                    </div>
                  </div>

                  {/* Large Bold Result Display */}
                  <div className="shrink-0 text-right py-1 overflow-x-auto no-scrollbar">
                    <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight break-all select-all font-mono inline-flex items-baseline justify-end flex-wrap">
                      <span className="text-slate-400 dark:text-slate-500 font-light mr-2 text-3xl sm:text-4xl">=</span>
                      <span>{formattedResult}</span>
                    </div>
                  </div>
                </div>

                {/* Keypad Grid (5 Rows x 4 Columns) with Spacious Touch Targets */}
                <div className="shrink-0 w-full pt-1 pb-1">
                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {KEYPAD_ROWS.map((row, rowIdx) =>
                      row.map((item, colIdx) => {
                        const isEqual = item.type === "equal";
                        const isOperator = item.type === "operator";
                        const isFunction = item.type === "function";
                        const isCurrentActiveOp = isOperator && activeOperator === item.label;

                        let buttonClasses = "";

                        if (isEqual) {
                          buttonClasses =
                            "bg-[#1D8BF1] hover:bg-[#1678D3] active:bg-[#1265B3] text-white shadow-[0_6px_22px_rgba(29,139,241,0.45)] font-black text-2xl sm:text-3xl";
                        } else if (isOperator) {
                          buttonClasses = isCurrentActiveOp
                            ? "bg-[#1D8BF1] text-white shadow-[0_6px_18px_rgba(29,139,241,0.4)] font-black text-2xl"
                            : "bg-[#D9E7F5]/90 hover:bg-[#CCE0F3] active:bg-[#BEDAFA] text-blue-600 shadow-sm dark:bg-[#151D28] dark:hover:bg-[#1B2635] dark:active:bg-[#101722] dark:text-blue-400 dark:border dark:border-white/5 font-bold text-xl sm:text-2xl";
                        } else if (isFunction) {
                          buttonClasses =
                            "bg-[#DBE7F3]/90 hover:bg-[#D3E1EE] active:bg-[#C9D9E8] text-slate-700 shadow-sm dark:bg-[#131A24] dark:hover:bg-[#1A2330] dark:active:bg-[#0F151E] dark:text-slate-300 dark:border dark:border-white/5 font-bold text-base sm:text-lg";
                        } else {
                          buttonClasses =
                            "bg-white/95 hover:bg-white active:bg-slate-100 text-slate-800 shadow-sm dark:bg-[#18202C] dark:hover:bg-[#1F2937] dark:active:bg-[#141A24] dark:text-slate-100 dark:border dark:border-white/5 font-bold text-xl sm:text-2xl";
                        }

                        return (
                          <button
                            key={`desktop-${rowIdx}-${colIdx}`}
                            type="button"
                            onClick={() => handlePress(item)}
                            className={`h-14 sm:h-16 lg:h-18 rounded-2xl sm:rounded-[22px] flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${buttonClasses}`}
                            aria-label={`Key ${item.label}`}
                          >
                            {item.isBackspace ? <Delete size={22} /> : item.label}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Keyboard Shortcuts Strip */}
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Shortcuts: Numbers 0-9 • + - * / • Enter (=) • Esc (AC) • Backspace (DEL)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">16-Digit Real-Time Precision</span>
                </div>
              </div>

              {/* RIGHT COLUMN (5 or 4 COLS): DEDICATED PERMANENT COMPANION PANEL */}
              <div className="hidden lg:flex col-span-12 lg:col-span-5 xl:col-span-4 flex-col justify-between rounded-3xl p-5 bg-[#EBF2F9]/90 dark:bg-[#0D141F] border border-white/70 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                <div className="flex-1 flex flex-col justify-between rounded-2xl p-4 bg-[#090E16] border border-white/5 shadow-inner shadow-black/50">
                  {/* Header: Tabs */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCompanionTab("history")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          companionTab === "history"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Clock size={13} />
                        <span>History ({history.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompanionTab("tools")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          companionTab === "tools"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Calculator size={13} />
                        <span>Calculators</span>
                      </button>
                    </div>

                    {history.length > 0 && companionTab === "history" && (
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-950/30 transition cursor-pointer"
                        title="Clear History"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Body: History Tape or Calculators */}
                  <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2 h-[340px]">
                    {companionTab === "history" ? (
                      history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                          <Clock size={36} className="opacity-30 mb-2 stroke-1" />
                          <p className="text-xs font-bold">No History Recorded</p>
                          <p className="text-[11px] opacity-75 mt-1 max-w-[200px]">
                            Completed calculations will automatically be stored here.
                          </p>
                        </div>
                      ) : (
                        history.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="group p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                              <span className="truncate max-w-[180px]">{item.expression}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] opacity-70">{formatHistoryTime(item.timestamp)}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(String(item.result));
                                    setCopiedItemIdx(idx);
                                    setTimeout(() => setCopiedItemIdx(null), 1800);
                                  }}
                                  className="p-0.5 hover:text-blue-400 transition cursor-pointer"
                                  title="Copy Result"
                                >
                                  {copiedItemIdx === idx ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setExpr(item.expression);
                                  setLastCalculated(null);
                                }}
                                className="text-[11px] font-semibold text-slate-400 hover:text-blue-400 transition cursor-pointer"
                                title="Insert into expression"
                              >
                                Insert
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpr(item.result);
                                  setLastCalculated(item.result);
                                }}
                                className="text-right font-mono font-black text-sm text-blue-400 hover:underline transition cursor-pointer"
                                title="Use result"
                              >
                                = {formatNumberWithCommas(item.result)}
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      RELATED_CALCULATORS.map((calc) => (
                        <Link
                          key={calc.slug}
                          to={`/${calc.slug}`}
                          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition block group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400">
                              {calc.title}
                            </span>
                            <ArrowRight size={13} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {calc.desc}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Quick Actions Footer */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Quick Actions
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={copyResult}
                        className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Copy size={12} />
                        <span className="truncate">Copy Result</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (expr) {
                            navigator.clipboard.writeText(expr);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1800);
                          }
                        }}
                        className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Calculator size={12} />
                        <span className="truncate">Expression</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span className="truncate">Clear Tape</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Safe-Area Footer */}
          <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Stiknex Basic Engine • 100% In-Browser Arithmetic &amp; Calculation Tape
            </p>
          </footer>
        </div>
      ) : (
        /* ─── MOBILE VIEW (< lg): HANDHELD CHASSIS ─── */
        <main className="w-full flex-1 h-full flex flex-col justify-between p-0 overflow-y-auto no-scrollbar min-h-0">
          <div className="w-full max-w-md h-full flex flex-col justify-between px-3.5 sm:px-5 pt-2 pb-1 sm:pb-2 mx-auto relative transition-all">

            {/* ─── Top Bar: Menu Button, Title Badge, History & Theme Toggle ─── */}
            <div className="shrink-0 flex items-center justify-between pt-1 pb-2 sm:pb-3 px-1 border-b border-black/5 dark:border-white/5">
              {/* Menu / Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer
                  bg-white/80 hover:bg-white text-slate-700 shadow-xs border border-slate-200/80
                  dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/5 dark:text-slate-200"
                title="Open Stiknex Menu & Tools"
                aria-label="Open Stiknex Menu"
              >
                <Menu size={20} />
              </button>

              {/* Calculator Title & Mode Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 shadow-xs">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Calculator size={11} className="text-white" />
                </div>
                <h1 className="text-xs font-black tracking-wide uppercase text-slate-800 dark:text-slate-200 m-0 p-0 inline">
                  Basic Calculator
                </h1>
              </div>

              {/* Right Action Icons: History & Theme */}
              <div className="flex items-center gap-2">
                {/* History Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen((prev) => !prev)}
                  className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow ${
                    isHistoryOpen
                      ? "bg-blue-600 text-white shadow-blue-500/25"
                      : "bg-white/70 hover:bg-white text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                  }`}
                  title={isHistoryOpen ? "Close Calculation History (H)" : "View Calculation History (H)"}
                  aria-label="Toggle Calculation History"
                >
                  <History size={18} />
                  {history.length > 0 && !isHistoryOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {history.length > 9 ? "9+" : history.length}
                    </span>
                  )}
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer
                    bg-white/70 hover:bg-white text-slate-700 shadow-sm hover:shadow
                    dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                  title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
                  aria-label="Toggle Theme"
                >
                  {darkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-indigo-600" />}
                </button>
              </div>
            </div>

            {/* ─── Screen Display Area (All space allocated here between Copy and Result, UI never shakes) ─── */}
            <div className="flex-1 flex flex-col justify-between text-right px-2 py-0.5 min-h-[80px] overflow-hidden">
              {/* Top Row: Copy Button & 16-digit Badge */}
              <div className="shrink-0 flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={copyResult}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer
                    bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 shadow-xs
                    dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300 dark:hover:text-blue-400"
                  title="Copy calculated result"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                {currentSegmentDigits >= 14 && (
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10">
                    {currentSegmentDigits}/16 digits
                  </span>
                )}
              </div>

              {/* Middle Expression Tape: Fills all the vertical space where typing happens! Keypad stays still! */}
              <div className="flex-1 min-h-[20px] flex flex-col justify-end text-right overflow-y-auto no-scrollbar py-0">
                <div className="text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 tracking-wider break-all leading-snug text-right select-text font-mono">
                  {expr || (lastCalculated !== null ? String(lastCalculated) : " ")}
                </div>
              </div>

              {/* Large Bold Result Display (= 12,454) right above the keypad */}
              <div className="shrink-0 text-right py-1 overflow-x-auto no-scrollbar">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap select-all font-mono inline-flex items-baseline justify-end">
                  <span className="text-slate-400 dark:text-slate-500 font-light mr-1.5 text-2xl sm:text-3xl">=</span>
                  <span>{formattedResult}</span>
                </div>
              </div>
            </div>

            {/* ─── Keypad Grid (5 Rows x 4 Columns) - Firmly Anchored at Bottom ─── */}
            <div className="shrink-0 w-full pt-1 pb-1 sm:pb-2">
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                {KEYPAD_ROWS.map((row, rowIdx) =>
                  row.map((item, colIdx) => {
                    const isEqual = item.type === "equal";
                    const isOperator = item.type === "operator";
                    const isFunction = item.type === "function";
                    const isCurrentActiveOp = isOperator && activeOperator === item.label;

                    let buttonClasses = "";

                    if (isEqual) {
                      // Prominent Royal Electric Blue '=' Button
                      buttonClasses =
                        "bg-[#1D8BF1] hover:bg-[#1678D3] active:bg-[#1265B3] text-white shadow-[0_6px_20px_rgba(29,139,241,0.45)] dark:shadow-[0_6px_20px_rgba(29,139,241,0.6)] font-black text-2xl sm:text-3xl";
                    } else if (isOperator) {
                      // Cool Blue-Tinted Operator Buttons with Active Glow
                      buttonClasses = isCurrentActiveOp
                        ? "bg-[#1D8BF1] text-white shadow-[0_6px_18px_rgba(29,139,241,0.4)] dark:shadow-[0_6px_18px_rgba(29,139,241,0.55)] font-black text-2xl"
                        : "bg-[#D9E7F5]/90 hover:bg-[#CCE0F3] active:bg-[#BEDAFA] text-blue-600 shadow-[0_4px_12px_rgba(30,60,110,0.07)] dark:bg-[#151D28] dark:hover:bg-[#1B2635] dark:active:bg-[#101722] dark:text-blue-400 dark:shadow-[0_4px_14px_rgba(0,0,0,0.35)] dark:border dark:border-white/5 font-bold text-xl sm:text-2xl";
                    } else if (isFunction) {
                      // Soft Cool Function Buttons (AC, ±, %, DEL)
                      buttonClasses =
                        "bg-[#DBE7F3]/90 hover:bg-[#D3E1EE] active:bg-[#C9D9E8] text-slate-700 shadow-[0_4px_12px_rgba(30,60,110,0.06)] dark:bg-[#131A24] dark:hover:bg-[#1A2330] dark:active:bg-[#0F151E] dark:text-slate-300 dark:shadow-[0_4px_14px_rgba(0,0,0,0.3)] dark:border dark:border-white/5 font-bold text-base sm:text-lg";
                    } else {
                      // Tactile Soft White / Matte Slate Number Keys
                      buttonClasses =
                        "bg-white/95 hover:bg-white active:bg-slate-100 text-slate-800 shadow-[0_4px_12px_rgba(30,60,110,0.08)] dark:bg-[#18202C] dark:hover:bg-[#1F2937] dark:active:bg-[#141A24] dark:text-slate-100 dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:border dark:border-white/5 font-bold text-xl sm:text-2xl";
                    }

                    return (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        type="button"
                        onClick={() => handlePress(item)}
                        className={`h-[54px] sm:h-16 md:h-18 rounded-2xl sm:rounded-[22px] flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${buttonClasses}`}
                        aria-label={`Key ${item.label}`}
                      >
                        {item.isBackspace ? <Delete size={22} /> : item.label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* ─── Mobile / Tablet History Drawer Modal (< lg) ─── */}
      <AnimatePresence>
        {!isDesktop && isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Sliding Drawer Panel from Right */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative ml-auto w-[85vw] max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
                    <History size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      Calculation History
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {history.length} saved in local storage
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      title="Clear All History"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                    <Clock size={40} className="opacity-30 mb-2 stroke-1" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No History Yet</p>
                    <p className="text-xs opacity-75 mt-1 max-w-[220px]">
                      Calculations will automatically be saved to local storage as you press = or Enter.
                    </p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                        <span>{formatHistoryTime(item.timestamp)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => copyHistoryResult(item.result, idx, e)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Copy Result"
                          >
                            {copiedItemIdx === idx ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="p-1 hover:text-rose-500"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => restoreHistoryItem(item, "expression")}
                        className="w-full text-right font-mono text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition truncate cursor-pointer block"
                      >
                        {item.expression}
                      </button>

                      <button
                        type="button"
                        onClick={() => restoreHistoryItem(item, "result")}
                        className="w-full text-right font-mono font-black text-xl text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate cursor-pointer block mt-0.5"
                      >
                        = {formatNumberWithCommas(item.result)}
                      </button>

                      <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <button
                          type="button"
                          onClick={() => restoreHistoryItem(item, "expression")}
                          className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 cursor-pointer"
                        >
                          <CornerDownLeft size={11} />
                          <span>Reuse Expr</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => restoreHistoryItem(item, "result")}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Use Result</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-center">
                Stored privately in your browser's local storage
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Universal Stiknex Tool Sidebar Drawer ─── */}
      <ToolSidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        relatedTools={RELATED_CALCULATORS}
        categoryTitle="Related Calculators"
      />

      {/* ─── Help, Guide, Formulas & FAQ Modal (Opened via Floating ? Button) ─── */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      Basic Calculator Guide & Info
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Arithmetic engine, history storage & keyboard guide
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 gap-4 overflow-x-auto no-scrollbar">
                {[
                  { id: "howTo", label: "How to Use" },
                  { id: "features", label: "Features" },
                  { id: "shortcuts", label: "Shortcuts" },
                  { id: "faqs", label: "FAQs" },
                  { id: "related", label: "Related Tools" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveHelpTab(tab.id)}
                    className={`py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeHelpTab === tab.id
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Body Content */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
                {activeHelpTab === "howTo" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Start Instructions</h3>
                    <ol className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                        <span><strong>Enter Expression:</strong> Click or tap numeric buttons (0-9) and arithmetic operators (+, \u2212, \u00D7, \u00F7). Up to 16 digits per number.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                        <span><strong>Live Result Preview:</strong> Notice the result preview updating in real-time below the expression as you enter numbers.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                        <span><strong>Compute & Save:</strong> Press <strong>=</strong> or <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">Enter</kbd> to calculate. Calculations are saved to browser local storage.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                        <span><strong>Copy Result:</strong> Tap the <strong>Copy</strong> pill button above the display to copy the result instantly to your clipboard.</span>
                      </li>
                    </ol>
                  </div>
                )}

                {activeHelpTab === "features" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Core Capabilities</h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                        <span><strong>100% Client-Side Privacy:</strong> Zero telemetry or server calls. Your math calculations stay exclusively on your device.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <History size={16} className="text-blue-500 shrink-0" />
                        <span><strong>Local History Memory:</strong> Saves past 50 calculations across page refreshes. Reuse or copy equations anytime.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500 shrink-0" />
                        <span><strong>16-Digit Segment Limit:</strong> Clean scientific numeric precision without floating point artifact distortion.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Keyboard size={16} className="text-purple-500 shrink-0" />
                        <span><strong>Complete Keyboard Support:</strong> Full numpad and standard keyboard shortcuts for lightning-fast workflows.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeHelpTab === "shortcuts" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>0 - 9, .</span>
                        <span className="font-sans text-slate-400">Numbers & dot</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>+, -, *, /</span>
                        <span className="font-sans text-slate-400">Operators</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>Enter / =</span>
                        <span className="font-sans text-slate-400">Calculate</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>Backspace</span>
                        <span className="font-sans text-slate-400">Delete char</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>Escape / C</span>
                        <span className="font-sans text-slate-400">Clear (AC)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>H</span>
                        <span className="font-sans text-slate-400">Toggle History</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>?</span>
                        <span className="font-sans text-slate-400">Open Help</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span>%</span>
                        <span className="font-sans text-slate-400">Percentage</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHelpTab === "faqs" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white">Does this calculator work completely offline?</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Yes! Once loaded in your browser, all mathematical operations execute locally in your browser's JavaScript engine without requiring an active internet connection.</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white">How many digits can I enter in a single number?</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">You can type up to 16 digits per number segment before entering an operator (+, -, *, /) to maintain high numerical precision.</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white">Where is my calculation history saved?</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Your calculations are saved in your web browser's private localStorage. They are never sent to external servers and can be wiped anytime via the trash icon.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHelpTab === "related" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Explore More Math & Productivity Tools</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {RELATED_CALCULATORS.map((item) => (
                        <Link
                          key={item.slug}
                          to={`/${item.slug}`}
                          onClick={() => setIsHelpOpen(false)}
                          className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 text-sm">
                            <i className={item.icon}></i>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>Free & Private In-Browser Calculator</span>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition cursor-pointer"
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
