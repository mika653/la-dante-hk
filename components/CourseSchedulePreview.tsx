"use client";
import { useMemo } from "react";
import Link from "next/link";
import { computeLessonDates, weekdayOf, addDays } from "@/lib/course-schedule";
import { getHolidays, holidaySet, type Holiday } from "@/lib/holidays";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

function parts(isoStr: string) { const [y, m, d] = isoStr.split("-").map(Number); return { y, m: m - 1, d }; }
function iso(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
function pretty(isoStr: string) { const { y, m, d } = parts(isoStr); return `${d} ${MONTHS[m].slice(0, 3)} ${y}`; }

export default function CourseSchedulePreview({
  startISO, weekday, lessons, holidays = getHolidays(),
}: { startISO: string; weekday: number | null; lessons: number; holidays?: Holiday[] }) {
  const data = useMemo(() => {
    if (!startISO || weekday === null || !lessons || lessons < 1) return null;
    const hs = holidaySet(holidays);
    const lessonDates = computeLessonDates(startISO, weekday, lessons, hs);
    if (lessonDates.length === 0) return null;
    const lessonNo = new Map(lessonDates.map((d, i) => [d, i + 1]));
    const holMap = new Map(holidays.map((h) => [h.date, h.name]));
    const last = lessonDates[lessonDates.length - 1];

    // holidays that fall on the class weekday within the term = skipped weeks
    const skipped: Holiday[] = [];
    let cur = lessonDates[0];
    while (cur <= last) {
      if (holMap.has(cur)) skipped.push({ date: cur, name: holMap.get(cur)! });
      cur = addDays(cur, 7);
    }

    // months spanned
    const first = parts(lessonDates[0]); const lastP = parts(last);
    const months: Array<{ y: number; m: number }> = [];
    let y = first.y, m = first.m;
    while (y < lastP.y || (y === lastP.y && m <= lastP.m)) { months.push({ y, m }); if (++m > 11) { m = 0; y++; } }

    return { lessonDates, lessonNo, holMap, skipped, months, last };
  }, [startISO, weekday, lessons, holidays]);

  if (!data) {
    return <p className="text-sm text-ink-muted">Set a start date, weekly day and number of weeks to preview the schedule.</p>;
  }
  const { lessonDates, lessonNo, holMap, skipped, months, last } = data;

  return (
    <div>
      {/* summary */}
      <p className="text-sm">
        <b>{lessonDates.length} lessons</b> · {pretty(lessonDates[0])} → {pretty(last)}
        {skipped.length > 0 && (
          <span className="text-rosso"> · skips {skipped.length} holiday{skipped.length === 1 ? "" : "s"} ({skipped.map((s) => s.name).join(", ")})</span>
        )}
      </p>

      {/* legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-azzurro-deep inline-block" /> Class day</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rosso/15 border border-rosso inline-block" /> Public holiday (week skipped)</span>
      </div>

      {/* month grids */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map(({ y, m }) => {
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const lead = new Date(y, m, 1).getDay();
          const cells: Array<number | null> = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
          while (cells.length % 7 !== 0) cells.push(null);
          return (
            <div key={`${y}-${m}`} className="rounded-xl border border-line p-3 bg-white">
              <p className="text-xs font-heading font-bold text-ink mb-2">{MONTHS[m]} {y}</p>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {DOW.map((d, i) => <div key={i} className="text-[10px] text-ink-soft py-1">{d}</div>)}
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const date = iso(y, m, day);
                  const isLesson = lessonNo.has(date);
                  const holName = holMap.get(date);
                  const onClassDay = weekdayOf(date) === weekday;
                  const isSkip = !!holName && onClassDay && date >= lessonDates[0] && date <= last;
                  let cls = "text-ink";
                  let title = "";
                  if (isLesson) { cls = "bg-azzurro-deep text-cream font-medium"; title = `Lesson ${lessonNo.get(date)}`; }
                  else if (isSkip) { cls = "bg-rosso/15 text-rosso line-through"; title = `${holName} — class skipped`; }
                  else if (holName) { cls = "text-rosso"; title = holName; }
                  return (
                    <div key={i} title={title} className={`aspect-square flex items-center justify-center text-[11px] rounded ${cls}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        Holidays come from your <Link href="/admin/holidays" className="text-azzurro-deep underline">public-holidays list</Link> — keep it up to date so the dates stay right.
      </p>
    </div>
  );
}
