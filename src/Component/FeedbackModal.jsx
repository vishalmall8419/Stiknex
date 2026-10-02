import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('review'); // 'review' or 'message'
  const [tool, setTool] = useState('Website');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, tool, rating, content })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setContent('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Try again.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="text-indigo-500" /> 
              Send Feedback
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-slate-500">Your feedback means a lot to us.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button type="button" onClick={() => setType('review')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${type === 'review' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Rating & Review</button>
                  <button type="button" onClick={() => setType('message')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${type === 'message' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Message / Contact</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                    <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                    <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" placeholder="john@example.com" />
                  </div>
                </div>

                {type === 'review' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">What are you reviewing?</label>
                      <select value={tool} onChange={e => setTool(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
                        <option value="Website">Overall Website</option>
                        <option value="Notepad">AI Notebook</option>
                        <option value="Whiteboard">Whiteboard</option>
                        <option value="Sticky Notes">Sticky Notes</option>
                        <option value="Tools">Online Tools</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Rating</label>
                      <div className="flex gap-1 py-1">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              size={24} 
                              fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"} 
                              className={(hoverRating || rating) >= star ? "text-amber-500" : "text-slate-300 dark:text-slate-600"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{type === 'review' ? 'Your Review' : 'Your Message'}</label>
                  <textarea required value={content} onChange={e => setContent(e.target.value)} rows="4" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 resize-none" placeholder={type === 'review' ? 'How was your experience?' : 'How can we help you?'}></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
