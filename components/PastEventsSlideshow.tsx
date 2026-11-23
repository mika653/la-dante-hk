"use client";
// "Past events" — an auto-scrolling slideshow of events that have already
// happened, shown on the Culture page between Upcoming events and Workshops.
// Built from the same published events feed; hides itself when there are none.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, MapPin } from "lucide-react";
import { useEvents } from "@/lib/use-events";
import { todayISO } from "@/lib/course-schedule";
import { useT } from "@/lib/locale";
import { localizeItem } from "@/lib/content-i18n";

const MAX_SLIDES = 12;
const AUTO_MS = 4500;

export default function PastEventsSlideshow() {
  const { locale } = useT();
  const zh = locale === "zh";
  const all = useEvents(true);
  const past = useMemo(() => {
    const today = todayISO();
    return all
      .map((e) => localizeItem(e, locale))
      .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.date < today)
      .sort((a, b) => b.date.localeCompare(a.date))   // most recent first
      .slice(0, MAX_SLIDES);
  }, [all, locale]);

  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    // Loop back to the start after the last slide.
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  // Auto-advance, paused on hover/focus and for reduced-motion users.
  useEffect(() => {
    if (paused || past.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, past.length, step]);

  if (past.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-16" aria-roledescription="carousel" aria-label={zh ? "過往活動" : "Past events"}>
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{zh ? "回顧" : "Looking back"}</p>
            <h2 className="mt-2 text-2xl md:text-3xl">{zh ? "過往活動。" : "Past events."}</h2>
          </div>
          {past.length > 1 && (
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => step(-1)} aria-label={zh ? "上一個" : "Previous"} className="w-10 h-10 rounded-full border border-line bg-white hover:bg-cream-2 inline-flex items-center justify-center"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => step(1)} aria-label={zh ? "下一個" : "Next"} className="w-10 h-10 rounded-full border border-line bg-white hover:bg-cream-2 inline-flex items-center justify-center"><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        <div
          ref={track}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          className="mt-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {past.map((e) => {
            const d = new Date(e.date);
            const when = d.toLocaleDateString(zh ? "zh-HK" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
            return (
              <article key={e.id} data-slide className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[31%] rounded-frame overflow-hidden bg-cream-2 shadow-(--shadow-card)">
                <div className="relative aspect-4/3 bg-paper flex items-center justify-center text-ink-soft">
                  {e.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={e.image} alt={e.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    : <ImageIcon size={32} strokeWidth={1.25} aria-hidden />}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-semibold uppercase tracking-wider">{when}</span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-widest text-azzurro-deep font-medium">{e.kind}</p>
                  <h3 className="mt-1 font-semibold leading-snug line-clamp-2">{e.title}</h3>
                  {e.location && <p className="mt-1 text-xs text-ink-muted inline-flex items-center gap-1"><MapPin size={12} aria-hidden /> {e.location}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
