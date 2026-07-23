// Public homepage content (hero + carousel). Cached; refreshed only when an
// admin saves (revalidatePath), so the database stays asleep on the free tier.

import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content-actions";

export const revalidate = 3600;

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}
