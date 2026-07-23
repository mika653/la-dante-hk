"use client";
import { useMemo, useState } from "react";
import { Globe, Phone, MapPin, Link2 } from "lucide-react";
import { IconFacebook, IconInstagram, IconYoutube, IconLinkedin } from "@/components/SocialIcons";
import type { Social } from "@/lib/db/schema";

export type Perk = {
  id: string;
  brand: string;
  category: string;
  discount: string;
  note?: string | null;
  logo?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  socials?: Social[] | null;
};

// Pick a recognisable icon for a social platform; anything unknown gets a link icon.
function socialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return IconFacebook;
  if (p.includes("instagram")) return IconInstagram;
  if (p.includes("youtube")) return IconYoutube;
  if (p.includes("linkedin")) return IconLinkedin;
  return Link2;
}

export default function PerksDirectory({ perks }: { perks: Perk[] }) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const p of perks) if (p.category && !seen.includes(p.category)) seen.push(p.category);
    return seen;
  }, [perks]);

  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? perks : perks.filter((p) => p.category === active);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["All", ...categories].map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`px-6 py-2.5 rounded-full font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${
                on ? "bg-ink text-cream" : "bg-azzurro text-ink hover:bg-azzurro-deep hover:text-cream"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Partner cards */}
      {shown.length === 0 ? (
        <p className="text-center text-ink-muted">No perks in this category yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {shown.map((p) => (
            <PerkCard key={p.id} perk={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PerkCard({ perk: p }: { perk: Perk }) {
  return (
    <div className="frame bg-white p-6">
      <div className="flex items-center gap-4">
        <Logo url={p.logo} brand={p.brand} />
        <div className="min-w-0">
          <h3 className="text-lg font-heading font-bold leading-tight">{p.brand}</h3>
          <p className="text-sm text-azzurro-deep">{p.category}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-sole-soft/60 border-l-4 border-sole px-4 py-3">
        <p className="text-[15px] text-ink">{p.discount}</p>
        {p.note && <p className="mt-1 text-xs text-ink-muted">{p.note}</p>}
      </div>

      {(p.address || p.phone || p.website || (p.socials && p.socials.length > 0)) && (
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {p.address && (
            <li className="flex gap-2.5"><MapPin size={15} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden /><span>{p.address}</span></li>
          )}
          {p.phone && (
            <li className="flex gap-2.5"><Phone size={15} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden /><a href={`tel:${p.phone.replace(/\s+/g, "")}`} className="hover:text-ink">{p.phone}</a></li>
          )}
          {p.website && (
            <li className="flex gap-2.5"><Globe size={15} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden /><a href={hrefy(p.website)} target="_blank" rel="noopener noreferrer" className="hover:text-ink break-all">{cleanUrl(p.website)}</a></li>
          )}
          {p.socials?.map((s, i) => {
            const Icon = socialIcon(s.platform);
            return (
              <li key={i} className="flex gap-2.5">
                <Icon size={15} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
                <a href={hrefy(s.url)} target="_blank" rel="noopener noreferrer" className="hover:text-ink break-all">{s.platform}</a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Logo({ url, brand }: { url: string | null | undefined; brand: string }) {
  const initials = brand.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="w-12 h-12 rounded-full object-contain bg-white border border-line shrink-0" />;
  }
  return (
    <span className="w-12 h-12 rounded-full bg-azzurro-deep text-cream inline-flex items-center justify-center text-sm font-semibold shrink-0">
      {initials}
    </span>
  );
}

const hrefy = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
const cleanUrl = (u: string) => u.replace(/^https?:\/\//i, "").replace(/\/$/, "");
