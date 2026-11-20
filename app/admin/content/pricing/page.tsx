"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ExternalLink, RotateCcw } from "lucide-react";
import { getPricing, savePricing } from "@/lib/pricing-actions";
import { defaultPricing, type Pricing } from "@/lib/pricing-shared";

const FIELDS: Array<{ key: keyof Pricing; label: string; hint?: string }> = [
  { key: "individualFirstYear", label: "Individual membership — first year", hint: "Shown as the headline price on the membership card." },
  { key: "individualRenewal", label: "Individual membership — yearly renewal", hint: "Shown under the price (“then HKD … / year renewal”)." },
  { key: "sponsorSilver", label: "Sponsorship — Silver / year" },
  { key: "sponsorGold", label: "Sponsorship — Gold / year" },
  { key: "sponsorDiamond", label: "Sponsorship — Diamond / year", hint: "Silver and Diamond also set the “from … to …” range shown on the membership page." },
];

export default function MembershipPricingEditor() {
  const [pricing, setPricing] = useState<Pricing>(defaultPricing);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getPricing().then((p) => { setPricing(p); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  function set(key: keyof Pricing, v: string) {
    const n = v === "" ? 0 : Math.max(0, Math.round(Number(v) || 0));
    setPricing((p) => ({ ...p, [key]: n }));
  }

  async function save() {
    setErr(null); setSaving(true); setSaved(false);
    try {
      const res = await savePricing(pricing);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "Sign in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Membership pricing</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Membership pricing.</h1>
          <p className="mt-2 text-ink-muted">The prices shown on the membership page. Changes go live when you save.</p>
        </div>
        <Link href="/membership" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View page <ExternalLink size={13} /></Link>
      </div>

      <div className="frame bg-white p-6 md:p-8 space-y-5">
        {FIELDS.map((f) => (
          <label key={f.key} className="block text-sm font-medium">
            {f.label}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-ink-muted text-sm">HKD</span>
              <input
                type="number" min={0} step={50} inputMode="numeric"
                value={loaded ? pricing[f.key] : ""}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-40 h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink"
              />
            </div>
            {f.hint && <span className="mt-1 block text-xs font-normal text-ink-muted">{f.hint}</span>}
          </label>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setPricing(defaultPricing)} className="btn btn-ghost text-sm"><RotateCcw size={13} /> Reset to defaults</button>
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
          <button type="button" onClick={save} disabled={saving || !loaded} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save prices"}</button>
        </div>
      </div>
    </div>
  );
}
