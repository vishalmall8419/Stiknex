import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowRight, Sparkles, Zap, BookOpen, Loader2, Search, Clock, Calendar } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import LazyImage from "../../Component/LazyImage";

// Smooth ambient gradient background
const AuroraBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-[size:40px_40px] opacity-40"></div>
    
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
  const observerTarget = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  const [blogsData, setBlogsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(18);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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
      })
      .catch(err => {
        console.error("Error loading blogs:", err);
        setIsDataLoaded(true);
      });
  }, []);
  
  // Smooth scroll init
  useEffect(() => {
    if (!isDataLoaded) return;
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

    return () => lenis.destroy();
  }, [isDataLoaded]);

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

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans">
      <PageSEO
        title="Blog – Productivity Tips, Notes & Tools Guides | Stiknex"
        description="Read the Stiknex blog for productivity tips, note-taking guides, digital workspace advice, and tutorials on sticky notes, notebooks, whiteboards and online tools."
        path="/blog"
        type="website"
        keywords="productivity blog, note taking tips, sticky notes guide, online tools blog, digital workspace tips, stiknex blog"
      />
      <AuroraBackground />

      {/* Clean Global Navbar */}
      <nav className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-6 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-full shadow-lg flex items-center gap-2 sm:gap-6 max-w-[96vw] overflow-x-auto no-scrollbar">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
          <img src="/logo.png" alt="Stiknex Logo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-black text-sm sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Stiknex</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-4 shrink-0 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/sticky-notes" className="px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Sticky Notes</Link>
          <Link to="/online-notebook" className="px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Notepad</Link>
          <Link to="/whiteboard" className="px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Whiteboard</Link>
          <Link to="/tools" className="px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Tools</Link>
          <Link to="/blog" className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap">Blog</Link>
          <Link to="/about" className="px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">About</Link>
        </div>
        <div className="flex items-center gap-2 shrink-0 pl-1 border-l border-slate-200 dark:border-slate-800">
          <button onClick={toggleDarkMode} className="p-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Dark Mode">
            {darkMode ? <Sparkles size={16} /> : <Zap size={16} />}
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-36 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <motion.div style={{ y }} className="max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <BookOpen size={16} /> Stiknex Articles & Guides
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            Productivity, Thought & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Visual Workspaces.
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
              <Link to={`/blog/${featuredPost.id}`} className="block relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
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
