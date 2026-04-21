"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import Wordmark from "./Wordmark";

const navGroups = [
  {
    label: "Courses",
    href: "/courses",
    columns: [
      { title: "Italian", items: [
        { label: "Adult Groups",   href: "/courses/italian/adult-groups" },
        { label: "Kids & Teens",   href: "/courses/italian/kids" },
        { label: "Private",        href: "/courses/italian/private" },
        { label: "Corporate",      href: "/courses/italian/corporate" },
        { label: "Online",         href: "/courses/italian/online" },
      ]},
      { title: "Latin", items: [
        { label: "Group",          href: "/courses/latin" },
        { label: "Private",        href: "/courses/latin/private" },
        { label: "Kids & Teens",   href: "/courses/latin/kids" },
      ]},
      { title: "Special", items: [
        { label: "Placement test", href: "/placement-test" },
        { label: "Study in Italy", href: "/courses/study-in-italy" },
        { label: "Teacher training", href: "/courses/teacher-training" },
      ]},
    ],
  },
  {
    label: "Culture",
    href: "/culture",
    columns: [
      { title: "Programs", items: [
        { label: "Events",   href: "/culture" },
        { label: "Workshops",href: "/culture#workshops" },
        { label: "Library", href: "/culture#library" },
      ]},
    ],
  },
  {
    label: "PLIDA",
    href: "/plida",
    columns: [
      { title: "Certification", items: [
        { label: "Sessions & applications", href: "/plida" },
        { label: "PLIDA FAQ",               href: "/plida#faq" },
        { label: "Prepare for PLIDA",       href: "/plida#prepare" },
      ]},
    ],
  },
  { label: "Membership", href: "/membership" },
  {
    label: "More",
    href: "/about",
    columns: [
      { title: "About", items: [
        { label: "Our history",   href: "/about" },
        { label: "Dante 90 Years",href: "/about#90-years" },
        { label: "Team & Board",  href: "/about#team" },
        { label: "Contact",       href: "/contact" },
      ]},
      { title: "Services", items: [
        { label: "Translation & Interpreting", href: "/services/translation" },
        { label: "Sponsorship",                href: "/services/sponsorship" },
        { label: "Gift card",                  href: "/gift" },
        { label: "Merch & books",              href: "/merch" },
      ]},
    ],
  },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? "bg-cream/85 backdrop-blur-md shadow-[0_1px_0_rgb(0_0_0_/_0.04)]" : "bg-cream"}`}>
      <div className="container-xl flex items-center justify-between h-16 md:h-20 gap-6">
        <Wordmark />

        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenGroup(null)}>
          {navGroups.map((g) => (
            <div key={g.label} className="relative" onMouseEnter={() => g.columns && setOpenGroup(g.label)}>
              <Link
                href={g.href}
                className="inline-flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-ink hover:text-azzurro rounded-full"
              >
                {g.label}
                {g.columns && <ChevronDown size={14} className="opacity-60" aria-hidden />}
              </Link>
              {g.columns && openGroup === g.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 min-w-[560px]">
                  <div className="frame p-6 grid grid-cols-3 gap-6 bg-white">
                    {g.columns.map((col) => (
                      <div key={col.title}>
                        <p className="eyebrow mb-3">{col.title}</p>
                        <ul className="space-y-1.5">
                          {col.items.map((it) => (
                            <li key={it.label}>
                              <Link href={it.href} className="block text-[14px] text-ink-muted hover:text-azzurro py-1" onClick={() => setOpenGroup(null)}>
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/placement-test" className="text-[14px] font-medium text-ink hover:text-azzurro">Placement test</Link>
          <Link href="/courses/italian/adult-groups" className="btn btn-primary text-[14px]">Enrol →</Link>
        </div>

        <button type="button" onClick={() => setMobileOpen((v) => !v)} className="lg:hidden p-2 -mr-2" aria-label="Toggle menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(2rem+4rem)] bottom-0 bg-cream overflow-y-auto border-t border-line">
          <div className="container-xl py-6">
            <ul className="divide-y divide-line">
              {navGroups.map((g) => (
                <li key={g.label} className="py-3">
                  <Link href={g.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between text-lg font-medium">
                    <span>{g.label}</span>
                    <ChevronDown size={18} className="opacity-40" aria-hidden />
                  </Link>
                  {g.columns && (
                    <div className="mt-2 pl-3 space-y-1">
                      {g.columns.flatMap((c) => c.items).map((it) => (
                        <Link key={it.label} href={it.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[15px] text-ink-muted">
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              <Link href="/placement-test" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full">Take placement test</Link>
              <Link href="/courses/italian/adult-groups" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">Enrol →</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
