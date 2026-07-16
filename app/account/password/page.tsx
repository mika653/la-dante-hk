import { requireUser } from "@/lib/auth";
import PasswordClient from "./PasswordClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Change password — La Dante HK" };

export default async function ChangePasswordPage() {
  // Signed-in staff only; requireUser bounces everyone else to /login.
  const session = await requireUser();
  return <PasswordClient name={session.name} email={session.email} />;
}
