"use client";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { IconInstagram, IconFacebook } from "./SocialIcons";
import { useT } from "@/lib/locale";

export default function Newsletter() {
  const { t, locale } = useT();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  // Note: newsletter capture is on hold — the signup isn't stored yet.
  const followLabel = locale === "zh" ? "追蹤我們" : "Follow us";

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24 border-t border-line">
      {/* Blue + yellow brand circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-azzurro/30 blur-2xl" aria-hidden />
      <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-sole/40 blur-2xl" aria-hidden />

      <div className="container-xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow">{t.newsletter.eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-4xl"><span className="circle-accent-center">{t.newsletter.titleHighlight}</span>{t.newsletter.titleTail}</h2>
          <p className="mt-3 text-ink-muted">{t.newsletter.subtitle}</p>

          {done ? (
            <div className="mt-8 frame p-6 bg-white inline-flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-azzurro text-cream inline-flex items-center justify-center"><Check size={16} /></span>
              <span className="text-[15px]">{t.newsletter.thanks(email)}</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setDone(true); }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="text"
                required
                placeholder={t.newsletter.firstName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 px-5 rounded-full border border-line bg-white focus:outline-none focus:border-ink"
                aria-label={t.newsletter.firstName}
              />
              <div className="flex-[2] relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
                <input
                  type="email"
                  required
                  placeholder={t.newsletter.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-5 rounded-full border border-line bg-white focus:outline-none focus:border-ink"
                  aria-label="Email"
                />
              </div>
              <button type="submit" className="btn btn-primary whitespace-nowrap">{t.newsletter.subscribe}</button>
            </form>
          )}
          <p className="mt-4 text-xs text-ink-muted">{t.newsletter.small}</p>

          {/* Follow us on social */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-medium text-ink">{followLabel}</span>
            <a href="https://www.instagram.com/ladantehk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-line bg-white inline-flex items-center justify-center text-ink hover:bg-ink hover:text-cream transition-colors">
              <IconInstagram size={18} />
            </a>
            <a href="https://www.facebook.com/ladantehk" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-line bg-white inline-flex items-center justify-center text-ink hover:bg-ink hover:text-cream transition-colors">
              <IconFacebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
