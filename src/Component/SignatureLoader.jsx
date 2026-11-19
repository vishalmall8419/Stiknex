import React from "react";

/**
 * SignatureLoader
 * 
 * Fluid handwriting signature loader for Stiknex.
 * Traces each stroke with realistic pen-on-paper timing,
 * ink pressure variations, and signature flourish underline.
 */
export default function SignatureLoader({ size = "md", text = "Signing in...", fullScreen = true }) {
  const isLarge = size === "lg";

  return (
    <div
      className={`flex flex-col items-center justify-center transition-colors duration-300 ${
        fullScreen
          ? "fixed inset-0 z-[99999] bg-[#FAF7F2] dark:bg-[#0B0F17]"
          : "p-8 w-full h-full min-h-[220px]"
      }`}
      role="status"
      aria-label="Loading..."
    >
      <div className="relative flex flex-col items-center">
        {/* Glow ambient background */}
        <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-coral-500/10 dark:from-teal-400/15 dark:to-orange-400/15 rounded-full blur-xl animate-pulse" />

        {/* Signature SVG with Pen Stroke Animation */}
        <svg
          viewBox="0 0 210 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative ${isLarge ? "w-64 sm:w-80" : "w-52 sm:w-60"} h-auto drop-shadow-sm select-none`}
        >
          <defs>
            <linearGradient id="sigLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#134E5E" className="dark:stop-color-[#38bdf8]" />
              <stop offset="55%" stopColor="#1D6A7D" className="dark:stop-color-[#2dd4bf]" />
              <stop offset="100%" stopColor="#FFA07A" className="dark:stop-color-[#FFA07A]" />
            </linearGradient>
            <linearGradient id="flourishLoaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#134E5E" stopOpacity="0.2" />
              <stop offset="65%" stopColor="#FFA07A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFA07A" stopOpacity="0" />
            </linearGradient>

            <style>{`
              .sig-stroke {
                stroke-dasharray: 180;
                stroke-dashoffset: 180;
                animation: sigDraw 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
              .sig-s { animation-delay: 0s; }
              .sig-t { animation-delay: 0.15s; }
              .sig-t-bar { animation-delay: 0.28s; }
              .sig-i { animation-delay: 0.38s; }
              .sig-k { animation-delay: 0.5s; }
              .sig-n { animation-delay: 0.68s; }
              .sig-e { animation-delay: 0.82s; }
              .sig-x { animation-delay: 0.96s; }
              .sig-flourish {
                stroke-dasharray: 240;
                stroke-dashoffset: 240;
                animation: sigDraw 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                animation-delay: 1.1s;
              }
              .sig-dot {
                animation: sigDotPop 1.8s ease-out infinite;
                animation-delay: 0.45s;
              }
              .sig-end-dot {
                animation: sigDotPop 1.8s ease-out infinite;
                animation-delay: 1.35s;
              }
              @keyframes sigDraw {
                0% { stroke-dashoffset: 180; opacity: 0.2; }
                15% { opacity: 1; }
                65% { stroke-dashoffset: 0; opacity: 1; }
                88% { stroke-dashoffset: 0; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0; }
              }
              @keyframes sigDotPop {
                0%, 30% { transform: scale(0); opacity: 0; }
                35% { transform: scale(1.3); opacity: 1; }
                45% { transform: scale(1); opacity: 1; }
                88% { opacity: 1; }
                100% { opacity: 0; }
              }
            `}</style>
          </defs>

          {/* Signature Text: Stiknex in customized calligraphic cursive vectors */}
          <g stroke="url(#sigLoaderGrad)" strokeLinecap="round" strokeLinejoin="round">
            {/* Dynamic Flourished 'S' */}
            <path
              d="M 18 34 C 13 36, 6 34, 6 27 C 6 18, 19 15, 23 9 C 26 4, 21 2, 17 3 C 12 4, 9 8, 9 12"
              strokeWidth="3.2"
              className="sig-stroke sig-s"
            />
            {/* Connection from S into t */}
            <path
              d="M 17 34 C 23 34, 30 25, 33 16 L 33 34"
              strokeWidth="3"
              className="sig-stroke sig-t"
            />
            {/* t-crossbar */}
            <path
              d="M 27 22 Q 35 21, 41 20"
              strokeWidth="2.6"
              className="sig-stroke sig-t-bar"
            />

            {/* i */}
            <path
              d="M 43 23 L 45 34 C 46 35, 48 35, 51 33"
              strokeWidth="3"
              className="sig-stroke sig-i"
            />
            {/* i-dot (pen flick) */}
            <circle
              cx="45"
              cy="14"
              r="2.2"
              fill="#FFA07A"
              stroke="none"
              className="sig-dot origin-[45px_14px]"
            />

            {/* k */}
            <path
              d="M 57 11 L 56 34 M 68 22 L 59 28 L 68 35"
              strokeWidth="3"
              className="sig-stroke sig-k"
            />

            {/* n */}
            <path
              d="M 76 24 L 75 34 M 76 26 C 79 22, 85 22, 88 26 L 87 34"
              strokeWidth="2.8"
              className="sig-stroke sig-n"
            />

            {/* e */}
            <path
              d="M 94 29 C 94 24, 103 23, 103 27 C 103 33, 95 35, 105 34"
              strokeWidth="2.8"
              className="sig-stroke sig-e"
            />

            {/* x */}
            <path
              d="M 112 24 L 124 34 M 123 24 L 112 34"
              strokeWidth="3"
              className="sig-stroke sig-x"
            />
          </g>

          {/* Signature Underline Flourish (Fast Calligraphic Pen Stroke) */}
          <path
            d="M 14 44 C 45 42, 95 40, 150 37 C 175 35, 195 34, 205 31"
            stroke="url(#flourishLoaderGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="sig-flourish"
          />

          {/* Decorative Signature End Dot */}
          <circle
            cx="132"
            cy="33"
            r="2"
            fill="#FFA07A"
            className="sig-end-dot origin-[132px_33px]"
          />
        </svg>

        {/* Text Subtitle */}
        {text && (
          <p className="mt-4 text-[12px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
