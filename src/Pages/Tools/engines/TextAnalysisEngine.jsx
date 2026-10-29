import { useState, useMemo, useEffect, useRef } from "react";
import { Copy, Check, Play, Volume2, Code, ArrowRightLeft, Sparkles, Layers, BookOpen } from "lucide-react";
import WordCounter from "../WordCounter/WordCounter";

export default function TextAnalysisEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);

  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "reading-time-calculator" || toolId === "reading-time-calculator") {
    return <WordCounter initialMode="reading-time" />;
  }

  if (slug === "text-diff-checker" || toolId === "text-diff-checker") {
    return <DiffCheckerTool copyText={copyText} copied={copied} />;
  }

  if (slug === "markdown-editor" || toolId === "markdown-editor") {
    return <MarkdownEditorTool copyText={copyText} copied={copied} />;
  }

  if (slug === "markdown-to-html" || toolId === "markdown-to-html") {
    return <MarkdownToHtmlTool copyText={copyText} copied={copied} />;
  }

  if (slug === "html-to-markdown" || toolId === "html-to-markdown") {
    return <HtmlToMarkdownTool copyText={copyText} copied={copied} />;
  }

  if (slug === "text-to-binary" || toolId === "text-to-binary") {
    return <TextToBinaryTool copyText={copyText} copied={copied} />;
  }

  if (slug === "binary-to-text" || toolId === "binary-to-text") {
    return <BinaryToTextTool copyText={copyText} copied={copied} />;
  }

  if (slug === "morse-code-translator" || toolId === "morse-code-translator") {
    return <MorseCodeTool copyText={copyText} copied={copied} />;
  }

  if (slug === "nato-phonetic-converter" || toolId === "nato-phonetic-converter") {
    return <NatoPhoneticTool copyText={copyText} copied={copied} />;
  }

  if (slug === "text-cleaner" || toolId === "text-cleaner") {
    return <TextCleanerTool copyText={copyText} copied={copied} />;
  }

  return <DiffCheckerTool copyText={copyText} copied={copied} />;
}

