import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Hourglass,
  PlusCircle,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Cake,
  CalendarRange
} from "lucide-react";

const TABS = [
  { id: "age", label: "Age Calculator", icon: Cake },
  { id: "between", label: "Days Between Dates", icon: CalendarRange },
  { id: "timediff", label: "Time Difference", icon: Clock },
  { id: "addDays", label: "Add / Subtract Days", icon: PlusCircle },
  { id: "countdown", label: "Live Countdown", icon: Hourglass },
];

export default function DateTimeCalculator() {
  const [activeTab, setActiveTab] = useState("age");

  return (
    <div className="w-full space-y-8">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "age" && <AgeCalculatorSection />}
      {activeTab === "between" && <DaysBetweenSection />}
      {activeTab === "timediff" && <TimeDifferenceSection />}
      {activeTab === "addDays" && <AddDaysSection />}
      {activeTab === "countdown" && <CountdownSection />}
    </div>
  );
}

// ============================================================================
// 1. AGE CALCULATOR SECTION
// ============================================================================
function AgeCalculatorSection() {
  const [dob, setDob] = useState("2000-01-01");
  const [copied, setCopied] = useState(false);

  const stats = (() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    if (isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = today.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Next Birthday calculation
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysUntilNext,
      summary: `${years} Years, ${months} Months, ${days} Days`,
    };
  })();

  const copyResult = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none max-w-xl mx-auto">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Select Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDob(e.target.value)}
          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      {stats && (
        <div className="space-y-4">
          {/* Main Hero Age Display */}
          <div className="p-8 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/40 dark:shadow-none text-center relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
              Exact Age Today
            </span>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">
              {stats.years} <span className="text-lg sm:text-2xl font-bold text-slate-500">Years</span> {stats.months} <span className="text-lg sm:text-2xl font-bold text-slate-500">Months</span> {stats.days} <span className="text-lg sm:text-2xl font-bold text-slate-500">Days</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Next birthday is in <strong className="text-indigo-600 dark:text-indigo-400">{stats.daysUntilNext} days</strong> 🎉
            </p>

            <button
              onClick={copyResult}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Age" : "Copy Exact Age"}
            </button>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Total Days Lived</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalDays.toLocaleString()}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Total Weeks</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalWeeks.toLocaleString()}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Total Hours</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalHours.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. DAYS BETWEEN DATES SECTION
// ============================================================================
function DaysBetweenSection() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-12-31");
  const [copied, setCopied] = useState(false);

  const diff = (() => {
    if (!start || !end) return null;
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    // Estimate business / working days (excluding Sat & Sun)
    let businessDays = 0;
    const cur = new Date(Math.min(d1.getTime(), d2.getTime()));
    const stop = new Date(Math.max(d1.getTime(), d2.getTime()));
    while (cur < stop) {
      cur.setDate(cur.getDate() + 1);
      const day = cur.getDay();
      if (day !== 0 && day !== 6) businessDays++;
    }

    return { totalDays, weeks, remDays, businessDays };
  })();

  const copyDays = () => {
    if (!diff) return;
    navigator.clipboard.writeText(`${diff.totalDays} days`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {diff && (
        <div className="p-8 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/40 dark:shadow-none text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
            Time Span Difference
          </span>
          <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-2">
            {diff.totalDays} <span className="text-2xl font-bold text-slate-500">Days</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Equivalent to <strong>{diff.weeks} weeks and {diff.remDays} days</strong> ({diff.businessDays} working days)
          </p>

          <button
            onClick={copyDays}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Result"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. TIME DIFFERENCE SECTION
// ============================================================================
function TimeDifferenceSection() {
  const [t1, setT1] = useState("09:00");
  const [t2, setT2] = useState("17:30");
  const [copied, setCopied] = useState(false);

  const diff = (() => {
    if (!t1 || !t2) return null;
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);
    let totalMins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMins < 0) totalMins += 24 * 60; // Crosses midnight

    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    return { hours, minutes, totalMinutes: totalMins };
  })();

  const copyTime = () => {
    if (!diff) return;
    navigator.clipboard.writeText(`${diff.hours}h ${diff.minutes}m`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            End Time
          </label>
          <input
            type="time"
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {diff && (
        <div className="p-8 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/40 dark:shadow-none text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
            Duration Between Times
          </span>
          <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-2">
            {diff.hours} <span className="text-2xl font-bold text-slate-500">Hours</span> {diff.minutes} <span className="text-2xl font-bold text-slate-500">Mins</span>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Total of {diff.totalMinutes} minutes
          </p>

          <button
            onClick={copyTime}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Duration"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. ADD / SUBTRACT DAYS SECTION
// ============================================================================
function AddDaysSection() {
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [daysCount, setDaysCount] = useState("30");
  const [direction, setDirection] = useState("add"); // add or subtract
  const [copied, setCopied] = useState(false);

  const targetDate = (() => {
    if (!baseDate || !daysCount) return null;
    const date = new Date(baseDate);
    const count = parseInt(daysCount, 10);
    if (isNaN(date.getTime()) || isNaN(count)) return null;

    const delta = direction === "add" ? count : -count;
    date.setDate(date.getDate() + delta);
    return date;
  })();

  const formattedDate = targetDate
    ? targetDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const copyResult = () => {
    if (!formattedDate) return;
    navigator.clipboard.writeText(formattedDate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Base Date
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Operation
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="add">+ Add</option>
            <option value="sub">− Subtract</option>
          </select>
        </div>

        <div className="w-full sm:w-36">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Days
          </label>
          <input
            type="number"
            min="0"
            value={daysCount}
            onChange={(e) => setDaysCount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {targetDate && (
        <div className="p-8 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/40 dark:shadow-none text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
            Target Calculated Date
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
            {formattedDate}
          </div>

          <button
            onClick={copyResult}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Date"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. COUNTDOWN SECTION
// ============================================================================
function CountdownSection() {
  const [eventDate, setEventDate] = useState("2026-12-31T23:59");
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(eventDate);
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Select Target Event Date & Time
        </label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      {timeLeft && !timeLeft.expired && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
              {timeLeft.days}
            </div>
            <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mt-1">
              Days
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
              {timeLeft.hours}
            </div>
            <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mt-1">
              Hours
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
              {timeLeft.minutes}
            </div>
            <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mt-1">
              Minutes
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
              {timeLeft.seconds}
            </div>
            <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mt-1">
              Seconds
            </div>
          </div>
        </div>
      )}

      {timeLeft?.expired && (
        <div className="p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-3xl text-center text-rose-600 dark:text-rose-400 font-bold">
          🎉 The event time has arrived!
        </div>
      )}
    </div>
  );
}
