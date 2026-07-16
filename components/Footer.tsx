"use client";
import Link from "next/link";
import Image from "next/image";
import Wordmark from "./Wordmark";
import { MapPin, Phone, Mail } from "lucide-react";
import { IconInstagram, IconFacebook, IconYoutube, IconLinkedin } from "./SocialIcons";
import { useT, localizePath } from "@/lib/locale";

export default function Footer() {
  const { t, locale } = useT();
  const lp = (p: string) => localizePath(p, locale);
  return (
    <footer className="mt-24">
      {/* Mural silhouette strip (reflection transition) */}
      <div className="relative h-24 md:h-40 bg-cream overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-full opacity-40 mix-blend-multiply">
          <Image src="/mural.png" alt="" fill className="object-cover object-top" aria-hidden sizes="100vw" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-azzurro-deep" aria-hidden />
      </div>

      <div className="bg-ink text-cream">
        <div className="container-xl pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <Wordmark color="cream" />
              <p className="mt-4 text-[15px] leading-relaxed text-cream/80 max-w-sm">{t.footer.blurb}</p>
              <div className="mt-6 flex items-center gap-3">
                {[
                  { Icon: IconInstagram, href: "https://instagram.com/ladantehk", label: "Instagram" },
                  { Icon: IconFacebook, href: "#", label: "Facebook" },
                  { Icon: IconYoutube, href: "#", label: "YouTube" },
                  { Icon: IconLinkedin, href: "#", label: "LinkedIn" },
                ].map(({ Icon, href, label }) => (
                  <Link key={label} href={href} aria-label={label} className="w-10 h-10 rounded-full border border-cream/30 hover:border-cream hover:bg-cream hover:text-azzurro-deep inline-flex items-center justify-center transition-colors">
                    <Icon size={16} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="eyebrow !text-sole mb-4">{t.footer.learn}</p>
              <ul className="space-y-2 text-[14px]">
                <li><Link className="hover:text-sole" href={lp("/courses/italian/adult-groups")}>{t.footer.italianGroups}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/courses/latin")}>{t.footer.latin}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/courses/italian/kids")}>{t.footer.kidsTeens}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/courses/italian/private")}>{t.footer.private}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/placement-test")}>{t.footer.placementTest}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="eyebrow !text-sole mb-4">{t.footer.society}</p>
              <ul className="space-y-2 text-[14px]">
                <li><Link className="hover:text-sole" href={lp("/membership")}>{t.footer.membership}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/culture")}>{t.footer.culture}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/plida")}>{t.footer.plida}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/about")}>{t.footer.aboutUs}</Link></li>
                <li><Link className="hover:text-sole" href={lp("/gift")}>{t.footer.gift}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="eyebrow !text-sole mb-4">{t.footer.visit}</p>
              <ul className="space-y-3 text-[14px]">
                <li className="flex gap-3"><MapPin size={16} className="shrink-0 mt-0.5 text-sole" aria-hidden /><span>{t.footer.address}</span></li>
                <li className="flex gap-3"><Phone size={16} className="shrink-0 mt-0.5 text-sole" aria-hidden /><a href="tel:+85228529788" className="hover:text-sole">+852 2852 9788</a></li>
                <li className="flex gap-3"><Mail size={16} className="shrink-0 mt-0.5 text-sole" aria-hidden /><a href="mailto:info@ladante.cc" className="hover:text-sole">info@ladante.cc</a></li>
              </ul>
              <p className="mt-5 text-[13px] text-cream/60">{t.footer.hours}</p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-cream/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[13px] text-cream/60">
            <p>© {new Date().getFullYear()} Dante Alighieri Society of Hong Kong · {t.footer.allRights}</p>
            <div className="flex gap-5">
              <Link href={lp("/privacy")} className="hover:text-sole">{t.footer.privacy}</Link>
              <Link href={lp("/terms")}   className="hover:text-sole">{t.footer.terms}</Link>
              <Link href={lp("/bad-weather")} className="hover:text-sole">{t.footer.typhoon}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
