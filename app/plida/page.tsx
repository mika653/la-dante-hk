import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Award, Calendar, FileText, ArrowRight } from "lucide-react";

export default function PLIDA() {
  const sessions = [
    { date: "14 June 2026", deadline: "10 May 2026", levels: "A1 · A2 · B1 · B2 · C1 · C2" },
    { date: "15 November 2026", deadline: "10 October 2026", levels: "A1 · A2 · B1 · B2 · C1 · C2" },
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
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award,    title: "Official certification",  body: "Issued by Società Dante Alighieri under agreement with Italy&apos;s Ministry of Foreign Affairs." },
              { icon: FileText, title: "CEFR A1–C2",              body: "All six levels of the Common European Framework. Pick the one you need, or start at A1." },
              { icon: Calendar, title: "Two sessions a year",     body: "June and November. Registration closes five weeks before each exam." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="frame p-6 md:p-8 bg-white">
                <Icon size={22} className="text-azzurro" aria-hidden />
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl">Upcoming sessions.</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              {sessions.map((s) => (
                <div key={s.date} className="frame p-6 bg-white">
                  <p className="eyebrow">Exam date</p>
                  <p className="mt-2 text-2xl font-heading font-bold">{s.date}</p>
                  <p className="mt-2 text-sm text-ink-muted">Registration deadline: <strong>{s.deadline}</strong></p>
                  <p className="mt-1 text-sm text-ink-muted">Levels: {s.levels}</p>
                  <Link href="/contact" className="btn btn-primary mt-4">Register <ArrowRight size={16} /></Link>
                </div>
              ))}
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

          <div id="prepare" className="mt-16 frame p-8 md:p-10 bg-azzurro text-cream">
            <p className="eyebrow !text-sole">Prepare</p>
            <h2 className="mt-3 text-3xl max-w-xl">PLIDA preparation workshops.</h2>
            <p className="mt-3 max-w-xl text-cream/85">Six weeks of focused prep with past papers, timed practice, and feedback from certified PLIDA examiners. Open to members and non-members.</p>
            <Link href="/contact" className="btn btn-yellow mt-5">Register interest <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
