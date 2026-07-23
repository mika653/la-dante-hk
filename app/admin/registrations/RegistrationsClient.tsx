"use client";
import { useMemo, useState, useTransition } from "react";
import { Download, Users, GraduationCap, Repeat, CalendarCheck, ChevronDown, Trash2 } from "lucide-react";
import { deleteRegistration } from "@/lib/event-actions";

type Row = {
  id: string; eventId: string; eventTitle: string; eventDate: string | null;
  name: string; email: string; phone: string | null; ageGroup: string | null;
  isStudent: boolean; createdAt: string;
};

function fmt(iso: string) { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; }
const yearOf = (r: Row) => (r.eventDate ?? r.createdAt).slice(0, 4);

function csv(rows: Row[]) {
  const head = ["Event", "Event date", "Name", "Email", "Phone", "Age group", "Student", "Registered"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.eventTitle, r.eventDate ?? "", r.name, r.email, r.phone ?? "", r.ageGroup ?? "", r.isStudent ? "Yes" : "No", fmt(r.createdAt)]
      .map((v) => esc(String(v))).join(","));
  return [head.join(","), ...lines].join("\n");
}
function download(name: string, rows: Row[]) {
  const blob = new Blob([csv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function RegistrationsClient({ rows, error, isOwner = false }: { rows: Row[]; error: string | null; isOwner?: boolean }) {
  const years = useMemo(() => Array.from(new Set(rows.map(yearOf))).sort().reverse(), [rows]);
  const [year, setYear] = useState<string>("all");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [busy, startTransition] = useTransition();
  const visible = useMemo(() => rows.filter((r) => !deleted.has(r.id)), [rows, deleted]);
  const inYear = useMemo(() => (year === "all" ? visible : visible.filter((r) => yearOf(r) === year)), [visible, year]);

  function remove(id: string) {
    if (!confirm("Permanently delete this registration? This cannot be undone (use it to honour a data-erasure request).")) return;
    setDeleted((s) => new Set(s).add(id));
    startTransition(() => { deleteRegistration(id); });
  }

  // Yearly stats the office asked for.
  const stats = useMemo(() => {
    const total = inYear.length;
    const students = inYear.filter((r) => r.isStudent).length;
    const ages: Record<string, number> = {};
    inYear.forEach((r) => { const k = r.ageGroup || "Not given"; ages[k] = (ages[k] ?? 0) + 1; });
    // Repeat attendees: emails appearing at more than one event.
    const byEmail: Record<string, Set<string>> = {};
    inYear.forEach((r) => { (byEmail[r.email.toLowerCase()] ??= new Set()).add(r.eventId); });
    const repeat = Object.values(byEmail).filter((s) => s.size > 1).length;
    const uniquePeople = Object.keys(byEmail).length;
    return { total, students, ages, repeat, uniquePeople };
  }, [inYear]);

  // Group registrations by event, most recent event first.
  const byEvent = useMemo(() => {
    const map = new Map<string, { title: string; date: string | null; regs: Row[] }>();
    inYear.forEach((r) => {
      const g = map.get(r.eventId) ?? { title: r.eventTitle, date: r.eventDate, regs: [] };
      g.regs.push(r); map.set(r.eventId, g);
    });
    return Array.from(map.entries()).sort((a, b) => (b[1].date ?? "").localeCompare(a[1].date ?? ""));
  }, [inYear]);

  const [openEvent, setOpenEvent] = useState<string | null>(null);

  if (error) return <div className="max-w-3xl"><div className="frame p-8 bg-white text-center text-ink-muted">{error}</div></div>;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · Event registrations</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Registrations.</h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="h-11 px-4 rounded-xl border border-line bg-white">
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button type="button" onClick={() => download(`registrations-${year}.csv`, inYear)} disabled={!inYear.length} className="btn btn-ghost disabled:opacity-40">
            <Download size={16} /> Export all
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label={year === "all" ? "Registrations (all time)" : `Registrations in ${year}`} value={stats.total} sub={`${stats.uniquePeople} people`} />
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

      {/* Per-event answer sheets */}
      <h2 className="mt-10 mb-3 text-xl font-heading font-bold">Answer sheets</h2>
      {byEvent.length === 0 ? (
        <div className="frame bg-white p-12 text-center text-ink-muted">No registrations yet.</div>
      ) : (
        <div className="space-y-3">
          {byEvent.map(([id, g]) => (
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
                        <th className="px-5 py-2 text-left font-medium">Student</th>
                        <th className="px-5 py-2 text-left font-medium">Registered</th>
                        {isOwner && <th className="px-5 py-2" />}
                      </tr>
                    </thead>
                    <tbody>
                      {g.regs.map((r) => (
                        <tr key={r.id} className="border-t border-line">
                          <td className="px-5 py-3 font-medium">{r.name}</td>
                          <td className="px-5 py-3"><a href={`mailto:${r.email}`} className="text-azzurro-deep hover:underline">{r.email}</a></td>
                          <td className="px-5 py-3 text-ink-muted">{r.phone ?? "—"}</td>
                          <td className="px-5 py-3 text-ink-muted">{r.ageGroup ?? "—"}</td>
                          <td className="px-5 py-3">{r.isStudent ? <span className="text-xs px-2 py-0.5 rounded-full bg-azzurro/15 text-azzurro-deep">Student</span> : "—"}</td>
                          <td className="px-5 py-3 text-ink-muted">{fmt(r.createdAt)}</td>
                          {isOwner && (
                            <td className="px-3 py-3 text-right">
                              <button type="button" disabled={busy} onClick={() => remove(r.id)} title="Delete permanently" className="w-7 h-7 rounded-full inline-flex items-center justify-center text-ink-muted hover:bg-rosso/10 hover:text-rosso disabled:opacity-50">
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
          ))}
        </div>
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
