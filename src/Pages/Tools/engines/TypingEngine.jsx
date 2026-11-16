import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Type,
  Quote,
  Mountain,
  Feather,
  Wrench,
  Globe,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Menu,
  X,
  Award,
  Zap,
  Target,
  BookOpen,
  Terminal,
  Flame,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Gamepad2,
  Keyboard,
  Share2,
  RefreshCw,
  Trophy,
  BarChart2,
  Lock,
  Unlock,
  Play,
  Pause,
  ChevronDown,
  Layers,
  Sliders,
  Compass,
  Search,
  Code2,
  FileCode,
  Crown
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import TypingDeepAnalytics from "../components/TypingDeepAnalytics";
import TypingLeaderboard from "../components/TypingLeaderboard";
import { TYPING_LESSONS, TYPING_STAGES } from "../../../data/typingLessonsData";
import { CODE_LANGUAGES, getSnippetsForLanguage } from "../../../data/codingLanguagesData";

/**
 * Stiknex Typing Master — Flagship Biomechanical Typing Academy & Speed Studio
 * 100% Client-Side • Synthesized Web Audio API Key Audio • Distinctive Stiknex Cyber Studio UI
 *
 * Core Suites:
 * 1. Precision Speed Studio (Time, Words, Quotes & Zen with @ Punctuation & # Numbers)
 * 2. 50 Progressive Touch Typing Lessons with Strict Unlock Progression (>=90% accuracy required)
 * 3. Arcade Typing Games (Falling Words Matrix & 60-Second Word Rush Sprint)
 * 4. Developer Code Studio (Real JavaScript, Python, React, SQL & HTML/CSS syntax)
 * 5. High-Stakes Accuracy Benchmark (Unbroken word streak tracking)
 * 6. Interactive Mechanical Keyboard Key Switch Tester & Diagnostics
 * 7. Developer & OS Shortcuts Cheat Sheet Directory
 */

// 250 Common English Words
const VOCABULARY_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
  "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
  "this", "we", "you", "do", "but", "his", "from", "they", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
  "what", "so", "up", "out", "if", "about", "who", "get", "which", "go",
  "me", "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could", "them", "see",
  "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well",
  "way", "even", "new", "want", "because", "any", "these", "give", "day", "most",
  "us", "any", "run", "here", "very", "how", "long", "course", "and", "they",
  "nation", "if", "about", "old", "follow", "develop", "you", "become", "new", "people",
  "problem", "need", "plan", "point", "ask", "go", "will", "also", "too", "right",
  "great", "call", "came", "each", "find", "water", "world", "still", "small", "house",
  "show", "life", "place", "part", "live", "where", "after", "back", "little", "only",
  "round", "man", "year", "came", "show", "every", "good", "me", "give", "our",
  "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say",
  "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move",
  "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want",
  "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand",
  "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high",
  "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind",
  "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother",
  "world", "near", "build", "self", "earth", "father", "head", "stand", "own", "page",
  "should", "country", "found", "answer", "school", "grow", "study", "still", "learn", "plant"
];

