// Lightweight ambient "focus sound" generator built entirely with the
// Web Audio API. No external audio file is needed, so it works
// instantly, offline, and without any extra network requests.
//
// Produces a soft, brown-noise-style ambient tone (a bit like gentle
// rain / distant static) that loops seamlessly while toggled on.

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let fadeTimeout = null;

const getContext = () => {
  if (audioCtx) return audioCtx;
  const Ctx =
    typeof window !== "undefined" &&
    (window.AudioContext || window.webkitAudioContext);
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
};

const createNoiseBuffer = (ctx) => {
  const duration = 4; // seconds, looped seamlessly
  const bufferSize = Math.floor(duration * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.2;
  }
  return buffer;
};

export const isFocusSoundSupported = () =>
  typeof window !== "undefined" &&
  !!(window.AudioContext || window.webkitAudioContext);

// Must be called synchronously inside a user-gesture handler (e.g. a
// click) so autoplay-restricted browsers (Safari, etc.) allow it.
export const startFocusSound = () => {
  const ctx = getContext();
  if (!ctx) return false;

  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
    fadeTimeout = null;
  }

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (sourceNode) return true; // already playing

  sourceNode = ctx.createBufferSource();
  sourceNode.buffer = createNoiseBuffer(ctx);
  sourceNode.loop = true;

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);

  sourceNode.connect(gainNode).connect(ctx.destination);
  sourceNode.start();
  return true;
};

export const stopFocusSound = () => {
  if (!audioCtx || !sourceNode || !gainNode) return;
  const ctx = audioCtx;
  const src = sourceNode;
  const gain = gainNode;

  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  fadeTimeout = setTimeout(() => {
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
    src.disconnect();
    gain.disconnect();
  }, 550);

  sourceNode = null;
  gainNode = null;
};