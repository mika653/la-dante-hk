"use client";
import Image from "next/image";
import { sponsors } from "@/lib/data";
import { useT } from "@/lib/locale";

export default function SponsorsStrip() {
  const { t } = useT();
  return (
    <section className="bg-cream py-16 md:py-24 border-t border-line">
      <div className="container-xl text-center">
        <p className="eyebrow">{t.sponsors.eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-balance">{t.sponsors.title}</h2>

        <div className="mt-10">
          <p className="eyebrow text-sole">{t.sponsors.gold}</p>
          <div className="mt-4 flex justify-center">
            {sponsors.gold.map((s) => (
              <div key={s.name} className="frame bg-white px-10 py-8 flex items-center justify-center">
                <div className="relative h-16 w-56 md:h-20 md:w-72">
                  <Image src={s.logo} alt={s.name} fill sizes="288px" className="object-contain" priority />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="eyebrow">{t.sponsors.silver}</p>
          {/* Logos arrive with their own baked-in backgrounds (some dark, some white),
              so each sits in its own white card to keep the wall visually even. */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {sponsors.silver.map((s) => (
              <div key={s.name} className="frame bg-white px-6 py-5 flex items-center justify-center">
                <div className="relative h-14 md:h-16 w-full">
                  <Image src={s.logo} alt={s.name} fill sizes="(max-width: 640px) 45vw, 280px" className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