// Curated Literature, History & Philosophy Quotes
const CURATED_QUOTES = [
  // SHORT (< 100 chars)
  { text: "Simplicity is a prerequisite for reliability and long-term maintainability.", author: "Edsger W. Dijkstra", length: "short" },
  { text: "Talk is cheap. Show me the clean, well-tested code.", author: "Software Engineering Maxim", length: "short" },
  { text: "Make it work, make it right, and then make it fast.", author: "Kent Beck", length: "short" },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", length: "short" },
  { text: "First solve the underlying problem. Then, write the architecture.", author: "John Johnson", length: "short" },
  { text: "Truth in software can ultimately be found in one place: the executable code itself.", author: "Clean Code Principles", length: "short" },
  { text: "Stay hungry, stay foolish. Never settle for ordinary.", author: "Steve Jobs", length: "short" },

  // MEDIUM (100 - 250 chars)
  { text: "It is those who possess wisdom who are the greatest fools. History has shown us this. You could say that this is the final warning from God to those who resist.", author: "Philosophical Maxim", length: "medium" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson, Structure and Interpretation of Computer Programs", length: "medium" },
  { text: "Any programmer can write code that a compiler understands. Master engineers write code that teammates understand.", author: "Martin Fowler", length: "medium" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", length: "medium" },
  { text: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex tasks into small manageable tasks.", author: "Mark Twain", length: "medium" },
  { text: "Technology reaches its highest state when it empowers human creativity with zero friction and uncompromised privacy.", author: "Stiknex Engineering Manifesto", length: "medium" },

  // LONG (250 - 450 chars)
  { text: "The future belongs to those who believe in the beauty of their dreams. It does not matter how slowly you go as long as you do not stop. Success is not final, failure is not fatal: it is the courage to continue that counts in the grand arc of history.", author: "Eleanor Roosevelt & Winston Churchill", length: "long" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. Do not go where the path may lead, go instead where there is no path and leave a trail for those who follow in your footsteps.", author: "Ralph Waldo Emerson", length: "long" },
  { text: "Real software engineering is not about typing fast syntax into a dark screen; it is about managing cognitive complexity, building resilient distributed systems, and crafting readable logic that endures decades of maintenance without breaking.", author: "Software Architecture Principles", length: "long" },

  // THICC (450+ chars)
  { text: "Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives. The aggregate of our joy and suffering, thousands of confident religions, ideologies, and economic doctrines, every hunter and forager, every hero and coward, every creator and destroyer of civilization, every king and peasant, every young couple in love lived there on a mote of dust suspended in a sunbeam.", author: "Carl Sagan, Pale Blue Dot", length: "thicc" },
  { text: "It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood; who strives valiantly; who errs, who comes short again and again, because there is no effort without error and shortcoming; but who does actually strive to do the deeds; who knows great enthusiasms, the great devotions; who spends himself in a worthy cause.", author: "Theodore Roosevelt, Citizen in a Republic", length: "thicc" }
];

// 50+ Real Developer Code Snippets (Imported from codingLanguagesData)
const CODE_SNIPPETS = CODE_LANGUAGES;

// Keyboard Shortcuts Directory
const SHORTCUTS_DATA = [
  { cat: "VS Code", action: "Command Palette", keys: "Ctrl + Shift + P", mac: "Cmd + Shift + P" },
  { cat: "VS Code", action: "Quick Open File", keys: "Ctrl + P", mac: "Cmd + P" },
  { cat: "VS Code", action: "Toggle Integrated Terminal", keys: "Ctrl + `", mac: "Ctrl + `" },
  { cat: "VS Code", action: "Multi-cursor line insertion", keys: "Alt + Click", mac: "Option + Click" },
  { cat: "VS Code", action: "Format Code Document", keys: "Shift + Alt + F", mac: "Shift + Option + F" },
  { cat: "Chrome", action: "Reopen closed tab", keys: "Ctrl + Shift + T", mac: "Cmd + Shift + T" },
  { cat: "Chrome", action: "DevTools Elements Inspector", keys: "F12 / Ctrl + Shift + I", mac: "Cmd + Option + I" },
  { cat: "Chrome", action: "Hard Reload & Cache Clear", keys: "Ctrl + Shift + R", mac: "Cmd + Shift + R" },
  { cat: "Windows", action: "Clipboard History Tape", keys: "Win + V", mac: "Third-party utility" },
  { cat: "Windows", action: "Precision Screen Snip", keys: "Win + Shift + S", mac: "Cmd + Shift + 4" },
  { cat: "Figma", action: "Auto Layout Frame", keys: "Shift + A", mac: "Shift + A" },
  { cat: "Git", action: "Quick Commit Message", keys: "git commit -m 'feat'", mac: "git commit -m 'feat'" }
];

// Related Tools for Universal Drawer
const RELATED_TOOLS = [
  { slug: "stiknex-typing", title: "Stiknex Typing Master", icon: "fa-solid fa-keyboard", desc: "Flagship 50-lesson typing academy, speed studio, and arcade games" },
  { slug: "word-counter", title: "Word & Character Counter", icon: "fa-solid fa-file-lines", desc: "Real-time character, syllable, and reading time counter" },
  { slug: "sticky-notes", title: "Sticky Notes Board", icon: "fa-solid fa-note-sticky", desc: "Infinite canvas for organizing and color-coding notes" },
  { slug: "online-notebook", title: "Online Notebook", icon: "fa-solid fa-book", desc: "Distraction-free rich-text notepad with snapshot history" }
];

// Web Audio API Synthesized Mechanical Key Switch Click Generator
function playSynthesizedKeySound(audioCtx, type = "key", soundEnabled = true, soundProfile = "thock") {
  if (!soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === "space") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.07);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(230, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } else {
      if (soundProfile === "clicky") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(920, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.035);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(115, t + 0.045);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      }
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  } catch {}
}

/**
 * =========================================================================================
 * MAIN EXPORT: STIKNEX TYPING MASTER
 * =========================================================================================
 */
export default function TypingEngine({ slug = "stiknex-typing", toolId = "stiknex-typing", tool, seoData }) {
  const { theme, toggleTheme, user, openAuthModal } = useAppContext();

  // Primary Mode Selector: 'speed' | 'lessons' | 'games' | 'code' | 'accuracy' | 'key-test' | 'shortcuts'
  const initialMode = useMemo(() => {
    if (slug === "typing-practice-lessons") return "lessons";
    if (slug === "falling-words-game" || slug === "word-rush-game") return "games";
    if (slug === "code-typing-challenge") return "code";
    if (slug === "typing-accuracy-test") return "accuracy";
    if (slug === "keyboard-key-tester") return "key-test";
    if (slug === "keyboard-shortcut-finder") return "shortcuts";
    return "speed";
  }, [slug]);

  const [activeMode, setActiveMode] = useState(initialMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [curriculumDrawerOpen, setCurriculumDrawerOpen] = useState(false);
  const [mobileModesOpen, setMobileModesOpen] = useState(false);

  // Sound Profile State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundProfile, setSoundProfile] = useState("thock"); // 'thock' | 'clicky'

  // Persistent Unlocked Lesson (Strict: requires >= 90% accuracy)
  const [unlockedLessonId, setUnlockedLessonId] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_typing_unlocked_lesson");
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  // Active Lesson in Lessons Mode
  const [currentLessonId, setCurrentLessonId] = useState(unlockedLessonId);

  // Speed Mode Settings (Shared between top toolbar and speed runner)
  const [speedSubMode, setSpeedSubMode] = useState("time"); // 'time' | 'words' | 'quote' | 'zen'
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [quoteLength, setQuoteLength] = useState("medium");
  const [hasPunctuation, setHasPunctuation] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [speedResetSignal, setSpeedResetSignal] = useState(0);

  // Distraction-Free Focus State (options fade away when typing begins)
  const [isTypingActive, setIsTypingActive] = useState(false);

  // Code Mode Language Setting
  const [codeLang, setCodeLang] = useState("JavaScript");
  const [codePickerOpen, setCodePickerOpen] = useState(false);

  // Arcade Game Mode Setting
  const [arcadeGame, setArcadeGame] = useState("falling"); // 'falling' | 'rush'

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    } catch {}
  }, []);

  const handleLessonPassed = (passedLessonId, accuracy, wpm) => {
    try {
      const nextId = passedLessonId + 1;
      if (nextId <= 50 && nextId > unlockedLessonId) {
        setUnlockedLessonId(nextId);
        localStorage.setItem("stiknex_typing_unlocked_lesson", nextId.toString());
      }
      const scores = JSON.parse(localStorage.getItem("stiknex_typing_lesson_scores") || "{}");
      scores[passedLessonId] = {
        accuracy,
        wpm,
        timestamp: Date.now()
      };
      localStorage.setItem("stiknex_typing_lesson_scores", JSON.stringify(scores));
    } catch {}
  };

  const playClickSound = useCallback((type = "key") => {
    playSynthesizedKeySound(audioCtxRef.current, type, soundEnabled, soundProfile);
  }, [soundEnabled, soundProfile]);

  const activeLessonData = useMemo(() => {
    return TYPING_LESSONS.find((l) => l.id === currentLessonId) || TYPING_LESSONS[0];
  }, [currentLessonId]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 select-none ${
        theme === "dark" ? "bg-[#18181b] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          theme === "dark" ? "bg-[#18181b]/95 border-slate-800" : "bg-white/95 border-slate-200 shadow-2xs"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: Menu & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                theme === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Open Tools Directory"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm shadow-md shadow-amber-500/20 shrink-0">
                <Keyboard size={18} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
                  Stiknex <span className="text-amber-500 font-extrabold">Typing Master</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  50 Lessons
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Engine Pulse Status */}
          <div className="hidden md:flex items-center text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Stiknex Biomechanical Engine • 0ms Lag
            </span>
          </div>

          {/* Right: Sound, Mobile Mode Switcher & Theme */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Profile Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200 dark:border-slate-700/60">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute Keyboard Audio" : "Enable Keyboard Audio"}
                className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  soundEnabled ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              {soundEnabled && (
                <button
                  onClick={() => setSoundProfile(soundProfile === "thock" ? "clicky" : "thock")}
                  title={`Switch profile: ${soundProfile === "thock" ? "Linear Thock" : "Tactile Click"}. Click to toggle.`}
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-amber-500 transition cursor-pointer"
                >
                  {soundProfile === "thock" ? "Thock" : "Clicky"}
                </button>
              )}
            </div>

            {/* Mobile Mode Switcher Trigger (Only on small screens) */}
            <button
              onClick={() => setMobileModesOpen(true)}
              className="xl:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20 cursor-pointer"
            >
              <Compass size={14} />
              <span className="capitalize">{activeMode}</span>
            </button>

            {/* Help Manual */}
            <button
              onClick={() => setHelpOpen(true)}
              title="Touch Typing Manual (?)"
              className={`p-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                theme === "dark" ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle size={16} />
            </button>

            {/* User Account / Profile Badge */}
            {user ? (
              <Link
                to="/dashboard"
                title={`Signed in as @${user.username} (${user.tier || "Standard"} Tier). Click to open Dashboard.`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold transition shadow-xs"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-[11px]">
                  👤
                </span>
                <span className="truncate max-w-[90px] sm:max-w-[120px]">@{user.username}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-sm shadow-amber-500/20"
              >
                <Zap size={13} />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                theme === "dark" ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA WITH PRIMARY TOOLBAR & RIGHT-SIDE DOCK
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex gap-6 items-start">
        {/* Main Workstation Column */}
        <div className="flex-1 flex flex-col items-center min-w-0 w-full space-y-6">
          {/* ───────────────────────────────────────────────────────────
              PRIMARY TOP WORKSPACE TOOLBAR
              (Placed right above arena with fast, responsive Stiknex styling)
          ──────────────────────────────────────────────────────────── */}
          <div
            className={`w-fit max-w-full mx-auto flex items-center justify-center flex-nowrap gap-2 sm:gap-3 px-3 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-xs overflow-x-auto no-scrollbar whitespace-nowrap ${
              isTypingActive ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100 translate-y-0 pointer-events-auto"
            } ${
              theme === "dark" ? "bg-[#202023]/80 border-slate-800" : "bg-white/80 border-slate-200"
            }`}
          >
            {/* SPEED ARENA TOOLBAR */}
            {activeMode === "speed" && (
              <>
                {/* Modifiers */}
                <div className="flex items-center gap-1.5 shrink-0 pr-2.5 sm:pr-3 border-r border-slate-300 dark:border-slate-700/80">
                  <button
                    onClick={() => {
                      playClickSound();
                      setHasPunctuation(!hasPunctuation);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shrink-0 ${
                      hasPunctuation
                        ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-black"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    @ punctuation
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setHasNumbers(!hasNumbers);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shrink-0 ${
                      hasNumbers
                        ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-black"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    # numbers
                  </button>
                </div>

                {/* Sub-modes */}
                <div className="flex items-center gap-1 shrink-0 px-2 sm:px-2.5 border-r border-slate-300 dark:border-slate-700/80">
                  <button
                    onClick={() => {
                      playClickSound();
                      setSpeedSubMode("time");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0 ${
                      speedSubMode === "time"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Clock size={12} />
                    <span>time</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSpeedSubMode("words");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0 ${
                      speedSubMode === "words"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Type size={12} />
                    <span>words</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSpeedSubMode("quote");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0 ${
                      speedSubMode === "quote"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Quote size={12} />
                    <span>quote</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSpeedSubMode("freeflow");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0 ${
                      speedSubMode === "freeflow"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Feather size={12} />
                    <span>freeflow</span>
                  </button>
                </div>

                {/* Quantities & Options */}
                <div className="flex items-center gap-1 shrink-0 pl-1">
                  {speedSubMode === "time" &&
                    [15, 30, 60, 120].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          playClickSound();
                          setTimeLimit(s);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                          timeLimit === s ? "text-amber-500 font-black" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}

                  {speedSubMode === "words" &&
                    [10, 25, 50, 100].map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          playClickSound();
                          setWordLimit(w);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                          wordLimit === w ? "text-amber-500 font-black" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {w}
                      </button>
                    ))}

                  {speedSubMode === "quote" &&
                    ["all", "short", "medium", "long", "thicc"].map((ql) => (
                      <button
                        key={ql}
                        onClick={() => {
                          playClickSound();
                          setQuoteLength(ql);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                          quoteLength === ql ? "text-amber-500 font-black" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {ql}
                      </button>
                    ))}

                  {speedSubMode === "freeflow" && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 px-2 shrink-0">
                      <kbd className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[10px]">
                        shift + enter
                      </kbd>
                      <span>to finish freeflow</span>
                    </span>
                  )}
                </div>
              </>
            )}

            {/* 50 LESSONS ACADEMY TOOLBAR */}
            {activeMode === "lessons" && (
              <div className="w-full flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-500 text-xs font-black">
                    Stage {activeLessonData.stage}/10
                  </span>
                  <span className="font-bold text-xs truncate max-w-[200px] sm:max-w-xs">
                    #{activeLessonData.id}: {activeLessonData.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400">
                    Min Req: ≥{activeLessonData.minAccuracy}% Acc
                  </span>
                  <button
                    onClick={() => setCurriculumDrawerOpen(true)}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen size={13} />
                    <span>Syllabus ({unlockedLessonId}/50)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ARCADE GAMES TOOLBAR */}
            {activeMode === "games" && (
              <div className="w-full flex items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      setArcadeGame("falling");
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      arcadeGame === "falling"
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Falling Words Matrix
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setArcadeGame("rush");
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      arcadeGame === "rush"
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    60-Second Word Rush
                  </button>
                </div>
                <span className="text-xs font-mono text-amber-500 font-bold">
                  High-Stakes Arcade Mode
                </span>
              </div>
            )}

            {/* CODE STUDIO TOOLBAR */}
            {activeMode === "code" && (
              <div className="w-full flex items-center justify-between gap-2 px-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: "javascript", label: "JavaScript" },
                    { id: "typescript", label: "TypeScript" },
                    { id: "python", label: "Python" },
                    { id: "java", label: "Java" },
                    { id: "cpp", label: "C++" },
                    { id: "csharp", label: "C#" },
                    { id: "go", label: "Go" },
                    { id: "rust", label: "Rust" },
                    { id: "sql", label: "SQL" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        playClickSound();
                        setCodeLang(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                        codeLang.toLowerCase() === item.id.toLowerCase() || codeLang.toLowerCase() === item.label.toLowerCase()
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      playClickSound();
                      setCodePickerOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 text-xs font-bold transition cursor-pointer shrink-0"
                  >
                    <Code2 size={13} />
                    <span>All 50+ Languages</span>
                    <ChevronDown size={13} />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400 hidden lg:inline shrink-0">
                  53 Languages
                </span>
              </div>
            )}

            {/* ACCURACY TEST TOOLBAR */}
            {/* LEADERBOARD TOOLBAR */}
            {activeMode === "leaderboard" && (
              <div className="w-full flex items-center justify-between gap-3 px-2 text-xs">
                <span className="font-bold text-amber-500">🏆 Global Biomechanical Speed Leaderboard</span>
                <span className="text-slate-400 font-mono">Live Rankings</span>
              </div>
            )}

            {activeMode === "accuracy" && (
              <div className="w-full flex items-center justify-between gap-3 px-2 text-xs">
                <span className="font-bold text-amber-500">🎯 Zero-Error Accuracy Benchmark</span>
                <span className="text-slate-400 font-mono">1 typo = severe penalty</span>
              </div>
            )}

            {/* KEY TESTER TOOLBAR */}
            {activeMode === "key-test" && (
              <div className="w-full flex items-center justify-between gap-3 px-2 text-xs">
                <span className="font-bold text-amber-500">⌨️ Physical Mechanical Switch Actuation Matrix</span>
                <span className="text-slate-400 font-mono">NKRO &amp; Key Latency</span>
              </div>
            )}

            {/* SHORTCUTS TOOLBAR */}
            {activeMode === "shortcuts" && (
              <div className="w-full flex items-center justify-between gap-3 px-2 text-xs">
                <span className="font-bold text-amber-500">📋 Developer &amp; OS Shortcuts Cheat Sheet</span>
                <span className="text-slate-400 font-mono">80+ Essential Shortcuts</span>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────────
              PRIMARY ARENA CONTENT BASED ON ACTIVE MODE
          ──────────────────────────────────────────────────────────── */}
          <div className="w-full">
            {activeMode === "speed" && (
              <StiknexSpeedStudio
                theme={theme}
                subMode={speedSubMode}
                timeLimit={timeLimit}
                wordLimit={wordLimit}
                quoteLength={quoteLength}
                hasPunctuation={hasPunctuation}
                hasNumbers={hasNumbers}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
                onTypingActiveChange={setIsTypingActive}
              />
            )}

            {activeMode === "lessons" && (
              <StiknexLessonsRunner
                theme={theme}
                unlockedLessonId={unlockedLessonId}
                currentLessonId={currentLessonId}
                onSelectLesson={setCurrentLessonId}
                onLessonPassed={handleLessonPassed}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
                onOpenCurriculum={() => setCurriculumDrawerOpen(true)}
                onTypingActiveChange={setIsTypingActive}
              />
            )}

            {activeMode === "games" && (
              <StiknexArcadeGames
                theme={theme}
                gameType={arcadeGame}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
              />
            )}

            {activeMode === "code" && (
              <StiknexCodeStudio
                theme={theme}
                activeLang={codeLang}
                onSelectLang={setCodeLang}
                pickerOpen={codePickerOpen}
                setPickerOpen={setCodePickerOpen}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
                onTypingActiveChange={setIsTypingActive}
              />
            )}

            {activeMode === "leaderboard" && (
              <TypingLeaderboard theme={theme} />
            )}

            {activeMode === "accuracy" && (
              <StiknexAccuracyBenchmark
                theme={theme}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
              />
            )}

            {activeMode === "key-test" && (
              <StiknexKeySwitchTester
                theme={theme}
                playKeySound={playClickSound}
                soundEnabled={soundEnabled}
              />
            )}

            {activeMode === "shortcuts" && (
              <StiknexShortcutDirectory theme={theme} />
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. RIGHT-SIDE MODE NAVIGATION DOCK (Desktop: xl and above)
            (User requirement: "ise upar na deke right side me do")
        ───────────────────────────────────────────────────────────── */}
        <aside
          className={`hidden xl:flex flex-col gap-1.5 p-3 rounded-3xl border w-64 shrink-0 sticky top-20 shadow-md transition-all duration-300 ${
            isTypingActive ? "opacity-0 pointer-events-none translate-x-4" : "opacity-100 translate-x-0 pointer-events-auto"
          } ${
            theme === "dark" ? "bg-[#202023]/90 border-slate-800" : "bg-white/95 border-slate-200"
          }`}
        >
          <div className="px-2 py-1 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Typing Workstations
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("speed");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "speed"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap size={16} className={activeMode === "speed" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Speed Arena</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">WPM</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("lessons");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "lessons"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen size={16} className={activeMode === "lessons" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold truncate">50 Lessons Academy</span>
            </div>
            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-md ${
              activeMode === "lessons" ? "bg-slate-950/20 text-slate-950" : "bg-amber-500/20 text-amber-500"
            }`}>
              {unlockedLessonId}/50
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("leaderboard");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "leaderboard"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Crown size={16} className={activeMode === "leaderboard" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Leaderboard</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">Rank #1</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("games");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "games"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Gamepad2 size={16} className={activeMode === "games" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Arcade Games</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">Matrix</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("code");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "code"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Terminal size={16} className={activeMode === "code" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Code Studio</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">Dev</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("accuracy");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "accuracy"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Target size={16} className={activeMode === "accuracy" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Accuracy Test</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">Streak</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("key-test");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "key-test"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wrench size={16} className={activeMode === "key-test" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Key Switch Tester</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">NKRO</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("shortcuts");
            }}
            className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
              activeMode === "shortcuts"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={16} className={activeMode === "shortcuts" ? "text-slate-950" : "text-amber-500"} />
              <span className="text-xs font-bold">Shortcuts Directory</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">Keys</span>
          </button>

          <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

          {/* Quick Syllabus Shortcut */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-amber-500">
              <span>Syllabus Progress</span>
              <span>{Math.round((unlockedLessonId / 50) * 100)}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(unlockedLessonId / 50) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setCurriculumDrawerOpen(true)}
              className="w-full pt-1 text-[11px] font-bold text-amber-500 hover:underline flex items-center justify-between cursor-pointer"
            >
              <span>View All 50 Lessons</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. DESKTOP SHORTCUTS BAR (Strictly hidden on mobile/tablet < 1024px)
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full pb-4 pt-2 text-center select-none">
        <div className="hidden lg:flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">tab</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">enter</kbd>
            <span>restart test</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">esc</kbd>
            <span>reset stream</span>
          </span>
          <span>•</span>
          <span>Stiknex Typing Master • 50 Progressive Touch Typing Lessons</span>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          5. 50-LESSON CURRICULUM BROWSER DRAWER
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {curriculumDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`relative w-full max-w-lg h-full border-l shadow-2xl flex flex-col z-10 ${
                theme === "dark" ? "bg-[#18181b] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-base">50-Lesson Master Curriculum</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10 Stages • Strict progression: ≥90% accuracy required to advance
                  </p>
                </div>
                <button
                  onClick={() => setCurriculumDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Summary Bar */}
              <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500">
                  Unlocked: {unlockedLessonId} of 50 Lessons ({Math.round((unlockedLessonId / 50) * 100)}%)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: ≥90% Acc
                </span>
              </div>

              {/* 50 Lessons across 10 Stages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {TYPING_STAGES.map((stage) => {
                  const stageLessons = TYPING_LESSONS.filter((l) => l.stage === stage.id);
                  return (
                    <div key={stage.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                          {stage.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {stage.range}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{stage.desc}</p>

                      <div className="space-y-1.5 pt-1">
                        {stageLessons.map((l) => {
                          const isUnlocked = l.id <= unlockedLessonId;
                          const isCurrent = l.id === currentLessonId;

                          return (
                            <button
                              key={l.id}
                              disabled={!isUnlocked}
                              onClick={() => {
                                playClickSound();
                                setCurrentLessonId(l.id);
                                setActiveMode("lessons");
                                setCurriculumDrawerOpen(false);
                              }}
                              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                                isCurrent
                                  ? "bg-amber-500/15 border-amber-500 text-amber-500"
                                  : isUnlocked
                                  ? theme === "dark"
                                    ? "bg-slate-800/40 border-slate-700/60 hover:border-amber-500/40 text-slate-200"
                                    : "bg-slate-50 border-slate-200 hover:border-amber-500/40 text-slate-800"
                                  : "opacity-40 bg-slate-900/10 dark:bg-black/20 border-transparent cursor-not-allowed text-slate-500"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-mono text-xs font-bold w-6 shrink-0">
                                  #{l.id}
                                </span>
                                <div className="truncate">
                                  <div className="font-bold text-xs truncate">{l.title}</div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span>Keys: {l.keys.join(" ")}</span>
                                    <span>•</span>
                                    <span>Req: ≥{l.minAccuracy}% acc</span>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isUnlocked ? (
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                ) : (
                                  <Lock size={15} className="text-slate-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset Progress Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm("Reset typing syllabus progress back to Lesson 1?")) {
                      localStorage.setItem("stiknex_typing_unlocked_lesson", "1");
                      localStorage.removeItem("stiknex_typing_lesson_scores");
                      setUnlockedLessonId(1);
                      setCurrentLessonId(1);
                      setCurriculumDrawerOpen(false);
                    }
                  }}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Reset Progress
                </button>
                <button
                  onClick={() => setCurriculumDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          6. MOBILE MODES SLIDE-OVER (Small screens)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileModesOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileModesOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 border z-10 space-y-3 ${
                theme === "dark" ? "bg-[#202023] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm">Choose Typing Suite</span>
                <button onClick={() => setMobileModesOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "speed", label: "Speed Arena", icon: Zap },
                  { id: "lessons", label: "50 Lessons", icon: BookOpen },
                  { id: "leaderboard", label: "Leaderboard", icon: Crown },
                  { id: "games", label: "Arcade Games", icon: Gamepad2 },
                  { id: "code", label: "Code Studio", icon: Terminal },
                  { id: "accuracy", label: "Accuracy Test", icon: Target },
                  { id: "key-test", label: "Key Tester", icon: Wrench },
                  { id: "shortcuts", label: "Shortcuts", icon: Layers }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        playClickSound();
                        setActiveMode(item.id);
                        setMobileModesOpen(false);
                      }}
                      className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition cursor-pointer border ${
                        activeMode === item.id
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                          : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          7. TOUCH TYPING MANUAL / HELP MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`relative w-full max-w-lg rounded-3xl p-6 z-10 max-h-[85vh] overflow-y-auto border shadow-2xl ${
                theme === "dark" ? "bg-[#202023] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Touch Typing &amp; Biomechanical Manual
                  </h3>
                </div>
                <button onClick={() => setHelpOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    1. The 50-Lesson Progression System
                  </h4>
                  <p>
                    Each lesson in the <strong>50-Lesson Academy</strong> demands at least <strong>90% accuracy</strong> (and 95% on the Grand Master Marathon) before unlocking the next lesson. This builds true neuromuscular memory so your fingers automatically strike the correct keys without hesitation.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    2. Biomechanical Resting Row (ASDF JKL;)
                  </h4>
                  <p>
                    Left fingers rest on <strong>A, S, D, F</strong>. Right fingers rest on <strong>J, K, L, ;</strong>. Use the tactile raised nubs on <strong>F</strong> and <strong>J</strong> to anchor without looking down at the keyboard.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    3. WPM Formula
                  </h4>
                  <p>
                    <code>WPM = (Total Correct Characters / 5) / (Elapsed Minutes)</code>.
                  </p>
                </section>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setHelpOpen(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          8. UNIVERSAL SIDEBAR DRAWER
      ───────────────────────────────────────────────────────────── */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentSlug="stiknex-typing"
        categoryName="Typing & Keyboard"
        relatedTools={RELATED_TOOLS}
        theme={theme}
      />
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 1: STIKNEX SPEED STUDIO
 * =========================================================================================
 */
function StiknexSpeedStudio({
  theme,
  subMode,
  timeLimit,
  wordLimit,
  quoteLength,
  hasPunctuation,
  hasNumbers,
  playKeySound,
  soundEnabled,
  onTypingActiveChange
}) {
  const [status, setStatus] = useState("ready"); // 'ready' | 'typing' | 'finished'
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [elapsedStopwatch, setElapsedStopwatch] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [completedWords, setCompletedWords] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const { user, saveTypingScore } = useAppContext();
  const [scoreSaved, setScoreSaved] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);

  // Active Quote in Quote Mode
  const [activeQuote, setActiveQuote] = useState(null);

  // Freeflow Mode State (Open Freeform Typing Canvas)
  const [freeflowText, setFreeflowText] = useState("");
  const [copiedFreeflow, setCopiedFreeflow] = useState(false);

  // Deep Analytics Tracking
  const [timelineData, setTimelineData] = useState([]);
  const [hesitations, setHesitations] = useState([]);
  const [keyStats, setKeyStats] = useState({});
  const [wordAnalysis, setWordAnalysis] = useState([]);

  const lastKeyTimeRef = useRef(null);
  const intervalErrorsRef = useRef(0);
  const intervalCharsRef = useRef(0);
  const correctCharsRef = useRef(0);
  const keystrokesRef = useRef(0);
  const wordsContainerRef = useRef(null);
  const wordRefs = useRef([]);
  const inputRef = useRef(null);
  const freeflowInputRef = useRef(null);

  // Helper to replenish words infinitely in time mode so user never runs out
  const generateAdditionalWords = useCallback((count = 50) => {
    const list = [];
    const numbersPool = ["1984", "42", "2026", "100", "365", "7", "10", "500", "24", "12", "2024", "80", "99", "50", "3.14", "1000", "0", "1", "25", "18"];
    const punctuationMarks = [",", ".", ",", ".", "!", "?", ";", ":"];
    let shouldCapitalize = hasPunctuation;

    for (let i = 0; i < count; i++) {
      let word = VOCABULARY_WORDS[Math.floor(Math.random() * VOCABULARY_WORDS.length)];
      if (hasNumbers && Math.random() < 0.12) {
        word = numbersPool[Math.floor(Math.random() * numbersPool.length)];
        shouldCapitalize = false;
      } else if (hasPunctuation) {
        if (shouldCapitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
          shouldCapitalize = false;
        }
        const pRoll = Math.random();
        if (pRoll < 0.18) {
          const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
          word = word + mark;
          if (mark === "." || mark === "!" || mark === "?") {
            shouldCapitalize = true;
          }
        } else if (pRoll < 0.22) {
          word = `"${word}"`;
        }
      }
      list.push(word);
    }
    return list;
  }, [hasNumbers, hasPunctuation]);

  // Notify parent of active typing to hide options (Distraction-Free Zen Focus)
  useEffect(() => {
    if (onTypingActiveChange) {
      onTypingActiveChange(status === "typing");
    }
  }, [status, onTypingActiveChange]);

  const generateWords = useCallback(() => {
    if (subMode === "quote") {
      const pool = CURATED_QUOTES.filter((q) => quoteLength === "all" || q.length === quoteLength);
      const chosen = pool[Math.floor(Math.random() * pool.length)] || CURATED_QUOTES[0];
      setActiveQuote(chosen);
      return chosen.text.trim().split(/\s+/);
    }

    if (subMode === "freeflow") {
      setActiveQuote(null);
      return [];
    }

    setActiveQuote(null);
    const targetCount = subMode === "words" ? wordLimit : Math.max(80, timeLimit * 4);
    const list = [];
    const numbersPool = ["1984", "42", "2026", "100", "365", "7", "10", "500", "24", "12", "2024", "80", "99", "50", "3.14", "1000", "0", "1", "25", "18"];
    const punctuationMarks = [",", ".", ",", ".", "!", "?", ";", ":"];

    let shouldCapitalize = hasPunctuation;

    for (let i = 0; i < targetCount; i++) {
      let word = VOCABULARY_WORDS[Math.floor(Math.random() * VOCABULARY_WORDS.length)];

      if (hasNumbers && Math.random() < 0.12) {
        word = numbersPool[Math.floor(Math.random() * numbersPool.length)];
        shouldCapitalize = false;
      } else if (hasPunctuation) {
        if (shouldCapitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
          shouldCapitalize = false;
        }

        const pRoll = Math.random();
        if (pRoll < 0.18) {
          const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
          word = word + mark;
          if (mark === "." || mark === "!" || mark === "?") {
            shouldCapitalize = true;
          }
        } else if (pRoll < 0.22) {
          word = `"${word}"`;
        }
      }

      list.push(word);
    }
    return list;
  }, [subMode, wordLimit, timeLimit, quoteLength, hasPunctuation, hasNumbers]);

  const resetTest = useCallback(() => {
    const list = generateWords();
    setWords(list);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCompletedWords([]);
    setWordAnalysis([]);
    setTimelineData([]);
    setHesitations([]);
    setKeyStats({});
    lastKeyTimeRef.current = null;
    intervalErrorsRef.current = 0;
    intervalCharsRef.current = 0;
    setMistakes(0);
    setKeystrokes(0);
    setScoreSaved(false);
    setStatus("ready");
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(timeLimit);
    setElapsedStopwatch(0);
    setFreeflowText("");
    setCopiedFreeflow(false);
    wordRefs.current = [];
    if (wordsContainerRef.current) {
      wordsContainerRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      if (subMode === "freeflow") {
        freeflowInputRef.current && freeflowInputRef.current.focus();
      } else {
        inputRef.current && inputRef.current.focus();
      }
    }, 40);
  }, [generateWords, timeLimit, subMode]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Measure dynamic row height so EXACTLY 3 lines are visible with zero bleeding from line 4
  const measureAndSetHeight = useCallback(() => {
    if (!wordRefs.current || wordRefs.current.length < 2) return;
    const elements = wordRefs.current.filter(Boolean);
    if (elements.length < 2) return;

    // Collect all unique line top offsets in ascending order
    const uniqueTops = Array.from(
      new Set(elements.map((el) => el.offsetTop))
    ).sort((a, b) => a - b);

    if (uniqueTops.length >= 4) {
      // Line 4 starts at uniqueTops[3]. Exactly 3 full lines fit above it!
      // Setting height to uniqueTops[3] - uniqueTops[0] - 2 strictly guarantees line 4 can NEVER peek through!
      const targetHeight = uniqueTops[3] - uniqueTops[0] - 2;
      setContainerHeight(targetHeight);
    } else if (uniqueTops.length >= 2) {
      const lineStep = uniqueTops[1] - uniqueTops[0];
      if (lineStep >= 24 && lineStep <= 90) {
        setContainerHeight(lineStep * 3 - 2);
      }
    }
  }, []);

  useEffect(() => {
    measureAndSetHeight();
    const t1 = setTimeout(measureAndSetHeight, 40);
    const t2 = setTimeout(measureAndSetHeight, 150);
    const t3 = setTimeout(measureAndSetHeight, 350);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureAndSetHeight);
    }
    window.addEventListener("resize", measureAndSetHeight);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", measureAndSetHeight);
    };
  }, [words, measureAndSetHeight]);

  // 3-Line Paragraph Flow: cursor walks naturally across lines 1, 2, and 3;
  // when the 3-line paragraph completes, it shifts to the next paragraph and cursor resets to top (Line 1)!
  useEffect(() => {
    const container = wordsContainerRef.current;
    const activeWordEl = wordRefs.current[currentWordIndex];
    const firstWordEl = wordRefs.current[0];
    if (!container || !activeWordEl || !firstWordEl) return;

    const initialTop = firstWordEl.offsetTop;
    const currentTop = activeWordEl.offsetTop;

    // Detect dynamic line height between rows
    let lineHeight = 54;
    for (let i = 1; i < wordRefs.current.length; i++) {
      const el = wordRefs.current[i];
      if (el && el.offsetTop > initialTop + 10) {
        lineHeight = el.offsetTop - initialTop;
        break;
      }
    }

    const lineNumber = Math.max(0, Math.round((currentTop - initialTop) / lineHeight));
    const paragraphIndex = Math.floor(lineNumber / 3);
    const targetTop = paragraphIndex * (3 * lineHeight);

    if (Math.abs(container.scrollTop - targetTop) > 2) {
      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const handleResize = () => {
      const container = wordsContainerRef.current;
      const activeWordEl = wordRefs.current[currentWordIndex];
      const firstWordEl = wordRefs.current[0];
      if (!container || !activeWordEl || !firstWordEl) return;

      const initialTop = firstWordEl.offsetTop;
      let lineHeight = 54;
      for (let i = 1; i < wordRefs.current.length; i++) {
        const el = wordRefs.current[i];
        if (el && el.offsetTop > initialTop + 10) {
          lineHeight = el.offsetTop - initialTop;
          break;
        }
      }
      const lineNumber = Math.max(0, Math.round((activeWordEl.offsetTop - initialTop) / lineHeight));
      const paragraphIndex = Math.floor(lineNumber / 3);
      container.scrollTop = paragraphIndex * (3 * lineHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentWordIndex]);

  // Duration in minutes
  const elapsedMinutes = useMemo(() => {
    if (subMode === "time") {
      if (status === "finished") return timeLimit / 60;
      const elapsed = Math.max(1, timeLimit - timeLeft);
      return elapsed / 60;
    }
    if (!startTime) return 1 / 60;
    const finalEnd = endTime || Date.now();
    const elapsedSeconds = Math.max(0.5, (finalEnd - startTime) / 1000);
    return elapsedSeconds / 60;
  }, [subMode, status, timeLimit, timeLeft, startTime, endTime]);

  const correctCharacters = useMemo(() => {
    if (subMode === "freeflow") return freeflowText.length;
    let chars = 0;
    completedWords.forEach((cw) => {
      if (cw.isCorrect) chars += cw.word.length + 1;
    });
    const curTarget = words[currentWordIndex] || "";
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === curTarget[i]) chars++;
    }
    return chars;
  }, [subMode, freeflowText, completedWords, words, currentWordIndex, currentInput]);

  const wpm = useMemo(() => {
    if (elapsedMinutes <= 0) return 0;
    if (subMode === "freeflow") {
      return Math.max(0, Math.round((freeflowText.length / 5) / elapsedMinutes));
    }
    return Math.max(0, Math.round((correctCharacters / 5) / elapsedMinutes));
  }, [subMode, freeflowText, correctCharacters, elapsedMinutes]);

  const rawWpm = useMemo(() => {
    if (elapsedMinutes <= 0) return 0;
    return Math.max(0, Math.round((keystrokes / 5) / elapsedMinutes));
  }, [keystrokes, elapsedMinutes]);

  const accuracy = useMemo(() => {
    if (subMode === "freeflow") return 100;
    if (keystrokes === 0) return 100;
    const acc = Math.round(((keystrokes - mistakes) / keystrokes) * 100);
    return Math.max(0, Math.min(100, acc));
  }, [subMode, keystrokes, mistakes]);

  const consistency = useMemo(() => {
    if (timelineData.length < 2) return 85;
    const speeds = timelineData.map((d) => d.wpm).filter((v) => v > 0);
    if (speeds.length < 2) return 80;
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance = speeds.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / (mean || 1);
    return Math.max(15, Math.min(100, Math.round(100 - cv * 55)));
  }, [timelineData]);

  // Auto-record score to User Profile and Leaderboard when test finishes and user is signed in
  useEffect(() => {
    if (status === "finished" && !scoreSaved && user && wpm > 0) {
      saveTypingScore({
        wpm,
        rawWpm,
        accuracy,
        consistency,
        subMode,
        timeLimit,
        wordLimit,
        language: "english",
        hasPunctuation,
        hasNumbers,
        characters: {
          correct: correctCharacters,
          incorrect: mistakes,
          extra: Math.max(0, keystrokes - correctCharacters - mistakes),
          missed: Math.max(0, words.length - currentWordIndex)
        }
      }).then((res) => {
        if (res?.success) setScoreSaved(true);
      });
    }
  }, [status, scoreSaved, user, wpm, rawWpm, accuracy, consistency, subMode, timeLimit, wordLimit, hasPunctuation, hasNumbers, correctCharacters, mistakes, keystrokes, currentWordIndex, words.length, saveTypingScore]);

  useEffect(() => {
    correctCharsRef.current = correctCharacters;
  }, [correctCharacters]);

  useEffect(() => {
    keystrokesRef.current = keystrokes;
  }, [keystrokes]);

  // Wall-Clock Precision Timer loop & Second-by-Second Timeline tracking for SVG graph
  useEffect(() => {
    let timer = null;
    if (status === "typing") {
      const startMs = startTime || Date.now();
      let lastLoggedSec = 0;

      timer = setInterval(() => {
        const nowMs = Date.now();
        const totalElapsedSec = (nowMs - startMs) / 1000;

        if (subMode === "time") {
          const remaining = Math.max(0, Math.ceil(timeLimit - totalElapsedSec));
          setTimeLeft(remaining);

          if (remaining <= 0) {
            setEndTime(nowMs);
            setStatus("finished");
            clearInterval(timer);
            return;
          }
        } else {
          setElapsedStopwatch(Math.floor(totalElapsedSec));
        }

        // Track timeline data second-by-second for analytics SVG graph
        const currentWholeSec = Math.floor(totalElapsedSec);
        if (currentWholeSec > lastLoggedSec) {
          lastLoggedSec = currentWholeSec;
          const currentElapsedMin = Math.max(0.01, currentWholeSec / 60);
          const intervalChars = intervalCharsRef.current;
          intervalCharsRef.current = 0;
          const burstWpm = Math.max(0, Math.round((intervalChars / 5) * 60));
          const instantWpm = Math.max(0, Math.round((correctCharsRef.current / 5) / currentElapsedMin));
          const instantRaw = Math.max(0, Math.round((keystrokesRef.current / 5) / currentElapsedMin));
          const errorsThisSec = intervalErrorsRef.current;
          intervalErrorsRef.current = 0;

          setTimelineData((prev) => [
            ...prev,
            {
              second: currentWholeSec,
              wpm: instantWpm,
              rawWpm: instantRaw,
              burstWpm: burstWpm > 0 ? burstWpm : instantWpm,
              errors: errorsThisSec
            }
          ]);
        }
      }, 200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, subMode, timeLimit, startTime]);

  // Key handler with pause analysis & multi-word backspace
  const handleKeyDown = (e) => {
    if (status === "finished") return;

    if (e.key === "Escape" || (e.key === "Enter" && e.tabKey)) {
      e.preventDefault();
      resetTest();
      return;
    }

    if (status === "ready" && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setStatus("typing");
      const now = Date.now();
      setStartTime(now);
      lastKeyTimeRef.current = now;
    }

    const now = Date.now();
    const pauseMs = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;
    lastKeyTimeRef.current = now;

    // Track hesitation pauses > 350ms during active typing
    if (status === "typing" && pauseMs > 350 && e.key.length === 1) {
      const curWord = words[currentWordIndex] || "";
      const curChar = curWord[currentInput.length] || e.key;
      setHesitations((prev) => [
        ...prev,
        {
          pauseMs,
          targetChar: curChar,
          word: curWord,
          second: Math.max(1, Math.round((now - (startTime || now)) / 1000))
        }
      ]);
    }

    // Space key: completes current word
    if (e.key === " ") {
      e.preventDefault();
      if (!currentInput.trim() && currentInput.length === 0) return;

      const targetWord = words[currentWordIndex] || "";
      const isCorrect = currentInput === targetWord;
      playKeySound("space");

      const wordEntry = {
        word: targetWord,
        typed: currentInput,
        isCorrect,
        errorsCount: isCorrect ? 0 : 1
      };

      setCompletedWords((prev) => [...prev, wordEntry]);
      setWordAnalysis((prev) => [...prev, wordEntry]);

      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      setCurrentInput("");
      setKeystrokes((k) => k + 1);
      intervalCharsRef.current += 1;

      // In time mode, replenish words if user is within 25 words of the end so they never run out
      if (subMode === "time" && nextIdx >= words.length - 25) {
        const more = generateAdditionalWords(50);
        setWords((prev) => [...prev, ...more]);
      }

      if (subMode === "words" && nextIdx >= wordLimit) {
        setEndTime(Date.now());
        setStatus("finished");
      }
      if (subMode === "quote" && nextIdx >= words.length) {
        setEndTime(Date.now());
        setStatus("finished");
      }
      return;
    }

    // Ctrl + Backspace
    if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput("");
        playKeySound("key");
      } else if (currentWordIndex > 0) {
        const prevIdx = currentWordIndex - 1;
        const prevWord = completedWords[prevIdx];
        setCurrentWordIndex(prevIdx);
        setCurrentInput(prevWord ? prevWord.typed || prevWord.input : "");
        setCompletedWords((prev) => prev.slice(0, -1));
        setWordAnalysis((prev) => prev.slice(0, -1));
        playKeySound("key");
      }
      return;
    }

    // Standard Backspace: deletes char or navigates back into previous word
    if (e.key === "Backspace") {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput((prev) => prev.slice(0, -1));
        playKeySound("key");
      } else if (currentWordIndex > 0) {
        const prevIdx = currentWordIndex - 1;
        const prevWord = completedWords[prevIdx];
        setCurrentWordIndex(prevIdx);
        setCurrentInput(prevWord ? prevWord.typed || prevWord.input : "");
        setCompletedWords((prev) => prev.slice(0, -1));
        setWordAnalysis((prev) => prev.slice(0, -1));
        playKeySound("key");
      }
      return;
    }

    // Standard printable character
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const nextInput = currentInput + e.key;
      const targetChar = (words[currentWordIndex] || "")[currentInput.length];
      const isMismatch = e.key !== targetChar;

      // Track key stats for letter accuracy matrix
      setKeyStats((prev) => {
        const charKey = e.key.toLowerCase();
        const cur = prev[charKey] || { total: 0, errors: 0 };
        return {
          ...prev,
          [charKey]: {
            total: cur.total + 1,
            errors: cur.errors + (isMismatch ? 1 : 0)
          }
        };
      });

      if (isMismatch) {
        setMistakes((m) => m + 1);
        intervalErrorsRef.current += 1;
        playKeySound("error");
      } else {
        playKeySound("key");
      }

      setKeystrokes((k) => k + 1);
      intervalCharsRef.current += 1;
      setCurrentInput(nextInput);
    }
  };

  const handleFreeflowKeyDown = (e) => {
    if (status === "finished") return;

    if (e.key === "Escape") {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (freeflowText.trim().length > 0) {
        setEndTime(Date.now());
        setStatus("finished");
        playKeySound("success");
      }
      return;
    }

    if (status === "ready" && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setStatus("typing");
      setStartTime(Date.now());
    }

    if (e.key === "Enter" || e.key === " ") {
      playKeySound("space");
    } else if (e.key === "Backspace") {
      playKeySound("key");
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      playKeySound("key");
    }
  };

  const copyFreeflowText = () => {
    try {
      navigator.clipboard.writeText(freeflowText);
      setCopiedFreeflow(true);
      setTimeout(() => setCopiedFreeflow(false), 2000);
    } catch {}
  };

  const formatStopwatch = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      onClick={() => {
        if (subMode === "freeflow") {
          freeflowInputRef.current && freeflowInputRef.current.focus();
        } else {
          inputRef.current && inputRef.current.focus();
        }
      }}
      className="w-full flex flex-col items-center justify-center cursor-text py-4 select-none"
    >
      {/* Hidden input for structured test modes */}
      {subMode !== "freeflow" && (
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute -left-[9999px] -top-[9999px]"
          autoFocus
        />
      )}

      {status !== "finished" ? (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-6">
          {/* Telemetry live counters */}
          <div className="h-8 flex items-center justify-center gap-6 font-mono">
            {status === "typing" && subMode === "time" && (
              <span className="text-3xl font-black text-amber-500 animate-pulse">{timeLeft}s</span>
            )}

            {status === "typing" && subMode === "words" && (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-amber-500">{currentWordIndex}/{wordLimit}</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {formatStopwatch(elapsedStopwatch)}
                </span>
              </div>
            )}

            {status === "typing" && subMode === "quote" && (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-amber-500">{currentWordIndex}/{words.length}</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {formatStopwatch(elapsedStopwatch)}
                </span>
              </div>
            )}

            {status === "typing" && subMode === "freeflow" && (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-amber-500">
                  {freeflowText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {formatStopwatch(elapsedStopwatch)}
                </span>
              </div>
            )}

            {status === "typing" && (
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Speed: <strong className="text-white font-bold">{wpm} WPM</strong></span>
                {subMode !== "freeflow" && (
                  <span>Accuracy: <strong className="text-emerald-400 font-bold">{accuracy}%</strong></span>
                )}
              </div>
            )}
          </div>

          {/* FREEFLOW CANVAS */}
          {subMode === "freeflow" ? (
            <div className="w-full flex flex-col items-center">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-2xs">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-amber-500 font-black text-[11px] border border-slate-300 dark:border-slate-700">
                    shift + enter
                  </kbd>
                  <span>to finish freeflow</span>
                </span>
              </div>

              <div className="w-full min-h-[200px] sm:min-h-[240px] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 flex flex-col relative focus-within:border-amber-500/50 transition shadow-inner">
                <textarea
                  ref={freeflowInputRef}
                  value={freeflowText}
                  onChange={(e) => setFreeflowText(e.target.value)}
                  onKeyDown={handleFreeflowKeyDown}
                  placeholder="Type anything freely here... ideas, thoughts, stream-of-consciousness, or journal. Press Shift + Enter when done."
                  rows={6}
                  className="w-full h-full bg-transparent border-0 outline-none resize-none font-mono text-lg sm:text-2xl leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  autoFocus
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/60 mt-auto">
                  <span>{freeflowText.length} characters</span>
                  <span>{freeflowText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          ) : (
            /* STRUCTURED WORDS / TIME / QUOTE ARENA (EXACTLY 3 LINES) */
            <div className="w-full flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1.5 mb-3 text-xs font-mono text-slate-400">
                <Globe size={13} className="text-slate-500" />
                <span>{subMode === "quote" ? (activeQuote?.author || "literature quote") : "english"}</span>
              </div>

              <div
                ref={wordsContainerRef}
                className={`w-full font-mono text-xl sm:text-2xl md:text-3xl leading-[1.5] flex flex-wrap gap-x-3.5 gap-y-0 select-none overflow-hidden scroll-smooth relative ${
                  theme === "dark" ? "text-slate-500" : "text-slate-400"
                }`}
                style={{
                  height: containerHeight ? `${containerHeight}px` : "4.4em",
                  maxHeight: containerHeight ? `${containerHeight}px` : "4.4em",
                  lineHeight: "1.5"
                }}
              >
                {words.map((word, idx) => {
                  const isCurrent = idx === currentWordIndex;
                  const isPast = idx < currentWordIndex;
                  const pastWord = completedWords[idx];

                  if (isPast && pastWord) {
                    return (
                      <span
                        key={idx}
                        ref={(el) => (wordRefs.current[idx] = el)}
                        className={`inline-flex items-center h-[1.5em] leading-[1.5em] ${
                          pastWord.isCorrect
                            ? theme === "dark" ? "text-slate-200" : "text-slate-800"
                            : "text-rose-500 font-semibold border-b-2 border-rose-500/80 bg-rose-500/10 rounded-xs px-0.5"
                        }`}
                        title={!pastWord.isCorrect ? `Typed: "${pastWord.typed || pastWord.input}"` : undefined}
                      >
                        {word}
                      </span>
                    );
                  }

                  if (isCurrent) {
                    return (
                      <span
                        key={idx}
                        ref={(el) => (wordRefs.current[idx] = el)}
                        className="relative inline-flex items-center h-[1.5em] leading-[1.5em]"
                      >
                        {word.split("").map((targetChar, cIdx) => {
                          const typedChar = currentInput[cIdx];
                          const isTyped = cIdx < currentInput.length;
                          const isMatch = typedChar === targetChar;

                          return (
                            <React.Fragment key={cIdx}>
                              {cIdx === currentInput.length && (
                                <span className="w-[3px] h-[1.2em] bg-amber-400 inline-block align-middle rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.95)] transition-all duration-75" />
                              )}
                              <span
                                className={
                                  !isTyped
                                    ? theme === "dark" ? "text-slate-500" : "text-slate-400"
                                    : isMatch
                                    ? theme === "dark" ? "text-white font-bold" : "text-slate-900 font-bold"
                                    : "text-rose-500 bg-rose-500/20 rounded-xs font-bold"
                                }
                              >
                                {targetChar}
                              </span>
                            </React.Fragment>
                          );
                        })}

                        {currentInput.length === word.length && (
                          <span className="w-[3px] h-[1.2em] bg-amber-400 inline-block align-middle rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.95)] transition-all duration-75" />
                        )}

                        {currentInput.length > word.length &&
                          currentInput.slice(word.length).split("").map((extra, exIdx) => (
                            <span key={exIdx} className="text-rose-600 bg-rose-500/30 rounded-xs font-bold">
                              {extra}
                            </span>
                          ))}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={idx}
                      ref={(el) => (wordRefs.current[idx] = el)}
                      className={`inline-flex items-center h-[1.5em] leading-[1.5em] ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>

              {subMode === "quote" && activeQuote?.author && (
                <div className="text-right text-xs font-mono text-amber-500/80 mt-4 italic">
                  — {activeQuote.author}
                </div>
              )}
            </div>
          )}

          {/* Quick Restart Icon & Shortcuts Hint */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetTest();
              }}
              title="Restart Test (Esc)"
              className="p-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition cursor-pointer"
            >
              <RotateCcw size={20} />
            </button>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">tab</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">enter</kbd>
                <span>restart</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">esc</kbd>
                <span>quick reset</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* FLAGSHIP DEEP ANALYTICS & TIMELINE SCORECARD (MATCHING IMAGE 10) */
        <TypingDeepAnalytics
          theme={theme}
          wpm={wpm}
          rawWpm={rawWpm}
          acc={accuracy}
          consistency={consistency}
          timeLimit={timeLimit}
          elapsedSeconds={subMode === "time" ? timeLimit : Math.max(1, Math.round(elapsedMinutes * 60))}
          subMode={subMode}
          wordLimit={wordLimit}
          hasNumbers={hasNumbers}
          hasPunctuation={hasPunctuation}
          characters={{
            correct: correctCharacters,
            incorrect: mistakes,
            extra: Math.max(0, keystrokes - correctCharacters - mistakes),
            missed: Math.max(0, words.length - currentWordIndex)
          }}
          timelineData={timelineData}
          hesitations={hesitations}
          keyStats={keyStats}
          wordAnalysis={wordAnalysis}
          onRestart={resetTest}
          onNextTest={resetTest}
          onPracticeMissed={(missedList) => {
            if (missedList && missedList.length > 0) {
              setWords(missedList);
              setCurrentWordIndex(0);
              setCurrentInput("");
              setCompletedWords([]);
              setWordAnalysis([]);
              setTimelineData([]);
              setHesitations([]);
              setMistakes(0);
              setKeystrokes(0);
              setStatus("ready");
              setStartTime(null);
              setEndTime(null);
            } else {
              resetTest();
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 2: STIKNEX 50-LESSON ACADEMY RUNNER (STRICT UNLOCK PROGRESSION)
 * =========================================================================================
 */
function StiknexLessonsRunner({
  theme,
  unlockedLessonId,
  currentLessonId,
  onSelectLesson,
  onLessonPassed,
  playKeySound,
  soundEnabled,
  onOpenCurriculum,
  onTypingActiveChange
}) {
  const lesson = useMemo(() => {
    return TYPING_LESSONS.find((l) => l.id === currentLessonId) || TYPING_LESSONS[0];
  }, [currentLessonId]);

  const words = useMemo(() => {
    return lesson.text.trim().split(/\s+/);
  }, [lesson.text]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [completedWords, setCompletedWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const { user, saveTypingScore } = useAppContext();
  const [scoreSaved, setScoreSaved] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const wordsContainerRef = useRef(null);
  const wordRefs = useRef([]);
  const inputRef = useRef(null);

  // Notify parent of active typing
  useEffect(() => {
    if (onTypingActiveChange) {
      onTypingActiveChange(!isFinished && startTime !== null);
    }
  }, [isFinished, startTime, onTypingActiveChange]);

  const resetLesson = useCallback(() => {
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCompletedWords([]);
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
    setKeystrokes(0);
    setIsFinished(false);
    wordRefs.current = [];
    if (wordsContainerRef.current) {
      wordsContainerRef.current.scrollTop = 0;
    }
    setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
  }, []);

  useEffect(() => {
    resetLesson();
  }, [currentLessonId, resetLesson]);

  // 3-Line Paragraph Flow in Lessons:
  // Cursor walks naturally across lines 1, 2, and 3;
  // When paragraph completes, it shifts to the next 3 lines and cursor returns to top!
  useEffect(() => {
    const container = wordsContainerRef.current;
    const activeWordEl = wordRefs.current[currentWordIndex];
    const firstWordEl = wordRefs.current[0];
    if (!container || !activeWordEl || !firstWordEl) return;

    const initialTop = firstWordEl.offsetTop;
    const currentTop = activeWordEl.offsetTop;

    let lineHeight = 54;
    for (let i = 1; i < wordRefs.current.length; i++) {
      const el = wordRefs.current[i];
      if (el && el.offsetTop > initialTop + 10) {
        lineHeight = el.offsetTop - initialTop;
        break;
      }
    }

    const lineNumber = Math.max(0, Math.round((currentTop - initialTop) / lineHeight));
    const paragraphIndex = Math.floor(lineNumber / 3);
    const targetTop = paragraphIndex * (3 * lineHeight);

    if (Math.abs(container.scrollTop - targetTop) > 2) {
      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const handleResize = () => {
      const container = wordsContainerRef.current;
      const activeWordEl = wordRefs.current[currentWordIndex];
      const firstWordEl = wordRefs.current[0];
      if (!container || !activeWordEl || !firstWordEl) return;

      const initialTop = firstWordEl.offsetTop;
      let lineHeight = 54;
      for (let i = 1; i < wordRefs.current.length; i++) {
        const el = wordRefs.current[i];
        if (el && el.offsetTop > initialTop + 10) {
          lineHeight = el.offsetTop - initialTop;
          break;
        }
      }
      const lineNumber = Math.max(0, Math.round((activeWordEl.offsetTop - initialTop) / lineHeight));
      const paragraphIndex = Math.floor(lineNumber / 3);
      container.scrollTop = paragraphIndex * (3 * lineHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentWordIndex]);

  const handleKeyDown = (e) => {
    if (isFinished) return;

    if (e.key === "Escape") {
      e.preventDefault();
      resetLesson();
      return;
    }

    if (!startTime && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setStartTime(Date.now());
    }

    // Space key: completes current word
    if (e.key === " ") {
      e.preventDefault();
      if (!currentInput.trim() && currentInput.length === 0) return;

      const targetWord = words[currentWordIndex] || "";
      const isCorrect = currentInput === targetWord;
      playKeySound("space");

      setCompletedWords((prev) => [
        ...prev,
        { word: targetWord, input: currentInput, isCorrect }
      ]);

      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      setCurrentInput("");
      setKeystrokes((k) => k + 1);

      if (nextIdx >= words.length) {
        setEndTime(Date.now());
        setIsFinished(true);
        playKeySound("success");
      }
      return;
    }

    // Ctrl + Backspace
    if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput("");
        playKeySound("key");
      } else if (currentWordIndex > 0) {
        const prevIdx = currentWordIndex - 1;
        const prevWord = completedWords[prevIdx];
        setCurrentWordIndex(prevIdx);
        setCurrentInput(prevWord ? prevWord.input : "");
        setCompletedWords((prev) => prev.slice(0, -1));
        playKeySound("key");
      }
      return;
    }

    // Standard Backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput((prev) => prev.slice(0, -1));
        playKeySound("key");
      } else if (currentWordIndex > 0) {
        const prevIdx = currentWordIndex - 1;
        const prevWord = completedWords[prevIdx];
        setCurrentWordIndex(prevIdx);
        setCurrentInput(prevWord ? prevWord.input : "");
        setCompletedWords((prev) => prev.slice(0, -1));
        playKeySound("key");
      }
      return;
    }

    // Standard character input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const nextInput = currentInput + e.key;
      const targetChar = (words[currentWordIndex] || "")[currentInput.length];
      const isMismatch = e.key !== targetChar;

      if (isMismatch) {
        setMistakes((m) => m + 1);
        playKeySound("error");
      } else {
        playKeySound("key");
      }

      setKeystrokes((k) => k + 1);
      setCurrentInput(nextInput);
    }
  };

  const elapsedMinutes = useMemo(() => {
    if (!startTime) return 0.1;
    const finalEnd = endTime || Date.now();
    return Math.max(1, (finalEnd - startTime) / 1000) / 60;
  }, [startTime, endTime, isFinished]);

  const correctCharacters = useMemo(() => {
    let chars = 0;
    completedWords.forEach((cw) => {
      if (cw.isCorrect) chars += cw.word.length + 1;
    });
    const curTarget = words[currentWordIndex] || "";
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === curTarget[i]) chars++;
    }
    return chars;
  }, [completedWords, words, currentWordIndex, currentInput]);

  const accuracy = useMemo(() => {
    if (keystrokes === 0) return 100;
    const acc = Math.round(((keystrokes - mistakes) / keystrokes) * 100);
    return Math.max(0, Math.min(100, acc));
  }, [keystrokes, mistakes]);

  const wpm = useMemo(() => {
    if (elapsedMinutes <= 0) return 0;
    return Math.max(0, Math.round((correctCharacters / 5) / elapsedMinutes));
  }, [correctCharacters, elapsedMinutes]);

  const isPassed = accuracy >= lesson.minAccuracy;

  useEffect(() => {
    if (isFinished && isPassed) {
      onLessonPassed(lesson.id, accuracy, wpm);
    }
  }, [isFinished, isPassed, lesson.id, accuracy, wpm, onLessonPassed]);

  return (
    <div className="w-full flex flex-col items-center space-y-6 py-2">
      {/* Lesson Header Banner */}
      <div
        className={`w-full p-5 rounded-3xl border shadow-xs space-y-3 ${
          theme === "dark" ? "bg-[#202023] border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 font-black text-xs uppercase">
                Stage {lesson.stage}/10 • Lesson {lesson.id} of 50
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Req: ≥{lesson.minAccuracy}% Accuracy
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1 text-slate-900 dark:text-white">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCurriculum}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Browse 50 Lessons ({unlockedLessonId}/50)</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          💡 <strong className="text-slate-700 dark:text-slate-300">Biomechanical Placement:</strong> {lesson.desc}
        </p>

        {/* Live Telemetry Meter */}
        <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono text-xs">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block uppercase">Progress</span>
            <span className="font-bold text-amber-500">
              {Math.round((currentWordIndex / words.length) * 100)}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block uppercase">Live Speed</span>
            <span className="font-bold">{wpm} WPM</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
            <span className={`font-bold ${accuracy >= lesson.minAccuracy ? "text-emerald-400" : "text-rose-400"}`}>
              {accuracy}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <span className="text-[10px] text-slate-400 block uppercase">Typos</span>
            <span className="font-bold text-rose-500">{mistakes}</span>
          </div>
        </div>
      </div>

      {/* Lesson Arena with 3-Line Paragraph Scrolling & Animated Caret */}
      {!isFinished ? (
        <div
          onClick={() => inputRef.current && inputRef.current.focus()}
          className={`w-full p-6 sm:p-8 rounded-3xl border font-mono text-xl sm:text-2xl leading-[1.8] cursor-text relative shadow-inner overflow-hidden select-none ${
            theme === "dark" ? "bg-black/40 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          {/* Hidden input to capture keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            className="opacity-0 absolute -left-[9999px] -top-[9999px]"
            autoFocus
          />

          <div
            ref={wordsContainerRef}
            className={`w-full font-mono text-xl sm:text-2xl leading-[1.8] flex flex-wrap gap-x-3.5 gap-y-2 select-none overflow-hidden max-h-[165px] scroll-smooth ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}
            style={{
              height: "165px",
              lineHeight: "1.8"
            }}
          >
            {words.map((word, idx) => {
              const isCurrent = idx === currentWordIndex;
              const isPast = idx < currentWordIndex;
              const pastWord = completedWords[idx];

              if (isPast && pastWord) {
                return (
                  <span
                    key={idx}
                    ref={(el) => (wordRefs.current[idx] = el)}
                    className={
                      pastWord.isCorrect
                        ? theme === "dark" ? "text-slate-200" : "text-slate-800"
                        : "text-rose-500 font-semibold border-b-2 border-rose-500/80 bg-rose-500/10 rounded-xs px-0.5"
                    }
                    title={!pastWord.isCorrect ? `Typed: "${pastWord.input}"` : undefined}
                  >
                    {word}
                  </span>
                );
              }

              if (isCurrent) {
                return (
                  <span
                    key={idx}
                    ref={(el) => (wordRefs.current[idx] = el)}
                    className="relative inline-flex items-center"
                  >
                    {word.split("").map((targetChar, cIdx) => {
                      const typedChar = currentInput[cIdx];
                      const isTyped = cIdx < currentInput.length;
                      const isMatch = typedChar === targetChar;

                      return (
                        <React.Fragment key={cIdx}>
                          {cIdx === currentInput.length && (
                            <span className="w-[3px] h-[1.25em] bg-amber-400 inline-block align-middle rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.95)] transition-all duration-75" />
                          )}
                          <span
                            className={
                              !isTyped
                                ? theme === "dark" ? "text-slate-500" : "text-slate-400"
                                : isMatch
                                ? theme === "dark" ? "text-white font-bold" : "text-slate-900 font-bold"
                                : "text-rose-500 bg-rose-500/20 rounded-xs font-bold"
                            }
                          >
                            {targetChar}
                          </span>
                        </React.Fragment>
                      );
                    })}

                    {currentInput.length === word.length && (
                      <span className="w-[3px] h-[1.25em] bg-amber-400 inline-block align-middle rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.95)] transition-all duration-75" />
                    )}

                    {currentInput.length > word.length &&
                      currentInput.slice(word.length).split("").map((extra, exIdx) => (
                        <span key={exIdx} className="text-rose-600 bg-rose-500/30 rounded-xs font-bold">
                          {extra}
                        </span>
                      ))}
                  </span>
                );
              }

              return (
                <span
                  key={idx}
                  ref={(el) => (wordRefs.current[idx] = el)}
                  className={theme === "dark" ? "text-slate-600" : "text-slate-400"}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/60 mt-4">
            <span>Word {currentWordIndex + 1} of {words.length}</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">esc</kbd>
              <span>reset lesson</span>
            </span>
          </div>
        </div>
      ) : (
        /* Completion Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full p-8 rounded-3xl border text-center space-y-6 ${
            isPassed ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
          }`}
        >
          <div>
            <div className="text-4xl mb-2">{isPassed ? "🎉" : "⚠️"}</div>
            <h3 className="text-2xl font-black">
              {isPassed ? `Lesson ${lesson.id} Successfully Mastered!` : `Lesson ${lesson.id} Needs More Precision`}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isPassed
                ? `You achieved ${accuracy}% accuracy (Requirement: ≥${lesson.minAccuracy}%). Lesson ${Math.min(50, lesson.id + 1)} is now unlocked!`
                : `You scored ${accuracy}% accuracy. Standard requires ≥${lesson.minAccuracy}% to unlock Lesson ${lesson.id + 1}. Retype with focus on rhythm.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto font-mono">
            <div className="p-3 rounded-2xl bg-black/20">
              <span className="text-[10px] text-slate-400 uppercase block">Accuracy</span>
              <span className={`text-2xl font-black ${isPassed ? "text-emerald-400" : "text-rose-400"}`}>
                {accuracy}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20">
              <span className="text-[10px] text-slate-400 uppercase block">Speed</span>
              <span className="text-2xl font-black text-amber-500">{wpm} WPM</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/20">
              <span className="text-[10px] text-slate-400 uppercase block">Typos</span>
              <span className="text-2xl font-black text-slate-300">{mistakes}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={resetLesson}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition cursor-pointer"
            >
              Practice Again ↺
            </button>

            {isPassed && lesson.id < 50 && (
              <button
                onClick={() => onSelectLesson(lesson.id + 1)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Lesson {lesson.id + 1}</span>
                <ChevronRight size={14} />
              </button>
            )}

            <button
              onClick={onOpenCurriculum}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:border-amber-500 transition cursor-pointer"
            >
              Curriculum View (50 Lessons)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 3: STIKNEX ARCADE GAMES
 * =========================================================================================
 */
function StiknexArcadeGames({ theme, gameType, playKeySound, soundEnabled }) {
  const [fallingWords, setFallingWords] = useState([]);
  const [score, setScore] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef(null);

  const ARCADE_WORDS = [
    "matrix", "cyber", "syntax", "quantum", "vector", "engine", "stream",
    "cloud", "script", "neural", "pixel", "rocket", "hyper", "future",
    "logic", "server", "chrono", "atomic", "spark", "pulse", "stiknex"
  ];

  useEffect(() => {
    if (!isPlaying || gameType !== "falling") return;
    const interval = setInterval(() => {
      const text = ARCADE_WORDS[Math.floor(Math.random() * ARCADE_WORDS.length)];
      setFallingWords((prev) => [
        ...prev.slice(-6),
        { id: Date.now(), text, x: Math.floor(Math.random() * 70) + 10 }
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, gameType]);

  const handleInput = (e) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(e.target.value);
    playKeySound("key");

    if (gameType === "falling") {
      const matched = fallingWords.find((w) => w.text.toLowerCase() === val);
      if (matched) {
        playKeySound("space");
        setScore((s) => s + val.length * 20);
        setFallingWords((prev) => prev.filter((w) => w.id !== matched.id));
        setInputVal("");
      }
    }
  };

  const startArcade = () => {
    setIsPlaying(true);
    setScore(0);
    setFallingWords([]);
    setInputVal("");
    setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
  };

  if (gameType === "rush") {
    return (
      <StiknexSpeedStudio
        theme={theme}
        subMode="time"
        timeLimit={60}
        wordLimit={50}
        quoteLength="medium"
        hasPunctuation={false}
        hasNumbers={false}
        playKeySound={playKeySound}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div
      className={`w-full p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
        theme === "dark" ? "bg-[#202023] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Falling Words Matrix Arcade
          </h2>
          <p className="text-xs text-slate-400">
            Type floating targets before they escape orbit
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-base font-black font-mono text-amber-500">
            Score: {score}
          </span>
          <button
            onClick={() => (isPlaying ? setIsPlaying(false) : startArcade())}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              isPlaying
                ? "bg-rose-600 text-white"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
            }`}
          >
            {isPlaying ? "End Session" : "Start Game"}
          </button>
        </div>
      </div>

      <div
        className={`h-72 rounded-2xl border relative p-6 flex flex-wrap gap-4 items-center justify-center overflow-hidden ${
          theme === "dark" ? "bg-black/40 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}
      >
        {isPlaying ? (
          fallingWords.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 font-mono text-sm font-black text-amber-400 shadow-md animate-pulse"
            >
              {w.text}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-slate-400 space-y-2">
            <Gamepad2 className="w-10 h-10 mx-auto opacity-40 text-amber-500" />
            <p className="text-xs font-medium">Click &apos;Start Game&apos; above and type the descending words!</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={handleInput}
        disabled={!isPlaying}
        placeholder={isPlaying ? "Type matched word and press space..." : "Press Start Game above"}
        className="w-full px-5 py-3 rounded-2xl bg-black/20 border border-amber-500/30 text-center font-mono text-lg focus:outline-none focus:border-amber-400 text-white"
      />
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 4: STIKNEX DEVELOPER CODE STUDIO
 * =========================================================================================
 */
/**
 * =========================================================================================
 * SUB-VIEW 4: STIKNEX DEVELOPER CODE STUDIO (53 LANGUAGES x 50 SNIPPETS = 2,650 DRILLS)
 * =========================================================================================
 */
function StiknexCodeStudio({
  theme,
  activeLang,
  onSelectLang,
  pickerOpen,
  setPickerOpen,
  playKeySound,
  soundEnabled
}) {
  const currentLanguage = useMemo(() => {
    const query = (activeLang || "").toLowerCase();
    return (
      CODE_LANGUAGES.find(
        (s) => s.id === query || s.name.toLowerCase() === query || s.ext === query
      ) || CODE_LANGUAGES[0]
    );
  }, [activeLang]);

  // 50 authentic CS & algorithmic exercises for the active language
  const snippets = useMemo(() => {
    return getSnippetsForLanguage(currentLanguage);
  }, [currentLanguage]);

  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);

  // Reset to snippet 0 whenever switching language
  useEffect(() => {
    setActiveSnippetIdx(0);
  }, [currentLanguage.id]);

  const activeSnippet = useMemo(() => {
    return (
      snippets[activeSnippetIdx] ||
      snippets[0] || {
        id: 1,
        title: "1. Binary Search",
        file: `binary-search.${currentLanguage.ext}`,
        diff: "Easy",
        code: "// Code exercise\nconst x = 1;"
      }
    );
  }, [snippets, activeSnippetIdx, currentLanguage]);

  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [internalPickerOpen, setInternalPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Snippet Catalog Modal State (Browse all 50 exercises for this language)
  const [snippetModalOpen, setSnippetModalOpen] = useState(false);
  const [snippetSearch, setSnippetSearch] = useState("");
  const [snippetDiffFilter, setSnippetDiffFilter] = useState("All");

  const inputRef = useRef(null);
  const isModalOpen = pickerOpen !== undefined ? pickerOpen : internalPickerOpen;
  const setIsModalOpen = setPickerOpen !== undefined ? setPickerOpen : setInternalPickerOpen;

  const resetCodeSession = useCallback(() => {
    setTyped("");
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
    setIsComplete(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, []);

  useEffect(() => {
    resetCodeSession();
  }, [activeSnippet, resetCodeSession]);

  const categories = useMemo(() => {
    const set = new Set(CODE_LANGUAGES.map((l) => l.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredLanguages = useMemo(() => {
    return CODE_LANGUAGES.filter((lang) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lang.name.toLowerCase().includes(q) ||
        lang.category.toLowerCase().includes(q) ||
        lang.ext.toLowerCase().includes(q) ||
        lang.title.toLowerCase().includes(q);
      const matchesCat = selectedCat === "All" || lang.category === selectedCat;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCat]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const q = snippetSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.file.toLowerCase().includes(q);
      const matchesDiff = snippetDiffFilter === "All" || s.diff === snippetDiffFilter;
      return matchesSearch && matchesDiff;
    });
  }, [snippets, snippetSearch, snippetDiffFilter]);

  const handleKeyDown = (e) => {
    if (isComplete) return;

    if (e.key === "Escape") {
      e.preventDefault();
      resetCodeSession();
      return;
    }

    // Tab key inserts 2 spaces (indentation)
    if (e.key === "Tab") {
      e.preventDefault();
      if (!startTime) setStartTime(Date.now());
      playKeySound("key");
      const nextTyped = typed + "  ";
      setTyped(nextTyped);
      if (nextTyped.length >= activeSnippet.code.length) {
        setEndTime(Date.now());
        setIsComplete(true);
        playKeySound("success");
      }
      return;
    }

    // Enter key inserts newline (\n)
    if (e.key === "Enter") {
      e.preventDefault();
      if (!startTime) setStartTime(Date.now());
      playKeySound("space");
      const nextTyped = typed + "\n";
      setTyped(nextTyped);
      if (nextTyped.length >= activeSnippet.code.length) {
        setEndTime(Date.now());
        setIsComplete(true);
        playKeySound("success");
      }
      return;
    }

    // Backspace: single character or Ctrl/Alt multi-token delete
    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length > 0) {
        if (e.ctrlKey || e.altKey) {
          let i = typed.length - 1;
          while (i > 0 && /\s/.test(typed[i])) i--;
          while (i > 0 && !/\s/.test(typed[i - 1])) i--;
          setTyped(typed.slice(0, Math.max(0, i)));
        } else {
          setTyped((prev) => prev.slice(0, -1));
        }
        playKeySound("key");
      }
      return;
    }

    // Standard character input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!startTime) setStartTime(Date.now());
      const expectedChar = activeSnippet.code[typed.length];
      const isMismatch = e.key !== expectedChar;

      if (isMismatch) {
        setMistakes((m) => m + 1);
        playKeySound("error");
      } else {
        playKeySound(e.key === " " ? "space" : "key");
      }

      const nextTyped = typed + e.key;
      setTyped(nextTyped);

      if (nextTyped.length >= activeSnippet.code.length) {
        setEndTime(Date.now());
        setIsComplete(true);
        playKeySound("success");
      }
    }
  };

  const elapsedSeconds = useMemo(() => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    return Math.max(0.5, (end - startTime) / 1000);
  }, [startTime, endTime]);

  const elapsedMinutes = elapsedSeconds / 60;

  const wpm = useMemo(() => {
    if (elapsedMinutes <= 0 || typed.length === 0) return 0;
    const correctChars = Math.max(0, typed.length - mistakes);
    return Math.max(0, Math.round(correctChars / 5 / elapsedMinutes));
  }, [typed.length, mistakes, elapsedMinutes]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    const acc = Math.round(((typed.length - mistakes) / typed.length) * 100);
    return Math.max(0, Math.min(100, acc));
  }, [typed.length, mistakes]);

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(activeSnippet.code);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch {}
  };

  // Split snippet into lines to render line numbers and characters faithfully
  const lines = useMemo(() => {
    return activeSnippet.code.split("\n");
  }, [activeSnippet.code]);

  // Compute active line index for cursor tracking and subtle highlighting
  const activeLineIdx = useMemo(() => {
    let charCount = 0;
    for (let l = 0; l < lines.length; l++) {
      charCount += lines[l].length + 1;
      if (typed.length < charCount) return l;
    }
    return Math.max(0, lines.length - 1);
  }, [lines, typed.length]);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* ───────────────────────────────────────────────────────────
          1. REAL VS CODE / GITHUB DARK THEME CODE EDITOR WINDOW
      ──────────────────────────────────────────────────────────── */}
      <div
        onClick={() => inputRef.current && inputRef.current.focus()}
        className="w-full rounded-3xl border border-slate-700/80 dark:border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden font-mono text-slate-100 cursor-text select-none transition-all"
      >
        {/* Hidden textarea to capture keystrokes, tabs, and newlines */}
        <textarea
          ref={inputRef}
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute -left-[9999px] -top-[9999px]"
          autoFocus
        />

        {/* IDE Titlebar with Mac OS window dots and Snippet/Language Switchers */}
        <div className="bg-[#161b22] px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Window Controls, File Tab, and 50-Snippet Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-xs"></span>
            </div>

            {/* File & Topic Identifier */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
              <FileCode size={15} className="text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                {activeSnippet.file}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold hidden sm:inline border ${
                  activeSnippet.diff === "Easy"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : activeSnippet.diff === "Medium"
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                }`}
              >
                {activeSnippet.diff}
              </span>
            </div>

            {/* 50-Snippet Switcher Controls (< Ex X/50 >) */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-700/60">
              <button
                type="button"
                disabled={activeSnippetIdx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  playKeySound("key");
                  setActiveSnippetIdx((p) => Math.max(0, p - 1));
                }}
                title="Previous Snippet"
                className={`p-1 rounded-lg border text-xs transition cursor-pointer ${
                  activeSnippetIdx === 0
                    ? "opacity-30 border-slate-800 text-slate-600 cursor-not-allowed"
                    : "border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-400 bg-slate-800/60"
                }`}
              >
                <ChevronLeft size={13} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playKeySound("key");
                  setSnippetModalOpen(true);
                }}
                title="Click to view and search all 50 code exercises for this language"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 text-xs font-bold font-mono transition cursor-pointer"
              >
                <span>Snippet {activeSnippetIdx + 1}/50</span>
                <ChevronDown size={12} />
              </button>

              <button
                type="button"
                disabled={activeSnippetIdx >= snippets.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  playKeySound("key");
                  setActiveSnippetIdx((p) => Math.min(snippets.length - 1, p + 1));
                }}
                title="Next Snippet"
                className={`p-1 rounded-lg border text-xs transition cursor-pointer ${
                  activeSnippetIdx >= snippets.length - 1
                    ? "opacity-30 border-slate-800 text-slate-600 cursor-not-allowed"
                    : "border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-400 bg-slate-800/60"
                }`}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Right: Searchable Language Selector & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Searchable Language Dropdown Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playKeySound("key");
                setIsModalOpen(true);
              }}
              title="Click to switch language (53 available with live search)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
            >
              <Code2 size={13} className="text-amber-400" />
              <span>{currentLanguage.name}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-mono">
                53 Langs
              </span>
              <ChevronDown size={13} />
            </button>

            {/* Copy Snippet Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyCode();
              }}
              title="Copy code to clipboard"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              {copiedSnippet ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {/* Quick Restart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetCodeSession();
              }}
              title="Restart Snippet (Esc)"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="bg-[#12161c] px-4 sm:px-6 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Speed:</span>
              <strong className="text-amber-400 font-black text-sm">{wpm} WPM</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span>Accuracy:</span>
              <strong className={`font-black text-sm ${accuracy >= 90 ? "text-emerald-400" : "text-rose-400"}`}>
                {accuracy}%
              </strong>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span>Progress:</span>
              <strong className="text-slate-200">
                {Math.round((typed.length / activeSnippet.code.length) * 100)}%
              </strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-500">
              <span>Topic:</span>
              <span className="text-slate-300 font-bold">{activeSnippet.title}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Typos: <strong className="text-rose-400">{mistakes}</strong></span>
            <span>•</span>
            <span>Tab: 2 spaces</span>
            <span>•</span>
            <span>Esc: reset</span>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────
            2. HIGH-CONTRAST INLINE CODE TYPING CANVAS WITH LINE NUMBERS
        ──────────────────────────────────────────────────────────── */}
        <div className="p-4 sm:p-6 overflow-x-auto min-h-[260px] bg-[#0d1117]">
          <div className="flex font-mono text-sm sm:text-base leading-[1.8] min-w-fit">
            {/* Left: Line Numbers */}
            <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 flex flex-col shrink-0 w-9 sm:w-11">
              {lines.map((_, lIdx) => (
                <span
                  key={lIdx}
                  className={`block transition-colors ${
                    lIdx === activeLineIdx ? "text-amber-400 font-bold" : "text-slate-600"
                  }`}
                >
                  {lIdx + 1}
                </span>
              ))}
            </div>

            {/* Right: Code Characters Stream with High Contrast */}
            <div className="pl-4 sm:pl-6 whitespace-pre font-mono flex-1">
              {(() => {
                let globalCharIndex = 0;
                return lines.map((line, lineIdx) => {
                  const lineChars = line.split("");
                  const lineStartIndex = globalCharIndex;
                  const isCurrentLine = lineIdx === activeLineIdx;

                  const renderedLine = (
                    <div
                      key={lineIdx}
                      className={`relative block min-h-[1.8em] transition-colors ${
                        isCurrentLine ? "bg-amber-500/5 -mx-2 px-2 rounded-xs" : ""
                      }`}
                    >
                      {lineChars.map((ch, cIdx) => {
                        const curGlobalIdx = lineStartIndex + cIdx;
                        const isTyped = curGlobalIdx < typed.length;
                        const isCurrentCursor = curGlobalIdx === typed.length;
                        const typedChar = typed[curGlobalIdx];
                        const isMatch = typedChar === ch;

                        let charClasses = "text-slate-300 dark:text-slate-300";
                        if (isTyped) {
                          charClasses = isMatch
                            ? "text-emerald-400 font-bold bg-emerald-500/10 rounded-xs"
                            : "text-rose-300 bg-rose-600/40 rounded-xs font-bold border-b border-rose-500";
                        }

                        return (
                          <React.Fragment key={cIdx}>
                            {isCurrentCursor && (
                              <span className="w-[3px] h-[1.25em] bg-amber-400 inline-block align-middle animate-pulse rounded-full -mr-[3px] shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                            )}
                            <span className={charClasses}>{ch}</span>
                          </React.Fragment>
                        );
                      })}

                      {/* Cursor at end of line if current position is the newline */}
                      {typed.length === lineStartIndex + lineChars.length && (
                        <span className="w-[3px] h-[1.25em] bg-amber-400 inline-block align-middle animate-pulse rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                      )}
                    </div>
                  );

                  // Increment globalCharIndex by line length + 1 for \n
                  globalCharIndex += line.length + 1;
                  return renderedLine;
                });
              })()}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────
            3. COMPLETION BANNER WITH STATS & ADVANCE TO NEXT SNIPPET
        ──────────────────────────────────────────────────────────── */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border-t border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h4 className="font-black text-white text-base">
                  Snippet {activeSnippetIdx + 1} of 50 Mastered!
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Velocity: <strong className="text-amber-400">{wpm} WPM</strong> • Accuracy:{" "}
                <strong className="text-emerald-400">{accuracy}%</strong> • Completed in{" "}
                <strong className="text-slate-200">{elapsedSeconds.toFixed(1)}s</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetCodeSession();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Practice Again ↺
              </button>

              {activeSnippetIdx < snippets.length - 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playKeySound("key");
                    setActiveSnippetIdx((p) => p + 1);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>Proceed to Snippet {activeSnippetIdx + 2}</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSnippetModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
                >
                  All 50 Completed! Browse ▾
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-amber-500/60 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Switch Language ▾
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. 50-SNIPPET CATALOG MODAL (Choose Any of the 50 Snippets)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {snippetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSnippetModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative w-full max-w-3xl rounded-3xl p-5 sm:p-6 z-10 max-h-[85vh] flex flex-col border shadow-2xl ${
                theme === "dark"
                  ? "bg-[#18181b] border-slate-800 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
                    <FileCode size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">
                      {currentLanguage.name} Code Library (50 Exercises)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select from 50 authentic CS algorithms and idioms in {currentLanguage.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSnippetModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search & Difficulty Filter Bar */}
              <div className="py-3 shrink-0 space-y-2">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={snippetSearch}
                    onChange={(e) => setSnippetSearch(e.target.value)}
                    placeholder="Search 50 snippets (e.g. binary search, quick sort, lru cache, fibonacci)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-sm font-sans focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  {snippetSearch && (
                    <button
                      onClick={() => setSnippetSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-2">
                  {["All", "Easy", "Medium", "Hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSnippetDiffFilter(diff)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        snippetDiffFilter === diff
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-amber-500"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Snippet Grid */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
                {filteredSnippets.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No exercises matching "{snippetSearch}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSnippets.map((s, idx) => {
                      const actualIdx = snippets.findIndex((item) => item.id === s.id);
                      const isSelected = actualIdx === activeSnippetIdx;

                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            playKeySound("key");
                            setActiveSnippetIdx(actualIdx);
                            setSnippetModalOpen(false);
                          }}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 text-amber-500 shadow-xs"
                              : theme === "dark"
                              ? "bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40 text-slate-200"
                              : "bg-slate-50 border-slate-200 hover:border-amber-500/40 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 shrink-0">
                              {s.id < 10 ? `0${s.id}` : s.id}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-xs block truncate">{s.title}</span>
                              <span className="text-[10px] font-mono text-slate-500 truncate block">
                                {s.file}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                                s.diff === "Easy"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : s.diff === "Medium"
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                  : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                              }`}
                            >
                              {s.diff}
                            </span>
                            {isSelected && <Check size={14} className="text-amber-500" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
                <span>Showing {filteredSnippets.length} of 50 exercises</span>
                <button
                  onClick={() => setSnippetModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          5. SEARCHABLE 53 LANGUAGES MODAL DROPDOWN
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative w-full max-w-3xl rounded-3xl p-5 sm:p-6 z-10 max-h-[85vh] flex flex-col border shadow-2xl ${
                theme === "dark"
                  ? "bg-[#18181b] border-slate-800 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Select Programming Language</h3>
                    <p className="text-xs text-slate-400">
                      53 authentic language environments • Each equipped with 50 CS exercises
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="py-3 shrink-0">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 53 languages (e.g. Rust, Python, Go, Java, SQL, C++, Swift)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-sm font-sans focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCat(cat)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                        selectedCat === cat
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-amber-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages Scrollable Grid */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
                {filteredLanguages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No programming language matching "{searchQuery}". Try searching for another name or extension.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredLanguages.map((lang) => {
                      const isSelected =
                        lang.id === currentLanguage.id || lang.name === currentLanguage.name;

                      return (
                        <button
                          key={lang.id}
                          onClick={() => {
                            playKeySound("key");
                            onSelectLang(lang.id);
                            setIsModalOpen(false);
                          }}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 text-amber-500 shadow-xs"
                              : theme === "dark"
                              ? "bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40 text-slate-200"
                              : "bg-slate-50 border-slate-200 hover:border-amber-500/40 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-black text-xs flex items-center gap-1.5">
                              <span>{lang.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono">
                                .{lang.ext}
                              </span>
                            </span>
                            {isSelected && <Check size={14} className="text-amber-500 shrink-0" />}
                          </div>

                          <div className="text-[11px] text-slate-400 truncate">
                            {lang.title}
                          </div>

                          <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                            <span>{lang.category}</span>
                            <span className="text-amber-400 font-bold">50 Snippets</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
                <span>Showing {filteredLanguages.length} of 53 languages</span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 5: STIKNEX ACCURACY BENCHMARK
 * =========================================================================================
 */
function StiknexAccuracyBenchmark({ theme, playKeySound, soundEnabled }) {
  return (
    <StiknexSpeedStudio
      theme={theme}
      subMode="words"
      timeLimit={60}
      wordLimit={50}
      quoteLength="medium"
      hasPunctuation={true}
      hasNumbers={false}
      playKeySound={playKeySound}
      soundEnabled={soundEnabled}
    />
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 6: STIKNEX KEYBOARD SWITCH TESTER
 * =========================================================================================
 */
function StiknexKeySwitchTester({ theme, playKeySound, soundEnabled }) {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [activeKey, setActiveKey] = useState(null);
  const [keystrokeCount, setKeystrokeCount] = useState(0);

  useEffect(() => {
    const handleDown = (e) => {
      e.preventDefault();
      playKeySound("key");
      setActiveKey({ key: e.key, code: e.code, which: e.which });
      setKeystrokeCount((c) => c + 1);
      setPressedKeys((prev) => new Set([...prev, e.code]));
    };
    window.addEventListener("keydown", handleDown);
    return () => window.removeEventListener("keydown", handleDown);
  }, [playKeySound]);

  const ROWS = [
    ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
    ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
    ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
    ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
    ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ControlRight"]
  ];

  return (
    <div
      className={`w-full p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
        theme === "dark" ? "bg-[#202023] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Keyboard Switch Tester
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test actuation, keycodes &amp; detect key ghosting
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-amber-500">
            Keys Tested: {pressedKeys.size} • Keystrokes: {keystrokeCount}
          </span>
          <button
            onClick={() => {
              setPressedKeys(new Set());
              setActiveKey(null);
              setKeystrokeCount(0);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Clear Matrix
          </button>
        </div>
      </div>

      {activeKey ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 block">Active Switch</span>
          <div className="text-3xl font-black font-mono text-amber-400">
            {activeKey.key === " " ? "Spacebar" : activeKey.key}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Code: <span className="text-white font-bold">{activeKey.code}</span> • KeyCode: {activeKey.which}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-black/20 border border-dashed border-slate-700 text-center text-xs text-slate-400">
          Press any key on your keyboard to test hardware switch actuation...
        </div>
      )}

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] flex flex-col gap-1.5 p-4 rounded-2xl bg-black/30 border border-slate-800">
          {ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map((code) => {
                const isPressed = pressedKeys.has(code);
                const isCurrent = activeKey && activeKey.code === code;
                const label = code
                  .replace("Key", "")
                  .replace("Digit", "")
                  .replace("Left", "")
                  .replace("Right", "");

                return (
                  <div
                    key={code}
                    className={`h-9 px-2.5 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center transition border ${
                      isCurrent
                        ? "bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-md"
                        : isPressed
                        ? "bg-emerald-500/30 text-emerald-400 border-emerald-500/50"
                        : theme === "dark"
                        ? "bg-white/5 border-white/5 text-slate-400"
                        : "bg-white border-slate-300 text-slate-700"
                    } ${code === "Space" ? "w-64" : code === "Backspace" || code === "Enter" ? "w-20" : code === "ShiftLeft" || code === "ShiftRight" ? "w-24" : "min-w-[36px]"}`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * =========================================================================================
 * SUB-VIEW 7: SHORTCUT DIRECTORY
 * =========================================================================================
 */
function StiknexShortcutDirectory({ theme }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const filtered = SHORTCUTS_DATA.filter((s) => {
    const matchCat = activeCat === "all" || s.cat.toLowerCase() === activeCat.toLowerCase();
    const matchQuery =
      s.action.toLowerCase().includes(query.toLowerCase()) ||
      s.keys.toLowerCase().includes(query.toLowerCase()) ||
      s.cat.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div
      className={`w-full p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
        theme === "dark" ? "bg-[#202023] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Keyboard Shortcuts Cheat Sheet
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            VS Code, Chrome, Windows &amp; Figma workflow accelerators
          </p>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter shortcuts..."
          className="px-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "VS Code", "Chrome", "Windows", "Figma"].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCat.toLowerCase() === c.toLowerCase()
                ? "bg-amber-500 text-slate-950 font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-black/20"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                {item.cat}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.action}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-slate-200 dark:bg-white/10 text-amber-500">
              {item.keys}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Backwards-compatible export
export function TypingSpeedTest(props) {
  return <TypingEngine {...props} />;
}
