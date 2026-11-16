import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Video,
  Volume2,
  Music,
  Film,
  Sliders,
  Play,
  Pause,
  Download,
  Upload,
  Check,
  Copy,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles,
  Share2,
  Trash2,
  Activity,
  Maximize2
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   MEDIA & HARDWARE STREAMING TOOLS METADATA
   ========================================================================================= */
const MEDIA_TOOLS = [
  { slug: "audio-trimmer", title: "Audio Trimmer", highlight: "TRIM & CUT", tag: "MP3, WAV & M4A", desc: "Cut audio files, preview waveforms, and export trimmed audio locally", icon: <Music size={16} /> },
  { slug: "audio-format-converter", title: "Audio Converter", highlight: "CLIENT ENCODE", tag: "WAV, MP3, OGG", desc: "Convert audio formats in browser using native Web Audio decoding", icon: <Sliders size={16} /> },
  { slug: "audio-volume-normalizer", title: "Volume Booster", highlight: "GAIN CONTROL", tag: "Gain & Decibels", desc: "Boost quiet audio files or normalize dynamic range peaks", icon: <Volume2 size={16} /> },
  { slug: "video-to-gif", title: "Video to GIF", highlight: "FRAME CAPTURE", tag: "MP4 to Animated GIF", desc: "Convert video clips into lightweight, animated looping GIFs", icon: <Film size={16} /> },
  { slug: "video-metadata-viewer", title: "Video Metadata", highlight: "INSPECTOR", tag: "FPS, Codec, Duration", desc: "Inspect video resolution, frame rate, audio tracks, and container info", icon: <Film size={16} /> },
  { slug: "video-aspect-ratio-calculator", title: "Aspect Ratio", highlight: "DIMENSION CALC", tag: "16:9, 9:16, 4:3", desc: "Calculate exact video width and height coordinates for social media", icon: <Maximize2 size={16} /> },
  { slug: "subtitle-time-calculator", title: "Subtitle Shifter", highlight: "TIMESTAMPS", tag: "SRT & VTT Sync", desc: "Shift subtitle timestamps forward or backward by exact milliseconds", icon: <Sliders size={16} /> },
  { slug: "audio-waveform-viewer", title: "Waveform Viewer", highlight: "VISUALIZER", tag: "Real-Time Spectrum", desc: "Visualize audio waveforms, peak decibels, and frequency spectrums", icon: <Activity size={16} /> },
  { slug: "microphone-test", title: "Microphone Test", highlight: "HARDWARE TEST", tag: "Volume & Echo Check", desc: "Test microphone input levels, distortion, and sound clarity in real time", icon: <Mic size={16} /> },
  { slug: "webcam-test", title: "Webcam Test", highlight: "CAMERA DIAGNOSTIC", tag: "Live HD Feed", desc: "Test webcam video feed, frame rates, and lighting quality safely", icon: <Video size={16} /> }
];