// ============================================================================
// BIG TOOL: DIFF CHECKER
// ============================================================================
function DiffCheckerTool({ copyText, copied }) {
  const [orig, setOrig] = useState("Hello world!\nStiknex is a free utility platform.\nWe love fast tools.\nGoodbye!");
  const [modified, setModified] = useState("Hello world!\nStiknex is the best free utility platform.\nWe love fast and clean tools.\nThank you!");

  const diffResult = useMemo(() => {
    const lines1 = orig.split("\n");
    const lines2 = modified.split("\n");
    const maxLen = Math.max(lines1.length, lines2.length);
    const comparison = [];

    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i];
      const l2 = lines2[i];
      if (l1 === l2) {
        comparison.push({ type: "same", val: l1 || "", line: i + 1 });
      } else if (l1 === undefined) {
        comparison.push({ type: "added", val: l2, line: i + 1 });
      } else if (l2 === undefined) {
        comparison.push({ type: "removed", val: l1, line: i + 1 });
      } else {
        comparison.push({ type: "removed", val: l1, line: i + 1 });
        comparison.push({ type: "added", val: l2, line: i + 1 });
      }
    }
    return comparison;
  }, [orig, modified]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Original Text</label>
          <textarea
            rows={6}
            value={orig}
            onChange={(e) => setOrig(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Modified Text</label>
          <textarea
            rows={6}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>
      </div>

      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs overflow-x-auto">
        <div className="text-slate-400 font-bold mb-3 border-b border-slate-800 pb-2">Diff Highlights</div>
        {diffResult.map((item, idx) => (
          <div
            key={idx}
            className={`px-3 py-1.5 rounded flex items-center gap-3 ${
              item.type === "added"
                ? "bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500"
                : item.type === "removed"
                ? "bg-rose-950/60 text-rose-400 border-l-4 border-rose-500 line-through opacity-80"
                : "text-slate-300"
            }`}
          >
            <span className="w-6 text-slate-500 select-none">{item.line}</span>
            <span className="font-bold w-4 select-none">{item.type === "added" ? "+" : item.type === "removed" ? "−" : " "}</span>
            <span className="flex-1 whitespace-pre-wrap">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: MARKDOWN EDITOR & LIVE PREVIEW
// ============================================================================
function MarkdownEditorTool({ copyText, copied }) {
  const [md, setMd] = useState(
    "# Stiknex Markdown\n\nWrite documentation and notes with **bold text**, *italics*, and lists.\n\n- Real-time preview\n- Zero server uploads\n- Clean HTML output\n\n```javascript\nconsole.log('Built with Stiknex');\n```"
  );

  const html = useMemo(() => {
    return md
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2 text-indigo-400">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3 text-indigo-500">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black my-4 text-slate-900 dark:text-white">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs my-3 overflow-x-auto">$1</pre>')
      .replace(/^- (.*$)/gim, '<li class="list-disc ml-4 my-1">$1</li>')
      .replace(/\n$/gim, '<br />');
  }, [md]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <button
          onClick={() => copyText(md)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          <Copy size={13} /> Copy Markdown
        </button>
        <button
          onClick={() => copyText(html)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Code size={13} /> Copy HTML Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Markdown Input</label>
          <textarea
            rows={14}
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm leading-relaxed"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">Live Rendered View</label>
          <div
            className="w-full h-80 p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-y-auto prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: MARKDOWN TO HTML
// ============================================================================
function MarkdownToHtmlTool({ copyText, copied }) {
  const [md, setMd] = useState("## Hello World\nThis is **bold** and *italic*.\n\nVisit [Stiknex](https://stiknex.site)!");

  const html = useMemo(() => {
    return md
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br/>');
  }, [md]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Markdown Code</label>
          <textarea
            rows={10}
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Generated HTML</label>
            <button
              onClick={() => copyText(html)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Copy size={13} /> Copy HTML
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={html}
            className="w-full p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-mono text-xs text-indigo-900 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: HTML TO MARKDOWN
// ============================================================================
function HtmlToMarkdownTool({ copyText, copied }) {
  const [html, setHtml] = useState("<h1>Welcome</h1><p>Visit <strong>Stiknex</strong> today.</p>");

  const md = useMemo(() => {
    return html
      .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
      .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
      .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
      .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i>(.*?)<\/i>/gi, "*$1*")
      .replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<[^>]*>/g, "");
  }, [html]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">HTML Code</label>
          <textarea
            rows={10}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Markdown Result</label>
            <button
              onClick={() => copyText(md)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Copy size={13} /> Copy Markdown
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={md}
            className="w-full p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-mono text-sm text-indigo-900 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: TEXT TO BINARY & BINARY TO TEXT
// ============================================================================
function TextToBinaryTool({ copyText, copied }) {
  const [text, setText] = useState("Stiknex");

  const binary = useMemo(() => {
    return text
      .split("")
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Plain English Text</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium"
        />
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">8-Bit Binary Representation</span>
          <p className="font-mono text-sm break-all leading-relaxed">{binary || "..."}</p>
        </div>
        <button
          onClick={() => copyText(binary)}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Binary
        </button>
      </div>
    </div>
  );
}

function BinaryToTextTool({ copyText, copied }) {
  const [binary, setBinary] = useState("01010011 01110100 01101001 01101011 01101110 01100101 01111000");

  const text = useMemo(() => {
    try {
      const clean = binary.trim().split(/\s+/);
      return clean.map((bin) => String.fromCharCode(parseInt(bin, 2))).join("");
    } catch {
      return "Invalid binary string.";
    }
  }, [binary]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Binary String (Space Separated 8-bit)</label>
        <textarea
          rows={4}
          value={binary}
          onChange={(e) => setBinary(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm"
        />
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Decoded Text</span>
          <p className="text-2xl font-bold">{text || "..."}</p>
        </div>
        <button
          onClick={() => copyText(text)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Text
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: MORSE CODE TRANSLATOR (With Web Audio API Audio Beeper!)
// ============================================================================
function MorseCodeTool({ copyText, copied }) {
  const [text, setText] = useState("SOS STIKNEX");
  const [isPlaying, setIsPlaying] = useState(false);

  const MORSE_MAP = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
    O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
    V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
    6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----", " ": "/"
  };

  const morse = useMemo(() => {
    return text
      .toUpperCase()
      .split("")
      .map((c) => MORSE_MAP[c] || "")
      .filter(Boolean)
      .join(" ");
  }, [text]);

  const playMorseAudio = () => {
    if (isPlaying || !morse) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dotTime = 0.08;
      let curTime = audioCtx.currentTime + 0.05;
      setIsPlaying(true);

      for (const char of morse) {
        if (char === "." || char === "-") {
          const dur = char === "." ? dotTime : dotTime * 3;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(700, curTime);
          gain.gain.setValueAtTime(0.2, curTime);
          gain.gain.setValueAtTime(0, curTime + dur);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(curTime);
          osc.stop(curTime + dur);
          curTime += dur + dotTime;
        } else if (char === " ") {
          curTime += dotTime * 2;
        } else if (char === "/") {
          curTime += dotTime * 5;
        }
      }

      const totalMs = (curTime - audioCtx.currentTime) * 1000;
      setTimeout(() => setIsPlaying(false), totalMs);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Message</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg uppercase"
        />
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">Morse Code (Dots & Dashes)</span>
          <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest break-all">{morse}</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={playMorseAudio}
            disabled={isPlaying}
            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition ${isPlaying ? "bg-slate-800 text-slate-400" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"}`}
          >
            <Volume2 size={16} /> {isPlaying ? "Beeping..." : "Play Audio"}
          </button>
          <button
            onClick={() => copyText(morse)}
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-2"
          >
            <Copy size={16} /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: NATO PHONETIC ALPHABET CONVERTER
// ============================================================================
function NatoPhoneticTool({ copyText, copied }) {
  const [val, setVal] = useState("VISHAL");

  const NATO = {
    A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
    G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
    M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
    S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
    Y: "Yankee", Z: "Zulu", "0": "Zero", "1": "One", "2": "Two", "3": "Three",
    "4": "Four", "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
  };

  const spelled = useMemo(() => {
    return val
      .toUpperCase()
      .split("")
      .map((c) => NATO[c] || c)
      .join(" ");
  }, [val]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Text or Code to Spell Out</label>
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg uppercase"
        />
      </div>

      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Aviation Radio Spelling</span>
          <div className="text-2xl sm:text-3xl font-black tracking-wide leading-relaxed">{spelled}</div>
        </div>
        <button
          onClick={() => copyText(spelled)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Spelling
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: TEXT CLEANER & SANITIZER
// ============================================================================
function TextCleanerTool({ copyText, copied }) {
  const [input, setInput] = useState('<div class="bad">Hello! &nbsp; This “quote” has zero-width\u200B spaces &amp; smart quotes!</div>');

  const cleaned = useMemo(() => {
    return input
      .replace(/<[^>]*>/g, "") // strip HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width
      .replace(/[“”]/g, '"') // smart quotes
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Raw Dirty Text</label>
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Sanitized Plain Text</span>
          <button
            onClick={() => copyText(cleaned)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 flex items-center gap-1.5"
          >
            <Copy size={13} /> Copy Clean Text
          </button>
        </div>
        <p className="font-medium text-slate-900 dark:text-white text-sm break-all">{cleaned}</p>
      </div>
    </div>
  );
}
