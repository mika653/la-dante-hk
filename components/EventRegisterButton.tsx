"use client";
import { useActionState, useEffect, useState } from "react";
import { X, Check, Ticket } from "lucide-react";
import { registerForEvent, type RegisterState } from "@/lib/event-actions";
import { activeRegFields, AGE_OPTIONS, SOURCE_OPTIONS, CONSENT_TEXT, NEWSLETTER_TEXT, MEMBER_QUESTION, OTHER_OPTION, type CustomQuestion } from "@/lib/event-registration";

export default function EventRegisterButton({
  eventId, eventTitle, eventDate, fields, customQuestions = [], className = "",
}: { eventId: string; eventTitle: string; eventDate?: string; fields?: string[]; customQuestions?: CustomQuestion[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerForEvent, {});
  const active = activeRegFields(fields);
  const has = (k: string) => active.includes(k as never);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const input = "mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || "btn btn-primary text-sm h-10 px-4 shrink-0"}>
        <Ticket size={14} /> Register
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-4 bg-ink/40" role="dialog" aria-modal="true" aria-label={`Register for ${eventTitle}`} onClick={() => setOpen(false)}>
          <div className="relative frame bg-white max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-7" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-ink/10 inline-flex items-center justify-center">
              <X size={16} />
            </button>

            {state.ok ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-800 mx-auto inline-flex items-center justify-center"><Check size={22} /></div>
                <h3 className="mt-4 text-xl font-heading font-bold">You&apos;re registered!</h3>
                <p className="mt-2 text-sm text-ink-muted">See you at <b className="text-ink">{eventTitle}</b>. A reminder will follow by email.</p>
                <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost mt-5">Close</button>
              </div>
            ) : (
              <form action={action}>
                <input type="hidden" name="eventId" value={eventId} />
                <input type="hidden" name="eventTitle" value={eventTitle} />
                <input type="hidden" name="eventDate" value={eventDate ?? ""} />
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <p className="eyebrow">Register</p>
                <h3 className="mt-1 text-xl font-heading font-bold text-balance">{eventTitle}</h3>
                {eventDate && <p className="mt-1 text-sm text-ink-muted">{eventDate}</p>}

                <div className="mt-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-medium">First name<input name="firstName" required className={input} /></label>
                    <label className="block text-sm font-medium">Surname<input name="surname" required className={input} /></label>
                  </div>
                  <label className="block text-sm font-medium">Email<input name="email" type="email" required className={input} /></label>
                  {has("phone") && <label className="block text-sm font-medium">Phone number<input name="phone" required className={input} /></label>}
                  {has("age") && (
                    <label className="block text-sm font-medium">Age group
                      <select name="age" required defaultValue="" className={input}>
                        <option value="" disabled>Please choose…</option>
                        {AGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </label>
                  )}
                  {has("source") && (
                    <label className="block text-sm font-medium">How did you find out about the event?
                      <select name="source" required value={source} onChange={(e) => setSource(e.target.value)} className={input}>
                        <option value="">Please choose…</option>
                        {SOURCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {source === "Other" && <input name="sourceOther" required placeholder="Please specify" className={`${input} mt-2`} />}
                    </label>
                  )}
                  {has("member") && (
                    <fieldset className="text-sm font-medium">
                      <legend>{MEMBER_QUESTION}</legend>
                      <div className="mt-1 flex gap-4">
                        <label className="inline-flex items-center gap-2 font-normal"><input type="radio" name="member" value="Yes" required className="accent-azzurro-deep" /> Yes</label>
                        <label className="inline-flex items-center gap-2 font-normal"><input type="radio" name="member" value="No" className="accent-azzurro-deep" /> No</label>
                      </div>
                    </fieldset>
                  )}
                  {customQuestions.map((q) => {
                    const name = `cq_${q.id}`;
                    const optional = !q.required && <span className="text-ink-muted font-normal"> (optional)</span>;
                    if (q.type === "yesno") return (
                      <fieldset key={q.id} className="text-sm font-medium">
                        <legend>{q.label}{optional}</legend>
                        <div className="mt-1 flex gap-4">
                          <label className="inline-flex items-center gap-2 font-normal"><input type="radio" name={name} value="Yes" required={q.required} className="accent-azzurro-deep" /> Yes</label>
                          <label className="inline-flex items-center gap-2 font-normal"><input type="radio" name={name} value="No" className="accent-azzurro-deep" /> No</label>
                        </div>
                      </fieldset>
                    );
                    if (q.type === "choice") return (
                      <ChoiceQuestion key={q.id} q={q} name={name} optional={optional} className={input} />
                    );
                    return (
                      <label key={q.id} className="block text-sm font-medium">{q.label}{optional}
                        {q.type === "long"
                          ? <textarea name={name} required={q.required} rows={3} maxLength={2000} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
                          : <input name={name} required={q.required} maxLength={300} className={input} />}
                      </label>
                    );
                  })}
                  {has("newsletter") && (
                    <label className="flex items-start gap-2 text-sm pt-1">
                      <input type="checkbox" name="newsletter" value="yes" className="mt-1 w-4 h-4 accent-azzurro-deep" />
                      <span className="text-ink-muted">{NEWSLETTER_TEXT}</span>
                    </label>
                  )}
                  {has("consent") && (
                    <label className="flex items-start gap-2 text-sm pt-1">
                      <input type="checkbox" name="consent" value="yes" required className="mt-1 w-4 h-4 accent-azzurro-deep" />
                      <span className="text-ink-muted">{CONSENT_TEXT.replace(/our Privacy Policy\.$/, "")}<a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-ink">our Privacy Policy</a>.</span>
                    </label>
                  )}
                </div>

                {state.error && <p className="mt-3 text-sm text-rosso bg-rosso/10 rounded-lg px-3 py-2">{state.error}</p>}

                <button type="submit" disabled={pending} className="btn btn-primary w-full mt-5 disabled:opacity-50">
                  {pending ? "Registering…" : "Confirm registration"}
                </button>
                <p className="mt-2 text-center text-xs text-ink-muted">We&apos;ll only use this for the event.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Drop-down custom question, with an optional "Other" that reveals a text box
// (same shape as the standard "How did you find out?" question).
function ChoiceQuestion({ q, name, optional, className }: { q: CustomQuestion; name: string; optional: React.ReactNode; className: string }) {
  const [value, setValue] = useState("");
  return (
    <label className="block text-sm font-medium">{q.label}{optional}
      <select name={name} required={q.required} value={value} onChange={(e) => setValue(e.target.value)} className={className}>
        <option value="">Please choose…</option>
        {(q.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
        {q.allowOther && <option value={OTHER_OPTION}>{OTHER_OPTION}</option>}
      </select>
      {q.allowOther && value === OTHER_OPTION && <input name={`${name}_other`} required placeholder="Please specify" maxLength={200} className={`${className} mt-2`} />}
    </label>
  );
}
