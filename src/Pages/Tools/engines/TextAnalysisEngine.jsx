import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Play,
  Square,
  Code,
  ArrowRightLeft,
  Sparkles,
  Layers,
  BookOpen,
  FileText,
  Eye,
  Download,
  Share2,
  Binary,
  Radio,
  Diff,
  Braces
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import WritingEngine from "./WritingEngine";

/**
 * Universal Enterprise Text Analysis, Code & Translation Studio
 * Consolidates technical text tools into an expansive, full-page workstation:
 * - Text Diff Checker (Visual side-by-side with line stats)
 * - Markdown Studio & Converter (Live editor + rendered HTML preview + bidirectional HTML-MD)
 * - Binary ↔ Text Converter (8-bit binary, Hex, Decimal with spacing options)
 * - Morse Code & NATO Phonetic Studio (With live Web Audio 700Hz Morse beeper!)
 */

const RELATED_ANALYSIS_TOOLS = [
  { slug: "text-diff-checker", title: "Text Diff Checker", icon: "fa-solid fa-code-compare", desc: "Compare two text snippets with color-coded diffs" },
  { slug: "markdown-editor", title: "Markdown Editor", icon: "fa-brands fa-markdown", desc: "Real-time split-screen Markdown preview & HTML converter" },
  { slug: "text-to-binary", title: "Binary Converter", icon: "fa-solid fa-binary", desc: "Bidirectional text and 8-bit binary translations" },
  { slug: "morse-code-translator", title: "Morse Code Translator", icon: "fa-solid fa-tower-broadcast", desc: "Translate text to Morse with audible tone playback" },
  { slug: "nato-phonetic-converter", title: "NATO Phonetic Alphabet", icon: "fa-solid fa-headset", desc: "Spell words using international aviation alphabet" },
  { slug: "word-counter", title: "Word Counter", icon: "fa-solid fa-file-lines", desc: "Words, characters, reading time & SEO metrics" }
];

// MORSE CODE MAP
const MORSE_MAP = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..",
  "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  " ": "/", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-."
};

const REVERSE_MORSE_MAP = Object.entries(MORSE_MAP).reduce((acc, [char, morse]) => {
  acc[morse] = char;
  return acc;
}, {});

// NATO PHONETIC MAP
const NATO_MAP = {
  a: "Alfa", b: "Bravo", c: "Charlie", d: "Delta", e: "Echo", f: "Foxtrot",
  g: "Golf", h: "Hotel", i: "India", j: "Juliett", k: "Kilo", l: "Lima",
  m: "Mike", n: "November", o: "Oscar", p: "Papa", q: "Quebec", r: "Romeo",
  s: "Sierra", t: "Tango", u: "Uniform", v: "Victor", w: "Whiskey", x: "X-ray",
  y: "Yankee", z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
};

const SAMPLE_MARKDOWN = `# Welcome to Stiknex Markdown Studio

Stiknex provides **fast**, **clean**, and **production-ready** utilities for modern workflows.

## Key Capabilities:
- Live side-by-side editing with synchronized preview
- Automatic HTML conversion and clean code export
- High-contrast typography optimized for dark & light themes

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Quick Checklist:
1. Write standard Markdown in the left terminal
2. Inspect rendered HTML or raw code on the right
3. Export or copy in 1 click!
`;

const SAMPLE_HTML = `<h1>Welcome to Stiknex HTML to Markdown Converter</h1>
<p>Easily convert <strong>HTML markup</strong>, blog articles, and formatted web documents into <em>clean, standard Markdown</em> syntax.</p>

<h2>Key Capabilities:</h2>
<ul>
  <li>Converts &lt;h1&gt; through &lt;h6&gt; to standard Markdown hashtags</li>
  <li>Preserves <strong>bold</strong>, <em>italics</em>, and <a href="https://stiknex.site">hyperlinks</a></li>
  <li>Converts code snippets and &lt;pre&gt; tags to code fences</li>
  <li>Seamlessly translates HTML tables and bullet/numbered lists</li>
</ul>

<blockquote>"Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra</blockquote>

<h3>Live Code Example:</h3>
<pre><code class="language-javascript">console.log("Instant bidirectional conversion!");</code></pre>`;

