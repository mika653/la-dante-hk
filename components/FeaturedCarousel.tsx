"use client";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { featuredCards } from "@/lib/data";
import { useT, localizePath } from "@/lib/locale";

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
    const step = 340;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="bg-sole-soft py-14 md:py-20">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2 className="mt-2 text-3xl md:text-4xl">{t.featured.title}</h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href={localizePath("/culture", locale)} className="text-sm font-medium text-azzurro-deep hover:underline">{t.featured.seeAll}</Link>
            <div className="flex items-center gap-1 ml-2">
              <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous cards" disabled={!canLeft}
                className="w-10 h-10 rounded-full border border-ink/20 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink">
                <ChevronLeft size={16} />
              </button>
              <button type="button" onClick={() => scrollBy(1)} aria-label="Next cards" disabled={!canRight}
                className="w-10 h-10 rounded-full border border-ink/20 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden container-xl space-y-3">
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

      {/* Desktop + tablet: horizontal snap-scroll carousel. Arrows are the primary
          affordance — we only add a subtle, narrow right-edge tint (32px, the
          width of the container padding) to signal more content without ever
          sitting on top of card content. */}
      <div className="hidden md:block relative">
        <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-sole-soft to-transparent z-10 transition-opacity ${canRight ? "opacity-100" : "opacity-0"}`} aria-hidden />

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
            {/* Trailing spacer so the last card can scroll fully past the right-edge fade */}
            <div className="shrink-0 w-8" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
