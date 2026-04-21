import PageHeader from "@/components/PageHeader";

export default function Terms() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & conditions." crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <section className="bg-cream py-14"><div className="container-xl max-w-3xl prose"><p className="text-ink-muted">Demo placeholder. Your real terms will live here.</p></div></section>
    </>
  );
}
