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
      return JSON.parse(localStorage.getItem("notes")) || [];
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
    localStorage.setItem("whiteboards", JSON.stringify(whiteboards));
  }, [whiteboards]);

  // Notes API
  const addNote = (note) => setNotes((prev) => [{ ...note, updatedAt: Date.now() }, ...prev]);
  const deleteNote = (id) => {
    swal({
      title: "Delete Note?",
      text: "This note will be permanently deleted.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) setNotes((prev) => prev.filter((note) => note.id !== id));
    });
  };
  const deleteMultipleNotes = (ids) => {
    swal({
      title: "Delete Selected Notes?",
      text: "These notes will be permanently deleted.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) setNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
    });
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

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        notes,
        addNote,
        deleteNote,
        deleteMultipleNotes,
        updateNote,
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

