import { useState, useMemo } from "react";
import { Copy, Check, RotateCcw, Calculator, Sparkles, Sigma, HelpCircle, Layers } from "lucide-react";

export default function MathEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "quadratic-equation-solver") {
    return <QuadraticSolver copyText={copyText} copied={copied} />;
  }
  if (slug === "prime-number-checker") {
    return <PrimeChecker copyText={copyText} copied={copied} />;
  }
  if (slug === "gcd-lcm-calculator") {
    return <GcdLcmCalculator copyText={copyText} copied={copied} />;
  }
  if (slug === "statistics-calculator") {
    return <StatisticsCalculator copyText={copyText} copied={copied} />;
  }
  if (slug === "mean-median-mode-calculator") {
    return <MeanMedianModeCalculator copyText={copyText} copied={copied} />;
  }
  if (slug === "probability-calculator") {
    return <ProbabilityCalculator copyText={copyText} copied={copied} />;
  }
  if (slug === "scientific-notation-converter") {
    return <ScientificNotationConverter copyText={copyText} copied={copied} />;
  }
  if (slug === "matrix-calculator") {
    return <MatrixCalculator copyText={copyText} copied={copied} />;
  }
  if (slug === "geometry-calculator") {
    return <GeometryCalculator copyText={copyText} copied={copied} />;
  }

  // Default: Algebra Calculator
  return <AlgebraCalculator copyText={copyText} copied={copied} />;
}

