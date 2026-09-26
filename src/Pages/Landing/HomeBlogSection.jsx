import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import LazyImage from '../../Component/LazyImage';

const HomeBlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/blogs.json").then(res => res.json()),
      fetch("/data/blogs-2.json").then(res => res.json())
    ]).then(([data1, data2]) => {
      const combined = [...data1, ...data2];
      const shuffled = combined.sort(() => 0.5 - Math.random());
      
      const uniqueCategories = new Set();
      const selected = [];
      
      for (const blog of shuffled) {
        if (!uniqueCategories.has(blog.category)) {
          uniqueCategories.add(blog.category);
          selected.push(blog);
        }
        if (selected.length === 6) break;
      }
      
      if (selected.length < 6) {
        for (const blog of shuffled) {
          if (!selected.includes(blog)) {
            selected.push(blog);
          }
          if (selected.length === 6) break;
        }
      }
      
      setBlogs(selected);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading blog data:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="py-24 px-6 relative z-10 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              Discover Ideas <Sparkles className="text-indigo-500" />
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg max-w-2xl">
              Dive into our latest thoughts on productivity, visual thinking, and design.
            </p>
          </div>
          <Link 
            to="/blog" 
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors whitespace-nowrap"
          >
            View All Articles 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, i) => {
            const img = post.images && post.images.length > 0 ? post.images[0] : '';
            return (
              <motion.article 
                key={post.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="group relative flex flex-col h-[400px] rounded-3xl bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
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
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.briefDescription}
                  </p>
                </div>
                
                <Link to={"/blog/" + post.id} className="absolute inset-0 z-10"></Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
