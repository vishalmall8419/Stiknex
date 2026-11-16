import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Percent,
  Bookmark,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Wallet,
  PiggyBank,
  Receipt
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { formatDateDDMMYYYY, formatHistoryTimestamp } from "../../../utils/dateFormat";

/**
 * Universal Enterprise Finance & Wealth Intelligence Workstation
 * Consolidates all 10 Finance Calculators into an expansive, full-page workstation:
 * - Loan EMI Calculator & Loan Payoff Planner
 * - SIP Calculator & Savings Goal Planner
 * - Compound & Simple Interest Calculators
 * - GST / Sales Tax & Discount / Tip Calculators
 * - 50/30/20 Budget Allocation Planner
 */

const RELATED_FINANCE_TOOLS = [
  { slug: "emi-calculator", title: "EMI Calculator", icon: "fa-solid fa-calculator", desc: "Monthly installments, total interest & amortization" },
  { slug: "sip-calculator", title: "SIP Calculator", icon: "fa-solid fa-chart-line", desc: "Estimate wealth accumulated from systematic investments" },
  { slug: "compound-interest-calculator", title: "Compound Interest", icon: "fa-solid fa-percent", desc: "Annual and monthly compounding interest growth" },
  { slug: "gst-calculator", title: "GST & Tax Calculator", icon: "fa-solid fa-receipt", desc: "Calculate standard 5%, 12%, 18%, 28% GST slabs" },
  { slug: "budget-planner", title: "50/30/20 Budget", icon: "fa-solid fa-wallet", desc: "Plan personal finances by Needs, Wants, and Savings" },
  { slug: "savings-goal-calculator", title: "Savings Goal", icon: "fa-solid fa-piggy-bank", desc: "Target amount timeline and required deposits" }
];

