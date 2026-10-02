import React, { useState, useEffect } from "react";
import { MessageSquare, Inbox, Star, Trash2, CheckCircle, XCircle } from "lucide-react";

const Messages = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/reviews?id=${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this?")) return;
    await fetch(`/api/reviews?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}` }
    });
    fetchReviews();
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feedback & Testimonials</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage user reviews, ratings, and messages</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <Inbox size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Feedback Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">When users submit a review or message, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => (
            <div key={rev._id} className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{rev.name} <span className="text-xs font-normal text-slate-500">({rev.email})</span></h3>
                  <p className="text-xs text-indigo-500 font-semibold capitalize mb-2">{rev.type} • {rev.tool}</p>
                </div>
                <div className="flex gap-2">
                  {rev.type === 'review' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${rev.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : rev.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {rev.status}
                    </span>
                  )}
                </div>
              </div>
              
              {rev.rating && (
                <div className="flex gap-1 mb-2 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />)}
                </div>
              )}
              
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-4">{rev.content}</p>
              
              <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                {rev.type === 'review' && rev.status !== 'approved' && (
                  <button onClick={() => updateStatus(rev._id, 'approved')} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><CheckCircle size={14}/> Approve for Homepage</button>
                )}
                {rev.type === 'review' && rev.status === 'approved' && (
                  <button onClick={() => updateStatus(rev._id, 'pending')} className="text-amber-600 hover:bg-amber-50 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><XCircle size={14}/> Unpublish</button>
                )}
                <button onClick={() => deleteReview(rev._id)} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Messages;
