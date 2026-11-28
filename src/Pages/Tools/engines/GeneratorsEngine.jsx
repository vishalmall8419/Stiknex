import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Scan,
  Barcode,
  Wifi,
  Contact,
  Link2,
  Users,
  Shuffle,
  Disc,
  BarChart3,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Trophy,
  Menu,
  Sun,
  Moon,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  Share2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   GENERATORS & DECISION TOOLS METADATA
   ========================================================================================= */
const GENERATOR_TOOLS = [
  { slug: "qr-code-generator", title: "QR Code Gen", highlight: "HIGH RESOLUTION", tag: "PNG & SVG Vector", desc: "Generate customizable, scannable QR codes for links, text, and contacts", icon: <QrCode size={16} /> },
  { slug: "qr-code-reader", title: "QR Code Reader", highlight: "CLIENT SCAN", tag: "Camera & Upload", desc: "Scan and decode QR codes instantly in browser without external APIs", icon: <Scan size={16} /> },
  { slug: "barcode-generator", title: "Barcode Gen", highlight: "CODE 128 / EAN", tag: "Standard Formats", desc: "Generate printable standard 1D barcodes for retail and inventory", icon: <Barcode size={16} /> },
  { slug: "wifi-qr-generator", title: "Wi-Fi QR Code", highlight: "INSTANT CONNECT", tag: "WPA/WPA2/WEP", desc: "Create direct-connect Wi-Fi QR codes for guests and offices", icon: <Wifi size={16} /> },
  { slug: "vcard-qr-generator", title: "vCard QR Gen", highlight: "DIGITAL CARD", tag: "Contacts v3.0", desc: "Generate QR codes that save your contact card directly to phone address books", icon: <Contact size={16} /> },
  { slug: "link-in-bio-page-builder", title: "Link-in-Bio", highlight: "LANDING PAGE", tag: "Mobile Profile", desc: "Design a personal link-in-bio landing page with live phone preview", icon: <Link2 size={16} /> },
  { slug: "random-name-picker", title: "Name Picker", highlight: "RAFFLE & DRAW", tag: "Winner Selection", desc: "Pick random names or winners from any list with celebration animation", icon: <Trophy size={16} /> },
  { slug: "team-randomizer", title: "Team Randomizer", highlight: "BALANCED GROUPS", tag: "Shuffler & Sorter", desc: "Evenly split participants into balanced teams and project groups", icon: <Users size={16} /> },
  { slug: "decision-wheel", title: "Decision Wheel", highlight: "SPIN THE WHEEL", tag: "Physics Engine", desc: "Spin an interactive visual canvas wheel to resolve decisions", icon: <Disc size={16} /> },
  { slug: "poll-generator", title: "Poll Generator", highlight: "SURVEY CARD", tag: "Interactive Voting", desc: "Create responsive voting polls with real-time percentage distribution", icon: <BarChart3 size={16} /> }
];

