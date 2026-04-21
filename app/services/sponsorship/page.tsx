import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function Sponsorship() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Become a sponsor."
        subtitle="Align your brand with 90 years of Italian culture in Hong Kong. Classroom, silver, and gold sponsorship tiers available."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Sponsorship" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/contact" className="btn btn-primary">Become a sponsor</Link></div>
      </section>
    </>
  );
}
