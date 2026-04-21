import PageHeader from "@/components/PageHeader";

export default function BadWeather() {
  return (
    <>
      <PageHeader
        eyebrow="Typhoon & severe weather"
        title="When Hong Kong's sky turns."
        subtitle="What happens to your class when the Observatory raises a T8 or a black rainstorm signal."
        crumbs={[{ label: "Home", href: "/" }, { label: "Typhoon policy" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl max-w-3xl">
          <div className="frame p-8 bg-white space-y-4">
            <p><strong>T3 or Amber rain:</strong> classes run as scheduled.</p>
            <p><strong>T8 or Red rain:</strong> all in-person classes are cancelled or moved online. You&apos;ll receive an email + WhatsApp by 07:00 the morning of the class (or 2 hours before evening classes).</p>
            <p><strong>Black rain / T9 / T10:</strong> classes cancelled. Make-up lesson arranged in the following week.</p>
            <p>For PLIDA exam days, the Italian Consulate&apos;s policy applies — we&apos;ll email all candidates directly.</p>
          </div>
        </div>
      </section>
    </>
  );
}
