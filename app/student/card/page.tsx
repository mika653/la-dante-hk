import { memberPerks } from "@/lib/data";
import { Smartphone, Wallet } from "lucide-react";
import Image from "next/image";

export default function Card() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Student · My Card</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Your Dante member card.</h1>
      <p className="mt-2 text-ink-muted max-w-xl">Show this at any partner venue to unlock 50+ perks across Hong Kong.</p>

      {/* The card */}
      <div className="mt-8 relative max-w-md">
        <div className="relative frame bg-ink text-cream p-6 aspect-[1.586/1] overflow-hidden">
          {/* Mural silhouette as watermark */}
          <div className="absolute inset-0 opacity-15 mix-blend-screen">
            <Image src="/mural.png" alt="" fill aria-hidden sizes="400px" className="object-cover" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sole">Società Dante Alighieri</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70">Hong Kong · Member card</p>
            </div>
            <div>
              <p className="font-heading font-extrabold text-2xl leading-tight">Clara Chan</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-wider">
                <div><p className="text-cream/60">Member no.</p><p className="font-mono text-cream mt-0.5">D-0184</p></div>
                <div><p className="text-cream/60">Level</p><p className="font-mono text-cream mt-0.5">B1</p></div>
                <div><p className="text-cream/60">Valid thru</p><p className="font-mono text-cream mt-0.5">12/26</p></div>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-azzurro shrink-0" aria-hidden />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary !h-10 !text-sm"><Wallet size={14} /> Add to Apple Wallet</button>
          <button type="button" className="btn btn-ghost !h-10 !text-sm"><Smartphone size={14} /> Add to Google Wallet</button>
        </div>
      </div>

      {/* Perks */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5">Your perks</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {memberPerks.map((g) => (
            <div key={g.category} className="frame p-6 bg-white">
              <h3 className="font-heading font-bold uppercase tracking-wider text-azzurro-deep text-sm">{g.category}</h3>
              <ul className="mt-4 divide-y divide-line">
                {g.items.map((i) => (
                  <li key={i.name} className="py-3 flex items-start justify-between gap-4">
                    <span className="font-medium">{i.name}</span>
                    <span className="text-sm text-ink-muted text-right">{i.perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
