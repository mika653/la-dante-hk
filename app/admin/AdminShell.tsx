"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, BookOpen, PaintBucket, Calendar, Users, Star, ShieldAlert, LogOut, Menu, X, Layout, UserPlus, CalendarDays, Inbox, Ticket, KeyRound } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { logoutAction } from "@/lib/auth-actions";
import type { Role } from "@/lib/db/schema";
import { roleLabel } from "@/lib/leave-core";

const navItems = [
  { href: "/admin",              label: "Overview",         icon: LayoutDashboard },
  { href: "/admin/content",      label: "Site content",     icon: Layout },
  { href: "/admin/courses",      label: "Courses",          icon: BookOpen },
  { href: "/admin/enquiries",    label: "Enquiries",        icon: Inbox },
  { href: "/admin/workshops",    label: "Workshops",        icon: PaintBucket },
  { href: "/admin/events",       label: "Events",           icon: Calendar },
  { href: "/admin/registrations",label: "Registrations",    icon: Ticket },
  { href: "/admin/people",       label: "People",           icon: UserPlus },
  { href: "/admin/members",      label: "Members",          icon: Users },
  { href: "/admin/reviews",      label: "Reviews",          icon: Star },
  { href: "/leave",              label: "Staff leave",      icon: CalendarDays },
  { href: "/admin/settings",     label: "Settings",         icon: ShieldAlert },
];

export default function AdminShell({ children, userName, role }: { children: React.ReactNode; userName: string; role: Role }) {
  const path = usePathname();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-cream-2 flex">
      {/* Sidebar */}
      <aside className={`${mobileNav ? "fixed inset-y-0 left-0 z-50" : "hidden"} lg:static lg:block w-64 bg-ink text-cream min-h-screen flex-col`}>
        <div className="p-6 border-b border-cream/10 flex items-center justify-between">
          <Wordmark color="cream" />
          <button type="button" onClick={() => setMobileNav(false)} className="lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            {navItems.map((i) => {
              const active = path === i.href || (i.href !== "/admin" && path.startsWith(i.href));
              return (
                <li key={i.href}>
                  <Link href={i.href} onClick={() => setMobileNav(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] ${active ? "bg-cream/15 text-cream font-medium" : "text-cream/75 hover:bg-cream/10 hover:text-cream"}`}>
                    <i.icon size={16} aria-hidden />{i.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-3 border-t border-cream/10">
          <div className="px-3 pb-2">
            <p className="text-[13px] text-cream font-medium truncate">{userName}</p>
            <p className="text-[11px] text-cream/50">{roleLabel[role]}</p>
          </div>
          <Link href="/account/password" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] text-cream/75 hover:bg-cream/10 hover:text-cream">
            <KeyRound size={16} aria-hidden /> Password
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] text-cream/75 hover:bg-cream/10 hover:text-cream">
              <LogOut size={16} aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden bg-ink text-cream flex items-center justify-between p-4">
          <Wordmark color="cream" />
          <button type="button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20} /></button>
        </header>
        <div className="flex-1 p-6 md:p-10 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

