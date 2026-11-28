import { useState, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppShell from "../../Component/Layout/AppShell";
import { useAppContext } from "../../context/AppContext";
import PageSEO from "../../Component/SEO/PageSEO";
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Download,
  Upload,
  Edit3,
  MoreVertical,
  LayoutGrid,
  List,
  Sparkles,
  Clock,
  Layers,
  ArrowUpRight,
  Check,
  X,
  Shapes,
  ShieldCheck,
  ChevronDown,
  Workflow,
  Smartphone,
  GitFork,
  PenTool,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

const WhiteboardEditor = lazy(() => import("./WhiteboardEditor"));

const WhiteboardLoadingSkeleton = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] dark:bg-[#0B0F17]">
    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-2xl">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 border-4 border-teal-200 dark:border-teal-900/60 border-t-[#134E5E] rounded-full animate-spin"></div>
        <PenTool className="w-5 h-5 text-[#134E5E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center">
        <p className="text-base font-extrabold text-[#0F3944] dark:text-slate-100">Launching Excalidraw Engine</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Initializing private vector canvas...</p>
      </div>
    </div>
  </div>
);

// Renders an accurate SVG preview of the elements on the canvas
const SvgPreview = ({ elements, appState, files }) => {
  const containerRef = useRef(null);
  const safeElements = useMemo(() => {
    return Array.isArray(elements) ? elements.filter((el) => el && el.type && !el.isDeleted) : [];
  }, [elements]);

  useEffect(() => {
    let isMounted = true;
    if (safeElements.length === 0) return;

    const generatePreview = async () => {
      try {
        const { exportToSvg } = await import("@excalidraw/excalidraw");
        const svg = await exportToSvg({
          elements: safeElements,
          appState:
            typeof appState === "object" && appState !== null
              ? { ...appState, exportBackground: false }
              : { exportBackground: false },
          files: typeof files === "object" && files !== null ? files : {},
        });
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = "";
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          containerRef.current.appendChild(svg);
        }
      } catch {
        // Fallback silently if preview generation fails
      }
    };
    generatePreview();
    return () => {
      isMounted = false;
    };
  }, [safeElements, appState, files]);

  if (safeElements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 py-6 pointer-events-none select-none">
        <Shapes className="w-10 h-10 stroke-1 mb-2 opacity-50 text-[#134E5E]" />
        <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">Blank Canvas</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full p-3 opacity-90 dark:opacity-85 pointer-events-none flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
    />
  );
};

