import { type Course } from "@/lib/data";
import { formatDateRange, formatHKD } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function CourseListView({ courses, emptyMessage }: { courses: Course[]; emptyMessage?: string }) {
  if (courses.length === 0) {
    return (
      <div className="frame p-10 bg-white text-center text-ink-muted">
        {emptyMessage ?? "No classes scheduled — please check back soon."}
        <div className="mt-4"><Link href="/contact" className="btn btn-ghost">Request a class</Link></div>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {courses.map((c) => (
        <div key={c.id} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-azzurro">{typeof c.level === "string" ? c.level : ""}</p>
            <h3 className="mt-1 text-lg md:text-xl font-semibold">{c.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><Calendar size={13} aria-hidden />{formatDateRange(c.startISO, c.endISO)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden />{c.dayLabel}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden />{c.location}</span>
              <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden />{c.teacher}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <span className="text-xl md:text-lg font-heading font-bold">{formatHKD(c.priceHKD)}</span>
            <Link href="/membership" className="btn btn-primary text-sm h-10 px-5">Enrol</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
