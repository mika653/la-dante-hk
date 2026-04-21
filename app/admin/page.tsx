"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, PaintBucket, Calendar, Users, Plus, ArrowRight, AlertCircle } from "lucide-react";
import { getCourses, resetDemo } from "@/lib/admin-store";
import type { Course } from "@/lib/data";

export default function AdminOverview() {
  const [courses, setCoursesState] = useState<Course[]>([]);
  useEffect(() => { setCoursesState(getCourses()); }, []);

  const published = courses.filter((c) => c.status === "Published");
  const enrolled = published.reduce((sum, c) => sum + c.enrolled, 0);
  const almostFull = published.filter((c) => c.enrolled >= Math.ceil(c.seats * 0.75));
  const lowEnrol = published.filter((c) => c.enrolled <= 2);

  const name = "Giulia"; // In Phase 2 this would come from the auth session

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Admin · Overview</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Ciao, {name}.</h1>
        </div>
        <button type="button" onClick={() => { resetDemo(); location.reload(); }} className="text-xs text-ink-muted underline">Reset demo data</button>
      </div>

      <p className="mt-3 text-ink-muted">Here&apos;s what&apos;s happening this term.</p>

      {/* Stat cards */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen,    label: "Active courses", value: published.length, href: "/admin/courses" },
          { icon: Users,       label: "Enrolled students", value: enrolled,        href: "/admin/members" },
          { icon: PaintBucket, label: "Workshops planned", value: "4",             href: "/admin/workshops" },
          { icon: Calendar,    label: "Upcoming events",   value: "6",             href: "/admin/events" },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="frame p-6 bg-white">
            <Icon size={22} className="text-azzurro-deep" aria-hidden />
            <p className="mt-4 text-[13px] uppercase tracking-wider text-ink-muted font-medium">{label}</p>
            <p className="mt-1 text-3xl font-heading font-extrabold">{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 frame p-6 md:p-8 bg-white">
        <p className="eyebrow">Quick actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/courses/new" className="btn btn-primary"><Plus size={16} /> New course</Link>
          <Link href="/admin/workshops" className="btn btn-ghost">Add workshop</Link>
          <Link href="/admin/events" className="btn btn-ghost">Create event</Link>
          <Link href="/admin/settings" className="btn btn-ghost">Update site banner</Link>
        </div>
      </div>

      {/* Attention list */}
      {(lowEnrol.length > 0 || almostFull.length > 0) && (
        <div className="mt-8 frame p-6 md:p-8 bg-white">
          <p className="eyebrow">Needs your attention</p>
          <ul className="mt-4 divide-y divide-line">
            {almostFull.slice(0, 3).map((c) => (
              <li key={c.id} className="py-3 flex items-center gap-3 text-sm">
                <span className="w-9 h-9 rounded-full bg-sole flex items-center justify-center shrink-0"><AlertCircle size={14} className="text-ink" aria-hidden /></span>
                <span className="flex-1"><strong>{c.title}</strong> — almost full ({c.enrolled}/{c.seats}). Consider adding a second class.</span>
                <Link href="/admin/courses" className="text-azzurro-deep text-xs font-medium">Review <ArrowRight size={12} className="inline" /></Link>
              </li>
            ))}
            {lowEnrol.slice(0, 3).map((c) => (
              <li key={c.id} className="py-3 flex items-center gap-3 text-sm">
                <span className="w-9 h-9 rounded-full bg-rosso/10 flex items-center justify-center shrink-0"><AlertCircle size={14} className="text-rosso" aria-hidden /></span>
                <span className="flex-1"><strong>{c.title}</strong> — only {c.enrolled} enrolled. Boost with marketing or merge classes.</span>
                <Link href="/admin/courses" className="text-azzurro-deep text-xs font-medium">Review <ArrowRight size={12} className="inline" /></Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
