import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workshopsTable } from "@/lib/db/schema";
import { getWorkshopSettings } from "@/lib/workshop-actions";

export const revalidate = 3600;

// Public workshops feed — published only, in admin order, plus the homepage cap.
export async function GET() {
  try {
    const [rows, settings] = await Promise.all([
      db.select().from(workshopsTable).where(eq(workshopsTable.published, true)).orderBy(asc(workshopsTable.sortOrder), asc(workshopsTable.id)),
      getWorkshopSettings(),
    ]);
    return NextResponse.json({
      homeLimit: settings.homeLimit,
      workshops: rows.map((r) => ({
        id: r.id, title: r.title, description: r.description, status: r.status,
        dateLabel: r.dateLabel ?? undefined, interested: r.interested ?? undefined, image: r.image,
        timeLabel: r.timeLabel ?? undefined, fee: r.fee ?? undefined,
        ...(r.zh ? { zh: r.zh } : {}),
      })),
    });
  } catch {
    return NextResponse.json({ workshops: null, error: "unavailable" }, { status: 503 });
  }
}
