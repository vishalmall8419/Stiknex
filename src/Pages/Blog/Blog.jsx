import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowRight, Sparkles, Zap, Coffee, BookOpen, Loader2, ChevronRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import LazyImage from "../../Component/LazyImage";

const TiltCard = lazy(() => import("./TiltCard"));
const CardDeck = lazy(() => import("./CardDeck"));

gsap.registerPlugin(ScrollTrigger);

// Pure component to prevent unnecessary re-renders of background
const AuroraBackground = React.memo(() => (
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
));

const Blog = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const observerTarget = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const [blogsData, setBlogsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Fast loading using native fetch instead of Vite import transpilation
  useEffect(() => {
    Promise.all([
      fetch("/data/blogs.json").then(res => res.json()),
      fetch("/data/blogs-2.json").then(res => res.json())
    ]).then(([data1, data2]) => {
      // Small optimization: avoid full copy if not needed, but required for shuffle
      const combined = [...data1, ...data2];
      const shuffled = combined.sort(() => 0.5 - Math.random());
      
      setBlogsData(shuffled);
      setIsDataLoaded(true);
    }).catch(err => {
      console.error("Error loading blogs JSON:", err);
      setIsDataLoaded(true); // Prevent infinite loading if fails
    });
  }, []);
  
  // Memoize sliced arrays to prevent re-mapping on simple re-renders
  const featuredPosts = useMemo(() => blogsData.slice(0, 5), [blogsData]);
  const deepDives = useMemo(() => blogsData.slice(5, 10), [blogsData]);
  const bentoPosts = useMemo(() => blogsData.slice(10, 14), [blogsData]);
  const gridPosts = useMemo(() => blogsData.slice(14, visibleCount), [blogsData, visibleCount]);
  
  useEffect(() => {
    if (!isDataLoaded) return;
    
    // Smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Context scoping for GSAP prevents memory leaks
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.1 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (horizontalRef.current && horizontalContainerRef.current) {
          const cards = gsap.utils.toArray('.horizontal-card');
          const totalWidth = horizontalContainerRef.current.scrollWidth;
          const scrollDist = totalWidth - window.innerWidth + 200;
          
          gsap.to(cards, {
            x: -scrollDist,
            ease: "none",
            scrollTrigger: {
              trigger: horizontalRef.current,
              pin: true,
              scrub: 1,
              start: "center center",
              end: () => `+=${scrollDist}`
            }
          });
        }
      });
      
      // Entrance animation for first batch
      
      
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [isDataLoaded]);

  // Intersection Observer for infinite scrolling (debounced implicitly by threshold)
  useEffect(() => {
    if (!isDataLoaded) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < blogsData.length) {
          setVisibleCount(prev => Math.min(prev + 12, blogsData.length));
        }
      },
      { threshold: 0.1, rootMargin: "300px" } // Pre-load earlier
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isDataLoaded, visibleCount, blogsData.length]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans">
      <PageSEO title="Blog | Stiknex" description="Read the latest updates, tutorials, and productivity tips from the Stiknex team." path="/blog" />
      <AuroraBackground />

      {/* Floating Navbar */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-3 min-[350px]:px-4 py-2 sm:px-6 sm:py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-2 min-[350px]:gap-3 sm:gap-8 w-max max-w-[95vw]">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
          <img src="/logo.png" alt="Stiknex Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
          <span className="font-extrabold text-base min-[350px]:text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600">Stiknex</span>
        </Link>
        <div className="flex gap-2 min-[350px]:gap-3 sm:gap-4 items-center">
          <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
            {darkMode ? <Sparkles size={14} className="min-[350px]:w-4 min-[350px]:h-4 sm:w-4.5 sm:h-4.5" /> : <Zap size={14} className="min-[350px]:w-4 min-[350px]:h-4 sm:w-4.5 sm:h-4.5" />}
          </button>
          <Link to="/" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Home</Link>
          <span className="hidden min-[350px]:block text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">Blog</span>
          <Link to="/notes" className="px-2.5 py-1 min-[350px]:px-3 min-[350px]:py-1.5 sm:px-4 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] min-[350px]:text-xs sm:text-sm font-semibold transition-transform hover:scale-105 shadow-md whitespace-nowrap">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-10 px-6 min-h-[40vh] flex flex-col items-center justify-center">
        <motion.div style={{ y }} className="max-w-4xl mx-auto text-center z-10 w-full hero-text">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm mb-6 sm:mb-8 border border-indigo-100 dark:border-indigo-500/20 shadow-sm mx-auto max-w-full">
            <BookOpen size={16} className="shrink-0" /> Stiknex Blog
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.05] text-slate-900 dark:text-white">
            Where Ideas <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
              Take Shape.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium px-4">
            Explore {blogsData.length} articles on visual thinking, infinite canvas strategies, and next-gen productivity workflows.
          </p>
        </motion.div>
      </section>

      {/* Framer Card Deck Section */}
      <section className="py-20 px-6 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 text-center">
          Interactive Card Deck
        </h2>
        <div className="w-full max-w-4xl h-125 flex items-center justify-center relative">
          <Suspense fallback={<div className="animate-pulse w-full h-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>}>
            <CardDeck />
          </Suspense>
        </div>
      </section>

      {/* 1. GSAP Horizontal Scroll */}
      <section ref={horizontalRef} className="relative h-screen flex flex-col justify-center overflow-hidden py-10">
        <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-950/50 -z-10 skew-y-3 transform origin-top-left"></div>
        <div className="px-6 md:px-12 xl:px-24 mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-4">
            Featured Spotlights <Sparkles className="text-indigo-500" />
          </h2>
        </div>
        
        <div className="overflow-hidden w-full pl-6 md:pl-12 xl:pl-24">
          <div ref={horizontalContainerRef} className="flex gap-6 md:gap-10 w-max pr-24">
            {featuredPosts.map((post) => {
              const img = post.images && post.images.length > 0 ? post.images[0] : '';
              return (
              <div 
                key={post.id} 
                className="horizontal-card w-[85vw] md:w-150 lg:w-175 h-[50vh] md:h-[60vh] shrink-0 relative rounded-3xl overflow-hidden group shadow-2xl"
              >
                <LazyImage src={img} alt={post.title} className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white text-slate-900 mb-4 w-max">
                    {post.category}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{post.title}</h3>
                  <p className="text-slate-300 md:text-lg line-clamp-2 max-w-2xl mb-6">{post.briefDescription}</p>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-white font-bold hover:text-indigo-300 transition-colors w-max">
                    READ STORY <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* 2. Stack Flow Cards */}
      <section className="py-32 px-6 relative max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">The Deep Dives</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Scroll down to stack these comprehensive guides.</p>
        </div>
        
        <div className="relative pb-32">
          {deepDives.map((post, i) => {
            const img = post.images && post.images.length > 0 ? post.images[0] : '';
            return (
            <div 
              key={post.id} 
              className="sticky shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl mb-12 flex flex-col md:flex-row group"
              style={{
                top: `calc(10vh + ${i * 25}px)`,
                zIndex: i,
                height: 'min(60vh, 450px)'
              }}
            >
              <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden">
                <LazyImage src={img} alt={post.title} className="w-full h-full group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">{post.category}</span>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{post.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg line-clamp-3 mb-8">{post.briefDescription}</p>
                <Link to={`/blog/${post.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform w-max">
                  Read Full Guide
                </Link>
              </div>
            </div>
          )})}
        </div>
      </section>

      {/* 3. 3D Tilt Bento Grid */}
      <section className="py-24 px-6 relative z-10 bg-slate-100/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Editor's Picks</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bentoPosts.map((post, i) => (
              <div key={post.id} className={`${i === 0 || i === 3 ? 'lg:col-span-2' : 'lg:col-span-1'} md:col-span-1`}>
                <Suspense fallback={<div className="animate-pulse w-full h-100 bg-slate-200 dark:bg-slate-800 rounded-4xl"></div>}>
                  <TiltCard post={post} />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Infinite Scroll Grid */}
      <section id="infinite-grid" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12">All Articles</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gridPosts.map((post) => {
              const img = post.images && post.images.length > 0 ? post.images[0] : '';
              return (
              <motion.article 
                key={post.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid-card group relative flex flex-col h-100 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="w-full h-48 overflow-hidden relative shrink-0">
                  <LazyImage src={img} alt={post.title} className="w-full h-full relative z-10 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                    {post.briefDescription}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Read <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
                
                <Link to={`/blog/${post.id}`} className="absolute inset-0 z-10"></Link>
              </motion.article>
            )})}
          </div>
          
          <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-12">
            {visibleCount < blogsData.length ? (
              <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <span className="font-medium text-sm">Loading more stories...</span>
              </div>
            ) : (
              <div className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium text-sm">
                You've reached the end!
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 text-center relative z-10">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Crafted with <Coffee size={16} className="inline mx-1 text-amber-600" /> and passion by 
          <a href="https://vishalmall.vercel.app/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1 font-bold">Vishal Mall</a>
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">&copy; {new Date().getFullYear()} Stiknex. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default React.memo(Blog);



