"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { defaultSponsors, type Sponsors, type SponsorItem } from "@/lib/site-content";
import { getSiteContent, saveSiteContent } from "@/lib/site-content-actions";
import MediaPicker from "@/components/MediaPicker";

// Edit the sponsor logos shown on the homepage — classroom (A–G), gold and
// silver tiers. Saves into the shared site content, like the hero carousel.
export default function SponsorsEditor() {
  const [classroom, setClassroom] = useState<SponsorItem[]>(defaultSponsors.classroom);
  const [gold, setGold] = useState<SponsorItem[]>(defaultSponsors.gold);
  const [silver, setSilver] = useState<SponsorItem[]>(defaultSponsors.silver);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getSiteContent().then((c) => { setClassroom(c.sponsors.classroom); setGold(c.sponsors.gold); setSilver(c.sponsors.silver); }).catch(() => {});
  }, []);

  async function save() {
    setErr(null); setSaving(true);
    try {
      const current = await getSiteContent();
      const clean = (list: SponsorItem[]) => list.filter((s) => s.logo.trim());
      const sponsors: Sponsors = { classroom: clean(classroom), gold: clean(gold), silver: clean(silver) };
      const res = await saveSiteContent({ ...current, sponsors });
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Sponsors</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Sponsors.</h1>
          <p className="mt-2 text-ink-muted">Add, edit, reorder and remove sponsor logos. Pick a logo from your Media Library (or paste a URL). Changes go live on the homepage.</p>
        </div>
        <Link href="/" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View site <ExternalLink size={13} /></Link>
      </div>

      <SponsorList title="Classroom sponsors (A–G)" hint="One per classroom. The room letter is shown for your reference." items={classroom} setItems={setClassroom} onReset={() => setClassroom(defaultSponsors.classroom)} withRoom />
      <div className="mt-10"><SponsorList title="Gold sponsor" hint="Usually one, shown large." items={gold} setItems={setGold} onReset={() => setGold(defaultSponsors.gold)} /></div>
      <div className="mt-10"><SponsorList title="Silver sponsors" hint="Shown in a logo wall." items={silver} setItems={setSilver} onReset={() => setSilver(defaultSponsors.silver)} /></div>

      <div className="mt-8 flex items-center justify-end gap-3 sticky bottom-4">
        <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved. It&apos;s live on the homepage.</span>
        {err && <span className="text-sm text-rosso">{err}</span>}
        <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50 shadow-[var(--shadow-pop)]">{saving ? "Saving…" : "Save sponsors"}</button>
      </div>
    </div>
  );
}

function SponsorList({
  title, hint, items, setItems, onReset, withRoom = false,
}: {
  title: string; hint: string; items: SponsorItem[];
  setItems: (fn: (prev: SponsorItem[]) => SponsorItem[]) => void;
  onReset: () => void; withRoom?: boolean;
}) {
  function patch(i: number, p: Partial<SponsorItem>) { setItems((list) => list.map((s, n) => (n === i ? { ...s, ...p } : s))); }
  function remove(i: number) { setItems((list) => list.filter((_, n) => n !== i)); }
  function add() { setItems((list) => [...list, { name: "", logo: "", ...(withRoom ? { room: "" } : {}) }]); }
  function move(i: number, dir: -1 | 1) {
    setItems((list) => { const j = i + dir; if (j < 0 || j >= list.length) return list; const next = list.slice(); [next[i], next[j]] = [next[j], next[i]]; return next; });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div><h2 className="text-xl font-semibold">{title}</h2><p className="text-sm text-ink-muted">{hint}</p></div>
        <button type="button" onClick={onReset} className="btn btn-ghost text-xs"><RotateCcw size={13} /> Reset</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <div className="frame p-6 bg-white text-center text-ink-muted text-sm">None yet. Add one below.</div>}
        {items.map((s, i) => (
          <div key={i} className="frame p-4 bg-white grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-cream-2 border border-line shrink-0 flex items-center justify-center">
              {s.logo ? <Image src={s.logo} alt={s.name || ""} fill sizes="120px" unoptimized={s.logo.startsWith("http")} className="object-contain p-1" /> : <span className="text-[11px] text-ink-muted">No logo</span>}
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                {withRoom && <input value={s.room ?? ""} onChange={(e) => patch(i, { room: e.target.value })} placeholder="Room" className="w-16 h-10 px-2 rounded-lg border border-line bg-white text-sm text-center" aria-label="Room" />}
                <input value={s.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="Sponsor name (also the image alt text)" className="flex-1 h-10 px-3 rounded-lg border border-line bg-white text-sm" />
                <MediaPicker accept="image" onChange={(url) => patch(i, { logo: url })} />
              </div>
              <input value={s.logo} onChange={(e) => patch(i, { logo: e.target.value })} placeholder="/sponsors/… or https://… or choose from library" className="w-full h-10 px-3 rounded-lg border border-line bg-white font-mono text-xs" />
            </div>
            <div className="flex md:flex-col items-center gap-1 shrink-0">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="btn btn-ghost mt-3"><Plus size={16} /> Add sponsor</button>
    </div>
  );
}
