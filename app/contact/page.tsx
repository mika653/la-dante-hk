import PageHeader from "@/components/PageHeader";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { IconInstagram } from "@/components/SocialIcons";
import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say ciao."
        subtitle="Visit our Wanchai centre, email, call, or slide into our DMs. We reply in English or Italian — your choice."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div className="frame p-6 bg-white flex gap-4">
              <MapPin size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">Wanchai centre</p>
                <p className="text-sm text-ink-muted">Room 702, 7/F, Hong Kong Arts Centre, 2 Harbour Road, Wan Chai, Hong Kong</p>
              </div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Phone size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">Phone</p><a href="tel:+85228329799" className="text-sm text-ink-muted hover:text-azzurro-deep">+852 2832 9799</a></div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Mail size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">Email</p><a href="mailto:dantealighieri@ladante.cc" className="text-sm text-ink-muted hover:text-azzurro-deep">dantealighieri@ladante.cc</a></div>
            </div>
            <div className="frame p-6 bg-white flex gap-4"><Clock size={22} className="text-azzurro-deep shrink-0" aria-hidden />
              <div><p className="font-semibold">Hours</p><p className="text-sm text-ink-muted">Mon–Fri 10:30–19:00 · Sat 10:00–17:00</p></div>
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
