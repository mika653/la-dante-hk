"use client";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT, localizePath } from "@/lib/locale";
import PhotoMosaic from "@/components/PhotoMosaic";

// Events / "What's on" — the team's "New term" mockup: a Dante-yellow band with
// a tilted photo collage behind white tiles. The first tile is the section title;
// the rest are PLACEHOLDER events for the office to replace with real listings.
type L = { en: string; zh: string };
const EVENTS: { type: L; title: L; when: L; place: L }[] = [
  { type: { en: "Aperitivo", zh: "餐前酒" }, title: { en: "Aperitivo Italiano", zh: "意式餐前酒之夜" }, when: { en: "Fri 24 Oct · 7:00pm", zh: "10月24日(五) · 晚上 7:00" }, place: { en: "Wanchai", zh: "灣仔" } },
  { type: { en: "Film Night", zh: "電影之夜" }, title: { en: "Cinema sotto le stelle", zh: "星空下的意大利電影" }, when: { en: "Sat 8 Nov · 6:30pm", zh: "11月8日(六) · 晚上 6:30" }, place: { en: "Rooftop, Wanchai", zh: "灣仔天台" } },
  { type: { en: "Book Club", zh: "讀書會" }, title: { en: "Bookclub: Il Nome della Rosa", zh: "讀書會:玫瑰的名字" }, when: { en: "Sat 15 Nov · 3:00pm", zh: "11月15日(六) · 下午 3:00" }, place: { en: "Library", zh: "圖書館" } },
  { type: { en: "Lecture", zh: "講座" }, title: { en: "Caravaggio in 30 Minutes", zh: "30分鐘看懂卡拉瓦喬" }, when: { en: "Thu 20 Nov · 7:00pm", zh: "11月20日(四) · 晚上 7:00" }, place: { en: "Online", zh: "網上" } },
];

export default function FeaturedCarousel() {
  const { t, locale } = useT();
  const isZh = locale === "zh";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const rsvp = isZh ? "立即報名" : "RSVP";

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }
  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => { el.removeEventListener("scroll", updateArrows); window.removeEventListener("resize", updateArrows); };
  }, []);
  function scrollBy(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  const eventsHref = localizePath("/culture", locale);

  // One reusable event tile.
  const EventTile = ({ ev }: { ev: (typeof EVENTS)[number] }) => (
    <Link href={eventsHref} className="frame shrink-0 w-[300px] lg:w-[320px] p-6 bg-white flex flex-col justify-between min-h-[220px]" style={{ scrollSnapAlign: "start" }}>
      <div>
        <p className="eyebrow !text-azzurro-deep">{ev.type[locale]}</p>
        <h3 className="mt-3 text-xl lg:text-2xl font-semibold leading-tight">{ev.title[locale]}</h3>
        <div className="mt-3 space-y-1.5 text-[13px] text-ink-muted">
          <p className="flex items-center gap-1.5"><CalendarDays size={14} className="text-azzurro-deep shrink-0" aria-hidden /> {ev.when[locale]}</p>
          <p className="flex items-center gap-1.5"><MapPin size={14} className="text-azzurro-deep shrink-0" aria-hidden /> {ev.place[locale]}</p>
        </div>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-azzurro-deep">{rsvp} <ArrowRight size={14} /></span>
    </Link>
  );

  return (
    <section className="relative overflow-hidden bg-sole py-14 md:py-20">
      {/* Tilted photo collage bleeding off the right edge, behind the tiles */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[52%] overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-end -mr-10">
          <PhotoMosaic rotate={-11} tile={164} />
        </div>
        <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-sole to-transparent" />
      </div>

      {/* Desktop controls */}
      <div className="container-xl relative z-10 hidden md:flex items-center justify-end gap-3 mb-6">
        <div className="flex items-center gap-1 ml-1">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous" disabled={!canLeft}
            className="w-10 h-10 rounded-full border border-ink/25 bg-cream/70 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cream/70 disabled:hover:text-ink"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next" disabled={!canRight}
            className="w-10 h-10 rounded-full border border-ink/25 bg-cream/70 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cream/70 disabled:hover:text-ink"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Mobile: title then stacked event tiles */}
      <div className="md:hidden container-xl relative z-10">
        <p className="eyebrow">{t.featured.eyebrow}</p>
        <h2 className="mt-1 text-3xl font-heading font-bold text-ink">{t.featured.tag}</h2>
        <p className="mt-1 text-ink/70">{t.featured.title}</p>
        <div className="mt-6 space-y-3">
          {EVENTS.map((ev) => (
            <Link key={ev.title.en} href={eventsHref} className="frame p-5 bg-white block">
              <p className="eyebrow !text-azzurro-deep">{ev.type[locale]}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">{ev.title[locale]}</h3>
              <p className="mt-2 text-[13px] text-ink-muted flex items-center gap-1.5"><CalendarDays size={14} className="text-azzurro-deep" aria-hidden /> {ev.when[locale]} · {ev.place[locale]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop + tablet: title tile + event tiles, floating over the collage */}
      <div className="hidden md:block relative z-10">
        <div ref={scrollRef} className="overflow-x-auto no-scrollbar scroll-smooth" style={{ scrollSnapType: "x mandatory" }}>
          <div className="flex gap-5 px-8 py-1 items-stretch">
            {/* Title tile */}
            <div className="frame shrink-0 w-[300px] lg:w-[320px] p-6 bg-white flex flex-col justify-between min-h-[220px]" style={{ scrollSnapAlign: "start" }}>
              <div>
                <p className="eyebrow">{t.featured.eyebrow}</p>
                <h2 className="mt-2 text-3xl lg:text-4xl font-heading font-bold text-ink leading-tight">{t.featured.tag}</h2>
                <p className="mt-2 text-[15px] text-ink-muted">{t.featured.title}</p>
              </div>
              <Link href={eventsHref} className="inline-flex items-center gap-2 text-[14px] font-medium text-azzurro-deep">{t.featured.seeAll}</Link>
            </div>
            {EVENTS.map((ev) => <EventTile key={ev.title.en} ev={ev} />)}
            <div className="shrink-0 w-8" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
