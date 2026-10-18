/**
 * Stiknex Chrome Extension — Main Popup Controller
 * Manages tool catalog, real-time search, category filtering, favorites pinning,
 * theme toggling, and in-popup tool execution.
 */

import { evaluateExpression } from "../utils/mathParser.js";
import {
  LENGTH_UNITS,
  AREA_UNITS,
  VOLUME_UNITS,
  WEIGHT_UNITS,
  SPEED_UNITS,
  PRESSURE_UNITS,
  POWER_UNITS,
  DATA_UNITS,
} from "../utils/unitData.js";
import QRCode from "../utils/qrcode.bundle.js";

// ============================================================================
// State & Storage Keys
// ============================================================================
const STORAGE_KEYS = {
  PINNED: "stiknex_pinned",
  RECENT: "stiknex_recent",
  THEME: "stiknex_theme",
  NOTES: "stiknex_extension_notes",
  NOTEPAD: "stiknex_notepad_content",
  ACTIVE_TOOL: "stiknex_active_tool",
  PENDING_TEXT: "stiknex_pending_text",
  PENDING_QR: "stiknex_pending_qr",
};

let currentCategory = "all";
let activeToolSlug = null;
let pinnedTools = [];
let recentTools = [];
let currentTheme = "system";

// ============================================================================
// SVG Icons Dictionary (Clean, high-performance, 100% offline)
// ============================================================================
const ICONS = {
  notes: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  notepad: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  whiteboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  word: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  char: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20l5-16 5 16"/><line x1="8.5" y1="14" x2="15.5" y2="14"/></svg>`,
  reading: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  calc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,
  scientific: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5a2 2 0 0 1 2-2h14v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 10l3 5 3-5"/><path d="M9 15l6-6"/></svg>`,
  date: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  currency: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="18"/></svg>`,
  unit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.3 8.7L8.7 21.3c-.4.4-1 .4-1.4 0l-4.6-4.6c-.4-.4-.4-1 0-1.4L15.3 2.7c.4-.4 1-.4 1.4 0l4.6 4.6c.4.4.4 1 0 1.4z"/><line x1="14" y1="6" x2="16" y2="8"/><line x1="10" y1="10" x2="12" y2="12"/><line x1="6" y1="14" x2="8" y2="16"/></svg>`,
  temp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
  qr: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  password: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  color: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  blog: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  support: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
};

// ============================================================================
// Tool Catalog Definitions (24 Exact Tools on Stiknex)
// ============================================================================
const TOOLS = [
  // Notes & Workspace
  {
    slug: "sticky-notes",
    title: "Sticky Notes",
    category: "notes",
    icon: ICONS.notes,
    desc: "Quick capture sticky notes & infinite board launch",
    webUrl: "https://stiknex.site/sticky-notes",
    render: renderStickyNotes,
  },
  {
    slug: "quick-notepad",
    title: "Quick Notepad",
    category: "notes",
    icon: ICONS.notepad,
    desc: "Distraction-free auto-saving scratchpad & full editor",
    webUrl: "https://stiknex.site/online-notebook",
    render: renderQuickNotepad,
  },
  {
    slug: "whiteboard",
    title: "Whiteboard",
    category: "notes",
    icon: ICONS.whiteboard,
    desc: "Infinite Excalidraw drawing canvas & sketch board",
    webUrl: "https://stiknex.site/whiteboard",
    render: (c) => renderWebLaunchTool(c, {
      title: "Digital Whiteboard",
      desc: "Stiknex Whiteboard runs on the complete Excalidraw diagramming engine with infinite canvas, freehand sketching, shapes, and SVG export.",
      webUrl: "https://stiknex.site/whiteboard",
      btnText: "Launch Whiteboard on Stiknex",
    }),
  },

  // Writing
  {
    slug: "word-counter",
    title: "Word Counter",
    category: "writing",
    icon: ICONS.word,
    desc: "Real-time word, sentence, and reading time counter",
    webUrl: "https://stiknex.site/word-counter",
    render: renderWordCounter,
  },
  {
    slug: "character-counter",
    title: "Character Counter",
    category: "writing",
    icon: ICONS.char,
    desc: "Character limits for Twitter, SMS, and SEO tags",
    webUrl: "https://stiknex.site/character-counter",
    render: renderCharacterCounter,
  },
  {
    slug: "reading-time-calculator",
    title: "Reading Time Calculator",
    category: "writing",
    icon: ICONS.reading,
    desc: "Speaking & silent reading duration estimates",
    webUrl: "https://stiknex.site/reading-time-calculator",
    render: renderReadingTime,
  },

  // Calculators
  {
    slug: "simple-calculator",
    title: "Simple Calculator",
    category: "calculators",
    icon: ICONS.calc,
    desc: "Fast keyboard-supported arithmetic calculator",
    webUrl: "https://stiknex.site/simple-calculator",
    render: renderSimpleCalculator,
  },
  {
    slug: "scientific-calculator",
    title: "Scientific Calculator",
    category: "calculators",
    icon: ICONS.scientific,
    desc: "Trig, logs, powers, roots and scientific constants",
    webUrl: "https://stiknex.site/scientific-calculator",
    render: renderScientificCalculator,
  },
  {
    slug: "date-calculator",
    title: "Date Calculator",
    category: "calculators",
    icon: ICONS.date,
    desc: "Age milestone, days between dates & date countdowns",
    webUrl: "https://stiknex.site/date-calculator",
    render: renderDateCalculator,
  },

  // Converters
  {
    slug: "currency-converter",
    title: "Currency Converter",
    category: "converters",
    icon: ICONS.currency,
    desc: "Live foreign exchange rates for 150+ currencies",
    webUrl: "https://stiknex.site/currency-converter",
    render: renderCurrencyConverter,
  },
  {
    slug: "length-converter",
    title: "Length Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert mm, cm, meters, feet, inches, miles",
    webUrl: "https://stiknex.site/length-converter",
    render: (c) => renderUnitConverter(c, LENGTH_UNITS, "m", "Length"),
  },
  {
    slug: "area-converter",
    title: "Area Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert sq meters, sq feet, acres, hectares",
    webUrl: "https://stiknex.site/area-converter",
    render: (c) => renderUnitConverter(c, AREA_UNITS, "sqm", "Area"),
  },
  {
    slug: "volume-converter",
    title: "Volume Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert liters, cups, gallons, fluid ounces, ml",
    webUrl: "https://stiknex.site/volume-converter",
    render: (c) => renderUnitConverter(c, VOLUME_UNITS, "l", "Volume"),
  },
  {
    slug: "weight-converter",
    title: "Weight Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert kg, pounds, ounces, grams, tonnes",
    webUrl: "https://stiknex.site/weight-converter",
    render: (c) => renderUnitConverter(c, WEIGHT_UNITS, "kg", "Weight"),
  },
  {
    slug: "temperature-converter",
    title: "Temperature Converter",
    category: "converters",
    icon: ICONS.temp,
    desc: "Convert Celsius, Fahrenheit, and Kelvin scales",
    webUrl: "https://stiknex.site/temperature-converter",
    render: renderTemperatureConverter,
  },
  {
    slug: "speed-converter",
    title: "Speed Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert mph, km/h, knots, meters/second",
    webUrl: "https://stiknex.site/speed-converter",
    render: (c) => renderUnitConverter(c, SPEED_UNITS, "kph", "Speed"),
  },
  {
    slug: "pressure-converter",
    title: "Pressure Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert PSI, Bar, Pascals, Atmospheres",
    webUrl: "https://stiknex.site/pressure-converter",
    render: (c) => renderUnitConverter(c, PRESSURE_UNITS, "pa", "Pressure"),
  },
  {
    slug: "power-converter",
    title: "Power Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert Watts, Kilowatts, Horsepower, BTU",
    webUrl: "https://stiknex.site/power-converter",
    render: (c) => renderUnitConverter(c, POWER_UNITS, "w", "Power"),
  },
  {
    slug: "data-converter",
    title: "Data Converter",
    category: "converters",
    icon: ICONS.unit,
    desc: "Convert Bytes, KB, MB, GB, TB (binary & decimal)",
    webUrl: "https://stiknex.site/data-converter",
    render: (c) => renderUnitConverter(c, DATA_UNITS, "mb", "Digital Data"),
  },

  // Utilities & Generators
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    category: "utilities",
    icon: ICONS.qr,
    desc: "Offline custom high-res QR code generator",
    webUrl: "https://stiknex.site/qr-code-generator",
    render: renderQRCodeGenerator,
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    category: "utilities",
    icon: ICONS.password,
    desc: "Cryptographic entropy password generator",
    webUrl: "https://stiknex.site/password-generator",
    render: renderPasswordGenerator,
  },
  {
    slug: "color-picker",
    title: "Color Picker",
    category: "utilities",
    icon: ICONS.color,
    desc: "HEX, RGB, HSL converter & EyeDropper screen sampler",
    webUrl: "https://stiknex.site/color-picker",
    render: renderColorPicker,
  },

  // Resources
  {
    slug: "blog",
    title: "Productivity Blog",
    category: "resources",
    icon: ICONS.blog,
    desc: "Articles on productivity, notes, and workflows",
    webUrl: "https://stiknex.site/blog",
    render: (c) => renderWebLaunchTool(c, {
      title: "Stiknex Productivity Blog",
      desc: "Explore long-form articles, tutorials, note-taking strategies, and productivity advice written for makers and thinkers.",
      webUrl: "https://stiknex.site/blog",
      btnText: "Explore Articles on Stiknex",
    }),
  },
  {
    slug: "buy-me-a-coffee",
    title: "Support Stiknex",
    category: "resources",
    icon: ICONS.support,
    desc: "Keep free productivity tools running and ad-free",
    webUrl: "https://stiknex.site/buy-me-a-coffee",
    render: (c) => renderWebLaunchTool(c, {
      title: "Fuel Stiknex Development",
      desc: "Stiknex is 100% free and independent. Your support pays for server infrastructure, domain maintenance, and helps us build new tools without ads.",
      webUrl: "https://stiknex.site/buy-me-a-coffee",
      btnText: "Support Developer via Razorpay",
    }),
  },
];

