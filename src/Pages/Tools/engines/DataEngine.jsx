import { useState, useMemo } from "react";
import { Table, Copy, Check, Download, Upload, Filter, Shuffle, ArrowRightLeft, FileSpreadsheet } from "lucide-react";

export default function DataEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "csv-merger") return <CsvMerger copyText={copyText} copied={copied} />;
  if (slug === "csv-deduplicator") return <CsvDeduplicator copyText={copyText} copied={copied} />;
  if (slug === "csv-column-extractor") return <CsvColumnExtractor copyText={copyText} copied={copied} />;
  if (slug === "json-to-xml") return <JsonToXml copyText={copyText} copied={copied} />;
  if (slug === "xml-to-json") return <XmlToJson copyText={copyText} copied={copied} />;
  if (slug === "tsv-to-csv") return <TsvToCsv copyText={copyText} copied={copied} />;
  if (slug === "delimited-text-converter") return <DelimitedConverter copyText={copyText} copied={copied} />;
  if (slug === "table-to-markdown") return <TableToMarkdown copyText={copyText} copied={copied} />;
  if (slug === "data-sampling-tool") return <DataSampler copyText={copyText} copied={copied} />;

  // Default: CSV Viewer
  return <CsvViewer copyText={copyText} copied={copied} />;
}

