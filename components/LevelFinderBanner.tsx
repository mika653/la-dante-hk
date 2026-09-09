"use client";
import Link from "next/link";
import { ClipboardCheck, Send } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";

export default function LevelFinderBanner() {
  const { locale } = useT();
  const isZh = locale === "zh";
  return (
    <section className="relative bg-azzurro-soft overflow-hidden py-14 md:py-16">
      {/* Organic soft blob shapes — the "wavy" textured background */}
      <div className="absolute -top-24 left-[8%] w-[380px] h-[380px] rounded-[46%_54%_61%_39%/51%_46%_54%_49%] bg-azzurro/25 blur-2xl" aria-hidden />
      <div className="absolute -bottom-28 right-[6%] w-[360px] h-[360px] rounded-[55%_45%_40%_60%/45%_55%_50%_50%] bg-cream/70 blur-2xl" aria-hidden />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[520px] h-[260px] rounded-[50%] bg-cream/40 blur-3xl" aria-hidden />

      <div className="container-xl relative z-10 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
        <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-[var(--shadow-card)] inline-flex items-center justify-center shrink-0 mx-auto md:mx-0">
          <ClipboardCheck size={28} className="text-rosso" aria-hidden />
        </span>

        <div className="text-center md:text-left">
          <p className="text-[13px] text-ink-muted">{isZh ? "不確定自己的程度？" : "Not sure which level is right for you?"}</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-heading font-bold text-ink">
            {isZh ? "5 分鐘找到你的意大利文程度。" : "Find your Italian level in 5 minutes."}
          </h2>
          <p className="mt-1.5 text-[13px] text-ink-muted">
            {isZh ? "15 條適應性題目 · 免費 · 即時結果" : "15 adaptive questions · Free · Instant result"}
          </p>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <Link href={localizePath("/placement-test", locale)} className="btn btn-primary uppercase tracking-wide text-[13px] relative z-10">
            {isZh ? "開始測試" : "Find My Level"}
          </Link>
          <svg width="72" height="44" viewBox="0 0 72 44" className="absolute -bottom-9 right-2 text-ink-soft hidden md:block" aria-hidden>
            <path d="M4 4 C 20 22, 42 32, 62 22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 5" fill="none" strokeLinecap="round" />
          </svg>
          <Send size={15} className="absolute -bottom-4 right-1 text-ink-soft rotate-[110deg] hidden md:block" aria-hidden />
        </div>
      </div>
    </section>
  );
}
