import { useState, useMemo } from "react";
import { Copy, Check, DollarSign, PieChart, TrendingUp, Calendar, Percent, RefreshCw } from "lucide-react";

export default function FinanceEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "simple-interest-calculator") return <SimpleInterestCalculator copyText={copyText} copied={copied} />;
  if (slug === "compound-interest-calculator") return <CompoundInterestCalculator copyText={copyText} copied={copied} />;
  if (slug === "sip-calculator") return <SipCalculator copyText={copyText} copied={copied} />;
  if (slug === "loan-payoff-calculator") return <LoanPayoffCalculator copyText={copyText} copied={copied} />;
  if (slug === "discount-calculator") return <DiscountCalculator copyText={copyText} copied={copied} />;
  if (slug === "gst-calculator") return <GstCalculator copyText={copyText} copied={copied} />;
  if (slug === "tip-calculator") return <TipCalculator copyText={copyText} copied={copied} />;
  if (slug === "budget-planner") return <BudgetPlanner copyText={copyText} copied={copied} />;
  if (slug === "savings-goal-calculator") return <SavingsGoalCalculator copyText={copyText} copied={copied} />;

  // Default: EMI Calculator
  return <EmiCalculator copyText={copyText} copied={copied} />;
}

// 1. EMI CALCULATOR
function EmiCalculator({ copyText, copied }) {
  const [loan, setLoan] = useState("1000000"); // 10 Lakhs or 1M
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("15");

  const results = useMemo(() => {
    const P = parseFloat(loan);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(years) * 12;

    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) return null;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPercent: Math.round((P / totalPayment) * 100),
      interestPercent: Math.round((totalInterest / totalPayment) * 100)
    };
  }, [loan, rate, years]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-400" />
          Loan EMI Calculator & Payment Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Loan Amount</label>
            <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Interest Rate (% p.a.)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tenure (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
                <span className="text-xs text-indigo-400 uppercase font-semibold">Monthly EMI</span>
                <div className="text-3xl font-bold text-white mt-1">₹ {results.monthlyEmi.toLocaleString()}</div>
                <button onClick={() => copyText(results.monthlyEmi)} className="mt-2 text-xs text-slate-400 hover:text-white flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy EMI
                </button>
              </div>
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Interest</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">₹ {results.totalInterest.toLocaleString()}</div>
                <span className="text-xs text-slate-400 mt-1 block">{results.interestPercent}% of total</span>
              </div>
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Repayment</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">₹ {results.totalPayment.toLocaleString()}</div>
                <span className="text-xs text-slate-400 mt-1 block">Principal + Interest</span>
              </div>
            </div>

            {/* Visual Bar Ratio */}
            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Principal: {results.principalPercent}%</span>
                <span>Interest: {results.interestPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                <div style={{ width: `${results.principalPercent}%` }} className="bg-indigo-500 h-full"></div>
                <div style={{ width: `${results.interestPercent}%` }} className="bg-amber-500 h-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. SIMPLE INTEREST CALCULATOR
function SimpleInterestCalculator({ copyText, copied }) {
  const [p, setP] = useState("50000");
  const [r, setR] = useState("7");
  const [t, setT] = useState("3");

  const calc = useMemo(() => {
    const P = parseFloat(p) || 0;
    const R = parseFloat(r) || 0;
    const T = parseFloat(t) || 0;
    const interest = (P * R * T) / 100;
    const total = P + interest;
    return { interest: Math.round(interest), total: Math.round(total) };
  }, [p, r, t]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Simple Interest (I = P × R × T / 100)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Principal (P)</label>
            <input type="number" value={p} onChange={(e) => setP(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Annual Rate (R %)</label>
            <input type="number" step="0.1" value={r} onChange={(e) => setR(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Time in Years (T)</label>
            <input type="number" value={t} onChange={(e) => setT(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Total Simple Interest</span>
            <div className="text-3xl font-bold text-white mt-1">₹ {calc.interest.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Amount (P + I)</span>
            <div className="text-3xl font-bold text-emerald-400 mt-1">₹ {calc.total.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. COMPOUND INTEREST CALCULATOR
function CompoundInterestCalculator({ copyText, copied }) {
  const [p, setP] = useState("100000");
  const [r, setR] = useState("8.5");
  const [t, setT] = useState("5");
  const [n, setN] = useState("12"); // compound monthly

  const calc = useMemo(() => {
    const P = parseFloat(p) || 0;
    const R = (parseFloat(r) || 0) / 100;
    const T = parseFloat(t) || 0;
    const N = parseFloat(n) || 1;

    const A = P * Math.pow(1 + R / N, N * T);
    const ci = A - P;
    return {
      futureVal: Math.round(A),
      interest: Math.round(ci)
    };
  }, [p, r, t, n]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Compound Interest Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Principal</label>
            <input type="number" value={p} onChange={(e) => setP(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rate (% p.a.)</label>
            <input type="number" step="0.1" value={r} onChange={(e) => setR(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Years</label>
            <input type="number" value={t} onChange={(e) => setT(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Compounding</label>
            <select value={n} onChange={(e) => setN(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white">
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Total Compound Interest</span>
            <div className="text-3xl font-bold text-white mt-1">₹ {calc.interest.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase font-semibold">Future Value</span>
            <div className="text-3xl font-bold text-emerald-400 mt-1">₹ {calc.futureVal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. SIP CALCULATOR
function SipCalculator({ copyText, copied }) {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const sip = useMemo(() => {
    const P = parseFloat(monthly) || 0;
    const i = (parseFloat(rate) || 0) / 12 / 100;
    const n = (parseFloat(years) || 0) * 12;

    if (P <= 0 || i <= 0 || n <= 0) return null;

    // FV = P * [ (1+i)^n - 1 ] * (1+i) / i
    const fv = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    const wealthGain = fv - invested;

    return {
      futureVal: Math.round(fv),
      invested: Math.round(invested),
      wealthGain: Math.round(wealthGain)
    };
  }, [monthly, rate, years]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">SIP (Systematic Investment Plan) Wealth Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Monthly Investment (₹)</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Expected Return Rate (% p.a.)</label>
            <input type="number" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Time Period (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        {sip && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase font-semibold">Invested Amount</span>
              <div className="text-2xl font-bold text-white mt-1">₹ {sip.invested.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">Estimated Returns</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1">₹ {sip.wealthGain.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-5">
              <span className="text-xs text-emerald-400 uppercase font-semibold">Total Maturity Value</span>
              <div className="text-3xl font-bold text-emerald-400 mt-1">₹ {sip.futureVal.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. LOAN PAYOFF CALCULATOR
function LoanPayoffCalculator({ copyText, copied }) {
  const [balance, setBalance] = useState("500000");
  const [rate, setRate] = useState("9");
  const [monthlyPayment, setMonthlyPayment] = useState("10000");
  const [extraPayment, setExtraPayment] = useState("2000");

  const payoff = useMemo(() => {
    const P = parseFloat(balance) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const standardPmt = parseFloat(monthlyPayment) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (P <= 0 || r <= 0 || standardPmt <= P * r) {
      return { invalid: "Monthly payment must be greater than monthly interest." };
    }

    // Standard payoff simulation
    let b1 = P, months1 = 0, interestPaid1 = 0;
    while (b1 > 0 && months1 < 600) {
      const int = b1 * r;
      interestPaid1 += int;
      const prin = standardPmt - int;
      b1 -= prin;
      months1++;
    }

    // Accelerated payoff simulation
    let b2 = P, months2 = 0, interestPaid2 = 0;
    const acceleratedPmt = standardPmt + extra;
    while (b2 > 0 && months2 < 600) {
      const int = b2 * r;
      interestPaid2 += int;
      const prin = acceleratedPmt - int;
      b2 -= prin;
      months2++;
    }

    return {
      standardMonths: months1,
      acceleratedMonths: months2,
      monthsSaved: months1 - months2,
      interestSaved: Math.round(interestPaid1 - interestPaid2)
    };
  }, [balance, rate, monthlyPayment, extraPayment]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Accelerated Loan Payoff Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Current Balance</label>
            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rate (% p.a.)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Standard Monthly</label>
            <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Extra Monthly Pay</label>
            <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white" />
          </div>
        </div>

        {payoff && (
          payoff.invalid ? (
            <p className="text-amber-400 text-sm">{payoff.invalid}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
                <span className="text-xs text-indigo-400 uppercase font-semibold">Time Saved</span>
                <div className="text-3xl font-bold text-white mt-1">{payoff.monthsSaved} Months Faster!</div>
                <span className="text-xs text-slate-400 mt-2 block">
                  Original: {Math.floor(payoff.standardMonths / 12)}y {payoff.standardMonths % 12}m ➔ Accelerated: {Math.floor(payoff.acceleratedMonths / 12)}y {payoff.acceleratedMonths % 12}m
                </span>
              </div>
              <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-5">
                <span className="text-xs text-emerald-400 uppercase font-semibold">Total Interest Saved</span>
                <div className="text-3xl font-bold text-emerald-400 mt-1">₹ {payoff.interestSaved.toLocaleString()}</div>
                <span className="text-xs text-slate-400 mt-2 block">Direct financial savings</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// 6. DISCOUNT CALCULATOR
function DiscountCalculator({ copyText, copied }) {
  const [price, setPrice] = useState("1499");
  const [discountPercent, setDiscountPercent] = useState("20");

  const disc = useMemo(() => {
    const P = parseFloat(price) || 0;
    const D = parseFloat(discountPercent) || 0;
    const saved = (P * D) / 100;
    const finalPrice = P - saved;
    return { saved: saved.toFixed(2), finalPrice: finalPrice.toFixed(2) };
  }, [price, discountPercent]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Discount & Savings Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Original Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Discount Percentage (%)</label>
            <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-5">
            <span className="text-xs text-emerald-400 uppercase font-semibold">Final Price to Pay</span>
            <div className="text-3xl font-bold text-white mt-1">₹ {disc.finalPrice}</div>
          </div>
          <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Discount Savings</span>
            <div className="text-3xl font-bold text-emerald-400 mt-1">₹ {disc.saved}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. GST CALCULATOR
function GstCalculator({ copyText, copied }) {
  const [amount, setAmount] = useState("1000");
  const [gstRate, setGstRate] = useState("18");
  const [isInclusive, setIsInclusive] = useState(false);

  const gst = useMemo(() => {
    const A = parseFloat(amount) || 0;
    const R = parseFloat(gstRate) || 0;
    if (isInclusive) {
      // GST is already inside A
      const net = A / (1 + R / 100);
      const tax = A - net;
      return { net: net.toFixed(2), tax: tax.toFixed(2), total: A.toFixed(2) };
    } else {
      // GST is added on top of A
      const tax = (A * R) / 100;
      const total = A + tax;
      return { net: A.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2) };
    }
  }, [amount, gstRate, isInclusive]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">GST / Sales Tax Calculator</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsInclusive(false)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase ${!isInclusive ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}
          >
            Exclusive (Add GST)
          </button>
          <button
            onClick={() => setIsInclusive(true)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase ${isInclusive ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}
          >
            Inclusive (Extract GST)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">GST Rate (%)</label>
            <select value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white">
              <option value="5">5% (Essential)</option>
              <option value="12">12% (Standard)</option>
              <option value="18">18% (Most Services/Goods)</option>
              <option value="28">28% (Luxury)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 block">Net Base Amount</span>
            <span className="text-2xl font-bold text-white mt-1 block">₹ {gst.net}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-amber-400 block">GST Tax Amount ({gstRate}%)</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">₹ {gst.tax}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/30">
            <span className="text-xs text-emerald-400 block">Total Gross Amount</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">₹ {gst.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. TIP CALCULATOR
function TipCalculator({ copyText, copied }) {
  const [bill, setBill] = useState("1200");
  const [tipPercent, setTipPercent] = useState("10");
  const [split, setSplit] = useState("4");

  const tip = useMemo(() => {
    const B = parseFloat(bill) || 0;
    const T = parseFloat(tipPercent) || 0;
    const S = parseInt(split, 10) || 1;

    const tipTotal = (B * T) / 100;
    const grandTotal = B + tipTotal;
    const perPerson = grandTotal / S;

    return {
      tipTotal: tipTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  }, [bill, tipPercent, split]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Tip & Bill Split Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Total Bill</label>
            <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tip %</label>
            <input type="number" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Split (People)</label>
            <input type="number" min="1" value={split} onChange={(e) => setSplit(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 block">Total Tip</span>
            <span className="text-2xl font-bold text-indigo-400 mt-1 block">₹ {tip.tipTotal}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 block">Total Bill With Tip</span>
            <span className="text-2xl font-bold text-white mt-1 block">₹ {tip.grandTotal}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/30">
            <span className="text-xs text-emerald-400 block">Per Person Share</span>
            <span className="text-3xl font-bold text-emerald-400 mt-1 block">₹ {tip.perPerson}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. BUDGET PLANNER (50/30/20)
function BudgetPlanner({ copyText, copied }) {
  const [income, setIncome] = useState("50000");

  const plan = useMemo(() => {
    const inc = parseFloat(income) || 0;
    return {
      needs: Math.round(inc * 0.5),
      wants: Math.round(inc * 0.3),
      savings: Math.round(inc * 0.2)
    };
  }, [income]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">50/30/20 Rule Budget Planner</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Monthly Take-Home Income (₹)</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30">
            <span className="text-xs text-indigo-400 uppercase font-semibold">50% Needs</span>
            <div className="text-2xl font-bold text-white mt-1">₹ {plan.needs.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-2">Rent, groceries, utilities, EMI, health.</p>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-xl border border-amber-500/30">
            <span className="text-xs text-amber-400 uppercase font-semibold">30% Wants</span>
            <div className="text-2xl font-bold text-white mt-1">₹ {plan.wants.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-2">Dining out, entertainment, shopping, hobbies.</p>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-xl border border-emerald-500/30">
            <span className="text-xs text-emerald-400 uppercase font-semibold">20% Savings</span>
            <div className="text-2xl font-bold text-white mt-1">₹ {plan.savings.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-2">Emergency fund, investments, retirement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. SAVINGS GOAL CALCULATOR
function SavingsGoalCalculator({ copyText, copied }) {
  const [goal, setGoal] = useState("500000");
  const [current, setCurrent] = useState("50000");
  const [months, setMonths] = useState("24");

  const calc = useMemo(() => {
    const G = parseFloat(goal) || 0;
    const C = parseFloat(current) || 0;
    const M = parseInt(months, 10) || 1;
    const remaining = Math.max(0, G - C);
    const monthlyNeeded = remaining / M;
    const progress = Math.min(100, Math.round((C / G) * 100));

    return {
      remaining: Math.round(remaining),
      monthlyNeeded: Math.round(monthlyNeeded),
      progress
    };
  }, [goal, current, months]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Savings Goal & Milestone Tracker</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Goal Target (₹)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Already Saved (₹)</label>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Horizon (Months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Required Monthly Savings</span>
            <div className="text-3xl font-bold text-white mt-1">₹ {calc.monthlyNeeded.toLocaleString()} / mo</div>
            <span className="text-xs text-slate-400 mt-1 block">To reach target in {months} months</span>
          </div>
          <div className="bg-slate-800/80 border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase font-semibold">Goal Progress</span>
            <div className="text-3xl font-bold text-emerald-400 mt-1">{calc.progress}%</div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
              <div style={{ width: `${calc.progress}%` }} className="bg-emerald-500 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
