import { createContext, useContext, useState, useEffect } from "react";
import swal from "sweetalert";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("darkMode")) || false;
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

  // Sync Theme
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
