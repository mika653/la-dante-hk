"use server";
// Branding reads/writes for the admin panel. Saving is gated to a signed-in
// owner or manager and revalidates the cached branding everywhere.

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { normaliseBranding, type Branding } from "@/lib/branding-shared";
import { readBranding, BRANDING_KEY } from "@/lib/branding-read";

export async function getBranding(): Promise<Branding> {
  return readBranding();
}

export async function saveBranding(input: Branding): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdminFresh();
  } catch {
    return { ok: false, error: "You need to be signed in as an owner or manager to change branding." };
  }
  const clean = normaliseBranding(input);
  await db
    .insert(siteConfig)
    .values({ key: BRANDING_KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });

  revalidatePath("/api/branding");   // refresh the logo feed (client hook) instantly
  revalidatePath("/", "layout");     // re-render chrome across the site
  // Title/favicon read is cached for 60s (see branding-read) and refreshes on its own.
  return { ok: true };
}
