import PageHeader from "@/components/PageHeader";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

const events = [
  { date: "15.05.2026", title: "Italian Wine & Language", kind: "Workshop", location: "Wanchai" },
  { date: "22.06.2026", title: "Dante's Inferno Reading Club — Session 1", kind: "Book club", location: "Wanchai" },
  { date: "05.07.2026", title: "Italian Cinema Night: La Dolce Vita", kind: "Film screening", location: "HK Arts Centre" },
  { date: "19.07.2026", title: "Aperitivo & Chiacchiere", kind: "Social", location: "Wanchai" },
  { date: "02.08.2026", title: "Regional Italy: Sicilian Food Tasting", kind: "Culture", location: "Wanchai" },
];

export default function Culture() {
  return (
    <>
      <PageHeader
        eyebrow="Culture"
        title="Events, workshops, library."
        subtitle="Italy beyond the textbook. Screenings, aperitivi, bookclubs, and workshops — open to members and non-members."
        crumbs={[{ label: "Home", href: "/" }, { label: "Culture" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl">
          <h2 className="text-2xl md:text-3xl">Upcoming events.</h2>
          <div className="mt-6 space-y-3">
            {events.map((e) => (
              <div key={e.title} className="frame p-5 md:p-6 bg-white grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sole-soft font-heading font-bold text-[13px] text-center leading-tight">{e.date.split(".").slice(0, 2).join(".")}<br />{e.date.split(".")[2]}</span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-azzurro font-medium">{e.kind}</p>
                  <h3 className="mt-1 font-semibold text-lg">{e.title}</h3>
                  <div className="mt-1 flex gap-4 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1"><Calendar size={12} />{e.date}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
                  </div>
                </div>
                <Link href="/contact" className="btn btn-ghost text-sm h-10 px-4">Book</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WorkshopsGrid />
    </>
  );
}
