"use client";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users2, GraduationCap, UserCheck } from "lucide-react";
import { useCourses } from "@/lib/use-courses";
import { formatHKD } from "@/lib/utils";
import { useT, localizePath } from "@/lib/locale";

const FEATURES = [
  { icon: CalendarDays,   en: "12 weeks per term",       zh: "每期 12 週" },
  { icon: Users2,         en: "Small class size",        zh: "小班教學" },
  { icon: GraduationCap,  en: "CEFR-aligned",             zh: "CEFR 標準課程" },
  { icon: UserCheck,      en: "Native Italian teachers",  zh: "意大利籍導師" },
];

export default function UpcomingCourses() {
  const all = useCourses();
  const { locale } = useT();
  const isZh = locale === "zh";
  const rows = all
    .filter((c) => c.language === "italian" && c.type === "adult-group")
    .slice(0, 4);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-xl grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
        <div>
          <p className="eyebrow !text-azzurro-deep">{isZh ? "近期課程" : "Upcoming Courses"}</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold leading-tight">
            {isZh ? "2026 年 9 月 開課在即" : "September 2026 Intake Now Open"}
          </h2>
          <p className="mt-3 text-ink-muted text-[15px]">
            {isZh ? "灣仔及網上課程現正接受報名。" : "Join our upcoming courses in Wanchai or online."}
          </p>
          <Link href={localizePath("/courses/italian/adult-groups", locale)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep hover:underline">
            {isZh ? "查看所有課程" : "View all courses"} <ArrowRight size={14} />
          </Link>
        </div>

        <div>
          <div className="frame bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
                  <th className="py-3 px-5 font-medium">{isZh ? "課程" : "Course"}</th>
                  <th className="py-3 px-4 font-medium">{isZh ? "級別" : "Level"}</th>
                  <th className="py-3 px-4 font-medium">{isZh ? "時間表" : "Schedule"}</th>
                  <th className="py-3 px-4 font-medium">{isZh ? "地點" : "Location"}</th>
                  <th className="py-3 px-4 font-medium">{isZh ? "價錢" : "Price"}</th>
                  <th className="py-3 px-5" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="py-8 px-5 text-center text-ink-muted text-sm">{isZh ? "本學期暫無排定課程。" : "No scheduled classes this term."}</td></tr>
                )}
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-b-0">
                    <td className="py-4 px-5 font-medium text-[14px]">{c.title}</td>
                    <td className="py-4 px-4 text-[13px] text-ink-muted">{c.level}</td>
                    <td className="py-4 px-4 text-[13px] text-ink-muted whitespace-nowrap">{c.dayLabel}</td>
                    <td className="py-4 px-4 text-[13px] text-ink-muted">{c.location}</td>
                    <td className="py-4 px-4 text-[13px] font-semibold">{formatHKD(c.priceHKD)}</td>
                    <td className="py-4 px-5 text-right">
                      <Link href={`${localizePath("/courses/italian/adult-groups", locale)}#enquire`} className="btn btn-primary text-xs h-9 px-4 whitespace-nowrap">
                        {isZh ? "立即報名" : "Enroll Now"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {FEATURES.map(({ icon: Icon, en, zh }) => (
              <span key={en} className="inline-flex items-center gap-2 text-[13px] text-ink-muted">
                <Icon size={15} className="text-azzurro-deep" aria-hidden />
                {isZh ? zh : en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
