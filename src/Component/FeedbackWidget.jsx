import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  X,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
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
    const handleOpenFeedback = (e) => {
      setIsOpen(true);
      if (e?.detail?.mode === "review") {
        setMode("review");
      } else if (e?.detail?.mode === "message") {
        setMode("message");
      }
    };
    window.addEventListener("stiknex_open_feedback", handleOpenFeedback);
    return () => window.removeEventListener("stiknex_open_feedback", handleOpenFeedback);
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
      createdAt: new Date().toISOString(),
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
        }, 2200);
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
        }, 2200);
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
      }, 2200);
    }
  };

  if (!showButton && !isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.15}
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[9999] font-sans cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-14 sm:bottom-16 right-0 w-[340px] sm:w-[400px] bg-white dark:bg-[#0B0F17] rounded-3xl shadow-2xl border border-[#EADFD5] dark:border-slate-800 overflow-hidden max-h-[82vh] overflow-y-auto"
          >
            {/* Header: Circle & Stiknex Brand Gradient */}
            <div className="bg-gradient-to-r from-[#134E5E] via-[#1D6A7D] to-[#0F3944] text-white p-5 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-[#FFA07A]/20 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-[#FFA07A] border border-white/10">
                    <Sparkles size={11} /> Developer Inbox
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <h3 className="font-extrabold text-lg flex items-center gap-2 tracking-tight">
                  <MessageSquare size={18} className="text-[#FFA07A]" />
                  {mode === "message" ? "Send a Message" : "Rate & Review Stiknex"}
                </h3>
                <p className="text-xs text-white/75 mt-0.5">
                  {mode === "message"
                    ? "Share ideas, feature requests, or report issues directly."
                    : "Your feedback helps us keep Stiknex free & independent."}
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close message widget"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#EADFD5] dark:border-slate-800 bg-[#FAF7F2] dark:bg-slate-900/60 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setMode("message")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === "message"
                    ? "bg-white dark:bg-slate-800 text-[#134E5E] dark:text-emerald-400 shadow-xs border border-[#EADFD5] dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>✉️</span>
                <span>Send Message</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("review")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === "review"
                    ? "bg-white dark:bg-slate-800 text-[#134E5E] dark:text-emerald-400 shadow-xs border border-[#EADFD5] dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>⭐</span>
                <span>Rate & Review</span>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 bg-white dark:bg-[#0B0F17]">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-500 mb-3"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {mode === "message" ? "Message Dispatched!" : "Thank You for the Review!"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs">
                    {mode === "message"
                      ? "Thank you for getting in touch. Vishal Mall reads every note and will get back to you shortly."
                      : "Your review powers our community and keeps Stiknex completely free and private."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  {/* Star Rating Area */}
                  {mode === "review" && (
                    <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900/60 border border-[#EADFD5] dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Overall Rating
                        </label>
                        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
                          {hoverRating || rating} / 5 Stars
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              size={26}
                              className={
                                (hoverRating || rating) >= star
                                  ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                  : "text-slate-300 dark:text-slate-700 hover:text-amber-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Name and Email Fields */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#134E5E] focus:outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block uppercase tracking-wider">
                        Email {mode === "message" ? "(for reply)" : "(optional)"}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#134E5E] focus:outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block uppercase tracking-wider">
                      {mode === "message" ? "Message / Feature Request" : "Your Review"}
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        mode === "message"
                          ? "Type your message, suggestion, or question here..."
                          : "Tell others why you love Stiknex or how it helped your workflow..."
                      }
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#134E5E] focus:outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all leading-relaxed"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-xs font-bold">
                      {errorMessage || "Failed to submit. Please try again."}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting" || !message.trim()}
                    className="w-full py-3 bg-gradient-to-r from-[#134E5E] via-[#1D6A7D] to-[#0F3944] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#134E5E]/25 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Send size={14} className="text-[#FFA07A]" />
                        <span>{mode === "message" ? "Send Message" : "Submit Review"}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>Private &amp; spam-free. We never share your email.</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Pill Button */}
      {showButton && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#134E5E] via-[#1D6A7D] to-[#0F3944] hover:brightness-110 text-white rounded-full shadow-[0_4px_20px_rgba(19,78,94,0.35)] hover:shadow-[0_6px_25px_rgba(19,78,94,0.5)] border border-white/20 hover:scale-105 active:scale-95 transition-all text-xs font-bold group cursor-grab active:cursor-grabbing backdrop-blur-md"
          title="Feedback & Support (Drag anywhere)"
          aria-label="Send Feedback"
        >
          <span className="relative flex items-center justify-center">
            {isOpen ? (
              <X size={15} />
            ) : (
              <>
                <MessageSquare size={15} className="group-hover:rotate-12 transition-transform text-[#FFA07A]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#134E5E] animate-pulse" />
              </>
            )}
          </span>
          <span className="hidden sm:inline font-semibold">Feedback</span>
        </button>
      )}
    </motion.div>
  );
};

export default FeedbackWidget;
