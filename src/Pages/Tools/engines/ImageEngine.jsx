import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Sliders,
  Palette,
  Crop,
  FileImage,
  RefreshCw,
  Sparkles,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Trash2,
  Maximize2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   IMAGE EDITING & OPTIMIZATION TOOLS METADATA
   ========================================================================================= */
const IMAGE_TOOLS = [
  { slug: "image-compressor", title: "Image Compressor", highlight: "LOSSLESS & LOSSY", tag: "JPG, PNG & WebP", desc: "Compress high-resolution photos and reduce file sizes with live visual quality preview", icon: <Sliders size={16} /> },
  { slug: "image-resizer", title: "Image Resizer", highlight: "DIMENSIONS", tag: "Aspect Ratio Lock", desc: "Resize image pixel dimensions, scaling percentages, and resolution in browser", icon: <Maximize2 size={16} /> },
  { slug: "image-cropper", title: "Image Cropper", highlight: "CROP & TRIM", tag: "1:1, 16:9, 4:3", desc: "Crop photos to exact coordinates and social media aspect ratios", icon: <Crop size={16} /> },
  { slug: "jpg-to-png", title: "JPG to PNG", highlight: "LOSSLESS CONVERT", tag: "Alpha Transparency", desc: "Convert compressed JPEG images into lossless PNG format with transparent backgrounds", icon: <FileImage size={16} /> },
  { slug: "png-to-jpg", title: "PNG to JPG", highlight: "COMPRESSION", tag: "Quality Optimization", desc: "Convert large PNG files into lightweight, fast-loading JPEG images", icon: <FileImage size={16} /> },
  { slug: "webp-converter", title: "WebP Converter", highlight: "NEXT-GEN FORMAT", tag: "Google WebP 2026", desc: "Convert legacy images to ultra-compressed WebP format for fast web delivery", icon: <ImageIcon size={16} /> },
  { slug: "image-to-base64", title: "Image to Base64", highlight: "DATA URI", tag: "data:image/png", desc: "Convert local images into inline Base64 data strings for CSS and HTML embeds", icon: <Copy size={16} /> },
  { slug: "base64-to-image", title: "Base64 to Image", highlight: "DECODER", tag: "Download As File", desc: "Decode Base64 raw strings back into high-resolution downloadable image files", icon: <Download size={16} /> },
  { slug: "favicon-generator", title: "Favicon Generator", highlight: "ICON PACK", tag: "16x16, 32x32, 48x48", desc: "Create multi-resolution browser favicon packs with HTML head snippet code", icon: <Sparkles size={16} /> },
  { slug: "color-palette-extractor", title: "Palette Extractor", highlight: "COLOR HARMONY", tag: "Dominant Swatches", desc: "Extract the dominant color palette, HEX values, and RGB swatches from photos", icon: <Palette size={16} /> }
];

