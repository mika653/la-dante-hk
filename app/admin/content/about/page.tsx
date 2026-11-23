"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowDown, ArrowUp, Check, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";
import {
  defaultAboutContent,
  type AboutContent, type AboutMilestone, type AboutPerson, type AboutTeamGroup, type Bilingual,
} from "@/lib/about-content-shared";
import { getAboutContent, saveAboutContent } from "@/lib/about-content-actions";

const newId = () => Math.random().toString(36).slice(2, 10);
const biEmpty: Bilingual = { en: "", zh: "" };

// ---------- small field helpers ----------

function BiField({ label, hint, value, onChange, textarea = false, rows = 3 }: {
  label: string; hint?: string; value: Bilingual; onChange: (v: Bilingual) => void; textarea?: boolean; rows?: number;
}) {
  const cls = `mt-1 w-full ${textarea ? "p-3" : "h-11 px-3"} rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm`;
  return (
    <div>
      <p className="text-sm font-medium">{label}{hint && <span className="text-ink-muted font-normal"> — {hint}</span>}</p>
      <div className="grid sm:grid-cols-2 gap-2 mt-1">
        <label className="text-xs text-ink-muted">English
          {textarea
            ? <textarea value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} rows={rows} className={cls} />
            : <input value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} className={cls} />}
        </label>
        <label className="text-xs text-ink-muted">繁體中文 <span className="text-ink-soft">(optional)</span>
          {textarea
            ? <textarea value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} rows={rows} className={cls} placeholder="Leave blank to show the English" />
            : <input value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} className={cls} placeholder="Leave blank to show the English" />}
        </label>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, mono = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <label className="block text-xs text-ink-muted">{label}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm text-ink ${mono ? "font-mono" : ""}`} />
    </label>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="frame p-6 md:p-7 bg-white space-y-5 mt-5">
      <div className="border-b border-line pb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

// Up / down / remove controls for a list row.
function RowControls({ index, count, onMove, onRemove, what }: { index: number; count: number; onMove: (from: number, to: number) => void; onRemove: () => void; what: string }) {
  const btn = "w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink-muted disabled:opacity-30";
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${what} up`} className={`${btn} hover:bg-cream-2`}><ArrowUp size={14} /></button>
      <button type="button" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${what} down`} className={`${btn} hover:bg-cream-2`}><ArrowDown size={14} /></button>
      <button type="button" onClick={onRemove} aria-label={`Remove ${what}`} className={`${btn} hover:bg-rosso/10 hover:text-rosso`}><Trash2 size={14} /></button>
    </div>
  );
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} className="text-xs text-azzurro-deep inline-flex items-center gap-1"><Plus size={12} /> {children}</button>;
}

// One team group (board / management / teachers).
function GroupEditor({ title, group, onChange, withEmail, roleHint }: {
  title: string; group: AboutTeamGroup; onChange: (g: AboutTeamGroup) => void; withEmail: boolean; roleHint?: string;
}) {
  const setMember = (i: number, p: AboutPerson) => onChange({ ...group, members: group.members.map((m, idx) => (idx === i ? p : m)) });
  const add = () => onChange({ ...group, members: [...group.members, { id: newId(), name: "", role: { ...biEmpty }, ...(withEmail ? { email: "" } : {}) }] });
  return (
    <div className="space-y-4 pt-4 border-t border-line first:border-t-0 first:pt-0">
      <h3 className="font-semibold">{title}</h3>
      <BiField label="Heading" value={group.heading} onChange={(v) => onChange({ ...group, heading: v })} />
      <BiField label="Sub-heading" value={group.subheading} onChange={(v) => onChange({ ...group, subheading: v })} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">People <span className="text-ink-muted font-normal">({group.members.length}; remove everyone to hide this group)</span></p>
        <AddButton onClick={add}>Add person</AddButton>
      </div>
      {group.members.map((p, i) => (
        <div key={p.id} className="rounded-xl border border-line p-4 bg-cream/40 space-y-3">
          <div className="flex items-start gap-3">
            <div className={`flex-1 grid gap-3 ${withEmail ? "sm:grid-cols-2" : ""}`}>
              <TextField label="Name" value={p.name} onChange={(v) => setMember(i, { ...p, name: v })} />
              {withEmail && <TextField label="Email (optional)" value={p.email ?? ""} onChange={(v) => setMember(i, { ...p, email: v })} mono />}
            </div>
            <div className="mt-5"><RowControls index={i} count={group.members.length} what="person" onMove={(a, b) => onChange({ ...group, members: move(group.members, a, b) })} onRemove={() => onChange({ ...group, members: group.members.filter((_, idx) => idx !== i) })} /></div>
          </div>
          <BiField label="Role" hint={roleHint} value={p.role} onChange={(v) => setMember(i, { ...p, role: v })} />
        </div>
      ))}
    </div>
  );
}

export default function AboutEditor() {
  const [c, setC] = useState<AboutContent>(defaultAboutContent);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getAboutContent().then((d) => { setC(d); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  async function save() {
    setErr(null); setSaving(true);
    try {
      const res = await saveAboutContent(c);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch {
      setErr("Couldn't save.");
    } finally { setSaving(false); }
  }

  const setHeader = (k: keyof AboutContent["header"], v: Bilingual) => setC((x) => ({ ...x, header: { ...x.header, [k]: v } }));
  const setMural = (patch: Partial<AboutContent["mural"]>) => setC((x) => ({ ...x, mural: { ...x.mural, ...patch } }));
  const setHistory = (patch: Partial<AboutContent["history"]>) => setC((x) => ({ ...x, history: { ...x.history, ...patch } }));
  const setTeam = (patch: Partial<AboutContent["team"]>) => setC((x) => ({ ...x, team: { ...x.team, ...patch } }));
  const setMilestone = (i: number, m: AboutMilestone) => setHistory({ milestones: c.history.milestones.map((x, idx) => (idx === i ? m : x)) });

  return (
    <div className="max-w-3xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-2">
        <div>
          <p className="eyebrow">Admin · Content · About page</p>
          <h1 className="mt-2 text-3xl md:text-4xl">About page.</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/about" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View English <ExternalLink size={13} /></Link>
          <Link href="/zh/about" target="_blank" rel="noopener" className="btn btn-ghost text-sm">View 中文 <ExternalLink size={13} /></Link>
        </div>
      </div>
      <p className="text-ink-muted mb-2 max-w-xl text-sm">
        Every section of the About page. English shows on the English site; 繁體中文 shows on the Chinese site (leave it blank and the English is used). Paragraphs support line breaks, <code className="font-mono text-xs">**bold**</code> and <code className="font-mono text-xs">*italic*</code>. Changes go live when you save.
      </p>
      <p className="text-ink-muted mb-4 max-w-xl text-sm">
        The banner photo collage and the team photo slideshow are managed in <Link href="/admin/content/photos" className="text-azzurro-deep hover:underline">Section &amp; banner photos</Link>.
      </p>
      {!loaded && <p className="text-sm text-ink-muted">Loading…</p>}

      {/* Banner */}
      <Section title="Banner" hint="The yellow banner at the top of the page.">
        <BiField label="Eyebrow" hint="small label above the title" value={c.header.eyebrow} onChange={(v) => setHeader("eyebrow", v)} />
        <BiField label="Title" value={c.header.title} onChange={(v) => setHeader("title", v)} />
        <BiField label="Subtitle" value={c.header.subtitle} onChange={(v) => setHeader("subtitle", v)} textarea />
      </Section>

      {/* Mural */}
      <Section title="Our mural" hint="Text beside the mural photo.">
        <BiField label="Eyebrow" value={c.mural.eyebrow} onChange={(v) => setMural({ eyebrow: v })} />
        <BiField label="Heading" value={c.mural.title} onChange={(v) => setMural({ title: v })} />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Paragraphs</p>
          <AddButton onClick={() => setMural({ paragraphs: [...c.mural.paragraphs, { ...biEmpty }] })}>Add paragraph</AddButton>
        </div>
        {c.mural.paragraphs.map((p, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1"><BiField label={`Paragraph ${i + 1}`} value={p} onChange={(v) => setMural({ paragraphs: c.mural.paragraphs.map((x, idx) => (idx === i ? v : x)) })} textarea rows={5} /></div>
            <div className="mt-6"><RowControls index={i} count={c.mural.paragraphs.length} what="paragraph" onMove={(a, b) => setMural({ paragraphs: move(c.mural.paragraphs, a, b) })} onRemove={() => setMural({ paragraphs: c.mural.paragraphs.filter((_, idx) => idx !== i) })} /></div>
          </div>
        ))}
        <div className="pt-4 border-t border-line">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Photo <span className="text-ink-muted font-normal">(clear it to hide the photo)</span></p>
            <MediaPicker accept="image" label={c.mural.image ? "Change photo" : "Choose photo"} onChange={(url, alt) => setMural({ image: url, ...(alt ? { imageAlt: { ...c.mural.imageAlt, en: alt } } : {}) })} />
          </div>
          <div className="mt-3 flex items-start gap-4">
            {c.mural.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.mural.image} alt="" className="w-40 aspect-4/3 object-cover rounded-xl border border-line bg-cream-2 shrink-0" />
            ) : (
              <div className="w-40 aspect-4/3 rounded-xl border border-dashed border-line bg-cream-2 shrink-0 text-xs text-ink-muted inline-flex items-center justify-center">No photo</div>
            )}
            <div className="flex-1"><TextField label="Image URL" value={c.mural.image} onChange={(v) => setMural({ image: v })} placeholder="/mural.png or https://…" mono /></div>
          </div>
          <div className="mt-3"><BiField label="Alt text" hint="describes the photo for screen readers" value={c.mural.imageAlt} onChange={(v) => setMural({ imageAlt: v })} /></div>
        </div>
      </Section>

      {/* 90 years */}
      <Section title="90 years — timeline" hint="The milestone cards. Add, remove and reorder them.">
        <BiField label="Eyebrow" value={c.history.eyebrow} onChange={(v) => setHistory({ eyebrow: v })} />
        <BiField label="Heading" value={c.history.title} onChange={(v) => setHistory({ title: v })} />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Milestones</p>
          <AddButton onClick={() => setHistory({ milestones: [...c.history.milestones, { id: newId(), year: "", title: { ...biEmpty }, body: { ...biEmpty } }] })}>Add milestone</AddButton>
        </div>
        {c.history.milestones.map((m, i) => (
          <div key={m.id} className="rounded-xl border border-line p-4 bg-cream/40 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-40"><TextField label="Year" value={m.year} onChange={(v) => setMilestone(i, { ...m, year: v })} placeholder="e.g. 2026" /></div>
              <div className="flex-1" />
              <div className="mt-5"><RowControls index={i} count={c.history.milestones.length} what="milestone" onMove={(a, b) => setHistory({ milestones: move(c.history.milestones, a, b) })} onRemove={() => setHistory({ milestones: c.history.milestones.filter((_, idx) => idx !== i) })} /></div>
            </div>
            <BiField label="Title" value={m.title} onChange={(v) => setMilestone(i, { ...m, title: v })} />
            <BiField label="Text" value={m.body} onChange={(v) => setMilestone(i, { ...m, body: v })} textarea />
          </div>
        ))}
      </Section>

      {/* Team */}
      <Section title="Our team" hint="Board, management and teachers. Monogram circles are generated from each name.">
        <BiField label="Eyebrow" value={c.team.eyebrow} onChange={(v) => setTeam({ eyebrow: v })} />
        <BiField label="Heading" value={c.team.title} onChange={(v) => setTeam({ title: v })} />
        <BiField label="Intro paragraph" hint="the Chinese page shows it only if the 繁中 is filled in" value={c.team.intro} onChange={(v) => setTeam({ intro: v })} textarea />
        <label className="flex items-start gap-2 cursor-pointer select-none rounded-xl bg-cream-2/60 p-3">
          <input type="checkbox" checked={c.team.showBoardAndTeachersOnZh} onChange={(e) => setTeam({ showBoardAndTeachersOnZh: e.target.checked })} className="mt-0.5 w-4 h-4 accent-azzurro-deep" />
          <span className="text-sm"><span className="font-medium">Show the board and teachers on the Chinese page too.</span> <span className="text-ink-muted">When off, the Chinese page shows only the management team (as it always has).</span></span>
        </label>
        <div className="space-y-6 pt-2">
          <GroupEditor title="1 · Board of Directors" group={c.team.board} onChange={(g) => setTeam({ board: g })} withEmail={false} />
          <GroupEditor title="2 · Management & Administration" group={c.team.staff} onChange={(g) => setTeam({ staff: g })} withEmail />
          <GroupEditor title="3 · Teachers" group={c.team.teachers} onChange={(g) => setTeam({ teachers: g })} withEmail={false} roleHint="e.g. Italian teacher" />
        </div>
      </Section>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-5 bg-cream/95 backdrop-blur border-t border-line py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => { if (confirm("Reset every About-page field to the original text? (Nothing is saved until you press Save.)")) setC(defaultAboutContent); }} className="btn btn-ghost text-sm"><RotateCcw size={14} /> Reset to defaults</button>
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved. It&apos;s live now.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
        </div>
        <button type="button" onClick={save} disabled={saving || !loaded} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </div>
  );
}
