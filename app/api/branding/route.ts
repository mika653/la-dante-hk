import { NextResponse } from "next/server";
import { readBranding } from "@/lib/branding-read";

// Cached feed the client Wordmark reads for the logo. saveBranding() calls
// revalidatePath("/api/branding"), so a new logo appears immediately.
export const revalidate = 3600;

export async function GET() {
  const branding = await readBranding();
  return NextResponse.json(branding);
}
