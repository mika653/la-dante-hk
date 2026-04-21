import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function KidsPage() {
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
          <CourseListClient type="kids" />
        </div>
      </section>
    </>
  );
}
