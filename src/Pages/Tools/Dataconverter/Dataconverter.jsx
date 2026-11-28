import { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, Sparkles, Database, Binary, Clock, Cpu } from "lucide-react";

const TABS = [
  { id: "storage", label: "Data Storage Converter", icon: Database },
  { id: "base", label: "Number Base (Bin / Oct / Dec / Hex)", icon: Binary },
];

export default function DataConverter() {
  const [activeTab, setActiveTab] = useState("storage");

  return (
    <div className="w-full space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl max-w-md mx-auto border border-slate-200 dark:border-slate-800">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "storage" ? <StorageConverterSection /> : <BaseConverterSection />}
    </div>
  );
}

// ============================================================================
// STORAGE CONVERTER SECTION (Binary 1024 vs Decimal 1000)
// ============================================================================
function StorageConverterSection() {
  const [value, setValue] = useState("1");
  const [standard, setStandard] = useState("binary"); // 'binary' (1024) or 'decimal' (1000)
  const [fromUnit, setFromUnit] = useState("gb");
  const [toUnit, setToUnit] = useState("mb");
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const baseFactor = standard === "binary" ? 1024 : 1000;

  const STORAGE_UNITS = [
    { id: "b", label: "Bit (b)", factor: 1 / 8 },
    { id: "B", label: "Byte (B)", factor: 1 },
    { id: "kb", label: standard === "binary" ? "Kibibyte (KiB)" : "Kilobyte (KB)", factor: baseFactor },
    { id: "mb", label: standard === "binary" ? "Mebibyte (MiB)" : "Megabyte (MB)", factor: Math.pow(baseFactor, 2) },
    { id: "gb", label: standard === "binary" ? "Gibibyte (GiB)" : "Gigabyte (GB)", factor: Math.pow(baseFactor, 3) },
    { id: "tb", label: standard === "binary" ? "Tebibyte (TiB)" : "Terabyte (TB)", factor: Math.pow(baseFactor, 4) },
    { id: "pb", label: standard === "binary" ? "Pebibyte (PiB)" : "Petabyte (PB)", factor: Math.pow(baseFactor, 5) },
  ];

  const num = Number(value);
  const isValid = value !== "" && !isNaN(num) && num >= 0;

  const fromFactor = STORAGE_UNITS.find((u) => u.id === fromUnit)?.factor || 1;
  const toFactor = STORAGE_UNITS.find((u) => u.id === toUnit)?.factor || 1;

  // Value in Bytes
  const bytesValue = isValid ? num * fromFactor : 0;
  const targetConverted = isValid ? bytesValue / toFactor : 0;

  const formatStorage = (n) => {
    if (!isFinite(n) || n === 0) return "0";
    if (n >= 1e9 || (n > 0 && n < 1e-4)) {
      return n.toExponential(4);
    }
    return Number(n.toFixed(6)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const targetFormatted = formatStorage(targetConverted);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyText = (txt, isTarget = false, id = null) => {
    navigator.clipboard.writeText(String(txt).replace(/,/g, ""));
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Download transfer time estimates at 100 Mbps
  const transferSeconds = isValid ? (bytesValue * 8) / (100 * 1e6) : 0;
  const formatTime = (secs) => {
    if (secs < 1) return `${Math.round(secs * 1000)} ms`;
    if (secs < 60) return `${secs.toFixed(1)} seconds`;
    if (secs < 3600) return `${(secs / 60).toFixed(1)} minutes`;
    return `${(secs / 3600).toFixed(1)} hours`;
  };

  return (
    <div className="space-y-8">
      {/* Standard Toggle & Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Standard:
          </span>
          <div className="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setStandard("binary")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                standard === "binary"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Binary (1024 KiB)
            </button>
            <button
              onClick={() => setStandard("decimal")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                standard === "decimal"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Decimal (1000 KB)
            </button>
          </div>
        </div>

        {/* Quick Sizes */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Quick sizes:</span>
          {[1, 5, 10, 100, 500].map((s) => (
            <button
              key={s}
              onClick={() => setValue(String(s))}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {s}
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

      {/* Main Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
        {/* FROM CARD */}
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                From Data Size
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Input
              </span>
            </div>

            <input
              type="number"
              step="any"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
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
              {STORAGE_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
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

        {/* TO CARD */}
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900/90 dark:to-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Converted Size
              </span>
              <button
                onClick={() => copyText(targetFormatted, true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
              >
                {copiedTarget ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Size
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
              {STORAGE_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transfer Time Estimate Callout */}
      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              Transfer Speed Estimate @ 100 Mbps
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Estimated download time over a typical 100 Mbps broadband connection:{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">{formatTime(transferSeconds)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Storage Matrix Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              All Storage Units Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any card to copy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STORAGE_UNITS.map((u) => {
            const val = isValid ? bytesValue / u.factor : 0;
            const formatted = formatStorage(val);
            const isSelected = u.id === toUnit;
            const isSource = u.id === fromUnit;

            return (
              <div
                key={u.id}
                onClick={() => copyText(formatted, false, u.id)}
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
                  {copiedId === u.id ? (
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

// ============================================================================
// BASE CONVERTER SECTION (Binary, Octal, Decimal, Hexadecimal)
// ============================================================================
function BaseConverterSection() {
  const [value, setValue] = useState("255");
  const [base, setBase] = useState("10");
  const [copiedId, setCopiedId] = useState(null);

  const BASES = [
    { id: "2", label: "Binary (Base 2)", prefix: "0b", placeholder: "e.g. 11111111" },
    { id: "8", label: "Octal (Base 8)", prefix: "0o", placeholder: "e.g. 377" },
    { id: "10", label: "Decimal (Base 10)", prefix: "", placeholder: "e.g. 255" },
    { id: "16", label: "Hexadecimal (Base 16)", prefix: "0x", placeholder: "e.g. FF" },
  ];

  const validationRegex = {
    "2": /^[01]*$/,
    "8": /^[0-7]*$/,
    "10": /^[0-9]*$/,
    "16": /^[0-9a-fA-F]*$/,
  }[base];

  const clean = value.trim();
  const isValid = clean === "" || validationRegex.test(clean);
  const decVal = isValid && clean !== "" ? parseInt(clean, Number(base)) : NaN;

  const copyText = (txt, id) => {
    navigator.clipboard.writeText(String(txt));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Field Card */}
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Input Number Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter number..."
              className={`w-full text-2xl sm:text-3xl font-black bg-transparent outline-none border-b-2 pb-2 font-mono transition-colors ${
                isValid
                  ? "text-slate-900 dark:text-white border-indigo-200 dark:border-slate-700 focus:border-indigo-600"
                  : "text-rose-600 border-rose-500"
              }`}
            />
            {!isValid && (
              <p className="text-xs font-semibold text-rose-500 mt-2">
                Invalid character for base {base}. Please check your input.
              </p>
            )}
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Input Base
            </label>
            <select
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {BASES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of All 4 Number Bases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BASES.map((b) => {
          const converted =
            !isNaN(decVal) && clean !== ""
              ? decVal.toString(Number(b.id)).toUpperCase()
              : "0";
          const isSelected = b.id === base;

          return (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-indigo-50/90 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 shadow-xs"
                  : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {b.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Input Base
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white break-all">
                  {b.prefix}
                  {converted}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Base {b.id} format
                </span>
                <button
                  onClick={() => copyText(converted, b.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedId === b.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Value
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
