"use client";
import { useMemo } from "react";
import Link from "next/link";
import { computeLessonDatesMulti, weekdayOf, addDays } from "@/lib/course-schedule";
import { holidaySet, holidayNameMap, type Holiday } from "@/lib/holidays";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

function parts(isoStr: string) { const [y, m, d] = isoStr.split("-").map(Number); return { y, m: m - 1, d }; }
function iso(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
function pretty(isoStr: string) { const { y, m, d } = parts(isoStr); return `${d} ${MONTHS[m].slice(0, 3)} ${y}`; }

export default function CourseSchedulePreview({
  startISO, weekday, weekdays, lessons, holidays = [], lessonDates: override, onChangeDates,
}: {
  startISO: string;
  weekday?: number | null;          // legacy single day
  weekdays?: number[];              // all class days (preferred)
  lessons: number;                  // total lessons across all days
  holidays?: Holiday[];
  lessonDates?: string[];           // explicit dates — overrides the computed schedule
  // When given, the calendar is clickable: click a lesson to SKIP it (a
  // replacement is added after the last lesson, so the course keeps its length),
  // click any other day to ADD a lesson. Receives the full new date list.
  onChangeDates?: (dates: string[]) => void;
}) {
  const wdKey = (weekdays && weekdays.length > 0 ? weekdays : (weekday != null ? [weekday] : [])).join(",");
  const wds = useMemo(() => (wdKey ? wdKey.split(",").map(Number) : []), [wdKey]);
  const data = useMemo(() => {
    const hs = holidaySet(holidays);
    const lessonDates = override && override.length > 0
      ? [...override].sort()
      : (!startISO || wds.length === 0 || !lessons || lessons < 1 ? [] : computeLessonDatesMulti(startISO, wds, lessons, hs));
    if (lessonDates.length === 0) return null;
    const lessonNo = new Map(lessonDates.map((d, i) => [d, i + 1]));
    const holMap = holidayNameMap(holidays);
    const last = lessonDates[lessonDates.length - 1];
    const wdset = new Set(wds);

    // holidays that land on a class day within the term = skipped sessions
    const skipped: Holiday[] = [];
    let cur = lessonDates[0];
    while (cur <= last) {
      if (holMap.has(cur) && wdset.has(weekdayOf(cur))) skipped.push({ date: cur, name: holMap.get(cur)! });
      cur = addDays(cur, 1);
    }

    // months spanned
    const first = parts(lessonDates[0]); const lastP = parts(last);
    const months: Array<{ y: number; m: number }> = [];
    let y = first.y, m = first.m;
    while (y < lastP.y || (y === lastP.y && m <= lastP.m)) { months.push({ y, m }); if (++m > 11) { m = 0; y++; } }

    return { lessonDates, lessonNo, holMap, skipped, months, last, wdset, hs };
  }, [startISO, wds, lessons, holidays, override]);

  function toggleDate(date: string) {
    if (!data || !onChangeDates) return;
    const current = data.lessonDates;
    if (current.includes(date)) {
      // Skip this lesson and add one on the next free class day after the last.
      const rest = current.filter((d) => d !== date);
      const taken = new Set(rest);
      let cur = addDays(rest[rest.length - 1] ?? date, 1);
      for (let g = 0; g < 366; g++, cur = addDays(cur, 1)) {
        if (data.wdset.has(weekdayOf(cur)) && !data.hs.has(cur) && !taken.has(cur) && cur !== date) break;
      }
      onChangeDates([...rest, cur].sort());
    } else {
      onChangeDates([...current, date].sort());
    }
  }

  if (!data) {
    return <p className="text-sm text-ink-muted">Set a start date, class days and number of weeks to preview the schedule.</p>;
  }
  const { lessonDates, lessonNo, holMap, skipped, months, last, wdset } = data;
  const editable = !!onChangeDates;

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
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rosso/15 border border-rosso inline-block" /> Holiday / closure (session skipped)</span>
      </div>
      {editable && (
        <p className="mt-2 text-xs text-azzurro-deep">
          <b>Tip:</b> click a lesson to skip that date (one replacement lesson is added at the end), or click any other day to add a lesson.
        </p>
      )}

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
                {DOW.map((d, i) => <div key={i} className="text-[10px] text-ink-muted py-1">{d}</div>)}
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const date = iso(y, m, day);
                  const isLesson = lessonNo.has(date);
                  const holName = holMap.get(date);
                  const onClassDay = wdset.has(weekdayOf(date));
                  const isSkip = !!holName && onClassDay && date >= lessonDates[0] && date <= last;
                  let cls = "text-ink";
                  let title = "";
                  if (isLesson) { cls = "bg-azzurro-deep text-cream font-medium"; title = `Lesson ${lessonNo.get(date)}`; }
                  else if (isSkip) { cls = "bg-rosso/15 text-rosso line-through"; title = `${holName} — class skipped`; }
                  else if (holName) { cls = "text-rosso"; title = holName; }
                  if (editable) {
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleDate(date)}
                        title={isLesson ? `${title} — click to skip this date` : `${title ? title + " — " : ""}click to add a lesson`}
                        className={`aspect-square flex items-center justify-center text-[11px] rounded ${cls} hover:ring-2 hover:ring-azzurro-deep/50`}
                      >
                        {day}
                      </button>
                    );
                  }
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
