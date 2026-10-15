"use server";
// Read/write the placement-test question bank. Stored in site_config under the
// "placement" key so an admin's edits are seen by everyone. Reads fall back to
// the bundled seed bank (lib/placement-questions) so the test always works.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { questionBank, type Question } from "@/lib/placement-questions";

const KEY = "placement";

function clean(list: unknown): Question[] {
  if (!Array.isArray(list)) return [];
  return (list as Question[])
    .filter((q) => q && typeof q.prompt === "string" && Array.isArray(q.choices) && q.choices.length >= 2)
    .map((q, i) => ({
      id: String(q.id || `q-${i + 1}`),
      level: q.level,
      section: q.section,
      prompt: String(q.prompt),
      ...(q.sub ? { sub: String(q.sub) } : {}),
      choices: q.choices.map((c) => String(c)),
      correctIndex: Math.max(0, Math.min(q.choices.length - 1, Math.trunc(Number(q.correctIndex) || 0))),
    }));
}

export async function getPlacementQuestions(): Promise<Question[]> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
    const stored = row ? clean((row.data as { questions?: unknown })?.questions) : [];
    return stored.length > 0 ? stored : questionBank;
  } catch {
    return questionBank;
  }
}

export async function savePlacementQuestions(questions: Question[]): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const data = { questions: clean(questions) };
  await db
    .insert(siteConfig)
    .values({ key: KEY, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data, updatedAt: new Date() } });
  revalidatePath("/api/placement");
  return { ok: true };
}
