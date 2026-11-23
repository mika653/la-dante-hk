"use client";
// Right-hand slide-over panel for admin add/edit forms. Full-width on phones,
// max-w-xl from `sm` up. Portalled to <body> so no transformed/filtered
// ancestor can trap the `fixed` positioning. Locks page scroll, closes on Esc
// or backdrop click. Pass `formProps` to make the panel itself a <form>, so
// the sticky footer's submit button belongs to it.
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  formProps?: ComponentProps<"form">;
};

export default function Drawer({ title, onClose, children, footer, formProps }: Props) {
  // Keep the latest onClose without re-running the effect on every render.
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, []);

  if (typeof document === "undefined") return null;

  const panelClass = "relative h-full w-full sm:max-w-xl bg-cream shadow-2xl flex flex-col drawer-slide";
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-line bg-white">
        <h2 id="admin-drawer-title" className="text-lg font-semibold">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-lg hover:bg-cream-2 inline-flex items-center justify-center text-ink-muted"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
      {footer && (
        <div className="px-5 sm:px-6 py-4 border-t border-line bg-white flex items-center justify-between gap-3">{footer}</div>
      )}
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-60 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40 drawer-fade" />
      {formProps
        ? <form {...formProps} className={`${panelClass} ${formProps.className ?? ""}`}>{inner}</form>
        : <div className={panelClass}>{inner}</div>}
    </div>,
    document.body,
  );
}
