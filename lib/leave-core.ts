// Pure leave helpers — no database, no React, no storage. Safe to import from
// server actions, server components and the client alike.

import type { Role, LeaveType, LeaveStatus } from "@/lib/db/schema";

export const roleLabel: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  teacher: "Teacher",
};

export const statusStyle: Record<LeaveStatus, string> = {
  pending: "bg-sole/40 text-ink",
  approved: "bg-green-100 text-green-800",
  declined: "bg-rosso/10 text-rosso",
  cancelled: "bg-ink/5 text-ink-muted",
};

export function currentYear(): number {
  return new Date().getFullYear();
}

/** Count Mon–Fri days between two ISO dates, inclusive. Weekends don't cost leave. */
export function workingDays(startISO: string, endISO: string): number {
  if (!startISO || !endISO || endISO < startISO) return 0;
  const [ys, ms, ds] = startISO.split("-").map(Number);
  const [ye, me, de] = endISO.split("-").map(Number);
  if (!ys || !ms || !ds || !ye || !me || !de) return 0;
  const cur = new Date(ys, ms - 1, ds);
  const end = new Date(ye, me - 1, de);
  let n = 0;
  while (cur <= end) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) n++;
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

export type LeaveLike = {
  userId: string;
  type: LeaveType;
  startDate: string;
  days: number;
  status: LeaveStatus;
};

export type Balance = { entitlement: number; approved: number; pending: number; remaining: number };

/**
 * Leave standing for one person, one type, one year.
 * `remaining` counts only approved days — pending requests are shown separately
 * so nobody's balance silently drops before a manager has decided.
 */
export function balanceFor(
  userId: string,
  type: LeaveType,
  entitlement: number,
  leave: LeaveLike[],
  year = currentYear(),
): Balance {
  const mine = leave.filter(
    (l) => l.userId === userId && l.type === type && Number(l.startDate.slice(0, 4)) === year,
  );
  const approved = mine.filter((l) => l.status === "approved").reduce((s, l) => s + l.days, 0);
  const pending = mine.filter((l) => l.status === "pending").reduce((s, l) => s + l.days, 0);
  return { entitlement, approved, pending, remaining: Math.max(0, entitlement - approved) };
}

/** "2026-08-03" → "3/8/2026" (day/month/year, as Hong Kong reads it). */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/**
 * Who may act on whom. A manager looks after teachers only; the owner may do
 * anything. Mirrored on the server in leave-actions — never trust this alone.
 */
export function canManageUser(actor: Role, target: Role): boolean {
  if (actor === "owner") return true;
  if (actor === "manager") return target === "teacher";
  return false;
}

/** Nobody signs off their own leave except the owner, who has nobody above them. */
export function canDecide(actor: Role, actorId: string, requestUserId: string): boolean {
  if (actor === "owner") return true;
  if (actor === "manager") return actorId !== requestUserId;
  return false;
}
