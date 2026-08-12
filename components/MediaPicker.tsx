"use client";
// Drop-in "Choose from library" button for any admin image field.
// Opens a modal to browse the Media Library, upload a new image (which is
// added to the library and selected), or paste an external URL.
// Calls onChange(url, alt?) with the chosen image.
import { useActionState, useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, X, Check, Link2 } from "lucide-react";
import { listMedia, uploadMedia, type MediaSaveState } from "@/lib/media-actions";
import type { MediaRow } from "@/lib/db/schema";

export default function MediaPicker({
  onChange,
  label = "Choose from library",
}: {
  onChange: (url: string, alt?: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost text-xs py-1.5!">
        <ImageIcon size={13} /> {label}
      </button>
      {open && (
        <MediaModal
          onClose={() => setOpen(false)}
          onPick={(url, alt) => { onChange(url, alt); setOpen(false); }}
        />
      )}
    </>
  );
}

function MediaModal({ onClose, onPick }: { onClose: () => void; onPick: (url: string, alt?: string) => void }) {
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState("");

  const reload = () =>
    listMedia()
      .then((r) => { setRows(r); setLoadErr(null); })
      .catch((e) => setLoadErr(/Not authorised/i.test(String(e?.message ?? e))
        ? "Sign in as an owner or manager to use the library."
        : "Couldn't load the library."));

  useEffect(() => { reload(); }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/50" role="dialog" aria-label="Media library" onClick={onClose}>
      <div className="bg-cream w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <p className="font-heading font-bold">Media Library</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink"><X size={18} /></button>
        </div>

        <div className="p-5 overflow-auto">
          <UploadRow onUploaded={(url) => onPick(url)} onList={reload} />

          {/* Paste an external URL (e.g. Unsplash) */}
          <div className="mt-4 flex items-end gap-2">
            <label className="flex-1 text-xs text-ink-muted">
              …or paste an image URL
              <div className="mt-1 flex gap-2">
                <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="https://…"
                  className="flex-1 h-10 px-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink font-mono text-xs" />
                <button type="button" disabled={!urlValue.trim()} onClick={() => onPick(urlValue.trim())}
                  className="btn btn-ghost text-xs py-2! disabled:opacity-40"><Link2 size={13} /> Use URL</button>
              </div>
            </label>
          </div>

          <div className="mt-5 border-t border-line pt-5">
            {loadErr && <p className="text-sm text-rosso">{loadErr}</p>}
            {!rows && !loadErr && <p className="text-sm text-ink-muted">Loading…</p>}
            {rows && rows.length === 0 && <p className="text-sm text-ink-muted">No images uploaded yet. Upload one above, or paste a URL.</p>}
            {rows && rows.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {rows.map((m) => (
                  <button key={m.id} type="button" onClick={() => onPick(m.url, m.alt || undefined)}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-line bg-cream-2 hover:ring-2 hover:ring-azzurro-deep"
                    title={m.filename}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Check size={20} className="text-white drop-shadow" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadRow({ onUploaded, onList }: { onUploaded: (url: string) => void; onList: () => void }) {
  const [state, action, pending] = useActionState<MediaSaveState, FormData>(uploadMedia, {});
  const [name, setName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      onList();
      if (state.url) onUploaded(state.url);  // auto-select the just-uploaded image
      setName(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [state.ok]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="flex items-center gap-3 flex-wrap">
      <label className="btn btn-ghost cursor-pointer text-xs py-2!">
        <Upload size={14} /> {name ? "Change file" : "Upload new"}
        <input ref={inputRef} type="file" name="file" accept="image/*" required className="sr-only"
          onChange={(e) => setName(e.target.files?.[0]?.name ?? null)} />
      </label>
      {name && <span className="text-xs text-ink-muted truncate max-w-[12rem]">{name}</span>}
      {name && <button type="submit" disabled={pending} className="btn btn-primary text-xs py-2!">{pending ? "Uploading…" : "Upload & use"}</button>}
      {state.error && <span className="text-xs text-rosso">{state.error}</span>}
    </form>
  );
}
