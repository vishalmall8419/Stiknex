import { useState, useMemo } from "react";
import { Copy, Check, Code, FileCode, CheckCircle, AlertCircle, RefreshCw, Download, FileSpreadsheet } from "lucide-react";

export default function DeveloperEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "json-formatter" || slug === "json-validator") {
    return <JsonFormatterTool copyText={copyText} copied={copied} isValidatorOnly={slug === "json-validator"} />;
  }
  if (slug === "json-to-csv") {
    return <JsonToCsvTool copyText={copyText} copied={copied} />;
  }
  if (slug === "csv-to-json") {
    return <CsvToJsonTool copyText={copyText} copied={copied} />;
  }
  if (slug === "regex-tester") {
    return <RegexTesterTool copyText={copyText} copied={copied} />;
  }
  if (slug === "uuid-generator") {
    return <UuidGeneratorTool copyText={copyText} copied={copied} />;
  }
  if (slug === "xml-formatter") {
    return <XmlFormatterTool copyText={copyText} copied={copied} />;
  }
  if (slug === "html-formatter") {
    return <HtmlFormatterTool copyText={copyText} copied={copied} />;
  }
  if (slug === "css-formatter") {
    return <CssFormatterTool copyText={copyText} copied={copied} />;
  }
  if (slug === "javascript-formatter") {
    return <JsFormatterTool copyText={copyText} copied={copied} />;
  }

  return <JsonFormatterTool copyText={copyText} copied={copied} />;
}

