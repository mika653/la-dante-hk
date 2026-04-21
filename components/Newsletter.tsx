"use client";
import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-cream py-16 md:py-24 border-t border-line">
      <div className="container-xl">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow">Stay in touch</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Join us for news & updates.</h2>
          <p className="mt-3 text-ink-muted">New terms, workshops, cultural events, and the occasional Italian joke.</p>

          {done ? (
            <div className="mt-8 frame p-6 bg-white inline-flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-azzurro text-cream inline-flex items-center justify-center"><Check size={16} /></span>
              <span className="text-[15px]">Grazie! We&apos;ll be in touch at <strong>{email}</strong>.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setDone(true); }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="text"
                required
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 px-5 rounded-full border border-line bg-white focus:outline-none focus:border-azzurro"
                aria-label="First name"
              />
              <div className="flex-[2] relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-5 rounded-full border border-line bg-white focus:outline-none focus:border-azzurro"
                  aria-label="Email"
                />
              </div>
              <button type="submit" className="btn btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          )}
          <p className="mt-4 text-xs text-ink-soft">We&apos;ll never share your email. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
