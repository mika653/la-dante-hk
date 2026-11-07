"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, RefreshCw, Plus, Trash2, Wand2 } from "lucide-react";
import { getCourses, updateCourse } from "@/lib/admin-store";
import type { Course, Language, CourseType } from "@/lib/data";
import { computeEndDateMulti, computeLessonDatesMulti, parseDayLabel, weekdayOf, daysBetween, dayLabelFromMulti } from "@/lib/course-schedule";
import { holidaySet } from "@/lib/holidays";
import { plidaDateSet } from "@/lib/plida-dates";
import { useClosures } from "@/lib/use-closures";
import CourseSchedulePreview from "@/components/CourseSchedulePreview";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOW_IDX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const TYPES: Array<{ v: CourseType; l: string }> = [
  { v: "adult-group", l: "Adult group" },
  { v: "kids", l: "Kids & teens" },
  { v: "private", l: "Private" },
  { v: "corporate", l: "Corporate" },
  { v: "online", l: "Online" },
  { v: "latin-group", l: "Latin group" },
  { v: "special", l: "Special course" },
];
const LEVELS = [
  "A1.1", "A1.2", "A1.3",
  "A2.1", "A2.2", "A2.3", "A2.4",
  "B1.1", "B1.2", "B1.3", "B1.4", "B1.5",
  "B2.1", "B2.2", "B2.3", "B2.4", "B2.5",
  "C1.1", "C1.2", "C1.3", "C1.4", "C1.5",
  "C2.1", "C2.2", "C2.3", "C2.4", "C2.5",
  "Beginner", "Intermediate", "Advanced",
];
const LOCATIONS: Course["location"][] = ["Wanchai", "Online", "Corporate"];

