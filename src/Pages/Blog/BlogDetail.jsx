import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Calendar, Tag, Languages } from 'lucide-react';
import LazyImage from '../../Component/LazyImage';
import PageSEO from '../../Component/SEO/PageSEO';

const AuroraBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-size-[40px_40px] opacity-40"></div>
  </div>
));

const BlogDetail = () => {
  const { id } = useParams();

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
      
      const paragraphs = post.fullDescription.split('\n');
      const tParagraphs = [];
      
      // Translate in batches to avoid overwhelming the free API
      for (let i = 0; i < paragraphs.length; i++) {
        tParagraphs.push(await translateText(paragraphs[i]));
      }
      
      setTranslatedContent({
        title: tTitle,
        briefDescription: tDesc,
        fullDescription: tParagraphs.join('\n')
      });
    } catch (error) {
      alert("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetch("/data/blogs.json").then(res => res.json()),
      fetch("/data/blogs-2.json").then(res => res.json())
    ]).then(([data1, data2]) => {
      const combined = [...data1, ...data2];
      const found = combined.find(b => b.id.toString() === id);
      setPost(found);
      setLoading(false);
    }).catch(err => {
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

  const coverImage = post.images && post.images.length > 0 ? post.images[0] : '';

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans pb-24">
      <PageSEO title={`${post.title} | Stiknex`} description={post.briefDescription} path={`/blog/${id}`} />
      <AuroraBackground />

      <main className="pt-24 md:pt-32 px-6 max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:-translate-x-2 transition-transform">
            <ArrowLeft size={20} /> Back to Articles
          </Link>
          
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors shadow-sm disabled:opacity-70"
          >
            {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Languages size={18} />}
            {isTranslating ? "Translating..." : (translatedContent ? "Read in English" : "Read in Hindi (हिंदी)")}
          </button>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-slate-900 dark:text-white">
            {translatedContent ? translatedContent.title : post.title}
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-12">
            {translatedContent ? translatedContent.briefDescription : post.briefDescription}
          </p>
        </motion.div>


        {coverImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[40vh] md:h-[60vh] rounded-[2rem] overflow-hidden shadow-2xl mb-16 border border-slate-200/50 dark:border-slate-800/50"
          >
            <LazyImage src={coverImage} alt={post.title} className="w-full h-full" />
          </motion.div>
        )}

        <motion.article 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-sm text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-6"
        >
          {(translatedContent ? translatedContent.fullDescription : post.fullDescription).split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 last:mb-0 text-lg md:text-xl">
              {paragraph}
            </p>
          ))}

          {/* Render any additional images if they exist */}
          {post.images && post.images.length > 1 && (
            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-8 not-prose">
              {post.images.slice(1).map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden h-64 shadow-md border border-slate-200 dark:border-slate-800">
                  <LazyImage src={img} alt={`Related to ${post.title}`} className="w-full h-full" />
                </div>
              ))}
            </div>
          )}

          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 not-prose">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mr-2 font-medium">
                <Tag size={18} /> Tags:
              </span>
              {post.keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </motion.article>
      </main>
    </div>
  );
};

export default BlogDetail;

