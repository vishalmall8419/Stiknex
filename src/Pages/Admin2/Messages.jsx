import React from "react";
import { MessageSquare, Inbox } from "lucide-react";

const Messages = () => {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Contact form submissions & user feedback</p>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
          <Inbox size={28} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No Messages Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          When users submit the contact form on your website, their messages will appear here.
        </p>
      </div>
    </main>
  );
};

export default Messages;
