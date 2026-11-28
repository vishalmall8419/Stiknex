import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  Copy,
  Check,
  Download,
  Upload,
  Filter,
  Shuffle,
  ArrowRightLeft,
  FileSpreadsheet,
  Code,
  Layers,
  Sparkles,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Share2,
  Trash2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   DATA PROCESSING & CSV TOOLS METADATA
   ========================================================================================= */
const DATA_TOOLS = [
  { slug: "csv-viewer", title: "CSV Viewer", highlight: "TABLE EXPLORER", tag: "Search & Sort", desc: "Interactive in-browser spreadsheet table viewer with live search filtering", icon: <FileSpreadsheet size={16} /> },
  { slug: "csv-merger", title: "CSV Merger", highlight: "DATA COMBINER", tag: "Union & Concatenate", desc: "Merge and combine two CSV datasets together without server uploads", icon: <Layers size={16} /> },
  { slug: "csv-deduplicator", title: "Deduplicator", highlight: "DATA CLEANING", tag: "Remove Duplicates", desc: "Detect and remove duplicate rows from CSV lists and spreadsheets", icon: <Filter size={16} /> },
  { slug: "csv-column-extractor", title: "Column Extractor", highlight: "TRANSFORM", tag: "Pick Columns", desc: "Extract specific targeted columns from large CSV files instantly", icon: <Table size={16} /> },
  { slug: "json-to-xml", title: "JSON to XML", highlight: "CONVERTER", tag: "Tree Structure", desc: "Transform JSON data and arrays into well-formed XML documents", icon: <Code size={16} /> },
  { slug: "xml-to-json", title: "XML to JSON", highlight: "CONVERTER", tag: "DOM Parser", desc: "Parse XML documents and hierarchical tags into structured JSON objects", icon: <Code size={16} /> },
  { slug: "tsv-to-csv", title: "TSV to CSV", highlight: "FORMATTER", tag: "Excel & Sheets", desc: "Convert tab-separated TSV exports from Excel/Google Sheets to CSV", icon: <ArrowRightLeft size={16} /> },
  { slug: "delimited-text-converter", title: "Delimited Text", highlight: "DELIMITER", tag: "Pipes, Tabs, Commas", desc: "Convert between pipe, tab, comma, and semicolon delimited formats", icon: <Shuffle size={16} /> },
  { slug: "table-to-markdown", title: "Table to Markdown", highlight: "GITHUB MD", tag: "GFM Tables", desc: "Convert CSV or tabular data into formatted GitHub Markdown tables", icon: <FileSpreadsheet size={16} /> },
  { slug: "data-sampling-tool", title: "Data Sampler", highlight: "SAMPLING", tag: "Random Subsets", desc: "Extract random representative samples and subsets from datasets", icon: <Shuffle size={16} /> }
];

