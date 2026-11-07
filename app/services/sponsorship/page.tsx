import PageHeader from "@/components/PageHeader";
import SponsorshipSection from "@/app/membership/SponsorshipSection";

export const metadata = { title: "Sponsorship — La Dante HK" };

export default function Sponsorship() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Become a sponsor."
        subtitle="Align your brand with 90 years of Italian culture in Hong Kong — Silver, Gold, and Diamond tiers, plus classroom sponsorship."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Sponsorship" }]}
        tone="azzurro"
      />
      <SponsorshipSection />
    </>
  );
}
