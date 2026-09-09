"use client";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function PlidaTeaser() {
  const { locale } = useT();
  const isZh = locale === "zh";
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
            <p className="mt-2 text-2xl font-heading font-bold">{isZh ? "2026 年 11 月 15 日" : "15 November 2026"}</p>
            <p className="mt-1 text-[13px] text-ink-muted">{isZh ? "報名截止：2026 年 10 月 10 日" : "Registration deadline: 10 October 2026"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
