import React, { useState, useMemo, useCallback, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function downloadBlob(bytes, filename, mime = "application/pdf") {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parsePageRanges(rangeStr, totalPages) {
  const indices = [];
  const parts = String(rangeStr || "").split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [aRaw, bRaw] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!Number.isNaN(aRaw) && !Number.isNaN(bRaw)) {
        const start = Math.max(1, Math.min(aRaw, bRaw));
        const end = Math.min(totalPages, Math.max(aRaw, bRaw));
        for (let p = start; p <= end; p++) indices.push(p - 1);
      }
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= totalPages) indices.push(n - 1);
    }
  }
  return indices;
}
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Copy,
  Check,
  FileText,
  RotateCw,
  Layers,
  Split,
  Eye,
  BookOpen,
  Sparkles,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Trash2,
  FileSpreadsheet,
  Images,
  Hash
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   PDF & DOCUMENT UTILITY TOOLS METADATA
   ========================================================================================= */
const PDF_TOOLS = [
  { slug: "images-to-pdf", title: "Images to PDF", highlight: "CONVERT & BIND", tag: "JPG/PNG to PDF", desc: "Convert photo collections into clean multi-page printable PDF documents", icon: <Images size={16} /> },
  { slug: "merge-pdf", title: "Merge PDF", highlight: "CLIENT BINDER", tag: "Combine Documents", desc: "Combine multiple PDF documents into one seamless file locally", icon: <Layers size={16} /> },
  { slug: "split-pdf", title: "Split PDF", highlight: "EXTRACT PAGES", tag: "Page Range Picker", desc: "Extract specific individual pages or custom ranges from PDFs", icon: <Split size={16} /> },
  { slug: "rotate-pdf", title: "Rotate PDF", highlight: "ORIENTATION", tag: "90° & 180° Turns", desc: "Rotate upside-down and sideways PDF pages permanently", icon: <RotateCw size={16} /> },
  { slug: "reorder-pdf-pages", title: "Reorder Pages", highlight: "PAGINATION", tag: "Rearrange Order", desc: "Reorganize and reorder PDF page sequencing effortlessly", icon: <Layers size={16} /> },
  { slug: "pdf-to-images", title: "PDF to Images", highlight: "EXPORT", tag: "PNG & JPG Pages", desc: "Convert each PDF document page into high-resolution image files", icon: <FileText size={16} /> },
  { slug: "pdf-metadata-viewer", title: "PDF Metadata", highlight: "INSPECTOR", tag: "Author, Title, Version", desc: "Inspect hidden PDF metadata, creation timestamps, and software versions", icon: <Eye size={16} /> },
  { slug: "extract-pdf-text", title: "Extract PDF Text", highlight: "TEXT PARSER", tag: "Content Scraper", desc: "Extract raw plaintext, paragraphs, and tables from PDF documents", icon: <FileText size={16} /> },
  { slug: "word-counter-for-documents", title: "Doc Word Counter", highlight: "METRICS", tag: "Words & Characters", desc: "Accurately count words, reading time, and lines in uploaded PDFs", icon: <BookOpen size={16} /> },
  { slug: "document-page-counter", title: "Page Counter", highlight: "SHEET COUNT", tag: "Page Dimensions", desc: "Count total pages and inspect sheet sizes (A4, Letter, Legal)", icon: <Hash size={16} /> }
];

