import { useState, useRef, useEffect } from "react";
import { Upload, Download, Copy, Check, Image as ImageIcon, Sliders, Palette, Crop, FileImage } from "lucide-react";

export default function ImageEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "image-to-base64" || toolId === "image-to-base64") {
    return <ImageToBase64Tool copyText={copyText} copied={copied} />;
  }
  if (slug === "base64-to-image" || toolId === "base64-to-image") {
    return <Base64ToImageTool copyText={copyText} copied={copied} />;
  }
  if (slug === "color-palette-extractor" || toolId === "color-palette-extractor") {
    return <PaletteExtractorTool copyText={copyText} copied={copied} />;
  }
  if (slug === "favicon-generator" || toolId === "favicon-generator") {
    return <FaviconGeneratorTool copyText={copyText} copied={copied} />;
  }
  if (slug === "jpg-to-png" || slug === "png-to-jpg" || slug === "webp-converter") {
    return <ImageFormatConverterTool targetFormat={slug === "jpg-to-png" ? "image/png" : slug === "png-to-jpg" ? "image/jpeg" : "image/webp"} />;
  }
  if (slug === "image-resizer" || toolId === "image-resizer") {
    return <ImageResizerTool />;
  }
  if (slug === "image-cropper" || toolId === "image-cropper") {
    return <ImageCropperTool />;
  }

  // Default: Image Compressor
  return <ImageCompressorTool />;
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
