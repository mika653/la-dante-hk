"use client";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import { useClosures } from "@/lib/use-closures";
import { todayISO, addDays } from "@/lib/course-schedule";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function fmtEn(iso: string) { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MONTHS_EN[m - 1]} ${y}`; }
function fmtZh(iso: string) { const [y, m, d] = iso.split("-").map(Number); return `${y} 年 ${m} 月 ${d} 日`; }

export default function PlidaTeaser() {
  const { locale } = useT();
  const isZh = locale === "zh";

  // Next PLIDA sitting comes from the shared exam-days list (edited in /admin/holidays),
  // never hard-coded. Deadline follows their published rule: five weeks before the exam.
  const { plida } = useClosures();
  const today = todayISO();
  const next = [...plida].sort((a, b) => a.date.localeCompare(b.date)).find((p) => p.date >= today) ?? null;
  const examDate = next ? (isZh ? fmtZh(next.date) : fmtEn(next.date)) : (isZh ? "日期待公佈" : "To be announced");
  const deadline = next
    ? (isZh ? `報名截止：${fmtZh(addDays(next.date, -35))}` : `Registration deadline: ${fmtEn(addDays(next.date, -35))}`)
    : (isZh ? "報名詳情即將公佈" : "Registration details coming soon");
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-xl">
        <div className="frame bg-cream-2 p-6 md:p-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-heading font-extrabold tracking-tight text-azzurro-deep">PLIDA</span>
          </div>

          <div>
            <p className="eyebrow !text-azzurro-deep">{isZh ? "PLIDA" : "PLIDA"}</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">
              {isZh ? "為你的意大利文取得認證。" : "Certify your Italian."}
            </h2>
            <p className="mt-2 text-[14px] text-ink-muted max-w-md">
              {isZh
                ? "國際認可證書，涵蓋 A1 至 C2 全級別。"
                : "Internationally recognised certification from A1 to C2."}
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

          <div className="text-center md:text-right">
            <p className="eyebrow flex items-center gap-1.5 justify-center md:justify-end !text-ink-muted"><CalendarClock size={13} aria-hidden /> {isZh ? "考試日期" : "Exam Date"}</p>
            <p className="mt-2 text-2xl font-heading font-bold">{examDate}</p>
            <p className="mt-1 text-[13px] text-ink-muted">{deadline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
