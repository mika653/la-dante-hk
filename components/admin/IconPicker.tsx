"use client";
// Reusable icon picker for the dashboard: a searchable grid of the curated icon
// library, grouped by category. Use <IconPicker> inline, or <IconPickerButton>
// for a compact trigger that opens the picker in a modal dialog.
//
// Keyboard: the grid is a single radio group with a roving tab stop — Tab enters
// it on the selected icon, arrow keys move (up/down by visual row), Home/End
// jump, Enter/Space choose.
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown, ImageIcon, Search, X } from "lucide-react";
import { ICON_CATEGORIES, ICON_LIBRARY, libraryIcon, type LibraryIcon } from "@/lib/icon-library";

type CustomOption = {
  /** Label for the "keep the original drawing" choice, stored as "". */
  label: string;
  /** Optional preview of that drawing. */
  preview?: ReactNode;
};

type PickerProps = {
  value: string;
  onChange: (key: string) => void;
  /** Offer a "" choice that keeps a custom illustration. */
  custom?: CustomOption;
  /** Key of the shipped default, flagged in the grid. */
  defaultKey?: string;
  /** Accessible name of the radio group. */
  label?: string;
  /** Focus the search box on mount (used by the dialog). */
  autoFocus?: boolean;
  className?: string;
};

type Item = { key: string; label: string; node: ReactNode };

