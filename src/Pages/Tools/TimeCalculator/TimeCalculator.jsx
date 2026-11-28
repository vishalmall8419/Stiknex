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
  Clock,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  History,
  Trash2,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Timer,
  Hourglass,
  DollarSign,
  Briefcase,
  Layers,
  Calculator
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";

/**
 * Full-Page Desktop Workstation & Snug Mobile Chassis: Professional Time & Timesheet Calculator
 * Standardized across Phase 1 Tools:
 * - Desktop (lg): 12-Column Expansive Dual-Station (col-span-8 interactive workstation + col-span-4 permanent companion panel)
 * - Mobile (< lg): Snug handheld chassis with sliding drawers for Navigation and History
 * - Stationary inputs (zero vertical shaking or jumping)
 * - Persistent calculation tape in localStorage (stiknex_time_calc_history)
 * - 3 Working Modes:
 *     1. Add & Subtract Time Intervals (Hours, Minutes, Seconds)
 *     2. Time Between Clocks (Start Time to End Time with cross-midnight support & break deduction)
 *     3. Time Unit Converter (Hours, Minutes, Seconds, Days, Weeks)
 * - Live Payroll & Timesheet Calculator (Hourly Rate to Gross Pay using Decimal Hours)
 * - Floatable / Draggable Help (?) button starting at top-20 right-4
 * - Web Audio API synthesized tactile sound
 * - 100% crawlable semantic SEO markup in DOM
 */