// 1. ALGEBRA CALCULATOR
function AlgebraCalculator({ copyText, copied }) {
  const [mode, setMode] = useState("linear"); // linear or system
  // linear: ax + b = c
  const [a, setA] = useState("2");
  const [b, setB] = useState("4");
  const [c, setC] = useState("12");

  // system:
  // a1 x + b1 y = c1
  // a2 x + b2 y = c2
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("3");
  const [c1, setC1] = useState("13");
  const [a2, setA2] = useState("1");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("4");

  const linearResult = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    if (isNaN(na) || isNaN(nb) || isNaN(nc)) return null;
    if (na === 0) {
      return nb === nc ? "Infinite solutions (0 = 0)" : "No solution (contradiction)";
    }
    const x = (nc - nb) / na;
    const steps = [
      `Given: ${na}x + (${nb}) = ${nc}`,
      `Subtract ${nb} from both sides: ${na}x = ${nc - nb}`,
      `Divide both sides by ${na}: x = ${(nc - nb) / na}`,
      `Solution: x = ${Number(x.toFixed(6))}`
    ];
    return { x: Number(x.toFixed(6)), steps };
  }, [a, b, c]);

  const systemResult = useMemo(() => {
    const na1 = parseFloat(a1), nb1 = parseFloat(b1), nc1 = parseFloat(c1);
    const na2 = parseFloat(a2), nb2 = parseFloat(b2), nc2 = parseFloat(c2);
    if ([na1, nb1, nc1, na2, nb2, nc2].some(isNaN)) return null;

    const det = na1 * nb2 - na2 * nb1;
    if (det === 0) {
      return { infiniteOrNone: "Determinant is 0. Lines are parallel (no unique solution)." };
    }
    const x = (nc1 * nb2 - nc2 * nb1) / det;
    const y = (na1 * nc2 - na2 * nc1) / det;
    const steps = [
      `Equation 1: ${na1}x + ${nb1}y = ${nc1}`,
      `Equation 2: ${na2}x + ${nb2}y = ${nc2}`,
      `Determinant (D) = (${na1} * ${nb2}) - (${na2} * ${nb1}) = ${det}`,
      `Dx = (${nc1} * ${nb2}) - (${nc2} * ${nb1}) = ${nc1 * nb2 - nc2 * nb1}`,
      `Dy = (${na1} * ${nc2}) - (${na2} * ${nc1}) = ${na1 * nc2 - na2 * nc1}`,
      `x = Dx / D = ${Number(x.toFixed(6))}`,
      `y = Dy / D = ${Number(y.toFixed(6))}`
    ];
    return { x: Number(x.toFixed(6)), y: Number(y.toFixed(6)), steps };
  }, [a1, b1, c1, a2, b2, c2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setMode("linear")}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${mode === "linear" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
        >
          Linear Equation (ax + b = c)
        </button>
        <button
          onClick={() => setMode("system")}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${mode === "system" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
        >
          System of 2 Equations (2x2)
        </button>
      </div>

      {mode === "linear" ? (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Solve: ax + b = c</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Coefficient a</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Constant b</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Equal to c</label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {linearResult && (
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Solution</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {typeof linearResult === "string" ? linearResult : `x = ${linearResult.x}`}
                  </div>
                </div>
                {typeof linearResult === "object" && (
                  <button
                    onClick={() => copyText(`x = ${linearResult.x}`)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                )}
              </div>
              {linearResult.steps && (
                <div className="pt-3 border-t border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block mb-2">Step-by-Step Working:</span>
                  {linearResult.steps.map((st, i) => (
                    <p key={i} className="text-sm font-mono text-slate-300">{st}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Solve 2x2 Linear System (Cramer's Rule)</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-indigo-400">Equation 1: a₁x + b₁y = c₁</span>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="a₁" type="number" value={a1} onChange={(e) => setA1(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                <input placeholder="b₁" type="number" value={b1} onChange={(e) => setB1(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                <input placeholder="c₁" type="number" value={c1} onChange={(e) => setC1(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-indigo-400">Equation 2: a₂x + b₂y = c₂</span>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="a₂" type="number" value={a2} onChange={(e) => setA2(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                <input placeholder="b₂" type="number" value={b2} onChange={(e) => setB2(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                <input placeholder="c₂" type="number" value={c2} onChange={(e) => setC2(e.target.value)} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
          </div>

          {systemResult && (
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 space-y-4">
              {systemResult.infiniteOrNone ? (
                <p className="text-amber-400 font-medium">{systemResult.infiniteOrNone}</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Unique Solution</span>
                      <div className="text-2xl font-bold text-white mt-1">
                        x = {systemResult.x}, y = {systemResult.y}
                      </div>
                    </div>
                    <button
                      onClick={() => copyText(`x = ${systemResult.x}, y = ${systemResult.y}`)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="pt-3 border-t border-white/10 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Step-by-Step Matrix Method:</span>
                    {systemResult.steps.map((st, i) => (
                      <p key={i} className="text-sm font-mono text-slate-300">{st}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 2. QUADRATIC EQUATION SOLVER
function QuadraticSolver({ copyText, copied }) {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  const solution = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    if (isNaN(na) || isNaN(nb) || isNaN(nc) || na === 0) return null;

    const d = nb * nb - 4 * na * nc;
    const vertexX = -nb / (2 * na);
    const vertexY = na * vertexX * vertexX + nb * vertexX + nc;

    let roots = [];
    let rootType = "";
    if (d > 0) {
      rootType = "Two Real and Distinct Roots";
      const r1 = (-nb + Math.sqrt(d)) / (2 * na);
      const r2 = (-nb - Math.sqrt(d)) / (2 * na);
      roots = [r1.toFixed(4), r2.toFixed(4)];
    } else if (d === 0) {
      rootType = "One Real Root (Repeated)";
      const r = -nb / (2 * na);
      roots = [r.toFixed(4)];
    } else {
      rootType = "Two Complex / Imaginary Roots";
      const real = (-nb / (2 * na)).toFixed(4);
      const imag = (Math.sqrt(-d) / (2 * Math.abs(na))).toFixed(4);
      roots = [`${real} + ${imag}i`, `${real} - ${imag}i`];
    }

    return {
      discriminant: d,
      rootType,
      roots,
      vertex: `(${vertexX.toFixed(3)}, ${vertexY.toFixed(3)})`,
      axisOfSymmetry: `x = ${vertexX.toFixed(3)}`
    };
  }, [a, b, c]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Solve: ax² + bx + c = 0</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">a (x² coefficient, a ≠ 0)</label>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">b (x coefficient)</label>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">c (constant)</label>
            <input type="number" value={c} onChange={(e) => setC(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
          </div>
        </div>

        {solution && (
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">{solution.rootType}</span>
                <div className="text-2xl font-bold text-white mt-1">
                  Roots: {solution.roots.join(", ")}
                </div>
              </div>
              <button onClick={() => copyText(solution.roots.join(", "))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="bg-slate-900/60 p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Discriminant (Δ)</span>
                <span className="text-base font-semibold text-white">{solution.discriminant}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Parabola Vertex</span>
                <span className="text-base font-semibold text-white">{solution.vertex}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Axis of Symmetry</span>
                <span className="text-base font-semibold text-white">{solution.axisOfSymmetry}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. PRIME NUMBER CHECKER
function PrimeChecker({ copyText, copied }) {
  const [num, setNum] = useState("97");

  const analysis = useMemo(() => {
    const n = parseInt(num, 10);
    if (isNaN(n) || n < 1) return null;
    if (n === 1) return { isPrime: false, reason: "1 is neither prime nor composite by mathematical definition." };

    let isPrime = true;
    let factors = [];
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        isPrime = false;
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    factors.sort((a, b) => a - b);

    // Prime factorization
    let temp = n;
    let primeFactors = [];
    let d = 2;
    while (d * d <= temp) {
      if (temp % d === 0) {
        let count = 0;
        while (temp % d === 0) {
          count++;
          temp /= d;
        }
        primeFactors.push(count > 1 ? `${d}^${count}` : `${d}`);
      }
      d++;
    }
    if (temp > 1) primeFactors.push(`${temp}`);

    return {
      isPrime,
      factors: [1, ...factors, n],
      primeDecomp: primeFactors.join(" × ")
    };
  }, [num]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Prime Number & Factorization Checker</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Enter an Integer (n ≥ 1)</label>
          <input
            type="number"
            min="1"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
          />
        </div>

        {analysis && (
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Classification</span>
                <div className={`text-2xl font-bold mt-1 ${analysis.isPrime ? "text-emerald-400" : "text-amber-400"}`}>
                  {analysis.isPrime ? `${num} is a PRIME Number! 🌟` : `${num} is a COMPOSITE Number.`}
                </div>
              </div>
              <button onClick={() => copyText(analysis.primeDecomp)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div className="bg-slate-900/60 p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Prime Factorization</span>
                <span className="text-base font-semibold text-white">{analysis.primeDecomp || "None"}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Total Factors ({analysis.factors ? analysis.factors.length : 0})</span>
                <span className="text-xs font-mono text-slate-300 break-words">{analysis.factors ? analysis.factors.slice(0, 15).join(", ") + (analysis.factors.length > 15 ? "..." : "") : "None"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. GCD & LCM CALCULATOR
function GcdLcmCalculator({ copyText, copied }) {
  const [inputNumbers, setInputNumbers] = useState("24, 36, 60");

  const calc = useMemo(() => {
    const nums = inputNumbers.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (nums.length < 2) return null;

    const gcd2 = (x, y) => {
      while (y) {
        let t = y;
        y = x % y;
        x = t;
      }
      return x;
    };
    const lcm2 = (x, y) => (x * y) / gcd2(x, y);

    let gcd = nums[0];
    let lcm = nums[0];
    for (let i = 1; i < nums.length; i++) {
      gcd = gcd2(gcd, nums[i]);
      lcm = lcm2(lcm, nums[i]);
    }
    return { gcd, lcm, count: nums.length };
  }, [inputNumbers]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">GCD (HCF) & LCM Calculator</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Comma-separated Positive Integers</label>
          <input
            type="text"
            value={inputNumbers}
            onChange={(e) => setInputNumbers(e.target.value)}
            placeholder="e.g. 12, 18, 30"
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
          />
        </div>

        {calc && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">Greatest Common Divisor (GCD / HCF)</span>
              <div className="text-3xl font-bold text-white mt-2">{calc.gcd}</div>
              <button onClick={() => copyText(calc.gcd)} className="mt-3 text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copy GCD
              </button>
            </div>
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">Least Common Multiple (LCM)</span>
              <div className="text-3xl font-bold text-white mt-2">{calc.lcm}</div>
              <button onClick={() => copyText(calc.lcm)} className="mt-3 text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copy LCM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. STATISTICS CALCULATOR
function StatisticsCalculator({ copyText, copied }) {
  const [dataInput, setDataInput] = useState("12, 15, 23, 29, 34, 45, 52, 63, 63, 78");

  const stats = useMemo(() => {
    const raw = dataInput.split(/[\s,]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (raw.length === 0) return null;
    const n = raw.length;
    const sorted = [...raw].sort((a, b) => a - b);
    const sum = raw.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    // Median
    let median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    // Mode
    const freq = {};
    raw.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    let maxFreq = 0;
    for (let k in freq) if (freq[k] > maxFreq) maxFreq = freq[k];
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq && maxFreq > 1).map(Number);

    // Variance & Std Dev
    const variancePop = raw.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const stdDevPop = Math.sqrt(variancePop);
    const varianceSample = n > 1 ? raw.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1) : 0;
    const stdDevSample = Math.sqrt(varianceSample);

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    return {
      n,
      sum: sum.toFixed(2),
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: modes.length > 0 ? modes.join(", ") : "No duplicate mode",
      min,
      max,
      range,
      stdDevSample: stdDevSample.toFixed(4),
      varianceSample: varianceSample.toFixed(4)
    };
  }, [dataInput]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Full Descriptive Statistics Calculator</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Input numbers (separated by commas or spaces)</label>
          <textarea
            rows={3}
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm"
          />
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Count (n)", val: stats.n },
              { label: "Sum (Σx)", val: stats.sum },
              { label: "Mean (Average)", val: stats.mean },
              { label: "Median", val: stats.median },
              { label: "Mode", val: stats.mode },
              { label: "Min / Max", val: `${stats.min} / ${stats.max}` },
              { label: "Range", val: stats.range },
              { label: "Sample Std Dev", val: stats.stdDevSample }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/70 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 block">{item.label}</span>
                <span className="text-base font-semibold text-white mt-1 block truncate">{item.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 6. MEAN MEDIAN MODE CALCULATOR
function MeanMedianModeCalculator(props) {
  return <StatisticsCalculator {...props} />;
}

// 7. PROBABILITY CALCULATOR
function ProbabilityCalculator({ copyText, copied }) {
  const [n, setN] = useState("10");
  const [r, setR] = useState("3");

  const factorialize = (num) => {
    if (num < 0) return -1;
    if (num === 0 || num === 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const combPerm = useMemo(() => {
    const total = parseInt(n, 10);
    const pick = parseInt(r, 10);
    if (isNaN(total) || isNaN(pick) || total < 0 || pick < 0 || pick > total || total > 20) return null;

    const nFact = factorialize(total);
    const rFact = factorialize(pick);
    const nMinusRFact = factorialize(total - pick);

    const permutation = nFact / nMinusRFact;
    const combination = nFact / (rFact * nMinusRFact);

    return { permutation, combination };
  }, [n, r]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Combinatorics & Probability Calculator (nCr & nPr)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Total Items (n, max 20)</label>
            <input type="number" min="0" max="20" value={n} onChange={(e) => setN(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Items Chosen (r)</label>
            <input type="number" min="0" max={n} value={r} onChange={(e) => setR(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        {combPerm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">Combinations nCr (Order does NOT matter)</span>
              <div className="text-3xl font-bold text-white mt-2">{combPerm.combination.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-2">Formula: n! / (r! × (n-r)!)</p>
            </div>
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">Permutations nPr (Order DOES matter)</span>
              <div className="text-3xl font-bold text-white mt-2">{combPerm.permutation.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-2">Formula: n! / (n-r)!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 8. SCIENTIFIC NOTATION CONVERTER
function ScientificNotationConverter({ copyText, copied }) {
  const [val, setVal] = useState("123450000");

  const converted = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;
    return {
      scientific: num.toExponential(),
      standard: num.toLocaleString("en-US", { maximumFractionDigits: 10 }),
      engineering: (() => {
        const exp = Math.floor(Math.log10(Math.abs(num)));
        const rem = exp % 3;
        const adjustedExp = exp - rem;
        const coef = num / Math.pow(10, adjustedExp);
        return `${coef.toFixed(4)} × 10^${adjustedExp}`;
      })()
    };
  }, [val]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Scientific & Engineering Notation Converter</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Decimal or Scientific Number (e.g. 5.2e6 or 0.00042)</label>
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono" />
        </div>

        {converted && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Scientific Notation</span>
              <span className="text-lg font-semibold text-white font-mono mt-1 block">{converted.scientific}</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Engineering Notation</span>
              <span className="text-lg font-semibold text-white font-mono mt-1 block">{converted.engineering}</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Standard Decimal</span>
              <span className="text-lg font-semibold text-white font-mono mt-1 block truncate">{converted.standard}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 9. MATRIX CALCULATOR (2x2)
function MatrixCalculator({ copyText, copied }) {
  const [m1, setM1] = useState([1, 2, 3, 4]);
  const [m2, setM2] = useState([5, 6, 7, 8]);

  const results = useMemo(() => {
    // 2x2 addition
    const add = [m1[0] + m2[0], m1[1] + m2[1], m1[2] + m2[2], m1[3] + m2[3]];
    // 2x2 multiply: [a b] * [e f] = [ae+bg, af+bh; ce+dg, cf+dh]
    const mult = [
      m1[0] * m2[0] + m1[1] * m2[2],
      m1[0] * m2[1] + m1[1] * m2[3],
      m1[2] * m2[0] + m1[3] * m2[2],
      m1[2] * m2[1] + m1[3] * m2[3]
    ];
    // Determinant of m1
    const det1 = m1[0] * m1[3] - m1[1] * m1[2];

    return { add, mult, det1 };
  }, [m1, m2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">2×2 Matrix Arithmetic & Determinant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-indigo-400 block mb-2">Matrix A</span>
            <div className="grid grid-cols-2 gap-2">
              {m1.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const next = [...m1];
                    next[i] = parseFloat(e.target.value) || 0;
                    setM1(next);
                  }}
                  className="bg-slate-800 border border-white/10 rounded-lg p-2 text-center text-white"
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 block mt-2">Det(A) = {results.det1}</span>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-indigo-400 block mb-2">Matrix B</span>
            <div className="grid grid-cols-2 gap-2">
              {m2.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const next = [...m2];
                    next[i] = parseFloat(e.target.value) || 0;
                    setM2(next);
                  }}
                  className="bg-slate-800 border border-white/10 rounded-lg p-2 text-center text-white"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Matrix Addition (A + B)</span>
            <div className="grid grid-cols-2 gap-2 mt-2 w-32 font-mono text-center text-white">
              <div className="bg-slate-900 p-2 rounded">{results.add[0]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.add[1]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.add[2]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.add[3]}</div>
            </div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Matrix Product (A × B)</span>
            <div className="grid grid-cols-2 gap-2 mt-2 w-32 font-mono text-center text-white">
              <div className="bg-slate-900 p-2 rounded">{results.mult[0]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.mult[1]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.mult[2]}</div>
              <div className="bg-slate-900 p-2 rounded">{results.mult[3]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. GEOMETRY CALCULATOR
function GeometryCalculator({ copyText, copied }) {
  const [shape, setShape] = useState("circle"); // circle, rectangle, triangle, sphere, cylinder
  const [dim1, setDim1] = useState("5"); // radius, width
  const [dim2, setDim2] = useState("10"); // height, length

  const geo = useMemo(() => {
    const v1 = parseFloat(dim1) || 0;
    const v2 = parseFloat(dim2) || 0;

    if (shape === "circle") {
      const area = Math.PI * v1 * v1;
      const circ = 2 * Math.PI * v1;
      return { p1: "Area", v1: area.toFixed(4), p2: "Circumference", v2: circ.toFixed(4) };
    }
    if (shape === "rectangle") {
      const area = v1 * v2;
      const peri = 2 * (v1 + v2);
      return { p1: "Area", v1: area.toFixed(4), p2: "Perimeter", v2: peri.toFixed(4) };
    }
    if (shape === "triangle") {
      const area = 0.5 * v1 * v2;
      return { p1: "Area", v1: area.toFixed(4), p2: "Hypotenuse (if right-angled)", v2: Math.hypot(v1, v2).toFixed(4) };
    }
    if (shape === "sphere") {
      const vol = (4 / 3) * Math.PI * Math.pow(v1, 3);
      const sa = 4 * Math.PI * v1 * v1;
      return { p1: "Volume", v1: vol.toFixed(4), p2: "Surface Area", v2: sa.toFixed(4) };
    }
    if (shape === "cylinder") {
      const vol = Math.PI * v1 * v1 * v2;
      const sa = 2 * Math.PI * v1 * v2 + 2 * Math.PI * v1 * v1;
      return { p1: "Volume", v1: vol.toFixed(4), p2: "Surface Area", v2: sa.toFixed(4) };
    }
    return null;
  }, [shape, dim1, dim2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">2D & 3D Geometry Calculator</h3>
        <div className="flex flex-wrap gap-2">
          {["circle", "rectangle", "triangle", "sphere", "cylinder"].map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${shape === s ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              {shape === "circle" || shape === "sphere" ? "Radius (r)" : shape === "rectangle" ? "Width (w)" : "Base (b)"}
            </label>
            <input type="number" value={dim1} onChange={(e) => setDim1(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          {shape !== "circle" && shape !== "sphere" && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Height (h) / Length</label>
              <input type="number" value={dim2} onChange={(e) => setDim2(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
            </div>
          )}
        </div>

        {geo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">{geo.p1}</span>
              <div className="text-3xl font-bold text-white mt-2">{geo.v1}</div>
            </div>
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5">
              <span className="text-xs text-indigo-400 uppercase font-semibold">{geo.p2}</span>
              <div className="text-3xl font-bold text-white mt-2">{geo.v2}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
