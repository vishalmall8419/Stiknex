import React, { useEffect, useState } from "react";
import { 
  Users, Activity, Clock, Globe, TrendingUp, Monitor, 
  Share2, Eye, Calendar, Download, Bell, MousePointerClick, 
  Zap, Layout, ChevronDown, Map, FileText, Smartphone, Target 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from "recharts";

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    let formattedLabel = label;
    if (label && String(label).length === 8 && !isNaN(Number(label))) {
      const str = String(label);
      const d = new Date(str.slice(0,4), Number(str.slice(4,6))-1, str.slice(6,8));
      formattedLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 rounded shadow-xl text-[9px] z-50">
      <p className="text-slate-800 dark:text-slate-300 font-semibold mb-1">{formattedLabel}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
          <span className="text-slate-900 dark:text-white font-bold">{Number(entry.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const DashBoard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rtSearch, setRtSearch] = useState('');
  const [rtCountry, setRtCountry] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("stkx_admin_token");
        const headers = { Authorization: `Bearer ${token}` };
        const [analyticsRes, trendsRes] = await Promise.all([
          fetch(`/api/analytics?range=${dateRange}&t=${Date.now()}`, { headers: { ...headers, 'Cache-Control': 'no-cache' } }),
          fetch(`/api/trends-admin?t=${Date.now()}`, { headers: { ...headers, 'Cache-Control': 'no-cache' } })
        ]);
        const [analyticsJson, trendsJson] = await Promise.all([
          analyticsRes.json(),
          trendsRes.json()
        ]);
        if (analyticsJson.success) setAnalyticsData(analyticsJson.data);
        if (trendsJson.success) setTrendsData(trendsJson.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-[10px] text-slate-500">Loading Data Matrix...</p>
        </div>
      </div>
    );
  }

  // --- DATA PARSING ---
  const ov = analyticsData?.overview || {};
  
  const trafficData = (analyticsData?.dailyChart || []).map((d) => ({
    date: String(d.date || "").slice(4,8).replace(/(\d{2})(\d{2})/, '$1/$2'),
    users: d.users || 0,
    sessions: d.sessions || 0,
    pageViews: d.pageViews || 0,
    
  }));

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#ec4899", "#f59e0b"];
  
  const deviceData = (analyticsData?.devices?.length ? analyticsData.devices : [
    { device: 'Mobile', users: 6230 }, { device: 'Desktop', users: 3310 }, { device: 'Tablet', users: 460 }
  ]).map((d, i) => ({ name: d.device, value: d.users, color: COLORS[i % COLORS.length] }));

  const sourceData = (analyticsData?.trafficSources?.length ? analyticsData.trafficSources : [
    { channel: 'Organic', users: 4620 }, { channel: 'Direct', users: 2180 }, { channel: 'Social', users: 1450 }
  ]).slice(0, 5).map((s, i) => ({ name: s.channel, value: s.users, color: COLORS[i % COLORS.length] }));

  const topPages = (analyticsData?.topPages?.length ? analyticsData.topPages : [
    { path: '/', views: 24830, users: 18240 }, { path: '/stickers', views: 12640, users: 8920 }
  ]).slice(0, 7);

  const topCountries = (analyticsData?.topCountries?.length ? analyticsData.topCountries : [
    { country: 'India', users: 15400 }, { country: 'United States', users: 8200 }
  ]).slice(0, 6);

  const newTrends = trendsData.filter(t => t.status === 'pending').slice(0, 5);
  const relevantTrends = trendsData.filter(t => t.status === 'relevant').slice(0, 5);
const parseTraffic = (str) => {
    if (!str) return 0;
    let num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (str.includes('M')) return num * 1000000;
    if (str.includes('K')) return num * 1000;
    return num;
  };
  const trendChartData = newTrends.map(t => ({
    name: t.keyword.length > 12 ? t.keyword.substring(0, 12) + '..' : t.keyword,
    volume: parseTraffic(t.traffic),
    originalTraffic: t.traffic
  }));
  
  const realtimeActive = analyticsData?.realtimeActive || 0;
  const realtimeData = analyticsData?.realtimeMinutes || [];
  const realtimeDetails = analyticsData?.realtimeDetails || [];
  
  
  const uniqueCountries = ['All', ...new Set(realtimeDetails.map(r => r.country))];
  const filteredRt = realtimeDetails.filter(r => {
    const matchSearch = r.page.toLowerCase().includes(rtSearch.toLowerCase());
    const matchCountry = rtCountry === 'All' || r.country === rtCountry;
    return matchSearch && matchCountry;
  });
  const sparkData = trafficData.slice(-10).map(d => ({ value: d.users || 0 }));
  const getSpark = () => sparkData.length ? sparkData : Array.from({length: 10}).map(()=>({value:0}));

  const funnelData = [
    { name: 'Total Page Views', value: ov.pageViews || 0, fill: '#8b5cf6', desc: '100%' },
    { name: 'Total Sessions', value: ov.sessions || 0, fill: '#06b6d4', desc: ov.pageViews ? `${((ov.sessions/ov.pageViews)*100).toFixed(1)}%` : '0%' },
    { name: 'Total Users', value: ov.activeUsers || 0, fill: '#10b981', desc: ov.sessions ? `${((ov.activeUsers/ov.sessions)*100).toFixed(1)}%` : '0%' },
    { name: 'New Users', value: ov.newUsers || 0, fill: '#f59e0b', desc: ov.activeUsers ? `${((ov.newUsers/ov.activeUsers)*100).toFixed(1)}%` : '0%' },
    { name: 'Total Events', value: ov.totalEvents || 0, fill: '#ec4899', desc: 'N/A' },
  ];

  const CustomPyramid = ({ data }) => {
    return (
      <div className="flex flex-col items-center w-full gap-[3px] mt-2 pb-1 h-full justify-center">
        {data.map((item, i) => {
          const w = 100 - (i * 12); 
          return (
            <div key={i} className="flex justify-between items-center text-[9px] font-bold text-white px-3 h-[24px] transition-all hover:opacity-90 cursor-pointer"
                 style={{ width: `${w}%`, backgroundColor: item.fill, clipPath: i === 0 ? 'none' : 'polygon(2% 0, 98% 0, 100% 100%, 0 100%)' }}>
              <span className="opacity-90 truncate max-w-[50%]">{item.name}</span>
              <span className="flex items-center gap-1 shrink-0">
                {item.value.toLocaleString()} <span className="opacity-60 text-[7px] hidden sm:inline-block">({item.desc})</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const cardClass = "bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-xl p-3 backdrop-blur-md min-w-0 flex flex-col h-full";
  const headerClass = "text-xs font-bold text-slate-800 dark:text-white mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-700/50 uppercase tracking-wider";

  const MiniStat = ({ icon: Icon, title, value, change, color, sparkData, sparkKey }) => (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-xl p-2 backdrop-blur-md flex flex-col justify-between h-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors shadow-sm">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="p-1 rounded bg-slate-100 dark:bg-slate-800" style={{color}}><Icon size={12} /></div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{value}</span>
          {change !== "-" && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{change}</span>}
        </div>
        <div className="w-12 h-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`grad-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.3}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient>
              </defs>
              <Area type="monotone" dataKey={sparkKey || "users"} stroke={color} strokeWidth={1.5} fillOpacity={1} fill={`url(#grad-${title.replace(/\s/g,'')})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <main className="space-y-3 pb-12 font-sans max-w-[1920px] mx-auto min-w-0 px-2 lg:px-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Layout className="text-indigo-600 dark:text-indigo-400" size={16} />
          <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Stiknex Data Studio</h1>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <div className="relative flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded text-slate-600 dark:text-slate-300">
            <Calendar size={12} /> 
            <select value={dateRange} onChange={(e) => setDateRange(Number(e.target.value))} className="bg-transparent appearance-none outline-none font-medium cursor-pointer pr-4 z-10 dark:text-white">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 1 year</option>
              <option value={1825}>Last 5 years</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 pointer-events-none"/>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded font-medium"><Download size={12} /> Export</button>
        </div>
      </div>

      {/* 8-COLUMN STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <MiniStat icon={Users} title="Active Users" value={ov.activeUsers?.toLocaleString() || "0"} change="-" color="#10b981" sparkData={analyticsData?.dailyChart || []} sparkKey="users" />
          <MiniStat icon={Users} title="Users" value={ov.activeUsers?.toLocaleString() || "0"} change="-" color="#8b5cf6" sparkData={analyticsData?.dailyChart || []} sparkKey="users" />
          <MiniStat icon={Activity} title="Sessions" value={ov.sessions?.toLocaleString() || "0"} change="-" color="#3b82f6" sparkData={analyticsData?.dailyChart || []} sparkKey="sessions" />
          <MiniStat icon={Eye} title="Page Views" value={ov.pageViews?.toLocaleString() || "0"} change="-" color="#06b6d4" sparkData={analyticsData?.dailyChart || []} sparkKey="pageViews" />
          <MiniStat icon={MousePointerClick} title="Engagement" value={`${(100 - (ov.bounceRate || 0)).toFixed(1)}%`} change="-" color="#ec4899" sparkData={analyticsData?.dailyChart || []} sparkKey="bounceRate" />
          <MiniStat icon={Clock} title="Avg. Time" value={`${Math.round(ov.avgSessionDur || 0)}s`} change="-" color="#f59e0b" sparkData={analyticsData?.dailyChart || []} sparkKey="avgSessionDur" />
          <MiniStat icon={Zap} title="Events" value={ov.totalEvents?.toLocaleString() || "0"} change="-" color="#a855f7" sparkData={analyticsData?.dailyChart || []} sparkKey="eventCount" />
          <MiniStat icon={Target} title="New Users" value={ov.newUsers?.toLocaleString() || "0"} change="-" color="#3b82f6" sparkData={analyticsData?.dailyChart || []} sparkKey="newUsers" />
        </div>

      {/* ROW 1: GOOGLE TRENDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 min-w-0">
        <div className={`${cardClass} lg:col-span-5`}>
          <h2 className={`${headerClass} flex items-center gap-1.5`}><Globe size={12} className="text-blue-500"/> Google Trends</h2>
          <div className="h-[140px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendChartData}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} interval={0} />
                <RechartsTooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 rounded shadow-xl text-[9px] z-50">
                        <p className="text-slate-800 dark:text-slate-300 font-semibold mb-1">{payload[0].payload.name}</p>
                        <p className="text-indigo-500 font-bold">Search Volume: {payload[0].payload.originalTraffic}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="volume" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={headerClass}>Trending searches</h2>
          <div className="overflow-y-auto h-[140px] mt-2">
            <table className="w-full text-left">
              <tbody>
                {newTrends.map((t, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="py-1.5 text-[10px] text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{t.keyword}</td>
                    <td className="py-1.5 text-[10px] text-slate-500 text-right">{t.traffic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={headerClass}>By Region</h2>
          <div className="flex flex-col gap-2 mt-2 h-[140px] justify-center">
            {topCountries.slice(0,4).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-700 dark:text-slate-300 truncate w-14">{c.country}</span>
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{width: `${100 - (i*15)}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={headerClass}>Rising queries</h2>
          <div className="overflow-y-auto h-[140px] mt-2">
            <table className="w-full text-left">
              <tbody>
                {relevantTrends.slice(0,4).map((t, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="py-1.5 text-[10px] text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{t.keyword}</td>
                    <td className="py-1.5 text-[9px] text-emerald-600 font-bold text-right">Saved</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROW 2: TRAFFIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 min-w-0">
        <div className={`${cardClass} lg:col-span-5`}>
          <h2 className={headerClass}>Website Traffic</h2>
          <div className="h-[140px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="cUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                  <linearGradient id="cSess" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} fill="url(#cUsers)" />
                <Area type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} fill="url(#cSess)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2 items-center`}>
          <h2 className={`${headerClass} w-full text-left`}>Traffic Source</h2>
          <div className="h-[120px] w-full relative min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={sourceData} cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" stroke="none" dataKey="value" paddingAngle={2}>{sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip content={<CustomTooltip />} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2 items-center`}>
          <h2 className={`${headerClass} w-full text-left`}>Device</h2>
          <div className="h-[120px] w-full relative min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={deviceData} cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" stroke="none" dataKey="value" paddingAngle={2}>{deviceData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip content={<CustomTooltip />} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={`${headerClass} flex items-center gap-1.5`}><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Realtime</h2>
          <div className="flex gap-4 mt-2 h-[140px]">
            <div className="w-1/2 flex flex-col justify-between">
              <p className="text-3xl font-bold text-slate-800 dark:text-white leading-none">{realtimeActive}</p>
              <div className="h-[80px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={realtimeData}><Bar dataKey="value" fill="#8b5cf6" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div>
            </div>
            <div className="w-1/2 overflow-y-auto">
              <table className="w-full text-left">
                <tbody>
                  {topPages.slice(0,5).map((p,i) => (<tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"><td className="py-1 text-[10px] text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{p.path}</td><td className="py-1 text-[10px] text-slate-500 text-right">{p.users || 0}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: PAGES, FUNNEL, NEW VS RETURNING, GEO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 min-w-0">
        
        <div className={`${cardClass} lg:col-span-5`}>
          <h2 className={headerClass}>Pages & Screens</h2>
          <div className="overflow-y-auto h-[140px] mt-2">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10">
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="pb-1 text-[10px] text-slate-500 font-normal">Page</th>
                  <th className="pb-1 text-[10px] text-slate-500 font-normal text-right">Views</th>
                  <th className="pb-1 text-[10px] text-slate-500 font-normal text-right">Users</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="py-2 text-[10px] text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{p.path}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{p.views?.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{p.users?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={headerClass}>User Journey</h2>
          <div className="h-[140px] mt-2">
             <CustomPyramid data={funnelData} />
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2 items-center`}>
          <h2 className={`${headerClass} w-full text-left`}>New / Return</h2>
          <div className="h-[120px] w-full relative min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={[{name: 'New', value: 72.6, fill: '#06b6d4'}, {name: 'Return', value: 27.4, fill: '#3b82f6'}]} cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" stroke="none" dataKey="value" paddingAngle={2} /><RechartsTooltip content={<CustomTooltip />} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={headerClass}>Geo Data</h2>
          <div className="flex flex-col gap-2 mt-2 h-[140px] justify-center">
            {topCountries.slice(0,4).map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{c.country}</span>
                  <span className="text-slate-500">{ov.activeUsers ? ((c.users / ov.activeUsers) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width: `${ov.activeUsers ? ((c.users / ov.activeUsers) * 100) : 0}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    
      {/* ROW 4: LIVE AUDIENCE EXPLORER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
        <div className={`${cardClass} lg:col-span-12`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-2 border-b border-slate-200 dark:border-slate-700/50 gap-3">
            <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              Live Audience Explorer (Realtime Details)
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input type="text" placeholder="Search page..." value={rtSearch} onChange={(e) => setRtSearch(e.target.value)} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] text-slate-800 dark:text-white outline-none focus:ring-1 ring-indigo-500 w-full sm:w-32" />
              <select value={rtCountry} onChange={(e) => setRtCountry(e.target.value)} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] text-slate-800 dark:text-white outline-none focus:ring-1 ring-indigo-500 cursor-pointer">
                {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-3 py-1.5 text-[9px] text-slate-500 font-semibold uppercase">Active Page / Screen</th>
                  <th className="px-3 py-1.5 text-[9px] text-slate-500 font-semibold uppercase">Country</th>
                  <th className="px-3 py-1.5 text-[9px] text-slate-500 font-semibold uppercase">Device</th>
                  <th className="px-3 py-1.5 text-[9px] text-slate-500 font-semibold uppercase text-right">Live Users</th>
                </tr>
              </thead>
              <tbody>
                {filteredRt.length > 0 ? filteredRt.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="px-3 py-2 text-[10px] text-slate-800 dark:text-slate-200 font-medium truncate max-w-[250px]">{r.page}</td>
                    <td className="px-3 py-2 text-[10px] text-slate-600 dark:text-slate-400">{r.country}</td>
                    <td className="px-3 py-2 text-[10px] text-slate-600 dark:text-slate-400">{r.device || 'N/A'}</td>
                    <td className="px-3 py-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold text-right flex justify-end items-center gap-1">
                      {r.users} <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-3 py-6 text-center text-[10px] text-slate-500">No matching live users found at this exact moment.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
\n    </main>
  );
};

export default DashBoard;