export default function PdfEngine({ slug = "images-to-pdf", toolId = "images-to-pdf" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "images-to-pdf");
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
    return PDF_TOOLS.find((t) => t.slug === activeSlug) || PDF_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return PDF_TOOLS.map((t) => ({
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
        categoryTitle="PDF & Document Tools"
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
            <span className="text-slate-900 dark:text-white capitalize">PDF</span>
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
          {PDF_TOOLS.map((tool) => {
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
          {(activeSlug === "images-to-pdf" || toolId === "images-to-pdf") && <ImagesToPdfTool />}
          {(activeSlug === "extract-pdf-text" || toolId === "extract-pdf-text" || activeSlug === "word-counter-for-documents") && (
            <ExtractTextTool copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "pdf-metadata-viewer" || toolId === "pdf-metadata-viewer") && (
            <PdfMetadataTool copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "document-page-counter" || toolId === "document-page-counter") && <DocumentPageCounterTool />}
          {(activeSlug === "rotate-pdf" || toolId === "rotate-pdf") && <RotatePdfTool />}
          {(activeSlug === "merge-pdf" || activeSlug === "split-pdf" || activeSlug === "reorder-pdf-pages" || activeSlug === "pdf-to-images") && (
            <UniversalPdfWorkspace slug={activeSlug} />
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGES TO PDF (100% Client-Side Pure Canvas to Printable PDF)
// ============================================================================
function ImagesToPdfTool() {
  const [images, setImages] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, { name: file.name, src: ev.target?.result, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImg = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateAndPrintPdf = () => {
    if (!images.length) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow popups to generate and download your PDF.");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stiknex Generated PDF</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { margin: 0; padding: 0; font-family: sans-serif; text-align: center; }
            .page { page-break-after: always; display: flex; align-items: center; justify-content: center; min-height: 95vh; }
            img { max-width: 100%; max-height: 90vh; object-fit: contain; }
          </style>
        </head>
        <body>
          ${images.map((img) => `<div class="page"><img src="${img.src}" /></div>`).join("")}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" multiple accept="image/*" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-sm">
            <Upload size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Select Multiple Photos or Scans</h4>
            <p className="text-xs text-slate-500 mt-1">Converts photos into formatted PDF pages locally without limits.</p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{images.length} Image Pages Loaded</span>
            <button
              onClick={generateAndPrintPdf}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Download size={16} /> Save & Print as PDF
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img src={img.src} alt="Page" className="w-full h-28 object-cover rounded-xl" />
                <span className="text-[10px] font-bold text-slate-500 block truncate mt-2">Page {idx + 1}</span>
                <button
                  onClick={() => removeImg(idx)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: EXTRACT PDF TEXT & DOCUMENT WORD COUNTER
// ============================================================================
function ExtractTextTool({ copyText, copied }) {
  const [extracted, setExtracted] = useState("Stiknex Universal Document Text Engine.\nUpload any PDF, text, or markdown document to extract clean strings, count words, and analyze characters.");
  const [fileName, setFileName] = useState("sample-document.txt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError("");
    setLoading(true);
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const pageTexts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map((item) => item.str || "").join(" ").replace(/\s+/g, " ").trim();
          pageTexts.push(`--- Page ${i} ---\n${text}`);
        }
        const combined = pageTexts.join("\n\n").trim();
        setExtracted(combined || "(No selectable text found in this PDF — it may be a scanned image PDF.)");
      } else {
        const content = await file.text();
        setExtracted(content);
      }
    } catch (err) {
      setError(err?.message || "Failed to extract text from this file.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = useMemo(() => {
    return extracted.trim() ? extracted.trim().split(/\s+/).length : 0;
  }, [extracted]);

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept=".txt,.md,.json,.csv,.html,.xml,.pdf" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">{loading ? "Extracting text..." : "Upload PDF or Document to Extract Text"}</h4>
        <p className="text-xs text-slate-500 mt-1">Supports PDF, TXT, MD, CSV, JSON, HTML, and XML files locally in your browser.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border text-center">
          <span className="text-xs text-slate-500 block">Total Words</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{wordCount.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border text-center">
          <span className="text-xs text-slate-500 block">Total Characters</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{extracted.length.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border text-center col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 block">Estimated Reading Time</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{Math.ceil(wordCount / 200)} min</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Contents ({fileName})</span>
          <button onClick={() => copyText(extracted)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied!" : "Copy Document Text"}
          </button>
        </div>
        <textarea
          rows={10}
          value={extracted}
          onChange={(e) => setExtracted(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm leading-relaxed"
        />
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: PDF METADATA & PAGE COUNTER
// ============================================================================
function PdfMetadataTool() {
  const [meta, setMeta] = useState({
    name: "No file loaded",
    size: "-",
    pages: "-",
    title: "-",
    author: "-",
    creator: "-",
    producer: "-",
    encrypted: "-"
  });
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        pages: String(doc.getPageCount()),
        title: doc.getTitle() || "-",
        author: doc.getAuthor() || "-",
        creator: doc.getCreator() || "-",
        producer: doc.getProducer() || "-",
        encrypted: doc.isEncrypted ? "Yes" : "No"
      });
    } catch (err) {
      setError(err?.message || "Could not read PDF metadata.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept=".pdf" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Upload PDF File to Inspect Properties</h4>
        <p className="text-xs text-slate-500 mt-1">Reads real page count, title, author, creator, and encryption status locally.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(meta).map(([key, val]) => (
          <div key={key} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 capitalize shrink-0">{key}</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white truncate">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentPageCounterTool() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const totalPages = files.reduce((acc, f) => acc + f.pages, 0);

  const handleFiles = async (e) => {
    const newFiles = Array.from(e.target.files || []);
    setError("");
    const items = [];
    for (const f of newFiles) {
      try {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        items.push({
          name: f.name,
          size: `${(f.size / 1024).toFixed(1)} KB`,
          pages: doc.getPageCount()
        });
      } catch {
        setError(`Could not parse page count for ${f.name}.`);
      }
    }
    if (items.length) setFiles((prev) => [...prev, ...items]);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" multiple accept=".pdf" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Upload PDFs to Tally Total Pages</h4>
        <p className="text-xs text-slate-500 mt-1">Batch compute exact PDF page counts locally in your browser.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex items-center justify-between shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Total Page Count</span>
          <div className="text-5xl font-black tracking-tight">{totalPages} Pages</div>
        </div>
        <span className="px-4 py-2 bg-indigo-500/50 rounded-xl font-bold text-sm">{files.length} Documents</span>
      </div>

      <div className="space-y-2">
        {files.map((f, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{f.name}</span>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-slate-400">{f.size}</span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold">{f.pages} pgs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RotatePdfTool() {
  const [rotation, setRotation] = useState(90);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPdfFile({ name: file.name, bytes });
      setPageCount(doc.getPageCount());
    } catch (err) {
      setError(err?.message || "Invalid PDF file.");
    }
  };

  const applyAndDownload = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError("");
    try {
      const doc = await PDFDocument.load(pdfFile.bytes, { ignoreEncryption: true });
      for (const page of doc.getPages()) {
        const current = page.getRotation().angle || 0;
        page.setRotation(degrees((current + rotation) % 360));
      }
      const out = await doc.save();
      downloadBlob(out, `rotated-${pdfFile.name}`);
    } catch (err) {
      setError(err?.message || "Failed to rotate PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept=".pdf" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">{pdfFile ? `${pdfFile.name} (${pageCount} pages)` : "Upload PDF to Rotate"}</h4>
        <p className="text-xs text-slate-500 mt-1">Rotate clockwise 90°, 180°, or 270° and download.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {[90, 180, 270].map((deg) => (
          <button
            key={deg}
            onClick={() => setRotation(deg)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${rotation === deg ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}
          >
            <RotateCw size={14} /> Rotate {deg}°
          </button>
        ))}
      </div>

      <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border flex flex-col items-center justify-center gap-4">
        <div
          className="w-32 h-44 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 transition-transform duration-300 shadow-md"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          Page Preview
        </div>
        <button
          onClick={applyAndDownload}
          disabled={!pdfFile || busy}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow cursor-pointer"
        >
          {busy ? "Processing..." : "Apply & Download Rotated PDF"}
        </button>
      </div>
    </div>
  );
}

function UniversalPdfWorkspace({ slug }) {
  const isSplit = slug === "split-pdf";
  const isMerge = slug === "merge-pdf";
  const isReorder = slug === "reorder-pdf-pages";
  const isToImages = slug === "pdf-to-images";

  const [files, setFiles] = useState([]);
  const [pageRange, setPageRange] = useState("1");
  const [renderedImages, setRenderedImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setStatusMsg("");
    setRenderedImages([]);
  }, [slug]);

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setError("");
    setStatusMsg("");
    setRenderedImages([]);
    const loaded = [];
    for (const f of selected) {
      try {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        loaded.push({ name: f.name, bytes, pages: doc.getPageCount(), sizeKb: (f.size / 1024).toFixed(1) });
      } catch {
        setError(`Could not load "${f.name}" as a valid PDF.`);
      }
    }
    if (loaded.length) {
      if (isMerge) {
        setFiles((prev) => [...prev, ...loaded]);
      } else {
        const first = loaded[0];
        setFiles([first]);
        setPageRange(isReorder ? Array.from({ length: first.pages }, (_, i) => i + 1).join(", ") : `1-${first.pages}`);
      }
    }
  };

  const moveFile = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= files.length) return;
    const copy = [...files];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setFiles(copy);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAction = async () => {
    if (!files.length) {
      setError("Please upload at least one PDF file first.");
      return;
    }
    setBusy(true);
    setError("");
    setStatusMsg("");
    try {
      if (isMerge) {
        const merged = await PDFDocument.create();
        for (const item of files) {
          const src = await PDFDocument.load(item.bytes, { ignoreEncryption: true });
          const copiedPages = await merged.copyPages(src, src.getPageIndices());
          copiedPages.forEach((p) => merged.addPage(p));
        }
        const out = await merged.save();
        downloadBlob(out, "merged-stiknex.pdf");
        setStatusMsg(`Merged ${files.length} PDFs (${merged.getPageCount()} pages total) and started download.`);
      } else if (isSplit || isReorder) {
        const srcItem = files[0];
        const src = await PDFDocument.load(srcItem.bytes, { ignoreEncryption: true });
        const indices = parsePageRanges(pageRange, src.getPageCount());
        if (!indices.length) {
          setError(`No valid pages found in "${pageRange}". Document has ${src.getPageCount()} pages.`);
          setBusy(false);
          return;
        }
        const outDoc = await PDFDocument.create();
        const copiedPages = await outDoc.copyPages(src, indices);
        copiedPages.forEach((p) => outDoc.addPage(p));
        const out = await outDoc.save();
        downloadBlob(out, `${isReorder ? "reordered" : "split"}-${srcItem.name}`);
        setStatusMsg(`Created PDF with ${indices.length} page(s) and started download.`);
      } else if (isToImages) {
        const srcItem = files[0];
        const pdf = await pdfjsLib.getDocument({ data: srcItem.bytes.slice(0) }).promise;
        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
          imgs.push({ page: i, url: canvas.toDataURL("image/png") });
        }
        setRenderedImages(imgs);
        setStatusMsg(`Rendered ${imgs.length} page(s) as PNG images.`);
      }
    } catch (err) {
      setError(err?.message || "Failed to process PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" multiple={isMerge} accept=".pdf" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">{isMerge ? "Select PDFs to Merge" : isSplit ? "Select PDF to Split" : "Select PDF Document"}</h4>
        <p className="text-xs text-slate-500 mt-1">Process document pages locally inside your browser without uploading to external servers.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {statusMsg}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, idx) => (
            <div key={`${f.name}-${idx}`} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{f.name}</p>
                <p className="text-xs text-slate-500">{f.pages} pages • {f.sizeKb} KB</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {isMerge && (
                  <>
                    <button type="button" onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer">↑</button>
                    <button type="button" onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer">↓</button>
                  </>
                )}
                <button type="button" onClick={() => removeFile(idx)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer" aria-label="Remove file">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isSplit || isReorder) && files.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {isReorder ? "New Page Order (comma-separated, e.g. 3, 1, 2)" : "Pages to Extract (e.g. 1-3, 5)"}
          </label>
          <input
            type="text"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm"
          />
        </div>
      )}

      <div className="p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border text-center space-y-4">
        <Layers size={36} className="text-indigo-600 mx-auto" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          {isMerge ? "Merge Queue Ready" : isToImages ? "PDF Page Renderer" : "Document Page Organizer"}
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {isMerge
            ? "Add two or more PDF files, arrange their order, and merge them into a single PDF download."
            : isToImages
            ? "Render each PDF page into a downloadable PNG image directly in your browser."
            : "Extract or reorder custom page ranges (e.g. 1-5, 8) and download the resulting PDF."}
        </p>
        <button
          type="button"
          onClick={handleAction}
          disabled={busy || !files.length}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          {busy ? "Processing..." : isMerge ? "Merge All Documents" : isToImages ? "Render PDF Pages" : "Extract & Download PDF"}
        </button>
      </div>

      {renderedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderedImages.map((img) => (
            <div key={img.page} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <img src={img.url} alt={`Page ${img.page}`} className="w-full rounded-xl border border-slate-100 dark:border-slate-800" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Page {img.page}</span>
                <a href={img.url} download={`page-${img.page}.png`} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  <Download size={13} /> PNG
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
