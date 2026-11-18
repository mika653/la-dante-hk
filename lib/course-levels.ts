// Grouping courses into level "bands" for the by-level pill filters. A CEFR
// level collapses to its band (A1.2 → "A1"); a plain level (Beginner /
// Intermediate / Advanced) stays as it is. Pure + storage-agnostic so the kids
// filter and the generic course list can share one definition.

export function levelBand(level: unknown): string {
  const s = String(level ?? "").trim();
  return /^[ABC][12]/.test(s) ? s.slice(0, 2) : (s || "Other");
}

const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];
// Plain (non-CEFR) levels, in the order a learner climbs them — so the pills
// read Beginner → Advanced, not alphabetically.
const PLAIN_ORDER = ["Beginner", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced"];

/** Sort key: CEFR bands first (A1→C2), then plain levels low→high, then the rest A→Z. */
export function bandRank(b: string): number {
  const c = CEFR_ORDER.indexOf(b);
  if (c >= 0) return c;
  const p = PLAIN_ORDER.indexOf(b);
  if (p >= 0) return 10 + p;
  return 100 + b.charCodeAt(0);
}

/** The distinct bands present in a set of levels, in display order. */
export function sortedBands(levels: Iterable<unknown>): string[] {
  const set = new Set<string>();
  for (const l of levels) set.add(levelBand(l));
  return [...set].sort((a, b) => bandRank(a) - bandRank(b));
}
