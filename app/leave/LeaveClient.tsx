"use client";
import { useActionState, useMemo, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Plus, UserPlus, LogOut, KeyRound, Trash2 } from "lucide-react";
import type { Role, LeaveType, LeaveStatus } from "@/lib/db/schema";
import { balanceFor, workingDays, roleLabel, statusStyle, currentYear, fmtDate, canManageUser, canDecide, restDayHolidaysInLieu } from "@/lib/leave-core";
import { requestLeave, cancelLeave, decideLeave, addUser, updateUser, resetUserPassword, deleteUser, type ActionResult } from "@/lib/leave-actions";
import { logoutAction } from "@/lib/auth-actions";

type PublicUser = {
  id: string; email: string; name: string; role: Role;
  annualEntitlement: number; sickEntitlement: number; partTime: boolean; restDays: number[] | null; startDate: string | null; designation: string | null; active: boolean;
};

// Weekday labels for rest-day pickers (1=Mon … 6=Sat; Sunday is everyone's day off).
const REST_DAYS: Array<{ n: number; label: string }> = [
  { n: 1, label: "Mon" }, { n: 2, label: "Tue" }, { n: 3, label: "Wed" },
  { n: 4, label: "Thu" }, { n: 5, label: "Fri" }, { n: 6, label: "Sat" },
];
type Leave = {
  id: string; userId: string; type: LeaveType;
  startDate: string; endDate: string; days: number; reason: string | null; status: LeaveStatus;
};

export default function LeaveClient({
  me, admin, myLeave, staff, teamLeave, holidayDates = [],
}: { me: PublicUser; admin: boolean; myLeave: Leave[]; staff: PublicUser[]; teamLeave: Leave[]; holidayDates?: string[] }) {
  const [tab, setTab] = useState<"me" | "team" | "staff">("me");

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="La Dante" width={140} height={40} className="h-8 w-auto bg-cream rounded px-2 py-1" />
            <span className="font-heading font-bold">Staff leave</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-cream/70">
              Signed in as <b className="text-cream">{me.name}</b> · {roleLabel[me.role]}
            </span>
            <Link href="/account/password" className="text-cream/70 hover:text-cream inline-flex items-center gap-1.5">
              <KeyRound size={14} /> Password
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-cream/70 hover:text-cream inline-flex items-center gap-1.5">
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <TabBtn on={tab === "me"} onClick={() => setTab("me")}>My leave</TabBtn>
          {admin && <TabBtn on={tab === "team"} onClick={() => setTab("team")}>Team leave</TabBtn>}
          {admin && <TabBtn on={tab === "staff"} onClick={() => setTab("staff")}>Staff</TabBtn>}
        </div>

        {tab === "me" && <MyLeave me={me} myLeave={myLeave} holidayDates={holidayDates} />}
        {tab === "team" && admin && <TeamLeave me={me} staff={staff} teamLeave={teamLeave} holidayDates={holidayDates} />}
        {tab === "staff" && admin && <Staff me={me} staff={staff} />}
      </div>
    </main>
  );
}

function TabBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium border ${on ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted bg-white"}`}>
      {children}
    </button>
  );
}

function Notice({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p className={`mt-3 text-sm rounded-lg px-3 py-2 ${state.ok ? "bg-green-100 text-green-800" : "bg-rosso/10 text-rosso"}`}>
      {state.ok ? state.message ?? "Done." : state.error}
    </p>
  );
}

