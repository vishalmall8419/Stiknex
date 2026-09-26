import { useState, useEffect, useRef } from "react";
import AppShell from "../../Component/Layout/AppShell";
import { useAppContext } from "../../context/AppContext";
import PageSEO from "../../Component/SEO/PageSEO";
import { Excalidraw, exportToBlob, exportToSvg } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import swal from "sweetalert";

const WhiteboardEditor = ({ whiteboard, onClose, onUpdate }) => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const [title, setTitle] = useState(whiteboard.title || "Untitled Drawing");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  
  // Throttle saves to avoid performance issues while drawing
  const saveTimeout = useRef(null);

  const handleChange = (elements, appState, files) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onUpdate(whiteboard.id, { elements, appState, files });
    }, 1000);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onUpdate(whiteboard.id, { title: e.target.value });
  };

  const handleExportPng = async () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) {
      swal("Canvas Empty", "Please draw something before exporting.", "info");
      return;
    }
    
    try {
      const blob = await exportToBlob({
        elements,
        mimeType: "image/png",
        appState: { ...excalidrawAPI.getAppState(), exportBackground: true },
        files: excalidrawAPI.getFiles(),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e);
      swal("Export Failed", "Could not export as PNG", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <PageSEO title={`${title} — Whiteboard`} description="Stiknex Whiteboard Editor" path="/whiteboard" />
      
      {/* Editor Topbar */}
      <div className="h-16 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Drawing Title"
            className="text-xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 transition-all w-48 sm:w-64"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-600 dark:text-slate-300"
            title="Toggle Dark Mode"
          >
            {darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
          </button>
          <button 
            onClick={handleExportPng}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i> <span className="hidden sm:inline">Export PNG</span>
          </button>
        </div>
      </div>
      
      {/* Excalidraw Canvas */}
      <div className="relative w-full h-[calc(100vh-64px)]">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements: Array.isArray(whiteboard.elements) ? whiteboard.elements.filter(el => el && el.type) : [],
            appState: (typeof whiteboard.appState === "object" && whiteboard.appState !== null) ? whiteboard.appState : {},
            files: (typeof whiteboard.files === "object" && whiteboard.files !== null) ? whiteboard.files : {},
          }}
          onChange={handleChange}
          theme={darkMode ? "dark" : "light"}
          UIOptions={{
            canvasActions: { loadScene: false, export: false, saveAsImage: false },
          }}
        />
      </div>
    </div>
  );
};

const SvgPreview = ({ elements, appState, files }) => {
  const containerRef = useRef(null);
  const safeElements = Array.isArray(elements) ? elements.filter(el => el && el.type) : [];
  
  useEffect(() => {
    let isMounted = true;
    if (safeElements.length === 0) return;
    
    const generatePreview = async () => {
      try {
        const svg = await exportToSvg({
          elements: safeElements,
          appState: (typeof appState === "object" && appState !== null) ? { ...appState, exportBackground: false } : { exportBackground: false },
          files: (typeof files === "object" && files !== null) ? files : {},
        });
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = "";
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          containerRef.current.appendChild(svg);
        }
      } catch {
        // Fallback silently if SVG generation fails for corrupted data
      }
    };
    generatePreview();
    return () => { isMounted = false; };
  }, [elements, appState, files]); // keeping original dependencies
  
  if (safeElements.length === 0) {
    return <i className="fa-solid fa-shapes text-3xl text-indigo-200 dark:text-indigo-900"></i>;
  }
  
  return <div ref={containerRef} className="w-full h-full p-2 opacity-90 dark:opacity-75 pointer-events-none" />;
};

const WhiteboardDashboard = () => {
  const { whiteboards, addWhiteboard, deleteWhiteboard, updateWhiteboard } = useAppContext();
  const [activeWhiteboardId, setActiveWhiteboardId] = useState(null);

  const handleCreateNew = () => {
    // Find the next available "Whiteboard X" number
    const nextNum = whiteboards.reduce((max, wb) => {
      if (!wb.title) return max;
      const match = wb.title.match(/^Whiteboard (\d+)$/i);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0) + 1;

    const newWb = {
      id: `wb_${Date.now()}`,
      title: `Whiteboard ${nextNum}`,
      elements: [],
      appState: {},
      files: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addWhiteboard(newWb);
    setActiveWhiteboardId(newWb.id);
  };

  const activeWhiteboard = whiteboards.find(wb => wb.id === activeWhiteboardId);

  if (activeWhiteboard) {
    return (
      <WhiteboardEditor 
        whiteboard={activeWhiteboard} 
        onClose={() => setActiveWhiteboardId(null)} 
        onUpdate={updateWhiteboard}
      />
    );
  }

  return (
    <AppShell>
      <PageSEO
        title="Whiteboards — Visual Notes"
        description="Brainstorm, draw, and create visual notes directly inside Stiknex."
        path="/whiteboard"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Whiteboards</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visual notes, sketches, and diagrams.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> New Drawing
        </button>
      </div>

      {whiteboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center text-2xl mb-4">
            <i className="fa-solid fa-pen-nib"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No drawings yet</h3>
          <p className="text-slate-500 max-w-sm mb-6">Create a visual note to sketch ideas, map out processes, or brainstorm.</p>
          <button 
            onClick={handleCreateNew}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
          >
            Start Drawing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {whiteboards.map((wb) => (
            <div key={wb.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col h-48 cursor-pointer" onClick={() => setActiveWhiteboardId(wb.id)}>
              
              <button 
                onClick={(e) => { e.stopPropagation(); deleteWhiteboard(wb.id); }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:bg-red-50 hover:text-red-600 text-gray-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10"
                title="Delete"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>

              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-xl mb-4 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
                <SvgPreview elements={wb.elements} appState={wb.appState} files={wb.files} />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg truncate text-slate-900 dark:text-white">{wb.title || "Untitled Drawing"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Updated {wb.updatedAt ? new Date(wb.updatedAt).toLocaleDateString() : "Unknown Date"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default WhiteboardDashboard;


