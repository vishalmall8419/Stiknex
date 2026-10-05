import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, TrendingUp, Search, Map, Calendar, 
  BarChart3, Globe, Flame, Activity, Zap, Star, Target,
  RefreshCcw, Download, CheckCircle, Plus, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip as RechartsTooltip, LineChart, Line, BarChart, Bar, Cell 
} from "recharts";

const TrendsPage = () => {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [country, setCountry] = useState("IN");
  
  const [loading, setLoading] = useState(true);
  const [trendsData, setTrendsData] = useState(null);

  // Pagination states
  const [keywordPage, setKeywordPage] = useState(1);
  const [topicPage, setTopicPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTrends = async (force = false) => {
    setLoading(true);
    try {
      const cacheKey = `trends_${country}_${dateRange}`;
      
      if (!force) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setTrendsData(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/dashboard-trends?geo=${country}`);
      if (!res.ok) throw new Error("Failed to fetch trends");
      const data = await res.json();
      
      if (data.success && data.data) {
        setTrendsData(data.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
      }
    } catch (error) {
      console.error("Trends fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [country, dateRange]);

  const stats = trendsData?.kpis ? trendsData.kpis.slice(0, 4).map(k => ({
    title: k.title, value: k.value, change: k.change, isUp: true, icon: Activity
  })) : [
    { title: "Total Queries", value: "24.5K", change: "+12.5%", isUp: true, icon: Search },
    { title: "Avg. Trend Score", value: "84.2", change: "+5.2%", isUp: true, icon: Activity },
    { title: "Active Topics", value: "142", change: "-2.1%", isUp: false, icon: Target },
    { title: "Growth Rate", value: "18.4%", change: "+4.1%", isUp: true, icon: Zap },
  ];

  const graphData = trendsData?.searchInterestData?.map(d => ({
    name: d.date,
    queries: d.relevant + d.used + d.pending,
    interactions: d.used * 10
  })) || [
    { name: "Mon", queries: 4000, interactions: 2400 },
    { name: "Tue", queries: 3000, interactions: 1398 },
    { name: "Wed", queries: 2000, interactions: 9800 },
    { name: "Thu", queries: 2780, interactions: 3908 },
    { name: "Fri", queries: 1890, interactions: 4800 },
    { name: "Sat", queries: 2390, interactions: 3800 },
    { name: "Sun", queries: 3490, interactions: 4300 },
  ];

  const risingKeywords = trendsData?.topKeywords?.map(k => ({
    keyword: k.kw,
    volume: k.traffic || '1K+',
    increase: k.score > 50 ? `+${Math.floor(Math.random() * 100)}%` : '+10%',
    sparkline: [Math.random()*10, Math.random()*20, Math.random()*30, Math.random()*40, k.score, k.score + 10]
  })) || [
    { keyword: "AI productivity tools", volume: "100K+", increase: "+140%", sparkline: [10, 20, 15, 30, 40, 60, 100] },
    { keyword: "Notepad online free", volume: "50K+", increase: "+80%", sparkline: [20, 25, 30, 28, 35, 45, 50] },
    { keyword: "Excalidraw alternatives", volume: "20K+", increase: "+120%", sparkline: [5, 10, 8, 15, 12, 18, 20] },
  ];

  const trendingTopics = trendsData?.trendingTopics || [
    { topic: "Artificial Intelligence", score: 100, growth: "Breakout" },
    { topic: "Web Development", score: 85, growth: "+250%" },
    { topic: "Productivity", score: 72, growth: "+180%" },
  ];

  const topCategories = [
    { name: "Software", count: 45, color: "#3b82f6" },
    { name: "Technology", count: 32, color: "#8b5cf6" },
    { name: "Business", count: 18, color: "#10b981" },
    { name: "Education", count: 12, color: "#f59e0b" },
    { name: "Design", count: 8, color: "#ef4444" },
  ];

  // Pagination Logic
  const kwTotalPages = Math.ceil(risingKeywords.length / itemsPerPage);
  const kwStartIndex = (keywordPage - 1) * itemsPerPage;
  const kwCurrentItems = risingKeywords.slice(kwStartIndex, kwStartIndex + itemsPerPage);

  const topicTotalPages = Math.ceil(trendingTopics.length / itemsPerPage);
  const topicStartIndex = (topicPage - 1) * itemsPerPage;
  const topicCurrentItems = trendingTopics.slice(topicStartIndex, topicStartIndex + itemsPerPage);

  const cardClass = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-full";
  const headerClass = "text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center justify-between";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Flame className="text-orange-500" size={32} /> Real-Time Trends
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor global search interest and topic momentum.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center p-1">
            <button className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-2">
              <Map size={14} /> Global
            </button>
            <button className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold flex items-center gap-2 transition">
              <Map size={14} /> US
            </button>
            <button className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold flex items-center gap-2 transition">
              <Map size={14} /> IN
            </button>
          </div>
          <button 
            onClick={() => fetchTrends(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-sm"
          >
            <RefreshCcw size={16} /> Sync
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <stat.icon size={20} className="text-indigo-500" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.isUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {stat.change} {stat.isUp ? '↑' : '↓'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{stat.title}</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART SPANS 8 COLS */}
        {/* CHART SPANS 8 COLS */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col min-h-[400px]">
          <h2 className={headerClass}>
            <span className="flex items-center gap-2"><TrendingUp size={16} className="text-indigo-500"/> Search Interest Over Time</span>
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">
              <Calendar size={14} className="text-slate-400" /> Last 7 Days
            </div>
          </h2>
          <div className="w-full mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP CATEGORIES SPANS 4 COLS */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col min-h-[400px]">
           <h2 className={headerClass}>
              <span className="flex items-center gap-2"><BarChart3 size={16} className="text-indigo-500"/> Category Split</span>
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              {topCategories.map((cat, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="text-slate-500">{cat.count}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.count}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
        </div>
        
        {/* RISING KEYWORDS - WITH PAGINATION */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className={headerClass}>
              <span className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500"/> Rising Keywords</span>
              <button className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1">View All <ArrowRight size={14}/></button>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-2 text-xs font-bold text-slate-400">Keyword</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400">Vol</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400">Trend</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {kwCurrentItems.map((kw, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-2 text-sm font-bold text-slate-800 dark:text-slate-200">{kw.keyword}</td>
                      <td className="py-3 px-2 text-sm font-bold text-slate-500">{kw.volume}</td>
                      <td className="py-3 px-2 w-24">
                        <div className="h-6 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kw.sparkline.map((val, idx) => ({name: idx, val}))}>
                              <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm font-bold text-emerald-500 text-right">{kw.increase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {kwTotalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setKeywordPage(p => Math.max(1, p - 1))}
                  disabled={keywordPage === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-bold text-slate-500">Page {keywordPage} of {kwTotalPages}</span>
                <button 
                  onClick={() => setKeywordPage(p => Math.min(kwTotalPages, p + 1))}
                  disabled={keywordPage === kwTotalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
        </div>

        {/* TRENDING TOPICS - WITH PAGINATION */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className={headerClass}>
              <span className="flex items-center gap-2"><Target size={16} className="text-orange-500"/> Trending Topics</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-2 text-xs font-bold text-slate-400 w-8">#</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400">Topic</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400">Interest</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topicCurrentItems.map((t, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-2 text-sm font-bold text-slate-400">{topicStartIndex + i + 1}</td>
                      <td className="py-3 px-2 text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Globe size={14} className="text-slate-400"/> {t.topic}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-900 dark:text-white w-8">{t.score}</span>
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[60px]">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${t.score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm font-bold text-emerald-500 text-right">{t.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {topicTotalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setTopicPage(p => Math.max(1, p - 1))}
                  disabled={topicPage === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-bold text-slate-500">Page {topicPage} of {topicTotalPages}</span>
                <button 
                  onClick={() => setTopicPage(p => Math.min(topicTotalPages, p + 1))}
                  disabled={topicPage === topicTotalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TrendsPage;
