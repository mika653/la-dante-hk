import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MembershipBand() {
  return (
    <section className="relative bg-azzurro text-cream py-20 md:py-28 overflow-hidden">
      {/* Decorative circles echoing the mural */}
      <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-azzurro-deep opacity-70" aria-hidden />
      <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-sole/20" aria-hidden />
      <div className="absolute top-10 right-[20%] w-3 h-3 rounded-full bg-sole" aria-hidden />
      <div className="absolute bottom-16 left-[18%] w-2 h-2 rounded-full bg-cream" aria-hidden />

      <div className="container-xl relative z-10 text-center">
        <p className="eyebrow !text-sole">Dante membership</p>
        <h2 className="mt-4 text-4xl md:text-6xl max-w-3xl mx-auto">
          Join the <span className="italian">comunità</span>.
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-cream/85 text-lg">
          Course discounts, library access, 50+ curated Italian perks across Hong Kong, and the warmest Italian community in the city.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/membership" className="btn btn-yellow">Become a member <ArrowRight size={16} /></Link>
          <Link href="/membership#perks" className="btn btn-outline-white">See all perks</Link>
        </div>

        <dl className="mt-14 grid grid-cols-3 max-w-2xl mx-auto">
          {[
            { n: "1,500+", l: "Members" },
            { n: "90 years", l: "In Hong Kong" },
            { n: "50+", l: "Member perks" },
          ].map((s) => (
            <div key={s.l} className="border-r last:border-r-0 border-cream/20">
              <dt className="text-3xl md:text-4xl font-heading font-extrabold text-sole">{s.n}</dt>
              <dd className="mt-1 text-sm uppercase tracking-wider text-cream/70">{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
