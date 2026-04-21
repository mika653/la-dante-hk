import PageHeader from "@/components/PageHeader";

export default function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy." crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <section className="bg-cream py-14"><div className="container-xl max-w-3xl prose"><p className="text-ink-muted">Demo placeholder. Your real privacy policy will live here.</p></div></section>
    </>
  );
}
