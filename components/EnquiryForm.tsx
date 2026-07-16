"use client";
import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Send, Check } from "lucide-react";
import { submitEnquiry, type EnquiryType, type SubmitState } from "@/lib/enquiry-actions";

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

type Copy = { title: string; blurb: string; levelLabel?: string; showLevel: boolean; timingLabel: string; messageLabel: string };

const COPY: Record<EnquiryType, Copy> = {
  course: {
    title: "Can't find the right class?",
    blurb: "Tell us the level and when you'd like to study — we'll let you know when a matching group opens, or suggest another way in.",
    showLevel: true, levelLabel: "Level you're after",
    timingLabel: "Preferred days / times", messageLabel: "Anything else",
  },
  private: {
    title: "Enquire about private lessons",
    blurb: "One-to-one, at your pace. Tell us your level, when you're free, and what you'd like to focus on.",
    showLevel: true, levelLabel: "Your level (or “not sure”)",
    timingLabel: "When are you free?", messageLabel: "Goals / focus",
  },
  plida: {
    title: "PLIDA exam enquiry",
    blurb: "Ask about the PLIDA certification — which level to sit, dates, and how to prepare.",
    showLevel: true, levelLabel: "Exam level",
    timingLabel: "Which session / when", messageLabel: "Your question",
  },
  workshop: {
    title: "Register your interest",
    blurb: "Tell us which workshop or topic you'd like — we open a session once enough people want it.",
    showLevel: false,
    timingLabel: "Which workshop / topic", messageLabel: "Anything else",
  },
  trial: {
    title: "Book a trial class",
    blurb: "Come and try a lesson. Leave your details and the office will arrange a time that suits you.",
    showLevel: true, levelLabel: "Level (or “beginner / not sure”)",
    timingLabel: "When suits you?", messageLabel: "Anything else",
  },
  general: {
    title: "Get in touch",
    blurb: "Send us a message and the office will get back to you.",
    showLevel: false,
    timingLabel: "Preferred timing", messageLabel: "Message",
  },
  // placement and newsletter enquiries are filed programmatically, not via this
  // form — these entries exist only to satisfy the type.
  placement: {
    title: "Placement test",
    blurb: "Your placement result.",
    showLevel: true, levelLabel: "Level",
    timingLabel: "Preferred timing", messageLabel: "Message",
  },
  newsletter: {
    title: "Newsletter",
    blurb: "Newsletter sign-up.",
    showLevel: false,
    timingLabel: "Preferred timing", messageLabel: "Message",
  },
};

export default function EnquiryForm({ type = "general", compact = false }: { type?: EnquiryType; compact?: boolean }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitEnquiry, {});
  const pathname = usePathname() || "";
  const c = COPY[type];
  // Only after mount, so it never causes a hydration mismatch.
  const [path, setPath] = useState("");
  useEffect(() => setPath(pathname), [pathname]);

  if (state.ok) {
    return (
      <div className="frame bg-white p-6 md:p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-800 mx-auto inline-flex items-center justify-center"><Check size={22} /></div>
        <h3 className="mt-4 text-xl font-heading font-bold">Thank you — we&apos;ve got it.</h3>
        <p className="mt-2 text-ink-muted text-sm">The office will be in touch soon. For anything urgent, email <a href="mailto:dantealighieri@ladante.cc" className="underline">dantealighieri@ladante.cc</a>.</p>
      </div>
    );
  }

  const input = "mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink";

  return (
    <form action={action} className={`frame bg-white ${compact ? "p-5" : "p-6 md:p-8"}`}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="sourcePath" value={path} />
      {/* honeypot — hidden from people, catnip for bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <h3 className="text-xl md:text-2xl font-heading font-bold text-balance">{c.title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{c.blurb}</p>

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <label className="text-sm font-medium">Name<input name="name" required className={input} /></label>
        <label className="text-sm font-medium">Email<input name="email" type="email" required className={input} /></label>
        <label className="text-sm font-medium">Phone <span className="text-ink-muted font-normal">(optional)</span><input name="phone" className={input} /></label>
        {c.showLevel && (
          <label className="text-sm font-medium">{c.levelLabel}
            <input name="level" list="cefr-levels" placeholder="e.g. B1, or not sure" className={input} />
            <datalist id="cefr-levels">{CEFR.map((l) => <option key={l} value={l} />)}</datalist>
          </label>
        )}
        <label className={`text-sm font-medium ${c.showLevel ? "sm:col-span-2" : ""}`}>{c.timingLabel}
          <input name="timing" className={input} />
        </label>
      </div>
      <label className="block text-sm font-medium mt-3">{c.messageLabel} <span className="text-ink-muted font-normal">(optional)</span>
        <textarea name="message" rows={3} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:border-ink resize-y" />
      </label>

      {state.error && <p className="mt-3 text-sm text-rosso bg-rosso/10 rounded-lg px-3 py-2">{state.error}</p>}

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-ink-muted">We&apos;ll only use this to reply to your enquiry.</p>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-50">
          <Send size={15} /> {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
