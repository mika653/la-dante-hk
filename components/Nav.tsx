"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Wordmark from "./Wordmark";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT, localizePath } from "@/lib/locale";
import { enrolLinkProps } from "@/lib/enroll";

type NavItem = { label: string; href: string };
type NavColumn = { title: string; items: NavItem[] };
type CourseMenuItem = { label: string; href?: string; submenu?: NavItem[] };
type NavGroup = { label: string; href?: string; columns?: NavColumn[]; menu?: CourseMenuItem[] };

const navGroups: NavGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    menu: [
      { label: "Italian", href: "/courses/italian", submenu: [
        { label: "Adult courses",   href: "/courses/italian/adult-groups" },
        { label: "Kids & Teens",     href: "/courses/italian/kids" },
        { label: "Private Lessons", href: "/courses/italian/private" },
        { label: "Corporate courses", href: "/courses/italian/corporate" },
        { label: "Special courses", href: "/courses/italian/special" },
        { label: "Level progression", href: "/courses/italian/level-progression" },
        { label: "Test your level", href: "/placement-test" },
      ]},
      { label: "Latin", href: "/courses/latin", submenu: [
        { label: "Groups",          href: "/courses/latin/groups" },
        { label: "Private Lessons", href: "/courses/latin/private" },
      ]},
      { label: "Special Offers", href: "/special-offers" },
      { label: "Study in Italy", href: "/courses/study-in-italy" },
      { label: "Teachers' training", href: "/courses/teacher-training" },
    ],
  },
  {
    label: "Culture",   // dropdown only — no landing page
    menu: [
      { label: "Events", href: "/culture" },
      { label: "Workshops", href: "/workshops" },
      { label: "Library", submenu: [
        { label: "Borrow a book", href: "/culture/library#borrow" },
        { label: "Il Salotto di Dante Bookclub", href: "/culture/library#bookclub" },
        { label: "Presidio Letterario", href: "/culture/library#presidio" },
      ]},
    ],
  },
  {
    label: "PLIDA",
    href: "/plida",   // lands on Sessions & Application
    menu: [
      { label: "Sessions & Application", href: "/plida" },
      { label: "Prepare for PLIDA", href: "/plida#prepare" },
      { label: "PLIDA FAQ", href: "/plida#faq" },
    ],
  },
  {
    label: "Join Us",
    href: "/membership",   // lands on Membership
    menu: [
      { label: "Membership", href: "/membership" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    label: "Translation",   // dropdown only — no landing page
    menu: [
      { label: "Interpreting & Translations", href: "/services/translation" },
    ],
  },
  {
    label: "About",
    href: "/about",   // lands on History
    menu: [
      { label: "History", href: "/about" },
      { label: "Our Team", href: "/about#team" },
      { label: "Scuola Semplice", href: "/about/scuola-semplice" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// Chinese labels for every nav entry (top-level + submenus). Falls back to the
// English label if a key is missing.
const NAV_ZH: Record<string, string> = {
  Home: "首頁", Courses: "課程", Culture: "文化", PLIDA: "PLIDA", "Join Us": "加入我們",
  Translation: "翻譯服務", About: "關於我們", Contact: "聯絡我們",
  Italian: "意大利文", "Adult courses": "成人課程", "Kids & Teens": "兒童及青少年",
  "Private Lessons": "私人課堂", "Corporate courses": "企業課程", "Special courses": "特別課程",
  "Level progression": "程度進階", "Test your level": "測試你的程度",
  Latin: "拉丁文", Groups: "小組課程", "Special Offers": "特別優惠",
  "Study in Italy": "到意大利升學", "Teachers' training": "師資培訓",
  Events: "活動", Workshops: "工作坊", Library: "圖書館",
  "Borrow a book": "借書", "Il Salotto di Dante Bookclub": "Il Salotto di Dante 讀書會",
  "Presidio Letterario": "Presidio Letterario",
  "Sessions & Application": "考試日期及報名", "Prepare for PLIDA": "PLIDA 備試", "PLIDA FAQ": "PLIDA 常見問題",
  Membership: "會員", Donate: "捐助", "Interpreting & Translations": "傳譯及翻譯",
  History: "歷史", "Our Team": "我們的團隊", "Scuola Semplice": "Scuola Semplice",
};

export default function Nav() {
  const { t, locale } = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const labelFor = (key: string): string => {
    const map: Record<string, string> = {
      Home: t.nav.home, Courses: t.nav.courses, Culture: t.nav.culture, PLIDA: t.nav.plida,
      "Join Us": t.nav.joinUs, Translation: t.nav.translation, About: t.nav.about, Contact: t.nav.contact,
    };
    return map[key] ?? key;
  };
  // Localize any nav label (submenus included) and link.
  const navLabel = (label: string) => (locale === "zh" ? (NAV_ZH[label] ?? label) : label);
  const navHref = (href: string) => localizePath(href, locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? "bg-cream/70 border-ink/10 shadow-[0_4px_24px_-8px_rgb(0_0_0_/_0.08)]"
          : "bg-cream/50 border-ink/5"
      }`}
      style={{ backdropFilter: "saturate(180%) blur(18px)", WebkitBackdropFilter: "saturate(180%) blur(18px)" }}
    >
      <div className="container-xl flex items-center justify-between h-16 md:h-20 gap-6">
        <Wordmark size={44} />

        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => { setOpenGroup(null); setOpenSub(null); }}>
          {navGroups.map((g) => (
            <div key={g.label} className="relative" onMouseEnter={() => (g.columns || g.menu) && setOpenGroup(g.label)}>
              {g.href ? (
                <Link
                  href={localizePath(g.href, locale)}
                  className={g.label === "Contact" ? "btn btn-primary text-[14px] ml-1" : "inline-flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-ink hover:text-azzurro-deep rounded-full"}
                >
                  {labelFor(g.label)}
                  {(g.columns || g.menu) && <ChevronDown size={14} className="opacity-60" aria-hidden />}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-ink rounded-full cursor-default">
                  {labelFor(g.label)}
                  {(g.columns || g.menu) && <ChevronDown size={14} className="opacity-60" aria-hidden />}
                </span>
              )}
              {g.columns && openGroup === g.label && (
                <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 ${
                  g.columns.length >= 3 ? "min-w-[560px]" : g.columns.length === 2 ? "min-w-[420px]" : "min-w-[240px]"
                }`}>
                  <div className={`frame p-6 grid gap-6 bg-white ${
                    g.columns.length >= 3 ? "grid-cols-3" : g.columns.length === 2 ? "grid-cols-2" : "grid-cols-1"
                  }`}>
                    {g.columns.map((col) => (
                      <div key={col.title}>
                        <p className="eyebrow mb-3">{col.title}</p>
                        <ul className="space-y-1.5">
                          {col.items.map((it) => (
                            <li key={it.label}>
                              <Link href={it.href} className="block text-[14px] text-ink-muted hover:text-azzurro-deep py-1" onClick={() => setOpenGroup(null)}>
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
              {g.menu && openGroup === g.label && (
                <div className="absolute left-0 top-full pt-2 min-w-[220px]">
                  <div className="rounded-frame border border-ink/6 shadow-(--shadow-frame) bg-white p-2">
                    <ul className="space-y-0.5">
                      {g.menu.map((mi) => (
                        <li
                          key={mi.label}
                          className="relative"
                          onMouseEnter={() => mi.submenu && setOpenSub(mi.label)}
                        >
                          {mi.href ? (
                            <Link
                              href={navHref(mi.href)}
                              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[14px] hover:bg-cream ${mi.submenu ? "font-medium text-ink" : "text-ink-muted hover:text-azzurro-deep"}`}
                              onClick={() => { setOpenGroup(null); setOpenSub(null); }}
                            >
                              {navLabel(mi.label)}
                              {mi.submenu && <ChevronRight size={14} className="opacity-50" aria-hidden />}
                            </Link>
                          ) : (
                            <span className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[14px] font-medium text-ink cursor-default hover:bg-cream">
                              {navLabel(mi.label)}
                              {mi.submenu && <ChevronRight size={14} className="opacity-50" aria-hidden />}
                            </span>
                          )}
                          {mi.submenu && openSub === mi.label && (
                            <div className="absolute left-full top-0 pl-2">
                              <div className="frame p-2 bg-white min-w-[200px]">
                                <ul className="space-y-0.5">
                                  {mi.submenu.map((s) => (
                                    <li key={s.label}>
                                      <Link
                                        href={navHref(s.href)}
                                        className="block px-3 py-2 rounded-lg text-[14px] text-ink-muted hover:text-azzurro-deep hover:bg-cream"
                                        onClick={() => { setOpenGroup(null); setOpenSub(null); }}
                                      >
                                        {navLabel(s.label)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Link href={localizePath("/placement-test", locale)} className="hidden text-[14px] font-medium text-ink hover:text-azzurro-deep">{t.nav.placementTest}</Link>
          <a {...enrolLinkProps} className="hidden! btn btn-primary text-[14px]">{t.nav.enrol}</a>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button type="button" onClick={() => setMobileOpen((v) => !v)} className="p-2 -mr-2" aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(2rem+4rem)] bottom-0 bg-cream overflow-y-auto border-t border-line">
          <div className="container-xl py-6">
            <ul className="divide-y divide-line">
              {navGroups.map((g) => (
                <li key={g.label} className="py-3">
                  {g.href && g.label === "Contact" ? (
                    <Link href={localizePath(g.href, locale)} onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
                      {labelFor(g.label)}
                    </Link>
                  ) : g.href ? (
                    <Link href={localizePath(g.href, locale)} onClick={() => setMobileOpen(false)} className="flex items-center justify-between text-lg font-medium">
                      <span>{labelFor(g.label)}</span>
                      {(g.columns || g.menu) && <ChevronDown size={18} className="opacity-40" aria-hidden />}
                    </Link>
                  ) : (
                    <span className="flex items-center justify-between text-lg font-medium">
                      <span>{labelFor(g.label)}</span>
                      {(g.columns || g.menu) && <ChevronDown size={18} className="opacity-40" aria-hidden />}
                    </span>
                  )}
                  {g.columns && (
                    <div className="mt-2 pl-3 space-y-1">
                      {g.columns.flatMap((c) => c.items.map((it) => ({ ...it, _col: c.title }))).map((it) => (
                        <Link key={`${it._col}-${it.label}`} href={navHref(it.href)} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[15px] text-ink-muted">
                          {navLabel(it.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                  {g.menu && (
                    <div className="mt-2 pl-3 space-y-3">
                      {g.menu.map((mi) => (
                        mi.submenu ? (
                          <div key={mi.label}>
                            {mi.href ? (
                              <Link href={navHref(mi.href)} onClick={() => setMobileOpen(false)} className="eyebrow mb-1 block">{navLabel(mi.label)}</Link>
                            ) : (
                              <p className="eyebrow mb-1">{navLabel(mi.label)}</p>
                            )}
                            <div className="space-y-1">
                              {mi.submenu.map((s) => (
                                <Link key={s.label} href={navHref(s.href)} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[15px] text-ink-muted">
                                  {navLabel(s.label)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link key={mi.label} href={navHref(mi.href!)} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[15px] text-ink-muted">
                            {navLabel(mi.label)}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="hidden mt-6 space-y-3">
              <Link href={localizePath("/placement-test", locale)} onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full">{t.nav.placementTest}</Link>
              <a {...enrolLinkProps} onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">{t.nav.enrol}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
