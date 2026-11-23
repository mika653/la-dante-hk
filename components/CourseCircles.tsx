"use client";
import Link from "next/link";
import { createElement } from "react";
import { ArrowRight, ClipboardCheck, Landmark, GraduationCap, BookOpen, ShieldCheck, Laptop2 } from "lucide-react";
import CourseCircle from "./CourseCircle";
import { COURSE_ART, type CourseArtKey } from "./course-circle-art";
import { useT, localizePath } from "@/lib/locale";
import { useIconChoices } from "@/lib/use-icon-choices";
import { slotIcon, slotIconOr, type IconChoices } from "@/lib/icon-choices-shared";

// "Why Dante HK" points — formerly the separate yellow WhyLaDante section, now a
// strip inside Find Your Course (per Giulia's mock-up).
const WHY = [
  { slot: "why.years", icon: Landmark,      en: { title: "90+ Years",              body: "of Italian language and culture in HK" },  zh: { title: "90+ 年歷史",        body: "紮根香港的意大利文化" } },
  { slot: "why.teachers", icon: GraduationCap, en: { title: "Native Italian Teachers", body: "Experienced and qualified" },             zh: { title: "意大利籍導師",       body: "經驗豐富，資格認證" } },
  { slot: "why.cefr", icon: BookOpen,      en: { title: "CEFR-Aligned Courses",    body: "Structured learning at every level" },    zh: { title: "CEFR 標準課程",      body: "每個級別均有系統教學" } },
  { slot: "why.plida", icon: ShieldCheck,   en: { title: "Official PLIDA Centre",   body: "The only PLIDA centre in Hong Kong" },    zh: { title: "官方 PLIDA 考試中心", body: "全港唯一 PLIDA 考試中心" } },
  { slot: "why.online", icon: Laptop2,       en: { title: "In-Person & Online",      body: "Flexible learning that fits your life" }, zh: { title: "實體及網上課程",     body: "彈性學習配合你的生活" } },
];

// The admin-chosen library icon for a course circle (sized to fill the circle's
// art box), or the original custom illustration when none is chosen.
function courseIcon(choices: IconChoices, key: CourseArtKey) {
  const Icon = slotIcon(choices, `course.${key}`);
  return Icon ? createElement(Icon, { className: "w-full h-full", strokeWidth: 1.25, "aria-hidden": true }) : COURSE_ART[key];
}

export default function CourseCircles() {
  const { t, locale } = useT();
  const icons = useIconChoices();
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
          <CourseCircle tag={t.courses.circles.groups.tag}    label={t.courses.circles.groups.label}    href={localizePath("/courses/italian/adult-groups", locale)} tone="blue"   icon={courseIcon(icons, "groups")} />
          <CourseCircle tag={t.courses.circles.private.tag}   label={t.courses.circles.private.label}   href={localizePath("/courses/italian/private", locale)}      tone="cream"  icon={courseIcon(icons, "private")} />
          <CourseCircle tag={t.courses.circles.kids.tag}      label={t.courses.circles.kids.label}      href={localizePath("/courses/italian/kids", locale)}         tone="yellow" icon={courseIcon(icons, "kids")} />
          <CourseCircle tag={t.courses.circles.online.tag}    label={t.courses.circles.online.label}    href={localizePath("/courses/italian/online", locale)}       tone="white"  icon={courseIcon(icons, "online")} />
          <CourseCircle tag={t.courses.circles.corporate.tag} label={t.courses.circles.corporate.label} href={localizePath("/courses/italian/corporate", locale)}    tone="white"  icon={courseIcon(icons, "corporate")} />
          <CourseCircle tag={t.courses.circles.special.tag}   label={t.courses.circles.special.label}   href={localizePath("/courses/italian/special", locale)}      tone="cream"  icon={courseIcon(icons, "special")} />
        </div>

        {/* Why Dante HK — dark-blue raised "3D" frame under the course circles
            (was a flat yellow strip). Depth comes from a gradient face, a top
            highlight, an offset back plate and a soft long shadow. */}
        <div className="why-frame-3d mt-14 md:mt-16 rounded-3xl px-6 py-6 md:px-8 md:py-7 grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center text-white">
          <h3 className="font-heading font-extrabold uppercase leading-[0.95] text-2xl md:text-3xl text-white text-center lg:text-left">
            {isZh ? <>為什麼<br className="hidden lg:block" />選擇但丁</> : <>Why<br className="hidden lg:block" /> Dante<br className="hidden lg:block" /> HK</>}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
            {WHY.map(({ slot, icon, en, zh }) => {
              const copy = isZh ? zh : en;
              const Icon = slotIconOr(icons, slot, icon);
              return (
                <li key={copy.title} className="flex items-start gap-2.5">
                  <Icon size={24} className="text-azzurro shrink-0" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="text-[14px] font-semibold leading-snug">{copy.title}</p>
                    <p className="mt-0.5 text-[12px] text-white/75 leading-snug">{copy.body}</p>
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
