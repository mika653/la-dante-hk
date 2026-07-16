"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Pencil, CheckCircle2, ExternalLink, X, CalendarPlus, Archive } from "lucide-react";
import { getCourses, removeCourse, addCourse, updateCourse } from "@/lib/admin-store";
import { setSeatsLeft } from "@/lib/course-actions";
import type { Course, Language, CourseType } from "@/lib/data";
import { formatHKD } from "@/lib/utils";
import { nextLevel, generateContinuation, hasStarted, isUpcoming, todayISO } from "@/lib/course-schedule";

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to change courses. Please sign in first." : m;
}

export default function AdminCoursesList() {
  const router = useRouter();
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [today] = useState(() => todayISO());
  const [lang, setLang] = useState<"all" | Language>("all");
  const [type, setType] = useState<"all" | CourseType>("all");
  const [show, setShow] = useState<"all" | "upcoming" | "started">("all");
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [flashUrl, setFlashUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const reload = () => getCourses().then(setCoursesState).catch((e) => setErr(String(e?.message ?? e)));

  useEffect(() => {
    reload();
    try {
      const msg = sessionStorage.getItem("ladante-admin-flash");
      if (msg) { setFlash(msg); sessionStorage.removeItem("ladante-admin-flash"); }
      const url = new URLSearchParams(window.location.search).get("view");
      if (url) setFlashUrl(url);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasContinuation = (id: string) => courses.some((c) => c.continuationOf === id);

  const filtered = useMemo(() => courses.filter((c) => {
    if (lang !== "all" && c.language !== lang) return false;
    if (type !== "all" && c.type !== type) return false;
    if (show === "upcoming" && !isUpcoming(c, today)) return false;
    if (show === "started" && !(hasStarted(c, today) || c.archived)) return false;
    if (q && !`${c.title} ${c.teacher} ${c.level} ${c.courseCode ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [courses, lang, type, show, q, today]);

  // Courses that have started but are still live (not archived) — they need rolling over.
  const needRollover = useMemo(
    () => courses.filter((c) => hasStarted(c, today) && !c.archived),
    [courses, today]
  );

  async function del(id: string) {
    if (!confirm("Remove this course from the site? You can re-seed the demo courses to restore them.")) return;
    setErr(null);
    try { await removeCourse(id); await reload(); } catch (e) { setErr(errText(e)); }
  }

  // Generate the next-level continuation of a course as a draft, then open it for review.
  async function createNext(c: Course) {
    const cont = generateContinuation(c);
    if (!cont) return;
    setErr(null);
    try {
      await addCourse(cont);
      sessionStorage.setItem("ladante-admin-flash",
        `Generated the ${cont.level} continuation of “${c.title}” as a draft — review the dates, then confirm and publish.`);
      router.push(`/admin/courses/${cont.id}/edit`);
    } catch (e) { setErr(errText(e)); }
  }

  // Archive every started course and generate its continuation draft (Giulia's roll-over).
  async function rollOverStarted() {
    setErr(null);
    let gen = 0;
    try {
      for (const c of needRollover) {
        await updateCourse(c.id, { archived: true });
        if (nextLevel(c.level) && !hasContinuation(c.id)) {
          const cont = generateContinuation(c);
          if (cont) { await addCourse(cont); gen++; }
        }
      }
      await reload();
      setFlash(`Archived ${needRollover.length} started course${needRollover.length === 1 ? "" : "s"} and generated ${gen} continuation draft${gen === 1 ? "" : "s"} — find them below and publish when ready.`);
      setFlashUrl(null);
    } catch (e) { setErr(errText(e)); }
  }

  // Availability: set how many seats a class still has open. Students see it live.
  function saveSeatsLeft(id: string, value: number) {
    setErr(null);
    startSaving(async () => {
      try { await setSeatsLeft(id, value); await reload(); } catch (e) { setErr(errText(e)); }
    });
  }

  return (
    <div className="max-w-6xl">
      {err && (
        <div className="mb-6 frame p-4 bg-rosso/10 text-rosso text-sm flex items-start gap-3">
          <span className="flex-1">{err}</span>
          <button type="button" onClick={() => setErr(null)} aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}
      {flash && (
        <div className="mb-6 frame p-4 bg-sole flex items-start gap-3">
          <CheckCircle2 size={20} className="text-ink shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 min-w-0 text-sm">
            <p className="font-medium">{flash}</p>
            {flashUrl && (
              <Link href={flashUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 mt-1 text-azzurro-deep underline underline-offset-2 font-medium">
                View on site <ExternalLink size={13} />
              </Link>
            )}
          </div>
          <button type="button" onClick={() => { setFlash(null); setFlashUrl(null); }} aria-label="Dismiss" className="text-ink/60 hover:text-ink"><X size={16} /></button>
        </div>
      )}

      {/* Roll-over prompt: started courses that should archive + generate their next term */}
      {needRollover.length > 0 && (
        <div className="mb-6 frame p-4 md:p-5 bg-azzurro-soft border border-azzurro-deep/20 flex items-start gap-3">
          <Archive size={20} className="text-azzurro-deep shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 min-w-0 text-sm">
            <p className="font-medium">{needRollover.length} course{needRollover.length === 1 ? " has" : "s have"} already started.</p>
            <p className="text-ink-muted mt-0.5">Roll them over to hide them from the website and auto-generate their next-level continuations as drafts for you to confirm.</p>
          </div>
          <button type="button" onClick={rollOverStarted} className="btn btn-primary shrink-0 h-10 px-4 text-sm"><Archive size={15} /> Roll over</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · Courses</p>
          <h1 className="mt-2 text-3xl md:text-4xl">All courses.</h1>
        </div>
        <Link href="/admin/courses/new" className="btn btn-primary"><Plus size={16} /> New course</Link>
      </div>

      {/* Filters */}
      <div className="frame p-4 md:p-5 bg-white flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, teacher, level, or code..." className="w-full h-11 pl-11 pr-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </div>
        <select value={show} onChange={(e) => setShow(e.target.value as "all" | "upcoming" | "started")} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All</option>
          <option value="upcoming">Upcoming only</option>
          <option value="started">Started / archived</option>
        </select>
        <select value={lang} onChange={(e) => setLang(e.target.value as "all" | Language)} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All languages</option>
          <option value="italian">Italian</option>
          <option value="latin">Latin</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as "all" | CourseType)} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All types</option>
          <option value="adult-group">Adult groups</option>
          <option value="kids">Kids</option>
          <option value="private">Private</option>
          <option value="corporate">Corporate</option>
          <option value="online">Online</option>
          <option value="latin-group">Latin group</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 frame bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-2 text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Title</th>
                <th className="px-5 py-3 text-left font-medium">Level</th>
                <th className="px-5 py-3 text-left font-medium">Schedule</th>
                <th className="px-5 py-3 text-left font-medium">Teacher</th>
                <th className="px-5 py-3 text-left font-medium">Price</th>
                <th className="px-5 py-3 text-left font-medium">Availability</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-ink-muted">No courses match your filters.</td></tr>
              )}
              {filtered.map((c) => {
                const started = hasStarted(c, today);
                const canContinue = nextLevel(c.level) !== null;
                const nextMade = hasContinuation(c.id);
                return (
                  <tr key={c.id} className={`border-t border-line hover:bg-cream-2/30 ${c.archived ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4 font-medium">
                      {c.title}
                      {c.courseCode && <span className="ml-2 align-middle font-mono text-[11px] text-ink-soft">{c.courseCode}</span>}
                      {c.status === "Draft" && (
                        <span className="ml-2 align-middle px-2 py-0.5 rounded-full text-[11px] font-medium bg-cream-2 border border-line text-ink-muted">Draft</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs uppercase tracking-widest text-azzurro-deep">{c.level}</td>
                    <td className="px-5 py-4 text-ink-muted">{c.dayLabel}</td>
                    <td className="px-5 py-4 text-ink-muted">{c.teacher}</td>
                    <td className="px-5 py-4">{formatHKD(c.priceHKD)}</td>
                    <td className="px-5 py-4">
                      {(() => {
                        const left = Math.max(0, c.seats - c.enrolled);
                        const open = left > 0;
                        return (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              defaultValue={left}
                              disabled={saving}
                              onBlur={(e) => { const v = Math.max(0, Math.trunc(Number(e.target.value))); if (v !== left) saveSeatsLeft(c.id, v); }}
                              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                              title="Seats still open — students see this. Set to 0 for a waitlist."
                              className="w-14 h-8 px-2 rounded-lg border border-line text-sm disabled:opacity-50"
                            />
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${open ? "bg-green-100 text-green-800" : "bg-rosso/10 text-rosso"}`}>
                              {open ? "Open" : "Full"}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4">
                      {c.archived ? (
                        <span className="px-2.5 py-1 rounded-full text-xs bg-ink/5 text-ink-muted">Archived</span>
                      ) : started ? (
                        <span className="px-2.5 py-1 rounded-full text-xs bg-sole/40 text-ink">Started</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs bg-azzurro/15 text-azzurro-deep">Upcoming</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {canContinue && (
                          nextMade ? (
                            <span title="Continuation already created" className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-azzurro-deep/50"><CalendarPlus size={14} /></span>
                          ) : (
                            <button type="button" onClick={() => createNext(c)} title="Create the next-level continuation" className="w-8 h-8 rounded-lg hover:bg-azzurro/15 inline-flex items-center justify-center text-azzurro-deep"><CalendarPlus size={14} /></button>
                          )
                        )}
                        <Link href={`/admin/courses/${c.id}/edit`} title="Edit course" className="w-8 h-8 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><Pencil size={14} /></Link>
                        <button type="button" onClick={() => del(c.id)} title="Delete" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
