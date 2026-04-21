import PageHeader from "@/components/PageHeader";
import { courses, levelOutcomes, type Course } from "@/lib/data";
import { formatDateRange, formatHKD } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, User } from "lucide-react";

const LEVEL_ORDER: Array<{ key: string; prefix: string }> = [
  { key: "A1", prefix: "A1" },
  { key: "A2", prefix: "A2" },
  { key: "B1", prefix: "B1" },
  { key: "B2", prefix: "B2" },
  { key: "C1", prefix: "C1" },
];

function cefrMatch(course: Course, prefix: string) {
  if (typeof course.level !== "string") return false;
  return course.level.startsWith(prefix);
}

export default function AdultGroupsPage() {
  const adultCourses = courses.filter((c) => c.language === "italian" && c.type === "adult-group");

  return (
    <>
      <PageHeader
        eyebrow="Italian · Adult Groups"
        title="From 'ciao' to 'cin cin'."
        subtitle="CEFR-aligned group courses, certified native teachers, small classes in Wanchai and online. Our flagship programme since 1935."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian", href: "/courses/italian/adult-groups" }, { label: "Adult Groups" }]}
        tone="sole-soft"
      />

      {/* CEFR journey strip */}
      <section className="bg-white py-10 border-b border-line">
        <div className="container-xl">
          <p className="eyebrow">Your journey</p>
          <ol className="mt-5 flex items-center justify-between gap-2 md:gap-4 overflow-x-auto no-scrollbar">
            {LEVEL_ORDER.map((l, i) => (
              <li key={l.key} className="flex-1 min-w-[80px] flex items-center gap-2 md:gap-4">
                <a href={`#${l.key}`} className="group flex flex-col items-center flex-1">
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-azzurro text-azzurro font-heading font-bold inline-flex items-center justify-center group-hover:bg-azzurro group-hover:text-cream transition-colors">
                    {l.key}
                  </span>
                  <span className="mt-2 text-xs md:text-sm font-medium text-ink-muted group-hover:text-azzurro">
                    {levelOutcomes[l.key]?.label}
                  </span>
                </a>
                {i < LEVEL_ORDER.length - 1 && <span className="flex-1 h-px bg-line" aria-hidden />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Level accordions */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl space-y-6">
          {LEVEL_ORDER.map((l) => {
            const matching = adultCourses.filter((c) => cefrMatch(c, l.prefix));
            const info = levelOutcomes[l.key];
            return (
              <details key={l.key} id={l.key} open={l.key === "A1"} className="frame bg-white overflow-hidden group">
                <summary className="list-none cursor-pointer p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-sole text-ink font-heading font-extrabold text-xl inline-flex items-center justify-center shrink-0">{l.key}</span>
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold">{info?.label}</h2>
                      <p className="mt-1 text-sm text-ink-muted">{matching.length} course{matching.length === 1 ? "" : "s"} this term</p>
                    </div>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-line inline-flex items-center justify-center text-ink-muted shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-open:rotate-45">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-line px-6 md:px-8 py-6 md:py-8 space-y-6">
                  <div>
                    <p className="eyebrow">After this level you will</p>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                      {info?.outcomes.map((o) => (
                        <li key={o} className="flex gap-2 text-[15px]"><span className="text-azzurro mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />{o}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-3">
                    {matching.length === 0 && (
                      <div className="p-5 rounded-2xl bg-cream-2 border border-line text-[14px] text-ink-muted">
                        No scheduled classes this term. <Link href="/contact" className="text-azzurro underline">Request one →</Link>
                      </div>
                    )}
                    {matching.map((c) => (
                      <div key={c.id} className="p-5 rounded-2xl border border-line bg-cream-2/50 grid md:grid-cols-[1fr_auto] gap-4 items-center">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-widest text-azzurro">{c.level}</p>
                          <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-ink-muted">
                            <span className="inline-flex items-center gap-1.5"><Calendar size={13} aria-hidden />{formatDateRange(c.startISO, c.endISO)}</span>
                            <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden />{c.dayLabel}</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin size={13} aria-hidden />{c.location}</span>
                            <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden />{c.teacher}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:flex-col md:items-end">
                          <span className="text-xl md:text-lg font-heading font-bold">{formatHKD(c.priceHKD)}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${c.enrolled >= c.seats ? "bg-rosso/10 text-rosso" : "bg-azzurro/10 text-azzurro"}`}>
                            {c.enrolled >= c.seats ? "Waitlist" : `${c.seats - c.enrolled} seats left`}
                          </span>
                          <Link href="/membership" className={`btn ${c.enrolled >= c.seats ? "btn-ghost" : "btn-primary"} text-sm h-10 px-5`}>
                            {c.enrolled >= c.seats ? "Join waitlist" : "Enrol"}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-sm text-ink-muted">
                    Can&apos;t find a suitable time? <Link href="/contact" className="text-azzurro underline">Request a new class →</Link>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Placement test band */}
      <section className="bg-sole py-14 md:py-16">
        <div className="container-xl grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <p className="eyebrow">Not sure which level?</p>
            <h2 className="mt-2 text-3xl md:text-4xl max-w-xl">Take our free placement test. Five minutes, CEFR-aligned.</h2>
          </div>
          <Link href="/placement-test" className="btn btn-primary">Start the test <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
