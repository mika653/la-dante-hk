"use client";
import Image from "next/image";
import { MapPin, Phone, MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/locale";

export default function VisitUs() {
  const { t } = useT();
  const mapQuery = encodeURIComponent("Hong Kong Arts Centre, 2 Harbour Road, Wan Chai, Hong Kong");

  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="container-xl grid lg:grid-cols-[280px_1fr_320px] gap-6">
        <div className="relative rounded-[1.75rem] overflow-hidden min-h-[220px] border border-line">
          <Image src="/mural.png" alt="La Dante — Wanchai" fill sizes="(min-width: 1024px) 280px, 100vw" className="object-cover" />
        </div>

        <div className="frame bg-white p-6 md:p-8">
          <p className="eyebrow !text-azzurro-deep">{t.footer.visit}</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">{"We're in the Heart of Wanchai"}</h2>
          <p className="mt-3 flex items-start gap-2 text-[14px] text-ink-muted">
            <MapPin size={16} className="shrink-0 mt-0.5 text-azzurro-deep" aria-hidden />
            {t.footer.address}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-azzurro-deep hover:underline"
          >
            Get directions <ArrowUpRight size={14} />
          </a>

          <div className="mt-6 rounded-2xl overflow-hidden border border-line h-40">
            <iframe
              title="La Dante location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="frame bg-white p-6 md:p-8">
          <p className="eyebrow !text-azzurro-deep">Opening Hours</p>
          <p className="mt-3 text-[14px] text-ink-muted whitespace-pre-line">{t.footer.hours.replace(/ · /g, "\n")}</p>

          <div className="mt-6 space-y-3 text-[14px]">
            <a href="tel:+85228329799" className="flex items-center gap-2.5 hover:text-azzurro-deep">
              <Phone size={16} className="text-azzurro-deep" aria-hidden /> +852 2832 9799
            </a>
            <a href="https://wa.me/85255128084" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-azzurro-deep">
              <MessageCircle size={16} className="text-azzurro-deep" aria-hidden /> {t.footer.whatsapp}: +852 5512 8084
            </a>
            <a href="mailto:dantealighieri@ladante.cc" className="flex items-center gap-2.5 hover:text-azzurro-deep">
              <Mail size={16} className="text-azzurro-deep" aria-hidden /> dantealighieri@ladante.cc
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
