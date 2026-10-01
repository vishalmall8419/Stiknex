import React, { useState, useEffect } from 'react';
import { Server, Activity, Clock, CheckCircle, XCircle, RefreshCw, Globe, ArrowUpRight, Cpu, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

class MasterErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error("MasterErrorBoundary caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="bg-red-50 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-700 text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle /> UI Crash Detected</h2>
            <p className="text-red-600 mb-4">The External Projects component crashed during rendering.</p>
            <pre className="bg-red-100 p-4 rounded text-sm text-red-800 overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ExternalProjectsInner = () => {
  const externalServicesDefault = () => [
    { id: 'portfolio', name: 'Vishal Portfolio Backend', url: 'https://vishal-portfolio-backend-yzb1.onrender.com', pending: true },
    { id: 'narama', name: 'Narama Cosmetics Health', url: 'https://narama-cosmetics.onrender.com/api/health', pending: true }
  ];

  const [services, setServices] = useState(externalServicesDefault());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatus = async () => {
    console.log("fetchStatus started");
    setLoading(true);
    setServices(externalServicesDefault()); // reset to pending
    
    try {
      const token = localStorage.getItem("stkx_admin_token");
      const res = await fetch("/api/monitor-external", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Fetch response status:", res.status);
      
      if (res.ok) {
        const json = await res.json();
        console.log("Fetch response JSON:", json);
        
        let newServices = json.services;
        if (!newServices || !Array.isArray(newServices) || newServices.length === 0) {
            console.warn("API returned empty services array, using default fallback.");
            newServices = externalServicesDefault().map(s => ({ ...s, pending: false, ok: false, error: "API returned no data" }));
        }
        setServices(newServices);
        
        if (json.timestamp) {
            const parsedDate = new Date(json.timestamp);
            if (!isNaN(parsedDate.getTime())) {
                setLastUpdated(parsedDate);
            }
        }
      } else {
        throw new Error(`API Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Monitor Error:", error);
      setServices(prev => {
        const fallback = Array.isArray(prev) && prev.length > 0 ? prev : externalServicesDefault();
        return fallback.map(s => ({ 
          ...s, 
          pending: false, 
          ok: false, 
          error: "Fetch failed or Vercel Timeout (Render is still waking up... try again in 30s)" 
        }));
      });
    } finally {
      console.log("fetchStatus finished");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Server className="text-indigo-500 shrink-0" size={32} /> 
            <span>External Projects</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor and wake up your other Render.com backend services.</p>
        </div>
        
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[180px]"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> 
          {loading ? "Pinging Servers..." : "Refresh Status"}
        </button>
      </div>

      {loading && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 block">
          <p className="text-amber-800 dark:text-amber-200 text-sm font-medium flex items-center gap-2">
            <Activity size={16} className="animate-pulse shrink-0" />
            <span>Render free instances sleep after inactivity. It may take up to 30-50 seconds to wake them up. Please wait...</span>
          </p>
        </div>
      )}

      {lastUpdated && !loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
          <Clock size={14} /> Last ping: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 w-full">
        {(!services || services.length === 0) ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white/50 rounded-xl border">No services found. Check console logs.</div>
        ) : (
          services.map((service, idx) => {
            if (!service) return null;
            return <ServiceCard key={service.id || idx} service={service} />;
          })
        )}
      </div>
    </div>
  );
};

export default function ExternalProjects() {
  return (
    <MasterErrorBoundary>
      <ExternalProjectsInner />
    </MasterErrorBoundary>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div className="text-red-500 p-4 border border-red-500 rounded-lg">Error rendering card: {String(this.state.error)}</div>;
    return this.props.children;
  }
}

const ServiceCard = ({ service }) => {
  return (
    <ErrorBoundary>
      <ServiceCardInner service={service} />
    </ErrorBoundary>
  );
};

const ServiceCardInner = ({ service }) => {
  const isOnline = service.ok === true;
  const isPending = service.pending === true;
  const isError = !isOnline && !isPending;
  
  let hostname = service.url || "unknown";
  try {
      if (service.url) hostname = new URL(service.url).hostname;
  } catch (e) {
      hostname = service.url;
  }
  
  let renderedData = "";
  try {
      if (typeof service.data === 'object' && service.data !== null) {
          renderedData = JSON.stringify(service.data, null, 2);
      } else {
          renderedData = String(service.data || '');
      }
  } catch (e) {
      renderedData = "Error parsing response data";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm flex flex-col h-full w-full overflow-hidden ${
        isOnline ? 'border-green-200 dark:border-green-900/30' : 
        isError ? 'border-red-200 dark:border-red-900/30' : 
        'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">{service.name || 'Unknown Service'}</h2>
          <a href={service.url || '#'} target="_blank" rel="noreferrer" className="text-sm text-indigo-500 hover:underline flex items-center gap-1 font-medium truncate">
            <Globe size={14} className="shrink-0" /> <span className="truncate">{hostname}</span> <ArrowUpRight size={14} className="shrink-0" />
          </a>
        </div>
        
        <div className="shrink-0">
          {isPending ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              <RefreshCw size={12} className="animate-spin" /> Pinging
            </span>
          ) : isOnline ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              <CheckCircle size={12} /> Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              <XCircle size={12} /> Offline
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider truncate">Response Time</p>
          <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 truncate">
            <Clock size={16} className={isOnline ? "text-green-500 shrink-0" : "text-slate-400 shrink-0"} />
            <span className="truncate">{isPending ? '--' : `${service.timeTaken || 0}ms`}</span>
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider truncate">HTTP Status</p>
          <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 truncate">
            <Cpu size={16} className={isOnline ? "text-green-500 shrink-0" : (isError ? "text-red-500 shrink-0" : "text-slate-400 shrink-0")} />
            <span className="truncate">{isPending ? '--' : (service.status || 'N/A')}</span>
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wider">Response Data</p>
        <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar w-full relative">
          {isPending ? (
            <span className="text-slate-500">Waiting for response...</span>
          ) : isError ? (
            <span className="text-red-400">{String(service.error || "Connection failed or timed out.")}</span>
          ) : (
            <pre className="whitespace-pre-wrap break-all">
              {renderedData}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  );
};
