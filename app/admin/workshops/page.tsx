"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ImageIcon, X, Check, Home, ExternalLink } from "lucide-react";
import Drawer from "@/components/admin/Drawer";
import LangToggle, { type Lang } from "@/components/admin/LangToggle";
import { WORKSHOP_ZH_FIELDS, type WorkshopZh } from "@/lib/content-i18n";
import MediaPicker from "@/components/MediaPicker";
import ImageSizeHint from "@/components/admin/ImageSizeHint";
import {
  getWorkshops, addWorkshop, updateWorkshop, removeWorkshop, setWorkshopOrder,
  loadWorkshopSettings, storeWorkshopSettings,
} from "@/lib/use-workshops";
import { workshopIcon, WORKSHOP_ICONS } from "@/lib/workshop-icons";
import { isWorkshopPhoto, type Workshop } from "@/lib/data";
import { DEFAULT_WORKSHOP_SETTINGS } from "@/lib/workshop-settings";

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to change workshops. Please sign in first." : m;
}

const DEFAULT_ICON = WORKSHOP_ICONS[0].key;
const input = "mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal";

type Draft = {
  title: string; description: string; status: Workshop["status"];
  dateLabel: string; timeLabel: string; fee: string; interested: string;
  image: string; published: boolean; zh: WorkshopZh;
};
const EMPTY: Draft = { title: "", description: "", status: "planned", dateLabel: "", timeLabel: "", fee: "", interested: "0", image: DEFAULT_ICON, published: true, zh: {} };

