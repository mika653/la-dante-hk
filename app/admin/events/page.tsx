"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Check, ExternalLink, Calendar, MapPin } from "lucide-react";
import { getEvents, addEvent, updateEvent, removeEvent, type EventItem, type EventKind } from "@/lib/use-events";

const KINDS: EventKind[] = ["Bookclub", "Film", "Aperitivo", "Workshop", "Culture", "Trip", "Other"];

export default function AdminEventsPage() {
  const [list, setList] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<EventKind>("Workshop");
  const [location, setLocation] = useState("Wanchai");
  const [description, setDescription] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => { setList(getEvents()); }, []);
  const refresh = () => setList(getEvents().slice().sort((a, b) => a.date.localeCompare(b.date)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ev = addEvent({ date, title, kind, location, description: description || undefined, bookingUrl: bookingUrl || undefined, published });
    setDate(""); setTitle(""); setKind("Workshop"); setLocation("Wanchai"); setDescription(""); setBookingUrl(""); setPublished(true);
    setShowForm(false);
    setJustAdded(ev.title);
    setTimeout(() => setJustAdded(null), 6000);
    refresh();
  }

  function del(id: string) {
    if (!confirm("Remove this event? You can restore by resetting demo data.")) return;
    removeEvent(id); refresh();
  }
  function togglePublish(e: EventItem) { updateEvent(e.id, { published: !e.published }); refresh(); }

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Events</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Events & workshops calendar.</h1>
          <p className="mt-2 text-ink-muted">Add a bookclub, film night, aperitivo, or workshop — it appears immediately on the <Link href="/culture" target="_blank" rel="noopener" className="underline">Culture page</Link>.</p>
        </div>
        {!showForm && <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary"><Plus size={16} /> New event</button>}
      </div>

      {justAdded && (
        <div className="frame p-4 bg-sole mb-6 flex items-start gap-3">
          <Check size={18} className="text-ink shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 text-sm">
            <p className="font-medium">“{justAdded}” is live.</p>
            <p className="text-ink/80">It&apos;s now on the public Culture page and the student Community feed.</p>
          </div>
          <Link href="/culture" target="_blank" rel="noopener" className="text-azzurro-deep text-sm font-medium underline inline-flex items-center gap-1">View on site <ExternalLink size={12} /></Link>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="frame p-6 md:p-8 bg-white mb-6 space-y-4">
          <h2 className="text-lg font-semibold">New event</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-medium">Date<input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Kind
              <select value={kind} onChange={(e) => setKind(e.target.value as EventKind)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink">
                {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium md:col-span-2">Title<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Italian Wine & Language" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Location<input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Wanchai, HK Arts Centre…" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Booking URL <span className="text-ink-muted font-normal">(optional)</span><input value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-sm" /></label>
            <label className="text-sm font-medium md:col-span-2">Description <span className="text-ink-muted font-normal">(optional)</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A sentence or two about what guests can expect." className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-azzurro-deep" />
            Publish immediately (visible on the public Culture page)
          </label>
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Publish event</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="frame p-10 bg-white text-center text-ink-muted">No events scheduled. Add the first one.</div>}
        {list.map((e) => {
          const d = new Date(e.date);
          const mon = d.toLocaleDateString("en-GB", { month: "short" });
          const day = d.getDate();
          return (
            <div key={e.id} className={`frame p-5 md:p-6 grid md:grid-cols-[auto_1fr_auto] gap-4 items-center ${e.published ? "bg-white" : "bg-cream-2/60 opacity-75"}`}>
              <span className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-sole-soft font-heading font-bold shrink-0 leading-tight">
                <span className="text-xs uppercase tracking-wider">{mon}</span>
                <span className="text-xl">{day}</span>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-azzurro-deep font-medium">{e.kind}</p>
                <h3 className="mt-1 font-semibold text-lg leading-tight">{e.title}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} />{e.date}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
                </div>
                {e.description && <p className="mt-2 text-sm text-ink-muted line-clamp-2">{e.description}</p>}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button type="button" onClick={() => togglePublish(e)} title={e.published ? "Unpublish" : "Publish"} className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted">
                  {e.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button type="button" onClick={() => del(e.id)} title="Delete" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
