"use client";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { useEvents } from "@/lib/use-events";

export default function CultureEventsClient() {
  const events = useEvents(true);

  return (
    <section className="bg-cream py-14">
      <div className="container-xl">
        <h2 className="text-2xl md:text-3xl">Upcoming events.</h2>
        {events.length === 0 ? (
          <p className="mt-6 text-ink-muted">No events scheduled yet — check back soon.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {events.map((e) => {
              const d = new Date(e.date);
              const mon = d.toLocaleDateString("en-GB", { month: "short" });
              const day = d.getDate();
              const year = d.getFullYear();
              return (
                <div key={e.id} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
                  <span className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-sole-soft font-heading font-bold shrink-0 leading-tight">
                    <span className="text-[11px] uppercase tracking-wider">{mon}</span>
                    <span className="text-xl">{day}</span>
                    <span className="text-[10px] text-ink-muted">{year}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-azzurro-deep font-medium">{e.kind}</p>
                    <h3 className="mt-1 font-semibold text-lg leading-tight">{e.title}</h3>
                    {e.description && <p className="mt-1 text-sm text-ink-muted">{e.description}</p>}
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1"><Calendar size={12} />{e.date}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
                    </div>
                  </div>
                  {e.bookingUrl ? (
                    <a href={e.bookingUrl} target="_blank" rel="noopener" className="btn btn-primary text-sm h-10 px-4 shrink-0">Book <ExternalLink size={13} /></a>
                  ) : (
                    <Link href="/contact" className="btn btn-ghost text-sm h-10 px-4 shrink-0">Book</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