export default function FinanceEngine({ slug = "emi-calculator", toolId = "emi-calculator", tool, seoData }) {
  const { theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  // 1. Identify Financial Semantic Cluster based on active slug
  const cluster = useMemo(() => {
    if (slug === "sip-calculator" || slug === "savings-goal-calculator") return "wealth";
    if (slug === "compound-interest-calculator" || slug === "simple-interest-calculator") return "interest";
    if (slug === "gst-calculator" || slug === "discount-calculator" || slug === "tip-calculator") return "retail";
    if (slug === "budget-planner") return "budget";
    return "loans"; // default for emi-calculator, loan-payoff-calculator
  }, [slug]);

  // Contextual Cluster Tabs (Strictly relevant tools only)
  const clusterTabs = useMemo(() => {
    switch (cluster) {
      case "loans":
        return [
          { id: "loans", label: "Monthly EMI Calculator", slug: "emi-calculator" },
          { id: "loans", label: "Loan Payoff & Prepayment", slug: "loan-payoff-calculator" }
        ];
      case "wealth":
        return [
          { id: "sip", label: "SIP Wealth Calculator", slug: "sip-calculator" },
          { id: "sip", label: "Savings Goal & Target", slug: "savings-goal-calculator" }
        ];
      case "interest":
        return [
          { id: "interest", label: "Compound Interest", slug: "compound-interest-calculator" },
          { id: "interest", label: "Simple Interest", slug: "simple-interest-calculator" }
        ];
      case "retail":
        return [
          { id: "tax-tip", label: "GST & Sales Tax", slug: "gst-calculator" },
          { id: "tax-tip", label: "Discount Calculator", slug: "discount-calculator" },
          { id: "tax-tip", label: "Tip & Bill Splitter", slug: "tip-calculator" }
        ];
      case "budget":
        return [
          { id: "budget", label: "50/30/20 Personal Budget", slug: "budget-planner" }
        ];
      default:
        return [];
    }
  }, [cluster]);

  // Mode Selection: 'loans' | 'sip' | 'interest' | 'tax-tip' | 'budget'
  const initialMode = useMemo(() => {
    if (cluster === "wealth") return "sip";
    if (cluster === "interest") return "interest";
    if (cluster === "retail") return "tax-tip";
    if (cluster === "budget") return "budget";
    return "loans";
  }, [cluster]);

  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Dynamic Tool Title & Metadata based on the current slug
  const titleConfig = useMemo(() => {
    switch (slug) {
      case "emi-calculator":
        return { prefix: "Loan EMI", highlight: "Calculator", tag: "Amortization", subtitle: "Monthly installment, total interest & loan payout" };
      case "sip-calculator":
        return { prefix: "SIP Wealth", highlight: "Calculator", tag: "Mutual Funds", subtitle: "Systematic investment plan returns & maturity corpus" };
      case "compound-interest-calculator":
        return { prefix: "Compound", highlight: "Interest", tag: "Investment", subtitle: "Growth by compounding frequency (annual, monthly)" };
      case "simple-interest-calculator":
        return { prefix: "Simple", highlight: "Interest", tag: "Basic Math", subtitle: "Standard P × R × T / 100 quick interest calculator" };
      case "loan-payoff-calculator":
        return { prefix: "Loan Payoff", highlight: "Planner", tag: "Debt Freedom", subtitle: "Extra prepayments, interest savings & timeline" };
      case "gst-calculator":
        return { prefix: "GST & Tax", highlight: "Calculator", tag: "Tax Engine", subtitle: "Add or remove GST (5%, 12%, 18%, 28%) with split" };
      case "discount-calculator":
        return { prefix: "Discount", highlight: "Calculator", tag: "Shopping", subtitle: "Price reduction, final checkout amount & savings" };
      case "tip-calculator":
        return { prefix: "Tip & Bill", highlight: "Splitter", tag: "Dining", subtitle: "Calculate gratuity percentages and split bill per person" };
      case "budget-planner":
        return { prefix: "50/30/20", highlight: "Budget", tag: "Financial Rule", subtitle: "Needs (50%), Wants (30%), and Savings (20%) breakdown" };
      case "savings-goal-calculator":
        return { prefix: "Savings", highlight: "Goal", tag: "Target Planner", subtitle: "Monthly deposit required to reach target milestone" };
      default:
        return { prefix: "Finance", highlight: "Engine", tag: "Pro Wealth", subtitle: "Loans, investments, compound interest & budgeting" };
    }
  }, [slug]);

  // Common UI State
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [companionTab, setCompanionTab] = useState("overview"); // 'overview' | 'history'

  // Web Audio Tactile Sound
  const audioCtxRef = useRef(null);
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(560, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, audioCtxRef.current.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {
      // AudioContext
    }
  }, [soundEnabled]);

  // Saved Calculations Tape
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_finance_calc_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = useCallback((entry) => {
    setHistory((prev) => {
      const updated = [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...entry
        },
        ...prev.slice(0, 24)
      ];
      try {
        localStorage.setItem("stiknex_finance_calc_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteHistoryItem = (id, e) => {
    e?.stopPropagation();
    playClickSound();
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem("stiknex_finance_calc_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    playClickSound();
    setHistory([]);
    localStorage.removeItem("stiknex_finance_calc_history");
  };

  // ============================================================================
  // 1. LOAN & EMI STATE
  // ============================================================================
  const [loanPrincipal, setLoanPrincipal] = useState(1000000); // 1,000,000
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(15);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(0);

  const loanResults = useMemo(() => {
    const P = parseFloat(loanPrincipal);
    const r = parseFloat(loanRate) / 12 / 100;
    const n = parseFloat(loanTenureYears) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r <= 0 || n <= 0) return null;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Extra payment calculation (Payoff Planner)
    let payoffMonths = n;
    let savedInterest = 0;
    if (extraMonthlyPayment > 0) {
      let balance = P;
      let month = 0;
      let extraTotalInterest = 0;
      const combinedPayment = emi + parseFloat(extraMonthlyPayment);

      while (balance > 0 && month < n) {
        month++;
        const interestMonth = balance * r;
        const principalMonth = combinedPayment - interestMonth;
        extraTotalInterest += interestMonth;
        balance -= principalMonth;
      }
      payoffMonths = month;
      savedInterest = Math.max(0, Math.round(totalInterest - extraTotalInterest));
    }

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPercent: Math.round((P / totalPayment) * 100),
      interestPercent: Math.round((totalInterest / totalPayment) * 100),
      payoffYears: (payoffMonths / 12).toFixed(1),
      savedInterest
    };
  }, [loanPrincipal, loanRate, loanTenureYears, extraMonthlyPayment]);

  // ============================================================================
  // 2. SIP & SAVINGS GOAL STATE
  // ============================================================================
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [sipExpectedRate, setSipExpectedRate] = useState(12);
  const [sipTenureYears, setSipTenureYears] = useState(10);

  const sipResults = useMemo(() => {
    const P = parseFloat(sipMonthly);
    const i = parseFloat(sipExpectedRate) / 12 / 100;
    const n = parseFloat(sipTenureYears) * 12;

    if (isNaN(P) || isNaN(i) || isNaN(n) || P <= 0 || i <= 0 || n <= 0) return null;

    // Formula: M * [( (1+i)^n - 1 ) / i] * (1+i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const wealthGain = futureValue - totalInvested;

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      wealthGain: Math.round(wealthGain),
      wealthMultiplier: (futureValue / totalInvested).toFixed(1)
    };
  }, [sipMonthly, sipExpectedRate, sipTenureYears]);

  // ============================================================================
  // 3. COMPOUND & SIMPLE INTEREST STATE
  // ============================================================================
  const [interestPrincipal, setInterestPrincipal] = useState(500000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [interestYears, setInterestYears] = useState(5);
  const [compoundFrequency, setCompoundFrequency] = useState(12); // Monthly = 12, Annually = 1, Quarterly = 4

  const interestResults = useMemo(() => {
    const P = parseFloat(interestPrincipal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(interestYears);
    const n = parseFloat(compoundFrequency);

    if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r <= 0 || t <= 0) return null;

    // Simple Interest
    const simpleInterest = P * r * t;
    const simpleTotal = P + simpleInterest;

    // Compound Interest: A = P(1 + r/n)^(nt)
    const compoundTotal = P * Math.pow(1 + r / n, n * t);
    const compoundInterest = compoundTotal - P;

    return {
      simpleInterest: Math.round(simpleInterest),
      simpleTotal: Math.round(simpleTotal),
      compoundInterest: Math.round(compoundInterest),
      compoundTotal: Math.round(compoundTotal),
      compoundDifference: Math.round(compoundInterest - simpleInterest)
    };
  }, [interestPrincipal, interestRate, interestYears, compoundFrequency]);

  // ============================================================================
  // 4. TAX (GST), DISCOUNT & TIP STATE
  // ============================================================================
  const [billAmount, setBillAmount] = useState(2500);
  const [gstRate, setGstRate] = useState(18); // 5, 12, 18, 28
  const [gstType, setGstType] = useState("exclusive"); // 'exclusive' (add GST) | 'inclusive' (extract GST)
  const [discountPercent, setDiscountPercent] = useState(15);
  const [tipPercent, setTipPercent] = useState(10);
  const [splitCount, setSplitCount] = useState(2);

  const taxTipResults = useMemo(() => {
    const B = parseFloat(billAmount);
    const g = parseFloat(gstRate) / 100;
    const d = parseFloat(discountPercent) / 100;
    const tp = parseFloat(tipPercent) / 100;
    const people = Math.max(1, parseInt(splitCount) || 1);

    if (isNaN(B) || B <= 0) return null;

    // GST
    let gstAmount = 0;
    let netPrice = B;
    let finalWithGst = B;

    if (gstType === "exclusive") {
      gstAmount = B * g;
      finalWithGst = B + gstAmount;
    } else {
      netPrice = B / (1 + g);
      gstAmount = B - netPrice;
      finalWithGst = B;
    }

    // Discount
    const discountAmount = B * d;
    const priceAfterDiscount = B - discountAmount;

    // Tip & Bill Split
    const tipAmount = B * tp;
    const grandTotalWithTip = B + tipAmount;
    const perPersonShare = grandTotalWithTip / people;

    return {
      gstAmount: Math.round(gstAmount),
      cgst: (gstAmount / 2).toFixed(2),
      sgst: (gstAmount / 2).toFixed(2),
      finalWithGst: Math.round(finalWithGst),
      discountAmount: Math.round(discountAmount),
      priceAfterDiscount: Math.round(priceAfterDiscount),
      tipAmount: Math.round(tipAmount),
      grandTotalWithTip: Math.round(grandTotalWithTip),
      perPersonShare: Math.round(perPersonShare)
    };
  }, [billAmount, gstRate, gstType, discountPercent, tipPercent, splitCount]);

  // ============================================================================
  // 5. 50/30/20 BUDGET STATE
  // ============================================================================
  const [monthlyIncome, setMonthlyIncome] = useState(75000);

  const budgetResults = useMemo(() => {
    const inc = parseFloat(monthlyIncome);
    if (isNaN(inc) || inc <= 0) return null;

    return {
      needs: Math.round(inc * 0.5), // 50%
      wants: Math.round(inc * 0.3), // 30%
      savings: Math.round(inc * 0.2) // 20%
    };
  }, [monthlyIncome]);

  // Copy result helper
  const handleCopyResult = (val, label = "Calculation") => {
    if (!val) return;
    playClickSound();
    navigator.clipboard.writeText(String(val));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 dark:bg-[#070b14] flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white pb-8">
      
      {/* Universal Stiknex Sidebar Drawer */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_FINANCE_TOOLS}
        categoryTitle="Related Financial Calculators"
      />

      {/* ══════════════════════════════════════════════════════════════════
          UNIFIED TOP NAVIGATION BAR (SLEEK FROSTED GLASS)
      ══════════════════════════════════════════════════════════════════ */}
      <header className="w-full px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-30 transition-colors">
        
        {/* Left: Drawer Trigger + Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Open Tools Navigation Drawer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  <span>{titleConfig.prefix}</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-cyan-400">
                    {titleConfig.highlight}
                  </span>
                </h1>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 tracking-wider uppercase">
                  {titleConfig.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5 truncate max-w-[240px] 2xl:max-w-none">
                {titleConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Workstation Mode Selector (Contextual Cluster Tabs Only) */}
        {clusterTabs.length > 1 ? (
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner shrink-0">
            {clusterTabs.map((t) => {
              const isActive = slug === t.slug;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    playClickSound();
                    setMode(t.id);
                    navigate(`/${t.slug}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-black/5"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            {clusterTabs[0]?.label || "Finance Intelligence"}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help & Formulas Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Formulas & Real-World Guide (?)"
            aria-label="Open Formulas & Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            title="Toggle theme"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Copy Results */}
          <button
            onClick={() => {
              if (mode === "loans" && loanResults) {
                handleCopyResult(`EMI: ₹${loanResults.monthlyEmi.toLocaleString()} | Total Interest: ₹${loanResults.totalInterest.toLocaleString()} | Total: ₹${loanResults.totalPayment.toLocaleString()}`);
                saveToHistory({ title: `Loan EMI: ₹${loanResults.monthlyEmi.toLocaleString()}`, details: `Principal: ₹${parseFloat(loanPrincipal).toLocaleString()} @ ${loanRate}% for ${loanTenureYears}y` });
              } else if (mode === "sip" && sipResults) {
                handleCopyResult(`SIP Maturity: ₹${sipResults.futureValue.toLocaleString()} | Invested: ₹${sipResults.totalInvested.toLocaleString()} | Wealth Gain: ₹${sipResults.wealthGain.toLocaleString()}`);
                saveToHistory({ title: `SIP Corpus: ₹${sipResults.futureValue.toLocaleString()}`, details: `₹${parseFloat(sipMonthly).toLocaleString()}/mo @ ${sipExpectedRate}% for ${sipTenureYears}y` });
              } else if (mode === "interest" && interestResults) {
                handleCopyResult(`Compound Interest: ₹${interestResults.compoundInterest.toLocaleString()} | Total: ₹${interestResults.compoundTotal.toLocaleString()}`);
                saveToHistory({ title: `Interest: ₹${interestResults.compoundInterest.toLocaleString()}`, details: `₹${parseFloat(interestPrincipal).toLocaleString()} @ ${interestRate}% for ${interestYears}y` });
              }
            }}
            className="px-3.5 h-9 sm:h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
            title="Copy current result to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN WORKSTATION LAYOUT (FULL-SCREEN DUAL-STATION ON DESKTOP)
      ══════════════════════════════════════════════════════════════════ */}
      <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* Full-Width 12-Column Grid on Desktop */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT / PRIMARY TERMINAL (8 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
            
            {/* Mobile Mode Switcher (< md) */}
            {clusterTabs.length > 1 && (
              <div className="md:hidden flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold overflow-x-auto">
                {clusterTabs.map((t) => {
                  const isActive = slug === t.slug;
                  return (
                    <button
                      key={t.slug}
                      onClick={() => {
                        playClickSound();
                        setMode(t.id);
                        navigate(`/${t.slug}`);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl transition cursor-pointer text-center whitespace-nowrap ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ─── MODE 1: LOANS & EMI CALCULATOR ─── */}
            {mode === "loans" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Loan EMI &amp; Payoff Planner
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Fixed Rate Amortization</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Loan Amount */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Loan Amount (₹ / $)
                    </label>
                    <input
                      type="number"
                      value={loanPrincipal}
                      onChange={(e) => setLoanPrincipal(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[500000, 1000000, 2500000, 5000000].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setLoanPrincipal(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {v >= 10000000 ? `${v / 10000000}Cr` : `${v / 100000}L`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[7.5, 8.5, 9.5, 11.0].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setLoanRate(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tenure */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Tenure (Years)
                    </label>
                    <input
                      type="number"
                      value={loanTenureYears}
                      onChange={(e) => setLoanTenureYears(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[5, 10, 15, 20, 30].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setLoanTenureYears(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {v}y
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extra Monthly Payment Option (Debt Payoff Accelerometer) */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Prepayment Accelerator (Extra Monthly ₹)
                    </span>
                    <span className="block text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      See how much interest and years you save by paying a little extra each month.
                    </span>
                  </div>
                  <div className="w-full sm:w-44">
                    <input
                      type="number"
                      value={extraMonthlyPayment}
                      onChange={(e) => setExtraMonthlyPayment(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── MODE 2: SIP & WEALTH ACCUMULATOR ─── */}
            {mode === "sip" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Systematic Investment Plan (SIP) Compounder
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Monthly Compounding</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Monthly Investment
                    </label>
                    <input
                      type="number"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[5000, 10000, 20000, 50000].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setSipMonthly(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          ₹{v >= 1000 ? `${v / 1000}k` : v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Expected Return (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={sipExpectedRate}
                      onChange={(e) => setSipExpectedRate(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[10, 12, 14, 16].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setSipExpectedRate(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Time Horizon (Years)
                    </label>
                    <input
                      type="number"
                      value={sipTenureYears}
                      onChange={(e) => setSipTenureYears(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[5, 10, 15, 20, 25].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            playClickSound();
                            setSipTenureYears(v);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {v}y
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── MODE 3: COMPOUND & SIMPLE INTEREST ─── */}
            {mode === "interest" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Compound vs. Simple Interest Laboratory
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <span className="text-slate-400">Compounding:</span>
                    {[
                      { label: "Monthly", val: 12 },
                      { label: "Quarterly", val: 4 },
                      { label: "Annually", val: 1 }
                    ].map((f) => (
                      <button
                        key={f.val}
                        onClick={() => setCompoundFrequency(f.val)}
                        className={`px-2 py-0.5 rounded-md cursor-pointer ${
                          compoundFrequency === f.val ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Principal Amount
                    </label>
                    <input
                      type="number"
                      value={interestPrincipal}
                      onChange={(e) => setInterestPrincipal(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Annual Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Tenure (Years)
                    </label>
                    <input
                      type="number"
                      value={interestYears}
                      onChange={(e) => setInterestYears(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── MODE 4: TAX, DISCOUNT & TIP SPLITTER ─── */}
            {mode === "tax-tip" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      GST, Sales Tax, Discount &amp; Tip Splitter
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bill Amount */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Original Bill / Item Price
                    </label>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                  </div>

                  {/* GST Mode & Rate */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        GST Rate (%)
                      </label>
                      <div className="flex gap-1 text-[10px] font-bold">
                        <button
                          onClick={() => setGstType("exclusive")}
                          className={`px-2 py-0.5 rounded ${gstType === "exclusive" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-700"}`}
                        >
                          + Add GST
                        </button>
                        <button
                          onClick={() => setGstType("inclusive")}
                          className={`px-2 py-0.5 rounded ${gstType === "inclusive" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-700"}`}
                        >
                          Extract GST
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[5, 12, 18, 28].map((s) => (
                        <button
                          key={s}
                          onClick={() => setGstRate(s)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                            gstRate === s ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Discount & Tip Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Discount: {discountPercent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="75"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Tip: {tipPercent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(e.target.value)}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Split Amongst: {splitCount} people
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={splitCount}
                      onChange={(e) => setSplitCount(e.target.value)}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── MODE 5: 50/30/20 BUDGET PLANNER ─── */}
            {mode === "budget" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      50 / 30 / 20 Monthly Budget Allocation
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Elizabeth Warren Rule</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Net Take-Home Monthly Income
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    {[30000, 50000, 75000, 100000, 150000, 250000].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          playClickSound();
                          setMonthlyIncome(v);
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-400 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      >
                        ₹{(v / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION TERMINAL (4 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
            
            {/* Companion Tab Switcher */}
            <div className="p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold shadow-xs">
              <button
                onClick={() => {
                  playClickSound();
                  setCompanionTab("overview");
                }}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  companionTab === "overview"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Financial Metrics</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setCompanionTab("history");
                }}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  companionTab === "history"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved History ({history.length})</span>
              </button>
            </div>

            {/* TAB 1: LIVE FINANCIAL METRICS */}
            {companionTab === "overview" ? (
              <div className="space-y-4">
                
                {/* MODE 1 SUMMARY: LOAN EMI */}
                {mode === "loans" && loanResults && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/20 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                        Monthly Loan EMI
                      </span>
                      <span className="text-3xl font-black font-mono block">
                        ₹{loanResults.monthlyEmi.toLocaleString()}
                      </span>
                      <p className="text-[11px] text-emerald-100 pt-1">
                        For {loanTenureYears} Years ({loanTenureYears * 12} Installments)
                      </p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                        Payment Distribution
                      </span>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Principal Loan</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                            ₹{parseFloat(loanPrincipal).toLocaleString()} ({loanResults.principalPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${loanResults.principalPercent}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500">Total Interest Payable</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                            ₹{loanResults.totalInterest.toLocaleString()} ({loanResults.interestPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${loanResults.interestPercent}%` }} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Total Payout</span>
                        <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                          ₹{loanResults.totalPayment.toLocaleString()}
                        </span>
                      </div>

                      {loanResults.savedInterest > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                          <strong>Prepayment Benefit:</strong> Saves ₹{loanResults.savedInterest.toLocaleString()} in interest &amp; closes in {loanResults.payoffYears} years!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MODE 2 SUMMARY: SIP WEALTH */}
                {mode === "sip" && sipResults && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/20 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                        Estimated Maturity Corpus
                      </span>
                      <span className="text-3xl font-black font-mono block">
                        ₹{sipResults.futureValue.toLocaleString()}
                      </span>
                      <p className="text-[11px] text-emerald-100 pt-1">
                        Wealth Multiplier: {sipResults.wealthMultiplier}x Growth
                      </p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Invested</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹{sipResults.totalInvested.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Estimated Returns</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          +₹{sipResults.wealthGain.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3 SUMMARY: INTEREST COMPARISON */}
                {mode === "interest" && interestResults && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                        Interest Accumulation
                      </span>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          Compound Interest Total
                        </span>
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono block">
                          ₹{interestResults.compoundTotal.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-emerald-600/80 block">
                          Interest Earned: ₹{interestResults.compoundInterest.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Simple Interest Total
                        </span>
                        <span className="text-xl font-black text-slate-800 dark:text-slate-200 font-mono block">
                          ₹{interestResults.simpleTotal.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Interest Earned: ₹{interestResults.simpleInterest.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Compounding adds an extra <strong>₹{interestResults.compoundDifference.toLocaleString()}</strong> over {interestYears} years.
                      </p>
                    </div>
                  </div>
                )}

                {/* MODE 4 SUMMARY: TAX & TIP BREAKDOWN */}
                {mode === "tax-tip" && taxTipResults && (
                  <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                      Tax &amp; Split Breakdown
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">GST ({gstRate}%)</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹{taxTipResults.gstAmount.toLocaleString()} (CGST ₹{taxTipResults.cgst} + SGST ₹{taxTipResults.sgst})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Final Price (with Tax)</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          ₹{taxTipResults.finalWithGst.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Discount Savings</span>
                        <span className="font-bold text-purple-600 font-mono">
                          -₹{taxTipResults.discountAmount.toLocaleString()} (Pay ₹{taxTipResults.priceAfterDiscount.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Tip Added</span>
                        <span className="font-bold text-amber-600 font-mono">
                          +₹{taxTipResults.tipAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                        <span>Per Person ({splitCount} people)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{taxTipResults.perPersonShare.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 5 SUMMARY: BUDGET 50/30/20 */}
                {mode === "budget" && budgetResults && (
                  <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                      Recommended Monthly Split
                    </span>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
                        <div className="flex justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                          <span>50% Needs (Rent, Food, Bills)</span>
                          <span className="font-mono">₹{budgetResults.needs.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60">
                        <div className="flex justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                          <span>30% Wants (Dining, Travel)</span>
                          <span className="font-mono">₹{budgetResults.wants.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60">
                        <div className="flex justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          <span>20% Savings &amp; Investments</span>
                          <span className="font-mono">₹{budgetResults.savings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* TAB 2: SAVED CALCULATION HISTORY */
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Calculation History
                  </span>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto opacity-30 text-emerald-500" />
                    <p className="text-xs font-medium">No saved calculations yet.</p>
                    <p className="text-[11px] text-slate-400">Click &ldquo;Copy&rdquo; in the top bar to save calculation snapshots.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/50 dark:hover:bg-emerald-950/50 border border-slate-200/70 dark:border-slate-700/70 transition flex items-start justify-between gap-2 group"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                            {h.title}
                          </span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                            {h.details} • {formatHistoryTimestamp(h.timestamp)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => deleteHistoryItem(h.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer shrink-0"
                          title="Delete history entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          HELP & FORMULAS MODAL DIALOG (?)
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ?
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">
                    Financial Formulas &amp; Real-World Scenarios
                  </h2>
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Equated Monthly Installment (EMI) Formula
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                    EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">
                    P = Principal Loan, r = Monthly Interest (Annual Rate / 12 / 100), n = Tenure in Months.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Compound Interest Formula
                  </h3>
                  <code className="block p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                    A = P × (1 + r / n)^(n × t)
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">
                    n = compounding frequency per year (12 for monthly, 4 for quarterly, 1 for annual).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    50 / 30 / 20 Budgeting Rule
                  </h3>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p>• <strong>50% Needs:</strong> Rent/mortgage, groceries, utilities, minimum debt payments.</p>
                    <p>• <strong>30% Wants:</strong> Hobbies, vacations, dining out, streaming subscriptions.</p>
                    <p>• <strong>20% Savings:</strong> Emergency funds, mutual fund SIPs, retirement savings.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Date &amp; History Format
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    All financial calculation history logs strictly use the <strong>DD/MM/YYYY</strong> standard format.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
