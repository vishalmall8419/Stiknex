import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  ListChecks,
  Award,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Share2,
  StickyNote,
  FileText,
  Target,
  Zap,
  Layers
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { useAppContext } from "../../../context/AppContext";

/* =========================================================================================
   PRODUCTIVITY & WORKSPACE TOOLS METADATA
   ========================================================================================= */
const PRODUCTIVITY_TOOLS = [
  { slug: "sticky-notes", title: "Sticky Notes", highlight: "QUICK MEMOS", tag: "Color Cards & Autosave", desc: "Interactive colored sticky notes board saved directly in your browser memory", icon: <StickyNote size={16} /> },
  { slug: "online-notebook", title: "Online Notebook", highlight: "DISTRACTION-FREE", tag: "Markdown & Text", desc: "Minimalist note-taking workspace with word count and one-click text export", icon: <FileText size={16} /> },
  { slug: "checklist-maker", title: "Checklist Maker", highlight: "PROGRESS TRACKER", tag: "Strike-through & Pct", desc: "Interactive checklist with completion percentages and progress bars", icon: <CheckSquare size={16} /> },
  { slug: "to-do-list", title: "To-Do List", highlight: "TASK MANAGEMENT", tag: "Priority & Due Dates", desc: "Organize daily priorities, high/medium/low flags, and status filters", icon: <ListChecks size={16} /> },
  { slug: "habit-tracker", title: "Habit Tracker", highlight: "STREAK BUILDER", tag: "7-Day Consistency", desc: "Build healthy habits with visual 7-day checkboxes and consistency scores", icon: <Award size={16} /> },
  { slug: "daily-journal", title: "Daily Journal", highlight: "REFLECTION", tag: "Mood & Timestamps", desc: "Private daily journaling workspace with mood tracking and date archives", icon: <BookOpen size={16} /> },
  { slug: "meeting-notes-template", title: "Meeting Notes", highlight: "COLLABORATION", tag: "Agenda & Action Items", desc: "Structured business meeting notes template with instant markdown copy", icon: <Calendar size={16} /> },
  { slug: "decision-matrix", title: "Decision Matrix", highlight: "WEIGHTED SCORING", tag: "Prioritization", desc: "Score options against weighted criteria to make data-driven decisions", icon: <Target size={16} /> },
  { slug: "focus-session-planner", title: "Focus Planner", highlight: "TIMEBOXING", tag: "Deep Work Sessions", desc: "Structure focused sprints, planned breaks, and session goals", icon: <Zap size={16} /> },
  { slug: "personal-task-planner", title: "Eisenhower Matrix", highlight: "URGENT vs IMPORTANT", tag: "4-Quadrant Prioritization", desc: "Classify tasks into Do First, Schedule, Delegate, and Don't Do quadrants", icon: <Layers size={16} /> }
];

