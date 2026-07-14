"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CalendarDays, ArrowRight } from "lucide-react";
import { getSettings, setSettings } from "@/lib/admin-store";

export default function AdminSettings() {
  const [banner, setBanner] = useState("");
  const [popup, setPopup] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setBanner(s.banner);
    setPopup(s.popup);
  }, []);

  function save() {
    setSettings({ banner, popup });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Admin · Settings</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Site settings.</h1>
      <p className="mt-3 text-ink-muted">Update the site banner and pop-up without touching code.</p>

      {saved && (
        <div className="mt-6 frame p-4 bg-sole flex items-start gap-3">
          <Check size={18} className="text-ink shrink-0 mt-0.5" aria-hidden />
          <p className="flex-1 text-sm font-medium">Settings saved.</p>
        </div>
      )}

      <div className="mt-6 frame p-6 md:p-8 bg-white space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Top announcement bar</span>
          <input value={banner} onChange={(e) => setBanner(e.target.value)} className="mt-2 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Homepage pop-up message</span>
          <textarea value={popup} onChange={(e) => setPopup(e.target.value)} rows={3} className="mt-2 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={save} className="btn btn-primary">Save changes</button>
          <button type="button" onClick={() => window.open("/", "_blank", "noopener")} className="btn btn-ghost">Preview</button>
        </div>
        <p className="text-xs text-ink-muted italic">Saved in this browser. Phase 2 connects this to a database so it updates for everyone.</p>
      </div>

      {/* Public holidays link */}
      <Link href="/admin/holidays" className="mt-6 frame p-5 md:p-6 bg-white flex items-center gap-4 hover:border-ink-muted transition-colors">
        <span className="w-11 h-11 rounded-xl bg-azzurro/15 text-azzurro-deep inline-flex items-center justify-center shrink-0"><CalendarDays size={20} /></span>
        <div className="flex-1 min-w-0">
          <p className="font-medium">Public holidays</p>
          <p className="text-sm text-ink-muted">Manage the closure dates the course scheduler skips when generating lessons and continuations.</p>
        </div>
        <ArrowRight size={18} className="text-ink-muted shrink-0" />
      </Link>
    </div>
  );
}
