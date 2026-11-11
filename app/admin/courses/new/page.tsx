"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Calendar, Users, MapPin, User, Hash, RefreshCw } from "lucide-react";
import { addCourse } from "@/lib/admin-store";
import type { Course, Language, CourseType, CEFRLevel } from "@/lib/data";
import { generateContinuation, nextLevel, computeEndDateMulti, countClassDays } from "@/lib/course-schedule";
import { getCourseDefaults, listTeacherNames } from "@/lib/course-defaults-actions";
import { descriptionFor, mergeTeacherNames, DEFAULT_COURSE_DEFAULTS, type CourseDefaults } from "@/lib/course-defaults-shared";
import { generateCourseCode } from "@/lib/course-code";
import { listAllCourses } from "@/lib/course-actions";
import { holidaySet } from "@/lib/holidays";
import { plidaDateSet } from "@/lib/plida-dates";
import { useClosures } from "@/lib/use-closures";
import CourseSchedulePreview from "@/components/CourseSchedulePreview";

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to save courses. Please sign in first." : m;
}

type Step = 1 | 2 | 3 | 4;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOW_IDX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const LOCATIONS = ["Wanchai", "Online", "Corporate"] as const;
const LEVELS: CEFRLevel[] = [
  "A1.1", "A1.2", "A1.3",
  "A2.1", "A2.2", "A2.3", "A2.4",
  "B1.1", "B1.2", "B1.3", "B1.4", "B1.5",
  "B2.1", "B2.2", "B2.3", "B2.4", "B2.5",
  "C1.1", "C1.2", "C1.3", "C1.4", "C1.5",
  "C2.1", "C2.2", "C2.3", "C2.4", "C2.5",
];

