"use client";
import { useMemo, useState } from "react";
import CourseListView from "./CourseListView";
import { useCourses } from "@/lib/use-courses";
import { useT } from "@/lib/locale";
import { levelBand, sortedBands } from "@/lib/course-levels";
import type { Language, CourseType, Course } from "@/lib/data";

type Props = {
  language?: Language;
  type?: CourseType;
  location?: Course["location"];
  emptyMessage?: string;
  // Show a "filter by level" pill row above the list. Appears only when the
  // matching courses actually span more than one level — a single-level list
  // gets no pointless filter.
  levelFilter?: boolean;
};

export default function CourseListClient({ language, type, location, emptyMessage, levelFilter }: Props) {
  const { locale } = useT();
  const zh = locale === "zh";
  const all = useCourses();

  const base = useMemo(
    () =>
      all.filter((c) => {
        if (language && c.language !== language) return false;
        if (type && c.type !== type) return false;
        if (location && c.location !== location) return false;
        return true;
      }),
    [all, language, type, location],
  );

  const bands = useMemo(() => sortedBands(base.map((c) => c.level)), [base]);
  const [active, setActive] = useState<string>("All");

  // No filter asked for, or nothing to filter between — render the plain list.
  if (!levelFilter || bands.length <= 1) {
    return <CourseListView courses={base} emptyMessage={emptyMessage} />;
  }

  // The live list can change under us (seed → /api/courses); if the chosen band
  // vanishes, fall back to All rather than show an empty, un-clearable filter.
  const current = active !== "All" && !bands.includes(active) ? "All" : active;

  const counts: Record<string, number> = { All: base.length };
  for (const b of bands) counts[b] = base.filter((c) => levelBand(c.level) === b).length;

  const filtered = current === "All" ? base : base.filter((c) => levelBand(c.level) === current);
  const tabs = ["All", ...bands];
  const tabLabel = (t: string) => (t === "All" ? (zh ? "全部" : "All") : t);

  return (
    <div>
      <div role="group" aria-label={zh ? "按程度篩選課程" : "Filter courses by level"} className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = current === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                on ? "bg-azzurro-deep text-cream border-azzurro-deep" : "bg-white text-ink border-line hover:border-ink"
              }`}
            >
              {tabLabel(t)}
              <span className={`text-xs font-mono ${on ? "text-cream/70" : "text-ink-muted"}`}>{counts[t]}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[13px] text-ink-muted" aria-live="polite">
        {zh
          ? `顯示 ${filtered.length} 個課程${current !== "All" ? `（${current}）` : ""}`
          : `Showing ${filtered.length} ${filtered.length === 1 ? "course" : "courses"}${current !== "All" ? ` at ${current}` : ""}.`}
      </p>

      <div className="mt-5">
        <CourseListView courses={filtered} emptyMessage={emptyMessage} />
      </div>
    </div>
  );
}
