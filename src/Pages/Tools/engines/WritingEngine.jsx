import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  FileText,
  AlignLeft,
  Type,
  Trash2,
  Clock,
  BarChart2,
  Sliders,
  ArrowUpDown,
  Shuffle,
  Download,
  Share2,
  CheckCircle2,
  Hash,
  BookOpen,
  Layers,
  ArrowRight,
  Bookmark,
  TrendingUp
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { formatDateDDMMYYYY, formatHistoryTimestamp } from "../../../utils/dateFormat";

/**
 * Universal Enterprise Text & Content Intelligence Workstation
 * Consolidates all 10 Writing & Editing Tools into an expansive, full-page workstation:
 * - Word Counter & Character Counter
 * - Case Converter (UPPER, lower, Title, camel, Pascal, snake, kebab, alternating)
 * - Clean & Sanitize (Remove extra spaces, duplicate lines, blank lines, strip HTML, remove emojis)
 * - Find & Replace (Live matches, case sensitivity, whole word, regex support)
 * - Sort & Reverser (Sort A-Z, Z-A, line length, reverse text, reverse words)
 * - URL Slug Generator & Lorem Ipsum Generator
 * - Reading Time & Speaking Time metrics with Readability level
 */

const RELATED_WRITING_TOOLS = [
  { slug: "word-counter", title: "Word Counter", icon: "fa-solid fa-file-lines", desc: "Comprehensive words, chars, reading & speaking metrics" },
  { slug: "character-counter", title: "Character Counter", icon: "fa-solid fa-i-cursor", desc: "Real-time character, byte, and social media limits" },
  { slug: "case-converter", title: "Case Converter", icon: "fa-solid fa-font", desc: "Transform between UPPER, lower, Title, camel, snake cases" },
  { slug: "text-diff-checker", title: "Text Diff Checker", icon: "fa-solid fa-code-compare", desc: "Side-by-side visual difference and line changes" },
  { slug: "markdown-editor", title: "Markdown Editor", icon: "fa-brands fa-markdown", desc: "Live preview split editor with instant HTML export" },
  { slug: "reading-time-calculator", title: "Reading Time Calculator", icon: "fa-solid fa-book-open-reader", desc: "Estimate silent reading and spoken presentation times" },
  { slug: "morse-code-translator", title: "Morse Code Translator", icon: "fa-solid fa-tower-broadcast", desc: "Translate and play real Web Audio morse beeps" }
];

