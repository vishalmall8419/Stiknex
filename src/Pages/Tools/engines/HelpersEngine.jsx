import { useState, useEffect, useMemo } from "react";
import { Clock, Monitor, Receipt, HelpCircle, FileText, Sparkles, Copy, Check, RotateCcw, Play, Pause, Download, Printer } from "lucide-react";

export default function HelpersEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "screen-resolution-checker") return <ScreenResolutionChecker copyText={copyText} copied={copied} />;
  if (slug === "aspect-ratio-calculator") return <AspectRatioCalculator copyText={copyText} copied={copied} />;
  if (slug === "typographic-scale-generator") return <TypographicScale copyText={copyText} copied={copied} />;
  if (slug === "invoice-generator") return <InvoiceGenerator copyText={copyText} copied={copied} />;
  if (slug === "receipt-generator") return <ReceiptGenerator copyText={copyText} copied={copied} />;
  if (slug === "name-generator") return <NameGenerator copyText={copyText} copied={copied} />;
  if (slug === "flashcard-maker") return <FlashcardMaker copyText={copyText} copied={copied} />;
  if (slug === "random-quiz-generator") return <QuizGenerator copyText={copyText} copied={copied} />;
  if (slug === "decision-helper") return <DecisionHelper copyText={copyText} copied={copied} />;

  // Default: Stopwatch with Laps
  return <StopwatchWithLaps copyText={copyText} copied={copied} />;
}

