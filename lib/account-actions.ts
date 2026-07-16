"use server";
// Let a signed-in person change their own password.
//
// Deliberately narrow: it only ever touches the caller's own row, taken from the
// session — never an id from the form. An admin cannot reach anyone else's
// password through here, and nobody can set one without proving they know the
// current one.

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export type PasswordState = { ok?: string; error?: string };

const MIN_LENGTH = 10;

export async function changePasswordAction(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const session = await getSession();
  if (!session) return { error: "Your session has expired — please sign in again." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next || !confirm) return { error: "Fill in all three boxes." };
  if (next !== confirm) return { error: "The new passwords don't match." };
  if (next.length < MIN_LENGTH) return { error: `Use at least ${MIN_LENGTH} characters.` };
  if (next === current) return { error: "That's the password you already have." };

  // Read the hash by session id, not by anything the form supplied.
  const [me] = await db.select({ id: users.id, passwordHash: users.passwordHash, active: users.active })
    .from(users)
    .where(eq(users.id, session.userId));
  if (!me || !me.active) return { error: "Your account is no longer active." };

  const matches = await bcrypt.compare(current, me.passwordHash);
  if (!matches) return { error: "Your current password isn't right." };

  await db.update(users).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(users.id, me.id));

  // The session is a signed JWT that carries no password, so it stays valid —
  // the person changing it keeps working without being kicked out.
  return { ok: "Password changed. Use the new one next time you sign in." };
}
