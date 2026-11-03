import { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, Sparkles, Hash } from "lucide-react";

const formatNumber = (n, precision) => {
  if (!isFinite(n)) return "0";
  if (precision === "auto") {
    return Number(n.toPrecision(10))
      .toString()
      .replace(/\.?0+$/, (m) => (m.includes(".") ? "" : m));
  }
  const decimals = Number(precision);
  if (Math.abs(n) > 0 && Math.abs(n) < Math.pow(10, -decimals)) {
    return n.toExponential(decimals);
  }
  return Number(n.toFixed(decimals)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export default function UnitConverter({ units = [], defaultUnit }) {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(defaultUnit || units[0]?.id || "");
  const [toUnit, setToUnit] = useState(units[1]?.id || units[0]?.id || "");
  const [precision, setPrecision] = useState("4");
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedUnitId, setCopiedUnitId] = useState(null);

  const numValue = Number(value);
  const isValid = value !== "" && !isNaN(numValue);

  const fromFactor = units.find((u) => u.id === fromUnit)?.factor || 1;
  const toFactor = units.find((u) => u.id === toUnit)?.factor || 1;

  // Base value in standard SI units
  const baseValue = isValid ? numValue * fromFactor : 0;

  // Primary conversion target
  const targetConverted = isValid ? baseValue / toFactor : 0;
  const targetFormatted = formatNumber(targetConverted, precision);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyToClipboard = (text, isTarget = false, unitId = null) => {
    navigator.clipboard.writeText(String(text).replace(/,/g, ""));
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
    if (unitId) {
      setCopiedUnitId(unitId);
      setTimeout(() => setCopiedUnitId(null), 2000);
    }
  };

  const PRESETS = [1, 5, 10, 50, 100];

  return (
    <div className="w-full space-y-8">
      {/* Precision & Quick Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Precision:
          </span>
          <div className="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            {["2", "4", "6", "auto"].map((p) => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  precision === p
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {p === "auto" ? "Auto" : `${p} dec`}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Value Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setValue(String(p))}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {p}
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
                From
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Input Value
              </span>
            </div>

            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full text-3xl sm:text-4xl font-black text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 pb-2 transition-colors"
            />
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Source Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} ({u.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWAP BUTTON (Floating between cards on Desktop) */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-4 border-white dark:border-slate-900"
            title="Swap Units"
            aria-label="Swap Units"
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
            <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Units
          </button>
        </div>

        {/* TO CARD (Result) */}
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900/90 dark:to-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Converted Result
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
              {targetFormatted}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Target Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} ({u.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complete All-Units Equivalent Matrix */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              All Units Comparison Table
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any card to copy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {units.map((u) => {
            const val = isValid ? baseValue / u.factor : 0;
            const formatted = formatNumber(val, precision);
            const isSelected = u.id === toUnit;
            const isSource = u.id === fromUnit;

            return (
              <div
                key={u.id}
                onClick={() => copyToClipboard(formatted, false, u.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? "bg-indigo-50/90 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 shadow-xs"
                    : isSource
                    ? "bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700"
                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="overflow-hidden pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {u.label}
                    </span>
                    {isSource && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        From
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Target
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {formatted}
                  </div>
                </div>

                <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
  );
}
