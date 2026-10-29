import { useState, useMemo } from "react";
import { Copy, Check, Clock, Globe, Shield, Terminal, Share2, Search, ArrowRightLeft } from "lucide-react";

export default function EncodingEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "url-encoder-decoder") return <UrlEncoderTool copyText={copyText} copied={copied} />;
  if (slug === "html-entity-encoder-decoder") return <HtmlEntityTool copyText={copyText} copied={copied} />;
  if (slug === "base64-encoder-decoder") return <Base64Tool copyText={copyText} copied={copied} />;
  if (slug === "jwt-decoder") return <JwtDecoderTool copyText={copyText} copied={copied} />;
  if (slug === "unix-timestamp-converter") return <UnixTimestampTool copyText={copyText} copied={copied} />;
  if (slug === "cron-expression-explainer") return <CronExplainerTool copyText={copyText} copied={copied} />;
  if (slug === "query-string-parser") return <QueryParserTool copyText={copyText} copied={copied} />;
  if (slug === "http-status-code-reference") return <HttpStatusTool copyText={copyText} copied={copied} />;
  if (slug === "mime-type-lookup") return <MimeTypeTool copyText={copyText} copied={copied} />;
  if (slug === "meta-tag-preview-generator") return <MetaTagPreviewTool copyText={copyText} copied={copied} />;

  return <UrlEncoderTool copyText={copyText} copied={copied} />;
}

