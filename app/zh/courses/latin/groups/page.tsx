import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function LatinGroupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="拉丁文 · 小組課程"
        title="Ad astra per aspera."
        subtitle="古典拉丁文,由初階詞形變化到閱讀 Cicero 原著。由古典學者任教,適合成人、學生,以及永遠充滿好奇心的你。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "拉丁文", href: "/zh/courses/latin" }, { label: "小組課程" }]}
        tone="sole-soft"
      />
      <section className="bg-white py-10 border-b border-line">
        <div className="container-xl">
          <p className="text-[15px] font-medium">請參閱下方即將開辦的課程! 📜</p>
        </div>
      </section>
      <section className="bg-cream py-14">
        <div className="container-xl">
          <p className="eyebrow">小組課堂</p>
          <p className="mt-1 text-[13px] text-ink-muted">2026 課程列表</p>
          <div className="mt-6">
            <CourseListClient language="latin" />
          </div>
        </div>
      </section>
    </>
  );
}
