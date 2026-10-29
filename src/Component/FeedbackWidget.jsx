import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const FeedbackWidget = ({ tool = "stiknex", showButton = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("message"); // "message" or "review"
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const openFeedback = () => setIsOpen(true);
    window.addEventListener("stiknex_open_feedback", openFeedback);
    return () => window.removeEventListener("stiknex_open_feedback", openFeedback);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "review" && rating === 0) return;
    if (!message.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      rating: mode === "review" ? rating : 5,
      message,
      tool: mode === "message" ? "Direct Message" : tool,
      userName: name.trim() || "Anonymous",
      userEmail: email.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setRating(5);
          setMessage("");
          setName("");
          setEmail("");
        }, 2500);
      } else {
        const errorData = await res.json().catch(() => null);
        console.warn("Feedback submission returned non-ok:", res.status, errorData);
        try {
          const offline = JSON.parse(localStorage.getItem("stiknex_pending_reviews") || "[]");
          offline.push(payload);
          localStorage.setItem("stiknex_pending_reviews", JSON.stringify(offline));
        } catch (_) {}

        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setRating(5);
          setMessage("");
          setName("");
          setEmail("");
        }, 2500);
      }
    } catch (err) {
      console.warn("Feedback network error, saving locally:", err);
      try {
        const offline = JSON.parse(localStorage.getItem("stiknex_pending_reviews") || "[]");
        offline.push(payload);
        localStorage.setItem("stiknex_pending_reviews", JSON.stringify(offline));
      } catch (_) {}

      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setRating(5);
        setMessage("");
        setName("");
        setEmail("");
      }, 2500);
    }
  };

  if (!showButton && !isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <MessageSquare size={18} /> {mode === "message" ? "Send a Message" : "Leave a Review"}
                </h3>
                <p className="text-xs text-indigo-100">We respond to every message!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
                aria-label="Close message widget"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode switch */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setMode("message")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === "message"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                ✉️ Send Message
              </button>
              <button
                type="button"
                onClick={() => setMode("review")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === "review"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                ⭐ Rate & Review
              </button>
            </div>

            <div className="p-5">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 mb-3"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                    {mode === "message" ? "Message Sent!" : "Thank You!"}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {mode === "message" ? "Thank you for getting in touch. We will review your message soon." : "Your feedback helps us make Stiknex better."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {mode === "review" && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        How would you rate your experience?
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={
                                (hoverRating || rating) >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Email {mode === "message" ? "(for reply)" : "(optional)"}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      {mode === "message" ? "Your Message / Question" : "Your Review"}
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={mode === "message" ? "Type your message, feature request or issue here..." : "Share what you like or how we can improve..."}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs dark:text-white resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-xs font-bold">
                      {errorMessage || "Failed to submit. Please try again."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting" || !message.trim()}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1 shadow-sm"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Send size={14} /> {mode === "message" ? "Send Message" : "Submit Review"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showButton && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:scale-105 transition-all text-xs font-bold group"
          title="Send Message or Leave Feedback"
          aria-label="Send Message or Leave Feedback"
        >
          {isOpen ? <X size={18} /> : <MessageSquare size={18} className="group-hover:rotate-12 transition-transform" />}
          <span className="hidden sm:inline">Message & Feedback</span>
        </button>
      )}
    </div>
  );
};

export default FeedbackWidget;
