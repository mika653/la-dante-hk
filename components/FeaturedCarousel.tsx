"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredCards } from "@/lib/data";

export default function FeaturedCarousel() {
  return (
    <section className="bg-sole-soft py-14 md:py-20">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">Happening at Dante</p>
            <h2 className="mt-2 text-3xl md:text-4xl">What&apos;s on</h2>
          </div>
          <Link href="/culture" className="hidden md:inline text-sm font-medium text-azzurro hover:underline">See everything →</Link>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="container-xl flex gap-4 md:gap-6 pb-2 pr-4">
          {featuredCards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="frame shrink-0 w-[280px] md:w-[340px] p-6 md:p-7 bg-white flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <p className="eyebrow">{c.eyebrow}</p>
                <h3 className="mt-3 text-xl md:text-2xl font-semibold leading-tight">{c.title}</h3>
                <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">{c.body}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-azzurro">
                {c.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
