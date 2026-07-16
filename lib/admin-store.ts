"use client";
// LocalStorage-backed course store for the demo.
// In Phase 2 this becomes Supabase / Neon Postgres + API routes.

import { courses as seedCourses, workshops as seedWorkshops, type Course, type Workshop } from "@/lib/data";

const COURSES_KEY = "ladante-courses";
const WORKSHOPS_KEY = "ladante-workshops";

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

export function getCourses(): Course[] {
  return read<Course[]>(COURSES_KEY, seedCourses);
}
export function setCourses(list: Course[]) { write(COURSES_KEY, list); }

export function addCourse(c: Course) {
  const list = getCourses();
  write(COURSES_KEY, [c, ...list]);
}
export function updateCourse(id: string, patch: Partial<Course>) {
  const list = getCourses().map((c) => (c.id === id ? { ...c, ...patch } : c));
  write(COURSES_KEY, list);
}
export function removeCourse(id: string) {
  write(COURSES_KEY, getCourses().filter((c) => c.id !== id));
}
export function resetDemo() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COURSES_KEY);
  localStorage.removeItem(WORKSHOPS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

export function getWorkshops(): Workshop[] { return read<Workshop[]>(WORKSHOPS_KEY, seedWorkshops); }
export function setWorkshops(list: Workshop[]) { write(WORKSHOPS_KEY, list); }
export function addWorkshop(w: Workshop) { write(WORKSHOPS_KEY, [w, ...getWorkshops()]); }

// -------------- Site settings (banner + pop-up) --------------
const SETTINGS_KEY = "ladante-settings";
export type SiteSettings = { banner: string; popup: string };
export const defaultSettings: SiteSettings = {
  banner: "Early-bird 10% off September term · University students −20% year-round",
  popup: "Introducing our new ScuolaSemplice student portal.",
};
export function getSettings(): SiteSettings { return read<SiteSettings>(SETTINGS_KEY, defaultSettings); }
export function setSettings(s: SiteSettings) { write(SETTINGS_KEY, s); }
