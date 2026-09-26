import { useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Mail,
  MessageSquare,
  Search,
  Send,
  Trash2,
  User,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const initialMessages = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    subject: "Order delivery update",
    message: "Please share the latest update for my order.",
    type: "Support",
    status: "Unread",
    date: "2026-09-24",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    subject: "Product availability",
    message: "Is this product available in medium size?",
    type: "Product",
    status: "Read",
    date: "2026-09-23",
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@example.com",
    subject: "Refund request",
    message: "I want to know the status of my refund request.",
    type: "Refund",
    status: "Archived",
    date: "2026-09-22",
  },
];

const emptyReply = {
  subject: "",
  message: "",
};

const StatCard = ({ title, value, icon: Icon, tone = "primary" }) => (
  <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_25px_rgba(80,120,140,0.08)] backdrop-blur-xl">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-(--secondary)">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-(--primary)">{value}</h3>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-${tone}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const AdminMessage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyData, setReplyData] = useState(emptyReply);
  const [showReply, setShowReply] = useState(false);

  const statistics = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((item) => item.status === "Unread").length,
      read: messages.filter((item) => item.status === "Read").length,
      archived: messages.filter((item) => item.status === "Archived").length,
    }),
    [messages],
  );

  const filteredMessages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesSearch = [item.name, item.email, item.subject, item.message]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesType = typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [messages, searchTerm, statusFilter, typeFilter]);

  const openMessage = (message) => {
    setSelectedMessage(message);
    setShowReply(false);

    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, status: "Read" } : item,
      ),
    );
  };

  const deleteMessage = async (id) => {
    const result = await Swal.fire({
      title: "Delete message?",
      text: "This message will be removed from the list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#087F8D",
      cancelButtonColor: "#78908C",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    setMessages((current) => current.filter((item) => item.id !== id));
    setSelectedMessage(null);

    await Swal.fire({
      icon: "success",
      title: "Message deleted",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const archiveMessage = (id) => {
    setMessages((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Archived" } : item,
      ),
    );
    setSelectedMessage((current) =>
      current?.id === id ? { ...current, status: "Archived" } : current,
    );
  };

  const handleReply = async (event) => {
    event.preventDefault();

    if (!replyData.subject.trim() || !replyData.message.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Complete all fields",
        text: "Please enter a subject and reply message.",
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Reply prepared",
      text: "Connect your email API here to send the reply to the customer.",
      confirmButtonColor: "#087F8D",
    });

    setReplyData(emptyReply);
    setShowReply(false);
  };

  return (
    <section className="min-h-screen space-y-5 bg-transparent p-3 text-(--primary) sm:p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--secondary)">
            Communication Center
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-(--secondary)">
            Manage customer messages, support requests and replies.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/35 px-3 py-2 text-xs text-(--secondary) backdrop-blur-xl">
          <MessageSquare size={16} /> Customer Inbox
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Messages" value={statistics.total} icon={MessageSquare} />
        <StatCard title="Unread" value={statistics.unread} icon={Mail} />
        <StatCard title="Read" value={statistics.read} icon={CheckCircle2} />
        <StatCard title="Archived" value={statistics.archived} icon={Archive} />
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/30 p-3 shadow-[0_8px_25px_rgba(80,120,140,0.06)] backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)" size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search messages, customer or subject..."
              className="w-full rounded-xl border border-white/70 bg-white/55 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-(--muted) focus:border-(--primary)"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-white/70 bg-white/55 px-3 py-2.5 text-sm outline-none"
          >
            <option value="All">All Status</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Archived">Archived</option>
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-xl border border-white/70 bg-white/55 px-3 py-2.5 text-sm outline-none"
          >
            <option value="All">All Types</option>
            <option value="Support">Support</option>
            <option value="Product">Product</option>
            <option value="Refund">Refund</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/30 shadow-[0_8px_25px_rgba(80,120,140,0.06)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-white/70 bg-white/30 text-xs uppercase tracking-wide text-(--secondary)">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length ? (
                filteredMessages.map((message) => (
                  <tr key={message.id} className="border-b border-white/50 last:border-b-0 hover:bg-white/25">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-(--primary)">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-(--primary)">{message.name}</p>
                          <p className="text-xs text-(--secondary)">{message.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[230px] px-4 py-3">
                      <p className="truncate font-medium">{message.subject}</p>
                      <p className="truncate text-xs text-(--secondary)">{message.message}</p>
                    </td>
                    <td className="px-4 py-3 text-(--secondary)">{message.type}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/60 px-2.5 py-1 text-xs font-semibold">
                        {message.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-(--secondary)">{message.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openMessage(message)}
                          className="rounded-lg bg-white/60 p-2 text-(--primary) transition hover:bg-white"
                          aria-label="View message"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMessage(message.id)}
                          className="rounded-lg bg-white/60 p-2 text-red-600 transition hover:bg-white"
                          aria-label="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-(--secondary)">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-3 backdrop-blur-sm sm:p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/70 bg-[#e8f3ef]/95 p-4 shadow-2xl backdrop-blur-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--secondary)">Message Details</p>
                <h2 className="mt-1 text-xl font-bold text-(--primary)">{selectedMessage.subject}</h2>
              </div>
              <button type="button" onClick={() => setSelectedMessage(null)} className="rounded-lg bg-white/60 p-2">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-white/70 bg-white/35 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{selectedMessage.name}</p>
                  <p className="text-sm text-(--secondary)">{selectedMessage.email}</p>
                </div>
                <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold">{selectedMessage.type}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-(--secondary)">{selectedMessage.message}</p>
              <p className="mt-3 text-xs text-(--muted)">{selectedMessage.date}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowReply((current) => !current)}
                className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Send size={16} /> Reply
              </button>
              <button
                type="button"
                onClick={() => archiveMessage(selectedMessage.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/60 px-4 py-2.5 text-sm font-semibold text-(--primary)"
              >
                <Archive size={16} /> Archive
              </button>
              <button
                type="button"
                onClick={() => deleteMessage(selectedMessage.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>

            {showReply && (
              <form onSubmit={handleReply} className="mt-5 space-y-3 rounded-xl border border-white/70 bg-white/35 p-4">
                <h3 className="font-semibold">Reply to {selectedMessage.name}</h3>
                <input
                  value={replyData.subject}
                  onChange={(event) => setReplyData((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="Reply subject"
                  className="w-full rounded-xl border border-white/70 bg-white/60 px-3 py-2.5 text-sm outline-none"
                />
                <textarea
                  value={replyData.message}
                  onChange={(event) => setReplyData((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Write your reply..."
                  rows={5}
                  className="w-full resize-y rounded-xl border border-white/70 bg-white/60 px-3 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white">
                  <Send size={16} /> Prepare Reply
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminMessage;