export default function DataEngine({ slug = "csv-viewer", toolId = "csv-viewer" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "csv-viewer");
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
    return DATA_TOOLS.find((t) => t.slug === activeSlug) || DATA_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return DATA_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Data & Spreadsheet Tools"
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
            <span className="text-slate-900 dark:text-white capitalize">Data</span>
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
          {DATA_TOOLS.map((tool) => {
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

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "csv-viewer" && <CsvViewer copyText={copyText} copied={copied} />}
          {activeSlug === "csv-merger" && <CsvMerger copyText={copyText} copied={copied} />}
          {activeSlug === "csv-deduplicator" && <CsvDeduplicator copyText={copyText} copied={copied} />}
          {activeSlug === "csv-column-extractor" && <CsvColumnExtractor copyText={copyText} copied={copied} />}
          {activeSlug === "json-to-xml" && <JsonToXml copyText={copyText} copied={copied} />}
          {activeSlug === "xml-to-json" && <XmlToJson copyText={copyText} copied={copied} />}
          {activeSlug === "tsv-to-csv" && <TsvToCsv copyText={copyText} copied={copied} />}
          {activeSlug === "delimited-text-converter" && <DelimitedConverter copyText={copyText} copied={copied} />}
          {activeSlug === "table-to-markdown" && <TableToMarkdown copyText={copyText} copied={copied} />}
          {activeSlug === "data-sampling-tool" && <DataSampler copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

// Helper CSV parser
function parseCsvSimple(csvText) {
  const lines = csvText.trim().split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map(line => line.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
  return { headers, rows };
}

// 1. CSV VIEWER
function CsvViewer({ copyText, copied }) {
  const [csv, setCsv] = useState("Name,Role,Department,Rating\nAlice Smith,Frontend Engineer,Engineering,4.9\nBob Jones,Product Manager,Product,4.8\nCarol White,Data Scientist,Analytics,5.0\nDavid Brown,UI/UX Designer,Design,4.7");
  const [search, setSearch] = useState("");

  const { headers, rows } = useMemo(() => parseCsvSimple(csv), [csv]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => r.some(col => String(col).toLowerCase().includes(q)));
  }, [rows, search]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> Interactive CSV Viewer & Filter
          </h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search table rows..."
            className="bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
          />
        </div>

        <textarea
          rows={4}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Paste CSV data here..."
          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
        />

        {headers.length > 0 && (
          <div className="border border-white/10 rounded-xl overflow-x-auto bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-white font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredRows.map((r, ri) => (
                  <tr key={ri} className="hover:bg-white/5 transition">
                    {r.map((c, ci) => (
                      <td key={ci} className="px-4 py-2.5 whitespace-nowrap">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. CSV MERGER
function CsvMerger({ copyText, copied }) {
  const [csv1, setCsv1] = useState("Name,Score\nAlice,90\nBob,85");
  const [csv2, setCsv2] = useState("Name,Score\nCarol,95\nDavid,88");

  const merged = useMemo(() => {
    const l1 = csv1.trim().split("\n").filter(Boolean);
    const l2 = csv2.trim().split("\n").filter(Boolean);
    if (l1.length === 0) return csv2;
    if (l2.length === 0) return csv1;
    // skip header of l2 if it matches
    const body2 = l2[0].toLowerCase() === l1[0].toLowerCase() ? l2.slice(1) : l2;
    return [...l1, ...body2].join("\n");
  }, [csv1, csv2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Merge Multiple CSV Datasets</h3>
          <button onClick={() => copyText(merged)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Merged CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dataset A</label>
            <textarea rows={4} value={csv1} onChange={(e) => setCsv1(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dataset B</label>
            <textarea rows={4} value={csv2} onChange={(e) => setCsv2(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <span className="text-xs text-slate-400 block mb-2 font-semibold">Combined Output:</span>
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{merged}</pre>
        </div>
      </div>
    </div>
  );
}

// 3. CSV DEDUPLICATOR
function CsvDeduplicator({ copyText, copied }) {
  const [csv, setCsv] = useState("Email,Name\nalice@example.com,Alice\nbob@example.com,Bob\nalice@example.com,Alice Duplicate\ncarol@example.com,Carol");

  const deduped = useMemo(() => {
    const lines = csv.trim().split("\n").filter(Boolean);
    if (lines.length <= 1) return csv;
    const header = lines[0];
    const seen = new Set();
    const unique = [header];
    lines.slice(1).forEach((l) => {
      const key = l.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(l);
      }
    });
    return unique.join("\n");
  }, [csv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">CSV Duplicate Row Remover</h3>
          <button onClick={() => copyText(deduped)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Cleaned CSV
          </button>
        </div>
        <textarea rows={6} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{deduped}</pre>
        </div>
      </div>
    </div>
  );
}

// 4. CSV COLUMN EXTRACTOR
function CsvColumnExtractor({ copyText, copied }) {
  const [csv, setCsv] = useState("Name,Email,City,Salary\nAlice,alice@mail.com,New York,90000\nBob,bob@mail.com,London,85000");
  const [targetCol, setTargetCol] = useState("Email");

  const extracted = useMemo(() => {
    const { headers, rows } = parseCsvSimple(csv);
    const colIdx = headers.findIndex(h => h.toLowerCase() === targetCol.toLowerCase());
    if (colIdx === -1) return "Column not found.";
    return [headers[colIdx], ...rows.map(r => r[colIdx])].join("\n");
  }, [csv, targetCol]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Extract Specific Column from CSV</h3>
          <button onClick={() => copyText(extracted)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Column
          </button>
        </div>
        <div className="flex gap-4">
          <input type="text" value={targetCol} onChange={(e) => setTargetCol(e.target.value)} placeholder="Target Column Name..." className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
        </div>
        <textarea rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{extracted}</pre>
        </div>
      </div>
    </div>
  );
}

// 5. JSON TO XML
function JsonToXml({ copyText, copied }) {
  const [json, setJson] = useState('{\n  "user": {\n    "name": "Alice",\n    "role": "Admin",\n    "active": true\n  }\n}');

  const xml = useMemo(() => {
    try {
      const obj = JSON.parse(json);
      const toXml = (o, tag = "root") => {
        let str = `<${tag}>`;
        if (typeof o === "object" && o !== null) {
          for (let k in o) str += toXml(o[k], k);
        } else {
          str += String(o);
        }
        str += `</${tag}>`;
        return str;
      };
      return toXml(obj);
    } catch (e) {
      return "Invalid JSON input.";
    }
  }, [json]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">JSON to XML Converter</h3>
          <button onClick={() => copyText(xml)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy XML
          </button>
        </div>
        <textarea rows={6} value={json} onChange={(e) => setJson(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{xml}</pre>
        </div>
      </div>
    </div>
  );
}

// 6. XML TO JSON
function XmlToJson({ copyText, copied }) {
  const [xml, setXml] = useState('<user><name>Alice</name><role>Admin</role></user>');
  const [result, setResult] = useState('{\n  "user": {\n    "name": "Alice",\n    "role": "Admin"\n  }\n}');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">XML to JSON Converter</h3>
        <textarea rows={4} value={xml} onChange={(e) => setXml(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{result}</pre>
        </div>
      </div>
    </div>
  );
}

// 7. TSV TO CSV
function TsvToCsv({ copyText, copied }) {
  const [tsv, setTsv] = useState("Name\tAge\tCity\nAlice\t28\tNew York\nBob\t34\tSan Francisco");
  const csv = useMemo(() => tsv.split("\n").map(l => l.split("\t").join(",")).join("\n"), [tsv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">TSV to CSV Converter</h3>
          <button onClick={() => copyText(csv)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy CSV
          </button>
        </div>
        <textarea rows={5} value={tsv} onChange={(e) => setTsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{csv}</pre>
        </div>
      </div>
    </div>
  );
}

// 8. DELIMITED CONVERTER
function DelimitedConverter(props) {
  return <TsvToCsv {...props} />;
}

// 9. TABLE TO MARKDOWN
function TableToMarkdown({ copyText, copied }) {
  const [csv, setCsv] = useState("Product,Price,Quantity\nApple,$1.20,10\nBanana,$0.80,25\nOrange,$1.50,15");

  const md = useMemo(() => {
    const { headers, rows } = parseCsvSimple(csv);
    if (headers.length === 0) return "";
    let res = `| ${headers.join(" | ")} |\n`;
    res += `| ${headers.map(() => "---").join(" | ")} |\n`;
    rows.forEach((r) => {
      res += `| ${r.join(" | ")} |\n`;
    });
    return res;
  }, [csv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Convert Table / CSV to Markdown Table</h3>
          <button onClick={() => copyText(md)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Markdown Table
          </button>
        </div>
        <textarea rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{md}</pre>
        </div>
      </div>
    </div>
  );
}

// 10. DATA SAMPLER
function DataSampler({ copyText, copied }) {
  const [csv, setCsv] = useState("ID,Item\n1,Alpha\n2,Beta\n3,Gamma\n4,Delta\n5,Epsilon\n6,Zeta\n7,Eta\n8,Theta");
  const [sampleSize, setSampleSize] = useState(3);

  const sampled = useMemo(() => {
    const lines = csv.trim().split("\n").filter(Boolean);
    if (lines.length <= 1) return csv;
    const header = lines[0];
    const data = lines.slice(1);
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return [header, ...shuffled.slice(0, sampleSize)].join("\n");
  }, [csv, sampleSize]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Random Data Sample Generator</h3>
          <button onClick={() => copyText(sampled)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Sample
          </button>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Number of Random Rows</label>
          <input type="number" min="1" value={sampleSize} onChange={(e) => setSampleSize(Math.max(1, Number(e.target.value)))} className="w-32 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{sampled}</pre>
        </div>
      </div>
    </div>
  );
}

