"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { CalendarDays, Check, X, Plus, RotateCcw, UserPlus, ShieldCheck } from "lucide-react";
import {
  getUsers, saveUsers, getLeave, saveLeave, getCurrentUserId, setCurrentUserId, resetMock,
  balanceFor, workingDays, isAdmin, roleLabel, currentYear,
  type MockUser, type MockLeave, type Role, type LeaveType, type LeaveStatus,
} from "@/lib/leave-mock";

function todayISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function fmt(iso: string) { const [y, m, d] = iso.split("-").map(Number); return `${d}/${m}/${y}`; }
const STATUS: Record<LeaveStatus, string> = {
  pending: "bg-sole/40 text-ink", approved: "bg-green-100 text-green-800",
  declined: "bg-rosso/10 text-rosso", cancelled: "bg-ink/5 text-ink-muted",
};

export default function LeavePage() {
  const [users, setUsersS] = useState<MockUser[]>([]);
  const [leave, setLeaveS] = useState<MockLeave[]>([]);
  const [currentId, setCurrentId] = useState("u-giulia");
  const [tab, setTab] = useState<"me" | "team" | "staff">("me");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setUsersS(getUsers()); setLeaveS(getLeave()); setCurrentId(getCurrentUserId()); setMounted(true); }, []);
  const refresh = () => { setUsersS(getUsers()); setLeaveS(getLeave()); };

  const me = users.find((u) => u.id === currentId);
  const admin = me ? isAdmin(me.role) : false;
  useEffect(() => { if (me && !isAdmin(me.role) && tab !== "me") setTab("me"); }, [me, tab]);

  function switchUser(id: string) {
    setCurrentUserId(id); setCurrentId(id);
    const u = getUsers().find((x) => x.id === id);
    if (u && !isAdmin(u.role)) setTab("me");
  }
  function reset() { if (!confirm("Reset the demo leave data?")) return; resetMock(); setUsersS(getUsers()); setLeaveS(getLeave()); setCurrentId("u-giulia"); setCurrentUserId("u-giulia"); setTab("me"); }

  if (!mounted) return null;
  if (!me) return <main className="p-8">No user.</main>;

  return (
    <main className="min-h-screen bg-cream">
      {/* top bar */}
      <div className="bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="La Dante" width={140} height={40} className="h-8 w-auto bg-cream rounded px-2 py-1" />
            <span className="font-heading font-bold">Staff leave</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-cream/70">Viewing as</span>
              <select value={currentId} onChange={(e) => switchUser(e.target.value)} className="h-9 px-3 rounded-lg bg-cream text-ink border-0">
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {roleLabel[u.role]}</option>)}
              </select>
            </label>
            <button onClick={reset} title="Reset demo data" className="text-cream/70 hover:text-cream inline-flex items-center gap-1"><RotateCcw size={14} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* demo note */}
        <div className="frame p-3 bg-azzurro-soft border border-azzurro-deep/20 text-sm mb-6 flex items-start gap-2">
          <ShieldCheck size={16} className="text-azzurro-deep shrink-0 mt-0.5" />
          <span><b>Demo of permissions.</b> Switch “Viewing as” above to experience each level — a <b>Teacher</b> only sees their own leave; a <b>Manager</b> and <b>Owner</b> also see the team and staff controls. In the live version each person logs in with their own password.</span>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <TabBtn on={tab === "me"} onClick={() => setTab("me")}>My leave</TabBtn>
          {admin && <TabBtn on={tab === "team"} onClick={() => setTab("team")}>Team leave</TabBtn>}
          {admin && <TabBtn on={tab === "staff"} onClick={() => setTab("staff")}>Staff</TabBtn>}
          <span className="ml-auto text-sm text-ink-muted">Signed in as <b className="text-ink">{me.name}</b> · {roleLabel[me.role]}</span>
        </div>

        {tab === "me" && <MyLeave me={me} users={users} leave={leave} refresh={refresh} />}
        {tab === "team" && admin && <TeamLeave me={me} users={users} leave={leave} refresh={refresh} />}
        {tab === "staff" && admin && <Staff me={me} users={users} refresh={refresh} />}
      </div>
    </main>
  );
}

function TabBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium border ${on ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted bg-white"}`}>{children}</button>;
}

