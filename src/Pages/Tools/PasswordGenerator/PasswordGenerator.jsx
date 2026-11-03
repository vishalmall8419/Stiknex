import { useState, useEffect, useMemo } from "react";
import { Copy, Check, RefreshCw, ShieldCheck, ShieldAlert, Sparkles, KeyRound, Sliders } from "lucide-react";

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const generateSecurePassword = (length, options) => {
  let pool = "";
  if (options.lower) pool += CHAR_SETS.lower;
  if (options.upper) pool += CHAR_SETS.upper;
  if (options.numbers) pool += CHAR_SETS.numbers;
  if (options.symbols) pool += CHAR_SETS.symbols;

  if (!pool) return "";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[array[i] % pool.length];
  }
  return result;
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    setPassword(generateSecurePassword(length, options));
  };

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  const strength = useMemo(() => {
    if (!password) return { label: "None", pct: 0, color: "slate", crackTime: "Instant" };
    let poolSize = 0;
    if (options.lower) poolSize += 26;
    if (options.upper) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 30;

    const entropy = Math.round(length * Math.log2(Math.max(2, poolSize)));

    if (entropy < 40) {
      return { label: "Weak", pct: 25, color: "rose", crackTime: "Few seconds", entropy };
    }
    if (entropy < 65) {
      return { label: "Moderate", pct: 55, color: "amber", crackTime: "Several days", entropy };
    }
    if (entropy < 85) {
      return { label: "Strong", pct: 80, color: "indigo", crackTime: "Thousands of years", entropy };
    }
    return { label: "Military Grade", pct: 100, color: "emerald", crackTime: "Trillions of centuries", entropy };
  }, [password, length, options]);

  const handleCopy = async () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key) => {
    setOptions((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[key]) return prev; // Keep at least one checked
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Password Output Display Card */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Password
            </span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            strength.color === "emerald"
              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
              : strength.color === "indigo"
              ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
              : strength.color === "amber"
              ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
              : "bg-rose-950/80 text-rose-300 border border-rose-800/60"
          }`}>
            {strength.label} ({strength.entropy || 0} bits)
          </span>
        </div>

        {/* Password String */}
        <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-white break-all select-all py-2">
          {password || "—"}
        </div>

        {/* Strength Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength.color === "emerald"
                ? "bg-emerald-500"
                : strength.color === "indigo"
                ? "bg-indigo-500"
                : strength.color === "amber"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
            style={{ width: `${strength.pct}%` }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Est. brute-force time: <strong className="text-slate-200">{strength.crackTime}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={regenerate}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Regenerate Password"
              aria-label="Regenerate Password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied" : "Copy Password"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Controls Card */}
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Password Length: <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{length} characters</span>
            </label>
            <div className="flex gap-1.5">
              {[8, 12, 16, 24, 32].map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                    length === len
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Character Set Checkboxes */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { id: "upper", label: "Uppercase (A-Z)", desc: "ABC..." },
            { id: "lower", label: "Lowercase (a-z)", desc: "abc..." },
            { id: "numbers", label: "Numbers (0-9)", desc: "123..." },
            { id: "symbols", label: "Symbols (!@#)", desc: "#$&..." },
          ].map((item) => {
            const isChecked = options[item.id];
            return (
              <label
                key={item.id}
                onClick={() => toggleOption(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? "bg-indigo-50/80 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-950 dark:text-white"
                    : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.desc}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
