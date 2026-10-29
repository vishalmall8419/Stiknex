import { useState, useMemo, useEffect } from "react";
import { Copy, Check, Shield, Key, Lock, Hash, Shuffle, RefreshCw, EyeOff, Zap } from "lucide-react";
import PasswordGenerator from "../PasswordGenerator/PasswordGenerator";

export default function SecurityEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "password-generator" || toolId === "password-generator") {
    return <PasswordGenerator />;
  }
  if (slug === "password-strength-checker") return <PasswordStrengthTool copyText={copyText} copied={copied} />;
  if (slug === "passphrase-generator") return <PassphraseTool copyText={copyText} copied={copied} />;
  if (slug === "random-number-generator") return <RandomNumberTool copyText={copyText} copied={copied} />;
  if (slug === "random-string-generator") return <RandomStringTool copyText={copyText} copied={copied} />;
  if (slug === "sha-hash-calculator") return <ShaHashTool copyText={copyText} copied={copied} />;
  if (slug === "hmac-calculator") return <HmacTool copyText={copyText} copied={copied} />;
  if (slug === "file-hash-checker") return <FileHashTool copyText={copyText} copied={copied} />;
  if (slug === "secret-free-redaction-tool") return <RedactionTool copyText={copyText} copied={copied} />;
  if (slug === "entropy-estimator") return <EntropyTool copyText={copyText} copied={copied} />;

  return <PasswordGenerator />;
}

