import React, { useState, useEffect } from "react";
import { FileText, Plus, PenLine, Trash2, Eye, EyeOff } from "lucide-react";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, title: '', slug: '', excerpt: '', fullContent: '', imageUrl: '', imageSource: '', published: true });

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin-blogs', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PATCH' : 'POST';
    const url = formData.id ? `/api/admin-blogs?id=${formData.id}` : '/api/admin-blogs';
    
    await fetch(url, {
      method,
      headers: { 
        'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    setShowForm(false);
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    if(!confirm('Delete this blog post?')) return;
    await fetch(`/api/admin-blogs?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}` }
    });
    fetchBlogs();
  };

  const togglePublish = async (id, currentStatus) => {
    await fetch(`/api/admin-blogs?id=${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${sessionStorage.getItem('stkx_admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ published: !currentStatus })
    });
    fetchBlogs();
  };

  const editBlog = (b) => {
    setFormData({ id: b._id, title: b.title, slug: b.slug, excerpt: b.excerpt, fullContent: b.fullContent, imageUrl: b.imageUrl, imageSource: b.imageSource, published: b.published });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-white/40 dark:border-slate-700 shadow backdrop-blur-xl">
        <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Blog' : 'Create Blog'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Title</label><input required className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Slug</label><input required className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Excerpt</label><textarea required rows={2} className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.excerpt} onChange={e=>setFormData({...formData, excerpt: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Full Content (Markdown/Text)</label><textarea required rows={10} className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.fullContent} onChange={e=>setFormData({...formData, fullContent: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Image URL</label><input className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.imageUrl} onChange={e=>setFormData({...formData, imageUrl: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Image Source/Alt</label><input className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500" value={formData.imageSource} onChange={e=>setFormData({...formData, imageSource: e.target.value})} /></div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Save</button>
            <button type="button" onClick={()=>setShowForm(false)} className="bg-slate-200 dark:bg-slate-700 px-6 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create, edit, and manage blog posts</p>
        </div>
        <button onClick={() => { setFormData({ id: null, title: '', slug: '', excerpt: '', fullContent: '', imageUrl: '', imageSource: '', published: true }); setShowForm(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <FileText size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Blog Management</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Create your first blog post manually.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(b => (
            <div key={b._id} className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow overflow-hidden flex flex-col">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 bg-cover bg-center" style={{backgroundImage: `url(${b.imageUrl})`}}></div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{b.title}</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{b.excerpt}</p>
                <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <button onClick={() => editBlog(b)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-sm py-1.5 rounded-lg flex justify-center items-center gap-1 font-semibold"><PenLine size={14}/> Edit</button>
                  <button onClick={() => togglePublish(b._id, b.published)} className={`flex-1 text-sm py-1.5 rounded-lg flex justify-center items-center gap-1 font-semibold ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.published ? <Eye size={14}/> : <EyeOff size={14}/>} {b.published ? 'Live' : 'Hidden'}
                  </button>
                  <button onClick={() => deleteBlog(b._id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default BlogManager;
