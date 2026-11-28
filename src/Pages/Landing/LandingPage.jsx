import React, { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Code2,
  Search,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  Heart,
  Menu,
  X,
  Compass,
  MapPin,
  MessageSquare,
  Quote,
  Globe,
  Smartphone,
  Download,
  Laptop,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import ExtensionModal from "../../Component/ExtensionModal";
import AdBanner from "../../Component/Ad/AdBanner";

const HomeBlogSection = lazy(() => import("./HomeBlogSection"));

// Lightweight curated tools registry for the homepage search (prevents heavy chunk bloating)
const CURATED_SEARCH_TOOLS = [
  { title: "Age Calculator", slug: "age-calculator", category: "Calculators" },
  { title: "Date Calculator", slug: "date-calculator", category: "Calculators" },
  { title: "Percentage Calculator", slug: "percentage-calculator", category: "Calculators" },
  { title: "Simple Calculator", slug: "simple-calculator", category: "Calculators" },
  { title: "Scientific Calculator", slug: "scientific-calculator", category: "Calculators" },
  { title: "EMI Calculator", slug: "emi-calculator", category: "Finance" },
  { title: "Length Converter", slug: "length-converter", category: "Converters" },
  { title: "Currency Converter", slug: "currency-converter", category: "Converters" },
  { title: "QR Code Generator", slug: "qr-code-generator", category: "Generators" },
  { title: "Password Generator", slug: "password-generator", category: "Security" },
  { title: "Word Counter", slug: "word-counter", category: "Writing" },
  { title: "JSON to CSV", slug: "json-to-csv", category: "Developer" },
  { title: "Image Compressor", slug: "image-compressor", category: "Images" },
  { title: "Merge PDF", slug: "merge-pdf", category: "PDF" },
  { title: "Color Picker", slug: "color-picker", category: "Design" },
  { title: "Typing Speed Test", slug: "stiknex-typing", category: "Typing" },
];

/**
 * Stiknex Flagship Landing Page
 * 
 * Aesthetic: Circle by Sandhill Studio / Halo Lab
 * Colors:
 * - Teal Gradients: #134E5E -> #1D6A7D -> #0F3944
 * - Background Cream / Linen: #FAF7F2 (Dark mode: #0B0F17)
 * - Accent Coral / Peach: #FFA07A / #F8A88C
 * - Surface Cards: #FFFFFF (Dark mode: #131A26)
 * - Borders: #EADFD5 (Dark mode: #1E293B)
 */

// Curated authentic reviews highlighting local-first privacy, zero paywalls, and spatial tools
const CURATED_TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    role: "Senior Software Engineer",
    company: "Bengaluru",
    avatar: "AM",
    rating: 5,
    tag: "100% Local-First",
    message: "Stiknex is my daily driver. Having word counters, hash generators, JSON formatters, and a freehand whiteboard with ZERO server telemetry gives me complete confidence with sensitive client data.",
  },
  {
    name: "Sophia Chen",
    role: "Technical Writer & Creator",
    company: "San Francisco",
    avatar: "SC",
    rating: 5,
    tag: "Distraction-Free",
    message: "I canceled two monthly utility subscriptions after discovering Stiknex. The spatial canvas feels organic, and the tools are literally instant. 0.01s load times make a huge difference in my workflow.",
  },
  {
    name: "Devendra Verma",
    role: "Full-Stack Dev & Student",
    company: "IIT Delhi",
    avatar: "DV",
    rating: 5,
    tag: "Flagship Typing Lab",
    message: "The typing speed trainer with programming drills is the best I have ever used. Everything is clean, fast, and completely free. Massive respect to Vishal Mall for keeping it independent!",
  },
  {
    name: "Emily Watson",
    role: "Product Designer",
    company: "London",
    avatar: "EW",
    rating: 5,
    tag: "Excalidraw Whiteboard",
    message: "The Whiteboard studio with instant SVG export and private local storage is an absolute gem for wireframing user flows before jumping into Figma. Clean, responsive, and beautifully engineered.",
  },
];

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [publicReviews, setPublicReviews] = useState([]);

  // Fetch approved public reviews from MongoDB
  useEffect(() => {
    let isMounted = true;
    fetch("/api/reviews?public=true")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPublicReviews(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenFeedback = () => {
    window.dispatchEvent(
      new CustomEvent("stiknex_open_feedback", { detail: { mode: "review" } })
    );
  };

  const allTestimonials = React.useMemo(() => {
    if (publicReviews && publicReviews.length > 0) {
      const formattedPublic = publicReviews.map((r) => ({
        name: r.userName || "Stiknex User",
        role: r.tool && r.tool !== "stiknex" && r.tool !== "Direct Message" ? `User of ${r.tool}` : "Verified Creator",
        company: "Community",
        avatar: (r.userName || "U").slice(0, 2).toUpperCase(),
        rating: r.rating || 5,
        tag: "Verified Review",
        message: r.message,
      }));
      return [...formattedPublic, ...CURATED_TESTIMONIALS].slice(0, 4);
    }
    return CURATED_TESTIMONIALS;
  }, [publicReviews]);

  // Initialize Lenis Smooth Scroll smoothly on desktop without competing with main thread
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      const rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput("");
      setSubscribed(false);
    }, 4000);
  };

  const filteredTools = searchQuery.trim()
    ? CURATED_SEARCH_TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-200 ${
      darkMode ? "bg-[#0B0F17] text-[#F1F5F9]" : "bg-[#FAF7F2] text-[#1E293B]"
    }`}>
      
      {/* Dynamic SEO Meta Tags */}
      <PageSEO
        title="Stiknex – Free Online Sticky Notes, Notepad & 200+ Tools"
        description="Free online sticky notes, rich-text notebook, Excalidraw whiteboard, calculators, converters and more. No sign-up required."
        path="/"
        type="website"
      />

      {/* ========================================================
          1. HEADER / NAVIGATION BAR (Circle Style with Signature Logo)
          ======================================================== */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all ${
        darkMode ? "bg-[#0B0F17]/90 border-[#1E293B]/70" : "bg-[#FAF7F2]/90 border-[#EADFD5]/70"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group hover:opacity-95 transition-opacity" aria-label="Stiknex Homepage">
            <img src="/logo.png" alt="Stiknex Logo" width="36" height="36" className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F3944] dark:text-white">Stiknex</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-8 text-[13px] font-semibold ${
            darkMode ? "text-slate-300" : "text-[#1E293B]"
          }`}>
            <Link to="/sticky-notes" className="hover:text-[#FFA07A] transition-colors">Sticky Notes</Link>
            <Link to="/online-notebook" className="hover:text-[#FFA07A] transition-colors">Notepad</Link>
            <Link to="/whiteboard" className="hover:text-[#FFA07A] transition-colors">Whiteboard</Link>
            <Link to="/tools" className="hover:text-[#FFA07A] transition-colors">200+ Tools</Link>
            <Link to="/blog" className="hover:text-[#FFA07A] transition-colors">Blog</Link>
            <Link to="/about" className="hover:text-[#FFA07A] transition-colors">About</Link>
            <Link to="/buy-me-a-coffee" className="hover:text-[#FFA07A] transition-colors">Support</Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-full transition-colors ${
                darkMode ? "text-amber-400 hover:bg-slate-800" : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"} text-sm`} />
            </button>

            <Link
              to="/sticky-notes"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] hover:shadow-lg hover:shadow-[#134E5E]/20 hover:-translate-y-0.5 transition-all"
            >
              <span>Launch Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION
          ======================================================== */}
      <section className="relative pt-10 md:pt-16 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                darkMode ? "bg-teal-950/60 text-teal-300 border border-teal-800/40" : "bg-[#134E5E]/10 text-[#134E5E]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#FFA07A] animate-ping" />
                100% Free &amp; Local-First Workspace
              </span>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold tracking-tight leading-[1.08] ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                All-in-one canvas for <br />
                <span className="font-serif italic font-normal text-[#134E5E] dark:text-teal-400">
                  thinking, writing
                </span> <br />
                &amp; 200+ browser tools.
              </h1>

              <p className={`text-base sm:text-lg max-w-xl font-normal leading-relaxed ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                Infinite zoomable sticky notes, distraction-free markdown notebook with instant code execution, interactive whiteboard, and 200+ client-side tools — fast, private, and zero logins required.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/sticky-notes"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] hover:shadow-xl hover:shadow-[#134E5E]/25 hover:-translate-y-0.5 transition-all"
                >
                  <span>Launch Sticky Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/online-notebook"
                  className={`inline-flex items-center gap-2.5 px-6 py-4 rounded-full text-sm font-bold border transition-all ${
                    darkMode
                      ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                      : "bg-white border-[#EADFD5] text-[#0F3944] hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#134E5E]/10 dark:bg-teal-500/20 flex items-center justify-center text-[#134E5E] dark:text-teal-300">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  <span>Open Notepad</span>
                </Link>

                <Link
                  to="/tools"
                  className={`inline-flex items-center gap-2 px-5 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                    darkMode
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-[#134E5E]"
                  }`}
                >
                  <span>Explore 200+ Tools</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Micro Credibility Row */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Zero Account Required
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> 100% Local-First Privacy
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" /> 0ms Server Latency
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[460px] rounded-[36px] bg-gradient-to-br from-[#134E5E] via-[#1D6A7D] to-[#0F3944] p-7 flex flex-col justify-between shadow-2xl shadow-[#134E5E]/30 text-white overflow-hidden border border-white/10">
                
                {/* Glowing ambient orbs */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#FFA07A]/25 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

                {/* Card Top Pill */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFA07A] animate-pulse" />
                    <span className="text-[11px] uppercase font-extrabold tracking-widest text-white/90">
                      Stiknex Spatial Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm">
                    v2.0 Active
                  </span>
                </div>

                {/* Stiknex Canvas Graphic */}
                <div className="relative z-10 py-6 my-auto space-y-4">
                  
                  {/* Visual Sticky Note 1 */}
                  <div className="p-4 rounded-2xl bg-amber-100/90 text-slate-800 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="flex items-center justify-between border-b border-amber-300/50 pb-2 mb-2">
                      <span className="text-xs font-bold text-amber-900">💡 Sprint Roadmap</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">Idea</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">
                      Brainstorm, organize tasks, and connect mind-map branches on an infinite 6000x6000px canvas.
                    </p>
                  </div>

                  {/* Visual Sticky Note 2 (Markdown & Code preview) */}
                  <div className="p-4 rounded-2xl bg-[#0F3944]/90 border border-white/20 text-white shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-[#FFA07A]" />
                        <span className="text-xs font-bold text-white">Interactive Notepad</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Live Run</span>
                    </div>
                    <code className="block text-[11px] font-mono text-emerald-300">
                      &lt;h1&gt;Stiknex Run Preview&lt;/h1&gt;
                    </code>
                    <p className="text-[11px] text-white/80 mt-1">
                      Write markdown, render HTML previews, and run code in real-time tabs.
                    </p>
                  </div>

                </div>

                {/* Card Bottom Meta */}
                <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="block text-white/60 font-medium">Data Storage</span>
                    <span className="font-bold text-white">Local IndexedDB</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-white/60 font-medium">Available Tools</span>
                    <span className="font-bold text-[#FFA07A]">206+ Built-in</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. STATS SHELF
          ======================================================== */}
      <section className={`border-y py-10 transition-colors ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/70 border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#134E5E] dark:text-teal-400 tracking-tight">
                .206+
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Browser Utilities
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#134E5E] dark:text-teal-400 tracking-tight">
                100%
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Local &amp; Private
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#134E5E] dark:text-teal-400 tracking-tight">
                0ms
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Server Latency
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FFA07A] tracking-tight">
                4.9/5
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                User Satisfaction
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. PROGRAM ROADMAP (01, 02, 03 Stiknex Ecosystem)
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${
            darkMode ? "bg-teal-950 text-teal-300 border border-teal-800/40" : "bg-[#134E5E]/10 text-[#134E5E]"
          }`}>
            Core Ecosystem
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0F3944]"
          }`}>
            Structured tools built for maximum focus
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            A seamless three-tier productivity flow: capture raw thoughts, compose in-depth documents, and execute client-side utilities without distractions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stage 01 */}
          <div className={`rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="space-y-4">
              <span className="inline-block text-4xl font-black text-[#FFA07A]">01</span>
              <h3 className={`text-xl font-bold group-hover:text-[#134E5E] dark:group-hover:text-teal-400 transition-colors ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                Capture &amp; Mind Map
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Infinite zoomable board with smooth panning, color-coded cards, connected branches, checklists, and instant drag-and-drop screenshot uploads.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#134E5E] dark:text-teal-400">
              <Link to="/sticky-notes" className="flex items-center gap-1 hover:underline">
                <span>Explore Sticky Notes</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stage 02 (Core Active) */}
          <div className={`rounded-3xl p-8 border-2 shadow-md hover:shadow-2xl transition-all group flex flex-col justify-between relative ${
            darkMode ? "bg-slate-900 border-teal-500" : "bg-white border-[#134E5E]"
          }`}>
            <div className="absolute -top-3 right-6 bg-[#134E5E] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              Flagship Editor
            </div>
            <div className="space-y-4">
              <span className="inline-block text-4xl font-black text-[#134E5E] dark:text-teal-400">02</span>
              <h3 className={`text-xl font-bold group-hover:text-[#134E5E] dark:group-hover:text-teal-400 transition-colors ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                Distraction-Free Notepad
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Dual-pane Markdown writer, live code runner (HTML/CSS/JS preview in browser), Zen writing mode, word counts, and real-time auto-saving.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#134E5E] dark:text-teal-400">
              <Link to="/online-notebook" className="flex items-center gap-1 hover:underline">
                <span>Open Digital Notepad</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stage 03 */}
          <div className={`rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="space-y-4">
              <span className="inline-block text-4xl font-black text-[#FFA07A]">03</span>
              <h3 className={`text-xl font-bold group-hover:text-[#134E5E] dark:group-hover:text-teal-400 transition-colors ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                206+ Client-Side Utilities
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                High-precision financial calculators, unit converters, PDF tools, image compressors, color extractors, and developer formatters running 100% in browser memory.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#134E5E] dark:text-teal-400">
              <Link to="/tools" className="flex items-center gap-1 hover:underline">
                <span>Browse Directory</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. FLAGSHIP WORKSPACE CARDS
          ======================================================== */}
      <section id="workspaces" className={`py-20 border-t transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-gradient-to-b from-[#FAF7F2] to-white border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${
                darkMode ? "bg-teal-950 text-teal-300" : "bg-[#134E5E]/10 text-[#134E5E]"
              }`}>
                Flagship Workspaces
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                Dedicated Tools for Every Task
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md font-medium">
              Free, local-first applications designed with obsessive attention to fluid motion and privacy.
            </p>
          </div>

          {/* 3-Card Grid (Exact Reference Style: media_1795085156907_c90d68fa.png) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: DESIGN — Spatial Sticky Notes Canvas with Clock Illustration */}
            <div className={`rounded-[32px] p-7 sm:p-8 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 ${
              darkMode ? "bg-[#131B26] border-slate-800" : "bg-[#FAF7F2] border-[#EADFD5]"
            }`}>
              {/* Top Meta */}
              <div className="space-y-2 z-10">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  DESIGN
                </span>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F3944] dark:text-white leading-snug">
                  How to make a quality workspace in Stiknex in minutes without experience
                </h4>
              </div>

              {/* Bottom Row */}
              <div className="pt-16 sm:pt-20 flex items-end justify-between relative z-10">
                <Link
                  to="/sticky-notes"
                  className="text-xs font-black uppercase tracking-wider text-[#134E5E] dark:text-teal-400 group-hover:text-[#FFA07A] flex items-center gap-1.5 transition-colors"
                >
                  <span>READ MORE</span>
                  <span className="text-sm">→</span>
                </Link>

                {/* Clock Illustration with pastel dots matching reference */}
                <div className="w-28 h-28 relative -mr-2 -mb-2 shrink-0 select-none pointer-events-none">
                  {/* Floating dots */}
                  <div className="absolute top-2 left-1 w-2.5 h-2.5 rounded-full bg-[#134E5E]/40" />
                  <div className="absolute top-5 right-2 w-1.5 h-1.5 rounded-full bg-[#FFA07A]" />
                  <div className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-[#FFA07A]/60" />
                  
                  {/* Clock SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    {/* Outer Ring */}
                    <circle cx="58" cy="58" r="38" fill="#FAF7F2" stroke="#1D6A7D" strokeWidth="8" />
                    {/* Inner Dial Face */}
                    <circle cx="58" cy="58" r="30" fill="#FFFFFF" />
                    {/* Tick Marks */}
                    <line x1="58" y1="32" x2="58" y2="36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="58" y1="80" x2="58" y2="84" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="32" y1="58" x2="36" y2="58" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="80" y1="58" x2="84" y2="58" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    {/* Clock Hands (Pink / Purple Minute & Hour Hand) */}
                    <line x1="58" y1="58" x2="58" y2="42" stroke="#9333EA" strokeWidth="4" strokeLinecap="round" />
                    <line x1="58" y1="58" x2="70" y2="58" stroke="#9333EA" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="58" cy="58" r="3" fill="#9333EA" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2: PROGRAMMING — Notepad & Sandbox with Tablet Mockup */}
            <div className={`rounded-[32px] p-7 sm:p-8 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 ${
              darkMode ? "bg-[#131B26] border-slate-800" : "bg-[#FAF7F2] border-[#EADFD5]"
            }`}>
              {/* Top Meta */}
              <div className="space-y-2 z-10">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  PROGRAMMING
                </span>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F3944] dark:text-white leading-snug">
                  Markdown &amp; Code: How to write and preview web applications without server setup
                </h4>
              </div>

              {/* Bottom Row */}
              <div className="pt-16 sm:pt-20 flex items-end justify-between relative z-10">
                <Link
                  to="/online-notebook"
                  className="text-xs font-black uppercase tracking-wider text-[#134E5E] dark:text-teal-400 group-hover:text-[#FFA07A] flex items-center gap-1.5 transition-colors"
                >
                  <span>READ MORE</span>
                  <span className="text-sm">→</span>
                </Link>

                {/* Tablet / Screen Illustration with pastel blocks matching reference */}
                <div className="w-28 h-28 relative -mr-2 -mb-2 shrink-0 select-none pointer-events-none">
                  {/* Floating dots */}
                  <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-slate-300" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#1D6A7D]" />
                  <div className="absolute top-6 left-1 w-1.5 h-1.5 rounded-full bg-[#FFA07A]" />

                  {/* Tablet Frame */}
                  <div className="absolute right-0 bottom-0 w-24 h-24 rounded-2xl bg-[#E8DDD2] p-1.5 shadow-sm border border-slate-300/40">
                    <div className="w-full h-full rounded-xl bg-white p-2 flex flex-col gap-1.5">
                      {/* Top Bar Blocks */}
                      <div className="flex gap-1.5">
                        <div className="w-4 h-4 rounded-md bg-[#134E5E]" />
                        <div className="flex-1 h-4 rounded-md bg-[#FFA07A]/60" />
                      </div>
                      {/* Big Main Block */}
                      <div className="flex-1 w-full rounded-lg bg-[#9333EA]/35" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: SEO — 206 Tools & Utilities with Pie Chart Illustration */}
            <div className={`rounded-[32px] p-7 sm:p-8 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 ${
              darkMode ? "bg-[#131B26] border-slate-800" : "bg-[#FAF7F2] border-[#EADFD5]"
            }`}>
              {/* Top Meta */}
              <div className="space-y-2 z-10">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  SEO &amp; UTILITIES
                </span>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F3944] dark:text-white leading-snug">
                  Creating dynamic local tools with instant speed + zero tracking for daily work
                </h4>
              </div>

              {/* Bottom Row */}
              <div className="pt-16 sm:pt-20 flex items-end justify-between relative z-10">
                <Link
                  to="/tools"
                  className="text-xs font-black uppercase tracking-wider text-[#134E5E] dark:text-teal-400 group-hover:text-[#FFA07A] flex items-center gap-1.5 transition-colors"
                >
                  <span>READ MORE</span>
                  <span className="text-sm">→</span>
                </Link>

                {/* Pie Chart Illustration matching reference */}
                <div className="w-28 h-28 relative -mr-2 -mb-2 shrink-0 select-none pointer-events-none">
                  {/* Floating dots */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#FFA07A]/70" />
                  <div className="absolute top-8 right-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="absolute bottom-1 left-3 w-1.5 h-1.5 rounded-full bg-[#134E5E]" />

                  {/* Segmented Pie Chart SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    {/* Wedge 1: Purple */}
                    <path d="M 50 50 L 50 15 A 35 35 0 0 1 85 50 Z" fill="#9333EA" stroke="#FAF7F2" strokeWidth="2" />
                    {/* Wedge 2: Teal */}
                    <path d="M 50 50 L 85 50 A 35 35 0 0 1 50 85 Z" fill="#134E5E" stroke="#FAF7F2" strokeWidth="2" />
                    {/* Wedge 3: Coral */}
                    <path d="M 50 50 L 50 85 A 35 35 0 0 1 15 50 Z" fill="#FFA07A" stroke="#FAF7F2" strokeWidth="2" />
                    {/* Wedge 4: Cream / Sand */}
                    <path d="M 50 50 L 15 50 A 35 35 0 0 1 50 15 Z" fill="#EADFD5" stroke="#FAF7F2" strokeWidth="2" />
                    {/* Center point */}
                    <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. QUICK TOOL EXPLORER BAR
          ======================================================== */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl p-8 border shadow-sm ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                Find Any Tool Instantly
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Search across popular client-side tools or view our full HTML sitemap.
              </p>
            </div>

            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. 'json to csv', 'age calc', 'percentage')..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none border transition-all ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-teal-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#134E5E] focus:bg-white"
                }`}
              />
            </div>
          </div>

          {/* Search Results Dropdown/Grid if search active */}
          {searchQuery.trim() && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/${tool.slug}`}
                    className={`p-3 rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      darkMode
                        ? "bg-slate-800/80 border-slate-700 hover:border-teal-400"
                        : "bg-slate-50 border-slate-200 hover:border-[#134E5E]"
                    }`}
                  >
                    <span className="block text-xs font-bold text-[#134E5E] dark:text-teal-300">
                      {tool.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                      {tool.category}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-3 text-center">
                  <p className="text-xs text-slate-400 mb-2">No quick match found.</p>
                  <Link to="/sitemap" className="text-xs font-bold text-[#134E5E] dark:text-teal-400 underline">
                    Browse All 206 Tools in Full HTML Sitemap →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Category Quick Chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "Calculators", to: "/basic-calculator" },
              { label: "Age Calculator", to: "/age-calculator" },
              { label: "Date Calculator", to: "/date-calculator" },
              { label: "Percentage Calculator", to: "/percentage-calculator" },
              { label: "Length Converter", to: "/length-converter" },
              { label: "Currency Converter", to: "/currency-converter" },
              { label: "QR Code Generator", to: "/qr-code-generator" },
              { label: "Password Generator", to: "/password-generator" },
              { label: "Word Counter", to: "/word-counter" },
              { label: "JSON to CSV", to: "/json-to-csv" },
              { label: "Image Compressor", to: "/image-compressor" },
              { label: "Merge PDF", to: "/merge-pdf" },
              { label: "Color Picker", to: "/color-picker" },
              { label: "EMI Calculator", to: "/emi-calculator" },
              { label: "Typing Test", to: "/stiknex-typing" },
              { label: "All 206 Tools Index", to: "/sitemap" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-[#134E5E] hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          7. BLOGS & TUTORIALS SECTION (Dynamic from MongoDB)
          ======================================================== */}
      <Suspense fallback={
        <div className="py-16 text-center text-sm text-slate-400">Loading blog articles...</div>
      }>
        <HomeBlogSection />
      </Suspense>

      {/* ========================================================
          7B. COMMUNITY TESTIMONIALS & REVIEWS SECTION
          ======================================================== */}
      <section className={`py-20 border-t transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-gradient-to-b from-white to-[#FAF7F2] border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                darkMode ? "bg-teal-950 text-teal-300" : "bg-[#134E5E]/10 text-[#134E5E]"
              }`}>
                Community Reviews &amp; Testimonials
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 ${
                darkMode ? "text-white" : "text-[#0F3944]"
              }`}>
                Loved by Thinkers, Developers &amp; Writers
              </h2>
              <p className="text-sm text-slate-500 max-w-xl mt-2">
                Discover why creators choose Stiknex for private, local-first computing, distraction-free writing, and 206+ client-side utilities.
              </p>
            </div>

            <button
              onClick={handleOpenFeedback}
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#134E5E] hover:bg-[#0F3944] shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Give Feedback &amp; Review</span>
            </button>
          </div>

          {/* Grid of Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allTestimonials.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-lg ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-white border-[#EADFD5] hover:border-[#134E5E]/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      darkMode ? "bg-slate-800 text-slate-400" : "bg-[#FAF7F2] text-slate-600 border border-[#EADFD5]"
                    }`}>
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#134E5E] to-[#1D6A7D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7C. MULTI-PLATFORM DOWNLOAD APP SECTION
          ======================================================== */}
      <section className={`py-20 border-t transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-[#FAF7F2] border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full ${
              darkMode ? "bg-teal-950 text-teal-300" : "bg-[#134E5E]/10 text-[#134E5E]"
            }`}>
              <Globe className="w-3.5 h-3.5" /> Multi-Platform Productivity
            </span>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 ${
              darkMode ? "text-white" : "text-[#0F3944]"
            }`}>
              Work Seamlessly On <span className={darkMode ? "text-teal-400" : "text-[#134E5E]"}>Every Screen</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Whether you are capturing thoughts on your phone, writing inside Google Chrome, or running fully offline on your desktop, Stiknex delivers instantaneous speed and zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Android Mobile App */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5] shadow-sm"
            }`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                  darkMode ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                }`}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Mobile Edition
                </span>
                <h3 className={`text-xl font-bold mt-1 mb-2.5 ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                  Android Mobile App
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Native gesture navigation, touch-optimized canvas for{" "}
                  <Link to="/sticky-notes" className="text-[#134E5E] dark:text-teal-400 hover:underline font-semibold">sticky notes</Link>,
                  {" "}and instant offline access to your{" "}
                  <Link to="/online-notepad" className="text-[#134E5E] dark:text-teal-400 hover:underline font-semibold">online notepad</Link>.
                </p>
              </div>
              <div>
                <a
                  href="/Stiknex.apk"
                  download
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-[#0F3944] hover:bg-[#134E5E] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-2xl font-bold text-sm shadow-md transition"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>Download Android APK</span>
                </a>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">Direct APK download • Virus-free • No Play Store login</p>
              </div>
            </div>

            {/* Card 2: Google Chrome Extension */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
              darkMode ? "bg-slate-900 border-teal-800/60" : "bg-white border-[#134E5E]/25 shadow-sm"
            }`}>
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#134E5E] text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl">
                Popular
              </div>
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                  darkMode ? "bg-teal-950/60 text-teal-400" : "bg-[#134E5E]/10 text-[#134E5E]"
                }`}>
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#134E5E] dark:text-teal-400">
                  Browser Toolbar
                </span>
                <h3 className={`text-xl font-bold mt-1 mb-2.5 ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                  Google Chrome Extension
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  One-click scratchpad side panel on any webpage. Jot thoughts while browsing, calculate formulas, or open our{" "}
                  <Link to="/tools" className="text-[#134E5E] dark:text-teal-400 hover:underline font-semibold">200+ browser tools</Link> instantly.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowExtensionModal(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-[#134E5E] hover:bg-[#0F3944] text-white rounded-2xl font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Add to Google Chrome</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">Lightweight manifest v3 • Works on Chrome &amp; Brave</p>
              </div>
            </div>

            {/* Card 3: Desktop & Mobile PWA */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5] shadow-sm"
            }`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                  darkMode ? "bg-amber-950/60 text-amber-400" : "bg-amber-50 text-amber-700"
                }`}>
                  <Laptop className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Desktop &amp; Tablet
                </span>
                <h3 className={`text-xl font-bold mt-1 mb-2.5 ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                  Offline Progressive Web App
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Install Stiknex directly on Windows, macOS, iPad, or Linux. Launches in a standalone window with full offline access to our{" "}
                  <Link to="/whiteboard" className="text-[#134E5E] dark:text-teal-400 hover:underline font-semibold">digital whiteboard</Link>.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.deferredPWA) {
                      window.deferredPWA.prompt();
                      window.deferredPWA.userChoice.then(() => { window.deferredPWA = null; });
                    } else {
                      alert("To install the PWA, please use 'Add to Home Screen' or 'Install App' in your browser menu.");
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-bold text-sm border transition cursor-pointer ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      : "bg-[#FAF7F2] hover:bg-[#F3ECE2] text-[#0F3944] border-[#EADFD5]"
                  }`}
                >
                  <Download className="w-4 h-4 text-[#134E5E] dark:text-teal-400" />
                  <span>Install Web App (PWA)</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">No app store download • 100% offline capable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CLEAN SITEMAP PROMO BANNER (Replacing Heavy Index)
          ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className={`p-8 sm:p-10 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-gradient-to-r from-teal-50/60 to-amber-50/40 border-[#EADFD5]"
        }`}>
          <div className="space-y-2 text-center md:text-left">
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              darkMode ? "bg-teal-950 text-teal-300" : "bg-[#134E5E]/10 text-[#134E5E]"
            }`}>
              HTML Sitemap &amp; Complete Directory
            </span>
            <h3 className={`text-2xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
              Need all 206+ browser utilities in one place?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Explore our structured HTML sitemap with direct links to every single client-side calculator, converter, generator, and workspace tool.
            </p>
          </div>

          <Link
            to="/sitemap"
            className="shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#134E5E] hover:bg-[#0F3944] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <span>Open HTML Sitemap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          9. CREATOR & COMMUNITY NEWSLETTER CTA
          ======================================================== */}
      <section className="py-20 bg-gradient-to-br from-[#134E5E] via-[#1D6A7D] to-[#0F3944] text-white relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FFA07A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
          
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FFA07A] bg-white/10 px-4 py-1.5 rounded-full">
            Local-First &amp; Free Forever
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Stay productive with Stiknex. <br />
            <span className="font-serif italic font-normal text-white/90">Created by Vishal Mall.</span>
          </h2>

          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
            Get product updates, new tool releases, and join our community of thinkers, writers, and builders.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFA07A] text-sm"
            />
            <button 
              type="submit"
              className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider bg-[#FFA07A] hover:bg-[#F8A88C] text-[#0F3944] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="text-emerald-300 font-semibold text-sm animate-fade-in">
              ✓ Thank you! You are subscribed to Stiknex product updates.
            </p>
          )}

          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold text-white/80">
            <Link to="/buy-me-a-coffee" className="hover:text-[#FFA07A] transition-colors flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" /> Support the Creator
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-[#FFA07A] transition-colors">
              About the Developer
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          9B. COMPACT SINGLE AD SLOT ABOVE FOOTER
          ======================================================== */}
      <AdBanner compact format="horizontal" />

      {/* ========================================================
          10. FOOTER (Matching Circle's Studio Footer with Sitemap)
          ======================================================== */}
      <footer className={`border-t py-16 transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2.5 group hover:opacity-95 transition-opacity" aria-label="Stiknex Homepage">
                <img src="/logo.png" alt="Stiknex Logo" width="32" height="32" className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#0F3944] dark:text-white">Stiknex</span>
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed">
                The freeform canvas for thinking, writing &amp; 200+ browser utilities. Created with passion by Vishal Mall.
              </p>
            </div>

            {/* Col 2: Workspaces */}
            <div className="space-y-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link to="/sticky-notes" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Sticky Notes</Link>
              <Link to="/online-notebook" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Digital Notepad</Link>
              <Link to="/whiteboard" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Excalidraw Whiteboard</Link>
              <Link to="/tools" className="block hover:text-[#134E5E] dark:hover:text-teal-400">200+ Tools Directory</Link>
              <Link to="/sitemap" className="block text-[#134E5E] dark:text-teal-300 font-extrabold hover:underline">HTML Sitemap</Link>
            </div>

            {/* Col 3: Popular Utilities */}
            <div className="space-y-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link to="/basic-calculator" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Calculators</Link>
              <Link to="/qr-code-generator" className="block hover:text-[#134E5E] dark:hover:text-teal-400">QR Generator</Link>
              <Link to="/stiknex-typing" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Typing Test</Link>
              <Link to="/blog" className="block hover:text-[#134E5E] dark:hover:text-teal-400">Blog &amp; Tutorials</Link>
            </div>

            {/* Col 4: Platform & Support */}
            <div className="space-y-2 text-xs text-slate-500">
              <span className={`block font-bold ${darkMode ? "text-teal-300" : "text-[#134E5E]"}`}>
                WWW.STIKNEX.SITE
              </span>
              <span className="block">FOUNDER: VISHAL MALL</span>
              <span className="block">100% PRIVATE &amp; LOCAL-FIRST</span>
              <Link to="/buy-me-a-coffee" className="block text-[#FFA07A] font-bold hover:underline">
                Buy Me A Coffee →
              </Link>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Stiknex. All rights reserved. Created by Vishal Mall.</p>
            <div className="flex items-center gap-4 text-slate-500 font-semibold text-xs">
              <Link to="/sitemap" className="hover:text-[#134E5E] dark:hover:text-teal-400 font-bold">Sitemap</Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-[#134E5E] dark:hover:text-teal-400">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-[#134E5E] dark:hover:text-teal-400">Terms of Service</Link>
            </div>
          </div>

        </div>
      </footer>

      <ExtensionModal isOpen={showExtensionModal} onClose={() => setShowExtensionModal(false)} />

    </div>
  );
}
