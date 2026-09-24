<div align="center">
  <img src="./public/Stiknex.png" alt="Stiknex Logo" width="120" />
  
  # Stiknex v2.0.0

  **Your All-In-One Offline-First Digital Workspace**  
  *Sticky Notes, Markdown Notebook, Excalidraw Whiteboards, and 10+ Productivity Tools.*
</div>

---

## 🚀 Overview

**Stiknex** is a fast, free, and privacy-focused productivity application designed to keep all your daily workflows in one unified space. Originally starting as a simple sticky-note app, Stiknex v2.0.0 has evolved into a robust offline-first workspace entirely contained within your browser.

No forced sign-ups. No cloud data harvesting. Everything you write, draw, or calculate is securely saved to your local machine using modern browser APIs (`localStorage` and `IndexedDB`).

🌐 **Live Demo:** [https://stiknex.vercel.app](https://stiknex.vercel.app)

---

## ✨ Key Features

### 📝 1. Interactive Sticky Notes (`/notes`)
- A fluid, drag-and-drop grid for tracking tasks and quick thoughts.
- Custom color-coding.
- Persistent local storage ensures you never lose a thought upon refresh.

### 📓 2. Distraction-Free Notebook (`/notebook`)
- A rich text/markdown editor tailored for long-form writing and coding.
- Specialized **Virtual Keyboard** for quickly entering Math (`∑`, `√`, `π`), Code (`{}`, `()`, `<>`), and formatting symbols.
- Built-in autosave.
- Reading mode and full-screen compatibility.

### 🎨 3. Collaborative Whiteboard (`/whiteboard`)
- Powered by the robust **Excalidraw** engine.
- Sketch diagrams, create mind-maps, and wireframe UIs seamlessly.
- Export as PNG, SVG, or share a live session link.

### 🛠️ 4. 10+ Productivity Tools (`/tools`)
- **Calculators:** Simple, Scientific, and Date/Time.
- **Converters:** Data (Bytes/Hex), Currency, Length, Area, Volume, Weight, Temperature, Speed, Power, Pressure.
- **Utilities:** QR Code Generator, Password Generator, and an advanced **Color Picker** (with native EyeDropper API support to pick colors from anywhere on your screen).
- Built with zero-scroll smart modals ensuring a perfect fit on mobile and desktop.

### 🌗 5. Beautiful UI & Theming
- Implemented with **React**, **Tailwind CSS v4**, **Framer Motion**, and **Lenis** smooth scrolling.
- Full Light/Dark mode support seamlessly synced with your OS preferences.
- Highly optimized, responsive layout that scales down gracefully to 320px mobile screens.

---

## 🏗️ Tech Stack

- **Frontend Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS v4, CSS Modules
- **Animations:** Framer Motion, GSAP
- **Routing:** React Router v6
- **Data Persistence:** `localStorage`, IndexedDB
- **Drawing Engine:** Excalidraw integration
- **Icons:** FontAwesome 7
- **Payment (Support):** Razorpay Server-side integration

---

## ⚙️ Installation & Development

To run Stiknex locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/stiknex.git
   cd stiknex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the required variables (for Razorpay support functionality):
   ```env
   VITE_API_BASE_URL=your_backend_api_url
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔒 Privacy & Security

**Privacy by Design:** Stiknex stores user-generated data (Notes, Notebooks, Whiteboards) entirely inside the user's browser via `localStorage` and `IndexedDB`. No personal workspace data is transmitted to or stored on our servers. 

**Secure Payments:** The "Buy Me a Coffee" functionality uses Razorpay. To ensure maximum security, order creation and signature verification are handled securely on a backend server, completely shielding secret keys from the frontend client.

---

## 📈 SEO & Performance (v2.0.0 Updates)
- Fully detailed `sitemap.xml` and `robots.txt` mapped out.
- Implemented extensive JSON-LD Structured Data for Rich Results.
- Optimized OpenGraph and Twitter Metadata for seamless link-sharing on social media.
- PWA-ready `manifest.json` correctly mapped to application icons.

---

## 👨‍💻 Created By
**Vishal Mall** — Frontend Developer, Starchain Lab  
Always learning, always building. 🚀

*If you found this project helpful, consider supporting me on the [Buy Me a Coffee](/buy-me-a-coffee) page!*