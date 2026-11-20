"use client";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { useOffers } from "@/lib/use-offers";
import { OFFER_ICON } from "@/components/offer-icon";
import { RichText } from "@/components/RichText";

export default function SpecialOffersList() {
  const { items, terms } = useOffers();
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-xl grid sm:grid-cols-2 gap-6">
        {items.map((o) => {
          const Icon = OFFER_ICON[o.icon] ?? Tag;
          return (
            <div key={o.id} className="frame bg-white p-7 md:p-8 flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-sole inline-flex items-center justify-center shrink-0"><Icon size={22} aria-hidden /></span>
                {o.tag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper text-xs font-semibold uppercase tracking-wider text-azzurro-deep">
                    <Tag size={11} aria-hidden /> {o.tag}
                  </span>
                )}
              </div>
              <h2 className="mt-5 text-2xl font-heading font-bold">{o.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted flex-1"><RichText text={o.body} /></p>
              {o.href && o.cta && (
                <Link href={o.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-azzurro-deep hover:underline">
                  {o.cta} <ArrowRight size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
      {terms && (
        <p className="container-xl mt-8 text-[13px] text-ink-muted"><RichText text={terms} /></p>
      )}
    </section>
  );
}
