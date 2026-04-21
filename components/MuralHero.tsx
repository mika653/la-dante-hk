import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

export default function MuralHero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Brand-yellow accent ribbon along the top edge */}
      <div className="h-1 bg-sole" aria-hidden />

      {/* Floating brand dots */}
      <div className="absolute top-24 right-[8%] w-24 h-24 rounded-full bg-azzurro opacity-60 blur-[2px] float-a hidden md:block" aria-hidden />
      <div className="absolute bottom-16 left-[4%] w-16 h-16 rounded-full bg-sole opacity-60 blur-[1px] float-b hidden md:block" aria-hidden />
      <div className="absolute top-[60%] right-[42%] w-3 h-3 rounded-full bg-azzurro float-b hidden md:block" aria-hidden />

      <div className="container-xl relative z-10 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — text on solid cream for perfect readability */}
          <div className="relative">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles size={14} className="text-ink" aria-hidden />
              Italiano · Latino · Hong Kong · 1935
            </p>

            <div className="circle-accent mt-5">
              <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] uppercase text-ink">
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
              <span>PLIDA certified centre</span>
            </div>
          </div>

          {/* RIGHT — photo carousel */}
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
