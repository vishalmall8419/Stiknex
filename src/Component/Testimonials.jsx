import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews?public=true')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.testimonials || data.reviews || []);
        if (list.length > 0) {
          setTestimonials(list);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">Loved by creators worldwide</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">See what the community is saying about Stiknex.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 p-8 rounded-[2rem] h-[220px] animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                  ))}
                </div>
                <div className="w-3/4 h-3 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
                <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-slate-800 mb-6" />
                <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))
          ) : (
            testimonials.map((testi, i) => (
              <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                <Quote size={80} className="absolute -top-4 -right-4 text-indigo-500/10 dark:text-indigo-400/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                <div className="flex gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill={idx < testi.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic relative z-10">"{testi.message || testi.content}"</p>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{testi.userName || testi.name || 'Anonymous'}</h3>
                  <p className="text-xs text-indigo-500 font-semibold">{testi.tool || 'Stiknex'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;