import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import {
  Award,
  Calendar,
  FileText,
  ArrowRight,
  Plane,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  Download,
  CalendarClock,
} from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export default function PLIDA() {
  // Single source of truth for exam sittings. The ISO dates mirror
  // PLIDA_DATES_SEED in lib/closures-shared.ts (2026-06-14, 2026-11-15); only the
  // 2026 calendar is confirmed, so no 2027 dates are listed (see the note below).
  const sessions = [
    { date: "14 June 2026",     iso: "2026-06-14", deadline: "10 May 2026",     levels: "A1 · A2 · B1 · B2 · C1 · C2" },
    { date: "15 November 2026", iso: "2026-11-15", deadline: "10 October 2026", levels: "A1 · A2 · B1 · B2 · C1 · C2" },
  ];

  // Compute "today" at local midnight and the soonest sitting still ahead, so the
  // next-exam highlight updates on its own as each session passes.
  const toDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextSession =
    [...sessions]
      .filter((s) => toDate(s.iso) >= today)
      .sort((a, b) => toDate(a.iso).getTime() - toDate(b.iso).getTime())[0] ?? null;

  // Glue the final two words so a wrapped line never leaves a single-word orphan.
  const noWidow = (s: string) => s.replace(/\s+(\S+)\s*$/, " $1");

  const reasons = [
    { icon: Plane,         label: "Passport & travel",   note: "For visa and residency applications." },
    { icon: BadgeCheck,    label: "Citizenship",         note: "Recognised proof of Italian for citizenship." },
    { icon: GraduationCap, label: "University admission", note: "Enrol and study at Italian universities." },
    { icon: Briefcase,     label: "Work certificate",    note: "Certify your level for employers." },
  ];

  return (
    <>
      <PageHeader
        eyebrow="PLIDA"
        title="The Italian language certificate."
        subtitle="PLIDA is the official Italian government-recognised language certification, valid for university, citizenship, and work in Italy. La Dante HK is the official exam centre for Hong Kong."
        crumbs={[{ label: "Home", href: "/" }, { label: "PLIDA" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          {/* Next exam date — recomputed automatically from the sessions above */}
          <div className="relative overflow-hidden rounded-frame border border-white/10 bg-ink p-6 text-cream shadow-frame md:p-8">
            <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-azzurro/20 blur-[2px]" aria-hidden />
            <div className="absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-sole/25" aria-hidden />
            {nextSession ? (
              <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="eyebrow !text-sole inline-flex items-center gap-2">
                    <CalendarClock size={14} aria-hidden /> Next exam date
                  </p>
                  <p className="mt-3 text-balance font-heading text-3xl font-bold leading-none text-cream md:text-5xl">
                    {noWidow(nextSession.date)}
                  </p>
                  <p className="mt-3 text-sm text-cream/75">
                    Registration closes <strong className="text-cream">{noWidow(nextSession.deadline)}</strong>
                    <span className="mx-2 text-cream/40" aria-hidden>·</span>
                    Levels {nextSession.levels}
                  </p>
                </div>
                <Link href="/contact" className="btn btn-yellow w-full md:mb-1 md:w-auto">
                  Register now <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            ) : (
              <div className="relative max-w-xl">
                <p className="eyebrow !text-sole inline-flex items-center gap-2">
                  <CalendarClock size={14} aria-hidden /> Next exam date
                </p>
                <p className="mt-3 text-balance font-heading text-2xl font-bold text-cream md:text-3xl">
                  {noWidow("Dates to be announced")}
                </p>
                <p className="mt-2 text-sm text-cream/75">
                  The next PLIDA session has not been scheduled yet. Contact us to be notified as soon as new dates are confirmed.
                </p>
              </div>
            )}
          </div>

          {/* Two-column: existing PLIDA info (left) · "Why take PLIDA?" graphic (right) */}
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* LEFT — the existing PLIDA info */}
            <div>
              <h2 className="text-balance text-2xl md:text-3xl">About PLIDA.</h2>
              <div className="mt-6 grid gap-4">
                {[
                  { icon: Award,    title: "Official certification",  body: "Issued by Società Dante Alighieri under agreement with Italy&apos;s Ministry of Foreign Affairs." },
                  { icon: FileText, title: "CEFR A1–C2",              body: "All six levels of the Common European Framework. Pick the one you need, or start at A1." },
                  { icon: Calendar, title: "Two sessions a year",     body: "June and November. Registration closes five weeks before each exam." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="frame p-6 bg-white">
                    <Icon size={22} className="text-azzurro-deep" aria-hidden />
                    <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                    <p className="mt-2 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: body }} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Why take PLIDA? graphic */}
            <aside aria-labelledby="why-plida-heading" className="frame bg-white p-6 md:p-8">
              <p className="eyebrow !text-azzurro-deep">Why it matters</p>
              <h2 id="why-plida-heading" className="mt-2 text-balance text-2xl md:text-3xl">
                Why take PLIDA?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                One certificate, recognised by Italian institutions worldwide.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
                {reasons.map(({ icon: Icon, label, note }) => (
                  <li key={label} className="rounded-card border border-ink/5 bg-cream p-4 md:p-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sole text-ink">
                      <Icon size={20} aria-hidden />
                    </span>
                    <h3 className="mt-3 text-balance text-base font-semibold leading-tight">{label}</h3>
                    <p className="mt-1 text-xs leading-snug text-ink-muted">{note}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Session calendar + downloadable application form */}
          <div className="mt-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow !text-azzurro-deep">Sessions</p>
                <h2 className="mt-2 text-balance text-2xl md:text-3xl">Session calendar.</h2>
              </div>
              <div className="flex flex-col items-start gap-1.5 sm:items-end">
                <a href="/plida-application-form.pdf" download className="btn btn-ghost">
                  <Download size={16} aria-hidden /> Download application form
                </a>
                <p className="max-w-xs text-xs text-ink-muted sm:text-right">
                  Placeholder link — the official application PDF will be added here.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {sessions.map((s) => {
                const isPast = toDate(s.iso) < today;
                const isNext = !!nextSession && s.iso === nextSession.iso;
                return (
                  <div key={s.iso} className="frame relative p-6 bg-white">
                    {isNext && (
                      <>
                        <span className="absolute inset-x-0 top-0 h-1.5 bg-sole" aria-hidden />
                        <span className="cefr-tag absolute right-4 top-4 rounded-pill bg-sole px-2.5 py-1 text-ink">
                          Next
                        </span>
                      </>
                    )}
                    <p className="eyebrow">Exam date</p>
                    <p className="mt-2 font-heading text-2xl font-bold">{noWidow(s.date)}</p>
                    <p className="mt-2 text-sm text-ink-muted">Levels: {s.levels}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Application deadline: <strong>{noWidow(s.deadline)}</strong>
                    </p>
                    {isPast ? (
                      <p className="mt-4 text-sm font-medium text-ink-soft">Registration closed</p>
                    ) : (
                      <Link href="/contact" className="btn btn-primary mt-4">
                        Register <ArrowRight size={16} aria-hidden />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2027 — not yet released */}
            <div className="mt-5 flex items-start gap-3 rounded-frame border border-ink/10 bg-sole-soft p-5 shadow-frame">
              <CalendarClock size={20} className="mt-0.5 shrink-0 text-azzurro-deep" aria-hidden />
              <p className="text-sm text-ink">
                <strong>2027 sessions: dates to be announced.</strong> The 2027 PLIDA calendar has not been
                released yet — new dates will be published here once Società Dante Alighieri confirms them.
              </p>
            </div>
          </div>

          <div id="faq" className="mt-16">
            <h2 className="text-2xl md:text-3xl">FAQ.</h2>
            <div className="mt-6 space-y-3">
              {[
                { q: "How much does PLIDA cost?", a: "HK$1,200 for A1 up to HK$2,400 for C2. Members get 10% off." },
                { q: "Do I need to take courses with you to sit the exam?", a: "No — PLIDA is open to anyone. We do recommend our preparation workshops." },
                { q: "What format is the exam?", a: "Four skills: reading, writing, listening, speaking. Roughly 2.5 hours total depending on level." },
                { q: "Can I prepare with you?", a: "Yes — we run dedicated PLIDA prep workshops 6 weeks before each session." },
              ].map((f) => (
                <details key={f.q} className="frame bg-white p-5">
                  <summary className="cursor-pointer font-medium">{f.q}</summary>
                  <p className="mt-3 text-sm text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div id="prepare" className="mt-16 frame p-8 md:p-10 bg-paper text-ink relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-azzurro opacity-50 blur-[2px]" aria-hidden />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-sole/40" aria-hidden />
            <p className="eyebrow !text-azzurro-deep relative">Prepare</p>
            <h2 className="mt-3 text-3xl max-w-xl">PLIDA preparation workshops.</h2>
            <p className="mt-3 max-w-xl text-ink-muted">Six weeks of focused prep with past papers, timed practice, and feedback from certified PLIDA examiners. Open to members and non-members.</p>
            <a href="#plida-enquiry" className="btn btn-primary mt-5">Register interest <ArrowRight size={16} /></a>
          </div>

          <div id="plida-enquiry" className="mt-14 max-w-2xl mx-auto scroll-mt-24">
            <EnquiryForm type="plida" />
          </div>
        </div>
      </section>
    </>
  );
}