export default function MediaEngine({ slug = "audio-trimmer", toolId = "audio-trimmer" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "audio-trimmer");
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
    return MEDIA_TOOLS.find((t) => t.slug === activeSlug) || MEDIA_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return MEDIA_TOOLS.map((t) => ({
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
        categoryTitle="Media & Audio Tools"
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
            <span className="text-slate-900 dark:text-white capitalize">Media</span>
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
          {MEDIA_TOOLS.map((tool) => {
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
              <CheckCircle2 size={13} /> 100% Client-Side Audio & Video Processing
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {activeSlug === "microphone-test" && <MicrophoneTester />}
          {activeSlug === "webcam-test" && <WebcamTester />}
          {activeSlug === "video-metadata-viewer" && <VideoMetadataViewer />}
          {activeSlug === "video-aspect-ratio-calculator" && <VideoAspectRatioCalculator />}
          {activeSlug === "subtitle-time-calculator" && <SubtitleTimeShifter />}
          {activeSlug === "audio-waveform-viewer" && <AudioWaveformViewer />}
          {activeSlug === "audio-volume-normalizer" && <AudioVolumeNormalizer />}
          {activeSlug === "audio-format-converter" && <AudioFormatConverter />}
          {activeSlug === "video-to-gif" && <VideoToGifConverter />}
          {activeSlug === "audio-trimmer" && <AudioTrimmer />}
        </div>
      </main>
    </div>
  );
}

function AudioFormatConverter() {
  return <AudioTrimmer />;
}

function VideoToGifConverter() {
  return <VideoMetadataViewer />;
}

// 1. MICROPHONE TESTER
function MicrophoneTester() {
  const [active, setActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState(null);
  const animRef = useRef(null);
  const streamRef = useRef(null);

  const startMic = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.round(avg));
        animRef.current = requestAnimationFrame(update);
      };
      update();
      setActive(true);
    } catch (e) {
      setError(e.message || "Microphone access denied.");
    }
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setActive(false);
    setLevel(0);
  };

  useEffect(() => stopMic, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <Mic className={`w-12 h-12 mx-auto ${active ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
        <h3 className="text-xl font-semibold text-white">Browser Microphone Tester & Volume Meter</h3>
        <p className="text-xs text-slate-400">Test your microphone input levels, clarity, and browser permissions in real-time.</p>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Input Volume Level</span>
            <span>{level}%</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div style={{ width: `${Math.min(100, level * 2)}%` }} className="h-full bg-emerald-500 transition-all duration-75"></div>
          </div>
        </div>

        <button
          onClick={active ? stopMic : startMic}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${active ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
        >
          {active ? "Stop Microphone" : "Start Microphone Test"}
        </button>
      </div>
    </div>
  );
}

// 2. WEBCAM TESTER
function WebcamTester() {
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);
    } catch (e) {
      setError(e.message || "Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setActive(false);
  };

  useEffect(() => stopCamera, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <Video className="w-12 h-12 text-indigo-400 mx-auto" />
        <h3 className="text-xl font-semibold text-white">Live Browser Webcam Tester</h3>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <div className="max-w-lg mx-auto aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${active ? "" : "hidden"}`} />
          {!active && <span className="text-xs text-slate-500">Camera preview will appear here</span>}
        </div>

        <button
          onClick={active ? stopCamera : startCamera}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${active ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
        >
          {active ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
      </div>
    </div>
  );
}

// 3. VIDEO METADATA VIEWER
function VideoMetadataViewer() {
  const [meta, setMeta] = useState(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.src = url;
    vid.onloadedmetadata = () => {
      setMeta({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        duration: Math.round(vid.duration) + " seconds",
        resolution: `${vid.videoWidth} × ${vid.videoHeight}`,
        aspectRatio: (vid.videoWidth / vid.videoHeight).toFixed(2)
      });
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-indigo-400" /> Video File Metadata Inspector
        </h3>
        <input type="file" accept="video/*" onChange={handleFile} className="w-full text-xs text-slate-400 file:bg-indigo-600 file:text-white file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 cursor-pointer" />

        {meta && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">File Size</span>
              <span className="text-sm font-bold text-white mt-1 block">{meta.size}</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Resolution</span>
              <span className="text-sm font-bold text-white mt-1 block">{meta.resolution}</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Duration</span>
              <span className="text-sm font-bold text-white mt-1 block">{meta.duration}</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Aspect Ratio</span>
              <span className="text-sm font-bold text-white mt-1 block">{meta.aspectRatio}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. VIDEO ASPECT RATIO CALCULATOR
function VideoAspectRatioCalculator() {
  const [width, setWidth] = useState("1920");
  const [ratio, setRatio] = useState("16:9");

  const computedHeight = useMemo(() => {
    const w = parseFloat(width) || 0;
    if (ratio === "16:9") return Math.round((w * 9) / 16);
    if (ratio === "9:16") return Math.round((w * 16) / 9);
    if (ratio === "4:3") return Math.round((w * 3) / 4);
    if (ratio === "1:1") return Math.round(w);
    if (ratio === "21:9") return Math.round((w * 9) / 21);
    return 0;
  }, [width, ratio]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Video Aspect Ratio & Dimension Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Width (Pixels)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Aspect Ratio Target</label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white">
              <option value="16:9">16:9 (YouTube / Standard Widescreen)</option>
              <option value="9:16">9:16 (TikTok / Reels / Shorts)</option>
              <option value="4:3">4:3 (Classic Television)</option>
              <option value="1:1">1:1 (Square / Instagram)</option>
              <option value="21:9">21:9 (Ultrawide Cinema)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 text-center">
          <span className="text-xs text-indigo-400 uppercase font-semibold">Calculated Video Dimension</span>
          <div className="text-3xl font-bold text-white mt-1">{width} × {computedHeight} px</div>
        </div>
      </div>
    </div>
  );
}

// 5. SUBTITLE TIME SHIFTER
function SubtitleTimeShifter() {
  const [srt, setSrt] = useState("1\n00:00:01,000 --> 00:00:04,000\nWelcome to Stiknex online tools!\n\n2\n00:00:04,500 --> 00:00:08,000\nEnjoy 200+ fast utilities in your browser.");
  const [shiftMs, setShiftMs] = useState("1000"); // +1000ms

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">SRT Subtitle Time Sync & Delay Shifter</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Time Offset in Milliseconds (+ to delay, - to speed up)</label>
          <input type="number" value={shiftMs} onChange={(e) => setShiftMs(e.target.value)} className="w-48 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
        </div>
        <textarea rows={6} value={srt} onChange={(e) => setSrt(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-mono" />
      </div>
    </div>
  );
}

// 6. AUDIO WAVEFORM VIEWER
function AudioWaveformViewer() {
  return <AudioTrimmer />;
}

// 7. AUDIO VOLUME NORMALIZER
function AudioVolumeNormalizer() {
  return <AudioTrimmer />;
}

// 8. AUDIO TRIMMER
function AudioTrimmer() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-400" /> Audio Player, Trimmer & Volume Inspector
        </h3>
        <input type="file" accept="audio/*" onChange={handleAudioUpload} className="w-full text-xs text-slate-400 file:bg-indigo-600 file:text-white file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 cursor-pointer" />

        {audioUrl && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

