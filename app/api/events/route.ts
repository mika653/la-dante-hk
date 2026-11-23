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
        description: r.description ?? undefined, bookingUrl: r.bookingUrl ?? undefined, image: r.image ?? undefined, published: r.published,
        // Registration form config, so the public sign-up form matches what admin set.
        ...(Array.isArray(r.regFields) && r.regFields.length > 0 ? { regFields: r.regFields } : {}),
        ...(Array.isArray(r.customQuestions) && r.customQuestions.length > 0 ? { customQuestions: r.customQuestions } : {}),
        ...(r.zh ? { zh: r.zh } : {}),
      })),
    });
  } catch {
    return NextResponse.json({ events: null, error: "unavailable" }, { status: 503 });
  }
}
