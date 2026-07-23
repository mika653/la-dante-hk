import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";

export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await db.select().from(reviews).where(eq(reviews.published, true)).orderBy(desc(reviews.year));
    return NextResponse.json({ reviews: rows.map((r) => ({ id: r.id, quote: r.quote, name: r.name, level: r.level, year: r.year, published: r.published })) });
  } catch {
    return NextResponse.json({ reviews: null, error: "unavailable" }, { status: 503 });
  }
}
