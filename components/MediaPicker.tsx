"use client";
// Drop-in "Choose from library" button for any admin image/file field.
// Opens a modal to browse the Media Library, upload a new file (added to the
// library and selected), or paste an external URL. Calls onChange(url, alt?).
// Pass accept="image" to restrict to images (e.g. the hero carousel).
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { upload } from "@vercel/blob/client";
import { ImageIcon, Upload, X, Check, Link2, FileText, Search } from "lucide-react";
import { listMedia, recordMedia } from "@/lib/media-actions";
import type { MediaRow } from "@/lib/db/schema";
import { isImage } from "@/lib/media-shared";

export default function MediaPicker({
  onChange,
  label = "Choose from library",
  accept = "all",
}: {
  onChange: (url: string, alt?: string) => void;
  label?: string;
  accept?: "image" | "all";
}) {
  const [open, setOpen] = useState(false);
  // The modal contains its own upload <form>. MediaPicker is often used INSIDE
  // another form (e.g. the new-event form), and a nested form flattens in the
  // DOM so the upload button ends up submitting the OUTER form — which made the
  // event form save-and-close mid-way ("pops out"). Portalling the modal to
  // <body> takes it out of any surrounding form, so that can't happen.
  const modal = open ? (
    <MediaModal
      accept={accept}
      onClose={() => setOpen(false)}
      onPick={(url, alt) => { onChange(url, alt); setOpen(false); }}
    />
  ) : null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost text-xs py-1.5!">
        <ImageIcon size={13} /> {label}
      </button>
      {modal && typeof document !== "undefined" ? createPortal(modal, document.body) : null}
    </>
  );
}

function MediaModal({ accept, onClose, onPick }: { accept: "image" | "all"; onClose: () => void; onPick: (url: string, alt?: string) => void }) {
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const [query, setQuery] = useState("");

  const reload = () =>
    listMedia()
      .then((r) => { setRows(r); setLoadErr(null); })
      .catch((e) => setLoadErr(/Not authorised/i.test(String(e?.message ?? e))
        ? "Sign in as an owner or manager to use the library."
        : "Couldn't load the library."));

  useEffect(() => { reload(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((m) => {
      if (accept === "image" && !isImage(m.contentType)) return false;
      if (q && !(`${m.filename} ${m.alt}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, query, accept]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/50" role="dialog" aria-label="Media library" onClick={onClose}>
      <div className="bg-cream w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <p className="font-heading font-bold">Media Library</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink"><X size={18} /></button>
        </div>

        <div className="p-5 overflow-auto">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <UploadRow accept={accept} onUploaded={(url) => onPick(url)} onList={reload} />
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                className="w-44 h-9 pl-8 pr-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm" />
            </div>
          </div>

          {/* Paste an external URL */}
          <div className="mt-4 flex items-end gap-2">
            <label className="flex-1 text-xs text-ink-muted">
              …or paste a URL
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
            {rows && filtered.length === 0 && <p className="text-sm text-ink-muted">{rows.length === 0 ? "No files yet. Upload one above, or paste a URL." : "Nothing matches."}</p>}
            {filtered.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filtered.map((m) => {
                  const image = isImage(m.contentType);
                  return (
                    <button key={m.id} type="button" onClick={() => onPick(m.url, m.alt || undefined)}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-line bg-cream-2 hover:ring-2 hover:ring-azzurro-deep"
                      title={m.filename}>
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex flex-col items-center justify-center gap-1 text-azzurro-deep p-2">
                          <FileText size={26} />
                          <span className="text-[10px] truncate max-w-full">{m.filename}</span>
                        </span>
                      )}
                      <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Check size={20} className="text-white drop-shadow" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCEPT_IMAGE = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif,image/heic,image/heif,image/x-icon,image/vnd.microsoft.icon,.heic,.heif";
const ACCEPT_ALL = ACCEPT_IMAGE + ",application/pdf,.pdf";

function UploadRow({ accept, onUploaded, onList }: { accept: "image" | "all"; onUploaded: (url: string) => void; onList: () => void }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Upload every selected file (HEIC included), one after another. A single file
  // is auto-selected into the field; several just land in the library for the
  // admin to pick from the grid.
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const files = Array.from(fileRef.current?.files ?? []);
    if (files.length === 0) return;
    setBusy(true); setErr(null);
    let firstUrl: string | null = null;
    let done = 0;
    try {
      for (const file of files) {
        setProgress(files.length > 1 ? `Uploading ${done + 1}/${files.length}…` : "Uploading…");
        const blob = await upload(file.name, file, { access: "public", handleUploadUrl: "/api/media/upload" });
        const res = await recordMedia({
          url: blob.url, pathname: blob.pathname, filename: file.name,
          alt: "", contentType: file.type || blob.contentType || "", size: file.size,
        });
        if (res.error) { setErr(res.error); break; }
        if (!firstUrl && res.url) firstUrl = res.url;
        done++;
      }
      onList();
      // Auto-select only when a single file was uploaded; a batch stays in the grid.
      if (files.length === 1 && firstUrl) onUploaded(firstUrl);
      setCount(0);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e2) {
      const m = String((e2 as Error)?.message ?? e2);
      if (/401|Unauthorized|Not authoris/i.test(m)) setErr("Sign in as an owner or manager to upload.");
      else if (/content.?type|not allowed|allowedContentTypes/i.test(m)) setErr("That file type isn't supported — use PNG, JPG, HEIC, SVG, WEBP, GIF or PDF.");
      else if (/size|too large|maximum/i.test(m)) setErr("That file is too large (max 25 MB each).");
      else setErr(`Upload failed: ${m}`);
    } finally { setBusy(false); setProgress(null); }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 flex-wrap">
      <label className="btn btn-ghost cursor-pointer text-xs py-2!">
        <Upload size={14} /> {count > 0 ? "Change files" : "Upload new"}
        <input ref={fileRef} type="file" multiple
          accept={accept === "image" ? ACCEPT_IMAGE : ACCEPT_ALL}
          required className="sr-only" onChange={(e) => setCount(e.target.files?.length ?? 0)} />
      </label>
      {count > 0 && <span className="text-xs text-ink-muted truncate max-w-[12rem]">{count === 1 ? fileRef.current?.files?.[0]?.name : `${count} files`}</span>}
      {count > 0 && <button type="submit" disabled={busy} className="btn btn-primary text-xs py-2!">{busy ? (progress ?? "Uploading…") : `Upload${count > 1 ? " all" : " & use"}`}</button>}
      {err && <span className="text-xs text-rosso">{err}</span>}
    </form>
  );
}
