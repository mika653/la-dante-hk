// Turns a placement-test result into a concrete next step.
//
// Giulia's rule: suggest the upcoming group course for the level the student
// tested into; if there is no such course on the calendar, point them at
// private lessons or the office instead. Pure functions — no storage, no UI.

import type { Course } from "@/lib/data";
import type { CEFR } from "@/lib/placement-questions";

export type Suggestion =
  | { kind: "group"; courses: Course[] }
  | { kind: "no-group" };

/**
 * Upcoming group courses sitting in the student's CEFR band, soonest first.
 * A band covers its sub-levels, so "B1" matches B1.1 / B1.2 / B1.3, while
 * "B2" and "C1" match themselves.
 *
 * `courses` is expected to already be filtered to published + upcoming
 * (useCourses does this via publicUpcoming), so anything that has started
 * or is still a draft never reaches here.
 */
export function coursesForLevel(courses: Course[], level: CEFR, language: Course["language"] = "italian"): Course[] {
  return courses
    .filter(
      (c) =>
        c.language === language &&
        c.type === "adult-group" &&
        typeof c.level === "string" &&
        c.level.startsWith(level),
    )
    .sort((a, b) => a.startISO.localeCompare(b.startISO));
}

/** The recommendation shown on the result screen. */
export function suggestFor(courses: Course[], level: CEFR, language: Course["language"] = "italian"): Suggestion {
  const matches = coursesForLevel(courses, level, language);
  return matches.length ? { kind: "group", courses: matches } : { kind: "no-group" };
}

/** Seats remaining, floored at 0 — legacy rows can over-enrol. */
export function seatsLeft(c: Course): number {
  return Math.max(0, c.seats - c.enrolled);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-05-04" → "4 May 2026". Deterministic, so it can't cause a hydration mismatch. */
export function formatStart(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
