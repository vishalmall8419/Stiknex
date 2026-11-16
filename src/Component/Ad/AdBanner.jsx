import React, { useEffect, useRef, useState } from "react";

/**
 * Universal Stiknex AdSense Banner Component
 * 
 * Compact, lightweight, responsive ad container.
 * - Client ID: ca-pub-8724450228854599 (verified from Google AdSense)
 * - Safely initializes window.adsbygoogle on mount
 * - Displays a neat, slim container (patla aur chota)
 * - Safe for development and production without layout breaking
 */
export default function AdBanner({
  slot = "",
  client = "ca-pub-8724450228854599",
  format = "auto",
  responsive = "true",
  className = "",
  label = "Advertisement"
}) {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Only execute on browser client
    if (typeof window === "undefined") return;

    try {
      // Initialize Google AdSense safely
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (err) {
      // Catch AdBlock or initialization errors silently
      console.warn("AdSense push notice:", err?.message || err);
      setAdError(true);
    }
  }, []);

  return (
    <div
      className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}
      aria-label="Sponsored advertisement"
    >
      <div className="relative rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-2 sm:p-3 text-center overflow-hidden transition-all">
        {/* Subtle top label */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>{label}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
        </div>

        {/* AdSense ins tag */}
        <div className="min-h-[60px] sm:min-h-[90px] flex items-center justify-center overflow-hidden">
          {slot ? (
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive={responsive}
            />
          ) : (
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={client}
              data-ad-format={format}
              data-full-width-responsive={responsive}
            />
          )}

          {/* Clean minimal placeholder while Google review is active or before ad loads */}
          {(!adLoaded || adError) && (
            <div className="py-2.5 px-4 text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500/60 animate-pulse"></span>
              <span>Google AdSense Slot • {client}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
