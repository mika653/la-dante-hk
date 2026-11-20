"use server";
// Read/write for the editable Special Offers content. Read is open (the public
// page needs it); the save is role-gated to a signed-in owner/manager.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { defaultOffers, normaliseOffers, type OffersContent } from "@/lib/offers-shared";

const KEY = "offers";

export async function getOffers(): Promise<OffersContent> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    return row ? normaliseOffers(row.data) : defaultOffers;
  } catch {
    return defaultOffers;
  }
}

export async function saveOffers(input: OffersContent): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseOffers(input);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/special-offers");
  revalidatePath("/", "layout");
  return { ok: true };
}
