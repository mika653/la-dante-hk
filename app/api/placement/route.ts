// Public placement-test question bank. Read-only; cached and only refreshed when
// an admin saves (revalidatePath) — keeps Neon asleep like /api/courses.
import { NextResponse } from "next/server";
import { getPlacementQuestions } from "@/lib/placement-actions";

export const revalidate = 3600;

export async function GET() {
  const questions = await getPlacementQuestions();
  return NextResponse.json({ questions });
}
