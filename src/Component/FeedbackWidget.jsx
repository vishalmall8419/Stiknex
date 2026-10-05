import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const FeedbackWidget = ({ tool = "stiknex" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message,
          tool,
          userName: name || "Anonymous",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setRating(0);
          setMessage("");
          setName("");
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

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
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">Rate & Review</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <X size={18} />
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
                    Thank You!
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Your feedback helps us improve Stiknex.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                      How would you rate this tool?
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
                            size={28}
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

                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Feedback or Message
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you think..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm dark:text-white resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-xs font-bold">
                      Failed to submit. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={rating === 0 || status === "submitting"}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={16} /> Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition hover:scale-105"
        title="Leave Feedback"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default FeedbackWidget;