// ============================================================================
// Initialization & Lifecycle
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
  await loadPreferences();
  setupEventListeners();
  renderCatalog();

  // Check if a tool was requested via background (e.g. from context menu)
  const { stiknex_active_tool } = await chrome.storage.local.get(STORAGE_KEYS.ACTIVE_TOOL);
  if (stiknex_active_tool) {
    const match = TOOLS.find((t) => t.slug === stiknex_active_tool);
    if (match) {
      await openTool(match, false);
      await chrome.storage.local.remove(STORAGE_KEYS.ACTIVE_TOOL);
    }
  }
});

// Load user preferences from chrome.storage.local
async function loadPreferences() {
  const data = await chrome.storage.local.get([
    STORAGE_KEYS.PINNED,
    STORAGE_KEYS.RECENT,
    STORAGE_KEYS.THEME,
  ]);

  pinnedTools = data[STORAGE_KEYS.PINNED] || [
    "word-counter",
    "simple-calculator",
    "sticky-notes",
    "quick-notepad",
    "qr-code-generator",
  ];
  recentTools = data[STORAGE_KEYS.RECENT] || [];
  currentTheme = data[STORAGE_KEYS.THEME] || "system";

  applyTheme(currentTheme);
}

// ============================================================================
// Event Listeners & Global Handlers
// ============================================================================
function setupEventListeners() {
  // Theme toggle
  document.getElementById("btnToggleTheme").addEventListener("click", async () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    currentTheme = nextTheme;
    applyTheme(nextTheme);
    await chrome.storage.local.set({ [STORAGE_KEYS.THEME]: nextTheme });
  });

  // Open full web site
  document.getElementById("btnOpenWeb").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://stiknex.site" });
  });

  document.getElementById("headerLogo").addEventListener("click", () => {
    if (activeToolSlug) {
      closeTool();
    } else {
      chrome.tabs.create({ url: "https://stiknex.site" });
    }
  });

  // Side panel launcher
  document.getElementById("btnOpenSidePanel").addEventListener("click", async () => {
    try {
      await chrome.runtime.sendMessage({ action: "open_side_panel" });
      window.close(); // Close popup once side panel opens
    } catch {
      // Fallback
    }
  });

  // Category filter pills
  document.getElementById("categoryPills").addEventListener("click", (e) => {
    const btn = e.target.closest(".pill-btn");
    if (!btn) return;

    document.querySelectorAll(".pill-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderCatalog();
  });

  // Search input filter
  const searchInput = document.getElementById("toolSearchInput");
  const clearBtn = document.getElementById("btnClearSearch");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    clearBtn.classList.toggle("hidden", query.length === 0);
    renderCatalog(query);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.classList.add("hidden");
    searchInput.focus();
    renderCatalog("");
  });

  // Keyboard shortcut: Press '/' to focus search
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === "Escape") {
      if (activeToolSlug) {
        closeTool();
      } else if (searchInput.value) {
        searchInput.value = "";
        clearBtn.classList.add("hidden");
        renderCatalog("");
      }
    }
  });

  // Back button from tool detail
  document.getElementById("btnBackToCatalog").addEventListener("click", closeTool);

  // Pin toggle in tool view
  document.getElementById("btnTogglePin").addEventListener("click", async () => {
    if (!activeToolSlug) return;
    const isPinned = pinnedTools.includes(activeToolSlug);
    if (isPinned) {
      pinnedTools = pinnedTools.filter((s) => s !== activeToolSlug);
    } else {
      pinnedTools = [activeToolSlug, ...pinnedTools];
    }
    await chrome.storage.local.set({ [STORAGE_KEYS.PINNED]: pinnedTools });
    updatePinIcons(activeToolSlug);
  });

  // Launch on web button
  document.getElementById("btnLaunchOnWeb").addEventListener("click", () => {
    const tool = TOOLS.find((t) => t.slug === activeToolSlug);
    if (tool && tool.webUrl) {
      chrome.tabs.create({ url: tool.webUrl });
    }
  });
}

// Theme handling
function applyTheme(theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  document.getElementById("themeIconSun").classList.toggle("hidden", isDark);
  document.getElementById("themeIconMoon").classList.toggle("hidden", !isDark);
}

