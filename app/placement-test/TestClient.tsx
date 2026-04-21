"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { questionBank, type Question, type CEFR, levelInfo } from "@/lib/placement-questions";
import { courses } from "@/lib/data";
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles, Clock } from "lucide-react";

type Stage = "intro" | "testing" | "email" | "result";

const levels: CEFR[] = ["A1", "A2", "B1", "B2", "C1"];

function scoreToCEFR(answers: Record<string, number>, servedIds: string[]): { level: CEFR; breakdown: Record<string, number> } {
  const perLevelCorrect: Record<CEFR, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
  const perLevelTotal:   Record<CEFR, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
  const perSection = { grammar: 0, vocabulary: 0, reading: 0, listening: 0 } as Record<string, number>;
  const perSectionTotal = { grammar: 0, vocabulary: 0, reading: 0, listening: 0 } as Record<string, number>;
  servedIds.forEach((id) => {
    const q = questionBank.find((x) => x.id === id);
    if (!q) return;
    perLevelTotal[q.level]++;
    perSectionTotal[q.section]++;
    if (answers[id] === q.correctIndex) {
      perLevelCorrect[q.level]++;
      perSection[q.section]++;
    }
  });
  // Highest level where they scored ≥ 60% and answered at least 2 questions
  let achieved: CEFR = "A1";
  for (const lv of levels) {
    if (perLevelTotal[lv] >= 2 && perLevelCorrect[lv] / perLevelTotal[lv] >= 0.6) achieved = lv;
  }
  const breakdown: Record<string, number> = {};
  Object.keys(perSection).forEach((s) => {
    breakdown[s] = perSectionTotal[s] ? Math.round((perSection[s] / perSectionTotal[s]) * 100) : 0;
  });
  return { level: achieved, breakdown };
}

function pickNextQuestion(servedIds: string[], currentLevel: CEFR): Question | null {
  // Adaptive: try the current level first, then neighbouring levels
  const order: CEFR[] = (() => {
    const i = levels.indexOf(currentLevel);
    const near = [currentLevel];
    if (levels[i + 1]) near.push(levels[i + 1]);
    if (levels[i - 1]) near.push(levels[i - 1]);
    for (const l of levels) if (!near.includes(l)) near.push(l);
    return near;
  })();

  for (const lv of order) {
    const pool = questionBank.filter((q) => q.level === lv && !servedIds.includes(q.id));
    if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  }
  return null;
}

