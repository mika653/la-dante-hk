"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ExternalLink, Plus, Trash2 } from "lucide-react";
import { readSiteContent, writeSiteContent, defaultHero, type HeroContent } from "@/lib/site-content";

export default function HeroEditor() {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setHero(readSiteContent().hero); }, []);

  function update<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setHero((h) => ({ ...h, [key]: value }));
  }
  function updateCta(which: "cta1" | "cta2", key: "label" | "href", value: string) {
    setHero((h) => ({ ...h, [which]: { ...h[which], [key]: value } }));
  }
  function updateTrust(idx: number, value: string) {
    setHero((h) => ({ ...h, trust: h.trust.map((t, i) => (i === idx ? value : t)) }));
  }
  function addTrust() { setHero((h) => ({ ...h, trust: [...h.trust, "New item"] })); }
  function removeTrust(idx: number) { setHero((h) => ({ ...h, trust: h.trust.filter((_, i) => i !== idx) })); }

  function save() {
    const current = readSiteContent();
    writeSiteContent({ ...current, hero });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  function reset() {
    if (!confirm("Reset all hero fields to defaults?")) return;
    setHero(defaultHero);
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Hero</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Edit the homepage hero.</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="btn btn-ghost text-sm"><RotateCcw size={14} /> Reset</button>
          <Link href="/" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View site <ExternalLink size={13} /></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* LEFT: Form */}
        <div className="frame p-6 md:p-8 bg-white space-y-5">
          <label className="block text-sm font-medium">Eyebrow <span className="text-ink-muted font-normal">(small uppercase above headline)</span>
            <input value={hero.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} className="mt-1 w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Headline <span className="text-ink-muted font-normal">(3 stacked lines — line 2 renders in italic)</span></legend>
            <input value={hero.line1} onChange={(e) => update("line1", e.target.value)} placeholder="Line 1" className="w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-heading font-extrabold uppercase" />
            <input value={hero.line2} onChange={(e) => update("line2", e.target.value)} placeholder="Line 2 (italic)" className="w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-body italic" />
            <input value={hero.line3} onChange={(e) => update("line3", e.target.value)} placeholder="Line 3" className="w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-heading font-extrabold uppercase" />
          </fieldset>

          <label className="block text-sm font-medium">Subhead
            <textarea value={hero.subhead} onChange={(e) => update("subhead", e.target.value)} rows={3} className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
          </label>

          <fieldset className="grid md:grid-cols-2 gap-3">
            <legend className="col-span-full text-sm font-medium mb-1">Primary CTA</legend>
            <label className="text-xs text-ink-muted">Label<input value={hero.cta1.label} onChange={(e) => updateCta("cta1", "label", e.target.value)} className="mt-1 w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-xs text-ink-muted">Link URL<input value={hero.cta1.href} onChange={(e) => updateCta("cta1", "href", e.target.value)} placeholder="/placement-test" className="mt-1 w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-sm" /></label>
          </fieldset>

          <fieldset className="grid md:grid-cols-2 gap-3">
            <legend className="col-span-full text-sm font-medium mb-1">Secondary CTA <span className="text-ink-muted font-normal">(leave label blank to hide)</span></legend>
            <label className="text-xs text-ink-muted">Label<input value={hero.cta2.label} onChange={(e) => updateCta("cta2", "label", e.target.value)} className="mt-1 w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-xs text-ink-muted">Link URL<input value={hero.cta2.href} onChange={(e) => updateCta("cta2", "href", e.target.value)} className="mt-1 w-full h-11 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-mono text-sm" /></label>
          </fieldset>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Trust strip items</p>
              <button type="button" onClick={addTrust} className="text-xs text-azzurro-deep inline-flex items-center gap-1"><Plus size={12} /> Add</button>
            </div>
            <div className="space-y-2">
              {hero.trust.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={t} onChange={(e) => updateTrust(i, e.target.value)} className="flex-1 h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm" />
                  <button type="button" onClick={() => removeTrust(i)} aria-label="Remove" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between">
            <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}>
              <Check size={14} className="inline -mt-1 mr-1" /> Saved. Reload the homepage to see changes.
            </span>
            <button type="button" onClick={save} className="btn btn-primary">Save changes</button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="space-y-3">
          <p className="eyebrow">Live preview</p>
          <div className="frame bg-cream p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-azzurro opacity-60 blur-[1px]" aria-hidden />
            <p className="eyebrow text-ink">{hero.eyebrow}</p>
            <h2 className="mt-3 font-heading font-extrabold uppercase text-2xl md:text-3xl leading-[0.95] tracking-[-0.02em]">
              {hero.line1}<br />
              <span className="font-body italic normal-case">{hero.line2}</span><br />
              {hero.line3}<span className="ring-dot ml-1" aria-hidden />
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{hero.subhead}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hero.cta1.label && <span className="btn btn-primary !h-9 !px-4 !text-xs">{hero.cta1.label}</span>}
              {hero.cta2.label && <span className="btn btn-yellow !h-9 !px-4 !text-xs">{hero.cta2.label}</span>}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
              {hero.trust.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  {t}
                  {i < hero.trust.length - 1 && <span className="text-ink-soft">·</span>}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-muted">This preview is approximate. Click <strong>View site</strong> after saving to see the live render.</p>
        </div>
      </div>
    </div>
  );
}
