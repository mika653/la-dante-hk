"use server";
// Read/write for editable membership + sponsorship prices. Read is open (prices
// aren't sensitive and the public page needs them); the save is role-gated to a
// signed-in owner/manager, like the other site-config writes.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { defaultPricing, normalisePricing, type Pricing } from "@/lib/pricing-shared";

const KEY = "pricing";

export async function getPricing(): Promise<Pricing> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    return row ? normalisePricing(row.data) : defaultPricing;
  } catch {
    return defaultPricing;
  }
}

export async function savePricing(input: Pricing): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normalisePricing(input);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/membership");
  revalidatePath("/", "layout");
  return { ok: true };
}
