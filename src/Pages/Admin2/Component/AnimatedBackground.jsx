import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      {/* 
        OPTIMIZED ANIMATED GRADIENTS
        - Removed heavy SVG Gooey filters
        - Removed mouse tracking that caused constant re-renders
        - Kept Framer Motion for smooth, hardware-accelerated slow ambient movement
        - Added beautiful vibrant colors that blend perfectly
      */}
      
      {/* Top Left Orb - Purple/Indigo */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-[120px] dark:bg-indigo-600/30"
        animate={{
          x: [0, 150, -50, 0],
          y: [0, 100, -100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top Right Orb - Cyan */}
      <motion.div
        className="absolute top-[5%] -right-[10%] h-[450px] w-[450px] rounded-full bg-cyan-400/30 blur-[100px] dark:bg-cyan-500/20"
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 150, -50, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom Left Orb - Rose/Fuchsia */}
      <motion.div
        className="absolute -bottom-[20%] left-[10%] h-[600px] w-[600px] rounded-full bg-fuchsia-500/20 blur-[130px] dark:bg-fuchsia-600/20"
        animate={{
          x: [0, 200, -150, 0],
          y: [0, -150, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom Right Orb - Emerald */}
      <motion.div
        className="absolute -bottom-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-emerald-400/20 blur-[100px] dark:bg-emerald-500/20"
        animate={{
          x: [0, -100, 150, 0],
          y: [0, -100, 150, 0],
          scale: [1, 1.4, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center Orb - Warm Amber/Rose (Subtle) */}
      <motion.div
        className="absolute top-[30%] left-[30%] h-[350px] w-[350px] rounded-full bg-rose-400/20 blur-[100px] dark:bg-rose-500/10"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
          scale: [1, 1.5, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Adding a subtle grain/noise overlay for premium texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
