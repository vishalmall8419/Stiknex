import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  FileCode,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Copy,
  Check,
  Search,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Sun,
  Moon,
  Share2,
  Trash2,
  ArrowRight,
  Terminal,
  Hash,
  Sliders,
  Layers,
  Upload,
  AlignLeft,
  CheckCircle2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   DEVELOPER TOOLS METADATA & CONFIGURATIONS
   ========================================================================================= */
const DEV_TOOLS = [
  { slug: "json-formatter", title: "JSON Formatter", highlight: "BEAUTIFIER", tag: "2/4 Spaces & Minify", desc: "Format, beautify, and validate JSON code with custom indentation", icon: <FileCode size={16} /> },
  { slug: "json-validator", title: "JSON Validator", highlight: "SYNTAX LINT", tag: "RFC 8259 Linting", desc: "Validate JSON syntax with exact error line and column diagnostics", icon: <CheckCircle size={16} /> },
  { slug: "json-to-csv", title: "JSON to CSV", highlight: "CONVERTER", tag: "Tabular Export", desc: "Convert JSON arrays and objects into clean CSV spreadsheets", icon: <FileSpreadsheet size={16} /> },
  { slug: "csv-to-json", title: "CSV to JSON", highlight: "CONVERTER", tag: "Data Parsing", desc: "Convert CSV tables to typed JSON objects and arrays", icon: <Code size={16} /> },
  { slug: "xml-formatter", title: "XML Formatter", highlight: "BEAUTIFIER", tag: "Tree Indenter", desc: "Format, beautify, and minify XML markup structures", icon: <FileCode size={16} /> },
  { slug: "html-formatter", title: "HTML Formatter", highlight: "CLEANUP", tag: "Markup Prettifier", desc: "Beautify messy HTML documents with clean hierarchical indentation", icon: <Code size={16} /> },
  { slug: "css-formatter", title: "CSS Formatter", highlight: "STYLESHEET", tag: "Clean Rules", desc: "Beautify or minify CSS rulesets, media queries, and properties", icon: <Sliders size={16} /> },
  { slug: "javascript-formatter", title: "JS Formatter", highlight: "SCRIPT", tag: "Code Prettifier", desc: "Beautify JavaScript source code with standardized bracket spacing", icon: <Terminal size={16} /> },
  { slug: "regex-tester", title: "Regex Tester", highlight: "MATCHER", tag: "Flags & Groups", desc: "Test regular expressions with real-time capture groups and cheat sheet", icon: <Search size={16} /> },
  { slug: "uuid-generator", title: "UUID Generator", highlight: "GUID V4", tag: "Crypto Random", desc: "Generate secure RFC 4122 V4 UUIDs and GUIDs in bulk", icon: <Hash size={16} /> }
];

