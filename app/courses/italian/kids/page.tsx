import PageHeader from "@/components/PageHeader";
import CourseListView from "@/components/CourseListView";
import { courses } from "@/lib/data";

export default function KidsPage() {
  const list = courses.filter((c) => c.type === "kids");
  return (
    <>
      <PageHeader
        eyebrow="Italian · Kids & Teens"
        title="Piccoli & Ragazzi Dante."
        subtitle="Italian through songs, stories, cooking, and play. Small groups, certified kid-specialist teachers, Saturday-friendly schedules at our Wanchai centre."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Kids & Teens" }]}
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
