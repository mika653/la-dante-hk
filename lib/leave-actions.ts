"use server";
// Server actions for staff leave.
//
// Every action re-reads the session and re-checks permissions here. The client
// hides buttons it shouldn't show, but that is cosmetic: anyone can post to a
// server action directly, so the rules below are the ones that actually hold.

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { users, leaveRequests, type Role, type LeaveType, type LeaveStatus } from "@/lib/db/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { workingDays, canManageUser, canDecide, restDayHolidaysInLieu } from "@/lib/leave-core";
import { getClosures } from "@/lib/closures-actions";
import { holidaySet } from "@/lib/closures-shared";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

async function requireSession() {
  const s = await getSession();
  if (!s) throw new Error("Not signed in");
  return s;
}

// ---------------- requesting ----------------

export async function requestLeave(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const s = await requireSession();

  const type = String(formData.get("type") ?? "") as LeaveType;
  const startDate = String(formData.get("startDate") ?? "");
  const halfDay = String(formData.get("halfDay") ?? "") === "1";
  // A half day is always a single day — ignore whatever end the form sent.
  const endDate = halfDay ? startDate : String(formData.get("endDate") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (type !== "annual" && type !== "sick") return { ok: false, error: "Pick annual or sick leave." };
  if (!ISO.test(startDate)) return { ok: false, error: halfDay ? "Pick a date." : "Pick both dates." };
  if (!halfDay && !ISO.test(endDate)) return { ok: false, error: "Pick both dates." };
  if (endDate < startDate) return { ok: false, error: "The end date is before the start date." };

  // Recomputed here, never taken from the form — the browser could send anything.
  // A half day only counts if it lands on a working day (Sundays never count).
  const days = halfDay ? (workingDays(startDate, startDate) >= 1 ? 0.5 : 0) : workingDays(startDate, endDate);
  if (days < 0.5) return { ok: false, error: halfDay ? "That day is a Sunday — pick a working day." : "That range has no working days in it (Sundays don't count)." };

  // Don't let anyone request more than their yearly entitlement (counting days
  // already approved OR still pending for that type this year).
  const [u] = await db
    .select({ annual: users.annualEntitlement, sick: users.sickEntitlement, restDays: users.restDays })
    .from(users)
    .where(eq(users.id, s.userId));
  const year = Number(startDate.slice(0, 4));
  let entitlement = type === "annual" ? (u?.annual ?? 0) : (u?.sick ?? 0);
  // Annual leave gets +1 day in lieu for each public holiday that falls on this
  // person's rest day(s) that year (Sunday never counts).
  if (type === "annual") {
    const { holidays } = await getClosures();
    entitlement += restDayHolidaysInLieu([...holidaySet(holidays)], u?.restDays, year);
  }
  const mine = await db
    .select({ days: leaveRequests.days, status: leaveRequests.status, startDate: leaveRequests.startDate, type: leaveRequests.type })
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, s.userId));
  const used = mine
    .filter((l) => l.type === type && Number(l.startDate.slice(0, 4)) === year && (l.status === "approved" || l.status === "pending"))
    .reduce((acc, l) => acc + l.days, 0);
  const available = entitlement - used;
  if (days > available) {
    return { ok: false, error: `That's more ${type} leave than you have left for ${year}: ${Math.max(0, available)} of ${entitlement} day${entitlement === 1 ? "" : "s"} remaining (approved + pending).` };
  }

  await db.insert(leaveRequests).values({
    userId: s.userId,
    type,
    startDate,
    endDate,
    days,
    reason: reason || null,
    status: "pending",
  });

  revalidatePath("/leave");
  return { ok: true, message: `Requested ${days} day${days === 1 ? "" : "s"}.` };
}

export async function cancelLeave(id: string): Promise<ActionResult> {
  const s = await requireSession();

  const [row] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
  if (!row) return { ok: false, error: "That request no longer exists." };
  if (row.userId !== s.userId) return { ok: false, error: "That isn't your request." };
  if (row.status !== "pending") return { ok: false, error: "Only a pending request can be cancelled." };

  await db.update(leaveRequests).set({ status: "cancelled" }).where(eq(leaveRequests.id, id));
  revalidatePath("/leave");
  return { ok: true };
}

