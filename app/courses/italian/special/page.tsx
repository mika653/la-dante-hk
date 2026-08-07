import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";
import EnquiryForm from "@/components/EnquiryForm";

export default function SpecialCoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Special Courses"
        title="Pick a topic. Power it up."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Special Courses" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16 border-b border-line">
        <div className="container-xl max-w-3xl space-y-3 text-[15px] leading-relaxed">
          <p>Discover our special courses to power up your passion for Italy and its language!</p>
          <p>We periodically launch short-term courses focusing on specific topics and tailored according to your current Italian level (A1, A2/B1, B2). Such courses have a precise goal: conversation boost, grammar revision, PLIDA exam preparation, creative writing, and much more…</p>
          <p className="font-medium text-ink">Check our upcoming Special courses below! 📒</p>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-xl">
          <CourseListClient type="special" emptyMessage="No special courses scheduled this term — please check back soon." />
        </div>
      </section>

      {/* Special courses from the past — slideshow pending real photos (pronunciation
          training, lunch-break courses, conversation courses, etc.) */}
      <section className="bg-white py-14 md:py-16 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">Special courses from the past · 往期特色課程</p>
          <div className="mt-6 frame p-8 bg-cream-2 text-center text-[14px] text-ink-muted">
            Photos coming soon.
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <div className="mb-6 space-y-1.5 text-[15px] leading-relaxed">
            <p>Do you have any specific interest? Share your ideas and suggestions in the form below or contact us at <a href="mailto:dantealighieri@ladante.cc" className="text-azzurro-deep underline">dantealighieri@ladante.cc</a>.</p>
            <p className="text-[13px] text-ink-muted">有任何想法或感興趣的活動？歡迎填寫以下表格，或電郵 dantealighieri@ladante.cc 向我們提供意見！</p>
          </div>
          <EnquiryForm type="special" />
        </div>
      </section>
    </>
  );
}