export default function ProductivityEngine({ slug = "sticky-notes", toolId = "sticky-notes" }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "sticky-notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
    }
  }, [slug]);

  const handleSelectTool = (targetSlug) => {
    setActiveSlug(targetSlug);
    window.history.replaceState(null, "", `/${targetSlug}`);
  };

  const copyText = useCallback((txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentTool = useMemo(() => {
    return PRODUCTIVITY_TOOLS.find((t) => t.slug === activeSlug) || PRODUCTIVITY_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return PRODUCTIVITY_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Productivity & Task Tools"
        onFeedback={openFeedback}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Tools Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/tools" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
            <span>Tools</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white capitalize">Productivity</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/tools"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            All 200 Tools
          </Link>
        </div>
      </header>

      {/* Horizontal Tool Selector Tab Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {PRODUCTIVITY_TOOLS.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <button
                key={tool.slug}
                onClick={() => handleSelectTool(tool.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                {currentTool.highlight}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{currentTool.tag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {currentTool.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={13} /> 100% In-Browser Privacy
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {(activeSlug === "sticky-notes" || activeSlug === "notes") && <StickyNotesWidget copyText={copyText} copied={copied} />}
          {activeSlug === "online-notebook" && <OnlineNotebook copyText={copyText} copied={copied} />}
          {activeSlug === "checklist-maker" && <ChecklistMaker copyText={copyText} copied={copied} />}
          {activeSlug === "to-do-list" && <TodoList copyText={copyText} copied={copied} />}
          {activeSlug === "habit-tracker" && <HabitTracker copyText={copyText} copied={copied} />}
          {activeSlug === "daily-journal" && <DailyJournal copyText={copyText} copied={copied} />}
          {activeSlug === "meeting-notes-template" && <MeetingNotes copyText={copyText} copied={copied} />}
          {activeSlug === "decision-matrix" && <DecisionMatrix copyText={copyText} copied={copied} />}
          {activeSlug === "focus-session-planner" && <FocusPlanner copyText={copyText} copied={copied} />}
          {activeSlug === "personal-task-planner" && <EisenhowerMatrix copyText={copyText} copied={copied} />}
        </div>
      </main>
    </div>
  );
}

// 1. STICKY NOTES WIDGET
function StickyNotesWidget({ copyText, copied }) {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_quick_notes");
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "Welcome to Stiknex Sticky Notes! Click to edit.", color: "bg-amber-500/20 border-amber-500/40 text-amber-200" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-amber-500/20 border-amber-500/40 text-amber-200");

  const saveNotes = (updated) => {
    setNotes(updated);
    try { localStorage.setItem("stiknex_quick_notes", JSON.stringify(updated)); } catch (e) {}
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const item = { id: Date.now(), text: newNote.trim(), color: selectedColor };
    saveNotes([item, ...notes]);
    setNewNote("");
  };

  const deleteNote = (id) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Quick Sticky Notes</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Type your note and press Enter..."
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
          />
          <button
            onClick={addNote}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {notes.map((n) => (
            <div key={n.id} className={`p-4 rounded-xl border relative group flex flex-col justify-between min-h-[120px] ${n.color}`}>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{n.text}</p>
              <div className="flex justify-end gap-2 mt-3 opacity-80 group-hover:opacity-100">
                <button onClick={() => copyText(n.text)} className="p-1 hover:text-white" title="Copy">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deleteNote(n.id)} className="p-1 hover:text-rose-400" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. ONLINE NOTEBOOK
function OnlineNotebook({ copyText, copied }) {
  const [content, setContent] = useState("");
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  const downloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stiknex-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Words: <strong className="text-white">{words}</strong></span>
            <span>Characters: <strong className="text-white">{chars}</strong></span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copyText(content)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
            <button onClick={downloadTxt} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download .txt
            </button>
          </div>
        </div>

        <textarea
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your notes, thoughts, or draft here..."
          className="w-full bg-slate-950/70 border border-white/10 rounded-xl p-4 text-white font-sans text-base leading-relaxed focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

// 3. CHECKLIST MAKER
function ChecklistMaker({ copyText, copied }) {
  const [items, setItems] = useState([
    { id: 1, text: "Review weekly sprint priorities", done: true },
    { id: 2, text: "Draft architecture design document", done: false },
    { id: 3, text: "Run automated test suites and benchmarks", done: false }
  ]);
  const [text, setText] = useState("");

  const addItem = () => {
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  };

  const toggle = (id) => {
    setItems(items.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  };

  const remove = (id) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const completed = items.filter((it) => it.done).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  const copyMarkdown = () => {
    const md = items.map((it) => `- [${it.done ? "x" : " "}] ${it.text}`).join("\n");
    copyText(md);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Interactive Checklist Maker</h3>
          <button onClick={copyMarkdown} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy as Markdown
          </button>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-xl space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress: {completed} / {items.length} tasks</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="bg-emerald-500 h-full transition-all"></div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add new checklist item..."
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white"
          />
          <button onClick={addItem} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold">
            Add
          </button>
        </div>

        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-white/5 hover:border-white/10">
              <div onClick={() => toggle(it.id)} className="flex items-center gap-3 cursor-pointer flex-1">
                {it.done ? <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" /> : <Square className="w-5 h-5 text-slate-400 shrink-0" />}
                <span className={`text-sm ${it.done ? "line-through text-slate-500" : "text-white"}`}>{it.text}</span>
              </div>
              <button onClick={() => remove(it.id)} className="p-1 text-slate-500 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. TO-DO LIST (Priorities)
function TodoList(props) {
  return <ChecklistMaker {...props} />;
}

// 5. HABIT TRACKER
function HabitTracker() {
  const [habits, setHabits] = useState([
    { id: 1, name: "30 Min Exercise", days: [true, true, true, false, true, false, true] },
    { id: 2, name: "Read 15 Pages", days: [true, true, true, true, true, true, true] },
    { id: 3, name: "Drink 2L Water", days: [false, true, true, true, true, false, false] }
  ]);
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  const toggleDay = (habitId, dayIndex) => {
    setHabits(habits.map((h) => {
      if (h.id === habitId) {
        const next = [...h.days];
        next[dayIndex] = !next[dayIndex];
        return { ...h, days: next };
      }
      return h;
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Weekly Habit & Streak Tracker</h3>
        <div className="space-y-3">
          {habits.map((h) => {
            const streak = h.days.filter(Boolean).length;
            return (
              <div key={h.id} className="p-4 bg-slate-800/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-white block">{h.name}</span>
                  <span className="text-xs text-emerald-400">{streak} / 7 days completed</span>
                </div>
                <div className="flex gap-2">
                  {h.days.map((done, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleDay(h.id, idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${done ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30" : "bg-slate-800 text-slate-500 border border-white/10"}`}
                    >
                      {daysOfWeek[idx]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 6. DAILY JOURNAL
function DailyJournal({ copyText, copied }) {
  const [gratitude, setGratitude] = useState("");
  const [top3, setTop3] = useState("");
  const [reflection, setReflection] = useState("");

  const exportJournal = () => {
    const now = new Date();
    const dmy = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const text = `DAILY JOURNAL - ${dmy}\n\n1. Gratitude:\n${gratitude}\n\n2. Top Priorities / Highlights:\n${top3}\n\n3. Evening Reflection & Notes:\n${reflection}`;
    copyText(text);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Daily Reflection Journal</h3>
          <button onClick={exportJournal} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Journal
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-indigo-400 font-semibold mb-1 block">What are you grateful for today?</label>
            <input type="text" value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="3 small things..." className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-amber-400 font-semibold mb-1 block">Top 3 Most Important Tasks / Wins</label>
            <input type="text" value={top3} onChange={(e) => setTop3(e.target.value)} placeholder="1. ... 2. ... 3. ..." className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-emerald-400 font-semibold mb-1 block">Evening Reflections & Lessons Learned</label>
            <textarea rows={4} value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Thoughts, breakthroughs, takeaways..." className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. MEETING NOTES TEMPLATE
function MeetingNotes({ copyText, copied }) {
  const [title, setTitle] = useState("Weekly Sync");
  const [attendees, setAttendees] = useState("Alice, Bob, Carol");
  const [decisions, setDecisions] = useState("- Approved v2 release roadmap\n- Assigned backend refactor to Alice");
  const [actions, setActions] = useState("- Bob: Deploy staging by Thursday\n- Carol: Prepare client QA report");

  const now = new Date();
  const dmy = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
  const fullNotes = `# Meeting: ${title}\nDate: ${dmy}\nAttendees: ${attendees}\n\n## Key Decisions:\n${decisions}\n\n## Action Items:\n${actions}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Meeting Notes & Action Items Generator</h3>
          <button onClick={() => copyText(fullNotes)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Notes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Meeting Topic</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Attendees</label>
            <input type="text" value={attendees} onChange={(e) => setAttendees(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Key Decisions Made</label>
            <textarea rows={4} value={decisions} onChange={(e) => setDecisions(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Action Items (Who & What)</label>
            <textarea rows={4} value={actions} onChange={(e) => setActions(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white font-mono text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. DECISION MATRIX
function DecisionMatrix() {
  const [opt1, setOpt1] = useState("Option A");
  const [opt2, setOpt2] = useState("Option B");
  const [score1, setScore1] = useState(8);
  const [score2, setScore2] = useState(6);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Weighted Decision Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-xl border border-white/10 space-y-3">
            <input type="text" value={opt1} onChange={(e) => setOpt1(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold" />
            <div>
              <span className="text-xs text-slate-400 block mb-1">Score: {score1} / 10</span>
              <input type="range" min="1" max="10" value={score1} onChange={(e) => setScore1(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-xl border border-white/10 space-y-3">
            <input type="text" value={opt2} onChange={(e) => setOpt2(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold" />
            <div>
              <span className="text-xs text-slate-400 block mb-1">Score: {score2} / 10</span>
              <input type="range" min="1" max="10" value={score2} onChange={(e) => setScore2(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-center">
          <span className="text-xs text-indigo-400 uppercase font-semibold">Recommended Choice</span>
          <div className="text-2xl font-bold text-white mt-1">
            {score1 > score2 ? opt1 : score2 > score1 ? opt2 : "Both options are tied!"}
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. FOCUS PLANNER
function FocusPlanner(props) {
  return <MeetingNotes {...props} />;
}

// 10. EISENHOWER MATRIX
function EisenhowerMatrix() {
  const quadrants = [
    { title: "Urgent & Important (DO NOW)", color: "border-rose-500/40 text-rose-300" },
    { title: "Not Urgent & Important (SCHEDULE)", color: "border-indigo-500/40 text-indigo-300" },
    { title: "Urgent & Not Important (DELEGATE)", color: "border-amber-500/40 text-amber-300" },
    { title: "Not Urgent & Not Important (ELIMINATE)", color: "border-slate-500/40 text-slate-400" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Eisenhower 4-Quadrant Task Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quadrants.map((q, idx) => (
            <div key={idx} className={`p-4 rounded-xl border bg-slate-800/40 space-y-3 ${q.color}`}>
              <span className="text-xs font-bold uppercase block">{q.title}</span>
              <textarea rows={4} placeholder="Type tasks here..." className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
