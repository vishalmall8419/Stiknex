import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, LoaderCircle, Plus, RefreshCw } from "lucide-react";

const getAdminToken = () => (
  localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token") || ""
);

const localDateTimeValue = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const formatEventTime = (event) => {
  const start = event.start?.dateTime || event.start?.date;
  if (!start) return "Time not specified";
  return new Date(start).toLocaleString([], { dateStyle: "medium", timeStyle: event.start?.dateTime ? "short" : undefined });
};

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(() => (
    new URLSearchParams(window.location.search).get("googleCalendar") === "error"
      ? "Google Calendar connection did not complete. Please try again."
      : ""
  ));
  const [notice, setNotice] = useState(() => (
    new URLSearchParams(window.location.search).get("googleCalendar") === "connected"
      ? "Google Calendar connected successfully."
      : ""
  ));
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(() => localDateTimeValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [end, setEnd] = useState(() => localDateTimeValue(new Date(Date.now() + 2 * 60 * 60 * 1000)));

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/google-calendar/events", {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load Google Calendar events.");
      setConnected(Boolean(data.connected));
      setEvents(data.events || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load Google Calendar events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("googleCalendar")) window.history.replaceState({}, "", window.location.pathname);
    let active = true;
    fetch("/api/google-calendar/events", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load Google Calendar events.");
        if (active) {
          setConnected(Boolean(data.connected));
          setEvents(data.events || []);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Could not load Google Calendar events.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const connectCalendar = async () => {
    setConnecting(true);
    setError("");
    try {
      const response = await fetch("/api/google-calendar/connect", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start Google Calendar authorization.");
      window.location.assign(data.authorizationUrl);
    } catch (requestError) {
      setError(requestError.message || "Could not start Google Calendar authorization.");
      setConnecting(false);
    }
  };

  const createEvent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/google-calendar/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          summary,
          description,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create the calendar event.");
      setEvents((current) => [...current, data.event].sort((a, b) => new Date(a.start?.dateTime || a.start?.date) - new Date(b.start?.dateTime || b.start?.date)));
      setSummary("");
      setDescription("");
      setNotice("Event added to Google Calendar.");
    } catch (requestError) {
      setError(requestError.message || "Could not create the calendar event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
            <CalendarDays size={20} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Google Calendar</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Connect the calendar for this administrator to view upcoming events and add new ones.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setLoading(true); setError(""); loadEvents(); }} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {!connected && (
            <button type="button" onClick={connectCalendar} disabled={connecting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
              {connecting ? <LoaderCircle size={16} className="animate-spin" /> : <CalendarDays size={16} />}
              Connect Google Calendar
            </button>
          )}
        </div>
      </header>

      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">{error}</p>}
      {connected && (
        <form onSubmit={createEvent} className="grid gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 md:grid-cols-2">
          <h2 className="md:col-span-2 text-base font-bold text-slate-900 dark:text-white">Create an event</h2>
          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Event title
            <input required maxLength={200} value={summary} onChange={(event) => setSummary(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
            <input maxLength={5000} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Start
            <input required type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            End
            <input required type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
              Create event
            </button>
          </div>
        </form>
      )}

      <section className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Upcoming events</h2>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" /> Loading events...</div>
        ) : !connected ? (
          <p className="py-6 text-sm text-slate-500 dark:text-slate-400">Connect Google Calendar to list and create events.</p>
        ) : events.length === 0 ? (
          <p className="py-6 text-sm text-slate-500 dark:text-slate-400">No upcoming events found.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {events.map((calendarEvent) => (
              <li key={calendarEvent.id} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{calendarEvent.summary}</p>
                  <time className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{formatEventTime(calendarEvent)}</time>
                  {calendarEvent.description && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{calendarEvent.description}</p>}
                </div>
                {calendarEvent.htmlLink && <a href={calendarEvent.htmlLink} target="_blank" rel="noreferrer" aria-label="Open event in Google Calendar" className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-slate-800"><ExternalLink size={16} /></a>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default GoogleCalendar;
