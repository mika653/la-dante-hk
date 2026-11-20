import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import SpecialOffersList from "./SpecialOffersList";

export const metadata = { title: "Special offers — La Dante HK" };

// The offers themselves are editable in Admin → Content → Special offers
// (stored in site_config); SpecialOffersList reads them live, falling back to
// the built-in defaults.
export default function SpecialOffersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Special offers"
        title="Offerte speciali."
        subtitle="Current discounts on courses, memberships and cultural activities at the Dante Alighieri Society of Hong Kong."
        crumbs={[{ label: "Home", href: "/" }, { label: "Special offers" }]}
      />

      <SpecialOffersList />

      <section id="enquire" className="bg-paper py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="general" />
        </div>
      </section>
    </>
  );
}