// ============================================================================
// BIG TOOL: URL ENCODER / DECODER
// ============================================================================
function UrlEncoderTool({ copyText, copied }) {
  const [input, setInput] = useState("https://stiknex.site/search?q=free productivity tools&category=writing & notes#top");
  const [mode, setMode] = useState("encode");

  const result = useMemo(() => {
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Malformed URL sequence.";
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setMode("encode")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${mode === "encode" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700"}`}
        >
          URL Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${mode === "decode" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700"}`}
        >
          URL Decode
        </button>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input String</label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm"
        />
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
            {mode === "encode" ? "Encoded URL Result" : "Decoded URL Result"}
          </span>
          <p className="font-mono text-sm break-all">{result}</p>
        </div>
        <button
          onClick={() => copyText(result)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: JWT DECODER
// ============================================================================
function JwtDecoderTool({ copyText, copied }) {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIEpvbmVzIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODMxNTk2ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) return { error: "A valid JWT token must contain at least 2 dot-separated base64 parts." };
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      let expDate = null;
      let isExpired = false;
      if (payload.exp) {
        expDate = new Date(payload.exp * 1000).toUTCString();
        isExpired = Date.now() > payload.exp * 1000;
      }

      return { header, payload, expDate, isExpired, valid: true };
    } catch (err) {
      return { error: "Failed to decode JWT string. Ensure Base64 payload is intact." };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Encoded JWT Token</label>
        <textarea
          rows={3}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all"
        />
      </div>

      {decoded.error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm">{decoded.error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block">Header (Algorithm & Token Type)</span>
            <pre className="p-4 bg-white dark:bg-slate-800 rounded-xl font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Payload (Claims & Data)</span>
              {decoded.expDate && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${decoded.isExpired ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {decoded.isExpired ? "Expired" : "Active"}
                </span>
              )}
            </div>
            <pre className="p-4 bg-white dark:bg-slate-800 rounded-xl font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            {decoded.expDate && <span className="text-xs text-slate-500 block">Expires: {decoded.expDate}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: UNIX TIMESTAMP CONVERTER
// ============================================================================
function UnixTimestampTool({ copyText, copied }) {
  const [epoch, setEpoch] = useState(() => Math.floor(Date.now() / 1000).toString());

  const dates = useMemo(() => {
    const num = Number(epoch);
    if (!num || isNaN(num)) return null;
    // Auto-detect milliseconds vs seconds
    const ms = epoch.length > 11 ? num : num * 1000;
    const d = new Date(ms);
    return {
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
      relative: `${Math.round((Date.now() - ms) / (1000 * 60))} minutes ago`
    };
  }, [epoch]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Epoch Timestamp (Seconds or ms)</label>
          <input
            type="text"
            value={epoch}
            onChange={(e) => setEpoch(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl font-mono font-bold text-lg"
          />
        </div>
        <button
          onClick={() => setEpoch(Math.floor(Date.now() / 1000).toString())}
          className="mt-5 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 shadow"
        >
          Set to Now
        </button>
      </div>

      {dates && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "UTC Standard Time", val: dates.utc },
            { label: "ISO-8601 String", val: dates.iso },
            { label: "Local System Time", val: dates.local },
            { label: "Relative Offset", val: dates.relative },
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 block mb-1">{item.label}</span>
                <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-200 block">{item.val}</span>
              </div>
              <button onClick={() => copyText(item.val)} className="mt-3 text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <Copy size={13} /> Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: CRON EXPLAINER & BUILDER
// ============================================================================
function CronExplainerTool({ copyText, copied }) {
  const [cron, setCron] = useState("*/15 0 1,15 * 1-5");

  const explanation = useMemo(() => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5) return "Standard cron expressions require 5 space-separated fields (minute, hour, day, month, weekday).";

    const [min, hour, day, month, weekday] = parts;
    return `Runs: At minute '${min}', hour '${hour}', day of month '${day}', month '${month}', and weekday '${weekday}'.`;
  }, [cron]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Cron Schedule String</label>
        <input
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xl font-black text-indigo-600"
        />
      </div>

      <div className="p-8 bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Human Readable Schedule</span>
          <p className="text-lg font-bold">{explanation}</p>
        </div>
        <button onClick={() => copyText(cron)} className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow flex items-center gap-2 shrink-0">
          <Copy size={16} /> Copy Cron
        </button>
      </div>
    </div>
  );
}

// Helpers for remaining tools
function HtmlEntityTool({ copyText }) {
  const [val, setVal] = useState('<div class="header">© 2026 Stiknex & Co.</div>');
  const encoded = val.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
  return <EncodingTwoWayView title="HTML Entity" input={val} setInput={setVal} output={encoded} copyText={copyText} />;
}

function Base64Tool({ copyText }) {
  const [val, setVal] = useState("Hello from Stiknex!");
  const [mode, setMode] = useState("enc");
  const result = useMemo(() => {
    try {
      return mode === "enc" ? btoa(val) : atob(val);
    } catch {
      return "Encoding/decoding error.";
    }
  }, [val, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={() => setMode("enc")} className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === "enc" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
          Encode Base64
        </button>
        <button onClick={() => setMode("dec")} className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === "dec" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
          Decode Base64
        </button>
      </div>
      <textarea rows={4} value={val} onChange={(e) => setVal(e.target.value)} className="w-full p-4 border rounded-2xl font-mono text-sm" />
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
        <span className="font-mono text-sm break-all">{result}</span>
        <button onClick={() => copyText(result)} className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 ml-4">
          <Copy size={14} /> Copy
        </button>
      </div>
    </div>
  );
}

function QueryParserTool({ copyText }) {
  const [query, setQuery] = useState("?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&active=true");
  const params = useMemo(() => {
    const search = query.startsWith("?") ? query : `?${query}`;
    const p = new URLSearchParams(search);
    const obj = {};
    for (const [k, v] of p.entries()) obj[k] = v;
    return obj;
  }, [query]);

  return (
    <div className="space-y-6">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-sm font-bold" />
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border space-y-2">
        {Object.entries(params).map(([k, v]) => (
          <div key={k} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between font-mono text-xs">
            <span className="text-indigo-600 font-bold">{k}</span>
            <span className="text-slate-800 dark:text-slate-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HttpStatusTool({ copyText }) {
  const [search, setSearch] = useState("");
  const codes = [
    { c: 200, name: "OK", d: "Standard response for successful HTTP requests." },
    { c: 201, name: "Created", d: "The request has been fulfilled and a new resource created." },
    { c: 301, name: "Moved Permanently", d: "Permanent redirect to another URL." },
    { c: 304, name: "Not Modified", d: "Cached copy remains valid; no body returned." },
    { c: 400, name: "Bad Request", d: "Server cannot process request due to client error." },
    { c: 401, name: "Unauthorized", d: "Authentication is required and has failed or missing." },
    { c: 403, name: "Forbidden", d: "Request was valid, but server refuses action." },
    { c: 404, name: "Not Found", d: "The requested resource could not be found." },
    { c: 500, name: "Internal Server Error", d: "Generic error message when an unexpected condition occurred." },
    { c: 502, name: "Bad Gateway", d: "Server received an invalid response from upstream gateway." },
    { c: 503, name: "Service Unavailable", d: "Server is overloaded or down for maintenance." }
  ];

  const filtered = codes.filter((item) => `${item.c} ${item.name} ${item.d}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search code or description (e.g. 404, redirect, server)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl font-bold"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.c} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border space-y-1">
            <span className="text-2xl font-black text-indigo-600">{item.c}</span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MimeTypeTool({ copyText }) {
  const [ext, setExt] = useState("json");
  const mimes = {
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    svg: "image/svg+xml",
    webp: "image/webp",
    zip: "application/zip",
    mp3: "audio/mpeg",
    mp4: "video/mp4"
  };

  const current = mimes[ext.toLowerCase().trim()] || "application/octet-stream";

  return (
    <div className="space-y-6">
      <input type="text" placeholder="Enter file extension (e.g. json, png, pdf)" value={ext} onChange={(e) => setExt(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-bold text-lg" />
      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex items-center justify-between shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase text-indigo-200 block mb-1">Official Content-Type</span>
          <div className="text-3xl font-mono font-black">{current}</div>
        </div>
        <button onClick={() => copyText(current)} className="px-5 py-3 bg-white text-indigo-700 font-bold rounded-xl flex items-center gap-2 shadow">
          <Copy size={16} /> Copy
        </button>
      </div>
    </div>
  );
}

function MetaTagPreviewTool({ copyText }) {
  const [title, setTitle] = useState("Stiknex – Free Online Productivity Tools");
  const [desc, setDesc] = useState("Over 200 free utility tools including sticky notes, calculators, formatters, and typing lab.");
  const [url, setUrl] = useState("https://stiknex.site");

  const tags = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:url" content="${url}" />`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="p-3 border rounded-xl font-bold" />
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="p-3 border rounded-xl font-bold" />
        <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="md:col-span-2 p-3 border rounded-xl text-sm" />
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-indigo-400">Social Share Card Preview</span>
          <button onClick={() => copyText(tags)} className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
            <Copy size={13} /> Copy Meta Tags
          </button>
        </div>
        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-xs text-indigo-400 font-semibold">{url}</span>
          <h4 className="font-bold text-white text-base">{title}</h4>
          <p className="text-xs text-slate-300">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function EncodingTwoWayView({ title, input, setInput, output, copyText }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input</label>
          <textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-4 border rounded-2xl font-mono text-xs" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">{title} Result</label>
            <button onClick={() => copyText(output)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Copy size={13} /> Copy
            </button>
          </div>
          <textarea readOnly rows={8} value={output} className="w-full p-4 bg-slate-50 border rounded-2xl font-mono text-xs" />
        </div>
      </div>
    </div>
  );
}
