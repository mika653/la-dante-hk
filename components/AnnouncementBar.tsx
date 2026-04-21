"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-ink text-cream text-[13px]">
      <div className="container-xl flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles size={14} className="text-sole shrink-0" aria-hidden />
          <p className="truncate">
            <span className="font-medium">Early-bird 10% off</span> May–July term · University students <span className="font-medium">−20%</span> year-round ·{" "}
            <Link href="/courses/italian/adult-groups" className="underline underline-offset-2 hover:text-sole">See courses →</Link>
          </p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss announcement" className="opacity-70 hover:opacity-100 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
