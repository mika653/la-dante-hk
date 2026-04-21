"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Monitor, Tablet, Smartphone, X, RotateCw } from "lucide-react";

type Device = "mobile" | "tablet" | "desktop";

const dims: Record<Device, { w: number; h: number; label: string }> = {
  mobile:  { w: 390,  h: 844, label: "Mobile" },
  tablet:  { w: 834,  h: 1100, label: "Tablet" },
  desktop: { w: 1280, h: 800, label: "Desktop" },
};

export default function ViewSwitcher() {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<Device>("mobile");
  const [portrait, setPortrait] = useState(true);
  const pathname = usePathname() || "/";
  const previewUrl = `${pathname}?preview=1`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [open]);

  const w = portrait ? dims[device].w : dims[device].h;
  const h = portrait ? dims[device].h : dims[device].w;
  const canRotate = device !== "desktop";

  return (
    <>
      {/* Trigger button — bottom-left, out of the chat's way */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Preview on devices"
        title="Preview on devices"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-ink text-cream shadow-[var(--shadow-pop)] hover:bg-ink-2 transition-colors"
      >
        <span className="inline-flex items-center -space-x-1">
          <Smartphone size={14} aria-hidden />
          <Tablet size={14} aria-hidden className="opacity-70" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wider">Preview</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] bg-ink/80 backdrop-blur-sm flex flex-col p-4 md:p-8" role="dialog" aria-modal="true">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
            <p className="text-cream font-heading font-bold uppercase tracking-wider text-sm hidden md:block">
              Preview as
            </p>
            <div className="flex items-center gap-1 p-1 rounded-full bg-ink-2 mx-auto md:mx-0">
              {(["mobile", "tablet", "desktop"] as Device[]).map((d) => {
                const Icon = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;
                const active = device === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm transition-colors ${active ? "bg-cream text-ink" : "text-cream/80 hover:text-cream"}`}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:inline">{dims[d].label}</span>
                    <span className="text-[11px] opacity-60 font-mono">{dims[d].w}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              {canRotate && (
                <button type="button" onClick={() => setPortrait((p) => !p)} aria-label="Rotate" title="Rotate" className="w-10 h-10 rounded-full bg-ink-2 text-cream hover:bg-cream hover:text-ink inline-flex items-center justify-center transition-colors">
                  <RotateCw size={14} />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close preview" className="w-10 h-10 rounded-full bg-ink-2 text-cream hover:bg-cream hover:text-ink inline-flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Device frame */}
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div
              className="relative bg-cream rounded-[28px] shadow-2xl transition-all duration-300 ring-[6px] ring-ink-2/80 overflow-hidden"
              style={{
                width: `min(${w}px, 100%)`,
                height: `min(${h}px, calc(100vh - 180px))`,
              }}
            >
              <iframe
                src={previewUrl}
                title={`Preview at ${dims[device].label} (${w}×${h})`}
                className="w-full h-full border-0 bg-cream"
                key={`${device}-${portrait}-${pathname}`}
              />
            </div>
          </div>

          <p className="text-center text-cream/60 text-xs mt-3 shrink-0">
            Previewing <code className="font-mono bg-cream/10 px-1.5 py-0.5 rounded">{pathname}</code> at {w}×{h}
            <span className="hidden md:inline"> · press <kbd className="px-1.5 py-0.5 rounded bg-cream/10 font-mono">Esc</kbd> to close</span>
          </p>
        </div>
      )}
    </>
  );
}
