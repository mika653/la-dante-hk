import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function LatinKids() {
  return (
    <>
      <PageHeader
        eyebrow="Latin · Kids & Teens"
        title="Latin for young minds."
        subtitle="A gentle, story-driven introduction to Latin for ages 10–16. Perfect for IB and A-Level preparation."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin", href: "/courses/latin" }, { label: "Kids & Teens" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center">
          <Link href="/contact" className="btn btn-primary">Express interest</Link>
        </div>
      </section>
    </>
  );
}
