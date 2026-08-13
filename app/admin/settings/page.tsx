import Link from "next/link";
import { Palette, Mail, CalendarDays, ArrowRight } from "lucide-react";

const cards = [
  { href: "/admin/settings/branding", icon: Palette, title: "Branding", desc: "Logo, favicon, site title & tagline." },
  { href: "/admin/settings/email", icon: Mail, title: "Email (SMTP)", desc: "Outgoing email settings. Owner only." },
  { href: "/admin/holidays", icon: CalendarDays, title: "Public holidays", desc: "Closure dates the course scheduler skips." },
];

export default function AdminSettings() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Admin · Settings</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Settings.</h1>
      <p className="mt-3 text-ink-muted">Manage your branding, email, and scheduling — no code required.</p>

      <div className="mt-8 grid gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} className="frame p-5 md:p-6 bg-white flex items-center gap-4 hover:border-ink-muted transition-colors">
              <span className="w-11 h-11 rounded-xl bg-azzurro/15 text-azzurro-deep inline-flex items-center justify-center shrink-0"><Icon size={20} /></span>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-ink-muted">{c.desc}</p>
              </div>
              <ArrowRight size={18} className="text-ink-muted shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
