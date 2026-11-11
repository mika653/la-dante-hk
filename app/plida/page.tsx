import PageHeader from "@/components/PageHeader";
import {
  Award,
  Calendar,
  FileText,
  ArrowRight,
  Plane,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  Trophy,
} from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { PlidaNextExam, PlidaSessionCalendar } from "./PlidaCalendar";

export default function PLIDA() {
  // Exam sittings come from lib/plida-sessions.ts (official calendar); the
  // date-dependent parts render in the browser so they never go stale.
  const reasons = [
    { icon: Trophy,        label: "Personal achievement", note: "An official record of how far your Italian has come." },
    { icon: Plane,         label: "Passport",   note: "For visa and residency applications." },
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
          {/* Next exam date — recomputed automatically from the official calendar */}
          <PlidaNextExam />

          {/* Two-column: existing PLIDA info (left) · "Why take PLIDA?" graphic (right) */}
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* LEFT — the existing PLIDA info */}
            <div>
              <h2 className="text-balance text-2xl md:text-3xl">About PLIDA.</h2>
              <div className="mt-6 grid gap-4">
                {[
                  { icon: Award,    title: "Official certification",  body: "Issued by Società Dante Alighieri under agreement with Italy&apos;s Ministry of Foreign Affairs." },
                  { icon: FileText, title: "CEFR A1–C2",              body: "All six levels of the Common European Framework. Pick the one you need, or start at A1." },
                  { icon: Calendar, title: "Sessions all year round", body: "Around ten sittings a year, including Junior sessions (ages 13–18). Applications close two weeks before each exam." },
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
                  <li key={label} className="rounded-card border border-ink/5 bg-paper p-4 md:p-5 last:col-span-2">
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

          {/* Session calendar + downloadable application forms */}
          <div id="sessions" className="mt-16 scroll-mt-24">
            <PlidaSessionCalendar />
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
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-sole" aria-hidden />
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
