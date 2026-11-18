import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { resolveStartupRestoration } from "./utils/routeRestoration";
import { initRoutePreloader } from "./utils/routePreloader";
import { registerSW } from "virtual:pwa-register";

// Initialize instant speculative hover, touch and idle preloader
initRoutePreloader();

// Auto-register PWA service worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[PWA] New content available, updating service worker...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("[PWA] Stiknex is cached and ready to work completely offline.");
  },
  onRegisterError(error) {
    console.warn("[PWA] Service worker registration failed:", error);
  }
});

// Protect offline IndexedDB data from browser eviction
if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((persistent) => {
    if (persistent) {
      console.log("[PWA] Storage persistence granted: IndexedDB data protected from eviction.");
    }
  }).catch((err) => {
    console.warn("[PWA] Could not request storage persistence:", err);
  });
}

// Automatically reload if a Vite dynamic import chunk fails (e.g. after a new deployment)
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload();
});
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
});

// Store PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPWA = e;
});

// Synchronous restoration before BrowserRouter mounts — eliminates homepage flash on PWA / app cold start
resolveStartupRestoration();

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);