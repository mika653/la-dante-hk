"use client";
import { useMemo, useState, useTransition } from "react";
import { Download, Users, GraduationCap, Repeat, CalendarCheck, ChevronDown, Trash2, Mail, Search } from "lucide-react";
import { deleteRegistration } from "@/lib/event-actions";
import { CUSTOM_ANSWER_PREFIX, AGE_OPTIONS } from "@/lib/event-registration";

type Row = {
  id: string; eventId: string; eventTitle: string; eventDate: string | null;
  name: string; email: string; phone: string | null; ageGroup: string | null;
  isStudent: boolean; answers: Record<string, string> | null; createdAt: string;
};

function fmt(iso: string) { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; }
const yearOf = (r: Row) => (r.eventDate ?? r.createdAt).slice(0, 4);
const ans = (r: Row, k: string) => r.answers?.[k] ?? "";
// Custom-question answers are keyed "q:<question text>"; collect every question
// asked across these rows, in first-seen order.
function customKeys(rows: Row[]) {
  const keys: string[] = [];
  for (const r of rows) for (const k of Object.keys(r.answers ?? {})) if (k.startsWith(CUSTOM_ANSWER_PREFIX) && !keys.includes(k)) keys.push(k);
  return keys;
}
const customLabel = (k: string) => k.slice(CUSTOM_ANSWER_PREFIX.length);

