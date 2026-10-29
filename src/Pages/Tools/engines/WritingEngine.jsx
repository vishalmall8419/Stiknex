import { useState, useMemo } from "react";
import { Copy, Check, RotateCcw, FileText, Type, Sparkles, Sliders, ArrowUpDown, Shuffle } from "lucide-react";
import WordCounter from "../WordCounter/WordCounter";

export default function WritingEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);

  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1 & 2. Existing robust Word & Character Counters
  if (slug === "word-counter" || toolId === "word-counter") {
    return <WordCounter initialMode="word" />;
  }
  if (slug === "character-counter" || toolId === "character-counter") {
    return <WordCounter initialMode="character" />;
  }

  // 3. CASE CONVERTER
  if (slug === "case-converter" || toolId === "case-converter") {
    return <CaseConverterTool copyText={copyText} copied={copied} />;
  }

  // 4. REMOVE EXTRA SPACES
  if (slug === "remove-extra-spaces" || toolId === "remove-extra-spaces") {
    return <RemoveSpacesTool copyText={copyText} copied={copied} />;
  }

  // 5. REMOVE DUPLICATE LINES
  if (slug === "remove-duplicate-lines" || toolId === "remove-duplicate-lines") {
    return <RemoveDuplicateLinesTool copyText={copyText} copied={copied} />;
  }

  // 6. SORT LINES
  if (slug === "sort-lines" || toolId === "sort-lines") {
    return <SortLinesTool copyText={copyText} copied={copied} />;
  }

  // 7. FIND AND REPLACE
  if (slug === "find-and-replace" || toolId === "find-and-replace") {
    return <FindAndReplaceTool copyText={copyText} copied={copied} />;
  }

  // 8. TEXT REVERSER
  if (slug === "text-reverser" || toolId === "text-reverser") {
    return <TextReverserTool copyText={copyText} copied={copied} />;
  }

  // 9. SLUG GENERATOR
  if (slug === "slug-generator" || toolId === "slug-generator") {
    return <SlugGeneratorTool copyText={copyText} copied={copied} />;
  }

  // 10. LOREM IPSUM GENERATOR
  if (slug === "lorem-ipsum-generator" || toolId === "lorem-ipsum-generator") {
    return <LoremIpsumTool copyText={copyText} copied={copied} />;
  }

  return <WordCounter initialMode="word" />;
}

