"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, AlertTriangle, RotateCcw } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";
import { getBranding, saveBranding } from "@/lib/branding-actions";
import { defaultBranding, type Branding } from "@/lib/branding-shared";

export default function BrandingSettings() {
  const [b, setB] = useState<Branding>(defaultBranding);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { getBranding().then((v) => { setB(v); setLoaded(true); }).catch(() => setLoaded(true)); }, []);

  function set<K extends keyof Branding>(k: K, v: Branding[K]) { setB((p) => ({ ...p, [k]: v })); setSaved(false); }

  async function save() {
    setSaving(true); setErr(null);
    try {
      const res = await saveBranding(b);
      if (!res.ok) { setErr(res.error ?? "Couldn't save."); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to settings</Link>
      <p className="eyebrow">Admin · Settings · Branding</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Branding.</h1>
      <p className="mt-3 text-ink-muted">Your logo, favicon, site title and tagline. Changes go live across the whole site.</p>

      <div className="mt-5 frame p-4 bg-sole-soft flex items-start gap-3">
        <AlertTriangle size={18} className="text-azzurro-deep shrink-0 mt-0.5" aria-hidden />
        <p className="text-sm">These change how the site looks to <strong>every visitor</strong> the moment you save. Double-check the logo and favicon preview before saving.</p>
      </div>

      {!loaded ? (
        <p className="mt-8 text-sm text-ink-muted">Loading…</p>
      ) : (
        <div className="mt-6 frame p-6 md:p-8 bg-white space-y-7">
          {/* Logo */}
          <div>
            <p className="text-sm font-medium">Logo</p>
            <p className="text-xs text-ink-muted mt-0.5">Shown in the header and footer. A wide (landscape) PNG with a transparent background works best.</p>
            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <span className="h-12 min-w-[8rem] px-3 rounded-lg border border-line bg-cream-2 inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.logo || "/logo.png"} alt="Logo preview" className="h-8 w-auto object-contain" />
              </span>
              <MediaPicker accept="image" onChange={(url) => set("logo", url)} label="Choose / upload logo" />
              {b.logo !== defaultBranding.logo && (
                <button type="button" onClick={() => set("logo", defaultBranding.logo)} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><RotateCcw size={12} /> Reset to default</button>
              )}
            </div>
            <input value={b.logo} onChange={(e) => set("logo", e.target.value)} placeholder="/logo.png or https://…" className="mt-2 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" />
          </div>

          {/* Favicon */}
          <div className="border-t border-line pt-6">
            <p className="text-sm font-medium">Favicon <span className="text-ink-muted font-normal">(browser-tab icon)</span></p>
            <p className="text-xs text-ink-muted mt-0.5">A small <strong>square</strong> image (PNG). Leave empty to use the built-in default icon.</p>
            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <span className="w-10 h-10 rounded-lg border border-line bg-cream-2 inline-flex items-center justify-center overflow-hidden">
                {b.favicon
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={b.favicon} alt="Favicon preview" className="w-full h-full object-contain" />
                  : <span className="text-[10px] text-ink-soft">default</span>}
              </span>
              <MediaPicker accept="image" onChange={(url) => set("favicon", url)} label="Choose / upload favicon" />
              {b.favicon && <button type="button" onClick={() => set("favicon", "")} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><RotateCcw size={12} /> Use default</button>}
            </div>
            <input value={b.favicon} onChange={(e) => set("favicon", e.target.value)} placeholder="(empty = default) or https://…" className="mt-2 w-full h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" />
          </div>

          {/* Title + tagline */}
          <div className="border-t border-line pt-6 grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-medium">Site title
              <input value={b.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} placeholder="La Dante HK" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
            </label>
            <label className="text-sm font-medium">Tagline
              <input value={b.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Italian & Latin in Hong Kong since 1935" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
            </label>
            <p className="sm:col-span-2 text-xs text-ink-muted -mt-1">Browser tab shows: <span className="font-medium text-ink">{b.tagline ? `${b.siteTitle} — ${b.tagline}` : b.siteTitle}</span></p>
          </div>

          {err && <p className="text-sm text-rosso">{err}</p>}
          <div className="flex items-center gap-3 border-t border-line pt-6">
            <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save branding"}</button>
            <span className={`text-sm inline-flex items-center gap-1 transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} /> Saved — live on the site.</span>
          </div>
        </div>
      )}
    </div>
  );
}
