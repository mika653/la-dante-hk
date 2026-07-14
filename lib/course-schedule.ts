// Course scheduling & continuation engine — pure functions, no storage/UI.
// Turns Giulia's manual Excel continuation work into one-click generation:
// given a course, produce the next-level course with dates computed weekly,
// skipping public holidays, carrying over teacher / time / fee / early-bird.

import type { Course, CEFRLevel } from "@/lib/data";
import { holidaySet } from "@/lib/holidays";

// The CEFR progression used to pick the "next" course.
export const LEVEL_SEQUENCE: CEFRLevel[] = [
  "A1.1", "A1.2", "A1.3", "A2.1", "A2.2", "A2.3", "B1.1", "B1.2", "B1.3", "B2", "C1", "C2",
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

// ---- parse legacy "Wed 18:30–21:30" day labels ----
export function parseDayLabel(dayLabel: string): { weekday: number | null; startTime: string | null; endTime: string | null } {
  const day = dayLabel.match(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\b/);
  const time = dayLabel.match(/(\d{1,2}:\d{2})\s*[–\-—]\s*(\d{1,2}:\d{2})/);
  return {
    weekday: day ? DAY_ABBR.indexOf(day[1]) : null,
    startTime: time ? time[1] : null,
    endTime: time ? time[2] : null,
  };
}
export function dayLabelFrom(weekday: number, startTime: string, endTime: string): string {
  return `${DAY_ABBR[weekday]} ${startTime}–${endTime}`;
}

// ---- derive structured schedule from a course (explicit fields, else the label/dates) ----
export function courseWeekday(c: Course): number | null {
  if (typeof c.weekday === "number") return c.weekday;
  const p = parseDayLabel(c.dayLabel).weekday;
  return p ?? (c.startISO ? weekdayOf(c.startISO) : null);
}
export function courseTimes(c: Course): { startTime: string | null; endTime: string | null } {
  if (c.startTime && c.endTime) return { startTime: c.startTime, endTime: c.endTime };
  const p = parseDayLabel(c.dayLabel);
  return { startTime: p.startTime, endTime: p.endTime };
}
export function courseLessons(c: Course): number {
  if (typeof c.lessons === "number" && c.lessons > 0) return c.lessons;
  if (c.startISO && c.endISO) return Math.max(1, Math.floor(daysBetween(c.startISO, c.endISO) / 7) + 1);
  return 10;
}

// ---- lesson-date computation: weekly, skipping holidays (a holiday week bumps the lesson on) ----
export function computeLessonDates(firstISO: string, weekday: number, lessons: number, holidays: Set<string>): string[] {
  const out: string[] = [];
  let cur = firstISO;
  // align to the target weekday if the given start is off-day
  for (let g = 0; weekdayOf(cur) !== weekday && g < 7; g++) cur = addDays(cur, 1);
  for (let g = 0; out.length < lessons && g < 520; g++) {
    if (!holidays.has(cur)) out.push(cur);
    cur = addDays(cur, 7);
  }
  return out;
}
export function computeEndDate(firstISO: string, weekday: number, lessons: number, holidays: Set<string>): string {
  const d = computeLessonDates(firstISO, weekday, lessons, holidays);
  return d[d.length - 1] ?? firstISO;
}

// ---- upcoming / started (archiving) ----
export function hasStarted(c: Course, today = todayISO()): boolean {
  return c.startISO < today;
}
export function isUpcoming(c: Course, today = todayISO()): boolean {
  return !c.archived && c.startISO >= today;
}
/** Public site: only published, upcoming, non-archived courses. */
export function publicUpcoming(courses: Course[], today = todayISO()): Course[] {
  return courses.filter((c) => c.status === "Published" && isUpcoming(c, today));
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
  const weekday = courseWeekday(parent);
  if (weekday === null) return null;

  const holidays = opts?.holidays ?? holidaySet();
  const gapWeeks = opts?.gapWeeks ?? 1;
  const { startTime, endTime } = courseTimes(parent);
  const lessons = courseLessons(parent);

  const parentLast = computeEndDate(parent.startISO, weekday, lessons, holidays);
  // first lesson of the next course: gapWeeks break after the last lesson, same weekday, off holidays
  let firstISO = addDays(parentLast, (gapWeeks + 1) * 7);
  for (let g = 0; holidays.has(firstISO) && g < 20; g++) firstISO = addDays(firstISO, 7);
  const endISO = computeEndDate(firstISO, weekday, lessons, holidays);

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
    dayLabel: startTime && endTime ? dayLabelFrom(weekday, startTime, endTime) : parent.dayLabel,
    weekday,
    startTime: startTime ?? undefined,
    endTime: endTime ?? undefined,
    lessons,
    earlyBirdDueISO,
    earlyBirdFeeHKD: parent.earlyBirdFeeHKD,
    courseCode: continuationCode(parent.courseCode, String(parent.level), next),
    enrolled: 0,
    status: "Draft",
    archived: false,
    continuationOf: parent.id,
  };
}
