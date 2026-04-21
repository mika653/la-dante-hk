"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Calendar, Users, MapPin, User } from "lucide-react";
import { addCourse } from "@/lib/admin-store";
import { levelOutcomes } from "@/lib/data";
import type { Course, Language, CourseType, CEFRLevel } from "@/lib/data";

type Step = 1 | 2 | 3 | 4;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LOCATIONS = ["Wanchai", "Online", "Corporate"] as const;
const TEACHERS = ["Giulia Marchetti", "Marco Rossi", "Sofia Bianchi", "Elena Conti", "Anna De Luca", "Dr. Paolo Venturi"];
const LEVELS: CEFRLevel[] = ["A1.1", "A1.2", "A1.3", "A2.1", "A2.2", "A2.3", "B1.1", "B1.2", "B1.3", "B2", "C1"];

export default function NewCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
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
  const [teacher, setTeacher] = useState(TEACHERS[0]);
  const [maxStudents, setMaxStudents] = useState(8);
  const [priceHKD, setPriceHKD] = useState(4800);
  const [description, setDescription] = useState("");

  function toggleDay(d: string) { setDays((l) => (l.includes(d) ? l.filter((x) => x !== d) : [...l, d])); }

  function autoTitle() {
    const levelLabel = LEVELS.includes(level as CEFRLevel) ? level : "Beginner";
    const typeLabel = type === "adult-group" ? "Adult Group" : type === "kids" ? "Kids" : type === "corporate" ? "Corporate" : type === "private" ? "Private" : type === "latin-group" ? "Latin Group" : "Online";
    const langLabel = lang === "italian" ? "Italian" : "Latin";
    const dayLabel = days.length > 0 ? ` — ${days.join("/")}` : "";
    return `${levelLabel} ${langLabel} ${typeLabel}${dayLabel}`;
  }

  function applySuggestedDescription() {
    const key = typeof level === "string" ? level.slice(0, 2) : "A1";
    const info = levelOutcomes[key];
    if (info) {
      const bullets = info.outcomes.map((o) => `• ${o}`).join("\n");
      setDescription(`After this course you will be able to:\n${bullets}`);
    }
  }

  function publish() {
    const course: Course = {
      id: `new-${Date.now()}`,
      language: lang,
      type,
      level,
      title: title || autoTitle(),
      dayLabel: `${days.join("/")} ${startTime}–${endTime}`,
      startISO: startDate || new Date().toISOString().slice(0, 10),
      endISO: endDate || new Date(Date.now() + 1000*60*60*24*70).toISOString().slice(0, 10),
      hours: 30,
      location,
      teacher,
      priceHKD,
      seats: maxStudents,
      enrolled: 0,
      status: "Published",
    };
    addCourse(course);
    // Where this course will appear on the public site
    const publicPath =
      course.type === "adult-group" ? "/courses/italian/adult-groups" :
      course.type === "kids"        ? "/courses/italian/kids" :
      course.type === "private"     ? "/courses/italian/private" :
      course.type === "corporate"   ? "/courses/italian/corporate" :
      course.type === "online"      ? "/courses/italian/online" :
      course.type === "latin-group" ? "/courses/latin" :
      "/courses";
    try { sessionStorage.setItem("ladante-admin-flash", `Published "${course.title}". It's now live at ${publicPath}.`); } catch {}
    router.push(`/admin/courses?view=${encodeURIComponent(publicPath)}`);
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to courses</Link>

      <p className="eyebrow">Admin · New course</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Create a new course.</h1>
      <p className="mt-2 text-ink-muted">Four steps. We&apos;ll publish it to the website instantly.</p>

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
                ] as Array<{ v: CourseType; l: string }>).map((t) => (
                  <button key={t.v} type="button" onClick={() => setType(t.v)} className={`px-5 py-2.5 rounded-full border ${type === t.v ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{t.l}</button>
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
              <label className="text-sm font-medium">Starts on<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
              <label className="text-sm font-medium">Ends on<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
            </div>
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
                <select value={teacher} onChange={(e) => setTeacher(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white">
                  {TEACHERS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Max students<input type="number" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
              <label className="text-sm font-medium">Price (HKD)<input type="number" value={priceHKD} onChange={(e) => setPriceHKD(Number(e.target.value))} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white" /></label>
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
              <button type="button" onClick={() => setStep(4)} className="btn btn-primary">Preview <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <p className="eyebrow">This is how it will appear on the site</p>
            <div className="frame p-5 md:p-6 bg-cream-2/50">
              <p className="text-[11px] font-mono uppercase tracking-widest text-azzurro-deep">{level}</p>
              <h3 className="mt-1 text-lg md:text-xl font-semibold">{title || autoTitle()}</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Calendar size={13} aria-hidden />{startDate || "—"} → {endDate || "—"}</span>
                <span className="inline-flex items-center gap-1.5"><Users size={13} aria-hidden />{days.join("/")} · {startTime}–{endTime}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden />{location}</span>
                <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden />{teacher}</span>
              </div>
              <p className="mt-3 text-sm font-heading font-bold">HK${priceHKD.toLocaleString()}</p>
              {description && <p className="mt-3 text-[14px] text-ink-muted whitespace-pre-line">{description}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(3)} className="btn btn-ghost"><ArrowLeft size={16} /> Edit</button>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost">Save as draft</button>
                <button type="button" onClick={publish} className="btn btn-primary">Publish now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
