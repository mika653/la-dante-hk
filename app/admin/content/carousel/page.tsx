"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { readSiteContent, writeSiteContent, defaultCarousel, type CarouselSlide } from "@/lib/site-content";

export default function CarouselEditor() {
  const [slides, setSlides] = useState<CarouselSlide[]>(defaultCarousel);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSlides(readSiteContent().carousel); }, []);

  function updateSlide(id: string, patch: Partial<CarouselSlide>) {
    setSlides((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function removeSlide(id: string) { setSlides((list) => list.filter((s) => s.id !== id)); }
  function addSlide() {
    setSlides((list) => [...list, { id: `s-${Date.now()}`, src: "", alt: "New slide", caption: "" }]);
  }
  function move(id: string, dir: -1 | 1) {
    setSlides((list) => {
      const i = list.findIndex((s) => s.id === id);
      if (i < 0) return list;
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = list.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function save() {
    const current = readSiteContent();
    writeSiteContent({ ...current, carousel: slides });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  function reset() {
    if (!confirm("Reset the carousel to default slides?")) return;
    setSlides(defaultCarousel);
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Carousel</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Edit the hero carousel.</h1>
          <p className="mt-2 text-ink-muted">Paste any image URL (we recommend Unsplash or uploading to a service like Cloudinary). Images auto-rotate every 6 seconds on the live site.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="btn btn-ghost text-sm"><RotateCcw size={14} /> Reset</button>
          <Link href="/" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View site <ExternalLink size={13} /></Link>
        </div>
      </div>

      <div className="space-y-4">
        {slides.length === 0 && (
          <div className="frame p-8 bg-white text-center text-ink-muted">No slides yet. Add one below.</div>
        )}
        {slides.map((s, i) => (
          <div key={s.id} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[auto_1fr_auto] gap-5 items-start">
            {/* Thumb */}
            <div className="relative w-32 h-24 md:w-40 md:h-28 rounded-xl overflow-hidden bg-cream-2 border border-line shrink-0">
              {s.src ? (
                <Image
                  src={s.src}
                  alt={s.alt || ""}
                  fill
                  sizes="160px"
                  unoptimized={s.src.startsWith("http")}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">No image</div>
              )}
            </div>

            {/* Fields */}
            <div className="space-y-3 min-w-0">
              <label className="block text-xs text-ink-muted">Image URL
                <input value={s.src} onChange={(e) => updateSlide(s.id, { src: e.target.value })} placeholder="https://…" className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" />
              </label>
              <label className="block text-xs text-ink-muted">Alt text <span className="italic">(what a screen reader announces)</span>
                <input value={s.alt} onChange={(e) => updateSlide(s.id, { alt: e.target.value })} className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm" />
              </label>
              <label className="block text-xs text-ink-muted">Caption <span className="italic">(shown bottom-right on hover)</span>
                <input value={s.caption} onChange={(e) => updateSlide(s.id, { caption: e.target.value })} className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm" />
              </label>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center gap-1 shrink-0">
              <button type="button" onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Move up" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} aria-label="Move down" className="w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => removeSlide(s.id)} aria-label="Remove slide" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={addSlide} className="btn btn-ghost"><Plus size={16} /> Add slide</button>
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}>
            <Check size={14} className="inline -mt-1 mr-1" /> Saved. Reload the homepage to see changes.
          </span>
          <button type="button" onClick={save} className="btn btn-primary">Save carousel</button>
        </div>
      </div>
    </div>
  );
}
