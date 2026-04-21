import PageHeader from "@/components/PageHeader";
import CourseListView from "@/components/CourseListView";
import { courses } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe2, Award } from "lucide-react";

export default function CorporatePage() {
  const list = courses.filter((c) => c.type === "corporate");
  return (
    <>
      <PageHeader
        eyebrow="Italian · Corporate"
        title="Italian for your team."
        subtitle="On-site or online lessons designed around your company — luxury retail, F&B, finance, shipping, or hospitality. Cultural briefing included."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Corporate" }]}
        tone="azzurro"
      />
      <section className="bg-white py-14">
        <div className="container-xl grid md:grid-cols-4 gap-6">
          {[
            { icon: Briefcase, title: "On-site or online", body: "Your office, our space, or Zoom. Whatever works." },
            { icon: Users,     title: "Up to 10 per group",body: "Small enough for progress, big enough for energy." },
            { icon: Globe2,    title: "Cultural briefing", body: "Business etiquette, gestures, negotiation — the unwritten curriculum." },
            { icon: Award,     title: "PLIDA certificates",body: "Formal recognition for HR and immigration needs." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="frame p-6 bg-cream-2/50">
              <Icon size={22} className="text-azzurro-deep" aria-hidden />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-cream py-14">
        <div className="container-xl">
          <h2 className="text-2xl md:text-3xl mb-6">Sample packages</h2>
          <CourseListView courses={list} />
          <div className="mt-10 text-center">
            <Link href="/contact" className="btn btn-primary">Request a proposal <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
