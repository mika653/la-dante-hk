"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import ReviewsCarousel from "./ReviewsCarousel";

export default function MembershipBand() {
  const { t, locale } = useT();
  return (
    <section className="relative bg-azzurro text-ink py-20 md:py-28 overflow-hidden">
      {/* Murales — large, spanning the full width and most of the band's height (per Giulia) */}
      <div
        className="absolute inset-0 opacity-[0.2] bg-no-repeat bg-bottom bg-[length:auto_100%] md:bg-[length:100%_auto] mix-blend-multiply"
        style={{ backgroundImage: "url('/mural.png')" }}
        aria-hidden
      />

      <div className="container-xl relative z-10 text-center">
        <p className="eyebrow !text-azzurro-deep">{t.membership.eyebrow}</p>
        <h2 className="mt-4 text-4xl md:text-6xl max-w-3xl mx-auto">
          {t.membership.titleLead}<span className="italian">{t.membership.titleAccent}</span>{t.membership.titleTail}
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-ink-muted text-lg">{t.membership.subhead}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={localizePath("/membership", locale)} className="btn btn-primary">{t.membership.cta1} <ArrowRight size={16} /></Link>
          <Link href={localizePath("/membership#perks", locale)} className="btn btn-ghost">{t.membership.cta2}</Link>
        </div>

        <dl className="mt-14 grid grid-cols-3 max-w-2xl mx-auto">
          {t.membership.stats.map((s) => (
            <div key={s.l} className="border-r last:border-r-0 border-ink/15">
              <dt className="text-3xl md:text-4xl font-heading font-extrabold text-ink">{s.n}</dt>
              <dd className="mt-1 text-sm uppercase tracking-wider text-ink-muted">{s.l}</dd>
            </div>
          ))}
        </dl>

        {/* Reviews — integrated into the same section (per Giulia) */}
        <ReviewsCarousel embedded heading={locale === "zh" ? "學員心聲" : "What our students say"} />
      </div>
    </section>
  );
}
