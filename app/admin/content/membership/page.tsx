"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowDown, ArrowUp, Check, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import { getMembershipContent, saveMembershipContent } from "@/lib/membership-content-actions";
import {
  defaultMembershipContent,
  MEMBERSHIP_ICONS,
  TIER_IDS,
  type IconItem,
  type IconLine,
  type MembershipContent,
  type MembershipIcon,
  type TierCopy,
  type TierId,
} from "@/lib/membership-content-shared";
import type { Bilingual } from "@/lib/site-content-shared";
import { MEMBERSHIP_ICON } from "@/lib/membership-icons";

const input = "mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm";
const area = "mt-1 w-full p-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm resize-y";
const iconBtn = "w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted shrink-0";
const EMPTY: Bilingual = { en: "", zh: "" };

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = list.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

// ---------- small building blocks ----------

function Section({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="frame bg-white p-5 md:p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/** English + 繁中 side by side. */
function BiField({ label, value, onChange, multiline, rows = 3 }: { label: string; value: Bilingual; onChange: (v: Bilingual) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="grid md:grid-cols-2 gap-2">
        {(["en", "zh"] as const).map((k) => (
          <label key={k} className="block text-xs text-ink-muted">
            {k === "en" ? "English" : "繁中 (blank = English)"}
            {multiline ? (
              <textarea value={value[k]} rows={rows} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className={`${area} text-ink`} />
            ) : (
              <input value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className={`${input} text-ink`} />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function RowTools({ i, n, onMove, onRemove }: { i: number; n: number; onMove: (dir: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" onClick={() => onMove(-1)} disabled={i === 0} aria-label="Move up" className={iconBtn}><ArrowUp size={14} /></button>
      <button type="button" onClick={() => onMove(1)} disabled={i === n - 1} aria-label="Move down" className={iconBtn}><ArrowDown size={14} /></button>
      <button type="button" onClick={onRemove} aria-label="Remove" className={`${iconBtn} hover:bg-rosso/10! hover:text-rosso`}><Trash2 size={14} /></button>
    </div>
  );
}

/** Editable bullet list: add / remove / reorder, English + 繁中 per row. */
function BiList({ label, items, onChange, addLabel = "Add bullet" }: { label: string; items: Bilingual[]; onChange: (v: Bilingual[]) => void; addLabel?: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="hidden md:grid grid-cols-[1fr_1fr_auto] gap-2 mt-1 text-xs text-ink-muted">
        <span>English</span><span>繁中 (blank = English)</span><span className="w-26" />
      </div>
      <ul className="mt-1 space-y-2">
        {items.map((b, i) => (
          <li key={i} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-start">
            <input aria-label={`${label} ${i + 1} (English)`} value={b.en} onChange={(e) => onChange(items.map((x, n) => (n === i ? { ...x, en: e.target.value } : x)))} className={`${input} mt-0!`} />
            <input aria-label={`${label} ${i + 1} (繁中)`} value={b.zh} placeholder={b.en} onChange={(e) => onChange(items.map((x, n) => (n === i ? { ...x, zh: e.target.value } : x)))} className={`${input} mt-0!`} />
            <div className="pt-1.5">
              <RowTools i={i} n={items.length} onMove={(d) => onChange(move(items, i, d))} onRemove={() => onChange(items.filter((_, n) => n !== i))} />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...items, { ...EMPTY }])} className="btn btn-ghost text-sm mt-2"><Plus size={14} /> {addLabel}</button>
    </div>
  );
}

function IconSelect({ value, onChange }: { value: MembershipIcon; onChange: (v: MembershipIcon) => void }) {
  const Icon = MEMBERSHIP_ICON[value] ?? MEMBERSHIP_ICON.star;
  return (
    <label className="text-sm font-medium inline-flex items-center gap-2">
      <Icon size={16} className="text-azzurro-deep" aria-hidden />
      <span className="sr-only">Icon</span>
      <select value={value} onChange={(e) => onChange(e.target.value as MembershipIcon)} className="h-9 px-2 rounded-lg border border-line bg-white text-sm">
        {MEMBERSHIP_ICONS.map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
    </label>
  );
}

// ---------- page ----------

export default function MembershipContentEditor() {
  const [data, setData] = useState<MembershipContent>(defaultMembershipContent);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getMembershipContent().then((d) => { setData(d); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  const setCard = (p: Partial<MembershipContent["card"]>) => setData((d) => ({ ...d, card: { ...d.card, ...p } }));
  const setInd = (p: Partial<MembershipContent["individual"]>) => setData((d) => ({ ...d, individual: { ...d.individual, ...p } }));
  const setSc = (p: Partial<MembershipContent["sponsorCard"]>) => setData((d) => ({ ...d, sponsorCard: { ...d.sponsorCard, ...p } }));
  const setSp = (p: Partial<MembershipContent["sponsorship"]>) => setData((d) => ({ ...d, sponsorship: { ...d.sponsorship, ...p } }));
  const setTier = (id: TierId, p: Partial<TierCopy>) =>
    setData((d) => ({ ...d, sponsorship: { ...d.sponsorship, tiers: { ...d.sponsorship.tiers, [id]: { ...d.sponsorship.tiers[id], ...p } } } }));
  const setClass = (p: Partial<MembershipContent["sponsorship"]["classroom"]>) =>
    setData((d) => ({ ...d, sponsorship: { ...d.sponsorship, classroom: { ...d.sponsorship.classroom, ...p } } }));

  const benefits = data.card.benefits;
  const setBenefit = (i: number, p: Partial<IconItem>) => setCard({ benefits: benefits.map((b, n) => (n === i ? { ...b, ...p } : b)) });
  const classPerks = data.sponsorship.classroom.perks;
  const setClassPerk = (i: number, p: Partial<IconLine>) => setClass({ perks: classPerks.map((b, n) => (n === i ? { ...b, ...p } : b)) });

  async function save() {
    setErr(null); setSaving(true); setSaved(false);
    try {
      const res = await saveMembershipContent(data);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "Sign in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setErr("Couldn't save.");
    } finally { setSaving(false); }
  }

  const code = (s: string) => <code className="bg-cream-2 px-1 rounded">{s}</code>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Content · Membership &amp; sponsorship</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Membership &amp; sponsorship copy.</h1>
          <p className="mt-2 text-ink-muted max-w-2xl">Descriptions and benefit lists on the membership and sponsorship pages. Prices are set separately in <Link href="/admin/content/pricing" className="underline">Membership pricing</Link>. Changes go live when you save.</p>
          <p className="mt-1 text-xs text-ink-muted">
            Formatting: {code("**bold**")}, {code("*italic*")}, line breaks. Price placeholders: {code("{silver}")} {code("{gold}")} {code("{diamond}")} {code("{firstYear}")} {code("{renewal}")}. Leave 繁中 blank to show the English.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/membership" target="_blank" rel="noopener" className="btn btn-ghost text-sm">Membership <ExternalLink size={13} /></Link>
          <Link href="/services/sponsorship" target="_blank" rel="noopener" className="btn btn-ghost text-sm">Sponsorship <ExternalLink size={13} /></Link>
        </div>
      </div>

      <fieldset disabled={!loaded} className="space-y-6">
        {/* Membership card */}
        <Section title="Membership card" hint="The block at the top of the membership page.">
          <BiField label="Heading" value={data.card.title} onChange={(v) => setCard({ title: v })} />
          <BiField label="Intro paragraph" value={data.card.intro} onChange={(v) => setCard({ intro: v })} multiline />
          <BiField label="Card administration — box title" value={data.card.adminTitle} onChange={(v) => setCard({ adminTitle: v })} />
          <BiList label="Card administration — bullets" items={data.card.admin} onChange={(v) => setCard({ admin: v })} />
        </Section>

        <Section title="Member benefits" hint="The tiles beside the membership card.">
          {benefits.map((b, i) => (
            <div key={i} className="rounded-xl border border-line p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Benefit {i + 1}</span>
                <div className="flex items-center gap-2">
                  <IconSelect value={b.icon} onChange={(icon) => setBenefit(i, { icon })} />
                  <RowTools i={i} n={benefits.length} onMove={(d) => setCard({ benefits: move(benefits, i, d) })} onRemove={() => setCard({ benefits: benefits.filter((_, n) => n !== i) })} />
                </div>
              </div>
              <BiField label="Title" value={b.title} onChange={(v) => setBenefit(i, { title: v })} />
              <BiField label="Description" value={b.body} onChange={(v) => setBenefit(i, { body: v })} multiline rows={2} />
            </div>
          ))}
          <button type="button" onClick={() => setCard({ benefits: [...benefits, { icon: "star", title: { ...EMPTY }, body: { ...EMPTY } }] })} className="btn btn-ghost text-sm"><Plus size={14} /> Add benefit</button>
        </Section>

        {/* Individual plan */}
        <Section title="Individual membership plan" hint={<>The plan card in the “Choose your membership” step. The renewal line can use {code("{renewal}")} for the renewal price.</>}>
          <div className="grid gap-4">
            <BiField label="Plan name" value={data.individual.name} onChange={(v) => setInd({ name: v })} />
            <BiField label="Badge (blank hides it)" value={data.individual.badge} onChange={(v) => setInd({ badge: v })} />
            <BiField label="Description" value={data.individual.blurb} onChange={(v) => setInd({ blurb: v })} multiline rows={2} />
            <BiField label="Text after the price" value={data.individual.cadence} onChange={(v) => setInd({ cadence: v })} />
            <BiField label="Renewal line (blank hides it)" value={data.individual.renewal} onChange={(v) => setInd({ renewal: v })} />
            <BiList label="Benefits" items={data.individual.perks} onChange={(v) => setInd({ perks: v })} />
          </div>
        </Section>

        <Section title="Sponsorship card (beside the plan)" hint="The “Sponsorship / Corporate” card that links down to the sponsorship levels.">
          <BiField label="Badge (blank hides it)" value={data.sponsorCard.badge} onChange={(v) => setSc({ badge: v })} />
          <BiField label="Title" value={data.sponsorCard.title} onChange={(v) => setSc({ title: v })} />
          <BiField label="Description" value={data.sponsorCard.blurb} onChange={(v) => setSc({ blurb: v })} multiline rows={2} />
        </Section>

        {/* Sponsorship */}
        <Section title="Corporate sponsorship — intro" hint="Shown on the membership page and on Services › Sponsorship.">
          <BiField label="Heading" value={data.sponsorship.title} onChange={(v) => setSp({ title: v })} />
          <BiField label="Intro paragraph" value={data.sponsorship.intro} onChange={(v) => setSp({ intro: v })} multiline rows={4} />
        </Section>

        {TIER_IDS.map((id) => {
          const t = data.sponsorship.tiers[id];
          return (
            <Section key={id} title={`Sponsorship tier — ${t.name.en || id}`}>
              <div className="grid md:grid-cols-2 gap-4">
                <BiField label="Tier name" value={t.name} onChange={(v) => setTier(id, { name: v })} />
                <BiField label="Badge (blank hides it)" value={t.badge} onChange={(v) => setTier(id, { badge: v })} />
              </div>
              <BiField label="Tagline" value={t.tagline} onChange={(v) => setTier(id, { tagline: v })} multiline rows={2} />
              <BiList label="Benefits" items={t.benefits} onChange={(v) => setTier(id, { benefits: v })} />
            </Section>
          );
        })}

        <Section title="Classroom sponsorship add-on">
          <BiField label="Heading" value={data.sponsorship.classroom.title} onChange={(v) => setClass({ title: v })} />
          <BiField label="Description" value={data.sponsorship.classroom.body} onChange={(v) => setClass({ body: v })} multiline rows={3} />
          <div>
            <p className="text-sm font-medium">Perks</p>
            <ul className="mt-2 space-y-3">
              {classPerks.map((p, i) => (
                <li key={i} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <IconSelect value={p.icon} onChange={(icon) => setClassPerk(i, { icon })} />
                    <RowTools i={i} n={classPerks.length} onMove={(d) => setClass({ perks: move(classPerks, i, d) })} onRemove={() => setClass({ perks: classPerks.filter((_, n) => n !== i) })} />
                  </div>
                  <BiField label={`Perk ${i + 1}`} value={p.label} onChange={(v) => setClassPerk(i, { label: v })} />
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setClass({ perks: [...classPerks, { icon: "star", label: { ...EMPTY } }] })} className="btn btn-ghost text-sm mt-2"><Plus size={14} /> Add perk</button>
          </div>
        </Section>
      </fieldset>

      <div className="sticky bottom-0 mt-6 -mx-2 px-2 py-3 bg-cream-2/95 backdrop-blur flex items-center justify-between gap-3 flex-wrap">
        <button type="button" onClick={() => setData(defaultMembershipContent)} className="btn btn-ghost text-sm"><RotateCcw size={13} /> Reset to defaults</button>
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
          <button type="button" onClick={save} disabled={saving || !loaded} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save copy"}</button>
        </div>
      </div>
    </div>
  );
}