// ---------------- MY LEAVE ----------------
function MyLeave({ me, myLeave, holidayDates = [] }: { me: PublicUser; myLeave: Leave[]; holidayDates?: string[] }) {
  const annualBonus = restDayHolidaysInLieu(holidayDates, me.restDays);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(requestLeave, null);
  const [type, setType] = useState<LeaveType>("annual");
  const [halfDay, setHalfDay] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [busy, startTransition] = useTransition();
  const days = useMemo(
    () => (halfDay ? (start && workingDays(start, start) >= 1 ? 0.5 : 0) : workingDays(start, end)),
    [halfDay, start, end],
  );

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {(["annual", "sick"] as LeaveType[]).map((t) => {
          const bonus = t === "annual" ? annualBonus : 0;
          const ent = (t === "annual" ? me.annualEntitlement : me.sickEntitlement) + bonus;
          const b = balanceFor(me.id, t, ent, myLeave);
          return (
            <div key={t} className="frame bg-white p-5">
              <p className="eyebrow">{t === "annual" ? "Annual leave" : "Sick leave"} · {currentYear()}</p>
              <p className="mt-2 text-3xl font-heading font-bold">
                {b.remaining}<span className="text-lg text-ink-muted font-body font-normal"> / {b.entitlement} days left</span>
              </p>
              <div className="mt-3 h-2 rounded-full bg-cream-2 overflow-hidden">
                <div className="h-full bg-azzurro-deep" style={{ width: `${b.entitlement ? (b.approved / b.entitlement) * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{b.approved} taken · {b.pending} pending</p>
              {bonus > 0 && (
                <p className="mt-1 text-xs text-azzurro-deep">Includes +{bonus} day{bonus === 1 ? "" : "s"} in lieu of public holiday{bonus === 1 ? "" : "s"} on your rest day.</p>
              )}
            </div>
          );
        })}
      </div>

      <form action={action} className="frame bg-white p-5 md:p-6">
        <h2 className="font-heading font-bold text-lg">Request leave</h2>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="halfDay" value={halfDay ? "1" : ""} />
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              {(["annual", "sick"] as LeaveType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`px-5 py-2.5 rounded-full border text-sm ${type === t ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>
                  {t === "annual" ? "Annual" : "Sick"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 select-none cursor-pointer">
              <input type="checkbox" checked={halfDay} onChange={(e) => setHalfDay(e.target.checked)} className="w-4 h-4 accent-azzurro-deep" />
              Half day <span className="text-ink-muted font-normal">(0.5 day)</span>
            </label>
            {halfDay ? (
              <>
                <label className="text-sm font-medium block">Date
                  <input name="startDate" type="date" required value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" />
                </label>
                <input type="hidden" name="endDate" value={start} />
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">From
                  <input name="startDate" type="date" required value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" />
                </label>
                <label className="text-sm font-medium">To
                  <input name="endDate" type="date" required value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" />
                </label>
              </div>
            )}
          </div>
        </div>
        <label className="block text-sm font-medium mt-4">Reason <span className="text-ink-muted font-normal">(optional)</span>
          <input name="reason" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" />
        </label>
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm text-ink-muted">
            {days <= 0
              ? (halfDay ? "Pick a working day" : "Select dates")
              : halfDay
                ? <><b className="text-ink">0.5</b> day · half day (Sundays don&apos;t count)</>
                : <><b className="text-ink">{days}</b> working day{days === 1 ? "" : "s"} · weekends don&apos;t count</>}
          </span>
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-50">
            <Plus size={16} /> {pending ? "Sending…" : "Submit request"}
          </button>
        </div>
        <Notice state={state} />
      </form>

      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">My requests</div>
        <table className="w-full text-sm">
          <tbody>
            {myLeave.length === 0 && <tr><td className="p-6 text-center text-ink-muted">No requests yet.</td></tr>}
            {myLeave.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-5 py-3">{fmtDate(l.startDate)}{l.endDate !== l.startDate && <> – {fmtDate(l.endDate)}</>}</td>
                <td className="px-5 py-3 capitalize">{l.type}</td>
                <td className="px-5 py-3">{l.days}d</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs capitalize ${statusStyle[l.status]}`}>{l.status}</span></td>
                <td className="px-5 py-3 text-right">
                  {l.status === "pending" && (
                    <button disabled={busy} onClick={() => startTransition(() => { cancelLeave(l.id); })} className="text-xs text-ink-muted hover:text-rosso disabled:opacity-50">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- TEAM LEAVE (admin) ----------------
function TeamLeave({ me, staff, teamLeave, holidayDates = [] }: { me: PublicUser; staff: PublicUser[]; teamLeave: Leave[]; holidayDates?: string[] }) {
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const pending = teamLeave.filter((l) => l.status === "pending");
  const nameOf = (id: string) => staff.find((u) => u.id === id)?.name ?? "—";
  const team = staff.filter((u) => u.active);

  function decide(id: string, status: "approved" | "declined") {
    setErr(null);
    startTransition(async () => {
      const r = await decideLeave(id, status);
      if (!r.ok) setErr(r.error);
    });
  }

  return (
    <div className="space-y-6">
      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">
          Pending approvals ({pending.length})
        </div>
        {err && <p className="m-4 text-sm bg-rosso/10 text-rosso rounded-lg px-3 py-2">{err}</p>}
        {pending.length === 0 ? (
          <p className="p-6 text-center text-ink-muted text-sm">Nothing waiting — all caught up.</p>
        ) : (
          <ul>
            {pending.map((l) => {
              const mine = !canDecide(me.role, me.id, l.userId);
              return (
                <li key={l.id} className="flex items-center gap-4 px-5 py-4 border-t border-line flex-wrap">
                  <div className="flex-1 min-w-[220px]">
                    <p className="font-medium">{nameOf(l.userId)} <span className="text-ink-muted font-normal capitalize">· {l.type} leave</span></p>
                    <p className="text-sm text-ink-muted">
                      {fmtDate(l.startDate)}{l.endDate !== l.startDate && <> – {fmtDate(l.endDate)}</>} · {l.days} day{l.days === 1 ? "" : "s"}
                      {l.reason && <> · “{l.reason}”</>}
                    </p>
                  </div>
                  {mine ? (
                    <span className="text-xs text-ink-muted">Your own request — the owner signs this off.</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button disabled={busy} onClick={() => decide(l.id, "approved")} className="btn btn-primary h-9 px-4 text-sm disabled:opacity-50"><Check size={15} /> Approve</button>
                      <button disabled={busy} onClick={() => decide(l.id, "declined")} className="btn btn-ghost h-9 px-4 text-sm disabled:opacity-50"><X size={15} /> Decline</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">Team balances · {currentYear()}</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-5 py-2 text-left font-medium">Name</th>
              <th className="px-5 py-2 text-left font-medium">Annual (left / total)</th>
              <th className="px-5 py-2 text-left font-medium">Sick (left / total)</th>
              <th className="px-5 py-2 text-left font-medium">Pending</th>
            </tr>
          </thead>
          <tbody>
            {team.map((u) => {
              const a = balanceFor(u.id, "annual", u.annualEntitlement + restDayHolidaysInLieu(holidayDates, u.restDays), teamLeave);
              const s = balanceFor(u.id, "sick", u.sickEntitlement, teamLeave);
              return (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3">{a.remaining} / {a.entitlement}</td>
                  <td className="px-5 py-3">{s.remaining} / {s.entitlement}</td>
                  <td className="px-5 py-3">{a.pending + s.pending > 0 ? <span className="px-2 py-0.5 rounded-full text-xs bg-sole">{a.pending + s.pending}d</span> : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- STAFF (admin) ----------------
function Staff({ me, staff }: { me: PublicUser; staff: PublicUser[] }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addUser, null);
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const ownerOnly = me.role === "owner";
  // Local rest-day state for instant toggle feedback (the staff list isn't refetched).
  const [restState, setRestState] = useState<Record<string, number[]>>(
    () => Object.fromEntries(staff.map((u) => [u.id, u.restDays ?? []])),
  );

  function toggleRest(id: string, n: number) {
    const cur = restState[id] ?? [];
    const next = cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n].sort();
    setRestState((s) => ({ ...s, [id]: next }));
    patch(id, { restDays: next });
  }

  function patch(id: string, p: Parameters<typeof updateUser>[1]) {
    setErr(null);
    startTransition(async () => {
      const r = await updateUser(id, p);
      if (!r.ok) setErr(r.error);
    });
  }

  function reset(id: string) {
    setErr(null); setResetMsg(null);
    startTransition(async () => {
      const r = await resetUserPassword(id);
      if (r.ok) setResetMsg(r.message ?? null);
      else setErr(r.error ?? "Couldn't reset the password.");
    });
  }

  function remove(u: PublicUser) {
    setErr(null); setResetMsg(null);
    if (!window.confirm(`Permanently delete ${u.name}? This removes their account and leave history and can't be undone.`)) return;
    startTransition(async () => {
      const r = await deleteUser(u.id);
      if (r.ok) setResetMsg(r.message ?? `${u.name} removed.`);
      else setErr(r.error ?? "Couldn't remove that person.");
    });
  }

  return (
    <div className="space-y-6">
      <form action={action} className="frame bg-white p-5 md:p-6">
        <h2 className="font-heading font-bold text-lg inline-flex items-center gap-2"><UserPlus size={18} /> Add a user</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <label className="text-sm font-medium">Name<input name="name" required className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <label className="text-sm font-medium">Email<input name="email" type="email" required className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <label className="text-sm font-medium">Role
            <select name="role" defaultValue="teacher" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white">
              <option value="teacher">Teacher</option>
              {ownerOnly && <option value="manager">Manager</option>}
              {ownerOnly && <option value="owner">Owner</option>}
            </select>
          </label>
          <label className="text-sm font-medium">Employment start <span className="text-ink-muted font-normal">(when they started working)</span><input name="startDate" type="date" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <label className="text-sm font-medium">Designation <span className="text-ink-muted font-normal">(e.g. Senior Teacher)</span><input name="designation" maxLength={80} placeholder="Job title / designation" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">Annual days<input name="annual" type="number" defaultValue={14} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
            <label className="text-sm font-medium">Sick days<input name="sick" type="number" defaultValue={14} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-medium select-none cursor-pointer w-fit">
          <input type="checkbox" name="partTime" value="1" className="w-4 h-4 accent-azzurro-deep" />
          Part-time
        </label>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Rest day(s) <span className="text-ink-muted font-normal">(besides Sunday)</span></legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REST_DAYS.map((d) => (
              <label key={d.n} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-line cursor-pointer select-none has-[:checked]:bg-azzurro-soft has-[:checked]:border-azzurro-deep">
                <input type="checkbox" name="restDay" value={d.n} className="w-3.5 h-3.5 accent-azzurro-deep" /> {d.label}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-muted">A public holiday on a rest day adds one annual-leave day in lieu.</p>
        </fieldset>
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-50"><Plus size={16} /> {pending ? "Adding…" : "Add user"}</button>
        </div>
        {!ownerOnly && <p className="mt-2 text-xs text-ink-muted">As a Manager you can add and manage teachers. Only the Owner can create or edit managers and owners.</p>}
        <Notice state={state} />
      </form>

      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">Staff ({staff.length})</div>
        {err && <p className="m-4 text-sm bg-rosso/10 text-rosso rounded-lg px-3 py-2">{err}</p>}
        {resetMsg && (
          <div className="m-4 rounded-lg border border-azzurro-deep/30 bg-azzurro-soft px-4 py-3 text-sm flex items-start justify-between gap-3">
            <span className="font-medium text-ink">{resetMsg}</span>
            <button type="button" onClick={() => setResetMsg(null)} className="text-xs text-ink-muted hover:text-ink shrink-0 underline">Dismiss</button>
          </div>
        )}
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1140px]">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-5 py-2 text-left font-medium">Name</th>
              <th className="px-5 py-2 text-left font-medium">Role</th>
              <th className="px-5 py-2 text-left font-medium">Employment start</th>
              <th className="px-5 py-2 text-left font-medium">Designation</th>
              <th className="px-5 py-2 text-left font-medium">Annual</th>
              <th className="px-5 py-2 text-left font-medium">Sick</th>
              <th className="px-5 py-2 text-left font-medium">Type</th>
              <th className="px-5 py-2 text-left font-medium">Rest days</th>
              <th className="px-5 py-2 text-left font-medium">Status</th>
              <th className="px-5 py-2 text-left font-medium">Password</th>
              <th className="px-5 py-2 text-left font-medium">Remove</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((u) => {
              const editable = canManageUser(me.role, u.role) && !busy;
              return (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-5 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-ink-muted">{u.email}</p></td>
                  <td className="px-5 py-3">
                    {editable && ownerOnly && u.id !== me.id ? (
                      <select defaultValue={u.role} onChange={(e) => patch(u.id, { role: e.target.value as Role })} className="h-8 px-2 rounded-lg border border-line bg-white text-xs">
                        <option value="teacher">Teacher</option><option value="manager">Manager</option><option value="owner">Owner</option>
                      </select>
                    ) : <span>{roleLabel[u.role]}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? (
                      <input type="date" defaultValue={u.startDate ?? ""} onBlur={(e) => { const v = e.target.value || null; if (v !== (u.startDate ?? null)) patch(u.id, { startDate: v }); }} className="h-8 px-2 rounded-lg border border-line text-xs" />
                    ) : <span className="text-xs text-ink-muted">{u.startDate ? fmtDate(u.startDate) : "—"}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? (
                      <input type="text" maxLength={80} defaultValue={u.designation ?? ""} onBlur={(e) => { const v = e.target.value.trim() || null; if (v !== (u.designation ?? null)) patch(u.id, { designation: v }); }} placeholder="—" className="w-36 h-8 px-2 rounded-lg border border-line text-xs" />
                    ) : <span className="text-xs text-ink-muted">{u.designation || "—"}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? <input type="number" defaultValue={u.annualEntitlement} onBlur={(e) => { const v = Number(e.target.value); if (v !== u.annualEntitlement) patch(u.id, { annualEntitlement: v }); }} className="w-16 h-8 px-2 rounded-lg border border-line" /> : u.annualEntitlement}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? <input type="number" defaultValue={u.sickEntitlement} onBlur={(e) => { const v = Number(e.target.value); if (v !== u.sickEntitlement) patch(u.id, { sickEntitlement: v }); }} className="w-16 h-8 px-2 rounded-lg border border-line" /> : u.sickEntitlement}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? (
                      <button type="button" onClick={() => patch(u.id, { partTime: !u.partTime })} className={`text-xs px-2 py-1 rounded-full ${u.partTime ? "bg-sole/50 text-ink" : "bg-ink/5 text-ink-muted"}`}>{u.partTime ? "Part-time" : "Full-time"}</button>
                    ) : <span className={`text-xs px-2 py-1 rounded-full ${u.partTime ? "bg-sole/50 text-ink" : "bg-ink/5 text-ink-muted"}`}>{u.partTime ? "Part-time" : "Full-time"}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editable ? (
                      <div className="flex gap-1">
                        {REST_DAYS.map((d) => {
                          const on = (restState[u.id] ?? []).includes(d.n);
                          return (
                            <button key={d.n} type="button" title={d.label} onClick={() => toggleRest(u.id, d.n)} className={`w-7 h-7 rounded-md text-[11px] font-semibold ${on ? "bg-azzurro-deep text-cream" : "bg-ink/5 text-ink-muted hover:bg-ink/10"}`}>{d.label[0]}</button>
                          );
                        })}
                      </div>
                    ) : <span className="text-xs text-ink-muted">{(u.restDays ?? []).length ? (u.restDays ?? []).map((n) => REST_DAYS.find((r) => r.n === n)?.label).join(", ") : "—"}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editable && u.id !== me.id ? (
                      <button onClick={() => patch(u.id, { active: !u.active })} className={`text-xs px-2 py-1 rounded-full ${u.active ? "bg-green-100 text-green-800" : "bg-ink/5 text-ink-muted"}`}>{u.active ? "Active" : "Inactive"}</button>
                    ) : <span className={`text-xs px-2 py-1 rounded-full ${u.active ? "bg-green-100 text-green-800" : "bg-ink/5 text-ink-muted"}`}>{u.active ? "Active" : "Inactive"}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {canManageUser(me.role, u.role) && u.id !== me.id ? (
                      <button type="button" onClick={() => reset(u.id)} disabled={busy} className="text-xs px-2.5 py-1 rounded-full border border-line bg-white hover:border-ink-muted disabled:opacity-50">Reset</button>
                    ) : <span className="text-xs text-ink-soft">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {canManageUser(me.role, u.role) && u.id !== me.id ? (
                      <button type="button" onClick={() => remove(u)} disabled={busy} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-rosso/30 text-rosso hover:bg-rosso/10 disabled:opacity-50"><Trash2 size={13} aria-hidden /> Delete</button>
                    ) : <span className="text-xs text-ink-soft">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
