import { useState, useRef, useEffect } from "react";
import AppShell from "../../Component/Layout/AppShell";
import { useAppContext } from "../../context/AppContext";
import PageSEO from "../../Component/SEO/PageSEO";
import Draggable from "react-draggable";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";

const COLORS = [
  { id: 'white', label: 'Yellow', bg: 'bg-[#FFF2B2] dark:bg-yellow-900/30 dark:border-yellow-700/50', border: 'border border-black/5 dark:border-white/10' },
  { id: 'green', label: 'Green', bg: 'bg-[#E3F2CE] dark:bg-green-900/30 dark:border-green-700/50', border: 'border border-black/5 dark:border-white/10' },
  { id: 'orange', label: 'Peach', bg: 'bg-[#FFD9B3] dark:bg-orange-900/30 dark:border-orange-700/50', border: 'border border-black/5 dark:border-white/10' },
  { id: 'red', label: 'Pink', bg: 'bg-[#FFCce6] dark:bg-pink-900/30 dark:border-pink-700/50', border: 'border border-black/5 dark:border-white/10' },
  { id: 'blue', label: 'Blue', bg: 'bg-[#A6CCFF] dark:bg-blue-900/30 dark:border-blue-700/50', border: 'border border-black/5 dark:border-white/10' },
  { id: 'purple', label: 'Purple', bg: 'bg-[#D9B3FF] dark:bg-purple-900/30 dark:border-purple-700/50', border: 'border border-black/5 dark:border-white/10' },
];

const NOTE_COLORS = COLORS.reduce((acc, curr) => {
  acc[curr.id] = `${curr.bg} ${curr.border}`;
  return acc;
}, {});

const StickyNote = ({ note, updateNote, deleteNote, connectingFrom, onConnectClick }) => {
  const updateXarrow = useXarrow();
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [note.des]);

  let colorKey = note.prio;
  if (colorKey?.endsWith('Card')) colorKey = colorKey.replace('Card', '');
  const bgColor = NOTE_COLORS[colorKey] || NOTE_COLORS.white;
  
  const isConnecting = connectingFrom === note.id;
  const isTarget = connectingFrom && connectingFrom !== note.id;

  // Fallback for old notes without x, y
  const defaultX = note.x !== undefined ? note.x : 3000 + (Math.random() * 200 - 100);
  const defaultY = note.y !== undefined ? note.y : 3000 + (Math.random() * 200 - 100);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: defaultX, y: defaultY }}
      onDrag={updateXarrow}
      onStop={(e, data) => {
        updateXarrow();
        updateNote(note.id, { x: data.x, y: data.y });
      }}
      bounds="parent"
      handle=".drag-handle"
    >
      <div 
        ref={nodeRef}
        id={`note-${note.id}`} 
        className={`absolute w-64 min-h-[160px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] rounded-sm group flex flex-col ${bgColor} ${isTarget ? 'ring-2 ring-green-400 cursor-crosshair' : ''} hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-shadow backdrop-blur-sm`}
      >
        {isTarget && (
          <div className="absolute inset-0 z-10" onClick={() => onConnectClick(note.id)}></div>
        )}

        {/* Top Drag Handle Area */}
        <div className="drag-handle w-full h-8 cursor-move flex items-center justify-center border-b border-black/5 dark:border-white/5 opacity-50 hover:opacity-100 transition-opacity" title="Drag to move">
           <div className="w-10 h-1.5 bg-black/20 dark:bg-white/20 rounded-full"></div>
        </div>

        {/* Toolbar (visible on hover/focus) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl rounded-md p-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 z-50 border border-gray-200 dark:border-slate-700">
          <button onClick={() => onConnectClick(note.id)} className={`p-2 rounded flex items-center justify-center ${isConnecting ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400'} transition-all`} title="Connect Note">
            <i className="fa-solid fa-arrow-right-arrow-left text-sm"></i>
          </button>
          
          <div className="flex gap-1.5 px-3 border-l border-r border-gray-200 dark:border-slate-700">
            {COLORS.map(c => (
               <button 
                 key={c.id} 
                 onClick={() => updateNote(note.id, { prio: c.id })}
                 className={`w-5 h-5 rounded-full ${c.bg} shadow-inner hover:scale-110 transition-transform ${colorKey === c.id ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-gray-400 dark:ring-gray-500' : ''}`}
                 title={c.label}
               />
            ))}
          </div>

          <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors" title="Delete Note">
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>

        {/* Title & Description Edit */}
        <div className="flex flex-col gap-2 flex-1 p-4 pt-2">
           {note.title !== undefined && (
             <input 
                type="text"
                value={note.title || ""}
                onChange={(e) => updateNote(note.id, { title: e.target.value })}
                className="w-full bg-transparent outline-none font-bold text-gray-900 dark:text-gray-100 border-b border-black/5 dark:border-white/5 pb-1 placeholder-gray-500/50 dark:placeholder-gray-400/50"
                placeholder="Title (Optional)"
             />
           )}
           <textarea
              ref={textareaRef}
              value={note.des || ""}
              onChange={(e) => updateNote(note.id, { des: e.target.value })}
              className="w-full h-full bg-transparent outline-none resize-none text-gray-800 dark:text-gray-200 text-[1.1rem] leading-relaxed placeholder-gray-500/50 dark:placeholder-gray-400/50 flex-1"
              placeholder="Type your note here..."
           />
        </div>
      </div>
    </Draggable>
  );
};

