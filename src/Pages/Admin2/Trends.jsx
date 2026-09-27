import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, TrendingUp, Search, Map, Calendar, 
  BarChart3, Globe, Flame, Activity, Zap, Star, Target,
  RefreshCcw, Download, CheckCircle, Plus
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

  const fetchTrends = async (force = false) => {
    setLoading(true);
    try {
      const cacheKey = `trends_${country}_${dateRange}`;
      
      // Binary search concept / Quick retrieval from Session Storage (Cache)
      if (!force) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setTrendsData(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/dashboard-trends?geo=${country}`);
      const json = await res.json();
      if (json.success) {
        setTrendsData(json.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
      }
    } catch (err) {
      console.error("Error fetching trends:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrends();
  }, [country, dateRange]);

  const headerClass = "text-[11px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-between";
  const cardClass = "bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-2xl p-4 backdrop-blur-md shadow-sm flex flex-col";
  
  // Base static fallback structure for icons and colors
  const defaultKpis = [
    { title: "Trending Searches", color: "#f97316", icon: Flame },
    { title: "Top Rising Topics", color: "#10b981", icon: TrendingUp },
    { title: "Sticker Related Searches", color: "#8b5cf6", icon: Search },
    { title: "Trending Categories", color: "#ec4899", icon: BarChart3 },
    { title: "Avg. Search Interest", color: "#3b82f6", icon: Activity },
    { title: "Opportunity Score", color: "#10b981", icon: Target }
  ];

  const generateSparkData = (base) => Array.from({length: 15}).map((_, i) => ({ value: base + Math.random() * 20 + i * 2 }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md p-2 rounded-lg shadow-xl text-[10px] z-50">
        <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1 border-b border-slate-200/50 dark:border-slate-700/50 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-slate-900 dark:text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading && !trendsData) {
    return (
      <main className="relative z-10 min-h-screen flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-500 font-bold animate-pulse">Fetching Realtime Data from Google Trends API...</p>
         </div>
      </main>
    );
  }

  const { searchInterestData, topStates, relatedQueries, trendingTopics, trendingCategories, topKeywords, kpis } = trendsData;

  // Merge static UI properties with fetched API values
  const displayKpis = defaultKpis.map((base, i) => ({
      ...base,
      value: kpis?.[i]?.value || "0",
      change: kpis?.[i]?.change || "0%"
  }));

  return (
    <main className="relative z-10 min-h-screen text-slate-800 dark:text-white bg-transparent font-sans">
      <div className="flex-1 overflow-x-hidden p-3 lg:p-6 pb-20 mt-16 max-w-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-orange-500" /> Trends
            </h1>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">Live Google Trends Intelligence & SEO Impact</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none">
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
            </select>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none">
              <option value="Last 30 days">Last 30 days</option>
            </select>
            <button onClick={() => fetchTrends(true)} className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-transform active:scale-95"><RefreshCcw size={12} className={loading ? "animate-spin" : ""} /></button>
          </div>
        </div>

        {/* ROW 1: 6 KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
          {displayKpis.map((kpi, i) => (
            <div key={i} className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-xl p-2 backdrop-blur-md flex flex-col justify-between h-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800" style={{color: kpi.color}}><kpi.icon size={12} /></div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{kpi.title}</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{kpi.value}</span>
                  <span className={`text-[9px] font-bold ${kpi.change === 'High' ? 'text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'}`}>{kpi.change}</span>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateSparkData(30)}>
                      <defs>
                        <linearGradient id={`grad-kpi-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={kpi.color} stopOpacity={0.3}/><stop offset="95%" stopColor={kpi.color} stopOpacity={0}/></linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={kpi.color} strokeWidth={1.5} fillOpacity={1} fill={`url(#grad-kpi-${i})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {kpi.title === "Opportunity Score" && (
                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-2">
                   <div className="bg-emerald-500 h-1 rounded-full" style={{width: '82%'}}></div>
                 </div>
              )}
            </div>
          ))}
        </div>

        {/* ROW 2: LINE CHART, MAP, TRAFFIC POTENTIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0 mb-3">
          
          {/* SEARCH INTEREST OVER TIME */}
          <div className={`${cardClass} lg:col-span-6`}>
            <h2 className={headerClass}><span className="flex items-center gap-1.5"><BarChart3 size={14} className="text-orange-500"/> Search Interest Over Time (Last 30 Days)</span></h2>
            <div className="flex flex-wrap gap-3 mb-2 px-2">
              <span className="text-[9px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-blue-500"></div> sticker</span>
              <span className="text-[9px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-orange-500"></div> sticker maker</span>
              <span className="text-[9px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> custom stickers</span>
              <span className="text-[9px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-pink-500"></div> ai stickers</span>
              <span className="text-[9px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-amber-500"></div> anime stickers</span>
            </div>
            <div className="h-[220px] w-full min-w-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={searchInterestData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="pending" name="Pending" name="Sticker" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{r:4}} />
                  <Line type="monotone" dataKey="relevant" name="Relevant" name="Sticker Maker" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="used" name="Used" name="Custom Stickers" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="" name="AI Stickers" stroke="#ec4899" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="" name="Anime Stickers" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP KEYWORDS BY SCORE */}
          <div className={`${cardClass} lg:col-span-3`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><Map size={14} className="text-orange-500"/> Interest by Region</span>
              <select className="bg-slate-100 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded focus:outline-none border-none"><option>sticker maker</option></select>
            </h2>
            <div className="flex-1 overflow-y-auto mt-2 pr-1">
              <div className="text-[10px] font-bold text-slate-500 mb-2">Top States in {country}</div>
              <div className="flex flex-col gap-3">
                {topStates.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-2">{i+1}</span>
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{s.state}</span>
                    </div>
                    <div className="flex items-center gap-2 w-1/2 justify-end">
                      <span className="text-slate-900 dark:text-white">{s.score}</span>
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{width: `${s.score}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-400">
               <span>Low interest</span>
               <div className="flex-1 mx-2 h-1 bg-gradient-to-r from-orange-100 to-orange-500 rounded-full"></div>
               <span>High interest</span>
            </div>
          </div>

          {/* TRAFFIC POTENTIAL */}
          <div className={`${cardClass} lg:col-span-3`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><Search size={14} className="text-slate-400"/> Related Queries</span>
              <select className="bg-slate-100 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded focus:outline-none border-none"><option>Top / Rising</option></select>
            </h2>
            <div className="flex-1 overflow-y-auto mt-1 pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Query</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth / Index</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedQueries.map((q, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{q.query}</td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{q.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROW 3: COMPARE, TOPICS, CATEGORIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0 mb-3">
          
          {/* TRENDING TOPICS */}
          <div className={`${cardClass} lg:col-span-6`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><Target size={14} className="text-orange-500"/> Trending Topics</span>
              <div className="flex gap-2">
                <select className="bg-slate-100 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded focus:outline-none border-none"><option>{country}</option></select>
              </div>
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 w-6">#</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Topic</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Search Interest</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingTopics.map((t, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-400">{i+1}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Globe size={12} className="text-slate-400"/> {t.topic}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{t.score}</span>
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${t.score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{t.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TRENDING CATEGORIES */}
          <div className={`${cardClass} lg:col-span-6`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><BarChart3 size={14} className="text-orange-500"/> Trending Categories</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Category</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Search Interest</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingCategories.map((c, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Star size={12} className="text-slate-400"/> {c.cat}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{c.score}</span>
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${c.score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{c.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROW 4: BOTTOM TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
          
          {/* TOP KEYWORDS */}
          <div className={`${cardClass} lg:col-span-4`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><Search size={14} className="text-orange-500"/> Top Keywords</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Keyword</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Search Interest</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map((k, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{k.kw}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{k.score}</span>
                          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${k.score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{k.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RISING SEARCH QUERIES */}
          <div className={`${cardClass} lg:col-span-4`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-orange-500"/> Rising Search Queries</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Query</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Search Interest</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedQueries.map((q, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{q.query}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{100 - i*8}</span>
                          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${100 - i*8}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{q.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP RELATED TOPICS */}
          <div className={`${cardClass} lg:col-span-4`}>
            <h2 className={headerClass}>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-orange-500"/> Top Related Topics</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Topic</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400">Search Interest</th>
                    <th className="py-2 text-[9px] font-extrabold text-slate-400 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingTopics.map((t, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{t.topic}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{t.score}</span>
                          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${t.score}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[10px] font-bold text-emerald-500 text-right">{t.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default TrendsPage;