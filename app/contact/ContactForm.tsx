"use client";
import { useState } from "react";
import { Check } from "lucide-react";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="frame p-8 bg-sole-soft text-center">
        <span className="w-10 h-10 rounded-full bg-azzurro text-cream inline-flex items-center justify-center"><Check size={16} /></span>
        <h3 className="mt-3 text-xl font-semibold">Thanks, we&apos;ll be in touch.</h3>
        <p className="mt-2 text-sm text-ink-muted">Demo mode — your message wasn&apos;t actually sent.</p>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="frame p-6 md:p-8 bg-white space-y-4">
      <h2 className="text-2xl font-semibold">Send us a message</h2>
      <label className="block text-sm font-medium">Name<input required className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">Email<input required type="email" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">Subject<select className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white"><option>Course enquiry</option><option>Private lesson</option><option>Corporate</option><option>PLIDA exam</option><option>Membership</option><option>Other</option></select></label>
      <label className="block text-sm font-medium">Message<textarea required rows={5} className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <button type="submit" className="btn btn-primary w-full">Send message</button>
    </form>
  );
}
