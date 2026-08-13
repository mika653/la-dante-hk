import "server-only";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { defaultBranding, normaliseBranding, type Branding } from "./branding-shared";

export const BRANDING_KEY = "branding";

export async function readBranding(): Promise<Branding> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, BRANDING_KEY));
    return row ? normaliseBranding(row.data) : defaultBranding;
  } catch {
    return defaultBranding;
  }
}

// Short-lived cached read for the root layout's generateMetadata (title +
// favicon). A 60s revalidate keeps pages statically renderable while letting a
// branding change appear within a minute — no tag plumbing required.
export const getBrandingForMetadata = unstable_cache(readBranding, ["branding-meta"], {
  revalidate: 60,
});
