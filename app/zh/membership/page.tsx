import PageHeader from "@/components/PageHeader";
import MembershipClient from "../../membership/MembershipClient";
import PerksDirectory, { type Perk } from "../../membership/PerksDirectory";
import { memberPerks } from "@/lib/data";
import { listActivePrivileges } from "@/lib/privilege-actions";

export const metadata = { title: "會員 — La Dante HK" };

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
        eyebrow="Dante 會員"
        title="一年意大利,就在香港。"
        subtitle="課程折扣、圖書館使用權、遍佈全港 50+ 項精選會員優惠,以及我們所有文化活動的邀請。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "會員" }]}
        tone="azzurro"
      />
      <MembershipClient />

      {/* Perks */}
      <section id="perks" className="bg-white py-16 md:py-24 border-t border-line">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="eyebrow">會員優惠</p>
            <h2 className="mt-3 text-3xl md:text-5xl">50+ 個加入的理由。</h2>
          </div>

          <PerksDirectory perks={perks} />
        </div>
      </section>
    </>
  );
}
