import { useEffect, useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, Sparkles, RefreshCw, Globe, DollarSign } from "lucide-react";

const CURRENCIES = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

const FALLBACK_RATES_USD = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 87.0,
  JPY: 151.0,
  AUD: 1.52,
  CAD: 1.36,
  CNY: 7.24,
  SGD: 1.34,
  CHF: 0.88,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState(FALLBACK_RATES_USD);
  const [status, setStatus] = useState("loading"); // loading, live, offline
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchRates = async (fromCode) => {
    setStatus("loading");
    try {
      const targets = CURRENCIES.map((c) => c.code)
        .filter((c) => c !== fromCode)
        .join(",");
      const res = await fetch(
        `https://api.frankfurter.app/latest?from=${fromCode}&to=${targets}`
      );
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setRates({ ...data.rates, [fromCode]: 1 });
      setStatus("live");
    } catch {
      // Offline fallback relative to USD
      const usdRate = FALLBACK_RATES_USD[fromCode] || 1;
      const converted = {};
      CURRENCIES.forEach((c) => {
        converted[c.code] = (FALLBACK_RATES_USD[c.code] || 1) / usdRate;
      });
      setRates(converted);
      setStatus("offline");
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchRates(from);
    return () => {
      cancelled = true;
    };
  }, [from]);

  const numAmount = Number(amount);
  const isValid = amount !== "" && !isNaN(numAmount) && numAmount >= 0;

  const targetRate = rates[to] || 1;
  const convertedAmount = isValid ? numAmount * targetRate : 0;

  const formatCurrency = (n) => {
    if (!isFinite(n)) return "0.00";
    return Number(n.toFixed(2)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const targetFormatted = formatCurrency(convertedAmount);

  const handleSwap = () => {
    const prevFrom = from;
    const prevTo = to;
    setFrom(prevTo);
    setTo(prevFrom);
  };

  const copyText = (txt, isTarget = false, code = null) => {
    navigator.clipboard.writeText(String(txt).replace(/,/g, ""));
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
    if (code) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const POPULAR_PAIRS = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "INR" },
    { from: "GBP", to: "USD" },
    { from: "EUR", to: "GBP" },
    { from: "USD", to: "JPY" },
  ];

  const setPair = (pairFrom, pairTo) => {
    setFrom(pairFrom);
    setTo(pairTo);
  };

  return (
    <div className="w-full space-y-8">
      {/* Popular Currency Pairs & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Popular Pairs:
          </span>
          {POPULAR_PAIRS.map((p) => {
            const isCurrent = from === p.from && to === p.to;
            return (
              <button
                key={`${p.from}-${p.to}`}
                onClick={() => setPair(p.from, p.to)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200"
                }`}
              >
                {p.from} / {p.to}
              </button>
            );
          })}
        </div>

        {/* Live Rates Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "live"
                ? "bg-emerald-500 animate-pulse"
                : status === "loading"
                ? "bg-amber-500 animate-spin"
                : "bg-slate-400"
            }`}
          />
          <span className="text-slate-500 dark:text-slate-400">
            {status === "live"
              ? "Live Central Bank Rates"
              : status === "loading"
              ? "Updating rates..."
              : "Standard Reference Rates"}
          </span>
        </div>
      </div>

      {/* Main Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
        {/* FROM CARD */}
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Amount to Convert
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                From ({from})
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-400">
                {CURRENCIES.find((c) => c.code === from)?.symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full text-3xl sm:text-4xl font-black text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 pb-2 transition-colors"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Currency
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
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
            title="Swap Currencies"
            aria-label="Swap Currencies"
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
            <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Currencies
          </button>
        </div>

        {/* TO CARD */}
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900/90 dark:to-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-lg shadow-indigo-100/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Converted Amount
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
                    <Copy className="w-3.5 h-3.5" /> Copy Amount
                  </>
                )}
              </button>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white break-words">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-1">
                {CURRENCIES.find((c) => c.code === to)?.symbol}
              </span>
              {targetFormatted}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              1 {from} = {Number(targetRate).toFixed(4)} {to}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Target Currency
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Global Major Rates Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Rates for {amount} {from} Across All Currencies
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any card to copy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CURRENCIES.map((c) => {
            const rate = rates[c.code] || 1;
            const converted = isValid ? numAmount * rate : 0;
            const formatted = formatCurrency(converted);
            const isSelected = c.code === to;
            const isSource = c.code === from;

            return (
              <div
                key={c.code}
                onClick={() => copyText(formatted, false, c.code)}
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
                      {c.code} ({c.symbol})
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[110px]">
                      {c.name}
                    </span>
                    {isSource && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Base
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Target
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {c.symbol} {formatted}
                  </div>
                </div>

                <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {copiedCode === c.code ? (
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