// ---------------- approving ----------------

export async function decideLeave(id: string, status: "approved" | "declined"): Promise<ActionResult> {
  const s = await requireSession();
  if (!isAdmin(s.role)) return { ok: false, error: "You can't approve leave." };
  if (status !== "approved" && status !== "declined") return { ok: false, error: "Unknown decision." };

  const [row] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
  if (!row) return { ok: false, error: "That request no longer exists." };
  if (row.status !== "pending") return { ok: false, error: "That request has already been decided." };
  if (!canDecide(s.role, s.userId, row.userId)) {
    return { ok: false, error: "You can't approve your own leave — ask the owner." };
  }

  await db
    .update(leaveRequests)
    .set({ status: status as LeaveStatus, decidedBy: s.userId, decidedAt: new Date() })
    .where(and(eq(leaveRequests.id, id), eq(leaveRequests.status, "pending")));

  revalidatePath("/leave");
  return { ok: true };
}

// ---------------- staff ----------------

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const chars = Array.from(crypto.randomBytes(15), (b) => alphabet[b % alphabet.length]);
  return chars.join("").replace(/(.{5})(?=.)/g, "$1-");
}

/** Returns the new password once, for the admin to pass on. It is never stored in the clear. */
export async function addUser(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const s = await requireSession();
  if (!isAdmin(s.role)) return { ok: false, error: "You can't add staff." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "teacher") as Role;
  const annual = Number(formData.get("annual") ?? 14);
  const sick = Number(formData.get("sick") ?? 14);
  const partTime = String(formData.get("partTime") ?? "") === "1";
  const restDays = formData.getAll("restDay").map((v) => Number(v)).filter((n) => n >= 1 && n <= 6);
  const startDateRaw = String(formData.get("startDate") ?? "");
  const startDate = ISO.test(startDateRaw) ? startDateRaw : null;
  const designation = String(formData.get("designation") ?? "").trim().slice(0, 80) || null;

  if (!name) return { ok: false, error: "Name is required." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "That email doesn't look right." };
  if (!["owner", "manager", "teacher"].includes(role)) return { ok: false, error: "Unknown role." };
  if (!canManageUser(s.role, role)) return { ok: false, error: "A manager can only add teachers." };
  if (!Number.isInteger(annual) || annual < 0 || annual > 365) return { ok: false, error: "Annual days look wrong." };
  if (!Number.isInteger(sick) || sick < 0 || sick > 365) return { ok: false, error: "Sick days look wrong." };

  const [clash] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (clash) return { ok: false, error: "Someone already uses that email." };

  const password = generatePassword();
  await db.insert(users).values({
    name,
    email,
    role,
    passwordHash: await bcrypt.hash(password, 12),
    annualEntitlement: annual,
    sickEntitlement: sick,
    partTime,
    restDays: restDays.length ? restDays : null,
    startDate,
    designation,
  });

  revalidatePath("/leave");
  return { ok: true, message: `${name} added. One-time password: ${password} — give it to them privately; it won't be shown again.` };
}

/**
 * Reset another user's password to a fresh one-time password (returned once, for
 * the admin to pass on). Owner can reset anyone; a manager can reset teachers.
 */
export async function resetUserPassword(id: string): Promise<ActionResult> {
  const s = await requireSession();
  if (!isAdmin(s.role)) return { ok: false, error: "You can't reset passwords." };
  const [target] = await db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(eq(users.id, id));
  if (!target) return { ok: false, error: "User not found." };
  if (target.id === s.userId) return { ok: false, error: "Use Change password to change your own." };
  if (!canManageUser(s.role, target.role)) return { ok: false, error: "You can only reset your staff's passwords." };

  const password = generatePassword();
  await db.update(users).set({ passwordHash: await bcrypt.hash(password, 12) }).where(eq(users.id, id));
  revalidatePath("/leave");
  return { ok: true, message: `New one-time password for ${target.name}: ${password} — give it to them privately; it won't be shown again.` };
}