export default function NewCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [err, setErr] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>("italian");
  const [type, setType] = useState<CourseType>("adult-group");
  const [level, setLevel] = useState<CEFRLevel>("A1.1");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<string[]>(["Wed"]);
  const [startTime, setStartTime] = useState("18:30");
  const [endTime, setEndTime] = useState("21:30");
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]>("Wanchai");
  const [teacher, setTeacher] = useState("");
  const [maxStudents, setMaxStudents] = useState(8);
  // No fixed fee: pre-filled from Course defaults for the chosen type (until the
  // admin types their own), otherwise left blank and required.
  const [priceHKD, setPriceHKD] = useState<number | "">("");
  const [priceTouched, setPriceTouched] = useState(false);
  const [defaults, setDefaults] = useState<CourseDefaults>(DEFAULT_COURSE_DEFAULTS);
  const [teacherNames, setTeacherNames] = useState<string[]>([]);
  const [lessonDates, setLessonDates] = useState<string[]>([]); // hand-adjusted dates; [] = automatic
  const [description, setDescription] = useState("");
  const [createNext, setCreateNext] = useState(false);
  const [gapWeeks, setGapWeeks] = useState(1);
  const [weeks, setWeeks] = useState<number | "">("");
  const [skipPlida, setSkipPlida] = useState(false);
  const { holidays: holidayList, plida: plidaList } = useClosures();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  useEffect(() => {
    listAllCourses().then(setAllCourses).catch(() => {});
    listTeacherNames().then(setTeacherNames).catch(() => {});
    getCourseDefaults().then(setDefaults).catch(() => {});
  }, []);
  // Teacher picker: Course defaults list + teacher logins + anyone on a course.
  // Live course-code preview: the next code from the codes already in use.
  const teacherOptions = mergeTeacherNames(teacherNames, allCourses.map((c) => c.teacher));
  const defaultFee = defaults.feeByType[type];
  // Until the admin types a fee, show the default for the chosen course type.
  const feeValue: number | "" = priceTouched ? priceHKD : (defaultFee ?? "");
  function chooseType(t: CourseType) { setType(t); }
  const codePreview = generateCourseCode(
    { language: lang, type, startISO: startDate || new Date().toISOString().slice(0, 10) },
    allCourses.map((c) => c.courseCode),
  );

  // The dates the scheduler skips: always public holidays, plus PLIDA exam days
  // when this class is set to pause for them. Both come from the shared list.
  function skipDates(skip: boolean): Set<string> {
    const s = holidaySet(holidayList);
    if (skip) for (const d of plidaDateSet(plidaList)) s.add(d);
    return s;
  }

  // Auto-fill the end date from start + duration (weeks) across ALL class days,
  // skipping closures. Total lessons = weeks × days-per-week.
  function autoEndFor(start: string, wk: number | "", dys: string[], skip: boolean = skipPlida) {
    if (!start || wk === "" || dys.length === 0) return;
    const wds = dys.map((d) => DOW_IDX[d]);
    setEndDate(computeEndDateMulti(start, wds, Number(wk) * dys.length, skipDates(skip)));
  }

  // Total lessons: weeks × class days, else the class days between start and end.
  const weekdayIdx = days.map((d) => DOW_IDX[d]);
  const totalLessons = weeks !== ""
    ? Number(weeks) * Math.max(1, days.length)
    : (startDate && endDate ? countClassDays(startDate, endDate, weekdayIdx, skipDates(skipPlida)) : 0);
  // Any change to the basic schedule discards hand-adjusted dates.
  function resetDates() { setLessonDates([]); }

  function toggleDay(d: string) {
    const nl = days.includes(d) ? days.filter((x) => x !== d) : [...days, d];
    setDays(nl);
    resetDates();
    autoEndFor(startDate, weeks, nl);
  }

  function autoTitle() {
    const levelLabel = LEVELS.includes(level as CEFRLevel) ? level : "Beginner";
    const typeLabel = type === "adult-group" ? "Adult Group" : type === "kids" ? "Kids" : type === "corporate" ? "Corporate" : type === "private" ? "Private" : type === "latin-group" ? "Latin Group" : type === "special" ? "Special" : "Online";
    const langLabel = lang === "italian" ? "Italian" : "Latin";
    const dayLabel = days.length > 0 ? ` — ${days.join("/")}` : "";
    return `${levelLabel} ${langLabel} ${typeLabel}${dayLabel}`;
  }

  // Text comes from Admin → Courses → Course defaults (built-in text if unset).
  function applySuggestedDescription() {
    const text = descriptionFor(defaults, lang, level);
    if (text) setDescription(text);
  }

  function buildCourse(status: Course["status"]): Course {
    return {
      id: `new-${Date.now()}`,
      language: lang,
      type,
      level,
      title: title || autoTitle(),
      dayLabel: `${days.join("/")} ${startTime}–${endTime}`,
      startISO: lessonDates[0] || startDate || new Date().toISOString().slice(0, 10),
      endISO: lessonDates[lessonDates.length - 1] || endDate || new Date(Date.now() + 1000*60*60*24*70).toISOString().slice(0, 10),
      hours: 30,
      location,
      teacher: teacher.trim(),
      priceHKD: feeValue === "" ? 0 : feeValue,
      seats: maxStudents,
      description: description.trim() || undefined,
      lessonDates: lessonDates.length > 0 ? lessonDates : undefined,
      enrolled: 0,
      status,
      weekday: days[0] !== undefined ? DOW_IDX[days[0]] : undefined,
      weekdays: days.length > 0 ? days.map((d) => DOW_IDX[d]) : undefined,
      startTime,
      endTime,
      lessons: lessonDates.length > 0 ? lessonDates.length : (totalLessons > 0 ? totalLessons : undefined),
      skipPlida,
    };
  }

  // Optionally generate the next-level course as a draft (returns a message fragment).
  async function maybeCreateNext(course: Course): Promise<string> {
    if (!createNext || !nextLevel(course.level)) return "";
    const cont = generateContinuation(course, { gapWeeks, holidays: skipDates(!!course.skipPlida) });
    if (!cont) return "";
    await addCourse(cont);
    return ` The ${cont.level} continuation was created as a draft — review and publish it when ready.`;
  }

  // The fee is required (no more silent HK$4,800 default).
  function priceOk(): boolean {
    if (feeValue === "" || feeValue <= 0) { setErr("Please enter the course fee. You can set a default fee per course type in Course defaults."); setStep(3); return false; }
    return true;
  }

  async function publish() {
    if (!priceOk()) return;
    const course = buildCourse("Published");
    let code = "";
    try { code = await addCourse(course); } catch (e) { setErr(errText(e)); return; }
    const nextMsg = await maybeCreateNext(course);
    // Where this course will appear on the public site
    const publicPath =
      course.type === "adult-group" ? "/courses/italian/adult-groups" :
      course.type === "kids"        ? "/courses/italian/kids" :
      course.type === "private"     ? "/courses/italian/private" :
      course.type === "corporate"   ? "/courses/italian/corporate" :
      course.type === "online"      ? "/courses/italian/online" :
      course.type === "latin-group" ? "/courses/latin/groups" :
      course.type === "special"     ? "/courses/italian/special" :
      "/courses";
    try { sessionStorage.setItem("ladante-admin-flash", `Published "${course.title}" — course code ${code}. It's now live at ${publicPath}.${nextMsg}`); } catch {}
    router.push(`/admin/courses?view=${encodeURIComponent(publicPath)}&highlight=${encodeURIComponent(course.id)}`);
  }

  async function saveDraft() {
    if (!priceOk()) return;
    const course = buildCourse("Draft");
    let code = "";
    try { code = await addCourse(course); } catch (e) { setErr(errText(e)); return; }
    const nextMsg = await maybeCreateNext(course);
    try { sessionStorage.setItem("ladante-admin-flash", `Saved "${course.title}" as a draft — course code ${code}. It's not live yet — open it any time to finish and publish.${nextMsg}`); } catch {}
    router.push(`/admin/courses?highlight=${encodeURIComponent(course.id)}`);
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to courses</Link>

      <p className="eyebrow">Admin · New course</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Create a new course.</h1>
      <p className="mt-2 text-ink-muted">Four steps. We&apos;ll publish it to the website instantly.</p>

      {/* Course code — shown from the first step; updates with language, type and start date */}
      <div className="mt-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-azzurro-deep/25 bg-azzurro-soft px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-sm text-azzurro-deep"><Hash size={14} aria-hidden /> Course code</span>
        <span className="font-mono font-bold text-lg text-ink tracking-wide">{codePreview}</span>
        <span className="text-xs text-ink-muted">{startDate ? "Assigned on save. It only changes if someone saves another course in the same batch first." : "Pick a start date (step 2) to set the term."}</span>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2 md:gap-3 mt-8 text-xs md:text-sm">
        {["Basics", "Schedule", "Details", "Review"].map((label, i) => {
          const n = (i + 1) as Step;
          const active = n === step;
          const past = n < step;
          return (
            <li key={label} className="flex items-center gap-2 md:gap-3 flex-1">
              <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-heading font-bold shrink-0 ${active ? "bg-ink text-cream" : past ? "bg-sole text-ink" : "border border-line text-ink-muted"}`}>{past ? <Check size={14} /> : n}</span>
              <span className={`font-medium hidden md:inline ${active ? "text-ink" : "text-ink-muted"}`}>{label}</span>
              {i < 3 && <span className="flex-1 h-px bg-line" aria-hidden />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 frame p-6 md:p-8 bg-white">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <div className="flex gap-2">
                {(["italian", "latin"] as Language[]).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)} className={`px-5 py-2.5 rounded-full border ${lang === l ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{l === "italian" ? "Italian" : "Latin"}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Course type</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { v: "adult-group", l: "Adult group" },
                  { v: "kids", l: "Kids & teens" },
                  { v: "private", l: "Private" },
                  { v: "corporate", l: "Corporate" },
                  { v: "online", l: "Online" },
                  { v: "latin-group", l: "Latin group" },
                  { v: "special", l: "Special course" },
                ] as Array<{ v: CourseType; l: string }>).map((t) => (
                  <button key={t.v} type="button" onClick={() => chooseType(t.v)} className={`px-5 py-2.5 rounded-full border ${type === t.v ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{t.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value as CEFRLevel)} className="h-12 px-4 rounded-xl border border-line bg-white w-full max-w-xs">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title <span className="text-ink-muted font-normal">(leave blank to auto-generate)</span></label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={autoTitle()} className="h-12 px-4 rounded-xl border border-line bg-white w-full" />
            </div>
            <div className="flex justify-end"><button type="button" onClick={() => setStep(2)} className="btn btn-primary">Next: Schedule <ArrowRight size={16} /></button></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium">Starts on<input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); resetDates(); autoEndFor(e.target.value, weeks, days); }} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
              <label className="text-sm font-medium">Course duration (weeks)<input type="number" min={1} value={weeks} onChange={(e) => { const w = e.target.value === "" ? "" : Number(e.target.value); setWeeks(w); resetDates(); autoEndFor(startDate, w, days); }} placeholder="e.g. 11" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
            </div>
            <label className="block text-sm font-medium">Ends on <span className="text-ink-muted font-normal">— auto-calculated from the duration; you can still move it for holidays</span>
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); resetDates(); }} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" />
            </label>
            <div>
              <label className="block text-sm font-medium mb-2">Which days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const on = days.includes(d);
                  return <button key={d} type="button" onClick={() => toggleDay(d)} className={`px-4 py-2 rounded-full border ${on ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{d}</button>;
                })}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium">Start time<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
              <label className="text-sm font-medium">End time<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
            </div>
            <label className="block text-sm font-medium">Location
              <select value={location} onChange={(e) => setLocation(e.target.value as (typeof LOCATIONS)[number])} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white">
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <div className="frame p-4 md:p-5 bg-cream-2/40">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={skipPlida} onChange={(e) => { setSkipPlida(e.target.checked); autoEndFor(startDate, weeks, days, e.target.checked); }} className="mt-1 accent-azzurro-deep w-4 h-4" />
                <span className="text-sm">
                  <b>Skip sessions on PLIDA exam days.</b>
                  <span className="block text-ink-muted mt-0.5">This class won&apos;t meet on official PLIDA exam dates — the course just runs a week longer. Leave it off for classes that carry on as normal. Exam dates come from your <a href="/admin/holidays" className="text-azzurro-deep underline">holidays &amp; exam days</a> list.</span>
                </span>
              </label>
            </div>
            {/* Lesson dates — public holidays are skipped automatically; click to skip/add */}
            {startDate && days.length > 0 && totalLessons > 0 && (
              <div className="frame p-4 md:p-5 bg-white border border-line">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                  <p className="text-sm font-medium">Lesson dates</p>
                  {lessonDates.length > 0 && (
                    <button type="button" onClick={resetDates} className="text-xs text-ink-muted hover:text-rosso inline-flex items-center gap-1"><RefreshCw size={12} /> Undo date changes (back to automatic)</button>
                  )}
                </div>
                <CourseSchedulePreview
                  startISO={startDate}
                  weekdays={weekdayIdx}
                  lessons={totalLessons}
                  lessonDates={lessonDates.length > 0 ? lessonDates : undefined}
                  holidays={skipPlida ? [...holidayList, ...plidaList] : holidayList}
                  onChangeDates={(d) => { setLessonDates(d); if (d.length > 0) setEndDate(d[d.length - 1]); }}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn btn-ghost"><ArrowLeft size={16} /> Back</button>
              <button type="button" onClick={() => setStep(3)} className="btn btn-primary">Next: Details <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium">Teacher
                <input list="teacher-options" value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Pick or type a teacher" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" />
                <datalist id="teacher-options">{teacherOptions.map((t) => <option key={t} value={t} />)}</datalist>
                <span className="mt-1 block text-xs font-normal text-ink-muted">Missing someone? Add them in <a href="/admin/courses/defaults" target="_blank" className="text-azzurro-deep underline">Course defaults</a>, or just type the name.</span>
              </label>
              <label className="text-sm font-medium">Max students<input type="number" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
              <label className="text-sm font-medium">Course fee (HKD) <span className="text-rosso">*</span>
                <input type="number" min={0} required value={feeValue} onChange={(e) => { setPriceTouched(true); setPriceHKD(e.target.value === "" ? "" : Number(e.target.value)); }} placeholder="e.g. 4300" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" />
                <span className="mt-1 block text-xs font-normal text-ink-muted">
                  {defaultFee ? <>Default for this course type: HK${defaultFee.toLocaleString()}. </> : <>No default fee set for this course type. </>}
                  Change defaults in <a href="/admin/courses/defaults" target="_blank" className="text-azzurro-deep underline">Course defaults</a>.
                </span>
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Course description</label>
                <button type="button" onClick={applySuggestedDescription} className="text-xs text-azzurro-deep underline">Auto-fill from level</button>
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-4 rounded-xl border border-line bg-white font-body" placeholder="Learning outcomes, who it&apos;s for, what to bring..." />
            </div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(2)} className="btn btn-ghost"><ArrowLeft size={16} /> Back</button>
              <button type="button" onClick={() => { if (feeValue === "" || feeValue <= 0) { setErr("Please enter the course fee."); return; } setErr(null); setStep(4); }} className="btn btn-primary">Preview <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <p className="eyebrow">This is how it will appear on the site</p>
            <div className="frame p-5 md:p-6 bg-cream-2/50">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[11px] font-mono uppercase tracking-widest text-azzurro-deep">{level}</p>
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">· {codePreview}</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">Course code <b className="font-mono not-italic">{codePreview}</b> (auto-generated, shown before saving). It&apos;s finalised on save — if someone else saves a course in the same batch first, the last two digits bump.</p>
              <h3 className="mt-2 text-lg md:text-xl font-semibold">{title || autoTitle()}</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Calendar size={13} aria-hidden />{lessonDates[0] || startDate || "—"} → {lessonDates[lessonDates.length - 1] || endDate || "—"}</span>
                <span className="inline-flex items-center gap-1.5"><Users size={13} aria-hidden />{days.join("/")} · {startTime}–{endTime}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden />{location}</span>
                <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden />{teacher || "Teacher to be confirmed"}</span>
              </div>
              <p className="mt-3 text-sm font-heading font-bold">HK${(feeValue || 0).toLocaleString()}</p>
              {description && <p className="mt-3 text-[14px] text-ink-muted whitespace-pre-line">{description}</p>}
            </div>

            {startDate && days[0] !== undefined && (weeks !== "" || endDate) && (
              <div className="frame p-4 md:p-5 bg-cream-2/40">
                <p className="text-sm font-medium mb-3">Schedule preview</p>
                <CourseSchedulePreview
                  startISO={startDate}
                  weekdays={weekdayIdx}
                  lessons={totalLessons}
                  lessonDates={lessonDates.length > 0 ? lessonDates : undefined}
                  holidays={skipPlida ? [...holidayList, ...plidaList] : holidayList}
                />
              </div>
            )}

            {nextLevel(level) && (
              <div className="frame p-4 md:p-5 bg-azzurro-soft/60 border border-azzurro-deep/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={createNext} onChange={(e) => setCreateNext(e.target.checked)} className="mt-1 accent-azzurro-deep w-4 h-4" />
                  <span className="text-sm">
                    <b>Also create the next-level course ({nextLevel(level)}) as a draft.</b>
                    <span className="block text-ink-muted mt-0.5">Generated automatically — same day &amp; time, next level, dates computed weekly and skipping public holidays.</span>
                  </span>
                </label>
                {createNext && (
                  <div className="mt-3 pl-7 flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-ink-muted">Start it</span>
                    <input type="number" min={0} value={gapWeeks} onChange={(e) => setGapWeeks(Math.max(0, Number(e.target.value)))} className="w-16 h-9 px-2 rounded-lg border border-line bg-white text-center" />
                    <span className="text-ink-muted">week(s) after this course ends.</span>
                  </div>
                )}
              </div>
            )}

            {err && <p className="mb-3 text-sm bg-rosso/10 text-rosso rounded-lg px-3 py-2">{err}</p>}
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(3)} className="btn btn-ghost"><ArrowLeft size={16} /> Edit</button>
              <div className="flex gap-2">
                <button type="button" onClick={saveDraft} className="btn btn-ghost">Save as draft</button>
                <button type="button" onClick={publish} className="btn btn-primary">Publish now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
