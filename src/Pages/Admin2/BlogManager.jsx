import React, { useState } from "react";
import { FileText, Plus, PenLine, Loader2, X } from "lucide-react";
import swal from "sweetalert";

const BlogManager = () => {
  const [loading, setLoading] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const [manualForm, setManualForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    imageUrl: "",
    imageAlt: "",
  });

  const handleGenerateBlog = async () => {
    const keyword = window.prompt(
      "Enter a keyword to generate a blog for (or leave empty to auto-pick a trending topic):",
    );
    if (keyword === null) return;

    setLoading(true);
    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      const url = keyword
        ? `/api/generate-blog?keyword=${encodeURIComponent(keyword)}`
        : "/api/generate-blog";

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response. Please run with Vercel Dev (npx vercel dev) to test APIs locally.");
      }
      const data = await res.json();

      if (res.ok)
        swal("Success", `Blog generated successfully: ${data.blog}`, "success");
      else
        swal(
          "Error",
          data.error || data.message || "Failed to generate blog",
          "error",
        );
    } catch (error) {
      console.error(error);
      swal("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token =
        localStorage.getItem("stkx_admin_token") ||
        sessionStorage.getItem("stkx_admin_token");
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...manualForm,
          sourceResearch: "Manual Entry",
          imageSource: "Manual Upload",
        }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response. Please run with Vercel Dev (npx vercel dev) to test APIs locally.");
      }
      const data = await res.json();

      if (res.ok) {
        swal("Success", "Blog created manually!", "success");
        setIsManualModalOpen(false);
        setManualForm({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          imageUrl: "",
          imageAlt: "",
        });
      } else {
        swal("Error", data.error || "Failed to create blog", "error");
      }
    } catch (error) {
      console.error(error);
      swal("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, edit, and manage blog posts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <PenLine size={16} /> Write Manual Post
          </button>
          <button
            onClick={handleGenerateBlog}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {loading ? "Generating..." : "Generate AI Post"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
          <FileText size={28} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Blog Management</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Create and manage blog posts for your Stiknex website. Write
          SEO-optimized articles, manage categories, and publish content.
        </p>
      </div>

      {isManualModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative custom-scrollbar">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Write Manual Blog Post</h2>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    required
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.title}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    required
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.slug}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, slug: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Excerpt
                </label>
                <textarea
                  className="w-full rounded-lg border p-2 bg-transparent"
                  value={manualForm.excerpt}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, excerpt: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  required
                  rows={8}
                  className="w-full rounded-lg border p-2 bg-transparent custom-scrollbar"
                  value={manualForm.content}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, content: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Title (Optional)
                  </label>
                  <input
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.metaTitle}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        metaTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Description (Optional)
                  </label>
                  <input
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.metaDescription}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        metaDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Keywords (Optional)
                  </label>
                  <input
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.keywords}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, keywords: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    className="w-full rounded-lg border p-2 bg-transparent"
                    value={manualForm.imageUrl}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, imageUrl: e.target.value })
                    }
                />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image Alt Text (Optional)
                </label>
                <input
                  className="w-full rounded-lg border p-2 bg-transparent"
                  value={manualForm.imageAlt}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, imageAlt: e.target.value })
                  }
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition disabled:opacity-50 mt-4"
              >
                {loading ? "Publishing..." : "Publish Blog Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default BlogManager;