// ============================================================================
// Catalog View & Search Rendering
// ============================================================================
function renderCatalog(filterQuery = "") {
  const listEl = document.getElementById("toolsList");
  const emptyEl = document.getElementById("searchEmptyState");
  listEl.innerHTML = "";

  const query = filterQuery.toLowerCase().trim();

  let filtered = TOOLS.filter((tool) => {
    // 1. Category check
    if (currentCategory === "pinned") {
      if (!pinnedTools.includes(tool.slug)) return false;
    } else if (currentCategory !== "all") {
      if (tool.category !== currentCategory) return false;
    }

    // 2. Query check
    if (query) {
      const matchTitle = tool.title.toLowerCase().includes(query);
      const matchDesc = tool.desc.toLowerCase().includes(query);
      const matchSlug = tool.slug.toLowerCase().includes(query);
      return matchTitle || matchDesc || matchSlug;
    }

    return true;
  });

  // If in "all" category without search query, sort pinned tools to the top
  if (currentCategory === "all" && !query) {
    filtered = [...filtered].sort((a, b) => {
      const aPinned = pinnedTools.includes(a.slug);
      const bPinned = pinnedTools.includes(b.slug);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }

  if (filtered.length === 0) {
    emptyEl.classList.remove("hidden");
    return;
  }

  emptyEl.classList.add("hidden");

  filtered.forEach((tool) => {
    const isPinned = pinnedTools.includes(tool.slug);

    const card = document.createElement("div");
    card.className = "tool-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <div class="tool-card-icon">${tool.icon}</div>
      <div class="tool-card-info">
        <div class="tool-card-title-row">
          <span class="tool-card-title">${escapeHtml(tool.title)}</span>
          <span class="tool-card-category">${escapeHtml(tool.category)}</span>
        </div>
        <p class="tool-card-desc">${escapeHtml(tool.desc)}</p>
      </div>
      <button class="tool-card-pin-btn ${isPinned ? "pinned" : ""}" title="${isPinned ? "Unpin tool" : "Pin tool"}">
        ${
          isPinned
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
            : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        }
      </button>
    `;

    // Click card to open tool
    card.addEventListener("click", (e) => {
      if (e.target.closest(".tool-card-pin-btn")) return;
      openTool(tool);
    });

    // Enter / Space to open tool
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openTool(tool);
      }
    });

    // Pin toggle button
    const pinBtn = card.querySelector(".tool-card-pin-btn");
    pinBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (pinnedTools.includes(tool.slug)) {
        pinnedTools = pinnedTools.filter((s) => s !== tool.slug);
      } else {
        pinnedTools = [tool.slug, ...pinnedTools];
      }
      await chrome.storage.local.set({ [STORAGE_KEYS.PINNED]: pinnedTools });
      renderCatalog(document.getElementById("toolSearchInput").value);
    });

    listEl.appendChild(card);
  });
}

// ============================================================================
// Tool Open / Close Navigation
// ============================================================================
async function openTool(tool, updateRecent = true) {
  activeToolSlug = tool.slug;

  if (updateRecent) {
    recentTools = [tool.slug, ...recentTools.filter((s) => s !== tool.slug)].slice(0, 10);
    await chrome.storage.local.set({ [STORAGE_KEYS.RECENT]: recentTools });
  }

  // Update detail view header
  document.getElementById("activeToolTitle").textContent = tool.title;
  document.getElementById("activeToolCategory").textContent = tool.category;
  updatePinIcons(tool.slug);

  // Switch view visibility
  document.getElementById("catalogView").classList.remove("active");
  document.getElementById("catalogView").classList.add("hidden");

  const detailView = document.getElementById("toolDetailView");
  detailView.classList.remove("hidden");
  detailView.classList.add("active");

  // Render tool runtime body
  const container = document.getElementById("toolBodyContainer");
  container.innerHTML = "";
  if (typeof tool.render === "function") {
    tool.render(container);
  }
}

function closeTool() {
  activeToolSlug = null;

  document.getElementById("toolDetailView").classList.remove("active");
  document.getElementById("toolDetailView").classList.add("hidden");

  document.getElementById("catalogView").classList.remove("hidden");
  document.getElementById("catalogView").classList.add("active");

  document.getElementById("toolBodyContainer").innerHTML = "";
  renderCatalog(document.getElementById("toolSearchInput").value);
}

function updatePinIcons(slug) {
  const isPinned = pinnedTools.includes(slug);
  document.getElementById("starEmpty").classList.toggle("hidden", isPinned);
  document.getElementById("starFilled").classList.toggle("hidden", !isPinned);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

// ============================================================================
// TOOL RENDERERS (19 Native In-Extension Interactive Tools)
// ============================================================================

// 1. Sticky Notes (Quick Capture Scratchpad)
async function renderStickyNotes(container) {
  const { stiknex_extension_notes = [] } = await chrome.storage.local.get(STORAGE_KEYS.NOTES);

  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Create Quick Note</label>
      <textarea id="noteInput" class="form-textarea" placeholder="Type quick thought, task, or snippet..."></textarea>
      
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <div style="display:flex; gap:6px;">
          ${["yellow", "green", "peach", "pink", "blue", "purple"]
            .map(
              (c) =>
                `<button class="color-dot quick-note-${c}" data-color="${c}" style="width:18px; height:18px; border-radius:50%; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>`
            )
            .join("")}
        </div>
        <button id="btnAddNote" class="btn-primary" style="padding:6px 12px; font-size:12px;">Add Note</button>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
      <span class="form-label">Saved Notes (${stiknex_extension_notes.length})</span>
      <a href="https://stiknex.site/sticky-notes" target="_blank" class="btn-secondary" style="font-size:11px; padding:4px 8px;">Open Full Canvas ↗</a>
    </div>

    <div id="notesList" style="display:flex; flex-direction:column; gap:8px; max-height:240px; overflow-y:auto; padding-right:2px; margin-top:4px;">
      ${
        stiknex_extension_notes.length === 0
          ? `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:18px 0;">No quick notes yet. Add one above!</p>`
          : stiknex_extension_notes
              .map(
                (n) => `
          <div class="quick-note-item quick-note-${n.color || "yellow"}" data-id="${n.id}">
            <div class="quick-note-text">${escapeHtml(n.des)}</div>
            <div class="quick-note-actions">
              <button class="btn-copy-note" data-text="${encodeURIComponent(n.des)}" style="background:transparent; border:none; cursor:pointer; font-size:11px; font-weight:600; opacity:0.75;" title="Copy note">Copy</button>
              <button class="btn-del-note" data-id="${n.id}" style="background:transparent; border:none; cursor:pointer; font-size:11px; color:var(--danger); font-weight:600;" title="Delete note">Delete</button>
            </div>
          </div>
        `
              )
              .join("")
      }
    </div>
  `;

  let selectedColor = "yellow";
  container.querySelectorAll(".color-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      container.querySelectorAll(".color-dot").forEach((d) => (d.style.outline = "none"));
      dot.style.outline = "2px solid var(--primary)";
      selectedColor = dot.dataset.color;
    });
  });

  const noteInput = container.querySelector("#noteInput");
  const btnAdd = container.querySelector("#btnAddNote");

  btnAdd.addEventListener("click", async () => {
    const text = noteInput.value.trim();
    if (!text) return;

    const newNote = {
      id: "note_" + Date.now(),
      des: text,
      color: selectedColor,
      createdAt: Date.now(),
    };

    const updated = [newNote, ...stiknex_extension_notes];
    await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: updated });
    renderStickyNotes(container);
  });

  container.querySelectorAll(".btn-del-note").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const updated = stiknex_extension_notes.filter((n) => n.id !== id);
      await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: updated });
      renderStickyNotes(container);
    });
  });

  container.querySelectorAll(".btn-copy-note").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = decodeURIComponent(btn.dataset.text);
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  });
}

// 2. Quick Notepad
async function renderQuickNotepad(container) {
  const { stiknex_notepad_content = "" } = await chrome.storage.local.get(STORAGE_KEYS.NOTEPAD);

  container.innerHTML = `
    <div class="form-group">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <label class="form-label">Auto-saving Notepad</label>
        <span id="notepadStats" style="font-size:11px; color:var(--text-muted);">0 words • 0 chars</span>
      </div>
      <textarea id="notepadArea" class="form-textarea" style="min-height:220px; font-size:13px; font-family:inherit;" placeholder="Start writing your thoughts, codes, or meeting notes..."></textarea>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; gap:6px;">
        <button id="btnCopyNotepad" class="btn-secondary" style="font-size:11px; padding:5px 9px;">Copy All</button>
        <button id="btnClearNotepad" class="btn-secondary" style="font-size:11px; padding:5px 9px; color:var(--danger);">Clear</button>
      </div>
      <a href="https://stiknex.site/online-notebook" target="_blank" class="btn-secondary" style="font-size:11px; padding:5px 9px;">Open Full Notebook ↗</a>
    </div>
  `;

  const textarea = container.querySelector("#notepadArea");
  const statsEl = container.querySelector("#notepadStats");
  textarea.value = stiknex_notepad_content;

  const updateStats = (val) => {
    const trimmed = val.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = val.length;
    statsEl.textContent = `${words} word${words !== 1 ? "s" : ""} • ${chars} char${chars !== 1 ? "s" : ""}`;
  };

  updateStats(stiknex_notepad_content);

  let saveTimer;
  textarea.addEventListener("input", () => {
    updateStats(textarea.value);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      await chrome.storage.local.set({ [STORAGE_KEYS.NOTEPAD]: textarea.value });
    }, 300);
  });

  container.querySelector("#btnCopyNotepad").addEventListener("click", async () => {
    if (!textarea.value) return;
    await navigator.clipboard.writeText(textarea.value);
    const btn = container.querySelector("#btnCopyNotepad");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy All"), 1500);
  });

  container.querySelector("#btnClearNotepad").addEventListener("click", async () => {
    if (confirm("Clear notepad content?")) {
      textarea.value = "";
      updateStats("");
      await chrome.storage.local.set({ [STORAGE_KEYS.NOTEPAD]: "" });
    }
  });
}

// 3. Word Counter
async function renderWordCounter(container) {
  const { stiknex_pending_text = "" } = await chrome.storage.local.get(STORAGE_KEYS.PENDING_TEXT);
  if (stiknex_pending_text) {
    await chrome.storage.local.remove(STORAGE_KEYS.PENDING_TEXT);
  }

  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Type or Paste Text</label>
      <textarea id="wcInput" class="form-textarea" style="min-height:120px;" placeholder="Paste essay, draft, or article..."></textarea>
    </div>

    <div class="metrics-grid">
      <div class="metric-card"><div id="mWords" class="metric-value">0</div><div class="metric-label">Words</div></div>
      <div class="metric-card"><div id="mChars" class="metric-value">0</div><div class="metric-label">Characters</div></div>
      <div class="metric-card"><div id="mCharsNoSpace" class="metric-value">0</div><div class="metric-label">No Spaces</div></div>
      <div class="metric-card"><div id="mSentences" class="metric-value">0</div><div class="metric-label">Sentences</div></div>
      <div class="metric-card"><div id="mReading" class="metric-value" style="font-size:15px;">0 sec</div><div class="metric-label">Reading Time (200 wpm)</div></div>
      <div class="metric-card"><div id="mSpeaking" class="metric-value" style="font-size:15px;">0 sec</div><div class="metric-label">Speaking Time (130 wpm)</div></div>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
      <button id="btnUpper" class="btn-secondary" style="font-size:11px; padding:4px 8px;">UPPERCASE</button>
      <button id="btnLower" class="btn-secondary" style="font-size:11px; padding:4px 8px;">lowercase</button>
      <button id="btnTitle" class="btn-secondary" style="font-size:11px; padding:4px 8px;">Title Case</button>
      <div class="flex-1"></div>
      <button id="btnCopyText" class="btn-secondary" style="font-size:11px; padding:4px 8px;">Copy</button>
      <button id="btnClearText" class="btn-secondary" style="font-size:11px; padding:4px 8px; color:var(--danger);">Clear</button>
    </div>
  `;

  const input = container.querySelector("#wcInput");
  if (stiknex_pending_text) input.value = stiknex_pending_text;

  const update = () => {
    const text = input.value;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s+|$)/g) || []).length || (trimmed ? 1 : 0) : 0;

    const readSec = Math.round((words / 200) * 60);
    const readStr = words === 0 ? "0 sec" : readSec < 60 ? `${readSec}s` : `${Math.ceil(words / 200)}m`;

    const speakSec = Math.round((words / 130) * 60);
    const speakStr = words === 0 ? "0 sec" : speakSec < 60 ? `${speakSec}s` : `${Math.ceil(words / 130)}m`;

    container.querySelector("#mWords").textContent = words;
    container.querySelector("#mChars").textContent = chars;
    container.querySelector("#mCharsNoSpace").textContent = charsNoSpace;
    container.querySelector("#mSentences").textContent = sentences;
    container.querySelector("#mReading").textContent = readStr;
    container.querySelector("#mSpeaking").textContent = speakStr;
  };

  input.addEventListener("input", update);
  update();

  container.querySelector("#btnUpper").addEventListener("click", () => {
    input.value = input.value.toUpperCase();
    update();
  });
  container.querySelector("#btnLower").addEventListener("click", () => {
    input.value = input.value.toLowerCase();
    update();
  });
  container.querySelector("#btnTitle").addEventListener("click", () => {
    input.value = input.value
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    update();
  });
  container.querySelector("#btnCopyText").addEventListener("click", async () => {
    if (!input.value) return;
    await navigator.clipboard.writeText(input.value);
    const btn = container.querySelector("#btnCopyText");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
  container.querySelector("#btnClearText").addEventListener("click", () => {
    input.value = "";
    update();
  });
}

// 4. Character Counter with Platform Limits
function renderCharacterCounter(container) {
  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Type or Paste Snippet</label>
      <textarea id="ccInput" class="form-textarea" style="min-height:100px;" placeholder="Check Twitter/X, SMS, or SEO snippet boundaries..."></textarea>
    </div>

    <div class="metrics-grid" style="grid-template-columns: repeat(2, 1fr);">
      <div class="metric-card"><div id="ccTotal" class="metric-value">0</div><div class="metric-label">Total Characters</div></div>
      <div class="metric-card"><div id="ccNoSpace" class="metric-value">0</div><div class="metric-label">Excluding Spaces</div></div>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
      <div class="metric-card" style="text-align:left; padding:8px 12px;">
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600;">
          <span>Twitter / X (280 max)</span>
          <span id="pXLimit">0 / 280</span>
        </div>
        <div style="width:100%; height:6px; background:var(--bg-subtle); border-radius:3px; overflow:hidden; margin-top:4px;">
          <div id="barX" style="width:0%; height:100%; background:var(--primary); transition:width 150ms;"></div>
        </div>
      </div>

      <div class="metric-card" style="text-align:left; padding:8px 12px;">
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600;">
          <span>Single SMS Segment (160 max)</span>
          <span id="pSmsLimit">0 / 160</span>
        </div>
        <div style="width:100%; height:6px; background:var(--bg-subtle); border-radius:3px; overflow:hidden; margin-top:4px;">
          <div id="barSms" style="width:0%; height:100%; background:var(--success); transition:width 150ms;"></div>
        </div>
      </div>

      <div class="metric-card" style="text-align:left; padding:8px 12px;">
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600;">
          <span>SEO Meta Description (~155 chars)</span>
          <span id="pSeoLimit">0 / 155</span>
        </div>
        <div style="width:100%; height:6px; background:var(--bg-subtle); border-radius:3px; overflow:hidden; margin-top:4px;">
          <div id="barSeo" style="width:0%; height:100%; background:var(--warning); transition:width 150ms;"></div>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector("#ccInput");
  const update = () => {
    const val = input.value;
    const count = val.length;
    const noSpace = val.replace(/\s/g, "").length;

    container.querySelector("#ccTotal").textContent = count;
    container.querySelector("#ccNoSpace").textContent = noSpace;

    // Twitter
    container.querySelector("#pXLimit").textContent = `${count} / 280`;
    const xPct = Math.min(100, (count / 280) * 100);
    const barX = container.querySelector("#barX");
    barX.style.width = `${xPct}%`;
    barX.style.backgroundColor = count > 280 ? "var(--danger)" : "var(--primary)";

    // SMS
    container.querySelector("#pSmsLimit").textContent = `${count} / 160`;
    const smsPct = Math.min(100, (count / 160) * 100);
    const barSms = container.querySelector("#barSms");
    barSms.style.width = `${smsPct}%`;
    barSms.style.backgroundColor = count > 160 ? "var(--danger)" : "var(--success)";

    // SEO
    container.querySelector("#pSeoLimit").textContent = `${count} / 155`;
    const seoPct = Math.min(100, (count / 155) * 100);
    const barSeo = container.querySelector("#barSeo");
    barSeo.style.width = `${seoPct}%`;
    barSeo.style.backgroundColor = count > 160 ? "var(--danger)" : "var(--warning)";
  };

  input.addEventListener("input", update);
}

// 5. Reading Time Calculator
function renderReadingTime(container) {
  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Speech Script or Article Draft</label>
      <textarea id="rtInput" class="form-textarea" style="min-height:120px;" placeholder="Paste your text to estimate duration..."></textarea>
    </div>

    <div class="form-group">
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <label class="form-label">Reading Speed (Words / Minute)</label>
        <span id="wpmVal" style="font-weight:700; color:var(--primary);">200 WPM</span>
      </div>
      <input type="range" id="wpmRange" min="100" max="350" value="200" step="10">
    </div>

    <div class="metrics-grid">
      <div class="metric-card"><div id="rtWords" class="metric-value">0</div><div class="metric-label">Total Words</div></div>
      <div class="metric-card"><div id="rtMinutes" class="metric-value">0 min</div><div class="metric-label">Estimated Reading Time</div></div>
      <div class="metric-card"><div id="rtSeconds" class="metric-value">0 sec</div><div class="metric-label">Precise Reading Seconds</div></div>
      <div class="metric-card"><div id="rtSpeech" class="metric-value">0 min</div><div class="metric-label">Speech Delivery Time (130 WPM)</div></div>
    </div>
  `;

  const input = container.querySelector("#rtInput");
  const wpmRange = container.querySelector("#wpmRange");
  const wpmVal = container.querySelector("#wpmVal");

  const update = () => {
    const text = input.value.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const wpm = Number(wpmRange.value);
    wpmVal.textContent = `${wpm} WPM`;

    const totalSeconds = Math.round((words / wpm) * 60);
    const totalMinutes = Math.ceil(words / wpm);

    const speechMinutes = Math.ceil(words / 130);

    container.querySelector("#rtWords").textContent = words;
    container.querySelector("#rtMinutes").textContent = words === 0 ? "0 min" : `${totalMinutes} min`;
    container.querySelector("#rtSeconds").textContent = words === 0 ? "0 sec" : `${totalSeconds}s`;
    container.querySelector("#rtSpeech").textContent = words === 0 ? "0 min" : `${speechMinutes} min`;
  };

  input.addEventListener("input", update);
  wpmRange.addEventListener("input", update);
}

// 6. Simple Calculator (Safe Zero-Eval Parser)
function renderSimpleCalculator(container) {
  container.innerHTML = `
    <div class="calc-display">
      <div id="calcExpr" class="calc-expr"></div>
      <div id="calcResult" class="calc-result">0</div>
    </div>

    <div class="calc-grid" style="margin-top:10px;">
      <button class="calc-btn op" data-key="C">C</button>
      <button class="calc-btn op" data-key="%">%</button>
      <button class="calc-btn op" data-key="DEL">⌫</button>
      <button class="calc-btn op" data-key="/">÷</button>

      <button class="calc-btn" data-key="7">7</button>
      <button class="calc-btn" data-key="8">8</button>
      <button class="calc-btn" data-key="9">9</button>
      <button class="calc-btn op" data-key="*">×</button>

      <button class="calc-btn" data-key="4">4</button>
      <button class="calc-btn" data-key="5">5</button>
      <button class="calc-btn" data-key="6">6</button>
      <button class="calc-btn op" data-key="-">−</button>

      <button class="calc-btn" data-key="1">1</button>
      <button class="calc-btn" data-key="2">2</button>
      <button class="calc-btn" data-key="3">3</button>
      <button class="calc-btn op" data-key="+">+</button>

      <button class="calc-btn" data-key="0" style="grid-column: span 2;">0</button>
      <button class="calc-btn" data-key=".">.</button>
      <button class="calc-btn equal" data-key="=">=</button>
    </div>
  `;

  let expr = "";
  const exprEl = container.querySelector("#calcExpr");
  const resultEl = container.querySelector("#calcResult");

  const updateDisplay = () => {
    exprEl.textContent = expr;
    if (expr) {
      const res = evaluateExpression(expr);
      resultEl.textContent = res === "" ? "0" : res;
    } else {
      resultEl.textContent = "0";
    }
  };

  const press = (key) => {
    if (key === "C") {
      expr = "";
    } else if (key === "DEL") {
      expr = expr.slice(0, -1);
    } else if (key === "=") {
      const res = evaluateExpression(expr);
      expr = res === "Error" || res === "" ? "" : String(res);
    } else {
      expr += key;
    }
    updateDisplay();
  };

  container.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => press(btn.dataset.key));
  });

  const onKey = (e) => {
    if (!activeToolSlug || activeToolSlug !== "simple-calculator") return;
    const map = { "*": "*", "/": "/", "-": "-", "+": "+", Enter: "=", "=": "=", Backspace: "DEL", Escape: "C" };
    if (/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
      press(e.key);
    } else if (map[e.key]) {
      e.preventDefault();
      press(map[e.key]);
    }
  };

  window.addEventListener("keydown", onKey);
}

// 7. Scientific Calculator
function renderScientificCalculator(container) {
  container.innerHTML = `
    <div class="calc-display">
      <div id="sciExpr" class="calc-expr"></div>
      <div id="sciResult" class="calc-result">0</div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0 4px;">
      <span class="form-label">Scientific Mode</span>
      <button id="btnRadDeg" class="btn-secondary" style="font-size:10px; padding:3px 7px;">DEG</button>
    </div>

    <div class="calc-grid" style="grid-template-columns: repeat(5, 1fr); gap:5px;">
      <button class="calc-btn op" data-fn="sin">sin</button>
      <button class="calc-btn op" data-fn="cos">cos</button>
      <button class="calc-btn op" data-fn="tan">tan</button>
      <button class="calc-btn op" data-fn="log">log</button>
      <button class="calc-btn op" data-fn="ln">ln</button>

      <button class="calc-btn op" data-fn="sqrt">√</button>
      <button class="calc-btn op" data-key="^">xʸ</button>
      <button class="calc-btn op" data-fn="pi">π</button>
      <button class="calc-btn op" data-key="(">(</button>
      <button class="calc-btn op" data-key=")">)</button>

      <button class="calc-btn" data-key="7">7</button>
      <button class="calc-btn" data-key="8">8</button>
      <button class="calc-btn" data-key="9">9</button>
      <button class="calc-btn op" data-key="/">÷</button>
      <button class="calc-btn op" data-key="DEL">⌫</button>

      <button class="calc-btn" data-key="4">4</button>
      <button class="calc-btn" data-key="5">5</button>
      <button class="calc-btn" data-key="6">6</button>
      <button class="calc-btn op" data-key="*">×</button>
      <button class="calc-btn op" data-key="C">C</button>

      <button class="calc-btn" data-key="1">1</button>
      <button class="calc-btn" data-key="2">2</button>
      <button class="calc-btn" data-key="3">3</button>
      <button class="calc-btn op" data-key="-">−</button>
      <button class="calc-btn op" data-key="!">%</button>

      <button class="calc-btn" data-key="0" style="grid-column: span 2;">0</button>
      <button class="calc-btn" data-key=".">.</button>
      <button class="calc-btn op" data-key="+">+</button>
      <button class="calc-btn equal" data-key="=">=</button>
    </div>
  `;

  let expr = "";
  let isRadian = false;
  const exprEl = container.querySelector("#sciExpr");
  const resultEl = container.querySelector("#sciResult");
  const radBtn = container.querySelector("#btnRadDeg");

  radBtn.addEventListener("click", () => {
    isRadian = !isRadian;
    radBtn.textContent = isRadian ? "RAD" : "DEG";
    updateDisplay();
  });

  const updateDisplay = () => {
    exprEl.textContent = expr;
    if (expr) {
      const res = evaluateExpression(expr, isRadian);
      resultEl.textContent = res === "" ? "0" : res;
    } else {
      resultEl.textContent = "0";
    }
  };

  const press = (key) => {
    if (key === "C") expr = "";
    else if (key === "DEL") expr = expr.slice(0, -1);
    else if (key === "=") {
      const res = evaluateExpression(expr, isRadian);
      expr = res === "Error" || res === "" ? "" : String(res);
    } else {
      expr += key;
    }
    updateDisplay();
  };

  container.querySelectorAll(".calc-btn[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => press(btn.dataset.key));
  });

  container.querySelectorAll(".calc-btn[data-fn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = btn.dataset.fn;
      if (fn === "pi") expr += "pi";
      else expr += `${fn}(`;
      updateDisplay();
    });
  });
}

// 8. Date Calculator (Age & Difference)
function renderDateCalculator(container) {
  container.innerHTML = `
    <div style="display:flex; gap:6px; margin-bottom:10px;">
      <button id="tabAge" class="pill-btn active flex-1">Age Milestone</button>
      <button id="tabBetween" class="pill-btn flex-1">Days Between</button>
    </div>

    <div id="ageView">
      <div class="form-group">
        <label class="form-label">Date of Birth</label>
        <input type="date" id="dobInput" class="form-input">
      </div>
      <div id="ageResult" class="metrics-grid" style="margin-top:10px;">
        <div class="metric-card"><div id="ageYears" class="metric-value">-</div><div class="metric-label">Years</div></div>
        <div class="metric-card"><div id="ageMonths" class="metric-value">-</div><div class="metric-label">Months</div></div>
        <div class="metric-card"><div id="ageDays" class="metric-value">-</div><div class="metric-label">Days</div></div>
        <div class="metric-card"><div id="ageTotalDays" class="metric-value">-</div><div class="metric-label">Total Days Lived</div></div>
      </div>
    </div>

    <div id="betweenView" class="hidden">
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" id="dateStart" class="form-input">
      </div>
      <div class="form-group">
        <label class="form-label">End Date</label>
        <input type="date" id="dateEnd" class="form-input">
      </div>
      <div id="betweenResult" class="metrics-grid" style="margin-top:10px;">
        <div class="metric-card"><div id="bTotalDays" class="metric-value">-</div><div class="metric-label">Days</div></div>
        <div class="metric-card"><div id="bWeeks" class="metric-value">-</div><div class="metric-label">Weeks</div></div>
      </div>
    </div>
  `;

  const tabAge = container.querySelector("#tabAge");
  const tabBetween = container.querySelector("#tabBetween");
  const ageView = container.querySelector("#ageView");
  const betweenView = container.querySelector("#betweenView");

  tabAge.addEventListener("click", () => {
    tabAge.classList.add("active");
    tabBetween.classList.remove("active");
    ageView.classList.remove("hidden");
    betweenView.classList.add("hidden");
  });

  tabBetween.addEventListener("click", () => {
    tabBetween.classList.add("active");
    tabAge.classList.remove("active");
    betweenView.classList.remove("hidden");
    ageView.classList.add("hidden");
  });

  const dobInput = container.querySelector("#dobInput");
  dobInput.addEventListener("change", () => {
    if (!dobInput.value) return;
    const birth = new Date(dobInput.value);
    const today = new Date();
    if (birth > today) return;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = today - birth;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    container.querySelector("#ageYears").textContent = years;
    container.querySelector("#ageMonths").textContent = months;
    container.querySelector("#ageDays").textContent = days;
    container.querySelector("#ageTotalDays").textContent = totalDays.toLocaleString();
  });

  const dStart = container.querySelector("#dateStart");
  const dEnd = container.querySelector("#dateEnd");
  const calcBetween = () => {
    if (!dStart.value || !dEnd.value) return;
    const s = new Date(dStart.value);
    const e = new Date(dEnd.value);
    const diffDays = Math.abs(Math.round((e - s) / (1000 * 60 * 60 * 24)));
    const weeks = Math.floor(diffDays / 7);
    const remDays = diffDays % 7;

    container.querySelector("#bTotalDays").textContent = diffDays.toLocaleString();
    container.querySelector("#bWeeks").textContent = `${weeks}w ${remDays}d`;
  };

  dStart.addEventListener("change", calcBetween);
  dEnd.addEventListener("change", calcBetween);
}

// 9. Currency Converter (Live Rates + Offline Fallback)
function renderCurrencyConverter(container) {
  const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CNY", "SGD", "CHF"];
  const FALLBACK_RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    INR: 87.0,
    JPY: 151.0,
    AUD: 1.52,
    CAD: 1.36,
    CNY: 7.24,
    SGD: 1.34,
    CHF: 0.88,
  };

  container.innerHTML = `
    <div style="display:flex; gap:8px;">
      <div class="form-group flex-1">
        <label class="form-label">Amount</label>
        <input type="number" id="curAmount" class="form-input" value="1" min="0">
      </div>
      <div class="form-group" style="width:110px;">
        <label class="form-label">Base Currency</label>
        <select id="curBase" class="form-select">
          ${CURRENCIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0 4px;">
      <span id="curStatus" style="font-size:10.5px; color:var(--text-muted);">Fetching live exchange rates…</span>
      <button id="btnCurRefresh" class="btn-secondary" style="font-size:10.5px; padding:3px 7px;">Refresh Rates</button>
    </div>

    <div id="curGrid" class="unit-output-grid"></div>
  `;

  let currentRates = { ...FALLBACK_RATES };
  const amountEl = container.querySelector("#curAmount");
  const baseEl = container.querySelector("#curBase");
  const statusEl = container.querySelector("#curStatus");
  const gridEl = container.querySelector("#curGrid");

  const updateGrid = () => {
    const val = parseFloat(amountEl.value) || 0;
    const base = baseEl.value;
    gridEl.innerHTML = "";

    CURRENCIES.forEach((c) => {
      const rate = currentRates[c] || 1;
      const converted = (val * rate).toFixed(2);
      const card = document.createElement("div");
      card.className = "unit-output-card";
      card.innerHTML = `
        <div class="unit-output-val">${converted}</div>
        <div class="unit-output-label">${c}</div>
      `;
      gridEl.appendChild(card);
    });
  };

  const fetchRates = async () => {
    const base = baseEl.value;
    statusEl.textContent = "Updating rates…";
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      currentRates = { ...data.rates, [base]: 1 };
      statusEl.textContent = "Live exchange rates active.";
    } catch {
      // Offline fallback
      const usdRate = FALLBACK_RATES[base] || 1;
      const converted = {};
      CURRENCIES.forEach((c) => {
        converted[c] = FALLBACK_RATES[c] / usdRate;
      });
      currentRates = converted;
      statusEl.textContent = "Cached offline rates.";
    }
    updateGrid();
  };

  amountEl.addEventListener("input", updateGrid);
  baseEl.addEventListener("change", fetchRates);
  container.querySelector("#btnCurRefresh").addEventListener("click", fetchRates);

  fetchRates();
}

// 10. General Unit Converter (Length, Area, Volume, Weight, Speed, Pressure, Power, Data)
function renderUnitConverter(container, units, defaultUnit, categoryName) {
  container.innerHTML = `
    <div style="display:flex; gap:8px;">
      <div class="form-group flex-1">
        <label class="form-label">Value</label>
        <input type="number" id="unitVal" class="form-input" value="1">
      </div>
      <div class="form-group flex-1">
        <label class="form-label">From Unit</label>
        <select id="unitSelect" class="form-select">
          ${units.map((u) => `<option value="${u.id}" ${u.id === defaultUnit ? "selected" : ""}>${u.label}</option>`).join("")}
        </select>
      </div>
    </div>

    <div style="margin:8px 0 4px; font-size:11px; font-weight:600; color:var(--text-muted);">${categoryName} Conversions</div>
    <div id="unitGrid" class="unit-output-grid"></div>
  `;

  const valEl = container.querySelector("#unitVal");
  const selectEl = container.querySelector("#unitSelect");
  const gridEl = container.querySelector("#unitGrid");

  const update = () => {
    const val = parseFloat(valEl.value);
    const valid = !isNaN(val);
    const currentUnit = units.find((u) => u.id === selectEl.value) || units[0];
    const baseValue = valid ? val * currentUnit.factor : 0;

    gridEl.innerHTML = "";
    units.forEach((u) => {
      const converted = valid ? baseValue / u.factor : 0;
      const formatted = Number(converted.toPrecision(7)).toString();

      const card = document.createElement("div");
      card.className = "unit-output-card";
      card.innerHTML = `
        <div class="unit-output-val">${formatted}</div>
        <div class="unit-output-label">${u.label}</div>
      `;
      gridEl.appendChild(card);
    });
  };

  valEl.addEventListener("input", update);
  selectEl.addEventListener("change", update);
  update();
}

// 11. Temperature Converter
function renderTemperatureConverter(container) {
  container.innerHTML = `
    <div style="display:flex; gap:8px;">
      <div class="form-group flex-1">
        <label class="form-label">Temperature Degrees</label>
        <input type="number" id="tempVal" class="form-input" value="20">
      </div>
      <div class="form-group flex-1">
        <label class="form-label">Scale</label>
        <select id="tempScale" class="form-select">
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        </select>
      </div>
    </div>

    <div class="metrics-grid" style="margin-top:10px;">
      <div class="metric-card"><div id="tC" class="metric-value">20°C</div><div class="metric-label">Celsius</div></div>
      <div class="metric-card"><div id="tF" class="metric-value">68°F</div><div class="metric-label">Fahrenheit</div></div>
      <div class="metric-card" style="grid-column: span 2;"><div id="tK" class="metric-value">293.15 K</div><div class="metric-label">Kelvin</div></div>
    </div>

    <div style="margin-top:8px; font-size:11px; color:var(--text-muted); display:flex; gap:6px; flex-wrap:wrap;">
      <button class="pill-btn" data-c="0">Water Freezing (0°C)</button>
      <button class="pill-btn" data-c="20">Room Temp (20°C)</button>
      <button class="pill-btn" data-c="100">Water Boiling (100°C)</button>
    </div>
  `;

  const valEl = container.querySelector("#tempVal");
  const scaleEl = container.querySelector("#tempScale");

  const update = () => {
    const val = parseFloat(valEl.value) || 0;
    const scale = scaleEl.value;
    let celsius = 0;

    if (scale === "C") celsius = val;
    else if (scale === "F") celsius = ((val - 32) * 5) / 9;
    else if (scale === "K") celsius = val - 273.15;

    const fahrenheit = (celsius * 9) / 5 + 32;
    const kelvin = celsius + 273.15;

    container.querySelector("#tC").textContent = `${celsius.toFixed(2)} °C`;
    container.querySelector("#tF").textContent = `${fahrenheit.toFixed(2)} °F`;
    container.querySelector("#tK").textContent = `${kelvin.toFixed(2)} K`;
  };

  valEl.addEventListener("input", update);
  scaleEl.addEventListener("change", update);

  container.querySelectorAll(".pill-btn[data-c]").forEach((btn) => {
    btn.addEventListener("click", () => {
      valEl.value = btn.dataset.c;
      scaleEl.value = "C";
      update();
    });
  });

  update();
}

// 12. Offline QR Code Generator
async function renderQRCodeGenerator(container) {
  let defaultUrl = "https://stiknex.site";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url && !tab.url.startsWith("chrome://")) {
      defaultUrl = tab.url;
    }
  } catch {
    // fallback
  }

  const { stiknex_pending_qr = "" } = await chrome.storage.local.get(STORAGE_KEYS.PENDING_QR);
  if (stiknex_pending_qr) {
    defaultUrl = stiknex_pending_qr;
    await chrome.storage.local.remove(STORAGE_KEYS.PENDING_QR);
  }

  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">URL or Text Message</label>
      <input type="text" id="qrText" class="form-input" value="${escapeHtml(defaultUrl)}">
    </div>

    <div style="display:flex; justify-content:center; align-items:center; padding:12px 0;">
      <canvas id="qrCanvas" style="border:1px solid var(--border-color); border-radius:10px; background:white; padding:8px; box-shadow:var(--shadow-md); max-width:180px; max-height:180px;"></canvas>
    </div>

    <div style="display:flex; gap:8px; justify-content:center;">
      <button id="btnDownloadQR" class="btn-primary" style="font-size:11px; padding:6px 12px;">Download PNG</button>
      <button id="btnCopyQR" class="btn-secondary" style="font-size:11px; padding:6px 12px;">Copy Image</button>
    </div>
  `;

  const input = container.querySelector("#qrText");
  const canvas = container.querySelector("#qrCanvas");

  const drawQR = async () => {
    const text = input.value.trim() || "https://stiknex.site";
    try {
      await QRCode.toCanvas(canvas, text, {
        width: 180,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error("QR Code Error:", err);
    }
  };

  input.addEventListener("input", drawQR);
  drawQR();

  container.querySelector("#btnDownloadQR").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "stiknex-qr-code.png";
    a.click();
  });

  container.querySelector("#btnCopyQR").addEventListener("click", async () => {
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        const btn = container.querySelector("#btnCopyQR");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy Image"), 1500);
      });
    } catch (e) {
      console.error(e);
    }
  });
}

