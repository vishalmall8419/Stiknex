import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  Briefcase,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  History,
  Trash2,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  ArrowLeftRight,
  TrendingUp,
  Layers,
  Calculator
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { formatDateDDMMYYYY, formatHistoryTimestamp } from "../../../utils/dateFormat";

/**
 * Full-Page Desktop Workstation & Snug Mobile Chassis: Date Difference & Workdays Calculator
 * Standardized across Phase 1 Tools:
 * - Desktop (lg): 12-Column Expansive Dual-Station (col-span-8 interactive workstation + col-span-4 permanent companion panel)
 * - Mobile (< lg): Snug handheld chassis with sliding drawers for Navigation and History
 * - Stationary inputs (zero vertical shaking or jumping)
 * - Persistent calculation tape in localStorage (stiknex_date_calc_history)
 * - 3 Working Modes:
 *     1. Days Between Dates (Exact days, weeks, months, business workdays, total hours/minutes)
 *     2. Add / Subtract (Date offset by days, weeks, months, years)
 *     3. Business Working Days (Excluding Sat/Sun + weekend tally)
 * - Floatable / Draggable Help (?) button starting at top-20 right-4
 * - Web Audio API synthesized tactile sound
 * - 100% crawlable semantic SEO markup in DOM
 */

const RELATED_CALCULATORS = [
  { slug: "age-calculator", title: "Age Calculator", icon: "fa-solid fa-cake-candles", desc: "Calculate exact chronological age, next birthday, and milestones" },
  { slug: "time-calculator", title: "Time Calculator", icon: "fa-solid fa-clock", desc: "Add, subtract, and convert hours, minutes, and seconds" },
  { slug: "percentage-calculator", title: "Percentage Calculator", icon: "fa-solid fa-percent", desc: "Fast percentage of value, ratio, change, and discounts" },
  { slug: "basic-calculator", title: "Basic Calculator", icon: "fa-solid fa-calculator", desc: "Clean in-browser arithmetic with calculation tape" },
  { slug: "scientific-calculator", title: "Scientific Calculator", icon: "fa-solid fa-square-root-variable", desc: "High-precision trigonometry, logarithms, and powers" }
];

function formatHistoryTime(iso) {
  return formatHistoryTimestamp(iso);
}

function getDayOfWeekName(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { weekday: "long" });
  } catch {
    return "";
  }
}