// ============================================================================
// BIG TOOL: JSON FORMATTER & VALIDATOR
// ============================================================================
function JsonFormatterTool({ copyText, copied, isValidatorOnly }) {
  const [input, setInput] = useState('{"name":"Stiknex","tools":200,"status":"active","features":["speed","privacy","free"]}');
  const [indent, setIndent] = useState(2);

  const parsed = useMemo(() => {
    try {
      const obj = JSON.parse(input);
      return {
        formatted: indent === 0 ? JSON.stringify(obj) : JSON.stringify(obj, null, indent),
        valid: true,
        keysCount: Object.keys(obj).length
      };
    } catch (err) {
      return {
        formatted: "",
        valid: false,
        error: err.message
      };
    }
  }, [input, indent]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {parsed.valid ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle size={14} /> Valid JSON Syntax
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800">
              <AlertCircle size={14} /> Syntax Error
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Indent:</span>
          {[2, 4, 0].map((sp) => (
            <button
              key={sp}
              onClick={() => setIndent(sp)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${indent === sp ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"}`}
            >
              {sp === 0 ? "Minify" : `${sp} Spaces`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Raw JSON Input</label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Formatted Result</label>
            {parsed.valid && (
              <button onClick={() => copyText(parsed.formatted)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <Copy size={13} /> Copy Formatted JSON
              </button>
            )}
          </div>
          {parsed.valid ? (
            <textarea
              readOnly
              rows={12}
              value={parsed.formatted}
              className="w-full p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-mono text-xs text-indigo-900 dark:text-indigo-200"
            />
          ) : (
            <div className="w-full h-72 p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-rose-600 font-mono text-xs flex flex-col justify-center">
              <span className="font-bold mb-2">Parser Error:</span>
              <p>{parsed.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: JSON TO CSV
// ============================================================================
function JsonToCsvTool({ copyText, copied }) {
  const [jsonStr, setJsonStr] = useState(
    JSON.stringify(
      [
        { id: 1, name: "Alice", role: "Developer", city: "New York" },
        { id: 2, name: "Bob", role: "Designer", city: "London" },
        { id: 3, name: "Charlie", role: "Product Manager", city: "Tokyo" }
      ],
      null,
      2
    )
  );

  const csv = useMemo(() => {
    try {
      const arr = JSON.parse(jsonStr);
      if (!Array.isArray(arr) || arr.length === 0) return "Input must be a JSON array of objects.";
      const headers = Object.keys(arr[0]);
      const rows = arr.map((obj) =>
        headers.map((h) => `"${String(obj[h] ?? "").replace(/"/g, '""')}"`).join(",")
      );
      return [headers.join(","), ...rows].join("\n");
    } catch {
      return "Invalid JSON array.";
    }
  }, [jsonStr]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">JSON Array Input</label>
          <textarea
            rows={10}
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">CSV Table Output</label>
            <button onClick={() => copyText(csv)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Copy size={13} /> Copy CSV
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={csv}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: CSV TO JSON
// ============================================================================
function CsvToJsonTool({ copyText, copied }) {
  const [csv, setCsv] = useState("id,name,role,city\n1,Alice,Developer,New York\n2,Bob,Designer,London");

  const jsonStr = useMemo(() => {
    try {
      const lines = csv.trim().split("\n");
      if (lines.length < 2) return "[]";
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const records = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] ?? "";
        });
        return obj;
      });
      return JSON.stringify(records, null, 2);
    } catch {
      return "Invalid CSV format.";
    }
  }, [csv]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">CSV Input</label>
          <textarea
            rows={10}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">JSON Objects Output</label>
            <button onClick={() => copyText(jsonStr)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Copy size={13} /> Copy JSON
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={jsonStr}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-indigo-900 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: REGEX TESTER
// ============================================================================
function RegexTesterTool({ copyText, copied }) {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})");
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testText, setTestText] = useState("Reach us at contact@stiknex.site or support@example.com for inquiries.");

  const flagStr = Object.entries(flags)
    .filter(([_, active]) => active)
    .map(([f]) => f)
    .join("");

  const matches = useMemo(() => {
    try {
      if (!pattern) return [];
      const regex = new RegExp(pattern, flagStr);
      const res = [];
      let m;
      if (flags.g) {
        while ((m = regex.exec(testText)) !== null) {
          res.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testText);
        if (m) res.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return res;
    } catch {
      return [];
    }
  }, [pattern, flagStr, testText, flags.g]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Regular Expression Pattern</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-lg font-bold">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold"
            />
            <span className="text-slate-400 font-mono text-lg font-bold">/{flagStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="text-slate-500">Flags:</span>
          {["g", "i", "m"].map((f) => (
            <label key={f} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[f]}
                onChange={(e) => setFlags((prev) => ({ ...prev, [f]: e.target.checked }))}
              />
              <span className="uppercase">{f} ({f === "g" ? "Global" : f === "i" ? "Insensitive" : "Multiline"})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Test String</label>
        <textarea
          rows={5}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      <div className="p-6 bg-indigo-600 text-white rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            {matches.length} Matches Found
          </span>
        </div>
        <div className="space-y-2">
          {matches.map((item, idx) => (
            <div key={idx} className="p-3 bg-white/10 rounded-xl font-mono text-xs flex items-center justify-between">
              <span>#{idx + 1}: <strong className="text-white underline">{item.match}</strong> (Index: {item.index})</span>
              {item.groups.length > 0 && <span className="text-indigo-200 text-[11px]">Groups: {item.groups.join(", ")}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: UUID GENERATOR
// ============================================================================
function UuidGeneratorTool({ copyText, copied }) {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);

  const genV4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, genV4));

  const regenerate = () => {
    const list = Array.from({ length: Math.min(Math.max(1, count), 100) }, genV4);
    setUuids(list);
  };

  const formattedList = useMemo(() => {
    return uuids.map((id) => {
      let res = id;
      if (!hyphens) res = res.replace(/-/g, "");
      if (uppercase) res = res.toUpperCase();
      if (braces) res = `{${res}}`;
      return res;
    });
  }, [uuids, hyphens, uppercase, braces]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Count:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold text-sm"
          />
          <button
            onClick={regenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <RefreshCw size={14} /> Generate
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            <span>Uppercase</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
            <span>Hyphens</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} />
            <span>Braces</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{formattedList.length} Generated UUIDs</span>
          <button onClick={() => copyText(formattedList.join("\n"))} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <Copy size={13} /> Copy All UUIDs
          </button>
        </div>
        {formattedList.map((id, idx) => (
          <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-900 dark:text-white font-bold">{id}</span>
            <button onClick={() => copyText(id)} className="text-slate-400 hover:text-indigo-600">
              <Copy size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Formatters for XML, HTML, CSS, JS
function XmlFormatterTool({ copyText }) {
  const [code, setCode] = useState('<root><user id="1"><name>Stiknex</name><status>active</status></user></root>');
  const formatted = useMemo(() => {
    return code.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3");
  }, [code]);

  return <CodeFormatterView title="XML Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} />;
}

function HtmlFormatterTool({ copyText }) {
  const [code, setCode] = useState('<div class="container"><h1>Title</h1><p>Paragraph text</p></div>');
  const formatted = useMemo(() => {
    return code.replace(/(>)(<)(\/*)/g, "$1\n$2$3");
  }, [code]);

  return <CodeFormatterView title="HTML Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} />;
}

function CssFormatterTool({ copyText }) {
  const [code, setCode] = useState('.card { padding: 16px; border-radius: 8px; background: #fff; }');
  const formatted = useMemo(() => {
    return code.replace(/\{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/\}/g, "\n}\n");
  }, [code]);

  return <CodeFormatterView title="CSS Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} />;
}

function JsFormatterTool({ copyText }) {
  const [code, setCode] = useState('function add(a,b){return a+b;} const res=add(10,20);');
  const formatted = useMemo(() => {
    return code.replace(/\{/g, " {\n  ").replace(/;/g, ";\n").replace(/\}/g, "\n}\n");
  }, [code]);

  return <CodeFormatterView title="JavaScript Formatter" code={code} setCode={setCode} formatted={formatted} copyText={copyText} />;
}

function CodeFormatterView({ title, code, setCode, formatted, copyText }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input {title}</label>
          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Formatted Output</label>
            <button onClick={() => copyText(formatted)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Copy size={13} /> Copy Formatted
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={formatted}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-indigo-900 dark:text-indigo-200"
          />
        </div>
      </div>
    </div>
  );
}
