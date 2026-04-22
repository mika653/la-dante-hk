import { Film, BookOpen, Headphones, UtensilsCrossed, PlayCircle } from "lucide-react";

const films = [
  { title: "La vita è bella", director: "Roberto Benigni", year: 1997, level: "B1+", duration: "1h 56m" },
  { title: "Cinema Paradiso",  director: "Giuseppe Tornatore", year: 1988, level: "B2", duration: "2h 35m" },
  { title: "Il postino",       director: "Michael Radford", year: 1994, level: "B1", duration: "1h 48m" },
];
const books = [
  { title: "Il barone rampante", author: "Italo Calvino",   level: "B2", pages: 264 },
  { title: "Se questo è un uomo",  author: "Primo Levi",      level: "C1", pages: 186 },
  { title: "Va' dove ti porta il cuore", author: "Susanna Tamaro", level: "B1", pages: 176 },
];
const podcasts = [
  { title: "Coffee Break Italian", host: "Radio Lingua", level: "A2–B1", episodes: 200 },
  { title: "News in Slow Italian", host: "Linguistica 360", level: "B1+", episodes: "Weekly" },
  { title: "Podcast Italiano",     host: "Davide Gemello", level: "B2+", episodes: 180 },
];

export default function Library() {
  return (
    <div className="max-w-5xl">
      <p className="eyebrow">Student · Cultural Library</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Italian, beyond the classroom.</h1>
      <p className="mt-2 text-ink-muted max-w-2xl">Films, books, podcasts, and recipes — curated by our teachers, tagged by level.</p>

      <Section title="Films" icon={Film}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {films.map((f) => (
            <div key={f.title} className="frame bg-white overflow-hidden group cursor-pointer">
              <div className="aspect-[16/9] bg-gradient-to-br from-ink/90 to-azzurro-deep text-cream flex items-center justify-center relative">
                <PlayCircle size={40} className="opacity-90 group-hover:scale-110 transition-transform" aria-hidden />
                <span className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wider bg-cream/90 text-ink px-2 py-0.5 rounded-full">{f.level}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold leading-tight">{f.title}</p>
                <p className="text-xs text-ink-muted mt-1">{f.director} · {f.year} · {f.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Books" icon={BookOpen}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((b) => (
            <div key={b.title} className="frame bg-white p-5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-azzurro-deep">{b.level} · {b.pages} pp</span>
              <p className="mt-2 font-semibold leading-tight">{b.title}</p>
              <p className="text-sm text-ink-muted mt-1">{b.author}</p>
              <button type="button" className="mt-4 text-sm text-azzurro-deep underline">Borrow from library →</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Podcasts" icon={Headphones}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {podcasts.map((p) => (
            <div key={p.title} className="frame bg-sole-soft p-5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink">{p.level}</span>
              <p className="mt-2 font-semibold leading-tight">{p.title}</p>
              <p className="text-sm text-ink-muted mt-1">{p.host} · {p.episodes} episodes</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Recipes from the curriculum" icon={UtensilsCrossed}>
        <div className="frame p-6 bg-white">
          <p className="text-sm text-ink-muted">Recipes coming soon — linked to cultural modules in your course.</p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} className="text-azzurro-deep" aria-hidden />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
