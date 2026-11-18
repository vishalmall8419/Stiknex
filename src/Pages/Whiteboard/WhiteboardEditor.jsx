import { useState, useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import swal from "sweetalert";

export default function WhiteboardEditor({ whiteboard, onClose, onUpdate }) {
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
    } catch (e) {
      console.error(e);
      swal("Export Failed", "Could not export as PNG", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Editor Topbar */}
      <div className="h-16 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
          >
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
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Toggle Dark Mode"
          >
            {darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
          </button>
          <button
            onClick={handleExportPng}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2 cursor-pointer"
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
            appState: (typeof whiteboard.appState === 'object' && whiteboard.appState !== null) ? { ...whiteboard.appState, collaborators: new Map() } : {},
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
}
