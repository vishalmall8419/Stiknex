# Stiknex Chrome Extension (Manifest V3)

> **Official browser companion for Stiknex — Free Sticky Notes, Online Notebook & Productivity Platform (https://stiknex.site)**

---

## 🚀 Overview

The **Stiknex Chrome Extension** provides instant, lightweight access to 24 productivity tools directly from Google Chrome. Unlike basic bookmarks or iframe wrappers, it features **19 native client-side tools** running offline inside the extension popup and Chrome Side Panel, plus smart launchers for Stiknex's full canvas workspaces (Sticky Notes, Rich-Text Notebook, and Excalidraw Whiteboard).

---

## ✨ Features & Capabilities

### 1. 🧰 Native Offline Tools (19 Tools)
- **Writing & Content Tools**:
  - **Word Counter**: Real-time analysis of words, characters (with/without spaces), sentences, paragraphs, reading and speaking times.
  - **Character Counter**: Social media limit trackers for Twitter/X (280), LinkedIn (3,000), and SMS (160).
  - **Reading Time Calculator**: Reading duration (200 WPM) and speaking presentation duration (130 WPM).
  - **Quick Notepad**: Distraction-free scratchpad with auto-save to `chrome.storage.local`, word counter, copy to clipboard, and one-click transfer to Stiknex web.

- **Math & Calculators**:
  - **Simple Calculator**: Full keyboard-accessible arithmetic with safe zero-`eval` parsing.
  - **Scientific Calculator**: Safe recursive-descent parser supporting trig functions (`sin`, `cos`, `tan`), logs (`log`, `ln`), powers (`^`, `**`), square roots, factorials (`!`), and DEG/RAD toggle.
  - **Date & Age Calculator**: Exact age breakdown (years, months, days) and duration difference between two calendar dates.

- **Unit & Data Converters**:
  - **Length**: mm, cm, meters, kilometers, inches, feet, yards, miles.
  - **Area**: m², km², ft², yd², acres, hectares.
  - **Volume**: ml, liters, m³, teaspoons, tablespoons, cups, US gallons.
  - **Weight / Mass**: mg, grams, kg, metric tons, ounces, pounds.
  - **Temperature**: Celsius, Fahrenheit, Kelvin (bidirectional conversion).
  - **Speed**: m/s, km/h, mph, knots, ft/s.
  - **Pressure**: Pascals, kPa, Bar, Atmospheres, PSI, mmHg.
  - **Power**: Watts, kW, MW, Horsepower, BTU/h.
  - **Data Storage**: Bytes, KB, MB, GB, TB, PB (1024 base).
  - **Currency Converter**: Real-time foreign exchange rates for 150+ currencies via the Frankfurter API, with built-in offline fallback rates.

- **Utilities & Design Tools**:
  - **QR Code Generator**: 100% offline, standalone QR generation with custom foreground/background colors, size selection, error correction level, and instant PNG download.
  - **Password Generator**: Cryptographically secure entropy generator (`crypto.getRandomValues`) with custom character sets (uppercase, lowercase, numbers, symbols), length slider, and entropy strength bar.
  - **Color Picker & EyeDropper**: Native color spectrum input, one-click EyeDropper API (pick any pixel from any webpage), with instant HEX, RGB, and HSL formatting.

### 2. 🖥️ Workspace Launchers (4 Workspaces)
- **Sticky Notes**: Quick-capture note modal inside the popup, with direct deep-link to the full infinite draggable canvas on https://stiknex.site/sticky-notes.
- **Online Notebook**: Scratchpad sync with deep-link to Stiknex's full rich-text editor on https://stiknex.site/online-notebook.
- **Digital Whiteboard**: One-click launcher for Stiknex's Excalidraw-powered infinite drawing board on https://stiknex.site/whiteboard.
- **Productivity Blog**: Instant search and guide launcher on https://stiknex.site/blog.

### 3. 📑 Chrome Side Panel Integration
- Open Stiknex as a persistent side panel alongside any webpage.
- Resize horizontally from 300px to wide-screen with responsive grid layouts.
- Click the **Side Panel** button in the header or use the Chrome side panel menu.

### 4. 🖱️ Context Menu Shortcuts
Select any text on any webpage and right-click to:
- **Save to Stiknex Sticky Note**: Instantly stores the snippet and page URL into local extension storage.
- **Count Words with Stiknex**: Displays word count badge directly over the extension icon without opening a popup.
- **Generate QR Code for Selection / Link**: Creates an instant QR code for URLs or text.

### 5. 🔍 Omnibox Integration
Type `stik` in the Chrome address bar, press `Space` or `Tab`, and search any tool by name (e.g. `stik calc` or `stik qr`) to jump directly to it.

### 6. ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+S` (Windows/Linux) or `Command+Shift+S` (macOS): Opens the Stiknex extension popup from anywhere.

---

## 🔒 Security & Manifest V3 CSP Compliance

- **Zero-Eval Architecture**: Completely eliminates `eval()` and `new Function()` by using a custom recursive-descent mathematical parser (`extension/utils/mathParser.js`).
- **Offline First**: All utilities, converters, calculators, and the QR generator bundle run entirely offline with zero third-party script dependencies.
- **No Remote Code Execution**: All JavaScript is strictly bundled within the extension package, satisfying Chrome Web Store single-purpose and security policies.

---

## 📦 File Structure

```
extension/
├── manifest.json              # Manifest V3 specification
├── background.js              # Service Worker (Context menus, Omnibox, SidePanel bridge)
├── assets/
│   ├── logo.png               # Stiknex brand logo
│   └── icons/
│       ├── icon-16.png        # 16x16 toolbar icon
│       ├── icon-32.png        # 32x32 Windows taskbar / retina icon
│       ├── icon-48.png        # 48x48 extensions management icon
│       └── icon-128.png       # 128x128 Chrome Web Store & install icon
├── popup/
│   ├── popup.html             # Main popup interface & tool containers
│   ├── popup.css              # Responsive dark/light theme stylesheet
│   └── popup.js               # Tool catalog, search, favorites, & 19 native tool engines
├── sidepanel/
│   ├── sidepanel.html         # Responsive side panel entry point
│   └── sidepanel.css          # Viewport-adaptive side panel overrides
└── utils/
    ├── mathParser.js          # Zero-eval safe recursive-descent math parser
    ├── qrcode.bundle.js       # Standalone offline QR code ES module generator
    └── unitData.js            # Precise conversion factors & unit maps
```

---

## 🛠️ How to Test & Install (Developer Mode)

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the address bar.
3. Toggle on **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. In the file picker, select the `extension` folder inside this repository:
   ```
   c:\Users\LENOVO\coding\vs code\test\Stiknex\extension
   ```
6. The **Stiknex** extension will appear in your installed extensions list.
7. Click the **Extensions** (puzzle piece) icon in Chrome's top toolbar, find **Stiknex**, and click the pin icon to keep it visible.

---

## 🛡️ Chrome Web Store Permissions Justification

When submitting to the Chrome Web Store Developer Dashboard, use the following justifications:

| Permission | Purpose / Justification |
| :--- | :--- |
| `storage` | Saves user preferences locally, including dark/light theme, pinned favorite tools, quick notepad drafts, and snippets saved from context menus. No user data is sent to external servers. |
| `sidePanel` | Allows the extension to open in Chrome's native Side Panel as a full-height workspace companion while researching or writing. |
| `contextMenus` | Adds convenience right-click menu items ("Save to Stiknex Note", "Count Words", "Generate QR") when text or links are selected on a webpage. |
| `activeTab` | Enables temporary access to the active tab's selected text and URL only when the user explicitly triggers a Stiknex context menu action. |

---

## 📄 License & Ownership
Copyright © 2026 Stiknex (https://stiknex.site). Built by Vishal Mall.
All rights reserved.

