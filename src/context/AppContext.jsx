import { createContext, useContext, useState, useEffect } from "react";
import swal from "sweetalert";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) {
        return JSON.parse(stored);
      }
      const stiknexTheme = localStorage.getItem("stiknex_theme");
      if (stiknexTheme) {
        return stiknexTheme === "dark";
      }
      return false;
    } catch {
      return false;
    }
  });

  // Sticky Notes State
  const [notes, setNotes] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("notes")) || [];
      return stored.map((note, idx) => ({
        ...note,
        zIndex: note.zIndex !== undefined ? note.zIndex : idx + 1,
      }));
    } catch {
      return [];
    }
  });

  // Whiteboards State
  const [whiteboards, setWhiteboards] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("whiteboards")) || [];
      // Assign fallback IDs for legacy whiteboards that might be missing them
      return stored.map(wb => ({
        ...wb,
        id: wb.id || `legacy_${Math.random().toString(36).substr(2, 9)}`,
      }));
    } catch {
      return [];
    }
  });

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("stiknex_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("stiknex_token") || null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  const openAuthModal = (tab = "login", onAuthSuccess = null) => {
    setAuthModalTab(tab);
    setAuthSuccessCallback(() => onAuthSuccess);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthSuccessCallback(null);
  };

  // Sync Auth to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("stiknex_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("stiknex_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("stiknex_token", token);
    } else {
      localStorage.removeItem("stiknex_token");
    }
  }, [token]);

  // Refresh User Profile on Mount
  useEffect(() => {
    if (token) {
      fetch("/api/auth?action=user-me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data.user) {
            setUser(data.user);
          } else if (data?.success === false) {
            // Token expired
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const loginUser = async (identifier, password) => {
    try {
      const res = await fetch("/api/auth?action=user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const registerUser = async (formData) => {
    try {
      const res = await fetch("/api/auth?action=user-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("stiknex_token");
    localStorage.removeItem("stiknex_user");
  };

  const saveTypingScore = async (scoreData) => {
    if (!token) {
      return { success: false, notLoggedIn: true };
    }
    try {
      const res = await fetch("/api/auth?action=save-typing-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(scoreData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.userStats) {
          setUser((prev) => (prev ? { ...prev, ...data.userStats } : prev));
        }
        return { success: true, data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Sync Theme
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("stiknex_theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const openFeedback = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("stiknex_open_feedback"));
    }
  };

  // Sync Notes & Whiteboards
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const refreshNotesFromStorage = (event) => {
      if (event.type === "storage" && event.key !== "notes") return;
      const syncedNotes = event.detail?.remotePayload?.stickyNotes;
      try {
        const stored = Array.isArray(syncedNotes)
          ? syncedNotes
          : JSON.parse(localStorage.getItem("notes") || "[]");
        if (Array.isArray(stored)) {
          setNotes(stored.map((note, idx) => ({
            ...note,
            zIndex: note.zIndex !== undefined ? note.zIndex : idx + 1,
          })));
        }
      } catch (error) {
        console.error("Could not load synchronized sticky notes:", error);
      }
    };

    window.addEventListener("storage", refreshNotesFromStorage);
    window.addEventListener("stiknex_notebook_synced", refreshNotesFromStorage);
    return () => {
      window.removeEventListener("storage", refreshNotesFromStorage);
      window.removeEventListener("stiknex_notebook_synced", refreshNotesFromStorage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("whiteboards", JSON.stringify(whiteboards));
  }, [whiteboards]);

  // Notes API
  const addNote = (note) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex || 1), 1);
      const newNote = {
        ...note,
        zIndex: maxZ + 1,
        createdAt: note.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      return [...prev, newNote];
    });
  };

  const bringToFront = (id) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex || 1), 1);
      const targetNote = prev.find((n) => n.id === id);
      if (!targetNote || targetNote.zIndex === maxZ) return prev;
      return prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  };
  const deleteNote = (id) => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, trashedAt: Date.now(), updatedAt: Date.now() } : note,
    ));
  };
  const deleteMultipleNotes = (ids) => {
    swal({
      title: "Move notes to Trash?",
      text: "You can restore these notes from the Trash section.",
      icon: "warning",
      buttons: ["Cancel", "Move to Trash"],
    }).then((shouldTrash) => {
      if (shouldTrash) setNotes((prev) => prev.map((note) => ids.includes(note.id)
        ? { ...note, trashedAt: Date.now(), updatedAt: Date.now() }
        : note));
    });
  };
  const restoreNote = (id) => {
    setNotes((prev) => prev.map((note) => note.id === id
      ? { ...note, trashedAt: null, updatedAt: Date.now() }
      : note));
  };
  const permanentlyDeleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };
  const emptyTrash = () => {
    setNotes((prev) => prev.filter((note) => !note.trashedAt));
  };
  const updateNote = (id, updatedData) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updatedData, updatedAt: Date.now() } : note)));
  };

  // Whiteboard API
  const addWhiteboard = (wb) => setWhiteboards((prev) => [{ ...wb, updatedAt: Date.now() }, ...prev]);
  const updateWhiteboard = (id, updatedData) => {
    setWhiteboards((prev) => prev.map((wb) => (wb.id === id ? { ...wb, ...updatedData, updatedAt: Date.now() } : wb)));
  };
  const deleteWhiteboard = (id) => {
    swal({
      title: "Delete Drawing?",
      text: "This drawing will be permanently deleted.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) setWhiteboards((prev) => prev.filter((wb) => wb.id !== id));
    });
  };

  const importNotes = (importedNotes) => {
    if (Array.isArray(importedNotes)) {
      setNotes(importedNotes);
    }
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        theme: darkMode ? "dark" : "light",
        toggleTheme: toggleDarkMode,
        openFeedback,
        notes,
        addNote,
        deleteNote,
        deleteMultipleNotes,
        restoreNote,
        permanentlyDeleteNote,
        emptyTrash,
        updateNote,
        bringToFront,
        importNotes,
        whiteboards,
        addWhiteboard,
        updateWhiteboard,
        deleteWhiteboard,
        user,
        token,
        isAuthenticated: !!token && !!user,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        saveTypingScore,
        authSuccessCallback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
