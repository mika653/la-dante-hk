"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, RefreshCw } from "lucide-react";
import { getCourses, updateCourse } from "@/lib/admin-store";
import type { Course, Language, CourseType } from "@/lib/data";
import { computeEndDate, parseDayLabel, weekdayOf } from "@/lib/course-schedule";
import { holidaySet } from "@/lib/holidays";

const TYPES: Array<{ v: CourseType; l: string }> = [
  { v: "adult-group", l: "Adult group" },
  { v: "kids", l: "Kids & teens" },
  { v: "private", l: "Private" },
  { v: "corporate", l: "Corporate" },
  { v: "online", l: "Online" },
  { v: "latin-group", l: "Latin group" },
];
const LEVELS = ["A1.1", "A1.2", "A1.3", "A2.1", "A2.2", "A2.3", "B1.1", "B1.2", "B1.3", "B2", "C1", "C2", "Beginner", "Intermediate", "Advanced"];
const LOCATIONS: Course["location"][] = ["Wanchai", "Online", "Corporate"];

export default function EditCourseClient({ id }: { id: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [notFound, setNotFound] = useState(false);

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

  useEffect(() => {
    const c = getCourses().find((x) => x.id === id);
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
  }, [id]);

  // Recompute the end date weekly from the start, weeks, and weekday — skipping public holidays.
  function recomputeEnd() {
    if (!startISO) return;
    const weekday = parseDayLabel(dayLabel).weekday ?? weekdayOf(startISO);
    const n = lessons === "" ? 10 : Number(lessons);
    setEndISO(computeEndDate(startISO, weekday, n, holidaySet()));
  }

  function save() {
    updateCourse(id, {
      title: title.trim() || course?.title || "Untitled course",
      status,
      language: lang,
      type,
      level: level as Course["level"],
      teacher,
      location,
      dayLabel,
      startISO,
      endISO,
      hours,
      priceHKD,
      seats,
      enrolled,
      courseCode: courseCode.trim() || undefined,
      lessons: lessons === "" ? undefined : Number(lessons),
      earlyBirdDueISO: earlyBirdDueISO || undefined,
      earlyBirdFeeHKD: earlyBirdFeeHKD === "" ? undefined : Number(earlyBirdFeeHKD),
    });
    const msg = status === "Draft"
      ? `Saved changes to "${title}". It's a draft — not live yet.`
      : `Saved changes to "${title}". It's live on the site.`;
    try { sessionStorage.setItem("ladante-admin-flash", msg); } catch {}
    router.push("/admin/courses");
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
          <label className="block text-sm font-medium">Weeks <span className="text-ink-muted font-normal">(number of lessons)</span>
            <input type="number" min={1} value={lessons} onChange={(e) => setLessons(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 15" className={field} />
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
            <input value={teacher} onChange={(e) => setTeacher(e.target.value)} className={field} />
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

        {/* Dates */}
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">Starts on
              <input type="date" value={startISO} onChange={(e) => setStartISO(e.target.value)} className={field} />
            </label>
            <label className="block text-sm font-medium">Ends on
              <input type="date" value={endISO} onChange={(e) => setEndISO(e.target.value)} className={field} />
            </label>
          </div>
          <button type="button" onClick={recomputeEnd} className="mt-2 inline-flex items-center gap-1.5 text-xs text-azzurro-deep hover:underline">
            <RefreshCw size={12} /> Recalculate end date from weeks (skips public holidays)
          </button>
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

        <div className="flex items-center justify-between pt-2 border-t border-line">
          <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
          <button type="button" onClick={save} className="btn btn-primary"><Save size={16} /> {course.continuationOf ? "Confirm & save" : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}
