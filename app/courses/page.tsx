import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const paths = [
  { href: "/courses/italian/adult-groups", tag: "Italian · Adults",  title: "Group Courses",  blurb: "Our flagship — CEFR A1 through C1, small classes in Wanchai and online.", tone: "blue" },
  { href: "/courses/italian/private",      tag: "Italian · 1-to-1",  title: "Private Lessons",blurb: "Fully flexible, bespoke curriculum. Any level, any schedule.",       tone: "cream" },
  { href: "/courses/italian/kids",         tag: "Italian · 7–15",    title: "Kids & Teens",   blurb: "Piccoli Dante and Ragazzi Dante — fun, story-driven, Saturday-friendly.", tone: "yellow" },
  { href: "/courses/italian/corporate",    tag: "Italian · Teams",   title: "Corporate",       blurb: "On-site team packages with cultural briefing included.",             tone: "white"  },
  { href: "/courses/italian/online",       tag: "Italian · Online",  title: "Online",          blurb: "Live small-group classes over Zoom with HK-timezone slots.",         tone: "blue" },
  { href: "/courses/latin",                tag: "Latin",             title: "Latin",           blurb: "Classical Latin, from beginner declensions to reading Cicero.",       tone: "yellow" },
  { href: "/courses/study-in-italy",       tag: "Abroad",            title: "Study in Italy",  blurb: "Summer schools, university prep, and student-visa guidance.",        tone: "cream" },
  { href: "/courses/teacher-training",     tag: "Professional",      title: "Teacher Training",blurb: "CEDILS and DITALS training for aspiring Italian teachers.",          tone: "white"  },
  { href: "/placement-test",               tag: "Free · 5 min",      title: "Placement Test",  blurb: "Find your level in 30 adaptive questions.",                          tone: "blue"   },
];

const toneClass: Record<string, string> = {
  blue:  "bg-ink text-cream",
  yellow:"bg-sole-soft text-ink",
  cream: "bg-cream-2 text-ink border border-line",
  white: "bg-white text-ink border border-line",
};

export default function CoursesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="All courses"
        title="Pick your path."
        subtitle="Nine ways into Italian (and Latin). All our group courses are CEFR-aligned and taught by certified native teachers."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}
      />
      <section className="bg-cream py-16 md:py-20">
        <div className="container-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p) => (
            <Link key={p.href} href={p.href} className={`group frame p-8 min-h-[220px] flex flex-col justify-between ${toneClass[p.tone]}`}>
              <div>
                <p className={`eyebrow ${p.tone === "blue" ? "!text-sole" : ""}`}>{p.tag}</p>
                <h3 className="mt-3 text-2xl font-semibold">{p.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${p.tone === "blue" ? "text-cream/85" : "text-ink-muted"}`}>{p.blurb}</p>
              </div>
              <span className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${p.tone === "blue" ? "text-sole" : "text-azzurro-deep"}`}>
                Explore <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
