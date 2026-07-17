import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workshopsTable } from "@/lib/db/schema";

export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await db.select().from(workshopsTable).where(eq(workshopsTable.published, true)).orderBy(workshopsTable.updatedAt);
    return NextResponse.json({
      workshops: rows.map((r) => ({
        id: r.id, title: r.title, description: r.description, status: r.status,
        dateLabel: r.dateLabel ?? undefined, interested: r.interested ?? undefined, image: r.image,
      })),
    });
  } catch {
    return NextResponse.json({ workshops: null, error: "unavailable" }, { status: 503 });
  }
}
