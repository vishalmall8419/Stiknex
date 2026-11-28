import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  HelpCircle,
  Menu,
  X,
  Check,
  Copy,
  Plus,
  Minus,
  Settings,
  Calendar,
  Gift,
  Sparkles,
  Coffee,
  Brain,
  Timer,
  FastForward,
  ChevronRight,
  Share2,
  Cake,
  PartyPopper,
  Bell,
  Hourglass,
  Globe,
  CheckCircle2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   TOOL CONFIGURATIONS FOR TIME WORKSTATIONS
   ========================================================================================= */
const TOOL_CONFIGS = {
  "countdown-timer": {
    title: "Countdown Timer",
    highlight: "PRECISION ALARM",
    tag: "Interval & Event Timer",
    subtitle: "Custom fullscreen countdown timer with acoustic chime alerts and quick presets",
    icon: <Hourglass size={16} />
  },
  "pomodoro-timer": {
    title: "Pomodoro Focus",
    highlight: "PRODUCTIVITY",
    tag: "25/5 Study & Work",
    subtitle: "Scientifically structured Pomodoro intervals for deep focus and structured breaks",
    icon: <Brain size={16} />
  },
  "birthday-countdown": {
    title: "Birthday Countdown",
    highlight: "CELEBRATION",
    tag: "Milestone Tracker",
    subtitle: "Live countdown of days, hours, and minutes until your next birthday milestone",
    icon: <Gift size={16} />
  },
  "live-clock": {
    title: "Precision Live Clock",
    highlight: "REAL-TIME",
    tag: "Digital & Swiss Analog",
    subtitle: "High-precision live fullscreen clock with milliseconds, timezone, and calendar date",
    icon: <Clock size={16} />
  },
  "world-clock": {
    title: "World Clock",
    highlight: "GLOBAL TIME",
    tag: "Capitals & Timezones",
    subtitle: "Live synchronized clock across major global financial capitals and timezones",
    icon: <Globe size={16} />
  },
  "time-zone-converter": {
    title: "Time Zone Converter",
    highlight: "SYNCHRONIZER",
    tag: "Interactive Slider",
    subtitle: "24-hour visual timezone timeline comparing UTC, EST, London, Delhi, Tokyo and Sydney",
    icon: <Globe size={16} />
  },
  "meeting-time-planner": {
    title: "Meeting Planner",
    highlight: "TIME OVERLAP",
    tag: "Remote Teams",
    subtitle: "Find mutual working hours across remote international team locations",
    icon: <Clock size={16} />
  },
  "calendar-generator": {
    title: "Calendar Generator",
    highlight: "PRINTABLE",
    tag: "Monthly & Annual",
    subtitle: "Generate clean printable monthly and annual calendar grids with 1-click export",
    icon: <Calendar size={16} />
  },
  "week-number-calculator": {
    title: "Week Number",
    highlight: "ISO 8601",
    tag: "Year Progress",
    subtitle: "Current calendar week number, days remaining in the year, and date lookups",
    icon: <Calendar size={16} />
  },
  "business-days-calculator": {
    title: "Business Days",
    highlight: "WORKDAYS",
    tag: "Exclude Weekends",
    subtitle: "Calculate elapsed working days between dates excluding Saturdays and Sundays",
    icon: <Calendar size={16} />
  }
};

