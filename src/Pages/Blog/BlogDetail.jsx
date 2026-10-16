import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Calendar, Tag, Languages, Sparkles, Zap } from 'lucide-react';
import LazyImage from '../../Component/LazyImage';
import PageSEO from '../../Component/SEO/PageSEO';
import { useAppContext } from '../../context/AppContext';

const AuroraBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-size-[40px_40px] opacity-40"></div>
  </div>
));

const BlogDetail = () => {
  const { id } = useParams();
  const { darkMode, toggleDarkMode } = useAppContext();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);

  const translateText = async (text) => {
    if (!text.trim()) return '';
    try {
      const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=' + encodeURIComponent(text));
      const data = await res.json();
      return data[0].map(item => item[0]).join('');
    } catch (e) {
      console.error('Translation error:', e);
      return text;
    }
  };

  const handleTranslate = async () => {
    if (translatedContent) {
      setTranslatedContent(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      const tTitle = await translateText(post.title);
      const tDesc = await translateText(post.briefDescription);
      
      const paragraphs = post.fullContent.split('\n');
      const tParagraphs = [];
      
      // Translate in batches to avoid overwhelming the free API
      for (let i = 0; i < paragraphs.length; i++) {
        tParagraphs.push(await translateText(paragraphs[i]));
      }
      
      setTranslatedContent({
        title: tTitle,
        briefDescription: tDesc,
        fullContent: tParagraphs.join('\n')
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    fetch(`/api/blogs?slug=${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(data => {
        if (data) {
          setPost({
            id: data.slug,
            title: data.title,
            briefDescription: data.excerpt,
            fullContent: data.content,
            image: data.imageUrl,
            category: data.category || "Trending",
            keywords: data.tags || []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading blog details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Article Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">We couldn't find the article you're looking for. It might have been removed or the URL is incorrect.</p>
        <Link to="/blog" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  const coverImage = post.image || '';

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans pb-16">
      <PageSEO title={`${post.title} | Stiknex`} description={post.briefDescription} path={`/blog/${id}`} />
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

      <main className="pt-28 md:pt-36 px-6 max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:-translate-x-2 transition-transform text-sm sm:text-base">
            <ArrowLeft size={18} /> Back to Articles
          </Link>
          
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors shadow-sm disabled:opacity-70 text-xs sm:text-sm"
          >
            {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
            {isTranslating ? "Translating..." : (translatedContent ? "Read in English" : "Read in Hindi (हिंदी)")}
          </button>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Calendar size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
            {translatedContent ? translatedContent.title : post.title}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-10">
            {translatedContent ? translatedContent.briefDescription : post.briefDescription}
          </p>
        </motion.div>

        {coverImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[35vh] sm:h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-200/50 dark:border-slate-800/50"
          >
            <LazyImage src={coverImage} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <motion.article 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 sm:p-10 md:p-12 rounded-3xl border border-white/50 dark:border-slate-800/80 shadow-md text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-6"
        >
          {(translatedContent ? translatedContent.fullContent : post.fullContent).split('\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return null;
            let html = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 decoration-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 hover:decoration-indigo-600 transition-colors' target='_blank' rel='noopener noreferrer'>$1</a>");
            if (html.startsWith("# ")) {
              return <h2 key={idx} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-10 mb-4">{html.replace(/^# /, '')}</h2>;
            }
            if (html.startsWith("## ")) {
              return <h3 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3">{html.replace(/^## /, '')}</h3>;
            }
            return <p key={idx} className="mb-6 last:mb-0 text-base sm:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
          })}

          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 not-prose">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mr-2 font-medium text-sm">
                <Tag size={16} /> Tags:
              </span>
              {post.keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </motion.article>
      </main>

      {/* Global Clean Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 text-center relative z-10 backdrop-blur-md">
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

export default BlogDetail;
