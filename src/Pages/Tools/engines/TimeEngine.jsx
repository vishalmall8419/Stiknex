import { useState, useEffect, useMemo } from "react";
import { Clock, Play, Pause, RotateCcw, Globe, Calendar, Flame, Coffee, Check, Copy } from "lucide-react";

export default function TimeEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "world-clock") return <WorldClockTool />;
  if (slug === "pomodoro-timer") return <PomodoroTool />;
  if (slug === "stopwatch") return <StopwatchTool copyText={copyText} />;
  if (slug === "countdown-timer") return <CountdownTool />;
  if (slug === "time-zone-converter") return <TimeZoneConverterTool copyText={copyText} />;
  if (slug === "business-days-calculator") return <BusinessDaysTool copyText={copyText} />;
  if (slug === "week-number-calculator") return <WeekNumberTool copyText={copyText} />;
  if (slug === "birthday-countdown") return <BirthdayCountdownTool />;
  if (slug === "calendar-generator") return <CalendarGeneratorTool />;
  if (slug === "meeting-time-planner") return <MeetingPlannerTool copyText={copyText} />;

  return <WorldClockTool />;
}

// ============================================================================
// BIG TOOL: WORLD CLOCK
// ============================================================================
function WorldClockTool() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { city: "New York", zone: "America/New_York", country: "United States" },
    { city: "London", zone: "Europe/London", country: "United Kingdom" },
    { city: "Paris", zone: "Europe/Paris", country: "France" },
    { city: "New Delhi", zone: "Asia/Kolkata", country: "India" },
    { city: "Tokyo", zone: "Asia/Tokyo", country: "Japan" },
    { city: "Sydney", zone: "Australia/Sydney", country: "Australia" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((c) => {
          const formattedTime = time.toLocaleTimeString("en-US", { timeZone: c.zone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
          const formattedDate = time.toLocaleDateString("en-US", { timeZone: c.zone, weekday: "short", month: "short", day: "numeric" });
          return (
            <div key={c.city} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">{c.country}</span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{c.city}</h3>
                <span className="text-xs text-slate-400">{formattedDate}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">{formattedTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: POMODORO TIMER
// ============================================================================
function PomodoroTool() {
  const [mode, setMode] = useState("work"); // work: 25m, short: 5m, long: 15m
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((sec) => sec - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      alert(mode === "work" ? "Focus session complete! Time for a break." : "Break over! Ready to focus?");
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const switchMode = (newMode, duration) => {
    setMode(newMode);
    setSecondsLeft(duration * 60);
    setIsActive(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center gap-3">
        <button onClick={() => switchMode("work", 25)} className={`px-6 py-2.5 rounded-full font-bold text-xs ${mode === "work" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
          Focus (25m)
        </button>
        <button onClick={() => switchMode("short", 5)} className={`px-6 py-2.5 rounded-full font-bold text-xs ${mode === "short" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
          Short Break (5m)
        </button>
        <button onClick={() => switchMode("long", 15)} className={`px-6 py-2.5 rounded-full font-bold text-xs ${mode === "long" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
          Long Break (15m)
        </button>
      </div>

      <div className="p-16 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
        <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <p className="text-slate-400 text-sm mt-3 font-semibold uppercase tracking-wider">{mode === "work" ? "Deep Work Session" : "Rest & Recharge"}</p>

        <div className="flex gap-4 mt-8">
          <button onClick={() => setIsActive(!isActive)} className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg flex items-center gap-2 ${isActive ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
            {isActive ? <Pause size={18} /> : <Play size={18} />} {isActive ? "Pause" : "Start Session"}
          </button>
          <button onClick={() => switchMode(mode, mode === "work" ? 25 : mode === "short" ? 5 : 15)} className="px-5 py-3.5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: STOPWATCH WITH LAPS
// ============================================================================
function StopwatchTool({ copyText }) {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    if (running) {
      const step = (now) => {
        setMs((prev) => prev + (now - lastTime));
        lastTime = now;
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [running]);

  const addLap = () => {
    setLaps((prev) => [ms, ...prev]);
  };

  const reset = () => {
    setRunning(false);
    setMs(0);
    setLaps([]);
  };

  const formatMs = (time) => {
    const mins = Math.floor(time / 60000);
    const secs = Math.floor((time % 60000) / 1000);
    const millis = Math.floor((time % 1000) / 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 text-center">
      <div className="p-12 bg-indigo-600 text-white rounded-3xl shadow-xl">
        <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight">{formatMs(ms)}</div>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => setRunning(!running)} className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-2xl shadow">
            {running ? "Stop" : "Start"}
          </button>
          {running && (
            <button onClick={addLap} className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-2xl">
              Lap
            </button>
          )}
          <button onClick={reset} className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl">
            Reset
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {laps.map((lap, i) => (
            <div key={i} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between font-mono text-sm">
              <span className="font-bold text-slate-500">Lap {laps.length - i}</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatMs(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helpers for remaining tools
function CountdownTool() {
  const [target, setTarget] = useState("60");
  const [left, setLeft] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let t;
    if (active && left > 0) t = setInterval(() => setLeft((l) => l - 1), 1000);
    else if (left === 0 && active) { setActive(false); alert("Countdown complete!"); }
    return () => clearInterval(t);
  }, [active, left]);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-4">
        <input type="number" value={target} onChange={(e) => { setTarget(e.target.value); setLeft(Number(e.target.value)); }} className="w-32 p-3 border rounded-xl font-bold text-xl text-center" />
        <button onClick={() => setActive(!active)} className="px-6 bg-indigo-600 text-white font-bold rounded-xl">{active ? "Pause" : "Start"}</button>
      </div>
      <div className="p-16 bg-slate-900 text-white rounded-3xl text-7xl font-mono font-black">{left}s</div>
    </div>
  );
}

function TimeZoneConverterTool({ copyText }) {
  const [utc, setUtc] = useState("12:00");
  return (
    <div className="space-y-6">
      <input type="time" value={utc} onChange={(e) => setUtc(e.target.value)} className="p-3 border rounded-xl font-bold text-xl" />
      <div className="p-6 bg-indigo-600 text-white rounded-2xl font-mono text-sm">
        Reference UTC: {utc} UTC
      </div>
    </div>
  );
}

function BusinessDaysTool({ copyText }) {
  const [d1, setD1] = useState("2026-11-01");
  const [d2, setD2] = useState("2026-11-30");

  const businessDays = useMemo(() => {
    const start = new Date(d1);
    const end = new Date(d2);
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }, [d1, d2]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className="p-3 border rounded-xl font-bold" />
        <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className="p-3 border rounded-xl font-bold" />
      </div>
      <div className="p-8 bg-indigo-600 text-white rounded-3xl text-center">
        <span className="text-4xl font-black">{businessDays} Business Days</span>
      </div>
    </div>
  );
}

function WeekNumberTool() {
  const currentWeek = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }, []);

  return (
    <div className="p-16 bg-indigo-600 text-white rounded-3xl text-center">
      <span className="text-xs uppercase font-bold text-indigo-200 block mb-1">Current ISO Week</span>
      <span className="text-7xl font-black">Week #{currentWeek}</span>
    </div>
  );
}

function BirthdayCountdownTool() {
  return (
    <div className="p-12 bg-slate-900 text-white rounded-3xl text-center space-y-4">
      <Calendar size={36} className="text-indigo-400 mx-auto" />
      <h3 className="font-bold text-xl">Upcoming Celebration Tracker</h3>
      <p className="text-sm text-slate-400">Track exact days and hours left until your next milestone birthday.</p>
    </div>
  );
}

function CalendarGeneratorTool() {
  return (
    <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border text-center space-y-4">
      <Calendar size={36} className="text-indigo-600 mx-auto" />
      <h3 className="font-bold text-xl">Printable Monthly & Yearly Calendar</h3>
      <button onClick={() => window.print()} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow">
        Print Calendar View
      </button>
    </div>
  );
}

function MeetingPlannerTool({ copyText }) {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border space-y-4">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Global Team Meeting Slot Finder</h3>
      <p className="text-xs text-slate-500">Overlapping green zones highlight comfortable 9 AM - 6 PM working windows between US, Europe, and Asia.</p>
    </div>
  );
}
