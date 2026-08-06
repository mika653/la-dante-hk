"use client";
import Link from "next/link";
import Image from "next/image";
import Wordmark from "./Wordmark";
import { MapPin, Phone, Mail, MessageCircle, ChevronRight } from "lucide-react";
import { IconInstagram, IconFacebook, IconYoutube, IconLinkedin } from "./SocialIcons";
import { useT, localizePath } from "@/lib/locale";

export default function Footer() {
  const { t, locale } = useT();
  const lp = (p: string) => localizePath(p, locale);

  const explore: { label: string; href: string }[] = [
    { label: t.footer.courses, href: lp("/courses") },
    { label: t.footer.contact, href: lp("/contact") },
    { label: t.footer.badWeather, href: lp("/bad-weather") },
    { label: t.footer.membership, href: lp("/membership") },
    { label: t.footer.privacy, href: lp("/privacy") },
    { label: t.footer.terms, href: lp("/terms") },
  ];

  const socials = [
    { Icon: IconFacebook, href: "#", label: "Facebook" },
    { Icon: IconInstagram, href: "https://instagram.com/ladantehk", label: "Instagram" },
    { Icon: IconYoutube, href: "#", label: "YouTube" },
    { Icon: IconLinkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-cream text-ink">
      {/* Signature Dante skyline mural — full crisp skyline on top, reflection flowing
          down behind the columns below (the columns overlap the faint reflection). */}
      <Image
        src="/mural.png"
        alt="Skyline of Italian and Hong Kong landmarks"
        width={2400}
        height={1347}
        className="w-full h-auto select-none pointer-events-none"
        priority
      />

      <div className="relative z-10 container-xl mt-[-14%] md:mt-[-18%] pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <Wordmark color="ink" />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-sm">{t.footer.blurb}</p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-md bg-azzurro-deep text-white inline-flex items-center justify-center transition-colors hover:bg-sole hover:text-ink"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-4">{t.footer.contact}</p>
            <ul className="space-y-3 text-[14px]">
              <li className="flex gap-3">
                <Phone size={16} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
                <a href="tel:+85228329799" className="hover:text-azzurro-deep">+852 2832 9799</a>
              </li>
              <li className="flex gap-3">
                <MessageCircle size={16} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
                <a href="https://wa.me/85255128084" target="_blank" rel="noopener noreferrer" className="hover:text-azzurro-deep">{t.footer.whatsapp}: +852 5512 8084</a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
                <a href="mailto:dantealighieri@ladante.cc" className="hover:text-azzurro-deep">dantealighieri@ladante.cc</a>
              </li>
              <li className="flex gap-3">
                <MapPin size={16} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
                <span>{t.footer.address}</span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-4">{t.footer.explore}</p>
            <ul className="space-y-2.5 text-[14px]">
              {explore.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="group inline-flex items-center gap-1.5 hover:text-azzurro-deep">
                    <ChevronRight size={14} className="text-ink-muted shrink-0" aria-hidden />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-4">{t.footer.newsletter}</p>
            <a
              href="mailto:dantealighieri@ladante.cc?subject=Newsletter%20subscription"
              className="inline-flex items-center justify-center rounded-md bg-sole text-ink font-semibold text-[13px] tracking-wide uppercase px-6 py-2.5 transition-colors hover:bg-ink hover:text-cream"
            >
              {t.footer.subscribe}
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[13px] text-ink-muted">
          <p>© {new Date().getFullYear()} Dante Alighieri Society of Hong Kong · {t.footer.allRights}</p>
          <div className="flex gap-5">
            <Link href={lp("/privacy")} className="hover:text-azzurro-deep">{t.footer.privacy}</Link>
            <Link href="/cookie-policy" className="hover:text-azzurro-deep">Cookies</Link>
            <Link href={lp("/terms")} className="hover:text-azzurro-deep">{t.footer.terms}</Link>
            <Link href={lp("/bad-weather")} className="hover:text-azzurro-deep">{t.footer.typhoon}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
