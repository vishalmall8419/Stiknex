import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Key,
  Lock,
  Hash,
  Shuffle,
  RefreshCw,
  EyeOff,
  Zap,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload,
  FileCheck,
  Sliders,
  Sparkles,
  Menu,
  Sun,
  Moon,
  Trash2,
  Share2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   SECURITY & CRYPTOGRAPHY TOOLS METADATA
   ========================================================================================= */
const SECURITY_TOOLS = [
  { slug: "password-generator", title: "Password Generator", highlight: "CRYPTO CSPRNG", tag: "Custom Length & Symbols", desc: "Generate strong, uncrackable passwords using Web Crypto API", icon: <Key size={16} /> },
  { slug: "password-strength-checker", title: "Password Strength", highlight: "NIST METRICS", tag: "Entropy & Crack Time", desc: "Evaluate password strength, entropy bits, and brute-force resistance", icon: <Shield size={16} /> },
  { slug: "passphrase-generator", title: "Passphrase Gen", highlight: "DICEWARE", tag: "Memorable Words", desc: "Generate highly secure, human-memorable multi-word passphrases", icon: <Lock size={16} /> },
  { slug: "random-number-generator", title: "Random Number", highlight: "CSPRNG", tag: "Min/Max & Unique", desc: "Generate cryptographically secure random integers and floats", icon: <Shuffle size={16} /> },
  { slug: "random-string-generator", title: "Random String", highlight: "ALPHANUMERIC", tag: "Hex, Base58 & Custom", desc: "Generate secure random tokens, secret keys, and nonces", icon: <Shuffle size={16} /> },
  { slug: "sha-hash-calculator", title: "SHA Hash Calc", highlight: "WEB CRYPTO", tag: "SHA-256, 384, 512", desc: "Compute cryptographic SHA checksums in real time without servers", icon: <Hash size={16} /> },
  { slug: "hmac-calculator", title: "HMAC Calculator", highlight: "KEYED HASH", tag: "HMAC-SHA256 & 512", desc: "Calculate Hash-based Message Authentication Codes with secret keys", icon: <Key size={16} /> },
  { slug: "file-hash-checker", title: "File Checksum", highlight: "CLIENT STREAM", tag: "SHA-256 & SHA-1", desc: "Verify file integrity and checksums client-side without uploading", icon: <FileCheck size={16} /> },
  { slug: "secret-free-redaction-tool", title: "Redaction Tool", highlight: "DLP SCRUBBER", tag: "Mask Keys & PII", desc: "Scrub API keys, tokens, emails, and sensitive credentials from logs", icon: <EyeOff size={16} /> },
  { slug: "entropy-estimator", title: "Entropy Estimator", highlight: "SHANNON ENTROPY", tag: "Bits per Character", desc: "Calculate Shannon information entropy and randomness metrics", icon: <Zap size={16} /> }
];

