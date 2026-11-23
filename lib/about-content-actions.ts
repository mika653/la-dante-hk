"use server";
// About page content read/write. The read is open (the public /about and
// /zh/about pages render it on the server); the save is role-gated to a
// signed-in owner/manager and re-renders both About pages.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { defaultAboutContent, normaliseAboutContent, type AboutContent } from "@/lib/about-content-shared";

const KEY = "about-content";

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    return row ? normaliseAboutContent(row.data) : defaultAboutContent;
  } catch {
    return defaultAboutContent;
  }
}

export async function saveAboutContent(input: AboutContent): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseAboutContent(input);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/about");
  revalidatePath("/zh/about");
  return { ok: true };
}