const Home = () => {
  const { notes, addNote, updateNote, deleteNote, deleteMultipleNotes, darkMode } = useAppContext();
  const boardRef = useRef(null);
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('stiknex_connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [connectingFrom, setConnectingFrom] = useState(null);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [scrollPan, setScrollPan] = useState({ left: 0, top: 0 });
  const [showPanHelperText, setShowPanHelperText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPanHelperText(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('stiknex_connections', JSON.stringify(connections));
  }, [connections]);

  // Initial center scroll
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.scrollLeft = 3000 - window.innerWidth / 2;
      boardRef.current.scrollTop = 3000 - window.innerHeight / 2;
    }
  }, []);

  const handleAddNote = () => {
    const scrollX = boardRef.current ? boardRef.current.scrollLeft : 3000;
    const scrollY = boardRef.current ? boardRef.current.scrollTop : 3000;
    
    // Offset slightly from center
    const offsetX = Math.floor(Math.random() * 60) - 30;
    const offsetY = Math.floor(Math.random() * 60) - 30;
    
    const centerX = scrollX + (window.innerWidth / 2) - 128 + offsetX;
    const centerY = scrollY + (window.innerHeight / 2) - 80 + offsetY;

    addNote({
      id: Date.now().toString(),
      title: "",
      des: "",
      prio: "white",
      x: centerX,
      y: centerY
    });
  };

  const handleConnectClick = (noteId) => {
    if (connectingFrom === noteId) {
      setConnectingFrom(null); // Cancel
    } else if (connectingFrom) {
      // Create connection
      setConnections(prev => [...prev, { from: connectingFrom, to: noteId, id: Date.now().toString() }]);
      setConnectingFrom(null);
    } else {
      // Start connecting
      setConnectingFrom(noteId);
    }
  };

  const handleDeleteNote = (id) => {
    // Remove connections linked to this note
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    deleteNote(id);
  };
  
  const deleteConnection = (id) => {
     setConnections(prev => prev.filter(c => c.id !== id));
  };

  // Canvas Panning Handlers
  const handleStart = (e) => {
    if (e.target.id === 'canvas-bg') {
       setIsPanning(true);
       const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
       const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
       setStartPan({ x: clientX, y: clientY });
       setScrollPan({ left: boardRef.current.scrollLeft, top: boardRef.current.scrollTop });
    }
  };

  const handleMove = (e) => {
    if (!isPanning) return;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const dx = clientX - startPan.x;
    const dy = clientY - startPan.y;
    boardRef.current.scrollLeft = scrollPan.left - dx;
    boardRef.current.scrollTop = scrollPan.top - dy;
  };

  const handleEnd = () => {
    setIsPanning(false);
  };

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Stiknex - Infinite Board"
        description="A freeform infinite canvas for your sticky notes."
        path="/"
      />

      {/* Global SweetAlert Dark Mode override for Home page */}
      {darkMode && (
        <style>{`
          .swal-modal { background-color: #1e293b !important; border: 1px solid #334155; }
          .swal-title { color: #f8fafc !important; }
          .swal-text { color: #94a3b8 !important; }
          .swal-button { background-color: #3b82f6 !important; }
          .swal-button--cancel { background-color: #334155 !important; color: #cbd5e1 !important; }
          .swal-button--cancel:hover { background-color: #475569 !important; }
          .swal-button--danger { background-color: #ef4444 !important; }
          .swal-icon--warning { border-color: #eab308 !important; }
          .swal-icon--warning__body, .swal-icon--warning__dot { background-color: #eab308 !important; }
        `}</style>
      )}

      {/* Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-slate-700/50 rounded-full px-2 py-2 w-max max-w-[95vw]">
         <div className="px-3 sm:px-5 border-r border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center">
            <span className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white leading-tight whitespace-nowrap hidden sm:block">Sticky Board</span>
            <span className="font-extrabold text-sm text-gray-800 dark:text-white leading-tight whitespace-nowrap sm:hidden">Board</span>
            <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{notes.length} Note{notes.length !== 1 ? 's' : ''}</span>
         </div>
         <div className="px-2 flex items-center gap-1.5 sm:gap-2">
           <button 
             onClick={handleAddNote} 
             className="px-3 py-2 sm:px-5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
             title="New Note"
           >
              <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">New Note</span>
           </button>
           
           {notes.length > 0 && (
             <button 
               onClick={() => deleteMultipleNotes(notes.map(n => n.id))} 
               className="px-3 py-2 sm:px-4 sm:py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full font-medium shadow-sm transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-500/20 whitespace-nowrap flex-shrink-0"
               title="Clear all notes"
             >
                <i className="fa-solid fa-trash-can"></i> <span className="hidden sm:inline">Clear All</span>
             </button>
           )}
         </div>
         
         {connectingFrom && (
            <div className="ml-1 sm:ml-2 mr-1 px-3 py-1.5 sm:px-4 sm:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs sm:text-sm rounded-full flex items-center gap-2 sm:gap-3 animate-pulse border border-green-200 dark:border-green-800/50 whitespace-nowrap">
               <span className="hidden sm:inline">Select target to connect</span>
               <span className="sm:hidden">Select target</span>
               <button onClick={() => setConnectingFrom(null)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 rounded-full bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-900 dark:text-green-100 transition-colors">
                  <i className="fa-solid fa-xmark text-[10px] sm:text-xs"></i>
               </button>
            </div>
         )}
      </div>

      {/* Helper Text */}
      <div className={`absolute bottom-6 right-4 sm:right-8 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur text-gray-600 dark:text-gray-300 flex items-center justify-center border border-gray-200 dark:border-slate-700 shadow-sm pointer-events-none h-10 transition-all duration-700 ease-in-out ${showPanHelperText ? 'rounded-full sm:rounded-lg w-10 sm:w-auto sm:px-4' : 'rounded-full w-10 px-0'}`}>
         <i className="fa-solid fa-hand-pointer flex-shrink-0 text-sm"></i> 
         <div className={`overflow-hidden transition-all duration-700 whitespace-nowrap hidden sm:block ${showPanHelperText ? 'max-w-[250px] ml-2 opacity-100' : 'max-w-0 ml-0 opacity-0'}`}>
            Click & drag background to pan
         </div>
      </div>

      {/* Infinite Canvas */}
      <div 
        ref={boardRef} 
        className="absolute inset-0 w-full h-[calc(100vh-64px)] overflow-hidden bg-[#f4f5f7] dark:bg-slate-950 select-none"
      >
         <div 
            id="canvas-bg"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            className={`w-[6000px] h-[6000px] bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-[size:32px_32px] relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
         >
            <Xwrapper>
               {/* Render Connections */}
               {connections.map(c => (
                  <Xarrow
                    key={c.id}
                    start={`note-${c.from}`}
                    end={`note-${c.to}`}
                    color={darkMode ? "#475569" : "#94a3b8"}
                    strokeWidth={3}
                    path="smooth"
                    headSize={6}
                    passProps={{
                       onClick: () => deleteConnection(c.id),
                       className: "cursor-pointer hover:stroke-red-500 hover:opacity-50 transition-all drop-shadow-sm",
                       title: "Click to delete connection"
                    }}
                  />
               ))}

               {/* Render Notes */}
               {notes.map(note => (
                  <StickyNote 
                    key={note.id}
                    note={note}
                    updateNote={updateNote}
                    deleteNote={handleDeleteNote}
                    connectingFrom={connectingFrom}
                    onConnectClick={handleConnectClick}
                  />
               ))}
            </Xwrapper>
         </div>
      </div>
    </AppShell>
  );
};

export default Home;