export default function TestClient() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [served, setServed] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState<CEFR>("A1");
  const [selected, setSelected] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const MAX_Q = 15;
  const MIN_Q = 10;

  const result = useMemo(() => (stage === "result" ? scoreToCEFR(answers, served.map((q) => q.id)) : null), [stage, answers, served]);

  function begin() {
    const first = pickNextQuestion([], "A1")!;
    setServed([first]);
    setStage("testing");
    setSelected(null);
  }

  function commitAnswer() {
    const q = served[served.length - 1];
    if (!q || selected == null) return;

    const correct = selected === q.correctIndex;
    const nextAnswers = { ...answers, [q.id]: selected };
    setAnswers(nextAnswers);

    // adapt level: if correct go up one, if wrong go down one (stay in [0,4])
    const i = levels.indexOf(q.level);
    const nextLvl = correct ? levels[Math.min(i + 1, 4)] : levels[Math.max(i - 1, 0)];
    setCurrentLevel(nextLvl);

    if (served.length >= MAX_Q) {
      setStage("email");
      return;
    }
    // Stop early if we have enough evidence (8+ with consistent level)
    if (served.length >= MIN_Q) {
      // simple check: if last 3 answers were all correct OR all wrong at the same level, stop
      const last3 = served.slice(-3);
      const allSameLevel = last3.every((x) => x.level === q.level);
      const last3Correct = last3.every((x) => nextAnswers[x.id] === x.correctIndex);
      const last3Wrong = last3.every((x) => nextAnswers[x.id] !== x.correctIndex);
      if (allSameLevel && (last3Correct || last3Wrong)) {
        setStage("email");
        return;
      }
    }

    const next = pickNextQuestion(served.map((s) => s.id), nextLvl);
    if (!next) { setStage("email"); return; }
    setServed([...served, next]);
    setSelected(null);
  }

  function goBack() {
    if (served.length <= 1) return;
    const last = served[served.length - 1];
    const newAnswers = { ...answers };
    delete newAnswers[last.id];
    setAnswers(newAnswers);
    setServed(served.slice(0, -1));
    setSelected(null);
  }

  // -------------- RENDER --------------
  if (stage === "intro") {
    return (
      <section className="bg-cream py-16 md:py-20">
        <div className="container-xl max-w-3xl">
          <div className="frame p-8 md:p-12 bg-white text-center">
            <div className="flex justify-center mb-6">
              <ol className="flex items-center gap-2">
                {levels.map((lv, i) => (
                  <li key={lv} className="flex items-center gap-2">
                    <span className="w-11 h-11 rounded-full bg-sole text-ink font-heading font-extrabold inline-flex items-center justify-center">{lv}</span>
                    {i < levels.length - 1 && <span className="w-4 h-px bg-ink-muted" aria-hidden />}
                  </li>
                ))}
              </ol>
            </div>
            <h2 className="text-3xl md:text-4xl">Ready when you are.</h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto">
              You&apos;ll answer up to 15 adaptive questions. Harder questions unlock higher levels. If you don&apos;t know the answer, that&apos;s fine — just pick your best guess.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-md mx-auto text-center">
              <div><Clock size={18} className="mx-auto text-azzurro" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">~5 minutes</p></div>
              <div><Sparkles size={18} className="mx-auto text-azzurro" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">Adaptive</p></div>
              <div><Mail size={18} className="mx-auto text-azzurro" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">Emailed to you</p></div>
            </div>
            <button type="button" onClick={begin} className="btn btn-primary mt-10">Begin the test <ArrowRight size={16} /></button>
            <p className="mt-4 text-xs text-ink-muted">No account needed. You can stop anytime.</p>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "testing") {
    const q = served[served.length - 1];
    const progress = Math.round((served.length / MAX_Q) * 100);
    return (
      <section className="bg-cream py-10 md:py-16 min-h-[70vh]">
        <div className="container-xl max-w-2xl">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-ink-muted font-medium uppercase tracking-wider">
              <span>Question {served.length} · {q.section}</span>
              <span>Level {q.level}</span>
            </div>
            <div className="mt-2 h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-azzurro transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="frame p-6 md:p-10 bg-white">
            <p className="text-xl md:text-2xl font-heading font-semibold leading-tight">{q.prompt}</p>
            {q.sub && <p className="mt-2 text-[15px] text-ink-muted">{q.sub}</p>}

            <div className="mt-8 grid gap-3">
              {q.choices.map((c, i) => {
                const active = selected === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`text-left border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${active ? "border-azzurro bg-azzurro/5" : "border-line hover:border-ink-muted"}`}
                  >
                    <span className={`w-6 h-6 rounded-full border inline-flex items-center justify-center shrink-0 ${active ? "border-azzurro bg-azzurro text-cream" : "border-line"}`}>
                      {active && <Check size={14} />}
                    </span>
                    <span className="text-[16px]">{c}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={goBack} disabled={served.length <= 1} className="btn btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"><ArrowLeft size={16} /> Previous</button>
              <button type="button" onClick={commitAnswer} disabled={selected == null} className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Next <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "email") {
    return (
      <section className="bg-cream py-16 md:py-20">
        <div className="container-xl max-w-xl">
          <div className="frame p-8 md:p-12 bg-white text-center">
            <div className="w-14 h-14 rounded-full bg-sole mx-auto inline-flex items-center justify-center"><Check size={22} /></div>
            <h2 className="mt-6 text-3xl">Nice work.</h2>
            <p className="mt-3 text-ink-muted">Leave your name and email to see your level and we&apos;ll send a copy for later.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setStage("result"); }}
              className="mt-8 grid gap-3 text-left"
            >
              <label className="text-sm font-medium">First name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-azzurro" /></label>
              <label className="text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-azzurro" /></label>
              <button type="submit" className="btn btn-primary mt-2">Show me my level <ArrowRight size={16} /></button>
              <button type="button" onClick={() => setStage("result")} className="text-xs text-ink-muted hover:text-ink underline mt-2">Skip for now</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // stage === "result"
  const r = result!;
  const info = levelInfo[r.level];
  const recommendedLevel = r.level === "C1" ? "C1" : `${r.level}.1`;
  const recommended = courses.find((c) => c.language === "italian" && c.type === "adult-group" && c.level === recommendedLevel)
                   ?? courses.find((c) => c.language === "italian" && c.type === "adult-group" && typeof c.level === "string" && c.level.startsWith(r.level));

  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="container-xl max-w-3xl">
        <div className="frame p-8 md:p-12 bg-white text-center">
          <p className="eyebrow">Your result</p>
          <div className="mt-5 flex justify-center">
            <span className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-azzurro text-cream font-heading font-extrabold text-5xl md:text-6xl inline-flex items-center justify-center shadow-[var(--shadow-pop)]">{r.level}</span>
          </div>
          <h2 className="mt-6 text-3xl md:text-4xl">{info.name}</h2>
          <p className="mt-3 max-w-xl mx-auto text-ink-muted">{info.blurb}</p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(r.breakdown).map(([section, pct]) => (
              <div key={section} className="p-4 rounded-2xl bg-cream-2 border border-line">
                <p className="text-xs uppercase tracking-wider text-ink-muted font-medium">{section}</p>
                <p className="mt-1 text-2xl font-heading font-bold">{pct}%</p>
              </div>
            ))}
          </div>

          {recommended && (
            <div className="mt-10 text-left p-6 rounded-2xl bg-sole text-ink">
              <p className="eyebrow !text-azzurro-deep">We recommend</p>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold">{recommended.title}</h3>
              <p className="mt-1 text-sm">{recommended.dayLabel} · {recommended.location} · {recommended.teacher}</p>
              <Link href="/courses/italian/adult-groups" className="btn btn-primary mt-4">Enrol in {recommended.level} <ArrowRight size={16} /></Link>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/courses/italian/adult-groups" className="btn btn-ghost">See all courses</Link>
            <button type="button" onClick={() => { setStage("intro"); setAnswers({}); setServed([]); setCurrentLevel("A1"); }} className="btn btn-ghost">Retake test</button>
          </div>
        </div>
      </div>
    </section>
  );
}
