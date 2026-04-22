import { Zap, Volume2, Brain, Shuffle } from "lucide-react";
import Link from "next/link";

const decks = [
  { title: "A1 — Greetings & introductions", cards: 32, icon: Brain },
  { title: "A2 — Passato prossimo", cards: 48, icon: Zap },
  { title: "B1 — Subjunctive (congiuntivo)", cards: 60, icon: Brain },
  { title: "B1 — Idiomatic expressions", cards: 42, icon: Shuffle },
];

export default function Practice() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Student · Practice</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Self-study between classes.</h1>
      <p className="mt-2 text-ink-muted max-w-2xl">Five-minute practice drills, tailored to your current level. This is <em>not</em> homework — just gentle reinforcement.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {decks.map((d) => (
          <Link key={d.title} href="#" className="frame p-6 bg-white group">
            <d.icon size={20} className="text-azzurro-deep" aria-hidden />
            <h3 className="mt-4 font-semibold">{d.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{d.cards} cards · ~5 min</p>
            <span className="mt-4 inline-block text-sm font-medium text-azzurro-deep underline-offset-2 group-hover:underline">Start practising →</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 frame p-6 md:p-8 bg-azzurro-soft/60">
        <Volume2 size={22} className="text-azzurro-deep" aria-hidden />
        <h2 className="mt-3 text-2xl font-semibold">Pronunciation trainer</h2>
        <p className="mt-2 text-ink-muted max-w-xl">Record yourself saying Italian phrases, get instant feedback on stress and intonation. Rolling out with B1+ students first — you&apos;re on the list.</p>
        <button type="button" className="btn btn-primary mt-4" disabled>Coming May 2026</button>
      </div>
    </div>
  );
}
