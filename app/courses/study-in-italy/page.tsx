import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function StudyInItaly() {
  return (
    <>
      <PageHeader
        eyebrow="Abroad"
        title="Study in Italy."
        subtitle="Summer schools, university prep, and student-visa guidance. We partner with institutions in Rome, Milan, Florence, and Perugia."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Study in Italy" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center frame p-10 bg-white max-w-2xl mx-auto">
          <p className="eyebrow">Coming soon</p>
          <h2 className="mt-3 text-2xl">Programme details publish in May.</h2>
          <p className="mt-3 text-ink-muted">Register your interest and we&apos;ll tell you first.</p>
          <div className="mt-6"><Link href="/contact" className="btn btn-primary">I&apos;m interested</Link></div>
        </div>
      </section>
    </>
  );
}
