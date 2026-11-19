import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowRight, Sparkles, Zap, BookOpen, Search, Clock, Calendar, Loader2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import LazyImage from "../../Component/LazyImage";
import initialBlogs from "./initialBlogs.json";

const BrushUnderline = ({ className = "text-indigo-500" }) => (
  <svg className={`absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 pointer-events-none ${className}`} viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
    <path d="M 5 14 Q 75 4, 150 11 Q 225 18, 295 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85"/>
  </svg>
);

// Smooth ambient gradient background with Advapay floating orbs
const StudioBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc] dark:bg-[#080b14] transition-colors duration-300">
    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-40"></div>
    <div className="absolute -top-24 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 via-blue-600/15 to-transparent blur-[90px] transform-gpu pointer-events-none"></div>
    <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-purple-500/15 via-indigo-500/10 to-transparent blur-[85px] transform-gpu pointer-events-none"></div>
  </div>
));

const Blog = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const containerRef = useRef(null);
  const observerTarget = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  const [blogsData, setBlogsData] = useState(() => {
    try {
      const cached = localStorage.getItem("stiknex_cached_blogs");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialBlogs;
  });
  const [visibleCount, setVisibleCount] = useState(18);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.ok ? res.json() : [])
      .then(dynamicBlogs => {
        const formatted = dynamicBlogs.map(b => ({
          id: b.slug,
          title: b.title,
          briefDescription: b.excerpt || (b.content ? b.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : ''),
          image: b.imageUrl || (b.images && b.images[0]) || '/logo.png',
          date: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
          category: b.category || "Productivity",
          readTime: b.readTime || "5 min read",
        }));
        setBlogsData(formatted);
        setIsDataLoaded(true);
        try {
          localStorage.setItem("stiknex_cached_blogs", JSON.stringify(formatted));
        } catch {}
      })
      .catch(err => {
        console.error("Error loading blogs:", err);
        setIsDataLoaded(true);
      });
  }, []);
  
  // Dynamic smooth scroll initialization (non-blocking for fast initial render)
  useEffect(() => {
    let lenisInstance = null;
    let rafId = null;

    import("lenis").then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        wheelMultiplier: 1,
      });

      function raf(time) {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }).catch(() => {});

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    blogsData.forEach(b => { if (b.category) set.add(b.category); });
    return Array.from(set);
  }, [blogsData]);

  // Filtered blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return blogsData.filter(b => {
      const matchesCat = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery || 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.briefDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [blogsData, selectedCategory, searchQuery]);

  const featuredPost = filteredBlogs[0];
  const sideSpotlights = filteredBlogs.slice(1, 3);
  const remainingPosts = filteredBlogs.slice(3, visibleCount);

  // Infinite scroll
  useEffect(() => {
    if (!isDataLoaded) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < filteredBlogs.length) {
          setVisibleCount(prev => Math.min(prev + 12, filteredBlogs.length));
        }
      },
      { threshold: 0.1, rootMargin: "250px" }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isDataLoaded, visibleCount, filteredBlogs.length]);



  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-clip text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans">
      <PageSEO
        title="Blog – Productivity Tips, Notes & Tools Guides | Stiknex"
        description="Read the Stiknex blog for productivity tips, note-taking guides, digital workspace advice, and tutorials on sticky notes, notebooks, whiteboards and online tools."
        path="/blog"
        type="website"
        keywords="productivity blog, note taking tips, sticky notes guide, online tools blog, digital workspace tips, stiknex blog"
      />
      <StudioBackground />

      {/* Desktop Navigation Pill (Hidden on phone: hidden md:flex) */}
      <nav className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-full shadow-lg items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img src="/logo.png" alt="Stiknex Logo" className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Stiknex</span>
        </Link>
        <div className="flex items-center gap-2 shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/sticky-notes" className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Sticky Notes</Link>
          <Link to="/online-notebook" className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Notepad</Link>
          <Link to="/whiteboard" className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Whiteboard</Link>
          <Link to="/tools" className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Tools</Link>
          <Link to="/blog" className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap">Blog</Link>
          <Link to="/about" className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">About</Link>
        </div>
        <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-slate-200 dark:border-slate-800">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Toggle Dark Mode">
            {darkMode ? <Sparkles size={16} /> : <Zap size={16} />}
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-20 md:pt-36 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <motion.div style={{ y }} className="max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <BookOpen size={16} /> Stiknex Articles & Guides
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight text-slate-900 dark:text-white">
            Productivity, Thought &amp; <br className="hidden sm:inline" />
            <span className="relative inline-block text-indigo-600 dark:text-indigo-400">
              Visual Workspaces.
              <BrushUnderline className="text-indigo-500/80 dark:text-indigo-400/80" />
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Insights, tutorials, and practical strategies on note-taking, productivity workflows, calculators, and free online utilities.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, calculators, and workflows..."
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md text-sm sm:text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Editorial Stats Bar (Inspired by Pin 1) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {blogsData.length} Published Guides</span>
            <span>•</span>
            <span>Zero Paywalls</span>
            <span>•</span>
            <span>5-Min Average Read</span>
          </div>
        </motion.div>
      </header>

      {/* Featured Editorial Spotlight (Clean Vertical Flow, No Horizontal Pinning) */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-amber-500" size={20} />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Featured Stories</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Big Feature */}
            <div className="lg:col-span-7 group">
              <Link to={`/blog/${featuredPost.id}`} className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-16/9 sm:aspect-21/9 lg:aspect-16/9 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <LazyImage
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {featuredPost.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {featuredPost.readTime}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {featuredPost.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredPost.briefDescription}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Side Spotlights */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {sideSpotlights.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group flex flex-col sm:flex-row lg:flex-row gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex-1"
                >
                  <div className="w-full sm:w-44 lg:w-44 h-40 sm:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                    <LazyImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                        {post.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-2">
                        {post.briefDescription}
                      </p>
                    </div>
                    <div className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      Read story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">All Articles</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredBlogs.length} articles</p>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No articles found</p>
            <p className="text-sm text-slate-500">Try adjusting your search terms or selecting another category.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {remainingPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0">
                  <LazyImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {post.briefDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Read Article</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="w-full py-12 flex items-center justify-center">
          {visibleCount < filteredBlogs.length ? (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <Loader2 size={20} className="animate-spin text-indigo-500" />
              <span>Loading more articles...</span>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium">
              You've viewed all available articles
            </div>
          ) : null}
        </div>
      </section>

      {/* Global Clean Footer */}
      <footer className="py-12 px-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 text-center relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/sticky-notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sticky Notes</Link>
            <Link to="/online-notebook" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Notepad</Link>
            <Link to="/whiteboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Whiteboard</Link>
            <Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tools</Link>
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
          </div>
          <div>
            <a href="https://vishalmall.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold mr-3">
              Developer
            </a>
            <span>&copy; {new Date().getFullYear()} Stiknex. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default React.memo(Blog);
