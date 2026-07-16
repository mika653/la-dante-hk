"use server";
// Course catalogue writes. These change what every visitor sees, so unlike the
// old localStorage store they are gated: only a signed-in owner or manager may
// call them, checked from the session here on the server.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, type CourseRow } from "@/lib/db/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { rowToCourse, courseToRow } from "@/lib/course-map";
import type { Course } from "@/lib/data";

async function requireAdmin() {
  const s = await getSession();
  if (!s || !isAdmin(s.role)) throw new Error("Not authorised");
  return s;
}

function refresh() {
  // Refresh the cached public catalogue immediately so an availability change is
  // live at once, and the pages that render course data.
  revalidatePath("/api/courses");
  revalidatePath("/", "layout");
}

/** Admin read — the full catalogue, drafts included. */
export async function listAllCourses(): Promise<Course[]> {
  await requireAdmin();
  const rows = await db.select().from(courses).orderBy(courses.startISO);
  return rows.map(rowToCourse);
}

export async function createCourse(course: Course): Promise<void> {
  await requireAdmin();
  await db.insert(courses).values(courseToRow(course)).onConflictDoNothing();
  refresh();
}

export async function patchCourse(id: string, patch: Partial<Course>): Promise<void> {
  await requireAdmin();

  // Whitelist the columns a patch may touch, and coerce types. Never trust the
  // shape of `patch` — it arrives from the browser.
  const set: Partial<CourseRow> = {};
  const num = (v: unknown) => Math.max(0, Math.trunc(Number(v) || 0));
  if (patch.seats !== undefined) set.seats = num(patch.seats);
  if (patch.enrolled !== undefined) set.enrolled = num(patch.enrolled);
  if (patch.status !== undefined) set.status = patch.status === "Draft" ? "Draft" : "Published";
  if (patch.archived !== undefined) set.archived = !!patch.archived;
  if (patch.title !== undefined) set.title = String(patch.title);
  if (patch.level !== undefined) set.level = String(patch.level);
  if (patch.dayLabel !== undefined) set.dayLabel = String(patch.dayLabel);
  if (patch.startISO !== undefined) set.startISO = String(patch.startISO);
  if (patch.endISO !== undefined) set.endISO = String(patch.endISO);
  if (patch.teacher !== undefined) set.teacher = String(patch.teacher);
  if (patch.location !== undefined) set.location = String(patch.location) as CourseRow["location"];
  if (patch.priceHKD !== undefined) set.priceHKD = num(patch.priceHKD);
  if (patch.hours !== undefined) set.hours = num(patch.hours);
  if (patch.weekday !== undefined) set.weekday = patch.weekday ?? null;
  if (patch.startTime !== undefined) set.startTime = patch.startTime ?? null;
  if (patch.endTime !== undefined) set.endTime = patch.endTime ?? null;
  if (patch.lessons !== undefined) set.lessons = patch.lessons ?? null;
  if (patch.earlyBirdDueISO !== undefined) set.earlyBirdDueISO = patch.earlyBirdDueISO ?? null;
  if (patch.earlyBirdFeeHKD !== undefined) set.earlyBirdFeeHKD = patch.earlyBirdFeeHKD ?? null;
  if (patch.courseCode !== undefined) set.courseCode = patch.courseCode ?? null;

  if (Object.keys(set).length === 0) return;
  set.updatedAt = new Date();
  await db.update(courses).set(set).where(eq(courses.id, id));
  refresh();
}

export async function deleteCourse(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(courses).where(eq(courses.id, id));
  refresh();
}

/**
 * The one-purpose write behind the availability control: set how many seats are
 * left on a class. Stored as enrolled = capacity − seatsLeft so the existing
 * "N seats left" / "Waitlist" display keeps working everywhere unchanged.
 */
export async function setSeatsLeft(id: string, seatsLeft: number): Promise<void> {
  await requireAdmin();
  const left = Math.max(0, Math.trunc(Number(seatsLeft) || 0));

  const [row] = await db.select().from(courses).where(eq(courses.id, id));
  if (!row) throw new Error("No such course");

  // Keep real signups (enrolled) fixed and size capacity to leave exactly `left`
  // open, so "seats − enrolled" — what the whole site displays — equals what the
  // admin typed. 0 left renders as "Waitlist" everywhere.
  await db
    .update(courses)
    .set({ seats: row.enrolled + left, updatedAt: new Date() })
    .where(eq(courses.id, id));
  refresh();
}
