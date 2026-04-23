"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/locale";
import { Languages } from "lucide-react";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);

  // Toggle between the same page in the other language
  const otherHref = locale === "zh"
    ? (pathname === "/zh" ? "/" : pathname.replace(/^\/zh/, "") || "/")
    : (pathname === "/" ? "/zh" : `/zh${pathname}`);
  const otherLabel = locale === "zh" ? "EN" : "中";
  const otherTitle = locale === "zh" ? "Switch to English" : "切換至繁體中文";

  return (
    <Link
      href={otherHref}
      title={otherTitle}
      aria-label={otherTitle}
      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-line hover:border-ink hover:bg-ink hover:text-cream transition-colors text-[13px] font-medium ${className}`}
    >
      <Languages size={13} aria-hidden />
      <span>{otherLabel}</span>
    </Link>
  );
}
