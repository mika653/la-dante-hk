"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, TrendingUp, Library, Users, CreditCard, GraduationCap, LogOut, Menu, X, ExternalLink } from "lucide-react";
import Wordmark from "@/components/Wordmark";

const navItems = [
  { href: "/student",            label: "Dashboard",    icon: LayoutDashboard },
  { href: "/student/journey",    label: "My Journey",   icon: TrendingUp },
  { href: "/student/library",    label: "Cultural Library", icon: Library },
  { href: "/student/practice",   label: "Practice",     icon: GraduationCap },
  { href: "/student/community",  label: "Community",    icon: Users },
  { href: "/student/card",       label: "My Card",      icon: CreditCard },
];

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("ladante-student") === "yes";
    setAuthed(ok);
  }, []);

  if (authed === null) return <div className="min-h-screen bg-cream" aria-hidden />;
  if (!authed) return <StudentLogin onOk={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-cream-2 flex">
      <aside className={`${mobileNav ? "fixed inset-y-0 left-0 z-50" : "hidden"} lg:static lg:block w-64 bg-ink text-cream min-h-screen flex-col`}>
        <div className="p-6 border-b border-cream/10 flex items-center justify-between">
          <Wordmark color="cream" size={28} />
          <button type="button" onClick={() => setMobileNav(false)} className="lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>

        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] uppercase tracking-widest text-cream/50 font-medium mb-2">Logged in as</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sole text-ink inline-flex items-center justify-center font-heading font-extrabold">CC</div>
            <div className="min-w-0">
              <p className="font-medium truncate">Clara Chan</p>
              <p className="text-xs text-cream/60">B1 · Member since 2023</p>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            {navItems.map((i) => {
              const active = path === i.href || (i.href !== "/student" && path.startsWith(i.href));
              return (
                <li key={i.href}>
                  <Link href={i.href} onClick={() => setMobileNav(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] ${active ? "bg-cream/15 text-cream font-medium" : "text-cream/75 hover:bg-cream/10 hover:text-cream"}`}>
                    <i.icon size={16} aria-hidden />{i.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-cream/10">
            <p className="text-[11px] uppercase tracking-widest text-cream/50 font-medium mb-2 px-3">Class management</p>
            <a
              href="https://ladante.scuolasemplice.it"
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[14px] text-cream/75 hover:bg-cream/10 hover:text-cream"
            >
              <span className="inline-flex items-center gap-3"><GraduationCap size={16} aria-hidden /> ScuolaSemplice</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <p className="px-3 mt-1 text-[11px] text-cream/50">Schedule, attendance, and payments.</p>
          </div>
        </nav>

        <div className="p-3 border-t border-cream/10">
          <button type="button" onClick={() => { localStorage.removeItem("ladante-student"); router.push("/student"); setAuthed(false); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] text-cream/75 hover:bg-cream/10 hover:text-cream">
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden bg-ink text-cream flex items-center justify-between p-4">
          <Wordmark color="cream" size={24} />
          <button type="button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20} /></button>
        </header>
        <div className="flex-1 p-6 md:p-10 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function StudentLogin({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState("clara@demo.ladante.cc");
  const [pw, setPw] = useState("student2026");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === "student2026") {
      localStorage.setItem("ladante-student", "yes");
      onOk();
    } else setErr("Wrong password. Demo: student2026");
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="frame p-8 md:p-10 bg-white max-w-md w-full text-center">
        <Wordmark size={28} />
        <p className="eyebrow mt-6">Student portal</p>
        <h1 className="mt-2 text-2xl md:text-3xl">Benvenuto, studente.</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Sign in to access your journey, cultural library, and member card.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Demo credentials pre-filled — just click <strong>Sign in</strong>.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-3 text-left">
          <label className="text-sm font-medium">Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" required />
          </label>
          <label className="text-sm font-medium">Password
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" required />
          </label>
          {err && <p className="text-sm text-rosso">{err}</p>}
          <button type="submit" className="btn btn-primary mt-2">Sign in</button>
        </form>
        <p className="mt-5 text-xs text-ink-muted">Forgot your password? <a href="mailto:dantealighieri@ladante.cc" className="underline hover:text-ink">Email us</a></p>
      </div>
    </div>
  );
}