function csv(rows: Row[]) {
  const extra = customKeys(rows);
  const head = ["Event", "Event date", "Name", "Email", "Phone", "Age group", "Source", "Member", "Newsletter", "Consent", "Student", "Registered", ...extra.map(customLabel)];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.eventTitle, r.eventDate ?? "", r.name, r.email, r.phone ?? "", r.ageGroup ?? "", ans(r, "source"), ans(r, "member"), ans(r, "newsletter"), ans(r, "consent"), r.isStudent ? "Yes" : "No", fmt(r.createdAt), ...extra.map((k) => ans(r, k))]
      .map((v) => esc(String(v))).join(","));
  return [head.map(esc).join(","), ...lines].join("\n");
}
function download(name: string, rows: Row[]) {
  // Lead with a UTF-8 BOM so Excel reads it as UTF-8 — otherwise the en-dash in
  // age ranges ("6–11") and any accented names come out garbled.
  const blob = new Blob(["﻿" + csv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function RegistrationsClient({ rows, error, isOwner = false }: { rows: Row[]; error: string | null; isOwner?: boolean }) {
  const years = useMemo(() => Array.from(new Set(rows.map(yearOf))).sort().reverse(), [rows]);
  const [year, setYear] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"event" | "person">("event");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [busy, startTransition] = useTransition();
  const visible = useMemo(() => rows.filter((r) => !deleted.has(r.id)), [rows, deleted]);
  const inYear = useMemo(() => (year === "all" ? visible : visible.filter((r) => yearOf(r) === year)), [visible, year]);

  // The working set every panel reads: year + age band + name/email search.
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return inYear.filter((r) =>
      (ageFilter === "all" || (ageFilter === "none" ? !r.ageGroup : r.ageGroup === ageFilter)) &&
      (!needle || r.name.toLowerCase().includes(needle) || r.email.toLowerCase().includes(needle)));
  }, [inYear, ageFilter, q]);

  function remove(id: string) {
    if (!confirm("Permanently delete this registration? This cannot be undone (use it to honour a data-erasure request).")) return;
    setDeleted((s) => new Set(s).add(id));
    startTransition(() => { deleteRegistration(id); });
  }

  // Yearly stats the office asked for (respects the current filters).
  const stats = useMemo(() => {
    const total = shown.length;
    const students = shown.filter((r) => r.isStudent).length;
    const ages: Record<string, number> = {};
    shown.forEach((r) => { const k = r.ageGroup || "Not given"; ages[k] = (ages[k] ?? 0) + 1; });
    // Repeat attendees: emails appearing at more than one event.
    const byEmail: Record<string, Set<string>> = {};
    shown.forEach((r) => { (byEmail[r.email.toLowerCase()] ??= new Set()).add(r.eventId); });
    const repeat = Object.values(byEmail).filter((s) => s.size > 1).length;
    const uniquePeople = Object.keys(byEmail).length;
    return { total, students, ages, repeat, uniquePeople };
  }, [shown]);

  // Group registrations by event, most recent event first.
  const byEvent = useMemo(() => {
    const map = new Map<string, { title: string; date: string | null; regs: Row[] }>();
    shown.forEach((r) => {
      const g = map.get(r.eventId) ?? { title: r.eventTitle, date: r.eventDate, regs: [] };
      g.regs.push(r); map.set(r.eventId, g);
    });
    return Array.from(map.entries()).sort((a, b) => (b[1].date ?? "").localeCompare(a[1].date ?? ""));
  }, [shown]);

  // Group by person (email), so Giulia can see how many events someone attended.
  const byPerson = useMemo(() => {
    const map = new Map<string, { name: string; email: string; ageGroup: string | null; latest: string; events: Map<string, { title: string; date: string | null }> }>();
    shown.forEach((r) => {
      const key = r.email.toLowerCase();
      const p = map.get(key) ?? { name: r.name, email: r.email, ageGroup: r.ageGroup, latest: r.createdAt, events: new Map() };
      p.events.set(r.eventId, { title: r.eventTitle, date: r.eventDate });
      if (r.createdAt >= p.latest) { p.latest = r.createdAt; p.name = r.name; p.ageGroup = r.ageGroup; } // keep most recent name/age
      map.set(key, p);
    });
    return Array.from(map.values()).sort((a, b) => b.events.size - a.events.size || a.name.localeCompare(b.name));
  }, [shown]);

  const [openEvent, setOpenEvent] = useState<string | null>(null);

  if (error) return <div className="max-w-3xl"><div className="frame p-8 bg-white text-center text-ink-muted">{error}</div></div>;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · Event registrations</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Registrations.</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="h-11 px-4 rounded-xl border border-line bg-white">
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} className="h-11 px-4 rounded-xl border border-line bg-white" title="Filter by age group">
            <option value="all">All ages</option>
            {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            <option value="none">Not given</option>
          </select>
          <button type="button" onClick={() => download(`registrations-${year}${ageFilter !== "all" ? `-${ageFilter}` : ""}.csv`, shown)} disabled={!shown.length} className="btn btn-ghost disabled:opacity-40">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label={ageFilter === "all" ? "Registrations" : `Registrations (${ageFilter})`} value={stats.total} sub={`${stats.uniquePeople} people`} />
        <Stat icon={GraduationCap} label="Students" value={stats.students} sub={stats.total ? `${Math.round((stats.students / stats.total) * 100)}% of sign-ups` : "—"} />
        <Stat icon={Repeat} label="Repeat attendees" value={stats.repeat} sub="joined 2+ events" />
        <Stat icon={CalendarCheck} label="Events with sign-ups" value={byEvent.length} sub="in this period" />
      </div>

      {/* Age breakdown */}
      <div className="mt-4 frame bg-white p-5">
        <p className="eyebrow">Age groups</p>
        {stats.total === 0 ? <p className="mt-2 text-sm text-ink-muted">No data yet.</p> : (
          <div className="mt-3 space-y-2">
            {Object.entries(stats.ages).sort((a, b) => b[1] - a[1]).map(([g, n]) => (
              <div key={g} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-ink-muted">{g}</span>
                <div className="flex-1 h-2.5 rounded-full bg-cream-2 overflow-hidden">
                  <div className="h-full bg-azzurro-deep" style={{ width: `${(n / stats.total) * 100}%` }} />
                </div>
                <span className="w-10 text-right font-medium">{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View switch + search */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-line p-1">
          {(["event", "person"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${view === v ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"}`}>
              {v === "event" ? "By event" : "By person"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-sm focus:outline-none focus:border-ink" />
        </div>
      </div>

      {view === "event" ? (
        <>
          <h2 className="mt-6 mb-3 text-xl font-heading font-bold">Answer sheets</h2>
          {byEvent.length === 0 ? (
            <div className="frame bg-white p-12 text-center text-ink-muted">{q || ageFilter !== "all" ? "No registrations match these filters." : "No registrations yet."}</div>
          ) : (
            <div className="space-y-3">
              {byEvent.map(([id, g]) => { const extra = customKeys(g.regs); return (
                <div key={id} className="frame bg-white overflow-hidden">
                  <button type="button" onClick={() => setOpenEvent(openEvent === id ? null : id)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream-2/40">
                    <div>
                      <p className="font-heading font-bold">{g.title}</p>
                      <p className="text-sm text-ink-muted">{g.date ?? "—"} · {g.regs.length} registered{g.regs.filter((r) => r.isStudent).length ? ` · ${g.regs.filter((r) => r.isStudent).length} students` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span onClick={(e) => { e.stopPropagation(); download(`${g.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`, g.regs); }} className="btn btn-ghost h-9 px-3 text-sm cursor-pointer"><Download size={14} /> CSV</span>
                      <ChevronDown size={18} className={`transition-transform ${openEvent === id ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {openEvent === id && (
                    <div className="overflow-x-auto border-t border-line">
                      <table className="w-full text-sm">
                        <thead className="bg-cream-2 text-xs uppercase tracking-wider text-ink-muted">
                          <tr>
                            <th className="px-5 py-2 text-left font-medium">Name</th>
                            <th className="px-5 py-2 text-left font-medium">Email</th>
                            <th className="px-5 py-2 text-left font-medium">Phone</th>
                            <th className="px-5 py-2 text-left font-medium">Age</th>
                            <th className="px-5 py-2 text-left font-medium">Source</th>
                            <th className="px-5 py-2 text-left font-medium">Member</th>
                            {extra.map((k) => <th key={k} className="px-5 py-2 text-left font-medium normal-case tracking-normal min-w-40">{customLabel(k)}</th>)}
                            <th className="px-5 py-2 text-left font-medium">Registered</th>
                            {isOwner && <th className="px-3 py-2 sticky right-0 bg-cream-2"><span className="sr-only">Actions</span></th>}
                          </tr>
                        </thead>
                        <tbody>
                          {g.regs.map((r) => (
                            <tr key={r.id} className="border-t border-line">
                              <td className="px-5 py-3 font-medium">{r.name}</td>
                              <td className="px-5 py-3"><a href={`mailto:${r.email}`} className="text-azzurro-deep hover:underline">{r.email}</a></td>
                              <td className="px-5 py-3 text-ink-muted">{r.phone ?? "—"}</td>
                              <td className="px-5 py-3 text-ink-muted">{r.ageGroup ?? "—"}</td>
                              <td className="px-5 py-3 text-ink-muted">{ans(r, "source") || "—"}</td>
                              <td className="px-5 py-3 text-ink-muted">{ans(r, "member") || "—"}</td>
                              {extra.map((k) => <td key={k} className="px-5 py-3 text-ink-muted whitespace-pre-line">{ans(r, k) || "—"}</td>)}
                              <td className="px-5 py-3 text-ink-muted">{fmt(r.createdAt)}</td>
                              {isOwner && (
                                <td className="px-3 py-3 text-right sticky right-0 bg-white shadow-[-6px_0_6px_-6px_rgba(25,25,25,0.12)]">
                                  <button type="button" disabled={busy} onClick={() => remove(r.id)} title="Delete permanently" className="w-8 h-8 rounded-full inline-flex items-center justify-center text-ink-muted hover:bg-rosso/10 hover:text-rosso disabled:opacity-50">
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ); })}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-6 mb-3 text-xl font-heading font-bold">By person <span className="text-sm font-body font-normal text-ink-muted">· {byPerson.length} {byPerson.length === 1 ? "person" : "people"}, most events first</span></h2>
          {byPerson.length === 0 ? (
            <div className="frame bg-white p-12 text-center text-ink-muted">{q || ageFilter !== "all" ? "No one matches these filters." : "No registrations yet."}</div>
          ) : (
            <div className="space-y-3">
              {byPerson.map((p) => {
                const evs = [...p.events.values()].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
                return (
                  <div key={p.email} className="frame bg-white p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading font-bold">{p.name}</span>
                          {p.ageGroup && <span className="text-xs px-2 py-0.5 rounded-full bg-cream-2 border border-line">{p.ageGroup}</span>}
                        </div>
                        <a href={`mailto:${p.email}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-azzurro-deep hover:underline"><Mail size={14} /> {p.email}</a>
                      </div>
                      <span className="shrink-0 inline-flex flex-col items-center justify-center rounded-2xl bg-azzurro-soft text-azzurro-deep px-4 py-2 leading-none">
                        <span className="text-2xl font-heading font-bold">{p.events.size}</span>
                        <span className="mt-1 text-[11px] uppercase tracking-wider">event{p.events.size === 1 ? "" : "s"}</span>
                      </span>
                    </div>
                    <ul className="mt-3 border-t border-line pt-3 space-y-1 text-sm">
                      {evs.map((e, i) => (
                        <li key={i} className="flex items-center gap-2 text-ink-muted">
                          <CalendarCheck size={13} className="shrink-0" aria-hidden />
                          <span className="text-ink">{e.title}</span>{e.date && <span>· {e.date}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: number; sub: string }) {
  return (
    <div className="frame bg-white p-5">
      <Icon size={18} className="text-azzurro-deep" aria-hidden />
      <p className="mt-3 text-3xl font-heading font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-ink-muted">{sub}</p>
    </div>
  );
}
