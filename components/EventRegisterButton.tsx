"use client";
import { useActionState, useEffect, useState } from "react";
import { X, Check, Ticket } from "lucide-react";
import { registerForEvent, type RegisterState } from "@/lib/event-actions";
import { AGE_GROUPS } from "@/lib/event-constants";

export default function EventRegisterButton({
  eventId, eventTitle, eventDate, className = "",
}: { eventId: string; eventTitle: string; eventDate?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerForEvent, {});

  // Lock body scroll while the modal is open, and close on Escape.
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
                  <label className="block text-sm font-medium">Name<input name="name" required className={input} /></label>
                  <label className="block text-sm font-medium">Email<input name="email" type="email" required className={input} /></label>
                  <label className="block text-sm font-medium">Phone <span className="text-ink-muted font-normal">(optional)</span><input name="phone" className={input} /></label>
                  <label className="block text-sm font-medium">Age group
                    <select name="ageGroup" defaultValue="" className={input}>
                      <option value="">Prefer not to say</option>
                      {AGE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium pt-1">
                    <input type="checkbox" name="isStudent" value="yes" className="w-4 h-4" /> I&apos;m a student
                  </label>
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
