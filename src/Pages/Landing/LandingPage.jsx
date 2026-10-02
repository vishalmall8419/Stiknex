import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowRight, Sparkles, Layers, PenTool, LayoutDashboard, Code2, Mail, Zap, Terminal, Coffee } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import HomeBlogSection from "./HomeBlogSection";
import Testimonials from "../../Component/Testimonials";

gsap.registerPlugin(ScrollTrigger);

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
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
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  useEffect(() => {
    const lenis = new Lenis({
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
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.from(".hero-char", {
        y: 100,
        opacity: 0,
        rotation: 10,
        stagger: 0.02,
        duration: 1,
        ease: "back.out(1.5)",
        delay: 0.2
      });

      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 1, delay: 0.8, ease: "power3.out" });
      gsap.from(".hero-btn", { scale: 0.8, opacity: 0, duration: 0.8, delay: 1, ease: "elastic.out(1, 0.5)", stagger: 0.2 });

      gsap.from(".creator-element", {
        scrollTrigger: {
          trigger: "#creator",
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const heroWords = "Think Freely.".split(" ");

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans">
      <PageSEO title="Stiknex - Free Sticky Notes, Online Notebook & Productivity Tools" description="Stiknex is a free online productivity platform with infinite sticky boards, an AI-powered notebook, Excalidraw whiteboard, calculators, QR code generator, password generator and more. No sign-up needed." path="/" type="webapp" keywords="sticky notes, online sticky notes, free sticky notes app, online notebook, digital whiteboard, productivity tools, excalidraw, note taking app, free online tools, digital workspace" faqs={[{ q: "What is Stiknex?", a: "Stiknex is a free online productivity platform featuring infinite sticky boards, a rich-text notebook, Excalidraw whiteboard, calculators, converters, QR code generator, and more." }, { q: "Is Stiknex free to use?", a: "Yes, Stiknex is completely free with no sign-up required." }, { q: "What tools does Stiknex offer?", a: "Stiknex offers sticky notes, a notebook editor, an Excalidraw whiteboard, calculators, unit converters, QR code generator, password generator, color picker and more." }]} />
      <AuroraBackground />

      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-3 min-[350px]:px-4 py-2 sm:px-6 sm:py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-2 min-[350px]:gap-3 sm:gap-8 w-max max-w-[95vw]">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
          <img src="/logo.png" alt="Stiknex Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
          <span className="font-extrabold text-base min-[350px]:text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600">Stiknex</span>
        </Link>
        <div className="flex gap-2 min-[350px]:gap-3 sm:gap-4 items-center">
          <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
            {darkMode ? <Sparkles size={14} className="min-[350px]:w-4 min-[350px]:h-4 sm:w-4.5 sm:h-4.5" /> : <Zap size={14} className="min-[350px]:w-4 min-[350px]:h-4 sm:w-4.5 sm:h-4.5" />}
          </button>
          <a href="#creator" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Creator</a>
          <Link to="/blog" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Blog</Link>
          <Link to="/notes" className="px-2.5 py-1 min-[350px]:px-3 min-[350px]:py-1.5 sm:px-4 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] min-[350px]:text-xs sm:text-sm font-semibold transition-transform hover:scale-105 shadow-md whitespace-nowrap">
            Launch App
          </Link>
        </div>
      </nav>

      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center">
        <motion.div style={{ y }} className="max-w-5xl mx-auto text-center z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-xs sm:text-sm mb-6 sm:mb-8 border border-indigo-100 dark:border-indigo-500/20 hero-sub whitespace-normal sm:whitespace-nowrap mx-auto max-w-full">
            <Sparkles size={16} className="shrink-0" /> Welcome to the new standard of ideation
          </div>
          
          <h1 className="text-[2.8rem] min-[400px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1] overflow-hidden flex flex-wrap justify-center gap-y-2 sm:gap-y-4" ref={textRef}>
            {heroWords.map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap mr-4 last:mr-0">
                {word.split("").map((char, charIdx) => (
                  <span key={charIdx} className="hero-char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
            <div className="w-full basis-full h-0"></div>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hero-sub inline-block whitespace-normal leading-tight">
              Create Boundlessly.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12 hero-sub font-light px-4">
            An infinite canvas for your sticky notes, integrated whiteboards, and structured notebooks. All in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/notes" className="hero-btn group px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-700 transition-all flex items-center gap-2">
              Start Brainstorming <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="hero-btn px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full text-lg font-semibold shadow-sm hover:shadow-md transition-all">
              Explore Features
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 hero-btn">
              <a href="/Stiknex.apk" download className="group flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-black text-white border border-slate-700 dark:border-slate-800 rounded-2xl hover:bg-slate-800 transition-all shadow-md">
                <svg viewBox="0 0 512 512" className="w-[20px] h-[20px] shrink-0">
                  <path fill="#4caf50" d="M38.8 13.9C36.3 16.4 35 20.3 35 25.3v461.3c0 5 1.3 8.9 3.8 11.4l1.3 1.3 259.9-259.9V237L40.1 12.6l-1.3 1.3z" />
                  <path fill="#4caf50" d="M386.4 352.5l-86.4-86.4v-20.2l86.4-86.4 2.8 1.6 102.4 58.2c29.1 16.5 29.1 43.4 0 59.9l-102.4 58.2-2.8 1.5z" />
                  <path fill="#4caf50" d="M300 286.3l86.4 86.4L114.7 527.2c-19.1 10.9-40.4 1.3-40.4-21.7L300 286.3z" />
                  <path fill="#4caf50" d="M300 225.7L74.3 6.5C74.3 6.5 74.3 6.5 74.3 6.5c0-23 21.3-32.6 40.4-21.7L386.4 159.5 300 225.7z" />
                </svg>
                <div className="flex flex-col items-start leading-[1.1] text-left">
                  <span className="text-[10px] text-slate-300 font-semibold tracking-wide uppercase">Download</span>
                  <span className="text-[14px] font-bold">Android App</span>
                </div>
              </a>

              <button onClick={() => {
                  if (window.deferredPWA) {
                    window.deferredPWA.prompt();
                    window.deferredPWA.userChoice.then(() => { window.deferredPWA = null; });
                  } else {
                    alert("To install the PWA, please use 'Add to Home Screen' in your browser menu (or Share -> Add to Home Screen on iOS).");
                  }
                }} 
                className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all shadow-md">
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] shrink-0 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
                </svg>
                <div className="flex flex-col items-start leading-[1.1] text-left">
                  <span className="text-[10px] text-indigo-400 dark:text-indigo-300 font-semibold tracking-wide uppercase">Fast & Light</span>
                  <span className="text-[14px] font-bold">Install PWA</span>
                </div>
              </button>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Designed for <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">Deep Work</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to capture ideas before they slip away. Built for speed, flexibility, and absolute focus.</p>
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
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-50/50 dark:via-indigo-950/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Your brain's new <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-500">operating system.</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
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
                      <i className="fa-solid fa-check text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
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
              
              <div className="absolute -inset-10 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to transform <br/>your workflow?</h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of creators, developers, and thinkers who use Stiknex to organize their chaotic brilliant minds.</p>
            <Link to="/notes" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Open App Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section id="creator" className="py-32 px-6 relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-950/30 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="creator-element inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium text-sm border border-purple-100 dark:border-purple-500/20">
              <Terminal size={16} /> Meet the Developer
            </div>
            
            <h2 className="creator-element text-4xl md:text-5xl font-black">
              Hi, I'm <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-indigo-500">Vishal Mall</span>
            </h2>
            
            <p className="creator-element text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              I am a passionate <strong>Frontend Developer</strong> currently working at <strong>Starchain Lab</strong> in Bhopal, Madhya Pradesh. I love building intuitive, beautiful, and highly interactive web experiences.
            </p>
            
            <div className="creator-element space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Java', 'MySQL'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300">{tech}</span>
                ))}
              </div>
            </div>

            <div className="creator-element flex gap-4 pt-4">
              <a aria-label="GitHub Profile" href="https://github.com/vishalmall8419" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="https://www.linkedin.com/in/vishal-mall-536506302/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#0a66c2] transition-colors">
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
              <a href="mailto:vishal.mall02@outlook.com" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="creator-element p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center transform sm:translate-y-8">
                <h3 className="text-4xl font-black text-indigo-500 mb-2">10+</h3>
                <p className="font-medium text-slate-700 dark:text-slate-300">Frontend Websites Built</p>
             </div>
             <div className="creator-element p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <h3 className="text-4xl font-black text-purple-500 mb-2">5+</h3>
                <p className="font-medium text-slate-700 dark:text-slate-300">Full-Stack Projects</p>
             </div>
             <div className="creator-element p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center sm:translate-y-8 col-span-1 sm:col-span-2">
                <h3 className="text-xl font-bold mb-2">Notable Projects</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                   <li><span className="font-semibold text-indigo-500">• Stiknex</span> (Productivity Platform)</li>
                   <li><span className="font-semibold text-indigo-500">• CodeForge</span> (Project Management)</li>
                   <li><span className="font-semibold text-indigo-500">• Student Productivity Portal</span></li>
                   <li><span className="font-semibold text-indigo-500">• VMS Blog & E-Cart</span> (E-commerce)</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <HomeBlogSection />

            <footer className="py-12 px-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
            <Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tools</Link>
            <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
            <Link to="/notebook" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Notebook</Link>
            <Link to="/whiteboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Whiteboard</Link>
            <Link to="/buy-me-a-coffee" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">
              Crafted with <Coffee size={14} className="inline text-amber-600" /> by 
              <a href="https://vishalmall.vercel.app/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1 font-bold">Vishal Mall</a>
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">&copy; {new Date().getFullYear()} Stiknex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


