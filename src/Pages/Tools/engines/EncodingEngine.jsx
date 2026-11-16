import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Code,
  FileText,
  Clock,
  Shield,
  Search,
  Copy,
  Check,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle2,
  Share2,
  Trash2,
  ArrowRightLeft,
  Sparkles,
  Menu,
  Sun,
  Moon,
  ExternalLink,
  Layers,
  Terminal,
  Hash,
  Link2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   ENCODING & WEB PROTOCOLS TOOLS METADATA
   ========================================================================================= */
const ENCODING_TOOLS = [
  { slug: "url-encoder-decoder", title: "URL Encoder", highlight: "URI PROTOCOL", tag: "encodeURIComponent", desc: "Encode or decode special characters in URLs and query strings", icon: <Globe size={16} /> },
  { slug: "html-entity-encoder-decoder", title: "HTML Entities", highlight: "MARKUP ESCAPE", tag: "XSS Protection", desc: "Convert special characters to named or numeric HTML entities", icon: <Code size={16} /> },
  { slug: "base64-encoder-decoder", title: "Base64 Encoder", highlight: "RFC 4648", tag: "UTF-8 & Binary", desc: "Encode text and files to Base64 or decode Base64 to plaintext", icon: <FileText size={16} /> },
  { slug: "jwt-decoder", title: "JWT Decoder", highlight: "AUTH TOKEN", tag: "Header & Claims", desc: "Inspect and decode JSON Web Tokens without sending secrets to servers", icon: <Shield size={16} /> },
  { slug: "unix-timestamp-converter", title: "Unix Timestamp", highlight: "EPOCH TIME", tag: "Seconds & Millis", desc: "Convert Unix timestamps to human UTC/Local dates and vice versa", icon: <Clock size={16} /> },
  { slug: "cron-expression-explainer", title: "Cron Explainer", highlight: "CRONTAB", tag: "Schedule Parser", desc: "Translate 5-part and 6-part cron expressions into plain English schedules", icon: <Terminal size={16} /> },
  { slug: "query-string-parser", title: "Query Parser", highlight: "URL PARAMS", tag: "Key-Value Pairs", desc: "Parse complex URL search params into editable JSON tables", icon: <Search size={16} /> },
  { slug: "http-status-code-reference", title: "HTTP Status", highlight: "RFC REFERENCE", tag: "1xx to 5xx Codes", desc: "Searchable reference of all official HTTP status codes and headers", icon: <Hash size={16} /> },
  { slug: "mime-type-lookup", title: "MIME Lookup", highlight: "CONTENT-TYPE", tag: "Media & Formats", desc: "Lookup MIME types and Content-Type headers by file extension", icon: <Layers size={16} /> },
  { slug: "meta-tag-preview-generator", title: "Meta Preview", highlight: "SOCIAL CARDS", tag: "Open Graph & SEO", desc: "Preview Google, Twitter, and Facebook social share meta cards", icon: <Share2 size={16} /> },
  { slug: "url-shortener", title: "URL Shortener", highlight: "LINK ALIAS", tag: "Vanity & UTM", desc: "Generate clean short links, trackable vanity URLs, and QR codes", icon: <Link2 size={16} /> }
];