// 13. Password Generator (Web Crypto)
function renderPasswordGenerator(container) {
  const CHAR_SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Generated Password</label>
      <div style="display:flex; gap:6px;">
        <input type="text" id="pwdOutput" class="form-input" readonly style="font-family:monospace; font-weight:700; letter-spacing:0.5px;">
        <button id="btnCopyPwd" class="btn-primary" style="padding:6px 10px; font-size:11px;">Copy</button>
      </div>
    </div>

    <div class="form-group" style="margin-top:4px;">
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <label class="form-label">Length</label>
        <span id="pwdLenVal" style="font-weight:700; color:var(--primary);">16 chars</span>
      </div>
      <input type="range" id="pwdLen" min="6" max="48" value="16">
    </div>

    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px; margin:4px 0;">
      <label style="display:flex; align-items:center; gap:6px; font-size:11.5px; cursor:pointer;">
        <input type="checkbox" id="chkUpper" checked> Uppercase (A-Z)
      </label>
      <label style="display:flex; align-items:center; gap:6px; font-size:11.5px; cursor:pointer;">
        <input type="checkbox" id="chkLower" checked> Lowercase (a-z)
      </label>
      <label style="display:flex; align-items:center; gap:6px; font-size:11.5px; cursor:pointer;">
        <input type="checkbox" id="chkNumbers" checked> Numbers (0-9)
      </label>
      <label style="display:flex; align-items:center; gap:6px; font-size:11.5px; cursor:pointer;">
        <input type="checkbox" id="chkSymbols" checked> Symbols (!@#$)
      </label>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
      <span id="pwdStrength" class="pill-btn" style="cursor:default;">Strength: Strong</span>
      <button id="btnRegenPwd" class="btn-secondary" style="font-size:11px; padding:5px 9px;">↻ Generate New</button>
    </div>
  `;

  const outputEl = container.querySelector("#pwdOutput");
  const lenEl = container.querySelector("#pwdLen");
  const lenVal = container.querySelector("#pwdLenVal");
  const strengthEl = container.querySelector("#pwdStrength");

  const generate = () => {
    const len = Number(lenEl.value);
    lenVal.textContent = `${len} chars`;

    let pool = "";
    if (container.querySelector("#chkUpper").checked) pool += CHAR_SETS.upper;
    if (container.querySelector("#chkLower").checked) pool += CHAR_SETS.lower;
    if (container.querySelector("#chkNumbers").checked) pool += CHAR_SETS.numbers;
    if (container.querySelector("#chkSymbols").checked) pool += CHAR_SETS.symbols;

    if (!pool) {
      outputEl.value = "Select at least 1 option";
      return;
    }

    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += pool[arr[i] % pool.length];
    }
    outputEl.value = pwd;

    // Strength indicator
    if (len < 10) {
      strengthEl.textContent = "Strength: Weak";
      strengthEl.style.color = "var(--danger)";
    } else if (len < 16) {
      strengthEl.textContent = "Strength: Good";
      strengthEl.style.color = "var(--warning)";
    } else {
      strengthEl.textContent = "Strength: Very Strong";
      strengthEl.style.color = "var(--success)";
    }
  };

  lenEl.addEventListener("input", generate);
  container.querySelectorAll("input[type=checkbox]").forEach((chk) => chk.addEventListener("change", generate));
  container.querySelector("#btnRegenPwd").addEventListener("click", generate);

  container.querySelector("#btnCopyPwd").addEventListener("click", async () => {
    await navigator.clipboard.writeText(outputEl.value);
    const btn = container.querySelector("#btnCopyPwd");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });

  generate();
}

// 14. Color Picker & Screen EyeDropper
function renderColorPicker(container) {
  const hasEyeDropper = typeof window.EyeDropper === "function";

  container.innerHTML = `
    <div style="display:flex; gap:12px; align-items:center;">
      <input type="color" id="cpInput" value="#4f46e5" style="width:60px; height:50px; border:none; border-radius:8px; cursor:pointer; background:none;">
      <div class="flex-1">
        <label class="form-label">Pick & Inspect Color</label>
        ${
          hasEyeDropper
            ? `<button id="btnEyeDropper" class="btn-secondary" style="font-size:11px; padding:5px 9px; width:100%; margin-top:3px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><path d="M14 2l4 4L7 17H3v-4L14 2z"/><line x1="12" y1="4" x2="16" y2="8"/></svg>
                Pick Color from Browser Screen
              </button>`
            : `<span style="font-size:10px; color:var(--text-muted);">EyeDropper screen pick available in modern Chromium</span>`
        }
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:6px; margin-top:10px;">
      <div class="metric-card" style="display:flex; justify-content:space-between; align-items:center; padding:7px 10px;">
        <span class="form-label" style="margin:0;">HEX</span>
        <span id="hexVal" style="font-family:monospace; font-weight:700;">#4f46e5</span>
        <button class="btn-copy-color" data-target="#hexVal" style="font-size:10.5px; padding:2px 6px;">Copy</button>
      </div>

      <div class="metric-card" style="display:flex; justify-content:space-between; align-items:center; padding:7px 10px;">
        <span class="form-label" style="margin:0;">RGB</span>
        <span id="rgbVal" style="font-family:monospace; font-weight:700;">rgb(79, 70, 229)</span>
        <button class="btn-copy-color" data-target="#rgbVal" style="font-size:10.5px; padding:2px 6px;">Copy</button>
      </div>

      <div class="metric-card" style="display:flex; justify-content:space-between; align-items:center; padding:7px 10px;">
        <span class="form-label" style="margin:0;">HSL</span>
        <span id="hslVal" style="font-family:monospace; font-weight:700;">hsl(244, 76%, 60%)</span>
        <button class="btn-copy-color" data-target="#hslVal" style="font-size:10.5px; padding:2px 6px;">Copy</button>
      </div>
    </div>
  `;

  const colorInput = container.querySelector("#cpInput");
  const hexVal = container.querySelector("#hexVal");
  const rgbVal = container.querySelector("#rgbVal");
  const hslVal = container.querySelector("#hslVal");

  const update = (hex) => {
    colorInput.value = hex;
    hexVal.textContent = hex;

    // Hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    rgbVal.textContent = `rgb(${r}, ${g}, ${b})`;

    // RGB to HSL
    const rN = r / 255,
      gN = g / 255,
      bN = b / 255;
    const max = Math.max(rN, gN, bN),
      min = Math.min(rN, gN, bN);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rN) h = (gN - bN) / d + (gN < bN ? 6 : 0);
      else if (max === gN) h = (bN - rN) / d + 2;
      else h = (rN - gN) / d + 4;
      h /= 6;
    }
    hslVal.textContent = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  colorInput.addEventListener("input", (e) => update(e.target.value));

  if (hasEyeDropper) {
    container.querySelector("#btnEyeDropper").addEventListener("click", async () => {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          update(result.sRGBHex);
        }
      } catch {
        // user canceled or not supported
      }
    });
  }

  container.querySelectorAll(".btn-copy-color").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = container.querySelector(btn.dataset.target).textContent;
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  });

  update("#4f46e5");
}

// 15. Web Launch Card (Whiteboard, Blog, Buy Me a Coffee)
function renderWebLaunchTool(container, { title, desc, webUrl, btnText }) {
  container.innerHTML = `
    <div style="background-color:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:18px 16px; text-align:center; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:10px;">
      <h3 style="font-size:15px; font-weight:700; color:var(--text-main);">${escapeHtml(title)}</h3>
      <p style="font-size:12px; color:var(--text-muted); line-height:1.5;">${escapeHtml(desc)}</p>
      
      <div style="padding-top:6px;">
        <button id="btnLaunchFull" class="btn-primary" style="width:100%; padding:10px 16px; font-size:13px;">
          ${escapeHtml(btnText || "Launch on stiknex.site")} ↗
        </button>
      </div>
    </div>
  `;

  container.querySelector("#btnLaunchFull").addEventListener("click", () => {
    chrome.tabs.create({ url: webUrl });
  });
}

