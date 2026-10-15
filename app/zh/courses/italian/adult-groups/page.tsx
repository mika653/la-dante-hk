import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LevelAccordions from "@/app/courses/italian/adult-groups/LevelAccordions";
import EnquiryForm from "@/components/EnquiryForm";

export default function AdultGroupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文 · 成人班級"
        title="從 ciao 到 cin cin。"
        subtitle="對應 CEFR 等級的小組課程,由認證意大利母語導師任教,於灣仔設小班及網上授課。自 1934 年起的旗艦課程。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文", href: "/zh/courses/italian/adult-groups" }, { label: "成人班級" }]}
        tone="sole-soft"
      />

      {/* Course options + placement test / syllabus CTAs */}
      <section className="bg-white py-14 md:py-20 border-b border-line">
        <div className="container-xl">
          <p className="eyebrow">成人班級</p>
        </div>
        <div className="container-xl mt-8 grid md:grid-cols-[1fr_360px] gap-10 md:gap-14">
          <div>
            <p className="eyebrow">課程選擇</p>
            <ul className="mt-4 space-y-4 text-[15px] leading-relaxed">
              <li>
                <span className="font-medium text-ink">常規課程：</span>每星期授課一堂，每堂 2 小時，共 15 星期（30 小時）
                <span className="block text-[13px] text-ink-muted mt-0.5">Regular course: 2 hours class once a week for 15 weeks (30h)</span>
              </li>
              <li>
                <span className="font-medium text-ink">星期六課程：</span>每星期六授課一堂，每堂 3 小時，共 10 星期（30 小時）
                <span className="block text-[13px] text-ink-muted mt-0.5">Saturday course: 3 hours class once a week for 10 weeks, or 2 hours class once a week for 15 weeks (30h)</span>
              </li>
              <li>
                <span className="font-medium text-ink">速成課程：</span>每星期授課兩堂，每堂 2 小時，共 15 節課（30 小時）
                <span className="block text-[13px] text-ink-muted mt-0.5">Intensive course: 2 hours, twice a week for 15 lessons (30h)</span>
              </li>
            </ul>
            <p className="mt-6 text-[15px] leading-relaxed">
              <span className="font-medium text-ink">上課方式：</span>以實體授課為主,可按需要提供混合模式。部分課程或會全程網上進行。立即查看下方即將開班的課程！📚
            </p>
          </div>

          <div className="space-y-5">
            <div className="frame p-6 bg-cream-2">
              <p className="font-semibold text-ink">已有意大利文基礎？</p>
              <p className="text-[14px] text-ink-muted mt-1">試做我們的分級測試。</p>
              <Link href="/zh/placement-test" className="btn btn-primary mt-4 text-sm h-11">分級測試</Link>
            </div>
            <div className="frame p-6 bg-cream-2">
              <p className="text-[14px] text-ink-muted leading-relaxed">
                小組課程於星期一至星期六上課,涵蓋 A1 至 C2 級別。我們提供實體、網上及混合模式課程。歡迎查看課程大綱。
              </p>
              <Link href="#A1" className="btn btn-yellow mt-4 text-sm h-11">課程大綱</Link>
            </div>
          </div>
        </div>
      </section>

      <LevelAccordions />

      {/* Placement test band */}
      <section className="bg-sole py-14 md:py-16">
        <div className="container-xl grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <p className="eyebrow">不確定自己的程度？</p>
            <h2 className="mt-2 text-3xl md:text-4xl max-w-xl">立即參加我們的免費分級測試。只需五分鐘,對應 CEFR 等級。</h2>
          </div>
          <Link href="/zh/placement-test" className="btn btn-primary">開始測試 <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Enrol / can't-find-a-class → capture the request */}
      <section id="enquire" className="bg-cream py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="course" />
        </div>
      </section>
    </>
  );
}
