import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";

export default function OnlinePage() {
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
          <CourseListClient location="Online" emptyMessage="No online classes this term — next intake: September 2026." />
        </div>
      </section>
    </>
  );
}
