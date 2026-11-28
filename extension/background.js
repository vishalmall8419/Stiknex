/**
 * Stiknex Chrome Extension — Service Worker (Manifest V3)
 * Handles context menus, omnibox suggestions, side panel triggers, and background badge feedback.
 */

const DEFAULT_PINNED = [
  "word-counter",
  "simple-calculator",
  "sticky-notes",
  "quick-notepad",
  "qr-code-generator",
  "currency-converter",
];

const TOOLS_CATALOG = [
  { slug: "word-counter", title: "Word Counter", desc: "Live word, char, reading time analyzer" },
  { slug: "character-counter", title: "Character Counter", desc: "Character counting with limit badges" },
  { slug: "reading-time-calculator", title: "Reading Time Calculator", desc: "Speaking and reading estimates" },
  { slug: "simple-calculator", title: "Simple Calculator", desc: "Fast keyboard-supported arithmetic" },
  { slug: "scientific-calculator", title: "Scientific Calculator", desc: "Trig, log, powers and roots" },
  { slug: "date-calculator", title: "Date Calculator", desc: "Age and date difference calculator" },
  { slug: "currency-converter", title: "Currency Converter", desc: "Live forex rates for 150+ currencies" },
  { slug: "length-converter", title: "Length Converter", desc: "Convert mm, cm, meters, feet, inches" },
  { slug: "area-converter", title: "Area Converter", desc: "Convert sqm, sqft, acres, hectares" },
  { slug: "volume-converter", title: "Volume Converter", desc: "Convert liters, cups, gallons, ml" },
  { slug: "weight-converter", title: "Weight Converter", desc: "Convert kg, lbs, oz, grams, stone" },
  { slug: "temperature-converter", title: "Temperature Converter", desc: "Convert Celsius, Fahrenheit, Kelvin" },
  { slug: "speed-converter", title: "Speed Converter", desc: "Convert mph, km/h, knots, m/s" },
  { slug: "pressure-converter", title: "Pressure Converter", desc: "Convert PSI, Bar, Pascals, atm" },
  { slug: "power-converter", title: "Power Converter", desc: "Convert Watts, Kilowatts, Horsepower" },
  { slug: "data-converter", title: "Data Converter", desc: "Convert Bytes, KB, MB, GB, TB" },
  { slug: "qr-code-generator", title: "QR Code Generator", desc: "Custom offline high-res QR codes" },
  { slug: "password-generator", title: "Password Generator", desc: "Cryptographic entropy password generator" },
  { slug: "color-picker", title: "Color Picker", desc: "HEX, RGB, HSL converter & EyeDropper" },
  { slug: "sticky-notes", title: "Sticky Notes Canvas", desc: "Freeform draggable notes board" },
  { slug: "online-notebook", title: "Online Notebook", desc: "Distraction-free rich text editor" },
  { slug: "whiteboard", title: "Digital Whiteboard", desc: "Excalidraw sketch and diagram canvas" },
  { slug: "blog", title: "Productivity Blog", desc: "Tips, tutorials, and guides" },
];

// Initialize storage & context menus on install
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get([
    "stiknex_pinned",
    "stiknex_recent",
    "stiknex_extension_notes",
    "stiknex_notepad_content",
    "stiknex_theme",
  ]);

  if (!data.stiknex_pinned) {
    await chrome.storage.local.set({ stiknex_pinned: DEFAULT_PINNED });
  }
  if (!data.stiknex_recent) {
    await chrome.storage.local.set({ stiknex_recent: [] });
  }
  if (!data.stiknex_extension_notes) {
    await chrome.storage.local.set({ stiknex_extension_notes: [] });
  }
  if (!data.stiknex_notepad_content) {
    await chrome.storage.local.set({ stiknex_notepad_content: "" });
  }
  if (!data.stiknex_theme) {
    await chrome.storage.local.set({ stiknex_theme: "system" });
  }

  // Remove existing context menus first to prevent duplicate ID errors
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "stiknex_save_note",
      title: "Save to Stiknex Sticky Note",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "stiknex_count_words",
      title: "Count Words with Stiknex",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "stiknex_qr_code",
      title: "Generate QR Code for Selection",
      contexts: ["selection", "link"],
    });

    chrome.contextMenus.create({
      id: "stiknex_separator",
      type: "separator",
      contexts: ["all"],
    });

    chrome.contextMenus.create({
      id: "stiknex_open_site",
      title: "Open Stiknex Website",
      contexts: ["all"],
    });
  });
});

// Context Menu Actions
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "stiknex_save_note") {
    const text = (info.selectionText || "").trim();
    if (!text) return;

    const { stiknex_extension_notes = [] } = await chrome.storage.local.get("stiknex_extension_notes");
    const newNote = {
      id: "note_" + Date.now(),
      title: text.slice(0, 32) + (text.length > 32 ? "…" : ""),
      des: text,
      color: "yellow",
      sourceUrl: tab?.url || "",
      createdAt: Date.now(),
    };

    await chrome.storage.local.set({
      stiknex_extension_notes: [newNote, ...stiknex_extension_notes],
    });

    await flashBadge("Saved", "#4f46e5");
  } else if (info.menuItemId === "stiknex_count_words") {
    const text = (info.selectionText || "").trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;

    await flashBadge(`${words}w`, "#10b981", 3000);
    // Also save into pending text so opening popup shows the word counter immediately
    await chrome.storage.local.set({
      stiknex_active_tool: "word-counter",
      stiknex_pending_text: text,
    });
  } else if (info.menuItemId === "stiknex_qr_code") {
    const target = (info.linkUrl || info.selectionText || "").trim();
    if (target) {
      await chrome.storage.local.set({
        stiknex_active_tool: "qr-code-generator",
        stiknex_pending_qr: target,
      });
      await flashBadge("QR Ready", "#0284c7");
    }
  } else if (info.menuItemId === "stiknex_open_site") {
    await chrome.tabs.create({ url: "https://stiknex.site" });
  }
});

// Helper for flashing badge feedback
async function flashBadge(text, color, duration = 2000) {
  try {
    await chrome.action.setBadgeText({ text });
    await chrome.action.setBadgeBackgroundColor({ color });
    setTimeout(async () => {
      try {
        await chrome.action.setBadgeText({ text: "" });
      } catch {
        // service worker may be inactive
      }
    }, duration);
  } catch {
    // ignore
  }
}

// Omnibox "stik <query>" search support
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const query = text.toLowerCase().trim();
  const matches = TOOLS_CATALOG.filter(
    (t) => t.title.toLowerCase().includes(query) || t.slug.includes(query) || t.desc.toLowerCase().includes(query)
  );

  const suggestions = matches.slice(0, 5).map((t) => ({
    content: `https://stiknex.site/${t.slug}`,
    description: `<match>${escapeXml(t.title)}</match> — <dim>${escapeXml(t.desc)}</dim>`,
  }));

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  let targetUrl = text;
  if (!text.startsWith("http://") && !text.startsWith("https://")) {
    const match = TOOLS_CATALOG.find((t) => t.slug === text || t.title.toLowerCase() === text.toLowerCase());
    targetUrl = match ? `https://stiknex.site/${match.slug}` : `https://stiknex.site/tools`;
  }
  await chrome.tabs.create({ url: targetUrl });
});

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
  });
}

// Handle runtime messages (e.g. side panel opening from popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel") {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.windowId) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No active window found." });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Keep message channel open for async response
  }
});

