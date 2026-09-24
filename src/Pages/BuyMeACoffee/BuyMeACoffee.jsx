import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import AppShell from "../../Component/Layout/AppShell";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { API_BASE_URL } from "../../config/api";
import PageSEO from "../../Component/SEO/PageSEO";
import { Heart, Code2, Sparkles, Coffee, ShieldCheck, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MIN_AMOUNT = 10;
const PRESET_AMOUNTS = [10, 20, 50, 100, 200, 500];

// ==========================================
// React Bits Inspired Components
// ==========================================

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
    <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 dark:bg-cyan-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-40"></div>
    
    <style>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob { animation: blob 15s infinite alternate ease-in-out; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `}</style>
  </div>
);

const SplitText = ({ text, className }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 50, rotate: 5 },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ShinyText = ({ children, className }) => (
  <div className={`relative inline-block overflow-hidden ${className}`}>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-900 to-amber-600 dark:from-amber-400 dark:via-white dark:to-amber-400 bg-[length:200%_auto] animate-shine">
      {children}
    </span>
    <style>{`
      @keyframes shine { to { background-position: 200% center; } }
      .animate-shine { animation: shine 3s linear infinite; }
    `}</style>
  </div>
);


const BuyMeACoffee = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [supporterCount, setSupporterCount] = useState(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let cancelled = false;
    fetch(`${API_BASE_URL}/supporters`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setSupporterCount(data.totalSupporters); })
      .catch(() => { if (!cancelled) setSupporterCount(null); });
      
    return () => { 
      cancelled = true; 
      lenis.destroy();
    };
  }, []);

  const getFinalAmount = () => isCustom ? Number(customAmount) : selectedAmount;

  const handlePresetClick = (amount) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setError("");
  };

  const handleCustomChange = (e) => {
    setIsCustom(true);
    setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
    setError("");
  };

  const handleDonate = async () => {
    const amount = getFinalAmount();
    if (!amount || amount < MIN_AMOUNT) {
      setError(`Minimum donation amount is ₹${MIN_AMOUNT}.`);
      return;
    }
    setError("");
    setStatus("loading");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load payment gateway. Check your internet connection.");
        setStatus("idle");
        return;
      }

      const orderRes = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "Could not create order. Please try again.");
        setStatus("idle");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Stiknex",
        description: "Support Stiknex",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setStatus("success");
              setSupporterCount(verifyData.totalSupporters);
            } else {
              setError(verifyData.error || "Payment verification failed.");
              setStatus("idle");
            }
          } catch {
            setError("Network error while verifying payment.");
            setStatus("idle");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
        theme: { color: "#4f46e5" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setStatus("idle");
      });
      razorpayInstance.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Support Stiknex"
        description="Stiknex is free to use. If it's helped you stay organized, you can support its development."
        path="/buy-me-a-coffee"
      />
      
      <div className="relative min-h-screen">
        <AuroraBackground />

        <div className="relative z-10 pt-24 pb-32">
          
          {/* ================= HERO SECTION ================= */}
          <motion.section style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center justify-center px-6 text-center mb-24">
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, duration: 1.5 }}
              className="w-24 h-24 rounded-[2rem] bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/20"
            >
              <Coffee className="text-amber-500 w-12 h-12 drop-shadow-lg" />
            </motion.div>

            <SplitText 
              text="Fuel the Mission" 
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-6"
            />
            
            <motion.p 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium"
            >
              Stiknex is free for everyone, forever. Your support covers servers, fuels development, and keeps the dream alive.
            </motion.p>
          </motion.section>

          {/* ================= PAYMENT CARD SECTION ================= */}
          <section className="max-w-xl mx-auto px-6 mb-32 relative">
            <FadeIn>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 blur-3xl rounded-[3rem] -z-10"></div>
              
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/50 dark:border-slate-700/50 p-8 md:p-12">
                
                <label className="block text-sm font-black text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-widest text-center">
                  <ShinyText>Select an amount</ShinyText>
                </label>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {PRESET_AMOUNTS.map((amount) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={amount}
                      type="button"
                      className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                        !isCustom && selectedAmount === amount
                          ? "bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => handlePresetClick(amount)}
                    >
                      ₹{amount}
                    </motion.button>
                  ))}
                </div>

                <div className="mb-8 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold">₹</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={`Custom Amount (Min ₹${MIN_AMOUNT})`}
                    value={customAmount}
                    onFocus={() => setIsCustom(true)}
                    onChange={handleCustomChange}
                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 dark:text-white font-bold"
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-bold mb-6 text-center bg-red-500/10 py-3 rounded-xl">
                    {error}
                  </motion.p>
                )}

                {status === "success" ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center gap-3 font-bold border border-emerald-500/20">
                    <Heart className="fill-emerald-500 text-emerald-500" />
                    Thank you for fueling Stiknex!
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDonate}
                    disabled={status === "loading"}
                    className="w-full py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {status === "loading" ? (
                      <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                    ) : (
                      <><Coffee size={24} /> Buy Me A Coffee</>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Supporter Count Badge */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="mt-8 flex items-center justify-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/50 dark:border-slate-700/50 shadow-lg mx-auto w-max"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500">
                  <Heart size={20} className="fill-red-500 animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {supporterCount === null ? "..." : supporterCount} Amazing Supporters
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          </section>

          {/* ================= A MESSAGE FROM THE CREATOR ================= */}
          <section className="max-w-6xl mx-auto px-6 mb-32">
            <FadeIn>
              <div className="w-full rounded-[3rem] bg-gradient-to-br from-indigo-50/80 to-slate-100 dark:from-indigo-950 dark:to-slate-900 p-8 md:p-16 border border-indigo-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                  
                  {/* Photo */}
                  <div className="w-48 h-48 lg:w-64 lg:h-64 shrink-0 rounded-[2rem] bg-gradient-to-tr from-amber-400 to-indigo-500 p-1 shadow-2xl transform -rotate-3 transition-transform duration-500 hover:rotate-0">
                    <div className="w-full h-full rounded-[1.8rem] bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                      <img src="/creator.jpg" alt="Vishal Mall" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-[1.8rem]"></div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1 text-center lg:text-left text-slate-900 dark:text-white">
                    <h3 className="text-3xl lg:text-5xl font-black mb-6">Hey! I'm Vishal Mall.</h3>
                    <p className="text-indigo-600 dark:text-indigo-300 text-lg lg:text-xl font-bold mb-6 leading-relaxed">
                      I'm a Frontend Developer at Starchain Lab, based in Bhopal. I built Stiknex out of pure passion for clean design, fast performance, and a frustration with modern productivity tools that demand internet access for everything.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 font-medium">
                      I have put hundreds of hours into making this workspace infinite, snappy, and entirely free. If Stiknex has saved you time, helped you organize chaos, or just made your workflow a bit more beautiful—a small contribution goes a long way in paying for servers and giving me the caffeine I need to ship the next big update.
                    </p>
                    
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        <ShieldCheck size={24} /> 100% Free Forever
                      </div>
                      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold">
                        <Zap size={24} /> Indie Developed
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          </section>

        </div>
      </div>
    </AppShell>
  );
};

export default BuyMeACoffee;
