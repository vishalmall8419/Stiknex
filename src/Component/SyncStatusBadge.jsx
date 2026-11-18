import React, { useEffect, useState } from 'react';
import { subscribeSyncStatus, triggerSync } from '../services/syncManager';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SyncStatusBadge() {
  const [status, setStatus] = useState('idle');
  const [isManualSpinning, setIsManualSpinning] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus(setStatus);
    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    setIsManualSpinning(true);
    await triggerSync();
    setTimeout(() => setIsManualSpinning(false), 800);
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div
      onClick={handleManualSync}
      title="Local-First PWA: Click to sync with cloud"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md backdrop-blur-md cursor-pointer transition-all duration-300 border select-none group"
      style={{
        backgroundColor:
          status === 'offline'
            ? 'rgba(245, 158, 11, 0.15)'
            : status === 'syncing'
            ? 'rgba(59, 130, 246, 0.15)'
            : status === 'synced'
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(239, 68, 68, 0.15)',
        borderColor:
          status === 'offline'
            ? 'rgba(245, 158, 11, 0.4)'
            : status === 'syncing'
            ? 'rgba(59, 130, 246, 0.4)'
            : status === 'synced'
            ? 'rgba(16, 185, 129, 0.4)'
            : 'rgba(239, 68, 68, 0.4)',
        color:
          status === 'offline'
            ? '#d97706'
            : status === 'syncing'
            ? '#2563eb'
            : status === 'synced'
            ? '#059669'
            : '#dc2626',
      }}
    >
      {status === 'offline' && (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Offline (Saved locally)</span>
        </>
      )}

      {status === 'syncing' && (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span>Syncing with MongoDB...</span>
        </>
      )}

      {status === 'synced' && (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>All changes synced</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Sync paused (Click to retry)</span>
        </>
      )}
    </div>
  );
}

