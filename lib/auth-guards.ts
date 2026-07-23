import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type Role } from "@/lib/db/schema";
import { getSession, isAdmin } from "@/lib/auth";

export type FreshUser = { userId: string; role: Role; name: string; email: string };

// Re-reads the caller from the database instead of trusting the session token,
// which carries the role from when it was issued (up to 30 days ago). Used to
// gate writes: a demoted or deactivated account can't act on a stale token.
async function fresh(): Promise<FreshUser | null> {
  const s = await getSession();
  if (!s) return null;
  const [u] = await db
    .select({ id: users.id, role: users.role, active: users.active, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, s.userId));
  if (!u || !u.active) return null;
  return { userId: u.id, role: u.role, name: u.name, email: u.email };
}

export async function requireAdminFresh(): Promise<FreshUser> {
  const u = await fresh();
  if (!u || !isAdmin(u.role)) throw new Error("Not authorised");
  return u;
}

export async function requireOwnerFresh(): Promise<FreshUser> {
  const u = await fresh();
  if (!u || u.role !== "owner") throw new Error("Not authorised");
  return u;
}
