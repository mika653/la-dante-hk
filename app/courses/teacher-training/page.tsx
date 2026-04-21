import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function TeacherTraining() {
  return (
    <>
      <PageHeader
        eyebrow="Professional"
        title="Teacher training."
        subtitle="CEDILS and DITALS certification support for aspiring teachers of Italian as a foreign language."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Teacher Training" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/contact" className="btn btn-primary">Enquire about training</Link></div>
      </section>
    </>
  );
}
