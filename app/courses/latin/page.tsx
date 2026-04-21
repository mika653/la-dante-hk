import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function LatinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Latin"
        title="Ad astra per aspera."
        subtitle="Classical Latin from beginner declensions to reading Cicero in the original. Taught by classicists for adults, students, and the eternally curious."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl">
          <CourseListClient language="latin" />
        </div>
      </section>
    </>
  );
}
