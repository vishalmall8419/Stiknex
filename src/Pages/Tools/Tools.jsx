import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";

import SimpleCalculator from "./Simplecalculator/Simplecalculator";
import ScientificCalculator from "./Scientificcalculator/Scientificcalculator";
import DateTimeCalculator from "./Datetimecalculator/Datetimecalculator";
import DataConverter from "./Dataconverter/Dataconverter";
import UnitConverter from "./UnitConverter/UnitConverter";
import TemperatureConverter from "./UnitConverter/TemperatureConverter";
import CurrencyConverter from "./CurrencyConverter/CurrencyConverter";
import QRCodeGenerator from "./QRCodeGenerator/QRCodeGenerator";
import PasswordGenerator from "./PasswordGenerator/PasswordGenerator";
import ColorPicker from "./ColorPicker/ColorPicker";

import {
  LENGTH_UNITS,
  AREA_UNITS,
  VOLUME_UNITS,
  WEIGHT_UNITS,
  SPEED_UNITS,
  PRESSURE_UNITS,
  POWER_UNITS,
} from "./UnitConverter/unitData";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { id: "simple", icon: "fa-solid fa-calculator", title: "Simple Calculator", desc: "Quick everyday arithmetic." },
  { id: "scientific", icon: "fa-solid fa-square-root-variable", title: "Scientific Calculator", desc: "Trigonometry, logs, powers & roots." },
  { id: "datetime", icon: "fa-solid fa-calendar-days", title: "Date & Time", desc: "Age, differences, countdowns." },
  { id: "converter", icon: "fa-solid fa-arrows-turn-to-dots", title: "Data Converter", desc: "Bytes, MB, GB, Binary, Hex." },
  { id: "currency", icon: "fa-solid fa-money-bill-transfer", title: "Currency Converter", desc: "Live exchange rates." },
  { id: "length", icon: "fa-solid fa-ruler", title: "Length Converter", desc: "Millimeters to miles." },
  { id: "area", icon: "fa-solid fa-border-all", title: "Area Converter", desc: "Square meters, acres & more." },
  { id: "volume", icon: "fa-solid fa-flask", title: "Volume Converter", desc: "Liters, cups, gallons." },
  { id: "weight", icon: "fa-solid fa-weight-hanging", title: "Weight Converter", desc: "Grams, kilograms, pounds." },
  { id: "temperature", icon: "fa-solid fa-temperature-half", title: "Temperature", desc: "Celsius, Fahrenheit & Kelvin." },
  { id: "speed", icon: "fa-solid fa-gauge-high", title: "Speed Converter", desc: "Km/h, mph, knots." },
  { id: "pressure", icon: "fa-solid fa-compress", title: "Pressure Converter", desc: "Pascals, bar, PSI." },
  { id: "power", icon: "fa-solid fa-bolt", title: "Power Converter", desc: "Watts, horsepower, BTU." },
  { id: "qrcode", icon: "fa-solid fa-qrcode", title: "QR Code Generator", desc: "Turn text into a QR code." },
  { id: "password", icon: "fa-solid fa-key", title: "Password Generator", desc: "Strong, random passwords." },
  { id: "color", icon: "fa-solid fa-palette", title: "Color Picker", desc: "HEX, RGB & HSL, instantly." },
];

const SplitText = ({ text, className }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 40 },
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

const ShinyText = ({ children, className }) => (
  <div className={`relative inline-block overflow-hidden ${className}`}>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-900 to-indigo-600 dark:from-indigo-400 dark:via-white dark:to-indigo-400 bg-[length:200%_auto] animate-shine">
      {children}
    </span>
    <style>{`
      @keyframes shine { to { background-position: 200% center; } }
      .animate-shine { animation: shine 3s linear infinite; }
    `}</style>
  </div>
);

const ToolModal = ({ activeTool, onClose }) => {
  if (!activeTool) return null;
  const tool = tools.find(t => t.id === activeTool);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl flex flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800 h-[90vh] sm:h-auto sm:max-h-[85vh] overscroll-contain"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner border border-indigo-200/50 dark:border-indigo-500/20">
              <i className={`${tool.icon} text-lg sm:text-xl`}></i>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{tool.title}</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">{tool.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0">
            <i className="fa-solid fa-xmark text-base sm:text-lg"></i>
          </button>
        </div>
        
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto flex flex-col overscroll-contain" data-lenis-prevent="true">
          {activeTool === "simple" && <SimpleCalculator />}
          {activeTool === "scientific" && <ScientificCalculator />}
          {activeTool === "datetime" && <DateTimeCalculator />}
          {activeTool === "converter" && <DataConverter />}
          {activeTool === "currency" && <CurrencyConverter />}
          {activeTool === "length" && <UnitConverter units={LENGTH_UNITS} defaultUnit="m" />}
          {activeTool === "area" && <UnitConverter units={AREA_UNITS} defaultUnit="sqm" />}
          {activeTool === "volume" && <UnitConverter units={VOLUME_UNITS} defaultUnit="l" />}
          {activeTool === "weight" && <UnitConverter units={WEIGHT_UNITS} defaultUnit="kg" />}
          {activeTool === "temperature" && <TemperatureConverter />}
          {activeTool === "speed" && <UnitConverter units={SPEED_UNITS} defaultUnit="kph" />}
          {activeTool === "pressure" && <UnitConverter units={PRESSURE_UNITS} defaultUnit="pa" />}
          {activeTool === "power" && <UnitConverter units={POWER_UNITS} defaultUnit="w" />}
          {activeTool === "qrcode" && <QRCodeGenerator />}
          {activeTool === "password" && <PasswordGenerator />}
          {activeTool === "color" && <ColorPicker />}
        </div>
      </motion.div>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 }
  }
};

const Tools = () => {
  const [activeTool, setActiveTool] = useState(null);

  useEffect(() => {
    // Lenis Smooth Scrolling Setup
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

    return () => { 
      lenis.destroy();
    };
  }, []);

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Tools & Converters"
        description="A complete suite of productivity tools, calculators, and converters."
        path="/tools"
      />

      <div className="relative min-h-screen pb-32">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-30 -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute top-[20%] left-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-24">
          
          {/* ================= HERO SECTION ================= */}
          <div className="text-center mb-24 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, duration: 1.5 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30"
            >
              <i className="fa-solid fa-screwdriver-wrench text-3xl text-white"></i>
            </motion.div>

            <SplitText text="Powerful Tools" className="text-5xl md:text-7xl font-black mb-4 text-slate-900 dark:text-white tracking-tight" />
            <div className="text-xl md:text-3xl font-bold mb-6">
              <ShinyText>At Your Fingertips</ShinyText>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl text-center font-medium"
            >
              Everything you need to calculate, convert, generate, and measure, built natively into your offline-first workspace.
            </motion.p>
          </div>

          {/* ================= TOOLS GRID ================= */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
          >
            {tools.map((t) => (
              <motion.button
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className="tool-card group flex flex-col text-left p-6 md:p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/5 group-hover:to-cyan-500/5 transition-colors duration-300"></div>

                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-all duration-300 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                  <i className={t.icon}></i>
                </div>
                
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed relative z-10">
                  {t.desc}
                </p>
                
                {/* Arrow Icon on Hover */}
                <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </motion.button>
            ))}
          </motion.div>

        </div>
      </div>

      <ToolModal activeTool={activeTool} onClose={() => setActiveTool(null)} />
    </AppShell>
  );
};

export default Tools;