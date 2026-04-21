import PageHeader from "@/components/PageHeader";

export default function Merch() {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Merch & books."
        subtitle="Textbooks, tote bags, and the occasional Dante-themed coffee mug."
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center frame p-10 bg-white max-w-xl mx-auto">
          <p className="eyebrow">Coming soon</p>
          <h2 className="mt-2 text-2xl">The Dante shop opens later this year.</h2>
        </div>
      </section>
    </>
  );
}
