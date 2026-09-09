"use client";
import CourseCircle from "./CourseCircle";
import { useT, localizePath } from "@/lib/locale";

// Inline SVG "mini-scenes" evocative of each course type — no raster assets needed.
const iconGroup = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle cx="26" cy="32" r="10" fill="currentColor" />
    <circle cx="54" cy="32" r="10" fill="currentColor" opacity="0.7" />
    <path d="M8 66 Q 26 50 40 58 Q 54 66 72 54 L 72 72 L 8 72 Z" fill="currentColor" opacity="0.85" />
  </svg>
);
const iconPrivate = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle cx="40" cy="30" r="12" fill="currentColor" />
    <path d="M18 68 Q 40 50 62 68 L 62 72 L 18 72 Z" fill="currentColor" opacity="0.85" />
    <circle cx="62" cy="20" r="4" fill="currentColor" opacity="0.8" />
  </svg>
);
const iconKids = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle cx="24" cy="30" r="8" fill="currentColor" opacity="0.85" />
    <circle cx="46" cy="26" r="9" fill="currentColor" />
    <path d="M10 64 Q 24 50 38 58 Q 52 46 70 58 L 70 68 L 10 68 Z" fill="currentColor" opacity="0.8" />
    <path d="M46 12 l3 5 l5 1 l-4 4 l1 5 l-5 -3 l-5 3 l1 -5 l-4 -4 l5 -1 Z" fill="currentColor" />
  </svg>
);
const iconOnline = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <rect x="12" y="18" width="56" height="36" rx="4" fill="currentColor" opacity="0.9" />
    <rect x="20" y="26" width="40" height="20" rx="2" fill="var(--color-cream)" />
    <path d="M28 62 h24 M34 62 v6 M46 62 v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const iconCorporate = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <rect x="12" y="28" width="18" height="36" fill="currentColor" opacity="0.85" />
    <rect x="34" y="18" width="18" height="46" fill="currentColor" />
    <rect x="56" y="34" width="16" height="30" fill="currentColor" opacity="0.75" />
    <circle cx="21" cy="22" r="3" fill="currentColor" opacity="0.6" />
  </svg>
);
const iconSpecial = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <path d="M40 10 l7 16 l17 2 l-13 12 l4 17 l-15 -9 l-15 9 l4 -17 l-13 -12 l17 -2 Z" fill="currentColor" />
  </svg>
);

export default function CourseCircles() {
  const { t, locale } = useT();
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-xl text-center">
        <p className="eyebrow">{t.courses.eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-5xl max-w-xl mx-auto">
          {t.courses.titleLead}<span className="circle-accent-center">{t.courses.titleHighlight}</span>{t.courses.titleTail}
        </h2>
        <p className="mt-4 text-ink-muted max-w-xl mx-auto">{t.courses.subtitle}</p>

        <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-8 max-w-6xl mx-auto">
          <CourseCircle tag={t.courses.circles.groups.tag}    label={t.courses.circles.groups.label}    href={localizePath("/courses/italian/adult-groups", locale)} tone="blue"   icon={iconGroup} />
          <CourseCircle tag={t.courses.circles.private.tag}   label={t.courses.circles.private.label}   href={localizePath("/courses/italian/private", locale)}      tone="cream"  icon={iconPrivate} />
          <CourseCircle tag={t.courses.circles.kids.tag}      label={t.courses.circles.kids.label}      href={localizePath("/courses/italian/kids", locale)}         tone="yellow" icon={iconKids} />
          <CourseCircle tag={t.courses.circles.online.tag}    label={t.courses.circles.online.label}    href={localizePath("/courses/italian/online", locale)}       tone="white"  icon={iconOnline} />
          <CourseCircle tag={t.courses.circles.corporate.tag} label={t.courses.circles.corporate.label} href={localizePath("/courses/italian/corporate", locale)}    tone="white"  icon={iconCorporate} />
          <CourseCircle tag={t.courses.circles.special.tag}   label={t.courses.circles.special.label}   href={localizePath("/courses/italian/special", locale)}      tone="cream"  icon={iconSpecial} />
        </div>
      </div>
    </section>
  );
}
