import { useState } from "react";
import { Copy, Check, ArrowRightLeft, Sparkles, Thermometer } from "lucide-react";

const UNITS = [
  { id: "c", label: "Celsius", symbol: "°C" },
  { id: "f", label: "Fahrenheit", symbol: "°F" },
  { id: "k", label: "Kelvin", symbol: "K" },
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

export default function TemperatureConverter() {
  const [value, setValue] = useState("25");
  const [fromUnit, setFromUnit] = useState("c");
  const [toUnit, setToUnit] = useState("f");
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedUnitId, setCopiedUnitId] = useState(null);

  const numValue = Number(value);
  const isValid = value !== "" && !isNaN(numValue);
  const celsiusBase = isValid ? toCelsius(numValue, fromUnit) : 0;

  const targetValue = isValid ? fromCelsius(celsiusBase, toUnit) : 0;
  const targetFormatted = formatTemp(targetValue);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyToClipboard = (text, isTarget = false, unitId = null) => {
    navigator.clipboard.writeText(String(text));
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
    if (unitId) {
      setCopiedUnitId(unitId);
      setTimeout(() => setCopiedUnitId(null), 2000);
    }
  };

  const BENCHMARKS = [
    { label: "Absolute Zero", c: -273.15 },
    { label: "Freezing Point", c: 0 },
    { label: "Room Temp", c: 21 },
    { label: "Human Body", c: 37 },
    { label: "Boiling Point", c: 100 },
  ];

  const setBenchmark = (cVal) => {
    const valInFromUnit = fromCelsius(cVal, fromUnit);
    setValue(String(formatTemp(valInFromUnit)));
  };

  return (
    <div className="w-full space-y-8">
      {/* Quick Scientific Benchmarks */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Presets:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {BENCHMARKS.map((b) => (
            <button
              key={b.label}
              onClick={() => setBenchmark(b.c)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {b.label} ({b.c}°C)
            </button>
          ))}
          <button
            onClick={() => setValue("")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main Dual Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
        {/* FROM CARD */}
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                From Scale
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Input Temperature
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                className="w-full text-3xl sm:text-4xl font-black text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 pb-2 transition-colors"
              />
              <span className="text-2xl font-bold text-slate-400">
                {UNITS.find((u) => u.id === fromUnit)?.symbol}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Source Scale
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-4 border-white dark:border-slate-900"
            title="Swap Scales"
            aria-label="Swap Scales"
          >
            <ArrowRightLeft className="w-5 h-5" />
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
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900/90 dark:to-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Converted Output
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

            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white break-words">
              {targetFormatted} <span className="text-indigo-600 dark:text-indigo-400 font-bold">{UNITS.find((u) => u.id === toUnit)?.symbol}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Target Scale
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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

      {/* Real-Time All Scale Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {UNITS.map((u) => {
          const val = isValid ? fromCelsius(celsiusBase, u.id) : 0;
          const formatted = formatTemp(val);
          const isSelected = u.id === toUnit;
          const isSource = u.id === fromUnit;

          return (
            <div
              key={u.id}
              onClick={() => copyToClipboard(formatted, false, u.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? "bg-indigo-50/90 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 shadow-xs"
                  : isSource
                  ? "bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {u.label}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-500">
                  {u.symbol}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white truncate">
                {formatted} {u.symbol}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{isSource ? "Input Scale" : isSelected ? "Target Scale" : "Scale Equivalent"}</span>
                <span className="flex items-center gap-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold">
                  {copiedUnitId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUnitId === u.id ? "Copied" : "Copy"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
