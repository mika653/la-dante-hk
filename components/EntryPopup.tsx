"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

export default function EntryPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("ladante-popup");
    if (seen) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setShow(false);
    try { sessionStorage.setItem("ladante-popup", "1"); } catch {}
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-ink/40 animate-in" role="dialog" aria-labelledby="popup-title">
      <div className="relative frame bg-cream max-w-md w-full overflow-hidden">
        <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-ink/10 inline-flex items-center justify-center z-10">
          <X size={16} />
        </button>

        {/* Top: yellow header with Dante brand circles */}
        <div className="bg-sole p-6 pb-8 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-azzurro/15" aria-hidden />
          <div className="absolute bottom-2 left-4 w-3 h-3 rounded-full bg-azzurro" aria-hidden />
          <p className="eyebrow">New this term</p>
          <h2 id="popup-title" className="mt-2 text-2xl font-heading font-extrabold">May–July 2026 enrolment is open.</h2>
        </div>

        <div className="p-6">
          <ul className="space-y-2.5 text-[15px]">
            <li className="flex gap-2"><Sparkles size={16} className="text-azzurro mt-1 shrink-0" aria-hidden /><span>Early-bird <strong>10% off</strong> until 10 April</span></li>
            <li className="flex gap-2"><Sparkles size={16} className="text-azzurro mt-1 shrink-0" aria-hidden /><span>University students <strong>−20%</strong> year-round</span></li>
            <li className="flex gap-2"><Sparkles size={16} className="text-azzurro mt-1 shrink-0" aria-hidden /><span>Gift cards now available for friends & family</span></li>
          </ul>
          <div className="mt-6 flex gap-2">
            <Link href="/courses/italian/adult-groups" onClick={close} className="btn btn-primary flex-1">See courses</Link>
            <Link href="/placement-test" onClick={close} className="btn btn-ghost">Find my level</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
