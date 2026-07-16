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
import { workingDays, canManageUser, canDecide } from "@/lib/leave-core";

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
  const endDate = String(formData.get("endDate") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (type !== "annual" && type !== "sick") return { ok: false, error: "Pick annual or sick leave." };
  if (!ISO.test(startDate) || !ISO.test(endDate)) return { ok: false, error: "Pick both dates." };
  if (endDate < startDate) return { ok: false, error: "The end date is before the start date." };

  // Recomputed here, never taken from the form — the browser could send anything.
  const days = workingDays(startDate, endDate);
  if (days < 1) return { ok: false, error: "That range has no working days in it." };

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
  });

  revalidatePath("/leave");
  return { ok: true, message: `${name} added. One-time password: ${password} — give it to them privately; it won't be shown again.` };
}

export async function updateUser(
  id: string,
  patch: { role?: Role; annualEntitlement?: number; sickEntitlement?: number; active?: boolean },
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
