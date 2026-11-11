"use client";
import { ArrowRight, CalendarClock, Download } from "lucide-react";
import { useToday } from "@/lib/use-today";
import {
  PLIDA_SESSIONS, PLIDA_LEVELS, PLIDA_FORMS, PLIDA_LAST_PUBLISHED_YEAR,
  nextPlidaSession, fmtPlidaDate,
} from "@/lib/plida-sessions";

// "Next exam date" banner. Computed in the browser from the official calendar,
// so it moves on by itself as sessions pass (no rebuild needed).
export function PlidaNextExam() {
  const today = useToday();
  const next = today ? nextPlidaSession(today) : null;
  const nextYear = PLIDA_LAST_PUBLISHED_YEAR + 1;

  return (
    <div className="relative overflow-hidden rounded-frame border border-white/10 bg-ink p-6 text-cream shadow-frame md:p-8">
      <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-azzurro/20 blur-[2px]" aria-hidden />
      <div className="absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-sole" aria-hidden />
      <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow !text-sole inline-flex items-center gap-2">
            <CalendarClock size={14} aria-hidden /> Next exam date
          </p>
          {!today ? (
            <p className="mt-3 font-heading text-3xl font-bold leading-none text-cream md:text-5xl">…</p>
          ) : next ? (
            <>
              <p className="mt-3 text-balance font-heading text-3xl font-bold leading-none text-cream md:text-5xl">
                {fmtPlidaDate(next.session.date, "en", true)}
              </p>
              <p className="mt-3 text-sm text-cream/75">
                Levels <strong className="text-cream">{next.session.levels.join(" · ")}</strong>
                {next.session.junior && <> · <strong className="text-sole">Junior (13–18)</strong></>}
                <span className="mx-2 text-cream/40" aria-hidden>·</span>
                {next.open
                  ? <>Application deadline <strong className="text-cream">{fmtPlidaDate(next.session.deadline)}</strong></>
                  : <>Applications for this session have closed</>}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-balance font-heading text-2xl font-bold text-cream md:text-3xl">{nextYear} dates to be announced</p>
              <p className="mt-2 text-sm text-cream/75 max-w-xl">
                The {nextYear} PLIDA calendar hasn&apos;t been released by headquarters yet. Send us an enquiry below and we&apos;ll let you know as soon as it is.
              </p>
            </>
          )}
        </div>
        <a href="#plida-enquiry" className="btn btn-yellow w-full md:mb-1 md:w-auto">
          {next?.open ? "Register now" : "Get notified"} <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    </div>
  );
}

// Full session calendar: exam date · levels · application deadline, plus the
// downloadable application forms (adult + junior).
export function PlidaSessionCalendar() {
  const today = useToday();
  const next = today ? nextPlidaSession(today) : null;
  const years = Array.from(new Set(PLIDA_SESSIONS.map((s) => s.date.slice(0, 4)))).sort();
  const nextYear = PLIDA_LAST_PUBLISHED_YEAR + 1;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow !text-azzurro-deep">Sessions</p>
          <h2 className="mt-2 text-balance text-2xl md:text-3xl">Session calendar.</h2>
          <p className="mt-2 text-sm text-ink-muted max-w-xl">
            Applications must reach our office by the deadline — late applications can&apos;t be accepted. Candidates must be members of the Società Dante Alighieri.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <a href={PLIDA_FORMS.adult} download className="btn btn-blue">
            <Download size={16} aria-hidden /> Application form (18+)
          </a>
          <a href={PLIDA_FORMS.junior} download className="btn btn-ghost">
            <Download size={16} aria-hidden /> Junior form (13–18)
          </a>
        </div>
      </div>

      {years.map((year) => (
        <div key={year} className="mt-8">
          <h3 className="font-heading font-bold text-xl">{year}</h3>
          <div className="mt-3 frame bg-white overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-muted">
                  <th className="px-5 py-3 font-semibold">Exam date</th>
                  {PLIDA_LEVELS.map((l) => <th key={l} className="px-2 py-3 font-semibold text-center">{l}</th>)}
                  <th className="px-5 py-3 font-semibold">Application deadline</th>
                  <th className="px-5 py-3 font-semibold text-right"><span className="sr-only">Status</span></th>
                </tr>
              </thead>
              <tbody>
                {PLIDA_SESSIONS.filter((s) => s.date.startsWith(year)).map((s) => {
                  const past = !!today && s.date < today;
                  const closed = !!today && !past && s.deadline < today;
                  const isNext = !!next && next.session.date === s.date;
                  return (
                    <tr key={s.date} className={`border-b border-line last:border-0 ${past ? "text-ink-soft" : ""} ${isNext ? "bg-sole" : ""}`}>
                      <td className="px-5 py-3 font-medium whitespace-nowrap">
                        {fmtPlidaDate(s.date, "en", true)}
                        {s.junior && <span className="ml-2 rounded-full bg-rosso/10 text-rosso px-2 py-0.5 text-[11px] font-semibold">Junior</span>}
                      </td>
                      {PLIDA_LEVELS.map((l) => (
                        <td key={l} className="px-2 py-3 text-center">
                          {s.levels.includes(l)
                            ? <span className={`inline-block w-3 h-3 rounded-full ${past ? "bg-ink-soft" : "bg-azzurro-deep"}`} aria-label={`${l} available`} />
                            : <span className="sr-only">not available</span>}
                        </td>
                      ))}
                      <td className="px-5 py-3 whitespace-nowrap">{fmtPlidaDate(s.deadline, "en", true)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-xs font-semibold uppercase tracking-wider">
                        {past ? "Held" : closed ? <span className="text-ink-muted">Closed</span> : isNext ? <span>Next</span> : <span className="text-azzurro-deep">Open</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Next year — not yet released by headquarters */}
      <div className="mt-5 flex items-start gap-3 rounded-frame border border-line bg-paper p-5">
        <CalendarClock size={20} className="mt-0.5 shrink-0 text-azzurro-deep" aria-hidden />
        <p className="text-sm text-ink">
          <strong>{nextYear} sessions: dates to be announced.</strong> The {nextYear} PLIDA calendar has not been
          released by headquarters yet — new dates will be published here as soon as they are confirmed.
        </p>
      </div>
    </div>
  );
}
