"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, RotateCcw } from "lucide-react";
import { getCourseDefaults, saveCourseDefaults } from "@/lib/course-defaults-actions";
import {
  COURSE_TYPE_LABELS, DESCRIPTION_KEYS, DEFAULT_COURSE_DEFAULTS, builtInDescription,
  type CourseDefaults, type DescriptionKey,
} from "@/lib/course-defaults-shared";
import type { CourseType } from "@/lib/data";

// Admin → Courses → Course defaults. One place for the values the course forms
// pre-fill: default fee per course type, the teacher list, and the
// "Auto-fill from level" description text.
export default function CourseDefaultsPage() {
  const [d, setD] = useState<CourseDefaults>(DEFAULT_COURSE_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getCourseDefaults().then((x) => { setD(x); setLoaded(true); }).catch((e) => { setErr(String(e?.message ?? e)); setLoaded(true); });
  }, []);

  function setFee(type: CourseType, v: string) {
    setD((p) => {
      const feeByType = { ...p.feeByType };
      const n = Number(v);
      if (v === "" || !Number.isFinite(n) || n <= 0) delete feeByType[type]; else feeByType[type] = Math.trunc(n);
      return { ...p, feeByType };
    });
  }
  function setDesc(k: DescriptionKey, v: string) {
    setD((p) => ({ ...p, descriptions: { ...p.descriptions, [k]: v } }));
  }
  function resetDesc(k: DescriptionKey) {
    setD((p) => { const descriptions = { ...p.descriptions }; delete descriptions[k]; return { ...p, descriptions }; });
  }
  function addTeacher() {
    const n = newTeacher.trim();
    if (!n) return;
    setD((p) => (p.teachers.some((t) => t.toLowerCase() === n.toLowerCase()) ? p : { ...p, teachers: [...p.teachers, n] }));
    setNewTeacher("");
  }

  async function save() {
    setErr(null); setSaving(true);
    try {
      const res = await saveCourseDefaults(d);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const field = "w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink";

  return (
    <div className="max-w-4xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to courses</Link>
      <p className="eyebrow">Admin · Courses · Defaults</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Course defaults.</h1>
      <p className="mt-2 text-ink-muted">What the course forms pre-fill. Changing these never alters existing courses — each course keeps its own fee, teacher and description, editable on its edit page.</p>

      {err && <div className="mt-6 frame p-4 bg-rosso/10 text-rosso text-sm">{err}</div>}
      {!loaded ? <p className="mt-8 text-ink-muted">Loading…</p> : (
        <>
          {/* Fees */}
          <section className="mt-8 frame bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Default fee by course type</h2>
            <p className="mt-1 text-sm text-ink-muted">Pre-fills the price when you create a new course of that type. Leave blank to type the price each time.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {COURSE_TYPE_LABELS.map(({ type, label }) => (
                <label key={type} className="text-sm font-medium">{label}
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">HK$</span>
                    <input type="number" min={0} value={d.feeByType[type] ?? ""} onChange={(e) => setFee(type, e.target.value)} placeholder="No default" className={`${field} pl-12`} />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Teachers */}
          <section className="mt-6 frame bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Teachers</h2>
            <p className="mt-1 text-sm text-ink-muted">Shown in the teacher picker on every course form. Teachers with a staff login (Staff &amp; leave) and anyone already on a course are included automatically.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {d.teachers.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper pl-3.5 pr-1.5 py-1 text-sm">
                  {t}
                  <button type="button" onClick={() => setD((p) => ({ ...p, teachers: p.teachers.filter((x) => x !== t) }))} aria-label={`Remove ${t}`} className="w-6 h-6 rounded-full hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={12} /></button>
                </li>
              ))}
              {d.teachers.length === 0 && <li className="text-sm text-ink-muted">No teachers listed yet.</li>}
            </ul>
            <div className="mt-4 flex gap-2 max-w-md">
              <input value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTeacher(); } }} placeholder="Teacher's full name" className={field} />
              <button type="button" onClick={addTeacher} className="btn btn-ghost shrink-0"><Plus size={15} /> Add</button>
            </div>
          </section>

          {/* Descriptions */}
          <section className="mt-6 frame bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Auto-fill descriptions</h2>
            <p className="mt-1 text-sm text-ink-muted">The text inserted by <b>Auto-fill from level</b> on the course forms — one per CEFR level band (e.g. A1 covers A1.1–A1.3), plus one for Latin. Leave a box as it is to keep the built-in text.</p>
            <div className="mt-5 space-y-5">
              {DESCRIPTION_KEYS.map((k) => {
                const custom = d.descriptions[k];
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{k === "Latin" ? "Latin courses" : `Level ${k}`}{!custom && <span className="ml-2 text-xs font-normal text-ink-muted">(built-in text)</span>}</span>
                      {custom && <button type="button" onClick={() => resetDesc(k)} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><RotateCcw size={11} /> Reset to built-in</button>}
                    </div>
                    <textarea rows={5} value={custom ?? builtInDescription(k)} onChange={(e) => setDesc(k, e.target.value)} className="w-full p-3 rounded-xl border border-line bg-white text-sm focus:outline-none focus:border-ink" />
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-8 flex items-center justify-end gap-3 sticky bottom-4">
            <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved.</span>
            <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50 shadow-[var(--shadow-pop)]">{saving ? "Saving…" : "Save defaults"}</button>
          </div>
        </>
      )}
    </div>
  );
}
