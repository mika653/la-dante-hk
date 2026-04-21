import PageHeader from "@/components/PageHeader";
import MembershipClient from "./MembershipClient";
import { memberPerks } from "@/lib/data";

export const metadata = { title: "Membership — La Dante HK" };

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dante membership"
        title="A year of Italy, in Hong Kong."
        subtitle="Course discounts, library access, 50+ curated member perks across HK, and invitations to everything cultural we host."
        crumbs={[{ label: "Home", href: "/" }, { label: "Membership" }]}
        tone="azzurro"
      />
      <MembershipClient />

      {/* Perks */}
      <section id="perks" className="bg-white py-16 md:py-24 border-t border-line">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="eyebrow">Member perks</p>
            <h2 className="mt-3 text-3xl md:text-5xl">50+ reasons to belong.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {memberPerks.map((group) => (
              <div key={group.category} className="frame p-8 bg-cream-2/50">
                <h3 className="text-xl font-heading font-bold uppercase tracking-wider text-azzurro-deep">{group.category}</h3>
                <ul className="mt-5 divide-y divide-line">
                  {group.items.map((i) => (
                    <li key={i.name} className="py-3 flex items-start justify-between gap-4">
                      <span className="font-medium">{i.name}</span>
                      <span className="text-sm text-ink-muted text-right">{i.perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
