"use client";
import { useWorkshops } from "@/lib/use-workshops";
import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useT, localizePath } from "@/lib/locale";

// PLACEHOLDER workshop photos — swap for real images (Media Library wiring next).
const WORKSHOP_PHOTOS = [
  "/workshops/1.jpg", "/workshops/2.jpg", "/workshops/3.jpg",
  "/workshops/4.jpg", "/workshops/5.jpg", "/workshops/6.jpg",
];

export default function WorkshopsGrid() {
  const { t, locale } = useT();
  const workshops = useWorkshops();
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">{t.workshops.eyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-5xl"><span className="circle-accent-sm circle-accent">{t.workshops.titleHighlight}</span>{t.workshops.titleTail}</h2>
            <p className="mt-4 text-ink-muted max-w-xl">{t.workshops.subtitle}</p>
          </div>
          <Link href={localizePath("/workshops", locale)} className="hidden md:inline text-sm font-medium text-azzurro-deep hover:underline">{t.workshops.seeAll}</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((w, i) => {
            const photo = WORKSHOP_PHOTOS[i % WORKSHOP_PHOTOS.length];
            return (
            <article key={w.id} className="frame p-6 bg-white flex flex-col">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-sole-soft">
                <Image src={photo} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs">
                {w.status === "planned" ? (
                  <span className="px-2.5 py-1 rounded-full bg-azzurro/10 text-azzurro-deep font-medium uppercase tracking-wider">{t.workshops.planned} · {w.dateLabel}</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider inline-flex items-center gap-1">
                    <Users size={12} /> {w.interested} {t.workshops.interested}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{w.title}</h3>
              <p className="mt-2 text-[14px] text-ink-muted leading-relaxed flex-1">{w.description}</p>
              <Link href={localizePath("/workshops#enquire", locale)} className={`mt-5 btn ${w.status === "planned" ? "btn-primary" : "btn-yellow"} w-full`}>
                {w.status === "planned" ? (<>{t.workshops.book} <ArrowRight size={14} /></>) : (<>{t.workshops.imInterested}</>)}
              </Link>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
