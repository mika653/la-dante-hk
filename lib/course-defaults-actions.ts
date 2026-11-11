"use server";
// Read/write the office-editable course defaults (fees, teachers, descriptions),
// stored in the shared site_config table, plus the teacher list for the pickers.

import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig, users, courses } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { DEFAULT_COURSE_DEFAULTS, normaliseCourseDefaults, mergeTeacherNames, type CourseDefaults } from "@/lib/course-defaults-shared";

const KEY = "course-defaults";

export async function getCourseDefaults(): Promise<CourseDefaults> {
  await requireAdminFresh();
  const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, KEY));
  return row ? normaliseCourseDefaults(row.data) : DEFAULT_COURSE_DEFAULTS;
}

export async function saveCourseDefaults(input: CourseDefaults): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  const clean = normaliseCourseDefaults(input);
  await db
    .insert(siteConfig)
    .values({ key: KEY, data: clean, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data: clean, updatedAt: new Date() } });
  return { ok: true };
}

/**
 * Every teacher the course pickers should offer: the office's teacher list
 * (Course defaults), active teacher accounts (Staff & leave), and anyone already
 * assigned to a course — so a newly added teacher shows up straight away.
 */
export async function listTeacherNames(): Promise<string[]> {
  await requireAdminFresh();
  const [defaults, accounts, onCourses] = await Promise.all([
    getCourseDefaults(),
    db.select({ name: users.name }).from(users).where(and(eq(users.role, "teacher"), eq(users.active, true))),
    db.selectDistinct({ name: courses.teacher }).from(courses),
  ]);
  return mergeTeacherNames(defaults.teachers, accounts.map((a) => a.name), onCourses.map((c) => c.name));
}