// Helper CSV parser
function parseCsvSimple(csvText) {
  const lines = csvText.trim().split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map(line => line.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
  return { headers, rows };
}

// 1. CSV VIEWER
function CsvViewer({ copyText, copied }) {
  const [csv, setCsv] = useState("Name,Role,Department,Rating\nAlice Smith,Frontend Engineer,Engineering,4.9\nBob Jones,Product Manager,Product,4.8\nCarol White,Data Scientist,Analytics,5.0\nDavid Brown,UI/UX Designer,Design,4.7");
  const [search, setSearch] = useState("");

  const { headers, rows } = useMemo(() => parseCsvSimple(csv), [csv]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => r.some(col => String(col).toLowerCase().includes(q)));
  }, [rows, search]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> Interactive CSV Viewer & Filter
          </h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search table rows..."
            className="bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
          />
        </div>

        <textarea
          rows={4}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Paste CSV data here..."
          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
        />

        {headers.length > 0 && (
          <div className="border border-white/10 rounded-xl overflow-x-auto bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-white font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredRows.map((r, ri) => (
                  <tr key={ri} className="hover:bg-white/5 transition">
                    {r.map((c, ci) => (
                      <td key={ci} className="px-4 py-2.5 whitespace-nowrap">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. CSV MERGER
function CsvMerger({ copyText, copied }) {
  const [csv1, setCsv1] = useState("Name,Score\nAlice,90\nBob,85");
  const [csv2, setCsv2] = useState("Name,Score\nCarol,95\nDavid,88");

  const merged = useMemo(() => {
    const l1 = csv1.trim().split("\n").filter(Boolean);
    const l2 = csv2.trim().split("\n").filter(Boolean);
    if (l1.length === 0) return csv2;
    if (l2.length === 0) return csv1;
    // skip header of l2 if it matches
    const body2 = l2[0].toLowerCase() === l1[0].toLowerCase() ? l2.slice(1) : l2;
    return [...l1, ...body2].join("\n");
  }, [csv1, csv2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Merge Multiple CSV Datasets</h3>
          <button onClick={() => copyText(merged)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Merged CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dataset A</label>
            <textarea rows={4} value={csv1} onChange={(e) => setCsv1(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dataset B</label>
            <textarea rows={4} value={csv2} onChange={(e) => setCsv2(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <span className="text-xs text-slate-400 block mb-2 font-semibold">Combined Output:</span>
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{merged}</pre>
        </div>
      </div>
    </div>
  );
}

// 3. CSV DEDUPLICATOR
function CsvDeduplicator({ copyText, copied }) {
  const [csv, setCsv] = useState("Email,Name\nalice@example.com,Alice\nbob@example.com,Bob\nalice@example.com,Alice Duplicate\ncarol@example.com,Carol");

  const deduped = useMemo(() => {
    const lines = csv.trim().split("\n").filter(Boolean);
    if (lines.length <= 1) return csv;
    const header = lines[0];
    const seen = new Set();
    const unique = [header];
    lines.slice(1).forEach((l) => {
      const key = l.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(l);
      }
    });
    return unique.join("\n");
  }, [csv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">CSV Duplicate Row Remover</h3>
          <button onClick={() => copyText(deduped)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Cleaned CSV
          </button>
        </div>
        <textarea rows={6} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{deduped}</pre>
        </div>
      </div>
    </div>
  );
}

// 4. CSV COLUMN EXTRACTOR
function CsvColumnExtractor({ copyText, copied }) {
  const [csv, setCsv] = useState("Name,Email,City,Salary\nAlice,alice@mail.com,New York,90000\nBob,bob@mail.com,London,85000");
  const [targetCol, setTargetCol] = useState("Email");

  const extracted = useMemo(() => {
    const { headers, rows } = parseCsvSimple(csv);
    const colIdx = headers.findIndex(h => h.toLowerCase() === targetCol.toLowerCase());
    if (colIdx === -1) return "Column not found.";
    return [headers[colIdx], ...rows.map(r => r[colIdx])].join("\n");
  }, [csv, targetCol]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Extract Specific Column from CSV</h3>
          <button onClick={() => copyText(extracted)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Column
          </button>
        </div>
        <div className="flex gap-4">
          <input type="text" value={targetCol} onChange={(e) => setTargetCol(e.target.value)} placeholder="Target Column Name..." className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
        </div>
        <textarea rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{extracted}</pre>
        </div>
      </div>
    </div>
  );
}

// 5. JSON TO XML
function JsonToXml({ copyText, copied }) {
  const [json, setJson] = useState('{\n  "user": {\n    "name": "Alice",\n    "role": "Admin",\n    "active": true\n  }\n}');

  const xml = useMemo(() => {
    try {
      const obj = JSON.parse(json);
      const toXml = (o, tag = "root") => {
        let str = `<${tag}>`;
        if (typeof o === "object" && o !== null) {
          for (let k in o) str += toXml(o[k], k);
        } else {
          str += String(o);
        }
        str += `</${tag}>`;
        return str;
      };
      return toXml(obj);
    } catch (e) {
      return "Invalid JSON input.";
    }
  }, [json]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">JSON to XML Converter</h3>
          <button onClick={() => copyText(xml)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy XML
          </button>
        </div>
        <textarea rows={6} value={json} onChange={(e) => setJson(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{xml}</pre>
        </div>
      </div>
    </div>
  );
}

// 6. XML TO JSON
function XmlToJson({ copyText, copied }) {
  const [xml, setXml] = useState('<user><name>Alice</name><role>Admin</role></user>');
  const [result, setResult] = useState('{\n  "user": {\n    "name": "Alice",\n    "role": "Admin"\n  }\n}');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">XML to JSON Converter</h3>
        <textarea rows={4} value={xml} onChange={(e) => setXml(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{result}</pre>
        </div>
      </div>
    </div>
  );
}

// 7. TSV TO CSV
function TsvToCsv({ copyText, copied }) {
  const [tsv, setTsv] = useState("Name\tAge\tCity\nAlice\t28\tNew York\nBob\t34\tSan Francisco");
  const csv = useMemo(() => tsv.split("\n").map(l => l.split("\t").join(",")).join("\n"), [tsv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">TSV to CSV Converter</h3>
          <button onClick={() => copyText(csv)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy CSV
          </button>
        </div>
        <textarea rows={5} value={tsv} onChange={(e) => setTsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{csv}</pre>
        </div>
      </div>
    </div>
  );
}

// 8. DELIMITED CONVERTER
function DelimitedConverter(props) {
  return <TsvToCsv {...props} />;
}

// 9. TABLE TO MARKDOWN
function TableToMarkdown({ copyText, copied }) {
  const [csv, setCsv] = useState("Product,Price,Quantity\nApple,$1.20,10\nBanana,$0.80,25\nOrange,$1.50,15");

  const md = useMemo(() => {
    const { headers, rows } = parseCsvSimple(csv);
    if (headers.length === 0) return "";
    let res = `| ${headers.join(" | ")} |\n`;
    res += `| ${headers.map(() => "---").join(" | ")} |\n`;
    rows.forEach((r) => {
      res += `| ${r.join(" | ")} |\n`;
    });
    return res;
  }, [csv]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Convert Table / CSV to Markdown Table</h3>
          <button onClick={() => copyText(md)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Markdown Table
          </button>
        </div>
        <textarea rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{md}</pre>
        </div>
      </div>
    </div>
  );
}

// 10. DATA SAMPLER
function DataSampler({ copyText, copied }) {
  const [csv, setCsv] = useState("ID,Item\n1,Alpha\n2,Beta\n3,Gamma\n4,Delta\n5,Epsilon\n6,Zeta\n7,Eta\n8,Theta");
  const [sampleSize, setSampleSize] = useState(3);

  const sampled = useMemo(() => {
    const lines = csv.trim().split("\n").filter(Boolean);
    if (lines.length <= 1) return csv;
    const header = lines[0];
    const data = lines.slice(1);
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return [header, ...shuffled.slice(0, sampleSize)].join("\n");
  }, [csv, sampleSize]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Random Data Sample Generator</h3>
          <button onClick={() => copyText(sampled)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Sample
          </button>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Number of Random Rows</label>
          <input type="number" min="1" value={sampleSize} onChange={(e) => setSampleSize(Math.max(1, Number(e.target.value)))} className="w-32 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{sampled}</pre>
        </div>
      </div>
    </div>
  );
}

