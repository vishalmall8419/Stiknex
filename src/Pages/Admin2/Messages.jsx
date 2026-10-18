import React, { useState, useEffect } from "react";
import { MessageSquare, Inbox, Trash2, Search, Star, Mail, Loader2, RefreshCw } from "lucide-react";
import swal from "sweetalert";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch("/api/reviews", { headers });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : (data.reviews || []));
      } else {
        const fallbackRes = await fetch("/api/reviews");
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const willDelete = await swal({
      title: "Delete Message?",
      text: "Are you sure you want to delete this user feedback message?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        swal("Deleted!", "Message removed successfully.", "success");
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        swal("Error", "Could not delete message.", "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to delete message.", "error");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const query = searchQuery.toLowerCase();
    const text = (m.message || "").toLowerCase();
    const name = (m.userName || "").toLowerCase();
    const tool = (m.tool || "").toLowerCase();
    return text.includes(query) || name.includes(query) || tool.includes(query);
  });

  return (
    <main className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-indigo-600" /> User Messages & Feedback
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real user feedback, ratings, and inquiries submitted across Stiknex tools
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, message, or tool..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading user messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <Inbox size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
            {searchQuery ? "No matching messages found" : "No Messages Yet"}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search query."
              : "When users send feedback through the rate & review widget, their full messages and ratings will be listed here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {msg.userName || "Anonymous User"}
                    </h4>
                    <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {msg.tool || "stiknex"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= (msg.rating || 5) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed whitespace-pre-wrap">
                  "{msg.message}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently"}
                </span>

                <div className="flex items-center gap-2">
                  {msg.userEmail && (
                    <a
                      href={`mailto:${msg.userEmail}?subject=Regarding your Stiknex Feedback`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Reply via Email"
                    >
                      <Mail size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Messages;
