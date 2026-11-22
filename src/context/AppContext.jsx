import { createContext, useContext, useState, useEffect } from "react";
import swal from "sweetalert";
import {
  db,
  generateClientId,
  enqueueSyncOperation,
  migrateLocalStorageToDexie
} from "../db/localDb";
import { scheduleDebouncedSync, triggerSync } from "../services/syncManager";
import {
  initSocketService,
  joinCurrentMesh,
  emitRealtimeNoteChange,
  emitRealtimeWhiteboardChange,
} from "../services/socketService";
import {
  linkAccountSync,
  recordDeletedNoteId,
  getDeletedNoteIds,
} from "../Pages/Notebook/notebookSyncManager";

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
    const clientId = scoreData.clientId || generateClientId();
    const now = Date.now();
    const typingRecord = {
      ...scoreData,
      clientId,
      updatedAt: now,
      createdAt: now,
      isDeleted: false,
    };

    // Always persist to local Dexie first (0ms latency, works 100% offline)
    try {
      await db.typingResults.put(typingRecord);
      await enqueueSyncOperation({
        collection: "typingResults",
        action: "CREATE",
        clientId,
        payload: typingRecord,
      });
      scheduleDebouncedSync(1000);
    } catch (e) {
      console.warn("[Dexie] Failed to store typing score locally:", e);
    }

    if (!token) {
      return { success: false, notLoggedIn: true, savedOffline: true };
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
      return { success: false, error: data.error, savedOffline: true };
    } catch (err) {
      return { success: true, savedOffline: true, offline: true };
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

  // Initialize Local-First Dexie Storage & Socket.io Realtime Mesh
  useEffect(() => {
    let mounted = true;
    initSocketService();

    (async () => {
      try {
        await migrateLocalStorageToDexie();
        const activeNotes = await db.notes.filter((n) => !n.isDeleted).toArray();
        if (mounted && activeNotes.length > 0) {
          setNotes(
            activeNotes.map((note, idx) => ({
              ...note,
              zIndex: note.zIndex !== undefined ? note.zIndex : idx + 1,
            }))
          );
        }
        const activeWb = await db.whiteboards.filter((w) => !w.isDeleted).toArray();
        if (mounted && activeWb.length > 0) {
          setWhiteboards(activeWb);
        }
      } catch (err) {
        console.warn("[Dexie] Initial load error:", err);
      }
    })();

    // Listen for sync completion to refresh remote changes into local UI
    const handleSyncComplete = async () => {
      try {
        const refreshedNotes = await db.notes.filter((n) => !n.isDeleted).toArray();
        if (refreshedNotes.length > 0) {
          setNotes(
            refreshedNotes.map((n, idx) => ({
              ...n,
              zIndex: n.zIndex !== undefined ? n.zIndex : idx + 1,
            }))
          );
        }
        const refreshedWb = await db.whiteboards.filter((w) => !w.isDeleted).toArray();
        if (refreshedWb.length > 0) {
          setWhiteboards(refreshedWb);
        }
      } catch (e) {
        console.warn("[Dexie] Post-sync refresh error:", e);
      }
    };

    const handleRealtimeNote = async () => {
      try {
        const activeNotes = await db.notes.filter((n) => !n.isDeleted).toArray();
        setNotes(activeNotes.map((n, idx) => ({ ...n, zIndex: n.zIndex !== undefined ? n.zIndex : idx + 1 })));
      } catch {}
    };

    const handleRealtimeWb = async () => {
      try {
        const activeWb = await db.whiteboards.filter((w) => !w.isDeleted).toArray();
        setWhiteboards(activeWb);
      } catch {}
    };

    window.addEventListener("stiknex_sync_completed", handleSyncComplete);
    window.addEventListener("stiknex_realtime_note", handleRealtimeNote);
    window.addEventListener("stiknex_realtime_whiteboard", handleRealtimeWb);

    return () => {
      mounted = false;
      window.removeEventListener("stiknex_sync_completed", handleSyncComplete);
      window.removeEventListener("stiknex_realtime_note", handleRealtimeNote);
      window.removeEventListener("stiknex_realtime_whiteboard", handleRealtimeWb);
    };
  }, []);

  // Automatically link user account to Multi-Device Cloud Sync and Socket.io mesh
  useEffect(() => {
    if (user && (user.syncGroupId || user.id || user._id)) {
      linkAccountSync(user).then(() => {
        joinCurrentMesh();
        triggerSync();
      }).catch((err) => {
        console.warn("[AccountSync] Link error:", err);
      });
    }
  }, [user]);

  // Sync Notes & Whiteboards fallback to localStorage for backwards compatibility
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const refreshNotesFromStorage = (event) => {
      if (event.type === "storage" && event.key !== "notes") return;
      const syncedNotes = event.detail?.remotePayload?.stickyNotes;
      const deletedNotes = getDeletedNoteIds();
      try {
        const stored = Array.isArray(syncedNotes)
          ? syncedNotes
          : JSON.parse(localStorage.getItem("notes") || "[]");
        if (Array.isArray(stored)) {
          setNotes((prevNotes) => {
            const currentMap = new Map(prevNotes.map((n) => [n.id || n.clientId, n]));
            // Merge incoming notes safely without blindly replacing or destroying local cards
            for (const inNote of stored) {
              const noteId = inNote.id || inNote.clientId;
              if (!noteId || deletedNotes[noteId] || inNote.isDeleted) {
                currentMap.delete(noteId);
                continue;
              }
              const local = currentMap.get(noteId);
              if (!local) {
                currentMap.set(noteId, inNote);
              } else {
                const lText = local.text || local.content || "";
                const rText = inNote.text || inNote.content || "";
                // If remote note has empty content but local has real text, keep local text!
                if (lText && !rText) {
                  currentMap.set(noteId, { ...inNote, text: lText, content: lText });
                } else if ((inNote.updatedAt || 0) >= (local.updatedAt || 0)) {
                  currentMap.set(noteId, inNote);
                }
              }
            }
            return Array.from(currentMap.values()).map((note, idx) => ({
              ...note,
              zIndex: note.zIndex !== undefined ? note.zIndex : idx + 1,
            }));
          });
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

  // Local-First Optimistic Notes API
  const addNote = (note) => {
    const clientId = note.clientId || note.id || generateClientId();
    const now = Date.now();
    setNotes((prev) => {
      const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex || 1), 1);
      const newNote = {
        ...note,
        clientId,
        id: note.id || clientId,
        zIndex: maxZ + 1,
        createdAt: note.createdAt || now,
        updatedAt: now,
        isDeleted: false,
      };

      // Dexie 0ms write + auto-sync enqueue + socket.io real-time broadcast
      db.notes.put(newNote).catch(console.error);
      try {
        const currentRaw = localStorage.getItem("notes");
        const currentList = currentRaw ? JSON.parse(currentRaw) : [];
        localStorage.setItem("notes", JSON.stringify([...currentList.filter(n => n.id !== newNote.id), newNote]));
      } catch {}
      enqueueSyncOperation({
        collection: "notes",
        action: "CREATE",
        clientId,
        payload: newNote,
      });
      scheduleDebouncedSync();
      emitRealtimeNoteChange(newNote, "UPSERT");

      return [...prev, newNote];
    });
  };

  const bringToFront = (id) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex || 1), 1);
      const targetNote = prev.find((n) => n.id === id || n.clientId === id);
      if (!targetNote || targetNote.zIndex === maxZ) return prev;
      return prev.map((n) => (n.id === id || n.clientId === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  };

  const deleteNote = (id) => {
    const now = Date.now();
    recordDeletedNoteId(id);
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id || note.clientId === id) {
          const trashed = { ...note, trashedAt: now, updatedAt: now };
          const clientId = trashed.clientId || trashed.id;
          db.notes.put(trashed).catch(console.error);
          enqueueSyncOperation({
            collection: "notes",
            action: "UPDATE",
            clientId,
            payload: trashed,
          });
          scheduleDebouncedSync();
          emitRealtimeNoteChange(trashed, "UPDATE");
          return trashed;
        }
        return note;
      })
    );
  };

  const deleteMultipleNotes = (ids) => {
    swal({
      title: "Move notes to Trash?",
      text: "You can restore these notes from the Trash section.",
      icon: "warning",
      buttons: ["Cancel", "Move to Trash"],
    }).then((shouldTrash) => {
      if (shouldTrash) {
        const now = Date.now();
        setNotes((prev) =>
          prev.map((note) => {
            if (ids.includes(note.id) || ids.includes(note.clientId)) {
              const trashed = { ...note, trashedAt: now, updatedAt: now };
              const clientId = trashed.clientId || trashed.id;
              db.notes.put(trashed).catch(console.error);
              enqueueSyncOperation({
                collection: "notes",
                action: "UPDATE",
                clientId,
                payload: trashed,
              });
              scheduleDebouncedSync();
              return trashed;
            }
            return note;
          })
        );
      }
    });
  };

  const restoreNote = (id) => {
    const now = Date.now();
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id || note.clientId === id) {
          const restored = { ...note, trashedAt: null, updatedAt: now };
          const clientId = restored.clientId || restored.id;
          db.notes.put(restored).catch(console.error);
          enqueueSyncOperation({
            collection: "notes",
            action: "UPDATE",
            clientId,
            payload: restored,
          });
          scheduleDebouncedSync();
          emitRealtimeNoteChange(restored, "UPDATE");
          return restored;
        }
        return note;
      })
    );
  };

  const permanentlyDeleteNote = (id) => {
    const now = Date.now();
    recordDeletedNoteId(id);
    try {
      const currentRaw = localStorage.getItem("notes");
      const currentList = currentRaw ? JSON.parse(currentRaw) : [];
      localStorage.setItem("notes", JSON.stringify(currentList.filter(n => n.id !== id && n.clientId !== id)));
    } catch {}
    setNotes((prev) => {
      const target = prev.find((n) => n.id === id || n.clientId === id);
      if (target) {
        const clientId = target.clientId || target.id;
        db.notes.put({ ...target, isDeleted: true, updatedAt: now }).catch(console.error);
        enqueueSyncOperation({
          collection: "notes",
          action: "DELETE",
          clientId,
          payload: { ...target, isDeleted: true, updatedAt: now },
        });
        scheduleDebouncedSync();
        emitRealtimeNoteChange({ ...target, isDeleted: true, updatedAt: now }, "DELETE");
      }
      return prev.filter((note) => note.id !== id && note.clientId !== id);
    });
  };

  const emptyTrash = () => {
    const now = Date.now();
    setNotes((prev) => {
      prev.forEach((note) => {
        if (note.trashedAt) {
          const clientId = note.clientId || note.id;
          if (note.id) recordDeletedNoteId(note.id);
          if (clientId) recordDeletedNoteId(clientId);
          db.notes.put({ ...note, isDeleted: true, updatedAt: now }).catch(console.error);
          enqueueSyncOperation({
            collection: "notes",
            action: "DELETE",
            clientId,
            payload: { ...note, isDeleted: true, updatedAt: now },
          });
        }
      });
      scheduleDebouncedSync();
      const kept = prev.filter((note) => !note.trashedAt);
      try {
        localStorage.setItem("notes", JSON.stringify(kept));
      } catch {}
      return kept;
    });
  };

  const updateNote = (id, updatedData) => {
    const now = Date.now();
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id || note.clientId === id) {
          const merged = { ...note, ...updatedData, updatedAt: now };
          const clientId = merged.clientId || merged.id;
          db.notes.put(merged).catch(console.error);
          enqueueSyncOperation({
            collection: "notes",
            action: "UPDATE",
            clientId,
            payload: merged,
          });
          scheduleDebouncedSync();
          emitRealtimeNoteChange(merged, "UPDATE");
          return merged;
        }
        return note;
      })
    );
  };

  // Local-First Optimistic Whiteboard API
  const addWhiteboard = (wb) => {
    const clientId = wb.clientId || wb.id || generateClientId();
    const now = Date.now();
    const newWb = {
      ...wb,
      clientId,
      id: wb.id || clientId,
      createdAt: wb.createdAt || now,
      updatedAt: now,
      isDeleted: false,
    };
    db.whiteboards.put(newWb).catch(console.error);
    enqueueSyncOperation({
      collection: "whiteboards",
      action: "CREATE",
      clientId,
      payload: newWb,
    });
    scheduleDebouncedSync();
    emitRealtimeWhiteboardChange(newWb, "CREATE");
    setWhiteboards((prev) => [newWb, ...prev]);
  };

  const updateWhiteboard = (id, updatedData) => {
    const now = Date.now();
    setWhiteboards((prev) =>
      prev.map((wb) => {
        if (wb.id === id || wb.clientId === id) {
          const merged = { ...wb, ...updatedData, updatedAt: now };
          const clientId = merged.clientId || merged.id;
          db.whiteboards.put(merged).catch(console.error);
          enqueueSyncOperation({
            collection: "whiteboards",
            action: "UPDATE",
            clientId,
            payload: merged,
          });
          scheduleDebouncedSync();
          emitRealtimeWhiteboardChange(merged, "UPDATE");
          return merged;
        }
        return wb;
      })
    );
  };

  const deleteWhiteboard = (id) => {
    swal({
      title: "Delete Drawing?",
      text: "This drawing will be permanently deleted.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const now = Date.now();
        setWhiteboards((prev) => {
          const target = prev.find((w) => w.id === id || w.clientId === id);
          if (target) {
            const clientId = target.clientId || target.id;
            db.whiteboards.put({ ...target, isDeleted: true, updatedAt: now }).catch(console.error);
            enqueueSyncOperation({
              collection: "whiteboards",
              action: "DELETE",
              clientId,
              payload: { ...target, isDeleted: true, updatedAt: now },
            });
            scheduleDebouncedSync();
            emitRealtimeWhiteboardChange({ ...target, isDeleted: true, updatedAt: now }, "DELETE");
          }
          return prev.filter((wb) => wb.id !== id && wb.clientId !== id);
        });
      }
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
