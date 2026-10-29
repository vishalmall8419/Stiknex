import { useState, useEffect, useMemo } from "react";
import { CheckSquare, Square, Plus, Trash2, Copy, Check, Download, Calendar, Sparkles, BookOpen, Clock, ListChecks, Award } from "lucide-react";

export default function ProductivityEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "online-notebook") return <OnlineNotebook copyText={copyText} copied={copied} />;
  if (slug === "checklist-maker") return <ChecklistMaker copyText={copyText} copied={copied} />;
  if (slug === "to-do-list") return <TodoList copyText={copyText} copied={copied} />;
  if (slug === "habit-tracker") return <HabitTracker copyText={copyText} copied={copied} />;
  if (slug === "daily-journal") return <DailyJournal copyText={copyText} copied={copied} />;
  if (slug === "meeting-notes-template") return <MeetingNotes copyText={copyText} copied={copied} />;
  if (slug === "decision-matrix") return <DecisionMatrix copyText={copyText} copied={copied} />;
  if (slug === "focus-session-planner") return <FocusPlanner copyText={copyText} copied={copied} />;
  if (slug === "personal-task-planner") return <EisenhowerMatrix copyText={copyText} copied={copied} />;

  // Default: Sticky Notes preview / widget
  return <StickyNotesWidget copyText={copyText} copied={copied} />;
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
    const text = `DAILY JOURNAL - ${new Date().toLocaleDateString()}\n\n1. Gratitude:\n${gratitude}\n\n2. Top Priorities / Highlights:\n${top3}\n\n3. Evening Reflection & Notes:\n${reflection}`;
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

  const fullNotes = `# Meeting: ${title}\nDate: ${new Date().toLocaleDateString()}\nAttendees: ${attendees}\n\n## Key Decisions:\n${decisions}\n\n## Action Items:\n${actions}`;

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