// Formats last updated time relative to current time
function formatLastUpdated(timestamp) {
  if (!timestamp) return "Just now";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// Starter template generator
function createTemplateElements(type) {
  const seed = () => Math.floor(Math.random() * 100000);
  if (type === "flowchart") {
    return [
      {
        id: "start_node",
        type: "ellipse",
        x: 200,
        y: 100,
        width: 140,
        height: 60,
        strokeColor: "#134E5E",
        backgroundColor: "#E6F4F1",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "start_text",
        type: "text",
        x: 235,
        y: 118,
        width: 70,
        height: 24,
        fontSize: 16,
        fontFamily: 1,
        text: "Start Flow",
        baseline: 18,
        textAlign: "center",
        verticalAlign: "middle",
        strokeColor: "#0F3944",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "arrow_1",
        type: "arrow",
        x: 270,
        y: 160,
        width: 0,
        height: 80,
        points: [[0, 0], [0, 80]],
        strokeColor: "#134E5E",
        strokeWidth: 2,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "decision_node",
        type: "diamond",
        x: 195,
        y: 240,
        width: 150,
        height: 90,
        strokeColor: "#059669",
        backgroundColor: "#D1FAE5",
        fillStyle: "solid",
        strokeWidth: 2,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "decision_text",
        type: "text",
        x: 220,
        y: 273,
        width: 100,
        height: 24,
        fontSize: 15,
        fontFamily: 1,
        text: "Validate Data?",
        baseline: 18,
        textAlign: "center",
        verticalAlign: "middle",
        strokeColor: "#064E3B",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "arrow_2",
        type: "arrow",
        x: 270,
        y: 330,
        width: 0,
        height: 80,
        points: [[0, 0], [0, 80]],
        strokeColor: "#059669",
        strokeWidth: 2,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "process_node",
        type: "rectangle",
        x: 180,
        y: 410,
        width: 180,
        height: 70,
        strokeColor: "#D97706",
        backgroundColor: "#FEF3C7",
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "process_text",
        type: "text",
        x: 215,
        y: 433,
        width: 110,
        height: 24,
        fontSize: 16,
        fontFamily: 1,
        text: "Execute Action",
        baseline: 18,
        textAlign: "center",
        verticalAlign: "middle",
        strokeColor: "#78350F",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
    ];
  }
  if (type === "wireframe") {
    return [
      {
        id: "wf_browser",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 500,
        height: 320,
        strokeColor: "#64748B",
        backgroundColor: "#F8FAFC",
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "wf_nav",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 500,
        height: 48,
        strokeColor: "#64748B",
        backgroundColor: "#E2E8F0",
        fillStyle: "solid",
        strokeWidth: 2,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "wf_nav_title",
        type: "text",
        x: 120,
        y: 114,
        width: 100,
        height: 20,
        fontSize: 16,
        fontFamily: 1,
        text: "Stiknex UI",
        baseline: 16,
        strokeColor: "#1E293B",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "wf_hero_card",
        type: "rectangle",
        x: 140,
        y: 180,
        width: 420,
        height: 180,
        strokeColor: "#134E5E",
        backgroundColor: "#E6F4F1",
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "wf_hero_text",
        type: "text",
        x: 210,
        y: 255,
        width: 280,
        height: 24,
        fontSize: 18,
        fontFamily: 1,
        text: "Product Hero Section",
        baseline: 18,
        strokeColor: "#0F3944",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
    ];
  }
  if (type === "mindmap") {
    return [
      {
        id: "mm_center",
        type: "ellipse",
        x: 260,
        y: 200,
        width: 160,
        height: 80,
        strokeColor: "#134E5E",
        backgroundColor: "#E6F4F1",
        fillStyle: "solid",
        strokeWidth: 2,
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "mm_center_text",
        type: "text",
        x: 295,
        y: 228,
        width: 90,
        height: 24,
        fontSize: 16,
        fontFamily: 1,
        text: "Core Concept",
        baseline: 18,
        strokeColor: "#0F3944",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "mm_sub1",
        type: "rectangle",
        x: 70,
        y: 130,
        width: 130,
        height: 50,
        strokeColor: "#0284C7",
        backgroundColor: "#E0F2FE",
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "mm_sub1_text",
        type: "text",
        x: 95,
        y: 145,
        width: 80,
        height: 20,
        fontSize: 14,
        fontFamily: 1,
        text: "Ideas & Goals",
        baseline: 15,
        strokeColor: "#0369A1",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "mm_sub2",
        type: "rectangle",
        x: 480,
        y: 130,
        width: 130,
        height: 50,
        strokeColor: "#16A34A",
        backgroundColor: "#DCFCE7",
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
      {
        id: "mm_sub2_text",
        type: "text",
        x: 505,
        y: 145,
        width: 80,
        height: 20,
        fontSize: 14,
        fontFamily: 1,
        text: "Architecture",
        baseline: 15,
        strokeColor: "#15803D",
        backgroundColor: "transparent",
        seed: seed(),
        version: 1,
        versionNonce: 1,
        isDeleted: false,
      },
    ];
  }
  return [];
}

const WhiteboardDashboard = () => {
  const { whiteboards, addWhiteboard, deleteWhiteboard, updateWhiteboard, darkMode } = useAppContext();
  const [searchParams] = useSearchParams();
  const [activeWhiteboardId, setActiveWhiteboardId] = useState(() => searchParams.get("id") || null);

  // Search & Filter & View state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState("");
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const fileInputRef = useRef(null);

  // Preload editor bundle on idle or hover
  const preloadEditor = () => {
    import("./WhiteboardEditor");
  };

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) setActiveWhiteboardId(idFromUrl);
  }, [searchParams]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-menu-container]")) {
        setOpenMenuId(null);
      }
      if (!e.target.closest("[data-template-menu]")) {
        setTemplateMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreateNew = (templateType = "blank", customTitle = null) => {
    const elements = createTemplateElements(templateType);
    const nextNum =
      whiteboards.reduce((max, wb) => {
        if (!wb.title) return max;
        const match = wb.title.match(/^Whiteboard (\d+)$/i);
        return match ? Math.max(max, parseInt(match[1])) : max;
      }, 0) + 1;

    const titles = {
      blank: customTitle || `Whiteboard ${nextNum}`,
      flowchart: `Flowchart ${nextNum}`,
      wireframe: `Wireframe ${nextNum}`,
      mindmap: `Mind Map ${nextNum}`,
    };

    const newWb = {
      id: `wb_${Date.now()}`,
      title: titles[templateType] || `Whiteboard ${nextNum}`,
      elements,
      appState: {},
      files: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addWhiteboard(newWb);
    setActiveWhiteboardId(newWb.id);
    setTemplateMenuOpen(false);
  };

  const handleDuplicate = (wb, e) => {
    e?.stopPropagation?.();
    setOpenMenuId(null);
    const duplicateWb = {
      id: `wb_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${wb.title || "Drawing"} (Copy)`,
      elements: Array.isArray(wb.elements) ? JSON.parse(JSON.stringify(wb.elements)) : [],
      appState: wb.appState ? JSON.parse(JSON.stringify(wb.appState)) : {},
      files: wb.files ? JSON.parse(JSON.stringify(wb.files)) : {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addWhiteboard(duplicateWb);
  };

  const handleDelete = (wb, e) => {
    e?.stopPropagation?.();
    setOpenMenuId(null);
    deleteWhiteboard(wb.id);
  };

  const startRename = (wb, e) => {
    e?.stopPropagation?.();
    setOpenMenuId(null);
    setEditingTitleId(wb.id);
    setEditingTitleText(wb.title || "Untitled Drawing");
  };

  const saveRename = (wb, e) => {
    e?.stopPropagation?.();
    if (editingTitleText.trim() && editingTitleText !== wb.title) {
      updateWhiteboard(wb.id, {
        title: editingTitleText.trim(),
        updatedAt: Date.now(),
      });
    }
    setEditingTitleId(null);
  };

  const handleExportJson = (wb, e) => {
    e?.stopPropagation?.();
    setOpenMenuId(null);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            type: "excalidraw",
            version: 2,
            source: "https://stiknex.com/whiteboard",
            elements: wb.elements || [],
            appState: wb.appState || {},
            files: wb.files || {},
          },
          null,
          2
        )
      );
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${(wb.title || "whiteboard").replace(/\s+/g, "_")}.excalidraw`);
    dlAnchor.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const elements = data.elements || (Array.isArray(data) ? data : []);
        const newWb = {
          id: `wb_${Date.now()}`,
          title: file.name.replace(/\.(excalidraw|json)$/i, "") || "Imported Drawing",
          elements,
          appState: data.appState || {},
          files: data.files || {},
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addWhiteboard(newWb);
        setActiveWhiteboardId(newWb.id);
      } catch {
        alert("Invalid Excalidraw or JSON file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Filtered & Sorted whiteboards
  const filteredWhiteboards = useMemo(() => {
    let list = whiteboards.filter((wb) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (wb.title || "").toLowerCase().includes(q);
    });

    list.sort((a, b) => {
      if (sortBy === "recent") return (b.updatedAt || 0) - (a.updatedAt || 0);
      if (sortBy === "oldest") return (a.updatedAt || 0) - (b.updatedAt || 0);
      if (sortBy === "name_asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "name_desc") return (b.title || "").localeCompare(a.title || "");
      if (sortBy === "elements") {
        const aCount = Array.isArray(a.elements) ? a.elements.filter((el) => el && !el.isDeleted).length : 0;
        const bCount = Array.isArray(b.elements) ? b.elements.filter((el) => el && !el.isDeleted).length : 0;
        return bCount - aCount;
      }
      return 0;
    });

    return list;
  }, [whiteboards, searchQuery, sortBy]);

  const activeWhiteboard = whiteboards.find((wb) => wb.id === activeWhiteboardId);

  if (activeWhiteboard) {
    return (
      <Suspense fallback={<WhiteboardLoadingSkeleton />}>
        <WhiteboardEditor
          whiteboard={activeWhiteboard}
          onClose={() => setActiveWhiteboardId(null)}
          onUpdate={updateWhiteboard}
        />
      </Suspense>
    );
  }

  return (
    <AppShell>
      <PageSEO
        title="Free Online Whiteboard – Infinite Sketchpad | Stiknex"
        description="Free online whiteboard powered by Excalidraw. Sketch, diagram and brainstorm on an infinite canvas with shapes, arrows and freehand drawing."
        path="/whiteboard"
        type="webapp"
        keywords="free online whiteboard, excalidraw, vector sketchpad, digital whiteboard, online drawing board, whiteboard app, free sketch tool, mindmap"
      />

      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F17] transition-colors py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ========================================================
              1. HERO SECTION: Circle by Sandhill Studio Style
              (Warm linen canvas, deep teal, NO overflow-hidden clipping!)
              ======================================================== */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 p-6 sm:p-10 mb-8 shadow-sm">
            {/* Background ambient blurs safely contained in inner layer */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#134E5E]/10 dark:bg-teal-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-[#FFA07A]/15 dark:bg-[#FFA07A]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#134E5E]/10 text-[#134E5E] dark:bg-teal-950/60 dark:text-teal-300 border border-[#134E5E]/20 dark:border-teal-800/40">
                    <Sparkles className="w-3.5 h-3.5 text-[#134E5E] dark:text-teal-400" />
                    Excalidraw Engine
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    100% Local-First &amp; Private
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {whiteboards.length} {whiteboards.length === 1 ? "Canvas" : "Canvases"}
                  </span>
                </div>

                {/* Title & Description */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F3944] dark:text-white">
                  Whiteboard Studio
                </h1>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Infinite freeform vector canvas for sketching wireframes, mind mapping, diagramming software
                  architecture, or visual brainstorming. Saved locally in your browser.
                </p>
              </div>

              {/* Action Buttons Group (NO CLIPPING) */}
              <div className="flex flex-wrap items-center gap-3 relative z-30">
                {/* Primary: New Blank Canvas */}
                <button
                  onClick={() => handleCreateNew("blank")}
                  onMouseEnter={preloadEditor}
                  onTouchStart={preloadEditor}
                  className="px-6 py-3.5 rounded-2xl bg-[#134E5E] hover:bg-[#0F3944] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Blank Canvas</span>
                </button>

                {/* Templates Dropdown: Fully visible with z-50 */}
                <div className="relative" data-template-menu>
                  <button
                    onClick={() => setTemplateMenuOpen((prev) => !prev)}
                    className="px-4 py-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 text-[#0F3944] dark:text-slate-200 hover:bg-[#F3EDE2] dark:hover:bg-slate-750 border border-[#EADFD5] dark:border-slate-700 font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                    title="Starter Templates"
                  >
                    <Workflow className="w-4 h-4 text-[#134E5E] dark:text-teal-400" />
                    <span>Templates</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${templateMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {templateMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Quick Starter Presets
                      </div>
                      <button
                        onClick={() => handleCreateNew("blank")}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#134E5E] dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <PenTool className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F3944] dark:text-white">Blank Infinite</div>
                          <div className="text-[11px] text-slate-500">Pure clean canvas from scratch</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleCreateNew("flowchart")}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Workflow className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F3944] dark:text-white">Flowchart &amp; Logic</div>
                          <div className="text-[11px] text-slate-500">Decision diamonds &amp; arrows</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleCreateNew("wireframe")}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F3944] dark:text-white">UI Wireframe</div>
                          <div className="text-[11px] text-slate-500">Browser mockup &amp; hero box</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleCreateNew("mindmap")}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F3944] dark:text-white">Mind Map</div>
                          <div className="text-[11px] text-slate-500">Core topic &amp; sub-branches</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Import File Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".excalidraw,.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#F3EDE2] dark:hover:bg-slate-750 border border-[#EADFD5] dark:border-slate-700 font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Import .excalidraw or .json file"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              2. SEARCH, SORT & VIEW CONTROLS TOOLBAR
              ======================================================== */}
          {whiteboards.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-xs">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter drawings by title..."
                  className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134E5E] focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort & View Options */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#134E5E] cursor-pointer"
                >
                  <option value="recent">Recently Updated</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Title (A-Z)</option>
                  <option value="name_desc">Title (Z-A)</option>
                  <option value="elements">Most Elements</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center p-0.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-700 text-[#134E5E] dark:text-teal-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-700 text-[#134E5E] dark:text-teal-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. CONTENT AREA: Empty State vs Cards Grid / List
              ======================================================== */}
          {whiteboards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-[#EADFD5] dark:border-slate-800 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs">
              <div className="w-16 h-16 rounded-3xl bg-[#134E5E]/10 dark:bg-teal-950/60 text-[#134E5E] dark:text-teal-300 flex items-center justify-center text-3xl shadow-sm mb-4">
                <PenTool className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h2 className="text-2xl font-extrabold text-[#0F3944] dark:text-white mb-2">No Whiteboards Yet</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                Create an infinite vector canvas to sketch user flows, take visual notes, or draft architecture diagrams.
                Everything is stored client-side in your private IndexedDB.
              </p>

              {/* Quick Templates Starter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
                <button
                  onClick={() => handleCreateNew("blank")}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700 text-left hover:border-[#134E5E] hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#134E5E] dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0F3944] dark:text-white text-sm mb-1">Blank Canvas</h3>
                  <p className="text-xs text-slate-500">Pure clean freeform canvas</p>
                </button>

                <button
                  onClick={() => handleCreateNew("flowchart")}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700 text-left hover:border-emerald-500 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0F3944] dark:text-white text-sm mb-1">Flowchart</h3>
                  <p className="text-xs text-slate-500">Ready logic &amp; decision nodes</p>
                </button>

                <button
                  onClick={() => handleCreateNew("wireframe")}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700 text-left hover:border-blue-500 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0F3944] dark:text-white text-sm mb-1">UI Wireframe</h3>
                  <p className="text-xs text-slate-500">Mockup app layouts fast</p>
                </button>

                <button
                  onClick={() => handleCreateNew("mindmap")}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700 text-left hover:border-amber-500 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <GitFork className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0F3944] dark:text-white text-sm mb-1">Mind Map</h3>
                  <p className="text-xs text-slate-500">Organize thoughts &amp; branches</p>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Have an existing drawing?</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold text-[#134E5E] dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Import .excalidraw file
                </button>
              </div>
            </div>
          ) : filteredWhiteboards.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No matching drawings found</h3>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or clear your filter.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0F3944] dark:text-slate-200 border border-[#EADFD5] dark:border-slate-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* ========================================================================= */
            /* GRID VIEW: Circle Aesthetic Cards (NO CLIPPED DROPDOWNS!) */
            /* ========================================================================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWhiteboards.map((wb) => {
                const elementCount = Array.isArray(wb.elements)
                  ? wb.elements.filter((el) => el && !el.isDeleted).length
                  : 0;
                const isMenuOpen = openMenuId === wb.id;
                const isEditingTitle = editingTitleId === wb.id;

                return (
                  <div
                    key={wb.id}
                    className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-[#EADFD5] dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#134E5E]/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col"
                    style={{ zIndex: isMenuOpen ? 40 : 1 }}
                    onMouseEnter={preloadEditor}
                    onTouchStart={preloadEditor}
                  >
                    {/* Top Bar inside Card: Metadata + Actions (Outside overflow-hidden so menu NEVER clips!) */}
                    <div className="p-3.5 pb-2.5 flex items-center justify-between gap-2 border-b border-[#EADFD5]/60 dark:border-slate-800/60">
                      {/* Element count pill */}
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#FAF7F2] dark:bg-slate-800 text-[#134E5E] dark:text-teal-300 border border-[#EADFD5] dark:border-slate-700 flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-[#134E5E] dark:text-teal-400" />
                        <span>{elementCount} {elementCount === 1 ? "item" : "items"}</span>
                      </span>

                      {/* Action buttons (Mobile-touch friendly & Desktop hover) */}
                      <div className="flex items-center gap-1.5 relative" data-menu-container>
                        {/* Direct Delete button: 1-click on mobile */}
                        <button
                          onClick={(e) => handleDelete(wb, e)}
                          className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-[#EADFD5] dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Drawing"
                          aria-label="Delete Drawing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 3-Dots dropdown menu button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : wb.id);
                            }}
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                              isMenuOpen
                                ? "bg-[#134E5E] text-white border-[#134E5E]"
                                : "bg-[#FAF7F2] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#F3EDE2] dark:hover:bg-slate-700 border-[#EADFD5] dark:border-slate-700"
                            }`}
                            title="More options"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown Menu: Placed outside canvas overflow-hidden with high z-index */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setActiveWhiteboardId(wb.id);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-[#0F3944] dark:text-slate-200 hover:bg-[#FAF7F2] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#134E5E] dark:text-teal-400" />
                                <span>Open Canvas</span>
                              </button>
                              <button
                                onClick={(e) => startRename(wb, e)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#FAF7F2] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Rename Drawing</span>
                              </button>
                              <button
                                onClick={(e) => handleDuplicate(wb, e)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#FAF7F2] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Duplicate Canvas</span>
                              </button>
                              <button
                                onClick={(e) => handleExportJson(wb, e)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#FAF7F2] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>Export .excalidraw</span>
                              </button>
                              <div className="h-px bg-[#EADFD5] dark:bg-slate-800 my-1" />
                              <button
                                onClick={(e) => handleDelete(wb, e)}
                                className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Canvas</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Canvas Preview Box (Contained inside its own rounded frame) */}
                    <div
                      onClick={() => setActiveWhiteboardId(wb.id)}
                      className="relative h-44 sm:h-48 w-full bg-[#FAF7F2]/80 dark:bg-slate-950/80 overflow-hidden border-b border-[#EADFD5]/70 dark:border-slate-800 flex items-center justify-center p-3 cursor-pointer bg-[radial-gradient(#d5c9bd_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
                    >
                      <SvgPreview elements={wb.elements} appState={wb.appState} files={wb.files} />
                    </div>

                    {/* Card Footer: Title & Open Button */}
                    <div className="p-4 flex flex-col justify-between flex-1 bg-white dark:bg-slate-900 rounded-b-3xl">
                      <div>
                        {isEditingTitle ? (
                          <div
                            className="flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingTitleText}
                              onChange={(e) => setEditingTitleText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(wb, e);
                                if (e.key === "Escape") setEditingTitleId(null);
                              }}
                              autoFocus
                              className="flex-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#134E5E] focus:outline-none text-[#0F3944] dark:text-white"
                            />
                            <button
                              onClick={(e) => saveRename(wb, e)}
                              className="p-1.5 rounded-lg bg-[#134E5E] text-white hover:bg-[#0F3944] cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTitleId(null)}
                              className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-slate-800 text-slate-500 hover:bg-[#EADFD5] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <h3
                              onClick={() => setActiveWhiteboardId(wb.id)}
                              className="font-extrabold text-sm sm:text-base text-[#0F3944] dark:text-white truncate cursor-pointer hover:text-[#134E5E] dark:hover:text-teal-400 transition-colors"
                              title={wb.title || "Untitled Drawing"}
                            >
                              {wb.title || "Untitled Drawing"}
                            </h3>
                            <button
                              onClick={(e) => startRename(wb, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#134E5E] dark:hover:text-teal-400 transition-opacity p-1 cursor-pointer shrink-0"
                              title="Rename"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>Updated {formatLastUpdated(wb.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <button
                        onClick={() => setActiveWhiteboardId(wb.id)}
                        className="mt-3.5 w-full py-2.5 px-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#134E5E] dark:bg-slate-800 dark:hover:bg-[#134E5E] text-[#0F3944] hover:text-white dark:text-slate-200 dark:hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#EADFD5] dark:border-slate-700 hover:border-transparent transition-all cursor-pointer shadow-xs"
                      >
                        <span>Open Canvas</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ========================================================================= */
            /* LIST VIEW: Compact row items */
            /* ========================================================================= */
            <div className="space-y-3">
              {filteredWhiteboards.map((wb) => {
                const elementCount = Array.isArray(wb.elements)
                  ? wb.elements.filter((el) => el && !el.isDeleted).length
                  : 0;

                return (
                  <div
                    key={wb.id}
                    onClick={() => setActiveWhiteboardId(wb.id)}
                    className="group flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 hover:border-[#134E5E]/40 dark:hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    onMouseEnter={preloadEditor}
                    onTouchStart={preloadEditor}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        <Shapes className="w-5 h-5 text-[#134E5E] dark:text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-[#0F3944] dark:text-white truncate">
                          {wb.title || "Untitled Drawing"}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" /> {elementCount} elements
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Updated {formatLastUpdated(wb.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleDuplicate(wb, e)}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-[#F3EDE2] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#EADFD5] dark:border-slate-700 transition-colors cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleExportJson(wb, e)}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-[#F3EDE2] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#EADFD5] dark:border-slate-700 transition-colors cursor-pointer"
                        title="Export .excalidraw"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(wb, e)}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-slate-400 border border-[#EADFD5] dark:border-slate-700 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveWhiteboardId(wb.id)}
                        className="px-4 py-2 rounded-xl bg-[#134E5E] text-white hover:bg-[#0F3944] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================
              4. BOTTOM PRO TIPS & SHORTCUTS ACCORDION
              ======================================================== */}
          <div className="mt-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 p-6 shadow-xs">
            <div
              onClick={() => setShowShortcuts((prev) => !prev)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#134E5E]/10 dark:bg-teal-950/60 text-[#134E5E] dark:text-teal-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0F3944] dark:text-white text-sm sm:text-base">
                    Whiteboard Pro Tips &amp; Keyboard Shortcuts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speed up your drawing, mind mapping, and wireframing workflow
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showShortcuts ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showShortcuts && (
              <div className="mt-6 pt-6 border-t border-[#EADFD5] dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                  <span className="font-bold text-[#0F3944] dark:text-slate-200">Selection / Pan</span>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Pan View</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">Space + Drag</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Select Tool</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">V or 1</kbd>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                  <span className="font-bold text-[#0F3944] dark:text-slate-200">Shapes &amp; Drawing</span>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Rectangle</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">R or 2</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Ellipse</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">O or 4</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Freehand Pen</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">P or 7</kbd>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                  <span className="font-bold text-[#0F3944] dark:text-slate-200">Connectors &amp; Text</span>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Arrow</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">A or 5</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Line</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">L or 6</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Text Tool</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">T or 8</kbd>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EADFD5] dark:border-slate-700">
                  <span className="font-bold text-[#0F3944] dark:text-slate-200">Shortcuts &amp; Export</span>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Zoom In / Out</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">Ctrl + Scroll</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Undo / Redo</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">Ctrl + Z / Y</kbd>
                  </div>
                  <div className="mt-1 text-slate-500 flex justify-between">
                    <span>Export PNG</span> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-mono text-[10px] border border-[#EADFD5] dark:border-slate-600">Shift + E</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default WhiteboardDashboard;
