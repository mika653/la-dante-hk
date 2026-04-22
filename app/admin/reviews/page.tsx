"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Star, Check, ExternalLink } from "lucide-react";
import { getReviews, addReview, updateReview, removeReview, type Review } from "@/lib/use-reviews";

export default function AdminReviewsPage() {
  const [list, setList] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("B1 student");
  const [year, setYear] = useState(new Date().getFullYear());
  const [published, setPublished] = useState(true);

  useEffect(() => { setList(getReviews()); }, []);
  const refresh = () => setList(getReviews());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addReview({ quote, name, level, year, published });
    setQuote(""); setName(""); setLevel("B1 student"); setYear(new Date().getFullYear()); setPublished(true);
    setShowForm(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 4000);
    refresh();
  }

  function del(id: string) {
    if (!confirm("Remove this review? You can restore by resetting demo data.")) return;
    removeReview(id); refresh();
  }
  function togglePublish(r: Review) { updateReview(r.id, { published: !r.published }); refresh(); }

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow">Admin · Reviews</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Student testimonials.</h1>
          <p className="mt-2 text-ink-muted">Add, edit, and toggle visibility of the quotes that appear in the homepage carousel.</p>
        </div>
        {!showForm && <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary"><Plus size={16} /> New review</button>}
      </div>

      {justAdded && (
        <div className="frame p-4 bg-sole mb-6 flex items-start gap-3">
          <Check size={18} className="text-ink shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 text-sm">
            <p className="font-medium">Review published.</p>
            <p className="text-ink/80">It&apos;s now rotating on the homepage testimonial carousel.</p>
          </div>
          <Link href="/#reviews" target="_blank" rel="noopener" className="text-azzurro-deep text-sm font-medium underline inline-flex items-center gap-1">View on site <ExternalLink size={12} /></Link>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="frame p-6 md:p-8 bg-white mb-6 space-y-4">
          <h2 className="text-lg font-semibold">New review</h2>
          <label className="block text-sm font-medium">Quote
            <textarea required value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} placeholder="Two or three sentences work best." className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="text-sm font-medium md:col-span-1">Student name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium md:col-span-1">Level / role<input required value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. B1 student" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
            <label className="text-sm font-medium md:col-span-1">Year<input required type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-azzurro-deep" />
            Publish immediately (appears in the homepage carousel)
          </label>
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Publish review</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="frame p-10 bg-white text-center text-ink-muted">No reviews yet. Add the first one.</div>}
        {list.map((r) => (
          <div key={r.id} className={`frame p-5 md:p-6 ${r.published ? "bg-white" : "bg-cream-2/60 opacity-75"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Star size={14} className="text-sole fill-sole" aria-hidden />
                <blockquote className="mt-2 text-[15px] leading-relaxed italic">“{r.quote}”</blockquote>
                <p className="mt-2 text-sm text-ink-muted"><strong className="text-ink">{r.name}</strong> · {r.level} · {r.year}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button type="button" onClick={() => togglePublish(r)} title={r.published ? "Unpublish" : "Publish"} className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted">
                  {r.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button type="button" onClick={() => del(r.id)} title="Delete" className="w-9 h-9 rounded-lg hover:bg-rosso/10 hover:text-rosso inline-flex items-center justify-center text-ink-muted"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
