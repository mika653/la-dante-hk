import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export default function TeacherTraining() {
  return (
    <>
      <PageHeader
        eyebrow="Professional"
        title="Teacher training."
        subtitle="CEDILS and DITALS certification support for aspiring teachers of Italian as a foreign language."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Teacher Training" }]}
      />

      <section id="enquire" className="bg-cream py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <p className="eyebrow">Register your interest · 報名查詢</p>
          <h2 className="mt-2 text-2xl md:text-3xl text-balance">Be first in line when the next training&nbsp;round opens.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            Full course details, topics and dates are coming soon. Leave your details below and the office will be in touch as soon as the CEDILS and DITALS programmes are confirmed.
          </p>
          <div className="mt-8">
            <EnquiryForm type="training" />
          </div>
        </div>
      </section>
    </>
  );
}
