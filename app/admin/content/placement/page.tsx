"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { questionBank, type Question, type CEFR, type Section } from "@/lib/placement-questions";
import { getPlacementQuestions, savePlacementQuestions } from "@/lib/placement-actions";

const LEVELS: CEFR[] = ["A1", "A2", "B1", "B2", "C1"];
const SECTIONS: Section[] = ["grammar", "vocabulary", "reading", "listening"];

export default function PlacementEditor() {
  const [list, setList] = useState<Question[]>(questionBank);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [bulk, setBulk] = useState("");
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);

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
  function moveQ(i: number, dir: -1 | 1) {
    setList((l) => {
      const j = i + dir;
      if (j < 0 || j >= l.length) return l;
      const copy = [...l];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }
  function addQ() {
    setList((l) => [...l, { id: `q-${Date.now()}`, level: "A1", section: "grammar", prompt: "", choices: ["", ""], correctIndex: 0 }]);
  }

  // Bulk import: blocks separated by a blank line. Line 1 = prompt (optional
  // leading [A2] level tag); following lines = choices, with "*" marking the
  // correct one. Parsed questions are appended for review, then Saved.
  function parseBulk(text: string): Question[] {
    const out: Question[] = [];
    text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).forEach((block, bi) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 3) return; // need a prompt + at least 2 choices
      let prompt = lines[0].replace(/^Q[:.)]\s*/i, "");
      let level: CEFR = "A1";
      const lvl = prompt.match(/^\[(A1|A2|B1|B2|C1)\]\s*/i);
      if (lvl) { level = lvl[1].toUpperCase() as CEFR; prompt = prompt.slice(lvl[0].length).trim(); }
      let correctIndex = 0;
      const choices = lines.slice(1).map((l, ci) => {
        if (/^\*/.test(l)) correctIndex = ci;
        return l.replace(/^[*\-•]\s*/, "").trim();
      }).filter(Boolean);
      if (choices.length < 2) return;
      out.push({ id: `q-${Date.now()}-${bi}`, level, section: "grammar", prompt, choices, correctIndex });
    });
    return out;
  }
  function importBulk() {
    const parsed = parseBulk(bulk);
    if (parsed.length === 0) { setBulkMsg("Couldn't read any questions — check the format above."); return; }
    setList((l) => [...l, ...parsed]);
    setBulk("");
    setBulkMsg(`Added ${parsed.length} question${parsed.length === 1 ? "" : "s"} below. Review them, then press “Save questions”.`);
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

  return (
    <div className="max-w-4xl">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to content</Link>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="eyebrow">Admin · Content · Placement test</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Placement test questions.</h1>
          <p className="mt-2 text-ink-muted">Add, edit, remove and reorder the placement-test questions. The test runs <b>top-to-bottom, easiest first</b> — the student stops when it gets too hard and submits. The full set is <b>46 questions</b>; the score (number correct) maps to a sub-level (A1.1 … C1–C2). Use the ▲▼ arrows to set the order.</p>
        </div>
      </div>
      <div className="frame bg-cream-2 p-4 mb-6 text-sm flex flex-wrap gap-x-5 gap-y-1">
        <span className="font-medium">{list.length} of 46 questions{list.length < 46 ? " — add the rest below" : " ✓"}</span>
        <span className="text-ink-muted">(Level tags below are used only to suggest a matching course.)</span>
      </div>

      <details className="frame bg-white p-5 mb-6">
        <summary className="cursor-pointer font-medium text-sm inline-flex items-center gap-2"><Plus size={14} /> Bulk import — paste many questions at once</summary>
        <p className="mt-3 text-sm text-ink-muted">Paste your questions below, with <b>one blank line between each</b>. Put a <code className="font-mono text-xs bg-cream-2 px-1 rounded">*</code> in front of the correct answer. You can start a question with a level tag like <code className="font-mono text-xs bg-cream-2 px-1 rounded">[B1]</code> (optional — it just helps suggest a matching course).</p>
        <pre className="mt-2 text-xs bg-cream-2 rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre">{`[A1] Your first question goes here?
* the correct answer
- a wrong answer
- another wrong answer

[A2] Your second question?
- wrong
* correct
- wrong`}</pre>
        <textarea value={bulk} onChange={(e) => { setBulk(e.target.value); setBulkMsg(null); }} rows={8} placeholder="Paste your questions here…" className="mt-3 w-full p-3 rounded-lg border border-line bg-white text-sm font-mono" />
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <button type="button" onClick={importBulk} disabled={!bulk.trim()} className="btn btn-ghost disabled:opacity-40"><Plus size={14} /> Add questions</button>
          {bulkMsg && <span className="text-sm text-azzurro-deep">{bulkMsg}</span>}
        </div>
      </details>

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
              <div className="ml-auto flex items-center gap-1">
                <button type="button" onClick={() => moveQ(i, -1)} disabled={i === 0} aria-label="Move up" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ChevronUp size={15} /></button>
                <button type="button" onClick={() => moveQ(i, 1)} disabled={i === list.length - 1} aria-label="Move down" className="w-8 h-8 rounded-lg hover:bg-cream-2 disabled:opacity-30 inline-flex items-center justify-center text-ink-muted"><ChevronDown size={15} /></button>
                <button type="button" onClick={() => removeQ(i)} aria-label="Remove question" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
              </div>
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
