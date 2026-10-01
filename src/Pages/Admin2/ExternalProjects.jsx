import React, { useState, useEffect } from 'react';
import { Server, Activity, Clock, CheckCircle, XCircle, RefreshCw, Globe, ArrowUpRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
 
const ExternalProjects = () => {
  const [services, setServices] = useState(externalServicesDefault());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  function externalServicesDefault() {
    return [
      { id: 'portfolio', name: 'Vishal Portfolio Backend', url: 'https://vishal-portfolio-backend-yzb1.onrender.com', pending: true },
      { id: 'narama', name: 'Narama Cosmetics Health', url: 'https://narama-cosmetics.onrender.com/api/health', pending: true }
    ];
  }

  const fetchStatus = async () => {
    setLoading(true);
    setServices(externalServicesDefault()); // reset to pending
    
    try {
      const token = localStorage.getItem("stkx_admin_token");
      const res = await fetch("/api/monitor-external", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const json = await res.json();
        setServices(json.services || externalServicesDefault());
        if (json.timestamp) {
            const parsedDate = new Date(json.timestamp);
            if (!isNaN(parsedDate.getTime())) {
                setLastUpdated(parsedDate);
            }
        }
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Monitor Error:", error);
      // Ensure we update services so they don't spin forever
      setServices(services => (services || []).map(s => ({ 
        ...s, 
        pending: false, 
        ok: false, 
        error: "Vercel Timeout (Render is still waking up... try again in 30 seconds)" 
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Server className="text-indigo-500" size={32} /> External Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and wake up your other Render.com backend services.</p>
        </div>
        
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> 
          {loading ? "Pinging Servers..." : "Refresh Status"}
        </button>
      </div>

      {loading && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
          <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
            <Activity size={16} className="animate-pulse" />
            Render free instances sleep after inactivity. It may take up to 30-50 seconds to wake them up. Please wait...
          </p>
        </div>
      )}

      {lastUpdated && !loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
          <Clock size={14} /> Last ping: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {services && services.map((service, idx) => {
          if (!service) return null;
          return <ServiceCard key={idx} service={service} />;
        })}
      </div>
    </div>
  );
};

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
      className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm flex flex-col h-full ${
        isOnline ? 'border-green-200 dark:border-green-900/30' : 
        isError ? 'border-red-200 dark:border-red-900/30' : 
        'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{service.name || 'Unknown Service'}</h2>
          <a href={service.url || '#'} target="_blank" rel="noreferrer" className="text-sm text-indigo-500 hover:underline flex items-center gap-1 font-medium">
            <Globe size={14} /> {hostname} <ArrowUpRight size={14} />
          </a>
        </div>
        
        {isPending ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <RefreshCw size={12} className="animate-spin" /> Pinging
          </span>
        ) : isOnline ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle size={12} /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <XCircle size={12} /> Offline
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Response Time</p>
          <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock size={16} className={isOnline ? "text-green-500" : "text-slate-400"} />
            {isPending ? '--' : `${service.timeTaken || 0}ms`}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">HTTP Status</p>
          <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Cpu size={16} className={isOnline ? "text-green-500" : (isError ? "text-red-500" : "text-slate-400")} />
            {isPending ? '--' : (service.status || 'N/A')}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wider">Response Data</p>
        <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar">
          {isPending ? (
            <span className="text-slate-500">Waiting for response...</span>
          ) : isError ? (
            <span className="text-red-400">{String(service.error || "Connection failed or timed out.")}</span>
          ) : (
            <pre className="whitespace-pre-wrap break-words">
              {renderedData}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExternalProjects;
