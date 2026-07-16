import PageHeader from "@/components/PageHeader";
import CourseListClient from "@/components/CourseListClient";
import EnquiryForm from "@/components/EnquiryForm";
import { Clock, CheckCircle, Calendar } from "lucide-react";

export default function PrivatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Private"
        title="One student. One teacher. One goal."
        subtitle="Fully bespoke Italian lessons — pace, content, and schedule built around you. Available in-person in Wanchai or online, any level, any focus."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Private" }]}
        tone="cream"
      />
      <section className="bg-white py-14">
        <div className="container-xl grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Clock, title: "10-hour package", body: "The sweet spot for most learners — measurable progress in a month." },
            { icon: Calendar, title: "Flexible schedule", body: "Reschedule up to 24h in advance, no questions asked." },
            { icon: CheckCircle, title: "Any level, any goal", body: "Business meetings, opera librettos, travel, or PLIDA prep — you decide." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="frame p-8 bg-cream-2/50">
              <Icon size={22} className="text-azzurro-deep mx-auto" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-cream py-14">
        <div className="container-xl">
          <h2 className="text-2xl md:text-3xl mb-6">Private packages available now</h2>
          <CourseListClient type="private" />
        </div>
      </section>
      <section className="bg-white py-14 md:py-20 border-t border-line">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="private" />
        </div>
      </section>
    </>
  );
}