const SAMPLE_TEXT = `Welcome to Stiknex Text Studio — your high-performance writing and text intelligence workspace.

Whether you are drafting articles, formatting code variables, analyzing readability, or sanitizing messy logs, this full-screen workstation provides everything in one unified dashboard:
- Instant word and character counts with social media limits (Twitter, LinkedIn, Meta SEO tags).
- One-click case transformations between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.
- Automated sanitization: trim extra whitespace, deduplicate repeating lines, and strip HTML tags.
- Built-in Find and Replace with live match tracking and regex support.

Everything runs 100% in your browser for absolute privacy and zero server latency. Start typing or pasting your content to see real-time updates!`;

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean || clean.length <= 3) return 1;
  const replaced = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");
  const matches = replaced.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export default function WritingEngine({ slug = "word-counter", toolId = "word-counter", tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();

  // Determine initial active sub-mode based on the route slug
  const initialMode = useMemo(() => {
    if (slug === "case-converter" || toolId === "case-converter") return "case";
    if (slug === "find-and-replace" || toolId === "find-and-replace") return "find-replace";
    if (
      slug === "remove-extra-spaces" ||
      slug === "remove-duplicate-lines" ||
      slug === "text-cleaner" ||
      toolId === "remove-extra-spaces" ||
      toolId === "remove-duplicate-lines" ||
      toolId === "text-cleaner"
    ) return "clean";
    if (
      slug === "sort-lines" ||
      slug === "text-reverser" ||
      slug === "slug-generator" ||
      slug === "lorem-ipsum-generator" ||
      toolId === "sort-lines" ||
      toolId === "text-reverser" ||
      toolId === "slug-generator" ||
      toolId === "lorem-ipsum-generator"
    ) return "sort-slug";
    return "stats";
  }, [slug, toolId]);

  // Dynamic Tool Title & Metadata based on the current slug
  const titleConfig = useMemo(() => {
    switch (slug) {
      case "word-counter":
        return { prefix: "Word", highlight: "Counter", tag: "Analysis Engine", subtitle: "Live word, character & readability metrics" };
      case "character-counter":
        return { prefix: "Character", highlight: "Counter", tag: "Precision Metrics", subtitle: "Exact character, space & social media limits" };
      case "case-converter":
        return { prefix: "Case", highlight: "Converter", tag: "Text Formatter", subtitle: "Instant uppercase, camelCase, snake_case & more" };
      case "reading-time-calculator":
        return { prefix: "Reading Time", highlight: "Calculator", tag: "Pacing Engine", subtitle: "Speech & silent reading duration estimates" };
      case "remove-extra-spaces":
        return { prefix: "Remove", highlight: "Spaces", tag: "Sanitizer", subtitle: "Trim multiple whitespaces & clean formatting" };
      case "remove-duplicate-lines":
        return { prefix: "Remove", highlight: "Duplicates", tag: "Deduplicator", subtitle: "Extract unique lines from lists & logs" };
      case "sort-lines":
        return { prefix: "Sort", highlight: "Lines", tag: "Organizer", subtitle: "Alphabetical, length & custom line sorting" };
      case "find-and-replace":
        return { prefix: "Find &", highlight: "Replace", tag: "Text Utility", subtitle: "Regex, match case & bulk replacement engine" };
      case "slug-generator":
        return { prefix: "Slug", highlight: "Generator", tag: "SEO Utility", subtitle: "Clean URL slugs for blogs & web applications" };
      case "lorem-ipsum-generator":
        return { prefix: "Lorem", highlight: "Ipsum", tag: "Text Generator", subtitle: "Instant placeholder dummy paragraphs & words" };
      case "text-reverser":
        return { prefix: "Text", highlight: "Reverser", tag: "Manipulator", subtitle: "Reverse letters, words & line sequences" };
      case "text-cleaner":
        return { prefix: "Text", highlight: "Cleaner", tag: "Sanitizer", subtitle: "Strip HTML tags, symbols & line breaks" };
      default:
        return { prefix: "Text", highlight: "Studio", tag: "Writing Engine", subtitle: "Word count, formatting & text intelligence" };
    }
  }, [slug]);

  // Master text state
  const [text, setText] = useState(SAMPLE_TEXT);
  const [mode, setMode] = useState(initialMode);

  // Sync mode if route slug changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Find & Replace state
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [replaceNotice, setReplaceNotice] = useState("");

  // UI States
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileStatsOpen, setMobileStatsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [companionTab, setCompanionTab] = useState("metrics"); // 'metrics' | 'history'

  // Web Audio Tactile Click Sound
  const audioCtxRef = useRef(null);
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(560, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, audioCtxRef.current.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {
      // AudioContext
    }
  }, [soundEnabled]);

  // Saved Snapshots History (Persisted in localStorage)
  const [snapshots, setSnapshots] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_writing_snapshots");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveSnapshot = useCallback((customTitle = "") => {
    if (!text.trim()) return;
    playClickSound();
    const wordsCount = text.trim().split(/\s+/).filter(Boolean).length;
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      title: customTitle || (text.slice(0, 32).trim() + "..."),
      text,
      words: wordsCount,
      chars: text.length
    };
    setSnapshots((prev) => {
      const updated = [newEntry, ...prev.slice(0, 19)];
      try {
        localStorage.setItem("stiknex_writing_snapshots", JSON.stringify(updated));
      } catch {
        // quota
      }
      return updated;
    });
  }, [text, playClickSound]);

  const deleteSnapshot = (id, e) => {
    e?.stopPropagation();
    playClickSound();
    setSnapshots((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem("stiknex_writing_snapshots", JSON.stringify(updated));
      } catch {
        // quota
      }
      return updated;
    });
  };

  const clearSnapshots = () => {
    playClickSound();
    setSnapshots([]);
    localStorage.removeItem("stiknex_writing_snapshots");
  };

  // Live Comprehensive Text Analytics
  const analytics = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const words = wordsArray.length;
    const characters = raw.length;
    const charactersNoSpaces = raw.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const lines = raw ? raw.split("\n").length : 0;

    // Reading time @ 200 WPM
    const readingTotalSeconds = Math.round((words / 200) * 60);
    const readingMin = Math.floor(readingTotalSeconds / 60);
    const readingSec = readingTotalSeconds % 60;
    const readingTimeStr = words === 0 ? "0 sec" : readingMin > 0 ? `${readingMin}m ${readingSec}s` : `${readingSec}s`;

    // Speaking time @ 130 WPM
    const speakingTotalSeconds = Math.round((words / 130) * 60);
    const speakingMin = Math.floor(speakingTotalSeconds / 60);
    const speakingSec = speakingTotalSeconds % 60;
    const speakingTimeStr = words === 0 ? "0 sec" : speakingMin > 0 ? `${speakingMin}m ${speakingSec}s` : `${speakingSec}s`;

    // Average lengths
    const avgWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;
    const avgSentenceLength = sentences > 0 ? Math.round(words / sentences) : 0;

    // Readability: Flesch Reading Ease
    let totalSyllables = 0;
    wordsArray.forEach((w) => {
      totalSyllables += countSyllables(w);
    });
    let fleschScore = 100;
    let readabilityLabel = "Easy";
    let readabilityColor = "text-emerald-500";
    if (words > 5 && sentences > 0) {
      const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words);
      fleschScore = Math.min(100, Math.max(0, Math.round(score)));
      if (fleschScore >= 80) {
        readabilityLabel = "Very Easy (Grade 5-6)";
        readabilityColor = "text-emerald-500";
      } else if (fleschScore >= 60) {
        readabilityLabel = "Standard / Plain (Grade 8-9)";
        readabilityColor = "text-indigo-500";
      } else if (fleschScore >= 40) {
        readabilityLabel = "Fairly Difficult (High School)";
        readabilityColor = "text-amber-500";
      } else {
        readabilityLabel = "Complex / Academic";
        readabilityColor = "text-rose-500";
      }
    }

    // Top Keywords Density
    const freqMap = {};
    const stopWords = new Set(["the", "and", "is", "in", "to", "of", "a", "that", "it", "with", "as", "for", "on", "was", "at", "by", "an", "be", "this", "which", "or", "from"]);
    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length >= 3 && !stopWords.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword, count]) => ({
        keyword,
        count,
        percent: ((count / Math.max(1, words)) * 100).toFixed(1)
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeStr,
      speakingTimeStr,
      avgWordLength,
      avgSentenceLength,
      fleschScore,
      readabilityLabel,
      readabilityColor,
      topKeywords
    };
  }, [text]);

  // Live Find & Replace Match Count
  const matchesCount = useMemo(() => {
    if (!findQuery.trim() || !text) return 0;
    try {
      let pattern = findQuery;
      if (!useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      if (matchWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = caseSensitive ? "g" : "gi";
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [findQuery, text, caseSensitive, useRegex, matchWholeWord]);

  // Instant Copy Handler
  const handleCopy = (customText = null) => {
    const toCopy = customText !== null ? customText : text;
    if (!toCopy) return;
    playClickSound();
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download text file
  const handleDownload = (format = "txt") => {
    playClickSound();
    const blob = new Blob([text], { type: format === "md" ? "text/markdown" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stiknex-notes-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // TRANSFORMATION ACTIONS (1-CLICK EXECUTION)
  // ============================================================================
  const applyTransform = (transformFn, label = "") => {
    playClickSound();
    setText((prev) => transformFn(prev));
  };

  // Case transforms
  const toUpper = () => applyTransform((t) => t.toUpperCase(), "UPPERCASE");
  const toLower = () => applyTransform((t) => t.toLowerCase(), "lowercase");
  const toTitle = () =>
    applyTransform((t) =>
      t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      "Title Case"
    );
  const toSentenceCase = () =>
    applyTransform((t) =>
      t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      "Sentence case"
    );
  const toCamel = () =>
    applyTransform((t) => {
      const words = t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim().split(/\s+/).filter(Boolean);
      return words.map((w, idx) => (idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join("");
    }, "camelCase");
  const toPascal = () =>
    applyTransform((t) => {
      const words = t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim().split(/\s+/).filter(Boolean);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    }, "PascalCase");
  const toSnake = () =>
    applyTransform((t) =>
      t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""),
      "snake_case"
    );
  const toKebab = () =>
    applyTransform((t) =>
      t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      "kebab-case"
    );
  const toAlternating = () =>
    applyTransform((t) =>
      t.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join(""),
      "aLtErNaTiNg"
    );

  // Cleaners
  const trimExtraSpaces = () =>
    applyTransform((t) =>
      t.replace(/[ \t]+/g, " ").replace(/^\s+|\s+$/gm, ""),
      "Trim Spaces"
    );
  const removeDuplicateLines = () =>
    applyTransform((t) => {
      const lines = t.split("\n");
      return [...new Set(lines)].join("\n");
    }, "Remove Duplicates");
  const removeEmptyLines = () =>
    applyTransform((t) =>
      t.split("\n").filter((l) => l.trim().length > 0).join("\n"),
      "Remove Empty Lines"
    );
  const stripHtmlTags = () =>
    applyTransform((t) => t.replace(/<[^>]*>/g, ""), "Strip HTML");
  const removeEmojis = () =>
    applyTransform((t) =>
      t.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ""),
      "Remove Emojis"
    );

  // Sorters & Generators
  const sortLinesAsc = () =>
    applyTransform((t) =>
      t.split("\n").sort((a, b) => a.localeCompare(b)).join("\n"),
      "Sort A-Z"
    );
  const sortLinesDesc = () =>
    applyTransform((t) =>
      t.split("\n").sort((a, b) => b.localeCompare(a)).join("\n"),
      "Sort Z-A"
    );
  const sortLinesLength = () =>
    applyTransform((t) =>
      t.split("\n").sort((a, b) => a.length - b.length).join("\n"),
      "Sort by Length"
    );
  const reverseLines = () =>
    applyTransform((t) => t.split("\n").reverse().join("\n"), "Reverse Lines");
  const reverseCharacters = () =>
    applyTransform((t) => t.split("").reverse().join(""), "Reverse Text");
  const reverseWords = () =>
    applyTransform((t) =>
      t.split("\n").map((line) => line.split(/\s+/).reverse().join(" ")).join("\n"),
      "Reverse Words"
    );
  const generateSlug = () =>
    applyTransform((t) =>
      t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
      "Slugify"
    );

  const insertLorem = (count = 100) => {
    playClickSound();
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const loremStr = words.join(" ").charAt(0).toUpperCase() + words.join(" ").slice(1) + ".";
    setText((prev) => (prev ? prev + "\n\n" + loremStr : loremStr));
  };

  // Find & Replace Execute
  const handleReplace = (all = true) => {
    if (!findQuery || !text) return;
    playClickSound();
    try {
      let pattern = findQuery;
      if (!useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      if (matchWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = (caseSensitive ? "" : "i") + (all ? "g" : "");
      const regex = new RegExp(pattern, flags);
      const replaced = text.replace(regex, replaceQuery);
      setText(replaced);
      setReplaceNotice(all ? `Replaced ${matchesCount} occurrence(s)` : "Replaced next occurrence");
      setTimeout(() => setReplaceNotice(""), 3000);
    } catch (err) {
      setReplaceNotice("Invalid regular expression");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 dark:bg-[#070b14] flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white pb-8">
      
      {/* Universal Stiknex Sidebar Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_WRITING_TOOLS}
        categoryTitle="Related Writing & Text Tools"
      />

      {/* ══════════════════════════════════════════════════════════════════
          UNIFIED TOP NAVIGATION BAR (SLEEK FROSTED GLASS)
      ══════════════════════════════════════════════════════════════════ */}
      <header className="w-full px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-30 transition-colors">
        
        {/* Left: Drawer Trigger + Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Open Tools Navigation Drawer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  <span>{titleConfig.prefix}</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    {titleConfig.highlight}
                  </span>
                </h2>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 tracking-wider uppercase">
                  {titleConfig.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5 truncate max-w-[240px] 2xl:max-w-none">
                {titleConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center Space: Intentionally Clean & Dedicated (NO UNRELATED CROSS-TOOL TABS) */}
        <div className="hidden lg:flex items-center text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/10 dark:bg-slate-800/40 border border-slate-700/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Stiknex 100% Client-Side Private Engine
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help & Benchmarks Dialog Trigger */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Writing Guide & Benchmarks (?)"
            aria-label="Open Writing Guide & Benchmarks"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mobile Metrics Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileStatsOpen(true);
            }}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="View Live Analytics & Metrics"
          >
            <BarChart2 className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Toggle theme"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Clear / Reset (AC) */}
          <button
            onClick={() => {
              playClickSound();
              setText("");
            }}
            className="px-3 h-9 sm:h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
            title="Clear text (AC)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Copy All */}
          <button
            onClick={() => handleCopy()}
            className="px-3.5 h-9 sm:h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
            title="Copy all text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN EXPANSIVE DUAL-STATION WORKSTATION (FULL PAGE ON DESKTOP)
      ══════════════════════════════════════════════════════════════════ */}
      <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* Full-Width 12-Column Grid on Desktop */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT / PRIMARY EDITING TERMINAL (8 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
            


            {/* Quick 1-Click Transformation Pills Bar */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 shrink-0">
                Quick Actions:
              </span>
              <button
                onClick={toUpper}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                UPPERCASE
              </button>
              <button
                onClick={toLower}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                lowercase
              </button>
              <button
                onClick={toTitle}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                Title Case
              </button>
              <button
                onClick={toCamel}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                camelCase
              </button>
              <button
                onClick={toSnake}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                snake_case
              </button>
              <button
                onClick={trimExtraSpaces}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 transition shrink-0 cursor-pointer"
              >
                Trim Spaces
              </button>
              <button
                onClick={removeDuplicateLines}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 transition shrink-0 cursor-pointer"
              >
                Dedupe Lines
              </button>
              <button
                onClick={sortLinesAsc}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                Sort A-Z
              </button>
              <button
                onClick={generateSlug}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
              >
                Slugify
              </button>
              <button
                onClick={() => insertLorem(100)}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 transition shrink-0 cursor-pointer"
              >
                + Lorem 100w
              </button>
            </div>

            {/* Main Interactive Editor Card */}
            <div className="flex-1 flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
              
              {/* Editor Header Bar */}
              <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                    <AlignLeft className="w-3.5 h-3.5 text-indigo-500" />
                    Editor
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {analytics.lines} lines • {analytics.words} words
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveSnapshot()}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Save Snapshot to History"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload("txt")}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Download as .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setText(SAMPLE_TEXT);
                    }}
                    className="px-2 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  >
                    Sample Text
                  </button>
                </div>
              </div>

              {/* Textarea Area */}
              <div className="relative flex-1 p-4 sm:p-5 flex flex-col min-h-[360px] lg:min-h-[460px]">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here to begin writing and real-time analysis..."
                  className="w-full flex-1 bg-transparent border-0 outline-hidden resize-none font-sans text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  spellCheck="false"
                />

                {/* Bottom Editor Watermark Stat */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>Characters: <strong className="text-slate-700 dark:text-slate-300">{analytics.characters}</strong></span>
                    <span>No Spaces: <strong className="text-slate-700 dark:text-slate-300">{analytics.charactersNoSpaces}</strong></span>
                    <span>Words: <strong className="text-slate-700 dark:text-slate-300">{analytics.words}</strong></span>
                  </div>
                  <span className="hidden sm:inline font-mono">100% Client-Side Private</span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                MODE-SPECIFIC INTERACTIVE ACTION PANELS
            ══════════════════════════════════════════════════════════════ */}

            {/* MODE: CASE CONVERTER */}
            {mode === "case" && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Instant Case Transformations
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Click any card to apply or copy</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "UPPERCASE", fn: toUpper, desc: "ALL CAPITAL LETTERS" },
                    { label: "lowercase", fn: toLower, desc: "all small letters" },
                    { label: "Title Case", fn: toTitle, desc: "Capitalize Every Word" },
                    { label: "Sentence case", fn: toSentenceCase, desc: "Capitalize first word" },
                    { label: "camelCase", fn: toCamel, desc: "developerCamelCase" },
                    { label: "PascalCase", fn: toPascal, desc: "DeveloperPascalCase" },
                    { label: "snake_case", fn: toSnake, desc: "words_with_underscores" },
                    { label: "kebab-case", fn: toKebab, desc: "words-with-hyphens" },
                    { label: "aLtErNaTiNg", fn: toAlternating, desc: "rAnDoM cApItAlS" }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.fn}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-700 text-left transition cursor-pointer group"
                    >
                      <span className="block text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MODE: FIND & REPLACE */}
            {mode === "find-replace" && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Find &amp; Replace Engine
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    {matchesCount} match{matchesCount === 1 ? "" : "es"} found
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Find Text / Regex
                    </label>
                    <input
                      type="text"
                      value={findQuery}
                      onChange={(e) => setFindQuery(e.target.value)}
                      placeholder="Search for words or pattern..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Replace With
                    </label>
                    <input
                      type="text"
                      value={replaceQuery}
                      onChange={(e) => setReplaceQuery(e.target.value)}
                      placeholder="Replacement text..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Option Checkboxes & Replace Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Match Case</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={matchWholeWord}
                        onChange={(e) => setMatchWholeWord(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Whole Words</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useRegex}
                        onChange={(e) => setUseRegex(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Regex Pattern</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReplace(false)}
                      disabled={matchesCount === 0}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                    >
                      Replace Next
                    </button>
                    <button
                      onClick={() => handleReplace(true)}
                      disabled={matchesCount === 0}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Replace All ({matchesCount})
                    </button>
                  </div>
                </div>

                {replaceNotice && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {replaceNotice}
                  </p>
                )}
              </div>
            )}

            {/* MODE: CLEAN & SANITIZE */}
            {mode === "clean" && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Sanitize &amp; Clean Workspace
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">1-click automated cleanup</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={trimExtraSpaces}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      Trim Extra Spaces
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Collapse multiple whitespace into 1
                    </span>
                  </button>

                  <button
                    onClick={removeDuplicateLines}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      Remove Duplicate Lines
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Deduplicate unique lines in list
                    </span>
                  </button>

                  <button
                    onClick={removeEmptyLines}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      Remove Empty Lines
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Strip trailing &amp; blank line breaks
                    </span>
                  </button>

                  <button
                    onClick={stripHtmlTags}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      Strip HTML / XML Tags
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Extract raw text without markup
                    </span>
                  </button>

                  <button
                    onClick={removeEmojis}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      Remove Emojis
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Clean unicode symbols &amp; icons
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      trimExtraSpaces();
                      removeDuplicateLines();
                      removeEmptyLines();
                    }}
                    className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-left transition cursor-pointer shadow-sm shadow-indigo-500/20"
                  >
                    <span className="block text-xs font-black">
                      Full Auto-Clean
                    </span>
                    <span className="block text-[10px] text-indigo-200 mt-0.5">
                      Spaces + Duplicates + Blanks
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* MODE: SORT & GENERATORS */}
            {mode === "sort-slug" && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Line Sorters, Reversers &amp; Generators
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Order, reverse &amp; create</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={sortLinesAsc}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Sort A to Z</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Alphabetical ascending</span>
                  </button>

                  <button
                    onClick={sortLinesDesc}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Sort Z to A</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Alphabetical descending</span>
                  </button>

                  <button
                    onClick={sortLinesLength}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Sort by Length</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Shortest lines first</span>
                  </button>

                  <button
                    onClick={reverseLines}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Reverse Lines</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Bottom line to top</span>
                  </button>

                  <button
                    onClick={reverseCharacters}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Reverse Characters</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Mirror every character</span>
                  </button>

                  <button
                    onClick={reverseWords}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Reverse Words</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Keep word letters intact</span>
                  </button>

                  <button
                    onClick={generateSlug}
                    className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">Generate URL Slug</span>
                    <span className="block text-[10px] text-indigo-400/80 mt-0.5">Clean SEO-friendly slug</span>
                  </button>

                  <button
                    onClick={() => insertLorem(150)}
                    className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 text-left transition cursor-pointer"
                  >
                    <span className="block text-xs font-black text-purple-600 dark:text-purple-400">+150 Words Lorem</span>
                    <span className="block text-[10px] text-purple-400/80 mt-0.5">Append placeholder text</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION TERMINAL (4 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
            
            {/* Companion Tab Switcher */}
            <div className="p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold shadow-xs">
              <button
                onClick={() => {
                  playClickSound();
                  setCompanionTab("metrics");
                }}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  companionTab === "metrics"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Live Analytics</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setCompanionTab("history");
                }}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  companionTab === "history"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Drafts ({snapshots.length})</span>
              </button>
            </div>

            {/* TAB 1: METRICS & READABILITY */}
            {companionTab === "metrics" ? (
              <div className="space-y-4">
                
                {/* Core Metric Counter Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Total Words
                    </span>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                      {analytics.words.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Characters
                    </span>
                    <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                      {analytics.characters.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Sentences
                    </span>
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                      {analytics.sentences.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Paragraphs
                    </span>
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                      {analytics.paragraphs.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Reading & Speaking Speeds Card */}
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Pacing &amp; Read Time
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">200 WPM</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Silent Reading</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {analytics.readingTimeStr}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Speaking Speech</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {analytics.speakingTimeStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Readability Score */}
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      Readability Ease
                    </span>
                    <span className={`text-xs font-bold ${analytics.readabilityColor}`}>
                      Score: {analytics.fleschScore}/100
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${analytics.fleschScore}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Grade Level: <strong className="text-slate-700 dark:text-slate-300">{analytics.readabilityLabel}</strong>
                  </p>
                </div>

                {/* Social Media Character Limits */}
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                    Social Media Limit Meters
                  </span>

                  {[
                    { label: "Twitter / X Post", limit: 280 },
                    { label: "Meta SEO Title", limit: 60 },
                    { label: "Meta Description", limit: 160 },
                    { label: "LinkedIn Post", limit: 3000 }
                  ].map((s) => {
                    const percent = Math.min(100, Math.round((analytics.characters / s.limit) * 100));
                    const isOver = analytics.characters > s.limit;
                    return (
                      <div key={s.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium">
                          <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
                          <span className={`font-mono ${isOver ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                            {analytics.characters}/{s.limit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-200 ${
                              isOver ? "bg-rose-500" : percent > 85 ? "bg-amber-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Top Keywords Density */}
                {analytics.topKeywords.length > 0 && (
                  <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                      Top Keywords Density
                    </span>
                    <div className="space-y-1.5">
                      {analytics.topKeywords.map((k) => (
                        <div key={k.keyword} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {k.keyword}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {k.count}x ({k.percent}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* TAB 2: SAVED DRAFTS & SNAPSHOTS HISTORY */
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Saved Drafts
                  </span>
                  {snapshots.length > 0 && (
                    <button
                      onClick={clearSnapshots}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {snapshots.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto opacity-30 text-indigo-500" />
                    <p className="text-xs font-medium">No saved drafts yet.</p>
                    <p className="text-[11px] text-slate-400">Click the bookmark icon in the editor header to save a snapshot.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {snapshots.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          playClickSound();
                          setText(s.text);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:hover:bg-indigo-950/50 border border-slate-200/70 dark:border-slate-700/70 transition cursor-pointer group flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {s.title}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                            {formatHistoryTimestamp(s.timestamp)} • {s.words} words • {s.chars} chars
                          </span>
                        </div>

                        <button
                          onClick={(e) => deleteSnapshot(s.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer shrink-0"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          HELP & SHORTCUTS MODAL DIALOG (?)
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    ?
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">
                    Text Studio Guides &amp; Benchmarks
                  </h2>
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Reading &amp; Speaking Benchmarks
                  </h3>
                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    <p>• <strong>Adult Silent Reading:</strong> Average 200 - 250 words per minute (WPM).</p>
                    <p>• <strong>Public Speech &amp; Presentations:</strong> Average 130 - 150 WPM for clear articulation.</p>
                    <p>• <strong>Audiobooks &amp; Podcasts:</strong> Typically recorded at ~150 - 160 WPM.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Readability Formula (Flesch Reading Ease)
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 dark:text-indigo-400 text-[11px]">
                    Score = 206.835 − (1.015 × ASL) − (84.6 × ASW)
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">
                    ASL = Average Sentence Length (words per sentence). ASW = Average Syllables per Word.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Supported Developer &amp; Editorial Cases
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <strong>camelCase:</strong> firstWordLower
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <strong>PascalCase:</strong> FirstWordUpper
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <strong>snake_case:</strong> words_with_underscore
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <strong>kebab-case:</strong> words-with-hyphens
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Date &amp; History Format
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    All snapshot timestamps strictly use the <strong>DD/MM/YYYY</strong> standard format.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE METRICS SLIDE-OVER SHEET (< lg)
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileStatsOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileStatsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-h-[80vh] p-5 rounded-t-3xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 overflow-y-auto pb-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Live Analytics &amp; Metrics
                  </h3>
                </div>
                <button
                  onClick={() => setMobileStatsOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Words</span>
                  <span className="text-xl font-black text-indigo-600">{analytics.words}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Characters</span>
                  <span className="text-xl font-black text-purple-600">{analytics.characters}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Sentences</span>
                  <span className="text-xl font-black">{analytics.sentences}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Paragraphs</span>
                  <span className="text-xl font-black">{analytics.paragraphs}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">Reading / Speaking</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reading: {analytics.readingTimeStr} • Speaking: {analytics.speakingTimeStr}
                </p>
                <p className="text-[11px] text-slate-500">
                  Readability: {analytics.readabilityLabel} ({analytics.fleschScore}/100)
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
