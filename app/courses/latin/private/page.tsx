import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function LatinPrivate() {
  return (
    <>
      <PageHeader
        eyebrow="Latin · Private"
        title="Private Latin tuition."
        subtitle="One-on-one Latin lessons — A-Level prep, classical philology, or reading-for-pleasure. Let us know your goal and we&apos;ll match you with the right classicist."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin", href: "/courses/latin" }, { label: "Private" }]}
        tone="cream"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center">
          <Link href="/contact" className="btn btn-primary">Request a Latin tutor</Link>
        </div>
      </section>
    </>
  );
}
