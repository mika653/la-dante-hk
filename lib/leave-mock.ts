"use client";
// MOCK leave + permissions store (localStorage). Mirrors the real DB model so the
// screens can be built and demoed now; swaps to Postgres later with no UI changes.

export type Role = "owner" | "manager" | "teacher";
export type LeaveType = "annual" | "sick";
export type LeaveStatus = "pending" | "approved" | "declined" | "cancelled";

export type MockUser = {
  id: string; email: string; name: string; role: Role;
  annualEntitlement: number; sickEntitlement: number; active: boolean;
};
export type MockLeave = {
  id: string; userId: string; type: LeaveType;
  startDate: string; endDate: string; days: number; reason?: string;
  status: LeaveStatus; decidedBy?: string; decidedAt?: string; createdAt: string;
};

export const isAdmin = (r: Role) => r === "owner" || r === "manager";
export const roleLabel: Record<Role, string> = { owner: "Owner", manager: "Manager", teacher: "Teacher" };

const U_KEY = "ladante-mock-users";
const L_KEY = "ladante-mock-leave";
const C_KEY = "ladante-mock-current";

const SEED_USERS: MockUser[] = [
  { id: "u-giulia", email: "giulia@ladante.hk", name: "Giulia Capasso", role: "owner", annualEntitlement: 20, sickEntitlement: 14, active: true },
  { id: "u-bill", email: "bill@ladante.hk", name: "Bill", role: "manager", annualEntitlement: 14, sickEntitlement: 14, active: true },
  { id: "u-marco", email: "marco@ladante.hk", name: "Marco Rossi", role: "teacher", annualEntitlement: 14, sickEntitlement: 14, active: true },
  { id: "u-sofia", email: "sofia@ladante.hk", name: "Sofia Bianchi", role: "teacher", annualEntitlement: 14, sickEntitlement: 14, active: true },
  { id: "u-elena", email: "elena@ladante.hk", name: "Elena Conti", role: "teacher", annualEntitlement: 14, sickEntitlement: 14, active: true },
  { id: "u-anna", email: "anna@ladante.hk", name: "Anna De Luca", role: "teacher", annualEntitlement: 14, sickEntitlement: 14, active: true },
];

const SEED_LEAVE: MockLeave[] = [
  { id: "l1", userId: "u-marco", type: "annual", startDate: "2026-03-10", endDate: "2026-03-12", days: 3, reason: "Family trip", status: "approved", decidedBy: "u-bill", decidedAt: "2026-02-20", createdAt: "2026-02-18" },
  { id: "l2", userId: "u-marco", type: "sick", startDate: "2026-02-05", endDate: "2026-02-05", days: 1, reason: "Flu", status: "approved", decidedBy: "u-bill", decidedAt: "2026-02-05", createdAt: "2026-02-05" },
  { id: "l3", userId: "u-marco", type: "annual", startDate: "2026-08-03", endDate: "2026-08-04", days: 2, reason: "Long weekend", status: "pending", createdAt: "2026-07-10" },
  { id: "l4", userId: "u-sofia", type: "annual", startDate: "2026-04-06", endDate: "2026-04-10", days: 5, reason: "Holiday", status: "approved", decidedBy: "u-giulia", decidedAt: "2026-03-15", createdAt: "2026-03-12" },
  { id: "l5", userId: "u-sofia", type: "sick", startDate: "2026-05-18", endDate: "2026-05-19", days: 2, status: "approved", decidedBy: "u-bill", decidedAt: "2026-05-18", createdAt: "2026-05-18" },
  { id: "l6", userId: "u-elena", type: "annual", startDate: "2026-08-17", endDate: "2026-08-20", days: 4, reason: "Trip to Italy", status: "pending", createdAt: "2026-07-12" },
  { id: "l7", userId: "u-anna", type: "sick", startDate: "2026-06-01", endDate: "2026-06-03", days: 3, reason: "Unwell", status: "approved", decidedBy: "u-bill", decidedAt: "2026-06-01", createdAt: "2026-06-01" },
  { id: "l8", userId: "u-anna", type: "annual", startDate: "2026-09-14", endDate: "2026-09-15", days: 2, status: "pending", createdAt: "2026-07-13" },
  { id: "l9", userId: "u-bill", type: "annual", startDate: "2026-07-27", endDate: "2026-07-30", days: 4, reason: "Break", status: "approved", decidedBy: "u-giulia", decidedAt: "2026-07-01", createdAt: "2026-06-28" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write<T>(key: string, v: T) { if (typeof window !== "undefined") { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} } }

export function getUsers(): MockUser[] { return read(U_KEY, SEED_USERS); }
export function saveUsers(u: MockUser[]) { write(U_KEY, u); }
export function getLeave(): MockLeave[] { return read(L_KEY, SEED_LEAVE); }
export function saveLeave(l: MockLeave[]) { write(L_KEY, l); }

export function getCurrentUserId(): string { return read(C_KEY, "u-giulia"); }
export function setCurrentUserId(id: string) { write(C_KEY, id); }

export function resetMock() {
  if (typeof window === "undefined") return;
  [U_KEY, L_KEY, C_KEY].forEach((k) => localStorage.removeItem(k));
}

// --- helpers ---
export function currentYear(): number { return new Date().getFullYear(); }

/** Count Mon–Fri days between two ISO dates (inclusive). */
export function workingDays(startISO: string, endISO: string): number {
  if (!startISO || !endISO || endISO < startISO) return 0;
  const [ys, ms, ds] = startISO.split("-").map(Number);
  const [ye, me, de] = endISO.split("-").map(Number);
  let cur = new Date(ys, ms - 1, ds);
  const end = new Date(ye, me - 1, de);
  let n = 0;
  while (cur <= end) { const d = cur.getDay(); if (d !== 0 && d !== 6) n++; cur.setDate(cur.getDate() + 1); }
  return n;
}

export type Balance = { entitlement: number; approved: number; pending: number; remaining: number };

export function balanceFor(userId: string, type: LeaveType, users: MockUser[], leave: MockLeave[], year = currentYear()): Balance {
  const u = users.find((x) => x.id === userId);
  const entitlement = type === "annual" ? (u?.annualEntitlement ?? 0) : (u?.sickEntitlement ?? 0);
  const mine = leave.filter((l) => l.userId === userId && l.type === type && Number(l.startDate.slice(0, 4)) === year);
  const approved = mine.filter((l) => l.status === "approved").reduce((s, l) => s + l.days, 0);
  const pending = mine.filter((l) => l.status === "pending").reduce((s, l) => s + l.days, 0);
  return { entitlement, approved, pending, remaining: Math.max(0, entitlement - approved) };
}
