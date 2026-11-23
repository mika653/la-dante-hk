"use server";
// Read/write for the dashboard icon choices (course circles + feature icons).
// Read is open (the public pages need it, nothing sensitive); the save is gated
// to a signed-in owner/manager like the other site-config writes.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { ICON_CHOICES_KEY, defaultIconChoices, normaliseIconChoices, type IconChoices } from "@/lib/icon-choices-shared";

export async function getIconChoices(): Promise<IconChoices> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, ICON_CHOICES_KEY));
    return row ? normaliseIconChoices(row.data) : defaultIconChoices;
  } catch {
    return defaultIconChoices;
  }
}

export async function saveIconChoices(input: IconChoices): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseIconChoices(input);
  await db
    .insert(siteConfig)
    .values({ key: ICON_CHOICES_KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/api/icon-choices");
  revalidatePath("/", "layout");
  return { ok: true };
}
