import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import AppShell from "../../Component/Layout/AppShell";
import { useAppContext } from "../../context/AppContext";
import PageSEO from "../../Component/SEO/PageSEO";
import Draggable from "react-draggable";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { getSyncIdentity, pushToCloud } from "../Notebook/notebookSyncManager";
import { deleteImageFromDb, getImageFromDb, saveImageToDb } from "../Notebook/notebookStorage";
import NotebookSyncModal from "../Notebook/NotebookSyncModal";

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

const compressImage = (file) => new Promise((resolve, reject) => {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      reject(new Error("Could not prepare this image."));
      return;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let dataUrl = canvas.toDataURL("image/webp", 0.72);
    if (dataUrl.length > 900000) dataUrl = canvas.toDataURL("image/webp", 0.48);
    if (dataUrl.length > 1400000) {
      reject(new Error("This image is too large to save. Choose a smaller image."));
      return;
    }
    resolve(dataUrl);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error("Could not read the selected image."));
  };
  image.src = objectUrl;
});

const SEARCH_STOP_WORDS = new Set([
  "a", "about", "an", "and", "are", "for", "find", "from", "i", "in", "is", "it",
  "me", "my", "of", "on", "or", "please", "show", "the", "to", "where", "with",
  "ka", "ke", "ki", "kya", "kahan", "kaha", "hai", "hain", "tha", "thi", "the",
  "me", "mein", "par", "se", "aur", "mera", "meri", "mere", "mujhe", "dikhao",
  "batao", "wala", "wali", "wale",
]);

const SEARCH_CONCEPTS = {
  task: ["todo", "checklist", "action", "actions", "item", "items", "to-do"],
  todo: ["task", "checklist", "action", "actions"],
  checklist: ["task", "todo", "action", "actions"],
  meeting: ["meet", "client", "discussion", "agenda", "call"],
  meet: ["meeting", "client", "discussion", "agenda", "call"],
  screenshot: ["image", "photo", "picture", "attachment"],
  image: ["screenshot", "photo", "picture", "attachment"],
  photo: ["image", "screenshot", "picture"],
  idea: ["ideas", "plan", "planning", "brainstorm"],
  plan: ["planning", "idea", "ideas", "todo", "task"],
  link: ["url", "website", "web"],
  url: ["link", "website", "web"],
  reminder: ["date", "time", "deadline", "due"],
  deadline: ["date", "time", "reminder", "due"],
};

const getStickyNoteSearchScore = (note, query) => {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = [...new Set(
    normalizedQuery
      .split(/[^\p{L}\p{N}-]+/u)
      .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token)),
  )];
  if (!queryTokens.length) return normalizedQuery ? 0 : 1;

  const fields = [
    { value: note.title, weight: 8 },
    { value: note.des, weight: 4 },
    { value: (note.tags || []).join(" "), weight: 6 },
    { value: (note.tasks || []).map((task) => task.text).join(" "), weight: 7 },
    { value: (note.links || []).join(" "), weight: 3 },
    { value: (note.images || []).map((image) => image.name).join(" "), weight: 3 },
  ].map(({ value, weight }) => ({ text: String(value || "").toLowerCase(), weight }));

  let score = fields.reduce(
    (total, { text, weight }) => total + (normalizedQuery.length > 2 && text.includes(normalizedQuery) ? weight * 2 : 0),
    0,
  );
  let matchedTokens = 0;
  for (const token of queryTokens) {
    const concepts = SEARCH_CONCEPTS[token] || [];
    const variants = [token, ...concepts];
    let bestMatch = 0;
    for (const { text, weight } of fields) {
      if (variants.some((variant) => text.includes(variant))) bestMatch = Math.max(bestMatch, weight);
    }
    if (bestMatch) {
      matchedTokens += 1;
      score += bestMatch;
    }
  }

  if (!matchedTokens) return 0;
  score = score * (0.65 + 0.35 * (matchedTokens / queryTokens.length));
  if (queryTokens.some((token) => ["task", "todo", "checklist", "action"].includes(token)) && note.kind === "todo") score += 5;
  if (queryTokens.some((token) => ["document", "documents", "doc", "notes"].includes(token)) && note.kind === "document") score += 5;
  return score;
};

