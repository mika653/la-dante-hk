import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import WorkshopsList from "./WorkshopsList";

export const metadata = { title: "Workshops & special courses — La Dante HK" };

export default function WorkshopsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Beyond the classroom"
        title="Workshops & special courses."
        subtitle="Cooking, cinema, wine, opera, conversation — short cultural courses that bring Italian to life. Some are planned; others we open once enough of you want them."
        crumbs={[{ label: "Home", href: "/" }, { label: "Workshops" }]}
        tone="sole-soft"
      />

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          <WorkshopsList />
        </div>
      </section>

      <section id="enquire" className="bg-white py-14 md:py-20 border-t border-line scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="workshop" />
        </div>
      </section>
    </>
  );
}
