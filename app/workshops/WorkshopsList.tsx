"use client";
import { Users } from "lucide-react";
import { useWorkshops } from "@/lib/use-workshops";
import { workshopIcon } from "@/lib/workshop-icons";

export default function WorkshopsList() {
  const workshops = useWorkshops();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {workshops.map((w) => {
        const Icon = workshopIcon(w.image);
        return (
        <article key={w.id} className="frame p-6 bg-white flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-sole-soft flex items-center justify-center" aria-hidden>
            <Icon size={24} strokeWidth={1.5} className="text-azzurro-deep" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
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
        </article>
        );
      })}
    </div>
  );
}