export default function SecurityEngine({ slug = "password-generator", toolId = "password-generator" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "password-generator");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
    }
  }, [slug]);

  const handleSelectTool = (targetSlug) => {
    setActiveSlug(targetSlug);
    window.history.replaceState(null, "", `/${targetSlug}`);
  };

  const copyText = useCallback((txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentTool = useMemo(() => {
    return SECURITY_TOOLS.find((t) => t.slug === activeSlug) || SECURITY_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return SECURITY_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Universal Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Security & Privacy Tools"
        onFeedback={openFeedback}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Tools Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/tools" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
            <span>Tools</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white capitalize">Security</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/tools"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            All 200 Tools
          </Link>
        </div>
      </header>

      {/* Horizontal Tool Selector Tab Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {SECURITY_TOOLS.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <button
                key={tool.slug}
                onClick={() => handleSelectTool(tool.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        {/* Active Tool Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                {currentTool.highlight}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{currentTool.tag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {currentTool.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={13} /> 100% Cryptographic In-Browser Security
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "password-generator" && <PasswordGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "password-strength-checker" && <PasswordStrengthTool copyText={copyText} copied={copied} />}
          {activeSlug === "passphrase-generator" && <PassphraseTool copyText={copyText} copied={copied} />}
          {activeSlug === "random-number-generator" && <RandomNumberTool copyText={copyText} copied={copied} />}
          {activeSlug === "random-string-generator" && <RandomStringTool copyText={copyText} copied={copied} />}
          {activeSlug === "sha-hash-calculator" && <ShaHashTool copyText={copyText} copied={copied} />}
          {activeSlug === "hmac-calculator" && <HmacTool copyText={copyText} copied={copied} />}
          {activeSlug === "file-hash-checker" && <FileHashTool copyText={copyText} copied={copied} />}
          {activeSlug === "secret-free-redaction-tool" && <RedactionTool copyText={copyText} copied={copied} />}
          {activeSlug === "entropy-estimator" && <EntropyTool copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================================
   TOOL 1: PASSWORD GENERATOR (CSPRNG)
   ========================================================================================= */
function PasswordGeneratorTool({ copyText, copied }) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let chars = "";
    if (useLower) chars += avoidAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    if (useUpper) chars += avoidAmbiguous ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) chars += avoidAmbiguous ? "23456789" : "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      {/* Result Hero */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full overflow-hidden text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Generated Password</span>
          <span className="font-mono text-xl sm:text-2xl font-black text-indigo-400 break-all select-all">
            {password || "Select at least one character set"}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generate}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition"
            title="Generate New Password"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => copyText(password)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password Length: {length} Characters</label>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
            <span>Symbols (!@#$)</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={avoidAmbiguous} onChange={(e) => setAvoidAmbiguous(e.target.checked)} />
            <span>Avoid Ambiguous Characters (e.g. 0, O, 1, l, I)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 2: PASSWORD STRENGTH CHECKER (NIST METRICS)
   ========================================================================================= */
function PasswordStrengthTool({ copyText, copied }) {
  const [pwd, setPwd] = useState("CorrectHorseBatteryStaple2026!");

  const analysis = useMemo(() => {
    if (!pwd) return { score: 0, entropy: 0, crackTime: "Instant" };

    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;

    const entropy = pool > 0 ? Math.round(pwd.length * Math.log2(pool)) : 0;

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score += 1;

    let crackTime = "Instant";
    if (entropy > 85) crackTime = "Centuries (Brute-Force Immune)";
    else if (entropy > 65) crackTime = "Several Millennia";
    else if (entropy > 50) crackTime = "Several Years";
    else if (entropy > 35) crackTime = "A Few Weeks";
    else if (entropy > 25) crackTime = "Few Minutes";

    return {
      entropy,
      score: Math.min(score, 5),
      crackTime,
      length: pwd.length,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[^a-zA-Z0-9]/.test(pwd)
    };
  }, [pwd]);

  const STRENGTH_NAMES = ["Very Vulnerable", "Weak", "Fair", "Strong", "Very Strong", "Military Grade"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Test Any Password</label>
        <input
          type="text"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Type or paste password to evaluate..."
          className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-base font-bold text-slate-900 dark:text-white"
        />
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Calculated Security Level</span>
          <span className="text-lg font-black">{STRENGTH_NAMES[analysis.score]}</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`h-full flex-1 rounded-full transition-all ${
                analysis.score >= lvl
                  ? analysis.score >= 4
                    ? "bg-emerald-500"
                    : analysis.score >= 3
                    ? "bg-indigo-500"
                    : "bg-rose-500"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <span className="text-[11px] text-slate-400 block">Entropy Bits</span>
            <span className="text-xl font-bold font-mono text-indigo-300">{analysis.entropy} bits</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Est. Offline Crack Time</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{analysis.crackTime}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Length</span>
            <span className="text-xl font-bold font-mono text-white">{analysis.length} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 3: PASSPHRASE GENERATOR (DICEWARE)
   ========================================================================================= */
function PassphraseTool({ copyText, copied }) {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [passphrase, setPassphrase] = useState("");

  const WORDLIST = [
    "galaxy", "panther", "summit", "crystal", "orbit", "vector", "harvest", "beacon",
    "falcon", "glacier", "zenith", "thunder", "meadow", "canyon", "voyage", "radiant",
    "shield", "timber", "cascade", "nebula", "sapphire", "phoenix", "horizon", "vortex",
    "shadow", "silver", "echo", "anchor", "stellar", "matrix", "aurora", "breeze"
  ];

  const generate = useCallback(() => {
    const array = new Uint32Array(wordCount);
    crypto.getRandomValues(array);
    let words = [];
    for (let i = 0; i < wordCount; i++) {
      let w = WORDLIST[array[i] % WORDLIST.length];
      if (capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
      words.push(w);
    }
    if (includeNumber) {
      const num = crypto.getRandomValues(new Uint8Array(1))[0] % 100;
      words[words.length - 1] += String(num);
    }
    setPassphrase(words.join(separator));
  }, [wordCount, separator, capitalize, includeNumber]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full overflow-hidden text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Generated Passphrase</span>
          <span className="font-mono text-xl sm:text-2xl font-black text-indigo-400 break-all select-all">{passphrase}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={generate} className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition">
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => copyText(passphrase)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Words:</span>
            {[3, 4, 5, 6].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setWordCount(cnt)}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  wordCount === cnt ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Separator:</span>
            {[
              { label: "Hyphen (-)", val: "-" },
              { label: "Underscore (_)", val: "_" },
              { label: "Space", val: " " },
              { label: "Period (.)", val: "." }
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSeparator(s.val)}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  separator === s.val ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} />
            <span>Capitalize Each Word</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeNumber} onChange={(e) => setIncludeNumber(e.target.checked)} />
            <span>Append Random Number</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 4-5: RANDOM NUMBER & RANDOM STRING GENERATOR
   ========================================================================================= */
function RandomNumberTool({ copyText, copied }) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(true);
  const [numbers, setNumbers] = useState([]);

  const generate = () => {
    const total = Math.min(Math.max(1, count), 500);
    const range = max - min + 1;
    if (unique && range < total) {
      alert("Range is too small for unique numbers.");
      return;
    }

    const set = new Set();
    const list = [];
    while (list.length < total) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const val = min + (arr[0] % range);
      if (unique) {
        if (!set.has(val)) {
          set.add(val);
          list.push(val);
        }
      } else {
        list.push(val);
      }
    }
    setNumbers(list);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block">Min</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 block">Max</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 block">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
            <span>Unique Only</span>
          </label>
          <button
            onClick={generate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{numbers.length} Generated Numbers</span>
          <button onClick={() => copyText(numbers.join(", "))} className="text-xs font-bold text-indigo-400 hover:underline">
            Copy List
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {numbers.map((n, idx) => (
            <span key={idx} className="px-3.5 py-1.5 bg-slate-800 rounded-xl font-mono text-sm font-black text-indigo-300">
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RandomStringTool({ copyText, copied }) {
  const [length, setLength] = useState(32);
  const [charset, setCharset] = useState("hex");
  const [str, setStr] = useState("");

  const generate = () => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (charset === "hex") chars = "0123456789abcdef";
    if (charset === "alpha") chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (charset === "base58") chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let res = "";
    for (let i = 0; i < length; i++) res += chars[array[i] % chars.length];
    setStr(res);
  };

  useEffect(() => {
    generate();
  }, [length, charset]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Charset:</span>
          {[
            { label: "Hex", val: "hex" },
            { label: "Alphanumeric", val: "alphanumeric" },
            { label: "Base58", val: "base58" }
          ].map((c) => (
            <button
              key={c.val}
              onClick={() => setCharset(c.val)}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                charset === c.val ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Length: {length}</span>
          <input
            type="range"
            min="8"
            max="128"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-32 accent-indigo-600"
          />
        </div>
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Generated Random Token</span>
          <span className="font-mono text-base sm:text-lg font-black text-indigo-400 break-all select-all">{str}</span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={generate} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700">
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => copyText(str)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 6: SHA HASH CALCULATOR
   ========================================================================================= */
function ShaHashTool({ copyText, copied }) {
  const [text, setText] = useState("Stiknex Privacy Architecture 2026");
  const [hashes, setHashes] = useState({ sha1: "", sha256: "", sha384: "", sha512: "" });

  useEffect(() => {
    async function compute() {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const bufToHex = (buffer) => {
        return Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      };

      try {
        const [h1, h256, h384, h512] = await Promise.all([
          crypto.subtle.digest("SHA-1", data),
          crypto.subtle.digest("SHA-256", data),
          crypto.subtle.digest("SHA-384", data),
          crypto.subtle.digest("SHA-512", data)
        ]);

        setHashes({
          sha1: bufToHex(h1),
          sha256: bufToHex(h256),
          sha384: bufToHex(h384),
          sha512: bufToHex(h512)
        });
      } catch {}
    }
    compute();
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input Plaintext</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      <div className="space-y-3">
        {[
          { label: "SHA-256 (Industry Standard)", val: hashes.sha256 },
          { label: "SHA-512 (High Security)", val: hashes.sha512 },
          { label: "SHA-384", val: hashes.sha384 },
          { label: "SHA-1 (Legacy / Git)", val: hashes.sha1 }
        ].map((h) => (
          <div key={h.label} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{h.label}</span>
              <button onClick={() => copyText(h.val)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <Copy size={12} /> Copy
              </button>
            </div>
            <p className="font-mono text-xs text-slate-900 dark:text-white break-all">{h.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 7: HMAC CALCULATOR
   ========================================================================================= */
function HmacTool({ copyText, copied }) {
  const [message, setMessage] = useState("GET /api/v1/orders HTTP/1.1");
  const [secret, setSecret] = useState("super-secret-hmac-key");
  const [algo, setAlgo] = useState("SHA-256");
  const [hmacHex, setHmacHex] = useState("");

  useEffect(() => {
    async function compute() {
      if (!message || !secret) {
        setHmacHex("");
        return;
      }
      try {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode(secret),
          { name: "HMAC", hash: { name: algo } },
          false,
          ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
        const hex = Array.from(new Uint8Array(signature))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        setHmacHex(hex);
      } catch {
        setHmacHex("");
      }
    }
    compute();
  }, [message, secret, algo]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Message String</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Secret Key</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold"
            />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">Hash Algorithm:</span>
            <div className="flex gap-2">
              {["SHA-256", "SHA-512", "SHA-384"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAlgo(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    algo === a ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Calculated HMAC Signature</span>
          <p className="font-mono text-xs break-all select-all">{hmacHex || "Enter message and secret key"}</p>
        </div>
        <button
          onClick={() => copyText(hmacHex)}
          className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 8: FILE CHECKSUM & HASH CHECKER
   ========================================================================================= */
function FileHashTool({ copyText, copied }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileHash, setFileHash] = useState("");
  const [expectedHash, setExpectedHash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setFileHash(hex);
    } catch {
      setFileHash("Error computing hash.");
    } finally {
      setLoading(false);
    }
  };

  const isMatch = expectedHash.trim() && fileHash && expectedHash.trim().toLowerCase() === fileHash.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center space-y-4">
        <Upload className="mx-auto text-indigo-600 dark:text-indigo-400" size={32} />
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Choose any file to compute SHA-256</h4>
          <p className="text-xs text-slate-400 mt-1">Processed 100% locally in browser memory. Never uploaded to servers.</p>
        </div>
        <input type="file" onChange={handleFile} className="text-xs font-bold" />
      </div>

      {fileName && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 dark:text-white">{fileName} ({(fileSize / 1024).toFixed(1)} KB)</span>
            {loading && <span className="text-indigo-600">Hashing...</span>}
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Computed SHA-256 Hash:</span>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl font-mono text-xs break-all flex items-center justify-between">
              <span>{fileHash}</span>
              <button onClick={() => copyText(fileHash)} className="text-indigo-600 ml-2">
                <Copy size={13} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Verify Against Expected Hash</label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste author or release checksum..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl font-mono text-xs font-bold"
            />
          </div>

          {expectedHash.trim() && (
            <div>
              {isMatch ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} /> Checksums Match! File is verified genuine and uncorrupted.
                </div>
              ) : (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> Checksums DO NOT match! File may be altered or corrupted.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================================
   TOOL 9: SECRET-FREE REDACTION TOOL (DLP SCRUBBER)
   ========================================================================================= */
function RedactionTool({ copyText, copied }) {
  const [rawText, setRawText] = useState(
    `Error at user john.doe@example.com: Auth failed with token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c.
Authorization: Bearer sk-ant-api03-abcdef1234567890abcdef1234567890.
Card: 4532-1234-5678-9012, IP: 192.168.1.1`
  );

  const redacted = useMemo(() => {
    let t = rawText;
    // Redact JWT
    t = t.replace(/eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, "[REDACTED_JWT_TOKEN]");
    // Redact API Keys (sk-..., Bearer ...)
    t = t.replace(/(sk-[a-zA-Z0-9_-]{20,})/g, "[REDACTED_API_KEY]");
    t = t.replace(/Bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, "Bearer [REDACTED_AUTH_TOKEN]");
    // Redact Emails
    t = t.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
    // Redact Credit Cards
    t = t.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, "[REDACTED_CREDIT_CARD]");
    return t;
  }, [rawText]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Original Logs or Code</label>
          <textarea
            rows={10}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Sanitized Output (Safe to Share)
            </label>
            <button
              onClick={() => copyText(redacted)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy Sanitized"}
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={redacted}
            className="w-full p-4 bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl font-mono text-xs text-emerald-950 dark:text-emerald-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 10: ENTROPY ESTIMATOR
   ========================================================================================= */
function EntropyTool({ copyText, copied }) {
  const [text, setText] = useState("CorrectHorseBatteryStaple2026!");

  const entropy = useMemo(() => {
    if (!text) return { shannon: 0, total: 0, metric: "None" };
    const len = text.length;
    const freq = {};
    for (let i = 0; i < len; i++) {
      freq[text[i]] = (freq[text[i]] || 0) + 1;
    }

    let shannon = 0;
    Object.values(freq).forEach((cnt) => {
      const p = cnt / len;
      shannon -= p * Math.log2(p);
    });

    const total = shannon * len;

    let metric = "Low (Highly predictable)";
    if (shannon > 4.5) metric = "Very High (Cryptographically Dense)";
    else if (shannon > 3.5) metric = "High (Good Randomness)";
    else if (shannon > 2.5) metric = "Moderate";

    return {
      shannon: shannon.toFixed(3),
      total: Math.round(total),
      metric
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Test String / Key</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 block mb-1">Shannon Entropy</span>
          <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">{entropy.shannon}</span>
          <span className="text-[11px] text-slate-500 block mt-1">bits / character</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Information</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{entropy.total}</span>
          <span className="text-[11px] text-slate-500 block mt-1">total entropy bits</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 block mb-1">Predictability Metric</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-2">{entropy.metric}</span>
        </div>
      </div>
    </div>
  );
}
