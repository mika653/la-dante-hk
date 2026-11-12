"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { type CEFR, levelInfo, scoreToSubLevel, isAnswerCorrect, TF_CHOICES } from "@/lib/placement-questions";
import { usePlacementQuestions } from "@/lib/use-placement";
import { useCourses } from "@/lib/use-courses";
import { suggestFor, seatsLeft, formatStart } from "@/lib/placement-suggest";
import { submitEnquiry } from "@/lib/enquiry-actions";
import { ArrowLeft, ArrowRight, Check, X, ChevronDown, Mail, Clock, CalendarDays, MapPin, User, Phone, Flag } from "lucide-react";

type Stage = "intro" | "testing" | "email" | "result";

const ladder: CEFR[] = ["A1", "A2", "B1", "B2", "C1"];

export default function TestClient() {
  const courses = useCourses();
  const bank = usePlacementQuestions(); // ordered easy → hard; the full set is 46
  const total = bank.length;

  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | number[]>>({});
  const [response, setResponse] = useState<number | string | number[] | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showReview, setShowReview] = useState(false); // correct answers are revealed only here, after finishing

  // Score = how many ANSWERED questions are correct (Giulia's rubric is scored
  // on the raw number correct, mapped to a sub-level in scoreToSubLevel).
  const score = useMemo(() => {
    let correct = 0;
    for (const q of bank) if (isAnswerCorrect(q, answers[q.id])) correct++;
    return correct;
  }, [answers, bank]);
  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => scoreToSubLevel(score), [score]);

  function begin() { setStage("testing"); setIndex(0); setAnswers({}); setResponse(null); }

  // Persist the current question's response into `answers`.
  function recordCurrent() {
    const q = bank[index];
    if (q && response !== null && response !== "") setAnswers((a) => ({ ...a, [q.id]: response }));
  }

  function goTo(nextIdx: number) {
    recordCurrent();
    setIndex(nextIdx);
    setResponse(answers[bank[nextIdx]?.id] ?? null);
  }

  function goNext() {
    if (index + 1 >= total) { finish(); return; }
    goTo(index + 1);
  }

  function goBack() {
    if (index === 0) return;
    goTo(index - 1);
  }

  function finish() {
    recordCurrent();
    setStage("email");
  }

  // Send the finished test to the office as a placement enquiry — the hottest
  // leads the site produces. Best-effort: a failure never blocks the result.
  function saveLead() {
    if (!email.trim()) return;
    const fd = new FormData();
    fd.set("type", "placement");
    fd.set("name", name.trim() || "Placement test");
    fd.set("email", email.trim());
    fd.set("level", result.label);
    fd.set("sourcePath", "/placement-test");
    fd.set("message", `Placement test: ${score}/${answeredCount} correct → suggested level ${result.label} (${result.cefr}).`);
    submitEnquiry({}, fd).catch(() => { /* best effort */ });
  }

  // -------------- RENDER --------------
  if (stage === "intro") {
    return (
      <section className="bg-cream py-16 md:py-20">
        <div className="container-xl max-w-3xl">
          <div className="frame p-8 md:p-12 bg-white text-center">
            <div className="flex justify-center mb-6">
              <ol className="flex items-center gap-2">
                {ladder.map((lv, i) => (
                  <li key={lv} className="flex items-center gap-2">
                    <span className="w-11 h-11 rounded-full bg-sole text-ink font-heading font-extrabold inline-flex items-center justify-center">{lv}</span>
                    {i < ladder.length - 1 && <span className="w-4 h-px bg-ink-muted" aria-hidden />}
                  </li>
                ))}
              </ol>
            </div>
            <h2 className="text-3xl md:text-4xl">Ready when you are.</h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto">
              The questions get progressively harder. Answer in order, and when they start to feel too difficult, just press
              {" "}<span className="font-medium text-ink">Finish</span> — there&apos;s no need to complete them all. No dictionary, no help: your best honest answers give the most accurate level.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-md mx-auto text-center">
              <div><Clock size={18} className="mx-auto text-azzurro-deep" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">~10 minutes</p></div>
              <div><Flag size={18} className="mx-auto text-azzurro-deep" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">Stop anytime</p></div>
              <div><Mail size={18} className="mx-auto text-azzurro-deep" aria-hidden /><p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">Office follows up</p></div>
            </div>
            <button type="button" onClick={begin} className="btn btn-blue mt-10">Begin the test <ArrowRight size={16} /></button>
            <p className="mt-4 text-xs text-ink-muted">No account needed. You can stop anytime.</p>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "testing") {
    const q = bank[index];
    const qType = q.type ?? "choice";
    const isMulti = !!(q.parts && q.parts.length);
    const options = qType === "truefalse" ? (q.choices.length >= 2 ? q.choices : TF_CHOICES) : q.choices;
    const multiResp: number[] = Array.isArray(response) ? response : [];
    const canProceed = isMulti
      ? q.parts!.every((_, pi) => typeof multiResp[pi] === "number" && multiResp[pi] >= 0)
      : qType === "fill"
      ? (typeof response === "string" && response.trim() !== "")
      : typeof response === "number";
    const pickPart = (pi: number, ci: number) => {
      const next = Array.isArray(response) ? [...response] : [];
      next[pi] = ci;
      setResponse(next);
    };
    const isLast = index + 1 >= total;
    const progress = total ? Math.round(((index + 1) / total) * 100) : 0;
    const canFinish = answeredCount >= 1 || canProceed;
    return (
      <section className="bg-cream py-10 md:py-16 min-h-[70vh]">
        <div className="container-xl max-w-2xl">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-ink-muted font-medium uppercase tracking-wider">
              <span>Question {index + 1} of {total}</span>
              <span>{answeredCount} answered</span>
            </div>
            <div className="mt-2 h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-azzurro transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="frame p-6 md:p-10 bg-white">
            <p className="text-xl md:text-2xl font-heading font-semibold leading-tight">{q.prompt}</p>
            {q.sub && <p className="mt-2 text-[15px] text-ink-muted">{q.sub}</p>}

            {isMulti ? (
              <div className="mt-6 divide-y divide-line">
                {q.parts!.map((part, pi) => (
                  <div key={pi} className="py-4 first:pt-2">
                    {part.label && <p className="text-[15px] md:text-base font-medium mb-2.5">{part.label}</p>}
                    <div className="flex flex-wrap gap-2">
                      {part.choices.map((c, ci) => {
                        const active = multiResp[pi] === ci;
                        return (
                          <button
                            key={ci}
                            type="button"
                            onClick={() => pickPart(pi, ci)}
                            className={`text-left border rounded-xl px-3.5 py-2 text-[15px] transition-all ${active ? "border-azzurro-deep bg-azzurro/10 font-medium" : "border-line hover:border-ink-muted"}`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <p className="pt-4 text-xs text-ink-muted">Answer every blank to continue — the question counts only if all parts are correct.</p>
              </div>
            ) : qType === "fill" ? (
              <div className="mt-8">
                <input
                  type="text"
                  value={typeof response === "string" ? response : ""}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your answer…"
                  className="w-full h-14 px-5 rounded-2xl border border-line bg-white text-lg focus:outline-none focus:border-azzurro-deep"
                />
                <p className="mt-2 text-xs text-ink-muted">Type the missing word or phrase, then press Next.</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-3">
                {options.map((c, i) => {
                  const active = response === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setResponse(i)}
                      className={`text-left border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${active ? "border-azzurro-deep bg-azzurro/5" : "border-line hover:border-ink-muted"}`}
                    >
                      <span className={`w-6 h-6 rounded-full border inline-flex items-center justify-center shrink-0 ${active ? "border-azzurro-deep bg-azzurro text-cream" : "border-line"}`}>
                        {active && <Check size={14} />}
                      </span>
                      <span className="text-[16px]">{c}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={goBack} disabled={index === 0} className="btn btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"><ArrowLeft size={16} /> Previous</button>
              <button type="button" onClick={goNext} disabled={!canProceed} className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                {isLast ? "Finish" : "Next"} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {canFinish && !isLast && (
            <div className="mt-4 text-center">
              <button type="button" onClick={finish} className="text-sm text-ink-muted hover:text-azzurro-deep inline-flex items-center gap-1.5">
                <Flag size={13} /> Too hard? Finish now &amp; see my level
              </button>
            </div>
          )}
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
            <p className="mt-3 text-ink-muted">Leave your name and email to see your level. Our office may follow up with a class that fits.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); saveLead(); setStage("result"); }}
              className="mt-8 grid gap-3 text-left"
            >
              <label className="text-sm font-medium">First name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <button type="submit" className="btn btn-primary mt-2">Show me my level <ArrowRight size={16} /></button>
              <button type="button" onClick={() => setStage("result")} className="text-xs text-ink-muted hover:text-ink underline mt-2">Skip for now</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // stage === "result"
  const info = levelInfo[result.cefr];
  const suggestion = suggestFor(courses, result.cefr);
  const attempted = bank.filter((q) => q.id in answers); // only the questions they actually answered

  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="container-xl max-w-3xl">
        <div className="frame p-8 md:p-12 bg-white text-center">
          <p className="eyebrow">Your suggested level</p>
          <div className="mt-5 flex justify-center">
            <span className="min-w-28 h-28 md:min-w-36 md:h-36 px-6 rounded-full bg-azzurro text-cream font-heading font-extrabold text-4xl md:text-5xl inline-flex items-center justify-center shadow-[var(--shadow-pop)]">{result.label}</span>
          </div>
          <h2 className="mt-6 text-3xl md:text-4xl">{info.name}</h2>
          <p className="mt-3 max-w-xl mx-auto text-ink-muted">{info.blurb}</p>
          <p className="mt-4 text-sm text-ink-muted">You answered <span className="font-semibold text-ink">{score}</span> of {answeredCount} correctly.</p>

          {suggestion.kind === "group" ? (
            <div className="mt-10 text-left">
              <p className="eyebrow text-center">
                {suggestion.courses.length === 1 ? "Your next class" : "Classes starting at your level"}
              </p>
              <div className="mt-4 grid gap-3">
                {suggestion.courses.slice(0, 3).map((c) => {
                  const left = seatsLeft(c);
                  return (
                    <div key={c.id} className="p-5 rounded-2xl bg-sole text-ink">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="text-xl font-heading font-semibold">{c.title}</h3>
                          <p className="mt-1 text-sm font-medium">Level {c.level}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${left > 0 ? "bg-white/70" : "bg-ink text-cream"}`}>
                          {left > 0 ? `${left} seat${left === 1 ? "" : "s"} left` : "Waiting list"}
                        </span>
                      </div>
                      <ul className="mt-3 grid sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm">
                        <li className="flex items-center gap-2"><CalendarDays size={15} aria-hidden /> Starts {formatStart(c.startISO)}</li>
                        <li className="flex items-center gap-2"><Clock size={15} aria-hidden /> {c.dayLabel}</li>
                        <li className="flex items-center gap-2"><MapPin size={15} aria-hidden /> {c.location}</li>
                        <li className="flex items-center gap-2"><User size={15} aria-hidden /> {c.teacher}</li>
                      </ul>
                      <Link href="/courses/italian/adult-groups" className="btn btn-primary mt-4">
                        {left > 0 ? "Enrol" : "Join the waiting list"} <ArrowRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Giulia's rule: no group class at this level → private or the office. */
            <div className="mt-10 text-left p-6 rounded-2xl bg-azzurro-soft border border-azzurro-deep/20">
              <p className="eyebrow !text-azzurro-deep">What&apos;s next</p>
              <h3 className="mt-2 text-xl font-heading font-semibold">
                {`No ${result.cefr} group class is on the calendar just now.`}
              </h3>
              <p className="mt-2 text-[15px] text-ink-muted">
                That happens between terms. Private lessons start whenever suits you and move at your pace — or the
                office can tell you when the next {result.cefr} group opens and hold a place for you.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/courses/italian/private" className="btn btn-primary">Explore private lessons <ArrowRight size={16} /></Link>
                <Link href="/contact" className="btn btn-ghost"><Phone size={16} /> Contact the office</Link>
              </div>
            </div>
          )}

          {/* Answer review — the correct answers appear only here, after the test is
              finished, so nothing is given away while the student can still change answers. */}
          {attempted.length > 0 && (
            <div className="mt-10 text-left border-t border-line pt-6">
              <button
                type="button"
                onClick={() => setShowReview((v) => !v)}
                className="w-full flex items-center justify-between gap-3 text-left"
                aria-expanded={showReview}
              >
                <span className="font-heading font-semibold text-lg">Review your answers</span>
                <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
                  {score}/{attempted.length} correct
                  <ChevronDown size={18} className={`transition-transform ${showReview ? "rotate-180" : ""}`} />
                </span>
              </button>
              {showReview && (
                <div className="mt-5 space-y-3">
                  <p className="text-xs text-ink-muted">Here are the correct answers for the questions you answered.</p>
                  {attempted.map((q) => {
                    const resp = answers[q.id];
                    const ok = isAnswerCorrect(q, resp);
                    const isMulti = !!(q.parts && q.parts.length);
                    const arr = Array.isArray(resp) ? resp : [];
                    return (
                      <div key={q.id} className={`rounded-xl border p-4 ${ok ? "border-green-200 bg-green-50" : "border-rosso/30 bg-rosso/5"}`}>
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-0.5 shrink-0 ${ok ? "text-green-700" : "text-rosso"}`}>
                            {ok ? <Check size={17} /> : <X size={17} />}
                          </span>
                          <p className="text-sm font-medium leading-snug">{q.prompt}</p>
                        </div>
                        {isMulti ? (
                          <ul className="mt-3 pl-7 space-y-1.5 text-sm">
                            {q.parts!.map((p, i) => {
                              const chose = typeof arr[i] === "number" ? p.choices[arr[i]] : "—";
                              const pOk = Number(arr[i]) === p.correctIndex;
                              return (
                                <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                                  {p.label && <span className="text-ink-muted shrink-0">{p.label}</span>}
                                  <span className={pOk ? "text-green-700 font-medium" : "text-rosso font-medium"}>{chose}</span>
                                  {!pOk && <span className="text-ink-muted">→ correct: <b className="text-ink">{p.choices[p.correctIndex]}</b></span>}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="mt-2 pl-7 text-sm">
                            Your answer:{" "}
                            <span className={ok ? "text-green-700 font-medium" : "text-rosso font-medium"}>
                              {q.type === "fill" ? String(resp ?? "—") : typeof resp === "number" ? q.choices[resp] : "—"}
                            </span>
                            {!ok && (
                              <> · Correct: <b className="text-ink">{q.type === "fill" ? q.answer : q.choices[q.correctIndex]}</b></>
                            )}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/courses/italian/adult-groups" className="btn btn-ghost">See all courses</Link>
            <button type="button" onClick={() => { setStage("intro"); setAnswers({}); setIndex(0); setResponse(null); setShowReview(false); }} className="btn btn-ghost">Retake test</button>
          </div>
        </div>
      </div>
    </section>
  );
}
