// Course scheduling & continuation engine — pure functions, no storage/UI.
// Turns Giulia's manual Excel continuation work into one-click generation:
// given a course, produce the next-level course with dates computed weekly,
// skipping public holidays, carrying over teacher / time / fee / early-bird.

import type { Course, CEFRLevel } from "@/lib/data";

// The CEFR progression used to pick the "next" course.
export const LEVEL_SEQUENCE: CEFRLevel[] = [
  "A1.1", "A1.2", "A1.3",
  "A2.1", "A2.2", "A2.3", "A2.4",
  "B1.1", "B1.2", "B1.3", "B1.4", "B1.5",
  "B2.1", "B2.2", "B2.3", "B2.4", "B2.5",
  "C1.1", "C1.2", "C1.3", "C1.4", "C1.5",
  "C2.1", "C2.2", "C2.3", "C2.4", "C2.5",
];

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function nextLevel(level: Course["level"]): CEFRLevel | null {
  const i = LEVEL_SEQUENCE.indexOf(level as CEFRLevel);
  if (i === -1 || i >= LEVEL_SEQUENCE.length - 1) return null;
  return LEVEL_SEQUENCE[i + 1];
}

// ---- date helpers (calendar-date math on "YYYY-MM-DD" strings) ----
function toDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(iso: string, n: number): string {
  const d = toDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function weekdayOf(iso: string): number {
  return toDate(iso).getDay();
}
export function daysBetween(aISO: string, bISO: string): number {
  return Math.round((toDate(bISO).getTime() - toDate(aISO).getTime()) / 86_400_000);
}
export function todayISO(): string {
  return toISO(new Date());
}

// ---- parse legacy "Wed 18:30–21:30" / "Mon/Wed 18:30–20:30" day labels ----
// `weekdays` lists EVERY day in the label (Mon/Wed, Mon & Thu, Tuesday …) so a
// twice-a-week course whose days were never stored separately is still read as
// twice a week. `weekday` is the first one (back-compat).
export function parseDayLabel(dayLabel: string): { weekday: number | null; weekdays: number[]; startTime: string | null; endTime: string | null } {
  const label = dayLabel || "";
  const found = [...label.matchAll(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)[a-z]*\b/gi)]
    .map((m) => DAY_ABBR.findIndex((d) => d.toLowerCase() === m[1].toLowerCase()))
    .filter((n) => n >= 0);
  const time = label.match(/(\d{1,2}:\d{2})\s*[–\-—]\s*(\d{1,2}:\d{2})/);
  return {
    weekday: found.length > 0 ? found[0] : null,
    weekdays: [...new Set(found)].sort((a, b) => a - b),
    startTime: time ? time[1] : null,
    endTime: time ? time[2] : null,
  };
}
export function dayLabelFrom(weekday: number, startTime: string, endTime: string): string {
  return `${DAY_ABBR[weekday]} ${startTime}–${endTime}`;
}
export function dayLabelFromMulti(weekdays: number[], startTime: string, endTime: string): string {
  const days = [...new Set(weekdays)].sort((a, b) => a - b).map((w) => DAY_ABBR[w]).join("/");
  return `${days} ${startTime}–${endTime}`;
}

// ---- derive structured schedule from a course (explicit fields, else the label/dates) ----
export function courseWeekday(c: Course): number | null {
  if (typeof c.weekday === "number") return c.weekday;
  const p = parseDayLabel(c.dayLabel).weekday;
  return p ?? (c.startISO ? weekdayOf(c.startISO) : null);
}
// Every weekly class day (for twice-a-week / intensive). Order of trust:
// stored weekdays → every day named in the label (+ the stored single weekday) →
// the weekdays of hand-set lesson dates → the start date's weekday.
export function courseWeekdays(c: Course): number[] {
  if (Array.isArray(c.weekdays) && c.weekdays.length > 0) return [...new Set(c.weekdays)].sort((a, b) => a - b);
  const set = new Set(parseDayLabel(c.dayLabel).weekdays);
  if (typeof c.weekday === "number") set.add(c.weekday);
  if (set.size === 0 && Array.isArray(c.lessonDates)) for (const d of c.lessonDates) set.add(weekdayOf(d));
  if (set.size === 0 && c.startISO) set.add(weekdayOf(c.startISO));
  return [...set].sort((a, b) => a - b);
}

