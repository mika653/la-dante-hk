import { type Course } from "@/lib/data";
import { formatDateRange, formatHKD, formatDMY } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";
import { enrolLinkProps } from "@/lib/enroll";

// Order so a continuation (e.g. A1.2) sits directly under its original (A1.1).
function orderByContinuation(courses: Course[]): Course[] {
  const ids = new Set(courses.map((c) => c.id));
  const kids = new Map<string, Course[]>();
  for (const c of courses) {
    if (c.continuationOf && ids.has(c.continuationOf)) {
      const arr = kids.get(c.continuationOf) ?? [];
      arr.push(c);
      kids.set(c.continuationOf, arr);
    }
  }
  const out: Course[] = [];
  const seen = new Set<string>();
  const visit = (c: Course) => {
    if (seen.has(c.id)) return;
    seen.add(c.id);
    out.push(c);
    for (const child of kids.get(c.id) ?? []) visit(child);
  };
  for (const c of courses) if (!c.continuationOf || !ids.has(c.continuationOf)) visit(c);
  for (const c of courses) if (!seen.has(c.id)) { seen.add(c.id); out.push(c); } // stragglers
  return out;
}

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
      {orderByContinuation(courses).map((c) => {
        const hasEarlyBird = typeof c.earlyBirdFeeHKD === "number" && !!c.earlyBirdDueISO;
        return (
          <div key={c.id} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-azzurro-deep">{typeof c.level === "string" ? c.level : ""}</p>
              <h3 className="mt-1 text-lg md:text-xl font-semibold">{c.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Calendar size={13} aria-hidden />{formatDateRange(c.startISO, c.endISO)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden />{c.dayLabel}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden />{c.location}</span>
                <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden />{c.teacher}</span>
                {c.textbook && <span className="inline-flex items-center gap-1.5"><BookOpen size={13} aria-hidden />{c.textbook}</span>}
              </div>
              {c.description && (
                <details className="mt-3 group">
                  <summary className="cursor-pointer list-none text-[13px] font-medium text-azzurro-deep hover:underline">Course details</summary>
                  <p className="mt-2 text-[14px] text-ink-muted leading-relaxed whitespace-pre-line">{c.description}</p>
                </details>
              )}
            </div>
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              {hasEarlyBird ? (
                <div className="md:text-right">
                  <span className="text-xl md:text-lg font-heading font-bold text-azzurro-deep">{formatHKD(c.earlyBirdFeeHKD!)}</span>
                  <span className="ml-2 text-sm text-ink-muted line-through">{formatHKD(c.priceHKD)}</span>
                  <p className="text-[11px] text-ink-muted mt-0.5">Early bird until {formatDMY(c.earlyBirdDueISO!)}</p>
                </div>
              ) : (
                <span className="text-xl md:text-lg font-heading font-bold">{formatHKD(c.priceHKD)}</span>
              )}
              <a {...enrolLinkProps} className="btn btn-primary text-sm h-10 px-5 whitespace-nowrap">Enrol</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
