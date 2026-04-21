import PageHeader from "@/components/PageHeader";
import CourseListView from "@/components/CourseListView";
import { courses } from "@/lib/data";

export default function OnlinePage() {
  const list = courses.filter((c) => c.location === "Online");
  return (
    <>
      <PageHeader
        eyebrow="Italian · Online"
        title="Italian, wherever you are."
        subtitle="Live small-group classes on Zoom. HK-timezone slots. Same CEFR curriculum, same certified teachers."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Online" }]}
        tone="cream"
      />
      <section className="bg-cream py-14">
        <div className="container-xl">
          <CourseListView courses={list} emptyMessage="No online classes this term — next intake: September 2026." />
        </div>
      </section>
    </>
  );
}
