import React, { useState, useEffect } from "react";
import { FileText, Plus, PenLine, ExternalLink } from "lucide-react";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-blogs")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading blogs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage AI and Manual blog posts</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><p className="text-slate-400">Loading blogs...</p></div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <FileText size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Blog Management</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Create and manage blog posts for your Stiknex website. Write SEO-optimized articles, manage categories, and publish content.
          </p>
          <button className="mt-6 flex items-center gap-2 mx-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            <PenLine size={16} />
            Write Your First Post
          </button>
        </div>
      ) : (
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Title</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Source</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {blogs.map(blog => (
                <tr key={blog.slug} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{blog.title}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs">
                      {blog.imageSource === "AI Generated" ? "AI Auto" : "Manual"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(blog.publishedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1">
                      View <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default BlogManager;