/**
 * Universal HTML to Clean Markdown Converter
 * Converts headings, typography, links, lists, code fences, blockquotes & tables.
 */
function htmlToMarkdown(html) {
  if (!html || typeof html !== "string") return "";

  let md = html;

  // Remove scripts, styles, meta, noscript
  md = md.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  md = md.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  md = md.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "");

  // Pre / Code blocks (preserve language)
  md = md.replace(/<pre[^>]*><code[^>]*class=["'](?:language-)?([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, lang, code) => {
    const unescaped = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return "\n```" + (lang || "") + "\n" + unescaped.trim() + "\n```\n\n";
  });
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, code) => {
    const unescaped = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return "\n```\n" + unescaped.trim() + "\n```\n\n";
  });
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (m, code) => {
    const unescaped = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return "\n```\n" + unescaped.trim() + "\n```\n\n";
  });
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, code) => {
    const unescaped = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return "`" + unescaped + "`";
  });

  // Headings H1 to H6
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n\n");

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, content) => {
    const lines = content.trim().split("\n").map((l) => "> " + l.trim());
    return "\n" + lines.join("\n") + "\n\n";
  });

  // Text formatting
  md = md.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
  md = md.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");
  md = md.replace(/<(?:del|s|strike)[^>]*>([\s\S]*?)<\/(?:del|s|strike)>/gi, "~~$1~~");

  // Links & Images
  md = md.replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, "![]($1)");
  md = md.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // Horizontal Rule
  md = md.replace(/<hr[^>]*\/?>/gi, "\n\n---\n\n");

  // Line breaks
  md = md.replace(/<br[^>]*\/?>/gi, "\n");

  // Tables
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (m, tableContent) => {
    const rows = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tableContent)) !== null) {
      const cells = [];
      const cellRegex = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
        cells.push(cellMatch[1].trim());
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length === 0) return "";
    let tableMd = "\n";
    tableMd += "| " + rows[0].join(" | ") + " |\n";
    tableMd += "| " + rows[0].map(() => "---").join(" | ") + " |\n";
    for (let r = 1; r < rows.length; r++) {
      tableMd += "| " + rows[r].join(" | ") + " |\n";
    }
    return tableMd + "\n";
  });

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (m, list) => {
    return "\n" + list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n") + "\n";
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (m, list) => {
    let idx = 1;
    return "\n" + list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `${idx++}. $1\n`) + "\n";
  });

  // Paragraphs & Container divs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n\n");
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, "\n$1\n");

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  md = md
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean excessive blank lines & trim
  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}

/**
 * Standard Markdown to HTML Renderer
 */
