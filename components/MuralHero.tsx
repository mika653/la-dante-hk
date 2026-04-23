"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import { useSiteContent } from "@/lib/site-content";
import { useT, localizePath } from "@/lib/locale";

export default function MuralHero() {
  const { hero: heroSite } = useSiteContent();
  const { t, locale } = useT();
  const isZh = locale === "zh";
  // Pull text from the right source — translated dict for zh, admin-editable site content for en
  const hero = {
    eyebrow: isZh ? t.hero.eyebrow : heroSite.eyebrow,
    line1:   isZh ? t.hero.line1   : heroSite.line1,
    line2:   isZh ? t.hero.line2   : heroSite.line2,
    line3:   isZh ? t.hero.line3   : heroSite.line3,
    subhead: isZh ? t.hero.subhead : heroSite.subhead,
    cta1:    isZh ? t.hero.cta1    : heroSite.cta1.label,
    cta2:    isZh ? t.hero.cta2    : heroSite.cta2.label,
    trust:   isZh ? t.hero.trust   : heroSite.trust,
  };

  return (
    <section className="relative bg-ink overflow-hidden min-h-[540px] md:min-h-[720px] lg:min-h-[760px] -mt-16 md:-mt-20">
      {/* Full-bleed photo carousel */}
      <div className="absolute inset-0">
        <HeroCarousel />
      </div>

      {/* Readability overlays */}
      <div
        className="absolute inset-0 z-[5]"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,251,240,0.55) 0%, rgba(255,251,240,0.12) 140px, rgba(255,251,240,0) 200px), linear-gradient(90deg, rgba(255,251,240,0.98) 0%, rgba(255,251,240,0.92) 32%, rgba(255,251,240,0.55) 52%, rgba(255,251,240,0) 72%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink/40 z-[5]" aria-hidden />

      {/* Floating brand dots */}
      <div className="absolute top-14 right-[10%] w-20 h-20 rounded-full bg-azzurro opacity-70 blur-[1px] float-a hidden md:block z-[6]" aria-hidden />
      <div className="absolute bottom-[22%] right-[32%] w-12 h-12 rounded-full bg-sole opacity-80 float-b hidden md:block z-[6]" aria-hidden />
      <div className="absolute top-[40%] right-[8%] w-4 h-4 rounded-full bg-azzurro float-b hidden md:block z-[6]" aria-hidden />

      {/* Brand-yellow accent bar at the very top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-sole z-[6]" aria-hidden />

      {/* Content */}
      <div className="container-xl relative z-10 pt-24 md:pt-44 pb-16 md:pb-28 min-h-[540px] md:min-h-[720px] lg:min-h-[760px] flex items-center">
        <div className="max-w-[600px]">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles size={14} className="text-ink" aria-hidden />
            {hero.eyebrow}
          </p>

          <div className="circle-accent mt-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-ink leading-[0.95] break-words">
              {hero.line1}
              <br />
              <span className="italian normal-case" style={{ letterSpacing: "-0.02em" }}>{hero.line2}</span>
              <br />
              {hero.line3}
              <span className="ring-dot" aria-hidden></span>
            </h1>
          </div>

          <p className="mt-5 max-w-[520px] text-base md:text-xl text-ink-muted">{hero.subhead}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={localizePath("/placement-test", locale)} className="btn btn-primary">
              {hero.cta1} <ArrowRight size={16} />
            </Link>
            <Link href={localizePath("/courses/italian/adult-groups", locale)} className="btn btn-yellow">
              {hero.cta2}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-muted">
            {hero.trust.map((item, i, arr) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-1.5">
                {i === 0 && <Star size={15} className="fill-sole text-sole" aria-hidden />}
                {item}
                {i < arr.length - 1 && <span className="text-ink-soft ml-3">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
