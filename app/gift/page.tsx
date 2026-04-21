import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function Gift() {
  return (
    <>
      <PageHeader
        eyebrow="Gift"
        title="A year of Italy."
        subtitle="Gift membership, gift a course, or let them pick. Beautifully presented digital certificate, sent instantly."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gift" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/membership" className="btn btn-primary">Choose a gift plan</Link></div>
      </section>
    </>
  );
}
