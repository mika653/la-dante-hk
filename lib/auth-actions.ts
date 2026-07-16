"use server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, destroySession, roleHome } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password." };

  const u = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!u || !u.active || !(await bcrypt.compare(password, u.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  await createSession({ userId: u.id, role: u.role, name: u.name, email: u.email });
  redirect(roleHome(u.role));
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