export default function AdminWorkshops() {
  const [list, setList] = useState<Workshop[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [homeLimit, setHomeLimit] = useState(DEFAULT_WORKSHOP_SETTINGS.homeLimit);
  const [limitSaved, setLimitSaved] = useState(false);

  const refresh = () => getWorkshops().then(setList).catch((e) => setErr(errText(e)));
  useEffect(() => {
    refresh();
    loadWorkshopSettings().then((s) => setHomeLimit(s.homeLimit)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const [lang, setLang] = useState<Lang>("en");
  // One field, two languages: in 中文 mode the input edits the translation and
  // shows the English as a greyed-out guide.
  const tx = (k: keyof WorkshopZh) =>
    lang === "en"
      ? { value: draft[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value), lang: "en" }
      : { value: draft.zh[k] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft((d) => ({ ...d, zh: { ...d.zh, [k]: e.target.value } })), placeholder: draft[k] || "(no English text yet)", lang: "zh-Hant" };
  const missingZh = WORKSHOP_ZH_FIELDS.filter((k) => draft[k]?.trim() && !draft.zh[k]?.trim()).length;

  function startCreate() { setEditing(null); setDraft(EMPTY); setLang("en"); setErr(null); setShowForm(true); }
  function startEdit(w: Workshop) {
    setEditing(w);
    setDraft({
      title: w.title, description: w.description, status: w.status,
      dateLabel: w.dateLabel ?? "", timeLabel: w.timeLabel ?? "", fee: w.fee ?? "",
      interested: String(w.interested ?? 0), image: w.image || DEFAULT_ICON, published: w.published ?? true,
      zh: w.zh ?? {},
    });
    setLang("en");
    setErr(null);
    setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditing(null); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const payload: Omit<Workshop, "id"> = {
      title: draft.title.trim(),
      description: draft.description,
      status: draft.status,
      image: draft.image,
      dateLabel: draft.status === "planned" ? draft.dateLabel : "",
      timeLabel: draft.timeLabel,
      fee: draft.fee,
      interested: draft.status === "interest" ? Math.max(0, Number(draft.interested) || 0) : undefined,
      published: draft.published,
      zh: draft.zh,
    };
    try {
      if (editing) await updateWorkshop(editing.id, payload);
      else await addWorkshop(payload);
      closeForm();
      await refresh();
    } catch (e) { setErr(errText(e)); }
    finally { setSaving(false); }
  }

  async function togglePublished(w: Workshop) {
    setErr(null);
    try { await updateWorkshop(w.id, { published: !(w.published ?? true) }); await refresh(); } catch (e) { setErr(errText(e)); }
  }
  async function del(w: Workshop) {
    if (!confirm(`Delete “${w.title}”? This can't be undone. (To hide it for now, use the eye icon instead.)`)) return;
    setErr(null);
    try { await removeWorkshop(w.id); await refresh(); } catch (e) { setErr(errText(e)); }
  }
  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = list.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);                       // optimistic
    try { await setWorkshopOrder(next.map((w) => w.id)); } catch (e) { setErr(errText(e)); refresh(); }
  }
  async function saveLimit() {
    setErr(null);
    try {
      await storeWorkshopSettings({ homeLimit });
      setLimitSaved(true);
      setTimeout(() => setLimitSaved(false), 2500);
    } catch (e) { setErr(errText(e)); }
  }

  // Which published workshops currently make the homepage cut.
  const onHome = new Set(list.filter((w) => w.published ?? true).slice(0, homeLimit).map((w) => w.id));
  const isPhoto = isWorkshopPhoto(draft.image);

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div className="min-w-0 flex-1 basis-80">
          <p className="eyebrow">Admin · Workshops</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Workshops.</h1>
          <p className="mt-2 text-ink-muted">Shown on the homepage and the <Link href="/culture#workshops" target="_blank" rel="noopener" className="underline">Culture page</Link>. Use the arrows to set the order. The homepage shows the first published ones.</p>
        </div>
        <button type="button" onClick={startCreate} className="btn btn-primary"><Plus size={16} /> New workshop</button>
      </div>

      {err && !showForm && <div className="frame p-4 bg-rosso/10 text-rosso text-sm mb-6">{err}</div>}

      {/* Homepage cap */}
      <div className="frame p-4 sm:p-5 bg-white mb-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Home size={18} className="text-azzurro-deep shrink-0" aria-hidden />
        <label htmlFor="home-limit" className="text-sm font-medium">Workshops shown on the homepage</label>
        <input
          id="home-limit" type="number" min={1} max={12} value={homeLimit}
          onChange={(e) => setHomeLimit(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
          className="w-20 h-10 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:border-ink"
        />
        <button type="button" onClick={saveLimit} className="btn btn-ghost text-sm! py-2!">Save</button>
        <span className={`text-sm text-azzurro-deep inline-flex items-center gap-1 transition-opacity ${limitSaved ? "opacity-100" : "opacity-0"}`}><Check size={14} /> Saved</span>
        <p className="basis-full text-xs text-ink-muted">The Culture page always shows every published workshop.</p>
      </div>

      <div className="space-y-3">
        {list.length === 0 && <div className="frame p-10 bg-white text-center text-ink-muted">No workshops yet. Add the first one.</div>}
        {list.map((w, i) => {
          const Icon = workshopIcon(w.image);
          const published = w.published ?? true;
          return (
            <div key={w.id} className={`frame p-4 sm:p-5 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] items-center gap-x-4 gap-y-3 ${published ? "bg-white" : "bg-cream-2/60 opacity-75"}`}>
              {/* Order */}
              <div className="hidden sm:flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
              </div>
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-cream-2 flex items-center justify-center text-azzurro-deep shrink-0">
                {isWorkshopPhoto(w.image)
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={w.image} alt="" className="w-full h-full object-cover" />
                  : <Icon size={28} strokeWidth={1.5} />}
              </div>
              <div className="col-span-3 row-start-2 sm:col-span-1 sm:row-start-1 sm:col-start-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${w.status === "planned" ? "bg-azzurro-soft text-azzurro-deep" : "bg-sole text-ink"}`}>
                    {w.status === "planned" ? "Planned" : `${w.interested ?? 0} interested`}
                  </span>
                  {onHome.has(w.id) && <span className="px-2 py-0.5 rounded-full bg-ink text-white font-medium uppercase tracking-wider inline-flex items-center gap-1"><Home size={10} /> Homepage</span>}
                  {!published && <span className="px-2 py-0.5 rounded-full bg-ink/10 text-ink-muted font-medium uppercase tracking-wider">Hidden</span>}
                </div>
                <h3 className="mt-1 font-semibold leading-tight wrap-break-word">{w.title}</h3>
                <p className="mt-0.5 text-xs text-ink-muted">{[w.dateLabel, w.timeLabel, w.fee].filter(Boolean).join(" · ") || "No date / time / fee yet"}</p>
              </div>
              <div className="col-start-3 row-start-1 sm:col-start-4 flex items-center gap-0.5 justify-self-end">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="sm:hidden w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down" className="sm:hidden w-9 h-9 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => startEdit(w)} title="Edit" aria-label="Edit" className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><Pencil size={14} /></button>
                <button type="button" onClick={() => togglePublished(w)} title={published ? "Hide from the site" : "Show on the site"} aria-label={published ? "Hide" : "Show"} className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted">
                  {published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button type="button" onClick={() => del(w)} title="Delete" aria-label="Delete" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ink-muted inline-flex items-center gap-1">
        <ExternalLink size={12} /> Changes appear on the site straight away.
      </p>

      {showForm && (
        <Drawer
          title={editing ? "Edit workshop" : "New workshop"}
          onClose={closeForm}
          formProps={{ onSubmit: submit }}
          footer={<>
            <button type="button" onClick={closeForm} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : editing ? "Save changes" : "Add workshop"}</button>
          </>}
        >
          <div className="space-y-4">
            {err && <div className="rounded-xl p-3 bg-rosso/10 text-rosso text-sm">{err}</div>}
            <LangToggle lang={lang} onChange={setLang} missing={missingZh} />
            <label className="block text-sm font-medium">Title
              <input required={lang === "en"} placeholder="e.g. Italian Cooking Night" {...tx("title")} className={input} />
            </label>
            <label className="block text-sm font-medium">Description
              <textarea rows={4} placeholder="What guests can expect. Shown in full in the pop-up." {...tx("description")} className="mt-1 w-full p-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
            </label>

            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {(["planned", "interest"] as Workshop["status"][]).map((s) => (
                  <button key={s} type="button" onClick={() => set("status", s)} className={`px-4 py-2 rounded-full border text-sm ${draft.status === s ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{s === "planned" ? "Planned (has a date)" : "Gauging interest"}</button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {draft.status === "planned" ? (
                <label className="block text-sm font-medium">Date
                  <input placeholder="e.g. Sat 12 Jul" {...tx("dateLabel")} className={input} />
                </label>
              ) : (
                <label className="block text-sm font-medium">People interested
                  <input type="number" min={0} value={draft.interested} onChange={(e) => set("interested", e.target.value)} className={input} />
                </label>
              )}
              <label className="block text-sm font-medium">Time
                <input placeholder="e.g. 7–9pm" {...tx("timeLabel")} className={input} />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">Fee
                <input placeholder="e.g. HK$450 · members HK$380" {...tx("fee")} className={input} />
              </label>
            </div>

            {/* Image: uploaded photo (preferred) or a fallback icon */}
            <div className="pt-3 border-t border-line">
              <p className="text-sm font-medium">Image</p>
              <p className="text-xs text-ink-muted mt-0.5">Upload a photo for the card and pop-up. If there&apos;s no photo, the icon below is used instead.</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="w-28 h-20 rounded-xl overflow-hidden bg-cream-2 border border-dashed border-ink/20 flex items-center justify-center text-azzurro-deep shrink-0">
                  {isPhoto
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={draft.image} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={22} className="text-ink-soft" aria-hidden />}
                </div>
                <MediaPicker accept="image" label={isPhoto ? "Change photo" : "Upload / choose photo"} onChange={(url) => set("image", url)} />
                {isPhoto && <button type="button" onClick={() => set("image", DEFAULT_ICON)} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><X size={12} /> Remove photo</button>}
              </div>
              {isPhoto && <ImageSizeHint className="mt-2" src={draft.image} minWidth={800} minHeight={500} guideline="Landscape photo, at least 1200 × 900 px." />}
              {!isPhoto && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-ink-muted mb-2">Fallback icon</p>
                  <div className="flex flex-wrap gap-2">
                    {WORKSHOP_ICONS.map(({ key, Icon, label }) => (
                      <button key={key} type="button" title={label} aria-label={label} onClick={() => set("image", key)} className={`w-10 h-10 rounded-xl border flex items-center justify-center ${draft.image === key ? "border-ink bg-azzurro-soft text-azzurro-deep" : "border-line text-ink-muted hover:border-ink-muted"}`}>
                        <Icon size={18} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer pt-3 border-t border-line">
              <input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} className="accent-azzurro-deep" />
              Show on the site
            </label>
          </div>
        </Drawer>
      )}
    </div>
  );
}
