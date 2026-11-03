import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import { 
  ArrowRight, Sparkles, Layers, PenTool, LayoutDashboard, Code2, Zap, Check,
  FileText, Type, Timer, Calculator, Ruler, Thermometer, QrCode, StickyNote, Search, Gamepad2,
  Menu, X, Smartphone, Globe, Download, Laptop
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { ALL_TOOLS, TOOL_CATEGORIES } from "../../data/toolsRegistry";

const HomeBlogSection = lazy(() => import("./HomeBlogSection"));
const Testimonials = lazy(() => import("../../Component/Testimonials"));
const ExtensionModal = lazy(() => import("../../Component/ExtensionModal"));

const ChromeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="#4285F4"/>
    <path d="M12 2a10 10 0 0 1 8.66 5H12" stroke="#EA4335" strokeWidth="2"/>
    <path d="M20.66 7a10 10 0 0 1-5 13.66L12 12" stroke="#FBBC05" strokeWidth="2"/>
    <path d="M15.66 20.66A10 10 0 0 1 3.34 12H12" stroke="#34A853" strokeWidth="2"/>
  </svg>
);

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[60px] sm:blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob transform-gpu will-change-transform"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[60px] sm:blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000 transform-gpu will-change-transform"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[60px] sm:blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000 transform-gpu will-change-transform"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-size-[40px_40px] opacity-40"></div>
    
    <style>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob { animation: blob 15s infinite alternate ease-in-out; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `}</style>
  </div>
);

const Features = [
  { icon: Layers, title: "Infinite Board", desc: "A massive freeform canvas for your sticky notes. Drag, drop, and connect your thoughts freely." },
  { icon: PenTool, title: "Excalidraw Whiteboard", desc: "Built-in Excalidraw integration for advanced sketching, diagramming, and brainstorming." },
  { icon: LayoutDashboard, title: "Structured Notebooks", desc: "Organize your long-form content into beautiful notebooks with rich text and snapshots." },
];

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  useEffect(() => {
    // Only initialize smooth scrolling on desktop devices with fine pointer
    const isDesktop = typeof window !== 'undefined' && 
      window.innerWidth >= 768 && 
      !window.matchMedia('(pointer: coarse)').matches;

    let lenis = null;
    let rafId = null;

    if (isDesktop) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      function raf(time) {
        if (lenis) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      }
      rafId = requestAnimationFrame(raf);
    }

    return () => {
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans">
      <PageSEO
        title="Stiknex - Free Sticky Notes, Online Notebook & Productivity Tools"
        description="Stiknex is a free online productivity platform with infinite sticky boards, a rich-text notebook, Excalidraw whiteboard, calculators, QR code generator and more. No sign-up needed."
        path="/"
        type="webapp"
        keywords="sticky notes, online sticky notes, free sticky notes app, online notebook, digital whiteboard, productivity tools, excalidraw, note taking app, free online tools"
        faqs={[
          { q: 'What is Stiknex?', a: 'Stiknex is a free online productivity platform featuring infinite sticky boards, a rich-text notebook, Excalidraw whiteboard, calculators, converters, QR code generator, and more.' },
          { q: 'Is Stiknex free to use?', a: 'Yes, Stiknex is completely free with no sign-up required.' },
          { q: 'What tools does Stiknex offer?', a: 'Stiknex offers sticky notes, a notebook editor, an Excalidraw whiteboard, calculators, unit converters, QR code generator, password generator, and color picker.' },
          { q: 'Does Stiknex work on mobile?', a: 'Yes, Stiknex is a Progressive Web App (PWA) that works on all devices including mobile, tablet and desktop.' }
        ]}
      />
      <AuroraBackground />

      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-3 sm:px-6 pointer-events-none">
        <nav className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-800/70 rounded-full shadow-xl shadow-slate-900/5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img src="/logo.png" alt="Stiknex Logo" width="30" height="30" loading="eager" fetchPriority="high" decoding="async" className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-black text-base sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Stiknex
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/sticky-notes" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Sticky Notes</Link>
            <Link to="/online-notebook" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Notebook</Link>
            <Link to="/whiteboard" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Whiteboard</Link>
            <Link to="/tools" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <span>Tools</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">200+</span>
            </Link>
            <Link to="/typing-lab" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Typing Lab</Link>
            <Link to="/blog" className="px-3 py-1.5 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Blog</Link>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Global Search Trigger Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("stiknex_open_quick_search"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium transition cursor-pointer"
              title="Search tools, notes and blogs (Ctrl+K)"
              aria-label="Search tools and notes"
            >
              <Search size={14} className="text-indigo-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sparkles size={16} /> : <Zap size={16} />}
            </button>

            {/* Extension CTA (Tablet & Desktop) */}
            <button 
              type="button"
              onClick={() => setShowExtensionModal(true)} 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors text-xs cursor-pointer shadow-xs"
              title="Add Stiknex Chrome Extension"
            >
              <ChromeIcon className="w-3.5 h-3.5" />
              <span>Extension</span>
            </button>

            {/* Mobile Menu Hamburger (Visible on < lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu (Zero horizontal scroll, clean vertical cards) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-3 pointer-events-auto"
            >
              <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                <Link
                  to="/sticky-notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <StickyNote size={16} className="text-amber-500" />
                  <span>Sticky Notes</span>
                </Link>
                <Link
                  to="/online-notebook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <FileText size={16} className="text-blue-500" />
                  <span>Notebook</span>
                </Link>
                <Link
                  to="/whiteboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <PenTool size={16} className="text-emerald-500" />
                  <span>Whiteboard</span>
                </Link>
                <Link
                  to="/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <Calculator size={16} className="text-purple-500" />
                  <span>200+ Tools</span>
                </Link>
                <Link
                  to="/typing-lab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <Gamepad2 size={16} className="text-pink-500" />
                  <span>Typing Lab</span>
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  <Sparkles size={16} className="text-indigo-500" />
                  <span>Blog</span>
                </Link>
              </div>

              {/* Quick Actions in Mobile Drawer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new Event("stiknex_open_quick_search"));
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  <Search size={14} className="text-indigo-500" /> Open Quick Search (Ctrl+K)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowExtensionModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-xs font-bold"
                >
                  <ChromeIcon className="w-4 h-4" /> Add Chrome Extension
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center">
        <motion.div style={{ y }} className="max-w-5xl mx-auto text-center z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-xs sm:text-sm mb-6 sm:mb-8 border border-indigo-100 dark:border-indigo-500/20 whitespace-normal sm:whitespace-nowrap mx-auto max-w-full">
            <Sparkles size={16} className="shrink-0" /> Welcome to the new standard of ideation
          </div>
          
          <h1 className="text-[2.8rem] min-[400px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1] flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-y-4">
            <span className="inline-block">Think Freely.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block">
              Create Boundlessly.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 sm:mb-12 font-light px-4">
            An infinite canvas for your sticky notes, integrated whiteboards, and structured notebooks. All in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/sticky-notes" className="group px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-700 transition-all flex items-center gap-2">
              Start Brainstorming <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/tools" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full text-lg font-semibold shadow-sm hover:shadow-md transition-all">
              Browse 200+ Tools
            </Link>
          </div>

          {/* Hero Value Props: Clean, uncluttered and high-converting */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-emerald-500 shrink-0" /> 100% Free Forever</span>
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-emerald-500 shrink-0" /> Zero Sign-Up Required</span>
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-emerald-500 shrink-0" /> Private & Client-Side</span>
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-emerald-500 shrink-0" /> Works Offline</span>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block absolute top-1/4 left-[10%] w-32 h-32 bg-yellow-200 dark:bg-yellow-600/80 rounded-sm shadow-2xl -rotate-12 backdrop-blur-md border border-white/40"
        />
        <motion.div 
          animate={{ y: [20, -20, 20], rotate: [0, -10, 5, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute bottom-1/4 right-[10%] w-40 h-40 bg-pink-200 dark:bg-pink-600/80 rounded-sm shadow-2xl rotate-6 backdrop-blur-md border border-white/40 items-center justify-center"
        >
          <Code2 className="text-pink-400 dark:text-pink-200/50 w-16 h-16" />
        </motion.div>
      </section>

      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm border border-indigo-100 dark:border-indigo-500/20 mb-6">
              <Sparkles size={16} /> Powerful Features
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Deep Work</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Everything you need to capture ideas before they slip away. Built for speed, flexibility, and absolute focus.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Features, 
              { icon: Zap, title: "Lighting Fast", desc: "Optimized for speed. No loading screens, no waiting. Just instant access to your thoughts." },
              { icon: Code2, title: "Markdown Support", desc: "Write at the speed of thought with full markdown support in your notebooks and sticky notes." },
              { icon: Layers, title: "Infinite Canvas", desc: "Never run out of space. Pan and zoom across a massive digital workspace designed for huge mind maps." }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <feat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 dark:via-indigo-950/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Your brain's new <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">operating system.</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Stiknex isn't just another note-taking app. It's a complete productivity suite designed to adapt to how your mind actually works. Visual, unstructured, and infinitely flexible.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  { title: "Visual Brainstorming", desc: "Connect ideas with arrows and sticky notes." },
                  { title: "Distraction-free Writing", desc: "Focus mode for your most important documents." },
                  { title: "All-in-one Toolkit", desc: "Calculators, converters, and utilities built-in." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 mt-1">
                      <Check size={16} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800 p-2 perspective-1000"
              >
                <div className="aspect-4/3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative">
                   <div className="h-10 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50 dark:bg-slate-950/50">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="flex-1 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[20px_20px]">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 dark:bg-yellow-500/80 rounded-sm shadow-lg p-3 rotate-3 border border-black/5">
                        <div className="w-16 h-2 bg-black/10 rounded-full mb-2"></div>
                        <div className="w-full h-2 bg-black/10 rounded-full mb-2"></div>
                        <div className="w-20 h-2 bg-black/10 rounded-full"></div>
                      </motion.div>
                      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-10 right-10 w-40 h-32 bg-indigo-200 dark:bg-indigo-500/80 rounded-sm shadow-lg p-3 -rotate-6 border border-black/5">
                        <div className="w-20 h-2 bg-black/10 rounded-full mb-2"></div>
                        <div className="w-full h-2 bg-black/10 rounded-full mb-2"></div>
                      </motion.div>
                   </div>
                </div>
              </motion.div>
              
              <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Dedicated Multi-Platform Ecosystem & Apps Section with Rich SEO Internal Linking */}
      <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-500/20">
            <Globe size={14} /> Multi-Platform Productivity
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Work Seamlessly On <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Every Screen</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            Whether you are capturing thoughts on your phone, writing inside Google Chrome, or running fully offline on your desktop, Stiknex delivers instantaneous speed and zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Android Mobile App */}
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 border border-emerald-200/60 dark:border-emerald-800/60">
                <Smartphone size={28} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Mobile Edition</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Android Mobile App</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Native gesture navigation, touch-optimized canvas for <Link to="/sticky-notes" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">sticky notes</Link>, and instant offline access to your <Link to="/online-notebook" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">online notebook</Link>.
              </p>
            </div>
            <div>
              <a
                href="/Stiknex.apk"
                download
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-slate-900 dark:bg-black hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg transition"
              >
                <Download size={16} className="text-emerald-400" />
                <span>Download Android APK</span>
              </a>
              <p className="text-[11px] text-slate-400 text-center mt-2.5">Direct APK download • Virus-free • No Play Store login</p>
            </div>
          </div>

          {/* Card 2: Chrome Extension */}
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-indigo-200/80 dark:border-indigo-900/50 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl">Popular</div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 border border-indigo-200/60 dark:border-indigo-800/60">
                <ChromeIcon className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Browser Toolbar</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Google Chrome Extension</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                One-click scratchpad side panel on any webpage. Jot thoughts while browsing, calculate formulas, or open our <Link to="/tools" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">200+ browser tools</Link> instantly.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowExtensionModal(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <ChromeIcon className="w-4 h-4" />
                <span>Add to Google Chrome</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2.5">Lightweight manifest v3 • Works on Chrome & Brave</p>
            </div>
          </div>

          {/* Card 3: Desktop & Mobile PWA */}
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 border border-purple-200/60 dark:border-purple-800/60">
                <Laptop size={28} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Desktop & Tablet</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Offline Progressive Web App</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Install Stiknex directly on Windows, macOS, iPad, or Linux. Launches in a standalone borderless window with full offline access to our <Link to="/whiteboard" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">digital whiteboard</Link>.
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
                    alert("To install the PWA, please use 'Add to Home Screen' in your browser menu (or Share -> Add to Home Screen on iOS).");
                  }
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-md transition cursor-pointer"
              >
                <Download size={16} className="text-purple-500" />
                <span>Install Web App (PWA)</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2.5">No app store download • 100% offline capable</p>
            </div>
          </div>

        </div>
      </section>

      {/* Flagship Stiknex Typing Lab Showcase Section */}
      <section className="py-16 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-wider border border-indigo-500/30">
                <Zap size={14} className="text-amber-400" /> Flagship Release
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Master Touch Typing & Speed in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Typing Lab</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Boost your typing speed with instant 15s, 30s, 60s, and 120s WPM benchmark tests, structured touch typing syllabus lessons, developer code syntax challenges, and 6 original arcade typing games.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/typing-lab"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  Launch Typing Lab <ArrowRight size={16} />
                </Link>
                <Link
                  to="/typing-speed-test"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-sm transition-all"
                >
                  Quick 60s WPM Test
                </Link>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 font-mono space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Live Benchmark</span>
                <span className="text-emerald-400 font-bold">100% Free & Local</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Speed</span>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">84 WPM</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Accuracy</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">98.5%</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Lessons</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">20+ Levels</div>
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl text-xs text-slate-400 leading-relaxed">
                "Practice every single day to dramatically boost your typing speed and computer fluency..."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Online Productivity Tools Section */}
      <section className="py-20 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles size={14} /> 200+ Free Browser Utilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Essential Tools for Modern Thinkers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-base sm:text-lg max-w-2xl">
              Fast, privacy-first calculators, converters, developer utilities, and formatters running entirely in your browser with zero server uploads.
            </p>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm sm:text-base hover:gap-3 transition-all self-start md:self-end"
          >
            Explore All 200+ Tools <ArrowRight size={18} />
          </Link>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TOOL_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              to="/tools"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-semibold transition border border-slate-200/60 dark:border-slate-800"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/tools"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold transition shadow-sm"
          >
            +10 More Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Word Counter",
              desc: "Instant word, character, and sentence count with reading time estimator.",
              path: "/word-counter",
              Icon: FileText,
              tag: "Writing"
            },
            {
              title: "Character Counter",
              desc: "Measure exact characters with and without spaces for social media and essays.",
              path: "/character-counter",
              Icon: Type,
              tag: "Writing"
            },
            {
              title: "Reading Time Calculator",
              desc: "Estimate silent reading and speaking duration for articles and presentations.",
              path: "/reading-time-calculator",
              Icon: Timer,
              tag: "Writing"
            },
            {
              title: "Scientific Calculator",
              desc: "Trigonometry, logarithms, powers, and advanced math formulas online.",
              path: "/scientific-calculator",
              Icon: Calculator,
              tag: "Calculators"
            },
            {
              title: "Universal Unit Converter",
              desc: "Convert length, area, volume, mass, pressure, and power units with precision.",
              path: "/unit-converter",
              Icon: Ruler,
              tag: "Converters"
            },
            {
              title: "Temperature Converter",
              desc: "Instant conversion between Celsius (°C), Fahrenheit (°F), and Kelvin (K).",
              path: "/temperature-converter",
              Icon: Thermometer,
              tag: "Converters"
            },
            {
              title: "QR Code Generator",
              desc: "Generate custom, high-resolution QR codes for links, text, Wi-Fi, and contacts.",
              path: "/qr-code-generator",
              Icon: QrCode,
              tag: "Generators"
            },
            {
              title: "Online Sticky Notes",
              desc: "Infinite freeform digital canvas to organize, color-code, and drag ideas.",
              path: "/sticky-notes",
              Icon: StickyNote,
              tag: "Notes"
            }
          ].map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <tool.Icon size={22} />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">
                {tool.tag}
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                {tool.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Launch Tool <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to transform <br/>your workflow?</h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of creators, developers, and thinkers who use Stiknex to organize their chaotic brilliant minds.</p>
            <Link to="/sticky-notes" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Open App Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[300px]" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<div className="min-h-[400px]" />}>
        <HomeBlogSection />
      </Suspense>

      {/* Comprehensive Categorized Footer Matching AppShell for Full Link Equity */}
      <footer className="py-16 px-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative z-10 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Writing & Notes</h3>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <li><Link to="/sticky-notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sticky Notes</Link></li>
                <li><Link to="/online-notebook" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Online Notebook</Link></li>
                <li><Link to="/whiteboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Whiteboard</Link></li>
                <li><Link to="/word-counter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Word Counter</Link></li>
                <li><Link to="/character-counter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Character Counter</Link></li>
                <li><Link to="/reading-time-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Reading Time Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Calculators</h3>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <li><Link to="/simple-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Simple Calculator</Link></li>
                <li><Link to="/scientific-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Scientific Calculator</Link></li>
                <li><Link to="/date-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Date Calculator</Link></li>
                <li><Link to="/currency-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Currency Converter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Unit Converters</h3>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <li><Link to="/unit-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Universal Unit Converter</Link></li>
                <li><Link to="/length-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Length Converter</Link></li>
                <li><Link to="/area-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Area Converter</Link></li>
                <li><Link to="/volume-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Volume Converter</Link></li>
                <li><Link to="/weight-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Weight Converter</Link></li>
                <li><Link to="/temperature-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Temperature Converter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Generators & Tech</h3>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <li><Link to="/qr-code-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">QR Code Generator</Link></li>
                <li><Link to="/password-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Password Generator</Link></li>
                <li><Link to="/color-picker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Color Picker</Link></li>
                <li><Link to="/speed-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Speed Converter</Link></li>
                <li><Link to="/pressure-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pressure Converter</Link></li>
                <li><Link to="/power-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Power Converter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Platform</h3>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link></li>
                <li><Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Online Tools</Link></li>
                <li><Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Productivity Blog</Link></li>
                <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Stiknex</Link></li>
                <li><Link to="/buy-me-a-coffee" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support Development</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const btn = document.querySelector('button[title*="Feedback"]');
                      if (btn) btn.click();
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                  >
                    Contact & Feedback
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Stiknex. All rights reserved. Created with passion by{" "}
              <a href="https://vishalmall.vercel.app/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Vishal Mall
              </a>.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/blog" className="hover:underline">Blog</Link>
              <Link to="/tools" className="hover:underline">Tools</Link>
              <Link to="/buy-me-a-coffee" className="hover:underline">Buy Me a Coffee</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Chrome Extension Modal */}
      <Suspense fallback={null}>
        <ExtensionModal isOpen={showExtensionModal} onClose={() => setShowExtensionModal(false)} />
      </Suspense>
    </div>
  );
};

export default LandingPage;