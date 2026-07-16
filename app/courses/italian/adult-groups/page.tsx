import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LevelAccordions from "./LevelAccordions";
import EnquiryForm from "@/components/EnquiryForm";

export default function AdultGroupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Adult Groups"
        title="From 'ciao' to 'cin cin'."
        subtitle="CEFR-aligned group courses, certified native teachers, small classes in Wanchai and online. Our flagship programme since 1935."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian", href: "/courses/italian/adult-groups" }, { label: "Adult Groups" }]}
        tone="sole-soft"
      />

      <LevelAccordions />

      {/* Placement test band */}
      <section className="bg-sole py-14 md:py-16">
        <div className="container-xl grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <p className="eyebrow">Not sure which level?</p>
            <h2 className="mt-2 text-3xl md:text-4xl max-w-xl">Take our free placement test. Five minutes, CEFR-aligned.</h2>
          </div>
          <Link href="/placement-test" className="btn btn-primary">Start the test <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Can't find a matching class → capture the request */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="course" />
        </div>
      </section>
    </>
  );
}
