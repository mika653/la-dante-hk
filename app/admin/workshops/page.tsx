"use client";
import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { getWorkshops, addWorkshop } from "@/lib/admin-store";
import type { Workshop } from "@/lib/data";

const EMOJI = ["🎭", "🍝", "🎨", "🎬", "🎶", "📚", "✍️", "🏛️", "☕", "🍷"];

export default function AdminWorkshops() {
  const [list, setList] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Workshop["status"]>("planned");
  const [dateLabel, setDateLabel] = useState("");
  const [image, setImage] = useState(EMOJI[0]);

  useEffect(() => { setList(getWorkshops()); }, []);
  const refresh = () => setList(getWorkshops());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const w: Workshop = {
      id: `w-${Date.now()}`,
      title: title.trim() || "Untitled workshop",
      description,
      status,
      image,
      ...(status === "planned" ? { dateLabel: dateLabel || "Date TBC" } : { interested: 0 }),
    };
    addWorkshop(w);
    setTitle(""); setDescription(""); setStatus("planned"); setDateLabel(""); setImage(EMOJI[0]);
    setShowForm(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 4000);
    refresh();
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-3">
        <div>
          <p className="eyebrow">Admin · Workshops</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Workshops.</h1>
        </div>
        {!showForm && <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary"><Plus size={16} /> New workshop</button>}
      </div>

      {justAdded && (
        <div className="frame p-4 bg-sole mb-6 flex items-start gap-3">
          <Check size={18} className="text-ink shrink-0 mt-0.5" aria-hidden />
          <p className="flex-1 text-sm font-medium">Workshop added. It now appears in the grid below.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="frame p-6 md:p-8 bg-white mb-8 space-y-4">
          <h2 className="text-lg font-semibold">New workshop</h2>
          <label className="block text-sm font-medium">Title
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Italian Cooking Night" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
          </label>
          <label className="block text-sm font-medium">Description
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="One or two sentences about the workshop." className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex gap-2">
                {(["planned", "interest"] as Workshop["status"][]).map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(s)} className={`px-5 py-2.5 rounded-full border ${status === s ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{s === "planned" ? "Planned (has a date)" : "Gauging interest"}</button>
                ))}
              </div>
            </div>
            {status === "planned" && (
              <label className="block text-sm font-medium">Date label
                <input value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} placeholder="e.g. Sat 12 Jul · 3pm" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
              </label>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI.map((em) => (
                <button key={em} type="button" onClick={() => setImage(em)} className={`w-11 h-11 rounded-xl border text-2xl flex items-center justify-center ${image === em ? "border-ink bg-sole-soft" : "border-line hover:border-ink-muted"}`}>{em}</button>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Add workshop</button>
          </div>
        </form>
      )}

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