export default function EncodingEngine({ slug = "url-encoder-decoder", toolId = "url-encoder-decoder" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "url-encoder-decoder");
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
    return ENCODING_TOOLS.find((t) => t.slug === activeSlug) || ENCODING_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return ENCODING_TOOLS.map((t) => ({
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
        categoryTitle="Encoding & Protocol Tools"
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
            <span className="text-slate-900 dark:text-white capitalize">Encoding</span>
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
          {ENCODING_TOOLS.map((tool) => {
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

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "url-encoder-decoder" && <UrlEncoderTool copyText={copyText} copied={copied} />}
          {activeSlug === "html-entity-encoder-decoder" && <HtmlEntityTool copyText={copyText} copied={copied} />}
          {activeSlug === "base64-encoder-decoder" && <Base64Tool copyText={copyText} copied={copied} />}
          {activeSlug === "jwt-decoder" && <JwtDecoderTool copyText={copyText} copied={copied} />}
          {activeSlug === "unix-timestamp-converter" && <UnixTimestampTool copyText={copyText} copied={copied} />}
          {activeSlug === "cron-expression-explainer" && <CronExplainerTool copyText={copyText} copied={copied} />}
          {activeSlug === "query-string-parser" && <QueryParserTool copyText={copyText} copied={copied} />}
          {activeSlug === "http-status-code-reference" && <HttpStatusTool copyText={copyText} copied={copied} />}
          {activeSlug === "mime-type-lookup" && <MimeTypeTool copyText={copyText} copied={copied} />}
          {activeSlug === "meta-tag-preview-generator" && <MetaTagPreviewTool copyText={copyText} copied={copied} />}
          {activeSlug === "url-shortener" && <UrlShortenerTool copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================================
   TOOL 1: URL ENCODER / DECODER
   ========================================================================================= */
function UrlEncoderTool({ copyText, copied }) {
  const [input, setInput] = useState("https://stiknex.site/search?q=free productivity tools&category=writing & notes#top");
  const [mode, setMode] = useState("encode");
  const [componentMode, setComponentMode] = useState(true);

  const result = useMemo(() => {
    try {
      if (mode === "encode") {
        return componentMode ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return componentMode ? decodeURIComponent(input) : decodeURI(input);
      }
    } catch {
      return "Malformed URI sequence.";
    }
  }, [input, mode, componentMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              mode === "encode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            URL Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              mode === "decode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            URL Decode
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={componentMode}
            onChange={(e) => setComponentMode(e.target.checked)}
          />
          <span>Encode Component (encodes / : ? & = #)</span>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input String</label>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-indigo-600/20">
          <div className="w-full overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
              {mode === "encode" ? "Encoded URL Result" : "Decoded URL Result"}
            </span>
            <p className="font-mono text-xs break-all select-all leading-relaxed">{result}</p>
          </div>
          <button
            onClick={() => copyText(result)}
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-md flex items-center gap-2 shrink-0 self-end sm:self-center"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Result"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 2: HTML ENTITY ENCODER / DECODER
   ========================================================================================= */
function HtmlEntityTool({ copyText, copied }) {
  const [input, setInput] = useState(`<div class="alert">Hello "World" & 'Universe' <script>alert(1)</script></div>`);
  const [mode, setMode] = useState("encode");

  const result = useMemo(() => {
    if (mode === "encode") {
      return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    } else {
      const el = document.createElement("textarea");
      el.innerHTML = input;
      return el.value;
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setMode("encode")}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
            mode === "encode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Encode Entities
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
            mode === "decode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Decode Entities
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Source Text</label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Processed Output
            </label>
            <button
              onClick={() => copyText(result)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={result}
            className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 3: BASE64 ENCODER / DECODER (UTF-8 SAFE)
   ========================================================================================= */
function Base64Tool({ copyText, copied }) {
  const [input, setInput] = useState("Stiknex: 100% Client-Side Privacy & Productivity 🚀");
  const [mode, setMode] = useState("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  // UTF-8 Safe Base64 implementation (prevents URIError / Latin1 crash with unicode & emojis)
  const result = useMemo(() => {
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        let b64 = btoa(binary);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        return b64;
      } else {
        let b64 = input.trim();
        if (urlSafe) {
          b64 = b64.replace(/-/g, "+").replace(/_/g, "/");
          while (b64.length % 4) b64 += "=";
        }
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder().decode(bytes);
      }
    } catch {
      return "Invalid Base64 sequence or encoding error.";
    }
  }, [input, mode, urlSafe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              mode === "encode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            Base64 Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              mode === "decode" ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            Base64 Decode
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400">
          <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />
          <span>URL-Safe Base64 (- and _ without padding)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input String</label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Base64 Result
            </label>
            <button
              onClick={() => copyText(result)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={result}
            className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 4: JWT DECODER (100% PRIVATE)
   ========================================================================================= */
function JwtDecoderTool({ copyText, copied }) {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggUml2ZXJhIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.g_Ndf1VvE3_Zq1Vf2yS6x9YxLqO51J59NfE3x1G9F2g"
  );

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) return { error: "A valid JWT token consists of at least 2 dot-separated base64 parts." };

      const parseB64 = (str) => {
        let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4) b64 += "=";
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return JSON.parse(new TextDecoder().decode(bytes));
      };

      const header = parseB64(parts[0]);
      const payload = parseB64(parts[1]);
      const signature = parts[2] || "";

      let isExpired = false;
      let expDate = null;
      let iatDate = null;

      if (payload.exp) {
        expDate = new Date(payload.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }
      if (payload.iat) {
        iatDate = new Date(payload.iat * 1000);
      }

      return {
        header,
        payload,
        signature,
        isExpired,
        expDate,
        iatDate,
        valid: true
      };
    } catch (err) {
      return { error: err.message, valid: false };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Encoded JWT Token</label>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT string (Header.Payload.Signature)..."
          className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      {decoded.valid ? (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            {decoded.expDate ? (
              decoded.isExpired ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
                  <AlertCircle size={14} /> Token Expired on {decoded.expDate.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Active Token (Expires {decoded.expDate.toLocaleString()})
                </span>
              )
            ) : (
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                No Expiration Set
              </span>
            )}

            {decoded.iatDate && (
              <span className="text-xs text-slate-500">Issued: {decoded.iatDate.toLocaleDateString()}</span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Header (Algorithm & Type)
                </label>
                <button
                  onClick={() => copyText(JSON.stringify(decoded.header, null, 2))}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Copy Header
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={JSON.stringify(decoded.header, null, 2)}
                className="w-full p-4 bg-rose-50/30 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 rounded-2xl font-mono text-xs text-rose-950 dark:text-rose-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Payload (Claims & User Data)
                </label>
                <button
                  onClick={() => copyText(JSON.stringify(decoded.payload, null, 2))}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Copy Payload
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={JSON.stringify(decoded.payload, null, 2)}
                className="w-full p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl font-mono text-xs text-indigo-950 dark:text-indigo-200"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-600 text-xs font-mono">
          {decoded.error}
        </div>
      )}
    </div>
  );
}

/* =========================================================================================
   TOOL 5: UNIX TIMESTAMP CONVERTER
   ========================================================================================= */
function UnixTimestampTool({ copyText, copied }) {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState(() => String(Math.floor(Date.now() / 1000)));

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const converted = useMemo(() => {
    const val = Number(inputTs.trim());
    if (isNaN(val) || !val) return null;
    const isMillis = val > 100000000000;
    const date = new Date(isMillis ? val : val * 1000);
    return {
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      relative: formatRelativeTime(date)
    };
  }, [inputTs]);

  function formatRelativeTime(targetDate) {
    const diffSec = Math.floor((targetDate.getTime() - Date.now()) / 1000);
    const absSec = Math.abs(diffSec);
    const suffix = diffSec >= 0 ? "from now" : "ago";
    if (absSec < 60) return `${absSec} seconds ${suffix}`;
    if (absSec < 3600) return `${Math.floor(absSec / 60)} minutes ${suffix}`;
    if (absSec < 86400) return `${Math.floor(absSec / 3600)} hours ${suffix}`;
    return `${Math.floor(absSec / 86400)} days ${suffix}`;
  }

  return (
    <div className="space-y-6">
      {/* Current Ticking Epoch Hero */}
      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-600/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
            Current Epoch Timestamp (Live)
          </span>
          <span className="text-3xl sm:text-4xl font-mono font-black">{currentTimestamp}</span>
        </div>
        <button
          onClick={() => copyText(currentTimestamp)}
          className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-md flex items-center gap-2"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Live Timestamp"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Enter Timestamp (Seconds or Milliseconds)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputTs}
              onChange={(e) => setInputTs(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm font-bold text-slate-900 dark:text-white"
            />
            <button
              onClick={() => setInputTs(String(Math.floor(Date.now() / 1000)))}
              className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-xs hover:bg-slate-200"
            >
              Set Now
            </button>
          </div>
        </div>

        {converted && (
          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-sans font-bold">UTC Time:</span>
              <span className="font-bold text-slate-900 dark:text-white">{converted.utc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-sans font-bold">Local Time:</span>
              <span className="font-bold text-slate-900 dark:text-white">{converted.local}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-sans font-bold">ISO 8601:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{converted.iso}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-sans font-bold">Relative:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{converted.relative}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 6: CRON EXPRESSION EXPLAINER
   ========================================================================================= */
function CronExplainerTool({ copyText, copied }) {
  const [cron, setCron] = useState("*/15 0 1,15 * 1-5");

  const PRESETS = [
    { label: "Every minute", exp: "* * * * *" },
    { label: "Every 15 minutes", exp: "*/15 * * * *" },
    { label: "Hourly at minute 0", exp: "0 * * * *" },
    { label: "Daily at midnight", exp: "0 0 * * *" },
    { label: "Every Monday at 9AM", exp: "0 9 * * 1" },
    { label: "1st & 15th of month", exp: "0 0 1,15 * *" }
  ];

  const breakdown = useMemo(() => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5) return { error: "Cron expression must contain at least 5 space-separated fields." };

    const [min, hour, dom, mon, dow] = parts;
    const descParts = [];

    if (min === "*") descParts.push("every minute");
    else if (min.startsWith("*/")) descParts.push(`every ${min.replace("*/", "")} minutes`);
    else descParts.push(`at minute ${min}`);

    if (hour === "*") descParts.push("of every hour");
    else if (hour.startsWith("*/")) descParts.push(`every ${hour.replace("*/", "")} hours`);
    else descParts.push(`past hour ${hour}`);

    if (dom !== "*") descParts.push(`on day of month ${dom}`);
    if (mon !== "*") descParts.push(`in month ${mon}`);
    if (dow !== "*") descParts.push(`on weekday ${dow}`);

    return {
      human: `Runs ${descParts.join(", ")}.`,
      fields: [
        { name: "Minute", val: min, spec: "0-59" },
        { name: "Hour", val: hour, spec: "0-23" },
        { name: "Day of Month", val: dom, spec: "1-31" },
        { name: "Month", val: mon, spec: "1-12 or JAN-DEC" },
        { name: "Day of Week", val: dow, spec: "0-6 or SUN-SAT" }
      ]
    };
  }, [cron]);

  return (
    <div className="space-y-6">
      <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Cron Schedule Expression</label>
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setCron(p.exp)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {breakdown.error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 text-xs font-mono rounded-xl">
          {breakdown.error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/20">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Schedule Meaning</span>
            <p className="text-lg font-bold">{breakdown.human}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {breakdown.fields.map((f) => (
              <div key={f.name} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs font-bold text-slate-400 block mb-1">{f.name}</span>
                <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 block">{f.val}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">({f.spec})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================================
   TOOL 7: QUERY STRING PARSER
   ========================================================================================= */
function QueryParserTool({ copyText, copied }) {
  const [url, setUrl] = useState("https://stiknex.site/explore?category=developer&sort=popular&page=2&tags=json&tags=api");

  const parsed = useMemo(() => {
    try {
      const search = url.includes("?") ? url.split("?")[1] : url;
      const params = new URLSearchParams(search);
      const rows = [];
      params.forEach((value, key) => {
        rows.push({ key, value });
      });
      return { rows, valid: true };
    } catch {
      return { rows: [], valid: false };
    }
  }, [url]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">URL or Query String</label>
        <textarea
          rows={3}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {parsed.rows.length} Parameters Extracted
          </span>
          <button
            onClick={() => copyText(JSON.stringify(parsed.rows, null, 2))}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy as JSON"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5">Parameter Key</th>
                <th className="p-3.5">Decoded Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {parsed.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">{row.key}</td>
                  <td className="p-3.5 text-slate-900 dark:text-white break-all">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 8: HTTP STATUS CODE REFERENCE
   ========================================================================================= */
function HttpStatusTool({ copyText, copied }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const STATUS_CODES = [
    { code: 200, name: "OK", cat: "2xx", desc: "Standard response for successful HTTP requests." },
    { code: 201, name: "Created", cat: "2xx", desc: "The request has been fulfilled, resulting in the creation of a new resource." },
    { code: 204, name: "No Content", cat: "2xx", desc: "The server successfully processed the request and is not returning any content." },
    { code: 301, name: "Moved Permanently", cat: "3xx", desc: "This and all future requests should be directed to the given URI." },
    { code: 302, name: "Found (Temporary Redirect)", cat: "3xx", desc: "Tells the client to look at (browse to) another URL temporarily." },
    { code: 304, name: "Not Modified", cat: "3xx", desc: "Indicates that the resource has not been modified since the version specified by the request headers." },
    { code: 400, name: "Bad Request", cat: "4xx", desc: "The server cannot or will not process the request due to an apparent client error." },
    { code: 401, name: "Unauthorized", cat: "4xx", desc: "Authentication is required and has failed or has not yet been provided." },
    { code: 403, name: "Forbidden", cat: "4xx", desc: "The request was valid, but the server is refusing action. The user may not have the necessary permissions." },
    { code: 404, name: "Not Found", cat: "4xx", desc: "The requested resource could not be found but may be available in the future." },
    { code: 409, name: "Conflict", cat: "4xx", desc: "Indicates that the request could not be processed because of conflict in the current state of the resource." },
    { code: 429, name: "Too Many Requests", cat: "4xx", desc: "The user has sent too many requests in a given amount of time (Rate Limiting)." },
    { code: 500, name: "Internal Server Error", cat: "5xx", desc: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable." },
    { code: 502, name: "Bad Gateway", cat: "5xx", desc: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
    { code: 503, name: "Service Unavailable", cat: "5xx", desc: "The server cannot handle the request (because it is overloaded or down for maintenance)." },
    { code: 504, name: "Gateway Timeout", cat: "5xx", desc: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." }
  ];

  const filtered = useMemo(() => {
    return STATUS_CODES.filter((item) => {
      const matchCat = filter === "all" || item.cat === filter;
      const matchSearch =
        String(item.code).includes(search) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          {["all", "2xx", "3xx", "4xx", "5xx"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase transition ${
                filter === cat
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              {cat === "all" ? "All Codes" : cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or name..."
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.code}
            className="p-5 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono font-black text-lg ${
                  item.code >= 500
                    ? "text-rose-600"
                    : item.code >= 400
                    ? "text-amber-600"
                    : item.code >= 300
                    ? "text-cyan-600"
                    : "text-emerald-600"
                }`}
              >
                {item.code}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 9: MIME TYPE LOOKUP
   ========================================================================================= */
function MimeTypeTool({ copyText, copied }) {
  const [query, setQuery] = useState("");

  const MIME_DATA = [
    { ext: ".json", mime: "application/json", cat: "Application" },
    { ext: ".pdf", mime: "application/pdf", cat: "Document" },
    { ext: ".png", mime: "image/png", cat: "Image" },
    { ext: ".jpg / .jpeg", mime: "image/jpeg", cat: "Image" },
    { ext: ".webp", mime: "image/webp", cat: "Image" },
    { ext: ".svg", mime: "image/svg+xml", cat: "Vector" },
    { ext: ".csv", mime: "text/csv", cat: "Text" },
    { ext: ".html", mime: "text/html", cat: "Markup" },
    { ext: ".css", mime: "text/css", cat: "Stylesheet" },
    { ext: ".js / .mjs", mime: "application/javascript", cat: "Script" },
    { ext: ".zip", mime: "application/zip", cat: "Archive" },
    { ext: ".mp3", mime: "audio/mpeg", cat: "Audio" },
    { ext: ".mp4", mime: "video/mp4", cat: "Video" },
    { ext: ".woff2", mime: "font/woff2", cat: "Font" }
  ];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return MIME_DATA;
    return MIME_DATA.filter((m) => m.ext.toLowerCase().includes(q) || m.mime.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Search File Extension or MIME Type</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. json, png, application/pdf..."
          className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm font-bold text-slate-900 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[11px]">
            <tr>
              <th className="p-3.5">Extension</th>
              <th className="p-3.5">MIME Content-Type</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">{item.ext}</td>
                <td className="p-3.5 text-slate-900 dark:text-white">{item.mime}</td>
                <td className="p-3.5 text-slate-500">{item.cat}</td>
                <td className="p-3.5 text-right">
                  <button onClick={() => copyText(item.mime)} className="text-slate-400 hover:text-indigo-600">
                    <Copy size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 10: META TAG PREVIEW GENERATOR
   ========================================================================================= */
function MetaTagPreviewTool({ copyText, copied }) {
  const [meta, setMeta] = useState({
    title: "Stiknex | Fast, Private Online Utilities & Tools",
    description: "Explore 200+ free online utility tools. Calculators, code formatters, converters, and typing master running 100% locally in your browser.",
    url: "https://stiknex.site",
    image: "https://stiknex.site/og-preview.png"
  });

  const generatedHtml = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}">
<meta name="description" content="${meta.description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${meta.url}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:image" content="${meta.image}">

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${meta.url}">
<meta property="twitter:title" content="${meta.title}">
<meta property="twitter:description" content="${meta.description}">
<meta property="twitter:image" content="${meta.image}">`;
  }, [meta]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Page Title</label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="w-full p-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Canonical URL</label>
            <input
              type="text"
              value={meta.url}
              onChange={(e) => setMeta({ ...meta, url: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Social Image URL</label>
            <input
              type="text"
              value={meta.image}
              onChange={(e) => setMeta({ ...meta, image: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Live Social Card Preview */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Social Card Simulation</label>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
            <div className="w-full h-36 bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              OG Image Preview
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">{new URL(meta.url || "https://stiknex.site").hostname}</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{meta.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{meta.description}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Generated HTML Tags</label>
              <button onClick={() => copyText(generatedHtml)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                {copied ? <Check size={12} /> : <Copy size={12} />} Copy HTML
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={generatedHtml}
              className="w-full p-3 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl font-mono text-[11px] text-indigo-950 dark:text-indigo-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 11: URL SHORTENER & LINK BUILDER
   ========================================================================================= */
function UrlShortenerTool({ copyText, copied }) {
  const [longUrl, setLongUrl] = useState("https://stiknex.site/tools/percentage-calculator?ref=newsletter&utm_source=twitter");
  const [customSlug, setCustomSlug] = useState("pct-calc");
  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    const slug = customSlug.trim() || Math.random().toString(36).substring(2, 7);
    setGenerated(`https://stik.nx/${slug}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Destination Long URL</label>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/your-long-link"
            className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Custom Alias (Optional)</label>
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="e.g. my-link"
            className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
      >
        <Link2 size={16} /> Generate Short Link
      </button>

      {generated && (
        <div className="p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Generated Short Link</span>
            <span className="font-mono text-lg font-bold">{generated}</span>
          </div>
          <button
            onClick={() => copyText(generated)}
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-md flex items-center gap-2"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}
