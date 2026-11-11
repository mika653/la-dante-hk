"use client";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Landmark, GraduationCap, BookOpen, ShieldCheck, Laptop2 } from "lucide-react";
import CourseCircle from "./CourseCircle";
import { useT, localizePath } from "@/lib/locale";

// "Why Dante HK" points — formerly the separate yellow WhyLaDante section, now a
// strip inside Find Your Course (per Giulia's mock-up).
const WHY = [
  { icon: Landmark,      en: { title: "90+ Years",              body: "of Italian language and culture in HK" },  zh: { title: "90+ 年歷史",        body: "紮根香港的意大利文化" } },
  { icon: GraduationCap, en: { title: "Native Italian Teachers", body: "Experienced and qualified" },             zh: { title: "意大利籍導師",       body: "經驗豐富，資格認證" } },
  { icon: BookOpen,      en: { title: "CEFR-Aligned Courses",    body: "Structured learning at every level" },    zh: { title: "CEFR 標準課程",      body: "每個級別均有系統教學" } },
  { icon: ShieldCheck,   en: { title: "Official PLIDA Centre",   body: "The only PLIDA centre in Hong Kong" },    zh: { title: "官方 PLIDA 考試中心", body: "全港唯一 PLIDA 考試中心" } },
  { icon: Laptop2,       en: { title: "In-Person & Online",      body: "Flexible learning that fits your life" }, zh: { title: "實體及網上課程",     body: "彈性學習配合你的生活" } },
];

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
  const isZh = locale === "zh";
  return (
    <section className="bg-white pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="container-xl">
        {/* Heading centred; placement-test box pinned top-right on desktop */}
        <div className="relative text-center">
          <p className="eyebrow">{t.courses.eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl max-w-xl mx-auto">
            {t.courses.titleLead}<span className="circle-accent-center">{t.courses.titleHighlight}</span>{t.courses.titleTail}
          </h2>
          <p className="mt-4 text-ink-muted max-w-xl mx-auto">{t.courses.subtitle}</p>

          <Link
            href={localizePath("/placement-test", locale)}
            className="group mt-8 xl:mt-0 xl:absolute xl:top-0 xl:right-0 mx-auto xl:mx-0 flex w-full max-w-[290px] items-center gap-3 rounded-2xl border-2 border-azzurro bg-white px-4 py-3 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-azzurro/15"
          >
            <span className="w-10 h-10 rounded-full bg-azzurro inline-flex items-center justify-center shrink-0">
              <ClipboardCheck size={18} className="text-ink" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] text-ink-muted">{isZh ? "5 分鐘找到你的程度" : "Find your level in 5 min"}</span>
              <span className="flex items-center gap-1 font-heading font-bold text-[15px] text-ink">
                {isZh ? "立即做分級測試" : "Take our Placement Test here"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-8 max-w-6xl mx-auto text-center">
          <CourseCircle tag={t.courses.circles.groups.tag}    label={t.courses.circles.groups.label}    href={localizePath("/courses/italian/adult-groups", locale)} tone="blue"   icon={iconGroup} />
          <CourseCircle tag={t.courses.circles.private.tag}   label={t.courses.circles.private.label}   href={localizePath("/courses/italian/private", locale)}      tone="cream"  icon={iconPrivate} />
          <CourseCircle tag={t.courses.circles.kids.tag}      label={t.courses.circles.kids.label}      href={localizePath("/courses/italian/kids", locale)}         tone="yellow" icon={iconKids} />
          <CourseCircle tag={t.courses.circles.online.tag}    label={t.courses.circles.online.label}    href={localizePath("/courses/italian/online", locale)}       tone="white"  icon={iconOnline} />
          <CourseCircle tag={t.courses.circles.corporate.tag} label={t.courses.circles.corporate.label} href={localizePath("/courses/italian/corporate", locale)}    tone="white"  icon={iconCorporate} />
          <CourseCircle tag={t.courses.circles.special.tag}   label={t.courses.circles.special.label}   href={localizePath("/courses/italian/special", locale)}      tone="cream"  icon={iconSpecial} />
        </div>

        {/* Why Dante HK — compact yellow strip under the course circles */}
        <div className="mt-14 md:mt-16 rounded-3xl bg-sole px-6 py-6 md:px-8 md:py-7 grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center">
          <h3 className="font-heading font-extrabold uppercase leading-[0.95] text-2xl md:text-3xl text-ink text-center lg:text-left">
            {isZh ? <>為什麼<br className="hidden lg:block" />選擇但丁</> : <>Why<br className="hidden lg:block" /> Dante<br className="hidden lg:block" /> HK</>}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
            {WHY.map(({ icon: Icon, en, zh }) => {
              const copy = isZh ? zh : en;
              return (
                <li key={copy.title} className="flex items-start gap-2.5">
                  <Icon size={24} className="text-rosso shrink-0" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="text-[14px] font-semibold leading-snug">{copy.title}</p>
                    <p className="mt-0.5 text-[12px] text-ink/70 leading-snug">{copy.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
