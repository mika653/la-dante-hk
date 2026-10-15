import Link from "next/link";
import { Languages, Mic, FileCheck2, ArrowRight, Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "傳譯及翻譯服務 — La Dante HK" };

const SERVICES = [
  {
    icon: Languages,
    title: "Translation",
    titleZh: "翻譯服務",
    body: "提供意大利文、英文及中文之間精確、經認證及合法化的翻譯。",
  },
  {
    icon: Mic,
    title: "Interpreting",
    titleZh: "傳譯服務",
    body: "適用於現場活動、企業會議及研討會 — 與意大利語受眾無縫而有效地溝通。",
  },
  {
    icon: FileCheck2,
    title: "Proof-reading & editing",
    titleZh: "校對和編輯服務",
    body: "我們為你的定稿進行審校，確保文法、拼寫、標點及格式一致而準確。",
  },
];

const FIELDS = [
  { en: "Legal", zh: "法律文件" },
  { en: "Business & Commerce", zh: "商業及貿易文件" },
  { en: "Personal & Educational", zh: "個人及教育文件" },
  { en: "Technical", zh: "技術文件" },
  { en: "Finance", zh: "財政文件" },
];

export default function TranslationPage() {
  return (
    <>
      <PageHeader
        eyebrow="翻譯服務 · Translation"
        title="傳譯及翻譯服務"
        subtitle="專業而準確的意大利文翻譯及傳譯服務 — 以你的文件應得的細緻與品質為本。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "翻譯服務" }]}
        tone="azzurro"
      />

      {/* Intro */}
      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-4">
          <p className="text-[15px] leading-relaxed">
            我們提供專業及準確的意大利文翻譯及傳譯服務，專注於細節和品質保障，確保我們的服務能滿足你的特定需求。我們提供合法且經認證的翻譯服務，並可提供 24 小時内加急翻譯（加急翻譯可能需要額外收費）。
          </p>
          <p className="text-[13px] text-ink-muted leading-relaxed">
            We pride ourselves on our attention to detail and commitment to quality, adapting our services to meet your specific requirements. We provide certified and legalised translations. Urgent translations within 24 hours are available (an additional charge may apply to urgent work).
          </p>
        </div>
      </section>

      {/* Languages of competence */}
      <section className="bg-cream py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">可翻譯的語言 · Languages of competence</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { en: "Italian", zh: "意大利文" },
              { en: "English", zh: "英文" },
              { en: "Chinese", zh: "中文" },
            ].map((l) => (
              <span key={l.en} className="rounded-full bg-white border border-line px-5 py-2.5 font-heading font-semibold">
                {l.en} <span className="text-ink-muted font-normal">· {l.zh}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 md:py-20 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">我們的服務 · Our services</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="frame p-6 bg-cream-2/50">
                <s.icon size={24} className="text-azzurro-deep" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold">{s.title} <span className="text-ink-muted text-base font-normal">{s.titleZh}</span></h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fields of expertise */}
      <section className="bg-sole py-16 md:py-20">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">我們的專業領域 · Our fields of expertise</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-heading font-bold">為各種文件提供精確的翻譯。</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {FIELDS.map((f) => (
              <div key={f.en} className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-2">
                <span className="font-medium">{f.zh}</span>
                <span className="text-sm text-ink/70 whitespace-nowrap">{f.en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member perk + contact */}
      <section className="bg-cream py-16 md:py-20 border-t border-line">
        <div className="container-xl max-w-2xl text-center">
          <p className="text-[15px] text-ink-muted">
            <span className="font-semibold text-ink">會員享更多優惠。</span> 我們的銀會員、金會員及鑽石會員均可享翻譯服務費用折扣。
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a href="mailto:dantealighieri@ladante.cc" className="btn btn-primary"><Mail size={16} /> 索取報價</a>
            <Link href="/zh/membership" className="btn btn-ghost">查看會員優惠 <ArrowRight size={16} /></Link>
          </div>
          <p className="mt-4 text-sm text-ink-muted">如有查詢或報價需求，歡迎聯絡我們 · <a href="mailto:dantealighieri@ladante.cc" className="text-azzurro-deep hover:underline">dantealighieri@ladante.cc</a></p>
        </div>
      </section>
    </>
  );
}
