// Public course catalogue. Read-only, published courses only — this is what the
// site shows visitors, so drafts never leave the building. The client hook
// useCourses() fetches this and applies its own upcoming/archived filter.

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { rowToCourse } from "@/lib/course-map";

// Cache the catalogue and only touch the database when it goes stale (hourly
// backstop) or when an admin write calls revalidatePath("/api/courses"). Course
// data only ever changes through those admin writes, so this stays live while
// keeping Neon asleep almost all the time — essential on the free tier, where
// querying on every public page view would keep the database awake for hours.
export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await db.select().from(courses).where(eq(courses.status, "Published"));
    return NextResponse.json({ courses: rows.map(rowToCourse) });
  } catch {
    // If the database is briefly unreachable, say so rather than 500 — the hook
    // falls back to its seed data so the site still renders.
    return NextResponse.json({ courses: null, error: "unavailable" }, { status: 503 });
  }
}
