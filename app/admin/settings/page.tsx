"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [banner, setBanner] = useState("Early-bird 10% off May–July term · University students −20% year-round");
  const [popup, setPopup] = useState("Introducing our new ScuolaSemplice student portal.");
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Admin · Settings</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Site settings.</h1>
      <p className="mt-3 text-ink-muted">Update the site banner and pop-up without touching code.</p>

      <div className="mt-8 frame p-6 md:p-8 bg-white space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Top announcement bar</span>
          <input value={banner} onChange={(e) => setBanner(e.target.value)} className="mt-2 w-full h-12 px-4 rounded-xl border border-line bg-white" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Homepage pop-up message</span>
          <textarea value={popup} onChange={(e) => setPopup(e.target.value)} rows={3} className="mt-2 w-full p-4 rounded-xl border border-line bg-white" />
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn btn-primary">Save changes</button>
          <button type="button" className="btn btn-ghost">Preview</button>
        </div>
        <p className="text-xs text-ink-muted italic">Demo mode: changes don&apos;t persist.</p>
      </div>
    </div>
  );
}
