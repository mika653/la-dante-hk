import Link from "next/link";
import { ArrowRight, Calendar, TrendingUp, BookOpen, Sparkles, Ticket } from "lucide-react";

export default function StudentDashboard() {
  const nextClass = {
    name: "B1.2 Intermediate Italian",
    teacher: "Marco Rossi",
    when: "Wednesday 6:30pm",
    date: "23 April 2026",
    location: "Wanchai · Classroom B",
  };

  return (
    <div className="max-w-5xl">
      <p className="eyebrow">Student · Dashboard</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Ciao, Clara.</h1>
      <p className="mt-2 text-ink-muted">Buongiorno — here&apos;s what&apos;s happening in your Italian journey.</p>

      {/* Next class card */}
      <div className="mt-8 frame p-6 md:p-8 bg-white grid md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-center">
        <div>
          <p className="eyebrow flex items-center gap-2"><Calendar size={14} className="text-azzurro-deep" aria-hidden /> Next class</p>
          <h2 className="mt-2 text-2xl font-semibold">{nextClass.name}</h2>
          <p className="mt-1 text-sm text-ink-muted">{nextClass.when} · {nextClass.date} · {nextClass.location}</p>
          <p className="mt-2 text-sm">Teacher: <strong>{nextClass.teacher}</strong></p>
        </div>
        <a href="https://ladante.scuolasemplice.it" target="_blank" rel="noopener" className="btn btn-primary">Open in ScuolaSemplice <ArrowRight size={16} /></a>
      </div>

      {/* Journey + next lesson prep */}
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div className="frame p-6 bg-sole-soft">
          <p className="eyebrow flex items-center gap-2"><TrendingUp size={14} aria-hidden /> Your level</p>
          <p className="mt-3 font-heading font-extrabold text-5xl text-ink">B1</p>
          <p className="mt-1 text-sm text-ink-muted">Intermediate · on track for B2 by December</p>
          <div className="mt-4 flex items-center gap-1.5">
            {["A1", "A2", "B1", "B2", "C1"].map((lv, i) => (
              <span key={lv} className={`h-2 rounded-full flex-1 ${i <= 2 ? "bg-ink" : "bg-ink/15"}`} aria-label={`${lv} ${i <= 2 ? "complete" : "upcoming"}`} />
            ))}
          </div>
          <Link href="/student/journey" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep">See my journey <ArrowRight size={14} /></Link>
        </div>

        <div className="frame p-6 bg-white">
          <p className="eyebrow flex items-center gap-2"><BookOpen size={14} className="text-azzurro-deep" aria-hidden /> Prepare for class</p>
          <h3 className="mt-3 text-lg font-semibold">Lezione 7 — Il passato prossimo</h3>
          <p className="mt-2 text-sm text-ink-muted">Review the irregular past participles (essere / avere / fare / dire) and try the 10-question practice quiz.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/student/practice" className="btn btn-ghost text-sm !h-10 !px-4">Practice quiz</Link>
            <Link href="/student/library" className="btn btn-ghost text-sm !h-10 !px-4">Flashcards</Link>
          </div>
        </div>
      </div>

      {/* Explore */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Explore this week</h2>
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Sparkles,  title: "New in the library", body: "La vita è bella — film watch-along with subtitles in IT/EN", href: "/student/library", cta: "Watch" },
            { icon: Calendar,  title: "Bookclub this Saturday", body: "Italo Calvino — Il barone rampante. Chapters 1–3 + wine.", href: "/student/community", cta: "RSVP" },
            { icon: Ticket,    title: "Aperitivo at Grissini", body: "Friday 7pm. Your member card gets you 10% off.", href: "/student/card", cta: "My card" },
          ].map(({ icon: Icon, title, body, href, cta }) => (
            <Link key={title} href={href} className="frame p-5 bg-white group">
              <Icon size={18} className="text-azzurro-deep" aria-hidden />
              <h3 className="mt-3 font-semibold leading-tight">{title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{body}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep">
                {cta} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
