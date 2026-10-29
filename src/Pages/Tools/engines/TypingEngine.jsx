import { useState, useEffect, useRef, useMemo } from "react";
import { Play, RotateCcw, Award, Zap, Target, BookOpen, Terminal, Sparkles, Volume2, VolumeX, CheckCircle, Flame } from "lucide-react";

export default function TypingEngine({ slug, toolId }) {
  if (slug === "typing-practice-lessons") return <TypingLessons />;
  if (slug === "typing-accuracy-test") return <AccuracyTest />;
  if (slug === "falling-words-game") return <FallingWordsGame />;
  if (slug === "word-rush-game") return <WordRushGame />;
  if (slug === "code-typing-challenge") return <CodeChallenge />;
  if (slug === "keyboard-shortcut-finder") return <KeyboardShortcutFinder />;
  if (slug === "keyboard-key-tester") return <KeyboardTester />;
  if (slug === "typing-error-analyzer") return <ErrorAnalyzer />;
  if (slug === "daily-typing-challenge") return <DailyChallenge />;

  // Default: Typing Speed Test
  return <TypingSpeedTest />;
}

// 1. TYPING SPEED TEST (Flagship Component)
const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog while birds sing high in the morning sky. Practice every single day to dramatically boost your typing speed and overall computer fluency.",
  "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort. Great work takes steady attention and calm focus.",
  "Software development requires clear thinking, patience, and attention to detail. Well structured code is easier to understand, debug, and maintain over the long term.",
  "Focus is a superpower in the modern world. When you silence notifications and immerse yourself in one task, your clarity and speed increase exponentially."
];

