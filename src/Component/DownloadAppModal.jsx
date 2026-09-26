import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, Users, Zap, LayoutDashboard, StickyNote, FileText, Book, Settings, PenTool } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import gsap from 'gsap';

export default function DownloadAppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const location = useLocation();
  
  const lightPhoneRef = useRef(null);
  const darkPhoneRef = useRef(null);
  const sparkleRefs = useRef([]);
  const contentRef = useRef(null);
  const bgOrbsRef = useRef([]);

  // Responsive scale logic to keep exact desktop structure shrunk on mobile
  useEffect(() => {
    const updateScale = () => {
      const modalNaturalWidth = 940;
      const modalNaturalHeight = 540;
      const wScale = (window.innerWidth - 32) / modalNaturalWidth;
      const hScale = (window.innerHeight - 32) / modalNaturalHeight;
      setScale(Math.min(1, wScale, hScale));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const isWebView = navigator.userAgent.includes('wv') || (window.android && window.android.inApp);
    if (isWebView) return;
    const timer = setTimeout(() => { setIsOpen(true); }, 2500);
    return () => { clearTimeout(timer); setIsOpen(false); };
  }, [location.pathname]);

  // GSAP Animations
  useEffect(() => {
    if (!isOpen) return;

    const lightEl = lightPhoneRef.current;
    const darkEl = darkPhoneRef.current;
    const sparkleEls = [...sparkleRefs.current];
    const contentEl = contentRef.current;
    const orbs = [...bgOrbsRef.current];

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (contentEl) {
      tl.fromTo(contentEl, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0);
    }

    gsap.set(lightEl, { rotation: -6 });
    gsap.set(darkEl, { rotation: 8 });

    if (lightEl) {
      tl.fromTo(lightEl, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2);
      gsap.to(lightEl, { y: -10, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    }

    if (darkEl) {
      tl.fromTo(darkEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.3);
      gsap.to(darkEl, { y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
    }

    if (sparkleEls.length) {
      tl.fromTo(sparkleEls, { scale: 0, opacity: 0, rotation: -45 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.1 }, 0.4);
    }
    
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        x: "random(-20, 20)", y: "random(-20, 20)", scale: "random(0.95, 1.05)",
        duration: "random(4, 6)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.5
      });
    });

    return () => { gsap.killTweensOf([lightEl, darkEl, ...sparkleEls, contentEl, ...orbs]); };
  }, [isOpen]);

  const handleDismiss = () => setIsOpen(false);
  const handleDownload = () => { window.location.href = '/Stiknex.apk'; setIsOpen(false); };
  
  const addSparkleRef = (el) => { if (el && !sparkleRefs.current.includes(el)) sparkleRefs.current.push(el); };
  const addOrbRef = (el) => { if (el && !bgOrbsRef.current.includes(el)) bgOrbsRef.current.push(el); };

  const apkDownloadUrl = "https://stiknex.vercel.app/Stiknex.apk";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none font-sans overflow-hidden">
          {/* Spotlight Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm pointer-events-auto"
            onClick={handleDismiss}
          />
          
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: "-45%" }}
            animate={{ opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, x: "-50%", y: "-45%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            /* Pure Absolute Positioning trick prevents any layout squishing or scrollbars entirely */
            className="absolute top-1/2 left-1/2 pointer-events-auto"
          >
            <div 
              style={{ 
                width: '940px', 
                height: '540px',
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
              }} 
              className="bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden flex flex-row relative"
            >
              {/* --- UNIFIED BACKGROUND ELEMENTS --- */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#fafcff]">
                <div ref={addOrbRef} className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/30 blur-[60px] mix-blend-multiply"></div>
                <div ref={addOrbRef} className="absolute -bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/40 blur-[60px] mix-blend-multiply"></div>
                <div ref={addOrbRef} className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-200/30 blur-[60px] mix-blend-multiply"></div>
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              </div>

              {/* Close Button */}
              <motion.button 
                onClick={handleDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/60 hover:bg-white backdrop-blur-md text-slate-500 hover:text-slate-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] z-50 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </motion.button>

              {/* --- LEFT COLUMN - CONTENT --- */}
              <div ref={contentRef} className="w-[52%] h-full p-10 flex flex-col justify-center relative z-10 shrink-0">
                <div className="relative mt-2">
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center gap-2.5 mb-4">
                    <img src="/Stiknex.png" alt="Stiknex Logo" className="w-8 h-8 object-contain drop-shadow-sm rounded-[6px]" />
                    <span className="text-[1.1rem] font-extrabold text-slate-800 tracking-tight">Stiknex</span>
                  </motion.div>

                  <h4 className="text-[9px] font-bold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 uppercase mb-2">
                    Your Ideas Anywhere
                  </h4>
                  
                  <h2 className="text-[2.6rem] font-black text-[#0f172a] leading-[1.05] mb-4 tracking-[-0.02em]">
                    Download the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Stiknex App</span>
                  </h2>
                  
                  <p className="text-slate-500 text-[14px] mb-7 max-w-[90%] leading-relaxed font-medium">
                    Take your notes, whiteboards, sticky notes and ideas with you. Same powerful tools, now on your mobile device.
                  </p>

                  <div className="flex flex-col gap-4 mb-8">
                    {[
                      { Icon: Cloud, title: 'Sync Everywhere', desc: 'Access your ideas on all devices', bg: 'bg-indigo-500/10', clr: 'text-indigo-600' },
                      { Icon: Users, title: 'Work Together', desc: 'Real-time collaboration on the go', bg: 'bg-pink-500/10', clr: 'text-pink-600' },
                      { Icon: Zap, title: 'Stay Productive', desc: 'Your tools, anytime, anywhere', bg: 'bg-emerald-500/10', clr: 'text-emerald-600' },
                    ].map((f, i) => (
                      <motion.div key={f.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i*0.1) }}
                        className="flex items-center gap-4 group cursor-default">
                        <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center ${f.clr} shrink-0 transition-transform group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm`}>
                          <f.Icon size={20} strokeWidth={2.5} />
                        </div>
                        <div className="pt-0.5">
                          <h3 className="font-bold text-slate-900 text-[14px] leading-tight mb-0.5">{f.title}</h3>
                          <p className="text-[11.5px] text-slate-500 font-medium">{f.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="flex gap-4 pt-6 border-t border-slate-200/60 mt-auto mb-2">
                  <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={handleDownload} className="h-[52px] min-w-[155px] px-5 bg-black hover:bg-slate-900 text-white rounded-[14px] flex items-center justify-center gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all border border-slate-800">
                    <svg viewBox="0 0 384 512" className="w-[24px] h-[24px] fill-current text-white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.5q-9 53 23.2 122.9c16 34.8 33.6 63 60.5 59.7 24.5-3 32-15.3 60.5-15.3 28.5 0 37.7 15.3 61.2 14.8 28.3-.5 47-28 62.5-50.5 18-26.5 25.5-52 26-53.5-1.5-1-43-17.5-43-83.3zM259.4 112.5c31.5-32 34.6-67.5 30-81.5-25.5 1.5-62 17.5-84.5 45.5-20.5 25.5-35 59-30 90.5 28.5 2.5 53-15 84.5-54.5z"/></svg>
                    <div className="flex flex-col items-start justify-center leading-[1.1]">
                      <span className="text-[10px] text-slate-300 font-semibold tracking-wide">Download on the</span>
                      <span className="text-[16px] font-bold">App Store</span>
                    </div>
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={handleDownload} className="h-[52px] min-w-[155px] px-5 bg-black hover:bg-slate-900 text-white rounded-[14px] flex items-center justify-center gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all border border-slate-800">
                    <svg viewBox="0 0 512 512" className="w-[22px] h-[22px]">
                      <path fill="#673ab7" d="M38.8 13.9C36.3 16.4 35 20.3 35 25.3v461.3c0 5 1.3 8.9 3.8 11.4l1.3 1.3 259.9-259.9V237L40.1 12.6l-1.3 1.3z" />
                      <path fill="#4caf50" d="M386.4 352.5l-86.4-86.4v-20.2l86.4-86.4 2.8 1.6 102.4 58.2c29.1 16.5 29.1 43.4 0 59.9l-102.4 58.2-2.8 1.5z" />
                      <path fill="#2196f3" d="M300 286.3l86.4 86.4L114.7 527.2c-19.1 10.9-40.4 1.3-40.4-21.7L300 286.3z" />
                      <path fill="#ffc107" d="M300 225.7L74.3 6.5C74.3 6.5 74.3 6.5 74.3 6.5c0-23 21.3-32.6 40.4-21.7L386.4 159.5 300 225.7z" />
                    </svg>
                    <div className="flex flex-col items-start justify-center leading-[1.1]">
                      <span className="text-[10px] text-slate-300 font-semibold tracking-wide">GET IT ON</span>
                      <span className="text-[16px] font-bold">Google Play</span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>

              {/* --- RIGHT COLUMN - ULTRA PREMIUM VISUALS --- */}
              <div className="w-[48%] h-full relative flex items-center justify-center shrink-0 z-10">
                <div className="relative w-[300px] h-[400px] flex-shrink-0">
                  
                  <svg ref={addSparkleRef} width="45" height="45" viewBox="0 0 100 100" fill="none" 
                    className="absolute top-[20px] left-[-20px] text-indigo-500 z-30 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                    <line x1="20" y1="80" x2="45" y2="70" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                    <line x1="15" y1="50" x2="45" y2="55" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                    <line x1="30" y1="20" x2="55" y2="45" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                  </svg>

                  <svg ref={addSparkleRef} width="35" height="35" viewBox="0 0 100 100" fill="none" 
                    className="absolute bottom-[40px] left-[0px] text-amber-400 z-30 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                    <line x1="20" y1="60" x2="50" y2="45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <line x1="40" y1="85" x2="60" y2="60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  </svg>

                  <div ref={addSparkleRef} className="absolute bottom-[15px] left-[-10px] w-14 h-14 rounded-full border-[4px] border-white/60 flex items-center justify-center bg-white/30 backdrop-blur-md z-0 shadow-[0_8px_16px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-indigo-500 drop-shadow-sm">
                        <path d="M 5 13 L 10 18 L 19 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
                    className="absolute top-[-10px] right-[0px] z-30 text-center drop-shadow-sm">
                    <span className="text-slate-700 font-medium text-[14px] block leading-[1.1] rotate-[6deg]" style={{ fontFamily: "'Comic Sans MS', 'Caveat', cursive" }}>
                      Same<br/>Powerful Tools<br/>On Mobile
                    </span>
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="text-slate-400 absolute -bottom-8 left-2">
                      <path d="M 20 10 Q 50 30 50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <path d="M 35 70 L 50 80 L 65 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </motion.div>

                  {/* --- DARK PHONE --- */}
                  <div ref={darkPhoneRef}
                    className="absolute right-[10px] top-[40px] w-[155px] h-[310px] bg-[#0f172a] rounded-[2rem] shadow-[25px_35px_60px_rgba(0,0,0,0.35),inset_-2px_-2px_6px_rgba(255,255,255,0.1),inset_2px_2px_4px_rgba(255,255,255,0.05)] overflow-hidden z-10 flex flex-col border-[4px] border-[#1e293b]"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[38%] h-3.5 bg-black rounded-full z-20 flex items-center justify-end px-1 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.2)]">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
                    </div>
                    
                    <div className="p-3 pt-9 h-full flex flex-col relative bg-gradient-to-b from-[#1a1c29] to-[#0f172a]">
                       <div className="flex justify-between items-center mb-5 text-slate-400 px-1">
                         <span className="text-[6.5px] font-semibold text-white">9:41</span>
                         <Zap size={9} className="fill-current text-white"/>
                       </div>
                       
                       <div className="relative flex-1 rounded-[0.9rem] overflow-hidden flex items-center justify-center bg-[#1e293b]/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] border border-white/5">
                          <svg className="absolute inset-0 w-full h-full text-white/10" style={{ zIndex: 0 }}>
                             <line x1="50%" y1="50%" x2="15%" y2="25%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4"/>
                             <line x1="50%" y1="50%" x2="85%" y2="35%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4"/>
                             <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4"/>
                             <line x1="50%" y1="50%" x2="75%" y2="85%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4"/>
                          </svg>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-indigo-500/30 rounded-full blur-xl z-0"></div>

                          <div className="w-[55px] h-[55px] rounded-full bg-gradient-to-tr from-[#6366f1] to-[#d946ef] flex items-center justify-center text-white text-[11px] font-bold absolute z-10 shadow-[0_0_25px_rgba(139,92,246,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-white/20 backdrop-blur-md">
                            Ideas
                            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" className="absolute -top-3 right-0 text-pink-300 drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]">
                               <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 20 20 L 80 80 M 20 80 L 80 20" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                            </svg>
                          </div>

                          <div className="absolute top-[12%] left-[8%] px-1.5 py-0.5 rounded-[6px] bg-[#fef08a] text-[8px] font-bold text-yellow-900 shadow-md">Plan</div>
                          <div className="absolute top-[32%] right-[-2%] px-1.5 py-0.5 rounded-[6px] bg-[#fbcfe8] text-[8px] font-bold text-pink-900 shadow-md">Create</div>
                          <div className="absolute bottom-[22%] left-[4%] px-1.5 py-0.5 rounded-[6px] bg-[#a7f3d0] text-[8px] font-bold text-emerald-900 shadow-md">Learn</div>
                          <div className="absolute bottom-[12%] right-[8%] px-1.5 py-0.5 rounded-[6px] bg-[#c7d2fe] text-[8px] font-bold text-indigo-900 shadow-md">Grow</div>
                       </div>
                    </div>
                  </div>

                  {/* --- LIGHT PHONE --- */}
                  <div ref={lightPhoneRef}
                    className="absolute left-[15px] top-[10px] w-[180px] h-[350px] bg-[#f8fafc] rounded-[2.2rem] shadow-[30px_40px_70px_rgba(0,0,0,0.25),-5px_-5px_15px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,1)] overflow-hidden z-20 flex flex-col border-[5px] border-[#cbd5e1] ring-1 ring-slate-200"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-3.5 bg-black rounded-full z-20 flex items-center justify-end px-1.5 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.3)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60 shadow-[0_0_4px_rgba(59,130,246,0.8)]"></div>
                    </div>
                    
                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-b from-white/40 to-transparent rotate-45 pointer-events-none z-20 translate-y-[-20%]"></div>

                    <div className="p-3.5 pt-10 h-full flex flex-col bg-white relative shadow-[inset_0_0_15px_rgba(0,0,0,0.03)] rounded-[1.8rem]">
                       <div className="flex justify-between items-center mb-4 px-1 z-10 relative">
                         <div className="flex items-center gap-1.5">
                           <img src="/Stiknex.png" alt="Stiknex Logo" className="w-4 h-4 object-contain drop-shadow-sm rounded-[3px]" />
                           <span className="text-[10px] font-extrabold text-slate-800 tracking-tight">Stiknex</span>
                         </div>
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div></div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mb-3 z-10 relative">
                         {[
                           { name: 'Whiteboard', sub: 'Brainstorm', Icon: PenTool, bg: 'bg-[#eff6ff]', clr: 'text-[#3b82f6]' },
                           { name: 'Sticky Notes', sub: 'Quick Ideas', Icon: StickyNote, bg: 'bg-[#fffbeb]', clr: 'text-[#f59e0b]' },
                           { name: 'Notepad', sub: 'Organize', Icon: FileText, bg: 'bg-[#ecfdf5]', clr: 'text-[#10b981]' },
                           { name: 'Notebook', sub: 'Details', Icon: Book, bg: 'bg-[#fdf2f8]', clr: 'text-[#ec4899]' }
                         ].map(card => (
                           <div key={card.name} className="bg-white rounded-[1.2rem] shadow-[0_4px_15px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)_inset] p-2.5 flex flex-col items-center justify-center text-center aspect-[1/1.05] relative overflow-hidden group">
                              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className={`w-7 h-7 rounded-full ${card.bg} ${card.clr} flex items-center justify-center mb-2 shadow-sm relative z-10`}>
                                <card.Icon size={12} strokeWidth={2.5}/>
                              </div>
                              <p className="text-[10px] font-bold text-slate-800 leading-tight relative z-10">{card.name}</p>
                              <p className="text-[6.5px] font-medium text-slate-400 mt-1 relative z-10">{card.sub}</p>
                           </div>
                         ))}
                       </div>

                       <div className="absolute bottom-5 left-3 right-3 bg-white/80 backdrop-blur-md rounded-[1.4rem] p-2 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.6)_inset] z-10">
                          <div className="w-10 flex justify-center"><LayoutDashboard size={16} className="text-[#6366f1]" strokeWidth={2.5} /></div>
                          <div className="w-10 h-10 bg-gradient-to-tr from-[#6366f1] to-[#a855f7] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(99,102,241,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)]">
                            <span className="text-[20px] font-light leading-none mb-0.5">+</span>
                          </div>
                          <div className="w-10 flex justify-center"><Settings size={16} className="text-slate-400" strokeWidth={2.5} /></div>
                       </div>
                    </div>
                  </div>

                </div>

                {/* --- QR CODE TAG --- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, type: "spring" }}
                  className="absolute bottom-4 right-6 bg-white/70 backdrop-blur-xl border border-white/80 p-2 pr-5 rounded-[1.2rem] shadow-[0_15px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] z-50 flex items-center gap-3"
                >
                  <div className="w-[46px] h-[46px] bg-white rounded-[0.8rem] p-1 shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-center">
                    <QRCode value={apkDownloadUrl} size={38} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase">Scan to Install</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Stiknex for Android</span>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
