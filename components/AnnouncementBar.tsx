"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useT, localizePath } from "@/lib/locale";
import { useSiteContent, pickLocale } from "@/lib/site-content";

export default function AnnouncementBar() {
  const { locale } = useT();
  const content = useSiteContent();
  const a = content.announcement;
  const [open, setOpen] = useState(true);
  if (!open || !a?.enabled) return null;

  const parts = a.parts.map((p) => pickLocale(p, locale)).filter(Boolean);
  const ctaLabel = pickLocale(a.cta.label, locale);
  if (parts.length === 0 && !ctaLabel) return null;

  return (
    <div className="bg-ink text-cream text-[13px]">
      <div className="container-xl flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles size={14} className="text-sole shrink-0" aria-hidden />
          <p className="truncate">
            {parts.map((p, i) => (
              <span key={i}>
                {i > 0 && <span className="opacity-60"> · </span>}
                <span className="font-medium">{p}</span>
              </span>
            ))}
            {ctaLabel && a.cta.href && (
              <>
                <span className="opacity-60"> · </span>
                <Link href={localizePath(a.cta.href, locale)} className="underline underline-offset-2 hover:text-sole">{ctaLabel}</Link>
              </>
            )}
          </p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss announcement" className="opacity-70 hover:opacity-100 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
