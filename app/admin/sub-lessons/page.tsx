"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Clock, Search, User, ArrowRight, Plus, Printer } from "lucide-react";
import { useSubLessons, type LessonLevel, type LessonLanguage } from "@/lib/sub-lessons";

const LEVEL_BUCKETS: Array<{ key: string; match: (l: LessonLevel) => boolean; label: string }> = [
  { key: "all", match: () => true, label: "All levels" },
  { key: "A1",  match: (l) => l.startsWith("A1"), label: "A1" },
  { key: "A2",  match: (l) => l.startsWith("A2") || l === "A2", label: "A2" },
  { key: "B1",  match: (l) => l.startsWith("B1") || l === "B1", label: "B1" },
  { key: "B2+", match: (l) => l === "B2" || l === "C1", label: "B2 / C1" },
];

export default function SubLessonsList() {
  const lessons = useSubLessons();
  const [levelKey, setLevelKey] = useState("all");
  const [lang, setLang] = useState<"all" | LessonLanguage>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const levelFilter = LEVEL_BUCKETS.find((b) => b.key === levelKey) ?? LEVEL_BUCKETS[0];
    return lessons.filter((l) => {
      if (!levelFilter.match(l.level as LessonLevel)) return false;
      if (lang !== "all" && l.language !== lang) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${l.title} ${l.topic} ${l.tags.join(" ")} ${l.authoredBy}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [lessons, levelKey, lang, q]);

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Sub-teacher toolkit</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Emergency lesson plans.</h1>
          <p className="mt-2 text-ink-muted max-w-2xl">Ready-to-teach lessons for when a regular teacher is absent. Every plan is self-contained — a sub can walk into class with just the print-out, no context needed.</p>
        </div>
        <button type="button" disabled title="Creating new lesson plans arrives in Phase 2 — the library below is ready to use now." className="btn btn-ghost opacity-60 cursor-not-allowed gap-2"><Plus size={16} /> New lesson plan <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cream-2 border border-line text-ink-muted">Phase 2</span></button>
      </div>

      {/* Filters */}
      <div className="frame p-4 md:p-5 bg-white flex flex-wrap gap-3 items-center mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by topic, tag, or teacher…" className="w-full h-11 pl-11 pr-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </div>
        <select value={lang} onChange={(e) => setLang(e.target.value as "all" | LessonLanguage)} className="h-11 px-4 rounded-xl border border-line bg-white">
          <option value="all">All languages</option>
          <option value="italian">Italian</option>
          <option value="latin">Latin</option>
        </select>
        <div className="flex items-center gap-1 p-1 rounded-full bg-cream-2">
          {LEVEL_BUCKETS.map((b) => {
            const active = b.key === levelKey;
            return (
              <button key={b.key} type="button" onClick={() => setLevelKey(b.key)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"}`}>
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="frame p-10 bg-white text-center text-ink-muted">No lesson plans match your filters.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((l) => (
            <Link key={l.id} href={`/admin/sub-lessons/${l.id}`} className="frame p-6 bg-white flex flex-col">
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-ink text-cream font-mono uppercase tracking-widest font-medium">{l.level}</span>
                <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider">{l.language}</span>
                <span className="inline-flex items-center gap-1 text-ink-muted"><Clock size={12} /> {l.totalMinutes} min</span>
              </div>
              <h2 className="text-xl font-semibold leading-tight">{l.title}</h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">{l.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {l.tags.slice(0, 4).map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-cream-2 text-ink-muted">#{t}</span>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-ink-muted"><User size={12} /> {l.authoredBy}</span>
                <span className="inline-flex items-center gap-1 text-azzurro-deep font-medium">View plan <ArrowRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 rounded-2xl bg-sole-soft text-sm">
        <p className="font-medium text-ink inline-flex items-center gap-2"><Printer size={14} /> How this works in real life</p>
        <p className="mt-2 text-ink-muted">When a teacher calls in sick, the director opens this page, picks a level-appropriate lesson, and either prints it or shares the link with the substitute via WhatsApp. The sub shows up, opens the plan on their phone, and runs the class step-by-step. No improvisation, no scrambling.</p>
      </div>
    </div>
  );
}
