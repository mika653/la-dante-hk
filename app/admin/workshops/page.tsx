"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getWorkshops } from "@/lib/admin-store";
import type { Workshop } from "@/lib/data";

export default function AdminWorkshops() {
  const [list, setList] = useState<Workshop[]>([]);
  useEffect(() => { setList(getWorkshops()); }, []);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-3">
        <div>
          <p className="eyebrow">Admin · Workshops</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Workshops.</h1>
        </div>
        <button type="button" className="btn btn-primary"><Plus size={16} /> New workshop</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((w) => (
          <div key={w.id} className="frame p-6 bg-white">
            <div className="aspect-[4/3] rounded-xl bg-sole-soft flex items-center justify-center text-6xl">{w.image}</div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${w.status === "planned" ? "bg-azzurro/10 text-azzurro-deep" : "bg-sole text-ink"}`}>
                {w.status === "planned" ? `Planned · ${w.dateLabel}` : `${w.interested} interested`}
              </span>
            </div>
            <h3 className="mt-3 font-semibold">{w.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{w.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
