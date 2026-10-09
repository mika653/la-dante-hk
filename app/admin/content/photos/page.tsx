"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { defaultSectionPhotos, type SectionPhotos } from "@/lib/site-content";
import { getSiteContent, saveSiteContent } from "@/lib/site-content-actions";
import MediaPicker from "@/components/MediaPicker";

// Editable photo sets for the homepage sections (workshop cards + the tilted
// collage behind the Events and Library sections). Saves into the same shared
// site content the hero/carousel use, so an edit is live for everyone.
export default function SectionPhotosEditor() {
  const [workshops, setWorkshops] = useState<string[]>(defaultSectionPhotos.workshops);
  const [mosaic, setMosaic] = useState<string[]>(defaultSectionPhotos.mosaic);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getSiteContent().then((c) => { setWorkshops(c.sectionPhotos.workshops); setMosaic(c.sectionPhotos.mosaic); }).catch(() => {});
  }, []);

  async function save() {
    setErr(null); setSaving(true);
    try {
      const current = await getSiteContent();
      const sectionPhotos: SectionPhotos = {
        workshops: workshops.map((s) => s.trim()).filter(Boolean),
        mosaic: mosaic.map((s) => s.trim()).filter(Boolean),
      };
      const res = await saveSiteContent({ ...current, sectionPhotos });
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Section photos</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Homepage section photos.</h1>
          <p className="mt-2 text-ink-muted">Pick images from your Media Library (or paste a URL) for the workshop cards and the photo collage behind the Events &amp; Library sections.</p>
        </div>
        <Link href="/" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View site <ExternalLink size={13} /></Link>
      </div>

      <PhotoList
        title="Workshop photos"
        hint="One per workshop card, in order. Landscape images look best."
        items={workshops}
        setItems={setWorkshops}
        onReset={() => setWorkshops(defaultSectionPhotos.workshops)}
        thumbClass="w-32 h-24"
      />

      <div className="mt-12">
        <PhotoList
          title="Collage photos (Events & Library)"
          hint="The tilted photo collage behind the yellow Events and Library sections. Portrait images look best; 8–10 works well."
          items={mosaic}
          setItems={setMosaic}
          onReset={() => setMosaic(defaultSectionPhotos.mosaic)}
          thumbClass="w-20 h-28"
        />
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 sticky bottom-4">
        <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}>
          <Check size={14} className="inline -mt-1 mr-1" /> Saved. It&apos;s live on the homepage.
        </span>
        {err && <span className="text-sm text-rosso">{err}</span>}
        <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50 shadow-[var(--shadow-pop)]">{saving ? "Saving…" : "Save photos"}</button>
      </div>
    </div>
  );
}

function PhotoList({
  title, hint, items, setItems, onReset, thumbClass,
}: {
  title: string; hint: string; items: string[];
  setItems: (fn: (prev: string[]) => string[]) => void;
  onReset: () => void; thumbClass: string;
}) {
  function update(i: number, url: string) { setItems((list) => list.map((s, n) => (n === i ? url : s))); }
  function remove(i: number) { setItems((list) => list.filter((_, n) => n !== i)); }
  function add() { setItems((list) => [...list, ""]); }
  function move(i: number, dir: -1 | 1) {
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = list.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-ink-muted">{hint}</p>
        </div>
        <button type="button" onClick={onReset} className="btn btn-ghost text-xs"><RotateCcw size={13} /> Reset</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <div className="frame p-6 bg-white text-center text-ink-muted text-sm">No photos yet. Add one below.</div>}
        {items.map((src, i) => (
          <div key={i} className="frame p-4 bg-white grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div className={`relative ${thumbClass} rounded-xl overflow-hidden bg-cream-2 border border-line shrink-0`}>
              {src ? (
                <Image src={src} alt="" fill sizes="160px" unoptimized={src.startsWith("http")} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[11px] text-ink-muted">No image</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-ink-muted">Image {i + 1}</span>
                <MediaPicker accept="image" onChange={(url) => update(i, url)} />
              </div>
              <input value={src} onChange={(e) => update(i, e.target.value)} placeholder="https://… or choose from library" className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" />
            </div>
            <div className="flex md:flex-col items-center gap-1 shrink-0">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="btn btn-ghost mt-3"><Plus size={16} /> Add photo</button>
    </div>
  );
}
