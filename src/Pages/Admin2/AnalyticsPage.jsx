import React, { useEffect, useState } from "react";
import { 
  Users, Activity, Clock, Eye, Calendar, Globe, Target, Layout, 
  ChevronDown, Map, FileText, Smartphone, MousePointerClick, Zap, 
  RefreshCcw, Download, ArrowRight, TrendingUp, Search
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ComposedChart
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    let formattedLabel = label;
    if (label && String(label).length === 8 && !isNaN(Number(label))) {
      const str = String(label);
      const d = new Date(str.slice(0,4), Number(str.slice(4,6))-1, str.slice(6,8));
      formattedLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md p-2 rounded-lg shadow-xl text-[10px] z-50">
      <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1 border-b pb-1">{formattedLabel}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="text-slate-900 dark:text-white font-bold">{Number(entry.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(28);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("stkx_admin_token");
        const res = await fetch(`/api/analytics?range=${dateRange}&t=${Date.now()}`, { 
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } 
        });
        const json = await res.json();
        if (json.success) { setData(json.data); } else { alert('Google Analytics Error: ' + (json.error || json.message)); }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Loading Analytics Data...</p>
        </div>
      </div>
    );
  }

  const ov = data?.overview || {};
  const dailyChart = data?.dailyChart || [];
  
  // Format Date for charts
  const formatXAxis = (tickItem) => {
    if(!tickItem) return '';
    const str = String(tickItem);
    if(str.length === 8 && !isNaN(Number(str))) {
      const d = new Date(str.slice(0,4), Number(str.slice(4,6))-1, str.slice(6,8));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return str;
  };

  const COLORS = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#06b6d4"];
  
  const topPages = data?.topPages || [];
  const topCountries = data?.topCountries || [];
  const trafficSources = data?.trafficSources || [];
  const events = data?.events || [];
  const devices = (data?.devices || []).map((d, i) => ({ name: d.device, value: d.users, color: COLORS[i % COLORS.length] }));
  
  const realtimeActive = data?.realtimeActive || 0;
  const realtimeMinutes = data?.realtimeMinutes || [];
  const realtimeDetails = data?.realtimeDetails || [];

  const sparkData = dailyChart.slice(-10).map(d => ({ value: d.users || 0 }));
  const getSpark = () => sparkData.length ? sparkData : Array.from({length: 10}).map(()=>({value:0}));

  const cardClass = "bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-xl p-3 backdrop-blur-md shadow-sm flex flex-col h-full min-w-0";
  const headerClass = "text-[11px] font-bold text-slate-800 dark:text-slate-200 dark:text-slate-200 mb-2 pb-2 border-b border-slate-200/50 dark:border-slate-700/50 uppercase tracking-wider flex justify-between items-center";

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
    <main className="relative z-10 min-h-screen text-slate-800 dark:text-slate-200 dark:text-slate-200 p-2 sm:p-4 space-y-4 font-sans max-w-[1920px] mx-auto min-w-0">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md p-3 rounded-xl shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="text-orange-500" size={18} />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">Analytics</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Complete insights from Google Analytics for Stiknex</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="relative flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition">
            <Calendar size={14} className="text-slate-400" />
            <select value={dateRange} onChange={(e) => setDateRange(Number(e.target.value))} className="bg-transparent appearance-none outline-none font-bold cursor-pointer pr-4 w-full">
              <option value={7}>Last 7 days</option>
              <option value={28}>Last 28 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 1 year</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 text-slate-400 pointer-events-none"/>
          </div>
          <button onClick={() => setRefreshTrigger(p=>p+1)} className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 backdrop-blur-md text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm"><RefreshCcw size={12} /></button>
          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm transition"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* 1. TOP 8 KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <MiniStat icon={Users} title="Total Users" value={ov.activeUsers?.toLocaleString()} change="-" color="#10b981" sparkData={dailyChart} sparkKey="users" />
        <MiniStat icon={Target} title="New Users" value={ov.newUsers?.toLocaleString()} change="-" color="#f97316" sparkData={dailyChart} sparkKey="newUsers" />
        <MiniStat icon={Activity} title="Sessions" value={ov.sessions?.toLocaleString()} change="-" color="#8b5cf6" sparkData={dailyChart} sparkKey="sessions" />
        <MiniStat icon={Eye} title="Page Views" value={ov.pageViews?.toLocaleString()} change="-" color="#f43f5e" sparkData={dailyChart} sparkKey="pageViews" />
        <MiniStat icon={Clock} title="Avg. Session" value={Math.floor((ov.avgSessionDur||0)/60) + 'm ' + Math.floor((ov.avgSessionDur||0)%60) + 's'} change="-" color="#f59e0b" sparkData={dailyChart} sparkKey="avgSessionDur" />
        <MiniStat icon={Target} title="Bounce Rate" value={`${ov.bounceRate}%`} change="-" color="#06b6d4" sparkData={dailyChart} sparkKey="bounceRate" />
        <MiniStat icon={Zap} title="Event Count" value={ov.totalEvents >= 1000 ? (ov.totalEvents/1000).toFixed(1)+'K' : ov.totalEvents} change="-" color="#3b82f6" sparkData={dailyChart} sparkKey="eventCount" />
        <MiniStat icon={MousePointerClick} title="Conversions" value={ov.conversions >= 1000 ? (ov.conversions/1000).toFixed(1)+'K' : ov.conversions} change="-" color="#ec4899" sparkData={dailyChart} sparkKey="conversions" />
      </div>

      {/* ROW 2: MAIN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
        
        {/* 2. USERS, SESSIONS & PAGE VIEWS */}
        <div className={`${cardClass} lg:col-span-6`}>
          <h2 className={headerClass}>
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-slate-400"/> Users, Sessions & Page Views</span>
            <span className="text-[9px] text-slate-400 font-medium">Last {dateRange} days</span>
          </h2>
          <div className="h-[220px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} dx={-10} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{r:4}} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#f43f5e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Users</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Sessions</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Page Views</span>
          </div>
        </div>

        {/* 3. NEW VS RETURNING USERS */}
        <div className={`${cardClass} lg:col-span-3 items-center relative`}>
          <h2 className={`${headerClass} w-full`}>
            <span className="flex items-center gap-1.5"><RefreshCcw size={14} className="text-slate-400"/> New vs Returning</span>
          </h2>
          <div className="h-[180px] w-full min-w-0 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name: 'New', value: ov.newUsers || 1, fill: '#f97316'}, {name: 'Returning', value: Math.max(0, ov.activeUsers - ov.newUsers) || 1, fill: '#10b981'}]} cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" stroke="none" dataKey="value" paddingAngle={2}>
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{ov.activeUsers >= 1000 ? (ov.activeUsers/1000).toFixed(1) + "K" : ov.activeUsers}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">Total Users</span>
            </div>
          </div>
          <div className="w-full mt-4 flex flex-col gap-2 px-4">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> New Users</span>
              <span className="text-slate-900 dark:text-white">{ov.activeUsers ? ((ov.newUsers/ov.activeUsers)*100).toFixed(1) : 0}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Returning</span>
              <span className="text-slate-900 dark:text-white">{ov.activeUsers ? (((ov.activeUsers-ov.newUsers)/ov.activeUsers)*100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        {/* 4. DAILY ACTIVE USERS (Stacked Bar) */}
        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={headerClass}>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> Daily Active Users</span>
          </h2>
          <div className="h-[220px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChart.slice(-15)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="newUsers" name="New Users" stackId="a" fill="#f97316" radius={[0, 0, 2, 2]} />
                <Bar dataKey="returningUsers" name="Returning Users" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 3: GEO, DEVICE & TRAFFIC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
        
        {/* 5. USERS BY COUNTRY */}
        <div className={`${cardClass} lg:col-span-4`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Globe size={14} className="text-slate-400"/> Users by Country</span></h2>
          <div className="mt-2 overflow-y-auto pr-1">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase">Country</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Users</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {topCountries.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-2 text-[11px] text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                      <img src={`https://flagcdn.com/16x12/${['in','us','gb','ca','au','de','fr','it'][i] || 'us'}.png`} alt="flag" className="rounded-sm shadow-sm"/> {c.country}
                    </td>
                    <td className="py-2 text-[11px] text-slate-900 dark:text-white font-bold text-right">{c.users.toLocaleString()}</td>
                    <td className="py-2 text-[11px] text-slate-500 dark:text-slate-400 font-bold text-right">{ov.activeUsers ? ((c.users/ov.activeUsers)*100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. USERS BY DEVICE */}
        <div className={`${cardClass} lg:col-span-3 items-center`}>
          <h2 className={`${headerClass} w-full`}><span className="flex items-center gap-1.5"><Smartphone size={14} className="text-slate-400"/> Users by Device</span></h2>
          <div className="h-[160px] w-full relative min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={devices} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" stroke="none" dataKey="value" paddingAngle={2}>
                  {devices.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{ov.activeUsers >= 1000 ? (ov.activeUsers/1000).toFixed(1) + "K" : ov.activeUsers}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">Users</span>
            </div>
          </div>
          <div className="w-full mt-4 flex flex-col gap-2 px-4">
            {devices.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div> {d.name}</span>
                <span className="text-slate-900 dark:text-white">{ov.activeUsers ? ((d.value/ov.activeUsers)*100).toFixed(1) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. TRAFFIC SOURCE / MEDIUM */}
        <div className={`${cardClass} lg:col-span-5`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Layout size={14} className="text-slate-400"/> Traffic Source / Medium</span></h2>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase">Source / Medium</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Users</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Sessions</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Eng. Rate</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-2 text-[10px] text-slate-800 dark:text-slate-200 font-bold truncate max-w-[140px]">{s.channel}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{s.users.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{s.sessions.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{s.engRate}%</td>
                    <td className="py-2 text-[10px] text-slate-900 dark:text-white font-bold text-right">{s.conversions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROW 4: PAGES & ENGAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
        
        {/* 8. TOP LANDING PAGES */}
        <div className={`${cardClass} lg:col-span-5`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><FileText size={14} className="text-slate-400"/> Top Landing Pages</span></h2>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase">Landing Page</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Users</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">New Users</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-2 text-[10px] text-blue-600 hover:underline cursor-pointer font-bold truncate max-w-[140px]">{p.path}</td>
                    <td className="py-2 text-[10px] text-slate-700 dark:text-slate-300 text-right">{p.users.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-700 dark:text-slate-300 text-right">{p.newUsers.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-700 dark:text-slate-300 font-bold text-right">{p.bounceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. PAGE VIEWS BY PAGE (Horizontal Bar) */}
        <div className={`${cardClass} lg:col-span-4`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Eye size={14} className="text-slate-400"/> Page Views by Page</span></h2>
          <div className="h-[220px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPages.slice(0,8)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="path" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#4b5563' }} width={80} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Page Views" fill="#f97316" radius={[0, 4, 4, 0]} barSize={12}>
                  {topPages.slice(0,8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10. AVG ENGAGEMENT TIME */}
        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> Avg Time by Page</span></h2>
          <div className="h-[220px] w-full min-w-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPages.slice(0,8).sort((a,b)=>b.avgTime-a.avgTime)} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="path" type="category" hide />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="avgTime" name="Seconds" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} label={{ position: 'right', fill: '#6b7280', fontSize: 9, formatter: (val) => `${Math.floor(val/60)}m ${Math.floor(val%60)}s` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 5: KEYWORDS, EVENTS, REALTIME, FLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
        
        {/* 11. TOP KEYWORDS */}
        <div className={`${cardClass} lg:col-span-3`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Search size={14} className="text-slate-400"/> Top Keywords (Organic)</span></h2>
          <div className="mt-2 text-center py-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 rounded-lg border-dashed">
            <Search className="mx-auto text-slate-300 mb-2" size={24}/>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-4">Connect Google Search Console API to view organic keyword data.</p>
          </div>
        </div>

        {/* 12. EVENTS & CONVERSIONS */}
        <div className={`${cardClass} lg:col-span-4`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5"><Zap size={14} className="text-slate-400"/> Events & Conversions</span></h2>
          <div className="mt-2 overflow-x-auto pr-1 h-[200px] overflow-y-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase">Event Name</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Count</th>
                  <th className="pb-2 text-[9px] text-slate-400 font-bold uppercase text-right">Users</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-2 text-[10px] text-slate-800 dark:text-slate-200 font-bold truncate max-w-[120px]">{e.name}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{e.count.toLocaleString()}</td>
                    <td className="py-2 text-[10px] text-slate-600 dark:text-slate-400 text-right">{e.users.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 13. REALTIME */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={headerClass}><span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Realtime</span></h2>
          <div className="flex flex-col mt-2 h-full">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">Live users on Stiknex</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-3">{realtimeActive}</p>
            <div className="h-[40px] w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realtimeMinutes}>
                  <Bar dataKey="value" fill="#10b981" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1 mb-1">Top Active Pages</div>
            {realtimeDetails.slice(0,3).map((r, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] py-1">
                <span className="text-slate-700 dark:text-slate-300 font-bold truncate">{r.page}</span>
                <span className="text-slate-900 dark:text-white font-black">{r.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 14. USER FLOW (Top paths) */}
          <div className={`${cardClass} lg:col-span-3 flex flex-col`}>
            <h2 className={headerClass}><span className="flex items-center gap-1.5"><ArrowRight size={14} className="text-slate-400"/> User Flow (Top paths)</span></h2>
            
            {/* Headers */}
            <div className="flex justify-between w-full mb-2 px-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase">Landing</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase">Next Page</span>
            </div>

            {/* Grid Container for Sankey */}
            <div className="flex-1 grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_100px_1fr] w-full min-h-[140px] relative items-stretch gap-0">
               
               {/* Left Column (Landing) */}
               <div className="flex flex-col justify-between items-start z-10 py-[4px]">
                  <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm">{topPages[0]?.path || '/'}</div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm">{topPages[1]?.path || '/(none)'}</div>
                  <div className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm">{topPages[2]?.path || '/(none)'}</div>
               </div>

               {/* Middle Column (SVG Lines) */}
               <div className="relative w-full h-full">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm">
                     {/* M 0 Y -> C 50 Y, 50 Y, 100 Y */}
                     <path d="M -5 15 C 50 15, 50 15, 105 15" fill="none" stroke="#f97316" strokeWidth="6" strokeOpacity="0.25" />
                     <path d="M -5 15 C 50 15, 50 50, 105 50" fill="none" stroke="#3b82f6" strokeWidth="4" strokeOpacity="0.25" />
                     
                     <path d="M -5 50 C 50 50, 50 15, 105 15" fill="none" stroke="#10b981" strokeWidth="5" strokeOpacity="0.25" />
                     <path d="M -5 50 C 50 50, 50 85, 105 85" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeOpacity="0.25" />
                     
                     <path d="M -5 85 C 50 85, 50 85, 105 85" fill="none" stroke="#ec4899" strokeWidth="4" strokeOpacity="0.25" />
                  </svg>
               </div>

               {/* Right Column (Next Page) */}
               <div className="flex flex-col justify-between items-end z-10 py-[4px] text-right">
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">{topPages[1]?.path || '/(none)'}</div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">{topPages[2]?.path || '/(none)'}</div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 text-[10px] font-bold rounded-md truncate max-w-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">{topPages[3]?.path || '/(none)'}</div>
               </div>
            </div>
          </div>

        </div>
      </main>
    );
  };
  
  export default AnalyticsPage;
