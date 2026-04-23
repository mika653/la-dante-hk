"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, BookOpen, PaintBucket, Calendar, Users, Star, ShieldAlert, LogOut, Menu, X, Layout, UserPlus, LifeBuoy } from "lucide-react";
import Wordmark from "@/components/Wordmark";

const navItems = [
  { href: "/admin",              label: "Overview",         icon: LayoutDashboard },
  { href: "/admin/content",      label: "Site content",     icon: Layout },
  { href: "/admin/courses",      label: "Courses",          icon: BookOpen },
  { href: "/admin/sub-lessons",  label: "Sub-teacher plans", icon: LifeBuoy },
  { href: "/admin/workshops",    label: "Workshops",        icon: PaintBucket },
  { href: "/admin/events",       label: "Events",           icon: Calendar },
  { href: "/admin/people",       label: "People",           icon: UserPlus },
  { href: "/admin/members",      label: "Members",          icon: Users },
  { href: "/admin/reviews",      label: "Reviews",          icon: Star },
  { href: "/admin/settings",     label: "Settings",         icon: ShieldAlert },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("ladante-admin") === "yes";
    setAuthed(ok);
  }, []);

  if (authed === null) return <div className="min-h-screen bg-cream" aria-hidden />;

  if (!authed) return <AdminLogin onOk={() => setAuthed(true)} />;

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
          <button type="button" onClick={() => { localStorage.removeItem("ladante-admin"); router.push("/admin"); setAuthed(false); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] text-cream/75 hover:bg-cream/10 hover:text-cream">
            <LogOut size={16} aria-hidden /> Sign out
          </button>
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

function AdminLogin({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const DEMO_PASSWORD = "dante2026";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === DEMO_PASSWORD) {
      localStorage.setItem("ladante-admin", "yes");
      onOk();
    } else {
      setErr("Wrong password. Demo password is dante2026.");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="frame p-8 md:p-10 bg-white max-w-md w-full text-center">
        <Wordmark />
        <p className="eyebrow mt-6">Staff only</p>
        <h1 className="mt-2 text-2xl md:text-3xl">Sign in to admin.</h1>
        <p className="mt-3 text-sm text-ink-muted">Demo password: <code className="font-mono bg-cream-2 px-1.5 py-0.5 rounded">dante2026</code></p>
        <form onSubmit={submit} className="mt-6 grid gap-3 text-left">
          <label className="text-sm font-medium">Password
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" required />
          </label>
          {err && <p className="text-sm text-rosso">{err}</p>}
          <button type="submit" className="btn btn-primary mt-2">Sign in</button>
        </form>
      </div>
    </div>
  );
}
