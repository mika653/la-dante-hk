"use client";
import Link from "next/link";
import { ClipboardCheck, Send, Landmark, GraduationCap, BookOpen, ShieldCheck, Laptop2 } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";

const ITEMS = [
  { icon: Landmark,      en: { title: "90+ Years",              body: "of Italian language and culture in HK" },     zh: { title: "90+ 年歷史",        body: "紮根香港的意大利文化" } },
  { icon: GraduationCap, en: { title: "Native Italian Teachers", body: "Experienced and qualified" },                zh: { title: "意大利籍導師",       body: "經驗豐富，資格認證" } },
  { icon: BookOpen,      en: { title: "CEFR-Aligned Courses",    body: "Structured learning at every level" },       zh: { title: "CEFR 標準課程",      body: "每個級別均有系統教學" } },
  { icon: ShieldCheck,   en: { title: "Official PLIDA Centre",   body: "The only PLIDA centre in Hong Kong" },       zh: { title: "官方 PLIDA 考試中心", body: "全港唯一 PLIDA 考試中心" } },
  { icon: Laptop2,       en: { title: "In-Person & Online",      body: "Flexible learning that fits your life" },    zh: { title: "實體及網上課程",     body: "彈性學習配合你的生活" } },
];

export default function WhyLaDante() {
  const { locale } = useT();
  const isZh = locale === "zh";
  return (
    <section className="relative bg-sole-soft overflow-hidden py-14 md:py-20">
      {/* Organic wavy background in the brand yellow */}
      <div className="absolute -top-16 right-[12%] w-[420px] h-[420px] rounded-[46%_54%_61%_39%/51%_46%_54%_49%] bg-sole/60 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 left-[6%] w-[360px] h-[360px] rounded-[55%_45%_40%_60%/45%_55%_50%_50%] bg-cream/70 blur-3xl" aria-hidden />

      <div className="container-xl relative z-10">
        {/* Find-your-level CTA */}
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center pb-10 md:pb-14 mb-10 md:mb-14 border-b border-ink/10">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-[var(--shadow-card)] inline-flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <ClipboardCheck size={28} className="text-rosso" aria-hidden />
          </span>

          <div className="text-center md:text-left">
            <p className="text-[13px] text-ink-muted">{isZh ? "不確定自己的程度？" : "Not sure which level is right for you?"}</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-heading font-bold text-ink">
              {isZh ? "5 分鐘找到你的意大利文程度。" : "Find your Italian level in 5 minutes."}
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              {isZh ? "15 條適應性題目 · 免費 · 即時結果" : "15 adaptive questions · Free · Instant result"}
            </p>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <Link href={localizePath("/placement-test", locale)} className="btn btn-primary uppercase tracking-wide text-[13px] relative z-10">
              {isZh ? "開始測試" : "Find My Level"}
            </Link>
            <svg width="72" height="44" viewBox="0 0 72 44" className="absolute -bottom-9 right-2 text-ink-soft hidden md:block" aria-hidden>
              <path d="M4 4 C 20 22, 42 32, 62 22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 5" fill="none" strokeLinecap="round" />
            </svg>
            <Send size={15} className="absolute -bottom-4 right-1 text-ink-soft rotate-[110deg] hidden md:block" aria-hidden />
          </div>
        </div>

        {/* Why La Dante */}
        <div className="mb-10 md:mb-14">
          <p className="eyebrow text-rosso">{isZh ? "為什麼選擇但丁" : "Why La Dante?"}</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold max-w-md">
            {isZh ? "不只是語言學校。" : "More Than a Language School"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {ITEMS.map(({ icon: Icon, en, zh }) => {
            const copy = isZh ? zh : en;
            return (
              <div key={copy.title} className="flex items-start gap-3">
                <Icon size={28} className="text-rosso shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="text-[14px] font-semibold leading-snug">{copy.title}</h3>
                  <p className="mt-1 text-[12px] text-ink-muted leading-snug">{copy.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