export function IconPicker({ value, onChange, custom, defaultKey, label = "Icon", autoFocus, className = "" }: PickerProps) {
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (i: LibraryIcon) =>
      !q || i.label.toLowerCase().includes(q) || i.key.includes(q) || i.category.toLowerCase().includes(q) || (i.tags ?? "").includes(q);
    const out: { title: string; items: Item[] }[] = [];
    if (custom && (!q || custom.label.toLowerCase().includes(q) || "custom original".includes(q))) {
      out.push({ title: "Original", items: [{ key: "", label: custom.label, node: custom.preview ?? <ImageIcon size={20} strokeWidth={1.5} /> }] });
    }
    for (const cat of ICON_CATEGORIES) {
      const items = ICON_LIBRARY.filter((i) => i.category === cat && match(i))
        .map((i) => ({ key: i.key, label: i.label, node: <i.Icon size={20} strokeWidth={1.5} aria-hidden /> }));
      if (items.length) out.push({ title: cat, items });
    }
    return out;
  }, [query, custom]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  // The tab stop: the selected icon if visible, else the first one.
  const tabKey = flat.some((i) => i.key === value) ? value : flat[0]?.key;

  function buttons(): HTMLButtonElement[] {
    return Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>("button[data-icon-key]") ?? []);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const all = buttons();
    const idx = all.indexOf(document.activeElement as HTMLButtonElement);
    if (idx < 0) return;
    let next = -1;
    if (e.key === "ArrowRight") next = Math.min(all.length - 1, idx + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, idx - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = all.length - 1;
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // Move to the nearest icon in the next/previous visual row.
      const cur = all[idx].getBoundingClientRect();
      const down = e.key === "ArrowDown";
      let best = -1, bestRow = Infinity, bestDx = Infinity;
      all.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const dy = down ? r.top - cur.top : cur.top - r.top;
        if (dy <= 4) return;
        const dx = Math.abs(r.left - cur.left);
        if (dy < bestRow - 4 || (Math.abs(dy - bestRow) <= 4 && dx < bestDx)) { best = i; bestRow = dy; bestDx = dx; }
      });
      next = best;
    } else return;
    e.preventDefault();
    if (next >= 0) all[next].focus();
  }

  const selected = value ? libraryIcon(value) : null;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-11 h-11 rounded-xl border border-ink bg-azzurro-soft text-azzurro-deep inline-flex items-center justify-center shrink-0" aria-hidden>
          {selected ? <selected.Icon size={22} strokeWidth={1.5} /> : (custom?.preview ?? <ImageIcon size={22} strokeWidth={1.5} />)}
        </span>
        <div className="min-w-0 text-sm">
          <p className="text-xs text-ink-muted">Selected</p>
          <p className="font-medium truncate">{selected ? selected.label : (custom?.label ?? "None")}</p>
        </div>
      </div>

      <label htmlFor={searchId} className="sr-only">Search icons</label>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" aria-hidden />
        <input
          id={searchId}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons — e.g. wine, teacher, online"
          className="w-full rounded-xl border border-line bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-azzurro-deep"
        />
      </div>

      <div ref={gridRef} role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="mt-3 max-h-80 overflow-y-auto pr-1 space-y-4">
        {groups.length === 0 && <p className="text-sm text-ink-muted py-6 text-center">No icons match “{query}”.</p>}
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-muted mb-1.5">{g.title}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
              {g.items.map((i) => {
                const on = i.key === value;
                const isDefault = defaultKey !== undefined && i.key === defaultKey;
                return (
                  <button
                    key={i.key || "__custom"}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={isDefault ? `${i.label} (default)` : i.label}
                    title={isDefault ? `${i.label} (default)` : i.label}
                    data-icon-key={i.key}
                    tabIndex={i.key === tabKey ? 0 : -1}
                    onClick={() => onChange(i.key)}
                    className={`relative h-11 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep ${on ? "border-ink bg-azzurro-soft text-azzurro-deep" : "border-line text-ink-muted hover:border-ink-muted hover:text-ink"}`}
                  >
                    <span className="w-6 h-6 inline-flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full">{i.node}</span>
                    {on && <Check size={11} strokeWidth={3} className="absolute top-0.5 right-0.5 text-azzurro-deep" aria-hidden />}
                    {isDefault && !on && <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-azzurro-deep" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {defaultKey !== undefined && <p className="mt-2 text-[11px] text-ink-muted"><span className="inline-block w-1.5 h-1.5 rounded-full bg-azzurro-deep align-middle mr-1" aria-hidden />marks the default</p>}
    </div>
  );
}

type ButtonProps = Omit<PickerProps, "autoFocus" | "className"> & {
  /** Dialog heading, e.g. the slot name. */
  title?: string;
  className?: string;
};

// Compact trigger that shows the current icon and opens the picker in a modal
// <dialog> (native focus trap + Esc). Choosing an icon closes it.
export function IconPickerButton({ title, className = "", ...picker }: ButtonProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const selected = picker.value ? libraryIcon(picker.value) : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLInputElement>("input[type=search]")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${title ?? picker.label ?? "Icon"}: ${selected ? selected.label : (picker.custom?.label ?? "none")}. Change icon`}
        className={`inline-flex items-center gap-2 rounded-xl border border-line bg-white pl-2 pr-2.5 py-1.5 text-sm hover:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep ${className}`}
      >
        <span className="w-8 h-8 rounded-lg bg-azzurro-soft text-azzurro-deep inline-flex items-center justify-center shrink-0 [&>svg]:max-w-5.5 [&>svg]:max-h-5.5" aria-hidden>
          {selected ? <selected.Icon size={18} strokeWidth={1.5} /> : (picker.custom?.preview ?? <ImageIcon size={18} strokeWidth={1.5} />)}
        </span>
        <span className="truncate max-w-36">{selected ? selected.label : (picker.custom?.label ?? "Choose")}</span>
        <ChevronDown size={14} className="text-ink-muted" aria-hidden />
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        aria-label={title ? `Choose icon — ${title}` : "Choose icon"}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white p-0 text-ink shadow-(--shadow-pop) backdrop:bg-ink/40"
      >
        {open && (
          <div className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold">{title ? <>Icon for <span className="text-azzurro-deep">{title}</span></> : "Choose an icon"}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 rounded-full inline-flex items-center justify-center text-ink-muted hover:bg-cream-2">
                <X size={16} />
              </button>
            </div>
            <IconPicker {...picker} autoFocus onChange={(k) => { picker.onChange(k); setOpen(false); }} />
          </div>
        )}
      </dialog>
    </>
  );
}
