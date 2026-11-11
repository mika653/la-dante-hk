"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ExternalLink, Plus, Trash2, Megaphone, MessageSquare } from "lucide-react";
import {
  defaultAnnouncement, defaultPopup, biEmpty,
  type AnnouncementContent, type PopupContent, type Bilingual,
} from "@/lib/site-content";
import { getSiteContent, saveSiteContent } from "@/lib/site-content-actions";

// One label with an English + Traditional-Chinese input underneath.
function BiField({ label, hint, value, onChange, textarea = false, mono = false }: {
  label: string; hint?: string; value: Bilingual; onChange: (v: Bilingual) => void; textarea?: boolean; mono?: boolean;
}) {
  const cls = `mt-1 w-full ${textarea ? "p-3" : "h-11 px-3"} rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm ${mono ? "font-mono" : ""}`;
  return (
    <div>
      <p className="text-sm font-medium">{label}{hint && <span className="text-ink-muted font-normal"> — {hint}</span>}</p>
      <div className="grid sm:grid-cols-2 gap-2 mt-1">
        <label className="text-xs text-ink-muted">English
          {textarea
            ? <textarea value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} rows={2} className={cls} />
            : <input value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} className={cls} />}
        </label>
        <label className="text-xs text-ink-muted">繁體中文 <span className="text-ink-soft">(optional)</span>
          {textarea
            ? <textarea value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} rows={2} className={cls} placeholder="Leave blank to show the English" />
            : <input value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} className={cls} placeholder="Leave blank to show the English" />}
        </label>
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-azzurro-deep" />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

export default function AnnouncementEditor() {
  const [ann, setAnn] = useState<AnnouncementContent>(defaultAnnouncement);
  const [pop, setPop] = useState<PopupContent>(defaultPopup);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getSiteContent().then((c) => { setAnn(c.announcement); setPop(c.popup); }).catch(() => {});
  }, []);

  async function save() {
    setErr(null); setSaving(true);
    try {
      const current = await getSiteContent();
      const res = await saveSiteContent({ ...current, announcement: ann, popup: pop });
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  // --- announcement helpers ---
  const setPart = (i: number, v: Bilingual) => setAnn((a) => ({ ...a, parts: a.parts.map((p, idx) => idx === i ? v : p) }));
  const addPart = () => setAnn((a) => ({ ...a, parts: [...a.parts, { ...biEmpty }] }));
  const removePart = (i: number) => setAnn((a) => ({ ...a, parts: a.parts.filter((_, idx) => idx !== i) }));

  // --- popup helpers ---
  const setBullet = (i: number, v: Bilingual) => setPop((p) => ({ ...p, bullets: p.bullets.map((b, idx) => idx === i ? v : b) }));
  const addBullet = () => setPop((p) => ({ ...p, bullets: [...p.bullets, { ...biEmpty }] }));
  const removeBullet = (i: number) => setPop((p) => ({ ...p, bullets: p.bullets.filter((_, idx) => idx !== i) }));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-2">
        <div>
          <p className="eyebrow">Admin · Content · Announcement &amp; pop-up</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Announcement &amp; pop-up.</h1>
        </div>
        <Link href="/" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View site <ExternalLink size={13} /></Link>
      </div>
      <p className="text-ink-muted mb-6 max-w-xl text-sm">The top banner and the first-visit pop-up. English shows on the English site; 繁體中文 shows on the Chinese site (leave it blank and the English is used). Changes go live when you save.</p>

      {/* Announcement bar */}
      <section className="frame p-6 md:p-7 bg-white space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="text-lg font-semibold inline-flex items-center gap-2"><Megaphone size={18} className="text-azzurro-deep" /> Announcement bar</h2>
          <Toggle on={ann.enabled} onChange={(v) => setAnn((a) => ({ ...a, enabled: v }))} label={ann.enabled ? "Showing" : "Hidden"} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Messages <span className="text-ink-muted font-normal">(shown across the top, separated by ·)</span></p>
            <button type="button" onClick={addPart} className="text-xs text-azzurro-deep inline-flex items-center gap-1"><Plus size={12} /> Add message</button>
          </div>
          {ann.parts.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1"><BiField label={`Message ${i + 1}`} value={p} onChange={(v) => setPart(i, v)} /></div>
              <button type="button" onClick={() => removePart(i)} aria-label="Remove message" className="mt-6 w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
          <BiField label="Link text" hint="the underlined link at the end (clear English to hide it)" value={ann.cta.label} onChange={(v) => setAnn((a) => ({ ...a, cta: { ...a.cta, label: v } }))} />
          <label className="block text-sm font-medium">Link URL
            <input value={ann.cta.href} onChange={(e) => setAnn((a) => ({ ...a, cta: { ...a.cta, href: e.target.value } }))} placeholder="/special-offers" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-sm" />
          </label>
        </div>
      </section>

      {/* Entry pop-up */}
      <section className="frame p-6 md:p-7 bg-white space-y-5 mt-5">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="text-lg font-semibold inline-flex items-center gap-2"><MessageSquare size={18} className="text-azzurro-deep" /> First-visit pop-up</h2>
          <Toggle on={pop.enabled} onChange={(v) => setPop((p) => ({ ...p, enabled: v }))} label={pop.enabled ? "Showing" : "Hidden"} />
        </div>
        <div className="space-y-4">
          <BiField label="Eyebrow" hint="small label above the title" value={pop.eyebrow} onChange={(v) => setPop((p) => ({ ...p, eyebrow: v }))} />
          <BiField label="Title" value={pop.title} onChange={(v) => setPop((p) => ({ ...p, title: v }))} textarea />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Bullet points</p>
            <button type="button" onClick={addBullet} className="text-xs text-azzurro-deep inline-flex items-center gap-1"><Plus size={12} /> Add bullet</button>
          </div>
          {pop.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1"><BiField label={`Bullet ${i + 1}`} value={b} onChange={(v) => setBullet(i, v)} /></div>
              <button type="button" onClick={() => removeBullet(i)} aria-label="Remove bullet" className="mt-6 w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end pt-2 border-t border-line">
            <BiField label="Primary button" value={pop.cta1.label} onChange={(v) => setPop((p) => ({ ...p, cta1: { ...p.cta1, label: v } }))} />
            <label className="text-xs text-ink-muted md:w-56">Link URL<input value={pop.cta1.href} onChange={(e) => setPop((p) => ({ ...p, cta1: { ...p.cta1, href: e.target.value } }))} placeholder="/courses/italian/adult-groups" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" /></label>
          </div>
          <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
            <BiField label="Secondary button" hint="clear English to hide it" value={pop.cta2.label} onChange={(v) => setPop((p) => ({ ...p, cta2: { ...p.cta2, label: v } }))} />
            <label className="text-xs text-ink-muted md:w-56">Link URL<input value={pop.cta2.href} onChange={(e) => setPop((p) => ({ ...p, cta2: { ...p.cta2, href: e.target.value } }))} placeholder="/placement-test" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" /></label>
          </div>
        </div>
      </section>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-5 bg-cream/95 backdrop-blur border-t border-line py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => { setAnn(defaultAnnouncement); setPop(defaultPopup); }} className="btn btn-ghost text-sm"><RotateCcw size={14} /> Reset to defaults</button>
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved. It&apos;s live now.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </div>
  );
}
