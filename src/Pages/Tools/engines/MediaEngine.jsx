import { useState, useRef, useEffect, useMemo } from "react";
import { Mic, Video, Volume2, Music, Film, Sliders, Play, Pause, Download, Upload, Check, Copy } from "lucide-react";

export default function MediaEngine({ slug, toolId }) {
  if (slug === "microphone-test") return <MicrophoneTester />;
  if (slug === "webcam-test") return <WebcamTester />;
  if (slug === "video-metadata-viewer") return <VideoMetadataViewer />;
  if (slug === "video-aspect-ratio-calculator") return <VideoAspectRatioCalculator />;
  if (slug === "subtitle-time-calculator") return <SubtitleTimeShifter />;
  if (slug === "audio-waveform-viewer") return <AudioWaveformViewer />;
  if (slug === "audio-volume-normalizer") return <AudioVolumeNormalizer />;

  // Default: Audio Trimmer & Player
  return <AudioTrimmer />;
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

