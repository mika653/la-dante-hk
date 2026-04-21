import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

export default function MuralHero() {
  return (
    <section className="relative bg-ink overflow-hidden min-h-[640px] md:min-h-[720px] lg:min-h-[760px] -mt-16 md:-mt-20">
      {/* Full-bleed photo carousel */}
      <div className="absolute inset-0">
        <HeroCarousel />
      </div>

      {/* Readability overlays — strong cream on left (for text), subtle cream band at top (for nav) */}
      <div
        className="absolute inset-0 z-[5]"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,251,240,0.55) 0%, rgba(255,251,240,0.12) 140px, rgba(255,251,240,0) 200px), linear-gradient(90deg, rgba(255,251,240,0.98) 0%, rgba(255,251,240,0.92) 32%, rgba(255,251,240,0.55) 52%, rgba(255,251,240,0) 72%)",
        }}
      />
      {/* Subtle vertical darken at bottom for caption legibility */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink/40 z-[5]" aria-hidden />

      {/* Floating brand dots */}
      <div className="absolute top-14 right-[10%] w-20 h-20 rounded-full bg-azzurro opacity-70 blur-[1px] float-a hidden md:block z-[6]" aria-hidden />
      <div className="absolute bottom-[22%] right-[32%] w-12 h-12 rounded-full bg-sole opacity-80 float-b hidden md:block z-[6]" aria-hidden />
      <div className="absolute top-[40%] right-[8%] w-4 h-4 rounded-full bg-azzurro float-b hidden md:block z-[6]" aria-hidden />

      {/* Brand-yellow accent bar at the very top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-sole z-[6]" aria-hidden />

      {/* Content — overlaid, left-aligned; top padding accounts for the transparent nav above */}
      <div className="container-xl relative z-10 pt-32 md:pt-44 pb-20 md:pb-28 min-h-[640px] md:min-h-[720px] lg:min-h-[760px] flex items-center">
        <div className="max-w-[600px]">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles size={14} className="text-ink" aria-hidden />
            Italiano · Latino · Hong Kong · 1935
          </p>

          <div className="circle-accent mt-5">
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] uppercase text-ink">
              Impara
              <br />
              <span className="italian normal-case" style={{ letterSpacing: "-0.02em" }}>l&apos;italiano</span>
              <br />
              a Hong Kong<span className="ring-dot" aria-hidden></span>
            </h1>
          </div>

          <p className="mt-6 max-w-[520px] text-lg md:text-xl text-ink-muted">
            Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/placement-test" className="btn btn-primary">
              Take the placement test <ArrowRight size={16} />
            </Link>
            <Link href="/courses/italian/adult-groups" className="btn btn-yellow">
              See May–July courses
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><Star size={15} className="fill-sole text-sole" aria-hidden />4.9 rating</span>
            <span className="text-ink-soft">·</span>
            <span>1,500+ students</span>
            <span className="text-ink-soft">·</span>
            <span>Wanchai &amp; online</span>
            <span className="text-ink-soft">·</span>
            <span>PLIDA certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
