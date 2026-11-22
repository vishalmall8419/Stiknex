import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  Database,
  CheckCircle2,
  Lock,
  Cpu,
  Heart,
  BookOpen,
  Search,
  PenTool,
  Wrench,
  Globe,
  SlidersHorizontal,
  Compass,
  FileText,
  Boxes,
  HelpCircle,
  Info,
  Layout,
  StickyNote,
  Palette,
  Music,
  Timer,
  Volume2,
  Maximize2,
  FileCode,
  CheckSquare,
  Share2,
  Download,
  RefreshCw,
  ZoomIn,
  Eye,
  AlertTriangle,
  Play,
  RotateCcw,
  Table,
  Image,
  AlignLeft,
  Square,
  Circle,
  MousePointer,
  Type,
  Eraser,
  Move,
  Minimize2,
  QrCode,
  History,
  Check,
  Wand2,
  Clock,
  VolumeX,
  Smartphone,
  Laptop,
  Radio,
  Wifi,
  WifiOff,
  CloudLightning
} from "lucide-react";
import { TOOL_HUBS, ALL_TOOLS } from "../../data/toolsRegistry";

export default function About() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // Initialize smooth scrolling with Lenis & handle hash anchor navigation
  useEffect(() => {
    let lenisInstance = null;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      const rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenisInstance.destroy();
      };
    }
  }, []);

  // Handle URL Hash navigation (e.g., /about#notepad, /about#sticky-notes, /about#whiteboard)
  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    }
  }, [location.hash]);

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="About Stiknex — Comprehensive Platform Manifesto & Architecture"
        description="Discover the complete architecture, features, and privacy principles of Stiknex. Founded by Vishal Mall as a free, local-first productivity workspace."
        path="/about"
        type="website"
      />

      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F17] text-[#1E293B] dark:text-[#F1F5F9] font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-200">
        
        {/* ========================================================
            1. HERO SECTION (Circle Sandhill Studio Aesthetic)
            ======================================================== */}
        <section className="relative pt-24 pb-20 px-6 border-b border-[#EADFD5] dark:border-slate-800 bg-gradient-to-b from-white/70 via-transparent to-transparent dark:from-slate-900/40">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} className="text-[#FFA07A]" />
              Platform Manifesto &amp; Architecture
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F3944] dark:text-white tracking-tight leading-[1.1]">
              The Story &amp; Architecture of <span className="text-[#134E5E] dark:text-teal-400">Stiknex</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Founded by software engineer <strong>Vishal Mall</strong>, Stiknex is a fast, 100% free, local-first productivity ecosystem. Featuring infinite sticky notes, distraction-free markdown notepad, whiteboard, and 206 client-side browser utilities — private in your browser with zero logins.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#realtime-sync"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:shadow-xl hover:shadow-teal-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                <span>Phone ⇄ Laptop Sync ↓</span>
              </a>

              <a
                href="#notepad"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] hover:shadow-xl hover:shadow-[#134E5E]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <BookOpen size={14} />
                <span>Notepad &amp; Code Editor ↓</span>
              </a>

              <a
                href="#sticky-notes"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <StickyNote size={14} />
                <span>Sticky Notes Guide ↓</span>
              </a>

              <a
                href="#whiteboard"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <PenTool size={14} />
                <span>Whiteboard Guide ↓</span>
              </a>

              <a
                href="#why-use-stiknex"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#0F3944] dark:text-teal-300 bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 hover:border-[#134E5E] hover:shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles size={14} className="text-[#FFA07A]" />
                <span>Why Use Stiknex? ↓</span>
              </a>

              <Link
                to="/about/tool-details"
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#0F3944] dark:text-teal-300 bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 hover:border-[#134E5E] hover:shadow-md transition-all flex items-center gap-2"
              >
                <Boxes size={14} className="text-[#FFA07A]" />
                <span>Explore 206 Tool Specs →</span>
              </Link>
            </div>

            {/* Quick Facts Pills */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">206+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Browser Utilities</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">0</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logins Required</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">100%</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local &amp; Offline PWA</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">$0</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Non-Commercial</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            2. BRAND ENTITY & DISAMBIGUATION
            ======================================================== */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="rounded-[32px] p-8 sm:p-12 bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F3944] dark:text-white tracking-tight">
                What is Stiknex &amp; How is it Pronounced?
              </h2>
            </div>

            <div className="space-y-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Stiknex</strong> (pronounced <em>Stick-Nex</em>, phonetic: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm text-[#134E5E] dark:text-teal-300">/ˈstɪk.nɛks/</code>) fuses two core concepts:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base">
                <li><strong>"Sticky Notes"</strong>: The intuitive physical metaphor of jotting thoughts, ideas, and reminders on tactile paper.</li>
                <li><strong>"Next-Generation Canvas"</strong>: Expanding beyond physical paper into infinite zoomable space, interconnected mind-mapping, markdown notebooks, and instant mathematical tools.</li>
              </ul>
              
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <strong>Legal &amp; Brand Disambiguation:</strong> Stiknex is an independent, non-commercial software project engineered by Vishal Mall. It is strictly a productivity software application and browser utility suite. Stiknex has <strong>no affiliation, association, or corporate relationship</strong> with commercial financial services, brokers, or commodities trading firms such as StoneX Group Inc.
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            2.5. REAL-TIME CROSS-DEVICE SYNC: PHONE & LAPTOP ARCHITECTURE
            ======================================================== */}
        <section id="realtime-sync" className="py-16 px-6 max-w-6xl mx-auto scroll-mt-24 border-t border-[#EADFD5] dark:border-slate-800">
          <div className="rounded-[36px] p-8 sm:p-12 bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm relative overflow-hidden space-y-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header */}
            <div className="space-y-4 max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-black uppercase tracking-widest border border-teal-200 dark:border-teal-800/40">
                <RefreshCw size={14} className="animate-spin-slow" />
                Cross-Device Mesh &amp; Cloud Write-Behind Sync
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white tracking-tight leading-[1.15]">
                How Real-Time Sync Works: Phone ⇄ Laptop in Perfect Harmony
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Ever wondered how you can jot down notes or brainstorm code on your laptop, and immediately see it live on your smartphone without creating an account or paying for cloud databases? Here is the deep engineering architecture behind Stiknex&apos;s sub-20ms, Instagram-style write-behind sync engine.
              </p>
            </div>

            {/* 4 Architectural Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Pillar 1: Local-First Speed */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-slate-800/50 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center font-black">
                  <Zap size={20} />
                </div>
                <h3 className="text-base font-bold text-[#0F3944] dark:text-white">
                  1. Local-First (&lt; 1ms Speed)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every keystroke writes instantly to your browser&apos;s local memory (IndexedDB &amp; LocalStorage). You get a native 120 FPS desktop feel with zero input lag because the UI never waits for remote servers to acknowledge your typing.
                </p>
              </div>

              {/* Pillar 2: Multi-Tab Mesh */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-slate-800/50 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300 flex items-center justify-center font-black">
                  <Layers size={20} />
                </div>
                <h3 className="text-base font-bold text-[#0F3944] dark:text-white">
                  2. Same-Device Multi-Tab Mesh
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Using the browser&apos;s native <code className="text-xs font-mono">BroadcastChannel API</code>, opening Stiknex across multiple windows or tabs on the same laptop or phone updates all tabs simultaneously in 0ms without consuming any network bandwidth.
                </p>
              </div>

              {/* Pillar 3: Zero-Login QR Pairing */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-slate-800/50 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300 flex items-center justify-center font-black">
                  <QrCode size={20} />
                </div>
                <h3 className="text-base font-bold text-[#0F3944] dark:text-white">
                  3. 2-Second QR Mobile Pairing
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-xs font-mono shadow-sm">Alt+Y</kbd> on your laptop to generate an encrypted pairing QR code. Scan it with your phone camera or enter the 6-digit PIN. No email, password, or verification required!
                </p>
              </div>

              {/* Pillar 4: Instagram-Style Write-Behind Caching */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-slate-800/50 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black">
                  <CloudLightning size={20} />
                </div>
                <h3 className="text-base font-bold text-[#0F3944] dark:text-white">
                  4. Write-Behind Cloud Caching
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Just like Instagram saves likes locally and flushes to the server asynchronously, Stiknex holds edits in fast cache and syncs to MongoDB on idle debounce (6–7s). On tab close, an emergency Beacon fires so you never lose a character while saving 95% server costs.
                </p>
              </div>

            </div>

            {/* Step-by-Step Flowchart / Visual Progression */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                    Step-by-Step Lifecycle
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold">
                    What Happens Behind the Scenes When You Type on Phone or Laptop
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>Continuous 0-Lag Processing</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-300 uppercase px-2.5 py-1 rounded bg-teal-950/80 border border-teal-800/60">
                      Step 01
                    </span>
                    <Smartphone size={18} className="text-slate-400" />
                  </div>
                  <h5 className="font-bold text-sm text-white">Instant Local Save (0ms)</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    User inputs a word, checkmarks a to-do, or formats code. Content is instantly mirrored to IndexedDB on the device. Even if your browser crashes right now, your content is 100% safe.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/60">
                      Step 02
                    </span>
                    <Radio size={18} className="text-slate-400" />
                  </div>
                  <h5 className="font-bold text-sm text-white">Local Mesh &amp; Debounce (6s)</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    BroadcastChannel immediately updates all other open tabs on your machine. Meanwhile, an intelligent debounce timer waits for 6–7s of idle typing before packaging a compact delta for cloud sync.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800/60">
                      Step 03
                    </span>
                    <Laptop size={18} className="text-slate-400" />
                  </div>
                  <h5 className="font-bold text-sm text-white">Cloud Write-Behind &amp; Beacon Flush</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The delta syncs to MongoDB in the background. If you close your browser tab or switch away on mobile, <code className="text-[11px] font-mono text-teal-300">pagehide</code> and <code className="text-[11px] font-mono text-teal-300">sendBeacon</code> immediately push pending changes before the page unloads.
                  </p>
                </div>

              </div>

              {/* Offline Resiliency Callout */}
              <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-teal-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-900/80 text-teal-300 flex items-center justify-center shrink-0">
                    <WifiOff size={16} />
                  </div>
                  <div>
                    <strong className="text-white block">Offline Mode Guarantee:</strong>
                    Flying on an airplane or caught in a subway tunnel with no network? You can keep writing, coding, and sketching with zero disruption. All changes queue locally and auto-sync when Wi-Fi returns.
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Wifi size={14} className="text-emerald-400" />
                  <span className="font-bold text-emerald-300">Zero Data Loss</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            3. IN-DEPTH ARCHITECTURE OF THE CORE CREATIVE ENGINES
            ======================================================== */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[#EADFD5] dark:border-slate-800">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#134E5E] dark:text-teal-400">
              Deep Engineering Breakdown
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white tracking-tight">
              The 3 Core Flagship Engines
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Why we engineered Notepad, Sticky Notes, and Whiteboard — what each tool can do, how they work, the common industry frustrations they solve, and an exhaustive guide to every single button, menu, and shortcut.
            </p>
          </div>

          <div className="space-y-24">
            
            {/* ========================================================
                TOOL 1: STIKNEX NOTEPAD (SMART NOTEBOOK)
                ======================================================== */}
            <div id="notepad" className="scroll-mt-28 space-y-10">
              
              {/* Header Box */}
              <div className="p-8 sm:p-12 rounded-[36px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 flex items-center gap-2">
                      <BookOpen size={14} />
                      Engine 01 · Smart Writing &amp; Code Execution
                    </span>
                    <Link
                      to="/online-notebook"
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#134E5E] hover:bg-[#0F3944] transition-all flex items-center gap-2 shadow-sm"
                    >
                      <span>Open Stiknex Notepad</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-[#0F3944] dark:text-white tracking-tight">
                    Stiknex Notepad &amp; Code Editor — Hybrid Paper Notes &amp; In-Browser IDE
                  </h3>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    Stiknex Notepad is a revolutionary <strong>dual-engine productivity studio</strong>: it is not just a digital notepad, but also a professional <strong>in-browser Code Editor &amp; IDE</strong> powered by the Microsoft Monaco core. Seamlessly switch between tactile lined paper notes and a full-featured code editor with HTML/CSS/JS/Python/SQL support, live compilation, automatic code formatting (<kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">Alt+Shift+F</kbd>), digital ink drawing, ambient study audio, and instant cross-device sync.
                  </p>

                  {/* Why & How It Works (Kaise aur Kyu) */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800/60 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#134E5E] dark:text-teal-400 flex items-center gap-2">
                      <Zap size={14} />
                      Why &amp; How It Works (Kaise Aur Kyu)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Problem With Traditional Note Apps:</strong> Typical note apps (Notion, Google Docs, Apple Notes) make you choose between rigid text documents or plain text files. They cannot execute code, crash when offline, demand mandatory accounts, and take 5–10 seconds to open. Meanwhile, developer IDEs (VS Code, WebStorm) are heavy desktop applications with gigabytes of dependencies that don&apos;t run instantly in a mobile browser.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Stiknex Dual-Engine Solution:</strong> Stiknex provides a zero-lag hybrid workspace. Click <strong>&quot;Code Editor&quot;</strong> to activate the Monaco editor with syntax highlighting for HTML, JS, Python, and SQL with 1-click sandbox execution. Click <strong>&quot;Paper Notes&quot;</strong> to return to distraction-free ruled paper with rich formatting. All data persists instantly into browser IndexedDB (<code className="text-xs font-mono">&lt; 1ms</code>) and syncs across phone and laptop via our intelligent write-behind cache.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Can Be Done (Kya Kya Ho Sakta Hai) - 12 Feature Cards */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#134E5E] dark:text-teal-400" />
                  <span>Complete Stiknex Notepad &amp; Code Editor Capabilities &amp; Workflows</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Stiknex Code Editor / Monaco IDE */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Code2 size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Stiknex Code Editor (Monaco IDE)</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Built on the same engine powering VS Code. Full multi-language syntax highlighting for HTML5, CSS3, JavaScript, TypeScript, Python, SQL, Markdown, and JSON with line numbers and error diagnostics.
                    </p>
                  </div>

                  {/* Card 2: Live Code Execution */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FileCode size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Live Sandbox Code Execution</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Write or paste HTML, CSS, and JS code. Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd> to compile and execute your page in a live isolated tab with interactive developer console.
                    </p>
                  </div>

                  {/* Card 3: Code Beautifier */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Wand2 size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Alt+Shift+F Smart Beautifier</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Instant clean 2-space indentation for messy HTML, nested <code className="text-[11px]">&lt;style&gt;</code> CSS rules, and JavaScript functions with a single keystroke.
                    </p>
                  </div>

                  {/* Card 4: Tactile Paper Mode */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <BookOpen size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Tactile Paper Textures</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Switch between Ruled/Lined notebook paper, Dotted bullet journal paper, Engineering Grid/Graph paper, or Clean Plain Blank paper with smooth responsive line-height alignment.
                    </p>
                  </div>

                  {/* Card 5: Digital Ink Drawing Layer */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <PenTool size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Digital Ink Drawing Layer</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Switch to Pen Mode to draw freehand sketches, sign documents, annotate notes, or draw diagrams with custom colors and brush thickness directly over your writing.
                    </p>
                  </div>

                  {/* Card 6: Ambient Focus Audio */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Music size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Ambient Focus Audio</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Built-in ambient sound player featuring Rain, Lo-Fi beats, White Noise, and Relaxing Waves to eliminate outside distractions while studying or writing.
                    </p>
                  </div>

                  {/* Card 7: Pomodoro Sprint Timer */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <Clock size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Pomodoro Sprint Timer</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Track focused writing sessions with an integrated stopwatch and countdown timer with pause, reset, and millisecond precision.
                    </p>
                  </div>

                  {/* Card 8: Read Aloud TTS */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Volume2 size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Read Aloud (TTS Voice)</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Proofread essays, articles, and documentation by having the browser's native speech synthesis read your notes out loud with natural voice.
                    </p>
                  </div>

                  {/* Card 9: Phone ⇄ Laptop QR Sync */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <QrCode size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">QR Code Mobile Pairing</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Pair your laptop with your phone via encrypted QR code or 6-digit session pin. Edits sync in real-time between devices without cloud accounts.
                    </p>
                  </div>

                  {/* Card 10: Point-in-Time Snapshots */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <History size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Point-In-Time Snapshots</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Take manual version snapshots (<kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Ctrl+Shift+H</kbd>) to preserve major draft milestones and restore previous states with zero risk.
                    </p>
                  </div>

                  {/* Card 11: Multi-Format Document Export */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <Download size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Multi-Format Instant Export</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Export your notes with 100% fidelity to PDF, Markdown (.md), clean HTML (.html), or raw plain text (.txt). Print directly to physical paper with clean margin formatting.
                    </p>
                  </div>

                  {/* Card 12: Interactive Checklists & Tables */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <CheckSquare size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Checklists &amp; Nested Tables</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Create interactive to-do lists with checkbox progress tracking, and insert responsive nested tables with dynamic row and column management for structured data.
                    </p>
                  </div>

                </div>
              </div>

              {/* Common Issues in Other Note Apps vs Stiknex Fixes */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  <span>Common Everyday Issues in Online Editors &amp; How Stiknex Fixes Them</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[11px] font-black">
                        <th className="py-3 px-4">Problem in Other Tools (Normally Issue Kya Hota Hai)</th>
                        <th className="py-3 px-4">The Stiknex Architectural Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Accidental data loss if internet disconnects or tab closes
                        </td>
                        <td className="py-3 px-4">
                          Instant 350ms debounced IndexedDB persistence + dual LocalStorage fallback + multi-step Undo/Redo stack + manual version snapshots.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Ugly broken image placeholders <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">[x]</code> after pasting web HTML
                        </td>
                        <td className="py-3 px-4">
                          Automatic broken image sanitization: Stiknex captures image load failures, strips invalid URLs (like unsplash homepages), and purges them permanently from storage.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Pasting from Excel or Word brings messy styling and broken borders
                        </td>
                        <td className="py-3 px-4">
                          Dedicated clipboard pipeline (<code>notebookClipboard.js</code>) strips proprietary Microsoft Office markup, converts PT units to PX, and preserves clean tables.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Heavy 10-second boot-up times &amp; mandatory email registrations
                        </td>
                        <td className="py-3 px-4">
                          Zero account walls, zero logins, loads in &lt; 500ms directly in browser memory, and runs completely offline with Service Worker caching.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Inability to test or run code snippets inside notes
                        </td>
                        <td className="py-3 px-4">
                          Integrated client-side HTML/CSS/JS sandbox runner (<kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd>) and Alt+Shift+F code beautifier.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Complete Options & Toolbar Breakdown */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-[#EADFD5] dark:border-slate-800 space-y-6">
                <h4 className="text-base sm:text-lg font-black text-[#0F3944] dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#134E5E] dark:text-teal-400" />
                  <span>Complete Stiknex Notepad Options &amp; Buttons Directory</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                  
                  {/* Left Column: Topbar & Ribbon */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-[#134E5E] dark:text-teal-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      1. Top Ribbon &amp; Navigation Controls
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>Notebook Drawer:</strong> Create new notebook, switch between active notebooks, search notes, rename, or delete notes.</li>
                      <li>• <strong>Sync Status &amp; QR Modal (<kbd className="font-mono text-[11px]">Alt+Y</kbd>):</strong> Real-time status (Synced, Syncing, Offline); opens encrypted QR code for live mobile pairing.</li>
                      <li>• <strong>Snapshot Manager (<kbd className="font-mono text-[11px]">Ctrl+Shift+H</kbd>):</strong> Capture milestone snapshots, preview previous drafts, and restore with one click.</li>
                      <li>• <strong>Focus Audio Player (<kbd className="font-mono text-[11px]">Ctrl+Shift+M</kbd>):</strong> Toggle ambient study sounds (Rain, Lofi, White Noise, Ocean).</li>
                      <li>• <strong>Stopwatch Timer (<kbd className="font-mono text-[11px]">Ctrl+Shift+T</kbd>):</strong> Start/pause/reset productivity sprint timer.</li>
                      <li>• <strong>Read Aloud TTS (<kbd className="font-mono text-[11px]">Ctrl+Shift+R</kbd>):</strong> Natural speech synthesis voice reads the document out loud.</li>
                      <li>• <strong>Quick Search (<kbd className="font-mono text-[11px]">Ctrl+F</kbd>):</strong> Instant text highlighting and occurrence counter navigation.</li>
                      <li>• <strong>Zen Mode (<kbd className="font-mono text-[11px]">Ctrl+.</kbd>):</strong> Strips all menus, toolbars, and borders for distraction-free writing.</li>
                      <li>• <strong>Settings Panel (<kbd className="font-mono text-[11px]">Ctrl+,</kbd>):</strong> Customize font size, line spacing, word wrap, and paper textures.</li>
                    </ul>
                  </div>

                  {/* Right Column: Formatting Toolbar & Menus */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-[#134E5E] dark:text-teal-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      2. Formatting Toolbar, Context Menu &amp; Runner
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>Typography &amp; Fonts:</strong> 8 curated styles: Inter, Playfair, Caveat, Roboto, JetBrains Mono, Oswald, Courier, OpenDyslexic.</li>
                      <li>• <strong>Heading Formats:</strong> Normal Paragraph, Heading 1 (<kbd className="font-mono text-[11px]">H1</kbd>), Heading 2, Heading 3, Blockquote, Code Block.</li>
                      <li>• <strong>Text Styles:</strong> Bold (<kbd className="font-mono text-[11px]">Ctrl+B</kbd>), Italic (<kbd className="font-mono text-[11px]">Ctrl+I</kbd>), Underline (<kbd className="font-mono text-[11px]">Ctrl+U</kbd>), Strikethrough, Superscript (<code className="text-[11px]">X²</code>), Subscript (<code className="text-[11px]">X₂</code>), Color Picker, Text Highlight.</li>
                      <li>• <strong>Lists &amp; Checklists:</strong> Bulleted list (<code className="text-[11px]">- </code> + Space), Numbered list (<code className="text-[11px]">1. </code> + Space), Interactive To-Do Checklists (<code className="text-[11px]">[] </code> + Space).</li>
                      <li>• <strong>Rich Tables:</strong> Insert table, Add row above/below, Add column left/right, Delete row/col, Delete table.</li>
                      <li>• <strong>Run Code Button:</strong> Automatically appears when code is present; compiles and runs HTML/CSS/JS in a dedicated preview tab (<kbd className="font-mono text-[11px]">Ctrl+Enter</kbd>).</li>
                      <li>• <strong>Format Code Button:</strong> Automatically beautifies raw code with clean 2-space indentation (<kbd className="font-mono text-[11px]">Alt+Shift+F</kbd>).</li>
                      <li>• <strong>Paper Styles:</strong> Dotted, Ruled/Lined, Engineering Grid/Graph, and Plain Blank paper textures.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

            {/* ========================================================
                TOOL 2: STIKNEX STICKY NOTES (SPATIAL CANVAS)
                ======================================================== */}
            <div id="sticky-notes" className="scroll-mt-28 space-y-10 border-t border-[#EADFD5] dark:border-slate-800 pt-16">
              
              {/* Header Box */}
              <div className="p-8 sm:p-12 rounded-[36px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2">
                      <StickyNote size={14} />
                      Engine 02 · Spatial Thought Workspace &amp; Mind Mapping
                    </span>
                    <Link
                      to="/sticky-notes"
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <span>Open Sticky Notes Canvas</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-[#0F3944] dark:text-white tracking-tight">
                    Stiknex Sticky Notes — 2D Infinite Spatial Canvas
                  </h3>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    Stiknex Sticky Notes breaks free from rigid vertical document files and puts your thoughts onto an infinite 2D plane. Position notes anywhere, draw connecting arrows to build visual mental models, switch dynamically between <strong>Canvas</strong>, <strong>Grid</strong>, <strong>Mind Map</strong>, and <strong>Timeline</strong> views, tag and color-code ideas, attach images, and export clean JSON backups with complete offline sovereignty.
                  </p>

                  {/* Why & How It Works (Kaise aur Kyu) */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800/60 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <Zap size={14} />
                      Why &amp; How It Works (Kaise Aur Kyu)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Problem With Linear Note-Taking:</strong> Human memory is deeply spatial. When brainstorming a startup idea, designing a system, or planning a project, your thoughts are not sequential bullet points — they are clusters of interconnected concepts. Physical post-it notes on office walls work well, but they run out of space, fall off, cannot be searched, and cannot be shared digitally.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Stiknex Solution:</strong> Engineered with high-performance 2D matrix transformation viewport physics, <code>react-draggable</code>, and <code>react-xarrows</code> vector routing. Every note coordinate, connecting line, tag, color, and checklist state is stored in your device's IndexedDB. You can pan infinitely, zoom from bird's-eye macro to micro card details, and re-arrange ideas at 60fps with zero subscription fees.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Can Be Done (Kya Kya Ho Sakta Hai) - 9 Feature Cards */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-amber-600" />
                  <span>Complete Stiknex Sticky Notes Capabilities &amp; Workflows</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Move size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Freeform 2D Canvas Dragging</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Position cards freely across infinite 2D space. Group related thoughts into physical clusters, create sprint backlog columns, or scatter brainstormed concepts.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <ArrowRight size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Connecting Vector Arrows</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Drag connector handles between any two notes to draw dynamic vector arrows. Arrows automatically stretch, bend, and route as you move cards around.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Layout size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">4 Dynamic View Transformations</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Switch instantly between <strong>Canvas</strong> (freeform 2D), <strong>Grid</strong> (neat auto-aligned columns), <strong>Mind Map</strong> (tree hierarchy), and <strong>Timeline</strong> (chronological dates).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <Palette size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Tactile Pastel Color Coding</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Organize cards using 6 eye-pleasing pastel colors (Yellow, Green, Blue, Pink, Purple, Coral). Filter your view to isolate specific categories.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <CheckSquare size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Interactive Checklist Mode</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Convert any note into an interactive to-do checklist with strike-through completions, visual progress indicators, and keyboard Enter shortcuts.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Download size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Offline JSON Backup &amp; Restore</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Download your entire board with all notes, coordinates, and arrows as a portable JSON file. Restore boards on any computer with 100% fidelity.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Search size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Camera Auto-Centering Search</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Never lose a note on an infinite canvas. Type keywords in the search bar and the camera viewport will smoothly pan and zoom directly to the matching card.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Pin Layer &amp; Coordinate Locking</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Pin top-priority notes to stay on the highest z-index layer above overlapping cards, or lock positions to prevent accidental dragging during presentations.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Image size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Image &amp; Screenshot Embedding</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Paste or upload reference images, photos, and UI mockups directly into sticky notes. Perfect for design moodboards, bug captures, and visual ideation.
                    </p>
                  </div>

                </div>
              </div>

              {/* Common Issues in Other Sticky Apps vs Stiknex Fixes */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  <span>Common Everyday Issues in Sticky Note Apps &amp; How Stiknex Fixes Them</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[11px] font-black">
                        <th className="py-3 px-4">Problem in Other Tools (Normally Issue Kya Hota Hai)</th>
                        <th className="py-3 px-4">The Stiknex Architectural Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Expensive 3-board paywalls in apps like Miro or Mural
                        </td>
                        <td className="py-3 px-4">
                          100% free with unlimited infinite canvas space, zero account requirements, and zero subscription limits.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Large boards become unsearchable mazes where notes get lost
                        </td>
                        <td className="py-3 px-4">
                          Integrated real-time search with smart camera auto-centering: typing a search query automatically smoothly pans the canvas directly to that note.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Arrows snap off or break when cards are moved
                        </td>
                        <td className="py-3 px-4">
                          Persistent vector anchor IDs ensure connecting arrows stay permanently attached and recalculate Bezier curves during live dragging.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Forced cloud storage that exposes private brainstorms to leaks
                        </td>
                        <td className="py-3 px-4">
                          Your thoughts never touch an external server; all notes live exclusively inside your browser's local IndexedDB on your machine.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Complete Options & Features Guide */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-[#EADFD5] dark:border-slate-800 space-y-6">
                <h4 className="text-base sm:text-lg font-black text-[#0F3944] dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-amber-600" />
                  <span>Complete Stiknex Sticky Notes Options &amp; Controls Directory</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                  
                  <div className="space-y-4">
                    <h5 className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      1. Canvas Viewport &amp; Top Action Bar
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>+ New Note Button:</strong> Instantly creates a new note card centered in your current viewport.</li>
                      <li>• <strong>View Mode Switcher:</strong> Toggle between Canvas (freeform 2D), Grid (auto-card rows), Mind Map (tree), and Timeline.</li>
                      <li>• <strong>Tag &amp; Keyword Search:</strong> Real-time filter that highlights matching notes and smoothly animates the camera to them.</li>
                      <li>• <strong>Color Palette Filter:</strong> Filter the board to isolate only Yellow, Green, Blue, Pink, Purple, or Coral notes.</li>
                      <li>• <strong>Zoom Controls:</strong> Zoom In (+), Zoom Out (-), Reset Zoom (100%), and Minimap bird's eye view preview.</li>
                      <li>• <strong>Backup &amp; Restore:</strong> 1-click JSON backup export to disk and backup restoration.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      2. Sticky Note Card Buttons &amp; Controls
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>Drag Handle:</strong> Click and drag to reposition card anywhere across the 2D plane.</li>
                      <li>• <strong>Color Palette Swatches:</strong> Change card background to any of 6 tactile pastel shades.</li>
                      <li>• <strong>Pin / Lock Toggle:</strong> Lock note position in place or pin it on top of overlapping cards.</li>
                      <li>• <strong>Arrow Connector Anchor:</strong> Click and drag the anchor handle to another note to create an active connector.</li>
                      <li>• <strong>Checklist Mode Button:</strong> Toggle interactive checkboxes with auto-progress calculation.</li>
                      <li>• <strong>Image Attachment:</strong> Embed photos or screenshots directly inside the card body.</li>
                      <li>• <strong>Duplicate &amp; Delete:</strong> Quick clone with full contents, or delete with safety confirmation.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

            {/* ========================================================
                TOOL 3: STIKNEX WHITEBOARD (EXCALIDRAW STUDIO)
                ======================================================== */}
            <div id="whiteboard" className="scroll-mt-28 space-y-10 border-t border-[#EADFD5] dark:border-slate-800 pt-16">
              
              {/* Header Box */}
              <div className="p-8 sm:p-12 rounded-[36px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 flex items-center gap-2">
                      <PenTool size={14} />
                      Engine 03 · Visual System Design &amp; Architecture
                    </span>
                    <Link
                      to="/whiteboard"
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <span>Open Stiknex Whiteboard</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-[#0F3944] dark:text-white tracking-tight">
                    Stiknex Whiteboard — Infinite Hand-Drawn Sketch &amp; Diagramming Studio
                  </h3>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    Stiknex Whiteboard is a full-featured visual thinking canvas powered by the industry-standard <strong>Excalidraw</strong> vector engine and <strong>Rough.js</strong> graphics. Designed for software engineers, product architects, designers, and educators, it turns complex system flows, database schemas, UI wireframes, and concept diagrams into inviting, hand-drawn graphics with zero watermark restrictions.
                  </p>

                  {/* Why & How It Works (Kaise aur Kyu) */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800/60 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <Zap size={14} />
                      Why &amp; How It Works (Kaise Aur Kyu)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Problem With Traditional Diagramming Tools:</strong> Commercial diagramming apps (Lucidchart, Microsoft Visio, Gliffy) produce rigid, sterile, robotic diagrams that take hours to build. When using free tiers, they watermark your exports, limit you to 3 documents, and lock SVG export behind enterprise subscriptions.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>The Stiknex Solution:</strong> Stiknex Whiteboard embeds the open-source Excalidraw vector canvas directly in browser memory. Using Rough.js procedural geometry, lines have an organic, sketch-like warmth that makes technical proposals approachable and easy to understand. You can export crystal-clear transparent PNGs at 3x scale or pure scalable vector SVGs with zero watermarks.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Can Be Done (Kya Kya Ho Sakta Hai) - 6 Feature Cards */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-purple-600" />
                  <span>What Can You Do With Stiknex Whiteboard? (Capabilities &amp; Workflows)</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Square size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Software Architecture Design</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Sketch microservices, API gateways, database schemas, and cloud infrastructure with intuitive rectangles, containers, and server blocks.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Circle size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Flowcharts &amp; Decision Trees</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Connect diamond decision nodes, circular states, and smart directional arrows to map out business logic and user journeys.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Layout size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">UI Wireframing &amp; Rapid Mockups</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Quickly prototype web and mobile screens, buttons, input bars, navigation bars, and modal overlays in minutes before writing code.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <PenTool size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Natural Freehand Drawing</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Use the pressure-sensitive freehand brush to write handwritten notes, sketch custom icons, highlight architectural boundaries, or circle bugs.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <Image size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">Image Annotation &amp; Stencils</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Paste or drag screenshots directly onto the whiteboard and annotate over them with arrows, callout text, and highlight rectangles.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Download size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-[#0F3944] dark:text-white">High-DPI Transparent Export</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Export diagrams to crisp transparent PNG (1x, 2x, 3x resolution for pitch decks or GitHub READMEs), scalable SVG, or raw <code className="text-[11px]">.excalidraw</code> files.
                    </p>
                  </div>

                </div>
              </div>

              {/* Common Issues in Other Whiteboard Apps vs Stiknex Fixes */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-[#0F3944] dark:text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  <span>Common Everyday Issues in Whiteboard Apps &amp; How Stiknex Fixes Them</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[11px] font-black">
                        <th className="py-3 px-4">Problem in Other Tools (Normally Issue Kya Hota Hai)</th>
                        <th className="py-3 px-4">The Stiknex Architectural Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Watermarks stamped across exported diagrams unless paying $15/month
                        </td>
                        <td className="py-3 px-4">
                          100% free unwatermarked exports in high-resolution transparent PNG and SVG.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Sterile, intimidating boxes that look like complex tax forms
                        </td>
                        <td className="py-3 px-4">
                          Organic Rough.js hand-drawn line aesthetics that make technical proposals friendly, clear, and engaging.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Proprietary cloud file formats that trap your intellectual property
                        </td>
                        <td className="py-3 px-4">
                          Native open-standard <code>.excalidraw</code> file support: export and import files on any computer without vendor lock-in.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                          Laggy canvas panning when sketches get complex
                        </td>
                        <td className="py-3 px-4">
                          High-performance client-side Canvas and WebGL rendering delivering buttery 60fps pan and zoom even with hundreds of elements.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Complete Options & Tools Breakdown */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-[#EADFD5] dark:border-slate-800 space-y-6">
                <h4 className="text-base sm:text-lg font-black text-[#0F3944] dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-purple-600" />
                  <span>Complete Stiknex Whiteboard Tools &amp; Options Directory</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                  
                  <div className="space-y-4">
                    <h5 className="font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      1. Primary Drawing Tools &amp; Hotkeys
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>Selection / Pointer (<kbd className="font-mono text-[11px]">V</kbd> or <kbd className="font-mono text-[11px]">1</kbd>):</strong> Select, move, scale, rotate, and group shapes.</li>
                      <li>• <strong>Rectangle Tool (<kbd className="font-mono text-[11px]">R</kbd> or <kbd className="font-mono text-[11px]">2</kbd>):</strong> Draw boxes, service containers, and UI cards.</li>
                      <li>• <strong>Diamond Tool (<kbd className="font-mono text-[11px]">D</kbd> or <kbd className="font-mono text-[11px]">3</kbd>):</strong> Decision nodes, branching logic, and flowchart conditions.</li>
                      <li>• <strong>Ellipse / Circle Tool (<kbd className="font-mono text-[11px]">O</kbd> or <kbd className="font-mono text-[11px]">4</kbd>):</strong> Draw states, endpoints, and Venn diagram circles.</li>
                      <li>• <strong>Arrow Connector (<kbd className="font-mono text-[11px]">A</kbd> or <kbd className="font-mono text-[11px]">5</kbd>):</strong> Smart-snapping directional arrows with customizable heads.</li>
                      <li>• <strong>Line Tool (<kbd className="font-mono text-[11px]">L</kbd> or <kbd className="font-mono text-[11px]">6</kbd>):</strong> Straight divider lines, axes, and structural borders.</li>
                      <li>• <strong>Freehand Pen Tool (<kbd className="font-mono text-[11px]">P</kbd> or <kbd className="font-mono text-[11px]">7</kbd>):</strong> Natural handwriting and sketches.</li>
                      <li>• <strong>Text Tool (<kbd className="font-mono text-[11px]">T</kbd> or <kbd className="font-mono text-[11px]">8</kbd>):</strong> Headers, code blocks, and annotations in multiple fonts.</li>
                      <li>• <strong>Image Tool (<kbd className="font-mono text-[11px]">9</kbd>):</strong> Insert screenshots and mockups onto the canvas.</li>
                      <li>• <strong>Eraser Tool (<kbd className="font-mono text-[11px]">E</kbd> or <kbd className="font-mono text-[11px]">0</kbd>):</strong> Click or drag across elements to erase them.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                      2. Shape Properties &amp; Export Controls
                    </h5>
                    <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>Stroke &amp; Fill Colors:</strong> Curated designer palettes plus custom hex color picker.</li>
                      <li>• <strong>Fill Patterns:</strong> Transparent, Hachure (sketchy hatching), Cross-hatch, or Solid fill.</li>
                      <li>• <strong>Stroke Width &amp; Style:</strong> Thin, Medium, Bold; Solid, Dashed, or Dotted lines.</li>
                      <li>• <strong>Sloppiness / Roughness:</strong> Architect (straight clean), Artist (hand-drawn), Cartoonist (sketchy).</li>
                      <li>• <strong>Edge Rounding:</strong> Sharp geometric corners vs smooth rounded edges.</li>
                      <li>• <strong>Opacity Slider:</strong> 0% to 100% transparency for background cards and overlays.</li>
                      <li>• <strong>Layer Ordering:</strong> Bring to Front, Bring Forward, Send Backward, Send to Back.</li>
                      <li>• <strong>Export Settings:</strong> Export image (PNG/SVG, 1x/2x/3x scale, transparent toggle), Save .excalidraw to disk, Open from disk.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

            {/* ========================================================
                TOOL 4: STIKNEX TYPING MASTER
                ======================================================== */}
            <div id="typing" className="scroll-mt-28 p-8 sm:p-12 rounded-[36px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                  Speed &amp; Ergonomics
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0F3944] dark:text-white">
                  Stiknex Typing Master — High-Precision Benchmark
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Real-time Words Per Minute (WPM) benchmark tests, touch-typing muscle memory lessons, and developer code challenge drills in JavaScript, Python, and CSS. High-resolution millisecond timer for exact accuracy with zero telemetry.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to="/stiknex-typing"
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm"
                  >
                    Start Typing Test →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800/60 border border-[#EADFD5] dark:border-slate-700/60 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Technical Highlights</h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>• High-resolution millisecond timer for exact CPM/WPM accuracy.</li>
                  <li>• Interactive keyboard virtual layout guide with real-time finger markers.</li>
                  <li>• Zero telemetry reporting — scores stay local on your device.</li>
                </ul>
              </div>
            </div>

            {/* ========================================================
                COMPARISON MATRIX TABLE & WHY USE STIKNEX
                ======================================================== */}
            <div id="why-use-stiknex" className="scroll-mt-28 p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-[#0F3944] to-[#134E5E] text-white space-y-10 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FFA07A]">
                  Architecture Comparison &amp; Value Proposition
                </span>
                <h3 className="text-2xl sm:text-4xl font-black">
                  Why People Should Use Stiknex (Logo Ko Kyu Use Krna Chahiye)
                </h3>
                <p className="text-xs sm:text-sm text-teal-100 max-w-3xl leading-relaxed">
                  Traditional productivity suites have trapped users in heavy subscription paywalls, slow loading times, mandatory account walls, and invasive privacy policies. Stiknex was engineered from the ground up to solve these fundamental frustrations with a sovereign, local-first ecosystem.
                </p>
              </div>

              {/* Persona Cards Grid: Who is Stiknex for */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[#1E293B]">
                
                {/* Persona 1: Developers */}
                <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-md space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Code2 size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F3944] dark:text-white">For Developers &amp; Coders</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    A zero-latency Monaco code scratchpad in your browser. Test HTML/CSS/JS in live sandboxes, format with <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Alt+Shift+F</kbd>, write SQL/Python notes, and map system architectures on the Whiteboard without booting heavy desktop IDEs.
                  </p>
                </div>

                {/* Persona 2: Students */}
                <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-md space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F3944] dark:text-white">For Students &amp; Learners</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Integrated Pomodoro sprint timer and ambient focus sounds (Rain, Lo-Fi, Ocean) keep you in flow. Proofread exam essays with natural Text-to-Speech audio, and take notes in lecture halls on mobile that sync to your laptop.
                  </p>
                </div>

                {/* Persona 3: Writers */}
                <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-md space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <PenTool size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F3944] dark:text-white">For Writers &amp; Creators</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Tactile lined and dotted paper with 8 curated typography styles. Zen mode eliminates all visual noise, digital ink enables handwritten signatures, and snapshot history ensures you never lose a draft milestone.
                  </p>
                </div>

                {/* Persona 4: Founders */}
                <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-md space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F3944] dark:text-white">For Planners &amp; Founders</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Brainstorm pitch decks and product roadmaps on the 2D infinite sticky canvas. Connect thoughts with dynamic vector arrows, toggle to Timeline or Mind Map views, and sketch flows on Whiteboard with 100% data privacy.
                  </p>
                </div>

              </div>

              {/* Side-by-side Table Comparison */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-teal-200">
                  Head-to-Head Architecture Comparison
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-teal-700 text-teal-200 uppercase text-[11px] font-black">
                        <th className="py-3 px-3">Dimension</th>
                        <th className="py-3 px-3 font-bold text-[#FFA07A]">Stiknex</th>
                        <th className="py-3 px-3">Notion / Evernote</th>
                        <th className="py-3 px-3">Miro / Mural</th>
                        <th className="py-3 px-3">Google Docs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-800/60 text-teal-100">
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Pricing &amp; Paywalls</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">100% Free Forever ($0)</td>
                        <td className="py-3 px-3 text-slate-300">$10–$18 / month</td>
                        <td className="py-3 px-3 text-slate-300">3-board free cap</td>
                        <td className="py-3 px-3 text-slate-300">Storage tied to Gmail</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Account &amp; Logins</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">Zero Logins Required</td>
                        <td className="py-3 px-3 text-slate-300">Mandatory Login</td>
                        <td className="py-3 px-3 text-slate-300">Mandatory Login</td>
                        <td className="py-3 px-3 text-slate-300">Google Account Req.</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Cross-Device Sync</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">2-Sec QR Pairing + Write-Behind</td>
                        <td className="py-3 px-3 text-slate-300">Cloud Login Dependent</td>
                        <td className="py-3 px-3 text-slate-300">Cloud Login Dependent</td>
                        <td className="py-3 px-3 text-slate-300">Google Auth Dependent</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Offline Capability</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">100% Offline PWA</td>
                        <td className="py-3 px-3 text-rose-300">Broken / Limited Offline</td>
                        <td className="py-3 px-3 text-rose-300">Online Only</td>
                        <td className="py-3 px-3 text-slate-300">Needs Chrome Extension</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Privacy &amp; Data</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">IndexedDB On-Device</td>
                        <td className="py-3 px-3 text-slate-300">Scanned on Cloud</td>
                        <td className="py-3 px-3 text-slate-300">Hosted on Cloud</td>
                        <td className="py-3 px-3 text-slate-300">Google Cloud Servers</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Code Execution &amp; IDE</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">Built-in (Monaco IDE + HTML/JS Sandbox)</td>
                        <td className="py-3 px-3 text-rose-300">Syntax Highlight Only</td>
                        <td className="py-3 px-3 text-rose-300">No Execution</td>
                        <td className="py-3 px-3 text-rose-300">No Execution</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Watermarks on Export</td>
                        <td className="py-3 px-3 font-bold text-emerald-300">Zero Watermarks (PDF, SVG, PNG)</td>
                        <td className="py-3 px-3 text-slate-300">Export Restrictions</td>
                        <td className="py-3 px-3 text-rose-300">Watermarked in Free</td>
                        <td className="py-3 px-3 text-slate-300">Clean PDF</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================
            4. THE 206 TOOLS DIRECTORY & 9 STRATEGIC HUBS
            ======================================================== */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[#EADFD5] dark:border-slate-800">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#134E5E] dark:text-teal-400">
              Browser Utility Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white tracking-tight">
              206 Utilities Across 9 Strategic Hubs
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Unlike bloated tool websites that send your files and personal inputs to remote servers, every Stiknex utility runs 100% inside your browser's V8 engine with zero network latency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOOL_HUBS.map((hub) => {
              const toolsInHub = ALL_TOOLS.filter((t) => hub.subcategories.includes(t.category));

              return (
                <div
                  key={hub.id}
                  className="p-7 rounded-[28px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 flex items-center justify-center">
                        <i className={`${hub.icon} text-lg`}></i>
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {toolsInHub.length} Tools
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0F3944] dark:text-white">
                      {hub.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {hub.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      to={`/about/tool-details?tool=${toolsInHub[0]?.slug || ""}`}
                      className="text-xs font-black uppercase tracking-wider text-[#134E5E] dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Specifications</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Callout Banner to Deep-Dive Tool Details Page */}
          <div className="mt-12 p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-teal-200">
                Functional Dictionary
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Need deep specs on every single tool?
              </h3>
              <p className="text-sm text-teal-100 max-w-xl">
                Visit our dedicated Tool Details directory for input/output schemas, technical engine IDs, and local privacy guarantees for all 206 utilities.
              </p>
            </div>

            <Link
              to="/about/tool-details"
              className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFA07A] text-[#0F3944] hover:bg-[#F8A88C] shadow-lg hover:shadow-xl transition-all shrink-0"
            >
              Open Tool Specifications Directory →
            </Link>
          </div>

        </section>

        {/* ========================================================
            5. ENGINEERING & PRIVACY ARCHITECTURE
            ======================================================== */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[#EADFD5] dark:border-slate-800">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#134E5E] dark:text-teal-400">
              Data Sovereignty
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white tracking-tight">
              Engineered for Complete Privacy
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Why Stiknex's local-first architecture protects your thoughts better than cloud databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0F3944] dark:text-white">
                Zero Cloud Storage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your notes, files, checklists, and calculations reside exclusively inside your device's browser database (IndexedDB). They never pass through our servers, meaning there is zero possibility of data breaches or leaks.
              </p>
            </div>

            <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Cpu size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0F3944] dark:text-white">
                In-Memory Computation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Image compression, hash calculations, and text transformations execute in client memory with JavaScript Web Workers and the Web Crypto API. Calculations happen with 0ms roundtrip delay.
              </p>
            </div>

            <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Globe size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0F3944] dark:text-white">
                True Offline PWA
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stiknex is built with Service Worker caching. Once visited, the entire application works offline on mobile, tablet, and desktop without requiring an internet connection.
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================
            6. FOUNDER STORY & ETHOS
            ======================================================== */}
        <section className="py-16 px-6 max-w-5xl mx-auto border-t border-[#EADFD5] dark:border-slate-800">
          <div className="rounded-[32px] p-8 sm:p-12 bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#134E5E] to-[#FFA07A] p-1 flex items-center justify-center shrink-0 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Vishal Mall - Creator of Stiknex"
                  className="w-full h-full object-contain rounded-xl bg-white p-2"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#134E5E] dark:text-teal-400">
                  Founder &amp; Lead Engineer
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F3944] dark:text-white">
                  Built by Vishal Mall
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "I created Stiknex because modern web productivity software has become unnecessarily complex, cluttered with ads, locked behind aggressive paywalls, and obsessed with tracking user data. Stiknex is built to be the antidote: a lightning-fast, ad-light digital workspace where thinkers, students, coders, and writers can organize ideas without friction."
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold">
                  <Link
                    to="/buy-me-a-coffee"
                    className="inline-flex items-center gap-1.5 text-[#FFA07A] hover:underline"
                  >
                    <Heart size={14} className="fill-current text-rose-500" />
                    <span>Support Independent Development →</span>
                  </Link>
                  <span>•</span>
                  <a
                    href="mailto:vishal.mall02@outlook.com"
                    className="text-slate-500 hover:text-[#134E5E] dark:hover:text-white"
                  >
                    vishal.mall02@outlook.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            7. FREQUENTLY ASKED QUESTIONS (FAQ)
            ======================================================== */}
        <section className="py-16 px-6 max-w-4xl mx-auto border-t border-[#EADFD5] dark:border-slate-800">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#134E5E] dark:text-teal-400">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F3944] dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Stiknex genuinely 100% free with no hidden charges?",
                a: "Yes. Every workspace, sticky notes canvas, markdown notebook, whiteboard, and all 206 client-side tools are completely free to use. There are no credit card prompts, subscriptions, or gated paywalls."
              },
              {
                q: "What does the name 'Stiknex' mean and how is it pronounced?",
                a: "Stiknex fuses 'Sticky Notes' with 'Next-generation canvas'. It is pronounced 'Stick-Nex' (/ˈstɪk.nɛks/). It was created by Vishal Mall as a private, local-first web suite."
              },
              {
                q: "What are the 3 main flagship tools in Stiknex?",
                a: "The three core flagship tools are: 1) Stiknex Notepad (distraction-free rich text editor with live code execution sandbox, Alt+Shift+F beautifier, focus audio, and timer), 2) Stiknex Sticky Notes (2D infinite canvas for spatial brainstorming, connecting arrows, and 4 layout views), and 3) Stiknex Whiteboard (infinite vector diagramming canvas for system architecture and flowcharts with hand-drawn Rough.js aesthetics)."
              },
              {
                q: "Where is my data stored if I don't have an account?",
                a: "All your notes, drawings, and calculations reside exclusively in your browser's IndexedDB and localStorage on your device. To ensure safety across browser cache clears, you can download a full JSON backup with one click from the workspace sidebar."
              },
              {
                q: "Can I use Stiknex on mobile or as an installed app?",
                a: "Yes! Stiknex is a Progressive Web App (PWA). You can tap 'Add to Home Screen' in Chrome, Safari, or Edge to install it as a standalone app with offline support."
              },
              {
                q: "How do client-side utilities work without a backend?",
                a: "All 206 tools leverage modern HTML5 APIs, including Web Crypto (for password and hash generation), Canvas 2D (for image compression and color extraction), and V8 JavaScript math engines. Your inputs never touch our servers."
              },
              {
                q: "Where can I view the technical specifications of every tool?",
                a: "You can visit our dedicated Tool Details directory at /about/tool-details to view the technical engine, inputs, outputs, and privacy guarantees for all 206 tools."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm space-y-2"
              >
                <h3 className="text-base font-bold text-[#0F3944] dark:text-white flex items-start gap-2.5">
                  <span className="text-[#134E5E] dark:text-teal-400 font-black">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================
            8. FINAL CTA BANNER
            ======================================================== */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center border-t border-[#EADFD5] dark:border-slate-800">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white">
              Ready to supercharge your workflow?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Open the infinite canvas or explore the 206 client-side utilities with zero sign-ups and total privacy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/sticky-notes"
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Launch Sticky Notes Canvas →
              </Link>
              <Link
                to="/online-notebook"
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#0F3944] hover:bg-[#134E5E] hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Launch Notepad →
              </Link>
              <Link
                to="/whiteboard"
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Launch Whiteboard →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </AppShell>
  );
}
