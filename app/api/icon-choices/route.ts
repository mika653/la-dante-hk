// Public icon choices (course circles + feature icons). Cached; refreshed only
// when an admin saves (revalidatePath), so the database stays asleep.

import { NextResponse } from "next/server";
import { getIconChoices } from "@/lib/icon-choices-actions";

export const revalidate = 3600;

export async function GET() {
  const choices = await getIconChoices();
  return NextResponse.json({ choices });
}
