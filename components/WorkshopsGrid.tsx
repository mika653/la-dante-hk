"use client";
import { createElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Users, Calendar, Clock, Wallet, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWorkshopsFeed } from "@/lib/use-workshops";
import { useT, localizePath } from "@/lib/locale";
import { useSiteContent } from "@/lib/site-content";
import { enrolLinkProps } from "@/lib/enroll";
import { isWorkshopPhoto, type Workshop } from "@/lib/data";
import { workshopIcon } from "@/lib/workshop-icons";
import { localizeItem } from "@/lib/content-i18n";

// Cards cycle black → blue → yellow, so no two neighbours share a colour and
// there are never two white cards side by side.
const TONES = [
  { card: "bg-ink text-white",        muted: "text-white/75", chip: "bg-white/15 text-white",          cta: "btn-yellow" },
  { card: "bg-azzurro text-ink",      muted: "text-ink/75",   chip: "bg-white/70 text-azzurro-deep",   cta: "btn-primary" },
  { card: "bg-sole text-ink",         muted: "text-ink/75",   chip: "bg-white/70 text-ink",            cta: "btn-primary" },
] as const;
type Tone = (typeof TONES)[number];

type T = ReturnType<typeof useT>["t"];

/** `home`: show only the first N workshops (N is set in the dashboard). */
export default function WorkshopsGrid({ home = false }: { home?: boolean }) {
  const { t, locale } = useT();
  const feed = useWorkshopsFeed();
  const homeLimit = feed.homeLimit;
  // Chinese site: swap in the manual zh translation where one exists.
  const workshops = feed.workshops.map((w) => localizeItem(w, locale));
  const { sectionPhotos } = useSiteContent();
  const photos = sectionPhotos.workshops;
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = home ? workshops.slice(0, homeLimit) : workshops;
  const open = shown.find((w) => w.id === openId) ?? null;
  const photoFor = (w: Workshop, i: number) => (isWorkshopPhoto(w.image) ? w.image : photos.length ? photos[i % photos.length] : "");

  return (
    <section id="workshops" className="bg-paper py-16 md:py-24 scroll-mt-24">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">{t.workshops.eyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-5xl"><span className="circle-accent-sm circle-accent">{t.workshops.titleHighlight}</span>{t.workshops.titleTail}</h2>
            <p className="mt-4 text-ink-muted max-w-xl">{t.workshops.subtitle}</p>
          </div>
          {home && (
            <Link href={localizePath("/culture#workshops", locale)} className="hidden md:inline text-sm font-medium text-azzurro-deep hover:underline">{t.workshops.seeAll}</Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shown.map((w, i) => (
            <WorkshopCard key={w.id} w={w} photo={photoFor(w, i)} tone={TONES[i % TONES.length]} t={t} locale={locale} onOpen={() => setOpenId(w.id)} />
          ))}
        </div>

        {home && workshops.length > shown.length && (
          <div className="mt-8 text-center md:hidden">
            <Link href={localizePath("/culture#workshops", locale)} className="text-sm font-medium text-azzurro-deep hover:underline">{t.workshops.seeAll}</Link>
          </div>
        )}
      </div>

      {open && (
        <WorkshopModal
          w={open}
          photo={photoFor(open, shown.indexOf(open))}
          t={t}
          locale={locale}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}

function StatusChip({ w, t, className }: { w: Workshop; t: T; className: string }) {
  return w.status === "planned" ? (
    <span className={`px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${className}`}>{t.workshops.planned}{w.dateLabel ? ` · ${w.dateLabel}` : ""}</span>
  ) : (
    <span className={`px-2.5 py-1 rounded-full font-medium uppercase tracking-wider inline-flex items-center gap-1 ${className}`}>
      <Users size={12} /> {w.interested ?? 0} {t.workshops.interested}
    </span>
  );
}

function Media({ w, photo, sizes }: { w: Workshop; photo: string; sizes: string }) {
  if (photo) return <Image src={photo} alt="" fill sizes={sizes} unoptimized={photo.startsWith("http") || photo.startsWith("data:")} className="object-cover" />;
  // createElement with the looked-up icon (not a locally-declared component).
  return <span className="absolute inset-0 flex items-center justify-center">{createElement(workshopIcon(w.image), { size: 48, strokeWidth: 1.25, className: "opacity-80" })}</span>;
}

function WorkshopCard({ w, photo, tone, t, locale, onOpen }: { w: Workshop; photo: string; tone: Tone; t: T; locale: "en" | "zh"; onOpen: () => void }) {
  return (
    // The whole card opens the details pop-up; it's a real button for keyboard users.
    <button
      type="button"
      onClick={onOpen}
      className={`group text-left rounded-frame p-5 flex flex-col shadow-(--shadow-frame) hover:shadow-(--shadow-pop) hover:-translate-y-0.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${tone.card}`}
      aria-label={`${w.title} — ${locale === "zh" ? "查看詳情" : "see details"}`}
    >
      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-white/15">
        <Media w={w} photo={photo} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <StatusChip w={w} t={t} className={tone.chip} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{w.title}</h3>
      <p className={`mt-2 text-[14px] leading-relaxed flex-1 line-clamp-3 ${tone.muted}`}>{w.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold underline-offset-4 group-hover:underline">
        {locale === "zh" ? "時間、日期及費用" : "Time, date & fee"} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function WorkshopModal({ w, photo, t, locale, onClose }: { w: Workshop; photo: string; t: T; locale: "en" | "zh"; onClose: () => void }) {
  const zh = locale === "zh";
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const tbc = zh ? "待定" : "To be confirmed";
  const rows = [
    { Icon: Calendar, label: zh ? "日期" : "Date", value: w.dateLabel || tbc },
    { Icon: Clock,    label: zh ? "時間" : "Time", value: w.timeLabel || tbc },
    { Icon: Wallet,   label: zh ? "費用" : "Fee",  value: w.fee || tbc },
  ];

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="workshop-modal-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/50 drawer-fade" />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl">
        <div className="relative aspect-video bg-cream-2 text-azzurro-deep">
          <Media w={w} photo={photo} sizes="(min-width: 640px) 512px, 100vw" />
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white inline-flex items-center justify-center shadow"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="text-xs"><StatusChip w={w} t={t} className="bg-azzurro-soft text-azzurro-deep" /></div>
          <h3 id="workshop-modal-title" className="mt-3 text-2xl font-heading font-bold leading-tight">{w.title}</h3>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rows.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-cream-2 px-3 py-2.5">
                <dt className="text-[11px] uppercase tracking-wider text-ink-muted inline-flex items-center gap-1.5"><Icon size={12} aria-hidden /> {label}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          {w.description && <p className="mt-5 text-[15px] text-ink-muted leading-relaxed whitespace-pre-line">{w.description}</p>}
          <div className="mt-6">
            {w.status === "planned" ? (
              <a {...enrolLinkProps} className="btn btn-primary w-full">{t.workshops.book} <ArrowRight size={14} /></a>
            ) : (
              <Link href={localizePath("/contact", locale)} className="btn btn-yellow w-full">{t.workshops.imInterested}</Link>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
