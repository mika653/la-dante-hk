"use client";
import { useEffect, useState } from "react";
import { courses as seedCourses, type Course } from "@/lib/data";

const COURSES_KEY = "ladante-courses";

// Reads courses from localStorage (admin-edited) with fallback to seed data.
// Updates live when the admin adds/removes a course in another tab via the
// `storage` event. Same-tab updates are picked up on mount / navigation.
export function useCourses(): Course[] {
  const [list, setList] = useState<Course[]>(seedCourses);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem(COURSES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setList(parsed);
        }
      } catch { /* fall back to seed */ }
    };
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === COURSES_KEY) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return list;
}
