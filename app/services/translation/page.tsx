import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function Translation() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Translation & interpreting."
        subtitle="Certified Italian ↔ English ↔ Chinese translation for legal, commercial, and cultural documents. Consecutive and simultaneous interpreting for events and meetings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Translation & Interpreting" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/contact" className="btn btn-primary">Get a quote</Link></div>
      </section>
    </>
  );
}
