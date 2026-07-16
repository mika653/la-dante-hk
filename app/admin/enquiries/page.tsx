import { listEnquiries } from "@/lib/enquiry-actions";
import { getSession } from "@/lib/auth";
import EnquiriesClient from "./EnquiriesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries — Admin — La Dante HK" };

export default async function AdminEnquiriesPage() {
  // listEnquiries throws if not an admin; the admin layout also gates access.
  let rows: Awaited<ReturnType<typeof listEnquiries>> = [];
  let error: string | null = null;
  try {
    rows = await listEnquiries();
  } catch {
    error = "Please sign in as an owner or manager to see enquiries.";
  }
  const session = await getSession();
  const isOwner = session?.role === "owner";

  return (
    <EnquiriesClient
      error={error}
      isOwner={isOwner}
      rows={rows.map((r) => ({
        id: r.id, type: r.type, name: r.name, email: r.email, phone: r.phone,
        level: r.level, timing: r.timing, message: r.message, sourcePath: r.sourcePath,
        status: r.status, createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
