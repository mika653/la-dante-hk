"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { getOffers, saveOffers } from "@/lib/offers-actions";
import { defaultOffers, OFFER_ICONS, type Offer, type OffersContent, type OfferIcon } from "@/lib/offers-shared";
import { OFFER_ICON } from "@/components/offer-icon";

const field = "mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm";

export default function SpecialOffersEditor() {
  const [data, setData] = useState<OffersContent>(defaultOffers);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getOffers().then((d) => { setData(d); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  function patch(i: number, p: Partial<Offer>) {
    setData((d) => ({ ...d, items: d.items.map((o, n) => (n === i ? { ...o, ...p } : o)) }));
  }
  function remove(i: number) { setData((d) => ({ ...d, items: d.items.filter((_, n) => n !== i) })); }
  function add() {
    setData((d) => ({ ...d, items: [...d.items, { id: `offer-${Date.now()}`, icon: "tag", tag: "", title: "New offer", body: "", href: "/contact", cta: "Learn more" }] }));
  }
  function move(i: number, dir: -1 | 1) {
    setData((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.items.length) return d;
      const items = d.items.slice();
      [items[i], items[j]] = [items[j], items[i]];
      return { ...d, items };
    });
  }

  async function save() {
    setErr(null); setSaving(true); setSaved(false);
    try {
      const res = await saveOffers(data);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "Sign in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Special offers</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Special offers.</h1>
          <p className="mt-2 text-ink-muted">The cards on the Special Offers page. Changes go live when you save.</p>
          <p className="mt-1 text-xs text-ink-muted">Formatting in the description &amp; terms: <code className="bg-cream-2 px-1 rounded">**bold**</code>, <code className="bg-cream-2 px-1 rounded">*italic*</code>, and line breaks are respected.</p>
        </div>
        <Link href="/special-offers" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View page <ExternalLink size={13} /></Link>
      </div>

      <div className="space-y-4">
        {data.items.map((o, i) => {
          const Icon = OFFER_ICON[o.icon] ?? OFFER_ICON.tag;
          return (
            <div key={o.id} className="frame bg-white p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium"><Icon size={16} className="text-azzurro-deep" /> Offer {i + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === data.items.length - 1} aria-label="Move down" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
                  <button type="button" onClick={() => remove(i)} aria-label="Remove" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid md:grid-cols-[auto_1fr] gap-3">
                <label className="text-sm font-medium">Icon
                  <select value={o.icon} onChange={(e) => patch(i, { icon: e.target.value as OfferIcon })} className={`${field} w-full md:w-36`}>
                    {OFFER_ICONS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium">Tag <span className="text-ink-muted font-normal">(small pill, e.g. “10% off”)</span>
                  <input value={o.tag} onChange={(e) => patch(i, { tag: e.target.value })} className={field} />
                </label>
              </div>
              <label className="block text-sm font-medium mt-3">Title
                <input value={o.title} onChange={(e) => patch(i, { title: e.target.value })} className={field} />
              </label>
              <label className="block text-sm font-medium mt-3">Description
                <textarea value={o.body} onChange={(e) => patch(i, { body: e.target.value })} rows={3} className="mt-1 w-full p-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm resize-y" />
              </label>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <label className="text-sm font-medium">Button link
                  <input value={o.href} onChange={(e) => patch(i, { href: e.target.value })} placeholder="/courses or https://…" className={`${field} font-mono text-xs`} />
                </label>
                <label className="text-sm font-medium">Button label
                  <input value={o.cta} onChange={(e) => patch(i, { cta: e.target.value })} className={field} />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={add} className="btn btn-ghost mt-4"><Plus size={16} /> Add offer</button>

      <div className="frame bg-white p-5 mt-6">
        <label className="block text-sm font-medium">Terms line <span className="text-ink-muted font-normal">(small print under the offers)</span>
          <textarea value={data.terms} onChange={(e) => setData((d) => ({ ...d, terms: e.target.value }))} rows={2} className="mt-1 w-full p-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm resize-y" />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setData(defaultOffers)} className="btn btn-ghost text-sm"><RotateCcw size={13} /> Reset to defaults</button>
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
          <button type="button" onClick={save} disabled={saving || !loaded} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save offers"}</button>
        </div>
      </div>
    </div>
  );
}