function parseMarkdownToHtml(md) {
  if (!md || typeof md !== "string") return "";
  let out = md;
  // Escaping
  out = out.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Headers
  out = out.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">$1</h3>');
  out = out.replace(/^## (.*$)/gim, '<h2 class="text-lg font-black text-slate-900 dark:text-white mt-4 mb-2">$1</h2>');
  out = out.replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-slate-900 dark:text-white mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h1>');
  // Blockquote
  out = out.replace(/^\> (.*$)/gim, '<blockquote class="p-3 my-2 border-l-4 border-indigo-500 bg-slate-50 dark:bg-slate-800/60 rounded-r-xl italic text-slate-600 dark:text-slate-300">$1</blockquote>');
  // Bold & Italic
  out = out.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>");
  out = out.replace(/\*\*(.*?)\*\*/gim, "<strong class='font-bold text-indigo-600 dark:text-indigo-400'>$1</strong>");
  out = out.replace(/\*(.*?)\*/gim, "<em>$1</em>");
  // Code block
  out = out.replace(/```([\s\S]*?)```/gim, '<pre class="p-3 my-2 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">$1</pre>');
  out = out.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-400">$1</code>');
  // Unordered List
  out = out.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>');
  out = out.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-700 dark:text-slate-300">$1</li>');
  // Paragraphs
  out = out.replace(/\n\n+/g, "</p><p class='my-2 leading-relaxed text-slate-700 dark:text-slate-300'>");
  return `<div class="prose dark:prose-invert text-xs sm:text-sm max-w-none"><p class="my-2 leading-relaxed text-slate-700 dark:text-slate-300">${out}</p></div>`;
}

const SAMPLE_DIFF_ORIG = `function calculateTotal(items) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price;
  }
  return subtotal;
}`;

const SAMPLE_DIFF_MOD = `function calculateTotal(items, discountRate = 0) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal * discountRate;
  return Math.max(0, subtotal - discount);
}`;

export default function TextAnalysisEngine({ slug = "text-diff-checker", toolId = "text-diff-checker", tool, seoData }) {
  // If the user visits reading-time-calculator or text-cleaner, hand off to WritingEngine with proper preset
  if (slug === "reading-time-calculator" || toolId === "reading-time-calculator") {
    return <WritingEngine slug="reading-time-calculator" toolId="reading-time-calculator" tool={tool} seoData={seoData} />;
  }
  if (slug === "text-cleaner" || toolId === "text-cleaner") {
    return <WritingEngine slug="text-cleaner" toolId="text-cleaner" tool={tool} seoData={seoData} />;
  }

  const { theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  // 1. Identify Semantic Cluster based on active slug
  const cluster = useMemo(() => {
    if (slug === "markdown-editor" || slug === "markdown-to-html" || slug === "html-to-markdown") return "markdown";
    if (slug === "text-to-binary" || slug === "binary-to-text") return "binary";
    if (slug === "morse-code-translator" || slug === "nato-phonetic-converter") return "morse-nato";
    return "diff";
  }, [slug]);

  // Contextual Cluster Tabs (Strictly relevant tools only)
  const clusterTabs = useMemo(() => {
    switch (cluster) {
      case "markdown":
        return [
          { id: "markdown-editor", label: "Markdown Editor", slug: "markdown-editor" },
          { id: "markdown-to-html", label: "Markdown to HTML", slug: "markdown-to-html" },
          { id: "html-to-markdown", label: "HTML to Markdown", slug: "html-to-markdown" }
        ];
      case "binary":
        return [
          { id: "text-to-binary", label: "Text to Binary", slug: "text-to-binary" },
          { id: "binary-to-text", label: "Binary to Text", slug: "binary-to-text" }
        ];
      case "morse-nato":
        return [
          { id: "morse-code-translator", label: "Morse Code Audio", slug: "morse-code-translator" },
          { id: "nato-phonetic-converter", label: "NATO Phonetic Alphabet", slug: "nato-phonetic-converter" }
        ];
      default:
        return [
          { id: "text-diff-checker", label: "Side-by-Side Diff Comparator", slug: "text-diff-checker" }
        ];
    }
  }, [cluster]);

  // Mode Selection: 'diff' | 'markdown-editor' | 'markdown-to-html' | 'html-to-markdown' | 'binary' | 'morse-nato'
  const initialMode = useMemo(() => {
    if (slug === "html-to-markdown") return "html-to-markdown";
    if (slug === "markdown-to-html") return "markdown-to-html";
    if (slug === "markdown-editor") return "markdown-editor";
    return cluster;
  }, [cluster, slug]);

  // Dynamic Title Config
  const titleConfig = useMemo(() => {
    switch (slug) {
      case "text-diff-checker":
        return { prefix: "Diff", highlight: "Checker", tag: "Comparison", subtitle: "Compare texts with line additions & deletions" };
      case "markdown-editor":
        return { prefix: "Markdown", highlight: "Studio", tag: "Live Preview", subtitle: "Live markdown editor with synchronized HTML preview" };
      case "markdown-to-html":
        return { prefix: "Markdown to", highlight: "HTML", tag: "Converter", subtitle: "Convert markdown into semantic HTML code" };
      case "html-to-markdown":
        return { prefix: "HTML to", highlight: "Markdown", tag: "Converter", subtitle: "Convert HTML tags into clean markdown syntax" };
      case "text-to-binary":
      case "binary-to-text":
        return { prefix: "Binary", highlight: "Converter", tag: "Encoding", subtitle: "Bidirectional text and 8-bit binary translations" };
      case "morse-code-translator":
        return { prefix: "Morse", highlight: "Translator", tag: "Tone Player", subtitle: "Translate text to Morse code with 700Hz audio" };
      case "nato-phonetic-converter":
        return { prefix: "NATO", highlight: "Phonetics", tag: "Aviation", subtitle: "Spell words using international aviation alphabet" };
      default:
        return { prefix: "Text & Code", highlight: "Studio", tag: "Technical", subtitle: "Diff comparison, Markdown preview, Binary & Morse" };
    }
  }, [slug]);

  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Common UI states
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context for Tactile Click Sound
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

  const copyText = (txt) => {
    if (!txt) return;
    playClickSound();
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================================
  // 1. DIFF CHECKER STATE & LOGIC
  // ============================================================================
  const [origDiff, setOrigDiff] = useState(SAMPLE_DIFF_ORIG);
  const [modDiff, setModDiff] = useState(SAMPLE_DIFF_MOD);

  const diffResult = useMemo(() => {
    const l1 = origDiff.split("\n");
    const l2 = modDiff.split("\n");
    const maxLen = Math.max(l1.length, l2.length);
    const lines = [];
    let additions = 0;
    let deletions = 0;
    let identical = 0;

    for (let i = 0; i < maxLen; i++) {
      const v1 = l1[i];
      const v2 = l2[i];
      if (v1 === v2) {
        lines.push({ type: "same", val: v1 || "", lineNum: i + 1 });
        identical++;
      } else if (v1 === undefined) {
        lines.push({ type: "added", val: v2, lineNum: i + 1 });
        additions++;
      } else if (v2 === undefined) {
        lines.push({ type: "removed", val: v1, lineNum: i + 1 });
        deletions++;
      } else {
        lines.push({ type: "removed", val: v1, lineNum: i + 1 });
        lines.push({ type: "added", val: v2, lineNum: i + 1 });
        deletions++;
        additions++;
      }
    }
    return { lines, additions, deletions, identical };
  }, [origDiff, modDiff]);

  const swapDiff = () => {
    playClickSound();
    setOrigDiff(modDiff);
    setModDiff(origDiff);
  };

  // ============================================================================
  // 2. MARKDOWN STUDIO STATE & LOGIC
  // ============================================================================
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [mdViewMode, setMdViewMode] = useState("preview"); // 'preview' | 'html'

  // Minimal standard markdown parser for instant live rendering
  const parsedHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const insertMarkdownTag = (prefix, suffix = "") => {
    playClickSound();
    setMarkdown((prev) => prev + `\n${prefix}Content${suffix}\n`);
  };

  // ============================================================================
  // 2B. HTML TO MARKDOWN STATE & LOGIC
  // ============================================================================
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);
  const [htmlViewMode, setHtmlViewMode] = useState("markdown"); // 'markdown' | 'preview'

  const convertedMarkdown = useMemo(() => {
    return htmlToMarkdown(htmlInput);
  }, [htmlInput]);

  const insertHtmlTag = (openTag, closeTag = "") => {
    playClickSound();
    setHtmlInput((prev) => prev + `\n${openTag}Content${closeTag}\n`);
  };

  const downloadMarkdownFile = () => {
    playClickSound();
    const blob = new Blob([convertedMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // 3. BINARY ↔ TEXT STATE & LOGIC
  // ============================================================================
  const [binaryDirection, setBinaryDirection] = useState("text-to-bin"); // 'text-to-bin' | 'bin-to-text'
  const [binaryInput, setBinaryInput] = useState("Hello Stiknex");
  const [binarySpacing, setBinarySpacing] = useState("8bit"); // '8bit' | 'compact' | 'comma'

  const binaryResult = useMemo(() => {
    if (!binaryInput) return "";
    try {
      if (binaryDirection === "text-to-bin") {
        const bytes = [];
        for (let i = 0; i < binaryInput.length; i++) {
          const bin = binaryInput.charCodeAt(i).toString(2).padStart(8, "0");
          bytes.push(bin);
        }
        if (binarySpacing === "compact") return bytes.join("");
        if (binarySpacing === "comma") return bytes.join(", ");
        return bytes.join(" ");
      } else {
        // Binary to Text
        const clean = binaryInput.replace(/[^01]/g, " ");
        const chunks = clean.split(/\s+/).filter(Boolean);
        return chunks
          .map((chunk) => {
            const code = parseInt(chunk, 2);
            return isNaN(code) ? "" : String.fromCharCode(code);
          })
          .join("");
      }
    } catch {
      return "Invalid conversion format";
    }
  }, [binaryInput, binaryDirection, binarySpacing]);

  // ============================================================================
  // 4. MORSE & NATO STATE, LOGIC & AUDIO PLAYER
  // ============================================================================
  const [morseInput, setMorseInput] = useState("SOS Stiknex");
  const [isPlayingMorse, setIsPlayingMorse] = useState(false);
  const morseAudioRef = useRef([]);

  // Morse Translation
  const morseOutput = useMemo(() => {
    if (!morseInput) return "";
    return morseInput
      .toLowerCase()
      .split("")
      .map((c) => MORSE_MAP[c] || c)
      .join(" ");
  }, [morseInput]);

  // NATO Phonetic Translation
  const natoOutput = useMemo(() => {
    if (!morseInput) return "";
    return morseInput
      .toLowerCase()
      .split("")
      .map((c) => (NATO_MAP[c] ? `${NATO_MAP[c]}` : c === " " ? "•" : c))
      .join(" ");
  }, [morseInput]);

  // Web Audio 700Hz Morse Tone Generator
  const playMorseAudio = useCallback(() => {
    if (!morseOutput) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      stopMorseAudio();
      setIsPlayingMorse(true);

      const dotDuration = 0.07; // 70ms
      const dashDuration = dotDuration * 3;
      const freq = 700; // Standard Morse sidetone

      let currentTime = ctx.currentTime + 0.05;

      for (let i = 0; i < morseOutput.length; i++) {
        const symbol = morseOutput[i];
        if (symbol === "." || symbol === "-") {
          const duration = symbol === "." ? dotDuration : dashDuration;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, currentTime);

          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(0.08, currentTime + 0.005);
          gain.gain.setValueAtTime(0.08, currentTime + duration - 0.005);
          gain.gain.linearRampToValueAtTime(0, currentTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(currentTime);
          osc.stop(currentTime + duration);
          morseAudioRef.current.push(osc);

          currentTime += duration + dotDuration;
        } else if (symbol === " ") {
          currentTime += dashDuration; // word/letter space
        } else if (symbol === "/") {
          currentTime += dashDuration * 2; // word space
        }
      }

      const totalTime = (currentTime - ctx.currentTime) * 1000;
      setTimeout(() => {
        setIsPlayingMorse(false);
      }, totalTime);
    } catch {
      setIsPlayingMorse(false);
    }
  }, [morseOutput]);

  const stopMorseAudio = () => {
    morseAudioRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // stopped
      }
    });
    morseAudioRef.current = [];
    setIsPlayingMorse(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 dark:bg-[#070b14] flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white pb-8">
      
      {/* Universal Stiknex Sidebar Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_ANALYSIS_TOOLS}
        categoryTitle="Related Analysis & Code Tools"
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  <span>{titleConfig.prefix}</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                    {titleConfig.highlight}
                  </span>
                </h2>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 tracking-wider uppercase">
                  {titleConfig.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5 truncate max-w-[240px] 2xl:max-w-none">
                {titleConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Selector Tabs (Contextual Cluster Tabs Only) */}
        {clusterTabs.length > 1 ? (
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner shrink-0">
            {clusterTabs.map((t) => {
              const isActive = slug === t.slug;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    playClickSound();
                    setMode(t.id);
                    navigate(`/${t.slug}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm shadow-black/5"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 shrink-0">
            {clusterTabs[0]?.label || "Text Analysis Studio"}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help & Cheat Sheets Trigger */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Syntax & Encoding Reference (?)"
            aria-label="Open Syntax & Encoding Reference"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Toggle theme"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN EXPANSIVE DUAL-STATION WORKSTATION (FULL PAGE ON DESKTOP)
      ══════════════════════════════════════════════════════════════════ */}
      <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* Contextual Cluster Switcher for Mobile */}
        {clusterTabs.length > 1 && (
          <div className="md:hidden flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold mb-4 overflow-x-auto no-scrollbar">
            {clusterTabs.map((t) => {
              const isActive = slug === t.slug || mode === t.id;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    playClickSound();
                    setMode(t.id);
                    navigate(`/${t.slug}`);
                  }}
                  className={`py-1.5 px-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODE 1: DIFF CHECKER WORKSTATION
        ══════════════════════════════════════════════════════════════ */}
        {mode === "diff" && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Diff Header Bar */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  +{diffResult.additions} additions
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-mono font-bold">
                  -{diffResult.deletions} deletions
                </span>
                <span className="text-slate-400 font-mono hidden sm:inline">
                  {diffResult.identical} unchanged
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={swapDiff}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Swap</span>
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setOrigDiff(SAMPLE_DIFF_ORIG);
                    setModDiff(SAMPLE_DIFF_MOD);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer"
                >
                  Sample Diff
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setOrigDiff("");
                    setModDiff("");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold transition cursor-pointer"
                >
                  Clear Both
                </button>
              </div>
            </div>

            {/* Side-by-Side Dual Input Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Original Text / Code (Before)
                </span>
                <textarea
                  value={origDiff}
                  onChange={(e) => setOrigDiff(e.target.value)}
                  placeholder="Paste original source text..."
                  className="w-full h-44 lg:h-52 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Modified Text / Code (After)
                </span>
                <textarea
                  value={modDiff}
                  onChange={(e) => setModDiff(e.target.value)}
                  placeholder="Paste modified revised text..."
                  className="w-full h-44 lg:h-52 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Visual Diff Output Panel */}
            <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Diff className="w-4 h-4 text-blue-500" />
                  Visual Line-by-Line Difference
                </span>
                <button
                  onClick={() => copyText(modDiff)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Copy Modified Text
                </button>
              </div>

              <div className="font-mono text-xs space-y-1 max-h-[360px] overflow-y-auto pr-1">
                {diffResult.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl flex items-start gap-3 ${
                      line.type === "added"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-500"
                        : line.type === "removed"
                        ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-l-4 border-rose-500 line-through opacity-75"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 shrink-0 w-6 select-none font-mono">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "} {line.lineNum}
                    </span>
                    <span className="whitespace-pre-wrap break-all flex-1">{line.val || " "}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODE 2: MARKDOWN STUDIO & PREVIEW WORKSTATION
        ══════════════════════════════════════════════════════════════ */}
        {(mode === "markdown" || mode === "markdown-editor" || mode === "markdown-to-html") && slug !== "html-to-markdown" && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Formatting Action Bar */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => insertMarkdownTag("# ")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
                >
                  H1
                </button>
                <button
                  onClick={() => insertMarkdownTag("## ")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
                >
                  H2
                </button>
                <button
                  onClick={() => insertMarkdownTag("**", "**")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Bold
                </button>
                <button
                  onClick={() => insertMarkdownTag("*", "*")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 italic cursor-pointer"
                >
                  Italic
                </button>
                <button
                  onClick={() => insertMarkdownTag("> ")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Quote
                </button>
                <button
                  onClick={() => insertMarkdownTag("```javascript\n", "\n```")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;Code&gt;
                </button>
                <button
                  onClick={() => insertMarkdownTag("- ")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
                >
                  List
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => setMdViewMode("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      mdViewMode === "preview" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Rendered Preview
                  </button>
                  <button
                    onClick={() => setMdViewMode("html")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      mdViewMode === "html" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Raw HTML
                  </button>
                </div>

                <button
                  onClick={() => copyText(mdViewMode === "html" ? parsedHtml : markdown)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                >
                  {copied ? "Copied!" : mdViewMode === "html" ? "Copy HTML" : "Copy MD"}
                </button>
              </div>
            </div>

            {/* Split Screen Editor & Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
              {/* Left Pane: Markdown Source Editor */}
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Markdown Editor</span>
                  <span className="font-mono">{markdown.length} chars</span>
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full flex-1 min-h-[380px] lg:min-h-[480px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Right Pane: Live HTML Preview / Raw HTML */}
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>{mdViewMode === "preview" ? "Live Typography Preview" : "Generated HTML Code"}</span>
                  <span className="text-emerald-500 font-mono text-[11px]">Real-Time Sync</span>
                </div>

                <div className="flex-1 min-h-[380px] lg:min-h-[480px] overflow-y-auto pr-2">
                  {mdViewMode === "preview" ? (
                    <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
                  ) : (
                    <pre className="p-4 rounded-2xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {parsedHtml}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODE 2B: DEDICATED HTML TO MARKDOWN CONVERTER WORKSTATION
        ══════════════════════════════════════════════════════════════ */}
        {(mode === "html-to-markdown" || slug === "html-to-markdown") && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* HTML Quick Insertion & View Control Bar */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 shrink-0">
                  Insert HTML:
                </span>
                <button
                  onClick={() => insertHtmlTag("<h1>", "</h1>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;h1&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<h2>", "</h2>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;h2&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<strong>", "</strong>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] font-bold cursor-pointer"
                >
                  &lt;strong&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<em>", "</em>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] italic cursor-pointer"
                >
                  &lt;em&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag('<a href="https://stiknex.site">', "</a>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] text-blue-600 dark:text-blue-400 cursor-pointer"
                >
                  &lt;a&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<blockquote>", "</blockquote>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;quote&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag('<pre><code class="language-javascript">', "</code></pre>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;code&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<ul>\n  <li>", "</li>\n</ul>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;ul&gt;
                </button>
                <button
                  onClick={() => insertHtmlTag("<table>\n  <tr><th>Col 1</th><th>Col 2</th></tr>\n  <tr><td>A</td><td>B</td></tr>\n</table>")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-mono text-[11px] cursor-pointer"
                >
                  &lt;table&gt;
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setHtmlInput("");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => setHtmlViewMode("markdown")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      htmlViewMode === "markdown" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Markdown Output
                  </button>
                  <button
                    onClick={() => setHtmlViewMode("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      htmlViewMode === "preview" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Rendered Preview
                  </button>
                </div>

                <button
                  onClick={() => copyText(convertedMarkdown)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>

                <button
                  onClick={downloadMarkdownFile}
                  title="Download as .md file"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen HTML Editor & Markdown Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
              {/* Left Pane: HTML Source Editor */}
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>HTML Source Code (Input)</span>
                  <span className="font-mono">{htmlInput.length} chars</span>
                </div>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Paste or write HTML tags here (e.g. <h1>Title</h1><p>...</p>)..."
                  className="w-full flex-1 min-h-[380px] lg:min-h-[480px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Right Pane: Generated Clean Markdown Output */}
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>{htmlViewMode === "markdown" ? "Generated Clean Markdown" : "Live Typography Preview"}</span>
                  <span className="text-emerald-500 font-mono text-[11px]">Real-Time Sync</span>
                </div>

                <div className="flex-1 min-h-[380px] lg:min-h-[480px] overflow-y-auto pr-2">
                  {htmlViewMode === "markdown" ? (
                    <textarea
                      readOnly
                      value={convertedMarkdown}
                      className="w-full h-full min-h-[350px] p-4 rounded-2xl bg-slate-900 text-blue-300 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed resize-none outline-none border-0"
                    />
                  ) : (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(convertedMarkdown) }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODE 3: BINARY ↔ TEXT CONVERTER WORKSTATION
        ══════════════════════════════════════════════════════════════ */}
        {mode === "binary" && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Binary Switcher Controls */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setBinaryDirection(binaryDirection === "text-to-bin" ? "bin-to-text" : "text-to-bin");
                    setBinaryInput(binaryResult);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Direction: {binaryDirection === "text-to-bin" ? "Text → Binary" : "Binary → Text"}</span>
                </button>
              </div>

              {binaryDirection === "text-to-bin" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Byte Spacing:</span>
                  {["8bit", "compact", "comma"].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setBinarySpacing(sp)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition cursor-pointer ${
                        binarySpacing === sp ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Side-by-Side Dual Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {binaryDirection === "text-to-bin" ? "ASCII / UTF-8 Plain Text Input" : "8-Bit Binary Input (0s and 1s)"}
                </span>
                <textarea
                  value={binaryInput}
                  onChange={(e) => setBinaryInput(e.target.value)}
                  placeholder="Enter text to translate to binary..."
                  className="w-full flex-1 min-h-[340px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 font-mono text-sm text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>Output Result</span>
                  <button
                    onClick={() => copyText(binaryResult)}
                    className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                  >
                    Copy Output
                  </button>
                </div>
                <div className="w-full flex-1 min-h-[340px] bg-slate-900 rounded-2xl p-4 font-mono text-xs sm:text-sm text-cyan-300 border border-slate-800 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed">
                  {binaryResult || "Output will appear here..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODE 4: MORSE CODE & NATO PHONETIC WORKSTATION
        ══════════════════════════════════════════════════════════════ */}
        {mode === "morse-nato" && (
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Morse Audio Playback Bar */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <button
                  onClick={isPlayingMorse ? stopMorseAudio : playMorseAudio}
                  className={`px-4 py-2 rounded-xl text-white font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                    isPlayingMorse ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  }`}
                >
                  {isPlayingMorse ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingMorse ? "Stop Audio" : "Play Morse Audio (700Hz Tone)"}</span>
                </button>
                {isPlayingMorse && (
                  <span className="text-xs text-blue-500 font-bold animate-pulse">
                    Broadcasting audio beeps...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setMorseInput("SOS Stiknex We Love Fast Free Tools");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer"
                >
                  Sample SOS
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setMorseInput("");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold transition cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Input & Double Output Terminals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
              
              {/* Left Input (5 cols) */}
              <div className="lg:col-span-5 flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  English Plain Text Message
                </span>
                <textarea
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  placeholder="Type any message to convert to Morse & NATO..."
                  className="w-full flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 font-sans text-sm text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 resize-none outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Right Dual Outputs (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                
                {/* Morse Code Box */}
                <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Radio className="w-3.5 h-3.5" />
                      International Morse Code (. and -)
                    </span>
                    <button
                      onClick={() => copyText(morseOutput)}
                      className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                    >
                      Copy Morse
                    </button>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-2xl font-mono text-xs sm:text-sm text-amber-400 min-h-[120px] overflow-y-auto whitespace-pre-wrap leading-relaxed tracking-wider">
                    {morseOutput || "Morse dots & dashes will appear here..."}
                  </div>
                </div>

                {/* NATO Phonetic Box */}
                <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      NATO International Aviation Phonetics
                    </span>
                    <button
                      onClick={() => copyText(natoOutput)}
                      className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                    >
                      Copy NATO
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 min-h-[120px] overflow-y-auto leading-relaxed">
                    {natoOutput || "NATO phonetic spelling will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    ?
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">
                    Syntax &amp; Technical References
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
                    Markdown Formatting Cheat Sheet
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <code># Title</code> → &lt;h1&gt;
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <code>**Bold**</code> → &lt;strong&gt;
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <code>*Italic*</code> → &lt;em&gt;
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <code>`code`</code> → &lt;code&gt;
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    NATO Phonetic Alphabet Guide
                  </h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    A = Alfa, B = Bravo, C = Charlie, D = Delta, E = Echo, F = Foxtrot, G = Golf, H = Hotel, I = India, J = Juliett, K = Kilo, L = Lima, M = Mike, N = November, O = Oscar, P = Papa, Q = Quebec, R = Romeo, S = Sierra, T = Tango, U = Uniform, V = Victor, W = Whiskey, X = X-ray, Y = Yankee, Z = Zulu.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Morse Code Timing Standards
                  </h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    A dash (-) is equal to three dots (.). Space between parts of the same letter is one dot. Space between letters is three dots. Space between words is seven dots. The audio player broadcasts at 700Hz.
                  </p>
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
                  className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
