"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, GripVertical } from "lucide-react";
import { questionBank, type Question, type CEFR, type Section } from "@/lib/placement-questions";
import { getPlacementQuestions, savePlacementQuestions } from "@/lib/placement-actions";

const LEVELS: CEFR[] = ["A1", "A2", "B1", "B2", "C1"];
const SECTIONS: Section[] = ["grammar", "vocabulary", "reading", "listening"];

export default function PlacementEditor() {
  const [list, setList] = useState<Question[]>(questionBank);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { getPlacementQuestions().then(setList).catch(() => {}); }, []);

  function patch(i: number, p: Partial<Question>) { setList((l) => l.map((q, n) => (n === i ? { ...q, ...p } : q))); }
  function setChoice(i: number, ci: number, val: string) { setList((l) => l.map((q, n) => (n === i ? { ...q, choices: q.choices.map((c, k) => (k === ci ? val : c)) } : q))); }
  function addChoice(i: number) { setList((l) => l.map((q, n) => (n === i ? { ...q, choices: [...q.choices, ""] } : q))); }
  function removeChoice(i: number, ci: number) {
    setList((l) => l.map((q, n) => {
      if (n !== i || q.choices.length <= 2) return q;
      const choices = q.choices.filter((_, k) => k !== ci);
      const correctIndex = q.correctIndex >= choices.length ? choices.length - 1 : q.correctIndex;
      return { ...q, choices, correctIndex };
    }));
  }
  function removeQ(i: number) { setList((l) => l.filter((_, n) => n !== i)); }
  function addQ() {
    setList((l) => [...l, { id: `q-${Date.now()}`, level: "A1", section: "grammar", prompt: "", choices: ["", ""], correctIndex: 0 }]);
  }

  async function save() {
    setErr(null); setSaving(true);
    try {
      const res = await savePlacementQuestions(list);
      if (!res.ok) { setErr(res.error === "Not authorised" ? "You need to be signed in as an owner or manager to save." : (res.error ?? "Couldn't save.")); return; }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const sel = "h-9 px-2 rounded-lg border border-line bg-white text-sm";
  const byLevel = LEVELS.map((lv) => ({ lv, n: list.filter((q) => q.level === lv).length }));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="eyebrow">Admin · Content · Placement test</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Placement test questions.</h1>
          <p className="mt-2 text-ink-muted">Add, edit and remove the questions the free placement test draws from. The test picks adaptively per level, so aim for several questions at each level.</p>
        </div>
      </div>
      <div className="frame bg-cream-2 p-4 mb-6 text-sm flex flex-wrap gap-x-5 gap-y-1">
        <span className="font-medium">{list.length} questions</span>
        {byLevel.map(({ lv, n }) => <span key={lv} className={n < 2 ? "text-rosso" : "text-ink-muted"}>{lv}: {n}{n < 2 ? " ⚠" : ""}</span>)}
      </div>

      <div className="space-y-4">
        {list.map((q, i) => (
          <div key={q.id} className="frame p-5 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <GripVertical size={16} className="text-ink-soft" aria-hidden />
              <span className="text-xs text-ink-muted">#{i + 1}</span>
              <label className="text-xs text-ink-muted">Level
                <select value={q.level} onChange={(e) => patch(i, { level: e.target.value as CEFR })} className={`ml-1 ${sel}`}>
                  {LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                </select>
              </label>
              <label className="text-xs text-ink-muted">Section
                <select value={q.section} onChange={(e) => patch(i, { section: e.target.value as Section })} className={`ml-1 ${sel}`}>
                  {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => removeQ(i)} aria-label="Remove question" className="ml-auto w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </div>
            <textarea value={q.prompt} onChange={(e) => patch(i, { prompt: e.target.value })} rows={2} placeholder="Question prompt" className="w-full p-3 rounded-lg border border-line bg-white text-sm" />
            <input value={q.sub ?? ""} onChange={(e) => patch(i, { sub: e.target.value })} placeholder="Sub-text / hint (optional)" className="mt-2 w-full h-9 px-3 rounded-lg border border-line bg-white text-sm" />
            <p className="mt-3 text-xs text-ink-muted">Choices <span className="italic">(select the correct one)</span></p>
            <div className="mt-1.5 space-y-2">
              {q.choices.map((c, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === ci} onChange={() => patch(i, { correctIndex: ci })} className="accent-azzurro-deep w-4 h-4" aria-label={`Mark choice ${ci + 1} correct`} />
                  <input value={c} onChange={(e) => setChoice(i, ci, e.target.value)} placeholder={`Choice ${ci + 1}`} className="flex-1 h-9 px-3 rounded-lg border border-line bg-white text-sm" />
                  <button type="button" onClick={() => removeChoice(i, ci)} disabled={q.choices.length <= 2} aria-label="Remove choice" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addChoice(i)} className="mt-2 text-xs text-azzurro-deep hover:underline inline-flex items-center gap-1"><Plus size={12} /> Add choice</button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={addQ} className="btn btn-ghost"><Plus size={16} /> Add question</button>
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} className="inline -mt-1 mr-1" /> Saved. It&apos;s live on the test.</span>
          {err && <span className="text-sm text-rosso">{err}</span>}
          <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save questions"}</button>
        </div>
      </div>
    </div>
  );
}
