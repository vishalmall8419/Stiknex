import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const AnimatedBackground = () => {
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      <svg className="absolute hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 30 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-transparent opacity-50"
        style={{ filter: "url('#goo')" }}
      >
        {/* Interactive Cursor Aura */}
        <motion.div
          className="absolute h-[350px] w-[350px] rounded-full bg-white/50 blur-[130px] mix-blend-overlay"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            left: 0,
            top: 0
          }}
        />

        {/* Ball 1 */}
        <motion.div
          className="absolute h-[250px] w-[250px] rounded-full bg-teal-400/60 blur-[120px] mix-blend-multiply"
          style={{ top: "10%", left: "10%" }}
          animate={{
            x: [0, 200, -100, 0],
            y: [0, 150, -50, 0],
            scale: [1, 1.4, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Ball 2 */}
        <motion.div
          className="absolute h-[200px] w-[200px] rounded-full bg-sky-400/60 blur-[100px] mix-blend-multiply"
          style={{ top: "40%", right: "10%" }}
          animate={{
            x: [0, -250, 150, 0],
            y: [0, -200, 100, 0],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Ball 3 */}
        <motion.div
          className="absolute h-[220px] w-[220px] rounded-full bg-indigo-400/60 blur-[130px] mix-blend-multiply"
          style={{ bottom: "10%", left: "20%" }}
          animate={{
            x: [0, 150, -250, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Ball 4 */}
        <motion.div
          className="absolute h-[180px] w-[180px] rounded-full bg-emerald-400/60 blur-[110px] mix-blend-multiply"
          style={{ top: "20%", left: "50%" }}
          animate={{
            x: [0, -150, 200, 0],
            y: [0, 200, -100, 0],
            scale: [1, 1.6, 0.8, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Ball 5 */}
        <motion.div
          className="absolute h-[250px] w-[250px] rounded-full bg-amber-400/60 blur-[150px] mix-blend-multiply"
          style={{ bottom: "30%", right: "30%" }}
          animate={{
            x: [0, 250, -100, 0],
            y: [0, 100, -200, 0],
            scale: [1, 1.2, 0.7, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Ball 6 */}
        <motion.div
          className="absolute h-[200px] w-[200px] rounded-full bg-fuchsia-400/60 blur-[120px] mix-blend-multiply"
          style={{ top: "-10%", right: "30%" }}
          animate={{
            x: [0, -200, 150, 0],
            y: [0, 300, -100, 0],
            scale: [1, 1.4, 0.9, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        
        {/* Ball 7 */}
        <motion.div
          className="absolute h-[150px] w-[150px] rounded-full bg-cyan-400/60 blur-[100px] mix-blend-multiply"
          style={{ bottom: "10%", right: "10%" }}
          animate={{
            x: [0, -300, 100, 0],
            y: [0, -100, 200, 0],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
};

export default AnimatedBackground;
