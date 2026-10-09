"use client";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { featuredCards } from "@/lib/data";
import { useT, localizePath } from "@/lib/locale";
import PhotoMosaic from "@/components/PhotoMosaic";

// Events / "What's on" — the team's "New term" mockup: a yellow band with a
// tilted photo collage behind white event cards that float over it.
export default function FeaturedCarousel() {
  const { t, locale } = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => { el.removeEventListener("scroll", updateArrows); window.removeEventListener("resize", updateArrows); };
  }, []);

  function scrollBy(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-sole py-14 md:py-20">
      {/* Tilted photo collage bleeding off the right edge, behind the cards */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[58%] overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-end -mr-10">
          <PhotoMosaic rotate={-11} tile={168} />
        </div>
        {/* Soften the collage into the yellow on the left so the cards read cleanly */}
        <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-sole to-transparent" />
      </div>

      <div className="container-xl relative z-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <p className="eyebrow">{t.featured.eyebrow}</p>
              <span className="inline-flex items-center rounded-full bg-ink text-cream text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1">{t.featured.tag}</span>
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-ink">{t.featured.title}</h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href={localizePath("/culture", locale)} className="text-sm font-medium text-ink hover:underline underline-offset-4">{t.featured.seeAll}</Link>
            <div className="flex items-center gap-1 ml-2">
              <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous cards" disabled={!canLeft}
                className="w-10 h-10 rounded-full border border-ink/25 bg-cream/70 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cream/70 disabled:hover:text-ink">
                <ChevronLeft size={16} />
              </button>
              <button type="button" onClick={() => scrollBy(1)} aria-label="Next cards" disabled={!canRight}
                className="w-10 h-10 rounded-full border border-ink/25 bg-cream/70 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cream/70 disabled:hover:text-ink">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden container-xl relative z-10 space-y-3">
        {featuredCards.map((c) => (
          <Link key={c.title} href={c.href} className="frame p-5 bg-white flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="eyebrow">{c.eyebrow}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">{c.title}</h3>
              <p className="mt-1.5 text-[14px] text-ink-muted leading-relaxed">{c.body}</p>
            </div>
            <ArrowRight size={18} className="text-azzurro-deep mt-1 shrink-0" aria-hidden />
          </Link>
        ))}
      </div>

      {/* Desktop + tablet: white event cards floating over the collage */}
      <div className="hidden md:block relative z-10">
        <div ref={scrollRef} className="overflow-x-auto no-scrollbar scroll-smooth" style={{ scrollSnapType: "x mandatory" }}>
          <div className="flex gap-5 px-8 py-1">
            {featuredCards.map((c) => (
              <Link key={c.title} href={c.href}
                className="frame shrink-0 w-[300px] lg:w-[320px] p-6 bg-white flex flex-col justify-between min-h-[220px]"
                style={{ scrollSnapAlign: "start" }}>
                <div>
                  <p className="eyebrow">{c.eyebrow}</p>
                  <h3 className="mt-3 text-xl lg:text-2xl font-semibold leading-tight">{c.title}</h3>
                  <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">{c.body}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-azzurro-deep">
                  {c.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
            <div className="shrink-0 w-8" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
