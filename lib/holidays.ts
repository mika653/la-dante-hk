"use client";
// Public / closure days the course scheduler skips when generating lesson dates.
// Seeded with Hong Kong general holidays. IMPORTANT: lunar-calendar dates
// (Lunar New Year, Buddha's Birthday, Tuen Ng, Mid-Autumn, Chung Yeung) shift
// each year — the school should verify/adjust this list, which is why it is an
// editable store rather than a hard-coded constant. School-specific closures can
// be added here too.

export type Holiday = { date: string; name: string }; // date = "YYYY-MM-DD"

export const HK_HOLIDAYS_SEED: Holiday[] = [
  // 2026 — verify lunar dates against the official HK gazette before relying on them
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-02-17", name: "Lunar New Year" },
  { date: "2026-02-18", name: "Lunar New Year (2nd day)" },
  { date: "2026-02-19", name: "Lunar New Year (3rd day)" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-04", name: "Day after Good Friday" },
  { date: "2026-04-06", name: "Easter Monday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-24", name: "Buddha's Birthday" },
  { date: "2026-06-19", name: "Tuen Ng Festival" },
  { date: "2026-07-01", name: "HKSAR Establishment Day" },
  { date: "2026-09-26", name: "Day after Mid-Autumn Festival" },
  { date: "2026-10-01", name: "National Day" },
  { date: "2026-10-18", name: "Chung Yeung Festival" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "Boxing Day" },
  // 2027 (fixed-date holidays; add lunar dates when confirmed)
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-05-01", name: "Labour Day" },
  { date: "2027-07-01", name: "HKSAR Establishment Day" },
  { date: "2027-10-01", name: "National Day" },
  { date: "2027-12-25", name: "Christmas Day" },
];

const KEY = "ladante-holidays";

export function getHolidays(): Holiday[] {
  if (typeof window === "undefined") return HK_HOLIDAYS_SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return HK_HOLIDAYS_SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : HK_HOLIDAYS_SEED;
  } catch {
    return HK_HOLIDAYS_SEED;
  }
}

export function setHolidays(list: Holiday[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/** Set of holiday date strings, for O(1) lookup in the scheduler. */
export function holidaySet(list: Holiday[] = getHolidays()): Set<string> {
  return new Set(list.map((h) => h.date));
}
