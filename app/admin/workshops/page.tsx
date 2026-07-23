"use client";
import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { getWorkshops, addWorkshop } from "@/lib/use-workshops";
import { workshopIcon, WORKSHOP_ICONS } from "@/lib/workshop-icons";
import type { Workshop } from "@/lib/data";

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /Not authorised/i.test(m) ? "You need to be signed in as an owner or manager to change workshops. Please sign in first." : m;
}

const DEFAULT_ICON = WORKSHOP_ICONS[0].key;

export default function AdminWorkshops() {
  const [list, setList] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Workshop["status"]>("planned");
  const [dateLabel, setDateLabel] = useState("");
  const [image, setImage] = useState<string>(DEFAULT_ICON);

  const [err, setErr] = useState<string | null>(null);
  const refresh = () => getWorkshops().then(setList).catch((e) => setErr(errText(e)));
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const w: Omit<Workshop, "id"> = {
      title: title.trim() || "Untitled workshop",
      description,
      status,
      image,
      ...(status === "planned" ? { dateLabel: dateLabel || "Date TBC" } : { interested: 0 }),
    };
    try {
      await addWorkshop(w);
      setTitle(""); setDescription(""); setStatus("planned"); setDateLabel(""); setImage(DEFAULT_ICON);
      setShowForm(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 4000);
      await refresh();
    } catch (e) { setErr(errText(e)); }
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

      {err && <div className="frame p-4 bg-rosso/10 text-rosso text-sm mb-6">{err}</div>}

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
              {WORKSHOP_ICONS.map(({ key, Icon, label }) => (
                <button key={key} type="button" title={label} aria-label={label} onClick={() => setImage(key)} className={`w-11 h-11 rounded-xl border flex items-center justify-center ${image === key ? "border-ink bg-sole-soft text-azzurro-deep" : "border-line text-ink-muted hover:border-ink-muted"}`}>
                  <Icon size={20} strokeWidth={1.5} />
                </button>
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
        {list.map((w) => {
          const Icon = workshopIcon(w.image);
          return (
          <div key={w.id} className="frame p-6 bg-white">
            <div className="aspect-[4/3] rounded-xl bg-sole-soft flex items-center justify-center">
              <Icon size={44} strokeWidth={1.5} className="text-azzurro-deep" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${w.status === "planned" ? "bg-azzurro/10 text-azzurro-deep" : "bg-sole text-ink"}`}>
                {w.status === "planned" ? `Planned · ${w.dateLabel}` : `${w.interested} interested`}
              </span>
            </div>
            <h3 className="mt-3 font-semibold">{w.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{w.description}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
