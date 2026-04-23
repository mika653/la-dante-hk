"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredCards } from "@/lib/data";
import { useT, localizePath } from "@/lib/locale";

export default function FeaturedCarousel() {
  const { t, locale } = useT();
  return (
    <section className="bg-sole-soft py-14 md:py-20">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2 className="mt-2 text-3xl md:text-4xl">{t.featured.title}</h2>
          </div>
          <Link href={localizePath("/culture", locale)} className="hidden md:inline text-sm font-medium text-azzurro-deep hover:underline">{t.featured.seeAll}</Link>
        </div>
      </div>

      {/* Mobile: stacked cards (no more horizontal cut-off) */}
      <div className="md:hidden container-xl space-y-3">
        {featuredCards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="frame p-5 bg-white flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="eyebrow">{c.eyebrow}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">{c.title}</h3>
              <p className="mt-1.5 text-[14px] text-ink-muted leading-relaxed">{c.body}</p>
            </div>
            <ArrowRight size={18} className="text-azzurro-deep mt-1 shrink-0" aria-hidden />
          </Link>
        ))}
      </div>

      {/* Desktop: horizontal snap-scroll carousel */}
      <div className="hidden md:block overflow-x-auto no-scrollbar">
        <div className="container-xl flex gap-6 pb-2 pr-4">
          {featuredCards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="frame shrink-0 w-[340px] p-7 bg-white flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <p className="eyebrow">{c.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{c.title}</h3>
                <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">{c.body}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-azzurro-deep">
                {c.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
