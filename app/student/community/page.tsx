import { Calendar, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

const events = [
  { date: "26 Apr", kind: "Bookclub",   title: "Italo Calvino — Il barone rampante",      rsvp: "open" },
  { date: "03 May", kind: "Aperitivo", title: "End-of-term drinks at Grissini Trattoria", rsvp: "going" },
  { date: "18 May", kind: "Film night", title: "La dolce vita (Fellini) — 1960",          rsvp: "open" },
  { date: "05 Jun", kind: "Trip",      title: "Day trip to Macao — Portuguese-Italian food tour", rsvp: "waitlist" },
];

const threads = [
  { title: "Any tips for remembering gender of nouns?", replies: 14, level: "A2", author: "Wei" },
  { title: "Best Italian restaurants in HK?",           replies: 27, level: "all", author: "Clara" },
  { title: "Subjunctive is driving me crazy",           replies: 9,  level: "B1", author: "Priya" },
];

export default function Community() {
  return (
    <div className="max-w-5xl">
      <p className="eyebrow">Student · Community</p>
      <h1 className="mt-2 text-3xl md:text-4xl">The Dante comunità.</h1>
      <p className="mt-2 text-ink-muted max-w-2xl">Member events, bookclub RSVPs, and discussion threads with your fellow students.</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2"><Calendar size={18} className="text-azzurro-deep" aria-hidden /> Upcoming member events</h2>
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.title} className="frame p-5 bg-white grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
              <span className="w-16 h-16 rounded-2xl bg-sole-soft font-heading font-bold text-center text-[13px] leading-tight inline-flex items-center justify-center shrink-0">
                {e.date.split(" ")[0]}<br />{e.date.split(" ")[1]}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-azzurro-deep font-medium">{e.kind}</p>
                <h3 className="mt-1 font-semibold">{e.title}</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider ${e.rsvp === "going" ? "bg-azzurro-deep text-cream" : e.rsvp === "waitlist" ? "bg-cream-2 text-ink-muted" : "bg-sole text-ink"}`}>
                {e.rsvp === "going" ? "You're going" : e.rsvp === "waitlist" ? "Waitlist" : "RSVP"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2"><MessageSquare size={18} className="text-azzurro-deep" aria-hidden /> Discussion threads</h2>
        <div className="frame bg-white divide-y divide-line">
          {threads.map((t) => (
            <Link key={t.title} href="#" className="p-5 flex items-center justify-between gap-4 hover:bg-cream-2/30">
              <div className="min-w-0">
                <p className="font-medium truncate">{t.title}</p>
                <p className="text-xs text-ink-muted mt-1">Started by <strong>{t.author}</strong> · {t.replies} replies · {t.level}</p>
              </div>
              <MessageSquare size={16} className="text-ink-muted shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
        <button type="button" className="btn btn-ghost mt-5 text-sm">Start a thread</button>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2"><Users size={18} className="text-azzurro-deep" aria-hidden /> Find a language-exchange partner</h2>
        <div className="frame p-6 md:p-8 bg-cream-2/50">
          <p className="text-ink-muted max-w-xl">Opt-in service — we match you with another Dante member at your level who wants to practise outside class. Coffee, not dating.</p>
          <button type="button" className="btn btn-primary mt-4">Opt in</button>
        </div>
      </section>
    </div>
  );
}
