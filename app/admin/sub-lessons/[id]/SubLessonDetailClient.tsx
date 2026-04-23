"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, User, Printer, Share2, Package, Target, Copy, Check } from "lucide-react";
import { getSubLessonById, activityColors, type SubLesson } from "@/lib/sub-lessons";

export default function SubLessonDetailClient({ id }: { id: string }) {
  const [lesson, setLesson] = useState<SubLesson | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setLesson(getSubLessonById(id) ?? null); }, [id]);

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (lesson === undefined) return <div className="max-w-4xl" />;
  if (lesson === null) {
    return (
      <div className="max-w-2xl">
        <Link href="/admin/sub-lessons" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All plans</Link>
        <div className="frame p-10 bg-white text-center text-ink-muted">Lesson not found.</div>
      </div>
    );
  }

  const runningMinutes = lesson.activities.reduce((acc, a) => acc + a.minutes, 0);
  const shareMsg = `mailto:?subject=${encodeURIComponent(`Substitute teacher lesson plan — ${lesson.title}`)}&body=${encodeURIComponent(`Hi,\n\nHere's the lesson plan for the ${lesson.level} class. Self-contained, walk-in ready — about ${lesson.totalMinutes} minutes.\n\n${typeof window !== "undefined" ? window.location.href : ""}\n\nGrazie!\nLa Dante HK`)}`;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/sub-lessons" className="print:hidden inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All plans</Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex-1 min-w-0">
          <p className="eyebrow">Sub lesson plan</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-ink-muted">{lesson.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-ink text-cream font-mono uppercase tracking-widest font-medium">{lesson.level}</span>
            <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider">{lesson.language}</span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted"><Clock size={13} /> {lesson.totalMinutes} min total</span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted"><User size={13} /> Authored by {lesson.authoredBy}</span>
          </div>
        </div>
        <div className="print:hidden flex items-center gap-2">
          <button type="button" onClick={copyLink} className="btn btn-ghost !h-9 !px-4 !text-xs">
            {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy link</>}
          </button>
          <a href={shareMsg} className="btn btn-ghost !h-9 !px-4 !text-xs"><Share2 size={13} /> Email to sub</a>
          <button type="button" onClick={() => window.print()} className="btn btn-primary !h-9 !px-4 !text-xs"><Printer size={13} /> Print</button>
        </div>
      </div>

      {/* Quick summary cards — Objectives + Materials */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="frame p-6 bg-white">
          <p className="eyebrow inline-flex items-center gap-2"><Target size={14} /> Learning objectives</p>
          <ul className="mt-4 space-y-2 text-sm">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2"><Check size={14} className="text-azzurro-deep mt-1 shrink-0" />{o}</li>
            ))}
          </ul>
        </div>
        <div className="frame p-6 bg-sole-soft">
          <p className="eyebrow inline-flex items-center gap-2"><Package size={14} /> What you&apos;ll need</p>
          <ul className="mt-4 space-y-2 text-sm">
            {lesson.materials.map((m) => (
              <li key={m} className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-ink shrink-0" aria-hidden />{m}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Topic */}
      <div className="frame p-5 bg-cream-2/40 mb-8 text-sm">
        <span className="eyebrow inline-block mr-2">Topic</span>
        <span className="text-ink-muted">{lesson.topic}</span>
      </div>

      {/* Activities */}
      <h2 className="text-2xl font-semibold mb-2">Step-by-step run sheet</h2>
      <p className="text-sm text-ink-muted mb-6">Total: <strong>{runningMinutes} minutes</strong> ({Math.floor(runningMinutes / 60)}h {runningMinutes % 60}m). Times are flexible — skip or stretch based on student engagement.</p>

      <ol className="space-y-4">
        {lesson.activities.map((a, i) => {
          let elapsed = 0;
          for (let j = 0; j < i; j++) elapsed += lesson.activities[j].minutes;
          const hh = Math.floor(elapsed / 60);
          const mm = elapsed % 60;
          const stamp = `+${hh > 0 ? `${hh}h ` : ""}${mm}m`;
          return (
            <li key={i} className="frame p-5 md:p-6 bg-white">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-8 h-8 rounded-full bg-ink text-cream font-heading font-extrabold inline-flex items-center justify-center text-sm shrink-0">{i + 1}</span>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${activityColors[a.type]}`}>{a.type}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {a.minutes} min</span>
                  <span className="font-mono">{stamp}</span>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed">{a.instructions}</p>

              {a.boardWrite && (
                <div className="mt-4 p-4 rounded-xl bg-ink text-cream text-sm font-mono whitespace-pre-line">
                  <span className="text-[10px] uppercase tracking-widest text-sole block mb-1">Write on board</span>
                  {a.boardWrite}
                </div>
              )}
              {a.example && (
                <div className="mt-3 p-3 rounded-lg bg-cream-2/60 text-sm italic">
                  <span className="eyebrow mr-2">Example</span>{a.example}
                </div>
              )}
              {a.materials && (
                <p className="mt-3 text-xs text-ink-muted"><span className="eyebrow mr-1">Materials</span>{a.materials}</p>
              )}
              {a.answerKey && (
                <p className="mt-2 text-xs text-ink-muted"><span className="eyebrow mr-1">Answer key</span>{a.answerKey}</p>
              )}
            </li>
          );
        })}
      </ol>

      {/* Author note */}
      {lesson.authorNote && (
        <div className="mt-10 frame p-6 md:p-8 bg-sole-soft">
          <p className="eyebrow">A note from {lesson.authoredBy.split(" ")[0]}</p>
          <p className="mt-3 text-[15px] leading-relaxed italic">“{lesson.authorNote}”</p>
        </div>
      )}

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-1.5 print:hidden">
        {lesson.tags.map((t) => (
          <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-cream-2 text-ink-muted">#{t}</span>
        ))}
      </div>
    </div>
  );
}
