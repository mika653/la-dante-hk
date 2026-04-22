"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, ArrowRight, ExternalLink } from "lucide-react";
import { usePeople, getProgress, type PersonRole, type PersonStatus } from "@/lib/people-store";

const statusLabel: Record<PersonStatus, string> = {
  "invited": "Invited",
  "in-progress": "In progress",
  "submitted": "Submitted · needs review",
  "approved": "Approved",
};
const statusClass: Record<PersonStatus, string> = {
  "invited": "bg-cream-2 text-ink-muted",
  "in-progress": "bg-azzurro-soft text-azzurro-deep",
  "submitted": "bg-sole text-ink",
  "approved": "bg-azzurro-deep text-cream",
};

export default function PeopleList() {
  const [people] = usePeople();
  const [role, setRole] = useState<"all" | PersonRole>("all");
  const [status, setStatus] = useState<"all" | PersonStatus>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => people.filter((p) => {
    if (role !== "all" && p.role !== role) return false;
    if (status !== "all" && p.status !== status) return false;
    if (q && !`${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [people, role, status, q]);

  const countsByStatus: Record<PersonStatus, number> = { "invited": 0, "in-progress": 0, "submitted": 0, "approved": 0 };
  people.forEach((p) => { countsByStatus[p.status]++; });

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · People</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Faculty & personnel.</h1>
          <p className="mt-2 text-ink-muted">Onboard new teachers and staff via a self-service flow. Track progress, review submissions, approve.</p>
        </div>
        <Link href="/admin/people/new" className="btn btn-primary"><Plus size={16} /> Invite new person</Link>
      </div>

      {/* Status summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {(Object.keys(countsByStatus) as PersonStatus[]).map((s) => (
          <button key={s} type="button" onClick={() => setStatus((x) => (x === s ? "all" : s))} className={`frame p-4 text-left transition-all ${status === s ? "ring-2 ring-azzurro-deep" : ""} ${statusClass[s].split(" ")[0]} ${statusClass[s].includes("text-cream") ? "text-cream" : ""}`}>
            <p className="text-[11px] uppercase tracking-widest font-medium opacity-80">{statusLabel[s]}</p>
            <p className="mt-2 font-heading font-extrabold text-3xl">{countsByStatus[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="frame p-4 md:p-5 bg-white flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="w-full h-11 pl-11 pr-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value as "all" | PersonRole)} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All roles</option>
          <option value="teacher">Teachers</option>
          <option value="staff">Staff</option>
          <option value="contractor">Contractors</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as "all" | PersonStatus)} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All statuses</option>
          <option value="invited">Invited</option>
          <option value="in-progress">In progress</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 frame bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-2 text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium">Role</th>
                <th className="px-5 py-3 text-left font-medium">Subjects</th>
                <th className="px-5 py-3 text-left font-medium">Progress</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-ink-muted">No one matches your filters.</td></tr>
              )}
              {filtered.map((p) => {
                const prog = getProgress(p);
                return (
                  <tr key={p.id} className="border-t border-line hover:bg-cream-2/30">
                    <td className="px-5 py-4">
                      <p className="font-medium">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-ink-muted">{p.email}</p>
                    </td>
                    <td className="px-5 py-4 capitalize text-ink-muted">{p.role}</td>
                    <td className="px-5 py-4 text-xs text-ink-muted">{p.subjects.length ? p.subjects.join(", ") : "—"}</td>
                    <td className="px-5 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                          <div className="h-full bg-azzurro-deep" style={{ width: `${prog.pct}%` }} />
                        </div>
                        <span className="text-xs font-mono text-ink-muted">{prog.completed}/{prog.total}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/people/${p.id}`} className="inline-flex items-center gap-1.5 text-azzurro-deep text-xs font-medium">
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-ink-muted">
        <p>Each invite produces a unique self-service link at <code className="font-mono text-xs bg-cream-2 px-1.5 py-0.5 rounded">/onboarding/[token]</code> — share it with the new hire to complete their onboarding. <Link href="/onboarding/demo-alessio" target="_blank" rel="noopener" className="text-azzurro-deep underline inline-flex items-center gap-1">Preview the hire experience <ExternalLink size={11} /></Link>.</p>
      </div>
    </div>
  );
}
