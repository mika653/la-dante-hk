import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";
import EnquiryForm from "@/components/EnquiryForm";

export default function SpecialCoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文 · 特色課程"
        title="選一個主題,全力精進。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文" }, { label: "特色課程" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16 border-b border-line">
        <div className="container-xl max-w-3xl space-y-3 text-[15px] leading-relaxed">
          <p>探索我們的特色課程,為你對意大利及意大利文的熱情注入全新動力！</p>
          <p>我們會定期開辦短期課程,聚焦於特定主題,並根據你目前的意大利文程度(A1、A2/B1、B2)度身設計。這些課程各有明確目標:強化會話、文法複習、PLIDA 考試準備、創意寫作等等……</p>
          <p className="font-medium text-ink">立即查看下方即將開辦的特色課程！📒</p>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-xl">
          <CourseListClient type="special" emptyMessage="本學期暫未安排特色課程 — 請稍後再回來查看。" />
        </div>
      </section>

      {/* Special courses from the past — slideshow pending real photos (pronunciation
          training, lunch-break courses, conversation courses, etc.) */}
      <section className="bg-white py-14 md:py-16 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">往期特色課程</p>
          <div className="mt-6 frame p-8 bg-cream-2 text-center text-[14px] text-ink-muted">
            相片即將上載。
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <div className="mb-6 space-y-1.5 text-[15px] leading-relaxed">
            <p>有任何想法或感興趣的活動？歡迎填寫以下表格,或電郵至 <a href="mailto:dantealighieri@ladante.cc" className="text-azzurro-deep underline">dantealighieri@ladante.cc</a> 向我們提供意見！</p>
          </div>
          <EnquiryForm type="special" />
        </div>
      </section>
    </>
  );
}
