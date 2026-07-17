// Public events feed — published only. The client hook useEvents fetches this.
// Cached and refreshed only on an admin write (revalidatePath), so it stays live
// while keeping the database asleep on the free tier.

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";

export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await db.select().from(events).where(eq(events.published, true)).orderBy(events.date);
    return NextResponse.json({
      events: rows.map((r) => ({
        id: r.id, date: r.date, title: r.title, kind: r.kind, location: r.location,
        description: r.description ?? undefined, bookingUrl: r.bookingUrl ?? undefined, published: r.published,
      })),
    });
  } catch {
    return NextResponse.json({ events: null, error: "unavailable" }, { status: 503 });
  }
}