const getTimelineTimestamp = (note) => {
  const timestamp = new Date(note.reminderAt || note.createdAt || note.updatedAt || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getTimelineDateKey = (timestamp) => {
  const date = new Date(timestamp);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const groupTimelineNotes = (notes) => {
  const groups = [];
  [...notes]
    .sort((a, b) => getTimelineTimestamp(a) - getTimelineTimestamp(b))
    .forEach((note) => {
      const timestamp = getTimelineTimestamp(note);
      const dateKey = getTimelineDateKey(timestamp);
      let group = groups[groups.length - 1];
      if (!group || group.dateKey !== dateKey) {
        group = { dateKey, notes: [] };
        groups.push(group);
      }
      group.notes.push(note);
    });
  return groups;
};

const parseNaturalDate = (text, referenceDate = new Date(), inferredYear = referenceDate.getFullYear()) => {
  const date = new Date(referenceDate);
  date.setHours(9, 0, 0, 0);
  let match = text.match(/\b(today|tomorrow|kal|parso|aaj)\b/i);
  let remaining = text;

  if (match) {
    const relativeDay = match[1].toLowerCase();
    date.setDate(date.getDate() + (["tomorrow", "kal"].includes(relativeDay) ? 1 : relativeDay === "parso" ? 2 : 0));
    remaining = remaining.replace(match[0], " ");
  } else {
    match = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
    if (match) {
      date.setFullYear(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      remaining = remaining.replace(match[0], " ");
    } else {
      match = text.match(/\b(\d{1,2})[/. -](\d{1,2})(?:[/. -](\d{2,4}))?\b/);
      if (match) {
        const year = match[3] ? Number(match[3]) + (Number(match[3]) < 100 ? 2000 : 0) : inferredYear;
        const first = Number(match[1]);
        const second = Number(match[2]);
        const month = first > 12 ? second : second > 12 ? first : second;
        const day = first > 12 ? first : second > 12 ? second : first;
        const parsedDate = new Date(year, month - 1, day, 9, 0, 0, 0);
        if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) return null;
        date.setTime(parsedDate.getTime());
        remaining = remaining.replace(match[0], " ");
      } else {
        match = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*(?:ko|tarikh)\b/i);
        if (match) {
          const day = Number(match[1]);
          let year = date.getFullYear();
          let month = date.getMonth();
          if (day < date.getDate()) {
            month += 1;
            if (month > 11) {
              month = 0;
              year += 1;
            }
          }
          const parsedDate = new Date(year, month, day, 9, 0, 0, 0);
          if (parsedDate.getDate() !== day) return null;
          date.setTime(parsedDate.getTime());
          remaining = remaining.replace(match[0], " ");
        } else {
          const months = "january february march april may june july august september october november december".split(" ");
          const monthPattern = months.map((month) => `${month.slice(0, 3)}\\w*`).join("|");
          match = text.match(new RegExp(`\\b(?:(${monthPattern})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(20\\d{2}))?|(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthPattern})(?:\\s+(20\\d{2}))?)\\b`, "i"));
        if (match) {
          const monthName = (match[1] || match[5]).toLowerCase().slice(0, 3);
          const month = months.findIndex((value) => value.startsWith(monthName));
          const day = Number(match[2] || match[4]);
          const year = Number(match[3] || match[6] || inferredYear);
          const parsedDate = new Date(year, month, day, 9, 0, 0, 0);
          if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month || parsedDate.getDate() !== day) return null;
          date.setTime(parsedDate.getTime());
          remaining = remaining.replace(match[0], " ");
        } else {
          match = text.match(/\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
          if (match) {
            const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const targetDay = weekdays.indexOf(match[2].toLowerCase());
            let daysAhead = (targetDay - date.getDay() + 7) % 7;
            if (daysAhead === 0 || match[1]) daysAhead += 7;
            date.setDate(date.getDate() + daysAhead);
            remaining = remaining.replace(match[0], " ");
          } else {
            return null;
          }
        }
        }
      }
    }
  }

  const timeMatch = remaining.match(/\b(\d{1,2})(?::([0-5]\d))?\s*(am|pm|baje|bajey)\b|\b([01]?\d|2[0-3]):([0-5]\d)\b/i);
  if (timeMatch) {
    let hours = Number(timeMatch[1] || timeMatch[4]);
    const minutes = Number(timeMatch[2] || timeMatch[5] || 0);
    if (timeMatch[3] && ["am", "pm"].includes(timeMatch[3].toLowerCase())) {
      hours = (hours % 12) + (timeMatch[3].toLowerCase() === "pm" ? 12 : 0);
    }
    date.setHours(hours, minutes, 0, 0);
    remaining = remaining.replace(timeMatch[0], " ");
  }

  if (!Number.isFinite(date.getTime())) return null;
  return {
    date,
    remaining: remaining
      .replace(/^\s*(?:ko|tarikh)\b[:,\s-]*/i, "")
      .replace(/\b(?:on|at|by|the|around)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  };
};

const stripCreationInstruction = (text, type) => {
  const withoutLeadIn = text
    .replace(/^\s*(?:(?:please|mujhe|is|iska|iski|is\s+ka|is\s+ki|this|my)\s+)*/i, "")
    .replace(/^\s*(?:i\s+(?:want|need)\s+to|can\s+you|could\s+you)\s+/i, "")
    .replace(type === "timeline" ? /^(?:(?:please\s+)?(?:create|make|build|generate)\s+(?:a\s+)?timeline|timeline\s+(?:banao|bana(?:o)?|create|make|build|generate))\b/i : /^(?:(?:please\s+)?(?:create|make|build|generate)\s+(?:a\s+)?mind[\s-]?map|mind[\s-]?map\s+(?:banao|bana(?:o)?|create|make|build|generate))\b/i, "")
    .replace(/^\s*(?:kru|karu|karo|de|do|for|about|of|mein|me|ke\s+liye)\s+/i, "");
  return withoutLeadIn.replace(/^\s*[:,\-–]\s*/, "").trim();
};

const isCreationCommand = (text, type) => {
  const concept = type === "timeline" ? /\btime\s*line\b/i : /\bmind[\s-]?map\b/i;
  return concept.test(text) && /\b(?:create|make|build|generate|banao|bana(?:o|iye)?|bana\s+(?:do|de))\b/i.test(text);
};

const toLocalDateTime = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const splitTimelineEvents = (content) => content
  .split(/\r?\n+|;\s*/)
  .flatMap((paragraph) => {
    const datedMarkers = [...paragraph.matchAll(/(?:^|[\s,])(\d{1,2})(?:st|nd|rd|th)?\s*(?:ko|tarikh)\b/gi)];
    if (datedMarkers.length > 1) {
      return datedMarkers.map((marker, index) => {
        const start = marker.index + marker[0].lastIndexOf(marker[1]);
        const end = datedMarkers[index + 1]?.index ?? paragraph.length;
        return paragraph.slice(start, end).trim();
      });
    }

    return paragraph
      .split(/,\s*(?!20\d{2}\b)|[.!?]\s+(?=[A-Z0-9])/)
      .map((event) => event.trim());
  })
  .map((event) => event.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
  .filter(Boolean);

const parseMindMapOutline = (content) => {
  const normalizedContent = content
    .replace(/\b(?:including|includes|covering|such as|with topics?)\b\s*/gi, ": ")
    .replace(/\b(?:about|on)\s+/i, "");
  const rawLines = normalizedContent
    .split(/\r?\n+|;\s*/)
    .map((line) => ({
      depth: (line.match(/^\s*/)?.[0].length || 0) + (line.match(/^\s*(?:[-*•]|\d+[.)])\s+/) ? 2 : 0),
      value: line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim(),
    }))
    .filter((line) => line.value);

  if (!rawLines.length) return [{ depth: 0, title: "Mind Map", des: "" }];
  if (rawLines.length === 1) {
    const [rootValue, ...topicValues] = rawLines[0].value.split(/\s*:\s*|\s*,\s*/).map((value) => value.trim()).filter(Boolean);
    if (topicValues.length) {
      return [
        { depth: 0, ...splitMindMapLabel(rootValue) },
        ...topicValues.map((value) => ({ depth: 2, ...splitMindMapLabel(value) })),
      ];
    }

    const sentenceParts = rootValue.split(/(?<=[.!?])\s+/);
    const title = sentenceParts.shift()?.replace(/[.!?]+$/, "").trim() || "Mind Map";
    return [{ depth: 0, title, des: sentenceParts.join(" ").trim() }];
  }

  const [first, ...rest] = rawLines;
  const firstDepth = first.depth === 0 ? 0 : 0;
  return [
    { depth: firstDepth, ...splitMindMapLabel(first.value) },
    ...rest.map((line) => ({ depth: Math.max(1, line.depth), ...splitMindMapLabel(line.value) })),
  ];
};

const splitMindMapLabel = (value) => {
  const [title, ...descriptionParts] = value.split(/\s*:\s*/);
  let cleanTitle = title.trim();
  let description = descriptionParts.join(":").trim();
  if (!description && cleanTitle.length > 72) {
    const sentenceParts = cleanTitle.split(/(?<=[.!?])\s+/);
    if (sentenceParts.length > 1 && sentenceParts[0].length <= 72) {
      cleanTitle = sentenceParts.shift();
      description = sentenceParts.join(" ").trim();
    } else {
      const words = cleanTitle.split(/\s+/);
      cleanTitle = words.slice(0, 7).join(" ");
      description = words.slice(7).join(" ");
    }
  }
  return { title: cleanTitle, des: description };
};

const StickyNote = ({
  note,
  updateNote,
  deleteNote,
  restoreNote,
  permanentlyDeleteNote,
  onAddImages,
  onRemoveImage,
  imageSources,
  connectingFrom,
  onConnectClick,
  onAddBranch,
  isMindMap = false,
  hideTitle = false,
  zoom,
  bringToFront,
  isDraggable = true,
}) => {
  const updateXarrow = useXarrow();
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);
  const imageInputRef = useRef(null);
  const [taskDraft, setTaskDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!nodeRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

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
  const kindIcon = note.kind === "todo"
    ? "fa-regular fa-square-check text-amber-600 dark:text-amber-300"
    : note.kind === "document"
      ? "fa-regular fa-file-lines text-blue-600 dark:text-blue-300"
      : note.images?.length
        ? "fa-regular fa-image text-indigo-600 dark:text-indigo-300"
        : note.links?.length
          ? "fa-solid fa-link text-emerald-600 dark:text-emerald-300"
          : "fa-regular fa-lightbulb text-fuchsia-600 dark:text-fuchsia-300";
  
  const isTarget = connectingFrom && connectingFrom !== note.id;

  // Fallback for old notes without x, y
  const stableOffset = String(note.id || "").split("").reduce((value, char) => (value * 31 + char.charCodeAt(0)) % 200, 0) - 100;
  const defaultX = note.x !== undefined ? note.x : 3000 + stableOffset;
  const defaultY = note.y !== undefined ? note.y : 3000 - stableOffset;

  const noteBody = (
    <div
        ref={nodeRef}
        style={{ zIndex: note.zIndex || 1 }}
        onMouseDown={() => bringToFront && bringToFront(note.id)}
        onTouchStart={() => bringToFront && bringToFront(note.id)}
        id={`note-${note.id}`} 
        className={`${isDraggable ? "absolute w-64 min-h-[160px]" : "relative w-full min-h-[160px]"} shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] rounded-xl group flex flex-col ${bgColor} ${isTarget ? 'ring-2 ring-green-400 cursor-crosshair' : ''} hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-shadow backdrop-blur-sm`}
      >
        {isTarget && (
          <div className="absolute inset-0 z-10" onClick={() => onConnectClick(note.id)}></div>
        )}

        <div className="relative z-20 flex items-center gap-2 px-3 pt-3">
          <span className="drag-grip flex h-7 w-7 shrink-0 cursor-move items-center justify-center rounded-lg bg-black/5 text-sm dark:bg-white/10" title={isDraggable ? "Drag note" : undefined}>
            <i className={kindIcon}></i>
          </span>
          {!(hideTitle || (isMindMap && note.isMindMap)) && (
            <input
              type="text"
              value={note.title || ""}
              onChange={(e) => updateNote(note.id, { title: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder-gray-500/50 dark:text-gray-100 dark:placeholder-gray-400/50"
              placeholder={note.kind === "todo" ? "Task list title" : "Title"}
            />
          )}
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-black/5 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-indigo-300" title="Note options" aria-label="Open note options" aria-expanded={menuOpen}>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          {menuOpen && (
            <div className="absolute right-2 top-11 z-50 max-h-[min(70vh,28rem)] w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" onPointerDown={(event) => event.stopPropagation()} onMouseDown={(event) => event.stopPropagation()} onTouchStart={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })} className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                  <i className={`${note.isFavorite ? "fa-solid" : "fa-regular"} fa-star text-amber-500`}></i>{note.isFavorite ? "Remove favorite" : "Add to favorites"}
                </button>
                {!note.trashedAt && <button type="button" onClick={() => updateNote(note.id, { isPinned: !note.isPinned })} className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                  <i className="fa-solid fa-thumbtack text-amber-500"></i>{note.isPinned ? "Unpin" : "Pin"}
                </button>}
              </div>
              {!note.trashedAt && <button type="button" onClick={() => { onConnectClick(note.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                <i className="fa-solid fa-arrow-right-arrow-left text-blue-500"></i>{connectingFrom === note.id ? "Cancel connection" : "Connect to another note"}
              </button>}
              {!note.trashedAt && isMindMap && <button type="button" onClick={() => { onAddBranch(note); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                <i className="fa-solid fa-code-branch text-indigo-500"></i>Add child branch
              </button>}
              <label className="mt-2 block border-t border-slate-200 pt-3 text-[11px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Date and time
                <input type="datetime-local" value={note.reminderAt || ""} onChange={(event) => updateNote(note.id, { reminderAt: event.target.value })} disabled={Boolean(note.trashedAt)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-normal text-slate-700 outline-none focus:border-indigo-400 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
              </label>
              {!note.trashedAt && (
                <>
                  <label className="mt-3 block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Tags
                    <input type="text" value={(note.tags || []).join(", ")} onChange={(event) => updateNote(note.id, { tags: [...new Set(event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))] })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-normal text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" placeholder="work, personal..." aria-label="Note tags, comma separated" />
                  </label>
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Card color</span>
                    <div className="mt-2 flex items-center gap-2">
                      {COLORS.map((color) => (
                        <button type="button" key={color.id} onClick={() => updateNote(note.id, { prio: color.id })} className={`h-5 w-5 rounded-full ${color.bg} ${note.prio === color.id ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900" : ""}`} title={`${color.label} color`} aria-label={`Set ${color.label} note color`} />
                      ))}
                    </div>
                  </div>
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"><i className="fa-regular fa-image text-indigo-500"></i>Add image or screenshot</button>
                  <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => { onAddImages(note.id, event.target.files); event.target.value = ""; }} />
                  <form className="mt-2 flex gap-1" onSubmit={(event) => {
                    event.preventDefault();
                    try {
                      const parsed = new URL(linkDraft.trim());
                      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only web links are supported.");
                      updateNote(note.id, { links: [...new Set([...(note.links || []), parsed.href])] });
                      setLinkDraft("");
                    } catch (error) {
                      window.alert(error.message || "Enter a valid http or https link.");
                    }
                  }}>
                    <input value={linkDraft} onChange={(event) => setLinkDraft(event.target.value)} placeholder="Add a link..." className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label="Add a web link" />
                    <button type="submit" className="rounded-lg px-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10" title="Save link" aria-label="Save link"><i className="fa-solid fa-link"></i></button>
                  </form>
                </>
              )}
              <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
                {note.trashedAt ? (
                  <>
                    <button type="button" onClick={() => { restoreNote(note.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"><i className="fa-solid fa-rotate-left"></i>Restore note</button>
                    <button type="button" onClick={() => permanentlyDeleteNote(note.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"><i className="fa-solid fa-trash-can"></i>Delete permanently</button>
                  </>
                ) : <button type="button" onClick={() => { deleteNote(note.id); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"><i className="fa-solid fa-trash-can"></i>Move to trash</button>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1 p-3 pt-2">
          {note.kind === "todo" ? (
            <div className="space-y-1.5">
              {(note.tasks || []).map((task) => (
                <div key={task.id} className="group/task flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
                  <label className="flex min-w-0 flex-1 items-start gap-2">
                    <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={Boolean(task.done)}
                        onChange={(e) => updateNote(note.id, {
                          tasks: (note.tasks || []).map((item) => item.id === task.id ? { ...item, done: e.target.checked } : item),
                        })}
                        className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-md border-2 border-slate-400 bg-white/80 transition-all duration-150 checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:border-slate-500 dark:bg-slate-800/80 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:focus-visible:ring-offset-slate-900"
                      />
                      <i className={`fa-solid fa-check pointer-events-none absolute text-[10px] text-white transition-transform duration-150 ${task.done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}></i>
                    </span>
                    <span className={task.done ? "line-through opacity-60" : ""}>{task.text}</span>
                  </label>
                  {!note.trashedAt && <button type="button" onClick={() => updateNote(note.id, { tasks: note.tasks.filter((item) => item.id !== task.id) })} className="shrink-0 p-0.5 text-slate-500 opacity-0 hover:text-red-600 group-hover/task:opacity-100" title="Remove task" aria-label="Remove task"><i className="fa-solid fa-xmark text-xs"></i></button>}
                </div>
              ))}
              {!note.trashedAt && (
                <form
                  className="flex gap-1 pt-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!taskDraft.trim()) return;
                    updateNote(note.id, { tasks: [...(note.tasks || []), { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, text: taskDraft.trim(), done: false }] });
                    setTaskDraft("");
                  }}
                >
                  <input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} placeholder="Add a task..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-gray-500" />
                  <button type="submit" className="text-indigo-700 dark:text-indigo-300" aria-label="Add task"><i className="fa-solid fa-plus"></i></button>
                </form>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={note.des || ""}
              onChange={(e) => updateNote(note.id, { des: e.target.value })}
              className="w-full min-h-20 bg-transparent outline-none resize-y text-gray-800 dark:text-gray-200 text-sm leading-relaxed placeholder-gray-500/50 dark:placeholder-gray-400/50"
              placeholder={isMindMap && note.isMindMap ? "Write about this topic..." : "Write a note, paste a link, or capture an idea..."}
            />
          )}
          {note.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {note.images.map((image, index) => (
                <div key={`${note.id}-image-${index}`} className="relative group/image">
                  <img src={imageSources?.[image.id] || image.dataUrl || image} alt={image.name || "Note attachment"} className="w-full h-24 object-cover rounded-lg border border-black/10 dark:border-white/10" />
                  {!note.trashedAt && (
                    <button type="button" onClick={() => onRemoveImage(note.id, image)} className="absolute top-1 right-1 rounded-full bg-black/60 text-white w-6 h-6 opacity-0 group-hover/image:opacity-100" title="Remove image" aria-label="Remove image"><i className="fa-solid fa-xmark text-xs"></i></button>
                  )}
                </div>
              ))}
            </div>
          )}
          {note.links?.length > 0 && (
            <div className="space-y-1">
              {note.links.map((link) => (
                <div key={link} className="flex min-w-0 items-center gap-1">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-xs font-medium text-indigo-700 underline decoration-indigo-300 dark:text-indigo-300" title={link}>
                    <i className="fa-solid fa-link mr-1.5"></i>{link}
                  </a>
                  {!note.trashedAt && <button type="button" onClick={() => updateNote(note.id, { links: note.links.filter((item) => item !== link) })} className="shrink-0 p-1 text-slate-500 hover:text-red-600" title="Remove link" aria-label="Remove link"><i className="fa-solid fa-xmark text-xs"></i></button>}
                </div>
              ))}
            </div>
          )}
          {!note.trashedAt && (
            <div className="flex items-center justify-between gap-2 pt-1">
              {(note.tags || []).length > 0 && <div className="flex min-w-0 flex-wrap gap-1">{note.tags.map((tag) => <span key={tag} className="max-w-full truncate rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-slate-300">{tag}</span>)}</div>}
            </div>
          )}
          {note.reminderAt && !Number.isNaN(new Date(note.reminderAt).getTime()) && (
            <div className="mt-auto flex items-center gap-2 border-t border-black/5 pt-2 text-[11px] text-slate-600 dark:border-white/10 dark:text-slate-300">
              <i className="fa-regular fa-calendar"></i>
              <time dateTime={note.reminderAt}>{new Date(note.reminderAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time>
            </div>
          )}
        </div>
      </div>
  );

  if (!isDraggable) return noteBody;
  return (
    <Draggable
      nodeRef={nodeRef} scale={zoom}
      onStart={() => bringToFront && bringToFront(note.id)}
      defaultPosition={{ x: defaultX, y: defaultY }}
      onDrag={updateXarrow}
      onStop={(e, data) => {
        updateXarrow();
        updateNote(note.id, { x: data.x, y: data.y });
      }}
      bounds="parent"
      handle=".drag-grip"
    >
      {noteBody}
    </Draggable>
  );
};

const Home = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    deleteMultipleNotes,
    restoreNote,
    permanentlyDeleteNote,
    emptyTrash,
    bringToFront,
    importNotes,
    darkMode,
    toggleDarkMode,
  } = useAppContext();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(
    () => location.state?.quickSearchTerm || "",
  );
  const [quickNoteText, setQuickNoteText] = useState("");
  const [activeSection, setActiveSection] = useState("board");
  const [timelineCalendarNotice, setTimelineCalendarNotice] = useState(null);
  const [viewMode, setViewMode] = useState("board");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const deleteCancelButtonRef = useRef(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState([]);
  const [tagFilterOpen, setTagFilterOpen] = useState(false);
  const [tagFilterPosition, setTagFilterPosition] = useState(null);
  const tagFilterButtonRef = useRef(null);
  const tagFilterPanelRef = useRef(null);
  const [imageSources, setImageSources] = useState({});
  const imageInputRef = useRef(null);
  const importInputRef = useRef(null);
  const handleAddImagesRef = useRef(null);
  const boardRef = useRef(null);
  const canvasTouchHandlersRef = useRef(null);
  const notePlacementSequenceRef = useRef(notes.length);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const gestureRef = useRef({ mode: null, startDistance: 0, startZoom: 1 });
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('stiknex_connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [quickCreateMenuOpen, setQuickCreateMenuOpen] = useState(false);
  const quickCreateMenuRef = useRef(null);
  const quickNoteInputRef = useRef(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const sidebarCollapseTimerRef = useRef(null);
  const [syncStatus, setSyncStatus] = useState(() => getSyncIdentity() ? "synced" : "local");
  const imageIdKey = notes.flatMap((note) => (note.images || []).map((image) => image?.id).filter(Boolean)).join("|");

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (!tagFilterOpen) return undefined;
    const updatePosition = () => {
      const button = tagFilterButtonRef.current;
      if (!button) return;
      const bounds = button.getBoundingClientRect();
      const width = Math.min(256, window.innerWidth - 16);
      const minimumLeft = sidebarExpanded ? 232 : 8;
      const left = Math.min(Math.max(bounds.left, minimumLeft), window.innerWidth - width - 8);
      const top = Math.min(bounds.bottom + 8, Math.max(8, window.innerHeight - 280));
      setTagFilterPosition({ left, top, width });
    };
    const handleOutsidePointerDown = (event) => {
      if (!tagFilterPanelRef.current?.contains(event.target) && !tagFilterButtonRef.current?.contains(event.target)) {
        setTagFilterOpen(false);
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [tagFilterOpen, sidebarExpanded]);

  useEffect(() => {
    if (!quickCreateMenuOpen) return undefined;
    const closeMenu = (event) => {
      if (!quickCreateMenuRef.current?.contains(event.target)) setQuickCreateMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setQuickCreateMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [quickCreateMenuOpen]);

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileSidebarOpen]);

  useEffect(() => {
    let cancelled = false;
    const imageIds = [...new Set(imageIdKey.split("|").filter(Boolean))];
    Promise.all(imageIds.map(async (id) => [id, await getImageFromDb(id)]))
      .then((entries) => {
        if (!cancelled) setImageSources(Object.fromEntries(entries.filter(([, data]) => data)));
      })
      .catch((error) => console.error("Could not load sticky note images:", error));
    return () => { cancelled = true; };
  }, [imageIdKey]);

  useEffect(() => {
    const handleQuickSearchNote = (event) => {
      if (typeof event.detail === "string") setSearchTerm(event.detail);
    };
    window.addEventListener("stiknex_quick_search_note", handleQuickSearchNote);
    return () => window.removeEventListener("stiknex_quick_search_note", handleQuickSearchNote);
  }, []);

  // Panning state
  
  // Fix Xarrow disconnection on zoom
  useEffect(() => {
    let start = performance.now();
    let frameId;
    const animate = (time) => {
      window.dispatchEvent(new Event('resize'));
      if (time - start < 350) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [zoom]);

  const [isPanning, setIsPanning] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const panGestureRef = useRef({ mode: null, x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [showPanHelperText, setShowPanHelperText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPanHelperText(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!deleteConfirmation) return undefined;
    deleteCancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setDeleteConfirmation(null);
      if (event.key === "Tab") {
        event.preventDefault();
        const dialogButtons = document.querySelectorAll("[data-delete-confirmation-dialog] button:not(:disabled)");
        if (dialogButtons.length < 2) return;
        const focusedIndex = [...dialogButtons].indexOf(document.activeElement);
        dialogButtons[(focusedIndex + (event.shiftKey ? dialogButtons.length - 1 : 1)) % dialogButtons.length].focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteConfirmation]);

  useEffect(() => {
    localStorage.setItem('stiknex_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    const handleRemoteBoardSync = (event) => {
      const remoteConnections = event.detail?.remotePayload?.stickyConnections;
      if (Array.isArray(remoteConnections)) setConnections(remoteConnections);
      const remoteImages = event.detail?.remotePayload?.stickyImages;
      if (remoteImages && typeof remoteImages === "object") setImageSources((previous) => ({ ...previous, ...remoteImages }));
    };
    window.addEventListener("stiknex_notebook_synced", handleRemoteBoardSync);
    return () => window.removeEventListener("stiknex_notebook_synced", handleRemoteBoardSync);
  }, []);

  useEffect(() => {
    if (!["board", "mindmap"].includes(activeSection) || viewMode !== "board") return undefined;
    const frameId = requestAnimationFrame(() => {
      if (!boardRef.current) return;
      if (boardRef.current.scrollLeft === 0) {
        boardRef.current.scrollLeft = 3000 * zoomRef.current - boardRef.current.clientWidth / 2;
        boardRef.current.scrollTop = 3000 * zoomRef.current - boardRef.current.clientHeight / 2;
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [activeSection, viewMode]);

  const handleAddNote = (overrides = {}) => {
    const currentZoom = zoomRef.current;
    const placementZoom = overrides.placementZoom || currentZoom;
    const board = boardRef.current;
    const viewportWidth = board?.clientWidth || Math.max(320, window.innerWidth - 64);
    const viewportHeight = board?.clientHeight || Math.max(240, window.innerHeight - 120);
    const viewportLeft = board ? board.scrollLeft / currentZoom : 3000 - viewportWidth / (2 * currentZoom);
    const viewportTop = board ? board.scrollTop / currentZoom : 3000 - viewportHeight / (2 * currentZoom);
    const leftMargin = sidebarExpanded ? 176 : 16;
    const minX = viewportLeft + leftMargin / placementZoom;
    const minY = viewportTop + 16 / placementZoom;
    const maxX = Math.max(minX, viewportLeft + viewportWidth / placementZoom - 272);
    const maxY = Math.max(minY, viewportTop + viewportHeight / placementZoom - 180);
    const placementIndex = notePlacementSequenceRef.current++;
    const columns = Math.max(1, Math.floor((maxX - minX) / 284) + 1);
    const defaultX = minX + (placementIndex % columns) * 284;
    const defaultY = minY + (Math.floor(placementIndex / columns) % 4) * 190;
    const x = Math.min(maxX, Math.max(minX, overrides.x ?? defaultX));
    const y = Math.min(maxY, Math.max(minY, overrides.y ?? defaultY));

    const id = overrides.id || (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    addNote({
      id,
      title: overrides.title || "",
      des: overrides.des || "",
      kind: overrides.kind || "note",
      tasks: overrides.tasks || [],
      tags: overrides.tags || [],
      images: overrides.images || [],
      reminderAt: overrides.reminderAt || null,
      isMindMap: Boolean(overrides.isMindMap),
      isFavorite: false,
      trashedAt: null,
      prio: overrides.prio || "white",
      x,
      y,
    });
    return id;
  };

  const handleQuickNoteSubmit = async (event) => {
    event.preventDefault();
    if (!quickNoteText.trim()) return;
    if (isCreationCommand(quickNoteText, "timeline")) {
      const content = stripCreationInstruction(quickNoteText, "timeline");
      const events = splitTimelineEvents(content);
      const latestTimelineTimestamp = notes.reduce((latest, note) => {
        if (note.trashedAt || note.isMindMap || !note.reminderAt) return latest;
        const timestamp = new Date(note.reminderAt).getTime();
        return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
      }, 0);
      const inferredTimelineYear = latestTimelineTimestamp
        ? new Date(latestTimelineTimestamp).getFullYear()
        : new Date().getFullYear();
      const calendarEvents = [];
      events.forEach((event, index) => {
        const parsedDate = parseNaturalDate(event, new Date(), inferredTimelineYear);
        const title = parsedDate?.remaining || event;
        handleAddNote({
          title: "",
          des: title || `Timeline event ${index + 1}`,
          kind: "note",
          reminderAt: parsedDate ? toLocalDateTime(parsedDate.date) : null,
          isMindMap: false,
          isTimelineEvent: true,
        });
        if (parsedDate && title) {
          const endDate = new Date(parsedDate.date);
          endDate.setHours(endDate.getHours() + 1);
          calendarEvents.push({
            summary: title,
            description: "",
            start: parsedDate.date.toISOString(),
            end: endDate.toISOString(),
          });
        }
      });
      setActiveSection("timeline");
      setViewMode("list");
      setQuickNoteText("");
      setTimelineCalendarNotice(null);
      if (calendarEvents.length) {
        const adminToken = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
        if (!adminToken) {
          setTimelineCalendarNotice({
            message: `${calendarEvents.length} dated event${calendarEvents.length === 1 ? "" : "s"} added to Timeline. Sign in as admin and connect Google Calendar to sync them and receive phone reminders.`,
            needsConnect: true,
          });
          return;
        }
        try {
          const response = await fetch("/api/google-calendar/timeline", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({ events: calendarEvents }),
          });
          const data = await response.json();
          if (data.code === "calendar_not_connected") {
            setTimelineCalendarNotice({
              message: "Timeline entries were saved, but Google Calendar is not connected for this admin.",
              needsConnect: true,
            });
          } else if (!response.ok) {
            setTimelineCalendarNotice({
              message: `Timeline entries were saved, but Calendar sync failed: ${data.error || "try again from the Google Calendar dashboard page."}`,
              needsConnect: false,
            });
          } else {
            const failedCount = Number(data.failedCount || 0);
            setTimelineCalendarNotice({
              message: failedCount
                ? `${data.createdCount} event${data.createdCount === 1 ? "" : "s"} synced; ${failedCount} could not be added.`
                : `${data.createdCount} event${data.createdCount === 1 ? "" : "s"} synced to Google Calendar. Popup reminders are set for event start time.`,
              needsConnect: false,
            });
          }
        } catch (error) {
          console.error("Timeline events could not be synced to Google Calendar:", error);
          setTimelineCalendarNotice({
            message: "Timeline entries were saved, but Calendar sync failed because the server could not be reached.",
            needsConnect: false,
          });
        }
      } else {
        setTimelineCalendarNotice({
          message: "Timeline entries were saved, but no dates were recognized for Calendar events. Include a date such as “5 ko” or “12 Jan”.",
          needsConnect: false,
        });
      }
      return;
    }
    if (isCreationCommand(quickNoteText, "mindmap")) {
      const lines = parseMindMapOutline(stripCreationInstruction(quickNoteText, "mindmap"));
      const nodes = [];
      const stack = [];
      for (const [index, line] of lines.entries()) {
        const depth = index === 0 ? 0 : Math.max(1, line.depth);
        while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
        const parentIndex = depth === 0 ? null : stack[stack.length - 1]?.index ?? 0;
        nodes.push({ ...line, depth, parentIndex });
        stack.push({ depth, index });
      }

      const childrenByParent = new Map();
      nodes.forEach((node, index) => {
        if (node.parentIndex === null) return;
        childrenByParent.set(node.parentIndex, [...(childrenByParent.get(node.parentIndex) || []), index]);
      });
      const currentZoom = zoomRef.current;
      const board = boardRef.current;
      const viewportWidth = board?.clientWidth || Math.max(320, window.innerWidth - (sidebarExpanded ? 224 : 64));
      const viewportHeight = board?.clientHeight || Math.max(240, window.innerHeight - 120);
      const leftMargin = sidebarExpanded ? 176 : 16;
      const usableWidth = Math.max(160, viewportWidth - leftMargin - 16);
      const usableHeight = Math.max(160, viewportHeight - 32);
      const maxDepth = Math.max(1, ...nodes.map((node) => node.depth));
      let nextLeaf = 0;
      const layoutY = new Map();
      const placeSubtree = (index) => {
        const children = childrenByParent.get(index) || [];
        if (children.length === 0) {
          const y = nextLeaf * 180;
          nextLeaf += 1;
          layoutY.set(index, y);
          return y;
        }
        const childY = children.map(placeSubtree);
        const y = childY.reduce((sum, value) => sum + value, 0) / childY.length;
        layoutY.set(index, y);
        return y;
      };
      nodes.forEach((node, index) => {
        if (node.parentIndex === null) placeSubtree(index);
      });
      const leafCount = Math.max(1, nextLeaf);
      const graphWidth = 256 + maxDepth * 320;
      const graphHeight = Math.max(160, (leafCount - 1) * 180 + 160);
      const fitZoom = Math.max(0.1, Math.min(currentZoom, usableWidth / graphWidth, usableHeight / graphHeight));
      const horizontalGap = 320;
      const startX = (board ? board.scrollLeft / currentZoom : 3000 - viewportWidth / (2 * currentZoom)) + leftMargin / fitZoom;
      const startY = (board ? board.scrollTop / currentZoom : 3000 - viewportHeight / (2 * currentZoom))
        + Math.max(16, (usableHeight - graphHeight * fitZoom) / (2 * fitZoom));
      const createdIds = nodes.map((node, index) => {
        return handleAddNote({
          title: "",
          des: [node.title, node.des].filter(Boolean).join("\n\n"),
          kind: "note",
          isMindMap: true,
          placementZoom: fitZoom,
          x: startX + node.depth * horizontalGap,
          y: startY + (layoutY.get(index) || 0),
        });
      });
      const newConnections = nodes.flatMap((node, index) => {
        if (node.parentIndex === null) return [];
        return [{
          id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          from: createdIds[node.parentIndex],
          to: createdIds[index],
        }];
      });
      if (newConnections.length) setConnections((previous) => [...previous, ...newConnections]);
      setActiveSection("mindmap");
      setViewMode("board");
      setZoomAtPoint(fitZoom);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const canvasViewport = boardRef.current;
        if (!canvasViewport) return;
        canvasViewport.scrollLeft = Math.max(0, startX * fitZoom - leftMargin);
        canvasViewport.scrollTop = Math.max(0, startY * fitZoom - 16);
      }));
      setQuickNoteText("");
      return;
    }
    if (activeSection === "mindmap") handleAddNote({ des: quickNoteText.trim(), kind: "note", isMindMap: true });
    else handleAddNote({ des: quickNoteText.trim() });
    setQuickNoteText("");
  };

  const handleAddBranch = (parentNote) => {
    const siblings = connections.filter((connection) => connection.from === parentNote.id).length;
    const angle = (siblings * Math.PI) / 4;
    const parentOffset = String(parentNote.id || "").split("").reduce((value, char) => (value * 31 + char.charCodeAt(0)) % 200, 0) - 100;
    const parentX = parentNote.x ?? 3000 + parentOffset;
    const parentY = parentNote.y ?? 3000 - parentOffset;
    const branchId = handleAddNote({
      title: parentNote.isMindMap ? "" : "New branch",
      des: parentNote.isMindMap ? "New branch" : "",
      kind: "note",
      isMindMap: Boolean(parentNote.isMindMap),
      x: parentX + Math.round(Math.cos(angle) * 340),
      y: parentY + Math.round(Math.sin(angle) * 240),
    });
    const connectionId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setConnections((previous) => [...previous, { id: connectionId, from: parentNote.id, to: branchId }]);
  };

  const handleQuickTodoCreate = () => {
    const taskText = quickNoteText.trim();
    handleAddNote({
      title: "New Task List",
      kind: "todo",
      tasks: taskText ? [{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, text: taskText, done: false }] : [],
    });
    setQuickNoteText("");
  };

  const handleQuickDocumentCreate = () => {
    const documentText = quickNoteText.trim();
    handleAddNote({
      title: "New Document",
      kind: "document",
      des: documentText,
    });
    setQuickNoteText("");
  };

  const handleQuickNoteCreate = () => {
    if (quickNoteText.trim()) {
      quickNoteInputRef.current?.form?.requestSubmit();
    } else {
      handleAddNote(activeSection === "mindmap" ? { des: "", kind: "note", isMindMap: true } : undefined);
    }
    setQuickCreateMenuOpen(false);
  };

  const handleAddImages = async (noteId, files) => {
    const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    const savedImageIds = [];
    try {
      const attachments = [];
      for (const file of imageFiles) {
        const id = typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `sticky_image_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const dataUrl = await compressImage(file);
        const saved = await saveImageToDb(id, dataUrl);
        if (!saved) throw new Error("Could not save this image in browser storage.");
        savedImageIds.push(id);
        attachments.push({ id, name: file.name || "Screenshot", dataUrl });
      }
      const images = attachments.map(({ id, name }) => ({ id, name }));
      setImageSources((previous) => ({
        ...previous,
        ...Object.fromEntries(attachments.map(({ id, dataUrl }) => [id, dataUrl])),
      }));
      if (noteId) {
        const note = notes.find((item) => item.id === noteId);
        if (note) updateNote(noteId, { images: [...(note.images || []), ...images] });
      } else {
        handleAddNote({ title: "Screenshot", images, isMindMap: activeSection === "mindmap" });
      }
    } catch (error) {
      await Promise.all(savedImageIds.map((id) => deleteImageFromDb(id)));
      console.error("Could not attach image to sticky note:", error);
      window.alert(error.message || "Could not attach the selected image.");
    }
  };

  useEffect(() => {
    handleAddImagesRef.current = handleAddImages;
  });

  const handleRemoveImage = async (noteId, image) => {
    if (image?.id) {
      await deleteImageFromDb(image.id);
      setImageSources((previous) => {
        const next = { ...previous };
        delete next[image.id];
        return next;
      });
    }
    const note = notes.find((item) => item.id === noteId);
    if (note) updateNote(noteId, { images: (note.images || []).filter((item) => item !== image) });
  };

  const handlePermanentlyDelete = async (id) => {
    const note = notes.find((item) => item.id === id);
    if (note) {
      await Promise.all((note.images || []).map((image) => image?.id ? deleteImageFromDb(image.id) : Promise.resolve()));
    }
    setConnections((previous) => previous.filter((connection) => connection.from !== id && connection.to !== id));
    permanentlyDeleteNote(id);
  };

  const handleEmptyTrash = async () => {
    const trashedNotes = notes.filter((note) => note.trashedAt);
    await Promise.all(trashedNotes.flatMap((note) => (note.images || []).map((image) => image?.id ? deleteImageFromDb(image.id) : Promise.resolve())));
    const trashedIds = new Set(trashedNotes.map((note) => note.id));
    setConnections((previous) => previous.filter((connection) => !trashedIds.has(connection.from) && !trashedIds.has(connection.to)));
    emptyTrash();
  };

  const requestPermanentDelete = (id) => setDeleteConfirmation({ type: "note", id });
  const requestEmptyTrash = () => setDeleteConfirmation({ type: "trash" });
  const confirmPermanentDeletion = () => {
    const confirmation = deleteConfirmation;
    setDeleteConfirmation(null);
    if (confirmation?.type === "trash") void handleEmptyTrash();
    else if (confirmation?.type === "note") void handlePermanentlyDelete(confirmation.id);
  };

  const handleExportJson = async () => {
    const imageIds = [...new Set(notes.flatMap((note) => (note.images || []).map((image) => image?.id).filter(Boolean)))];
    const images = Object.fromEntries((await Promise.all(imageIds.map(async (id) => [id, await getImageFromDb(id)]))).filter(([, dataUrl]) => dataUrl));
    const data = { version: 2, timestamp: new Date().toISOString(), notes, connections, images };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stiknex-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.notes && Array.isArray(parsed.notes)) {
          for (const [id, dataUrl] of Object.entries(parsed.images || {})) {
            if (typeof dataUrl !== "string" || !id) continue;
            const saved = await saveImageToDb(id, dataUrl);
            if (!saved) throw new Error("Could not save an image from this backup.");
          }
          importNotes(parsed.notes);
          if (parsed.images && typeof parsed.images === "object") setImageSources((previous) => ({ ...previous, ...parsed.images }));
          if (parsed.connections && Array.isArray(parsed.connections)) setConnections(parsed.connections);
        } else {
          window.alert("This backup file does not contain a valid notes list.");
        }
      } catch (error) {
        console.error("Could not import sticky notes backup:", error);
        window.alert("Could not read this backup file. Choose a valid Stiknex JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  const displayedNotes = useMemo(() => {
    const query = searchTerm.trim();
    return notes.map((note) => ({ note, searchScore: getStickyNoteSearchScore(note, query) }))
      .filter(({ note, searchScore }) => {
      if (activeSection === "trash" ? !note.trashedAt : Boolean(note.trashedAt)) return false;
      if (activeSection === "favorites" && !note.isFavorite) return false;
      if (activeSection === "documents" && note.kind !== "document") return false;
      if (activeSection === "tasks" && note.kind !== "todo") return false;
      if (activeSection === "board" && note.isMindMap) return false;
      if (activeSection === "mindmap" && !note.isMindMap) return false;
      if (activeSection === "timeline" && note.isMindMap) return false;
      if (!["trash", "templates", "dashboard"].includes(activeSection) && selectedTagFilters.length > 0 && !selectedTagFilters.some((tag) => (note.tags || []).includes(tag))) return false;
      if (query && searchScore === 0) return false;
      return true;
    })
      .sort((a, b) => (b.searchScore - a.searchScore) || (Number(Boolean(b.note.isPinned)) - Number(Boolean(a.note.isPinned))))
      .map(({ note }) => note);
  }, [activeSection, notes, searchTerm, selectedTagFilters]);

  const availableTags = useMemo(
    () => [...new Set(notes.filter((note) => !note.trashedAt).flatMap((note) => note.tags || []).filter((tag) => typeof tag === "string" && tag.trim()))].sort((a, b) => a.localeCompare(b)),
    [notes],
  );

  useEffect(() => {
    if (!getSyncIdentity()) return undefined;
    let active = true;
    const synchronize = async () => {
      setSyncStatus("saving");
      try {
        const result = await pushToCloud();
        if (!active) return;
        setSyncStatus(result.success ? "synced" : result.reason === "Offline" ? "offline" : "error");
        if (!result.success && result.reason !== "Offline") {
          console.error("Could not sync sticky notes:", result.error || result.reason);
        }
      } catch (error) {
        if (!active) return;
        console.error("Could not sync sticky notes:", error);
        setSyncStatus("error");
      }
    };
    const timer = window.setTimeout(synchronize, 1800);
    window.addEventListener("online", synchronize);
    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener("online", synchronize);
    };
  }, [connections, notes]);

  useEffect(() => {
    const handlePasteImage = (event) => {
      if (!["board", "mindmap"].includes(activeSection)) return;
      const files = Array.from(event.clipboardData?.items || [])
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter(Boolean);
      if (files.length > 0) {
        event.preventDefault();
        handleAddImagesRef.current?.(null, files);
      }
    };
    window.addEventListener("paste", handlePasteImage);
    return () => window.removeEventListener("paste", handlePasteImage);
  }, [activeSection]);

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
    deleteNote(id);
  };
  
  const deleteConnection = (id) => {
     setConnections(prev => prev.filter(c => c.id !== id));
  };

  // Canvas Panning Handlers
  const handleStart = (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (e.touches?.length === 2) {
      e.preventDefault();
      const [first, second] = e.touches;
      const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
      if (distance === 0) return;
      gestureRef.current = {
        mode: "pinch",
        startDistance: distance,
        startZoom: zoomRef.current,
      };
      panGestureRef.current.mode = "pinch";
      setIsPanning(false);
      setIsPinching(true);
      return;
    }

    if (target?.closest("button, input, textarea, select, [contenteditable='true'], [data-no-canvas-gesture]")) return;
    const isNoteTarget = Boolean(target?.closest("[id^='note-']"));
    if ((!e.touches || e.touches.length === 1) && !isNoteTarget) {
      const point = e.touches?.[0] || e;
      panGestureRef.current = {
        mode: "pan",
        x: point.clientX,
        y: point.clientY,
        scrollLeft: boardRef.current?.scrollLeft || 0,
        scrollTop: boardRef.current?.scrollTop || 0,
      };
      setIsPanning(true);
      setIsPinching(false);
      gestureRef.current.mode = "pan";
    }
  };

  const setZoomAtPoint = (nextZoom, point) => {
    const board = boardRef.current;
    const currentZoom = zoomRef.current;
    const clampedZoom = Math.max(0.1, Math.min(nextZoom, 2));
    if (board && currentZoom !== clampedZoom) {
      const bounds = board.getBoundingClientRect();
      const anchorX = point ? point.x - bounds.left : bounds.width / 2;
      const anchorY = point ? point.y - bounds.top : bounds.height / 2;
      board.scrollLeft = ((board.scrollLeft + anchorX) / currentZoom) * clampedZoom - anchorX;
      board.scrollTop = ((board.scrollTop + anchorY) / currentZoom) * clampedZoom - anchorY;
    }
    zoomRef.current = clampedZoom;
    setZoom(clampedZoom);
  };

  const handleMove = (e) => {
    if (gestureRef.current.mode === "pinch" && e.touches?.length === 2) {
      e.preventDefault();
      const [first, second] = e.touches;
      const currentDistance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
      const nextZoom = gestureRef.current.startZoom * currentDistance / gestureRef.current.startDistance;
      setZoomAtPoint(nextZoom, {
        x: (first.clientX + second.clientX) / 2,
        y: (first.clientY + second.clientY) / 2,
      });
    } else if (panGestureRef.current.mode === "pan" && (!e.touches || e.touches.length === 1)) {
      const point = e.touches?.[0] || e;
      const dx = point.clientX - panGestureRef.current.x;
      const dy = point.clientY - panGestureRef.current.y;
      if (boardRef.current) {
        boardRef.current.scrollLeft = panGestureRef.current.scrollLeft - dx;
        boardRef.current.scrollTop = panGestureRef.current.scrollTop - dy;
      }
    }
  };

  const handleEnd = (e) => {
    if (e?.touches?.length === 1) {
      gestureRef.current.mode = "pan";
      panGestureRef.current = {
        mode: "pan",
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        scrollLeft: boardRef.current?.scrollLeft || 0,
        scrollTop: boardRef.current?.scrollTop || 0,
      };
      setIsPinching(false);
      setIsPanning(true);
    } else {
      gestureRef.current.mode = null;
      panGestureRef.current.mode = null;
      setIsPanning(false);
      setIsPinching(false);
    }
  };

  useEffect(() => {
    canvasTouchHandlersRef.current = { handleStart, handleMove, handleEnd };
  });

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    const handleTouchStart = (event) => {
      event.preventDefault();
      canvasTouchHandlersRef.current?.handleStart(event);
    };
    const handleTouchMove = (event) => {
      event.preventDefault();
      canvasTouchHandlersRef.current?.handleMove(event);
    };
    const handleTouchEnd = (event) => {
      event.preventDefault();
      canvasTouchHandlersRef.current?.handleEnd(event);
    };
    board.addEventListener("touchstart", handleTouchStart, { passive: false });
    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchend", handleTouchEnd, { passive: false });
    board.addEventListener("touchcancel", handleTouchEnd, { passive: false });
    return () => {
      board.removeEventListener("touchstart", handleTouchStart);
      board.removeEventListener("touchmove", handleTouchMove);
      board.removeEventListener("touchend", handleTouchEnd);
      board.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const sections = [
    { id: "all", label: "All Notes", icon: "fa-solid fa-note-sticky" },
    { id: "board", label: "Sticky Board", icon: "fa-solid fa-chalkboard" },
    { id: "mindmap", label: "Mind Map", icon: "fa-solid fa-diagram-project" },
    { id: "timeline", label: "Timeline", icon: "fa-solid fa-timeline" },
    { id: "documents", label: "Documents", icon: "fa-regular fa-file-lines" },
    { id: "tasks", label: "To-Do List", icon: "fa-regular fa-square-check" },
    { id: "favorites", label: "Favorites", icon: "fa-regular fa-star" },
    { id: "templates", label: "Templates", icon: "fa-regular fa-clone" },
    { id: "trash", label: "Trash", icon: "fa-regular fa-trash-can" },
  ];
  const sectionTitle = activeSection === "tasks"
    ? "To-Do List"
    : sections.find((section) => section.id === activeSection)?.label || "Sticky Board";
  const showWorkspaceToolbar = activeSection !== "templates";
  const showMindMapButton = ["board", "all", "mindmap"].includes(activeSection);
  const showTimelineButton = ["board", "all", "timeline"].includes(activeSection);
  const showTagFilter = !["trash", "templates"].includes(activeSection);
  const showViewModeButtons = ["board", "all", "documents", "tasks", "favorites", "trash"].includes(activeSection);
  const showQuickComposer = !["trash", "templates"].includes(activeSection);
  const quickComposerPlaceholder = activeSection === "mindmap"
    ? "Describe a topic or mind map..."
    : activeSection === "timeline"
      ? "Add an event with a date, e.g. 12 Jan: project kickoff..."
      : activeSection === "documents"
        ? "Write a new document..."
        : activeSection === "tasks"
          ? "Add a task..."
          : activeSection === "favorites"
            ? "Create a note for your favorites..."
            : "Quick note, timeline, or mind map...";
  const activeNotes = notes.filter((note) => !note.trashedAt);
  const selectSection = (section) => {
    setActiveSection(section);
    if (["trash", "templates", "dashboard"].includes(section)) setTagFilterOpen(false);
    if (section === "board" || section === "mindmap") setViewMode("board");
    else if (section === "timeline" || section === "all" || section === "documents" || section === "favorites" || section === "trash" || section === "tasks") setViewMode("list");
    else setViewMode("gallery");
  };
  const addTemplate = (template) => {
    handleAddNote(template);
    setActiveSection("board");
    setViewMode("board");
  };
  const syncLabel = {
    local: "Saved on this device",
    saving: "Syncing securely...",
    synced: "Encrypted sync ready",
    offline: "Offline; sync will retry",
    error: "Sync needs attention",
  }[syncStatus];
  const closeSyncModal = async () => {
    setSyncModalOpen(false);
    if (!getSyncIdentity()) {
      setSyncStatus("local");
      return;
    }
    setSyncStatus("saving");
    try {
      const result = await pushToCloud();
      setSyncStatus(result.success ? "synced" : result.reason === "Offline" ? "offline" : "error");
      if (!result.success && result.reason !== "Offline") {
        console.error("Could not sync sticky notes after device setup:", result.error || result.reason);
      }
    } catch (error) {
      console.error("Could not sync sticky notes after device setup:", error);
      setSyncStatus("error");
    }
  };

  return (
    <AppShell fullWidth hideFooter hideNav>
      <PageSEO
        title="Free Online Sticky Notes & Infinite Canvas | Stiknex"
        description="Create, organize, and color-code infinite digital sticky notes on an interactive canvas. Brainstorm ideas, track tasks, and drag notes freely."
        path="/sticky-notes"
        type="webapp"
      />
      {darkMode && (
        <style>{`
          .swal-modal { background-color: #1e293b !important; border: 1px solid #334155; }
          .swal-title { color: #f8fafc !important; }
          .swal-text { color: #94a3b8 !important; }
          .swal-button { background-color: #3b82f6 !important; }
          .swal-button--cancel { background-color: #334155 !important; color: #cbd5e1 !important; }
          .swal-button--danger { background-color: #ef4444 !important; }
          .swal-icon--warning { border-color: #eab308 !important; }
          .swal-icon--warning__body, .swal-icon--warning__dot { background-color: #eab308 !important; }
          body { overscroll-behavior-y: none !important; }
        `}</style>
      )}

      <div className="relative flex h-screen h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {mobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close workspace menu"
          />
        )}
        <aside
          aria-label="Workspace navigation"
          onMouseEnter={() => {
            if (window.matchMedia("(max-width: 1023px)").matches) return;
            window.clearTimeout(sidebarCollapseTimerRef.current);
            setSidebarExpanded(true);
          }}
          onMouseLeave={() => {
            if (window.matchMedia("(max-width: 1023px)").matches) return;
            sidebarCollapseTimerRef.current = window.setTimeout(() => {
              setSidebarExpanded(false);
              setWorkspaceOpen(false);
            }, 180);
          }}
          onFocusCapture={() => {
            if (!window.matchMedia("(max-width: 1023px)").matches) setSidebarExpanded(true);
          }}
          onBlurCapture={(event) => {
            if (!window.matchMedia("(max-width: 1023px)").matches && !event.currentTarget.contains(event.relatedTarget)) {
              sidebarCollapseTimerRef.current = window.setTimeout(() => {
                setSidebarExpanded(false);
                setWorkspaceOpen(false);
              }, 180);
            }
          }}
          className={`fixed inset-y-0 left-0 z-50 flex h-full w-[min(82vw,280px)] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl transition-[transform,width,box-shadow] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:absolute lg:z-10 lg:translate-x-0 lg:shadow-sm ${sidebarExpanded ? "lg:w-56 lg:shadow-2xl" : "lg:w-16"}`}
        >
          <div className="mb-4 flex shrink-0 items-center gap-2 px-3">
            <img src="/logo.png" alt="Stiknex logo" width="28" height="28" className="h-7 w-7 shrink-0 object-contain" />
            <span className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap text-base font-black tracking-tight transition-[max-width,opacity] duration-200 ${sidebarExpanded || mobileSidebarOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"}`}>Stiknex</span>
            <button type="button" onClick={() => setMobileSidebarOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Close workspace menu"><i className="fa-solid fa-xmark"></i></button>
          </div>
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => { selectSection(section.id); setMobileSidebarOpen(false); }}
                title={section.label}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors lg:min-h-0 ${activeSection === section.id ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
              >
                <i className={`${section.icon} w-5 shrink-0 text-center`}></i>
                <span className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 max-w-40 opacity-100 lg:max-w-0 lg:opacity-0 ${sidebarExpanded ? "lg:max-w-40 lg:opacity-100" : ""}`}>{section.label}</span>
                {section.id === "trash" && notes.some((note) => note.trashedAt) && <span className={`ml-auto overflow-hidden rounded-full bg-slate-200 px-2 py-0.5 text-[10px] transition-[max-width,opacity] duration-200 dark:bg-slate-700 max-w-12 opacity-100 lg:max-w-0 lg:px-0 lg:opacity-0 ${sidebarExpanded ? "lg:max-w-12 lg:px-2 lg:opacity-100" : ""}`}>{notes.filter((note) => note.trashedAt).length}</span>}
              </button>
            ))}

            <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
            {[
              { label: "Notepad", to: "/online-notebook", icon: "fa-regular fa-pen-to-square" },
              { label: "Whiteboard", to: "/whiteboard", icon: "fa-solid fa-diagram-project" },
              { label: "Tools", to: "/tools", icon: "fa-solid fa-screwdriver-wrench" },
              { label: "Support", to: "/buy-me-a-coffee", icon: "fa-solid fa-mug-hot" },
              { label: "About", to: "/about", icon: "fa-solid fa-circle-info" },
            ].map(({ label, to, icon }) => (
              <Link key={to} to={to} title={label} onClick={() => setMobileSidebarOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:min-h-0">
                <i className={`${icon} w-5 shrink-0 text-center`}></i><span className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ${sidebarExpanded || mobileSidebarOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"}`}>{label}</span>
              </Link>
            ))}
          </nav>
          {/* ── Compact bottom action bar with drop-up panel ─────────────────── */}
          <div className="relative mt-2 shrink-0">
            {/* Drop-up panel — rendered above the bar */}
            {workspaceOpen && (
              <div
                className="absolute bottom-full left-0 right-0 z-[70] mb-1 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                onMouseLeave={() => setWorkspaceOpen(false)}
              >
                {/* Workspace stats grid */}
                <div className="border-b border-slate-100 p-3 dark:border-slate-800">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "All Notes", count: activeNotes.length, icon: "fa-note-sticky", section: "all" },
                      { label: "Tasks",     count: activeNotes.filter((note) => note.kind === "todo").length, icon: "fa-square-check", section: "tasks" },
                      { label: "Favorites", count: activeNotes.filter((note) => note.isFavorite).length,    icon: "fa-star",         section: "favorites" },
                      { label: "Images",    count: activeNotes.filter((note) => note.images?.length).length, icon: "fa-image" },
                    ].map(({ label, count, icon, section }) => (
                      <button type="button" key={label} onClick={() => { if (section) selectSection(section); setWorkspaceOpen(false); }} disabled={!section} className={`min-w-0 rounded-xl bg-slate-50 p-2 text-left dark:bg-slate-800 ${section ? "hover:bg-indigo-50 dark:hover:bg-indigo-500/10" : "cursor-default"}`}>
                        <span className="flex items-center gap-1.5 text-indigo-500"><i className={`fa-solid ${icon} text-xs`}></i><strong className="text-sm text-slate-800 dark:text-slate-100">{count}</strong></span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action list */}
                <div className="flex flex-col gap-0.5 p-2">
                  <button type="button" onClick={() => { setSyncModalOpen(true); setWorkspaceOpen(false); }} className="flex h-9 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <i className={`fa-solid ${syncStatus === "synced" ? "fa-cloud-check text-emerald-500" : syncStatus === "error" ? "fa-triangle-exclamation text-amber-500" : "fa-hard-drive text-indigo-500"} w-5 shrink-0 text-center`}></i>
                    <span className="truncate">{syncLabel}</span>
                  </button>
                  <button type="button" onClick={() => { handleExportJson(); setWorkspaceOpen(false); }} className="flex h-9 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800">
                    <i className="fa-solid fa-download w-5 shrink-0 text-center"></i><span>Export</span>
                  </button>
                  <button type="button" onClick={() => { importInputRef.current?.click(); setWorkspaceOpen(false); }} className="flex h-9 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800">
                    <i className="fa-solid fa-upload w-5 shrink-0 text-center"></i><span>Import</span>
                  </button>
                  <button type="button" onClick={() => { window.dispatchEvent(new Event("stiknex_open_quick_search")); setWorkspaceOpen(false); }} className="flex h-9 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10">
                    <i className="fa-solid fa-magnifying-glass w-5 shrink-0 text-center"></i><span>Quick Search</span>
                  </button>
                  <button type="button" onClick={() => { window.dispatchEvent(new Event("stiknex_open_feedback")); setWorkspaceOpen(false); setMobileSidebarOpen(false); }} className="flex h-9 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10">
                    <i className="fa-regular fa-comment-dots w-5 shrink-0 text-center"></i><span>Feedback</span>
                  </button>
                </div>
              </div>
            )}

            {/* Single compact bar — always visible */}
            <button
              type="button"
              onClick={() => setWorkspaceOpen((v) => !v)}
              title="Settings & More"
              aria-label="Settings & More"
              aria-expanded={workspaceOpen}
              className={`flex h-8 w-full items-center gap-2 border-t px-3 text-xs font-semibold transition
                ${workspaceOpen
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-indigo-500/10"
                }`}
            >
              <i className="fa-solid fa-sliders w-3.5 shrink-0 text-center text-[11px]"></i>
              <span className="flex-1 text-left">Settings &amp; More</span>
              <i className={`fa-solid fa-chevron-${workspaceOpen ? "down" : "up"} text-[10px]`}></i>
            </button>
          </div>
          <input ref={importInputRef} type="file" accept=".json,application/json" onChange={(event) => { handleImportJson(event); event.target.value = ""; }} className="hidden" />
        </aside>

        <main className="relative z-0 ml-0 flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-16">
          <header className="flex min-h-12 items-center justify-between gap-1.5 border-b border-slate-200 bg-white/90 px-2 py-1.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:min-h-14 sm:gap-2 sm:px-4 sm:py-2 lg:px-6">
            <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
              <button type="button" onClick={() => setMobileSidebarOpen(true)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:h-10 sm:w-10 lg:hidden" aria-label="Open workspace menu" aria-expanded={mobileSidebarOpen}>
                <i className="fa-solid fa-bars"></i>
              </button>
              <h1 className="max-w-[clamp(4.5rem,26vw,11rem)] truncate text-sm font-black tracking-tight sm:max-w-none sm:text-base lg:text-lg">{sectionTitle}</h1>
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:px-2 sm:text-[10px]">{displayedNotes.length}</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
              <label className="relative block min-w-0 max-w-36 flex-1 transition-transform duration-200 focus-within:scale-[1.02] sm:max-w-56 lg:ml-auto lg:flex-none">
                <i className="fa-solid fa-wand-magic-sparkles absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-indigo-500 sm:left-3 sm:text-xs"></i>
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search..." title="Smart search across note titles, text, tasks, tags, links, and images" className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-[10px] outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-indigo-900 sm:py-2 sm:pl-9 sm:pr-3 sm:text-xs lg:w-[min(30vw,20rem)] lg:focus:w-96" />
              </label>
              <button type="button" onClick={toggleDarkMode} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:h-10 sm:w-10 lg:h-9 lg:w-9" title="Toggle theme" aria-label="Toggle theme"><i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i></button>
              <button type="button" onClick={() => window.dispatchEvent(new Event("stiknex_open_feedback"))} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:flex lg:h-9 lg:w-9" title="Feedback" aria-label="Open feedback"><i className="fa-regular fa-comment-dots"></i></button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            {showWorkspaceToolbar && (
              <div className={`relative z-50 flex min-w-0 flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/70 px-2 py-1 dark:border-slate-800/70 sm:gap-2 sm:px-4 sm:py-2 lg:px-6 ${sidebarExpanded ? "lg:pl-[10.5rem]" : ""}`}>
                <div className="relative flex min-w-0 flex-wrap items-center gap-1 sm:gap-2">
                  {showMindMapButton && <button type="button" onClick={() => selectSection("mindmap")} className={`flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:h-9 sm:gap-2 sm:px-3 ${activeSection === "mindmap" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300" : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-violet-500/10"}`} title="Build a connected mind map"><i className="fa-solid fa-diagram-project"></i><span className="hidden sm:inline">Mind Map</span></button>}
                  {showTimelineButton && <button type="button" onClick={() => selectSection("timeline")} className={`flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:h-9 sm:gap-2 sm:px-3 ${activeSection === "timeline" ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300" : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-sky-500/10"}`} title="Review notes by date and reminder"><i className="fa-solid fa-timeline"></i><span className="hidden sm:inline">Timeline</span></button>}
                  {showTagFilter && (
                    <>
                      <button ref={tagFilterButtonRef} type="button" onClick={() => setTagFilterOpen((open) => !open)} aria-expanded={tagFilterOpen} aria-haspopup="true" className={`flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:h-9 sm:gap-2 sm:px-3 ${selectedTagFilters.length > 0 ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" : "bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500/10"}`} title="Filter notes by tags"><i className="fa-solid fa-filter"></i><span className="hidden sm:inline">Filter</span>{selectedTagFilters.length > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] text-white">{selectedTagFilters.length}</span>}</button>
                      {tagFilterOpen && tagFilterPosition && createPortal(
                        <div ref={tagFilterPanelRef} style={{ left: tagFilterPosition.left, top: tagFilterPosition.top, width: tagFilterPosition.width }} className="fixed z-[200] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter by tags</span>
                            {selectedTagFilters.length > 0 && <button type="button" onClick={() => setSelectedTagFilters([])} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-300">Clear</button>}
                          </div>
                          <div className="max-h-56 space-y-1 overflow-y-auto">
                            {availableTags.length > 0 ? availableTags.map((tag) => <label key={tag} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><input type="checkbox" checked={selectedTagFilters.includes(tag)} onChange={() => setSelectedTagFilters((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag])} className="h-3.5 w-3.5 accent-indigo-600" /><span className="truncate">{tag}</span></label>) : <p className="px-2 py-3 text-center text-xs text-slate-400">Add tags to notes to filter them here.</p>}
                          </div>
                          {selectedTagFilters.length > 0 && <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">Showing notes matching any selected tag</p>}
                        </div>,
                        document.body,
                      )}
                    </>
                  )}
                  {!["trash", "templates"].includes(activeSection) && activeNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => deleteMultipleNotes(activeNotes.map((note) => note.id))}
                      title="Send all notes to Trash"
                      aria-label="Send all notes to Trash"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10 sm:h-9 sm:w-9"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>
                {showViewModeButtons && <div className="flex items-center gap-0.5 rounded-xl bg-white p-0.5 dark:bg-slate-900 sm:gap-1 sm:p-1">
                  {[
                    ["board", "fa-solid fa-grip"],
                    ["list", "fa-solid fa-list"],
                    ["gallery", "fa-regular fa-images"],
                  ].map(([mode, icon]) => (
                    <button type="button" key={mode} onClick={() => { setViewMode(mode); if (mode === "board" && !["board", "mindmap"].includes(activeSection)) setActiveSection("board"); else if (mode !== "board" && ["board", "mindmap"].includes(activeSection)) setActiveSection("all"); }} className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm sm:h-8 sm:w-9 ${viewMode === mode ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" : "text-slate-400 hover:text-indigo-600"}`} title={`${mode} view`} aria-label={`${mode} view`}><i className={icon}></i></button>
                  ))}
                </div>}
              </div>
            )}
            {connectingFrom && <div className="mx-5 mb-2 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><span>Select another note to connect it to the selected note.</span><button type="button" onClick={() => setConnectingFrom(null)} aria-label="Cancel connection"><i className="fa-solid fa-xmark"></i></button></div>}
            {activeSection === "timeline" && timelineCalendarNotice && (
              <div role="status" className="mx-5 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                <span>{timelineCalendarNotice.message}</span>
                {timelineCalendarNotice.needsConnect && <a href="/dashboard/calendar" className="shrink-0 underline underline-offset-2">Connect Google Calendar</a>}
              </div>
            )}

            {activeSection === "templates" ? (
              <div className="grid flex-1 content-start grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Meeting Notes", kind: "document", des: "Agenda:\n\nDiscussion:\n\nAction items:", prio: "blue", tags: ["work"] },
                  { title: "Project Ideas", kind: "todo", tasks: [{ id: "idea-1", text: "Define the goal", done: false }, { id: "idea-2", text: "List next steps", done: false }], prio: "purple", tags: ["work"] },
                  { title: "Personal Checklist", kind: "todo", tasks: [{ id: "personal-1", text: "Add your first task", done: false }], prio: "green", tags: ["personal"] },
                  { title: "Screenshot", kind: "note", des: "Paste a screenshot with Ctrl+V or attach an image.", prio: "white" },
                ].map((template) => (
                  <button type="button" key={template.title} onClick={() => template.title === "Screenshot" ? imageInputRef.current?.click() : addTemplate(template)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"><i className={template.kind === "todo" ? "fa-regular fa-square-check" : "fa-regular fa-file-lines"}></i></span>
                    <span className="block font-bold">{template.title}</span><span className="mt-1 block text-xs text-slate-500">Create from template</span>
                  </button>
                ))}
              </div>
            ) : activeSection === "trash" && displayedNotes.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-500"><i className="fa-regular fa-trash-can mb-3 text-3xl"></i><h2 className="font-bold">Trash is empty</h2><p className="mt-1 text-sm">Deleted notes can be restored here.</p></div>
            ) : activeSection === "timeline" ? (
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-24 sm:px-8">
                {displayedNotes.length > 0 ? (
                  <ol className="mx-auto max-w-5xl border-l-2 border-indigo-200 pl-5 dark:border-indigo-900">
                    {groupTimelineNotes(displayedNotes).map((group) => {
                      const groupDate = new Date(`${group.dateKey}T12:00:00`);
                      return (
                        <li key={group.dateKey} className="relative pb-7 last:pb-0">
                          <span className="absolute -left-[27px] top-1 flex h-3 w-3 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-950"></span>
                          <h2 className="mb-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <time dateTime={group.dateKey}>{groupDate.toLocaleDateString([], { dateStyle: "full" })}</time>
                          </h2>
                          <div className={`grid grid-cols-1 items-start gap-4 ${group.notes.length > 1 ? "md:grid-cols-2" : ""}`}>
                            {group.notes.map((note) => {
                              const noteDate = new Date(getTimelineTimestamp(note));
                              return (
                                <article key={note.id} className="min-w-0">
                                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    <i className={`fa-regular ${note.reminderAt ? "fa-bell text-amber-500" : "fa-clock"}`}></i>
                                    {note.reminderAt ? (
                                      <time dateTime={noteDate.toISOString()}>{noteDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                                    ) : <span>Note</span>}
                                    {note.reminderAt && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">Reminder</span>}
                                  </div>
                                  <Xwrapper>
                                    <StickyNote note={{ ...note, des: note.des || note.title || "" }} updateNote={updateNote} deleteNote={handleDeleteNote} restoreNote={restoreNote} permanentlyDeleteNote={requestPermanentDelete} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage} imageSources={imageSources} connectingFrom={connectingFrom} onConnectClick={handleConnectClick} zoom={1} bringToFront={bringToFront} isDraggable={false} hideTitle />
                                  </Xwrapper>
                                </article>
                              );
                            })}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                    <i className="fa-solid fa-timeline mb-3 text-3xl text-sky-500"></i>
                    <h2 className="font-bold">Your timeline starts with a note</h2>
                    <p className="mt-1 text-sm">Set a date or reminder from any note’s options menu to plan ahead.</p>
                  </div>
                )}
              </div>
            ) : (activeSection === "board" || activeSection === "mindmap") && viewMode === "board" ? (
              <div
                ref={boardRef}
                onWheel={(event) => {
                  if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    setZoomAtPoint(zoomRef.current * Math.exp(-event.deltaY * 0.01), { x: event.clientX, y: event.clientY });
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); handleAddImages(null, event.dataTransfer.files); }}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                style={{ touchAction: "none" }}
                className="relative min-h-0 flex-1 touch-none overflow-hidden bg-[#f4f5f7] select-none dark:bg-slate-950"
              >
                <Xwrapper>
                  {connections.filter((connection) => displayedNotes.some((note) => note.id === connection.from) && displayedNotes.some((note) => note.id === connection.to)).map((connection) => (
                    <Xarrow key={connection.id} start={`note-${connection.from}`} end={`note-${connection.to}`} color={darkMode ? "#475569" : "#94a3b8"} strokeWidth={3} path="smooth" headSize={6} passProps={{ onClick: () => deleteConnection(connection.id), className: "cursor-pointer hover:stroke-red-500 hover:opacity-50 transition-all drop-shadow-sm", title: "Click to delete connection" }} />
                  ))}
                  <div
                    id="canvas-bg"
                    style={{ width: `${6000 * zoom}px`, height: `${6000 * zoom}px` }}
                    className="relative bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] bg-[size:32px_32px] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)]"
                  >
                    <div
                      style={{ width: "6000px", height: "6000px", transform: `scale(${zoom})`, transformOrigin: "0 0", touchAction: "none", transition: isPinching ? "none" : "transform 0.15s ease-out" }}
                      className={`absolute left-0 top-0 ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
                    >
                      {displayedNotes.map((note) => (
                        <StickyNote key={note.id} note={note} updateNote={updateNote} deleteNote={handleDeleteNote} restoreNote={restoreNote} permanentlyDeleteNote={permanentlyDeleteNote} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage} imageSources={imageSources} connectingFrom={connectingFrom} onConnectClick={handleConnectClick} onAddBranch={handleAddBranch} isMindMap={activeSection === "mindmap"} zoom={zoom} bringToFront={bringToFront} />
                      ))}
                    </div>
                  </div>
                </Xwrapper>
                {activeSection === "mindmap" && (
                  <div className="absolute left-5 top-5 z-40 flex max-w-[calc(100%-5rem)] items-center gap-2 rounded-xl border border-violet-200 bg-white/90 px-3 py-2 text-xs text-violet-900 shadow backdrop-blur dark:border-violet-500/30 dark:bg-slate-900/90 dark:text-violet-200">
                    <i className="fa-solid fa-diagram-project text-violet-500"></i>
                    <span className="truncate">Mind Map · Add topics, branch from a card, or connect any nodes</span>
                  </div>
                )}
                <div className="fixed bottom-28 right-2 z-40 hidden sm:flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300 sm:right-4 lg:bottom-5 lg:right-5">
                  <button type="button" onClick={() => setZoomAtPoint(zoomRef.current + 0.1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700" title="Zoom in"><i className="fa-solid fa-plus"></i></button>
                  <span className="py-1 text-[10px] font-bold">{Math.round(zoom * 100)}%</span>
                  <button type="button" onClick={() => setZoomAtPoint(zoomRef.current - 0.1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700" title="Zoom out"><i className="fa-solid fa-minus"></i></button>
                </div>
                {showPanHelperText && <div className="pointer-events-none absolute bottom-5 left-5 hidden rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500 shadow dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 lg:block"><i className="fa-solid fa-hand-pointer mr-2"></i>Drag the canvas to pan · Ctrl+V to paste screenshots</div>}
              </div>
            ) : (
              <div className={`min-h-0 flex-1 overflow-y-auto p-4 pb-24 sm:p-6 ${viewMode === "list" ? "space-y-3" : "grid grid-cols-1 content-start gap-4 sm:grid-cols-2 xl:grid-cols-3"}`}>
                {activeSection === "trash" && displayedNotes.length > 0 && <div className="col-span-full flex justify-end"><button type="button" onClick={requestEmptyTrash} className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Empty Trash</button></div>}
                {displayedNotes.map((note) => (
                  <Xwrapper key={note.id}>
                    <div className={viewMode === "list" ? "max-w-3xl" : ""}>
                      <StickyNote note={note} updateNote={updateNote} deleteNote={handleDeleteNote} restoreNote={restoreNote} permanentlyDeleteNote={requestPermanentDelete} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage} imageSources={imageSources} connectingFrom={connectingFrom} onConnectClick={handleConnectClick} zoom={1} bringToFront={bringToFront} isDraggable={false} />
                    </div>
                  </Xwrapper>
                ))}
                {displayedNotes.length === 0 && activeSection !== "templates" && <div className="col-span-full flex flex-col items-center py-16 text-center text-slate-500"><i className={`${activeSection === "documents" ? "fa-regular fa-file-lines" : activeSection === "mindmap" ? "fa-solid fa-diagram-project" : "fa-regular fa-note-sticky"} mb-3 text-3xl text-indigo-400`}></i><h2 className="font-bold">{activeSection === "documents" ? "No documents yet" : activeSection === "mindmap" ? "No mind map topics yet" : "No notes here yet"}</h2><p className="mt-1 text-sm">{activeSection === "documents" ? "Create your first document to see it here." : activeSection === "mindmap" ? "Add a topic or create a mind map from the quick bar." : "Add a quick note or create a checklist to get started."}</p><button type="button" onClick={() => activeSection === "documents" ? handleAddNote({ title: "New Document", kind: "document" }) : activeSection === "mindmap" ? handleAddNote({ title: "New topic", isMindMap: true }) : handleAddNote()} className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white"><i className="fa-solid fa-plus mr-2"></i>{activeSection === "documents" ? "New Document" : activeSection === "mindmap" ? "New Topic" : "New Note"}</button></div>}
              </div>
            )}
          </div>
          {showQuickComposer && (
            <form
              onSubmit={handleQuickNoteSubmit}
              style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
              className="absolute left-1/2 z-40 flex w-[calc(100%-1rem)] max-w-[700px] -translate-x-1/2 flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur-md transition-[border-color,box-shadow] duration-200 focus-within:border-indigo-300 focus-within:shadow-xl dark:border-slate-700 dark:bg-slate-900/95 sm:w-[calc(100%-2rem)] lg:bottom-4 lg:flex-row lg:items-center lg:gap-2 lg:rounded-full lg:px-3 lg:py-2"
            >
              {activeSection === "mindmap" ? (
                <textarea
                  ref={quickNoteInputRef}
                  rows={1}
                  value={quickNoteText}
                  onChange={(event) => {
                    setQuickNoteText(event.target.value);
                    event.target.style.height = "auto";
                    event.target.style.height = `${Math.min(event.target.scrollHeight, 88)}px`;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder={quickComposerPlaceholder}
                  title="Describe the mind map or add a branch/topic; details are placed in the note body, not the title."
                  className="max-h-[120px] min-h-11 w-full min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 outline-none placeholder:text-slate-400 lg:min-h-0 lg:py-1"
                />
              ) : (
                <textarea
                  ref={quickNoteInputRef}
                  rows={1}
                  value={quickNoteText}
                  onChange={(event) => {
                    setQuickNoteText(event.target.value);
                    event.target.style.height = "auto";
                    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && window.matchMedia("(min-width: 1024px)").matches) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder={quickComposerPlaceholder}
                  title={activeSection === "timeline" ? "Include dates/times, e.g. timeline banao; 12 Jan: kickoff; 15 Jan: review" : "Create a note or use a timeline/mind map command"}
                  className="max-h-[120px] min-h-11 w-full min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 outline-none placeholder:text-slate-400 lg:min-h-0 lg:py-1"
                />
              )}
              <div className="flex w-full shrink-0 items-center justify-between gap-2 lg:w-auto lg:justify-start">
                <div className="relative" ref={quickCreateMenuRef} data-quick-create-menu>
                  <button type="button" onClick={() => setQuickCreateMenuOpen((open) => !open)} aria-haspopup="menu" aria-expanded={quickCreateMenuOpen} title="Choose what to create" className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:h-9 lg:rounded-full">
                    <i className="fa-solid fa-plus text-indigo-500"></i><span>Add</span><i className="fa-solid fa-chevron-up text-[9px] text-slate-400"></i>
                  </button>
                  {quickCreateMenuOpen && (
                    <div role="menu" className="absolute bottom-full left-0 z-[80] mb-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      <button type="button" role="menuitem" onClick={handleQuickNoteCreate} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><i className="fa-regular fa-note-sticky w-5 text-center text-indigo-500"></i>Note</button>
                      <button type="button" role="menuitem" onClick={() => { handleQuickTodoCreate(); setQuickCreateMenuOpen(false); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><i className="fa-regular fa-square-check w-5 text-center text-indigo-500"></i>To-Do list</button>
                      <button type="button" role="menuitem" onClick={() => { setQuickCreateMenuOpen(false); imageInputRef.current?.click(); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><i className="fa-regular fa-image w-5 text-center text-indigo-500"></i>Image</button>
                      <button type="button" role="menuitem" onClick={() => { handleQuickDocumentCreate(); setQuickCreateMenuOpen(false); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><i className="fa-regular fa-file-lines w-5 text-center text-indigo-500"></i>Document</button>
                    </div>
                  )}
                  <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => { handleAddImages(null, event.target.files); event.target.value = ""; }} />
                </div>
                <button type="submit" className="flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-white shadow hover:bg-indigo-700 lg:h-9 lg:min-w-9 lg:rounded-full lg:px-0" aria-label={activeSection === "mindmap" ? "Create mind map" : "Add note"}><i className={`fa-solid ${activeSection === "mindmap" ? "fa-diagram-project" : "fa-plus"}`}></i><span className="text-xs font-bold lg:hidden">{activeSection === "mindmap" ? "Create" : "Add"}</span></button>
              </div>
            </form>
          )}
        </main>
      </div>
      {deleteConfirmation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteConfirmation(null); }}
        >
          <section
            data-delete-confirmation-dialog
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"><i className="fa-solid fa-triangle-exclamation"></i></span>
              <div>
                <h2 id="delete-confirmation-title" className="text-base font-bold text-slate-900 dark:text-white">
                  {deleteConfirmation.type === "trash" ? "Permanently delete all trashed notes?" : "Permanently delete this note?"}
                </h2>
                <p id="delete-confirmation-description" className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This action cannot be undone. {deleteConfirmation.type === "trash" ? "All notes currently in Trash and their attached images will be removed permanently." : "This note and its attached images will be removed permanently."}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button ref={deleteCancelButtonRef} type="button" onClick={() => setDeleteConfirmation(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
              <button type="button" onClick={confirmPermanentDeletion} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                {deleteConfirmation.type === "trash" ? "Empty Trash" : "Delete permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
      <NotebookSyncModal isOpen={syncModalOpen} onClose={closeSyncModal} darkMode={darkMode} />
    </AppShell>
  );
};

export default Home;
