import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "../../Component/Layout/AppShell";
import { useAppContext } from "../../context/AppContext";
import PageSEO from "../../Component/SEO/PageSEO";

const WhiteboardEditor = lazy(() => import("./WhiteboardEditor"));

const WhiteboardLoadingSkeleton = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading drawing canvas...</p>
    </div>
  </div>
);

const SvgPreview = ({ elements, appState, files }) => {
  const containerRef = useRef(null);
  const safeElements = Array.isArray(elements) ? elements.filter((el) => el && el.type) : [];

  useEffect(() => {
    let isMounted = true;
    if (safeElements.length === 0) return;

    const generatePreview = async () => {
      try {
        const { exportToSvg } = await import("@excalidraw/excalidraw");
        const svg = await exportToSvg({
          elements: safeElements,
          appState: typeof appState === "object" && appState !== null ? { ...appState, exportBackground: false } : { exportBackground: false },
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
        // Fallback silently if SVG generation fails
      }
    };
    generatePreview();
    return () => {
      isMounted = false;
    };
  }, [elements, appState, files]);

  if (safeElements.length === 0) {
    return <i className="fa-solid fa-shapes text-3xl text-indigo-200 dark:text-indigo-900"></i>;
  }

  return <div ref={containerRef} className="w-full h-full p-2 opacity-90 dark:opacity-75 pointer-events-none" />;
};

const WhiteboardDashboard = () => {
  const { whiteboards, addWhiteboard, deleteWhiteboard, updateWhiteboard } = useAppContext();
  const [searchParams] = useSearchParams();
  const [activeWhiteboardId, setActiveWhiteboardId] = useState(() => searchParams.get("id") || null);

  // Preload editor bundle on idle or hover
  const preloadEditor = () => {
    import("./WhiteboardEditor");
  };

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) setActiveWhiteboardId(idFromUrl);
  }, [searchParams]);

  const handleCreateNew = () => {
    const nextNum =
      whiteboards.reduce((max, wb) => {
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
        title="Free Online Whiteboard - Draw & Collaborate | Stiknex"
        description="Use Stiknex free online whiteboard powered by Excalidraw. Sketch, diagram, brainstorm and collaborate. No sign-up required."
        path="/whiteboard"
        type="webapp"
        keywords="free online whiteboard, excalidraw, digital whiteboard, online drawing board, whiteboard app, free sketch tool"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Whiteboards</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visual notes, sketches, and diagrams.</p>
        </div>
        <button
          onClick={handleCreateNew}
          onMouseEnter={preloadEditor}
          onTouchStart={preloadEditor}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
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
            onMouseEnter={preloadEditor}
            onTouchStart={preloadEditor}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Drawing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {whiteboards.map((wb) => (
            <div
              key={wb.id}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col h-48 cursor-pointer"
              onClick={() => setActiveWhiteboardId(wb.id)}
              onMouseEnter={preloadEditor}
              onTouchStart={preloadEditor}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWhiteboard(wb.id);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:bg-red-50 hover:text-red-600 text-gray-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10 cursor-pointer"
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
