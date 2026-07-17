"use server";
// Homepage content (hero + carousel) reads/writes. The read is used by the admin
// editor and the /api/site-content route; the save is role-gated so an admin's
// edit is seen by every visitor (no longer localStorage-only).

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { defaultSiteContent, normaliseSiteContent, type SiteContent } from "@/lib/site-content-shared";

const KEY = "content";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    return row ? normaliseSiteContent(row.data) : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseSiteContent(content);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/api/site-content");
  revalidatePath("/", "layout");
  return { ok: true };
}
