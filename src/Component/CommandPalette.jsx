import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ALL_TOOLS, TOOL_CATEGORIES } from "../data/toolsRegistry";
import { seoConfig } from "../utils/seoConfig";
import { useAppContext } from "../context/AppContext";

const CORE_ITEMS = [
  {
    id: "page:/",
    title: "Stiknex Home",
    path: "/",
    category: "Home",
    icon: "fa-solid fa-house",
    description: "Sticky notes, notebook, whiteboard, and free productivity tools.",
    featured: true,
  },
  {
    id: "page:/sticky-notes",
    title: "Sticky Notes Board",
    path: "/sticky-notes",
    category: "Workspace",
    icon: "fa-solid fa-note-sticky",
    description: "Infinite sticky notes canvas for ideas and tasks.",
    featured: true,
  },
  {
    id: "page:/online-notebook",
    title: "Online Notebook",
    path: "/online-notebook",
    category: "Workspace",
    icon: "fa-solid fa-book",
    description: "Private, locally saved rich-text notebook and notepad.",
    featured: true,
  },
  {
    id: "page:/whiteboard",
    title: "Whiteboard",
    path: "/whiteboard",
    category: "Workspace",
    icon: "fa-solid fa-paintbrush",
    description: "Draw diagrams, sketches, and visual plans.",
    featured: true,
  },
  {
    id: "page:/typing-lab",
    title: "Stiknex Typing Lab",
    path: "/typing-lab",
    category: "Typing",
    icon: "fa-solid fa-keyboard",
    description: "Typing speed tests, lessons, accuracy practice, and games.",
    featured: true,
  },
  {
    id: "page:/tools",
    title: "All Tools",
    path: "/tools",
    category: "Directory",
    icon: "fa-solid fa-wrench",
    description: "Browse the complete Stiknex tools catalog.",
    scope: "tools",
    featured: true,
  },
];

const cleanText = (value) => {
  if (typeof value !== "string") return "";
  const element = document.createElement("div");
  element.innerHTML = value;
  return (element.textContent || "").replace(/\s+/g, " ").trim();
};

const getNotebookItems = () => {
  try {
    const saved =
      localStorage.getItem("stiknexNotebooks") ||
      localStorage.getItem("stiknex_notebooks");
    const notebooks = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(notebooks)) return [];
    return notebooks
      .filter((notebook) => notebook && typeof notebook.id === "string")
      .map((notebook) => ({
        id: `notebook:${notebook.id}`,
        title: notebook.title || "Untitled Notebook",
        path: "/online-notebook",
        category: "Your Notebook",
        icon: "fa-solid fa-book",
        scope: "notebook",
        description: cleanText(notebook.content).slice(0, 360),
        searchText: cleanText(notebook.content),
        state: { quickSearchNotebookId: notebook.id },
        localOnly: true,
      }));
  } catch (error) {
    console.error("Could not read local notebook search data:", error);
    return [];
  }
};

const getSearchScope = (path) => {
  if (path === "/tools" || ALL_TOOLS.some((tool) => path === `/${tool.slug}`)) return "tools";
  if (path === "/blog" || path.startsWith("/blog/")) return "blog";
  if (path === "/sticky-notes") return "sticky";
  if (path === "/online-notebook" || path === "/notebook") return "notebook";
  return "";
};

const scoreItem = (item, query, currentPath) => {
  const tokens = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1);
  if (!tokens.length) return 0;
  const title = (item.title || "").toLowerCase();
  const description = (item.description || item.tagline || "").toLowerCase();
  const keywords = Array.isArray(item.keywords)
    ? item.keywords.join(" ").toLowerCase()
    : String(item.keywords || "").toLowerCase();
  const category = (item.category || "").toLowerCase();
  const body = (item.searchText || "").toLowerCase();

  let score = title.includes(query.toLowerCase()) ? 18 : 0;
  const activePath = currentPath.replace(/\/+$/, "") || "/";
  const itemPath = (item.path || "").replace(/\/+$/, "") || "/";
  const currentScope = getSearchScope(activePath);

  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (keywords.includes(token)) score += 5;
    if (description.includes(token)) score += 3;
    if (category.includes(token)) score += 2;
    if (body.includes(token)) score += 1;
  }
  if (score > 0 && itemPath === activePath) score += 40;
  if (score > 0 && currentScope && item.scope === currentScope) score += 10;
  return score;
};