// ============================================================================
// BIG TOOL: PASSWORD STRENGTH CHECKER
// ============================================================================
function PasswordStrengthTool({ copyText, copied }) {
  const [pwd, setPwd] = useState("CorrectHorseBatteryStaple2026!");

  const analysis = useMemo(() => {
    if (!pwd) return { score: 0, entropy: 0, crackTime: "Instant", feedback: "Enter a password" };

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
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    let crackTime = "Instant";
    if (entropy > 80) crackTime = "Centuries";
    else if (entropy > 60) crackTime = "Several Years";
    else if (entropy > 45) crackTime = "A Few Months";
    else if (entropy > 30) crackTime = "Hours to Days";

    return {
      entropy,
      score: Math.min(score, 5),
      crackTime,
      hasLength: pwd.length >= 12,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[^a-zA-Z0-9]/.test(pwd)
    };
  }, [pwd]);

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong", "Military Grade"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Test Password</label>
        <input
          type="text"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xl font-bold"
        />
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-indigo-400">Security Score</span>
          <span className="text-lg font-black text-white">{strengthLabels[analysis.score]}</span>
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
                    : "bg-amber-500"
                  : "bg-slate-800"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Bits of Entropy</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">{analysis.entropy} bits</span>
          </div>
          <div>
            <span className="text-slate-400 block">Estimated Crack Time</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{analysis.crackTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Length</span>
            <span className="text-xl font-bold text-white mt-1 block">{pwd.length} chars</span>
          </div>
          <div>
            <span className="text-slate-400 block">Special Symbols</span>
            <span className="text-xl font-bold text-white mt-1 block">{analysis.hasSymbol ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: PASSPHRASE GENERATOR
// ============================================================================
function PassphraseTool({ copyText, copied }) {
  const [wordCount, setWordCount] = useState(4);
  const [delimiter, setDelimiter] = useState("-");

  const wordBank = [
    "correct", "horse", "battery", "staple", "galaxy", "rocket", "forest", "mountain", "falcon", "winter",
    "whisper", "crystal", "silver", "planet", "timber", "shield", "beacon", "voyage", "summit", "canyon",
    "breeze", "anchor", "shadow", "cobalt", "harbor", "matrix", "stream", "orbit", "cipher", "puzzle"
  ];

  const passphrase = useMemo(() => {
    const selected = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = crypto.getRandomValues(new Uint32Array(1))[0] % wordBank.length;
      selected.push(wordBank[idx]);
    }
    return selected.join(delimiter);
  }, [wordCount, delimiter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Words:</span>
          {[3, 4, 5, 6].map((c) => (
            <button
              key={c}
              onClick={() => setWordCount(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${wordCount === c ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700"}`}
            >
              {c} Words
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Delimiter:</span>
          {["-", ".", "_", " "].map((d) => (
            <button
              key={d}
              onClick={() => setDelimiter(d)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${delimiter === d ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700"}`}
            >
              '{d === " " ? "space" : d}'
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase text-indigo-200 block mb-1">Generated Passphrase</span>
          <div className="text-2xl sm:text-3xl font-mono font-black break-all">{passphrase}</div>
        </div>
        <button onClick={() => copyText(passphrase)} className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow flex items-center gap-2 shrink-0">
          <Copy size={16} /> Copy
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: SHA HASH CALCULATOR
// ============================================================================
function ShaHashTool({ copyText, copied }) {
  const [text, setText] = useState("Stiknex Free Utility Suite");
  const [sha1, setSha1] = useState("");
  const [sha256, setSha256] = useState("");
  const [sha512, setSha512] = useState("");

  useEffect(() => {
    const compute = async () => {
      const enc = new TextEncoder().encode(text);

      const buf256 = await crypto.subtle.digest("SHA-256", enc);
      setSha256(Array.from(new Uint8Array(buf256)).map((b) => b.toString(16).padStart(2, "0")).join(""));

      const buf512 = await crypto.subtle.digest("SHA-512", enc);
      setSha512(Array.from(new Uint8Array(buf512)).map((b) => b.toString(16).padStart(2, "0")).join(""));

      try {
        const buf1 = await crypto.subtle.digest("SHA-1", enc);
        setSha1(Array.from(new Uint8Array(buf1)).map((b) => b.toString(16).padStart(2, "0")).join(""));
      } catch (_) {}
    };
    compute();
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input String</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border rounded-2xl font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        {[
          { name: "SHA-256 (Recommended)", val: sha256 },
          { name: "SHA-512 (High Security)", val: sha512 },
          { name: "SHA-1 (Legacy)", val: sha1 }
        ].map((item, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase">{item.name}</span>
              <button onClick={() => copyText(item.val)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <Copy size={13} /> Copy Hash
              </button>
            </div>
            <p className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helpers for remaining tools
function RandomNumberTool({ copyText }) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [nums, setNums] = useState([42]);

  const roll = () => {
    const list = Array.from({ length: count }, () => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return min + (arr[0] % (max - min + 1));
    });
    setNums(list);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} placeholder="Min" className="p-3 border rounded-xl font-bold" />
        <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} placeholder="Max" className="p-3 border rounded-xl font-bold" />
        <button onClick={roll} className="bg-indigo-600 text-white font-bold rounded-xl shadow">Roll RNG</button>
      </div>
      <div className="p-8 bg-indigo-600 text-white rounded-3xl text-center">
        <span className="text-5xl font-black">{nums.join(", ")}</span>
      </div>
    </div>
  );
}

function RandomStringTool({ copyText }) {
  const [len, setLen] = useState(32);
  const [str, setStr] = useState("a8b7c6d5e4f3210fedcba9876543210f");

  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    setStr(Array.from(arr).map((b) => chars[b % chars.length]).join(""));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input type="number" value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-24 p-3 border rounded-xl font-bold" />
        <button onClick={generate} className="px-6 bg-indigo-600 text-white font-bold rounded-xl shadow">Generate</button>
      </div>
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-mono text-sm">
        <span className="break-all">{str}</span>
        <button onClick={() => copyText(str)} className="ml-4 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold shrink-0">
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
}

function HmacTool({ copyText }) {
  const [msg, setMsg] = useState("message payload");
  const [secret, setSecret] = useState("secret-key-123");
  const [hmac, setHmac] = useState("");

  useEffect(() => {
    const calc = async () => {
      try {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
        const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
        setHmac(Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join(""));
      } catch (_) {}
    };
    calc();
  }, [msg, secret]);

  return (
    <div className="space-y-6">
      <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message" className="w-full p-3 border rounded-xl font-bold" />
      <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Secret Key" className="w-full p-3 border rounded-xl font-bold" />
      <div className="p-6 bg-indigo-600 text-white rounded-2xl flex items-center justify-between font-mono text-xs">
        <span className="break-all">{hmac}</span>
        <button onClick={() => copyText(hmac)} className="ml-4 px-4 py-2 bg-white text-indigo-700 font-bold rounded-xl">Copy</button>
      </div>
    </div>
  );
}

function FileHashTool() {
  const [hash, setHash] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    setHash(Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join(""));
  };

  return (
    <div className="space-y-6 text-center">
      <div className="p-8 border-2 border-dashed rounded-3xl bg-slate-50 relative">
        <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold">Choose Any File to Compute SHA-256 Checksum</h4>
      </div>
      {hash && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl text-left font-mono text-xs break-all">
          <span className="text-slate-400 block mb-1">{fileName}</span>
          <span className="text-emerald-400">{hash}</span>
        </div>
      )}
    </div>
  );
}

function RedactionTool({ copyText }) {
  const [text, setText] = useState("Contact me at user@stiknex.site or call 555-123-4567. Key: sk_live_987654321.");
  const redacted = useMemo(() => {
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED EMAIL]")
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[REDACTED PHONE]")
      .replace(/sk_[a-zA-Z0-9_]+/g, "[REDACTED SECRET]");
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="w-full p-4 border rounded-2xl" />
      <div className="p-6 bg-slate-900 text-white rounded-2xl font-mono text-sm break-all">
        {redacted}
      </div>
    </div>
  );
}

function EntropyTool() {
  const [str, setStr] = useState("correct-horse-battery-staple");
  const entropy = useMemo(() => {
    const len = str.length;
    if (len === 0) return 0;
    const freq = {};
    for (const c of str) freq[c] = (freq[c] || 0) + 1;
    let sum = 0;
    for (const c in freq) {
      const p = freq[c] / len;
      sum -= p * Math.log2(p);
    }
    return Number(sum.toFixed(3));
  }, [str]);

  return (
    <div className="space-y-6">
      <input type="text" value={str} onChange={(e) => setStr(e.target.value)} className="w-full p-3 border rounded-xl font-bold" />
      <div className="p-8 bg-indigo-600 text-white rounded-3xl text-center">
        <span className="text-4xl font-black">{entropy} bits/char</span>
      </div>
    </div>
  );
}
