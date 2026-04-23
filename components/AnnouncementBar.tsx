"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useT, localizePath } from "@/lib/locale";

export default function AnnouncementBar() {
  const { t, locale } = useT();
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-ink text-cream text-[13px]">
      <div className="container-xl flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles size={14} className="text-sole shrink-0" aria-hidden />
          <p className="truncate">
            <span className="font-medium">{t.announce.parts[0]}</span> · <span className="font-medium">{t.announce.parts[1]}</span> ·{" "}
            <Link href={localizePath("/courses/italian/adult-groups", locale)} className="underline underline-offset-2 hover:text-sole">{t.announce.cta}</Link>
          </p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss announcement" className="opacity-70 hover:opacity-100 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
