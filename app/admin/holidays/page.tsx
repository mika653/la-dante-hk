"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Check, RotateCcw, CalendarDays } from "lucide-react";
import { getHolidays, setHolidays, HK_HOLIDAYS_SEED, type Holiday } from "@/lib/holidays";

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${WD[new Date(y, m - 1, d).getDay()]} ${d} ${MO[m - 1]} ${y}`;
}

export default function HolidaysPage() {
  const [list, setList] = useState<Holiday[]>([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setList(getHolidays()); }, []);

  function persist(next: Holiday[], msg: string) {
    setList(next);
    setHolidays(next);
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }
  function add() {
    if (!date || !name.trim()) return;
    const next = [...list.filter((h) => h.date !== date), { date, name: name.trim() }];
    persist(next, `Added ${name.trim()}.`);
    setDate(""); setName("");
  }
  function remove(d: string) {
    persist(list.filter((h) => h.date !== d), "Removed.");
  }
  function resetSeed() {
    if (!confirm("Reset to the built-in Hong Kong holidays? Your custom edits will be replaced.")) return;
    persist(HK_HOLIDAYS_SEED, "Reset to the built-in Hong Kong holidays.");
  }

  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to settings</Link>

      <p className="eyebrow">Admin · Public holidays</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Public holidays.</h1>
      <p className="mt-2 text-ink-muted">These are the days the <b>course scheduler skips</b> when generating lesson dates and continuations. Add your school closures here too.</p>

      <div className="mt-4 frame p-4 bg-sole-soft/60 border border-[#b59a00]/30 text-sm">
        <b>Please verify the dates.</b> Lunar-calendar holidays (Lunar New Year, Buddha&apos;s Birthday, Tuen Ng, Mid-Autumn, Chung Yeung) move each year — confirm them against the official HK gazette so your course dates stay correct.
      </div>

      {toast && (
        <div className="mt-4 frame p-3 bg-sole flex items-center gap-2 text-sm"><Check size={16} /> {toast}</div>
      )}

      {/* Add */}
      <div className="mt-6 frame p-5 md:p-6 bg-white">
        <p className="text-sm font-medium mb-3">Add a holiday or closure</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium">Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <label className="text-sm font-medium flex-1 min-w-[200px]">Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lunar New Year, or School closure" className="mt-1 block w-full h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <button type="button" onClick={add} disabled={!date || !name.trim()} className="btn btn-primary h-11 disabled:opacity-40"><Plus size={16} /> Add</button>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 frame bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-cream-2 border-b border-line">
          <span className="text-xs uppercase tracking-wider text-ink-muted font-medium inline-flex items-center gap-2"><CalendarDays size={14} /> {sorted.length} date{sorted.length === 1 ? "" : "s"}</span>
          <button type="button" onClick={resetSeed} className="text-xs text-ink-muted hover:text-azzurro-deep inline-flex items-center gap-1"><RotateCcw size={12} /> Reset to HK holidays</button>
        </div>
        <ul>
          {sorted.length === 0 && <li className="p-8 text-center text-ink-muted text-sm">No holidays yet. Add one above, or reset to the HK list.</li>}
          {sorted.map((h) => (
            <li key={h.date} className="flex items-center gap-4 px-5 py-3 border-b border-line last:border-b-0">
              <span className="font-mono text-xs text-azzurro-deep w-40 shrink-0">{fmt(h.date)}</span>
              <span className="flex-1 text-sm">{h.name}</span>
              <button type="button" onClick={() => remove(h.date)} title="Remove" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-ink-muted">Changes save automatically and apply to the course scheduler right away.</p>
    </div>
  );
}
