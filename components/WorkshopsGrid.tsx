import { workshops } from "@/lib/data";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export default function WorkshopsGrid() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Beyond the classroom</p>
            <h2 className="mt-3 text-3xl md:text-5xl"><span className="circle-accent-sm circle-accent">Our</span> workshops.</h2>
            <p className="mt-4 text-ink-muted max-w-xl">
              Planned sessions you can book — plus ideas we&apos;re gauging interest for. Tap <em>I&apos;m interested</em> and we&apos;ll open the class when enough of you want it.
            </p>
          </div>
          <Link href="/culture" className="hidden md:inline text-sm font-medium text-azzurro-deep hover:underline">All workshops →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((w) => (
            <article key={w.id} className="frame p-6 bg-white flex flex-col">
              <div className="aspect-[4/3] rounded-xl bg-sole-soft flex items-center justify-center text-6xl" aria-hidden>
                <span>{w.image}</span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs">
                {w.status === "planned" ? (
                  <span className="px-2.5 py-1 rounded-full bg-azzurro/10 text-azzurro-deep font-medium uppercase tracking-wider">Planned · {w.dateLabel}</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider inline-flex items-center gap-1">
                    <Users size={12} /> {w.interested} interested
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{w.title}</h3>
              <p className="mt-2 text-[14px] text-ink-muted leading-relaxed flex-1">{w.description}</p>
              <button type="button" className={`mt-5 btn ${w.status === "planned" ? "btn-primary" : "btn-yellow"} w-full`}>
                {w.status === "planned" ? (<>Book a seat <ArrowRight size={14} /></>) : (<>I&apos;m interested</>)}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
