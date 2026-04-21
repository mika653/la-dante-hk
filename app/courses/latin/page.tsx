import PageHeader from "@/components/PageHeader";
import CourseListView from "@/components/CourseListView";
import { courses } from "@/lib/data";

export default function LatinPage() {
  const list = courses.filter((c) => c.language === "latin");
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
          <CourseListView courses={list} />
        </div>
      </section>
    </>
  );
}
