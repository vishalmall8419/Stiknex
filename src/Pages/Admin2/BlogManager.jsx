import React, { useState, useEffect } from "react";
import { FileText, Plus, PenLine, Loader2, X, Trash2, Edit3, ExternalLink, Search, RefreshCw, Calendar, Tag, CheckCircle2, AlertTriangle, Clock, BookOpen, Globe } from "lucide-react";
import swal from "sweetalert";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBlogs, setFetchingBlogs] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [generationProgress, setGenerationProgress] = useState("");

  const initialForm = {
    title: "",
    slug: "",
    category: "Productivity",
    excerpt: "",
    content: "",
    imageUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    published: false,
  };

  const [form, setForm] = useState(initialForm);

  const fetchBlogs = async () => {
    setFetchingBlogs(true);
    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      
      const res = await fetch(`/api/blogs?admin=true&t=${Date.now()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || (Array.isArray(data) ? data : []));
      } else {
        // Fallback to public endpoint
        const pubRes = await fetch(`/api/blogs?t=${Date.now()}`);
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          setBlogs(Array.isArray(pubData) ? pubData : (pubData.blogs || []));
        }
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setFetchingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingBlogId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog) => {
    setEditingBlogId(blog._id || blog.id);
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Productivity",
      excerpt: blog.excerpt || "",
      content: blog.content || blog.fullContent || "",
      imageUrl: blog.imageUrl || "",
      metaTitle: blog.metaTitle || blog.title || "",
      metaDescription: blog.metaDescription || blog.excerpt || "",
      keywords: blog.keywords || "",
      published: !!blog.published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (blog) => {
    const nextPublished = !blog.published;
    const wordCount = blog.wordCount || 0;

    // Strict 3,000 word gate for publication
    if (nextPublished && wordCount < 3000) {
      swal(
        "Cannot Publish Article",
        `This article has ${wordCount.toLocaleString()} verified words. A strict minimum of 3,000 verified body words is required for public publication.`,
        "warning"
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");

      const res = await fetch(`/api/blogs?admin=true&id=${blog._id || blog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: nextPublished }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        swal(
          "Status Updated",
          nextPublished
            ? `Article is now published (${wordCount.toLocaleString()} words)!`
            : "Article has been unpublished to draft.",
          "success"
        );
        fetchBlogs();
      } else {
        swal("Error", data.error || "Failed to update publication status.", "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "Network error updating publication status.", "error");
    }
  };

  const handleGenerateBlog = async () => {
    const keyword = window.prompt(
      "Enter a keyword or topic to generate an encyclopedic 3,000+ words masterclass blog for (or leave empty to auto-pick from top trends):"
    );
    if (keyword === null) return;

    setLoading(true);
    setGenerationProgress("Step 1 of 4: Initializing article architecture and Part 1 (~1,000 words)...");

    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };

      // Step 1: Initialize architecture & Part 1 (~1,000w)
      const s1Url = `/api/generate-blog?step=1${keyword.trim() ? `&keyword=${encodeURIComponent(keyword.trim())}` : ''}`;
      const res1 = await fetch(s1Url, { method: "POST", headers: authHeaders });
      const d1 = await res1.json();
      if (!res1.ok || !d1.slug) {
        throw new Error(d1.error || "Step 1 failed to initialize draft.");
      }

      // Step 2: Append frameworks & case studies (~1,100w)
      setGenerationProgress(`Step 2 of 4: Generating frameworks & case studies (${d1.wordCount} words generated so far)...`);
      const res2 = await fetch(`/api/generate-blog?step=2&slug=${encodeURIComponent(d1.slug)}`, { method: "POST", headers: authHeaders });
      const d2 = await res2.json();
      if (!res2.ok) {
        throw new Error(d2.error || "Step 2 failed to generate frameworks.");
      }

      // Step 3: Append traps, FAQ & references (~1,100w)
      setGenerationProgress(`Step 3 of 4: Generating pitfalls, FAQ & references (${d2.wordCount} words generated so far)...`);
      const res3 = await fetch(`/api/generate-blog?step=3&slug=${encodeURIComponent(d1.slug)}`, { method: "POST", headers: authHeaders });
      const d3 = await res3.json();
      if (!res3.ok) {
        throw new Error(d3.error || "Step 3 failed to generate conclusion & references.");
      }

      // Step 4: Table of contents, contextual linking, 3000w validation gate & publication
      setGenerationProgress(`Step 4 of 4: Building Table of Contents, linking tools & validating 3,000+ words...`);
      const res4 = await fetch(`/api/generate-blog?step=4&slug=${encodeURIComponent(d1.slug)}`, { method: "POST", headers: authHeaders });
      const d4 = await res4.json();

      if (res4.ok && d4.published) {
        swal(
          "Masterclass Published!",
          `Title: ${d4.title}\nVerified Words: ${d4.wordCount.toLocaleString()} (Strict >= 3,000)\nTable of Contents: ${d4.tableOfContentsCount} sections\nSlug: /blog/${d4.blog}`,
          "success"
        );
      } else if (d4.published === false) {
        swal(
          "Saved as Draft",
          `Generated ${d4.wordCount} words. Validation Status: ${d4.validationStatus}\nNotice: ${d4.validationError || 'Kept as unpublished draft.'}`,
          "info"
        );
      } else {
        swal("Notice", d4.error || "Failed to finalize publication.", "warning");
      }
      fetchBlogs();
    } catch (error) {
      console.error(error);
      swal("Error", error.message || "An unexpected error occurred during AI blog generation.", "error");
    } finally {
      setLoading(false);
      setGenerationProgress("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wordCount = form.content ? form.content.split(/\s+/).filter(Boolean).length : 0;
    if (form.published && wordCount < 3000) {
      swal(
        "Cannot Publish Article",
        `This article contains only ${wordCount.toLocaleString()} words. A strict minimum of 3,000 verified body words is required for public publication. Uncheck "Publish Publicly" to save as an unpublished draft.`,
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");

      const isEdit = !!editingBlogId;
      const url = isEdit ? `/api/blogs?admin=true&id=${editingBlogId}` : "/api/blogs?admin=true";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        swal("Success", isEdit ? "Blog updated successfully!" : "Blog published successfully!", "success");
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        swal("Error", data.error || "Failed to save blog.", "error");
      }
    } catch (error) {
      console.error(error);
      swal("Error", "Network error while saving blog.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blog) => {
    const id = blog._id || blog.id;
    const willDelete = await swal({
      title: "Delete Article?",
      text: `Are you sure you want to delete "${blog.title}"?`,
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");

      const res = await fetch(`/api/blogs?admin=true&id=${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        swal("Deleted", "Article has been permanently removed.", "success");
        setBlogs(prev => prev.filter(b => (b._id || b.id) !== id));
      } else {
        swal("Error", "Could not delete blog post.", "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "Error deleting article.", "error");
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const q = searchQuery.toLowerCase();
    const title = (b.title || "").toLowerCase();
    const slug = (b.slug || "").toLowerCase();
    const cat = (b.category || "").toLowerCase();
    return title.includes(q) || slug.includes(q) || cat.includes(q);
  });

  return (
    <main className="relative z-10 space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-600" /> Blog & Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Write manual articles, generate 3000+ word AI handbooks, and manage published posts
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchBlogs}
            disabled={fetchingBlogs}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
            title="Refresh Blogs"
          >
            <RefreshCw size={16} className={fetchingBlogs ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <PenLine size={16} /> Write Manual Post
          </button>
          
          <button
            onClick={handleGenerateBlog}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {loading ? "Generating 3000+ Words..." : "Generate AI Post"}
          </button>
        </div>
      </div>

      {/* Generation Progress Alert Banner */}
      {generationProgress && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 animate-pulse">
          <Loader2 size={20} className="animate-spin shrink-0" />
          <p className="text-sm font-semibold">{generationProgress}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title, slug, or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Blogs Table / List */}
      {fetchingBlogs ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading published blogs...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <FileText size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
            {searchQuery ? "No matching articles found" : "No Blog Posts Found"}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Write your first blog post manually or generate an in-depth 3000+ word article using AI.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
            >
              Write First Post
            </button>
            <button
              onClick={handleGenerateBlog}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
            >
              Generate AI Post
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Article</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3.5">Word Count & Status</th>
                  <th className="px-4 py-3.5 hidden sm:table-cell">Published Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBlogs.map((b) => {
                  const dateStr = b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "Draft";
                  const thumb = b.imageUrl || "/logo.png";
                  return (
                    <tr key={b._id || b.id || b.slug} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={thumb}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                            onError={(e) => { e.target.src = "/logo.png"; }}
                          />
                          <div className="min-w-0 max-w-md">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">
                              {b.title}
                            </h4>
                            <p className="text-xs text-slate-400 truncate">/blog/{b.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          <Tag size={12} /> {b.category || "Productivity"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <BookOpen size={13} className="text-slate-400 shrink-0" />
                            <span className={(b.wordCount || 0) >= 3000 ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-amber-600 dark:text-amber-400 font-bold"}>
                              {(b.wordCount || 0).toLocaleString()} words
                            </span>
                          </div>
                          <div>
                            {b.published ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 size={11} /> Published
                              </span>
                            ) : b.validationStatus === 'failed' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300" title={b.validationError || 'Word count under 3000'}>
                                <AlertTriangle size={11} /> Failed (&lt; 3000w)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                <Clock size={11} /> Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar size={13} /> {dateStr}</span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTogglePublish(b)}
                            className={`p-2 rounded-lg transition ${
                              b.published
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                                : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
                            }`}
                            title={b.published ? "Click to unpublish" : "Click to publish (requires >= 3,000 words)"}
                          >
                            <Globe size={16} />
                          </button>

                          <a
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                            title="View on Website"
                          >
                            <ExternalLink size={16} />
                          </a>

                          <button
                            onClick={() => handleOpenEditModal(b)}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                            title="Edit Article"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(b)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                            title="Delete Article"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Write / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition"
            >
              <X size={22} />
            </button>
            
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">
              {editingBlogId ? "Edit Blog Post" : "Write Manual Blog Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      setForm({ ...form, title, slug: form.slug ? form.slug : slug });
                    }}
                    placeholder="e.g. 10 Essential Sticky Note Strategies"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="essential-sticky-note-strategies"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Productivity, Guides, Tools..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://... (or leave empty for AI auto-visual)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Excerpt (Summary) *
                </label>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short engaging overview shown in preview cards..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Article Content (Markdown) *
                  </label>
                  {(() => {
                    const words = form.content ? form.content.split(/\s+/).filter(Boolean).length : 0;
                    return (
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        words >= 3000 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}>
                        <BookOpen size={13} />
                        {words.toLocaleString()} / 3,000 words minimum for publication
                      </span>
                    );
                  })()}
                </div>
                <textarea
                  required
                  rows={10}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs sm:text-sm leading-relaxed"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="# Main Heading&#10;&#10;Write comprehensive article paragraphs using Markdown..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Publication Status</h5>
                  <p className="text-[11px] text-slate-400">Strict rule: Articles must contain at least 3,000 verified words to be published publicly.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => {
                      const words = form.content ? form.content.split(/\s+/).filter(Boolean).length : 0;
                      if (e.target.checked && words < 3000) {
                        swal("Publication Requirement", `This article currently has ${words.toLocaleString()} words. To publish, it must reach at least 3,000 words. You can still save it as an unpublished draft.`, "warning");
                      }
                      setForm({ ...form, published: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Publish Publicly
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Meta Title (SEO)
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    placeholder="Target SEO Title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    placeholder="productivity, notes, tools..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {editingBlogId ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default BlogManager;
