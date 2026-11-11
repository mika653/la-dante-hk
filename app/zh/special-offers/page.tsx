import Link from "next/link";
import { ArrowRight, Timer, GraduationCap, IdCard, Gift, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = { title: "優惠 — 香港但丁協會" };

const OFFERS = [
  { Icon: Timer, tag: "新學期", title: "早鳥優惠", body: "提早報讀新學期小組課程即可享優惠。詳情及截止日期請向辦公室查詢。", href: "/zh/courses/italian/adult-groups", cta: "查看小組課程" },
  { Icon: GraduationCap, tag: "9 折", title: "大學生及長者", body: "全日制大學生及長者報讀課程可享 9 折。報名時請出示有效學生證或長者證。", href: "/zh/courses", cta: "瀏覽所有課程" },
  { Icon: IdCard, tag: "會員", title: "會員折扣及優惠", body: "憑但丁會員卡可享指定文化活動及短期課程折扣，以及合作餐廳、酒商等商戶優惠。", href: "/zh/membership#perks", cta: "查看會員優惠" },
  { Icon: Gift, tag: "禮物", title: "送一份意大利", body: "把課程或會員資格送給熱愛意大利的朋友。", href: "/zh/gift", cta: "禮物選項" },
];

export default function SpecialOffersZh() {
  return (
    <>
      <PageHeader
        eyebrow="優惠"
        title="Offerte speciali."
        subtitle="香港但丁協會現有的課程、會員及文化活動優惠。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "優惠" }]}
      />
      <section className="bg-white py-14 md:py-20">
        <div className="container-xl grid sm:grid-cols-2 gap-6">
          {OFFERS.map(({ Icon, tag, title, body, href, cta }) => (
            <div key={title} className="frame bg-white p-7 md:p-8 flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-sole inline-flex items-center justify-center shrink-0"><Icon size={22} aria-hidden /></span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper text-xs font-semibold uppercase tracking-wider text-azzurro-deep"><Tag size={11} aria-hidden /> {tag}</span>
              </div>
              <h2 className="mt-5 text-2xl font-heading font-bold">{title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted flex-1">{body}</p>
              <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-azzurro-deep hover:underline">{cta} <ArrowRight size={14} /></Link>
            </div>
          ))}
        </div>
        <p className="container-xl mt-8 text-[13px] text-ink-muted">除另有說明外，優惠不可同時使用，數量有限。詳細條款請向辦公室查詢。</p>
      </section>
      <section id="enquire" className="bg-paper py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl"><EnquiryForm type="general" /></div>
      </section>
    </>
  );
}
