"use client";
import { useEffect, useMemo, useState } from "react";
import { courses as seedCourses, type Course } from "@/lib/data";
import { publicUpcoming } from "@/lib/course-schedule";

// Reads the published catalogue from the database (via /api/courses), so a
// change an admin makes is seen by every visitor — not just the browser that
// made it. Starts from the bundled seed data for an instant first paint, then
// swaps in the live list once it loads. If the fetch fails, the seed stays up.
export function useCourses(): Course[] {
  const [list, setList] = useState<Course[]>(seedCourses);

  useEffect(() => {
    let alive = true;
    fetch("/api/courses", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.courses) && data.courses.length > 0) {
          setList(data.courses as Course[]);
        }
      })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);

  // Public site: only published, upcoming, non-archived courses. A course drops
  // off automatically the day after it starts.
  return useMemo(() => publicUpcoming(list), [list]);
}
