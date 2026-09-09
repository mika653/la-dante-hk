// -----------------------------------------------------------------------------
// Course-code generator — La Dante's own numbering scheme.
//
//   [PREFIX] + [2-digit TERM] + [2-digit YEAR] + [2-digit SEQUENCE]
//   e.g.  DA032601  =  Adult Italian · term 03 · 2026 · first of that batch
//
// Bill gave three prefixes (DA / C / L) and one worked example per language.
// EVERYTHING he still has to confirm is isolated in the CONFIG block below, so
// answering his two open questions is a one- or two-line edit here — no hunting
// through the app. Until then the generator runs on documented assumptions and
// the admin can always type a code by hand to override it.
// -----------------------------------------------------------------------------

import type { Course, Language, CourseType } from "@/lib/data";

// ============================ CONFIG (edit me) ================================

// 1) PREFIXES.  Confirmed by Bill: DA (adult Italian), C (children Italian),
//    L (Latin). The rest are best-guess placeholders — ASK BILL and replace.
//    Keyed by `${language}:${type}`; falls back to LANGUAGE_PREFIX by language.
const PREFIX_BY_LANGUAGE_TYPE: Partial<Record<string, string>> = {
  "italian:adult-group": "DA",   // confirmed — DA032601
  "italian:kids":        "C",    // confirmed — C032601  (children/teens)
  "latin:latin-group":   "L",    // confirmed — L032601
  // ---- TODO(Bill): confirm the prefixes below ----
  "italian:private":     "DP",
  "italian:corporate":   "DC",
  "italian:online":      "DO",
  "italian:special":     "DS",
  "latin:private":       "LP",
};
// Last-resort fallback if a (language,type) pair isn't mapped above.
const LANGUAGE_PREFIX: Record<Language, string> = { italian: "DA", latin: "L" };

// 2) TERM CODE.  Bill's examples imply the term is the intake season, taken from
//    the course start month:  Sep 2026 -> "03",  Jan 2027 -> "01".  Best fit is
//    three terms a year. CONFIRM the month boundaries with Bill.
//    Return value must be 1..99 (rendered 2-digit).  Change this one function if
//    the terms are, say, manual or on different months.
export function termFromStartISO(startISO: string): number {
  const month = Number(startISO.slice(5, 7)) || 1; // "YYYY-MM-DD"
  if (month <= 4) return 1;        // Jan–Apr  -> term 01
  if (month <= 8) return 2;        // May–Aug  -> term 02
  return 3;                        // Sep–Dec  -> term 03
}

// =============================================================================

const pad2 = (n: number) => String(Math.abs(Math.trunc(n)) % 100).padStart(2, "0");

export function prefixFor(language: Language, type: CourseType): string {
  return PREFIX_BY_LANGUAGE_TYPE[`${language}:${type}`] ?? LANGUAGE_PREFIX[language] ?? "DA";
}

/** The stem shared by every course in one prefix+term+year batch, e.g. "DA0326". */
export function codeStem(language: Language, type: CourseType, startISO: string): string {
  const year = Number(startISO.slice(0, 4)) || new Date().getFullYear();
  return `${prefixFor(language, type)}${pad2(termFromStartISO(startISO))}${pad2(year)}`;
}

/**
 * Next free sequence number for a stem, given the codes already in use.
 * Reads the trailing 2 digits of every existing code that shares the stem and
 * returns max+1, so numbering never collides even if earlier codes were edited.
 */
export function nextSequence(stem: string, existingCodes: Iterable<string | null | undefined>): number {
  let max = 0;
  for (const code of existingCodes) {
    if (!code) continue;
    const c = code.trim().toUpperCase();
    if (!c.startsWith(stem)) continue;
    const seq = Number(c.slice(stem.length));
    if (Number.isFinite(seq) && seq > max) max = seq;
  }
  return max + 1;
}

/** Full auto-generated code, e.g. "DA032601". */
export function generateCourseCode(
  input: Pick<Course, "language" | "type" | "startISO">,
  existingCodes: Iterable<string | null | undefined> = [],
): string {
  const stem = codeStem(input.language, input.type, input.startISO);
  return `${stem}${pad2(nextSequence(stem, existingCodes))}`;
}

/**
 * Preview shown in the UI before saving. The final 2 digits are only assigned
 * for certain on the server (to avoid two people grabbing the same number), so
 * the preview shows the batch stem plus a placeholder.
 */
export function previewCourseCode(input: Pick<Course, "language" | "type" | "startISO">): string {
  return `${codeStem(input.language, input.type, input.startISO)}NN`;
}
