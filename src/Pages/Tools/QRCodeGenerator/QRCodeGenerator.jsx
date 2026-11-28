import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { Download, Copy, Check, QrCode, Sparkles, RefreshCw, Palette } from "lucide-react";

export default function QRCodeGenerator() {
  const [value, setValue] = useState("https://stiknex.site");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [level, setLevel] = useState("M"); // L, M, Q, H
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const downloadPNG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "stiknex-qr-code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copySVG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    navigator.clipboard.writeText(svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Configuration Controls (Left 7 Cols) */}
        <div className="md:col-span-7 p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                URL or Plain Text
              </label>
              <textarea
                rows={3}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter URL (https://...), email, WiFi credentials, or text..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
              />
            </div>

            {/* Color Customization */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {fgColor.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {bgColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "L", label: "Low (7%)" },
                  { id: "M", label: "Medium (15%)" },
                  { id: "Q", label: "Quartile (25%)" },
                  { id: "H", label: "High (30%)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLevel(item.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer border ${
                      level === item.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Quick examples:</span>
            <button
              onClick={() => setValue("https://stiknex.site/tools")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              Stiknex Tools
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setValue("https://github.com")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              GitHub
            </button>
          </div>
        </div>

        {/* Live QR Code Preview Card (Right 5 Cols) */}
        <div className="md:col-span-5 p-6 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/40 dark:shadow-none flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-4">
              Real-Time QR Preview
            </span>

            {/* QR Code Container */}
            <div
              ref={qrRef}
              className="p-5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/40 inline-block border border-slate-200/80 dark:border-slate-700 transition-all max-w-[240px] max-h-[240px] mx-auto"
              style={{ backgroundColor: bgColor }}
            >
              {value ? (
                <QRCode
                  value={value}
                  size={200}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 200 200`}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400 font-bold">
                  Enter text to render QR
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 mt-6">
            <button
              onClick={downloadPNG}
              disabled={!value}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition cursor-pointer disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG (1000px)</span>
            </button>

            <button
              onClick={copySVG}
              disabled={!value}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied SVG" : "Copy Vector SVG"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
