"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Users, MapPin, Award } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import { useSiteContent } from "@/lib/site-content";
import { useT, localizePath } from "@/lib/locale";

const TRUST_ICON = [Star, Users, MapPin, Award];

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
    <section className="relative bg-ink overflow-hidden min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] -mt-16 md:-mt-20">
      {/* Full-bleed photo carousel background */}
      <div className="absolute inset-0">
        <HeroCarousel />
      </div>

      {/* Readability overlays */}
      <div
        className="absolute inset-0 z-[5]"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(255,251,240,0.97) 0%, rgba(255,251,240,0.9) 30%, rgba(255,251,240,0.55) 50%, rgba(255,251,240,0.08) 70%, rgba(255,251,240,0) 88%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ink/25 z-[5]" aria-hidden />

      {/* Wave rising directly out of the photo — transparent above the curve, no flat colour band */}
      <div className="absolute inset-x-0 bottom-0 z-[7] -mb-px" aria-hidden>
        <svg viewBox="0 0 1440 96" className="block w-full h-16 md:h-20" preserveAspectRatio="none">
          <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,56 L1440,96 L0,96 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Floating brand dots */}
      <div className="absolute top-24 right-[10%] w-16 h-16 rounded-full bg-azzurro opacity-70 blur-[1px] float-a hidden lg:block z-[6]" aria-hidden />
      <div className="absolute bottom-[26%] right-[28%] w-10 h-10 rounded-full bg-sole opacity-80 float-b hidden lg:block z-[6]" aria-hidden />

      {/* Brand-yellow accent bar at the very top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-sole z-[6]" aria-hidden />

      {/* Content */}
      <div className="container-xl relative z-10 pt-24 md:pt-28 pb-14 md:pb-16 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
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
            <Link href={localizePath("/book-trial", locale)} className="btn btn-ghost">
              {isZh ? "預約試堂" : "Book a trial class"} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3 max-w-[560px]">
            {hero.trust.map((item, i) => {
              const Icon = TRUST_ICON[i] ?? Star;
              return (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-white border border-line inline-flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-azzurro-deep" aria-hidden />
                  </span>
                  <span className="text-[13px] font-medium text-ink leading-tight">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
