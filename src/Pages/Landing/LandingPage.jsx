import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  StickyNote,
  FileText,
  PenTool,
  Calculator,
  Ruler,
  FileCheck,
  Code2,
  Sparkles,
  Search,
  ChevronRight,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Heart,
  Globe,
  Menu,
  X,
  Compass
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { ALL_TOOLS, TOOL_HUBS } from "../../data/toolsRegistry";

/**
 * Stiknex Flagship Landing Page
 * 
 * Aesthetic: Inspired by "Circle" (Sandhill Studio / Halo Lab)
 * Colors:
 * - Teal Gradients: #134E5E -> #1D6A7D -> #0F3944
 * - Background Cream / Linen: #FAF7F2 (Dark mode: #0B0F17)
 * - Accent Coral / Peach: #FFA07A / #F8A88C
 * - Surface Cards: #FFFFFF (Dark mode: #131A26)
 * - Borders: #EADFD5 (Dark mode: #1E293B)
 * - Typography: Plus Jakarta Sans geometric display + Playfair serif italic accents
 */

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Initialize Lenis 60fps Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
    ? ALL_TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 12)
    : [];

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-300 ${
      darkMode ? "bg-[#0B0F17] text-[#F1F5F9]" : "bg-[#FAF7F2] text-[#1E293B]"
    }`}>
      
      {/* Dynamic SEO Meta Tags */}
      <PageSEO
        title="Stiknex — Free Online Sticky Notes, Digital Notebook & 200+ Browser Utility Tools"
        description="Fast, 100% free, local-first productivity workspace by Vishal Mall. Infinite sticky notes canvas, distraction-free markdown notepad, whiteboard, and 200+ client-side utility tools — private with zero logins."
        path="/"
        type="website"
      />

      {/* ========================================================
          1. HEADER / NAVIGATION BAR (Circle Style)
          ======================================================== */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all ${
        darkMode ? "bg-[#0B0F17]/90 border-[#1E293B]/70" : "bg-[#FAF7F2]/90 border-[#EADFD5]/70"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo: Stiknex Dotted Symbol */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="grid grid-cols-3 gap-1 w-6 h-6">
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFA07A] scale-125 animate-pulse" />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-teal-400" : "bg-[#134E5E]"}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-[#134E5E]"}`}>
                Stiknex
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Workspace
              </span>
            </div>
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`md:hidden px-6 pb-6 pt-2 border-b overflow-hidden ${
                darkMode ? "bg-[#0B0F17] border-[#1E293B]" : "bg-[#FAF7F2] border-[#EADFD5]"
              }`}
            >
              <div className="flex flex-col gap-3.5 text-sm font-semibold pt-2">
                <Link to="/sticky-notes" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">Sticky Notes Canvas</Link>
                <Link to="/online-notebook" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">Digital Notepad</Link>
                <Link to="/whiteboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">Excalidraw Whiteboard</Link>
                <Link to="/tools" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">200+ Browser Utilities</Link>
                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">Blog</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#FFA07A]">About Stiknex & Vishal Mall</Link>
                <Link
                  to="/sticky-notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D]"
                >
                  Launch Stiknex
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================
          2. HERO SECTION (Circle Style with Stiknex Core)
          ======================================================== */}
      <section className="relative pt-12 md:pt-20 pb-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6"
            >
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
            </motion.div>

            {/* Right Hero Visual Card (Matching Circle Layout with Stiknex Live Preview) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 relative flex justify-center"
            >
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

                {/* Interactive Stiknex Canvas Graphic */}
                <div className="relative z-10 py-6 my-auto space-y-4">
                  
                  {/* Visual Sticky Note 1 */}
                  <div className="p-4 rounded-2xl bg-amber-100/90 text-slate-800 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
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
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. STATS SHELF (Matching Circle's Key Numbers)
          ======================================================== */}
      <section className={`border-y py-12 transition-colors ${
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
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
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
          5. FLAGSHIP WORKSPACE CARDS (3 Cards matching Circle's Grid)
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

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Sticky Notes Canvas */}
            <div className={`rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all flex flex-col group ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="h-48 bg-gradient-to-tr from-[#134E5E] to-[#246A7B] p-6 flex flex-col justify-between text-white relative">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 self-start">
                  Spatial Canvas
                </span>
                <div>
                  <span className="text-xs text-white/80 font-medium">Infinite Board • Mind Mapping</span>
                  <h4 className="text-xl font-bold tracking-tight mt-1 text-white">Sticky Notes Workspace</h4>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Freely position, color-code, and organize thoughts. Drag images, build connection links, and search instantly.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#134E5E] dark:text-teal-400">100% Free</span>
                  <Link
                    to="/sticky-notes"
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 group-hover:bg-[#134E5E] group-hover:text-white transition-colors"
                  >
                    Open Canvas →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Digital Notepad & Code Runner */}
            <div className={`rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all flex flex-col group ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="h-48 bg-gradient-to-tr from-[#0F3944] to-[#134E5E] p-6 flex flex-col justify-between text-white relative">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFA07A]/30 text-[#FFA07A] self-start">
                  Writing &amp; Code
                </span>
                <div>
                  <span className="text-xs text-white/80 font-medium">Markdown • Live Code Runner</span>
                  <h4 className="text-xl font-bold tracking-tight mt-1 text-white">Online Digital Notepad</h4>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Distraction-free Markdown editor with instant HTML/JS/CSS new-tab preview, Zen mode, and auto-saving.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#134E5E] dark:text-teal-400">100% Free</span>
                  <Link
                    to="/online-notebook"
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 group-hover:bg-[#134E5E] group-hover:text-white transition-colors"
                  >
                    Open Notepad →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: 200+ Browser Utilities Directory */}
            <div className={`rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all flex flex-col group ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="h-48 bg-gradient-to-tr from-[#1D6A7D] to-[#2B7D91] p-6 flex flex-col justify-between text-white relative">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 self-start">
                  Client Utilities
                </span>
                <div>
                  <span className="text-xs text-white/80 font-medium">206 Tools • Local Processing</span>
                  <h4 className="text-xl font-bold tracking-tight mt-1 text-white">Browser Utility Hub</h4>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Financial calculators, unit converters, PDF mergers, image compressors, and developer formatters with zero lag.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#134E5E] dark:text-teal-400">100% Free</span>
                  <Link
                    to="/tools"
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 group-hover:bg-[#134E5E] group-hover:text-white transition-colors"
                  >
                    Explore Directory →
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. QUICK TOOL EXPLORER BAR
          ======================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl p-8 border shadow-sm ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                Find Any Tool Instantly
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Search across all 206 client-side tools or filter by category.
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
                      {tool.description || tool.category}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-xs text-slate-400 py-3 text-center">
                  No matching tools found. Explore the full directory below!
                </p>
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
          7. USER REVIEWS / TESTIMONIALS
          ======================================================== */}
      <section id="reviews" className={`py-24 border-t transition-colors ${
        darkMode ? "bg-[#0B0F17] border-slate-800" : "bg-[#FAF7F2] border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${
              darkMode ? "bg-teal-950 text-teal-300" : "bg-[#134E5E]/10 text-[#134E5E]"
            }`}>
              Community Love
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-[#0F3944]"
            }`}>
              What people say about Stiknex
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className={`rounded-3xl p-8 border shadow-sm space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className={`text-sm italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "Having sticky notes, a markdown notebook, and instant calculators all in one tab with zero logins is an absolute productivity lifesaver."
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#134E5E] text-white flex items-center justify-center font-bold text-sm">
                  AR
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#0F3944]"}`}>Aman Rawat</h5>
                  <p className="text-xs text-slate-500">Frontend Developer</p>
                </div>
              </div>
            </div>

            <div className={`rounded-3xl p-8 border shadow-sm space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className={`text-sm italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "The infinite sticky notes canvas feels so natural. I use it every day for sprint planning and mind mapping ideas."
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFA07A] text-[#0F3944] flex items-center justify-center font-bold text-sm">
                  PS
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#0F3944]"}`}>Pooja Sharma</h5>
                  <p className="text-xs text-slate-500">Product Designer</p>
                </div>
              </div>
            </div>

            <div className={`rounded-3xl p-8 border shadow-sm space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className={`text-sm italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "Local-first privacy means my notes never leave my browser. It loads in milliseconds and works completely offline as a PWA."
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1D6A7D] text-white flex items-center justify-center font-bold text-sm">
                  DK
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#0F3944]"}`}>David Keller</h5>
                  <p className="text-xs text-slate-500">Software Architect</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          8. CREATOR & COMMUNITY NEWSLETTER CTA (Matching Circle CTA)
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
          9. FOOTER (Matching Circle's Studio Footer)
          ======================================================== */}
      <footer className={`border-t py-16 transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-[#EADFD5]"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-1 w-6 h-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA07A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#134E5E]" />
                </div>
                <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#134E5E]"}`}>
                  Stiknex
                </span>
              </div>
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
              <Link to="/privacy-policy" className="hover:text-[#134E5E] dark:hover:text-teal-400">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-[#134E5E] dark:hover:text-teal-400">Terms of Service</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