export async function updateUser(
  id: string,
  patch: { role?: Role; annualEntitlement?: number; sickEntitlement?: number; active?: boolean; partTime?: boolean; restDays?: number[]; startDate?: string | null; designation?: string | null },
): Promise<ActionResult> {
  const s = await requireSession();
  if (!isAdmin(s.role)) return { ok: false, error: "You can't edit staff." };

  const [target] = await db.select().from(users).where(eq(users.id, id));
  if (!target) return { ok: false, error: "That person no longer exists." };
  if (!canManageUser(s.role, target.role)) return { ok: false, error: "A manager can only edit teachers." };

  // Changing a role: you need rights over the role you're granting, too, or a
  // manager could promote a teacher to owner and inherit the whole dashboard.
  if (patch.role && !canManageUser(s.role, patch.role)) {
    return { ok: false, error: "You can't grant that role." };
  }
  if (patch.role && target.id === s.userId) {
    return { ok: false, error: "You can't change your own role." };
  }
  if (patch.active === false && target.id === s.userId) {
    return { ok: false, error: "You can't deactivate yourself." };
  }
  // Never let the last owner disappear — that would lock everyone out of the top level.
  if (target.role === "owner" && (patch.role || patch.active === false)) {
    const owners = await db.select({ id: users.id }).from(users).where(and(eq(users.role, "owner"), eq(users.active, true)));
    if (owners.length <= 1) return { ok: false, error: "This is the only owner — promote someone else first." };
  }

  const set: Record<string, unknown> = {};
  if (patch.role) set.role = patch.role;
  if (patch.active !== undefined) set.active = patch.active;
  if (patch.partTime !== undefined) set.partTime = !!patch.partTime;
  if (patch.restDays !== undefined) {
    const rd = (Array.isArray(patch.restDays) ? patch.restDays : []).filter((n) => n >= 1 && n <= 6);
    set.restDays = rd.length ? [...new Set(rd)].sort() : null;
  }
  if (patch.startDate !== undefined) set.startDate = patch.startDate && ISO.test(patch.startDate) ? patch.startDate : null;
  if (patch.designation !== undefined) set.designation = typeof patch.designation === "string" && patch.designation.trim() ? patch.designation.trim().slice(0, 80) : null;
  if (patch.annualEntitlement !== undefined) {
    if (!Number.isInteger(patch.annualEntitlement) || patch.annualEntitlement < 0 || patch.annualEntitlement > 365) {
      return { ok: false, error: "Annual days look wrong." };
    }
    set.annualEntitlement = patch.annualEntitlement;
  }
  if (patch.sickEntitlement !== undefined) {
    if (!Number.isInteger(patch.sickEntitlement) || patch.sickEntitlement < 0 || patch.sickEntitlement > 365) {
      return { ok: false, error: "Sick days look wrong." };
    }
    set.sickEntitlement = patch.sickEntitlement;
  }
  if (!Object.keys(set).length) return { ok: true };

  await db.update(users).set(set).where(eq(users.id, id));
  revalidatePath("/leave");
  return { ok: true };
}

/**
 * Permanently remove a staff member and all of their own leave requests (the
 * leave_requests FK cascades). Any requests THEY approved stay, but lose the
 * "decided by" link (set to null) so the delete doesn't trip that reference.
 * Owner can remove anyone; a manager can remove teachers. You can't remove
 * yourself, and the last owner can't be removed.
 */
export async function deleteUser(id: string): Promise<ActionResult> {
  const s = await requireSession();
  if (!isAdmin(s.role)) return { ok: false, error: "You can't remove staff." };

  const [target] = await db.select({ id: users.id, name: users.name, role: users.role }).from(users).where(eq(users.id, id));
  if (!target) return { ok: false, error: "That person no longer exists." };
  if (target.id === s.userId) return { ok: false, error: "You can't delete your own account." };
  if (!canManageUser(s.role, target.role)) return { ok: false, error: "A manager can only remove teachers." };
  if (target.role === "owner") {
    const owners = await db.select({ id: users.id }).from(users).where(eq(users.role, "owner"));
    if (owners.length <= 1) return { ok: false, error: "This is the only owner — promote someone else first." };
  }

  await db.update(leaveRequests).set({ decidedBy: null }).where(eq(leaveRequests.decidedBy, id));
  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/leave");
  return { ok: true, message: `${target.name} removed.` };
}