/** How many class-day sessions fall between two dates (inclusive), skipping closures. */
export function countClassDays(startISO: string, endISO: string, weekdays: number[], holidays: Set<string> = new Set()): number {
  if (!startISO || !endISO || endISO < startISO || weekdays.length === 0) return 0;
  const set = new Set(weekdays);
  let n = 0;
  for (let cur = startISO, g = 0; cur <= endISO && g < 520 * 7; cur = addDays(cur, 1), g++) {
    if (set.has(weekdayOf(cur)) && !holidays.has(cur)) n++;
  }
  return n;
}
export function courseTimes(c: Course): { startTime: string | null; endTime: string | null } {
  if (c.startTime && c.endTime) return { startTime: c.startTime, endTime: c.endTime };
  const p = parseDayLabel(c.dayLabel);
  return { startTime: p.startTime, endTime: p.endTime };
}
// TOTAL lessons across all weekly class days. Hand-set dates win; then the
// stored count; else count the real class-day sessions between start and end
// (so a twice-a-week course isn't mistaken for once a week).
export function courseLessons(c: Course, holidays: Set<string> = new Set()): number {
  if (Array.isArray(c.lessonDates) && c.lessonDates.length > 0) return c.lessonDates.length;
  if (typeof c.lessons === "number" && c.lessons > 0) return c.lessons;
  if (c.startISO && c.endISO) {
    const n = countClassDays(c.startISO, c.endISO, courseWeekdays(c), holidays);
    if (n > 0) return n;
    return Math.max(1, Math.floor(daysBetween(c.startISO, c.endISO) / 7) + 1);
  }
  return 10;
}

