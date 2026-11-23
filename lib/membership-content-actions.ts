"use server";
// Read/write for the editable membership + sponsorship copy (descriptions and
// benefit lists). Read is open (public page copy); the save is role-gated to a
// signed-in owner/manager, like the other site-config writes.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import {
  defaultMembershipContent,
  normaliseMembershipContent,
  type MembershipContent,
} from "@/lib/membership-content-shared";

const KEY = "membership-content";

export async function getMembershipContent(): Promise<MembershipContent> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    return row ? normaliseMembershipContent(row.data) : defaultMembershipContent;
  } catch {
    return defaultMembershipContent;
  }
}

export async function saveMembershipContent(input: MembershipContent): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseMembershipContent(input);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  revalidatePath("/membership");
  revalidatePath("/zh/membership");
  revalidatePath("/services/sponsorship");
  return { ok: true };
}