export function TypingSpeedTest({ standalone = false }) {
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState("ready"); // ready | running | finished
  const [targetText, setTargetText] = useState(SAMPLE_TEXTS[0]);
  const [inputVal, setInputVal] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef(null);

  // Web Audio click synth
  const playClick = (isError = false) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isError ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(isError ? 150 : 600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const startTest = (timeSec = duration) => {
    const nextText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setTargetText(nextText);
    setInputVal("");
    setMistakes(0);
    setDuration(timeSec);
    setTimeLeft(timeSec);
    setStatus("ready");
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  useEffect(() => {
    let timer = null;
    if (status === "running" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus("finished");
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (status === "finished") return;

    if (status === "ready" && val.length > 0) {
      setStatus("running");
    }

    const lastCharTyped = val[val.length - 1];
    const targetChar = targetText[val.length - 1];
    const isError = lastCharTyped !== targetChar;
    if (isError) setMistakes((m) => m + 1);
    playClick(isError);

    setInputVal(val);
    if (val.length >= targetText.length) {
      setStatus("finished");
    }
  };

  // Metrics
  const timeElapsed = duration - timeLeft || 1;
  const wordsTyped = inputVal.trim().length / 5;
  const wpm = Math.max(0, Math.round((wordsTyped / (timeElapsed / 60))));
  const accuracy = inputVal.length > 0
    ? Math.max(0, Math.round(((inputVal.length - mistakes) / inputVal.length) * 100))
    : 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            {[15, 30, 60, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => startTest(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${duration === sec ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
              >
                {sec}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => startTest(duration)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Live Metrics Header */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-xs text-slate-400 uppercase font-medium">Time Left</span>
            <div className="text-2xl font-bold text-white mt-1">{timeLeft}s</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-xs text-indigo-400 uppercase font-medium">WPM</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{wpm}</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-xs text-emerald-400 uppercase font-medium">Accuracy</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{accuracy}%</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-xs text-amber-400 uppercase font-medium">Errors</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{mistakes}</div>
          </div>
        </div>

        {/* Typing Surface */}
        <div className="bg-slate-950/60 p-6 rounded-xl border border-white/10 font-mono text-lg leading-relaxed select-none relative min-h-[140px]">
          {targetText.split("").map((ch, idx) => {
            let color = "text-slate-500";
            if (idx < inputVal.length) {
              color = inputVal[idx] === ch ? "text-emerald-400" : "text-rose-500 bg-rose-500/20 rounded";
            } else if (idx === inputVal.length) {
              color = "text-white underline decoration-indigo-500 decoration-2 font-bold";
            }
            return <span key={idx} className={color}>{ch}</span>;
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          disabled={status === "finished"}
          placeholder={status === "ready" ? "Start typing to begin test..." : "Keep typing..."}
          className="w-full bg-slate-800 border border-indigo-500/40 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-indigo-400"
        />

        {status === "finished" && (
          <div className="bg-indigo-950/50 border border-indigo-500/40 rounded-xl p-6 text-center space-y-3">
            <Award className="w-10 h-10 text-indigo-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">Test Complete!</h4>
            <p className="text-sm text-slate-300">
              You typed at <span className="text-emerald-400 font-bold text-lg">{wpm} WPM</span> with{" "}
              <span className="text-indigo-400 font-bold text-lg">{accuracy}% accuracy</span>.
            </p>
            <button
              onClick={() => startTest(duration)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition mt-2"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. TYPING LESSONS
function TypingLessons() {
  const LESSONS = [
    { id: 1, title: "Home Row: Index Fingers", keys: "f j ff jj fj jf", desc: "Keep left index on F, right on J." },
    { id: 2, title: "Home Row: Full Row", keys: "asdf jkl; asdf jkl; aadd jjkk fff jjj", desc: "Master all 8 home row rest positions." },
    { id: 3, title: "Top Row: E and I", keys: "de ki fee die kid life idle", desc: "Reach up smoothly with middle fingers." },
    { id: 4, title: "Top Row: R and U", keys: "fr ju fur rug run jug jar", desc: "Index fingers extend upward to R and U." },
    { id: 5, title: "Bottom Row: C and M", keys: "dc jm com mac cam calm claim", desc: "Middle fingers step down lightly." }
  ];

  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [typed, setTyped] = useState("");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Touch Typing Syllabus & Lessons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => { setActiveLesson(l); setTyped(""); }}
              className={`p-3 rounded-xl text-left border transition ${activeLesson.id === l.id ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-800/80"}`}
            >
              <div className="text-xs font-bold text-indigo-400">Lesson {l.id}</div>
              <div className="text-xs font-medium truncate mt-0.5">{l.title}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-950/60 p-6 rounded-xl border border-white/10 space-y-4">
          <div className="text-xs text-slate-400">{activeLesson.desc}</div>
          <div className="font-mono text-xl tracking-wider select-none">
            {activeLesson.keys.split("").map((ch, i) => (
              <span key={i} className={i < typed.length ? (typed[i] === ch ? "text-emerald-400" : "text-rose-500") : i === typed.length ? "underline text-white font-bold" : "text-slate-500"}>
                {ch}
              </span>
            ))}
          </div>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the lesson keys above..."
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// 3. ACCURACY TEST
function AccuracyTest() {
  return <TypingSpeedTest />;
}

// 4. FALLING WORDS GAME
function FallingWordsGame() {
  const WORD_BANK = ["stiknex", "code", "react", "typing", "fast", "logic", "cloud", "focus", "keyboard", "speed", "python", "script", "web", "matrix", "stream"];
  const [activeWords, setActiveWords] = useState([]);
  const [score, setScore] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const newWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
      setActiveWords((prev) => [...prev.slice(-4), { id: Date.now(), text: newWord }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleInput = (e) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(e.target.value);
    const match = activeWords.find((w) => w.text.toLowerCase() === val);
    if (match) {
      setScore((s) => s + val.length * 10);
      setActiveWords((prev) => prev.filter((w) => w.id !== match.id));
      setInputVal("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Falling Words Arcade Game
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-emerald-400">Score: {score}</span>
            <button
              onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) { setScore(0); setActiveWords([]); } }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${isPlaying ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}
            >
              {isPlaying ? "Stop" : "Start Game"}
            </button>
          </div>
        </div>

        <div className="bg-slate-950 h-56 rounded-xl border border-white/10 relative p-4 flex flex-wrap gap-4 items-center justify-center overflow-hidden">
          {isPlaying && activeWords.map((w) => (
            <div key={w.id} className="bg-indigo-600/30 border border-indigo-500/50 px-3 py-1.5 rounded-lg font-mono text-white text-sm shadow animate-pulse">
              {w.text}
            </div>
          ))}
          {!isPlaying && <span className="text-slate-500 text-sm">Click 'Start Game' and type the falling words before they vanish!</span>}
        </div>

        <input
          disabled={!isPlaying}
          type="text"
          value={inputVal}
          onChange={handleInput}
          placeholder={isPlaying ? "Type matched word and press space..." : "Press Start Game"}
          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
        />
      </div>
    </div>
  );
}

// 5. WORD RUSH GAME
function WordRushGame() {
  return <FallingWordsGame />;
}

// 6. CODE CHALLENGE
function CodeChallenge() {
  const CODE_SNIPPETS = [
    "const add = (a, b) => a + b;",
    "function debounce(fn, ms) { return (...args) => clearTimeout(id); }",
    "SELECT users.id, users.name FROM users WHERE active = true;",
    "for (let i = 0; i < array.length; i++) { console.log(array[i]); }"
  ];
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typed, setTyped] = useState("");

  const target = CODE_SNIPPETS[snippetIndex];
  const isComplete = typed === target;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" /> Developer Code Typing Challenge
          </h3>
          <button
            onClick={() => { setSnippetIndex((s) => (s + 1) % CODE_SNIPPETS.length); setTyped(""); }}
            className="text-xs text-indigo-400 hover:text-white"
          >
            Next Snippet
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-sm leading-relaxed">
          {target.split("").map((ch, i) => (
            <span key={i} className={i < typed.length ? (typed[i] === ch ? "text-emerald-400" : "text-rose-500") : i === typed.length ? "underline text-white font-bold" : "text-slate-500"}>
              {ch}
            </span>
          ))}
        </div>

        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Type the exact code syntax above..."
          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm"
        />

        {isComplete && (
          <div className="text-center text-emerald-400 font-semibold text-sm">
            🎉 Snippet finished! Great syntax precision!
          </div>
        )}
      </div>
    </div>
  );
}

// 7. KEYBOARD SHORTCUT FINDER
function KeyboardShortcutFinder() {
  const [query, setQuery] = useState("");
  const SHORTCUTS = [
    { app: "VS Code", action: "Command Palette", keys: "Ctrl + Shift + P" },
    { app: "VS Code", action: "Quick Open File", keys: "Ctrl + P" },
    { app: "VS Code", action: "Toggle Terminal", keys: "Ctrl + `" },
    { app: "VS Code", action: "Multi-cursor line add", keys: "Alt + Click" },
    { app: "Chrome", action: "Reopen closed tab", keys: "Ctrl + Shift + T" },
    { app: "Chrome", action: "DevTools Inspector", keys: "Ctrl + Shift + I / F12" },
    { app: "Windows", action: "Clipboard history", keys: "Win + V" },
    { app: "Windows", action: "Screen capture area", keys: "Win + Shift + S" }
  ];

  const filtered = SHORTCUTS.filter(s => s.action.toLowerCase().includes(query.toLowerCase()) || s.app.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Keyboard Shortcut Finder & Cheat Sheet</h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by app or action (e.g. terminal, chrome, tabs)..."
          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((s, i) => (
            <div key={i} className="bg-slate-800/80 p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 font-semibold block">{s.app}</span>
                <span className="text-sm font-medium text-white">{s.action}</span>
              </div>
              <span className="bg-slate-900 px-2.5 py-1 rounded text-xs font-mono font-bold text-slate-300 border border-white/10">
                {s.keys}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. KEYBOARD KEY TESTER
function KeyboardTester() {
  const [pressedKey, setPressedKey] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleDown = (e) => {
      setPressedKey({ key: e.key, code: e.code, which: e.which });
      setHistory((prev) => [e.code, ...prev.slice(0, 9)]);
    };
    window.addEventListener("keydown", handleDown);
    return () => window.removeEventListener("keydown", handleDown);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <h3 className="text-lg font-semibold text-white">Interactive Keyboard Key Tester</h3>
        <p className="text-xs text-slate-400">Press any key on your physical keyboard to test its switch and signal.</p>

        {pressedKey ? (
          <div className="bg-slate-800/80 border border-indigo-500/40 rounded-xl p-6 inline-block min-w-[280px]">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Active Key</span>
            <div className="text-4xl font-black text-white mt-1 font-mono">{pressedKey.key === " " ? "Space" : pressedKey.key}</div>
            <div className="text-xs text-slate-400 mt-2 font-mono">Code: {pressedKey.code} | KeyCode: {pressedKey.which}</div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-white/10 rounded-xl text-slate-500">
            Press any key on your keyboard...
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <span className="text-xs text-slate-400 block mb-2">Recent Keys Registered:</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {history.map((c, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-800 rounded font-mono text-xs text-slate-300 border border-white/5">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. TYPING ERROR ANALYZER
function ErrorAnalyzer() {
  return <TypingSpeedTest />;
}

// 10. DAILY TYPING CHALLENGE
function DailyChallenge() {
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
        <Flame className="w-4 h-4 text-amber-400" /> Daily Challenge for {today}
      </div>
      <TypingSpeedTest />
    </div>
  );
}
