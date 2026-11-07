"use client";
import { useMemo, useState } from "react";
import CourseListView from "@/components/CourseListView";
import { useCourses } from "@/lib/use-courses";

// Level filters for the Latin group catalogue. Latin courses carry a plain
// "Beginner" / "Intermediate" / "Advanced" level (not CEFR), so we match on it
// directly. Courses come from the live hook (seed → /api/courses), so the
// filter always reflects whatever the office has published — nothing hard-coded.
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
type Level = (typeof LEVELS)[number];
type Filter = "All" | Level;

export default function LatinGroupsClient() {
  const all = useCourses();
  const latin = useMemo(() => all.filter((c) => c.language === "latin"), [all]);
  const [active, setActive] = useState<Filter>("All");

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { All: latin.length, Beginner: 0, Intermediate: 0, Advanced: 0 };
    for (const c of latin) {
      if (c.level === "Beginner" || c.level === "Intermediate" || c.level === "Advanced") base[c.level] += 1;
    }
    return base;
  }, [latin]);

  const filtered = active === "All" ? latin : latin.filter((c) => c.level === active);
  const tabs: Filter[] = ["All", ...LEVELS];

  const emptyMessage =
    active === "All"
      ? "No Latin groups scheduled right now — send an enquiry below and we'll let you know as soon as one opens."
      : `No ${active} Latin group starting just yet — tell us you're interested below and we'll open one when there's demand.`;

  return (
    <div>
      <div role="group" aria-label="Filter Latin courses by level" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = active === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                on
                  ? "bg-azzurro-deep text-cream border-azzurro-deep"
                  : "bg-white text-ink border-line hover:border-ink"
              }`}
            >
              {t}
              <span className={`text-xs font-mono ${on ? "text-cream/70" : "text-ink-muted"}`}>{counts[t]}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[13px] text-ink-muted" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "course" : "courses"}
        {active !== "All" ? ` at ${active} level` : ""}.
      </p>

      <div className="mt-5">
        <CourseListView courses={filtered} emptyMessage={emptyMessage} />
      </div>
    </div>
  );
}