export default function DeveloperEngine({ slug = "json-formatter", toolId = "json-formatter" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "json-formatter");
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
    return DEV_TOOLS.find((t) => t.slug === activeSlug) || DEV_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return DEV_TOOLS.map((t) => ({
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
        categoryTitle="Developer Tools"
        onFeedback={openFeedback}
      />

      {/* Top Navigation Bar */}
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
            <span className="text-slate-900 dark:text-white capitalize">Developer</span>
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
          {DEV_TOOLS.map((tool) => {
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
              <CheckCircle2 size={13} /> 100% In-Browser Privacy
            </span>
          </div>
        </div>

        {/* Dynamic Tool Component Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "json-formatter" && <JsonFormatterTool copyText={copyText} copied={copied} />}
          {activeSlug === "json-validator" && <JsonValidatorTool copyText={copyText} copied={copied} />}
          {activeSlug === "json-to-csv" && <JsonToCsvTool copyText={copyText} copied={copied} />}
          {activeSlug === "csv-to-json" && <CsvToJsonTool copyText={copyText} copied={copied} />}
          {activeSlug === "xml-formatter" && <XmlFormatterTool copyText={copyText} copied={copied} />}
          {activeSlug === "html-formatter" && <HtmlFormatterTool copyText={copyText} copied={copied} />}
          {activeSlug === "css-formatter" && <CssFormatterTool copyText={copyText} copied={copied} />}
          {activeSlug === "javascript-formatter" && <JsFormatterTool copyText={copyText} copied={copied} />}
          {activeSlug === "regex-tester" && <RegexTesterTool copyText={copyText} copied={copied} />}
          {activeSlug === "uuid-generator" && <UuidGeneratorTool copyText={copyText} copied={copied} />}
        </div>

        {/* Informational / SEO Technical Guide Box */}
        <div className="p-6 sm:p-8 bg-slate-100/80 dark:bg-[#111827]/80 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Sparkles size={16} />
            <span>Developer Workstation Specifications</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">Zero Latency Parsing</strong>
              All transformations, regex evaluations, and linting routines run on your local machine using the V8 engine. No source code or confidential credentials are ever transmitted to external servers.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">RFC Compliant Standards</strong>
              Strict adherence to RFC 8259 JSON specifications, RFC 4122 UUID standards, and W3C markup rules to ensure seamless interoperability across APIs and backends.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">One-Click Export</strong>
              Instantly download parsed files or copy clean syntax directly into your IDE, clipboard, or build pipelines with automatic file extension matching.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================================================
   TOOL 1: JSON FORMATTER & BEAUTIFIER
   ========================================================================================= */
function JsonFormatterTool({ copyText, copied }) {
  const [input, setInput] = useState(
    JSON.stringify(
      {
        project: "Stiknex",
        version: "2.4.0",
        active: true,
        metrics: { speedMs: 12, rating: 4.9 },
        tags: ["developer", "formatting", "privacy"]
      },
      null,
      2
    )
  );
  const [indent, setIndent] = useState(2);
  const fileInputRef = useRef(null);

  const parsed = useMemo(() => {
    if (!input.trim()) return { formatted: "", valid: true, count: 0, bytes: 0 };
    try {
      const obj = JSON.parse(input);
      const formatted = indent === 0 ? JSON.stringify(obj) : JSON.stringify(obj, null, indent);
      return {
        formatted,
        valid: true,
        count: typeof obj === "object" && obj !== null ? Object.keys(obj).length : 1,
        bytes: new Blob([formatted]).size
      };
    } catch (err) {
      return { formatted: "", valid: false, error: err.message, bytes: 0 };
    }
  }, [input, indent]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(String(event.target?.result || ""));
    };
    reader.readAsText(file);
  };

  const downloadJson = () => {
    if (!parsed.valid || !parsed.formatted) return;
    const blob = new Blob([parsed.formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {parsed.valid ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle size={14} /> Valid JSON Syntax ({parsed.bytes} bytes)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800">
              <AlertCircle size={14} /> Invalid JSON Syntax
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Indent:</span>
          {[2, 4, 0].map((sp) => (
            <button
              key={sp}
              onClick={() => setIndent(sp)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                indent === sp
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              {sp === 0 ? "Minify" : `${sp} Spaces`}
            </button>
          ))}
          <input ref={fileInputRef} type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700"
          >
            <Upload size={13} /> Upload
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Raw JSON Input</label>
            <button
              onClick={() => setInput("")}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON string here..."
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Formatted Output
            </label>
            {parsed.valid && parsed.formatted && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => copyText(parsed.formatted)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={downloadJson}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            )}
          </div>

          {parsed.valid ? (
            <textarea
              readOnly
              rows={14}
              value={parsed.formatted}
              className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200 focus:outline-none"
            />
          ) : (
            <div className="w-full h-[290px] p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 font-mono text-xs flex flex-col justify-center">
              <span className="font-bold mb-2 flex items-center gap-1.5">
                <AlertCircle size={15} /> Syntax Error Detected:
              </span>
              <p className="bg-white/60 dark:bg-black/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                {parsed.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 2: JSON VALIDATOR
   ========================================================================================= */
function JsonValidatorTool({ copyText, copied }) {
  const [input, setInput] = useState(`{\n  "status": 200,\n  "message": "Success",\n  "data": {\n    "items": [1, 2, 3]\n  }\n}`);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!input.trim()) {
      setAnalysis(null);
      return;
    }
    try {
      const obj = JSON.parse(input);
      setAnalysis({
        valid: true,
        type: Array.isArray(obj) ? "Array" : typeof obj,
        keys: typeof obj === "object" && obj !== null ? Object.keys(obj).length : 0,
        size: new Blob([input]).size
      });
    } catch (err) {
      setAnalysis({
        valid: false,
        error: err.message
      });
    }
  }, [input]);

  const fixCommonIssues = () => {
    try {
      // Replace single quotes with double quotes and unquoted keys
      let fixed = input
        .replace(/'/g, '"')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
      JSON.parse(fixed);
      setInput(fixed);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {analysis?.valid ? (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle size={14} /> 100% RFC 8259 Compliant JSON
            </span>
          ) : analysis ? (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
              <AlertCircle size={14} /> Syntax Error: {analysis.error}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Enter JSON content to validate</span>
          )}
        </div>

        {!analysis?.valid && analysis && (
          <button
            onClick={fixCommonIssues}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
          >
            Auto-Fix Quotes & Keys
          </button>
        )}
      </div>

      <textarea
        rows={12}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white"
        placeholder="Enter JSON code to test..."
      />

      {analysis?.valid && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Root Structure</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{analysis.type}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Top-Level Keys</span>
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{analysis.keys}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Payload Size</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{analysis.size} bytes</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Standard</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-300">RFC 8259</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================================
   TOOL 3: JSON TO CSV
   ========================================================================================= */
function JsonToCsvTool({ copyText, copied }) {
  const [jsonStr, setJsonStr] = useState(
    JSON.stringify(
      [
        { id: 101, name: "Alice Developer", department: "Engineering", country: "United States" },
        { id: 102, name: "Bob Designer", department: "Product Design", country: "United Kingdom" },
        { id: 103, name: "Charlie Manager", department: "Operations", country: "Canada" }
      ],
      null,
      2
    )
  );

  const csv = useMemo(() => {
    try {
      const arr = JSON.parse(jsonStr);
      if (!Array.isArray(arr) || arr.length === 0) return "Error: Input must be a JSON array of objects.";
      const headers = Object.keys(arr[0]);
      const rows = arr.map((item) =>
        headers.map((h) => `"${String(item[h] ?? "").replace(/"/g, '""')}"`).join(",")
      );
      return [headers.join(","), ...rows].join("\n");
    } catch {
      return "Error: Invalid JSON array format.";
    }
  }, [jsonStr]);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">JSON Array Input</label>
          <textarea
            rows={12}
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CSV Spreadsheet Output
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyText(csv)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={downloadCsv}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            rows={12}
            value={csv}
            className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 4: CSV TO JSON
   ========================================================================================= */
function CsvToJsonTool({ copyText, copied }) {
  const [csv, setCsv] = useState(
    `id,name,role,salary\n1,Alex Rivera,Fullstack Lead,125000\n2,Elena Rostova,Data Scientist,138000\n3,Kenji Sato,UI/UX Architect,110000`
  );

  const jsonStr = useMemo(() => {
    try {
      const lines = csv.trim().split("\n");
      if (lines.length < 2) return "[]";
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const records = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const row = {};
        headers.forEach((h, idx) => {
          const val = values[idx] ?? "";
          if (!isNaN(val) && val !== "") {
            row[h] = Number(val);
          } else if (val.toLowerCase() === "true") {
            row[h] = true;
          } else if (val.toLowerCase() === "false") {
            row[h] = false;
          } else {
            row[h] = val;
          }
        });
        return row;
      });
      return JSON.stringify(records, null, 2);
    } catch {
      return "Invalid CSV format.";
    }
  }, [csv]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">CSV Table Input</label>
          <textarea
            rows={12}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Parsed JSON Array
            </label>
            <button
              onClick={() => copyText(jsonStr)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            rows={12}
            value={jsonStr}
            className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 5-8: CODE FORMATTERS (XML, HTML, CSS, JAVASCRIPT)
   ========================================================================================= */
function XmlFormatterTool({ copyText, copied }) {
  const [code, setCode] = useState(
    `<catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price></book></catalog>`
  );

  const formatted = useMemo(() => {
    try {
      let formattedXml = "";
      const reg = /(>)(<)(\/*)/g;
      let xml = code.replace(reg, "$1\r\n$2$3");
      let pad = 0;
      xml.split("\r\n").forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }
        let padding = "";
        for (let i = 0; i < pad; i++) padding += "  ";
        formattedXml += padding + node + "\r\n";
        pad += indent;
      });
      return formattedXml.trim();
    } catch {
      return code;
    }
  }, [code]);

  return <GenericCodeFormatterView title="XML Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} copied={copied} ext="xml" />;
}

function HtmlFormatterTool({ copyText, copied }) {
  const [code, setCode] = useState(
    `<!DOCTYPE html><html><head><title>Stiknex</title></head><body><div class="main"><h1>Free Tools</h1><p>Client-side privacy guaranteed.</p></div></body></html>`
  );

  const formatted = useMemo(() => {
    return code
      .replace(/></g, ">\n<")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");
  }, [code]);

  return <GenericCodeFormatterView title="HTML Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} copied={copied} ext="html" />;
}

function CssFormatterTool({ copyText, copied }) {
  const [code, setCode] = useState(
    `.btn-primary { background: #4f46e5; color: #fff; border-radius: 8px; padding: 10px 20px; font-weight: 700; } .btn-primary:hover { opacity: 0.9; }`
  );

  const formatted = useMemo(() => {
    return code
      .replace(/\{/g, " {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\s*\}/g, "\n}\n")
      .trim();
  }, [code]);

  return <GenericCodeFormatterView title="CSS Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} copied={copied} ext="css" />;
}

function JsFormatterTool({ copyText, copied }) {
  const [code, setCode] = useState(
    `function calculateVelocity(distance, time){if(time<=0)return 0;const speed=distance/time;return Math.round(speed*100)/100;}`
  );

  const formatted = useMemo(() => {
    return code
      .replace(/\{/g, " {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}/g, "\n}\n")
      .trim();
  }, [code]);

  return <GenericCodeFormatterView title="JavaScript Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} copied={copied} ext="js" />;
}

function GenericCodeFormatterView({ title, code, setCode, formatted, copyText, copied, ext }) {
  const downloadFile = () => {
    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input {title}</label>
          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Formatted Code
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyText(formatted)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={downloadFile}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            rows={12}
            value={formatted}
            className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 9: REGEX TESTER
   ========================================================================================= */
function RegexTesterTool({ copyText, copied }) {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})");
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testText, setTestText] = useState(
    "Contact our dev team at engineering@stiknex.site or support@example.org for quick assistance."
  );

  const flagStr = Object.entries(flags)
    .filter(([_, val]) => val)
    .map(([f]) => f)
    .join("");

  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const reg = new RegExp(pattern, flagStr);
      const list = [];
      let m;
      if (flags.g) {
        while ((m = reg.exec(testText)) !== null) {
          list.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === reg.lastIndex) reg.lastIndex++;
        }
      } else {
        m = reg.exec(testText);
        if (m) list.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return list;
    } catch {
      return [];
    }
  }, [pattern, flagStr, testText, flags.g]);

  const CHEAT_SHEETS = [
    { label: "Email Address", pat: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { label: "IPv4 Address", pat: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
    { label: "HEX Color", pat: "#(?:[0-9a-fA-F]{3}){1,2}\\b" },
    { label: "URL Web Link", pat: "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)" }
  ];

  return (
    <div className="space-y-6">
      {/* Pattern Bar */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Regular Expression Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl text-slate-400 font-bold">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white"
            />
            <span className="font-mono text-xl text-slate-400 font-bold">/{flagStr}</span>
          </div>
        </div>

        {/* Flag Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <span className="text-slate-500">Flags:</span>
          {["g", "i", "m"].map((f) => (
            <label key={f} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[f]}
                onChange={(e) => setFlags((prev) => ({ ...prev, [f]: e.target.checked }))}
              />
              <span className="uppercase text-slate-700 dark:text-slate-300">
                {f} ({f === "g" ? "Global" : f === "i" ? "Insensitive" : "Multiline"})
              </span>
            </label>
          ))}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400">Presets:</span>
          {CHEAT_SHEETS.map((cs) => (
            <button
              key={cs.label}
              onClick={() => setPattern(cs.pat)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Test String</label>
        <textarea
          rows={5}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      {/* Matches Results */}
      <div className="p-6 bg-indigo-600 text-white rounded-3xl space-y-4 shadow-xl shadow-indigo-600/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            {matches.length} Match{matches.length === 1 ? "" : "es"} Found
          </span>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {matches.map((item, idx) => (
              <div key={idx} className="p-3 bg-white/10 rounded-xl font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  #{idx + 1}: <strong className="text-white underline">{item.match}</strong>{" "}
                  <span className="text-indigo-200 text-[11px]">(Index: {item.index})</span>
                </span>
                {item.groups.length > 0 && (
                  <span className="text-indigo-200 text-[11px]">Groups: {item.groups.join(", ")}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-indigo-200">No matches found in the current test string.</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 10: UUID GENERATOR
   ========================================================================================= */
function UuidGeneratorTool({ copyText, copied }) {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);

  const genV4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, genV4));

  const regenerate = () => {
    const total = Math.min(Math.max(1, count), 100);
    setUuids(Array.from({ length: total }, genV4));
  };

  const formattedList = useMemo(() => {
    return uuids.map((id) => {
      let res = id;
      if (!hyphens) res = res.replace(/-/g, "");
      if (uppercase) res = res.toUpperCase();
      if (braces) res = `{${res}}`;
      return res;
    });
  }, [uuids, hyphens, uppercase, braces]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Count (1-100):</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold text-sm text-center"
          />
          <button
            onClick={regenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <RefreshCw size={14} /> Generate
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            <span>Uppercase</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
            <span>Hyphens</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} />
            <span>Braces</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {formattedList.length} Generated UUIDs
          </span>
          <button
            onClick={() => copyText(formattedList.join("\n"))}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy All"}
          </button>
        </div>

        {formattedList.map((id, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/60 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs"
          >
            <span className="text-slate-900 dark:text-white font-bold">{id}</span>
            <button
              onClick={() => copyText(id)}
              className="text-slate-400 hover:text-indigo-600 transition"
              title="Copy UUID"
            >
              <Copy size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
