import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  HelpCircle,
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Monitor,
  Receipt,
  FileText,
  Play,
  Pause,
  Dices,
  Type,
  BookOpen,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Calendar,
  MapPin,
  User,
  Star,
  Share2,
  Flag,
  Zap,
  Download
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { formatDateDDMMYYYY } from "../../../utils/dateFormat";
import {
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  ISLAMIC_BURUJ,
  calculateVedicPanchang,
  generateAstrologicalNames
} from "../../../data/vedicNamingEngine.js";

/**
 * Universal Enterprise Helpers, Invoicing & Utilities Workstation
 * SEO, GEO & AIO Enforced:
 * Every tool is an INDEPENDENT, dedicated page on its own route.
 * NO cross-tool tabs in the top navigation bar.
 * /receipt-generator renders ONLY the Receipt Generator.
 * /invoice-generator renders ONLY the Invoice Generator.
 * /stopwatch-with-laps renders ONLY the Stopwatch.
 * /screen-resolution-checker renders ONLY the Screen Diagnostics.
 * /aspect-ratio-calculator renders ONLY the Aspect Ratio Calculator.
 * /typographic-scale-generator renders ONLY the Typographic Scale.
 * /decision-helper renders ONLY the Decision Helper.
 * /name-generator renders ONLY the Name Generator.
 * /flashcard-maker renders ONLY the Flashcard Maker.
 * /random-quiz-generator renders ONLY the Quiz Generator.
 */

const RELATED_HELPER_TOOLS = [
  { slug: "receipt-generator", title: "Receipt Generator", icon: "fa-solid fa-receipt", desc: "Instant payment receipts & cash memo vouchers" },
  { slug: "invoice-generator", title: "Invoice Generator", icon: "fa-solid fa-file-invoice-dollar", desc: "Professional PDF invoices with line items & taxes" },
  { slug: "stopwatch-with-laps", title: "Stopwatch with Laps", icon: "fa-solid fa-stopwatch", desc: "Millisecond precision chronograph & split timer" },
  { slug: "screen-resolution-checker", title: "Screen Diagnostics", icon: "fa-solid fa-desktop", desc: "Display resolution, DPR scale & viewport specs" },
  { slug: "aspect-ratio-calculator", title: "Aspect Ratio Calculator", icon: "fa-solid fa-crop-simple", desc: "16:9, 4:3, 21:9 dimension ratios and scaler" },
  { slug: "typographic-scale-generator", title: "Typographic Scale", icon: "fa-solid fa-font", desc: "Modular type hierarchy with rem, px & CSS export" },
  { slug: "decision-helper", title: "Decision Helper", icon: "fa-solid fa-dice", desc: "3D coin flip, yes/no oracle & random choice picker" },
  { slug: "name-generator", title: "Vedic & Islamic Naming", icon: "fa-solid fa-om", desc: "Namkaran Sanskar, Nakshatra Pada, Rashi & Islamic Sunnah names" },
  { slug: "flashcard-maker", title: "Flashcard Maker", icon: "fa-solid fa-clone", desc: "Interactive study cards & active recall training" },
  { slug: "random-quiz-generator", title: "Quiz Generator", icon: "fa-solid fa-clipboard-question", desc: "Knowledge test deck with instant score checking" }
];

