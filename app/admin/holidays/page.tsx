"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Check, RotateCcw, CalendarDays, GraduationCap } from "lucide-react";
import { getHolidays, setHolidays, HK_HOLIDAYS_SEED, type Holiday } from "@/lib/holidays";
import { getPlidaDates, setPlidaDates, PLIDA_DATES_SEED, type PlidaDate } from "@/lib/plida-dates";

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${WD[new Date(y, m - 1, d).getDay()]} ${d} ${MO[m - 1]} ${y}`;
}

export default function HolidaysPage() {
  const [list, setList] = useState<Holiday[]>([]);
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");

  const [plida, setPlida] = useState<PlidaDate[]>([]);
  const [pDate, setPDate] = useState("");
  const [pName, setPName] = useState("");

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setList(getHolidays()); setPlida(getPlidaDates()); }, []);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  // ---- holidays / closures ----
  function persist(next: Holiday[], msg: string) { setList(next); setHolidays(next); flash(msg); }
  function add() {
    if (!date || !name.trim()) return;
    const hasRange = endDate && endDate >= date;
    const entry: Holiday = { date, name: name.trim(), ...(hasRange ? { endDate } : {}) };
    persist([...list.filter((h) => h.date !== date), entry], `Added ${name.trim()}.`);
    setDate(""); setEndDate(""); setName("");
  }
  function remove(d: string) { persist(list.filter((h) => h.date !== d), "Removed."); }
  function resetSeed() {
    if (!confirm("Reset to the built-in Hong Kong holidays? Your custom edits will be replaced.")) return;
    persist(HK_HOLIDAYS_SEED, "Reset to the built-in Hong Kong holidays.");
  }

  // ---- PLIDA exam days ----
  function persistPlida(next: PlidaDate[], msg: string) { setPlida(next); setPlidaDates(next); flash(msg); }
  function addPlida() {
    if (!pDate || !pName.trim()) return;
    persistPlida([...plida.filter((p) => p.date !== pDate), { date: pDate, name: pName.trim() }], `Added ${pName.trim()}.`);
    setPDate(""); setPName("");
  }
  function removePlida(d: string) { persistPlida(plida.filter((p) => p.date !== d), "Removed."); }
  function resetPlida() {
    if (!confirm("Reset to the default PLIDA sittings? Your custom edits will be replaced.")) return;
    persistPlida(PLIDA_DATES_SEED, "Reset to the default PLIDA dates.");
  }

  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
  const plidaSorted = [...plida].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to settings</Link>

      <p className="eyebrow">Admin · Holidays &amp; exam days</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Holidays &amp; exam days.</h1>
      <p className="mt-2 text-ink-muted">These are the days the <b>course scheduler skips</b> when generating lesson dates. Public holidays and school closures always skip; PLIDA exam days only skip for classes you tick <b>&ldquo;Skip PLIDA&rdquo;</b> on.</p>

      <div className="mt-4 frame p-4 bg-sole-soft/60 border border-[#b59a00]/30 text-sm">
        <b>Please verify the dates.</b> Lunar-calendar holidays (Lunar New Year, Buddha&apos;s Birthday, Tuen Ng, Mid-Autumn, Chung Yeung) move each year — confirm them against the official HK gazette so your course dates stay correct.
      </div>

      {toast && (
        <div className="mt-4 frame p-3 bg-sole flex items-center gap-2 text-sm"><Check size={16} /> {toast}</div>
      )}

      {/* ---------- Holidays & closures ---------- */}
      <div className="mt-6 frame p-5 md:p-6 bg-white">
        <p className="text-sm font-medium mb-1">Add a holiday or closure</p>
        <p className="text-xs text-ink-muted mb-3">Leave <b>To</b> empty for a single day. For a break that spans several days (e.g. Christmas), set both — the whole range is skipped.</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium">From
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <label className="text-sm font-medium">To <span className="text-ink-muted font-normal">(optional)</span>
            <input type="date" value={endDate} min={date || undefined} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <label className="text-sm font-medium flex-1 min-w-[200px]">Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Christmas break, or School closure" className="mt-1 block w-full h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <button type="button" onClick={add} disabled={!date || !name.trim()} className="btn btn-primary h-11 disabled:opacity-40"><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className="mt-6 frame bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-cream-2 border-b border-line">
          <span className="text-xs uppercase tracking-wider text-ink-muted font-medium inline-flex items-center gap-2"><CalendarDays size={14} /> {sorted.length} holiday{sorted.length === 1 ? "" : "s"} &amp; closure{sorted.length === 1 ? "" : "s"}</span>
          <button type="button" onClick={resetSeed} className="text-xs text-ink-muted hover:text-azzurro-deep inline-flex items-center gap-1"><RotateCcw size={12} /> Reset to HK holidays</button>
        </div>
        <ul>
          {sorted.length === 0 && <li className="p-8 text-center text-ink-muted text-sm">No holidays yet. Add one above, or reset to the HK list.</li>}
          {sorted.map((h) => (
            <li key={h.date} className="flex items-center gap-4 px-5 py-3 border-b border-line last:border-b-0">
              <span className="font-mono text-xs text-azzurro-deep w-56 shrink-0">
                {fmt(h.date)}{h.endDate && h.endDate > h.date ? <span className="text-ink-muted"> → {fmt(h.endDate)}</span> : null}
              </span>
              <span className="flex-1 text-sm">{h.name}</span>
              <button type="button" onClick={() => remove(h.date)} title="Remove" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- PLIDA exam days ---------- */}
      <div className="mt-10 frame p-5 md:p-6 bg-white">
        <p className="text-sm font-medium mb-1 inline-flex items-center gap-2"><GraduationCap size={16} className="text-azzurro-deep" /> Add a PLIDA exam day</p>
        <p className="text-xs text-ink-muted mb-3">Usually two a year (June &amp; November). These only affect classes with <b>&ldquo;Skip sessions on PLIDA exam days&rdquo;</b> ticked.</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium">Date
            <input type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} className="mt-1 block h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <label className="text-sm font-medium flex-1 min-w-[200px]">Name
            <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="e.g. PLIDA exam — June sitting" className="mt-1 block w-full h-11 px-3 rounded-xl border border-line bg-white" />
          </label>
          <button type="button" onClick={addPlida} disabled={!pDate || !pName.trim()} className="btn btn-primary h-11 disabled:opacity-40"><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className="mt-6 frame bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-cream-2 border-b border-line">
          <span className="text-xs uppercase tracking-wider text-ink-muted font-medium inline-flex items-center gap-2"><GraduationCap size={14} /> {plidaSorted.length} PLIDA date{plidaSorted.length === 1 ? "" : "s"}</span>
          <button type="button" onClick={resetPlida} className="text-xs text-ink-muted hover:text-azzurro-deep inline-flex items-center gap-1"><RotateCcw size={12} /> Reset to defaults</button>
        </div>
        <ul>
          {plidaSorted.length === 0 && <li className="p-8 text-center text-ink-muted text-sm">No PLIDA dates yet. Add one above, or reset to the defaults.</li>}
          {plidaSorted.map((p) => (
            <li key={p.date} className="flex items-center gap-4 px-5 py-3 border-b border-line last:border-b-0">
              <span className="font-mono text-xs text-azzurro-deep w-40 shrink-0">{fmt(p.date)}</span>
              <span className="flex-1 text-sm">{p.name}</span>
              <button type="button" onClick={() => removePlida(p.date)} title="Remove" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-ink-muted">Changes save automatically and apply to the course scheduler right away.</p>
    </div>
  );
}
