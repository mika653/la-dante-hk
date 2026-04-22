import { Check, Award, Calendar } from "lucide-react";
import Link from "next/link";

const levels = [
  { code: "A1", label: "Beginner",           status: "complete" as const, date: "Jan 2023", note: "Joined Dante" },
  { code: "A2", label: "Elementary",         status: "complete" as const, date: "May 2024" },
  { code: "B1", label: "Intermediate",       status: "current" as const,  date: "In progress", note: "B1.2 starts 6 May" },
  { code: "B2", label: "Upper-Intermediate", status: "upcoming" as const, date: "Target Dec 2026" },
  { code: "C1", label: "Proficient",         status: "upcoming" as const },
  { code: "C2", label: "Mastery",            status: "upcoming" as const },
];

const placements = [
  { date: "12 Jan 2023", level: "A1", note: "Initial placement" },
  { date: "04 Apr 2024", level: "A2", note: "End of A2.3" },
  { date: "18 Feb 2026", level: "B1", note: "Most recent" },
];

export default function Journey() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Student · Journey</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Your Italian journey.</h1>
      <p className="mt-2 text-ink-muted">Three years, two certificates, and counting.</p>

      {/* CEFR path */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-5">CEFR progress</h2>
        <ol className="space-y-3">
          {levels.map((l) => (
            <li key={l.code} className={`frame p-5 grid grid-cols-[auto_1fr_auto] gap-4 items-center ${l.status === "current" ? "bg-sole-soft" : "bg-white"}`}>
              <span className={`w-12 h-12 rounded-full font-heading font-extrabold inline-flex items-center justify-center ${l.status === "complete" ? "bg-ink text-cream" : l.status === "current" ? "bg-sole text-ink" : "bg-cream-2 text-ink-muted"}`}>
                {l.status === "complete" ? <Check size={18} /> : l.code}
              </span>
              <div>
                <p className="font-semibold">{l.code} · {l.label}</p>
                {l.note && <p className="text-sm text-ink-muted">{l.note}</p>}
              </div>
              <span className="text-xs text-ink-muted font-mono uppercase tracking-wider">{l.date}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Certificates */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5">Certificates & badges</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="frame p-6 bg-white">
            <Award size={20} className="text-azzurro-deep" aria-hidden />
            <h3 className="mt-3 font-semibold">PLIDA A2</h3>
            <p className="text-sm text-ink-muted">Certified 14 Jun 2024</p>
            <button type="button" className="mt-3 text-sm text-azzurro-deep underline">Download PDF</button>
          </div>
          <div className="frame p-6 bg-cream-2/50 border-dashed">
            <Award size={20} className="text-ink-muted" aria-hidden />
            <h3 className="mt-3 font-semibold text-ink-muted">PLIDA B1</h3>
            <p className="text-sm text-ink-muted">Next exam: 14 June 2026</p>
            <Link href="/plida" className="mt-3 inline-block text-sm text-azzurro-deep underline">Register</Link>
          </div>
        </div>
      </section>

      {/* Placement history */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5">Placement test history</h2>
        <div className="frame bg-white divide-y divide-line">
          {placements.map((p) => (
            <div key={p.date} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Calendar size={16} className="text-ink-muted" aria-hidden />
                <div>
                  <p className="font-medium">{p.note}</p>
                  <p className="text-xs text-ink-muted font-mono uppercase tracking-wider">{p.date}</p>
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl">{p.level}</span>
            </div>
          ))}
        </div>
        <Link href="/placement-test" className="mt-5 inline-flex items-center gap-1.5 btn btn-ghost text-sm">Retake the test</Link>
      </section>
    </div>
  );
}