// ============================================================================
// BIG TOOL: CASE CONVERTER
// ============================================================================
function CaseConverterTool({ copyText, copied }) {
  const [text, setText] = useState("Transform any headline or paragraph into modern developer and editorial cases effortlessly.");

  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toCamelCase = (str) =>
    str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });

  const toSnakeCase = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  const toKebabCase = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const toPascalCase = (str) =>
    toTitleCase(str).replace(/\s+/g, "");

  const toAlternatingCase = (str) =>
    str.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");

  const cases = [
    { name: "UPPERCASE", val: text.toUpperCase() },
    { name: "lowercase", val: text.toLowerCase() },
    { name: "Title Case", val: toTitleCase(text) },
    { name: "camelCase", val: toCamelCase(text) },
    { name: "PascalCase", val: toPascalCase(text) },
    { name: "snake_case", val: toSnakeCase(text) },
    { name: "kebab-case", val: toKebabCase(text) },
    { name: "aLtErNaTiNg", val: toAlternatingCase(text) }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input Text</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert..."
          className="w-full p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cases.map((c, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">{c.name}</span>
              <p className="text-sm font-mono text-slate-800 dark:text-slate-200 line-clamp-3 break-all">{c.val || "..."}</p>
            </div>
            <button
              onClick={() => copyText(c.val)}
              className="mt-4 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
            >
              <Copy size={13} /> Copy {c.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: REMOVE EXTRA SPACES
// ============================================================================
function RemoveSpacesTool({ copyText, copied }) {
  const [text, setText] = useState("  This   sample   text   contains    unnecessary    spaces,\n\n\nmultiple   empty   lines,    and   tabs.  ");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(true);

  const cleaned = useMemo(() => {
    let res = text;
    if (trimLines) {
      res = res.split("\n").map(l => l.trim()).join("\n");
    }
    if (collapseSpaces) {
      res = res.replace(/[ \t]+/g, " ");
    }
    if (removeBlankLines) {
      res = res.replace(/\n\s*\n/g, "\n");
    }
    return res.trim();
  }, [text, trimLines, collapseSpaces, removeBlankLines]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} />
          <span>Collapse Multiple Spaces &rarr; 1 Space</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} />
          <span>Trim Line Ends</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeBlankLines} onChange={(e) => setRemoveBlankLines(e.target.checked)} />
          <span>Remove Empty Lines</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Original Text</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Cleaned Text</label>
            <button
              onClick={() => copyText(cleaned)}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Copy size={13} /> Copy Cleaned
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={cleaned}
            className="w-full p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: REMOVE DUPLICATE LINES
// ============================================================================
function RemoveDuplicateLinesTool({ copyText, copied }) {
  const [text, setText] = useState("Apple\nBanana\nApple\nOrange\nbanana\nMango\nOrange");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const { uniqueText, removedCount } = useMemo(() => {
    const lines = text.split("\n");
    const seen = new Set();
    const result = [];
    let dups = 0;

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      } else {
        dups++;
      }
    }
    return { uniqueText: result.join("\n"), removedCount: dups };
  }, [text, caseSensitive]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          <span>Case Sensitive Comparison</span>
        </label>
        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{removedCount} Duplicates Removed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input List</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Deduplicated Output</label>
            <button
              onClick={() => copyText(uniqueText)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Copy size={13} /> Copy Unique Lines
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={uniqueText}
            className="w-full p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: SORT LINES
// ============================================================================
function SortLinesTool({ copyText, copied }) {
  const [text, setText] = useState("Zebra\nElephant\nAlligator\nGiraffe\nMonkey\nBear");
  const [sortType, setSortType] = useState("az"); // az, za, length, shuffle

  const sorted = useMemo(() => {
    const lines = text.split("\n");
    if (sortType === "az") {
      return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
    }
    if (sortType === "za") {
      return [...lines].sort((a, b) => b.localeCompare(a)).join("\n");
    }
    if (sortType === "length") {
      return [...lines].sort((a, b) => a.length - b.length).join("\n");
    }
    if (sortType === "shuffle") {
      return [...lines].sort(() => Math.random() - 0.5).join("\n");
    }
    return text;
  }, [text, sortType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          { id: "az", label: "A &rarr; Z" },
          { id: "za", label: "Z &rarr; A" },
          { id: "length", label: "By Length (Shortest First)" },
          { id: "shuffle", label: "Shuffle Randomly" }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSortType(btn.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${sortType === btn.id ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
            dangerouslySetInnerHTML={{ __html: btn.label }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Original List</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Sorted Output</label>
            <button
              onClick={() => copyText(sorted)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Copy size={13} /> Copy Result
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={sorted}
            className="w-full p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-mono text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: FIND AND REPLACE
// ============================================================================
function FindAndReplaceTool({ copyText, copied }) {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. The fox is fast and smart.");
  const [findStr, setFindStr] = useState("fox");
  const [replaceStr, setReplaceStr] = useState("cat");
  const [matchCase, setMatchCase] = useState(false);

  const { replaced, matchCount } = useMemo(() => {
    if (!findStr) return { replaced: text, matchCount: 0 };
    try {
      const flags = matchCase ? "g" : "gi";
      const regex = new RegExp(findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = (text.match(regex) || []).length;
      return { replaced: text.replace(regex, replaceStr), matchCount: matches };
    } catch {
      return { replaced: text, matchCount: 0 };
    }
  }, [text, findStr, replaceStr, matchCase]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Find Text</label>
          <input
            type="text"
            value={findStr}
            onChange={(e) => setFindStr(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Replace With</label>
          <input
            type="text"
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
          />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} />
            <span>Match Case Exactly</span>
          </label>
          <span className="text-xs font-bold text-indigo-600">{matchCount} occurrences matched</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Document Content</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium text-slate-900 dark:text-white"
        />
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Live Replaced Preview</span>
          <p className="text-sm font-medium line-clamp-2">{replaced}</p>
        </div>
        <button
          onClick={() => copyText(replaced)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Updated Text
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: TEXT REVERSER
// ============================================================================
function TextReverserTool({ copyText, copied }) {
  const [text, setText] = useState("Stiknex Productivity Tools");
  const [mode, setMode] = useState("chars"); // chars, words, lines

  const reversed = useMemo(() => {
    if (mode === "chars") {
      return text.split("").reverse().join("");
    }
    if (mode === "words") {
      return text.split(/\s+/).reverse().join(" ");
    }
    if (mode === "lines") {
      return text.split("\n").reverse().join("\n");
    }
    return text;
  }, [text, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[
          { id: "chars", label: "Reverse Characters" },
          { id: "words", label: "Reverse Words" },
          { id: "lines", label: "Reverse Lines" }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${mode === m.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input</label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm"
        />
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Reversed Output</span>
          <p className="font-mono text-lg break-all">{reversed}</p>
        </div>
        <button
          onClick={() => copyText(reversed)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: SLUG GENERATOR
// ============================================================================
function SlugGeneratorTool({ copyText, copied }) {
  const [title, setTitle] = useState("How to Optimize Website Performance in 2026: 10 Proven Tips!");

  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [title]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Article Headline / Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg"
        />
      </div>

      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">SEO Canonical Slug</span>
          <div className="text-2xl sm:text-3xl font-mono font-black break-all">{slug || "..."}</div>
          <span className="text-xs text-indigo-200 mt-1 block">Length: {slug.length} chars</span>
        </div>
        <button
          onClick={() => copyText(slug)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Slug
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: LOREM IPSUM GENERATOR
// ============================================================================
function LoremIpsumTool({ copyText, copied }) {
  const [count, setCount] = useState(3);
  const [type, setType] = useState("paragraphs"); // paragraphs, sentences, words

  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
    "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
    "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
    "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur",
    "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt"
  ];

  const generated = useMemo(() => {
    const num = Math.min(Math.max(1, Number(count) || 1), 50);

    const makeSentence = () => {
      const len = 8 + Math.floor(Math.random() * 8);
      const sWords = Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]);
      const s = sWords.join(" ");
      return s.charAt(0).toUpperCase() + s.slice(1) + ".";
    };

    const makeParagraph = () => {
      const sCount = 4 + Math.floor(Math.random() * 4);
      return Array.from({ length: sCount }, makeSentence).join(" ");
    };

    if (type === "paragraphs") {
      return Array.from({ length: num }, makeParagraph).join("\n\n");
    }
    if (type === "sentences") {
      return Array.from({ length: num }, makeSentence).join(" ");
    }
    if (type === "words") {
      return Array.from({ length: num }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    }
    return "";
  }, [count, type]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Generate Quantity</label>
          <input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-24 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
          />
        </div>
        <div className="flex gap-2 self-end">
          {["paragraphs", "sentences", "words"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${type === t ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Dummy Text</label>
          <button
            onClick={() => copyText(generated)}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <Copy size={13} /> Copy Lorem Ipsum
          </button>
        </div>
        <textarea
          readOnly
          rows={10}
          value={generated}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-serif"
        />
      </div>
    </div>
  );
}
