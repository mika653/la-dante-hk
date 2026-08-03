import PageHeader from "@/components/PageHeader";

export default function KidsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Kids & Teens"
        title="Piccoli & Ragazzi Dante."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Kids & Teens" }]}
        tone="sole-soft"
      />
      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <p>We offer immersive, fun-filled classes designed to make learning Italian a delightful adventure for kids of different ages.</p>
          <p>Our Playgroup course for ages 3–6 combines play and learning, while our exciting Children group for kids 7–10 takes language skills to the next level. Both courses immerse kids in the wonders of Italy and its language through songs, music, stories, crafts, interactive activities, and games 🎊.</p>
          <p>The course focuses on fun and structured ways to build a strong foundation in speaking, reading, writing, and listening.</p>
        </div>
      </section>
    </>
  );
}