export default function EditCourseClient({ id }: { id: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  // editable fields
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Course["status"]>("Published");
  const [lang, setLang] = useState<Language>("italian");
  const [type, setType] = useState<CourseType>("adult-group");
  const [level, setLevel] = useState<string>("A1.1");
  const [teacher, setTeacher] = useState("");
  const [location, setLocation] = useState<Course["location"]>("Wanchai");
  const [dayLabel, setDayLabel] = useState("");
  const [startISO, setStartISO] = useState("");
  const [endISO, setEndISO] = useState("");
  const [hours, setHours] = useState(30);
  const [priceHKD, setPriceHKD] = useState(0);
  const [seats, setSeats] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  const [courseCode, setCourseCode] = useState("");
  const [lessons, setLessons] = useState<number | "">("");
  const [earlyBirdDueISO, setEarlyBirdDueISO] = useState("");
  const [earlyBirdFeeHKD, setEarlyBirdFeeHKD] = useState<number | "">("");
  const [skipPlida, setSkipPlida] = useState(false);
  const [weekdays, setWeekdays] = useState<number[]>([]);       // all class days
  const [lessonDates, setLessonDates] = useState<string[]>([]); // manual date overrides; [] = auto
  const [allTeachers, setAllTeachers] = useState<string[]>([]);
  const { holidays: holidayList, plida: plidaList } = useClosures();

  useEffect(() => {
    let alive = true;
    getCourses().then((all) => {
      if (!alive) return;
      const c = all.find((x) => x.id === id);
      if (!c) { setNotFound(true); return; }
      setCourse(c);
      setTitle(c.title);
      setStatus(c.status);
      setLang(c.language);
      setType(c.type);
      setLevel(c.level);
      setTeacher(c.teacher);
      setLocation(c.location);
      setDayLabel(c.dayLabel);
      setStartISO((c.startISO || "").slice(0, 10));
      setEndISO((c.endISO || "").slice(0, 10));
      setHours(c.hours);
      setPriceHKD(c.priceHKD);
      setSeats(c.seats);
      setEnrolled(c.enrolled);
      setCourseCode(c.courseCode ?? "");
      setLessons(typeof c.lessons === "number" ? c.lessons : "");
      setEarlyBirdDueISO((c.earlyBirdDueISO || "").slice(0, 10));
      setEarlyBirdFeeHKD(typeof c.earlyBirdFeeHKD === "number" ? c.earlyBirdFeeHKD : "");
      setSkipPlida(!!c.skipPlida);
      const wds = Array.isArray(c.weekdays) && c.weekdays.length > 0
        ? c.weekdays
        : (() => { const w = parseDayLabel(c.dayLabel).weekday ?? c.weekday ?? (c.startISO ? weekdayOf(c.startISO) : null); return w === null ? [] : [w]; })();
      setWeekdays(wds);
      setLessonDates(Array.isArray(c.lessonDates) ? c.lessonDates : []);
      setAllTeachers(Array.from(new Set(all.map((x) => x.teacher).filter(Boolean))));
    }).catch(() => { if (alive) setNotFound(true); });
    return () => { alive = false; };
  }, [id]);

  // Dates the scheduler skips: public holidays + PLIDA exam days when this class pauses for them.
  function skipDates(skip: boolean = skipPlida): Set<string> {
    const s = holidaySet(holidayList);
    if (skip) for (const d of plidaDateSet(plidaList)) s.add(d);
    return s;
  }

  // Effective class days — fall back to the label's day so legacy courses still work.
  function effWeekdays(wds: number[] = weekdays): number[] {
    if (wds.length > 0) return wds;
    const w = parseDayLabel(dayLabel).weekday ?? (startISO ? weekdayOf(startISO) : null);
    return w === null ? [] : [w];
  }

  // Toggle the PLIDA skip and refresh the end date with the new setting.
  function toggleSkipPlida(checked: boolean) {
    setSkipPlida(checked);
    const wds = effWeekdays();
    if (!startISO || wds.length === 0) return;
    const n = lessons === "" ? 10 : Number(lessons);
    setEndISO(computeEndDateMulti(startISO, wds, n, skipDates(checked)));
  }

  // Recompute the end date from the start, total lessons, and class days — skipping closures.
  function recomputeEnd() {
    const wds = effWeekdays();
    if (!startISO || wds.length === 0) return;
    const n = lessons === "" ? 10 : Number(lessons);
    setEndISO(computeEndDateMulti(startISO, wds, n, skipDates()));
  }

  // Auto-fill the end date when the start date or total lessons changes.
  function autoEnd(startVal: string, totalVal: number | "", wds: number[] = weekdays) {
    const days = effWeekdays(wds);
    if (!startVal || totalVal === "" || days.length === 0) return;
    setEndISO(computeEndDateMulti(startVal, days, Number(totalVal), skipDates()));
  }

  // Day-of-week picker (keeps the display label's day portion in sync).
  function toggleDay(d: string) {
    const wd = DOW_IDX[d];
    const next = (weekdays.includes(wd) ? weekdays.filter((x) => x !== wd) : [...weekdays, wd]).sort((a, b) => a - b);
    setWeekdays(next);
    const { startTime, endTime } = parseDayLabel(dayLabel);
    if (startTime && endTime && next.length > 0) setDayLabel(dayLabelFromMulti(next, startTime, endTime));
    autoEnd(startISO, lessons, next);
  }

  // #5b — manual lesson dates. "Customise" seeds the list from the computed
  // schedule so the admin can tweak individual dates; "Reset" clears it to auto.
  function customiseDates() {
    const wds = effWeekdays();
    const n = lessons === "" ? 10 : Number(lessons);
    const computed = computeLessonDatesMulti(startISO, wds, n, skipDates());
    if (computed.length > 0) setLessonDates(computed);
  }
  function setOneDate(i: number, v: string) { setLessonDates((l) => l.map((d, n) => (n === i ? v : d))); }
  function removeDate(i: number) { setLessonDates((l) => l.filter((_, n) => n !== i)); }
  function addDate() {
    const last = lessonDates[lessonDates.length - 1] || startISO || new Date().toISOString().slice(0, 10);
    setLessonDates((l) => [...l, last]);
  }

  async function save() {
    setSaveErr(null);
    try {
    const sortedDates = lessonDates.length > 0 ? [...lessonDates].sort() : [];
    const finalEnd = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : endISO;
    await updateCourse(id, {
      title: title.trim() || course?.title || "Untitled course",
      status,
      language: lang,
      type,
      level: level as Course["level"],
      teacher,
      location,
      dayLabel,
      startISO,
      endISO: finalEnd,
      hours,
      priceHKD,
      seats,
      enrolled,
      courseCode: courseCode.trim() || undefined,
      lessons: lessons === "" ? undefined : Number(lessons),
      weekday: weekdays.length > 0 ? weekdays[0] : undefined,
      weekdays: weekdays.length > 0 ? weekdays : undefined,
      lessonDates: sortedDates.length > 0 ? sortedDates : undefined,
      earlyBirdDueISO: earlyBirdDueISO || undefined,
      earlyBirdFeeHKD: earlyBirdFeeHKD === "" ? undefined : Number(earlyBirdFeeHKD),
      skipPlida,
    });
    const msg = status === "Draft"
      ? `Saved changes to "${title}". It's a draft — not live yet.`
      : `Saved changes to "${title}". It's live on the site.`;
    try { sessionStorage.setItem("ladante-admin-flash", msg); } catch {}
    router.push("/admin/courses");
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      setSaveErr(/Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to save. Please sign in first." : m);
    }
  }

  if (notFound) {
    return (
      <div className="max-w-3xl">
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to courses</Link>
        <div className="frame p-8 bg-white text-center">
          <h1 className="text-2xl">Course not found.</h1>
          <p className="mt-2 text-ink-muted">It may have been deleted, or the demo data was reset. Head back and pick a course from the list.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="max-w-3xl text-ink-muted">Loading…</div>;
  }

  const field = "mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to courses</Link>

      <p className="eyebrow">Admin · Edit course</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{course.continuationOf ? "Review continuation." : "Edit course."}</h1>
      <p className="mt-2 text-ink-muted">Change any field, then save. Updates appear on the site immediately.</p>

      {course.continuationOf && (
        <div className="mt-5 frame p-4 bg-azzurro-soft border border-azzurro-deep/20 flex items-start gap-3">
          <Sparkles size={18} className="text-azzurro-deep shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-azzurro-deep">
            <b>Auto-generated continuation.</b> The level, dates and early-bird deadline were calculated for you (weekly, skipping public holidays). Review below, adjust anything, then set <b>Published</b> to post it.
          </p>
        </div>
      )}

      <div className="mt-8 frame p-6 md:p-8 bg-white space-y-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="flex gap-2">
            {(["Published", "Draft"] as Course["status"][]).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={`px-5 py-2.5 rounded-full border ${status === s ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{s}</button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-muted">{status === "Draft" ? "Draft courses are saved but hidden from the public site." : "Published courses are live and visible to visitors."}</p>
        </div>

        {/* Title */}
        <label className="block text-sm font-medium">Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
        </label>

        {/* Course code + Weeks */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium">Course code <span className="text-ink-muted font-normal">(optional)</span>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g. ITA-A1.1-WED" className={field} />
          </label>
          <label className="block text-sm font-medium">Total lessons <span className="text-ink-muted font-normal">(auto-fills the end date)</span>
            <input type="number" min={1} value={lessons} onChange={(e) => { const w = e.target.value === "" ? "" : Number(e.target.value); setLessons(w); autoEnd(startISO, w); }} placeholder="e.g. 15" className={field} />
          </label>
        </div>

        {/* Language + Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <div className="flex gap-2">
              {(["italian", "latin"] as Language[]).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)} className={`px-5 py-2.5 rounded-full border ${lang === l ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{l === "italian" ? "Italian" : "Latin"}</button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium">Course type
            <select value={type} onChange={(e) => setType(e.target.value as CourseType)} className={field}>
              {TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </label>
        </div>

        {/* Level + Teacher */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium">Level
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Teacher
            <input list="edit-teacher-options" value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Pick or type a teacher" className={field} />
            <datalist id="edit-teacher-options">{allTeachers.map((t) => <option key={t} value={t} />)}</datalist>
          </label>
        </div>

        {/* Location + Schedule label */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium">Location
            <select value={location} onChange={(e) => setLocation(e.target.value as Course["location"])} className={field}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Schedule label
            <input value={dayLabel} onChange={(e) => setDayLabel(e.target.value)} placeholder="e.g. Wed 18:30–21:30" className={field} />
          </label>
        </div>

        {/* Class days */}
        <div>
          <label className="block text-sm font-medium mb-2">Class days <span className="text-ink-muted font-normal">(pick two for twice-a-week / intensive courses)</span></label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = weekdays.includes(DOW_IDX[d]);
              return <button key={d} type="button" onClick={() => toggleDay(d)} className={`px-4 py-2 rounded-full border ${on ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{d}</button>;
            })}
          </div>
        </div>

        {/* Dates */}
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">Starts on
              <input type="date" value={startISO} onChange={(e) => { setStartISO(e.target.value); autoEnd(e.target.value, lessons); }} className={field} />
            </label>
            <label className="block text-sm font-medium">Ends on <span className="text-ink-muted font-normal">(auto — movable)</span>
              <input type="date" value={endISO} onChange={(e) => setEndISO(e.target.value)} className={field} />
            </label>
          </div>
          <button type="button" onClick={recomputeEnd} className="mt-2 inline-flex items-center gap-1.5 text-xs text-azzurro-deep hover:underline">
            <RefreshCw size={12} /> Recalculate end date from weeks (skips holidays &amp; closures)
          </button>
        </div>

        {/* Skip PLIDA */}
        <div className="rounded-2xl border border-line bg-cream-2/40 p-4 md:p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={skipPlida} onChange={(e) => toggleSkipPlida(e.target.checked)} className="mt-1 accent-azzurro-deep w-4 h-4" />
            <span className="text-sm">
              <b>Skip sessions on PLIDA exam days.</b>
              <span className="block text-ink-muted mt-0.5">This class won&apos;t meet on official PLIDA exam dates — it just runs a week longer. Dates come from your <Link href="/admin/holidays" className="text-azzurro-deep underline">holidays &amp; exam days</Link> list.</span>
            </span>
          </label>
        </div>

        {/* Schedule preview */}
        <div className="rounded-2xl border border-line bg-cream-2/40 p-4 md:p-5">
          <label className="block text-sm font-medium mb-3">Schedule preview</label>
          <CourseSchedulePreview
            startISO={startISO}
            weekdays={effWeekdays()}
            lessons={lessons !== "" ? Number(lessons) : (startISO && endISO ? Math.max(1, Math.floor(daysBetween(startISO, endISO) / 7) + 1) : 0)}
            lessonDates={lessonDates.length > 0 ? lessonDates : undefined}
            holidays={skipPlida ? [...holidayList, ...plidaList] : holidayList}
          />
        </div>

        {/* Individual lesson dates — manual overrides (#5b) */}
        <div className="rounded-2xl border border-line bg-cream-2/40 p-4 md:p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <label className="block text-sm font-medium">Individual lesson dates</label>
            {lessonDates.length === 0 ? (
              <button type="button" onClick={customiseDates} className="text-xs text-azzurro-deep hover:underline inline-flex items-center gap-1"><Wand2 size={12} /> Edit dates by hand</button>
            ) : (
              <button type="button" onClick={() => setLessonDates([])} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><RefreshCw size={12} /> Reset to automatic</button>
            )}
          </div>
          {lessonDates.length === 0 ? (
            <p className="text-xs text-ink-muted">Dates are calculated automatically from the start date, class days and holidays. Click <b>Edit dates by hand</b> to move, add or remove individual lessons — e.g. a one-off holiday or a make-up class.</p>
          ) : (
            <>
              <p className="text-xs text-ink-muted mb-2">These exact dates are used for this course (automatic calculation is off). {lessonDates.length} lesson{lessonDates.length === 1 ? "" : "s"} — the end date follows the last one.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {lessonDates.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted w-6 shrink-0">#{i + 1}</span>
                    <input type="date" value={d} onChange={(e) => setOneDate(i, e.target.value)} className="flex-1 h-9 px-3 rounded-lg border border-line bg-white text-sm" />
                    <button type="button" onClick={() => removeDate(i)} aria-label="Remove date" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted shrink-0"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addDate} className="mt-2 text-xs text-azzurro-deep hover:underline inline-flex items-center gap-1"><Plus size={12} /> Add a date</button>
            </>
          )}
        </div>

        {/* Early bird */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium">Early-bird deadline <span className="text-ink-muted font-normal">(optional)</span>
            <input type="date" value={earlyBirdDueISO} onChange={(e) => setEarlyBirdDueISO(e.target.value)} className={field} />
          </label>
          <label className="block text-sm font-medium">Early-bird fee (HKD)
            <input type="number" value={earlyBirdFeeHKD} onChange={(e) => setEarlyBirdFeeHKD(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 4300" className={field} />
          </label>
        </div>

        {/* Numbers */}
        <div className="grid md:grid-cols-4 gap-4">
          <label className="block text-sm font-medium">Hours
            <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className={field} />
          </label>
          <label className="block text-sm font-medium">Price (HKD)
            <input type="number" value={priceHKD} onChange={(e) => setPriceHKD(Number(e.target.value))} className={field} />
          </label>
          <label className="block text-sm font-medium">Seats
            <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={field} />
          </label>
          <label className="block text-sm font-medium">Enrolled
            <input type="number" value={enrolled} onChange={(e) => setEnrolled(Number(e.target.value))} className={field} />
          </label>
        </div>

        {saveErr && <p className="text-sm bg-rosso/10 text-rosso rounded-lg px-3 py-2">{saveErr}</p>}
        <div className="flex items-center justify-between pt-2 border-t border-line">
          <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
          <button type="button" onClick={save} className="btn btn-primary"><Save size={16} /> {course.continuationOf ? "Confirm & save" : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}
