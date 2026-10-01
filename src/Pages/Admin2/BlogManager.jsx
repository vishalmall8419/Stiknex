import React from "react";
import { FileText, Plus, PenLine } from "lucide-react";

const BlogManager = () => {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create, edit, and manage blog posts</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* Empty State */}
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
    </main>
  );
};

export default BlogManager;