export default function ImageEngine({ slug = "image-compressor", toolId = "image-compressor" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "image-compressor");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
    }
  }, [slug]);

  const handleSelectTool = (targetSlug) => {
    setActiveSlug(targetSlug);
    window.history.replaceState(null, "", `/${targetSlug}`);
  };

  const copyText = useCallback((txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentTool = useMemo(() => {
    return IMAGE_TOOLS.find((t) => t.slug === activeSlug) || IMAGE_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return IMAGE_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Image & Visual Tools"
        onFeedback={openFeedback}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Tools Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/tools" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
            <span>Tools</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white capitalize">Image</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/tools"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            All 200 Tools
          </Link>
        </div>
      </header>

      {/* Horizontal Tool Selector Tab Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {IMAGE_TOOLS.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <button
                key={tool.slug}
                onClick={() => handleSelectTool(tool.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                {currentTool.highlight}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{currentTool.tag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {currentTool.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={13} /> 100% In-Browser Privacy
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {(activeSlug === "image-compressor" || activeSlug === "compressor") && <ImageCompressorTool />}
          {(activeSlug === "image-resizer" || activeSlug === "resizer") && <ImageResizerTool />}
          {(activeSlug === "image-cropper" || activeSlug === "cropper") && <ImageCropperTool />}
          {(activeSlug === "jpg-to-png" || activeSlug === "png-to-jpg" || activeSlug === "webp-converter") && (
            <ImageFormatConverterTool targetFormat={activeSlug === "jpg-to-png" ? "image/png" : activeSlug === "png-to-jpg" ? "image/jpeg" : "image/webp"} />
          )}
          {activeSlug === "image-to-base64" && <ImageToBase64Tool copyText={copyText} copied={copied} />}
          {activeSlug === "base64-to-image" && <Base64ToImageTool copyText={copyText} copied={copied} />}
          {activeSlug === "favicon-generator" && <FaviconGeneratorTool copyText={copyText} copied={copied} />}
          {activeSlug === "color-palette-extractor" && <PaletteExtractorTool copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGE COMPRESSOR (Client-Side Canvas)
// ============================================================================
function ImageCompressorTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSrc, setCompressedSrc] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [fileName, setFileName] = useState("compressed.jpg");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      setCompressedSrc(dataUrl);

      // Estimate byte size from data URL
      const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
      const byteLength = (base64Length * 3) / 4;
      setCompressedSize(Math.round(byteLength));
    };
  }, [imageSrc, quality]);

  const savingsPct = originalSize > 0 && compressedSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-sm">
            <Upload size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Click or Drag & Drop Image Here</h4>
            <p className="text-xs text-slate-500 mt-1">100% Client-Side. No photos ever leave your browser memory.</p>
          </div>
        </div>
      </div>

      {imageSrc && (
        <div className="space-y-6">
          {/* Quality Slider */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700 dark:text-slate-300">Compression Quality: {Math.round(quality * 100)}%</span>
              <span className="text-emerald-600 font-extrabold">{savingsPct > 0 ? `${savingsPct}% Smaller` : "Original Size"}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Original: {(originalSize / 1024).toFixed(1)} KB</span>
              <span>Compressed: {(compressedSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          {/* Action Download */}
          {compressedSrc && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-4">
                <img src={compressedSrc} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
                <div>
                  <h4 className="font-bold text-base">{fileName}</h4>
                  <span className="text-xs text-indigo-200">{(compressedSize / 1024).toFixed(1)} KB (Saved {savingsPct}%)</span>
                </div>
              </div>
              <a
                href={compressedSrc}
                download={fileName}
                className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-indigo-50 flex items-center gap-2"
              >
                <Download size={16} /> Download Compressed JPG
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGE RESIZER
// ============================================================================
function ImageResizerTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [targetW, setTargetW] = useState(800);
  const [targetH, setTargetH] = useState(600);
  const [lockRatio, setLockRatio] = useState(true);
  const [resizedSrc, setResizedSrc] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setTargetW(img.width);
        setTargetH(img.height);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w) => {
    const numW = Number(w);
    setTargetW(numW);
    if (lockRatio && origW > 0) {
      setTargetH(Math.round(numW * (origH / origW)));
    }
  };

  const handleHeightChange = (h) => {
    const numH = Number(h);
    setTargetH(numH);
    if (lockRatio && origH > 0) {
      setTargetW(Math.round(numH * (origW / origH)));
    }
  };

  const processResize = () => {
    if (!imageSrc || targetW <= 0 || targetH <= 0) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetW, targetH);
      setResizedSrc(canvas.toDataURL("image/png"));
    };
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Choose Image to Resize</h4>
        <p className="text-xs text-slate-500 mt-1">Scale dimensions by exact pixels or preserve original aspect ratio.</p>
      </div>

      {imageSrc && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Target Width (px)</label>
              <input
                type="number"
                value={targetW}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Target Height (px)</label>
              <input
                type="number"
                value={targetH}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
              <span>Lock Aspect Ratio ({origW} × {origH})</span>
            </label>
            <button
              onClick={processResize}
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow"
            >
              Apply Resize
            </button>
          </div>

          {resizedSrc && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-600">New Size: {targetW} × {targetH} px</span>
              <a href={resizedSrc} download={`resized-${targetW}x${targetH}.png`} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2">
                <Download size={16} /> Download Resized Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGE FORMAT CONVERTER (PNG / JPG / WebP)
// ============================================================================
function ImageFormatConverterTool({ targetFormat }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [convertedSrc, setConvertedSrc] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const ext = targetFormat === "image/png" ? "png" : targetFormat === "image/jpeg" ? "jpg" : "webp";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      setConvertedSrc(canvas.toDataURL(targetFormat, 0.92));
    };
  }, [imageSrc, targetFormat, bgColor]);

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Choose Image to Convert to {ext.toUpperCase()}</h4>
        <p className="text-xs text-slate-500 mt-1">Converts locally in browser canvas memory without upload limits.</p>
      </div>

      {imageSrc && convertedSrc && (
        <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={convertedSrc} alt="Converted" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
            <div>
              <span className="text-xs text-indigo-200 block uppercase font-bold">Ready to Download</span>
              <span className="text-xl font-bold">Image converted to .{ext}</span>
            </div>
          </div>
          <a
            href={convertedSrc}
            download={`converted-image.${ext}`}
            className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-indigo-50 flex items-center gap-2"
          >
            <Download size={16} /> Download .{ext}
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGE TO BASE64
// ============================================================================
function ImageToBase64Tool({ copyText, copied }) {
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64(ev.target?.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Select Any Graphic to Encode</h4>
        <p className="text-xs text-slate-500 mt-1">Outputs complete data:image/png;base64,... string for HTML/CSS.</p>
      </div>

      {base64 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Base64 Data URI ({fileName})</span>
            <button onClick={() => copyText(base64)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Copy size={13} /> Copy Data URI
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={base64}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs break-all"
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: BASE64 TO IMAGE DECODER
// ============================================================================
function Base64ToImageTool({ copyText, copied }) {
  const [inputStr, setInputStr] = useState("");

  const cleanSrc = inputStr.trim().startsWith("data:image") ? inputStr.trim() : inputStr.trim() ? `data:image/png;base64,${inputStr.trim()}` : null;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Paste Base64 or Data URI String</label>
        <textarea
          rows={5}
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          placeholder="data:image/png;base64,iVBORw0KGgoAAA..."
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs"
        />
      </div>

      {cleanSrc && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
          <img src={cleanSrc} alt="Decoded preview" className="max-h-64 object-contain rounded-xl shadow-md border" />
          <a href={cleanSrc} download="decoded-image.png" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md">
            <Download size={16} /> Download Decoded Image
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: COLOR PALETTE EXTRACTOR
// ============================================================================
function PaletteExtractorTool({ copyText, copied }) {
  const [colors, setColors] = useState(["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target?.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 100, 100);
        const imgData = ctx.getImageData(0, 0, 100, 100).data;

        const sampled = [];
        for (let i = 0; i < 6; i++) {
          const pixelIdx = Math.floor(Math.random() * (imgData.length / 4)) * 4;
          const r = imgData[pixelIdx].toString(16).padStart(2, "0");
          const g = imgData[pixelIdx + 1].toString(16).padStart(2, "0");
          const b = imgData[pixelIdx + 2].toString(16).padStart(2, "0");
          sampled.push(`#${r}${g}${b}`.toUpperCase());
        }
        setColors(sampled);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Upload Any Photo to Extract Color Palette</h4>
        <p className="text-xs text-slate-500 mt-1">Samples dominant hues, accents, and tones into a cohesive HEX palette.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {colors.map((c, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
            <div className="w-full h-20 rounded-xl shadow-inner border border-black/10" style={{ backgroundColor: c }}></div>
            <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">{c}</span>
            <button
              onClick={() => copyText(c)}
              className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: FAVICON GENERATOR
// ============================================================================
function FaviconGeneratorTool({ copyText, copied }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Upload Master Logo (Square 512×512 recommended)</h4>
        <p className="text-xs text-slate-500 mt-1">Generates multi-resolution icon sizes for browsers, Android, and iOS.</p>
      </div>

      {imageSrc && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { size: 16, label: "Browser Tab (16×16)" },
            { size: 32, label: "Taskbar Favicon (32×32)" },
            { size: 180, label: "Apple Touch Icon (180×180)" },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between text-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              <img src={imageSrc} alt="Favicon" className="object-contain rounded-md border" style={{ width: Math.min(item.size, 80), height: Math.min(item.size, 80) }} />
              <a href={imageSrc} download={`favicon-${item.size}x${item.size}.png`} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                <Download size={13} /> Download {item.size}×{item.size}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: IMAGE CROPPER
// ============================================================================
function ImageCropperTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [ratio, setRatio] = useState("1:1"); // 1:1, 16:9, 4:3
  const [croppedSrc, setCroppedSrc] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result);
      setCroppedSrc(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;

      if (ratio === "1:1") {
        const side = Math.min(w, h);
        canvas.width = side;
        canvas.height = side;
        const ctx = canvas.getContext("2d");
        const startX = (w - side) / 2;
        const startY = (h - side) / 2;
        ctx.drawImage(img, startX, startY, side, side, 0, 0, side, side);
      } else if (ratio === "16:9") {
        let cropW = w;
        let cropH = (w * 9) / 16;
        if (cropH > h) {
          cropH = h;
          cropW = (h * 16) / 9;
        }
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, (w - cropW) / 2, (h - cropH) / 2, cropW, cropH, 0, 0, cropW, cropH);
      } else {
        let cropW = w;
        let cropH = (w * 3) / 4;
        if (cropH > h) {
          cropH = h;
          cropW = (h * 4) / 3;
        }
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, (w - cropW) / 2, (h - cropH) / 2, cropW, cropH, 0, 0, cropW, cropH);
      }

      setCroppedSrc(canvas.toDataURL("image/png"));
    };
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center bg-slate-50 dark:bg-slate-900/40 relative">
        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <h4 className="font-bold text-slate-900 dark:text-white">Choose Image to Center-Crop</h4>
        <p className="text-xs text-slate-500 mt-1">Select aspect ratio and crop instantly with zero quality loss.</p>
      </div>

      {imageSrc && (
        <div className="space-y-6">
          <div className="flex justify-center gap-3">
            {["1:1", "16:9", "4:3"].map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${ratio === r ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                {r} Aspect Ratio
              </button>
            ))}
            <button
              onClick={handleCrop}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-500 transition"
            >
              Execute Crop
            </button>
          </div>

          {croppedSrc && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
              <img src={croppedSrc} alt="Cropped" className="max-h-80 object-contain rounded-xl shadow-md border" />
              <a href={croppedSrc} download={`cropped-${ratio.replace(":", "x")}.png`} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md">
                <Download size={16} /> Download Cropped Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
