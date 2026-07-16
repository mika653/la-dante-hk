// Session helpers — signed JWT in an httpOnly cookie (jose). No DB session table.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/db/schema";

const COOKIE = "ladante_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-secret-change-me");
}

export type Session = { userId: string; role: Role; name: string; email: string };

export async function createSession(s: Session) {
  const token = await new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

// Route guards for server components / actions.
export async function requireUser(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}

export async function requireRole(roles: Role[]): Promise<Session> {
  const s = await requireUser();
  if (!roles.includes(s.role)) redirect("/leave"); // no access -> send to their own leave page
  return s;
}

export const isAdmin = (role: Role) => role === "owner" || role === "manager";

// Where each role lands after login.
export function roleHome(role: Role): string {
  return isAdmin(role) ? "/admin" : "/leave";
}
