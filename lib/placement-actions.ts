"use server";
// Read/write the placement-test question bank. Stored in site_config under the
// "placement" key so an admin's edits are seen by everyone. Reads fall back to
// the bundled seed bank (lib/placement-questions) so the test always works.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { questionBank, TF_CHOICES, type Question, type QType, type QPart } from "@/lib/placement-questions";

const KEY = "placement";

const clampIdx = (v: unknown, len: number) => Math.max(0, Math.min(Math.max(0, len - 1), Math.trunc(Number(v) || 0)));

function cleanParts(raw: unknown): QPart[] {
  if (!Array.isArray(raw)) return [];
  return (raw as QPart[])
    .map((p) => {
      const choices = Array.isArray(p.choices) ? p.choices.map((c) => String(c)) : [];
      return { ...(p.label ? { label: String(p.label) } : {}), choices, correctIndex: clampIdx(p.correctIndex, choices.length) };
    })
    .filter((p) => p.choices.length >= 2);
}

function clean(list: unknown): Question[] {
  if (!Array.isArray(list)) return [];
  return (list as Question[])
    .filter((q) => q && typeof q.prompt === "string" && q.prompt.trim().length > 0)
    .map((q, i): Question => {
      const base = {
        id: String(q.id || `q-${i + 1}`),
        level: q.level,
        section: q.section,
        prompt: String(q.prompt),
        ...(q.sub ? { sub: String(q.sub) } : {}),
      };
      // Multi-part question: keep its sub-blanks (each a mini multiple-choice).
      if (Array.isArray(q.parts) && q.parts.length > 0) {
        return { ...base, type: "multi", parts: cleanParts(q.parts), choices: [], correctIndex: 0 };
      }
      const type: QType = q.type === "fill" || q.type === "truefalse" ? q.type : "choice";
      if (type === "fill") {
        return { ...base, type, choices: [], correctIndex: 0, answer: String(q.answer ?? "") };
      }
      if (type === "truefalse") {
        return { ...base, type, choices: [...TF_CHOICES], correctIndex: Number(q.correctIndex) === 1 ? 1 : 0 };
      }
      const choices = Array.isArray(q.choices) ? q.choices.map((c) => String(c)) : [];
      return { ...base, type, choices, correctIndex: clampIdx(q.correctIndex, choices.length) };
    })
    // Drop incomplete questions: multi needs valid parts; fill needs an answer;
    // choice/true-false need options.
    .filter((q) =>
      q.type === "multi"
        ? (q.parts?.length ?? 0) >= 1 && (q.parts ?? []).every((p) => p.choices.length >= 2)
        : q.type === "fill"
        ? (q.answer ?? "").trim().length > 0
        : q.choices.length >= 2,
    );
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
