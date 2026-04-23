"use client";
import { Award, Shield, BookOpen, Users } from "lucide-react";
import { useT } from "@/lib/locale";

const icons = [Award, Shield, BookOpen, Users];

export default function TrustBand() {
  const { t } = useT();
  const items = t.trustBand.map((x, i) => ({ ...x, icon: icons[i] }));
  return (
    <section className="bg-white py-8 md:py-10 border-b border-line">
      <div className="container-xl">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cream-2 text-azzurro-deep inline-flex items-center justify-center shrink-0 border border-line"><Icon size={18} aria-hidden /></span>
              <div>
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="text-xs text-ink-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
