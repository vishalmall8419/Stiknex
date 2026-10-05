import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Globe, EyeOff, Loader2 } from 'lucide-react';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
      const res = await fetch('/api/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, isPublic: !currentStatus })
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id })
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="text-indigo-500" size={32} /> Reviews & Feedback
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user reviews from all Stiknex tools.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <div key={review._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{review.userName}</h3>
                <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md font-medium uppercase tracking-wider">{review.tool}</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"} />
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex-grow mb-4 text-sm text-slate-700 dark:text-slate-300">
              {review.message}
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleVisibility(review._id, review.isPublic)}
                  className={`p-2 rounded-lg transition-colors ${review.isPublic ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                  title={review.isPublic ? "Visible on Homepage" : "Hidden from Homepage"}
                >
                  {review.isPublic ? <Globe size={16} /> : <EyeOff size={16} />}
                </button>
                <button 
                  onClick={() => deleteReview(review._id)}
                  className="p-2 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            No reviews yet. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManager;
