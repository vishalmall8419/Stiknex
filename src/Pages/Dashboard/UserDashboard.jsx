import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import swal from "sweetalert";
import {
  LayoutDashboard,
  Zap,
  Target,
  Trophy,
  Clock,
  Flame,
  Calendar,
  Sparkles,
  FileText,
  StickyNote,
  BookOpen,
  ArrowRight,
  LogOut,
  Copy,
  Check,
  Award,
  BarChart2,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  User,
  Settings,
  Download,
  Search,
  Lock,
  Plus,
  Compass,
  ArrowUpRight,
  Trash2,
  Edit3,
  QrCode,
  Smartphone,
  Cloud,
  CheckCircle2,
  Folder,
  Tag,
  PenTool
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import TypingLeaderboard from "../Tools/components/TypingLeaderboard";
import NotebookSyncModal from "../Notebook/NotebookSyncModal";
import {
  getSyncIdentity,
  pullFromCloud,
  pushToCloud
} from "../Notebook/notebookSyncManager";
import {
  deleteExtendedNote,
  saveExtendedNote
} from "../Notebook/notebookStorage";

const NOTEBOOKS_KEY = "stiknexNotebooks";

const COLOR_OPTIONS = [
  { label: "Canary Yellow", bg: "#fef08a", border: "#fde047" },
  { label: "Mint Green", bg: "#bbf7d0", border: "#86efac" },
  { label: "Sky Blue", bg: "#bae6fd", border: "#7dd3fc" },
  { label: "Rose Pink", bg: "#fbcfe8", border: "#f472b6" },
  { label: "Lilac Purple", bg: "#ddd6fe", border: "#c4b5fd" },
  { label: "Warm Orange", bg: "#fed7aa", border: "#fdba74" }
];

export default function UserDashboard() {
  const {
    user,
    token,
    logout,
    openAuthModal,
    notes,
    addNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    importNotes,
    whiteboards,
    addWhiteboard,
    updateWhiteboard,
    deleteWhiteboard,
    darkMode,
    toggleDarkMode
  } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-page navigation state from query or default
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  // Cloud Sync & QR Pairing
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncIdentity, setSyncIdentity] = useState(getSyncIdentity);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("Just now");

  // Notebooks State
  const [notebooks, setNotebooks] = useState(() => {
    try {
      const raw = localStorage.getItem(NOTEBOOKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Search & Filter
  const [notesSearch, setNotesSearch] = useState("");
  const [notebooksSearch, setNotebooksSearch] = useState("");
  const [whiteboardsSearch, setWhiteboardsSearch] = useState("");
  const [noteColorFilter, setNoteColorFilter] = useState("all");

  // Modals for CRUD
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteFormText, setNoteFormText] = useState("");
  const [noteFormColor, setNoteFormColor] = useState(COLOR_OPTIONS[0].bg);

  const [notebookModalOpen, setNotebookModalOpen] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [notebookFormTitle, setNotebookFormTitle] = useState("");
  const [notebookFormFolder, setNotebookFormFolder] = useState("");

  const [whiteboardModalOpen, setWhiteboardModalOpen] = useState(false);
  const [editingWhiteboard, setEditingWhiteboard] = useState(null);
  const [whiteboardFormTitle, setWhiteboardFormTitle] = useState("");

  // Sync state with cloud database helper
  const saveWorkspaceToCloud = useCallback(
    async (curNotes, curNotebooks, curWhiteboards) => {
      if (!token) return;
      try {
        const identity = getSyncIdentity();
        await fetch("/api/auth?action=user-workspace-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            notes: curNotes,
            notebooks: curNotebooks,
            whiteboards: curWhiteboards !== undefined ? curWhiteboards : (whiteboards || []),
            syncGroupId: identity?.syncGroupId || null
          })
        });
        if (identity) {
          pushToCloud().catch(() => {});
        }
      } catch (err) {
        console.warn("Workspace cloud auto-save notice:", err);
      }
    },
    [token, whiteboards]
  );

  // Load Dashboard Data from MongoDB
  const fetchDashboardData = useCallback(() => {
    if (token) {
      setLoading(true);
      fetch("/api/auth?action=user-dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success) {
            setDashboardData(data);

            // Populate workspace data from database if local is empty or older
            if (data?.workspaceData) {
              const dbNotes = data.workspaceData.notes;
              const dbNotebooks = data.workspaceData.notebooks;

              if (Array.isArray(dbNotes) && dbNotes.length > 0 && (!notes || notes.length === 0)) {
                if (importNotes) importNotes(dbNotes);
              }

              if (Array.isArray(dbNotebooks) && dbNotebooks.length > 0) {
                setNotebooks((prev) => {
                  if (prev.length === 0) {
                    try {
                      localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(dbNotebooks));
                    } catch {}
                    return dbNotebooks;
                  }
                  return prev;
                });
              }
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token, importNotes, notes]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Keep syncIdentity updated
  useEffect(() => {
    setSyncIdentity(getSyncIdentity());
  }, [syncModalOpen]);

  // Manual Trigger to Pull from Cloud Database
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      let pulled = false;
      const identity = getSyncIdentity();
      if (identity) {
        const res = await pullFromCloud();
        if (res.success) {
          pulled = true;
        }
      }

      // Also pull user's cloud workspace from MongoDB
      if (token) {
        const res = await fetch("/api/auth?action=user-workspace-load", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.success && data.workspaceData) {
          if (Array.isArray(data.workspaceData.notes) && data.workspaceData.notes.length > 0) {
            if (importNotes) importNotes(data.workspaceData.notes);
          }
          if (Array.isArray(data.workspaceData.notebooks) && data.workspaceData.notebooks.length > 0) {
            localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(data.workspaceData.notebooks));
            setNotebooks(data.workspaceData.notebooks);
          }
          pulled = true;
        }
      }

      setLastSyncText(new Date().toLocaleTimeString());
      swal({
        title: "Database Synced!",
        text: "Successfully fetched latest notes and notebooks directly from MongoDB cloud.",
        icon: "success",
        timer: 2000
      });
    } catch (err) {
      swal("Sync Error", err.message || "Failed to sync with cloud database.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const profile = dashboardData?.profile || user;
  const recentTests = dashboardData?.recentTests || [];

  const handleCopyUsername = () => {
    if (profile?.username) {
      navigator.clipboard.writeText(`@${profile.username}`);
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      user: {
        name: profile?.name,
        username: profile?.username,
        email: profile?.email,
        tier: profile?.tier,
        bestWpm: profile?.bestWpm
      },
      exportedAt: new Date().toISOString(),
      recentTypingTests: recentTests,
      stickyNotesCount: notes?.length || 0,
      stickyNotes: notes || [],
      notebooksCount: notebooks.length,
      notebooks: notebooks,
      whiteboardsCount: whiteboards?.length || 0,
      whiteboards: whiteboards || []
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stiknex-workspace-backup-${profile?.username || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────
  // STICKY NOTES CRUD ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openNewNoteModal = () => {
    setEditingNote(null);
    setNoteFormText("");
    setNoteFormColor(COLOR_OPTIONS[0].bg);
    setNoteModalOpen(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note);
    setNoteFormText(note.text || note.content || "");
    setNoteFormColor(note.color || COLOR_OPTIONS[0].bg);
    setNoteModalOpen(true);
  };

  const handleSaveNoteForm = (e) => {
    e.preventDefault();
    if (!noteFormText.trim()) {
      swal("Note Empty", "Please write some text for your sticky note.", "warning");
      return;
    }

    if (editingNote) {
      // Update existing note
      const updatedNotes = (notes || []).map((n) =>
        n.id === editingNote.id ? { ...n, text: noteFormText, color: noteFormColor, updatedAt: Date.now() } : n
      );
      updateNote(editingNote.id, { text: noteFormText, color: noteFormColor });
      saveWorkspaceToCloud(updatedNotes, notebooks, whiteboards);
      swal({ title: "Updated!", text: "Sticky note updated and saved to database.", icon: "success", timer: 1500 });
    } else {
      // Add new note
      const newNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: noteFormText,
        color: noteFormColor,
        x: Math.floor(Math.random() * 200) + 50,
        y: Math.floor(Math.random() * 200) + 50,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updatedNotes = [...(notes || []), newNote];
      addNote(newNote);
      saveWorkspaceToCloud(updatedNotes, notebooks, whiteboards);
      swal({ title: "Created!", text: "New sticky note posted and saved to database.", icon: "success", timer: 1500 });
    }

    setNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId) => {
    swal({
      title: "Delete this note?",
      text: "This sticky note will be permanently removed from your workspace and database.",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        const updatedNotes = (notes || []).filter((n) => n.id !== noteId);
        permanentlyDeleteNote(noteId);
        saveWorkspaceToCloud(updatedNotes, notebooks, whiteboards);
        swal({ title: "Deleted", text: "Sticky note removed from database.", icon: "success", timer: 1500 });
      }
    });
  };

  // ─────────────────────────────────────────────────────────────
  // NOTEBOOKS CRUD ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openNewNotebookModal = () => {
    setEditingNotebook(null);
    setNotebookFormTitle("");
    setNotebookFormFolder("");
    setNotebookModalOpen(true);
  };

  const openEditNotebookModal = (nb) => {
    setEditingNotebook(nb);
    setNotebookFormTitle(nb.title || "");
    setNotebookFormFolder(nb.folder || "");
    setNotebookModalOpen(true);
  };

  const handleSaveNotebookForm = async (e) => {
    e.preventDefault();
    if (!notebookFormTitle.trim()) {
      swal("Title Required", "Please enter a title for your encrypted notebook.", "warning");
      return;
    }

    if (editingNotebook) {
      // Update notebook metadata
      const updated = notebooks.map((nb) =>
        nb.id === editingNotebook.id
          ? {
              ...nb,
              title: notebookFormTitle.trim(),
              folder: notebookFormFolder.trim() || null,
              updatedAt: Date.now()
            }
          : nb
      );
      setNotebooks(updated);
      try {
        localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(updated));
      } catch {}
      saveWorkspaceToCloud(notes || [], updated, whiteboards);
      swal({ title: "Updated!", text: "Notebook title saved to database.", icon: "success", timer: 1500 });
    } else {
      // Create new notebook
      const newId = `nb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const newNb = {
        id: newId,
        title: notebookFormTitle.trim(),
        folder: notebookFormFolder.trim() || null,
        content: "",
        updatedAt: Date.now(),
        createdAt: Date.now()
      };
      const updated = [newNb, ...notebooks];
      setNotebooks(updated);
      try {
        localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(updated));
        await saveExtendedNote(newId, "");
      } catch {}
      saveWorkspaceToCloud(notes || [], updated, whiteboards);
      swal({ title: "Created!", text: "Encrypted notebook initialized and saved to database.", icon: "success", timer: 1500 });
    }

    setNotebookModalOpen(false);
    setEditingNotebook(null);
  };

  const handleDeleteNotebook = (nbId, nbTitle) => {
    swal({
      title: `Delete "${nbTitle || "Notebook"}"?`,
      text: "This notebook and all its encrypted pages will be permanently deleted from database and device storage.",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const updated = notebooks.filter((nb) => nb.id !== nbId);
        setNotebooks(updated);
        try {
          localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(updated));
          await deleteExtendedNote(nbId);
        } catch {}
        saveWorkspaceToCloud(notes || [], updated, whiteboards);
        swal({ title: "Deleted", text: "Notebook deleted from database.", icon: "success", timer: 1500 });
      }
    });
  };

  // ─────────────────────────────────────────────────────────────
  // WHITEBOARDS & SKETCHES CRUD ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleCreateNewWhiteboard = () => {
    const nextNum = (whiteboards || []).reduce((max, wb) => {
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
      updatedAt: Date.now()
    };
    addWhiteboard(newWb);
    const updated = [newWb, ...(whiteboards || [])];
    saveWorkspaceToCloud(notes || [], notebooks, updated);
    navigate(`/whiteboard?id=${newWb.id}`);
  };

  const openEditWhiteboardModal = (wb) => {
    setEditingWhiteboard(wb);
    setWhiteboardFormTitle(wb.title || "");
    setWhiteboardModalOpen(true);
  };

  const handleSaveWhiteboardForm = (e) => {
    e.preventDefault();
    if (!whiteboardFormTitle.trim()) {
      swal("Title Required", "Please enter a title for your drawing.", "warning");
      return;
    }

    if (editingWhiteboard) {
      updateWhiteboard(editingWhiteboard.id, { title: whiteboardFormTitle.trim() });
      const updated = (whiteboards || []).map((wb) =>
        wb.id === editingWhiteboard.id ? { ...wb, title: whiteboardFormTitle.trim(), updatedAt: Date.now() } : wb
      );
      saveWorkspaceToCloud(notes || [], notebooks, updated);
      swal({ title: "Updated!", text: "Drawing title updated and saved to database.", icon: "success", timer: 1500 });
    }

    setWhiteboardModalOpen(false);
    setEditingWhiteboard(null);
  };

  const handleDeleteWhiteboard = (wbId, wbTitle) => {
    swal({
      title: `Delete "${wbTitle || "Drawing"}"?`,
      text: "This drawing and its vector elements will be permanently deleted from workspace and database.",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        deleteWhiteboard(wbId);
        const updated = (whiteboards || []).filter((wb) => wb.id !== wbId);
        saveWorkspaceToCloud(notes || [], notebooks, updated);
        swal({ title: "Deleted", text: "Drawing removed from workspace.", icon: "success", timer: 1500 });
      }
    });
  };

  // If user is not logged in: Guest Welcome & Authentication Screen
  if (!user && !token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center py-16 px-4 sm:px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <img src="/logo.png" alt="Stiknex Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Stiknex
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto text-3xl">
              👤
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Stiknex User Workspace
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Sign in to access your synchronized typing telemetry, sticky notes canvas, and encrypted notebooks.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => openAuthModal("login")}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm transition cursor-pointer"
              >
                Create Free Account
              </button>
            </div>
          </div>

          <Link
            to="/stiknex-typing"
            className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-mono hover:underline"
          >
            <span>← Practice in Speed Arena as Guest</span>
          </Link>
        </div>
      </div>
    );
  }

  // Tier Styling
  const tierBadges = {
    Mythical: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
    Master: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    Diamond: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    Pro: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    Standard: "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
  };

  const userTier = profile?.tier || "Standard";

  // Navigation Items
  const navItems = [
    { id: "overview", label: "Overview & Hub", icon: LayoutDashboard, badge: null },
    { id: "typing", label: "Typing Telemetry", icon: Zap, badge: `${profile?.bestWpm || 0} WPM` },
    { id: "notes", label: "Sticky Notes", icon: StickyNote, badge: notes?.length ? `${notes.length}` : null },
    { id: "notebooks", label: "Encrypted Notebooks", icon: BookOpen, badge: notebooks.length ? `${notebooks.length}` : "E2E" },
    { id: "whiteboards", label: "Whiteboards & Sketches", icon: PenTool, badge: whiteboards?.length ? `${whiteboards.length}` : null },
    { id: "leaderboard", label: "Hall of Fame", icon: Trophy, badge: "Live" },
    { id: "settings", label: "Profile & Security", icon: Settings, badge: null }
  ];

  // Filtered Notes
  const filteredNotes = (notes || []).filter((n) => {
    const matchesSearch = !notesSearch || (n.text || n.content || "").toLowerCase().includes(notesSearch.toLowerCase());
    const matchesColor = noteColorFilter === "all" || n.color === noteColorFilter;
    return matchesSearch && matchesColor;
  });

  // Filtered Notebooks
  const filteredNotebooks = notebooks.filter((nb) => {
    return !notebooksSearch || (nb.title || "").toLowerCase().includes(notebooksSearch.toLowerCase()) || (nb.folder || "").toLowerCase().includes(notebooksSearch.toLowerCase());
  });

  // Filtered Whiteboards
  const filteredWhiteboards = (whiteboards || []).filter((wb) => {
    return !whiteboardsSearch || (wb.title || "").toLowerCase().includes(whiteboardsSearch.toLowerCase());
  });

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER WITH STIKNEX LOGO
      ───────────────────────────────────────────────────────────── */}
      <header className="h-16 shrink-0 w-full z-40 bg-white/95 dark:bg-[#0e121a]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Stiknex Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition cursor-pointer"
            aria-label="Toggle Sidebar Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Stiknex Logo"
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Stiknex
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 -mt-1 hidden sm:block">
                Workspace Hub
              </span>
            </div>
          </Link>

          {/* Active Breadcrumb on Desktop */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-400">
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
            </span>
          </div>
        </div>

        {/* Right: Quick Drill, Cloud Sync Pill, Theme Toggle, Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Button */}
          <button
            onClick={() => setSyncModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              syncIdentity
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
            title="Connect Cloud Sync & QR Code Device Pairing"
          >
            <Cloud size={14} className={isSyncing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">
              {syncIdentity ? "Cloud Synced" : "Connect Sync"}
            </span>
            <QrCode size={13} className="text-slate-400" />
          </button>

          <Link
            to="/stiknex-typing"
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Zap size={14} />
            <span className="hidden sm:inline">Speed Arena</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Toggle Light / Dark Theme"
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          {/* User Avatar + Tier Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shrink-0 shadow-xs">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-xs text-amber-300 font-black">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {profile?.name || "Member"}
              </span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                @{profile?.username}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. BODY: FIXED PINNED SIDEBAR + INDEPENDENT SCROLLING MAIN
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* PINNED SIDEBAR (FIXED ON SCREEN, NEVER SCROLLS WITH PAGE) */}
        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 shrink-0 bg-white dark:bg-[#0e121a] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full overflow-hidden transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* User Mini Profile Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded-md border ${
                    tierBadges[userTier] || tierBadges.Standard
                  }`}
                >
                  {userTier} Tier
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {profile?.xp || 100} XP
                </span>
              </div>

              <div>
                <button
                  onClick={handleCopyUsername}
                  title="Click to copy unique username"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>@{profile?.username}</span>
                  {copiedUser ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
                <span className="text-[11px] text-slate-500 block truncate font-sans">
                  {profile?.email}
                </span>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Workspace Pages
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isActive
                            ? "bg-slate-950/20 text-slate-950 font-black"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cloud Sync Status Box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <Cloud size={12} className="text-amber-500" />
                  <span>Cloud Sync</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    syncIdentity ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-mono leading-tight">
                {syncIdentity
                  ? `Group: ${syncIdentity.syncGroupId?.slice(0, 8)}...`
                  : "Connect QR pairing to sync devices"}
              </p>
              <button
                onClick={() => setSyncModalOpen(true)}
                className="w-full py-1.5 px-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode size={13} />
                <span>{syncIdentity ? "Manage Devices" : "Pair Device (QR)"}</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              to="/tools"
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Compass size={14} />
                <span>Productivity Suite</span>
              </span>
              <ArrowUpRight size={13} />
            </Link>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. MAIN MULTI-PAGE WORKSPACE CANVAS (SCROLLS INDEPENDENTLY)
        ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Profile Welcome Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Verified Workspace • Cloud Synchronized
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Welcome back, {profile?.name}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                    Track your daily typing velocities, monitor your sticky notes canvas, and inspect your global benchmark records.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    to="/stiknex-typing"
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Zap size={15} />
                    <span>Start Typing Drill</span>
                  </Link>
                  <button
                    onClick={() => setSyncModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-amber-500/50 transition cursor-pointer flex items-center gap-2"
                  >
                    <QrCode size={14} className="text-amber-500" />
                    <span>Connect Cloud Sync & QR</span>
                  </button>
                </div>
              </div>

              {/* Cloud Sync Direct Action Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Cloud size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>MongoDB Cloud Sync Engine</span>
                      {syncIdentity ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                          Active E2E
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                          Ready to Pair
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sync sticky notes and notebooks across mobile and desktop. Last sync: {lastSyncText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={isSyncing ? "animate-spin text-amber-500" : ""} />
                    <span>{isSyncing ? "Syncing..." : "Sync Database Now"}</span>
                  </button>
                  <button
                    onClick={() => setSyncModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <QrCode size={13} />
                    <span>Scan Pairing QR</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                {/* Peak Speed */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peak Velocity</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                      {profile?.bestWpm || 0}
                    </span>
                    <span className="text-xs font-bold text-slate-500">WPM</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block pt-1">
                    Personal Benchmark
                  </span>
                </div>

                {/* Average Velocity */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Speed</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {profile?.avgWpm || 0}
                    </span>
                    <span className="text-xs font-bold text-slate-500">WPM</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    Across all drills
                  </span>
                </div>

                {/* Accuracy */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Precision Rate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {profile?.avgAccuracy || 100}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    Key accuracy score
                  </span>
                </div>

                {/* Tests Completed */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tests Mastered</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                      {profile?.testsCompleted || 0}
                    </span>
                    <span className="text-xs font-bold text-slate-500">tests</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    {profile?.totalTimeMinutes || 0} mins practice
                  </span>
                </div>
              </div>

              {/* Workspace Utilities Quick Launch (3 Core Pillars: Sticky Notes, Notebooks, Whiteboard) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sticky Notes Canvas */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                          <StickyNote size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sticky Notes Canvas</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Interactive visual notes</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400">
                        {notes?.length || 0} Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Keep your quick thoughts, project tasks, and colorful reminders accessible right on your workspace canvas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to="/sticky-notes"
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition text-center"
                    >
                      Open Canvas
                    </Link>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                    >
                      Manage ({notes?.length || 0})
                    </button>
                  </div>
                </div>

                {/* Online Notebook & Journal */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Encrypted Notebook</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">AES-256 cloud sync</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                        {notebooks.length} Docs
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Secure journals and long-form documents encrypted locally before cloud backup across your devices.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to="/online-notebook"
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition text-center"
                    >
                      Open Editor
                    </Link>
                    <button
                      onClick={() => setActiveTab("notebooks")}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-xs font-bold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                    >
                      Manage ({notebooks.length})
                    </button>
                  </div>
                </div>

                {/* Excalidraw Whiteboard Canvas */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
                          <PenTool size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Whiteboard Canvas</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Excalidraw vector sketches</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                        {whiteboards?.length || 0} Sketches
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Infinite vector sketching canvas for system architectures, wireframes, and creative brainstorm diagrams.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to="/whiteboard"
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition text-center"
                    >
                      Open Canvas
                    </Link>
                    <button
                      onClick={() => setActiveTab("whiteboards")}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-xs font-bold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                    >
                      Manage ({whiteboards?.length || 0})
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Typing Sessions Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Benchmark Sessions</h3>
                    <p className="text-xs text-slate-500">Your latest completed typing drills recorded in MongoDB</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("typing")}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {recentTests.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs font-mono space-y-2">
                    <Sparkles size={24} className="mx-auto text-amber-500/50" />
                    <p>No tests recorded yet today. Complete a 15s or 60s drill in Speed Arena to view your breakdown here!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <th className="py-2.5 font-bold">Mode</th>
                          <th className="py-2.5 font-bold text-amber-600 dark:text-amber-400">WPM</th>
                          <th className="py-2.5 font-bold">Raw WPM</th>
                          <th className="py-2.5 font-bold">Accuracy</th>
                          <th className="py-2.5 font-bold">Consistency</th>
                          <th className="py-2.5 font-bold text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {recentTests.slice(0, 5).map((t, idx) => (
                          <tr key={t.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                            <td className="py-3 text-slate-800 dark:text-slate-200 capitalize">
                              {t.subMode || "time"} {t.timeLimit ? `${t.timeLimit}s` : ""}
                            </td>
                            <td className="py-3 text-amber-600 dark:text-amber-400 font-bold text-sm">
                              {t.wpm}
                            </td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">
                              {t.rawWpm || t.wpm}
                            </td>
                            <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">
                              {t.accuracy}%
                            </td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">
                              {t.consistency || 90}%
                            </td>
                            <td className="py-3 text-slate-500 text-right">
                              {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Just now"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TYPING TELEMETRY & DRILLS */}
          {activeTab === "typing" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-amber-500" />
                    <span>Biomechanical Typing Telemetry</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Precision analytics, weakness detection, and complete test history saved in MongoDB.
                  </p>
                </div>
                <Link
                  to="/stiknex-typing"
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-center"
                >
                  <Plus size={15} />
                  <span>Take New Drill</span>
                </Link>
              </div>

              {/* Complete Test History Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    All Recorded Test Drills ({recentTests.length})
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Auto-saved from completed tests
                  </span>
                </div>

                {recentTests.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs font-mono space-y-3">
                    <Sparkles size={28} className="mx-auto text-amber-500/50" />
                    <p>No tests recorded yet! Jump into Speed Arena and complete a drill.</p>
                    <Link
                      to="/stiknex-typing"
                      className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Start Practicing
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <th className="py-2.5 font-bold">#</th>
                          <th className="py-2.5 font-bold">Mode &amp; Limit</th>
                          <th className="py-2.5 font-bold text-amber-600 dark:text-amber-400">WPM</th>
                          <th className="py-2.5 font-bold">Raw WPM</th>
                          <th className="py-2.5 font-bold">Accuracy</th>
                          <th className="py-2.5 font-bold">Consistency</th>
                          <th className="py-2.5 font-bold text-right">Date &amp; Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {recentTests.map((t, idx) => (
                          <tr key={t.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                            <td className="py-3 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="py-3 text-slate-800 dark:text-slate-200 capitalize">
                              {t.subMode || "time"} {t.timeLimit ? `(${t.timeLimit}s)` : ""}
                            </td>
                            <td className="py-3 text-amber-600 dark:text-amber-400 font-black text-sm">
                              {t.wpm}
                            </td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">
                              {t.rawWpm || t.wpm}
                            </td>
                            <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">
                              {t.accuracy}%
                            </td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">
                              {t.consistency || 90}%
                            </td>
                            <td className="py-3 text-slate-500 text-right">
                              {t.createdAt ? new Date(t.createdAt).toLocaleString() : "Just now"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STICKY NOTES WORKSPACE WITH CRUD & CLOUD SYNC */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Header with Add & Connect Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <StickyNote className="text-amber-500" />
                    <span>Sticky Notes Canvas Hub</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create, update, delete, and synchronize sticky notes with your MongoDB cloud database.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={openNewNoteModal}
                    className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Create Note</span>
                  </button>
                  <button
                    onClick={() => setSyncModalOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <QrCode size={14} className="text-amber-500" />
                    <span>QR Pair Sync</span>
                  </button>
                  <Link
                    to="/sticky-notes"
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>Open Canvas</span>
                  </Link>
                </div>
              </div>

              {/* Search, Filter & Cloud Sync Status Row */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 text-xs">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={notesSearch}
                    onChange={(e) => setNotesSearch(e.target.value)}
                    placeholder="Search sticky notes..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Color Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setNoteColorFilter("all")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                      noteColorFilter === "all"
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    All Colors ({notes?.length || 0})
                  </button>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.bg}
                      onClick={() => setNoteColorFilter(c.bg)}
                      className={`w-6 h-6 rounded-full border-2 transition cursor-pointer shrink-0 ${
                        noteColorFilter === c.bg ? "scale-110 border-slate-900 dark:border-white shadow-xs" : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.bg }}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Sync Button */}
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin text-amber-500" : ""} />
                  <span>Sync DB</span>
                </button>
              </div>

              {/* Notes Grid */}
              <div className="space-y-4">
                {filteredNotes.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-3">
                    <StickyNote size={36} className="mx-auto text-amber-500/50" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notesSearch || noteColorFilter !== "all" ? "No Matching Sticky Notes" : "No Sticky Notes Created Yet"}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {notesSearch
                        ? "Try clearing your search query or filter"
                        : "Create your first sticky note directly in the dashboard or open the canvas board!"}
                    </p>
                    <button
                      onClick={openNewNoteModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xs cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Post First Note</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((n, idx) => (
                      <div
                        key={n.id || idx}
                        className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161f] shadow-xs flex flex-col justify-between space-y-4 group hover:border-amber-500/40 transition"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: n.color || "#fef08a" }}
                            />
                            <span className="text-[10px] font-mono text-slate-400">
                              {n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : "Saved to Cloud"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-6 font-sans leading-relaxed whitespace-pre-wrap">
                            {n.text || n.content || "Empty note"}
                          </p>
                        </div>

                        {/* Action Bar: Edit, Delete, Open in Canvas */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <Link
                            to="/sticky-notes"
                            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open in Canvas</span>
                            <ArrowRight size={11} />
                          </Link>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditNoteModal(n)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="Edit Note Content"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(n.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Note"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ENCRYPTED NOTEBOOKS WITH FULL CRUD & CLOUD SYNC */}
          {activeTab === "notebooks" && (
            <div className="space-y-6">
              {/* Header with Create & Pair Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-indigo-500" />
                    <span>Encrypted Notebooks &amp; Journal</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage, create, rename, and synchronize your encrypted documents across all your devices.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={openNewNotebookModal}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Create Notebook</span>
                  </button>
                  <button
                    onClick={() => setSyncModalOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <QrCode size={14} className="text-indigo-500" />
                    <span>QR Pair Sync</span>
                  </button>
                  <Link
                    to="/online-notebook"
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>Launch Notebook</span>
                  </Link>
                </div>
              </div>

              {/* Search & Cloud Sync Status Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 text-xs">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={notebooksSearch}
                    onChange={(e) => setNotebooksSearch(e.target.value)}
                    placeholder="Search notebooks by title or folder..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    {notebooks.length} Documents in MongoDB Cloud
                  </span>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RefreshCw size={12} className={isSyncing ? "animate-spin text-indigo-500" : ""} />
                    <span>Sync DB</span>
                  </button>
                </div>
              </div>

              {/* Notebooks List Grid */}
              <div className="space-y-4">
                {filteredNotebooks.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-3">
                    <BookOpen size={36} className="mx-auto text-indigo-500/50" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notebooksSearch ? "No Matching Notebooks Found" : "No Notebooks Created Yet"}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {notebooksSearch
                        ? "Try clearing your search keyword"
                        : "Initialize your first encrypted notebook to store rich documents, journals, and project notes!"}
                    </p>
                    <button
                      onClick={openNewNotebookModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-xs cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Create First Notebook</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotebooks.map((nb, idx) => (
                      <div
                        key={nb.id || idx}
                        className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161f] shadow-xs flex flex-col justify-between space-y-4 group hover:border-indigo-500/40 transition"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold flex items-center gap-1">
                              <Shield size={11} />
                              <span>AES-256</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {nb.updatedAt ? new Date(nb.updatedAt).toLocaleDateString() : "Synced"}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition">
                              {nb.title || "Untitled Notebook"}
                            </h4>
                            {nb.folder && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 mt-1">
                                <Folder size={11} />
                                <span>{nb.folder}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Bar: Open, Edit Title, Delete */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <Link
                            to={`/online-notebook?id=${nb.id}`}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open in Editor</span>
                            <ArrowRight size={11} />
                          </Link>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditNotebookModal(nb)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="Rename Notebook"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNotebook(nb.id, nb.title)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Notebook"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Encryption & Cloud Specs Footer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero-Knowledge E2E</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Notes are encrypted in your browser using AES-256-GCM. The server never sees unencrypted text.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <QrCode size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instant QR Pairing</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Scan pairing QR code in Notebook topbar to instantly mirror your workspace between PC and mobile.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Offline-First Engine</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Local IndexedDB persistence ensures your notes remain editable without active internet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHITEBOARDS & SKETCHES */}
          {activeTab === "whiteboards" && (
            <div className="space-y-6">
              {/* Header with Create & Launch Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <PenTool className="text-purple-500" />
                    <span>Whiteboard Canvas &amp; Diagrams</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create, manage, rename, and sketch interactive Excalidraw diagrams and visual mind maps.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleCreateNewWhiteboard}
                    className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>New Drawing</span>
                  </button>
                  <Link
                    to="/whiteboard"
                    className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <ExternalLink size={14} />
                    <span>Open Fullscreen Canvas</span>
                  </Link>
                </div>
              </div>

              {/* Search & Stats Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 text-xs">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={whiteboardsSearch}
                    onChange={(e) => setWhiteboardsSearch(e.target.value)}
                    placeholder="Search drawings by title..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    {filteredWhiteboards.length} Vector Drawings
                  </span>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RefreshCw size={12} className={isSyncing ? "animate-spin text-purple-500" : ""} />
                    <span>Sync DB</span>
                  </button>
                </div>
              </div>

              {/* Whiteboards Grid */}
              <div className="space-y-4">
                {filteredWhiteboards.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 space-y-3">
                    <PenTool size={36} className="mx-auto text-purple-500/50" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {whiteboardsSearch ? "No Matching Drawings Found" : "No Whiteboards Created Yet"}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {whiteboardsSearch
                        ? "Try clearing your search keyword"
                        : "Start sketching your first wireframe, architecture diagram, or flowchart on the Excalidraw canvas!"}
                    </p>
                    <button
                      onClick={handleCreateNewWhiteboard}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-black text-xs shadow-xs cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Create First Drawing</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWhiteboards.map((wb, idx) => (
                      <div
                        key={wb.id || idx}
                        className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161f] shadow-xs flex flex-col justify-between space-y-4 group hover:border-purple-500/40 transition"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold flex items-center gap-1">
                              <PenTool size={11} />
                              <span>{Array.isArray(wb.elements) ? `${wb.elements.length} elements` : "Canvas"}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {wb.updatedAt ? new Date(wb.updatedAt).toLocaleDateString() : "Saved"}
                            </span>
                          </div>

                          {/* Canvas Icon Banner */}
                          <div
                            onClick={() => navigate(`/whiteboard?id=${wb.id}`)}
                            className="h-28 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 cursor-pointer group-hover:bg-purple-500/5 transition"
                          >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                              <PenTool size={20} />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 font-bold">
                              Click to Open Canvas
                            </span>
                          </div>

                          <div>
                            <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-500 transition">
                              {wb.title || "Untitled Drawing"}
                            </h4>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <Link
                            to={`/whiteboard?id=${wb.id}`}
                            className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open in Whiteboard</span>
                            <ArrowRight size={11} />
                          </Link>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditWhiteboardModal(wb)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="Rename Drawing"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteWhiteboard(wb.id, wb.title)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Drawing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LEADERBOARD STANDING */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              {/* Leaderboard Component */}
              <TypingLeaderboard theme={darkMode ? "dark" : "light"} />
            </div>
          )}

          {/* TAB 6: SETTINGS & ACCOUNT SECURITY */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="text-amber-500" />
                    <span>Account Profile &amp; Workspace Security</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your personal Stiknex account credentials and collision-proof unique identifier.
                  </p>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-sans block">
                      {profile?.name}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unique Collision-Proof Username</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400 block">
                        @{profile?.username}
                      </span>
                      <button
                        onClick={handleCopyUsername}
                        className="px-2 py-0.5 rounded bg-black/20 text-slate-400 hover:text-white transition"
                      >
                        {copiedUser ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                      {profile?.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {profile?.phone || "Not linked"}
                    </span>
                  </div>
                </div>

                {/* Cloud Sync Pairing Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <QrCode size={14} className="text-amber-500" />
                      <span>Device Cloud Sync &amp; QR Pairing</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Mirror this workspace to your phone or another laptop with encrypted QR pairing.
                    </p>
                  </div>
                  <button
                    onClick={() => setSyncModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Smartphone size={14} />
                    <span>Pair Device via QR</span>
                  </button>
                </div>

                {/* Data Backup & Export */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Export Workspace Backup</h4>
                    <p className="text-[11px] text-slate-500">
                      Download a complete JSON archive of your typing telemetry and sticky notes.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Sign Out Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Account Session</h4>
                    <p className="text-[11px] text-slate-500">
                      Sign out of this browser session on your current device.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MODAL: CLOUD SYNC & QR PAIRING MODAL
      ───────────────────────────────────────────────────────────── */}
      <NotebookSyncModal
        isOpen={syncModalOpen}
        onClose={() => {
          setSyncModalOpen(false);
          setSyncIdentity(getSyncIdentity());
        }}
        darkMode={darkMode}
      />

      {/* ─────────────────────────────────────────────────────────────
          5. MODAL: STICKY NOTE CREATE / EDIT MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {noteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <StickyNote className="text-amber-500" size={18} />
                  <span>{editingNote ? "Edit Sticky Note" : "Create Sticky Note"}</span>
                </h3>
                <button
                  onClick={() => setNoteModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveNoteForm} className="space-y-4">
                {/* Note Content Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Note Content</label>
                  <textarea
                    rows={5}
                    value={noteFormText}
                    onChange={(e) => setNoteFormText(e.target.value)}
                    placeholder="Write your note, idea, or reminder..."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs font-sans leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* Color Palette Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Card Color</label>
                  <div className="flex items-center gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.bg}
                        type="button"
                        onClick={() => setNoteFormColor(c.bg)}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          noteFormColor === c.bg ? "scale-110 border-slate-900 dark:border-white shadow-xs" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.bg }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setNoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                  >
                    {editingNote ? "Save Changes" : "Post Note"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL: NOTEBOOK CREATE / EDIT MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {notebookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-indigo-500" size={18} />
                  <span>{editingNotebook ? "Edit Notebook Title" : "New Encrypted Notebook"}</span>
                </h3>
                <button
                  onClick={() => setNotebookModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveNotebookForm} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Notebook Title</label>
                  <input
                    type="text"
                    value={notebookFormTitle}
                    onChange={(e) => setNotebookFormTitle(e.target.value)}
                    placeholder="e.g. Daily Journal, Project Roadmap..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs font-sans"
                    required
                  />
                </div>

                {/* Optional Folder / Tag */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Category / Folder (Optional)</label>
                  <input
                    type="text"
                    value={notebookFormFolder}
                    onChange={(e) => setNotebookFormFolder(e.target.value)}
                    placeholder="e.g. Work, Research, Personal..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs font-sans"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setNotebookModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    {editingNotebook ? "Save Changes" : "Create Notebook"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ─────────────────────────────────────────────────────────────
          7. MODAL: WHITEBOARD RENAME / EDIT MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {whiteboardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool className="text-purple-500" size={18} />
                  <span>Rename Whiteboard Sketch</span>
                </h3>
                <button
                  onClick={() => setWhiteboardModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveWhiteboardForm} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Sketch Title</label>
                  <input
                    type="text"
                    value={whiteboardFormTitle}
                    onChange={(e) => setWhiteboardFormTitle(e.target.value)}
                    placeholder="e.g. System Architecture, Sprint Wireframe..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs font-sans"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setWhiteboardModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Save Title
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
