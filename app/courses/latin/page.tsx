import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function LatinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Latin"
        title="Ad astra per aspera."
        subtitle="Classical Latin from beginner declensions to reading Cicero in the original. Taught by classicists for adults, students, and the eternally curious."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin" }]}
        tone="sole-soft"
      />
      <section className="bg-white py-10 border-b border-line">
        <div className="container-xl">
          <p className="text-[15px] font-medium">Check our upcoming courses below! 📜</p>
        </div>
      </section>
      <section className="bg-cream py-14">
        <div className="container-xl">
          <p className="eyebrow">Group Classes · 小組課堂</p>
          <p className="mt-1 text-[13px] text-ink-soft">2026 課程列表</p>
          <div className="mt-6">
            <CourseListClient language="latin" />
          </div>
        </div>
      </section>
    </>
  );
}
