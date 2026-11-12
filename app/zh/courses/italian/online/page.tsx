import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function OnlinePage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文 · 網上課程"
        title="隨時隨地學意大利文。"
        subtitle="透過 Zoom 進行的小組直播課堂,設香港時區時段,課程內容與認證導師均與面授班相同。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文" }, { label: "網上課程" }]}
        tone="cream"
      />
      <section className="bg-cream py-14">
        <div className="container-xl">
          <CourseListClient location="Online" emptyMessage="本學期暫無網上課堂 — 下一期招生:2026 年 9 月。" />
        </div>
      </section>
    </>
  );
}