const isPublicPath = (path) =>
  typeof path === "string" &&
  path.startsWith("/") &&
  !path.startsWith("/api/") &&
  !path.startsWith("/dashboard") &&
  !path.startsWith("/stiknex-secure-login-portal") &&
  !path.startsWith("/setup-2fa-admin") &&
  !path.includes(":");

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [savedNotebooks, setSavedNotebooks] = useState(getNotebookItems);
  const [blogError, setBlogError] = useState("");
  const [aiState, setAiState] = useState({ query: "", ids: [], loading: false, error: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { notes } = useAppContext();
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const labelRef = useRef(null);
  const notebookRoute =
    location.pathname === "/notebook" || location.pathname === "/online-notebook";
  const shortcutLabel = notebookRoute ? "Ctrl Shift K" : "Ctrl K";

  useEffect(() => {
    const handleOpenQuickSearch = () => {
      setIsOpen(true);
      setQuery("");
      setSelectedIndex(0);
    };
    const handleKeyDown = (event) => {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey === notebookRoute &&
        event.key.toLowerCase() === "k";
      if (isSearchShortcut) {
        event.preventDefault();
        setIsOpen((open) => !open);
        setQuery("");
        setSelectedIndex(0);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("stiknex_open_quick_search", handleOpenQuickSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("stiknex_open_quick_search", handleOpenQuickSearch);
    };
  }, [notebookRoute]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const controller = new AbortController();
    fetch("/api/blogs", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Blog search returned ${response.status}`);
        return response.json();
      })
      .then((result) => {
        setBlogs(Array.isArray(result) ? result : []);
        setBlogError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Could not load published posts for Quick Search:", error);
          setBlogError("Published posts could not be loaded. Other search results are still available.");
        }
      });

    return () => {
      window.clearTimeout(timer);
      controller.abort();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const refreshNotebooks = () => setSavedNotebooks(getNotebookItems());
    window.addEventListener("stiknex_notebooks_updated", refreshNotebooks);
    window.addEventListener("storage", refreshNotebooks);
    return () => {
      window.removeEventListener("stiknex_notebooks_updated", refreshNotebooks);
      window.removeEventListener("storage", refreshNotebooks);
    };
  }, []);

  const publicItems = useMemo(() => {
    const toolPaths = new Set(ALL_TOOLS.map((tool) => `/${tool.slug}`));
    const configuredPages = Object.entries(seoConfig)
      .filter(([path]) => isPublicPath(path) && !toolPaths.has(path))
      .map(([path, page]) => ({
        id: `page:${path}`,
        path,
        title: page.h1 || page.title || path.slice(1),
        category: "Page",
        icon: "fa-solid fa-compass",
        scope: getSearchScope(path),
        description: [page.description, page.primaryIntent, ...(page.secondaryIntents || [])]
          .filter(Boolean)
          .join(" "),
      }));
    const tools = ALL_TOOLS.map((tool) => ({
      id: `tool:${tool.slug}`,
      path: `/${tool.slug}`,
      title: tool.title,
      category: TOOL_CATEGORIES.find((category) => category.id === tool.category)?.name || tool.category,
      icon: tool.icon || "fa-solid fa-wrench",
      scope: "tools",
      description: tool.tagline,
      keywords: tool.keywords,
    }));
    const publishedPosts = blogs
      .filter((blog) => blog && typeof blog.slug === "string" && blog.title)
      .map((blog) => ({
        id: `blog:${blog.slug}`,
        path: `/blog/${blog.slug}`,
        title: blog.title,
        category: blog.category || "Blog",
        icon: "fa-solid fa-newspaper",
        scope: "blog",
        description: blog.excerpt || "",
      }));

    const items = [...CORE_ITEMS, ...configuredPages, ...tools, ...publishedPosts];
    const itemsByPath = new Map();
    for (const item of items) {
      const existing = itemsByPath.get(item.path);
      if (!existing) {
        itemsByPath.set(item.path, item);
        continue;
      }
      itemsByPath.set(item.path, {
        ...existing,
        ...item,
        title: existing.featured ? existing.title : item.title,
        category: existing.featured ? existing.category : item.category,
        icon: existing.featured ? existing.icon : item.icon,
        featured: Boolean(existing.featured || item.featured),
        description: [existing.description, item.description].filter(Boolean).join(" "),
      });
    }
    return Array.from(itemsByPath.values());
  }, [blogs]);

  const allItems = useMemo(() => {
    const stickyNotes = notes.map((note) => ({
      id: `sticky:${note.id}`,
      path: "/sticky-notes",
      title: note.title?.trim() || "Untitled Sticky Note",
      category: "Your Sticky Notes",
      icon: "fa-solid fa-note-sticky",
      scope: "sticky",
      description: note.des || "",
      searchText: note.des || "",
      state: { quickSearchTerm: note.title || note.des?.slice(0, 40) || "" },
      localOnly: true,
    }));
    return [...publicItems, ...stickyNotes, ...savedNotebooks];
  }, [notes, publicItems, savedNotebooks]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return allItems.filter((item) => item.featured).slice(0, 8);
    }

    const localResults = allItems
      .map((item) => ({ item, score: scoreItem(item, normalizedQuery, location.pathname) }))
      .filter(({ score }) => score > 0)
      .map(({ item, score }) => [item.id, { item, score }]);
    const idMap = new Map(allItems.map((item) => [item.id, item]));
    const aiRanked = aiState.query === normalizedQuery
      ? aiState.ids.map((id) => idMap.get(id)).filter(Boolean)
      : [];
    const rankedItems = new Map(localResults);
    aiRanked.forEach((item, index) => {
      const currentScore = rankedItems.get(item.id)?.score || 0;
      rankedItems.set(item.id, {
        item,
        score: Math.max(currentScore, scoreItem(item, normalizedQuery, location.pathname), 12 - index),
      });
    });
    return [...rankedItems.values()]
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 12);
  }, [allItems, aiState, location.pathname, query]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    if (!isOpen || normalizedQuery.length < 18 || queryTerms.length < 3) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setAiState({ query: normalizedQuery, ids: [], loading: true, error: "" });
      const candidates = publicItems
        .map((item) => ({ item, score: scoreItem(item, normalizedQuery, location.pathname) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 250)
        .map(({ item }) => ({
          id: item.id,
          title: item.title,
          description: [item.description, item.keywords].filter(Boolean).join(" "),
        }));

      try {
        const response = await fetch("/api/blogs?action=quick-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ query: normalizedQuery, items: candidates }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "AI ranking unavailable.");
        setAiState({ query: normalizedQuery, ids: payload.ids || [], loading: false, error: "" });
      } catch (error) {
        if (error.name !== "AbortError") {
          setAiState({
            query: normalizedQuery,
            ids: [],
            loading: false,
            error: error.message || "AI ranking unavailable; showing local results.",
          });
        }
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, location.pathname, publicItems, query]);

  const handleSelect = (item) => {
    setIsOpen(false);
    const state = item.state
      ? {
          ...item.state,
          ...(item.state.quickSearchNotebookId
            ? { quickSearchQuery: query.trim() }
            : {}),
        }
      : undefined;
    navigate(item.path, state ? { state } : undefined);
    if (state?.quickSearchTerm) {
      window.dispatchEvent(new CustomEvent("stiknex_quick_search_note", {
        detail: state.quickSearchTerm,
      }));
    }
    if (state?.quickSearchNotebookId) {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("stiknex_quick_search_notebook", {
          detail: state,
        }));
      }, 0);
    }
    setQuery("");
    setSelectedIndex(0);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % Math.max(1, results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => (index - 1 + results.length) % Math.max(1, results.length));
    } else if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleMouseEnter = () => {
    if (!btnRef.current || !labelRef.current) return;
    gsap.killTweensOf([btnRef.current, labelRef.current]);
    gsap.to(btnRef.current, {
      width: Math.max(165, labelRef.current.scrollWidth + 44),
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(labelRef.current, { opacity: 1, x: 0, duration: 0.25, delay: 0.05 });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current || !labelRef.current) return;
    gsap.killTweensOf([btnRef.current, labelRef.current]);
    gsap.to(labelRef.current, { opacity: 0, x: -8, duration: 0.15 });
    gsap.to(btnRef.current, { width: 38, duration: 0.3, ease: "power2.inOut" });
  };

  useEffect(() => {
    if (!isOpen && btnRef.current && labelRef.current) {
      gsap.set(btnRef.current, { width: 38 });
      gsap.set(labelRef.current, { opacity: 0, x: -8 });
    }
  }, [isOpen]);

  return (
    <>
      {!["/sticky-notes", "/notes"].includes(location.pathname) && <button
        ref={btnRef}
        onClick={() => {
          setQuery("");
          setSelectedIndex(0);
          setIsOpen(true);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed bottom-6 left-6 z-40 flex items-center h-[38px] bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-300 border border-white/10 rounded-full shadow-xl text-xs font-semibold overflow-hidden p-0 cursor-pointer"
        title={`Quick Search (${shortcutLabel})`}
        aria-label={`Quick Search (${shortcutLabel})`}
      >
        <span className="w-[38px] h-[38px] flex items-center justify-center shrink-0">
          <Search className="w-4 h-4 text-indigo-400" />
        </span>
        <span ref={labelRef} className="flex items-center gap-2 pr-3.5 whitespace-nowrap opacity-0 pointer-events-none">
          <span>Quick Search</span>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-slate-400">{shortcutLabel}</kbd>
        </span>
      </button>}

      {isOpen && (
        <div
          className="fixed inset-0 z-[2147483000] flex items-start justify-center overflow-y-auto px-4 py-[max(2rem,8vh)] bg-slate-950/75 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
              setQuery("");
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Stiknex Quick Search"
            className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white font-sans flex flex-col"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-slate-950/70">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask in your own words or search pages, tools, blogs, and your notes..."
                className="w-full bg-transparent outline-none text-white placeholder-slate-500 text-sm"
              />
              <button onClick={() => { setIsOpen(false); setQuery(""); }} className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Close Quick Search">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[min(65vh,560px)] overflow-y-auto divide-y divide-white/5 p-2">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition ${
                      isSelected ? "bg-indigo-600 text-white" : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-3 overflow-hidden">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-indigo-400"}`}>
                        <i className={item.icon}></i>
                      </span>
                      <span className="overflow-hidden">
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-sm truncate">{item.title}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isSelected ? "bg-white/20 text-white" : "bg-indigo-950 text-indigo-300 border border-indigo-500/20"}`}>
                            {item.category}
                          </span>
                        </span>
                        <span className={`block text-xs truncate mt-0.5 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                          {item.description || item.tagline}
                        </span>
                      </span>
                    </span>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-slate-600"}`} />
                  </button>
                );
              })}

              {query.trim() && results.length === 0 && !(aiState.query === query.trim() && aiState.loading) && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Nothing matched “{query}”. Try describing what you want to do.
                </div>
              )}
              {blogError && <p className="px-3 py-2 text-xs text-amber-300">{blogError}</p>}
            </div>

            <div className="px-4 py-3 bg-slate-950/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>Esc close</span>
                {aiState.query === query.trim() && aiState.loading && <span className="inline-flex items-center gap-1 text-indigo-300"><LoaderCircle className="w-3 h-3 animate-spin" /> Gemini searching</span>}
                {aiState.query === query.trim() && !aiState.loading && aiState.ids.length > 0 && <span className="inline-flex items-center gap-1 text-indigo-300"><Sparkles className="w-3 h-3" /> AI matched</span>}
              </div>
              <span className="text-right">
                {aiState.query === query.trim() && aiState.error
                  ? <span className="text-amber-300">{aiState.error}</span>
                  : "Long, descriptive queries are sent to Gemini with public page details; private notes stay on this device."}
              </span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