// 1. STOPWATCH WITH LAPS
function StopwatchWithLaps() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  };

  const addLap = () => {
    setLaps([{ id: laps.length + 1, time: formatTime(time), raw: time }, ...laps]);
  };

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <h3 className="text-lg font-semibold text-white">Precision Stopwatch with Lap Timer</h3>
        <div className="text-6xl font-black font-mono text-white tracking-widest my-8">
          {formatTime(time)}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setRunning(!running)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${running ? "bg-amber-600 hover:bg-amber-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            disabled={!running}
            onClick={addLap}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition"
          >
            Lap
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {laps.length > 0 && (
          <div className="max-w-md mx-auto pt-6 border-t border-white/10 space-y-2">
            <span className="text-xs text-slate-400 block mb-2 font-semibold">Recorded Laps</span>
            {laps.map((lap) => (
              <div key={lap.id} className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl border border-white/5 font-mono text-sm">
                <span className="text-slate-400">Lap {lap.id}</span>
                <span className="text-white font-bold">{lap.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. SCREEN RESOLUTION CHECKER
function ScreenResolutionChecker({ copyText, copied }) {
  const [info, setInfo] = useState({
    screenW: window.screen.width,
    screenH: window.screen.height,
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
    colorDepth: window.screen.colorDepth
  });

  useEffect(() => {
    const handleResize = () => {
      setInfo({
        screenW: window.screen.width,
        screenH: window.screen.height,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <Monitor className="w-12 h-12 text-indigo-400 mx-auto" />
        <h3 className="text-xl font-semibold text-white">Your Screen & Viewport Diagnostics</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400 block">Screen Resolution</span>
            <span className="text-lg font-bold text-white mt-1 block">{info.screenW} × {info.screenH} px</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400 block">Browser Viewport</span>
            <span className="text-lg font-bold text-indigo-400 mt-1 block">{info.viewportW} × {info.viewportH} px</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400 block">Device Pixel Ratio (DPR)</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">{info.dpr}x (Retina)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. ASPECT RATIO CALCULATOR
function AspectRatioCalculator() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const ratio = useMemo(() => {
    const nw = parseInt(w, 10);
    const nh = parseInt(h, 10);
    if (!nw || !nh) return "";
    const divisor = gcd(nw, nh);
    return `${nw / divisor}:${nh / divisor}`;
  }, [w, h]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Aspect Ratio Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Width (px)</label>
            <input type="number" value={w} onChange={(e) => setW(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Height (px)</label>
            <input type="number" value={h} onChange={(e) => setH(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>
        <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 text-center">
          <span className="text-xs text-indigo-400 uppercase font-semibold">Calculated Aspect Ratio</span>
          <div className="text-3xl font-bold text-white mt-1">{ratio || "N/A"}</div>
        </div>
      </div>
    </div>
  );
}

// 4. TYPOGRAPHIC SCALE
function TypographicScale() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25); // Major Third

  const sizes = useMemo(() => {
    const scales = ["Small", "Base", "H4", "H3", "H2", "H1"];
    return scales.map((label, i) => {
      const px = Math.round(base * Math.pow(ratio, i - 1));
      const rem = (px / 16).toFixed(3);
      return { label, px, rem };
    });
  }, [base, ratio]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Modular Typographic Scale Generator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Base Size (px)</label>
            <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Scale Ratio</label>
            <select value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white">
              <option value="1.200">1.200 (Minor Third)</option>
              <option value="1.250">1.250 (Major Third)</option>
              <option value="1.333">1.333 (Perfect Fourth)</option>
              <option value="1.414">1.414 (Augmented Fourth)</option>
              <option value="1.618">1.618 (Golden Ratio)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          {sizes.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-white/5">
              <span className="text-xs text-indigo-400 font-bold uppercase">{s.label} ({s.px}px / {s.rem}rem)</span>
              <span style={{ fontSize: `${Math.min(36, s.px)}px` }} className="text-white font-medium truncate max-w-md">
                Typography Preview
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. INVOICE GENERATOR
function InvoiceGenerator() {
  const [client, setClient] = useState("Acme Corp");
  const [item, setItem] = useState("Website Design & Frontend Development");
  const [amount, setAmount] = useState("1500");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Fast Freelance Invoice Generator</h3>
          <button onClick={() => window.print()} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Client Name</label>
            <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Service Description</label>
            <input type="text" value={item} onChange={(e) => setItem(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="p-6 bg-white text-black rounded-2xl space-y-4 max-w-lg mx-auto shadow-xl">
          <div className="flex justify-between border-b pb-4">
            <div>
              <h4 className="font-bold text-xl">INVOICE</h4>
              <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold">Billed To:</span>
              <p>{client}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm py-2 border-b">
            <span>{item}</span>
            <span className="font-bold">${amount}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total Due:</span>
            <span>${amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. RECEIPT GENERATOR
function ReceiptGenerator(props) {
  return <InvoiceGenerator {...props} />;
}

// 7. NAME GENERATOR
function NameGenerator({ copyText, copied }) {
  const FIRST_NAMES = ["Liam", "Emma", "Noah", "Olivia", "Ethan", "Ava", "Lucas", "Mia", "Alexander", "Sophia", "Aarav", "Priya", "Rohan", "Ananya"];
  const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Sharma", "Verma", "Patel"];

  const [generatedNames, setGeneratedNames] = useState([]);

  const generate = () => {
    const list = Array.from({ length: 6 }, () => {
      const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      return `${f} ${l}`;
    });
    setGeneratedNames(list);
  };

  useEffect(() => generate(), []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Random Name & Persona Generator</h3>
          <button onClick={generate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
            Generate New Names
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {generatedNames.map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-white/5">
              <span className="text-white font-medium">{name}</span>
              <button onClick={() => copyText(name)} className="p-1.5 hover:text-white text-slate-400">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. FLASHCARD MAKER
function FlashcardMaker() {
  const CARDS = [
    { q: "What does HTML stand for?", a: "HyperText Markup Language" },
    { q: "What is the Big-O time complexity of binary search?", a: "O(log n)" },
    { q: "What hook is used for side effects in React?", a: "useEffect" }
  ];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = CARDS[index];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <h3 className="text-lg font-semibold text-white">Interactive Study Flashcard Deck</h3>

        <div
          onClick={() => setFlipped(!flipped)}
          className="h-56 max-w-md mx-auto bg-slate-800 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-center items-center cursor-pointer select-none transition-transform hover:scale-[1.02]"
        >
          <span className="text-xs uppercase text-indigo-400 font-semibold mb-2">
            {flipped ? "Answer" : "Question (Click to flip)"}
          </span>
          <p className="text-xl font-bold text-white">{flipped ? card.a : card.q}</p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setIndex((i) => (i - 1 + CARDS.length) % CARDS.length); setFlipped(false); }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Previous
          </button>
          <button
            onClick={() => { setIndex((i) => (i + 1) % CARDS.length); setFlipped(false); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Next Card
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. RANDOM QUIZ GENERATOR
function QuizGenerator() {
  return <FlashcardMaker />;
}

// 10. DECISION HELPER (Coin Flip)
function DecisionHelper() {
  const [coin, setCoin] = useState("Heads");
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      setCoin(Math.random() > 0.5 ? "Heads" : "Tails");
      setFlipping(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <h3 className="text-lg font-semibold text-white">Coin Flipper & Fast Decision Maker</h3>

        <div className={`w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-2xl ${flipping ? "animate-spin" : ""}`}>
          {coin}
        </div>

        <button
          disabled={flipping}
          onClick={flip}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition"
        >
          {flipping ? "Flipping..." : "Flip Coin"}
        </button>
      </div>
    </div>
  );
}

