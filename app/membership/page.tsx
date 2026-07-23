import PageHeader from "@/components/PageHeader";
import MembershipClient from "./MembershipClient";
import PerksDirectory, { type Perk } from "./PerksDirectory";
import { memberPerks } from "@/lib/data";
import { listActivePrivileges } from "@/lib/privilege-actions";

export const metadata = { title: "Membership — La Dante HK" };

// Fallback so the section is never empty before staff add real partners in admin.
function seedPerks(): Perk[] {
  return memberPerks.flatMap((g) =>
    g.items.map((i) => ({ id: `${g.category}-${i.name}`, brand: i.name, category: g.category, discount: i.perk }))
  );
}

export default async function MembershipPage() {
  const rows = await listActivePrivileges();
  const perks: Perk[] = rows.length
    ? rows.map((r) => ({
        id: r.id,
        brand: r.brand,
        category: r.category,
        discount: r.discount,
        note: r.note,
        logo: r.logo,
        address: r.address,
        phone: r.phone,
        website: r.website,
        socials: r.socials,
      }))
    : seedPerks();

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

          <PerksDirectory perks={perks} />
        </div>
      </section>
    </>
  );
}
