import { requireRole } from "@/lib/auth";
import AdminShell from "./AdminShell";

export const metadata = { title: "Admin — La Dante HK" };
// Session-dependent gate: never prerender or cache the admin shell.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Real login only. No session → /login; a teacher → their own /leave page.
  const session = await requireRole(["owner", "manager"]);
  return (
    <AdminShell userName={session.name} role={session.role}>
      {children}
    </AdminShell>
  );
}
