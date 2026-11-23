"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, MapPin, ImageIcon, ChevronDown, ExternalLink } from "lucide-react";
import { useEvents, type EventItem } from "@/lib/use-events";
import { todayISO } from "@/lib/course-schedule";
import { formatDMY } from "@/lib/utils";
import EventRegisterButton from "@/components/EventRegisterButton";

export default function CultureEventsClient() {
  const all = useEvents(true);
  // "Upcoming" means upcoming: show today's and future events, soonest first.
  // (The admin list stays newest-first for management.)
  const events = useMemo(() => {
    const today = todayISO();
    return all.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  }, [all]);

  return (
    <section className="bg-cream py-14">
      <div className="container-xl">
        <h2 className="text-2xl md:text-3xl">Upcoming events.</h2>
        {events.length === 0 ? (
          <p className="mt-6 text-ink-muted">No events scheduled yet — check back soon.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {events.map((e) => <EventCard key={e.id} e={e} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ e }: { e: EventItem }) {
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const d = new Date(e.date);
  const mon = d.toLocaleDateString("en-GB", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();

  // Show the "Details" toggle only when the description actually overflows the
  // 2-line clamp (measured), so medium descriptions that wrap on mobile aren't
  // silently cut off with no way to expand.
  useEffect(() => {
    const el = descRef.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight + 2);
  }, [e.description]);

  return (
    <div className="frame p-5 md:p-6 bg-white grid md:grid-cols-[auto_auto_1fr_auto] gap-4 items-center">
      <div className="shrink-0 w-full h-44 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-paper border border-line flex items-center justify-center text-ink-soft">
        {e.image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={e.image} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
          : <ImageIcon size={26} strokeWidth={1.5} aria-hidden />}
      </div>
      <span className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-sole font-heading font-bold shrink-0 leading-tight">
        <span className="text-[11px] uppercase tracking-wider">{mon}</span>
        <span className="text-xl">{day}</span>
        <span className="text-[10px] text-ink-muted">{year}</span>
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-azzurro-deep font-medium">{e.kind}</p>
        <h3 className="mt-1 font-semibold text-lg leading-tight">{e.title}</h3>
        {e.description && (
          <p ref={descRef} className={`mt-1 text-sm text-ink-muted ${open ? "" : "line-clamp-2"}`}>{e.description}</p>
        )}
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1"><Calendar size={12} />{formatDMY(e.date)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
        </div>
        {(clamped || open || e.bookingUrl) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {(clamped || open) && (
              <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 text-[13px] font-medium text-azzurro-deep hover:underline">
                {open ? "Show less" : "Details"}
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
              </button>
            )}
            {e.bookingUrl && (
              <a href={e.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[13px] font-medium text-azzurro-deep hover:underline">
                More info <ExternalLink size={12} aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
      <EventRegisterButton eventId={e.id} eventTitle={e.title} eventDate={e.date} fields={e.regFields} customQuestions={e.customQuestions} />
    </div>
  );
}
