import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = { title: "Book a trial class — La Dante HK" };

export default function BookTrialPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free · No commitment"
        title="Book a trial class."
        subtitle="Not sure where to start? Come and try a lesson. Leave your details and the office will arrange a time that suits you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Book a trial" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="trial" />
        </div>
      </section>
    </>
  );
}
