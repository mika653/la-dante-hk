"use client";
// Official PLIDA exam days. A course with `skipPlida` on will not hold its
// session on any of these dates (the class simply runs a week longer), the same
// way the scheduler already skips public holidays. Two sittings a year, June and
// November — the office refreshes these annually on /admin/holidays, which is why
// this is an editable store rather than a hard-coded constant.

export type PlidaDate = { date: string; name: string }; // date = "YYYY-MM-DD"

export const PLIDA_DATES_SEED: PlidaDate[] = [
  { date: "2026-06-14", name: "PLIDA exam — June sitting" },
  { date: "2026-11-15", name: "PLIDA exam — November sitting" },
];

const KEY = "ladante-plida-dates";

export function getPlidaDates(): PlidaDate[] {
  if (typeof window === "undefined") return PLIDA_DATES_SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return PLIDA_DATES_SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : PLIDA_DATES_SEED;
  } catch {
    return PLIDA_DATES_SEED;
  }
}

export function setPlidaDates(list: PlidaDate[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/** Set of PLIDA date strings, for O(1) lookup in the scheduler. */
export function plidaDateSet(list: PlidaDate[] = getPlidaDates()): Set<string> {
  return new Set(list.map((p) => p.date));
}
