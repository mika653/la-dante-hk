"use client";
import { usePathname } from "next/navigation";
import { getLocaleFromPath, dict } from "@/lib/locale";
import { Info } from "lucide-react";

export default function ZhPreviewBanner() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  if (locale !== "zh") return null;
  return (
    <div className="bg-sole-soft border-b border-sole/30 text-ink">
      <div className="container-xl py-2 flex items-center gap-2 text-xs">
        <Info size={14} className="shrink-0 text-ink" aria-hidden />
        <p className="flex-1">{dict.zh.banner}</p>
      </div>
    </div>
  );
}
