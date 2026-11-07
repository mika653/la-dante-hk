"use client";
import { Calendar, MapPin, ImageIcon } from "lucide-react";
import { useEvents } from "@/lib/use-events";
import EventRegisterButton from "@/components/EventRegisterButton";

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
                <div key={e.id} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[auto_auto_1fr_auto] gap-4 items-center">
                  {/* PLACEHOLDER: event graphic — client to supply a per-event image here.
                      Sits to the LEFT of the yellow date tile. Hidden on mobile to keep rows compact. */}
                  <div
                    aria-hidden
                    title="Event graphic placeholder — image to be supplied by the client"
                    className="hidden md:flex shrink-0 w-24 h-24 rounded-2xl bg-sole-soft border border-dashed border-ink/20 items-center justify-center text-ink-soft"
                  >
                    <ImageIcon size={26} strokeWidth={1.5} />
                  </div>
                  <span className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-sole font-heading font-bold shrink-0 leading-tight">
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
                  <EventRegisterButton eventId={e.id} eventTitle={e.title} eventDate={e.date} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
