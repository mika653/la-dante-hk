import { listRegistrations } from "@/lib/event-actions";
import { getSession } from "@/lib/auth";
import RegistrationsClient from "./RegistrationsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Event registrations — Admin — La Dante HK" };

export default async function AdminRegistrationsPage() {
  let rows: Awaited<ReturnType<typeof listRegistrations>> = [];
  let error: string | null = null;
  try {
    rows = await listRegistrations();
  } catch {
    error = "Please sign in as an owner or manager to see registrations.";
  }
  const session = await getSession();
  const isOwner = session?.role === "owner";

  return (
    <RegistrationsClient
      error={error}
      isOwner={isOwner}
      rows={rows.map((r) => ({
        id: r.id, eventId: r.eventId, eventTitle: r.eventTitle, eventDate: r.eventDate,
        name: r.name, email: r.email, phone: r.phone, ageGroup: r.ageGroup,
        isStudent: r.isStudent, createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
