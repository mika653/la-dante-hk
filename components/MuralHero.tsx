import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function MuralHero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0">
        <Image
          src="/mural.png"
          alt="Hong Kong skyline merged with Italian landmarks — the La Dante mural"
          priority
          fill
          sizes="100vw"
          className="object-cover object-center mural-fade"
        />
        {/* subtle cream overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-cream/0 to-cream" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/70 via-cream/20 to-transparent md:from-cream/50" aria-hidden />
      </div>

      {/* Floating yellow + blue dots echoing the mural */}
      <svg viewBox="0 0 100 100" className="absolute top-10 left-[10%] w-3 h-3 text-sole float-a" aria-hidden><circle cx="50" cy="50" r="50" fill="currentColor"/></svg>
      <svg viewBox="0 0 100 100" className="absolute top-24 right-[14%] w-2 h-2 text-azzurro float-b" aria-hidden><circle cx="50" cy="50" r="50" fill="currentColor"/></svg>
      <svg viewBox="0 0 100 100" className="absolute bottom-40 left-[28%] w-2.5 h-2.5 text-sole float-b" aria-hidden><circle cx="50" cy="50" r="50" fill="currentColor"/></svg>

      <div className="container-xl relative z-10 pt-14 md:pt-24 pb-28 md:pb-40">
        <div className="max-w-[720px]">
          <p className="eyebrow flex items-center gap-2"><Sparkles size={14} className="text-sole" aria-hidden /> Italian · Latin · Hong Kong · 1935</p>

          <h1 className="mt-5 text-[clamp(2.75rem,7vw,5.5rem)] uppercase">
            Impara l&apos;italiano
            <br />
            <span className="italian normal-case font-heading font-extrabold" style={{ letterSpacing: "-0.02em" }}>
              a Hong Kong.
            </span>
          </h1>

          <p className="mt-6 max-w-[560px] text-lg md:text-xl text-ink-muted">
            The Dante Alighieri Society of Hong Kong. Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/placement-test" className="btn btn-primary">
              Take the placement test <ArrowRight size={16} />
            </Link>
            <Link href="/courses/italian/adult-groups" className="btn btn-ghost">
              See May–July courses
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><Star size={15} className="fill-sole text-sole" aria-hidden />4.9 rating</span>
            <span>•</span>
            <span>1,500+ students</span>
            <span>•</span>
            <span>Wanchai & online</span>
            <span>•</span>
            <span>PLIDA certified centre</span>
          </div>
        </div>
      </div>
    </section>
  );
}