export default function DateCalculator({ tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: 'between' (Days Between Dates) | 'addSubtract' (Add/Subtract from Date) | 'business' (Work Days)
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/date-calculator") return "addSubtract";
      if (window.location.pathname === "/business-days-calculator") return "business";
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode");
      if (m && ["between", "addSubtract", "business"].includes(m)) return m;
    }
    return "between";
  });

  useEffect(() => {
    if (location.pathname === "/date-calculator") setMode("addSubtract");
    else if (location.pathname === "/business-days-calculator") setMode("business");
    else if (location.pathname === "/date-difference-calculator") setMode("between");
  }, [location.pathname]);

  const switchMode = (newMode) => {
    playClickSound();
    setMode(newMode);
    if (newMode === "business") {
      navigate("/business-days-calculator");
    } else if (newMode === "addSubtract") {
      navigate("/date-calculator");
    } else {
      navigate("/date-difference-calculator");
    }
  };

  // Mode 1: Days Between
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [includeEndDay, setIncludeEndDay] = useState(false);

  // Mode 2: Add / Subtract
  const [baseDate, setBaseDate] = useState(todayStr);
  const [offsetCount, setOffsetCount] = useState("30");
  const [offsetUnit, setOffsetUnit] = useState("days"); // 'days' | 'weeks' | 'months' | 'years'
  const [offsetOp, setOffsetOp] = useState("add"); // 'add' | 'subtract'

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
        osc.frequency.setValueAtTime(560, audioCtxRef.current.currentTime);
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
      const saved = localStorage.getItem("stiknex_date_calc_history");
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
        localStorage.setItem("stiknex_date_calc_history", JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    playClickSound();
    setHistory([]);
    try {
      localStorage.removeItem("stiknex_date_calc_history");
    } catch {
      // ignore
    }
  }, [playClickSound]);

  // CALCULATION 1: Days Between Dates
  const betweenStats = useMemo(() => {
    if (!startDate || !endDate) return null;
    const d1 = new Date(startDate + "T00:00:00");
    const d2 = new Date(endDate + "T00:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const isReversed = d2 < d1;
    const early = isReversed ? d2 : d1;
    const late = isReversed ? d1 : d2;

    const diffMs = late.getTime() - early.getTime();
    let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (includeEndDay) totalDays += 1;

    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    // Working/business days (excluding Sat and Sun)
    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(early);
    const stopLimit = new Date(late);
    if (!includeEndDay) {
      stopLimit.setDate(stopLimit.getDate() - 1);
    }
    while (cur <= stopLimit) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    // Months + days remainder
    let months = (late.getFullYear() - early.getFullYear()) * 12 + (late.getMonth() - early.getMonth());
    let daysRemainder = late.getDate() - early.getDate();
    if (daysRemainder < 0) {
      months -= 1;
      const prevMonth = new Date(late.getFullYear(), late.getMonth(), 0);
      daysRemainder += prevMonth.getDate();
    }
    if (includeEndDay) daysRemainder += 1;

    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const percentOfYear = ((totalDays / 365.25) * 100).toFixed(1);

    const primaryText = `${totalDays.toLocaleString()} Days`;
    const breakdownText = `${weeks} weeks${remDays > 0 ? ` + ${remDays} days` : ""}`;
    const businessText = `${businessDays.toLocaleString()} business days (${weekendDays} weekend days)`;

    return {
      early,
      late,
      isReversed,
      totalDays,
      weeks,
      remDays,
      businessDays,
      weekendDays,
      months: Math.max(0, months),
      daysRemainder: Math.max(0, daysRemainder),
      totalHours,
      totalMinutes,
      totalSeconds,
      percentOfYear,
      primaryText,
      breakdownText,
      businessText
    };
  }, [startDate, endDate, includeEndDay]);

  // CALCULATION 2: Add / Subtract from Date
  const addSubtractStats = useMemo(() => {
    if (!baseDate) return null;
    const d = new Date(baseDate + "T00:00:00");
    const count = parseInt(offsetCount, 10);
    if (isNaN(d.getTime()) || isNaN(count)) return null;

    const multiplier = offsetOp === "add" ? 1 : -1;
    const delta = count * multiplier;

    const target = new Date(d);
    if (offsetUnit === "days") {
      target.setDate(target.getDate() + delta);
    } else if (offsetUnit === "weeks") {
      target.setDate(target.getDate() + delta * 7);
    } else if (offsetUnit === "months") {
      target.setMonth(target.getMonth() + delta);
    } else if (offsetUnit === "years") {
      target.setFullYear(target.getFullYear() + delta);
    }

    const dmy = formatDateDDMMYYYY(target);
    const weekday = target.toLocaleDateString(undefined, { weekday: "long" });
    const formattedTarget = `${dmy} (${weekday})`;

    const isoTarget = target.toISOString().split("T")[0];

    // Days relative to today
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const targetMidnight = new Date(target);
    targetMidnight.setHours(0, 0, 0, 0);
    const diffDaysFromToday = Math.round((targetMidnight.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let relativeLabel = "";
    if (diffDaysFromToday === 0) relativeLabel = "Today";
    else if (diffDaysFromToday === 1) relativeLabel = "Tomorrow";
    else if (diffDaysFromToday === -1) relativeLabel = "Yesterday";
    else if (diffDaysFromToday > 0) relativeLabel = `In ${diffDaysFromToday} days`;
    else relativeLabel = `${Math.abs(diffDaysFromToday)} days ago`;

    return {
      target,
      isoTarget,
      dmy,
      formattedTarget,
      relativeLabel,
      primaryText: formattedTarget,
      operationDesc: `${offsetOp === "add" ? "+" : "−"} ${count} ${offsetUnit}`
    };
  }, [baseDate, offsetCount, offsetUnit, offsetOp]);

  // Active Result text to copy
  const activeResultText = useMemo(() => {
    if (mode === "between" || mode === "business") {
      if (!betweenStats) return "";
      return mode === "business"
        ? `${betweenStats.businessDays} business days`
        : `${betweenStats.totalDays} days (${betweenStats.weeks} weeks, ${betweenStats.businessDays} business days)`;
    }
    if (mode === "addSubtract") {
      return addSubtractStats ? addSubtractStats.formattedTarget : "";
    }
    return "";
  }, [mode, betweenStats, addSubtractStats]);

  // Copy handler with animation
  const handleCopy = useCallback((customText = null) => {
    playClickSound();
    const textToCopy = customText || activeResultText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(String(textToCopy).replace(/,/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Save to history upon copy
    if (mode === "between") {
      saveToHistory({
        mode: "between",
        label: `Between ${formatDateDDMMYYYY(startDate)} & ${formatDateDDMMYYYY(endDate)}`,
        result: `${betweenStats?.totalDays || 0} Days (${betweenStats?.businessDays || 0} work days)`,
        startDate,
        endDate
      });
    } else if (mode === "business") {
      saveToHistory({
        mode: "business",
        label: `Work Days: ${formatDateDDMMYYYY(startDate)} to ${formatDateDDMMYYYY(endDate)}`,
        result: `${betweenStats?.businessDays || 0} Business Days`,
        startDate,
        endDate
      });
    } else if (mode === "addSubtract") {
      saveToHistory({
        mode: "addSubtract",
        label: `${formatDateDDMMYYYY(baseDate)} ${addSubtractStats?.operationDesc}`,
        result: addSubtractStats?.formattedTarget || "",
        baseDate,
        offsetCount,
        offsetUnit,
        offsetOp
      });
    }
  }, [playClickSound, activeResultText, mode, startDate, endDate, betweenStats, baseDate, addSubtractStats, offsetCount, offsetUnit, offsetOp, saveToHistory]);

  // Swap dates
  const swapDates = useCallback(() => {
    playClickSound();
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  }, [playClickSound, startDate, endDate]);

  // Quick preset shortcuts
  const applyPreset = useCallback((preset) => {
    playClickSound();
    const today = new Date();
    if (preset === "today") {
      setStartDate(today.toISOString().split("T")[0]);
    } else if (preset === "endOfMonth") {
      const eom = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setEndDate(eom.toISOString().split("T")[0]);
    } else if (preset === "newYear") {
      const ny = new Date(today.getFullYear() + 1, 0, 1);
      setEndDate(ny.toISOString().split("T")[0]);
    } else if (preset === "plus30") {
      const d = new Date(today);
      d.setDate(d.getDate() + 30);
      setEndDate(d.toISOString().split("T")[0]);
    } else if (preset === "plus90") {
      const d = new Date(today);
      d.setDate(d.getDate() + 90);
      setEndDate(d.toISOString().split("T")[0]);
    } else if (preset === "plus180") {
      const d = new Date(today);
      d.setDate(d.getDate() + 180);
      setEndDate(d.toISOString().split("T")[0]);
    }
  }, [playClickSound]);

  // Filtered sidebar items
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return RELATED_CALCULATORS;
    const q = searchQuery.toLowerCase();
    return RELATED_CALCULATORS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 100% Crawlable Semantic SEO Hidden in DOM */}
      <header className="sr-only">
        <h1>{seoData?.h1 || "Free Online Date Difference & Business Days Calculator"}</h1>
        <p>{seoData?.description || "Calculate exact duration, calendar days, weeks, business workdays, and date offsets."}</p>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          TOP NAVIGATION HEADER (FULL-WIDTH WORKSTATION BAR)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 shadow-xs dark:shadow-none transition-colors">
        {/* Left: Drawer Toggle & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
            title="Open Menu & Navigation"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Date <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Calculator</span>
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 tracking-wider uppercase">
                  Workdays &amp; Offsets
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Calendar Duration, Business Workdays &amp; Date Offsets
              </p>
            </div>
          </div>
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

          {/* Help Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Date Calculations Help Guide (?)"
            aria-label="Open Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mobile History Toggle (Hidden on lg desktop) */}
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
            
            {/* Workstation Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-6 transition-all space-y-4 sm:space-y-6">
              
              {/* Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
                <button
                  onClick={() => switchMode("between")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "between"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <CalendarRange className="w-4 h-4 shrink-0" />
                  <span>Days Between</span>
                </button>

                <button
                  onClick={() => switchMode("addSubtract")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "addSubtract"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Add / Subtract</span>
                </button>

                <button
                  onClick={() => switchMode("business")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "business"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Work Days</span>
                </button>
              </div>

              {/* MODE 1: DAYS BETWEEN & MODE 3: BUSINESS DAYS */}
              {(mode === "between" || mode === "business") && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Start Date */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Start Date <span className="font-mono text-indigo-600 dark:text-indigo-400">({formatDateDDMMYYYY(startDate)})</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {getDayOfWeekName(startDate)}
                          </span>
                          <button
                            onClick={() => applyPreset("today")}
                            className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          playClickSound();
                          setStartDate(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      />
                    </div>

                    {/* End Date */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          End Date <span className="font-mono text-indigo-600 dark:text-indigo-400">({formatDateDDMMYYYY(endDate)})</span>
                        </label>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {getDayOfWeekName(endDate)}
                        </span>
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          playClickSound();
                          setEndDate(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Presets and Options Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={swapDates}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        title="Swap Start and End Dates"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Swap</span>
                      </button>

                      <span className="text-xs text-slate-400 font-bold ml-1">Presets:</span>
                      <button
                        onClick={() => applyPreset("endOfMonth")}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        End of Month
                      </button>
                      <button
                        onClick={() => applyPreset("plus30")}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        +30 Days
                      </button>
                      <button
                        onClick={() => applyPreset("plus90")}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        +90 Days
                      </button>
                      <button
                        onClick={() => applyPreset("plus180")}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        +180 Days
                      </button>
                      <button
                        onClick={() => applyPreset("newYear")}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        New Year
                      </button>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeEndDay}
                        onChange={(e) => {
                          playClickSound();
                          setIncludeEndDay(e.target.checked);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                      />
                      <span>Include end day (+1 day)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* MODE 2: ADD / SUBTRACT */}
              {mode === "addSubtract" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Base Date */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Starting Date
                        </label>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {getDayOfWeekName(baseDate)}
                        </span>
                      </div>
                      <input
                        type="date"
                        value={baseDate}
                        onChange={(e) => {
                          playClickSound();
                          setBaseDate(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      />
                    </div>

                    {/* Operation (+/-) & Count */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Operation & Amount
                        </label>
                        <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5 text-xs font-bold">
                          <button
                            onClick={() => {
                              playClickSound();
                              setOffsetOp("add");
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition ${offsetOp === "add" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
                          >
                            + Add
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              setOffsetOp("subtract");
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition ${offsetOp === "subtract" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
                          >
                            − Sub
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={offsetCount}
                        onChange={(e) => {
                          playClickSound();
                          setOffsetCount(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        placeholder="e.g. 30"
                      />
                    </div>

                    {/* Unit Selector */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Time Unit
                      </label>
                      <select
                        value={offsetUnit}
                        onChange={(e) => {
                          playClickSound();
                          setOffsetUnit(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Add Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-bold mr-1">Quick Add:</span>
                    {["7", "14", "30", "60", "90", "180", "365"].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => {
                          playClickSound();
                          setOffsetOp("add");
                          setOffsetUnit("days");
                          setOffsetCount(cnt);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        +{cnt}d
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  HERO RESULT SCREEN (STATIONARY, NON-SHAKING)
              ───────────────────────────────────────────────────────── */}
              <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/30 dark:shadow-none text-center relative overflow-hidden transition-all">
                
                {/* Copy Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => handleCopy()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Result"}</span>
                  </button>
                </div>

                {/* Mode 1 & 3: Difference Output */}
                {(mode === "between" || mode === "business") && betweenStats && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      {mode === "business" ? "Total Business Working Days" : "Total Calendar Duration"}
                    </span>

                    <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                      {mode === "business" ? (
                        <>
                          {betweenStats.businessDays.toLocaleString()}{" "}
                          <span className="text-xl sm:text-2xl font-bold text-slate-500">Working Days</span>
                        </>
                      ) : (
                        <>
                          {betweenStats.totalDays.toLocaleString()}{" "}
                          <span className="text-xl sm:text-2xl font-bold text-slate-500">Days</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Equivalent to <strong>{betweenStats.breakdownText}</strong> ({betweenStats.businessDays} business days, {betweenStats.weekendDays} weekend days)
                    </p>

                    {/* Secondary Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-indigo-100/80 dark:border-slate-800">
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Weeks</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {betweenStats.weeks}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Work Days</span>
                        <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {betweenStats.businessDays}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Weekend Days</span>
                        <span className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">
                          {betweenStats.weekendDays}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Approx. Months</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {betweenStats.months}m {betweenStats.daysRemainder}d
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode 2: Add / Subtract Output */}
                {mode === "addSubtract" && addSubtractStats && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Target Calculated Date ({addSubtractStats.operationDesc})
                    </span>

                    <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                      {addSubtractStats.formattedTarget}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {addSubtractStats.relativeLabel} • ISO Format: {addSubtractStats.isoTarget}
                    </p>
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────
                  ALL-UNITS EQUIVALENT MATRIX (WIDE 8-COL GRID)
              ───────────────────────────────────────────────────────── */}
              {(mode === "between" || mode === "business") && betweenStats && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Duration Breakdown Matrix
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {betweenStats.percentOfYear}% of a standard year
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Hours</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {betweenStats.totalHours.toLocaleString()} hrs
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Minutes</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {betweenStats.totalMinutes.toLocaleString()} min
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Seconds</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {betweenStats.totalSeconds.toLocaleString()} s
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Work Week Ratio</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                        {((betweenStats.businessDays / Math.max(1, betweenStats.totalDays)) * 100).toFixed(0)}% Work
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION PANEL (4 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex col-span-12 lg:col-span-4 flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none p-5 overflow-hidden">
            
            {/* Header / Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
                <button
                  onClick={() => {
                    playClickSound();
                    setCompanionTab("history");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    companionTab === "history"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  History Tape ({history.length})
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setCompanionTab("tools");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    companionTab === "tools"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Calculators
                </button>
              </div>

              {companionTab === "history" && history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Clear Calculation Tape"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* TAB 1: HISTORY TAPE */}
            {companionTab === "history" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <History className="w-8 h-8 mb-2 opacity-40 text-indigo-500" />
                    <p className="text-xs font-medium">No calculations recorded yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Results copied or calculated are recorded here with 1-click restore.
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition group flex items-start justify-between gap-2"
                    >
                      <div
                        onClick={() => {
                          playClickSound();
                          if (item.startDate) setStartDate(item.startDate);
                          if (item.endDate) setEndDate(item.endDate);
                          if (item.baseDate) setBaseDate(item.baseDate);
                          if (item.offsetCount) setOffsetCount(item.offsetCount);
                          if (item.offsetUnit) setOffsetUnit(item.offsetUnit);
                          if (item.offsetOp) setOffsetOp(item.offsetOp);
                          if (item.mode) setMode(item.mode);
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                          <span>{item.label}</span>
                          <span>•</span>
                          <span>{formatHistoryTime(item.timestamp)}</span>
                        </div>
                        <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.result}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(item.result)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition shadow-xs cursor-pointer"
                        title="Copy this result"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: RELATED CALCULATORS */}
            {companionTab === "tools" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
                {RELATED_CALCULATORS.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/${c.slug}`}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-slate-800/80 transition group block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {c.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {c.desc}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => handleCopy()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Copied to Clipboard!" : "Copy Active Result"}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearHistory}
                  disabled={history.length === 0}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Tape</span>
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Formulas</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* BOTTOM SAFE-AREA FOOTER CLEARANCE */}
      <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Stiknex Date Engine • High Precision Calendar &amp; Business Workday Calculations
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
        title="Date Calculator Guide & Formulas (Drag anywhere)"
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
                    Date History Tape ({history.length})
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
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <History className="w-8 h-8 mb-2 opacity-40 text-indigo-500" />
                    <p className="text-xs font-medium">No saved calculations yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        playClickSound();
                        if (item.startDate) setStartDate(item.startDate);
                        if (item.endDate) setEndDate(item.endDate);
                        if (item.baseDate) setBaseDate(item.baseDate);
                        if (item.offsetCount) setOffsetCount(item.offsetCount);
                        if (item.offsetUnit) setOffsetUnit(item.offsetUnit);
                        if (item.offsetOp) setOffsetOp(item.offsetOp);
                        if (item.mode) setMode(item.mode);
                        setMobileHistoryOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 transition cursor-pointer"
                    >
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.label}
                      </div>
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* HELP / FORMULAS MODAL */}
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
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Date &amp; Business Math Guide
                  </h3>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    1. Calendar Days vs Business Days
                  </h4>
                  <p>
                    Calendar Days count every single day between two dates. Business Days automatically exclude Saturdays and Sundays. Holidays can be accounted for by subtracting statutory bank holidays manually.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    2. Inclusive vs Exclusive Counting
                  </h4>
                  <p>
                    Standard date subtraction is exclusive of the final day (e.g., Monday to Tuesday is 1 day elapsed). If you are calculating a multi-day event or vacation where both days are fully lived, check &quot;Include end day&quot;.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    3. Date Offsets (Add / Subtract)
                  </h4>
                  <p>
                    Adding weeks multiplies the interval by 7 calendar days. Adding months or years accounts for variable month lengths (28 to 31 days) and leap years.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    4. Calendar &amp; Business Math Rules
                  </h4>
                  <div className="space-y-1.5">
                    <p>
                      <strong className="text-slate-900 dark:text-white">Business Days:</strong> Counts Monday through Friday, skipping Saturday and Sunday automatically.
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">End Day Toggle:</strong> Enable &quot;Include end day&quot; for inclusive event duration (e.g., full vacation dates).
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Sprints &amp; Notice:</strong> Standard 2-week agile sprint is 10 business days; 30-day notice is 22 work days.
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer"
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
