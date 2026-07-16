// Translate between the database row and the Course shape the whole app already
// speaks. Keeping this in one place means the 20-odd course consumers never need
// to know the data now comes from Postgres instead of localStorage.

import type { Course } from "@/lib/data";
import type { CourseRow, NewCourseRow } from "@/lib/db/schema";

export function rowToCourse(r: CourseRow): Course {
  return {
    id: r.id,
    language: r.language as Course["language"],
    type: r.type as Course["type"],
    level: r.level as Course["level"],
    title: r.title,
    dayLabel: r.dayLabel,
    startISO: r.startISO,
    endISO: r.endISO,
    hours: r.hours,
    location: r.location as Course["location"],
    teacher: r.teacher,
    priceHKD: r.priceHKD,
    seats: r.seats,
    enrolled: r.enrolled,
    status: r.status as Course["status"],
    ...(r.courseCode != null && { courseCode: r.courseCode }),
    ...(r.weekday != null && { weekday: r.weekday }),
    ...(r.startTime != null && { startTime: r.startTime }),
    ...(r.endTime != null && { endTime: r.endTime }),
    ...(r.lessons != null && { lessons: r.lessons }),
    ...(r.earlyBirdDueISO != null && { earlyBirdDueISO: r.earlyBirdDueISO }),
    ...(r.earlyBirdFeeHKD != null && { earlyBirdFeeHKD: r.earlyBirdFeeHKD }),
    ...(r.archived && { archived: r.archived }),
    ...(r.continuationOf != null && { continuationOf: r.continuationOf }),
  };
}

export function courseToRow(c: Course): NewCourseRow {
  return {
    id: c.id,
    language: c.language,
    type: c.type,
    level: String(c.level),
    title: c.title,
    dayLabel: c.dayLabel,
    startISO: c.startISO,
    endISO: c.endISO,
    hours: c.hours,
    location: c.location,
    teacher: c.teacher,
    priceHKD: c.priceHKD,
    seats: c.seats,
    enrolled: c.enrolled,
    status: c.status,
    courseCode: c.courseCode ?? null,
    weekday: c.weekday ?? null,
    startTime: c.startTime ?? null,
    endTime: c.endTime ?? null,
    lessons: c.lessons ?? null,
    earlyBirdDueISO: c.earlyBirdDueISO ?? null,
    earlyBirdFeeHKD: c.earlyBirdFeeHKD ?? null,
    archived: c.archived ?? false,
    continuationOf: c.continuationOf ?? null,
  };
}
