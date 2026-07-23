"use client";
// Admin data store. Courses now live in Neon (shared with every visitor) and go
// through role-gated server actions; workshops and site settings are still
// localStorage-only for the demo.

import { type Course } from "@/lib/data";
import { listAllCourses, createCourse, patchCourse, deleteCourse } from "@/lib/course-actions";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v) as T;
  } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Courses — database-backed via server actions. All async now; the admin pages
// await them. Every write is re-checked against the caller's session server-side.
export async function getCourses(): Promise<Course[]> { return listAllCourses(); }
export async function addCourse(c: Course): Promise<void> { await createCourse(c); }
export async function updateCourse(id: string, patch: Partial<Course>): Promise<void> { await patchCourse(id, patch); }
export async function removeCourse(id: string): Promise<void> { await deleteCourse(id); }

export function resetDemo() {
  // Only clears the still-local demo bits (site settings); DB data isn't wiped.
  if (typeof window === "undefined") return;
  localStorage.removeItem(SETTINGS_KEY);
}

// -------------- Site settings (banner + pop-up) --------------
const SETTINGS_KEY = "ladante-settings";
export type SiteSettings = { banner: string; popup: string };
export const defaultSettings: SiteSettings = {
  banner: "Early-bird 10% off September term · University students −20% year-round",
  popup: "Introducing our new ScuolaSemplice student portal.",
};
export function getSettings(): SiteSettings { return read<SiteSettings>(SETTINGS_KEY, defaultSettings); }
export function setSettings(s: SiteSettings) { write(SETTINGS_KEY, s); }
