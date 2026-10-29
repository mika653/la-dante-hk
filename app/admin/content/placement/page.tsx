"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { questionBank, TF_CHOICES, type Question, type CEFR, type Section, type QType } from "@/lib/placement-questions";
import { getPlacementQuestions, savePlacementQuestions } from "@/lib/placement-actions";

const LEVELS: CEFR[] = ["A1", "A2", "B1", "B2", "C1"];
const SECTIONS: Section[] = ["grammar", "vocabulary", "reading", "listening"];
const TYPES: { v: QType; label: string }[] = [
  { v: "choice", label: "Multiple choice" },
  { v: "fill", label: "Fill in the blank" },
  { v: "truefalse", label: "True / False" },
];

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
    setList((l) => [...l, { id: `q-${Date.now()}`, level: "A1", section: "grammar", type: "choice", prompt: "", choices: ["", ""], correctIndex: 0 }]);
  }
  // Switch answer format, keeping the fields each type needs valid.
  function setType(i: number, type: QType) {
    setList((l) => l.map((q, n) => {
      if (n !== i) return q;
      if (type === "fill") return { ...q, type, choices: [], correctIndex: 0, answer: q.answer ?? "" };
      if (type === "truefalse") return { ...q, type, choices: [...TF_CHOICES], correctIndex: q.correctIndex === 1 ? 1 : 0 };
      return { ...q, type, choices: q.choices.length >= 2 ? q.choices : ["", ""] };
    }));
  }

  // Bulk import: blocks separated by a blank line. Line 1 = prompt (optional
  // leading [A2] level tag); following lines = choices, with "*" marking the
  // correct one. Parsed questions are appended for review, then Saved.
  function parseBulk(text: string): Question[] {
    const out: Question[] = [];
    text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).forEach((block, bi) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return; // need a prompt + at least one answer line
      let prompt = lines[0].replace(/^Q[:.)]\s*/i, "");
      let level: CEFR = "A1";
      const lvl = prompt.match(/^\[(A1|A2|B1|B2|C1)\]\s*/i);
      if (lvl) { level = lvl[1].toUpperCase() as CEFR; prompt = prompt.slice(lvl[0].length).trim(); }
      const rest = lines.slice(1);
      // Fill-in-the-blank: an answer line starting with "=" (e.g. "= sono | son'").
      const fillLine = rest.find((l) => /^=/.test(l));
      if (fillLine) {
        out.push({ id: `q-${Date.now()}-${bi}`, level, section: "grammar", type: "fill", prompt, choices: [], correctIndex: 0, answer: fillLine.replace(/^=\s*/, "").trim() });
        return;
      }
      // Multiple choice: "*" marks the correct option.
      let correctIndex = 0;
      const choices = rest.map((l, ci) => {
        if (/^\*/.test(l)) correctIndex = ci;
        return l.replace(/^[*\-•]\s*/, "").trim();
      }).filter(Boolean);
      if (choices.length < 2) return;
      out.push({ id: `q-${Date.now()}-${bi}`, level, section: "grammar", type: "choice", prompt, choices, correctIndex });
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
      <div className="frame bg-sole p-4 mb-6 text-sm flex flex-wrap gap-x-5 gap-y-1">
        <span className="font-medium">{list.length} of 46 questions{list.length < 46 ? " — add the rest below" : " ✓"}</span>
        <span className="text-ink-muted">(Level tags below are used only to suggest a matching course.)</span>
      </div>

      <details className="frame bg-white p-5 mb-6">
        <summary className="cursor-pointer font-medium text-sm inline-flex items-center gap-2"><Plus size={14} /> Bulk import — paste many questions at once</summary>
        <p className="mt-3 text-sm text-ink-muted">Paste your questions below, with <b>one blank line between each</b>. For <b>multiple-choice</b>, put a <code className="font-mono text-xs bg-cream-2 px-1 rounded">*</code> in front of the correct answer. For <b>fill-in-the-blank</b>, put the answer on a line starting with <code className="font-mono text-xs bg-cream-2 px-1 rounded">=</code> (list alternatives with <code className="font-mono text-xs bg-cream-2 px-1 rounded">|</code>). You can start a question with a level tag like <code className="font-mono text-xs bg-cream-2 px-1 rounded">[B1]</code> (optional).</p>
        <pre className="mt-2 text-xs bg-cream-2 rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre">{`[A1] Multiple choice — which answer is correct?
* the correct answer
- a wrong answer
- another wrong answer

[A2] Fill in the blank: Ieri ___ al cinema.
= sono andato | sono andata`}</pre>
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
              <label className="text-xs text-ink-muted">Type
                <select value={q.type ?? "choice"} onChange={(e) => setType(i, e.target.value as QType)} className={`ml-1 ${sel}`}>
                  {TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
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
            {(q.type ?? "choice") === "fill" ? (
              <div className="mt-3">
                <p className="text-xs text-ink-muted">Accepted answer(s) <span className="italic">(separate alternatives with | )</span></p>
                <input value={q.answer ?? ""} onChange={(e) => patch(i, { answer: e.target.value })} placeholder="e.g.  sono | son'" className="mt-1.5 w-full h-9 px-3 rounded-lg border border-line bg-white text-sm" />
                <p className="mt-1 text-[11px] text-ink-soft">The student types their answer; it&apos;s matched ignoring case and extra spaces.</p>
              </div>
            ) : (q.type ?? "choice") === "truefalse" ? (
              <div className="mt-3">
                <p className="text-xs text-ink-muted">Correct answer</p>
                <div className="mt-1.5 flex gap-5">
                  {TF_CHOICES.map((c, ci) => (
                    <label key={ci} className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === ci} onChange={() => patch(i, { correctIndex: ci })} className="accent-azzurro-deep w-4 h-4" /> {c}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
