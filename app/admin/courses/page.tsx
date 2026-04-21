"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, CheckCircle2, ExternalLink, X } from "lucide-react";
import { getCourses, removeCourse } from "@/lib/admin-store";
import type { Course, Language, CourseType } from "@/lib/data";
import { formatHKD } from "@/lib/utils";

export default function AdminCoursesList() {
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [lang, setLang] = useState<"all" | Language>("all");
  const [type, setType] = useState<"all" | CourseType>("all");
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [flashUrl, setFlashUrl] = useState<string | null>(null);

  useEffect(() => {
    setCoursesState(getCourses());
    try {
      const msg = sessionStorage.getItem("ladante-admin-flash");
      if (msg) {
        setFlash(msg);
        sessionStorage.removeItem("ladante-admin-flash");
      }
      const url = new URLSearchParams(window.location.search).get("view");
      if (url) setFlashUrl(url);
    } catch {}
  }, []);

  const filtered = useMemo(() => courses.filter((c) => {
    if (lang !== "all" && c.language !== lang) return false;
    if (type !== "all" && c.type !== type) return false;
    if (q && !`${c.title} ${c.teacher} ${c.level}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [courses, lang, type, q]);

  function del(id: string) {
    if (!confirm("Remove this course from the site? This is reversible by resetting demo data.")) return;
    removeCourse(id);
    setCoursesState(getCourses());
  }

  return (
    <div className="max-w-6xl">
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, teacher, or level..." className="w-full h-11 pl-11 pr-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </div>
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
                <th className="px-5 py-3 text-left font-medium">Enrolled</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-ink-muted">No courses match your filters.</td></tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-line hover:bg-cream-2/30">
                  <td className="px-5 py-4 font-medium">{c.title}</td>
                  <td className="px-5 py-4 font-mono text-xs uppercase tracking-widest text-azzurro-deep">{c.level}</td>
                  <td className="px-5 py-4 text-ink-muted">{c.dayLabel}</td>
                  <td className="px-5 py-4 text-ink-muted">{c.teacher}</td>
                  <td className="px-5 py-4">{formatHKD(c.priceHKD)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${c.enrolled >= c.seats ? "bg-rosso/10 text-rosso" : c.enrolled >= c.seats * 0.75 ? "bg-sole/30 text-ink" : "bg-azzurro/10 text-azzurro-deep"}`}>
                      {c.enrolled}/{c.seats}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button type="button" title="Edit (demo: not wired)" className="w-8 h-8 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><Pencil size={14} /></button>
                      <button type="button" onClick={() => del(c.id)} title="Delete" className="w-8 h-8 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