export default function TimeEngine({ slug, toolId }) {
  // Global App Theme Synchronization
  const { theme, toggleTheme } = useAppContext();

  // UI Drawer State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Tactile Clicks & Completion Chimes
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
        osc.frequency.setValueAtTime(520, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {}
  }, [soundEnabled]);

  const playAlarmSound = useCallback(() => {
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
        // Melodic triple harmonic chime (587Hz -> 784Hz -> 1046Hz, D5 -> G5 -> C6)
        const notes = [587.33, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          const startTime = audioCtxRef.current.currentTime + idx * 0.18;
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
          osc.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
      }
    } catch {}
  }, [soundEnabled]);

  // Is this a fullscreen chronometer workstation?
  const isFullScreenWorkstation =
    slug === "countdown-timer" ||
    slug === "pomodoro-timer" ||
    slug === "birthday-countdown" ||
    slug === "live-clock" ||
    slug === "online-clock" ||
    slug === "clock";

  const resolvedSlug =
    slug === "online-clock" || slug === "clock" ? "live-clock" : slug;

  const toolConfig = TOOL_CONFIGS[resolvedSlug] || {
    title: "Precision Time",
    highlight: "WORKSTATION",
    tag: "100% Client-Side",
    subtitle: "High precision time, calendar, and chronometry tools",
    icon: <Clock size={16} />
  };

  const timeRelatedTools = useMemo(
    () => [
      { slug: "stopwatch-with-laps", name: "Stopwatch with Laps", desc: "Precision millisecond chronometer", icon: "Clock" },
      { slug: "countdown-timer", name: "Countdown Timer", desc: "Fullscreen timer with acoustic alarm", icon: "Hourglass" },
      { slug: "pomodoro-timer", name: "Pomodoro Focus", desc: "25/5 study & productivity intervals", icon: "Brain" },
      { slug: "birthday-countdown", name: "Birthday Countdown", desc: "Days & hours until upcoming birthday", icon: "Gift" },
      { slug: "live-clock", name: "Live Precision Clock", desc: "Digital & Swiss analog live clock", icon: "Clock" },
      { slug: "world-clock", name: "World Clock", desc: "Global capitals & financial timezones", icon: "Globe" },
      { slug: "time-calculator", name: "Time Calculator", desc: "Add & subtract hours, minutes, seconds", icon: "Calendar" },
      { slug: "age-calculator", name: "Age Calculator", desc: "Exact chronological age breakdown", icon: "Cake" }
    ],
    []
  );

  return (
    <div
      className={`${
        isFullScreenWorkstation
          ? "h-screen max-h-screen overflow-hidden"
          : "min-h-screen"
      } flex flex-col font-sans transition-colors duration-200 ${
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* 1. TOP HEADER NAVIGATION - CLEAN & DEDICATED */}
      <header
        className={`tool-header sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
        }`}
      >
        <div
          className={`${
            isFullScreenWorkstation ? "w-full px-4 sm:px-8" : "max-w-7xl mx-auto px-3 sm:px-4"
          } h-14 flex items-center justify-between gap-2`}
        >
          {/* Dedicated Tool Title */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
              {toolConfig.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight truncate">
                  {toolConfig.title}{" "}
                  <span className="text-amber-500">{toolConfig.highlight}</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  {toolConfig.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden md:block max-w-sm">
                {toolConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Center Space: Client-Side Engine Badge */}
          <div className="hidden lg:flex items-center text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/10 dark:bg-slate-800/40 border border-slate-700/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Stiknex 100% Client-Side Engine
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
              className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme === "dark"
                  ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Help Dialog Modal */}
            <button
              onClick={() => setHelpOpen(true)}
              title="Help & Reference Guide"
              className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme === "dark"
                  ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme === "dark"
                  ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Universal Sidebar Drawer Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              title="Tools & Workspace Menu"
              className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition ml-0.5 cursor-pointer"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. DEDICATED TOOL WORKSTATION */}
      <main
        className={`flex-1 w-full mx-auto ${
          isFullScreenWorkstation
            ? "p-0 max-w-full h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col justify-center items-center"
            : "max-w-7xl p-3 sm:p-5 pb-16"
        }`}
      >
        {resolvedSlug === "countdown-timer" && (
          <CountdownWorkstation
            theme={theme}
            playClickSound={playClickSound}
            playAlarmSound={playAlarmSound}
          />
        )}

        {resolvedSlug === "pomodoro-timer" && (
          <PomodoroWorkstation
            theme={theme}
            playClickSound={playClickSound}
            playAlarmSound={playAlarmSound}
          />
        )}

        {resolvedSlug === "birthday-countdown" && (
          <BirthdayWorkstation
            theme={theme}
            playClickSound={playClickSound}
          />
        )}

        {resolvedSlug === "live-clock" && (
          <LiveClockWorkstation
            theme={theme}
            playClickSound={playClickSound}
          />
        )}

        {/* Fallbacks for other time tools */}
        {resolvedSlug === "world-clock" && <WorldClockTool theme={theme} />}
        {resolvedSlug === "time-zone-converter" && <TimeZoneConverterTool theme={theme} />}
        {resolvedSlug === "business-days-calculator" && <BusinessDaysTool theme={theme} />}
        {resolvedSlug === "week-number-calculator" && <WeekNumberTool theme={theme} />}
        {resolvedSlug === "calendar-generator" && <CalendarGeneratorTool theme={theme} />}
        {resolvedSlug === "meeting-time-planner" && <MeetingPlannerTool theme={theme} />}
      </main>

      {/* Universal Sidebar Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentSlug={resolvedSlug}
        categoryName="Date & Time"
        relatedTools={timeRelatedTools}
        theme={theme}
      />

      {/* Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-3xl shadow-2xl z-50 border ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <HelpCircle size={18} />
                  </div>
                  <h3 className="font-bold text-base">Quick Guide & Shortcuts</h3>
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-400">
                {resolvedSlug === "countdown-timer" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Precision Countdown Timer</h4>
                    <p>
                      Set custom alarms and interval countdowns for focus sessions, cooking, presentations, and events.
                      Shortcuts: <strong className="text-amber-500">Spacebar</strong> to start/pause,{" "}
                      <strong className="text-amber-500">R</strong> to reset, and{" "}
                      <strong className="text-amber-500">F</strong> to toggle fullscreen mode.
                    </p>
                  </div>
                )}

                {resolvedSlug === "pomodoro-timer" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Pomodoro 25/5 Productivity Rhythm</h4>
                    <p>
                      Work in 25-minute deep focus sprints, followed by 5-minute rest breaks. After 4 completed
                      sprints, enjoy a 15-minute long recharge break.
                      Shortcuts: <strong className="text-amber-500">Spacebar</strong> to start/pause,{" "}
                      <strong className="text-amber-500">S</strong> to skip to next round, and{" "}
                      <strong className="text-amber-500">R</strong> to reset.
                    </p>
                  </div>
                )}

                {resolvedSlug === "birthday-countdown" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Milestone Birthday Countdown</h4>
                    <p>
                      Calculates exact days, hours, minutes, and seconds until your next celebration. Saves your
                      birthday locally in private browser storage. On your birthday, celebration mode activates!
                    </p>
                  </div>
                )}

                {resolvedSlug === "live-clock" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Swiss Precision Live Clock</h4>
                    <p>
                      Real-time live clock with dual Swiss analog and digital readouts, milliseconds, calendar date,
                      and timezone detection. Toggle between 12H (AM/PM) and 24H military format instantly.
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                  All timers compute 100% locally in your browser. No data ever leaves your device.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   1. COUNTDOWN TIMER WORKSTATION (/countdown-timer) - FULLSCREEN CHRONOMETER WITH ALARM
   ========================================================================================= */
function CountdownWorkstation({ theme, playClickSound, playAlarmSound }) {
  // Total duration in seconds (default 300s = 5 min)
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customDrawerOpen, setCustomDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Custom inputs
  const [customH, setCustomH] = useState(0);
  const [customM, setCustomM] = useState(5);
  const [customS, setCustomS] = useState(0);

  // Drift-free timestamp ref
  const targetTimeRef = useRef(null);

  useEffect(() => {
    let intervalId = null;
    if (running) {
      targetTimeRef.current = Date.now() + secondsLeft * 1000;
      intervalId = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((targetTimeRef.current - Date.now()) / 1000)
        );
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearInterval(intervalId);
          setRunning(false);
          setIsComplete(true);
          try {
            playAlarmSound();
          } catch {}
        }
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [running, playAlarmSound]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try { playClickSound(); } catch {}
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleToggle = () => {
    try { playClickSound(); } catch {}
    if (isComplete) {
      setIsComplete(false);
      setSecondsLeft(totalSeconds);
      setRunning(true);
      return;
    }
    setRunning((prev) => !prev);
  };

  const handleReset = () => {
    try { playClickSound(); } catch {}
    setRunning(false);
    setIsComplete(false);
    setSecondsLeft(totalSeconds);
  };

  const handleAddMinute = () => {
    try { playClickSound(); } catch {}
    setIsComplete(false);
    setTotalSeconds((prev) => prev + 60);
    setSecondsLeft((prev) => {
      const next = prev + 60;
      if (running) {
        targetTimeRef.current = Date.now() + next * 1000;
      }
      return next;
    });
  };

  const setPreset = (sec) => {
    try { playClickSound(); } catch {}
    setRunning(false);
    setIsComplete(false);
    setTotalSeconds(sec);
    setSecondsLeft(sec);
  };

  const applyCustomTime = (e) => {
    e?.preventDefault?.();
    try { playClickSound(); } catch {}
    const sec =
      Math.max(0, parseInt(customH) || 0) * 3600 +
      Math.max(0, parseInt(customM) || 0) * 60 +
      Math.max(0, parseInt(customS) || 0);
    if (sec > 0) {
      setRunning(false);
      setIsComplete(false);
      setTotalSeconds(sec);
      setSecondsLeft(sec);
      setCustomDrawerOpen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "c" || e.key === "C") {
        setCustomDrawerOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCustomDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running, secondsLeft, totalSeconds, isComplete]);

  // Digits Breakdown
  const pad = (n) => String(n).padStart(2, "0");
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  // Circular Dial Geometry
  const dialRadius = 135;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const progressFrac = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeOffset = dialCircumference * (1 - progressFrac);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden px-4 sm:px-8 py-3 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Ambient Background Radial Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isComplete
            ? "opacity-100 animate-pulse"
            : running
            ? "opacity-100"
            : "opacity-30"
        }`}
        style={{
          background: isComplete
            ? "radial-gradient(ellipse at 50% 40%, rgba(239, 68, 68, 0.25) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 75%)"
            : theme === "dark"
            ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(234, 88, 12, 0.05) 45%, transparent 75%)"
            : "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.03) 45%, transparent 75%)"
        }}
      />

      {/* Top Floating Action Bar */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            try { playClickSound(); } catch {}
            setCustomDrawerOpen(true);
          }}
          title="Set Custom Countdown (C)"
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          <Timer size={15} className="text-amber-500" />
          <span className="leading-none">Set Time</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* CENTER ARENA: CIRCULAR GAUGE + COLOSSAL READOUT */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center z-10 py-1 sm:py-2">
        {/* Animated Progress Dial */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 shrink-0 flex items-center justify-center mb-1 sm:mb-2">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            {/* Background Track */}
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              className="text-slate-300/40 dark:text-slate-800/80 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />

            {/* Sweeping Active Countdown Arc */}
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              transform="rotate(-90 150 150)"
              className={`stroke-current transition-all duration-200 ${
                isComplete
                  ? "text-rose-500 animate-pulse"
                  : secondsLeft <= 10 && running
                  ? "text-rose-500"
                  : "text-amber-500"
              }`}
              strokeWidth="6"
              strokeDasharray={dialCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Center Dial Labels */}
            <text
              x="150"
              y="135"
              textAnchor="middle"
              fill={isComplete ? "#ef4444" : "#94a3b8"}
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1"
            >
              {isComplete ? "ALARM" : running ? "COUNTDOWN" : "READY"}
            </text>
            <text
              x="150"
              y="172"
              textAnchor="middle"
              fill={isComplete ? "#ef4444" : "#f59e0b"}
              fontSize="16"
              fontFamily="monospace"
              fontWeight="black"
            >
              {Math.round(progressFrac * 100)}%
            </text>
          </svg>
        </div>

        {/* COLOSSAL READOUT */}
        <div className="w-full text-center flex items-baseline justify-center font-mono font-black tracking-tight tabular-nums select-none py-1 sm:py-2 leading-none">
          {hours > 0 && (
            <>
              <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
                {pad(hours)}
              </span>
              <span
                className={`mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none ${
                  running ? "text-amber-500 animate-pulse" : "text-slate-400 dark:text-slate-600"
                }`}
              >
                :
              </span>
            </>
          )}

          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(minutes)}
          </span>
          <span
            className={`mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none ${
              running ? "text-amber-500 animate-pulse" : "text-slate-400 dark:text-slate-600"
            }`}
          >
            :
          </span>
          <span
            className={`drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none ${
              secondsLeft <= 10 && running ? "text-rose-500" : "text-slate-900 dark:text-white"
            }`}
          >
            {pad(seconds)}
          </span>
        </div>

        {/* Complete Alert Banner */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 px-5 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-500 font-black text-sm sm:text-base flex items-center gap-2 animate-bounce"
          >
            <Bell size={18} className="animate-spin" />
            <span>TIME'S UP! COUNTDOWN COMPLETE</span>
          </motion.div>
        )}

        {/* QUICK PRESETS ROW */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 px-2 max-w-xl">
          {[
            { label: "1m", sec: 60 },
            { label: "3m", sec: 180 },
            { label: "5m", sec: 300 },
            { label: "10m", sec: 600 },
            { label: "15m", sec: 900 },
            { label: "20m", sec: 1200 },
            { label: "25m", sec: 1500 },
            { label: "30m", sec: 1800 },
            { label: "45m", sec: 2700 },
            { label: "60m", sec: 3600 }
          ].map((p) => {
            const isCurrent = totalSeconds === p.sec && !running;
            return (
              <button
                key={p.sec}
                onClick={() => setPreset(p.sec)}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all duration-150 active:scale-95 cursor-pointer border ${
                  isCurrent
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : theme === "dark"
                    ? "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* HERO CONTROLS BAR (Start/Pause, +1 Min, Reset) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5 shrink-0">
          <button
            onClick={handleToggle}
            className={`min-w-[130px] sm:min-w-[160px] justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer ${
              isComplete
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/40 ring-4 ring-rose-500/20"
                : running
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/40 ring-4 ring-amber-500/20 hover:brightness-110"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40 ring-4 ring-emerald-500/20 hover:brightness-110"
            }`}
          >
            {isComplete ? (
              <RotateCcw size={20} />
            ) : running ? (
              <Pause size={20} className="fill-current" />
            ) : (
              <Play size={20} className="fill-current" />
            )}
            <span>{isComplete ? "RESTART" : running ? "PAUSE" : "START"}</span>
          </button>

          <button
            onClick={handleAddMinute}
            title="Add 1 Minute (+60s)"
            className="min-w-[90px] sm:min-w-[110px] justify-center px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md border border-slate-700/50 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>1 MIN</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Countdown (R)"
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-slate-200 dark:border-slate-700/40 shrink-0 cursor-pointer"
          >
            <RotateCcw size={19} />
          </button>
        </div>

        {/* Keyboard Shortcuts Hint Bar (Desktop only, hidden on mobile & tablet) */}
        <div className="hidden lg:flex mt-3 sm:mt-4 flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">Space</kbd> Start/Pause
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">R</kbd> Reset
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">C</kbd> Custom Time
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">F</kbd> Fullscreen
          </span>
        </div>
      </div>

      {/* CUSTOM TIME PICKER DRAWER (High Z-Index Overlay z-[100]) */}
      <AnimatePresence>
        {customDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full sm:w-[26rem] z-[100] shadow-2xl flex flex-col border-l backdrop-blur-2xl ${
                theme === "dark"
                  ? "bg-slate-900/98 border-slate-800 text-white"
                  : "bg-white/98 border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Timer size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Set Countdown Duration</h3>
                    <p className="text-xs text-slate-400">Choose exact hours, minutes, and seconds</p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={applyCustomTime} className="flex-1 p-5 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">HOURS</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={customH}
                      onChange={(e) => setCustomH(e.target.value)}
                      className={`w-full p-3 rounded-2xl text-center text-3xl font-black font-mono border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">MINUTES</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customM}
                      onChange={(e) => setCustomM(e.target.value)}
                      className={`w-full p-3 rounded-2xl text-center text-3xl font-black font-mono border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">SECONDS</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customS}
                      onChange={(e) => setCustomS(e.target.value)}
                      className={`w-full p-3 rounded-2xl text-center text-3xl font-black font-mono border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">Fast Additions</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "+5 Mins", addM: 5 },
                      { label: "+10 Mins", addM: 10 },
                      { label: "+30 Mins", addM: 30 }
                    ].map((btn) => (
                      <button
                        type="button"
                        key={btn.label}
                        onClick={() => {
                          setCustomM((prev) => (parseInt(prev) || 0) + btn.addM);
                        }}
                        className="p-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-black text-base shadow-xl shadow-amber-500/30 transition active:scale-95 cursor-pointer"
                  >
                    Set & Start Countdown
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   2. POMODORO FOCUS WORKSTATION (/pomodoro-timer) - FULLSCREEN INTERVAL CHRONOMETER
   ========================================================================================= */
function PomodoroWorkstation({ theme, playClickSound, playAlarmSound }) {
  // Modes: "work" (25m), "short" (5m), "long" (15m)
  const [mode, setMode] = useState("work");
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [shortDuration, setShortDuration] = useState(5 * 60);
  const [longDuration, setLongDuration] = useState(15 * 60);

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionRound, setSessionRound] = useState(1);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const targetTimeRef = useRef(null);

  const currentDuration =
    mode === "work"
      ? workDuration
      : mode === "short"
      ? shortDuration
      : longDuration;

  useEffect(() => {
    let intervalId = null;
    if (running) {
      targetTimeRef.current = Date.now() + secondsLeft * 1000;
      intervalId = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((targetTimeRef.current - Date.now()) / 1000)
        );
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearInterval(intervalId);
          setRunning(false);
          try {
            playAlarmSound();
          } catch {}

          if (mode === "work") {
            setTotalCompleted((prev) => prev + 1);
            if (sessionRound >= 4) {
              setMode("long");
              setSecondsLeft(longDuration);
              setSessionRound(1);
            } else {
              setMode("short");
              setSecondsLeft(shortDuration);
              setSessionRound((prev) => prev + 1);
            }
          } else {
            setMode("work");
            setSecondsLeft(workDuration);
          }
        }
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    running,
    secondsLeft,
    mode,
    sessionRound,
    workDuration,
    shortDuration,
    longDuration,
    playAlarmSound
  ]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try { playClickSound(); } catch {}
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleToggle = () => {
    try { playClickSound(); } catch {}
    setRunning((prev) => !prev);
  };

  const handleReset = () => {
    try { playClickSound(); } catch {}
    setRunning(false);
    setSecondsLeft(currentDuration);
  };

  const switchMode = (newMode) => {
    try { playClickSound(); } catch {}
    setRunning(false);
    setMode(newMode);
    if (newMode === "work") setSecondsLeft(workDuration);
    else if (newMode === "short") setSecondsLeft(shortDuration);
    else setSecondsLeft(longDuration);
  };

  const handleSkip = () => {
    try { playClickSound(); } catch {}
    setRunning(false);
    if (mode === "work") {
      if (sessionRound >= 4) {
        setMode("long");
        setSecondsLeft(longDuration);
        setSessionRound(1);
      } else {
        setMode("short");
        setSecondsLeft(shortDuration);
        setSessionRound((prev) => prev + 1);
      }
    } else {
      setMode("work");
      setSecondsLeft(workDuration);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      } else if (e.key === "s" || e.key === "S") {
        handleSkip();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        setSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running, secondsLeft, mode, sessionRound]);

  // Digits Breakdown
  const pad = (n) => String(n).padStart(2, "0");
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Circular Dial Geometry
  const dialRadius = 135;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const progressFrac = currentDuration > 0 ? secondsLeft / currentDuration : 0;
  const strokeOffset = dialCircumference * (1 - progressFrac);

  const modeTheme = {
    work: {
      accent: "#f59e0b",
      colorClass: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
      label: "DEEP FOCUS"
    },
    short: {
      accent: "#10b981",
      colorClass: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
      label: "SHORT BREAK"
    },
    long: {
      accent: "#0ea5e9",
      colorClass: "text-sky-500",
      gradient: "from-sky-500 to-indigo-500",
      label: "LONG RECHARGE"
    }
  }[mode];

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden px-4 sm:px-8 py-3 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          running ? "opacity-100" : "opacity-30"
        }`}
        style={{
          background:
            mode === "work"
              ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(234, 88, 12, 0.05) 45%, transparent 75%)"
              : mode === "short"
              ? "radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.14) 0%, rgba(20, 184, 166, 0.05) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 40%, rgba(14, 165, 233, 0.14) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 75%)"
        }}
      />

      {/* Top Floating Action Bar */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            try { playClickSound(); } catch {}
            setSettingsOpen(true);
          }}
          title="Pomodoro Settings"
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          <Settings size={15} className="text-amber-500" />
          <span className="leading-none">Intervals</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* CENTER ARENA: MODE SWITCHER + SWISS DIAL + READOUT */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center z-10 py-1 sm:py-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/60 dark:border-slate-800 shadow-inner mb-2 sm:mb-4">
          <button
            onClick={() => switchMode("work")}
            className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "work"
                ? "bg-amber-500 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Brain size={14} />
            <span>Focus ({Math.round(workDuration / 60)}m)</span>
          </button>

          <button
            onClick={() => switchMode("short")}
            className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "short"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Coffee size={14} />
            <span>Short Break ({Math.round(shortDuration / 60)}m)</span>
          </button>

          <button
            onClick={() => switchMode("long")}
            className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "long"
                ? "bg-sky-500 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles size={14} />
            <span>Long Break ({Math.round(longDuration / 60)}m)</span>
          </button>
        </div>

        {/* Animated Progress Dial */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center mb-1 sm:mb-2">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              className="text-slate-300/40 dark:text-slate-800/80 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              transform="rotate(-90 150 150)"
              stroke={modeTheme.accent}
              strokeWidth="6"
              strokeDasharray={dialCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
            <text
              x="150"
              y="135"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1"
            >
              {modeTheme.label}
            </text>
            <text
              x="150"
              y="172"
              textAnchor="middle"
              fill={modeTheme.accent}
              fontSize="16"
              fontFamily="monospace"
              fontWeight="black"
            >
              ROUND {sessionRound}/4
            </text>
          </svg>
        </div>

        {/* COLOSSAL READOUT */}
        <div className="w-full text-center flex items-baseline justify-center font-mono font-black tracking-tight tabular-nums select-none py-1 sm:py-2 leading-none">
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(minutes)}
          </span>
          <span
            className={`mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none ${
              running ? modeTheme.colorClass + " animate-pulse" : "text-slate-400 dark:text-slate-600"
            }`}
          >
            :
          </span>
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(seconds)}
          </span>
        </div>

        {/* Cycle Telemetry Indicators */}
        <div className="flex items-center gap-3 mt-2 sm:mt-3 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`w-3 h-3 rounded-full transition-all ${
                  dot < sessionRound
                    ? "bg-amber-500 shadow-xs"
                    : dot === sessionRound
                    ? "bg-amber-500 ring-4 ring-amber-500/20 animate-pulse"
                    : "bg-slate-300 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
          <span>&bull;</span>
          <span>{totalCompleted} Completed Focus Sessions</span>
        </div>

        {/* HERO CONTROLS BAR (Start/Pause, Skip, Reset) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5 shrink-0">
          <button
            onClick={handleToggle}
            className={`min-w-[130px] sm:min-w-[160px] justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer bg-gradient-to-r ${modeTheme.gradient} text-white shadow-amber-500/30 hover:brightness-110`}
          >
            {running ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
            <span>{running ? "PAUSE" : "START"}</span>
          </button>

          <button
            onClick={handleSkip}
            title="Skip to Next Round (S)"
            className="min-w-[90px] sm:min-w-[110px] justify-center px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md border border-slate-700/50 flex items-center gap-1.5 cursor-pointer"
          >
            <FastForward size={16} />
            <span>SKIP</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Round (R)"
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-slate-200 dark:border-slate-700/40 shrink-0 cursor-pointer"
          >
            <RotateCcw size={19} />
          </button>
        </div>

        {/* Shortcuts Bar (Desktop only, hidden on mobile & tablet) */}
        <div className="hidden lg:flex mt-3 sm:mt-4 flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">Space</kbd> Start/Pause
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">S</kbd> Skip Round
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">R</kbd> Reset
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">F</kbd> Fullscreen
          </span>
        </div>
      </div>

      {/* SETTINGS DRAWER (High Z-Index Overlay z-[100]) */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full sm:w-[26rem] z-[100] shadow-2xl flex flex-col border-l backdrop-blur-2xl ${
                theme === "dark"
                  ? "bg-slate-900/98 border-slate-800 text-white"
                  : "bg-white/98 border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Pomodoro Settings</h3>
                    <p className="text-xs text-slate-400">Customize focus & break durations</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    FOCUS DURATION ({Math.round(workDuration / 60)} MINS)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={workDuration / 60}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value);
                      setWorkDuration(mins * 60);
                      if (mode === "work" && !running) setSecondsLeft(mins * 60);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    SHORT BREAK ({Math.round(shortDuration / 60)} MINS)
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={shortDuration / 60}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value);
                      setShortDuration(mins * 60);
                      if (mode === "short" && !running) setSecondsLeft(mins * 60);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    LONG BREAK ({Math.round(longDuration / 60)} MINS)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="5"
                    value={longDuration / 60}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value);
                      setLongDuration(mins * 60);
                      if (mode === "long" && !running) setSecondsLeft(mins * 60);
                    }}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   3. BIRTHDAY COUNTDOWN WORKSTATION (/birthday-countdown) - CELEBRATION CHRONOMETER
   ========================================================================================= */
function BirthdayWorkstation({ theme, playClickSound }) {
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("stiknex_birthday_name") || "My Birthday";
    }
    return "My Birthday";
  });

  const [birthDate, setBirthDate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("stiknex_birthday_date") || "2000-01-01";
    }
    return "2000-01-01";
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Live timer tick
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try { playClickSound(); } catch {}
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Birthday Countdown Engine
  const countdownData = useMemo(() => {
    const bDate = new Date(birthDate);
    const bMonth = bDate.getMonth();
    const bDay = bDate.getDate();
    const bYear = bDate.getFullYear();

    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, bMonth, bDay, 0, 0, 0);

    // Is today birthday?
    const isToday =
      now.getMonth() === bMonth && now.getDate() === bDay;

    // If passed this year, next is next year
    if (now > nextBday && !isToday) {
      nextBday = new Date(currentYear + 1, bMonth, bDay, 0, 0, 0);
    }

    const diffMs = Math.max(0, nextBday.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const turningAge = nextBday.getFullYear() - bYear;
    const dayName = nextBday.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = nextBday.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    // Year progress (percentage of this 365-day age lived)
    const prevBday = new Date(nextBday.getFullYear() - 1, bMonth, bDay, 0, 0, 0);
    const yearSpan = nextBday.getTime() - prevBday.getTime();
    const elapsed = now.getTime() - prevBday.getTime();
    const yearPercent = Math.min(100, Math.max(0, Math.round((elapsed / yearSpan) * 100)));

    return {
      days,
      hours,
      minutes,
      seconds,
      isToday,
      turningAge,
      dayName,
      formattedDate,
      yearPercent
    };
  }, [birthDate, now]);

  const saveBirthday = (e) => {
    e?.preventDefault?.();
    try { playClickSound(); } catch {}
    if (typeof window !== "undefined") {
      localStorage.setItem("stiknex_birthday_name", name);
      localStorage.setItem("stiknex_birthday_date", birthDate);
    }
    setPickerOpen(false);
  };

  const copyShareText = () => {
    try { playClickSound(); } catch {}
    const text = countdownData.isToday
      ? `🎉 Today is ${name}! Wishing a wonderful celebration! 🎂`
      : `🎂 Countdown to ${name}: Only ${countdownData.days} days, ${countdownData.hours} hours, and ${countdownData.minutes} minutes until the celebration!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = (n, len = 2) => String(n).padStart(len, "0");

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden px-4 sm:px-8 py-3 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Festive Ambient Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-90"
        style={{
          background: countdownData.isToday
            ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.25) 0%, rgba(236, 72, 153, 0.15) 45%, transparent 75%)"
            : theme === "dark"
            ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(234, 88, 12, 0.05) 45%, transparent 75%)"
            : "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.03) 45%, transparent 75%)"
        }}
      />

      {/* Top Floating Action Bar */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            try { playClickSound(); } catch {}
            setPickerOpen(true);
          }}
          title="Change Birthday"
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          <Calendar size={15} className="text-amber-500" />
          <span className="leading-none">Set Birthday</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* CENTER ARENA: FESTIVE BANNER + 4 COLOSSAL BLOCKS */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center z-10 py-1 sm:py-2">
        {/* Milestone Header Tag */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs sm:text-sm mb-3 sm:mb-4 shadow-xs">
          <Gift size={16} />
          <span>{name} &bull; Next: {countdownData.formattedDate} ({countdownData.dayName})</span>
        </div>

        {/* Birthday Celebration Banner if Today! */}
        {countdownData.isToday && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-black text-lg sm:text-2xl shadow-xl flex items-center gap-3 animate-bounce"
          >
            <PartyPopper size={24} />
            <span>HAPPY BIRTHDAY! CELEBRATE TODAY! 🎂</span>
          </motion.div>
        )}

        {/* 4 COLOSSAL COUNTDOWN METRIC BLOCKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl my-2 sm:my-4">
          {[
            { label: "DAYS", val: countdownData.days },
            { label: "HOURS", val: pad(countdownData.hours) },
            { label: "MINUTES", val: pad(countdownData.minutes) },
            { label: "SECONDS", val: pad(countdownData.seconds) }
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 sm:p-6 rounded-3xl border text-center flex flex-col justify-center items-center shadow-lg backdrop-blur-xl transition-all ${
                theme === "dark"
                  ? "bg-slate-900/90 border-slate-800 text-white"
                  : "bg-white/95 border-slate-200 text-slate-900"
              }`}
            >
              <span className="font-mono font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight tabular-nums leading-none drop-shadow-md">
                {item.val}
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-500 uppercase mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Milestone Age & Year Progress Telemetry */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 mt-2 sm:mt-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-300">
            <Cake size={15} className="text-amber-500" />
            Turning <strong className="text-amber-500 font-bold">{countdownData.turningAge}</strong> Years Old
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>{countdownData.yearPercent}% of current chronological year completed</span>
        </div>

        {/* HERO CONTROLS BAR */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 shrink-0">
          <button
            onClick={() => setPickerOpen(true)}
            className="min-w-[130px] sm:min-w-[160px] justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 hover:brightness-110"
          >
            <Calendar size={18} />
            <span>EDIT BIRTHDAY</span>
          </button>

          <button
            onClick={copyShareText}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md border border-slate-700/50 flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
            <span>{copied ? "COPIED" : "SHARE COUNTDOWN"}</span>
          </button>
        </div>
      </div>

      {/* EDIT BIRTHDAY DRAWER (High Z-Index Overlay z-[100]) */}
      <AnimatePresence>
        {pickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPickerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full sm:w-[26rem] z-[100] shadow-2xl flex flex-col border-l backdrop-blur-2xl ${
                theme === "dark"
                  ? "bg-slate-900/98 border-slate-800 text-white"
                  : "bg-white/98 border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Gift size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Edit Birthday Details</h3>
                    <p className="text-xs text-slate-400">Personalize your upcoming celebration</p>
                  </div>
                </div>
                <button
                  onClick={() => setPickerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveBirthday} className="flex-1 p-5 space-y-5 overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    CELEBRANT NAME / EVENT
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Birthday, Alex's 25th"
                    className={`w-full p-3.5 rounded-2xl text-base font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    BIRTH DATE (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`w-full p-3.5 rounded-2xl text-base font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-xl transition active:scale-95 cursor-pointer"
                  >
                    Save & Start Countdown
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   4. LIVE CLOCK WORKSTATION (/live-clock) - FULLSCREEN PRECISION DIGITAL & SWISS ANALOG
   ========================================================================================= */
function LiveClockWorkstation({ theme, playClickSound }) {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("stiknex_clock_24h") === "true";
    }
    return false;
  });
  const [showMillis, setShowMillis] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Live real-time tick (10ms for smooth needle and millisecond accuracy)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try { playClickSound(); } catch {}
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const toggle24H = () => {
    try { playClickSound(); } catch {}
    setIs24Hour((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("stiknex_clock_24h", String(next));
      }
      return next;
    });
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "h" || e.key === "H") {
        toggle24H();
      } else if (e.key === "m" || e.key === "M") {
        setShowMillis((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pad = (n, len = 2) => String(n).padStart(len, "0");

  const h24 = time.getHours();
  const h12 = h24 % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const millis = Math.floor(time.getMilliseconds() / 10);
  const isPm = h24 >= 12;

  // Swiss Analog Clock Needle Geometry (Center at 150, 150)
  const secFraction = (seconds * 1000 + time.getMilliseconds()) / 60000;
  const minFraction = (minutes + secFraction) / 60;
  const hourFraction = ((h24 % 12) + minFraction) / 12;

  const secAngleRad = (secFraction * 360 - 90) * (Math.PI / 180);
  const minAngleRad = (minFraction * 360 - 90) * (Math.PI / 180);
  const hourAngleRad = (hourFraction * 360 - 90) * (Math.PI / 180);

  // Second Hand
  const secTipX = 150 + 96 * Math.cos(secAngleRad);
  const secTipY = 150 + 96 * Math.sin(secAngleRad);
  const secTailX = 150 - 22 * Math.cos(secAngleRad);
  const secTailY = 150 - 22 * Math.sin(secAngleRad);

  // Minute Hand
  const minTipX = 150 + 82 * Math.cos(minAngleRad);
  const minTipY = 150 + 82 * Math.sin(minAngleRad);

  // Hour Hand
  const hourTipX = 150 + 56 * Math.cos(hourAngleRad);
  const hourTipY = 150 + 56 * Math.sin(hourAngleRad);

  // 60-Tick Geometry
  const ticks = useMemo(() => {
    const list = [];
    const count = 60;
    const cx = 150;
    const cy = 150;
    for (let i = 0; i < count; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isMajor = i % 5 === 0;
      const rInner = isMajor ? 116 : 124;
      const rOuter = 134;
      const x1 = cx + rInner * Math.cos(angle);
      const y1 = cy + rInner * Math.sin(angle);
      const x2 = cx + rOuter * Math.cos(angle);
      const y2 = cy + rOuter * Math.sin(angle);

      const rNum = 104;
      const nx = cx + rNum * Math.cos(angle);
      const ny = cy + rNum * Math.sin(angle) + 3;
      const hourNum = i === 0 ? "12" : String(i / 5);

      list.push({ i, x1, y1, x2, y2, isMajor, nx, ny, hourNum });
    }
    return list;
  }, []);

  // Formatted Date & Timezone
  const fullDateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timeZoneName =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden px-4 sm:px-8 py-3 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-60"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.04) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.10) 0%, rgba(234, 88, 12, 0.02) 45%, transparent 75%)"
        }}
      />

      {/* Top Floating Action Bar */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={toggle24H}
          title="Toggle 12h / 24h Military Format (H)"
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-1.5 cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          <Clock size={15} className="text-amber-500" />
          <span>{is24Hour ? "24-Hour" : "12-Hour"}</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* CENTER ARENA: SWISS ANALOG CLOCK + COLOSSAL DIGITAL TIME */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center z-10 py-1 sm:py-2">
        {/* Swiss Precision Analog Clock Face */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 shrink-0 flex items-center justify-center mb-1 sm:mb-2">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            {/* Background Dial Track */}
            <circle
              cx="150"
              cy="150"
              r="135"
              className="text-slate-300/40 dark:text-slate-800/80 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />

            {/* 60 Precision Ticks + 12 Hours */}
            {ticks.map((tick) => (
              <g key={tick.i}>
                <line
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={
                    tick.isMajor
                      ? theme === "dark" ? "#94a3b8" : "#475569"
                      : theme === "dark" ? "#334155" : "#cbd5e1"
                  }
                  strokeWidth={tick.isMajor ? "2.5" : "1.5"}
                  strokeLinecap="round"
                />
                {tick.isMajor && (
                  <text
                    x={tick.nx}
                    y={tick.ny}
                    textAnchor="middle"
                    fill={theme === "dark" ? "#94a3b8" : "#64748b"}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {tick.hourNum}
                  </text>
                )}
              </g>
            ))}

            {/* Dial Inner Logo / Date Pill */}
            <text
              x="150"
              y="180"
              textAnchor="middle"
              fill="#f59e0b"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1"
            >
              {time.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
            </text>

            {/* Hour Hand */}
            <line
              x1="150"
              y1="150"
              x2={hourTipX}
              y2={hourTipY}
              stroke={theme === "dark" ? "#ffffff" : "#1e293b"}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Minute Hand */}
            <line
              x1="150"
              y1="150"
              x2={minTipX}
              y2={minTipY}
              stroke={theme === "dark" ? "#cbd5e1" : "#475569"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Sweeping Seconds Hand Needle */}
            <line
              x1={secTailX}
              y1={secTailY}
              x2={secTipX}
              y2={secTipY}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Center Pivot Jewel */}
            <circle cx="150" cy="150" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>

        {/* COLOSSAL DIGITAL READOUT */}
        <div className="w-full text-center flex items-baseline justify-center font-mono font-black tracking-tight tabular-nums select-none py-1 sm:py-2 leading-none">
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(is24Hour ? h24 : h12)}
          </span>
          <span className="mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none text-amber-500 animate-pulse">
            :
          </span>
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(minutes)}
          </span>
          <span className="mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none text-amber-500 animate-pulse">
            :
          </span>
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(seconds)}
          </span>

          {/* AM / PM Badge */}
          {!is24Hour && (
            <span className="ml-2 sm:ml-4 text-2xl sm:text-4xl md:text-5xl font-black text-amber-500 self-center px-2 py-0.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              {isPm ? "PM" : "AM"}
            </span>
          )}

          {/* Optional Milliseconds */}
          {showMillis && (
            <span className="text-amber-500 font-extrabold text-3xl sm:text-5xl md:text-6xl ml-2">
              .{pad(millis)}
            </span>
          )}
        </div>

        {/* Live Date & Timezone Metadata Banner */}
        <div className="mt-2 sm:mt-3 text-center space-y-1">
          <div className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-200">
            {fullDateStr}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {timeZoneName} &bull; 100% Precision Sync
          </div>
        </div>

        {/* HERO CONTROLS BAR */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5 shrink-0">
          <button
            onClick={toggle24H}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm sm:text-base shadow-lg transition active:scale-95 cursor-pointer"
          >
            Switch to {is24Hour ? "12-Hour" : "24-Hour"} Mode
          </button>

          <button
            onClick={() => setShowMillis(!showMillis)}
            className={`px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base border transition active:scale-95 cursor-pointer ${
              showMillis
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : theme === "dark"
                ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
            }`}
          >
            {showMillis ? "Hide Milliseconds" : "Show Milliseconds"}
          </button>
        </div>

        {/* Keyboard Shortcuts Hint Bar (Desktop only, hidden on mobile & tablet) */}
        <div className="hidden lg:flex mt-3 sm:mt-4 flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">H</kbd> 12h/24h
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">M</kbd> Milliseconds
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">F</kbd> Fullscreen
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   REMAINING TIME ENGINES (World Clock, Time Zone Converter, etc.)
   ========================================================================================= */

// 1. WORLD CLOCK TOOL
function WorldClockTool({ theme }) {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const CITIES = [
    { city: "New York", zone: "America/New_York", country: "United States", flag: "🇺🇸" },
    { city: "London", zone: "Europe/London", country: "United Kingdom", flag: "🇬🇧" },
    { city: "Paris", zone: "Europe/Paris", country: "France", flag: "🇫🇷" },
    { city: "Berlin", zone: "Europe/Berlin", country: "Germany", flag: "🇩🇪" },
    { city: "New Delhi", zone: "Asia/Kolkata", country: "India", flag: "🇮🇳" },
    { city: "Dubai", zone: "Asia/Dubai", country: "United Arab Emirates", flag: "🇦🇪" },
    { city: "Singapore", zone: "Asia/Singapore", country: "Singapore", flag: "🇸🇬" },
    { city: "Tokyo", zone: "Asia/Tokyo", country: "Japan", flag: "🇯🇵" },
    { city: "Sydney", zone: "Australia/Sydney", country: "Australia", flag: "🇦🇺" },
    { city: "San Francisco", zone: "America/Los_Angeles", country: "United States", flag: "🇺🇸" },
    { city: "Toronto", zone: "America/Toronto", country: "Canada", flag: "🇨🇦" },
    { city: "Hong Kong", zone: "Asia/Hong_Kong", country: "Hong Kong", flag: "🇭🇰" }
  ];

  const filteredCities = CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-amber-500" /> Global Time Capitals
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live synchronized financial and international market time zones</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search capital or country..."
            className="px-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-400 text-slate-900 dark:text-white"
          />
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition cursor-pointer shrink-0"
          >
            {is24Hour ? "24H Mode" : "12H Mode"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCities.map((c) => {
          const formattedTime = time.toLocaleTimeString("en-US", {
            timeZone: c.zone,
            hour12: !is24Hour,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
          const formattedDate = time.toLocaleDateString("en-GB", {
            timeZone: c.zone,
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
          });

          // Check if daytime in that zone (6am to 6pm)
          const hourInZone = parseInt(
            time.toLocaleTimeString("en-US", { timeZone: c.zone, hour12: false, hour: "2-digit" }),
            10
          );
          const isDay = hourInZone >= 6 && hourInZone < 18;

          return (
            <div
              key={c.city}
              className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    {c.flag} {c.country}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDay
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-indigo-500/10 text-indigo-400"
                    }`}
                  >
                    {isDay ? <Sun size={10} /> : <Moon size={10} />}
                    {isDay ? "Day" : "Night"}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{c.city}</h3>
                <span className="text-xs text-slate-400">{formattedDate}</span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {formattedTime}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {c.zone.split("/")[1].replace("_", " ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. TIME ZONE CONVERTER (Interactive 24-Hour Scrubber)
function TimeZoneConverterTool({ theme }) {
  const [selectedHour, setSelectedHour] = useState(12);

  const ZONES = [
    { label: "UTC / GMT", offset: 0, city: "Universal Standard" },
    { label: "New York (EST/EDT)", offset: -5, city: "United States East" },
    { label: "San Francisco (PST/PDT)", offset: -8, city: "United States West" },
    { label: "London (GMT/BST)", offset: 0, city: "United Kingdom" },
    { label: "Berlin / Paris (CET)", offset: 1, city: "Central Europe" },
    { label: "New Delhi (IST)", offset: 5.5, city: "India Standard" },
    { label: "Tokyo (JST)", offset: 9, city: "Japan" },
    { label: "Sydney (AEST)", offset: 10, city: "Australia East" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" /> Interactive Time Zone Converter
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Scrub the 24-hour timeline to see simultaneous converted times across primary world zones
        </p>
      </div>

      {/* 24-Hour Interactive Scrubber */}
      <div
        className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
          theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>00:00 (Midnight)</span>
          <span className="text-amber-500 text-base font-black font-mono">
            Selected Reference: {String(selectedHour).padStart(2, "0")}:00 UTC
          </span>
          <span>23:00 (Night)</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={selectedHour}
          onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* Converted Timezone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ZONES.map((z) => {
          let h = (selectedHour + z.offset) % 24;
          if (h < 0) h += 24;
          const wholeHour = Math.floor(h);
          const minutes = (h % 1) * 60;
          const timeStr = `${String(wholeHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
          const isBusiness = wholeHour >= 9 && wholeHour < 18;

          return (
            <div
              key={z.label}
              className={`p-5 rounded-2xl border shadow-xs space-y-3 ${
                theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">{z.city}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isBusiness
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-slate-500/10 text-slate-400"
                  }`}
                >
                  {isBusiness ? "Work Hours" : "Off Hours"}
                </span>
              </div>
              <h3 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">{z.label}</h3>
              <div className="text-3xl font-black font-mono text-amber-500">{timeStr}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. BUSINESS DAYS CALCULATOR
function BusinessDaysTool({ theme }) {
  const [d1, setD1] = useState("2026-11-01");
  const [d2, setD2] = useState("2026-11-30");
  const [includeEnd, setIncludeEnd] = useState(true);
  const [holidays, setHolidays] = useState(0);

  const stats = useMemo(() => {
    const start = new Date(d1);
    const end = new Date(d2);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return { workDays: 0, weekends: 0, totalDays: 0, ratio: 0 };
    }

    let workDays = 0;
    let weekends = 0;
    let totalDays = 0;
    const cur = new Date(start);

    while (cur < end || (includeEnd && cur.getTime() === end.getTime())) {
      totalDays++;
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekends++;
      } else {
        workDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const netWorkDays = Math.max(0, workDays - holidays);
    const ratio = totalDays > 0 ? Math.round((netWorkDays / totalDays) * 100) : 0;
    return { workDays: netWorkDays, weekends, totalDays, ratio };
  }, [d1, d2, includeEnd, holidays]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-amber-500" /> Business Working Days Calculator
        </h2>
        <p className="text-xs text-slate-400 mt-1">Compute business workdays excluding weekends and public holidays</p>
      </div>

      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
          theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Start Date</label>
            <input
              type="date"
              value={d1}
              onChange={(e) => setD1(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">End Date</label>
            <input
              type="date"
              value={d2}
              onChange={(e) => setD2(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
            />
            <span>Include End Date in calculation</span>
          </label>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Subtract Holidays:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={holidays}
              onChange={(e) => setHolidays(Math.max(0, parseInt(e.target.value || "0", 10)))}
              className="w-16 p-1.5 rounded-xl text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
            />
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">Working Days</span>
            <div className="text-3xl font-black font-mono text-amber-500 mt-1">{stats.workDays}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekend Days</span>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{stats.weekends}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Days</span>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">{stats.totalDays}</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-500 block">Work Ratio</span>
            <div className="text-3xl font-black font-mono text-emerald-500 mt-1">{stats.ratio}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. WEEK NUMBER CALCULATOR
function WeekNumberTool() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const weekStats = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return { week: 1, year: 2026, progress: 0, daysLeft: 0 };

    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    const year = d.getFullYear();

    const endOfYear = new Date(year, 11, 31);
    const daysLeft = Math.max(0, Math.ceil((endOfYear - new Date(selectedDate)) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, Math.round(((365 - daysLeft) / 365) * 100));

    return { week, year, progress, daysLeft };
  }, [selectedDate]);

  return (
    <div className="w-full max-w-3xl mx-auto py-8 space-y-6">
      <div className="p-8 sm:p-10 bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 rounded-3xl text-center shadow-xl space-y-3">
        <span className="text-xs uppercase font-black tracking-widest block opacity-80">
          ISO 8601 Calendar Week
        </span>
        <div className="text-7xl font-black font-mono">Week #{weekStats.week}</div>
        <p className="text-xs font-bold opacity-90">
          Year {weekStats.year} • {weekStats.daysLeft} days remaining until new year
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto pt-4">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1 opacity-90">
            <span>Year Progress</span>
            <span>{weekStats.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-slate-950 rounded-full transition-all" style={{ width: `${weekStats.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase block">Inspect Week For Any Date</span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-center"
        />
      </div>
    </div>
  );
}

// 5. CALENDAR GENERATOR
function CalendarGeneratorTool({ theme }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // 0-based: 10 = November

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" /> Printable Calendar Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generate high-contrast monthly printable calendar sheets</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="p-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="p-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {[2024, 2025, 2026, 2027, 2028, 2030].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
          >
            Print Sheet
          </button>
        </div>
      </div>

      {/* Monthly Printable Grid */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="text-center pb-2">
          <h3 className="text-3xl font-black text-amber-500">
            {MONTH_NAMES[month]} {year}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-xs uppercase text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 rounded-xl bg-slate-100/30 dark:bg-slate-800/20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday =
              dayNum === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-16 p-2 rounded-xl border flex flex-col justify-between transition ${
                  isToday
                    ? "bg-amber-500/15 border-amber-500 text-amber-500 font-black"
                    : theme === "dark" ? "bg-slate-800/40 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <span className="text-sm font-bold">{dayNum}</span>
                {isToday && <span className="text-[9px] font-black uppercase">Today</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 6. MEETING TIME OVERLAP PLANNER
function MeetingPlannerTool({ theme }) {
  const LOCATIONS = [
    { city: "San Francisco (PST)", offset: -8 },
    { city: "London (GMT)", offset: 0 },
    { city: "New Delhi (IST)", offset: 5.5 },
    { city: "Tokyo (JST)", offset: 9 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" /> Global Meeting Overlap Planner
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Visual cross-timezone matrix revealing mutual working hours (9 AM - 5 PM) across international remote teams
        </p>
      </div>

      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 overflow-x-auto ${
          theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-4 text-xs font-bold justify-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Working Hours (9 AM - 5 PM)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Flexible Hours (7-9 AM / 5-8 PM)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-700"></span> Sleeping Hours</span>
        </div>

        <div className="min-w-[650px] space-y-4">
          {LOCATIONS.map((loc) => (
            <div key={loc.city} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">{loc.city}</span>
              <div className="grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }).map((_, utcHour) => {
                  let localHour = (utcHour + loc.offset) % 24;
                  if (localHour < 0) localHour += 24;
                  const whole = Math.floor(localHour);
                  const isWork = whole >= 9 && whole < 17;
                  const isFlex = (whole >= 7 && whole < 9) || (whole >= 17 && whole < 20);

                  return (
                    <div
                      key={utcHour}
                      title={`${loc.city}: ${whole}:00 (UTC ${utcHour}:00)`}
                      className={`h-8 rounded text-[9px] font-mono flex items-center justify-center font-bold text-white transition ${
                        isWork
                          ? "bg-emerald-500"
                          : isFlex
                          ? "bg-amber-500/80"
                          : "bg-slate-700/60"
                      }`}
                    >
                      {whole}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

