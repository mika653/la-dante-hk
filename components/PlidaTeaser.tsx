"use client";
import Link from "next/link";
import { ArrowRight, CalendarClock, Trophy, Plane, BadgeCheck, GraduationCap, Briefcase, type LucideIcon } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import { useToday } from "@/lib/use-today";
import { nextPlidaSession, fmtPlidaDate, PLIDA_LAST_PUBLISHED_YEAR } from "@/lib/plida-sessions";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// "Why take PLIDA?" reasons (per Giulia), each with a small icon.
const REASONS: { Icon: LucideIcon; en: string; zh: string; tone: string }[] = [
  { Icon: Trophy,        en: "Personal achievement", zh: "個人成就",   tone: "bg-sole text-ink" },
  { Icon: Plane,         en: "Passport",             zh: "護照",       tone: "bg-azzurro text-ink" },
  { Icon: BadgeCheck,    en: "Citizenship",          zh: "公民身份",   tone: "bg-azzurro-deep text-white" },
  { Icon: GraduationCap, en: "University",           zh: "大學入學",   tone: "bg-ink text-white" },
  { Icon: Briefcase,     en: "Work certificate",     zh: "工作證明",   tone: "bg-rosso text-white" },
];

export default function PlidaTeaser() {
  const { locale } = useT();
  const isZh = locale === "zh";
  const loc = isZh ? "zh" : "en";

  // Next exam date is computed from the official calendar (lib/plida-sessions.ts),
  // so it rolls forward on its own as each session passes.
  const today = useToday();
  const next = today ? nextPlidaSession(today) : null;
  const examDate = !today ? "…" : next ? fmtPlidaDate(next.session.date, loc) : (isZh ? "日期待公佈" : "To be announced");
  const levels = next ? next.session.levels.join(" · ") + (next.session.junior ? (isZh ? "（青少年）" : " (Junior)") : "") : "";
  const deadline = !today ? "" : !next
    ? (isZh ? `${PLIDA_LAST_PUBLISHED_YEAR + 1} 年考期即將公佈` : `${PLIDA_LAST_PUBLISHED_YEAR + 1} sessions to be announced`)
    : next.open
      ? (isZh ? `報名截止：${fmtPlidaDate(next.session.deadline, loc)}` : `Registration deadline: ${fmtPlidaDate(next.session.deadline, loc)}`)
      : (isZh ? "此考期報名已截止" : "Registration for this session has closed");

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-xl">
        <div className="frame bg-white p-6 md:p-10 grid gap-8 lg:gap-10 items-center lg:grid-cols-[auto_1.1fr_1fr_auto]">
          <span className="text-3xl font-heading font-extrabold tracking-tight text-azzurro-deep">PLIDA</span>

          {/* LEFT — existing info */}
          <div>
            <p className="eyebrow !text-azzurro-deep">PLIDA</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">
              {isZh ? "為你的意大利文取得認證。" : "Certify your Italian."}
            </h2>
            <p className="mt-2 text-[14px] text-ink-muted max-w-md">
              {isZh ? "國際認可證書，涵蓋 A1 至 C2 全級別。" : "Internationally recognised certification from A1 to C2."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <span key={l} className="w-9 h-9 rounded-full border border-line bg-white text-[13px] font-semibold inline-flex items-center justify-center">{l}</span>
              ))}
            </div>
            <Link href={localizePath("/plida", locale)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep hover:underline">
              {isZh ? "了解 PLIDA 詳情" : "Learn about PLIDA"} <ArrowRight size={14} />
            </Link>
          </div>

          {/* MIDDLE/RIGHT — "Why take PLIDA?" graphic: hub + branches with icons */}
          <div className="flex items-center gap-0" aria-label={isZh ? "為什麼考 PLIDA？" : "Why take PLIDA?"}>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-paper border border-line shrink-0 inline-flex items-center justify-center text-center p-3">
              <span className="font-heading font-bold text-[13px] leading-tight">{isZh ? "為什麼考 PLIDA？" : "Why take PLIDA?"}</span>
            </div>
            <span className="w-4 md:w-6 h-px bg-ink-soft shrink-0" aria-hidden />
            <ul className="relative space-y-2 border-l border-ink-soft py-1">
              {REASONS.map(({ Icon, en, zh, tone }) => (
                <li key={en} className="relative flex items-center pl-4 before:absolute before:left-0 before:top-1/2 before:w-3 before:h-px before:bg-ink-soft">
                  <span className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1 text-[13px] font-semibold ${tone}`}>
                    <span className="w-6 h-6 rounded-full bg-white/90 text-ink inline-flex items-center justify-center shrink-0"><Icon size={13} aria-hidden /></span>
                    {isZh ? zh : en}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — next exam date (automatic) */}
          <div className="text-center lg:text-right">
            <p className="eyebrow flex items-center gap-1.5 justify-center lg:justify-end !text-ink-muted"><CalendarClock size={13} aria-hidden /> {isZh ? "下一個考試日期" : "Next exam date"}</p>
            <p className="mt-2 text-2xl font-heading font-bold">{examDate}</p>
            {levels && <p className="mt-1 text-[13px] font-medium text-azzurro-deep">{isZh ? "級別：" : "Levels: "}{levels}</p>}
            <p className="mt-1 text-[13px] text-ink-muted">{deadline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
