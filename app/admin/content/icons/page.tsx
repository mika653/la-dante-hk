"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ExternalLink, RotateCcw } from "lucide-react";
import { IconPickerButton } from "@/components/admin/IconPicker";
import { COURSE_ART, type CourseArtKey } from "@/components/course-circle-art";
import { getIconChoices, saveIconChoices } from "@/lib/icon-choices-actions";
import { ICON_SLOT_GROUPS, defaultIconChoices, type IconChoices } from "@/lib/icon-choices-shared";
import { libraryIcon } from "@/lib/icon-library";
import { resetIconChoicesCache } from "@/lib/use-icon-choices";

export default function IconsEditor() {
  const [choices, setChoices] = useState<IconChoices>(defaultIconChoices);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getIconChoices().then((c) => { setChoices(c); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  const set = (slot: string, key: string) => setChoices((c) => ({ ...c, [slot]: key }));
  const changed = Object.keys(defaultIconChoices).some((k) => choices[k] !== defaultIconChoices[k]);

  async function save() {
    setErr(null); setSaving(true); setSaved(false);
    try {
      const res = await saveIconChoices(choices);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "Sign in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      resetIconChoicesCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setErr("Couldn't save. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-4xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="mb-6">
        <p className="eyebrow">Admin · Content · Icons</p>
        <h1 className="mt-2 text-3xl md:text-4xl">Icon library.</h1>
        <p className="mt-2 text-ink-muted max-w-2xl">Pick the icons used for the course circles and the feature points across the site. Click an icon to choose from the library; changes go live when you save.</p>
      </div>

      <div className="space-y-6">
        {ICON_SLOT_GROUPS.map((g) => (
          <section key={g.id} className="frame bg-white p-6 md:p-7" aria-labelledby={`icons-${g.id}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 id={`icons-${g.id}`} className="text-xl font-semibold">{g.title}</h2>
                <p className="mt-1 text-sm text-ink-muted max-w-xl">{g.blurb}</p>
              </div>
              <Link href={g.where} target="_blank" rel="noopener" className="btn btn-ghost text-sm">View <ExternalLink size={13} /></Link>
            </div>
            <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {g.slots.map((s) => {
                const artKey = s.id.split(".")[1] as CourseArtKey;
                const custom = g.customDefault
                  ? { label: "Original drawing", preview: <span className="w-6 h-6 inline-flex">{COURSE_ART[artKey]}</span> }
                  : undefined;
                const isDefault = choices[s.id] === s.default;
                const defaultLabel = s.default ? (libraryIcon(s.default)?.label ?? s.default) : "Original drawing";
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 border-b border-line/70 pb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.label}</p>
                      <p className="text-[11px] text-ink-muted">
                        {isDefault ? "Default" : <>Default: {defaultLabel} · <button type="button" onClick={() => set(s.id, s.default)} className="underline hover:text-azzurro-deep">reset</button></>}
                      </p>
                    </div>
                    <IconPickerButton
                      title={s.label}
                      label={`Icon for ${s.label}`}
                      value={choices[s.id] ?? s.default}
                      defaultKey={s.default || undefined}
                      custom={custom}
                      onChange={(k) => set(s.id, k)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 -mx-2 px-2 py-4 bg-cream/90 backdrop-blur flex items-center gap-3 flex-wrap">
        <button type="button" onClick={save} disabled={!loaded || saving} className="btn btn-primary disabled:opacity-50">
          {saving ? "Saving…" : saved ? <><Check size={15} /> Saved</> : "Save icons"}
        </button>
        <button type="button" onClick={() => setChoices(defaultIconChoices)} disabled={!changed} className="btn btn-ghost text-sm disabled:opacity-40">
          <RotateCcw size={14} /> Reset all to defaults
        </button>
        {err && <p className="text-sm text-rosso" role="alert">{err}</p>}
      </div>
    </div>
  );
}