const RELATED_CALCULATORS = [
  { slug: "date-difference-calculator", title: "Date Difference Calculator", icon: "fa-solid fa-calendar-days", desc: "Compute exact calendar and business days between dates" },
  { slug: "age-calculator", title: "Age Calculator", icon: "fa-solid fa-cake-candles", desc: "Calculate exact chronological age, next birthday, and milestones" },
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

export default function TimeCalculator({ tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();

  // Modes: 'intervals' (Add/Sub Time) | 'clocks' (Between Times) | 'converter' (Unit converter)
  const [mode, setMode] = useState("intervals");

  // Mode 1: Intervals
  const [h1, setH1] = useState("8");
  const [m1, setM1] = useState("30");
  const [s1, setS1] = useState("0");
  const [intervalOp, setIntervalOp] = useState("add"); // 'add' | 'subtract'
  const [h2, setH2] = useState("2");
  const [m2, setM2] = useState("45");
  const [s2, setS2] = useState("0");

  // Mode 2: Between Clocks
  const [clockStart, setClockStart] = useState("09:00");
  const [clockEnd, setClockEnd] = useState("17:30");
  const [breakMins, setBreakMins] = useState("30");

  // Mode 3: Unit Converter
  const [convVal, setConvVal] = useState("120");
  const [convUnit, setConvUnit] = useState("minutes");

  // Payroll Scenario: Hourly Wage
  const [hourlyWage, setHourlyWage] = useState("25");

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
      const saved = localStorage.getItem("stiknex_time_calc_history");
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
        localStorage.setItem("stiknex_time_calc_history", JSON.stringify(updated));
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
      localStorage.removeItem("stiknex_time_calc_history");
    } catch {
      // ignore
    }
  }, [playClickSound]);

  // CALCULATION 1: Interval Arithmetic (H:M:S +/- H:M:S)
  const intervalStats = useMemo(() => {
    const numH1 = parseInt(h1 || 0, 10);
    const numM1 = parseInt(m1 || 0, 10);
    const numS1 = parseInt(s1 || 0, 10);
    const numH2 = parseInt(h2 || 0, 10);
    const numM2 = parseInt(m2 || 0, 10);
    const numS2 = parseInt(s2 || 0, 10);

    const totalSeconds1 = numH1 * 3600 + numM1 * 60 + numS1;
    const totalSeconds2 = numH2 * 3600 + numM2 * 60 + numS2;

    const resultSeconds = intervalOp === "add"
      ? totalSeconds1 + totalSeconds2
      : totalSeconds1 - totalSeconds2;

    const isNegative = resultSeconds < 0;
    const absSeconds = Math.abs(resultSeconds);

    const outHours = Math.floor(absSeconds / 3600);
    const remSeconds = absSeconds % 3600;
    const outMinutes = Math.floor(remSeconds / 60);
    const outSecs = remSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");
    const digital = `${isNegative ? "−" : ""}${pad(outHours)}:${pad(outMinutes)}:${pad(outSecs)}`;
    const formatted = `${isNegative ? "−" : ""}${outHours}h ${outMinutes}m ${outSecs}s`;
    const decimalHours = ((isNegative ? -1 : 1) * (absSeconds / 3600)).toFixed(2);
    const decimalMinutes = ((isNegative ? -1 : 1) * (absSeconds / 60)).toFixed(1);
    const fractionOfDay = ((absSeconds / 86400) * 100).toFixed(1);
    const workDayRatio = ((absSeconds / 28800) * 100).toFixed(0); // 8-hour workday

    return {
      isNegative,
      outHours,
      outMinutes,
      outSecs,
      totalSeconds: resultSeconds,
      digital,
      formatted,
      decimalHours,
      decimalMinutes,
      fractionOfDay,
      workDayRatio
    };
  }, [h1, m1, s1, h2, m2, s2, intervalOp]);

  // CALCULATION 2: Time Between Clocks (Shift Start to End + Breaks)
  const clockStats = useMemo(() => {
    if (!clockStart || !clockEnd) return null;
    const [startH, startM] = clockStart.split(":").map((v) => parseInt(v, 10));
    const [endH, endM] = clockEnd.split(":").map((v) => parseInt(v, 10));
    const deduction = parseInt(breakMins || 0, 10);

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    let crossesMidnight = false;
    if (endTotalMins < startTotalMins) {
      endTotalMins += 24 * 60; // Crosses midnight
      crossesMidnight = true;
    }

    const grossMins = endTotalMins - startTotalMins;
    const netMins = Math.max(0, grossMins - deduction);

    const outHours = Math.floor(netMins / 60);
    const outMinutes = netMins % 60;

    const pad = (n) => String(n).padStart(2, "0");
    const digital = `${pad(outHours)}:${pad(outMinutes)}:00`;
    const formatted = `${outHours}h ${outMinutes}m`;
    const decimalHours = (netMins / 60).toFixed(2);
    const workDayRatio = ((netMins / 480) * 100).toFixed(0); // 8h shift

    return {
      crossesMidnight,
      grossMins,
      netMins,
      deduction,
      outHours,
      outMinutes,
      digital,
      formatted,
      decimalHours,
      workDayRatio
    };
  }, [clockStart, clockEnd, breakMins]);

  // CALCULATION 3: Time Unit Converter
  const converterStats = useMemo(() => {
    const val = parseFloat(convVal || 0);
    if (isNaN(val)) return null;

    let baseSeconds = 0;
    if (convUnit === "seconds") baseSeconds = val;
    else if (convUnit === "minutes") baseSeconds = val * 60;
    else if (convUnit === "hours") baseSeconds = val * 3600;
    else if (convUnit === "days") baseSeconds = val * 86400;
    else if (convUnit === "weeks") baseSeconds = val * 604800;

    return {
      seconds: baseSeconds,
      minutes: Number((baseSeconds / 60).toFixed(2)),
      hours: Number((baseSeconds / 3600).toFixed(4)),
      days: Number((baseSeconds / 86400).toFixed(4)),
      weeks: Number((baseSeconds / 604800).toFixed(4))
    };
  }, [convVal, convUnit]);

  // Payroll Calculation based on Decimal Hours
  const payrollTotal = useMemo(() => {
    const wage = parseFloat(hourlyWage || 0);
    let hours = 0;
    if (mode === "intervals") hours = parseFloat(intervalStats.decimalHours || 0);
    else if (mode === "clocks") hours = parseFloat(clockStats?.decimalHours || 0);
    else if (mode === "converter") hours = parseFloat(converterStats?.hours || 0);

    if (isNaN(wage) || isNaN(hours) || hours <= 0) return "0.00";
    return (wage * hours).toFixed(2);
  }, [mode, hourlyWage, intervalStats, clockStats, converterStats]);

  // Active result text to copy
  const activeResultText = useMemo(() => {
    if (mode === "intervals") {
      return `${intervalStats.formatted} (Digital: ${intervalStats.digital}, Decimal: ${intervalStats.decimalHours}h)`;
    }
    if (mode === "clocks") {
      if (!clockStats) return "";
      return `${clockStats.formatted} (Digital: ${clockStats.digital}, Decimal: ${clockStats.decimalHours}h)`;
    }
    if (mode === "converter") {
      if (!converterStats) return "";
      return `${converterStats.hours} Hours (${converterStats.minutes} mins, ${converterStats.seconds} secs)`;
    }
    return "";
  }, [mode, intervalStats, clockStats, converterStats]);

  // Copy handler with animation
  const handleCopy = useCallback((customText = null) => {
    playClickSound();
    const textToCopy = customText || activeResultText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(String(textToCopy).replace(/,/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Save to history upon copy
    if (mode === "intervals") {
      saveToHistory({
        mode: "intervals",
        label: `${h1}h ${m1}m ${s1}s ${intervalOp === "add" ? "+" : "−"} ${h2}h ${m2}m ${s2}s`,
        result: `${intervalStats.formatted} (${intervalStats.decimalHours}h)`,
        h1, m1, s1, h2, m2, s2, intervalOp
      });
    } else if (mode === "clocks") {
      saveToHistory({
        mode: "clocks",
        label: `Shift ${clockStart} to ${clockEnd} (- ${breakMins}m break)`,
        result: `${clockStats?.formatted || ""} (${clockStats?.decimalHours || ""}h)`,
        clockStart, clockEnd, breakMins
      });
    } else if (mode === "converter") {
      saveToHistory({
        mode: "converter",
        label: `${convVal} ${convUnit}`,
        result: `${converterStats?.hours || 0} Hours`,
        convVal, convUnit
      });
    }
  }, [playClickSound, activeResultText, mode, intervalStats, clockStats, converterStats, h1, m1, s1, h2, m2, s2, intervalOp, clockStart, clockEnd, breakMins, convVal, convUnit, saveToHistory]);

  // Preset time intervals
  const applyPresetInterval = useCallback((hours, minutes) => {
    playClickSound();
    setH2(String(hours));
    setM2(String(minutes));
    setS2("0");
  }, [playClickSound]);

  // Preset clock shifts
  const applyPresetShift = useCallback((start, end, brk) => {
    playClickSound();
    setClockStart(start);
    setClockEnd(end);
    setBreakMins(String(brk));
  }, [playClickSound]);

  // Reset current inputs
  const resetInputs = useCallback(() => {
    playClickSound();
    if (mode === "intervals") {
      setH1("8");
      setM1("0");
      setS1("0");
      setH2("0");
      setM2("30");
      setS2("0");
    } else if (mode === "clocks") {
      setClockStart("09:00");
      setClockEnd("17:00");
      setBreakMins("30");
    } else {
      setConvVal("60");
      setConvUnit("minutes");
    }
  }, [playClickSound, mode]);

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
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
            title="Open Menu & Navigation"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/20 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400">Calculator</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 tracking-wider uppercase">
                  Intervals &amp; Hours
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Interval Arithmetic, Clock Shifts &amp; Decimal Payroll Hours
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Time Calculations Help Guide (?)"
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
            className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="View History"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Toggle Light / Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
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
                  onClick={() => {
                    playClickSound();
                    setMode("intervals");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "intervals"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Add / Subtract</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setMode("clocks");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "clocks"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Timer className="w-4 h-4 shrink-0" />
                  <span>Between Clocks</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setMode("converter");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === "converter"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Hourglass className="w-4 h-4 shrink-0" />
                  <span>Unit Converter</span>
                </button>
              </div>

              {/* MODE 1: INTERVALS (H:M:S +/- H:M:S) */}
              {mode === "intervals" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Time Interval 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        First Time Duration
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Hours</span>
                          <input
                            type="number"
                            min="0"
                            value={h1}
                            onChange={(e) => {
                              playClickSound();
                              setH1(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Minutes</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={m1}
                            onChange={(e) => {
                              playClickSound();
                              setM1(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Seconds</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={s1}
                            onChange={(e) => {
                              playClickSound();
                              setS1(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Interval 2 with Operation Selector */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Second Time Duration
                        </label>
                        <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5 text-xs font-bold">
                          <button
                            onClick={() => {
                              playClickSound();
                              setIntervalOp("add");
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition ${intervalOp === "add" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
                          >
                            + Add
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              setIntervalOp("subtract");
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition ${intervalOp === "subtract" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
                          >
                            − Sub
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Hours</span>
                          <input
                            type="number"
                            min="0"
                            value={h2}
                            onChange={(e) => {
                              playClickSound();
                              setH2(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Minutes</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={m2}
                            onChange={(e) => {
                              playClickSound();
                              setM2(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1">Seconds</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={s2}
                            onChange={(e) => {
                              playClickSound();
                              setS2(e.target.value);
                            }}
                            className="w-full px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Buttons & Reset */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-bold mr-1">Quick Intervals:</span>
                      {[
                        { label: "15 min", h: 0, m: 15 },
                        { label: "30 min", h: 0, m: 30 },
                        { label: "45 min", h: 0, m: 45 },
                        { label: "1 hour", h: 1, m: 0 },
                        { label: "4 hours", h: 4, m: 0 },
                        { label: "8 hours", h: 8, m: 0 }
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() => applyPresetInterval(p.h, p.m)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={resetInputs}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-500 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 2: BETWEEN CLOCKS (Start to End + Breaks) */}
              {mode === "clocks" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Start Clock */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Start Shift Time
                      </label>
                      <input
                        type="time"
                        value={clockStart}
                        onChange={(e) => {
                          playClickSound();
                          setClockStart(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      />
                    </div>

                    {/* End Clock */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        End Shift Time
                      </label>
                      <input
                        type="time"
                        value={clockEnd}
                        onChange={(e) => {
                          playClickSound();
                          setClockEnd(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      />
                    </div>

                    {/* Break Deduction */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Break Deduction (Mins)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={breakMins}
                        onChange={(e) => {
                          playClickSound();
                          setBreakMins(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  {/* Preset Shifts */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-bold mr-1">Standard Shifts:</span>
                      <button
                        onClick={() => applyPresetShift("09:00", "17:00", 30)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        9am – 5pm (30m lunch)
                      </button>
                      <button
                        onClick={() => applyPresetShift("08:00", "16:30", 30)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        8am – 4:30pm (8h net)
                      </button>
                      <button
                        onClick={() => applyPresetShift("22:00", "06:00", 30)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        Night 10pm – 6am
                      </button>
                    </div>

                    {clockStats?.crossesMidnight && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        🌙 Overnight shift detected
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* MODE 3: TIME UNIT CONVERTER */}
              {mode === "converter" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Input Time Value
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={convVal}
                        onChange={(e) => {
                          playClickSound();
                          setConvVal(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                    </div>

                    <div className="w-full sm:w-56">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Units
                      </label>
                      <select
                        value={convUnit}
                        onChange={(e) => {
                          playClickSound();
                          setConvUnit(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      >
                        <option value="seconds">Seconds (s)</option>
                        <option value="minutes">Minutes (min)</option>
                        <option value="hours">Hours (hr)</option>
                        <option value="days">Days (d)</option>
                        <option value="weeks">Weeks (wk)</option>
                      </select>
                    </div>
                  </div>

                  {converterStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Seconds</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {converterStats.seconds.toLocaleString()}s
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Minutes</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {converterStats.minutes.toLocaleString()}m
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Decimal Hours</span>
                        <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                          {converterStats.hours.toLocaleString()}h
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Days</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {converterStats.days.toLocaleString()}d
                        </span>
                      </div>
                    </div>
                  )}
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

                {/* Mode 1 Output: Intervals */}
                {mode === "intervals" && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Calculated Total Duration
                    </span>

                    <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                      {intervalStats.formatted}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Digital Clock: <strong>{intervalStats.digital}</strong> • Timesheet Decimal: <strong className="text-indigo-600 dark:text-indigo-400">{intervalStats.decimalHours} hours</strong>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-indigo-100/80 dark:border-slate-800">
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Minutes</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {intervalStats.decimalMinutes}m
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Seconds</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {Math.abs(intervalStats.totalSeconds).toLocaleString()}s
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">24h Day %</span>
                        <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {intervalStats.fractionOfDay}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Work Shift Ratio</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {intervalStats.workDayRatio}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode 2 Output: Between Clocks */}
                {mode === "clocks" && clockStats && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Net Working Shift Duration
                    </span>

                    <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                      {clockStats.formatted}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Billable Hours: <strong className="text-indigo-600 dark:text-indigo-400">{clockStats.decimalHours} decimal hours</strong> ({clockStats.netMins} mins total, {clockStats.deduction}m break subtracted)
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-indigo-100/80 dark:border-slate-800">
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Gross Shift</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {(clockStats.grossMins / 60).toFixed(2)}h
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Unpaid Break</span>
                        <span className="text-base sm:text-lg font-black text-rose-500">
                          {clockStats.deduction} min
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Billable Decimal</span>
                        <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {clockStats.decimalHours} hrs
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Shift % of 8h</span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {clockStats.workDayRatio}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode 3 Output: Converter */}
                {mode === "converter" && converterStats && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Equivalent Converted Time
                    </span>

                    <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                      {converterStats.hours} <span className="text-2xl font-bold text-slate-500">Hours</span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {converterStats.minutes} Minutes • {converterStats.seconds} Seconds • {converterStats.days} Days
                    </p>
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────
                  PAYROLL & TIMESHEET GROSS EARNINGS CALCULATOR
              ───────────────────────────────────────────────────────── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Timesheet Gross Pay Calculator
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Multiplies calculated decimal hours by your hourly rate
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={hourlyWage}
                      onChange={(e) => {
                        playClickSound();
                        setHourlyWage(e.target.value);
                      }}
                      className="w-24 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Rate/hr"
                    />
                    <span className="text-xs text-slate-400">/hr</span>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-black text-sm">
                    = ${payrollTotal}
                  </div>
                </div>
              </div>

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
                          if (item.h1) setH1(item.h1);
                          if (item.m1) setM1(item.m1);
                          if (item.s1) setS1(item.s1);
                          if (item.h2) setH2(item.h2);
                          if (item.m2) setM2(item.m2);
                          if (item.s2) setS2(item.s2);
                          if (item.intervalOp) setIntervalOp(item.intervalOp);
                          if (item.clockStart) setClockStart(item.clockStart);
                          if (item.clockEnd) setClockEnd(item.clockEnd);
                          if (item.breakMins) setBreakMins(item.breakMins);
                          if (item.convVal) setConvVal(item.convVal);
                          if (item.convUnit) setConvUnit(item.convUnit);
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
                  <span>Timesheet Guide</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* BOTTOM SAFE-AREA FOOTER CLEARANCE */}
      <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Stiknex Time Engine • Precise Hours, Minutes &amp; Timesheet Decimal Math
        </p>
      </footer>

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
                    Time History Tape ({history.length})
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
                        if (item.h1) setH1(item.h1);
                        if (item.m1) setM1(item.m1);
                        if (item.s1) setS1(item.s1);
                        if (item.h2) setH2(item.h2);
                        if (item.m2) setM2(item.m2);
                        if (item.s2) setS2(item.s2);
                        if (item.intervalOp) setIntervalOp(item.intervalOp);
                        if (item.clockStart) setClockStart(item.clockStart);
                        if (item.clockEnd) setClockEnd(item.clockEnd);
                        if (item.breakMins) setBreakMins(item.breakMins);
                        if (item.convVal) setConvVal(item.convVal);
                        if (item.convUnit) setConvUnit(item.convUnit);
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

      {/* HELP / TIMESHEET DECIMAL GUIDE MODAL */}
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
                    Timesheet &amp; Decimal Hours Guide
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
                    1. Why use Decimal Hours for Payroll?
                  </h4>
                  <p>
                    Payroll software and accounting tools require hours in decimal form rather than minutes. For example, 7 hours and 45 minutes is entered as <strong>7.75 hours</strong> (45 / 60 = 0.75).
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                    2. Minutes to Decimal Quick Chart
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">15m = 0.25h</div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">30m = 0.50h</div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">45m = 0.75h</div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">60m = 1.00h</div>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    3. Overnight Shift Auto-Detection
                  </h4>
                  <p>
                    If your shift starts in the evening (e.g. 22:00) and ends the next morning (e.g. 06:00), the calculator automatically detects that midnight has passed and computes the exact 8 hours correctly.
                  </p>
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
