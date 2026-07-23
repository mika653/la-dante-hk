"use server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, destroySession, roleHome } from "@/lib/auth";

export type LoginState = { error?: string };

// Best-effort brute-force throttle. In-memory, so it's per warm serverless
// instance (not a distributed rate limiter) — but combined with the delay on
// failure it makes password guessing far slower. Keyed by IP + email.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 8;
const fails = new Map<string, { count: number; first: number }>();

function isLocked(key: string): boolean {
  const rec = fails.get(key);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) { fails.delete(key); return false; }
  return rec.count >= MAX_FAILS;
}
function recordFail(key: string) {
  const rec = fails.get(key);
  if (!rec || Date.now() - rec.first > WINDOW_MS) fails.set(key, { count: 1, first: Date.now() });
  else rec.count += 1;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const key = `${ip}|${email}`;

  if (isLocked(key)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const u = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!u || !u.active || !(await bcrypt.compare(password, u.passwordHash))) {
    recordFail(key);
    // Slow down guessing and blur the timing between "no such user" and "wrong password".
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Invalid email or password." };
  }

  fails.delete(key);
  await createSession({ userId: u.id, role: u.role, name: u.name, email: u.email });
  redirect(roleHome(u.role));
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