export default function HelpersEngine({ slug = "receipt-generator", toolId = "receipt-generator", tool, seoData }) {
  const { theme, toggleTheme } = useAppContext();

  // Dynamic Tool Title & Config - strictly 100% focused on current tool
  const toolConfig = useMemo(() => {
    switch (slug) {
      case "receipt-generator":
        return {
          title: "Receipt",
          highlight: "Generator",
          tag: "CASH MEMO",
          subtitle: "Instant business receipts, payment slips & transaction vouchers",
          icon: <Receipt size={17} />
        };
      case "invoice-generator":
        return {
          title: "Invoice",
          highlight: "Studio",
          tag: "BILLING & PDF",
          subtitle: "Generate clean printable invoices with line items, tax & PDF export",
          icon: <Receipt size={17} />
        };
      case "stopwatch-with-laps":
        return {
          title: "Precision",
          highlight: "Stopwatch",
          tag: "CHRONOMETER",
          subtitle: "Millisecond precision stopwatch with split laps & lap telemetry",
          icon: <Clock size={17} />
        };
      case "screen-resolution-checker":
        return {
          title: "Screen",
          highlight: "Diagnostics",
          tag: "DISPLAY & DPR",
          subtitle: "Display resolution, DPR scale, viewport size & device monitor specs",
          icon: <Monitor size={17} />
        };
      case "aspect-ratio-calculator":
        return {
          title: "Aspect Ratio",
          highlight: "Calculator",
          tag: "VIDEO & DISPLAY",
          subtitle: "Calculate standard 16:9, 4:3, 21:9 ratios, dimensions & scaling",
          icon: <Maximize2 size={17} />
        };
      case "typographic-scale-generator":
        return {
          title: "Typographic",
          highlight: "Scale",
          tag: "DESIGN SYSTEM",
          subtitle: "Modular typography scale generator with rem/px and CSS export",
          icon: <Type size={17} />
        };
      case "decision-helper":
        return {
          title: "Decision",
          highlight: "Helper",
          tag: "RANDOM ORACLE",
          subtitle: "3D coin flip, random choice picker & instant decision maker",
          icon: <Dices size={17} />
        };
      case "name-generator":
        return {
          title: "Baby Name",
          highlight: "Generator",
          tag: "MULTI-FAITH SANSKAR",
          subtitle: "Authentic Hindu Vedic, Islamic Sunnah, Sikh Gurbani, Christian Baptism & Modern naming",
          icon: <Sparkles size={17} />
        };
      case "flashcard-maker":
        return {
          title: "Study",
          highlight: "Flashcards",
          tag: "ACTIVE RECALL",
          subtitle: "Active recall study cards, flip decks & spaced repetition training",
          icon: <BookOpen size={17} />
        };
      case "random-quiz-generator":
        return {
          title: "Knowledge",
          highlight: "Quizzer",
          tag: "KNOWLEDGE TEST",
          subtitle: "Interactive study quizzes, instant score checking & knowledge testing",
          icon: <BookOpen size={17} />
        };
      default:
        return {
          title: "Utility",
          highlight: "Studio",
          tag: "PRODUCTIVITY",
          subtitle: "Instant browser utilities and everyday workflow helpers",
          icon: <Sparkles size={17} />
        };
    }
  }, [slug]);

  // Common UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Tactile Sound
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
        osc.frequency.setValueAtTime(520, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  return (
    <div className={`${
      slug === "stopwatch-with-laps" ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"
    } flex flex-col font-sans transition-colors duration-200 ${
      theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Print Specific CSS so Invoice/Receipt prints pristinely */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print, header, nav, .tool-header, .tool-tabs, .tool-sidebar, button { display: none !important; }
          .printable-card { box-shadow: none !important; border: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      {/* 1. TOP HEADER NAVIGATION - CLEAN & DEDICATED (NO UNRELATED CROSS-TOOL TABS) */}
      <header className={`tool-header sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}>
        <div className={`${
          slug === "stopwatch-with-laps" ? "w-full px-4 sm:px-8" : "max-w-7xl mx-auto px-3 sm:px-4"
        } h-14 flex items-center justify-between gap-2`}>
          {/* Dedicated Tool Title */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
              {toolConfig.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight truncate">
                  {toolConfig.title} <span className="text-amber-500">{toolConfig.highlight}</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  {toolConfig.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden md:block max-w-sm">
                {toolConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Center Space: Intentionally Clean (NO UNRELATED TABS) */}
          <div className="hidden lg:flex items-center text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/10 dark:bg-slate-800/40 border border-slate-700/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Stiknex 100% Client-Side Engine
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
              className={`p-2 rounded-lg text-xs font-medium transition ${
                theme === "dark" ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Help Dialog Modal */}
            <button
              onClick={() => setHelpOpen(true)}
              title="Help & Reference Guide"
              className={`p-2 rounded-lg text-xs font-medium transition ${
                theme === "dark" ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              className={`p-2 rounded-lg text-xs font-medium transition ${
                theme === "dark" ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Universal Sidebar Drawer Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              title="Tools & Workspace Menu"
              className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition ml-0.5"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. DEDICATED TOOL WORKSTATION - STRICTLY 100% CURRENT TOOL */}
      <main className={`flex-1 w-full mx-auto ${
        slug === "stopwatch-with-laps"
          ? "p-0 max-w-full h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col justify-center items-center"
          : "max-w-7xl p-3 sm:p-5 pb-16"
      }`}>
        {slug === "receipt-generator" && (
          <ReceiptWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "invoice-generator" && (
          <InvoiceWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "stopwatch-with-laps" && (
          <StopwatchWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "screen-resolution-checker" && (
          <ScreenDiagnosticsWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "aspect-ratio-calculator" && (
          <AspectRatioWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "typographic-scale-generator" && (
          <TypeScaleWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "decision-helper" && (
          <DecisionHelperWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "name-generator" && (
          <NameGeneratorWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "flashcard-maker" && (
          <FlashcardWorkstation theme={theme} playClickSound={playClickSound} />
        )}

        {slug === "random-quiz-generator" && (
          <QuizWorkstation theme={theme} playClickSound={playClickSound} />
        )}
      </main>

      {/* Universal Stiknex Sidebar Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_HELPER_TOOLS}
        categoryTitle="Related Helper Tools"
      />

      {/* Dedicated Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`max-w-xl w-full rounded-2xl p-6 border shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto ${
                theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/20">
                <div className="flex items-center gap-2">
                  <HelpCircle className="text-amber-500" size={20} />
                  <h3 className="font-bold text-base">{toolConfig.title} Reference Guide</h3>
                </div>
                <button onClick={() => setHelpOpen(false)} className="p-1 rounded-lg hover:bg-slate-800/40 text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-400">
                {slug === "receipt-generator" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Receipt & Cash Memo Best Practices</h4>
                    <p>
                      A receipt proves that a buyer has made payment in full for goods or services rendered. Use <strong className="text-amber-500">Print / Save PDF</strong> to generate a clean client copy. All calculations, tax additions, and discounts compute in real time directly in your browser with complete privacy.
                    </p>
                  </div>
                )}

                {slug === "invoice-generator" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Freelance & Business Invoicing Standards</h4>
                    <p>
                      An invoice represents a payment request detailing services, itemized amounts, tax/GST slabs, and due payment dates. Click <strong className="text-amber-500">Print / Save PDF</strong> to export directly without browser margins.
                    </p>
                  </div>
                )}

                {slug === "stopwatch-with-laps" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Precision Lap Chronometry</h4>
                    <p>
                      Measures elapsed time with 10ms resolution. Shortest lap is automatically flagged in green (FASTEST) and longest in red (SLOWEST). Shortcuts: <strong className="text-amber-500">Spacebar</strong> to start/pause, <strong className="text-amber-500">L</strong> to take a lap, <strong className="text-amber-500">R</strong> to reset.
                    </p>
                  </div>
                )}

                {slug === "screen-resolution-checker" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Screen & Viewport Diagnostics</h4>
                    <p>
                      Monitor resolution reports the full physical display pixels. Browser viewport indicates current viewable canvas. Device Pixel Ratio (DPR) reflects Retina / HiDPI scaling factor.
                    </p>
                  </div>
                )}

                {slug === "aspect-ratio-calculator" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Standard Aspect Ratios</h4>
                    <p>
                      16:9 is standard for YouTube, HDTV & monitors. 9:16 is optimized for TikTok, Reels & Shorts. 21:9 is ultrawide cinema format. 1:1 is square format for Instagram feeds.
                    </p>
                  </div>
                )}

                {slug === "typographic-scale-generator" && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Modular Typographic Scale Standards</h4>
                    <p>
                      Modular scales create typographic harmony using musical multipliers. Major Third (1.250) is recommended for SaaS apps, while Golden Ratio (1.618) creates dramatic headlines for editorial designs.
                    </p>
                  </div>
                )}

                {(slug === "decision-helper" || slug === "name-generator" || slug === "flashcard-maker" || slug === "random-quiz-generator") && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Productivity & Study Standards</h4>
                    <p>
                      Uses native cryptographic pseudo-random distribution for completely fair decisions, random name creation, and active recall training for accelerated study retention.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/20 flex justify-end">
                <button
                  onClick={() => setHelpOpen(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs transition"
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

/* =========================================================================================
   1. DEDICATED RECEIPT GENERATOR WORKSTATION (/receipt-generator)
   ========================================================================================= */
function ReceiptWorkstation({ theme, playClickSound }) {
  const [currency, setCurrency] = useState("₹");
  const [receiptNumber, setReceiptNumber] = useState("REC-2026-001");
  const [date, setDate] = useState(() => formatDateDDMMYYYY(new Date()));
  const [paymentMode, setPaymentMode] = useState("UPI / Bank Transfer");

  const [fromName, setFromName] = useState("Stiknex Studio");
  const [fromEmail, setFromEmail] = useState("billing@stiknex.com");
  const [fromAddress, setFromAddress] = useState("Tech Park, Bangalore, KA, India");

  const [toName, setToName] = useState("Acme Global Inc.");
  const [toEmail, setToEmail] = useState("finance@acme.org");
  const [toAddress, setToAddress] = useState("101 Silicon Valley, San Francisco, CA");

  const [items, setItems] = useState([
    { id: 1, description: "Full-Stack Web Application & UI/UX Design", qty: 1, rate: 45000 },
    { id: 2, description: "Cloud Infrastructure Setup & API Integration", qty: 1, rate: 15000 }
  ]);

  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Payment received in full. Thank you for your business!");
  const [copied, setCopied] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return (subtotal * (Number(taxRate) || 0)) / 100;
  }, [subtotal, taxRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + taxAmount - (Number(discount) || 0));
  }, [subtotal, taxAmount, discount]);

  const addItem = () => {
    playClickSound();
    setItems([...items, { id: Date.now(), description: "Service / Product Item", qty: 1, rate: 1000 }]);
  };

  const removeItem = (id) => {
    playClickSound();
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const loadSample = () => {
    playClickSound();
    setReceiptNumber("REC-2026-089");
    setCurrency("₹");
    setPaymentMode("IMPS / Online Payment");
    setFromName("PixelKraft Digital Agency");
    setFromEmail("accounts@pixelkraft.io");
    setFromAddress("Indiranagar, Bengaluru, KA 560038");
    setToName("Nexus Ventures Ltd.");
    setToEmail("finance@nexusventures.com");
    setToAddress("Bandra Kurla Complex, Mumbai, MH 400051");
    setItems([
      { id: 1, description: "Next.js E-Commerce Frontend Architecture", qty: 1, rate: 65000 },
      { id: 2, description: "Payment Gateway Integration & Webhooks", qty: 1, rate: 20000 },
      { id: 3, description: "Performance Optimization & Lighthouse Audit", qty: 1, rate: 12000 }
    ]);
    setTaxRate(18);
    setDiscount(5000);
    setNotes("Received with thanks. Total settled in full.");
  };

  const copySummary = () => {
    const text = `PAYMENT RECEIPT: ${receiptNumber}\nDate: ${date}\nReceived From: ${toName}\nAmount Paid: ${currency}${grandTotal.toLocaleString("en-IN")}\nStatus: Paid in Full`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT FORM BUILDER */}
      <div className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl border space-y-4 no-print ${
        theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Receipt Editor</span>
          <button
            onClick={loadSample}
            className="px-2.5 py-1 text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition"
          >
            Load Sample Data
          </button>
        </div>

        {/* Basic Header Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Receipt No.</label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Receipt Date (DD/MM/YYYY)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none font-mono ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Payment Method</label>
            <input
              type="text"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Sender & Client Details */}
        <div className="space-y-3 pt-2 border-t border-slate-700/20 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-300 block">From (Your Business)</span>
            <input
              type="text"
              placeholder="Business / Your Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Email address"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <input
                type="text"
                placeholder="City, State, Country"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="font-semibold text-slate-300 block">Received From (Customer)</span>
            <input
              type="text"
              placeholder="Customer / Company Name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <input
                type="text"
                placeholder="Customer Address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Line Items Editor */}
        <div className="space-y-2 pt-2 border-t border-slate-700/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Items / Services</span>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-amber-500 font-semibold hover:text-amber-400 transition"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Service / Item Description"
                  value={it.description}
                  onChange={(e) => updateItem(it.id, "description", e.target.value)}
                  className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, "qty", e.target.value)}
                  className={`w-14 px-2 py-1.5 rounded-lg border text-xs outline-none text-center ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={it.rate}
                  onChange={(e) => updateItem(it.id, "rate", e.target.value)}
                  className={`w-24 px-2 py-1.5 rounded-lg border text-xs outline-none text-right font-mono ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(it.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Taxes & Discounts */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/20 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Tax / GST Rate (%)</label>
            <div className="flex items-center gap-1">
              {[0, 5, 12, 18].map((r) => (
                <button
                  key={r}
                  onClick={() => setTaxRate(r)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                    taxRate === r
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Discount Amount ({currency})</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs">
          <label className="text-slate-400 block mb-1">Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none ${
              theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
          <button
            onClick={copySummary}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              copied
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* RIGHT LIVE DOCUMENT PREVIEW CARD */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 printable-card space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-black text-sm flex items-center justify-center">
                  R
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  PAYMENT RECEIPT
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">{receiptNumber}</p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="font-semibold text-slate-700">Date: <span className="font-mono text-slate-900">{date}</span></div>
              <div className="text-slate-500">Method: <span className="font-mono font-medium text-slate-700">{paymentMode}</span></div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Paid in Full
              </span>
            </div>
          </div>

          {/* Billed By & Billed To */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">From</span>
              <p className="font-bold text-slate-900 text-sm">{fromName || "Your Business Name"}</p>
              <p className="text-slate-600">{fromEmail}</p>
              <p className="text-slate-600">{fromAddress}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Received From
              </span>
              <p className="font-bold text-slate-900 text-sm">{toName || "Customer Name"}</p>
              <p className="text-slate-600">{toEmail}</p>
              <p className="text-slate-600">{toAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-16">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-24">Rate</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td className="py-3 px-4 text-slate-900 font-medium">{it.description || "Service item"}</td>
                    <td className="py-3 px-4 text-slate-600 text-center font-mono">{it.qty}</td>
                    <td className="py-3 px-4 text-slate-600 text-right font-mono">{currency}{Number(it.rate).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-slate-900 text-right font-mono font-semibold">
                      {currency}{((Number(it.qty) || 0) * (Number(it.rate) || 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{currency}{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax / GST ({taxRate}%):</span>
                  <span className="font-mono font-medium">{currency}{taxAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-mono font-medium">-{currency}{Number(discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Amount Received:</span>
                <span className="font-mono text-amber-600">{currency}{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
              <p className="italic leading-relaxed">{notes}</p>
            </div>
          )}

          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Powered by Stiknex Studio &bull; Free Secure Receipt Engine
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   2. DEDICATED INVOICE GENERATOR WORKSTATION (/invoice-generator)
   ========================================================================================= */
function InvoiceWorkstation({ theme, playClickSound }) {
  const [currency, setCurrency] = useState("₹");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [date, setDate] = useState(() => formatDateDDMMYYYY(new Date()));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return formatDateDDMMYYYY(d);
  });

  const [fromName, setFromName] = useState("Stiknex Studio");
  const [fromEmail, setFromEmail] = useState("billing@stiknex.com");
  const [fromAddress, setFromAddress] = useState("Tech Park, Bangalore, KA, India");

  const [toName, setToName] = useState("Acme Global Inc.");
  const [toEmail, setToEmail] = useState("finance@acme.org");
  const [toAddress, setToAddress] = useState("101 Silicon Valley, San Francisco, CA");

  const [items, setItems] = useState([
    { id: 1, description: "Full-Stack Web Application & UI/UX Design", qty: 1, rate: 45000 },
    { id: 2, description: "Cloud Infrastructure Setup & API Integration", qty: 1, rate: 15000 }
  ]);

  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business! Payment is requested within 15 days via bank transfer or UPI.");
  const [copied, setCopied] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return (subtotal * (Number(taxRate) || 0)) / 100;
  }, [subtotal, taxRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + taxAmount - (Number(discount) || 0));
  }, [subtotal, taxAmount, discount]);

  const addItem = () => {
    playClickSound();
    setItems([...items, { id: Date.now(), description: "New Professional Service", qty: 1, rate: 1000 }]);
  };

  const removeItem = (id) => {
    playClickSound();
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const loadSample = () => {
    playClickSound();
    setInvoiceNumber("INV-2026-089");
    setCurrency("₹");
    setFromName("PixelKraft Digital Agency");
    setFromEmail("accounts@pixelkraft.io");
    setFromAddress("Indiranagar, Bengaluru, KA 560038");
    setToName("Nexus Ventures Ltd.");
    setToEmail("finance@nexusventures.com");
    setToAddress("Bandra Kurla Complex, Mumbai, MH 400051");
    setItems([
      { id: 1, description: "Next.js E-Commerce Frontend Architecture", qty: 1, rate: 65000 },
      { id: 2, description: "Payment Gateway Integration & Webhooks", qty: 1, rate: 20000 },
      { id: 3, description: "Performance Optimization & Lighthouse Audit", qty: 1, rate: 12000 }
    ]);
    setTaxRate(18);
    setDiscount(5000);
    setNotes("Kindly wire payment to HDFC Bank A/C: 501004928192 IFSC: HDFC0001234 within 15 business days.");
  };

  const copySummary = () => {
    const text = `TAX INVOICE: ${invoiceNumber}\nDate: ${date}\nBilled To: ${toName}\nTotal Due: ${currency}${grandTotal.toLocaleString("en-IN")}\nStatus: Due`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT FORM BUILDER */}
      <div className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl border space-y-4 no-print ${
        theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Invoice Editor</span>
          <button
            onClick={loadSample}
            className="px-2.5 py-1 text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition"
          >
            Load Sample Data
          </button>
        </div>

        {/* Basic Header Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Invoice No.</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Invoice Date (DD/MM/YYYY)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none font-mono ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Due Date (DD/MM/YYYY)</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none font-mono ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Sender & Client Details */}
        <div className="space-y-3 pt-2 border-t border-slate-700/20 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-300 block">From (Your Business)</span>
            <input
              type="text"
              placeholder="Business / Your Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Email address"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <input
                type="text"
                placeholder="City, State, Country"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="font-semibold text-slate-300 block">Billed To (Client)</span>
            <input
              type="text"
              placeholder="Client / Company Name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Client Email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <input
                type="text"
                placeholder="Client Address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Line Items Editor */}
        <div className="space-y-2 pt-2 border-t border-slate-700/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Items / Services</span>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-amber-500 font-semibold hover:text-amber-400 transition"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Service / Item Description"
                  value={it.description}
                  onChange={(e) => updateItem(it.id, "description", e.target.value)}
                  className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, "qty", e.target.value)}
                  className={`w-14 px-2 py-1.5 rounded-lg border text-xs outline-none text-center ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={it.rate}
                  onChange={(e) => updateItem(it.id, "rate", e.target.value)}
                  className={`w-24 px-2 py-1.5 rounded-lg border text-xs outline-none text-right font-mono ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(it.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Taxes & Discounts */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/20 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Tax / GST Rate (%)</label>
            <div className="flex items-center gap-1">
              {[0, 5, 12, 18].map((r) => (
                <button
                  key={r}
                  onClick={() => setTaxRate(r)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                    taxRate === r
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Discount Amount ({currency})</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs">
          <label className="text-slate-400 block mb-1">Payment Notes & Terms</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none ${
              theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
          <button
            onClick={copySummary}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              copied
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* RIGHT LIVE DOCUMENT PREVIEW CARD */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 printable-card space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-black text-sm flex items-center justify-center">
                  I
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  TAX INVOICE
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">{invoiceNumber}</p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="font-semibold text-slate-700">Date: <span className="font-mono text-slate-900">{date}</span></div>
              <div className="text-slate-500">Due: <span className="font-mono font-medium text-slate-700">{dueDate}</span></div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                Payment Pending
              </span>
            </div>
          </div>

          {/* Billed By & Billed To */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">From</span>
              <p className="font-bold text-slate-900 text-sm">{fromName || "Your Business Name"}</p>
              <p className="text-slate-600">{fromEmail}</p>
              <p className="text-slate-600">{fromAddress}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Billed To</span>
              <p className="font-bold text-slate-900 text-sm">{toName || "Client Name"}</p>
              <p className="text-slate-600">{toEmail}</p>
              <p className="text-slate-600">{toAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-16">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-24">Rate</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td className="py-3 px-4 text-slate-900 font-medium">{it.description || "Service item"}</td>
                    <td className="py-3 px-4 text-slate-600 text-center font-mono">{it.qty}</td>
                    <td className="py-3 px-4 text-slate-600 text-right font-mono">{currency}{Number(it.rate).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-slate-900 text-right font-mono font-semibold">
                      {currency}{((Number(it.qty) || 0) * (Number(it.rate) || 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{currency}{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax / GST ({taxRate}%):</span>
                  <span className="font-mono font-medium">{currency}{taxAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-mono font-medium">-{currency}{Number(discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Due:</span>
                <span className="font-mono text-amber-600">{currency}{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
              <p className="italic leading-relaxed">{notes}</p>
            </div>
          )}

          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Powered by Stiknex Studio &bull; Free Secure Invoicing Engine
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   3. DEDICATED STOPWATCH WORKSTATION (/stopwatch-with-laps) - FULL PAGE PRECISION CHRONOMETER
   ========================================================================================= */
function StopwatchWorkstation({ theme, playClickSound }) {
  const [time, setTime] = useState(0); // in ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLaps, setShowLaps] = useState(false);
  const containerRef = useRef(null);

  // Use a ref to hold latest time so start offset is always exact
  const timeRef = useRef(0);
  timeRef.current = time;

  // Rock-solid high-precision timer engine using Date.now()
  useEffect(() => {
    let intervalId = null;
    if (running) {
      const startTime = Date.now() - timeRef.current;
      intervalId = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [running]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try { playClickSound(); } catch {}
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleToggle = () => {
    try { playClickSound(); } catch {}
    setRunning((prev) => !prev);
  };

  const handleLap = () => {
    try { playClickSound(); } catch {}
    const lastLapSplit = laps.length > 0 ? laps[0].splitMs : 0;
    const lapDuration = time - lastLapSplit;

    const newLap = {
      id: laps.length + 1,
      durationMs: lapDuration,
      splitMs: time,
      durationStr: formatDigits(lapDuration).full,
      splitStr: formatDigits(time).full
    };
    setLaps([newLap, ...laps]);
  };

  const handleReset = () => {
    try { playClickSound(); } catch {}
    setRunning(false);
    setTime(0);
    timeRef.current = 0;
    setLaps([]);
  };

  // Keyboard Shortcuts (Space = Start/Pause, L = Lap, R = Reset, F = Fullscreen, V = View Laps, Esc = Close Laps)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      } else if (e.key === "l" || e.key === "L") {
        if (running) handleLap();
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "v" || e.key === "V") {
        setShowLaps((prev) => !prev);
      } else if (e.key === "Escape") {
        setShowLaps(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running, laps, time, showLaps]);

  const pad = (n, len = 2) => String(n).padStart(len, "0");

  const formatDigits = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const hStr = hours > 0 ? `${pad(hours)}:` : "";
    const mStr = `${pad(minutes)}:`;
    const sStr = `${pad(seconds)}.`;
    const cStr = pad(centiseconds);

    return {
      hours,
      minutes,
      seconds,
      centiseconds,
      hStr,
      mStr,
      sStr,
      cStr,
      full: `${hStr}${mStr}${sStr}${cStr}`
    };
  };

  const lapStats = useMemo(() => {
    if (laps.length === 0) return { fastestId: null, slowestId: null, avgMs: 0 };
    let fastest = laps[0];
    let slowest = laps[0];
    let totalDur = 0;

    laps.forEach((l) => {
      totalDur += l.durationMs;
      if (l.durationMs < fastest.durationMs) fastest = l;
      if (l.durationMs > slowest.durationMs) slowest = l;
    });

    return {
      fastestId: laps.length > 1 ? fastest.id : null,
      slowestId: laps.length > 1 ? slowest.id : null,
      avgMs: Math.round(totalDur / laps.length)
    };
  }, [laps]);

  const copyLaps = () => {
    try { playClickSound(); } catch {}
    const text = laps
      .map((l) => `Lap ${l.id}: Lap Time: ${l.durationStr} | Total Split: ${l.splitStr}`)
      .reverse()
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    try { playClickSound(); } catch {}
    const headers = "Lap Number,Lap Time,Split Time\n";
    const rows = laps
      .slice()
      .reverse()
      .map((l) => `${l.id},"${l.durationStr}","${l.splitStr}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `stiknex-stopwatch-laps-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const digits = formatDigits(time);

  // 60-Tick Swiss Chronometer Geometry (Center at 150, 150)
  const dialRadius = 135;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const secFrac = (time % 60000) / 60000;
  const strokeOffset = dialCircumference * (1 - secFrac);
  const handAngleDeg = secFrac * 360;
  const handAngleRad = (handAngleDeg - 90) * (Math.PI / 180);

  // Exact Pointer needle coordinates
  const tipX = 150 + 96 * Math.cos(handAngleRad);
  const tipY = 150 + 96 * Math.sin(handAngleRad);
  const tailX = 150 - 22 * Math.cos(handAngleRad);
  const tailY = 150 - 22 * Math.sin(handAngleRad);

  const ticks = useMemo(() => {
    const list = [];
    const count = 60;
    const cx = 150;
    const cy = 150;
    for (let i = 0; i < count; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isMajor = i % 5 === 0;
      const rInner = isMajor ? 116 : 124;
      const rOuter = 134;
      const x1 = cx + rInner * Math.cos(angle);
      const y1 = cy + rInner * Math.sin(angle);
      const x2 = cx + rOuter * Math.cos(angle);
      const y2 = cy + rOuter * Math.sin(angle);

      // Number coordinates for 5s markers (05, 10, 15, ... 60)
      const rNum = 104;
      const nx = cx + rNum * Math.cos(angle);
      const ny = cy + rNum * Math.sin(angle) + 3;
      const numLabel = i === 0 ? "60" : String(i).padStart(2, "0");

      list.push({ i, x1, y1, x2, y2, isMajor, nx, ny, numLabel });
    }
    return list;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden px-4 sm:px-8 py-3 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Dynamic Ambient Background Glow (Breathes while running) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          running ? "opacity-100" : "opacity-30"
        }`}
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.05) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.10) 0%, rgba(234, 88, 12, 0.03) 45%, transparent 75%)"
        }}
      />

      {/* Top Floating Action Bar (Laps Button + Fullscreen) */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            try { playClickSound(); } catch {}
            setShowLaps((prev) => !prev);
          }}
          title="View Recorded Laps (V)"
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer ${
            laps.length > 0
              ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-400 dark:border-amber-500/30"
              : theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          <Flag
            size={16}
            className={
              laps.length > 0
                ? "text-amber-500 dark:text-amber-400"
                : theme === "dark"
                ? "text-slate-400"
                : "text-slate-600"
            }
          />
          <span className="leading-none">Laps</span>
          {laps.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs leading-none">
              {laps.length}
            </span>
          )}
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* FULLSCREEN STOPWATCH CENTER ARENA: SWISS DIAL + COLOSSAL READOUT */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center z-10 py-1 sm:py-2">
        {/* Animated Chronometer Dial (Prominent & Majestic) */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0 flex items-center justify-center mb-1 sm:mb-3">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            {/* Background Dial Track */}
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              className="text-slate-300/40 dark:text-slate-800/80 stroke-current"
              strokeWidth="3.5"
              fill="transparent"
            />

            {/* Sweeping Active Second Arc */}
            <circle
              cx="150"
              cy="150"
              r={dialRadius}
              transform="rotate(-90 150 150)"
              className="text-amber-500 stroke-current transition-all duration-75"
              strokeWidth="5"
              strokeDasharray={dialCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
            />

            {/* 60 Radial Precision Tick Marks + Number labels */}
            {ticks.map((tick) => {
              const currentSec = digits.seconds;
              const isPassed = running ? tick.i <= currentSec : false;
              return (
                <g key={tick.i}>
                  <line
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke={
                      isPassed
                        ? "#f59e0b"
                        : tick.isMajor
                        ? theme === "dark" ? "#94a3b8" : "#64748b"
                        : theme === "dark" ? "#334155" : "#cbd5e1"
                    }
                    strokeWidth={tick.isMajor ? (isPassed ? "3" : "2.5") : "1.5"}
                    strokeLinecap="round"
                  />
                  {tick.isMajor && (
                    <text
                      x={tick.nx}
                      y={tick.ny}
                      textAnchor="middle"
                      fill={isPassed ? "#f59e0b" : theme === "dark" ? "#64748b" : "#94a3b8"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {tick.numLabel}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center Dial Labels */}
            <text x="150" y="132" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
              {laps.length > 0 ? `LAP ${laps.length + 1}` : "CHRONO"}
            </text>
            <text x="150" y="174" textAnchor="middle" fill="#f59e0b" fontSize="14" fontFamily="monospace" fontWeight="black">
              {digits.mStr}{digits.sStr}
            </text>

            {/* Sweeping Seconds Hand Needle */}
            <line
              x1={tailX}
              y1={tailY}
              x2={tipX}
              y2={tipY}
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Counterweight Tail */}
            <circle cx={tailX} cy={tailY} r="3" fill="#ea580c" />
            {/* Center Jewel Pivot */}
            <circle cx="150" cy="150" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <circle cx="150" cy="150" r="1.5" fill="#ffffff" />
          </svg>
        </div>

        {/* COLOSSAL READOUT (True Fullscreen, Monospace Tabular Digits) */}
        <div className="w-full text-center flex items-baseline justify-center font-mono font-black tracking-tight tabular-nums select-none py-1 sm:py-2 leading-none">
          {digits.hStr && (
            <span className="text-slate-400 dark:text-slate-500 text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-none">
              {digits.hStr}
            </span>
          )}
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(digits.minutes)}
          </span>
          <span className={`mx-0.5 sm:mx-1 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none ${
            running ? "text-amber-500 animate-pulse" : "text-slate-400 dark:text-slate-600"
          }`}>
            :
          </span>
          <span className="text-slate-900 dark:text-white drop-shadow-md text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] leading-none">
            {pad(digits.seconds)}
          </span>
          <span className="text-amber-500 font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ml-1 sm:ml-2.5 leading-none drop-shadow-sm">
            .{digits.cStr}
          </span>
        </div>

        {/* HERO CONTROLS BAR (Start, Lap, Reset) */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-3 sm:mt-5 shrink-0">
          {/* Main Action (Start / Pause) */}
          <button
            onClick={handleToggle}
            className={`min-w-[130px] sm:min-w-[160px] justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer ${
              running
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/40 ring-4 ring-amber-500/20 hover:brightness-110"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40 ring-4 ring-emerald-500/20 hover:brightness-110"
            }`}
          >
            {running ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
            <span>{running ? "PAUSE" : "START"}</span>
          </button>

          {/* Lap Split Button */}
          <button
            disabled={!running}
            onClick={handleLap}
            className="min-w-[100px] sm:min-w-[120px] justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white disabled:opacity-25 disabled:cursor-not-allowed rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md border border-slate-700/50 flex items-center gap-2 cursor-pointer"
          >
            <Flag size={17} />
            <span>LAP</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            title="Reset Stopwatch (R)"
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-slate-200 dark:border-slate-700/40 shrink-0 cursor-pointer"
          >
            <RotateCcw size={19} />
          </button>
        </div>

        {/* Keyboard Shortcuts Hint Bar (Desktop only, hidden on mobile & tablet) */}
        <div className="hidden lg:flex mt-3 sm:mt-5 flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">Space</kbd> Start/Pause
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">L</kbd> Lap Split
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">R</kbd> Reset
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">V</kbd> View Laps
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">F</kbd> Fullscreen
          </span>
        </div>
      </div>

      {/* HIGH Z-INDEX RECORDED LAPS SLIDE-OVER OVERLAY DRAWER (z-[90] Backdrop, z-[100] Drawer) */}
      <AnimatePresence>
        {showLaps && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowLaps(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90]"
            />

            {/* Slide-over Side Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full sm:w-[26rem] md:w-[28rem] z-[100] shadow-2xl flex flex-col border-l backdrop-blur-2xl ${
                theme === "dark"
                  ? "bg-slate-900/98 border-slate-800 text-white shadow-black/80"
                  : "bg-white/98 border-slate-200 text-slate-900 shadow-slate-900/20"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Flag size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-base sm:text-lg flex items-center gap-2 truncate">
                      Recorded Laps
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                        {laps.length}
                      </span>
                    </h3>
                    {lapStats.avgMs > 0 && (
                      <p className="text-xs font-mono text-slate-400 truncate">
                        Average: {formatDigits(lapStats.avgMs).full}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowLaps(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800 transition active:scale-95"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Bar inside Drawer */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-100/60 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800/80 text-xs shrink-0">
                <div className="text-slate-400 font-mono text-[11px]">
                  {laps.length > 0 ? `${laps.length} Splits Recorded` : "Telemetry Empty"}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={laps.length === 0}
                    onClick={copyLaps}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-25 flex items-center gap-1.5 transition active:scale-95 border border-slate-700/40"
                    title="Copy All Laps"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    disabled={laps.length === 0}
                    onClick={exportCSV}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-25 flex items-center gap-1.5 transition active:scale-95 border border-slate-700/40"
                    title="Export as CSV"
                  >
                    <Download size={13} />
                    <span>CSV</span>
                  </button>
                  <button
                    disabled={laps.length === 0}
                    onClick={() => setLaps([])}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-25 transition active:scale-95"
                    title="Clear All Laps"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Laps List or Empty State */}
              {laps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-3 shadow-inner">
                    <Flag size={24} />
                  </div>
                  <p className="font-bold text-sm text-slate-200">No Laps Recorded Yet</p>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-[240px] leading-relaxed">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">LAP</kbd> or key <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">L</kbd> while the chronometer is running to capture split times.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
                  {laps.map((lap) => {
                    const isFastest = lap.id === lapStats.fastestId;
                    const isSlowest = lap.id === lapStats.slowestId;

                    return (
                      <div
                        key={lap.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                          isFastest
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm"
                            : isSlowest
                            ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-sm"
                            : theme === "dark"
                            ? "bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 text-slate-200"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-400 w-14">
                            Lap {pad(lap.id)}
                          </span>
                          {isFastest && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                              <Zap size={10} /> FASTEST
                            </span>
                          )}
                          {isSlowest && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              SLOWEST
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase font-sans">Lap</span>
                            <span className="font-bold text-sm">{lap.durationStr}</span>
                          </div>
                          <div className="min-w-[65px]">
                            <span className="text-[9px] text-slate-500 block uppercase font-sans">Split</span>
                            <span className="text-slate-400 text-xs">{lap.splitStr}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   4. DEDICATED SCREEN DIAGNOSTICS WORKSTATION (/screen-resolution-checker)
   ========================================================================================= */
function ScreenDiagnosticsWorkstation({ theme, playClickSound }) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const [diagnostics, setDiagnostics] = useState({
    screenW: typeof window !== "undefined" ? window.screen.width : 1920,
    screenH: typeof window !== "undefined" ? window.screen.height : 1080,
    availW: typeof window !== "undefined" ? window.screen.availWidth : 1920,
    availH: typeof window !== "undefined" ? window.screen.availHeight : 1040,
    viewportW: typeof window !== "undefined" ? window.innerWidth : 1200,
    viewportH: typeof window !== "undefined" ? window.innerHeight : 800,
    dpr: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : 24,
    orientation: typeof window !== "undefined" && window.screen.orientation ? window.screen.orientation.type : "landscape-primary",
    touch: typeof window !== "undefined" ? ("ontouchstart" in window || navigator.maxTouchPoints > 0) : false
  });

  useEffect(() => {
    const handleResize = () => {
      setDiagnostics({
        screenW: window.screen.width,
        screenH: window.screen.height,
        availW: window.screen.availWidth,
        availH: window.screen.availHeight,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation ? window.screen.orientation.type : "landscape-primary",
        touch: "ontouchstart" in window || navigator.maxTouchPoints > 0
      });
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Monitor Resolution</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{diagnostics.screenW} × {diagnostics.screenH} <span className="text-xs text-slate-500">px</span></p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Current Viewport</span>
          <p className="text-xl font-bold font-mono text-amber-500">{diagnostics.viewportW} × {diagnostics.viewportH} <span className="text-xs text-slate-500">px</span></p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Device Pixel Ratio (DPR)</span>
          <p className="text-xl font-bold font-mono text-emerald-400">{diagnostics.dpr}x <span className="text-xs font-sans text-slate-400">{diagnostics.dpr >= 2 ? "(Retina/HiDPI)" : "(Standard)"}</span></p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Available Desktop Workarea</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{diagnostics.availW} × {diagnostics.availH} <span className="text-xs text-slate-500">px</span></p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Color Depth</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{diagnostics.colorDepth}-bit <span className="text-xs font-sans text-slate-400">True Color</span></p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Orientation</span>
          <p className="text-base font-bold text-slate-900 dark:text-white capitalize">{diagnostics.orientation.replace("-", " ")}</p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Touch Screen</span>
          <p className="text-base font-bold text-slate-900 dark:text-white">{diagnostics.touch ? "Touch Enabled" : "No Touch Device"}</p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Calculated Screen Aspect</span>
          <p className="text-xl font-bold font-mono text-indigo-400">
            {(diagnostics.screenW / (gcd(diagnostics.screenW, diagnostics.screenH) || 1))}:
            {(diagnostics.screenH / (gcd(diagnostics.screenW, diagnostics.screenH) || 1))}
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border text-center space-y-3 ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Viewport vs Physical Display Comparison</span>
        <div className="relative mx-auto max-w-md h-48 bg-slate-950 border-2 border-slate-700 rounded-xl flex items-center justify-center p-4">
          <div
            style={{
              width: `${Math.min(100, Math.round((diagnostics.viewportW / diagnostics.screenW) * 100))}%`,
              height: `${Math.min(100, Math.round((diagnostics.viewportH / diagnostics.screenH) * 100))}%`
            }}
            className="bg-amber-500/20 border-2 border-amber-500 rounded-lg flex items-center justify-center text-amber-400 text-xs font-mono font-bold transition-all"
          >
            Viewport: {diagnostics.viewportW} × {diagnostics.viewportH}
          </div>
          <span className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
            Screen: {diagnostics.screenW} × {diagnostics.screenH}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   5. DEDICATED ASPECT RATIO WORKSTATION (/aspect-ratio-calculator)
   ========================================================================================= */
function AspectRatioWorkstation({ theme, playClickSound }) {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [scaleW, setScaleW] = useState("1280");

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const ratioData = useMemo(() => {
    const nw = parseInt(width, 10);
    const nh = parseInt(height, 10);
    if (!nw || !nh || nw <= 0 || nh <= 0) return { simplified: "N/A", decimal: 0, orientation: "Unknown" };

    const divisor = gcd(nw, nh);
    const simpW = nw / divisor;
    const simpH = nh / divisor;
    const dec = (nw / nh).toFixed(3);
    const orient = nw > nh ? "Landscape (Horizontal)" : nw < nh ? "Portrait (Vertical)" : "Square (1:1)";

    return {
      simplified: `${simpW}:${simpH}`,
      decimal: dec,
      orientation: orient
    };
  }, [width, height]);

  const scaledHeight = useMemo(() => {
    const nw = parseInt(width, 10);
    const nh = parseInt(height, 10);
    const targetW = parseInt(scaleW, 10);
    if (!nw || !nh || !targetW) return "—";
    return Math.round((targetW * nh) / nw);
  }, [width, height, scaleW]);

  const PRESETS = [
    { label: "16:9 Full HD", w: "1920", h: "1080" },
    { label: "16:9 4K UHD", w: "3840", h: "2160" },
    { label: "4:3 Standard", w: "1024", h: "768" },
    { label: "21:9 Ultrawide", w: "2560", h: "1080" },
    { label: "1:1 Square", w: "1080", h: "1080" },
    { label: "9:16 Story / Reel", w: "1080", h: "1920" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => { playClickSound(); setWidth(p.w); setHeight(p.h); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              width === p.w && height === p.h
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input Form */}
        <div className={`p-6 rounded-2xl border space-y-4 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <h3 className="font-bold text-sm">Dimension Inputs</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none ${
                  theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* Dimension Scaler */}
          <div className="pt-3 border-t border-slate-700/20 space-y-2 text-xs">
            <span className="font-semibold text-slate-300 block">Proportional Dimension Scaler</span>
            <p className="text-slate-500 text-[11px]">Enter a target width to compute the exact proportional height:</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Target Width</label>
                <input
                  type="number"
                  value={scaleW}
                  onChange={(e) => setScaleW(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none ${
                    theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Scaled Height</label>
                <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono text-sm font-bold text-amber-400">
                  {scaledHeight} px
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result & Visual Preview Box */}
        <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="space-y-3">
            <span className="text-xs text-slate-400 uppercase font-semibold">Aspect Ratio Result</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black font-mono text-amber-500">{ratioData.simplified}</span>
              <span className="text-sm font-mono text-slate-400">({ratioData.decimal}:1)</span>
            </div>
            <p className="text-xs text-slate-400">{ratioData.orientation}</p>
          </div>

          {/* Dynamic Aspect Ratio Box */}
          <div className="py-6 flex items-center justify-center">
            <div
              style={{
                aspectRatio: `${width} / ${height}`,
                maxWidth: "240px",
                maxHeight: "160px"
              }}
              className="w-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl flex items-center justify-center font-mono text-xs font-bold text-amber-400 shadow-md p-2 text-center"
            >
              {ratioData.simplified}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   6. DEDICATED TYPOGRAPHIC SCALE WORKSTATION (/typographic-scale-generator)
   ========================================================================================= */
function TypeScaleWorkstation({ theme, playClickSound }) {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [previewText, setPreviewText] = useState("Stiknex modern developer toolkit");
  const [copied, setCopied] = useState(false);

  const RATIOS = [
    { label: "1.067 - Minor Second", value: 1.067 },
    { label: "1.125 - Major Second", value: 1.125 },
    { label: "1.200 - Minor Third", value: 1.200 },
    { label: "1.250 - Major Third (Recommended)", value: 1.250 },
    { label: "1.333 - Perfect Fourth", value: 1.333 },
    { label: "1.414 - Augmented Fourth", value: 1.414 },
    { label: "1.500 - Perfect Fifth", value: 1.500 },
    { label: "1.618 - Golden Ratio", value: 1.618 }
  ];

  const scaleSteps = useMemo(() => {
    const definitions = [
      { step: 5, name: "Display Hero (H1+)", varName: "--font-size-hero" },
      { step: 4, name: "H1 Title", varName: "--font-size-h1" },
      { step: 3, name: "H2 Heading", varName: "--font-size-h2" },
      { step: 2, name: "H3 Subtitle", varName: "--font-size-h3" },
      { step: 1, name: "H4 Lead", varName: "--font-size-h4" },
      { step: 0, name: "Base Body", varName: "--font-size-base" },
      { step: -1, name: "Small Text", varName: "--font-size-sm" },
      { step: -2, name: "Caption & Legal", varName: "--font-size-xs" }
    ];

    return definitions.map((d) => {
      const px = Number((baseSize * Math.pow(ratio, d.step)).toFixed(2));
      const rem = Number((px / 16).toFixed(3));
      return { ...d, px, rem };
    });
  }, [baseSize, ratio]);

  const cssVariables = useMemo(() => {
    return `:root {\n` +
      scaleSteps.map((s) => `  ${s.varName}: ${s.rem}rem; /* ${s.px}px */`).join("\n") +
      `\n}`;
  }, [scaleSteps]);

  const copyCSS = () => {
    playClickSound();
    navigator.clipboard.writeText(cssVariables);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border space-y-4 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Base Font Size ({baseSize}px)</label>
            <input
              type="range"
              min="12"
              max="24"
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>12px</span>
              <span>16px (Default)</span>
              <span>24px</span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Scale Ratio</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              {RATIOS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Preview Sample Text</label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {scaleSteps.map((s) => (
          <div
            key={s.step}
            className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
              s.step === 0
                ? "border-amber-500/50 bg-amber-500/5"
                : theme === "dark"
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="shrink-0 w-44 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs">{s.name}</span>
                {s.step === 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white">BASE</span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {s.px}px &bull; {s.rem}rem
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <p
                style={{ fontSize: `${Math.min(56, s.px)}px`, lineHeight: 1.2 }}
                className="font-medium text-slate-900 dark:text-white truncate"
              >
                {previewText}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-2xl border space-y-3 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">CSS Custom Properties Export</span>
          <button
            onClick={copyCSS}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied CSS" : "Copy CSS Variables"}
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
          {cssVariables}
        </pre>
      </div>
    </div>
  );
}

/* =========================================================================================
   7. DEDICATED DECISION HELPER WORKSTATION (/decision-helper)
   ========================================================================================= */
function DecisionHelperWorkstation({ theme, playClickSound }) {
  const [coinSide, setCoinSide] = useState("Heads");
  const [flipping, setFlipping] = useState(false);
  const [coinStats, setCoinStats] = useState({ heads: 0, tails: 0, total: 0 });

  const [choicesInput, setChoicesInput] = useState("Pizza, Sushi, Burgers, Tacos, Salad");
  const [pickedChoice, setPickedChoice] = useState(null);
  const [picking, setPicking] = useState(false);

  const flipCoin = () => {
    playClickSound();
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "Heads" : "Tails";
      setCoinSide(result);
      setCoinStats((prev) => ({
        heads: prev.heads + (result === "Heads" ? 1 : 0),
        tails: prev.tails + (result === "Tails" ? 1 : 0),
        total: prev.total + 1
      }));
      setFlipping(false);
    }, 600);
  };

  const pickChoice = () => {
    playClickSound();
    const arr = choicesInput.split(",").map((c) => c.trim()).filter(Boolean);
    if (arr.length === 0) return;
    setPicking(true);
    setTimeout(() => {
      const winner = arr[Math.floor(Math.random() * arr.length)];
      setPickedChoice(winner);
      setPicking(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coin Flipper */}
        <div className={`p-6 rounded-2xl border text-center space-y-5 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-xs text-slate-400 uppercase font-semibold block">3D Coin Flip Simulator</span>

          <div className="py-4">
            <div
              className={`w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl border-4 border-amber-300/60 transition-transform ${
                flipping ? "animate-spin" : "hover:scale-105"
              }`}
            >
              {coinSide}
            </div>
          </div>

          <button
            disabled={flipping}
            onClick={flipCoin}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            {flipping ? "Flipping..." : "Flip Coin (Heads / Tails)"}
          </button>

          {coinStats.total > 0 && (
            <div className="flex justify-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-700/20">
              <span>Heads: {coinStats.heads}</span>
              <span>Tails: {coinStats.tails}</span>
              <span>Total: {coinStats.total}</span>
            </div>
          )}
        </div>

        {/* Random Choice Picker */}
        <div className={`p-6 rounded-2xl border space-y-4 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <span className="text-xs text-slate-400 uppercase font-semibold block">Random Choice Picker</span>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Enter Options (Comma Separated)</label>
            <textarea
              rows={3}
              value={choicesInput}
              onChange={(e) => setChoicesInput(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                theme === "dark" ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          <button
            disabled={picking}
            onClick={pickChoice}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Dices size={15} /> {picking ? "Picking Winner..." : "Pick Random Winner"}
          </button>

          {pickedChoice && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-500">Selected Winner</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{pickedChoice}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   8. DEDICATED VEDIC KUNDALI & ISLAMIC NAMING STUDIO (/name-generator)
   100% Traditional Sanatan Dharma Namkaran Sanskar Vidhi & Islamic Sunnah with Gemini AI
   ========================================================================================= */



// 8. DEDICATED VEDIC KUNDALI & MULTI-FAITH NAMING STUDIO (/name-generator)
// 100% Traditional Sanatan Namkaran, Islamic Sunnah, Sikh Gurbani, Christian & Secular Ephemeris Engine

function NameGeneratorWorkstation({ theme, playClickSound }) {
  // 1. Inputs (Default empty strings - absolutely zero fake hardcoded data!)
  const [tradition, setTradition] = useState("sanatan"); // 'sanatan' | 'islamic' | 'sikh' | 'christian' | 'secular'
  const [gender, setGender] = useState("boy"); // 'boy' | 'girl'
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthVenue, setBirthVenue] = useState("hospital"); // 'hospital' | 'home'
  
  // Lineage & Parental Details (Default empty strings)
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [grandfatherName, setGrandfatherName] = useState("");
  const [gotra, setGotra] = useState("");
  const [startingLetter, setStartingLetter] = useState("");
  const [traditionTheme, setTraditionTheme] = useState("all");
  const [selectedRashi, setSelectedRashi] = useState("auto");

  // UI, Loading, FAQ & Modal States
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusNotice, setStatusNotice] = useState("");
  const [copiedName, setCopiedName] = useState(null);
  const [vidhiModalOpen, setVidhiModalOpen] = useState(false);
  const [vidhiTab, setVidhiTab] = useState("sanatan");
  const [openFaq, setOpenFaq] = useState(null);

  // 2. Computed Astrological / Cultural Ephemeris Data (Brihat Parashara & Meeus algorithms)
  const calculatedKundali = useMemo(() => {
    return calculateVedicPanchang({
      dob,
      time: birthTime,
      ampm,
      place: birthPlace,
      tradition,
      selectedRashi,
      startingLetter,
      gender,
      gotra,
      fatherName,
      motherName
    });
  }, [dob, birthTime, ampm, birthPlace, tradition, selectedRashi, startingLetter, gender, gotra, fatherName, motherName]);

  // Active Kundali & Names state
  const [activeKundali, setActiveKundali] = useState(calculatedKundali);
  const [activeNames, setActiveNames] = useState([]);

  // Keep ephemeris aligned when basic astronomical inputs change
  useEffect(() => {
    setActiveKundali(calculatedKundali);
  }, [calculatedKundali]);

  // Handle Quick Demo Sample Data Fill (Optional helper so users can test with one click)
  const handleLoadDemoData = () => {
    playClickSound();
    setDob("15/08/2026");
    setBirthTime("10:30");
    setAmpm("AM");

    if (tradition === "sanatan") {
      setBirthPlace("Varanasi, Uttar Pradesh, India");
      setFatherName("आदित्य शर्मा");
      setMotherName("सौम्या शर्मा");
      setGrandfatherName("पं. रामेश्वर दयाल शर्मा");
      setGotra("कश्यप गोत्र / भारद्वाज");
      setStartingLetter("अ");
    } else if (tradition === "islamic") {
      setBirthPlace("लखनऊ, उत्तर प्रदेश, भारत");
      setFatherName("मोहम्मद तारिक");
      setMotherName("यासमीन बेगम");
      setGrandfatherName("हाजी अब्दुल रशीद");
      setGotra("सिद्दीकी / अंसार");
      setStartingLetter("Z");
    } else if (tradition === "sikh") {
      setBirthPlace("ਅੰਮ੍ਰਿਤਸਰ ਸਾਹਿਬ, ਪੰਜਾਬ, ਭਾਰਤ");
      setFatherName("ਸ. ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ");
      setMotherName("ਸਿਮਰਨ ਕੌਰ");
      setGrandfatherName("ਸ. ਹਰਬੰਸ ਸਿੰਘ");
      setGotra("ਗਿੱਲ (Gill)");
      setStartingLetter("ਗ");
    } else if (tradition === "christian") {
      setBirthPlace("Kochi, Kerala, India");
      setFatherName("David Thomas");
      setMotherName("Mary Grace");
      setGrandfatherName("George Mathew");
      setGotra("Godparents: John & Elizabeth / Catholic");
      setStartingLetter("G");
    } else {
      setBirthPlace("नई दिल्ली, भारत");
      setFatherName("कबीर वर्मा");
      setMotherName("अनाया मेहता");
      setGrandfatherName("आनंद कुमार");
      setGotra("वर्मा / मेहता");
      setStartingLetter("A");
    }
  };

  const handleClearForm = () => {
    playClickSound();
    setDob("");
    setBirthTime("");
    setBirthPlace("");
    setFatherName("");
    setMotherName("");
    setGrandfatherName("");
    setGotra("");
    setStartingLetter("");
    setSelectedRashi("auto");
    setHasCalculated(false);
    setActiveNames([]);
    setStatusNotice("");
  };

  // 3. Cultural & Astrological Calculation Trigger (Zero mention of AI)
  const handleCalculateNames = async () => {
    playClickSound();
    setIsCalculating(true);
    setStatusNotice("");

    // Calculate immediately with our high-precision mathematical / scholarly engine
    const localResult = generateAstrologicalNames({
      tradition,
      gender,
      dob: dob.trim(),
      time: birthTime.trim(),
      ampm,
      place: birthPlace.trim(),
      startingLetter: startingLetter.trim(),
      selectedRashi,
      gotra: gotra.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      grandfatherName: grandfatherName.trim(),
      traditionTheme
    });

    try {
      const res = await fetch("/api/blogs?action=generate-vedic-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: gender === "boy" ? "Boy" : "Girl",
          tradition,
          traditionTheme,
          dob: dob.trim() || undefined,
          time: birthTime.trim() || undefined,
          ampm,
          place: birthPlace.trim() || undefined,
          birthVenue: birthVenue === "hospital" ? "Hospital / Clinic" : "Home (Griha Janma)",
          fatherName: fatherName.trim() || undefined,
          motherName: motherName.trim() || undefined,
          grandfatherName: grandfatherName.trim() || undefined,
          gotra: gotra.trim() || undefined,
          startingLetter: startingLetter.trim() || undefined,
          rashi: selectedRashi === "auto" ? localResult.kundali.rashi : selectedRashi
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.names && Array.isArray(data.names) && data.names.length > 0) {
          let namesToUse = data.names;
          if (startingLetter.trim()) {
            const letter = startingLetter.trim().toLowerCase();
            const matched = namesToUse.filter((n) =>
              (n.nameEnglish && n.nameEnglish.toLowerCase().startsWith(letter)) ||
              (n.nameHindi && n.nameHindi.toLowerCase().startsWith(letter))
            );
            if (matched.length >= 2) {
              namesToUse = matched;
            } else {
              namesToUse = localResult.names;
            }
          }
          setActiveNames(namesToUse);
          if (data.kundali) {
            setActiveKundali((prev) => ({
              ...prev,
              ...data.kundali
            }));
          }
          setHasCalculated(true);
          setStatusNotice(
            startingLetter.trim()
              ? `चयनित अक्षर '${startingLetter.trim()}' अनुसार शुभ व संस्कारित नामों की गणना संपन्न हुई।`
              : "संस्कार एवं पंचांग अनुसार शुभ नामों की गणना सफलता पूर्वक संपन्न हुई।"
          );
          return;
        }
      }
      throw new Error("Local engine fallback");
    } catch (err) {
      console.info("Using local high-precision calculation engine:", err);
      setActiveNames(localResult.names);
      setActiveKundali(localResult.kundali);
      setHasCalculated(true);
      setStatusNotice(
        startingLetter.trim()
          ? `चयनित अक्षर '${startingLetter.trim()}' अनुसार शुभ व संस्कारित नामों की गणना संपन्न हुई।`
          : "पारंपरिक संस्कार एवं पंचांग अनुसार शुभ नामों की गणना सफलता पूर्वक संपन्न हुई।"
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const copyNameCard = (nameStr, e) => {
    e?.stopPropagation();
    playClickSound();
    navigator.clipboard.writeText(nameStr);
    setCopiedName(nameStr);
    setTimeout(() => setCopiedName(null), 2000);
  };

  // Tradition-specific Symbol and Title
  const getTraditionMeta = () => {
    switch (tradition) {
      case "islamic":
        return { symbol: "🌙", title: "इस्लामी सुन्नत नामकरण एवं तस्मिया", subtitle: "सुन्नत-ए-रसूल, हदीस शरीफ़, अक़ीक़ा व मुबारक अरबी नामों की प्रमाणिक गणना।" };
      case "sikh":
        return { symbol: "ੴ", title: "ਸਿੱਖ ਨਾਮਕਰਨ ਤੇ ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ", subtitle: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਪਾਵਨ ਹੁਕਮਨਾਮੇ ਦੇ ਮੁੱਖਵਾਕ ਅੱਖਰ ਅਤੇ 'ਸਿੰਘ' ਤੇ 'ਕੌਰ' ਦੀ ਮਰਯਾਦਾ।" };
      case "christian":
        return { symbol: "✝", title: "Holy Baptism & Christian Naming", subtitle: "Authentic Biblical, Saintly & Christening naming based on Gospel virtues." };
      case "secular":
        return { symbol: "🌍", title: "Universal & Modern Meaningful Naming", subtitle: "Nature, cosmic elements, humanist virtues, and globally elegant pronunciation." };
      default:
        return { symbol: "ॐ", title: "वैदिक कुंडली एवं नामकरण संस्कार", subtitle: "नक्षत्र चरण, जन्म राशि, नामाक्षर व पूर्वजों की वंशावली अनुसार 100% शुद्ध वैदिक गणना।" };
    }
  };

  const traditionMeta = getTraditionMeta();

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative pb-16">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER: AUTHENTIC CULTURAL & TRADITIONAL NAMING
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-all ${
        theme === "dark" 
          ? "bg-slate-900/80 border-slate-800 shadow-black/40" 
          : "bg-white border-slate-200 shadow-slate-100"
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0 text-xl font-bold">
              {traditionMeta.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {traditionMeta.title}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  100% शुद्ध सांस्कृतिक व पंचांग गणना
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {traditionMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Vidhi Guide Modal Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setVidhiTab(tradition);
                setVidhiModalOpen(true);
              }}
              className="px-4 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>नामकरण संस्कार विधि (Guide)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DETAILED BIRTH, ANCESTRAL & RELIGIOUS INPUT WORKSTATION
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-5 sm:p-7 rounded-3xl border space-y-6 ${
        theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between border-b border-slate-700/20 pb-3 flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Calendar size={14} className="text-amber-500" />
            {tradition === "islamic"
              ? "1. फ़रज़ंद / बच्ची व ख़ानदानी विवरण (Birth & Nasab Parameters)"
              : tradition === "sikh"
              ? "1. ਬਾਲਕ / ਬਾਲਿਕਾ ਤੇ ਪਰਿਵਾਰਕ ਵੇਰਵਾ (Birth & Family Details)"
              : tradition === "christian"
              ? "1. Child & Family Baptismal Information"
              : tradition === "secular"
              ? "1. शिशु एवं पारिवारिक विवरण (Birth & Family Parameters)"
              : "1. शिशु एवं पारिवारिक जन्म विवरण (Birth & Ancestral Parameters)"}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemoData}
              type="button"
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              💡 नमूना विवरण भरें (Demo Details)
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={handleClearForm}
              type="button"
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              फ़ॉर्म साफ़ करें (Clear)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Tradition / Dharm */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              परंपरा / धर्म (Tradition &amp; Sanskar)
            </label>
            <select
              value={tradition}
              onChange={(e) => {
                const val = e.target.value;
                setTradition(val);
                setVidhiTab(val);
                setHasCalculated(false);
                setActiveNames([]);
                setFatherName("");
                setMotherName("");
                setGrandfatherName("");
                setGotra("");
                setStartingLetter("");
                setStatusNotice("");
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-bold outline-none cursor-pointer ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="sanatan">🕉️ सनातन धर्म (Vedic Namkaran Sanskar)</option>
              <option value="islamic">🌙 इस्लाम / मुस्लिम (Sunnah Naming &amp; Tasmiyah)</option>
              <option value="sikh">ੴ ਸਿੱਖ ਧਰਮ (Gurbani Hukamnama &amp; Naam Karan)</option>
              <option value="christian">✝️ ईसाई / मसीही (Holy Baptism &amp; Christian Naming)</option>
              <option value="secular">🌍 धर्मनिरपेक्ष / आधुनिक / प्राकृतिक (Universal &amp; Modern)</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              शिशु लिंग (Child Gender)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender("boy")}
                className={`py-2 px-3 rounded-xl font-bold border transition cursor-pointer text-center ${
                  gender === "boy"
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
                }`}
              >
                {tradition === "sikh" ? "ਲੜਕਾ (Boy - Singh)" : tradition === "islamic" ? "लड़का (Boy)" : "बालक (Boy)"}
              </button>
              <button
                type="button"
                onClick={() => setGender("girl")}
                className={`py-2 px-3 rounded-xl font-bold border transition cursor-pointer text-center ${
                  gender === "girl"
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
                }`}
              >
                {tradition === "sikh" ? "ਲੜਕੀ (Girl - Kaur)" : tradition === "islamic" ? "लड़की (Girl)" : "बालिका (Girl)"}
              </button>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              जन्म तिथि (Date of Birth - DD/MM/YYYY)
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="जन्म तिथि e.g. 15/08/2026"
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Birth Time & AM/PM */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              जन्म समय (Birth Time with AM/PM)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                placeholder="उदा. 10:30"
                className={`flex-1 px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <button
                type="button"
                onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 cursor-pointer"
              >
                {ampm}
              </button>
            </div>
          </div>

          {/* Place of Birth */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1 flex items-center gap-1.5">
              <MapPin size={12} className="text-amber-500" />
              {tradition === "sikh" ? "ਪਿੰਡ / ਸ਼ਹਿਰ (Birth Place)" : "जन्म स्थान (City, State, Country)"}
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder={
                tradition === "sikh"
                  ? "उदा. अमृतसर साहिब, लुधियाना, पंजाब"
                  : tradition === "islamic"
                  ? "उदा. लखनऊ, उत्तर प्रदेश / मदीना मुनव्वरा"
                  : tradition === "christian"
                  ? "e.g. Kochi, Kerala, India / Goa"
                  : tradition === "secular"
                  ? "उदा. नई दिल्ली, बेंगलुरु, भारत"
                  : "उदा. वाराणसी, उत्तर प्रदेश, भारत"
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Birth Venue (Ghar vs Hospital) */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              जन्म स्थान प्रकार (Birth Venue)
            </label>
            <select
              value={birthVenue}
              onChange={(e) => setBirthVenue(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="hospital">अस्पताल / मैटरनिटी क्लीनिक (Hospital)</option>
              <option value="home">गृह जन्म / घर पर (Home Birth)</option>
            </select>
          </div>

          {/* Father's / Parent 1 Name */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1 flex items-center gap-1.5">
              <User size={12} className="text-indigo-400" />
              {tradition === "islamic" ? "والد کا نام / पिता का नाम (Father's Name)" : tradition === "sikh" ? "ਪਿਤਾ ਜੀ ਦਾ ਨਾਮ (Father's Name)" : tradition === "secular" ? "अभिभावक 1 / पिता का नाम (Parent 1)" : "पिता का नाम (Father's Name)"}
            </label>
            <input
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder={
                tradition === "islamic"
                  ? "उदा. मोहम्मद तारिक / Tariq Mehmood"
                  : tradition === "sikh"
                  ? "उदा. स. गुरप्रीत सिंह / Harpreet Singh"
                  : tradition === "christian"
                  ? "e.g. David Thomas / Joseph"
                  : tradition === "secular"
                  ? "उदा. कबीर वर्मा / Rohan Verma"
                  : "उदा. आदित्य शर्मा"
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Mother's / Parent 2 Name */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1 flex items-center gap-1.5">
              <User size={12} className="text-rose-400" />
              {tradition === "islamic" ? "والدہ کا نام / माता का नाम (Mother's Name)" : tradition === "sikh" ? "ਮਾਤਾ ਜੀ ਦਾ ਨਾਮ (Mother's Name)" : tradition === "secular" ? "अभिभावक 2 / माता का नाम (Parent 2)" : "माता का नाम (Mother's Name)"}
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder={
                tradition === "islamic"
                  ? "उदा. यासमीन बेगम / Yasmeen Begum"
                  : tradition === "sikh"
                  ? "उदा. सिमरन कौर / Jaspreet Kaur"
                  : tradition === "christian"
                  ? "e.g. Mary Grace / Elizabeth"
                  : tradition === "secular"
                  ? "उदा. अनाया मेहता / Priya Sharma"
                  : "उदा. सौम्या शर्मा"
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Grandfather's Name */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1 flex items-center gap-1.5">
              <User size={12} className="text-amber-400" />
              {tradition === "islamic" ? "दादा / आबा-ओ-अजदाद (Grandfather's Lineage)" : tradition === "sikh" ? "ਦਾਦਾ ਜੀ ਦਾ ਨਾਮ (Grandfather's Name)" : tradition === "secular" ? "दादा-दादी / पारिवारिक पूर्वज (Family Ancestry)" : "दादा जी का नाम (Grandfather's Name)"}
            </label>
            <input
              type="text"
              value={grandfatherName}
              onChange={(e) => setGrandfatherName(e.target.value)}
              placeholder={
                tradition === "islamic"
                  ? "उदा. हाजी अब्दुल रशीद / Haji Rashid"
                  : tradition === "sikh"
                  ? "उदा. स. हरबंस सिंह / Gurbakhsh Singh"
                  : tradition === "christian"
                  ? "e.g. George Mathew / Peter"
                  : tradition === "secular"
                  ? "उदा. आनंद कुमार / Ramesh Kumar"
                  : "उदा. पं. रामेश्वर दयाल शर्मा"
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Gotra / Khandan / Got / Lineage */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              {tradition === "islamic" ? "खानदान / नसब (Khandan / Nasab)" : tradition === "sikh" ? "ਗੋਤ / ਪਿੰਡ (Got / Pind / Lineage)" : tradition === "christian" ? "धर्ममाता-धर्मपिता / संप्रदाय (Godparents / Church)" : tradition === "secular" ? "पारिवारिक उपनाम (Family Surname / Heritage)" : "कुल / गोत्र / उपनाम (Gotra & Lineage)"}
            </label>
            <input
              type="text"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              placeholder={
                tradition === "islamic"
                  ? "उदा. सिद्दीकी, कुरैशी, अंसारी, खान, सैयद"
                  : tradition === "sikh"
                  ? "उदा. गिल, ढिल्लों, संधू, गरेवाल, सिद्धू"
                  : tradition === "christian"
                  ? "उदा. John & Elizabeth (Godparents) / कैथोलिक"
                  : tradition === "secular"
                  ? "उदा. वर्मा, मेहता / कोई उपनाम नहीं"
                  : "उदा. कश्यप / भारद्वाज / उपमन्यु"
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Preferred Starting Syllable / Letter */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              {tradition === "sikh" ? "ਹੁਕਮਨਾਮਾ / ਮੁੱਖਵਾਕ ਅੱਖਰ (Hukamnama Letter)" : tradition === "islamic" ? "पसंदीदा हर्फ़ / पहला अक्षर (Starting Letter)" : tradition === "christian" ? "पसंदीदा पहला अक्षर या संत (Preferred Saint / Letter)" : tradition === "secular" ? "शुरुआती ध्वनि / अक्षर (Preferred Starting Sound)" : "शुभ पहला अक्षर (Starting Syllable in Hindi / Eng)"}
            </label>
            <input
              type="text"
              value={startingLetter}
              onChange={(e) => setStartingLetter(e.target.value)}
              placeholder={
                tradition === "sikh"
                  ? "ਮੁੱਖਵਾਕ ਅੱਖਰ e.g. ਗ, ਹ, ਜ, ਮ, ਸ..."
                  : tradition === "islamic"
                  ? "वैकल्पिक e.g. A, M, Z, F या أ, م, ز..."
                  : tradition === "christian"
                  ? "e.g. Paul, Luke, G, M, Teresa..."
                  : tradition === "secular"
                  ? "e.g. A, N, V, R, K, S..."
                  : "वैकल्पिक e.g. अ, आ, क, K, S..."
              }
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
            {startingLetter.trim() && (
              <p className="mt-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>🎯 परिणाम केवल '{startingLetter.trim().toUpperCase()}' अक्षर से शुरू होने वाले नाम ही दिखाएंगे</span>
              </p>
            )}
          </div>

          {/* Rashi Selection: Auto-calculated or Manual Override */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              {tradition === "islamic" ? "मुबारक़ बुर्ज (Islamic Buruj / Zodiac)" : "जन्म राशि (Rashi Selection - Auto or Select)"}
            </label>
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="auto">
                🌟 जन्म समय अनुसार स्वचालित ({calculatedKundali.rashiHindi} / {calculatedKundali.rashi})
              </option>
              {VEDIC_RASHIS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.hindi} ({r.id}) - स्वामी: {r.lord}
                </option>
              ))}
            </select>
          </div>

          {/* Tradition-Specific Focus / Category */}
          <div>
            <label className="text-slate-400 block font-semibold mb-1">
              {tradition === "islamic"
                ? "इस्लामी श्रेणी (Islamic Naming Category)"
                : tradition === "sikh"
                ? "ਗੁਰਮਤਿ ਵਿਸ਼ਾ (Gurbani Theme)"
                : tradition === "christian"
                ? "मसीही परंपरा (Christian Rite / Tradition)"
                : tradition === "secular"
                ? "प्रेरणा स्रोत (Inspirational Theme)"
                : "नामकरण श्रेणी (Naming Theme / Category)"}
            </label>
            {tradition === "islamic" ? (
              <select
                value={traditionTheme}
                onChange={(e) => setTraditionTheme(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">समस्त सुन्नत एवं मुबारक़ नाम (All Sunnah Names)</option>
                <option value="asma">अस्मा-उल-हुस्ना (अल्लाह के बंदे - Abdur-Rahman, Abdul-Malik)</option>
                <option value="anbiya">अंबिया-ए-किराम (पैगंबर - Ibrahim, Yusuf, Musa, Isa)</option>
                <option value="sahaba">सहाबा व सहाबियात (Ali, Umar, Fatima, Aisha)</option>
                <option value="virtues">अरबी व इस्लामी नेक सिफ़ात (Zayan, Rayyan, Noor, Inaya)</option>
              </select>
            ) : tradition === "sikh" ? (
              <select
                value={traditionTheme}
                onChange={(e) => setTraditionTheme(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">ਸਮਸਤ ਗੁਰਬਾਣੀ ਤੇ ਪਾਵਨ ਨਾਮ (All Gurbani Virtues)</option>
                <option value="courage">ਸੂਰਬੀਰਤਾ ਤੇ ਅਣਖ (Courage, Bravery - Tegbir, Fateh, Zorawar)</option>
                <option value="devotion">ਭਗਤੀ, ਸਿਮਰਨ ਤੇ ਪ੍ਰੇਮ (Devotion - Harpreet, Gurkirat)</option>
                <option value="wisdom">ਨਿਮਰਤਾ ਤੇ ਗਿਆਨ (Wisdom, Humility - Sehaj, Anhad, Jasleen)</option>
              </select>
            ) : tradition === "christian" ? (
              <select
                value={traditionTheme}
                onChange={(e) => setTraditionTheme(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">समस्त बाइबिल एवं संत नाम (All Biblical &amp; Saints)</option>
                <option value="catholic">कैथोलिक व संरक्षक संत (Catholic &amp; Patron Saints)</option>
                <option value="protestant">प्रोटेस्टेंट व पवित्र बाइबिल (Protestant &amp; Biblical Covenant)</option>
                <option value="virtues">मसीही सद्गुण (Grace, Faith, Hope, Sophia)</option>
              </select>
            ) : tradition === "secular" ? (
              <select
                value={traditionTheme}
                onChange={(e) => setTraditionTheme(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">समस्त आधुनिक एवं मानवीय मूल्य (All Universal Categories)</option>
                <option value="nature">प्रकृति एवं पंचतत्व (Nature, Rivers, Mountains, Dawn)</option>
                <option value="cosmic">ब्रह्मांडीय एवं खगोलीय (Cosmic, Celestial, Stars, Light)</option>
                <option value="humanist">मानवीय मूल्य एवं दर्शन (Freedom, Truth, Peace, Harmony)</option>
                <option value="global">आधुनिक व वैश्विक उच्चारण (Short, Modern &amp; Globally Accessible)</option>
              </select>
            ) : (
              <select
                value={traditionTheme}
                onChange={(e) => setTraditionTheme(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                  theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">समस्त वैदिक व सांस्कृतिक नाम (All Vedic Categories)</option>
                <option value="devata">देवता व ईष्ट नाम (Devata &amp; Ishta Nama)</option>
                <option value="nakshatra">नक्षत्र नामाक्षर नाम (Nakshatra Charan Nama)</option>
                <option value="spiritual">आध्यात्मिक व वेदांतिक (Spiritual Sanskrit &amp; Upanishadic)</option>
                <option value="vyavaharika">व्यावहारिक व आधुनिक शुभ नाम (Vyavaharika Modern Nama)</option>
              </select>
            )}
          </div>
        </div>

        {/* Action Button: Authentic Traditional Calculation (No mention of AI) */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/20">
          <div className="text-xs text-slate-400">
            {tradition === "sanatan" ? (
              <>
                <span>नामाक्षर आधारित गणना: </span>
                <strong className="text-amber-500 font-mono">
                  {calculatedKundali.shubhAkshar?.join(", ")}
                </strong>
              </>
            ) : tradition === "sikh" ? (
              <span className="text-amber-500 font-semibold">
                ੴ ਲੜਕੇ ਲਈ 'ਸਿੰਘ' ਅਤੇ ਲੜਕੀ ਲਈ 'ਕੌਰ' ਦਾ ਪਾਵਨ ਸੰਕਲਪ
              </span>
            ) : tradition === "islamic" ? (
              <span className="text-emerald-500 font-semibold">
                🌙 7वें दिन अक़ीक़ा व तस्मिया की मुबारक़ सुन्नत
              </span>
            ) : (
              <span className="text-blue-400 font-semibold">
                ✨ मानवीय गरिमा एवं पवित्र संस्कारों पर आधारित शुद्ध गणना
              </span>
            )}
          </div>

          <button
            onClick={handleCalculateNames}
            disabled={isCalculating}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 ${
              isCalculating ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isCalculating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>
                  {tradition === "islamic"
                    ? "हदीस, सुन्नत व इस्लामी तस्मिया अनुसार मुबारक़ नामों की खोज जारी है..."
                    : tradition === "sikh"
                    ? "ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ ਤੇ ਪਾਵਨ ਅੱਖਰ ਅਨੁਸਾਰ ਨਾਮਾਂ ਦੀ ਖੋਜ ਜਾਰੀ ਹੈ..."
                    : tradition === "christian"
                    ? "पवित्र बाइबिल एवं मसीही संतों अनुसार नामों की खोज जारी है..."
                    : tradition === "secular"
                    ? "आधुनिक, प्रकृति व सार्वभौमिक मूल्यों अनुसार नामों की खोज जारी है..."
                    : "पंचांग, नक्षत्र एवं वैदिक नियमानुसार गणना जारी है..."}
                </span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>
                  {tradition === "islamic"
                    ? "🌙 सुन्नत एवं हदीस अनुसार मुबारक़ नाम तलाशें"
                    : tradition === "sikh"
                    ? "ੴ ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮੇ ਅਨੁਸਾਰ ਪਾਵਨ ਨਾਮ ਖੋਜੋ"
                    : tradition === "christian"
                    ? "✝️ पवित्र बपतिस्मा व मसीही नाम खोजें"
                    : tradition === "secular"
                    ? "🌍 आधुनिक व अर्थपूर्ण नाम खोजें"
                    : "🕉️ संस्कार एवं पंचांग अनुसार नाम उत्पन्न करें"}
                </span>
              </>
            )}
          </button>
        </div>

        {statusNotice && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
            {statusNotice}
          </p>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TRADITION / KUNDALI PATRIKA SUMMARY CARD
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm ${
        theme === "dark" 
          ? "bg-slate-900/80 border-slate-800" 
          : "bg-amber-50/40 border-amber-200/80"
      }`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{traditionMeta.symbol}</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              {tradition === "sanatan"
                ? "वैदिक जन्म पत्रिका एवं नामाक्षर विवरण (Ephemeris Calculation)"
                : tradition === "islamic"
                ? "इस्लामी तस्मिया व अक़ीक़ा विवरण (Islamic Sunnah Parameters)"
                : tradition === "sikh"
                ? "ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ ਤੇ ਗੁਰਮਤਿ ਸੰਸਕਾਰ (Sikh Heritage Parameters)"
                : tradition === "christian"
                ? "Holy Baptism & Christening Rite Parameters"
                : "Universal Humanist & Nature Heritage Summary"}
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            {tradition === "sanatan"
              ? activeKundali.lagna || "शुभ लग्न"
              : tradition === "islamic"
              ? "सुन्नत-ए-तस्मिया (अक़ीक़ा)"
              : tradition === "sikh"
              ? "ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ"
              : tradition === "christian"
              ? "Sacrament of Baptism"
              : "Universal Heritage"}
          </span>
        </div>

        {/* 6 TRADITION-AUTHENTIC STAT CARDS (ZERO CROSS-FAITH CONTAMINATION) */}
        {tradition === "sanatan" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">जन्म राशि (Janma Rashi)</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.rashiHindi} ({activeKundali.rashi})
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">नक्षत्र व चरण (Nakshatra)</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.nakshatraHindi} ({activeKundali.charan})
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">शुभ नामाक्षर (Akshar)</span>
              <strong className="text-amber-600 dark:text-amber-400 text-sm font-bold mt-0.5 block font-mono">
                {Array.isArray(activeKundali.shubhAkshar) ? activeKundali.shubhAkshar.join(", ") : activeKundali.shubhAkshar}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">गण व नाड़ी (Gana &amp; Nadi)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                गण: {activeKundali.gana} | नाड़ी: {activeKundali.nadi}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">शुभ अंक व रंग (Lucky)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                अंक: {activeKundali.luckyNumber} | {activeKundali.luckyColor}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">इष्ट देव / आराध्य (Ishta Devta)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block truncate" title={activeKundali.ishtaDev}>
                {activeKundali.ishtaDev}
              </strong>
            </div>
          </div>
        ) : tradition === "islamic" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">मुबारक़ बुर्ज (Islamic Buruj)</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.buruj || "जदी / हमल"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">सुन्नत-ए-तस्मिया (Sunnah Timing)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                7वें दिन अक़ीक़ा व नामकरण
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">पसंदीदा हर्फ़ (Selected Letter)</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold mt-0.5 block font-mono">
                {startingLetter ? startingLetter.toUpperCase() : "अ, म, ज़, फ़, र (A, M, Z, F)"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">तहनीक व सदक़ा (Sunnah Rite)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                खजूर घुट्टी व चांदी सदक़ा
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">इल्म-उल-अदद (Lucky Adad)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                अंक: {activeKundali.luckyNumber || 7} | हरा व सफ़ेद
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">अस्मा-उल-हुस्ना (Divine Virtue)</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-0.5 block truncate" title="अब्दुर-रहमान, रहीम, करीम">
                रहमान, रहीम, करीम, नूर
              </strong>
            </div>
          </div>
        ) : tradition === "sikh" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਜਨਮ ਰਾਸ਼ੀ (Janma Rashi)</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.rashiHindi} ({activeKundali.rashi})
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਗੁਰਬਾਣੀ ਅੰਗ (Gurbani Ang)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਪਾਵਨ ਅੰਗ
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਮੁੱਖਵਾਕ ਪਹਿਲਾ ਅੱਖਰ (First Letter)</span>
              <strong className="text-amber-600 dark:text-amber-400 text-sm font-bold mt-0.5 block font-mono">
                {startingLetter ? startingLetter : "ਗ, ਹ, ਜ, ਮ, ਸ"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਨਾਮ ਮਰਯਾਦਾ (Mandatory Suffix)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                {gender === "boy" ? "ਲੜਕੇ ਲਈ 'ਸਿੰਘ' (Singh)" : "ਲੜਕੀ ਲਈ 'ਕੌਰ' (Kaur)"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਭਾਗਸ਼ਾਲੀ ਅੰਕ ਤੇ ਰੰਗ (Lucky)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                ਅੰਕ: {activeKundali.luckyNumber} | ਪੀਲਾ ਤੇ ਕੇਸਰੀ
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">ਗੁਰਮਤਿ ਆਦਰਸ਼ (Gurmat Virtue)</span>
              <strong className="text-amber-600 dark:text-amber-400 text-xs font-bold mt-0.5 block truncate" title="ਸਤਿਨਾਮੁ, ਵਾਹਿਗੁਰੂ, ਸੇਵਾ ਤੇ ਸੂਰਬੀਰਤਾ">
                ਸਤਿਨਾਮੁ, ਸੇਵਾ, ਸਿਮਰਨ
              </strong>
            </div>
          </div>
        ) : tradition === "christian" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Constellation Sign</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.rashi}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Sacrament Rite</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                Holy Baptism (कलीसियाई संस्कार)
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Preferred Initial / Saint</span>
              <strong className="text-blue-600 dark:text-blue-400 text-sm font-bold mt-0.5 block font-mono">
                {startingLetter ? startingLetter.toUpperCase() : "G, P, J, M, D"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Spiritual Sponsorship</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                धर्ममाता-पिता (Godparents)
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Grace Number &amp; Color</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                No: {activeKundali.luckyNumber} | White &amp; Sky Blue
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">Scriptural Virtue</span>
              <strong className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-0.5 block truncate" title="Faith, Hope &amp; Divine Love">
                Grace, Faith, Hope &amp; Truth
              </strong>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-4">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">खगोलीय राशि (Astronomical)</span>
              <strong className="text-slate-900 dark:text-white text-sm font-bold mt-0.5 block">
                {activeKundali.rashiHindi} ({activeKundali.rashi})
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">प्रेरणा स्रोत (Inspiration)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                प्रकृति, नदियां, पर्वत व प्रभात
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">प्राथमिक ध्वनि (Starting Sound)</span>
              <strong className="text-purple-600 dark:text-purple-400 text-sm font-bold mt-0.5 block font-mono">
                {startingLetter ? startingLetter.toUpperCase() : "A, K, N, R, V, S"}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">पंचतत्व (Natural Element)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                पृथ्वी, जल, अग्नि, वायु, आकाश
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">शुभ आभा (Aesthetic Tone)</span>
              <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">
                अंक: {activeKundali.luckyNumber} | प्राकृतिक रंग
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 block font-semibold">मानवीय मूल्य (Humanist Values)</span>
              <strong className="text-purple-600 dark:text-purple-400 text-xs font-bold mt-0.5 block truncate" title="सत्य, स्वतंत्रता, समरसता व करुणा">
                सत्य, स्वतंत्रता, समरसता, करुणा
              </strong>
            </div>
          </div>
        )}

        {/* Ceremony Vidhi Tip Box */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
          <span className="text-amber-500 font-bold shrink-0 mt-0.5">📜 नामकरण विधान:</span>
          <p className="leading-relaxed">
            {activeKundali.ceremonyVidhi}
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. GENERATED AUSPICIOUS NAMES WITH DEEP MEANINGS
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              शुभ एवं संस्कारित नाम सूची (Auspicious Curated Names)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {activeNames.length > 0 ? `${activeNames.length} नाम उपलब्ध` : "विवरण दर्ज करें"}
          </span>
        </div>

        {activeNames.length === 0 ? (
          /* Empty Ready State (No fake data pre-dumped) */
          <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-3 transition ${
            theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="w-14 h-14 rounded-2xl mx-auto bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">
              {traditionMeta.symbol}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {tradition === "islamic"
                ? "सुन्नत एवं इस्लामी तस्मिया अनुसार नाम तलाशने के लिए तैयार"
                : tradition === "sikh"
                ? "ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ ਤੇ ਗੁਰਮਤਿ ਅਨੁਸਾਰ ਪਾਵਨ ਨਾਮ ਖੋਜਣ ਲਈ ਤਿਆਰ"
                : tradition === "christian"
                ? "पवित्र बपतिस्मा एवं मसीही संतों अनुसार नाम खोजने के लिए तैयार"
                : tradition === "secular"
                ? "आधुनिक, प्रकृति व मानवीय मूल्यों अनुसार नाम खोजने के लिए तैयार"
                : "संस्कार एवं पंचांग आधारित नाम गणना के लिए तैयार"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {tradition === "islamic"
                ? "कृपया उपरोक्त फ़ॉर्म में शिशु व ख़ानदान का विवरण दर्ज करें और 'सुन्नत एवं हदीस अनुसार मुबारक़ नाम तलाशें' बटन दबाएं। सहीह हदीस व सुन्नत-ए-रसूल के अनुरूप मुबारक़ नामों की सूची प्रस्तुत की जाएगी।"
                : tradition === "sikh"
                ? "ਕ੍ਰਿਪਾ ਕਰਕੇ ਉਪਰੋਕਤ ਫ਼ਾਰਮ ਵਿਚ ਬੱਚੇ ਤੇ ਪਰਿਵਾਰ ਦਾ ਵੇਰਵਾ ਦਰਜ ਕਰੋ ਅਤੇ 'ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮੇ ਅਨੁਸਾਰ ਪਾਵਨ ਨਾਮ ਖੋਜੋ' ਬਟਨ ਦਬਾਓ। ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਪਾਵਨ ਆਦਰਸ਼ਾਂ ਅਨੁਸਾਰ ਨਾਮ ਪ੍ਰਾਪਤ ਕਰੋ।"
                : tradition === "christian"
                ? "कृपया उपरोक्त फ़ॉर्म में शिशु व परिवार का विवरण दर्ज करें और 'पवित्र बपतिस्मा व मसीही नाम खोजें' बटन दबाएं। पवित्र बाइबिल व संरक्षक संतों के गुणों पर आधारित नाम प्रस्तुत किए जाएंगे।"
                : tradition === "secular"
                ? "कृपया उपरोक्त फ़ॉर्म में शिशु का विवरण दर्ज करें और 'आधुनिक व अर्थपूर्ण नाम खोजें' बटन दबाएं। प्रकृति, ब्रह्मांड व सार्वभौमिक मानवीय मूल्यों पर आधारित सुंदर नाम प्रस्तुत किए जाएंगे।"
                : "कृपया उपरोक्त फ़ॉर्म में शिशु व परिवार का विवरण दर्ज करें और 'संस्कार एवं पंचांग अनुसार नाम उत्पन्न करें' बटन दबाएं। आपकी चयनित परंपरा के अनुसार शुद्ध एवं अर्थपूर्ण नामों की गणना की जाएगी।"}
            </p>
            <div className="pt-2">
              <button
                onClick={handleLoadDemoData}
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
              >
                💡 नमूना विवरण भरें (Fill Sample Details)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNames.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-3xl border transition-all hover:border-amber-500/50 flex flex-col justify-between space-y-3 ${
                  theme === "dark" 
                    ? "bg-slate-900/70 border-slate-800 hover:bg-slate-900" 
                    : "bg-white border-slate-200 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                          {item.nameEnglish}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
                          ({item.nameHindi})
                        </span>
                      </div>
                      {item.category && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => copyNameCard(`${item.nameEnglish} (${item.nameHindi}) - ${item.meaning}`, e)}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition cursor-pointer"
                        title="Copy Name with Meaning"
                      >
                        {copiedName === `${item.nameEnglish} (${item.nameHindi}) - ${item.meaning}` ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Meaning & Context */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white font-semibold">अर्थ: </strong>
                    {item.meaning}
                  </p>

                  {item.spiritualContext && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic leading-relaxed">
                      🌟 {item.spiritualContext}
                    </p>
                  )}
                </div>

                {/* Bottom Card Badges */}
                <div className="pt-2.5 border-t border-slate-700/10 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="truncate">
                    {item.rashi ? `राशि: ${item.rashi}` : ""} {item.nakshatra ? `| नक्षत्र: ${item.nakshatra}` : ""}
                  </span>
                  {item.luckyNumber && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                      अंक {item.luckyNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. COMPREHENSIVE SEO, AIO, AGO & GEO MULTI-FAITH KNOWLEDGE HUB
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-6 sm:p-8 rounded-3xl border mt-10 space-y-8 ${
        theme === "dark" ? "bg-slate-900/50 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
      }`}>
        {/* Main Semantic H2 */}
        <div className="border-b border-slate-700/20 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
            <span>📖</span> प्रामाणिक नामकरण संहिता एवं संस्कार विधान
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            समस्त धर्मों के नामकरण संस्कार, धार्मिक नियम एवं विधि विधान (Multi-Faith Naming Sanskar Guide)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            सनातन धर्म के 27 नक्षत्र व 108 पाद, इस्लाम की सुन्नत-ए-तस्मिया व अक़ीक़ा, सिख धर्म का श्री गुरु ग्रंथ साहिब जी हुकमनामा, ईसाई पवित्र बपतिस्मा एवं आधुनिक धर्मनिरपेक्ष नामकरण की संपूर्ण प्रामाणिक जानकारी।
          </p>
        </div>

        {/* 5 Distinct Pillars (H3 semantic hierarchy for Google & AI search crawlers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* 1. Sanatan Dharma Pillar */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span>🕉️</span> वैदिक नामकरण संस्कार (11वें/12वें दिन)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              सनातन धर्म में षोडश (16) संस्कारों में नामकरण पंचम संस्कार है। यह जन्म के 11वें दिन (एकादशाह) अथवा 12वें दिन (द्वादशाह) को सूतक शुद्धि के उपरांत संपन्न होता है।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>चार प्रकार के नाम:</strong> नक्षत्र नाम (गुप्त नाम), इष्टदेवता नाम, कुल नाम एवं व्यावहारिक नाम।</li>
              <li><strong>पाद व नामाक्षर:</strong> चंद्रमा के 27 नक्षत्रों के 108 पादों (चरणों) में से सटीक चरण का ध्वनि अक्षर चुना जाता है।</li>
              <li><strong>कर्ण वेध व फूंकने का मंत्र:</strong> पिता कुशा व स्वर्ण शलाका से शहद-घृत का स्पर्श कराकर दायें कान में <em>"अमुकोऽसि..."</em> मंत्र उच्चारित करते हैं।</li>
            </ul>
          </div>

          {/* 2. Islamic Sunnah Pillar */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span>🌙</span> इस्लामी सुन्नत-ए-तस्मिया व अक़ीक़ा
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              इस्लाम में बच्चे का अच्छा और अर्थपूर्ण नाम रखना वालिदैन (माता-पिता) का पहला और अहम कर्तव्य है। हदीस शरीफ़ के अनुसार नाम का इंसान के अख़लाक़ और व्यक्तित्व पर गहरा असर पड़ता है।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>7वें दिन अक़ीक़ा व तस्मिया:</strong> सिर के बाल उतारकर बालों के वजन के बराबर चांदी सदक़ा करना और नाम रखना सुन्नत है।</li>
              <li><strong>पसंदीदा तरीन नाम:</strong> रसूलुल्लाह (सल्ल.) का फ़रमान है कि अल्लाह को सबसे पसंदीदा नाम <em>अब्दुल्लाह</em> और <em>अब्दुर-रहमान</em> हैं।</li>
              <li><strong>अंबिया व सहाबा के नाम:</strong> पैगंबरों व सहाबियात (अली, उमर, फ़ातिमा, आइशा, मरियम) के नाम बरकत और रहमत का ज़रिया हैं।</li>
            </ul>
          </div>

          {/* 3. Sikh Gurbani Pillar */}
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-2.5">
            <h3 className="font-bold text-sm text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
              <span>ੴ</span> ਸਿੱਖ ਨਾਮਕਰਨ ਤੇ ਗੁਰਬਾਣੀ ਹੁਕਮਨਾਮਾ
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              ਸਿੱਖ ਰਹਿਤ ਮਰਯਾਦਾ ਅਨੁਸਾਰ ਪਰਿਵਾਰ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਵਿਖੇ ਹਾਜ਼ਰ ਹੋ ਕੇ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਸਨਮੁਖ ਸ਼ੁਕਰਾਨੇ ਦੀ ਅਰਦਾਸ ਕਰਦਾ ਹੈ।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>ਮੁੱਖਵਾਕ ਦਾ ਪਹਿਲਾ ਅੱਖਰ:</strong> ਪਾਵਨ ਹੁਕਮਨਾਮੇ ਦੇ ਖੱਬੇ ਪੰਨੇ ਦੇ ਸਭ ਤੋਂ ਪਹਿਲੇ ਸ਼ਬਦ ਦੇ ਪਹਿਲੇ ਗੁਰਮੁਖੀ ਅੱਖਰ ਤੋਂ ਬੱਚੇ ਦਾ ਨਾਮ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।</li>
              <li><strong>ਸਿੰਘ ਤੇ ਕੌਰ ਲਾਜ਼ਮੀ:</strong> ਦਸਮੇਸ਼ ਪਿਤਾ ਸ਼੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਦੇ ਆਦੇਸ਼ ਅਨੁਸਾਰ ਲੜਕੇ ਲਈ 'ਸਿੰਘ' ਅਤੇ ਲੜਕੀ ਲਈ 'ਕੌਰ' ਲਗਾਉਣਾ ਅਨਿੱਖੜਵਾਂ ਨਿਯਮ ਹੈ।</li>
              <li><strong>ਗੁਰਮਤਿ ਆਦਰਸ਼:</strong> ਨਾਮ ਵਿਚ ਨਿਮਰਤਾ, ਸੇਵਾ, ਸਿਮਰਨ ਅਤੇ ਸੂਰਬੀਰਤਾ ਦੇ ਸੰਸਕਾਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।</li>
            </ul>
          </div>

          {/* 4. Christian Baptism Pillar */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2.5">
            <h3 className="font-bold text-sm text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <span>✝️</span> ईसाई बपतिस्मा व मसीही नामकरण
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              ईसाई विश्वास में नामकरण पवित्र बपतिस्मा (Holy Baptism / Christening) के संस्कार के साथ जुड़कर कलीसिया में संपन्न होता है।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>पवित्र संस्कार:</strong> पादरी द्वारा पवित्र जल छिड़ककर त्रिएक परमेश्वर (पिता, पुत्र, पवित्र आत्मा) के नाम पर बपतिस्मा दिया जाता है।</li>
              <li><strong>गॉडपेरेंट्स (धर्ममाता-पिता):</strong> आध्यात्मिक अभिभावक जीवन भर बच्चे को मसीही विश्वास व सत्य के मार्ग पर चलने की शपथ लेते हैं।</li>
              <li><strong>संरक्षक संत:</strong> पवित्र संतों (Saint Peter, John, Mary, Teresa) के नाम पर नाम रखा जाता है।</li>
            </ul>
          </div>

          {/* 5. Secular &amp; Modern Pillar */}
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2.5">
            <h3 className="font-bold text-sm text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
              <span>🌍</span> धर्मनिरपेक्ष, आधुनिक व प्राकृतिक नामकरण
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              किसी भी रूढ़ि, जाति या संकीर्णता से मुक्त सार्वभौमिक मानवीय मूल्यों एवं प्रकृति के तत्वों पर आधारित आधुनिक नाम।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>पंचतत्व व प्रकृति:</strong> नदियां (कावेरी), पर्वत (शिखर), प्रभात (विहान), और ब्रह्मांड (तारा, नील) से प्रेरणा।</li>
              <li><strong>मानवीय मूल्य:</strong> सत्य, स्वतंत्रता, समरसता, शांति और करुणा पर आधारित प्रगतिशील नाम।</li>
              <li><strong>वैश्विक उच्चारण:</strong> आधुनिक डिजिटल युग में देश-विदेश में आसानी से उच्चारित होने वाले संक्षिप्त नाम।</li>
            </ul>
          </div>

          {/* 6. Client-Side Privacy Tech Assurance */}
          <div className="p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-2.5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>🔒</span> 100% गोपनीयता एवं शुद्ध पंचांग गणना
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              यह उपकरण पूरी तरह से क्लाइंट-साइड सुरक्षा के साथ कार्य करता है। आपके द्वारा दर्ज जन्म तिथि, समय व पारिवारिक नाम किसी बाहरी डेटाबेस में संग्रहीत नहीं होते।
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li><strong>शुद्ध खगोलीय गणना:</strong> जूलियन डे एवं चंद्रमा के वास्तविक रेखांश पर आधारित सटीक पंचांग।</li>
              <li><strong>संस्कृति-विशिष्ट फ़िल्टर:</strong> चयनित धर्म के अनुसार ही नाम व नियम प्रदर्शित होते हैं।</li>
            </ul>
          </div>
        </div>

        {/* Multi-Faith Comparative Matrix Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span>📊</span> नामकरण परंपरा तुलनात्मक सारणी (Multi-Faith Comparative Matrix)
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={theme === "dark" ? "bg-slate-800/80 text-white" : "bg-slate-100 text-slate-900"}>
                  <th className="p-3 border-b border-slate-700/20 font-bold">धर्म / परंपरा</th>
                  <th className="p-3 border-b border-slate-700/20 font-bold">संस्कार का नाम</th>
                  <th className="p-3 border-b border-slate-700/20 font-bold">शुभ समय / दिन</th>
                  <th className="p-3 border-b border-slate-700/20 font-bold">पहला अक्षर निर्धारण</th>
                  <th className="p-3 border-b border-slate-700/20 font-bold">अनिवार्य प्रत्यय / नियम</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                <tr>
                  <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">🕉️ सनातन धर्म</td>
                  <td className="p-3">नामकरण संस्कार (पंचम संस्कार)</td>
                  <td className="p-3">जन्म के 11वें या 12वें दिन (सूतक शुद्धि उपरांत)</td>
                  <td className="p-3">जन्म नक्षत्र का चरण (108 पादाक्षर)</td>
                  <td className="p-3">कुल/गोत्र उपनाम, कान में गुप्त नाम फूंकना</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">🌙 इस्लाम (मुस्लिम)</td>
                  <td className="p-3">तस्मिया व अक़ीक़ा (सुन्नत)</td>
                  <td className="p-3">जन्म का 7वां दिन</td>
                  <td className="p-3">हदीस व कुरानिक शब्द या पसंदीदा हर्फ़</td>
                  <td className="p-3">अब्दुल्लाह, अब्दुर-रहमान, अंबिया व सहाबा नाम</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-orange-600 dark:text-orange-400">ੴ ਸਿੱਖ ਧਰਮ</td>
                  <td className="p-3">ਨਾਮਕਰਨ (ਹੁਕਮਨਾਮਾ ਵਿਧੀ)</td>
                  <td className="p-3">ਜਨਮ ਉਪਰੰਤ ਪਰਿਵਾਰ ਦੀ ਸੁਵਿਧਾ ਅਨੁਸਾਰ</td>
                  <td className="p-3">ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਮੁੱਖਵਾਕ ਦਾ ਪਹਿਲਾ ਅੱਖਰ</td>
                  <td className="p-3">ਲੜਕੇ ਲਈ 'ਸਿੰਘ' ਤੇ ਲੜਕੀ ਲਈ 'ਕੌਰ' ਲਾਜ਼ਮੀ</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">✝️ ईसाई (मसीही)</td>
                  <td className="p-3">पवित्र बपतिस्मा (Holy Baptism)</td>
                  <td className="p-3">जन्म के कुछ सप्ताह अथवा माह उपरांत</td>
                  <td className="p-3">संरक्षक संत अथवा पवित्र बाइबिल चरित्र</td>
                  <td className="p-3">धर्ममाता-धर्मपिता (Godparents) की साक्षी</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-purple-600 dark:text-purple-400">🌍 धर्मनिरपेक्ष / आधुनिक</td>
                  <td className="p-3">शिशु स्वागत समारोह (Baby Welcoming)</td>
                  <td className="p-3">अभिभावकों की इच्छा अनुसार</td>
                  <td className="p-3">ध्वन्यात्मक सुलभता व पंचतत्व</td>
                  <td className="p-3">रूढ़ि व जाति-मुक्त, सार्वभौमिक मानवीय मूल्य</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Structured 6 FAQs Accordion */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span>❓</span> अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions - FAQ)
          </h3>
          <div className="space-y-2">
            {[
              {
                q: "नामकरण के लिए जन्म समय और स्थान क्यों आवश्यक है?",
                a: "वैदिक ज्योतिष एवं खगोल विज्ञान में चंद्रमा की स्थिति प्रति 2.25 दिन में एक राशि तथा लगभग 24 घंटे में एक नक्षत्र बदलती है। सही जन्म समय व अक्षांश-देशांतर (स्थान) से ही शिशु के जन्म का सटीक नक्षत्र चरण (पाद), चंद्र राशि और शुभ नामाक्षर निकलता है।"
              },
              {
                q: "इस्लाम में बच्चे का नाम रखने की सही सुन्नत विधि क्या है?",
                a: "सुन्नत-ए-रसूल के अनुसार जन्म के तुरंत बाद दायें कान में अज़ान व बायें में इक़ामत दी जाती है। फिर किसी नेक बुज़ुर्ग द्वारा नर्म खजूर का रस तालू पर लगाना (तहनीक) सुन्नत है। 7वें दिन अक़ीक़ा करके सिर के बाल मुंडवाकर बालों के वजन के बराबर चांदी सदक़ा की जाती है और एक अर्थपूर्ण व नेक इस्लामी नाम (जैसे अब्दुल्लाह, अब्दुर-रहमान, अंबिया व सहाबा के नाम) रखा जाता है।"
              },
              {
                q: "सिख धर्म में बच्चे का नाम रखने के लिए हुकमनामा कैसे लिया जाता है?",
                a: "सिख मर्यादा अनुसार परिवार गुरुद्वारा साहिब में श्री गुरु ग्रंथ साहिब जी के सन्मुख अरदास करवाता है। इसके बाद ग्रंथी सिंह जी पावन बीड़ को खोलकर हुकमनामा (मुखवाक) पढ़ते हैं। हुकमनामे के पहले शब्द का जो पहला अक्षर (गुरमुखी वर्ण) होता है, उसी अक्षर से बच्चे का नाम रखा जाता है और लड़के के नाम के साथ 'सिंह' व लड़की के साथ 'कੌਰ' लगाना अनिवार्य है।"
              },
              {
                q: "सनातन धर्म में चार प्रकार के नाम कौन-से होते हैं?",
                a: "वैदिक परंपरा में नामकरण के समय 4 नाम निर्धारित किए जाते हैं: 1. नक्षत्र नाम (जन्म नक्षत्र के चरण अनुसार गुप्त नाम जो तांत्रिक व आयुर्वेदिक दृष्टि से रक्षक माना जाता है), 2. इष्टदेवता नाम (कुलदेवता या आराध्य देव का नाम), 3. कुल नाम (पूर्वजों व गोत्र की पहचान वाला नाम), 4. व्यावहारिक नाम (जो समाज व स्कूल में पुकारा जाता है)।"
              },
              {
                q: "क्या बिना किसी धार्मिक विधि के आधुनिक और अर्थपूर्ण नाम चुना जा सकता है?",
                a: "हाँ, धर्मनिरपेक्ष (Secular) या आधुनिक विकल्प चुनने पर आप प्रकृति (नदियां, पर्वत, प्रभात), खगोलीय पिंड (तारे, प्रकाश), और सार्वभौमिक मानवीय मूल्यों (सत्य, करुणा, स्वतंत्रता, शांति) पर आधारित सुंदर और वैश्विक रूप से सुलभ नाम प्राप्त कर सकते हैं।"
              },
              {
                q: "क्या यह नामकरण उपकरण 100% गोपनीय और सुरक्षित है?",
                a: "बिल्कुल। यह उपकरण 100% सुरक्षित और क्लाइंट-साइड गणना पर आधारित है। आपके द्वारा दर्ज जन्म तिथि, समय, शहर या माता-पिता का नाम किसी भी सर्वर या डेटाबेस में सेव नहीं किया जाता। आपकी पारिवारिक जानकारी पूरी तरह से सुरक्षित और निजी रहती है।"
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-700/20 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-800/10 dark:hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-amber-500 font-mono">Q{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <span className="text-slate-400 font-bold shrink-0 text-base">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-700/10 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Structured JSON-LD FAQPage Schema for Search Engines &amp; AI Overviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "नामकरण के लिए जन्म समय और स्थान क्यों आवश्यक है?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "वैदिक ज्योतिष एवं खगोल विज्ञान में चंद्रमा की स्थिति प्रति 2.25 दिन में एक राशि तथा लगभग 24 घंटे में एक नक्षत्र बदलती है। सही जन्म समय व अक्षांश-देशांतर से ही शिशु के जन्म का सटीक नक्षत्र चरण, चंद्र राशि और शुभ नामाक्षर निकलता है।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "इस्लाम में बच्चे का नाम रखने की सही सुन्नत विधि क्या है?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "सुन्नत-ए-रसूल के अनुसार जन्म के तुरंत बाद अज़ान-इक़ामत और खजूर से तहनीक की जाती है। 7वें दिन अक़ीक़ा करके बालों के वजन के बराबर चांदी सदक़ा की जाती है और अब्दुल्लाह, अब्दुर-रहमान या अंबिया-सहाबा का नेक नाम रखा जाता है।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "सिख धर्म में बच्चे का नाम रखने के लिए हुकमनामा कैसे लिया जाता है?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "सिख मर्यादा अनुसार गुरुद्वारा साहिब में श्री गुरु ग्रंथ साहिब जी के सन्मुख अरदास उपरांत हुकमनामा लिया जाता है। मुखवाक के पहले शब्द के पहले अक्षर से नाम रखा जाता है तथा लड़के के लिए 'सिंह' व लड़की के लिए 'कौर' अनिवार्य है।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "सनातन धर्म में चार प्रकार के नाम कौन-से होते हैं?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "सनातन धर्म में चार नाम होते हैं: 1. नक्षत्र नाम (गुप्त पादाक्षर नाम), 2. इष्टदेवता नाम, 3. कुल/गोत्र नाम, 4. व्यावहारिक नाम।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "क्या बिना किसी धार्मिक विधि के आधुनिक और अर्थपूर्ण नाम चुना जा सकता है?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "हाँ, धर्मनिरपेक्ष विकल्प चुनने पर आप प्रकृति, पंचतत्व, खगोलीय पिंड और मानवीय मूल्यों पर आधारित आधुनिक नाम प्राप्त कर सकते हैं।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "क्या यह नामकरण उपकरण 100% गोपनीय और सुरक्षित है?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "यह उपकरण 100% क्लाइंट-साइड सुरक्षा के साथ कार्य करता है। जन्म तिथि, समय व पारिवारिक विवरण किसी भी सर्वर में सेव नहीं होते।"
                  }
                }
              ]
            })
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FIXED FLOATABLE HELP (?) BUTTON FOR NAMKARAN VIDHI
      ───────────────────────────────────────────────────────────── */}
      <button
        onClick={() => {
          playClickSound();
          setVidhiTab(tradition);
          setVidhiModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-2xl shadow-amber-500/50 flex items-center justify-center font-black text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/40 ring-4 ring-amber-500/20"
        title="समस्त धर्मों के नामकरण संस्कार एवं विधि गाइड (?)"
        aria-label="Namkaran Vidhi & Rules Guide"
      >
        ?
      </button>

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL DIALOG: 5 TRADITIONS NAMING VIDHI & RULES GUIDE
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {vidhiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs text-slate-700 dark:text-slate-300 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm">
                    📜
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      समस्त धार्मिक एवं सांस्कृतिक नामकरण संस्कार विधि मार्गदर्शिका
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Authentic Guidelines for Sanatan, Islamic, Sikh, Christian &amp; Secular Traditions
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVidhiModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tradition Filter Tabs in Modal */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
                {[
                  { id: "sanatan", label: "🕉️ सनातन धर्म" },
                  { id: "islamic", label: "🌙 इस्लाम (सुन्नत)" },
                  { id: "sikh", label: "ੴ ਸਿੱਖ ਧਰਮ" },
                  { id: "christian", label: "✝️ ईसाई (बपतिस्मा)" },
                  { id: "secular", label: "🌍 धर्मनिरपेक्ष / आधुनिक" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setVidhiTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      vidhiTab === t.id
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Sanatan Dharma Namkaran Rules */}
              {vidhiTab === "sanatan" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <span>🕉️</span> सनातन धर्म नामकरण संस्कार (11वें या 12वें दिन की विधि)
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>शुभ मुहूर्त:</strong> जन्म के 11वें दिन (एकादशाह) या 12वें दिन (द्वादशाह) को सूतक शुद्धि के उपरांत हवन व नवग्रह पूजन श्रेष्ठ माना जाता है।
                    </li>
                    <li>
                      <strong>चार प्रकार के वैदिक नाम:</strong>
                      <ul className="list-circle pl-4 mt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                        <li><strong>नक्षत्र नाम (गुप्त नाम):</strong> जन्म नक्षत्र के चरण (पादाक्षर) से शुरू होने वाला नाम जो आयुर्वेद व तांत्रिक सुरक्षा देता है।</li>
                        <li><strong>इष्टदेवता नाम:</strong> कुल देवता या आराध्य भगवान का नाम जो ईश्वरीय अनुग्रह प्रदान करता है।</li>
                        <li><strong>व्यावहारिक नाम:</strong> समाज व विद्यालय में पुकारा जाने वाला शुभ नाम।</li>
                        <li><strong>कुल / गोत्र नाम:</strong> पूर्वजों व दादा जी के संस्कारों को अक्षुण्ण रखने वाला उपनाम।</li>
                      </ul>
                    </li>
                    <li>
                      <strong>कान में फूंकने की विधि:</strong> पिता शिशु को गोद में लेकर स्वर्ण शलाका या कुशा घास की जड़ से थोड़ा सा शहद-घृत शिशु की जीभ पर स्पर्श कराकर उसके दायें कान में तीन बार <em>"अमुकोऽसि..."</em> कहकर गुप्त नक्षत्र नाम का उच्चारण करते हैं।
                    </li>
                    <li>
                      <strong>दादा जी का सम्मान:</strong> परंपरा अनुसार दादा जी के नाम के गुणों या अक्षरों का समावेश कुल के वंशदीप को विशेष आशीर्वाद प्रदान करता है।
                    </li>
                  </ul>
                </div>
              )}

              {/* Tab 2: Islamic Sunnah Naming Rules */}
              {vidhiTab === "islamic" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span>🌙</span> इस्लामी सुन्नत नामकरण परंपरा (तस्मिया व तहनीक)
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>7वें दिन अक़ीक़ा व तस्मिया:</strong> सुन्नत के अनुसार जन्म के 7वें दिन शिशु के बाल कटवाकर, अक़ीक़ा कर अच्छा और नेक नाम रखना चाहिए।
                    </li>
                    <li>
                      <strong>तहनीक (Tahneek):</strong> जन्म के उपरांत किसी नेक बुज़ुर्ग या माता-पिता द्वारा नर्म की हुई खजूर का थोड़ा सा रस शिशु के तालू पर लगाना सुन्नत है।
                    </li>
                    <li>
                      <strong>हदीस शरीफ़ के अनुसार सबसे उत्तम नाम:</strong> रसूलुल्लाह (सल्ल.) ने फ़रमाया कि अल्लाह तआला को सबसे पसंदीदा नाम <em>अब्दुल्लाह</em> और <em>अब्दुर-रहमान</em> हैं।
                    </li>
                    <li>
                      <strong>अंबिया व सहाबा के नाम:</strong> पैगंबरों (अंबिया किराम) तथा सहाबा व सहाबियात (जैसे मुहम्मद, इब्राहिम, अली, फ़ातिमा, आइशा, मरियम) के नाम बरकत और हिदायत का ज़रिया बनते हैं।
                    </li>
                    <li>
                      <strong>मकरूह नामों से परहेज़:</strong> ऐसे नामों से बचना चाहिए जिनका अर्थ नकारात्मक, घमंड वाला या बदकिस्मती का द्योतक हो।
                    </li>
                  </ul>
                </div>
              )}

              {/* Tab 3: Sikh Naming Rules */}
              {vidhiTab === "sikh" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <span>ੴ</span> ਸਿੱਖ ਨਾਮਕਰਨ ਮਰਯਾਦਾ (ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਹੁਕਮਨਾਮਾ ਵਿਧੀ)
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>ਹੁਕਮਨਾਮਾ ਲੈਣਾ:</strong> ਪਰਿਵਾਰ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਵਿਖੇ ਸ਼੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਸਨਮੁਖ ਸ਼ੁਕਰਾਨੇ ਦੀ ਅਰਦਾਸ ਕਰਦਾ ਹੈ। ਗ੍ਰੰਥੀ ਸਿੰਘ ਜੀ ਪਾਵਨ ਬੀੜ ਖੋਲ੍ਹ ਕੇ ਮੁੱਖਵਾਕ (ਹੁਕਮਨਾਮਾ) ਸਰਵਣ ਕਰਵਾਉਂਦੇ ਹਨ।
                    </li>
                    <li>
                      <strong>ਪਹਿਲਾ ਅੱਖਰ ਨਿਯਮ:</strong> ਹੁਕਮਨਾਮੇ ਦੇ ਖੱਬੇ ਪੰਨੇ ਦੇ ਸਭ ਤੋਂ ਪਹਿਲੇ ਸ਼ਬਦ ਦਾ ਜੋ ਪਹਿਲਾ ਅੱਖਰ (ਗੁਰਮੁਖੀ ਅੱਖਰ) ਹੁੰਦਾ ਹੈ, ਉਸੇ ਅੱਖਰ ਤੋਂ ਬੱਚੇ ਦਾ ਪਾਵਨ ਨਾਮ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।
                    </li>
                    <li>
                      <strong>'ਸਿੰਘ' ਅਤੇ 'ਕੌਰ' ਦਾ ਲਾਜ਼ਮੀ ਲਗਾਵ:</strong> ਦਸਮੇਸ਼ ਪਿਤਾ ਸ਼੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਦੇ ਹੁਕਮ ਅਨੁਸਾਰ ਲੜਕੇ ਦੇ ਨਾਮ ਨਾਲ 'ਸਿੰਘ' (ਸ਼ੇਰ) ਅਤੇ ਲੜਕੀ ਦੇ ਨਾਮ ਨਾਲ 'ਕੌਰ' (ਰਾਜਕੁਮਾਰੀ) ਲਗਾਉਣਾ ਸਿੱਖ ਮਰਯਾਦਾ ਦਾ ਅਨਿੱਖੜਵਾਂ ਅੰਗ ਹੈ।
                    </li>
                    <li>
                      <strong>ਗੁਰਮਤਿ ਆਦਰਸ਼:</strong> ਨਾਮ ਵਿਚ ਸੂਰਬੀਰਤਾ, ਸਿਮਰਨ, ਸੇਵਾ, ਅਤੇ ਨਿਮਰਤਾ ਦੇ ਗੁਣ ਝਲਕਣੇ ਚਾਹੀਦੇ ਹਨ।
                    </li>
                  </ul>
                </div>
              )}

              {/* Tab 4: Christian Naming Rules */}
              {vidhiTab === "christian" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <span>✝️</span> ईसाई बपतिस्मा संस्कार एवं मसीही नामकरण (Holy Baptism)
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>पवित्र बपतिस्मा (Christening Rite):</strong> कलीसिया में पादरी या फादर द्वारा शिशु पर पवित्र जल छिड़ककर त्रिएक ईश्वर (पिता, पुत्र और पवित्र आत्मा) के नाम पर बपतिस्मा दिया जाता है।
                    </li>
                    <li>
                      <strong>धर्ममाता व धर्मपिता (Godparents / Sponsors):</strong> मसीही विश्वास में गॉडपेरेंट्स की अहम भूमिका होती है जो जीवन भर बच्चे को आध्यात्मिक शिक्षा व मार्गदर्शन देने की शपथ लेते हैं।
                    </li>
                    <li>
                      <strong>संरक्षक संत (Patron Saint):</strong> किसी पवित्र संत (जैसे संत थॉमस, संत पीटर, संत जॉन, संत तेरेसा) या बाइबिल के पवित्र नबी के नाम पर नाम रखा जाता है ताकि संत की प्रार्थनाएं व गुण बच्चे के जीवन में फलें।
                    </li>
                    <li>
                      <strong>ईश्वरीय अनुग्रह:</strong> नाम में ईश्वरीय दया (Grace), विश्वास (Faith), मुक्ति (Salvation) और सत्य (Truth) के गुणों की प्रतिष्ठा होती है।
                    </li>
                  </ul>
                </div>
              )}

              {/* Tab 5: Secular / Modern Universal Naming */}
              {vidhiTab === "secular" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <span>🌍</span> धर्मनिरपेक्ष, आधुनिक एवं मानवीय नामकरण पद्धति
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>रूढ़ियों व संकीर्णता से मुक्त:</strong> किसी भी जाति, कुल या धार्मिक कट्टरता से परे सार्वभौमिक मानवीय मूल्यों को समर्पित नाम।
                    </li>
                    <li>
                      <strong>प्रकृति व पंचतत्व की प्रेरणा:</strong> नदियां (कावेरी, तीस्ता), पर्वत (शिखर, हिम), प्रभात (विहान, भोर), और ब्रह्मांड (तारा, अंबर, नील) से जुड़े प्रेरक नाम।
                    </li>
                    <li>
                      <strong>सार्वभौमिक मूल्य:</strong> सत्य (सत्या), स्वतंत्रता (मुक्ति, कबीर), समरसता (आरव), और करुणा (अनाया, मीरा) पर आधारित अर्थपूर्ण नाम।
                    </li>
                    <li>
                      <strong>वैश्विक सुलभता:</strong> आधुनिक युग में ऐसा नाम जो देश-विदेश में आसानी से उच्चारित हो सके और अपनी समृद्ध पहचान बनाए रखे।
                    </li>
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setVidhiModalOpen(false)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  समझ गया (Got It)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================================
   9. DEDICATED FLASHCARDS WORKSTATION (/flashcard-maker)
   ========================================================================================= */
function FlashcardWorkstation({ theme, playClickSound }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const FLASHCARDS = [
    { q: "What is the purpose of useEffect in React?", a: "To handle side effects like data fetching, subscriptions, timers, and manual DOM mutations in functional components." },
    { q: "What is the Big-O time complexity of a Binary Search algorithm?", a: "O(log n) because the search range is divided by half on every comparison." },
    { q: "What is CSS Specificity hierarchy?", a: "!important > Inline Styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements." },
    { q: "What is the difference between synchronous and asynchronous code?", a: "Synchronous executes sequentially blocking subsequent tasks; Asynchronous delegates tasks to event loops allowing concurrent execution." },
    { q: "What is an Idempotent HTTP method?", a: "A method (like GET, PUT, DELETE) where making multiple identical requests has the same outcome as a single request." }
  ];

  const currentCard = FLASHCARDS[cardIndex];

  return (
    <div className={`max-w-4xl mx-auto p-8 rounded-3xl border text-center space-y-6 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Software Engineering & Computer Science Deck</span>
        <span>Card {cardIndex + 1} of {FLASHCARDS.length}</span>
      </div>

      <div
        onClick={() => { playClickSound(); setFlipped(!flipped); }}
        className={`min-h-56 max-w-lg mx-auto p-8 rounded-2xl border cursor-pointer select-none flex flex-col justify-center items-center transition-all duration-300 shadow-lg ${
          flipped
            ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
            : theme === "dark"
            ? "bg-slate-800/80 border-slate-700 text-white hover:border-slate-600"
            : "bg-slate-100 border-slate-300 text-slate-900 hover:border-slate-400"
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">
          {flipped ? "Answer (Click to flip back)" : "Question (Click to reveal answer)"}
        </span>
        <p className="text-base sm:text-lg font-bold leading-relaxed">
          {flipped ? currentCard.a : currentCard.q}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            playClickSound();
            setCardIndex((i) => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length);
            setFlipped(false);
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={() => { playClickSound(); setFlipped(!flipped); }}
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
        >
          {flipped ? "Show Question" : "Reveal Answer"}
        </button>
        <button
          onClick={() => {
            playClickSound();
            setCardIndex((i) => (i + 1) % FLASHCARDS.length);
            setFlipped(false);
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================================
   10. DEDICATED QUIZ GENERATOR WORKSTATION (/random-quiz-generator)
   ========================================================================================= */
function QuizWorkstation({ theme, playClickSound }) {
  const QUIZ = [
    { q: "Which HTTP status code signifies a permanent 301 redirection?", options: ["200 OK", "301 Moved Permanently", "404 Not Found", "500 Server Error"], answer: 1 },
    { q: "What HTML attribute specifies an alternative text for images for accessibility?", options: ["title", "src", "alt", "aria-hidden"], answer: 2 },
    { q: "What does the DOM stand for?", options: ["Document Object Model", "Data Orientation Module", "Desktop Object Mode", "Digital Operations Matrix"], answer: 0 }
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const current = QUIZ[index];

  const handleSelect = (i) => {
    if (answered) return;
    playClickSound();
    setSelected(i);
    setAnswered(true);
    if (i === current.answer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    playClickSound();
    setSelected(null);
    setAnswered(false);
    setIndex((i) => (i + 1) % QUIZ.length);
  };

  return (
    <div className={`max-w-2xl mx-auto p-8 rounded-3xl border space-y-6 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Web Fundamentals Quiz</span>
        <span>Score: {score} / {QUIZ.length}</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {index + 1}. {current.q}
        </h3>

        <div className="space-y-2">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.answer;
            const isChosen = i === selected;
            let btnClass = "bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-500";
            if (answered) {
              if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
              else if (isChosen) btnClass = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {answered && isCorrect && <Check size={16} className="text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className="flex justify-end pt-2">
          <button
            onClick={nextQuestion}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            {index + 1 === QUIZ.length ? "Restart Quiz" : "Next Question"} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
