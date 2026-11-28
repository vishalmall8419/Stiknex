import React from "react";

/**
 * SignatureLogo
 * 
 * Elegant handwritten signature-style SVG logo for Stiknex.
 * Features fluid calligraphic curves, pen stroke pressure variation,
 * and a signature flourish underline.
 */
export default function SignatureLogo({ className = "h-8 w-auto", isDark = false }) {
  const strokeColor = isDark ? "#38bdf8" : "#134E5E";
  const accentColor = "#FFA07A";

  return (
    <svg
      viewBox="0 0 210 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
      aria-label="Stiknex Signature Logo"
    >
      <defs>
        <linearGradient id="stiknexSigGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#38bdf8" : "#0F3944"} />
          <stop offset="50%" stopColor={isDark ? "#2dd4bf" : "#134E5E"} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <linearGradient id="flourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? "#2dd4bf" : "#134E5E"} stopOpacity="0.2" />
          <stop offset="60%" stopColor={accentColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Signature Text: Stiknex in customized calligraphic cursive vectors */}
      <g stroke="url(#stiknexSigGrad)" strokeLinecap="round" strokeLinejoin="round">
        {/* Dynamic Flourished 'S' */}
        <path
          d="M 18 34 C 13 36, 6 34, 6 27 C 6 18, 19 15, 23 9 C 26 4, 21 2, 17 3 C 12 4, 9 8, 9 12"
          strokeWidth="3.2"
        />
        {/* Connection from S into t */}
        <path
          d="M 17 34 C 23 34, 30 25, 33 16 L 33 34"
          strokeWidth="3"
        />
        {/* t-crossbar */}
        <path
          d="M 27 22 Q 35 21, 41 20"
          strokeWidth="2.6"
        />

        {/* i */}
        <path
          d="M 43 23 L 45 34 C 46 35, 48 35, 51 33"
          strokeWidth="3"
        />
        {/* i-dot (pen flick) */}
        <circle cx="45" cy="14" r="2.2" fill={accentColor} stroke="none" />

        {/* k */}
        <path
          d="M 57 11 L 56 34 M 68 22 L 59 28 L 68 35"
          strokeWidth="3"
        />

        {/* n */}
        <path
          d="M 76 24 L 75 34 M 76 26 C 79 22, 85 22, 88 26 L 87 34"
          strokeWidth="2.8"
        />

        {/* e */}
        <path
          d="M 94 29 C 94 24, 103 23, 103 27 C 103 33, 95 35, 105 34"
          strokeWidth="2.8"
        />

        {/* x */}
        <path
          d="M 112 24 L 124 34 M 123 24 L 112 34"
          strokeWidth="3"
        />
      </g>

      {/* Signature Underline Flourish (Fast Calligraphic Pen Stroke) */}
      <path
        d="M 14 44 C 45 42, 95 40, 150 37 C 175 35, 195 34, 205 31"
        stroke="url(#flourishGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Decorative Signature End Dot */}
      <circle cx="132" cy="33" r="2" fill={accentColor} />
    </svg>
  );
}
