import PageHeader from "@/components/PageHeader";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { IconInstagram } from "@/components/SocialIcons";
import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="聯絡我們"
        title="來跟我們說聲 ciao。"
        subtitle="歡迎親臨我們的灣仔中心、電郵、致電，或在社交媒體私訊我們。我們以英文或意大利文回覆 — 由您選擇。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "聯絡我們" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div className="frame p-6 bg-white flex gap-4">
              <MapPin size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">灣仔中心</p>
                <p className="text-sm text-ink-muted">Room 702, 7/F, Hong Kong Arts Centre, 2 Harbour Road, Wan Chai, Hong Kong</p>
              </div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Phone size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">電話</p><a href="tel:+85228329799" className="text-sm text-ink-muted hover:text-azzurro-deep">+852 2832 9799</a></div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Mail size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">電郵</p><a href="mailto:dantealighieri@ladante.cc" className="text-sm text-ink-muted hover:text-azzurro-deep">dantealighieri@ladante.cc</a></div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Clock size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">營業時間</p><p className="text-sm text-ink-muted">星期一至五 10:30–19:00 · 星期六 10:00–17:00</p></div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><IconInstagram size={22} className="text-azzurro-deep shrink-0" />
              <div><p className="font-semibold">Instagram</p><Link href="https://instagram.com/ladantehk" target="_blank" rel="noopener" className="text-sm text-ink-muted hover:text-azzurro-deep">@ladantehk</Link></div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
