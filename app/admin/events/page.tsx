"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Check, ExternalLink, Calendar, MapPin, ImageIcon, X, Pencil } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";
import { getEvents, addEvent, updateEvent, removeEvent, type EventItem, type EventKind } from "@/lib/use-events";
import { formatDMY } from "@/lib/utils";
import { REG_FIELDS, DEFAULT_REG_FIELDS, CUSTOM_QUESTION_TYPES, MAX_CUSTOM_QUESTIONS, type CustomQuestion, type CustomQuestionType } from "@/lib/event-registration";

const KINDS: EventKind[] = ["Bookclub", "Film", "Aperitivo", "Workshop", "Culture", "Trip", "Other"];

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to change events. Please sign in first." : m;
}

export default function AdminEventsPage() {
  const [list, setList] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<string>("Workshop");
  const [location, setLocation] = useState("Wanchai");
  const [description, setDescription] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState("");
  const [regFields, setRegFields] = useState<string[]>(DEFAULT_REG_FIELDS);
  const [customQs, setCustomQs] = useState<CustomQuestion[]>([]);

  const addCustomQ = () =>
    setCustomQs((cur) => [...cur, { id: `cq-${Date.now().toString(36)}`, label: "", type: "short", required: false }]);
  const updateCustomQ = (id: string, patch: Partial<CustomQuestion>) =>
    setCustomQs((cur) => cur.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const removeCustomQ = (id: string) => setCustomQs((cur) => cur.filter((q) => q.id !== id));

  const toggleRegField = (key: string) =>
    setRegFields((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));

  const refresh = () => getEvents().then((l) => setList(l.slice().sort((a, b) => b.date.localeCompare(a.date)))).catch((e) => setErr(errText(e)));
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  function resetForm() {
    setEditingId(null);
    setDate(""); setTitle(""); setKind("Workshop"); setLocation("Wanchai");
    setDescription(""); setBookingUrl(""); setPublished(true); setImage("");
    setRegFields(DEFAULT_REG_FIELDS);
    setCustomQs([]);
  }
  function startCreate() { resetForm(); setErr(null); setShowForm(true); }
  function closeForm() { resetForm(); setShowForm(false); }

  // Drawer: lock page scroll while open, close on Escape.
  useEffect(() => {
    if (!showForm) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") closeForm(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- closeForm only calls state setters
  }, [showForm]);
  function startEdit(ev: EventItem) {
    setEditingId(ev.id);
    setDate(ev.date); setTitle(ev.title); setKind(ev.kind); setLocation(ev.location);
    setDescription(ev.description ?? ""); setBookingUrl(ev.bookingUrl ?? "");
    setPublished(ev.published); setImage(ev.image ?? "");
    setRegFields(ev.regFields && ev.regFields.length > 0 ? ev.regFields : DEFAULT_REG_FIELDS);
    setCustomQs(ev.customQuestions ?? []);
    setErr(null);
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const payload = { date, title, kind: kind as EventKind, location, description: description || undefined, bookingUrl: bookingUrl || undefined, image: image || undefined, published, regFields,
      // Blank questions are dropped; [] clears them on edit.
      customQuestions: customQs.map((q) => ({ ...q, label: q.label.trim() })).filter((q) => q.label) };
    try {
      if (editingId) {
        await updateEvent(editingId, payload);
      } else {
        const ev = await addEvent(payload);
        setJustAdded(ev.title);
        setTimeout(() => setJustAdded(null), 6000);
      }
      resetForm();
      setShowForm(false);
      await refresh();
    } catch (e) { setErr(errText(e)); }
  }

  async function del(id: string) {
    if (!confirm("Remove this event from the site? You can re-seed the demo events to restore them.")) return;
    setErr(null);
    try { await removeEvent(id); await refresh(); } catch (e) { setErr(errText(e)); }
  }
  async function setEventImage(e: EventItem, url: string) {
    setErr(null);
    try { await updateEvent(e.id, { image: url }); await refresh(); } catch (e) { setErr(errText(e)); }
  }
  async function togglePublish(e: EventItem) {
    setErr(null);
    try { await updateEvent(e.id, { published: !e.published }); await refresh(); } catch (e) { setErr(errText(e)); }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div className="min-w-0 flex-1 basis-80">
          <p className="eyebrow">Admin · Events</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Events & workshops calendar.</h1>
          <p className="mt-2 text-ink-muted">Add a bookclub, film night, aperitivo, or workshop — it appears immediately on the <Link href="/culture" target="_blank" rel="noopener" className="underline">Culture page</Link>.</p>
        </div>
        <button type="button" onClick={startCreate} className="btn btn-primary"><Plus size={16} /> New event</button>
      </div>

      {err && (
        <div className="frame p-4 bg-rosso/10 text-rosso text-sm mb-6">{err}</div>
      )}

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

      {showForm && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-60 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="event-drawer-title">
          <button type="button" aria-label="Close" onClick={closeForm} className="absolute inset-0 bg-ink/40 drawer-fade" />
        <form onSubmit={submit} className="relative h-full w-full sm:max-w-xl bg-cream shadow-2xl flex flex-col drawer-slide">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-line bg-white">
            <h2 id="event-drawer-title" className="text-lg font-semibold">{editingId ? "Edit event" : "New event"}</h2>
            <button type="button" onClick={closeForm} aria-label="Close" className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
          {err && <div className="rounded-xl p-3 bg-rosso/10 text-rosso text-sm">{err}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-medium">Date<input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Kind
              <input list="event-kinds" value={kind} onChange={(e) => setKind(e.target.value)} placeholder="e.g. Workshop, or type your own" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
              <datalist id="event-kinds">{KINDS.map((k) => <option key={k} value={k} />)}</datalist>
            </label>
            <label className="text-sm font-medium sm:col-span-2">Title<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Italian Wine & Language" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Location<input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Wanchai, HK Arts Centre…" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium">Booking URL <span className="text-ink-muted font-normal">(optional)</span><input value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-sm" /></label>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium">Event graphic <span className="text-ink-muted font-normal">(optional — shown left of the date on the Events page; square works best)</span></p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-paper border border-dashed border-ink/20 inline-flex items-center justify-center text-ink-soft shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={22} aria-hidden />}
                </div>
                <MediaPicker accept="image" onChange={(url) => setImage(url)} />
                {image && <button type="button" onClick={() => setImage("")} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><X size={12} /> Remove</button>}
              </div>
            </div>
            <label className="text-sm font-medium sm:col-span-2">Description <span className="text-ink-muted font-normal">(optional)</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A sentence or two about what guests can expect." className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          </div>
          <div className="pt-3 border-t border-line">
            <p className="text-sm font-medium">Registration form questions</p>
            <p className="text-xs text-ink-muted mt-0.5">Tick the questions to ask on this event&apos;s sign-up form. First name, surname and email are always asked.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {REG_FIELDS.map((f) => {
                const on = !!f.always || regFields.includes(f.key);
                return (
                  <label key={f.key} className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border select-none ${on ? "bg-azzurro-soft border-azzurro-deep" : "border-line"} ${f.always ? "opacity-70 cursor-default" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={on} disabled={!!f.always} onChange={() => toggleRegField(f.key)} className="w-3.5 h-3.5 accent-azzurro-deep" />
                    {f.label}
                  </label>
                );
              })}
            </div>

            {/* Custom questions — written by the admin, asked on top of the standard set. */}
            <div className="mt-4">
              <p className="text-sm font-medium">Custom questions</p>
              <p className="text-xs text-ink-muted mt-0.5">Add your own questions for this event, e.g. &ldquo;Any dietary requirements?&rdquo;</p>
              {customQs.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {customQs.map((q, i) => (
                    <li key={q.id} className="rounded-xl border border-line bg-white p-3">
                      <div className="flex items-start gap-2">
                        <span className="mt-2.5 text-xs font-medium text-ink-muted w-5 shrink-0">{i + 1}.</span>
                        <input
                          value={q.label}
                          onChange={(e) => updateCustomQ(q.id, { label: e.target.value })}
                          placeholder="Type your question…"
                          maxLength={200}
                          aria-label={`Custom question ${i + 1}`}
                          className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm"
                        />
                        <button type="button" onClick={() => removeCustomQ(q.id)} title="Remove question" aria-label={`Remove question ${i + 1}`} className="w-10 h-10 shrink-0 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
                      </div>
                      <div className="mt-2 pl-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <select
                          value={q.type}
                          onChange={(e) => updateCustomQ(q.id, { type: e.target.value as CustomQuestionType })}
                          aria-label="Answer type"
                          className="h-9 px-2 rounded-lg border border-line bg-white text-sm focus:outline-none focus:border-ink"
                        >
                          {CUSTOM_QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer select-none">
                          <input type="checkbox" checked={q.required} onChange={(e) => updateCustomQ(q.id, { required: e.target.checked })} className="w-3.5 h-3.5 accent-azzurro-deep" />
                          Required
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {customQs.length < MAX_CUSTOM_QUESTIONS && (
                <button type="button" onClick={addCustomQ} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep hover:underline">
                  <Plus size={14} /> Add custom question
                </button>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-azzurro-deep" />
            Publish immediately (visible on the public Culture page)
          </label>
          </div>
          <div className="px-5 sm:px-6 py-4 border-t border-line bg-white flex items-center justify-between gap-3">
            <button type="button" onClick={closeForm} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? "Save changes" : "Publish event"}</button>
          </div>
        </form>
        </div>,
        document.body,
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="frame p-10 bg-white text-center text-ink-muted">No events scheduled. Add the first one.</div>}
        {list.map((e) => {
          // Guard against a missing/invalid date so the badge shows "—" instead of NaN.
          const d = new Date(e.date);
          const validDate = !isNaN(d.getTime());
          const mon = validDate ? d.toLocaleDateString("en-GB", { month: "short" }) : "No date";
          const day = validDate ? d.getDate() : "—";
          return (
            // Mobile: [graphic | date | actions] on top, details full-width below.
            // md+: one row — fixed-width graphic column so every card lines up.
            <div key={e.id} className={`frame p-4 sm:p-5 md:p-6 grid grid-cols-[auto_1fr_auto] md:grid-cols-[7.5rem_auto_1fr_auto] gap-x-4 gap-y-3 items-center ${e.published ? "bg-white" : "bg-cream-2/60 opacity-75"}`}>
              <div className="col-start-1 row-start-1 flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-paper border border-dashed border-ink/20 inline-flex items-center justify-center text-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {e.image ? <img src={e.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={18} aria-hidden />}
                </div>
                <MediaPicker accept="image" label={e.image ? "Change" : "Add graphic"} onChange={(url) => setEventImage(e, url)} />
                {e.image && <button type="button" onClick={() => setEventImage(e, "")} className="text-[11px] text-ink-muted hover:text-rosso">Remove</button>}
              </div>
              <span className="col-start-2 row-start-1 justify-self-start self-start md:self-center inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-sole-soft font-heading font-bold shrink-0 leading-tight">
                <span className="text-xs uppercase tracking-wider">{mon}</span>
                <span className="text-xl">{day}</span>
              </span>
              <div className="col-span-3 row-start-2 md:col-span-1 md:col-start-3 md:row-start-1 min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-azzurro-deep font-medium">{e.kind}</p>
                <h3 className="mt-1 font-semibold text-lg leading-tight wrap-break-word">{e.title || <span className="text-ink-muted italic">Untitled event</span>}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} />{formatDMY(e.date)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
                </div>
                {e.description && <p className="mt-2 text-sm text-ink-muted line-clamp-2">{e.description}</p>}
              </div>
              <div className="col-start-3 row-start-1 md:col-start-4 self-start md:self-center flex md:flex-col items-center md:items-end gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(e)} title="Edit" className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><Pencil size={14} /></button>
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
