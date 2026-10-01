import React, { useState, useEffect } from 'react';
import { Target, Search, BarChart3, Clock, CheckCircle, PenTool, Hash, Filter, Zap, LayoutTemplate } from "lucide-react";

const SEOOpportunities = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, relevant, used

  const fetchOpportunities = async (force = false) => {
    setLoading(true);
    try {
      const cacheKey = 'seo_opportunities_cache';
      
      if (!force) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setTrends(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem("stkx_admin_token");
      const res = await fetch("/api/trends-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setTrends(json.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("stkx_admin_token");
      const res = await fetch(`/api/trends-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) { fetchOpportunities(true); }
    } catch (err) {
      console.error(err);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  
  // O(N log N) Sorting once, for O(log N) searches later
  const sortedTrends = React.useMemo(() => {
    return [...trends].sort((a, b) => a.keyword.localeCompare(b.keyword));
  }, [trends]);

  // Binary Search Implementation for Prefix Matching O(log N)
  const performBinarySearch = (query) => {
    if (!query) return trends.filter(t => t.status === activeTab); // Default filter
    
    const target = query.toLowerCase();
    let left = 0;
    let right = sortedTrends.length - 1;
    let resultIndex = -1;

    // 1. Binary Search to find the first lower bound (O(log N))
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midVal = sortedTrends[mid].keyword.toLowerCase();
      
      if (midVal >= target) {
        resultIndex = mid;
        right = mid - 1; // Keep searching left for the absolute first occurrence
      } else {
        left = mid + 1;
      }
    }

    if (resultIndex === -1) return [];

    // 2. Collect all consecutive matching prefixes
    const results = [];
    for (let i = resultIndex; i < sortedTrends.length; i++) {
      if (sortedTrends[i].keyword.toLowerCase().startsWith(target)) {
        if (sortedTrends[i].status === activeTab) {
          results.push(sortedTrends[i]);
        }
      } else {
        break; // Stop immediately when prefix no longer matches (Massive performance boost over Array.filter)
      }
    }
    return results;
  };

  const filteredTrends = performBinarySearch(searchQuery);

  const getIntentColor = (intent) => {
    if (intent === 'Informational') return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400';
    if (intent === 'Transactional') return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400';
    if (intent === 'Navigational') return 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400';
    return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
  };

  const getSuggestionIcon = (type) => {
    if (type === 'Blog') return <PenTool size={12} />;
    if (type === 'Tool Page') return <Zap size={12} />;
    if (type === 'Existing Content') return <LayoutTemplate size={12} />;
    return <Hash size={12} />;
  };

  return (
    <main className="relative z-10 min-h-screen text-slate-800 dark:text-white bg-transparent font-sans">
      <div className="flex-1 overflow-x-hidden p-3 lg:p-6 pb-20 mt-16 max-w-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1 w-full max-w-md relative order-last md:order-none mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Binary Search O(log N) - Type keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Fast Search Active</div>}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="text-emerald-500" /> SEO Intelligence
            </h1>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">Automated Relevance Engine extracting SEO Keyword Opportunities from Google Trends</p>
          </div>
          <button onClick={() => fetchOpportunities(true)} className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-transform active:scale-95">
            <Filter size={14} /> Refresh Data
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4 border-b border-white/40 dark:border-slate-700/50 pb-2">
          {['pending', 'relevant', 'used'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({trends.filter(t => t.status === tab).length})
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-2xl backdrop-blur-md shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm font-bold">
              <Target size={32} className="mb-2 opacity-50" />
              No {activeTab} SEO opportunities found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40 dark:border-slate-700/50">
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase">Keyword</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase">Scores</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase">Search Intent</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase">Action Suggestion</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-slate-700/30">
                {filteredTrends.map(trend => (
                  <tr key={trend._id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{trend.keyword}</div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Traffic: {trend.traffic}</span>
                        <span>{new Date(trend.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-[10px] font-bold">
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-slate-500">Trend:</span>
                          <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${trend.trendScore || 0}%`}}></div>
                          </div>
                          <span>{trend.trendScore || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-slate-500">Relevance:</span>
                          <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{width: `${trend.relevanceScore || 0}%`}}></div>
                          </div>
                          <span>{trend.relevanceScore || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-extrabold ${getIntentColor(trend.searchIntent)}`}>
                        {trend.searchIntent || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => { navigator.clipboard.writeText(trend.keyword); alert("Keyword '"+trend.keyword+"' copied for " + trend.suggestionType); }} className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5">
                        {getSuggestionIcon(trend.suggestionType)}
                        {trend.suggestionType || 'None'}</button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {activeTab === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(trend._id, 'relevant')} className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-md transition-colors" title="Mark Relevant"><CheckCircle size={14} /></button>
                          </>
                        )}
                        {activeTab === 'relevant' && (
                          <>
                            <button onClick={() => updateStatus(trend._id, 'used')} className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md transition-colors" title="Mark as Content Created"><PenTool size={14} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default SEOOpportunities;
