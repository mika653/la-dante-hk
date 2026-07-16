"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { pickForDate, type DailyItem } from "@/lib/daily-word";
import { todayISO } from "@/lib/course-schedule";
import { useT, localizePath } from "@/lib/locale";

export default function WordOfTheDay() {
  const { t, locale } = useT();
  const isZh = locale === "zh";

  // Resolved on the client on purpose. The homepage is statically generated, so
  // picking at build time would freeze the word on whatever day we last deployed
  // (and disagree with the client on hydration). The card keeps a reserved height
  // so filling it in doesn't shift the page.
  const [item, setItem] = useState<DailyItem | null>(null);
  useEffect(() => setItem(pickForDate(todayISO())), []);

  const label = item?.kind === "phrase" ? t.daily.phrase : t.daily.word;

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-xl">
        <div className="frame bg-cream-2 max-w-2xl mx-auto px-7 py-8 md:px-10 md:py-9 relative overflow-hidden min-h-[248px] md:min-h-[268px]">
          {/* La Dante's circles */}
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-azzurro/15" aria-hidden />
          <div className="absolute bottom-4 -left-5 w-14 h-14 rounded-full bg-sole/50" aria-hidden />

          <div className="relative">
            <p className="eyebrow inline-flex items-center gap-1.5">
              <Sparkles size={14} className="text-azzurro-deep" aria-hidden />
              {label}
            </p>

            {item ? (
              <>
                <p className="mt-3 font-heading font-extrabold text-3xl md:text-4xl leading-tight text-balance">{item.it}</p>
                <p className="mt-2 text-lg md:text-xl">{isZh ? item.zh : item.en}</p>

                {/* `literal` is written in English only, so it stays off the 繁中 page. */}
                {!isZh && item.literal && <p className="mt-3 text-sm text-ink-muted text-balance">{item.literal}</p>}

                {item.example && (
                  <div className="mt-5 pt-5 border-t border-line">
                    <p className="text-[15px] italic">“{item.example.it}”</p>
                    <p className="mt-1 text-sm text-ink-muted">{isZh ? item.example.zh : item.example.en}</p>
                  </div>
                )}

                <p className="mt-5 text-xs text-ink-muted">
                  {t.daily.footer}{" "}
                  <Link href={localizePath("/courses/italian/adult-groups", locale)} className="underline hover:text-ink">
                    {isZh ? "來上課" : "Learn the rest with us"}
                  </Link>
                </p>
              </>
            ) : (
              /* Reserves the same space while the date resolves. */
              <div className="mt-4 space-y-3 animate-pulse" aria-hidden>
                <div className="h-9 w-2/3 rounded-lg bg-ink/5" />
                <div className="h-5 w-1/2 rounded bg-ink/5" />
                <div className="h-px w-full bg-line mt-6" />
                <div className="h-4 w-3/4 rounded bg-ink/5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
