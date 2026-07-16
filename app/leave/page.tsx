// Staff leave — real data, signed-in users only.
//
// Replaces the localStorage mock and its "Viewing as" role switcher. The role
// now comes from the session cookie, so nobody sees anyone else's leave by
// picking a different name from a dropdown.

import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { requireUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, leaveRequests } from "@/lib/db/schema";
import LeaveClient from "./LeaveClient";

// Session-dependent: never prerender this, and never cache one person's data
// where another could be served it.
export const dynamic = "force-dynamic";

export const metadata = { title: "Staff leave — La Dante HK" };

// Explicit columns. A bare select() would carry password_hash across the
// server/client boundary along with everything else.
const publicUser = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  annualEntitlement: users.annualEntitlement,
  sickEntitlement: users.sickEntitlement,
  active: users.active,
};

export default async function LeavePage() {
  const session = await requireUser();
  const admin = isAdmin(session.role);

  const [me] = await db.select(publicUser).from(users).where(eq(users.id, session.userId));
  // The cookie outlived the account (deleted or deactivated) — sign them out.
  if (!me || !me.active) redirect("/login");

  const myLeave = await db
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, me.id))
    .orderBy(desc(leaveRequests.startDate));

  // Only admins may see anyone else's data, so only admins fetch it.
  const staff = admin ? await db.select(publicUser).from(users).orderBy(users.name) : [];
  const teamLeave = admin ? await db.select().from(leaveRequests).orderBy(leaveRequests.startDate) : [];

  return (
    <LeaveClient
      me={me}
      admin={admin}
      myLeave={myLeave.map(serialise)}
      staff={staff}
      teamLeave={teamLeave.map(serialise)}
    />
  );
}

/** Trim to what the UI needs; timestamps don't cross the client boundary. */
function serialise(l: typeof leaveRequests.$inferSelect) {
  return {
    id: l.id,
    userId: l.userId,
    type: l.type,
    startDate: l.startDate,
    endDate: l.endDate,
    days: l.days,
    reason: l.reason,
    status: l.status,
  };
}