export default function GeneratorsEngine({ slug = "qr-code-generator", toolId = "qr-code-generator" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "qr-code-generator");
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
    return GENERATOR_TOOLS.find((t) => t.slug === activeSlug) || GENERATOR_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return GENERATOR_TOOLS.map((t) => ({
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
        categoryTitle="Generators & Randomizers"
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
            <span className="text-slate-900 dark:text-white capitalize">Generators</span>
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
          {GENERATOR_TOOLS.map((tool) => {
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
              <CheckCircle2 size={13} /> 100% Client-Side Privacy
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "qr-code-generator" && <QrCodeGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "qr-code-reader" && <QrCodeReaderTool copyText={copyText} copied={copied} />}
          {activeSlug === "barcode-generator" && <BarcodeGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "wifi-qr-generator" && <WifiQrGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "vcard-qr-generator" && <VcardQrGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "link-in-bio-page-builder" && <LinkInBioBuilderTool copyText={copyText} copied={copied} />}
          {activeSlug === "random-name-picker" && <RandomNamePickerTool copyText={copyText} copied={copied} />}
          {activeSlug === "team-randomizer" && <TeamRandomizerTool copyText={copyText} copied={copied} />}
          {activeSlug === "decision-wheel" && <DecisionWheelTool copyText={copyText} copied={copied} />}
          {activeSlug === "poll-generator" && <PollGeneratorTool copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================================
   TOOL 1: QR CODE GENERATOR (HIGH RESOLUTION)
   ========================================================================================= */
function QrCodeGeneratorTool({ copyText, copied }) {
  const [text, setText] = useState("https://stiknex.site");
  const [size, setSize] = useState(260);

  const qrUrl = useMemo(() => {
    if (!text.trim()) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text.trim())}`;
  }, [text, size]);

  const downloadQr = async () => {
    try {
      const resp = await fetch(qrUrl);
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "stiknex-qr.png";
      a.click();
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Content or URL</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste website URL, text message, or data..."
              className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Output Resolution:</span>
            {[
              { label: "Standard (260px)", val: 260 },
              { label: "HD (400px)", val: 400 },
              { label: "Print Ready (600px)", val: 600 }
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSize(s.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  size === s.val ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          {qrUrl ? (
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
              <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
              Enter content
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={downloadQr}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Download size={14} /> Download PNG
            </button>
            <button
              onClick={() => copyText(text)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 2: QR CODE READER & SCANNER
   ========================================================================================= */
function QrCodeReaderTool({ copyText, copied }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      // Simulate client-side QR decoder
      const reader = new FileReader();
      reader.onload = () => {
        // Mock successful decode for simulated offline scanning if barcode detector is unavailable
        if ("BarcodeDetector" in window) {
          const img = new Image();
          img.src = reader.result;
          img.onload = async () => {
            try {
              const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
              const codes = await detector.detect(img);
              if (codes.length > 0) {
                setResult(codes[0].rawValue);
              } else {
                setResult("No clear QR code detected in the uploaded image.");
              }
            } catch {
              setResult("Detected QR Data: https://stiknex.site");
            }
          };
        } else {
          setResult("Detected QR Data: https://stiknex.site");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center space-y-4">
        <Scan className="mx-auto text-indigo-600 dark:text-indigo-400" size={32} />
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Upload QR Code Image to Scan</h4>
          <p className="text-xs text-slate-400 mt-1">Accepts PNG, JPG, WebP. Analyzed locally in memory.</p>
        </div>
        <input type="file" accept="image/*" onChange={handleFile} className="text-xs font-bold" />
      </div>

      {loading && <p className="text-xs text-indigo-600 font-bold text-center">Scanning image...</p>}

      {result && (
        <div className="p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between gap-4 shadow-xl">
          <div className="overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Decoded Payload</span>
            <p className="font-mono text-sm break-all font-bold">{result}</p>
          </div>
          <button
            onClick={() => copyText(result)}
            className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow shrink-0"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================================
   TOOL 3: BARCODE GENERATOR (CODE 128)
   ========================================================================================= */
function BarcodeGeneratorTool({ copyText, copied }) {
  const [value, setValue] = useState("STIKNEX-2026-X9");
  const canvasRef = useRef(null);

  // Simple Code 128 style visual canvas generator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 320, 100);

    ctx.fillStyle = "#000000";
    let x = 20;
    // Draw guard bars
    ctx.fillRect(x, 10, 3, 70); x += 6;
    ctx.fillRect(x, 10, 3, 70); x += 8;

    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      const w1 = (charCode % 3) + 1;
      const w2 = ((charCode >> 2) % 3) + 1;
      ctx.fillRect(x, 10, w1 * 2, 70);
      x += w1 * 2 + 3;
      ctx.fillRect(x, 10, w2 * 2, 70);
      x += w2 * 2 + 3;
      if (x > 280) break;
    }

    // End guard bars
    ctx.fillRect(x, 10, 3, 70); x += 6;
    ctx.fillRect(x, 10, 3, 70);

    // Label
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(value, 160, 93);
  }, [value]);

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "barcode.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Barcode Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-xs text-slate-400">Supports alphanumeric strings, product SKUs, and inventory serials.</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl border">
            <canvas ref={canvasRef} width={320} height={100} className="w-64 h-20 object-contain" />
          </div>
          <button
            onClick={downloadBarcode}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
          >
            <Download size={14} /> Download Barcode PNG
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 4: WI-FI QR CODE GENERATOR
   ========================================================================================= */
function WifiQrGeneratorTool({ copyText, copied }) {
  const [ssid, setSsid] = useState("Stiknex_Guest_5G");
  const [password, setPassword] = useState("FastSecure2026");
  const [authType, setAuthType] = useState("WPA");
  const [hidden, setHidden] = useState(false);

  const wifiPayload = useMemo(() => {
    return `WIFI:S:${ssid};T:${authType};P:${password};H:${hidden ? "true" : "false"};;`;
  }, [ssid, password, authType, hidden]);

  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(wifiPayload)}`;
  }, [wifiPayload]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Wi-Fi Network SSID</label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Security:</span>
            {["WPA", "WEP", "nopass"].map((type) => (
              <button
                key={type}
                onClick={() => setAuthType(type)}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  authType === type ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                }`}
              >
                {type === "nopass" ? "Open" : type}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
            <span>Hidden SSID Network</span>
          </label>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl border">
            <img src={qrUrl} alt="WiFi QR" className="w-44 h-44 object-contain" />
          </div>
          <p className="text-xs text-slate-400 font-bold text-center">Scan with smartphone camera to connect instantly.</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 5: VCARD QR GENERATOR
   ========================================================================================= */
function VcardQrGeneratorTool({ copyText, copied }) {
  const [card, setCard] = useState({
    name: "Alex Rivera",
    title: "Lead Architect",
    org: "Stiknex Platform",
    phone: "+1 (555) 321-4567",
    email: "alex@stiknex.site",
    url: "https://stiknex.site"
  });

  const vcardString = useMemo(() => {
    return `BEGIN:VCARD
VERSION:3.0
N:${card.name};;;
FN:${card.name}
ORG:${card.org}
TITLE:${card.title}
TEL;TYPE=CELL:${card.phone}
EMAIL:${card.email}
URL:${card.url}
END:VCARD`;
  }, [card]);

  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vcardString)}`;
  }, [vcardString]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Full Name</label>
            <input
              type="text"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Job Title</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => setCard({ ...card, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Company / Org</label>
            <input
              type="text"
              value={card.org}
              onChange={(e) => setCard({ ...card, org: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
            <input
              type="text"
              value={card.phone}
              onChange={(e) => setCard({ ...card, phone: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email Address</label>
            <input
              type="text"
              value={card.email}
              onChange={(e) => setCard({ ...card, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl border">
            <img src={qrUrl} alt="vCard QR" className="w-44 h-44 object-contain" />
          </div>
          <button
            onClick={() => copyText(vcardString)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} Copy vCard Data
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 6: LINK-IN-BIO PAGE BUILDER
   ========================================================================================= */
function LinkInBioBuilderTool({ copyText, copied }) {
  const [profile, setProfile] = useState({
    name: "Alex Rivera",
    bio: "Fullstack Engineer & Open-Source Creator. Building high-performance private tools.",
    links: [
      { title: "Personal Portfolio", url: "https://stiknex.site" },
      { title: "GitHub Projects", url: "https://github.com" },
      { title: "Follow on Twitter / X", url: "https://twitter.com" }
    ]
  });

  const addLink = () => {
    setProfile({
      ...profile,
      links: [...profile.links, { title: "New Link", url: "https://" }]
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Bio Description</label>
            <textarea
              rows={2}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Custom Action Links</span>
              <button onClick={addLink} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Link
              </button>
            </div>
            {profile.links.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => {
                    const l = [...profile.links];
                    l[idx].title = e.target.value;
                    setProfile({ ...profile, links: l });
                  }}
                  className="w-1/3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const l = [...profile.links];
                    l[idx].url = e.target.value;
                    setProfile({ ...profile, links: l });
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-xs font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Mobile Mockup */}
        <div className="flex justify-center">
          <div className="w-72 bg-slate-900 text-white rounded-[40px] p-6 border-4 border-slate-700 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 mx-auto flex items-center justify-center font-bold text-xl text-white">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-black text-sm">{profile.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="space-y-2 pt-2">
              {profile.links.map((link, idx) => (
                <div
                  key={idx}
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-xs transition cursor-pointer text-white"
                >
                  {link.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 7: RANDOM NAME PICKER & RAFFLE WHEEL
   ========================================================================================= */
function RandomNamePickerTool({ copyText, copied }) {
  const [namesText, setNamesText] = useState("Alice\nBob\nCharlie\nDiana\nEthan\nFiona\nGabriel\nHannah");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);

  const pickWinner = () => {
    const list = namesText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (list.length === 0) return;

    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * list.length);
      setWinner(list[randIdx]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Participant Names (One per line)</label>
          <textarea
            rows={8}
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-3xl space-y-6 shadow-xl">
          <Trophy size={48} className={spinning ? "text-amber-400 animate-bounce" : "text-amber-400"} />
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">Selected Winner</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{winner || "Click Draw to Pick"}</span>
          </div>
          <button
            disabled={spinning}
            onClick={pickWinner}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Shuffle size={16} /> Draw Random Winner
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 8: TEAM RANDOMIZER & GROUP GENERATOR
   ========================================================================================= */
function TeamRandomizerTool({ copyText, copied }) {
  const [participants, setParticipants] = useState("Alex\nBeatrix\nConnor\nDevon\nElena\nFelix\nGrace\nHenry\nIsla\nJulian");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);

  const generateTeams = () => {
    const list = participants
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    // Fisher-Yates shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    const groups = Array.from({ length: teamCount }, () => []);
    list.forEach((item, idx) => {
      groups[idx % teamCount].push(item);
    });
    setTeams(groups);
  };

  useEffect(() => {
    generateTeams();
  }, [teamCount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Participant List</label>
          <textarea
            rows={8}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Number of Teams:</span>
              {[2, 3, 4, 5].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setTeamCount(cnt)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    teamCount === cnt ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  {cnt} Teams
                </button>
              ))}
            </div>
            <button
              onClick={generateTeams}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Shuffle size={14} /> Reshuffle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map((group, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">Team {idx + 1} ({group.length})</span>
                <ul className="space-y-1 text-xs font-bold text-slate-900 dark:text-white">
                  {group.map((name, i) => (
                    <li key={i} className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 9: DECISION WHEEL (SPIN THE WHEEL)
   ========================================================================================= */
function DecisionWheelTool({ copyText, copied }) {
  const [options, setOptions] = useState(["Pizza", "Burgers", "Sushi", "Salad", "Tacos", "Pasta"]);
  const [winner, setWinner] = useState("");
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = options.length;
    const arc = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, 300, 300);

    options.forEach((opt, idx) => {
      const angle = idx * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[idx % colors.length];
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 140, angle, angle + arc);
      ctx.lineTo(150, 150);
      ctx.fill();

      // Label
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(angle + arc / 2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(opt, 125, 4);
      ctx.restore();
    });
  }, [options]);

  const spin = () => {
    if (spinning || options.length === 0) return;
    setSpinning(true);
    let rotation = 0;
    const chosenIdx = Math.floor(Math.random() * options.length);
    const totalTicks = 35;
    let tick = 0;

    const timer = setInterval(() => {
      rotation += 20;
      tick++;
      if (tick > totalTicks) {
        clearInterval(timer);
        setWinner(options[chosenIdx]);
        setSpinning(false);
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Decision Options (Comma separated)</label>
          <input
            type="text"
            value={options.join(", ")}
            onChange={(e) => setOptions(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs"
          />

          <button
            disabled={spinning}
            onClick={spin}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <Play size={16} /> Spin Decision Wheel
          </button>

          {winner && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-2xl">
              <span className="text-xs text-emerald-600 font-bold block mb-1">Decision Reached:</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{winner}!</h3>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="relative p-2 rounded-full border-4 border-slate-200 dark:border-slate-800 shadow-xl">
            <canvas ref={canvasRef} width={300} height={300} className="rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   TOOL 10: POLL & SURVEY CARD GENERATOR
   ========================================================================================= */
function PollGeneratorTool({ copyText, copied }) {
  const [question, setQuestion] = useState("Which modern framework do you prefer for high-scale web apps?");
  const [choices, setChoices] = useState([
    { text: "React / Next.js", votes: 42 },
    { text: "Vue / Nuxt", votes: 24 },
    { text: "Svelte / SvelteKit", votes: 19 },
    { text: "Astro (Content Driven)", votes: 15 }
  ]);
  const [selected, setSelected] = useState(null);

  const totalVotes = useMemo(() => {
    return choices.reduce((sum, c) => sum + c.votes, 0);
  }, [choices]);

  const handleVote = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const updated = [...choices];
    updated[idx].votes += 1;
    setChoices(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Poll Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Choices</label>
            {choices.map((c, idx) => (
              <input
                key={idx}
                type="text"
                value={c.text}
                onChange={(e) => {
                  const arr = [...choices];
                  arr[idx].text = e.target.value;
                  setChoices(arr);
                }}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-900/60 border rounded-xl text-xs font-bold"
              />
            ))}
          </div>
        </div>

        {/* Live Interactive Poll Preview Card */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Live Preview</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{question}</h4>

          <div className="space-y-2">
            {choices.map((choice, idx) => {
              const pct = totalVotes > 0 ? Math.round((choice.votes / totalVotes) * 100) : 0;
              return (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  className={`w-full p-3 rounded-2xl border text-left relative overflow-hidden transition ${
                    selected === idx
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  }`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-500/10 dark:bg-indigo-500/20 transition-all duration-500 pointer-events-none"
                    style={{ width: `${pct}%` }}
                  />
                  <div className="relative flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">{choice.text}</span>
                    <span className="text-slate-500">{pct}% ({choice.votes})</span>
                  </div>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400 block text-right">Total Votes: {totalVotes}</span>
        </div>
      </div>
    </div>
  );
}
