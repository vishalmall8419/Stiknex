import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Lenis from "lenis";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import { Zap, Shield, Sparkles, Code2, Database, LayoutTemplate, Rocket } from "lucide-react";

// ==========================================
// React Bits Inspired Components
// ==========================================

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 dark:bg-cyan-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-40"></div>
    
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

const SplitText = ({ text, className }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      rotate: 5,
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ShinyText = ({ children, className }) => (
  <div className={`relative inline-block overflow-hidden ${className}`}>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 via-slate-900 to-slate-600 dark:from-slate-400 dark:via-white dark:to-slate-400 bg-[length:200%_auto] animate-shine">
      {children}
    </span>
    <style>{`
      @keyframes shine {
        to { background-position: 200% center; }
      }
      .animate-shine { animation: shine 3s linear infinite; }
    `}</style>
  </div>
);


const About = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

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

    return () => lenis.destroy();
  }, []);

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="About Stiknex & Creator"
        description="Learn more about Stiknex and its creator, Vishal Mall."
        path="/about"
      />

      <div className="relative min-h-screen">
        <AuroraBackground />

        <div className="relative z-10 pt-24 pb-32">
          
          {/* ================= HERO SECTION ================= */}
          <motion.section style={{ y: heroY, opacity: heroOpacity }} className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center mb-32">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, duration: 1.5 }}
              className="w-24 h-24 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 flex items-center justify-center mb-8 shadow-2xl"
            >
              <img src="/logo.png" alt="Stiknex Logo" className="w-12 h-12 object-contain drop-shadow-xl" />
            </motion.div>

            <SplitText 
              text="Redefining Productivity" 
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-6"
            />
            
            <motion.p 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium"
            >
              Stiknex is a fast, offline-first workspace combining infinite whiteboards, smart notes, and essential tools in one gorgeous interface.
            </motion.p>
          </motion.section>

          {/* ================= THE PILLARS ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-40">
            <FadeIn>
              <h2 className="text-sm font-bold tracking-widest uppercase text-indigo-500 mb-4 text-center">Core Pillars</h2>
              <h3 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900 dark:text-white">Built on absolute <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">perfection.</span></h3>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "No loading spinners. No sync delays. Everything renders at 60fps immediately.", color: "text-amber-500", bg: "bg-amber-500/10" },
                { icon: Shield, title: "100% Private", desc: "Your thoughts are your own. Everything is stored locally on your device by default.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { icon: LayoutTemplate, title: "Zero Clutter", desc: "A beautifully minimalist interface that gets out of your way and lets you focus.", color: "text-purple-500", bg: "bg-purple-500/10" }
              ].map((pillar, i) => (
                <FadeIn key={i} delay={i * 0.2}>
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="h-full p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl dark:shadow-2xl flex flex-col"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center mb-6`}>
                      <pillar.icon size={32} />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{pillar.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1">{pillar.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </section>


          {/* ================= CREATOR STORY SECTION ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32 relative">
            
            <FadeIn>
              <div className="w-full rounded-[3rem] bg-indigo-50/80 dark:bg-slate-950 text-slate-900 dark:text-white p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-indigo-100 dark:border-slate-800 backdrop-blur-xl">
                {/* Background Glows */}
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-600/30 dark:to-purple-600/30 blur-[100px] rounded-full pointer-events-none"
                />
                
                <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start">
                  
                  {/* Left Column: Sticky Profile */}
                  <div className="w-full lg:w-1/3 lg:sticky lg:top-32 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-48 h-48 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-1 mb-8 shadow-2xl transform rotate-3 transition-transform duration-500"
                    >
                      <div className="w-full h-full rounded-[1.8rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-7xl font-black text-slate-900 dark:text-white overflow-hidden relative">
                        <img src="/creator.jpg" alt="Vishal Mall" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-[1.8rem]"></div>
                      </div>
                    </motion.div>
                    
                    <h2 className="text-4xl font-black mb-2"><ShinyText>Vishal Mall</ShinyText></h2>
                    <p className="text-indigo-600 dark:text-indigo-400 text-lg font-bold mb-6 flex items-center gap-2 justify-center lg:justify-start">
                      <Code2 size={20} /> Frontend Developer
                    </p>
                    
                    <div className="flex gap-4 justify-center lg:justify-start w-full">
                      <a href="https://github.com/vishalmall8419" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 flex items-center justify-center text-xl transition-all hover:-translate-y-1 hover:shadow-lg backdrop-blur-md text-slate-700 dark:text-white">
                        <i className="fa-brands fa-github"></i>
                      </a>
                      <a href="https://www.linkedin.com/in/vishal-mall-536506302/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-[#0a66c2]/10 dark:bg-[#0a66c2]/20 hover:bg-[#0a66c2]/20 dark:hover:bg-[#0a66c2]/40 text-[#0a66c2] hover:text-[#0a66c2] dark:hover:text-white flex items-center justify-center text-xl transition-all hover:-translate-y-1 hover:shadow-lg backdrop-blur-md">
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                      <a href="https://x.com/MrVishalMa24207" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 flex items-center justify-center text-xl transition-all hover:-translate-y-1 hover:shadow-lg backdrop-blur-md text-slate-700 dark:text-white">
                        <i className="fa-brands fa-x-twitter"></i>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Story & Tech */}
                  <div className="w-full lg:w-2/3 space-y-16">
                    
                    <FadeIn direction="right">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <Sparkles className="text-indigo-600 dark:text-indigo-400" /> The Journey
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
                        Hello! I am a passionate Frontend Developer currently working at <strong>Starchain Lab</strong> in Bhopal, Madhya Pradesh. I love turning complex problems into simple, beautiful, and intuitive designs.
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                        I built <strong>Stiknex</strong> because I couldn't find a productivity app that felt right. They were all either too slow, too cluttered, or required constant internet connection. So I combined my love for clean UI and performant web technologies to create the ultimate workspace.
                      </p>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.2}>
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Database className="text-cyan-600 dark:text-cyan-400" /> Tech Arsenal
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['React.js', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Java', 'MySQL', 'JavaScript (ES6+)'].map((tech, idx) => (
                          <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.05, backgroundColor: "var(--hover-bg)" }}
                            style={{ "--hover-bg": "rgba(99, 102, 241, 0.1)" }}
                            className="px-4 py-3 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-center text-center cursor-default transition-colors shadow-sm dark:shadow-none"
                          >
                            {tech}
                          </motion.div>
                        ))}
                      </div>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.4}>
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/50 dark:to-purple-900/50 border border-indigo-200 dark:border-indigo-500/30">
                        <h3 className="text-xl font-bold mb-2">Beyond the Screen</h3>
                        <p className="text-slate-700 dark:text-slate-300">
                          When I'm not writing code, I'm an avid reader. I find immense inspiration in books like <em>"Jeet Aapki"</em> by Shiv Khera and the classic <em>"Godan"</em> by Munshi Premchand.
                        </p>
                      </div>
                    </FadeIn>

                  </div>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* ================= ROADMAP & VISION ================= */}
          <section className="max-w-7xl mx-auto px-6 mb-32">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900 dark:text-white">What's Next for Stiknex?</h2>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-8">
              <FadeIn delay={0.1}>
                <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 h-full">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                    <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Cloud Sync & Accounts</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Currently, Stiknex is entirely local-first. We are actively building an optional cloud-sync layer so you can access your sticky boards and notebooks seamlessly across your phone, tablet, and desktop.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-500/20 h-full">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                    <i className="fa-solid fa-users text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Real-time Collaboration</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Brainstorming is better together. We're planning to introduce multiplayer mode, allowing you to invite friends or teammates to edit whiteboards and sticky notes in real-time.
                  </p>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ================= FAQ SECTION ================= */}
          <section className="max-w-4xl mx-auto px-6 mb-32">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </FadeIn>
            
            <div className="space-y-6">
              {[
                { q: "Is Stiknex totally free?", a: "Yes! Currently, all tools, whiteboards, and notebook features are 100% free to use." },
                { q: "Where is my data saved?", a: "Your data is saved locally in your browser's local storage. If you clear your browser data, your notes might be lost. We recommend exporting important work until our cloud sync is released." },
                { q: "Do you have a mobile app?", a: "Stiknex is built as a Progressive Web App (PWA). You can install it directly to your home screen from your mobile browser for an app-like experience!" },
                { q: "How can I support the project?", a: "You can support the development by sharing it with your friends, reporting bugs on Github, or buying me a coffee through the support link!" }
              ].map((faq, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-6 md:p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-sm">
                    <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white flex items-start gap-3">
                      <span className="text-indigo-500">Q.</span> {faq.q}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                      {faq.a}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ================= CTA ================= */}
          <section className="max-w-4xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white">Ready to experience it?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/notes" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center gap-2">
                  <Rocket size={20} /> Launch Workspace
                </Link>
                <a href="mailto:vishal.mall02@outlook.com" className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
                  Contact Me
                </a>
              </div>
            </FadeIn>
          </section>

        </div>
      </div>
    </AppShell>
  );
};

export default About;