// ---- lesson-date computation: lessons land on ANY of the weekly class days,
// skipping holidays (a holiday just drops that session and the course runs on). ----
export function computeLessonDatesMulti(firstISO: string, weekdays: number[], totalLessons: number, holidays: Set<string>): string[] {
  const out: string[] = [];
  const set = new Set(weekdays);
  if (set.size === 0 || totalLessons <= 0) return out;
  let cur = firstISO;
  for (let g = 0; out.length < totalLessons && g < 520 * 7; g++) {
    if (set.has(weekdayOf(cur)) && !holidays.has(cur)) out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}
export function computeEndDateMulti(firstISO: string, weekdays: number[], totalLessons: number, holidays: Set<string>): string {
  const d = computeLessonDatesMulti(firstISO, weekdays, totalLessons, holidays);
  return d[d.length - 1] ?? firstISO;
}
// Back-compat single-weekday wrappers (one lesson per week).
export function computeLessonDates(firstISO: string, weekday: number, lessons: number, holidays: Set<string>): string[] {
  return computeLessonDatesMulti(firstISO, [weekday], lessons, holidays);
}
export function computeEndDate(firstISO: string, weekday: number, lessons: number, holidays: Set<string>): string {
  const d = computeLessonDates(firstISO, weekday, lessons, holidays);
  return d[d.length - 1] ?? firstISO;
}
// The actual lesson dates for a course: manual overrides when set, else computed.
export function courseLessonDates(c: Course, holidays: Set<string>): string[] {
  if (Array.isArray(c.lessonDates) && c.lessonDates.length > 0) return [...c.lessonDates].sort();
  const weekdays = courseWeekdays(c);
  if (weekdays.length === 0) return [];
  return computeLessonDatesMulti(c.startISO, weekdays, courseLessons(c, holidays), holidays);
}

// ---- upcoming / started (archiving) ----
export function hasStarted(c: Course, today = todayISO()): boolean {
  return c.startISO < today;
}
export function isUpcoming(c: Course, today = todayISO()): boolean {
  return !c.archived && c.startISO >= today;
}
/** Public site: every published, non-archived course (regardless of date) — a
 * published course shows on the catalogue immediately, and only drops off once
 * it's archived (e.g. via roll-over). */
export function publicUpcoming(courses: Course[]): Course[] {
  return courses.filter((c) => c.status === "Published" && !c.archived);
}

// ---- continuation title / code helpers ----
function titleForContinuation(parent: Course, next: CEFRLevel): string {
  const lvl = String(parent.level);
  if (parent.title.includes(lvl)) return parent.title.replace(lvl, next);
  // strip a leading level token if present, else append
  const tail = parent.title.replace(/^\s*[A-C][12](\.[123])?\s*[—-]?\s*/, "").trim();
  return tail ? `${next} — ${tail}` : `${next} course`;
}
function continuationCode(code: string | undefined, from: string, to: string): string | undefined {
  if (!code) return undefined;
  return code.includes(from) ? code.replace(from, to) : code;
}

/**
 * Generate the continuation (next-level) course from a parent course.
 * Returns null when there is no next CEFR level or no usable weekday.
 * The result is a Draft with a fresh id, dates computed from the parent's
 * last lesson + a gap, skipping holidays, and early-bird lead time preserved.
 */
export function generateContinuation(
  parent: Course,
  opts?: { gapWeeks?: number; holidays?: Set<string>; idPrefix?: string }
): Course | null {
  const next = nextLevel(parent.level);
  if (!next) return null;
  const weekdays = courseWeekdays(parent);
  if (weekdays.length === 0) return null;

  // Callers pass the loaded closures set; default to none if not provided.
  const holidays = opts?.holidays ?? new Set<string>();
  const gapWeeks = opts?.gapWeeks ?? 1;
  const { startTime, endTime } = courseTimes(parent);
  const lessons = courseLessons(parent, holidays); // TOTAL lessons across all weekly days

  // The parent's real last lesson (hand-set dates included), so the new term
  // starts after it rather than after a recomputed date.
  const parentDates = courseLessonDates({ ...parent, weekdays }, holidays);
  const parentLast = parentDates[parentDates.length - 1] ?? computeEndDateMulti(parent.startISO, weekdays, lessons, holidays);
  // First lesson of the next course: a gap after the parent's last lesson, then the
  // next class day — computeLessonDatesMulti aligns to a class day and skips holidays,
  // and lays out ALL weekly days (so a twice-a-week course stays twice a week).
  const candidate = addDays(parentLast, (gapWeeks + 1) * 7);
  const dates = computeLessonDatesMulti(candidate, weekdays, lessons, holidays);
  const firstISO = dates[0] ?? candidate;
  const endISO = dates[dates.length - 1] ?? firstISO;

  let earlyBirdDueISO = parent.earlyBirdDueISO;
  if (parent.earlyBirdDueISO) {
    const lead = daysBetween(parent.earlyBirdDueISO, parent.startISO);
    earlyBirdDueISO = addDays(firstISO, -lead);
  }

  return {
    ...parent,
    id: `${opts?.idPrefix ?? "cont"}-${Date.now()}`,
    level: next,
    title: titleForContinuation(parent, next),
    startISO: firstISO,
    endISO,
    dayLabel: startTime && endTime ? dayLabelFromMulti(weekdays, startTime, endTime) : parent.dayLabel,
    weekday: weekdays[0],
    weekdays,
    startTime: startTime ?? undefined,
    endTime: endTime ?? undefined,
    lessons,
    lessonDates: undefined, // recompute for the new term; don't carry manual date overrides
    earlyBirdDueISO,
    earlyBirdFeeHKD: parent.earlyBirdFeeHKD,
    courseCode: continuationCode(parent.courseCode, String(parent.level), next),
    enrolled: 0,
    status: "Draft",
    archived: false,
    continuationOf: parent.id,
  };
}
