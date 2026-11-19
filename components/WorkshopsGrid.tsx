"use client";
import { useState } from "react";
import { useWorkshops } from "@/lib/use-workshops";
import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useT, localizePath } from "@/lib/locale";
import { useSiteContent } from "@/lib/site-content";
import { enrolLinkProps } from "@/lib/enroll";
import type { Workshop } from "@/lib/data";

export default function WorkshopsGrid() {
  const { t, locale } = useT();
  const workshops = useWorkshops();
  const { sectionPhotos } = useSiteContent();
  const photos = sectionPhotos.workshops;
  return (
    <section id="workshops" className="bg-paper py-16 md:py-24 scroll-mt-24">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">{t.workshops.eyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-5xl"><span className="circle-accent-sm circle-accent">{t.workshops.titleHighlight}</span>{t.workshops.titleTail}</h2>
            <p className="mt-4 text-ink-muted max-w-xl">{t.workshops.subtitle}</p>
          </div>
          <Link href={localizePath("/culture#workshops", locale)} className="hidden md:inline text-sm font-medium text-azzurro-deep hover:underline">{t.workshops.seeAll}</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((w, i) => (
            <WorkshopCard key={w.id} w={w} photo={photos[i % photos.length]} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopCard({ w, photo, locale, t }: { w: Workshop; photo: string; locale: "en" | "zh"; t: ReturnType<typeof useT>["t"] }) {
  const [open, setOpen] = useState(false);
  const planned = w.status === "planned";
  const longDesc = w.description.length > 120;
  return (
    <article className="frame p-6 bg-white flex flex-col">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-sole-soft">
        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" unoptimized={photo.startsWith("http")} className="object-cover" />
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs">
        {planned ? (
          <span className="px-2.5 py-1 rounded-full bg-azzurro/10 text-azzurro-deep font-medium uppercase tracking-wider">{t.workshops.planned} · {w.dateLabel}</span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider inline-flex items-center gap-1">
            <Users size={12} /> {w.interested} {t.workshops.interested}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{w.title}</h3>
      <p className={`mt-2 text-[14px] text-ink-muted leading-relaxed flex-1 ${open ? "" : "line-clamp-3"}`}>{w.description}</p>
      {longDesc && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="mt-1 self-start text-[13px] font-medium text-azzurro-deep hover:underline">
          {open ? (locale === "zh" ? "收起" : "Show less") : (locale === "zh" ? "更多詳情" : "More details")}
        </button>
      )}
      {planned ? (
        <a {...enrolLinkProps} className="mt-5 btn btn-primary w-full">{t.workshops.book} <ArrowRight size={14} /></a>
      ) : (
        <Link href={localizePath("/contact", locale)} className="mt-5 btn btn-yellow w-full">{t.workshops.imInterested}</Link>
      )}
    </article>
  );
}