// ---------------- MY LEAVE ----------------
function MyLeave({ me, users, leave, refresh }: { me: MockUser; users: MockUser[]; leave: MockLeave[]; refresh: () => void }) {
  const [type, setType] = useState<LeaveType>("annual");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const days = useMemo(() => workingDays(start, end), [start, end]);
  const mine = leave.filter((l) => l.userId === me.id).sort((a, b) => b.startDate.localeCompare(a.startDate));

  function submit() {
    if (!start || !end || days < 1) { alert("Pick a valid date range (at least one working day)."); return; }
    const next: MockLeave = { id: `l-${Date.now()}`, userId: me.id, type, startDate: start, endDate: end, days, reason: reason.trim() || undefined, status: "pending", createdAt: todayISO() };
    saveLeave([...getLeave(), next]); refresh(); setStart(""); setEnd(""); setReason("");
  }
  function cancel(id: string) { saveLeave(getLeave().map((l) => (l.id === id ? { ...l, status: "cancelled" as LeaveStatus } : l))); refresh(); }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {(["annual", "sick"] as LeaveType[]).map((t) => {
          const b = balanceFor(me.id, t, users, leave);
          return (
            <div key={t} className="frame bg-white p-5">
              <p className="eyebrow">{t === "annual" ? "Annual leave" : "Sick leave"} · {currentYear()}</p>
              <p className="mt-2 text-3xl font-heading font-bold">{b.remaining}<span className="text-lg text-ink-muted font-body font-normal"> / {b.entitlement} days left</span></p>
              <div className="mt-3 h-2 rounded-full bg-cream-2 overflow-hidden">
                <div className="h-full bg-azzurro-deep" style={{ width: `${b.entitlement ? (b.approved / b.entitlement) * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{b.approved} taken · {b.pending} pending</p>
            </div>
          );
        })}
      </div>

      {/* request form */}
      <div className="frame bg-white p-5 md:p-6">
        <h2 className="font-heading font-bold text-lg">Request leave</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              {(["annual", "sick"] as LeaveType[]).map((t) => (
                <button key={t} onClick={() => setType(t)} className={`px-5 py-2.5 rounded-full border text-sm ${type === t ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{t === "annual" ? "Annual" : "Sick"}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">From<input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
            <label className="text-sm font-medium">To<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          </div>
        </div>
        <label className="block text-sm font-medium mt-4">Reason <span className="text-ink-muted font-normal">(optional)</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" />
        </label>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-ink-muted">{days > 0 ? <><b className="text-ink">{days}</b> working day{days === 1 ? "" : "s"}</> : "Select dates"}</span>
          <button onClick={submit} className="btn btn-primary"><Plus size={16} /> Submit request</button>
        </div>
      </div>

      {/* my history */}
      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">My requests</div>
        <table className="w-full text-sm">
          <tbody>
            {mine.length === 0 && <tr><td className="p-6 text-center text-ink-muted">No requests yet.</td></tr>}
            {mine.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-5 py-3">{fmt(l.startDate)}{l.endDate !== l.startDate && <> – {fmt(l.endDate)}</>}</td>
                <td className="px-5 py-3 capitalize">{l.type}</td>
                <td className="px-5 py-3">{l.days}d</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs capitalize ${STATUS[l.status]}`}>{l.status}</span></td>
                <td className="px-5 py-3 text-right">{l.status === "pending" && <button onClick={() => cancel(l.id)} className="text-xs text-ink-muted hover:text-rosso">Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- TEAM LEAVE (admin) ----------------
function TeamLeave({ me, users, leave, refresh }: { me: MockUser; users: MockUser[]; leave: MockLeave[]; refresh: () => void }) {
  const pending = leave.filter((l) => l.status === "pending").sort((a, b) => a.startDate.localeCompare(b.startDate));
  const nameOf = (id: string) => users.find((u) => u.id === id)?.name ?? "—";
  function decide(id: string, status: LeaveStatus) {
    saveLeave(getLeave().map((l) => (l.id === id ? { ...l, status, decidedBy: me.id, decidedAt: todayISO() } : l))); refresh();
  }
  const team = users.filter((u) => u.role === "teacher" || u.role === "manager");

  return (
    <div className="space-y-6">
      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">Pending approvals ({pending.length})</div>
        {pending.length === 0 ? <p className="p-6 text-center text-ink-muted text-sm">Nothing waiting — all caught up.</p> : (
          <ul>
            {pending.map((l) => (
              <li key={l.id} className="flex items-center gap-4 px-5 py-4 border-t border-line flex-wrap">
                <div className="flex-1 min-w-[220px]">
                  <p className="font-medium">{nameOf(l.userId)} <span className="text-ink-muted font-normal capitalize">· {l.type} leave</span></p>
                  <p className="text-sm text-ink-muted">{fmt(l.startDate)}{l.endDate !== l.startDate && <> – {fmt(l.endDate)}</>} · {l.days} day{l.days === 1 ? "" : "s"}{l.reason && <> · “{l.reason}”</>}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decide(l.id, "approved")} className="btn btn-primary h-9 px-4 text-sm"><Check size={15} /> Approve</button>
                  <button onClick={() => decide(l.id, "declined")} className="btn btn-ghost h-9 px-4 text-sm"><X size={15} /> Decline</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">Team balances · {currentYear()}</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr><th className="px-5 py-2 text-left font-medium">Name</th><th className="px-5 py-2 text-left font-medium">Annual (left / total)</th><th className="px-5 py-2 text-left font-medium">Sick (left / total)</th><th className="px-5 py-2 text-left font-medium">Pending</th></tr>
          </thead>
          <tbody>
            {team.map((u) => {
              const a = balanceFor(u.id, "annual", users, leave); const s = balanceFor(u.id, "sick", users, leave);
              return (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3">{a.remaining} / {a.entitlement}</td>
                  <td className="px-5 py-3">{s.remaining} / {s.entitlement}</td>
                  <td className="px-5 py-3">{a.pending + s.pending > 0 ? <span className="px-2 py-0.5 rounded-full text-xs bg-sole/40">{a.pending + s.pending}d</span> : "—"}</td>
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
function Staff({ me, users, refresh }: { me: MockUser; users: MockUser[]; refresh: () => void }) {
  const ownerOnly = me.role === "owner";
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("teacher"); const [annual, setAnnual] = useState(14); const [sick, setSick] = useState(14);

  function add() {
    if (!name.trim() || !email.trim()) { alert("Name and email are required."); return; }
    const u: MockUser = { id: `u-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), role, annualEntitlement: annual, sickEntitlement: sick, active: true };
    saveUsers([...getUsers(), u]); refresh(); setName(""); setEmail(""); setRole("teacher"); setAnnual(14); setSick(14);
  }
  function patch(id: string, p: Partial<MockUser>) { saveUsers(getUsers().map((u) => (u.id === id ? { ...u, ...p } : u))); refresh(); }
  // A manager may not create or edit owners/managers.
  const canEdit = (u: MockUser) => ownerOnly || u.role === "teacher";

  return (
    <div className="space-y-6">
      <div className="frame bg-white p-5 md:p-6">
        <h2 className="font-heading font-bold text-lg inline-flex items-center gap-2"><UserPlus size={18} /> Add a user</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <label className="text-sm font-medium">Name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <label className="text-sm font-medium">Email<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          <label className="text-sm font-medium">Role
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white">
              <option value="teacher">Teacher</option>
              {ownerOnly && <option value="manager">Manager</option>}
              {ownerOnly && <option value="owner">Owner</option>}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">Annual days<input type="number" value={annual} onChange={(e) => setAnnual(Number(e.target.value))} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
            <label className="text-sm font-medium">Sick days<input type="number" value={sick} onChange={(e) => setSick(Number(e.target.value))} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white" /></label>
          </div>
        </div>
        <div className="mt-4 flex justify-end"><button onClick={add} className="btn btn-primary"><Plus size={16} /> Add user</button></div>
        {!ownerOnly && <p className="mt-2 text-xs text-ink-muted">As a Manager you can add and manage teachers. Only the Owner can create or edit managers and owners.</p>}
      </div>

      <div className="frame bg-white overflow-hidden">
        <div className="px-5 py-3 bg-cream-2 text-xs uppercase tracking-wider text-ink-muted font-medium">Staff ({users.length})</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr><th className="px-5 py-2 text-left font-medium">Name</th><th className="px-5 py-2 text-left font-medium">Role</th><th className="px-5 py-2 text-left font-medium">Annual</th><th className="px-5 py-2 text-left font-medium">Sick</th><th className="px-5 py-2 text-left font-medium">Status</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-5 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-ink-muted">{u.email}</p></td>
                <td className="px-5 py-3">
                  {canEdit(u) && ownerOnly ? (
                    <select value={u.role} onChange={(e) => patch(u.id, { role: e.target.value as Role })} className="h-8 px-2 rounded-lg border border-line bg-white text-xs">
                      <option value="teacher">Teacher</option><option value="manager">Manager</option><option value="owner">Owner</option>
                    </select>
                  ) : <span className="capitalize">{roleLabel[u.role]}</span>}
                </td>
                <td className="px-5 py-3">{canEdit(u) ? <input type="number" value={u.annualEntitlement} onChange={(e) => patch(u.id, { annualEntitlement: Number(e.target.value) })} className="w-16 h-8 px-2 rounded-lg border border-line" /> : u.annualEntitlement}</td>
                <td className="px-5 py-3">{canEdit(u) ? <input type="number" value={u.sickEntitlement} onChange={(e) => patch(u.id, { sickEntitlement: Number(e.target.value) })} className="w-16 h-8 px-2 rounded-lg border border-line" /> : u.sickEntitlement}</td>
                <td className="px-5 py-3">
                  {canEdit(u) && u.id !== me.id ? (
                    <button onClick={() => patch(u.id, { active: !u.active })} className={`text-xs px-2 py-1 rounded-full ${u.active ? "bg-green-100 text-green-800" : "bg-ink/5 text-ink-muted"}`}>{u.active ? "Active" : "Inactive"}</button>
                  ) : <span className={`text-xs px-2 py-1 rounded-full ${u.active ? "bg-green-100 text-green-800" : "bg-ink/5 text-ink-muted"}`}>{u.active ? "Active" : "Inactive"}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
