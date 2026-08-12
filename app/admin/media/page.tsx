"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { Upload, Trash2, Copy, Check, ImageIcon } from "lucide-react";
import { listMedia, uploadMedia, updateMediaAlt, deleteMedia, type MediaSaveState } from "@/lib/media-actions";
import type { MediaRow } from "@/lib/db/schema";

function fmtSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMedia() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const reload = () =>
    listMedia()
      .then((r) => { setRows(r); setLoadErr(null); })
      .catch((e) => setLoadErr(/Not authorised/i.test(String(e?.message ?? e))
        ? "Sign in as an owner or manager (via /login) to manage media."
        : String(e?.message ?? e)));

  useEffect(() => { reload(); }, []);

  async function del(id: string, name: string) {
    if (!confirm(`Delete “${name}”? This removes it from storage and any page still using it will lose the image.`)) return;
    const res = await deleteMedia(id);
    if (res.error) alert(res.error);
    else reload();
  }

  return (
    <div className="max-w-5xl">
      <div>
        <p className="eyebrow">Admin · Media</p>
        <h1 className="mt-2 text-3xl md:text-4xl">Media Library.</h1>
        <p className="mt-3 text-ink-muted">Upload and manage images once, then reuse them anywhere on the site. Copy a URL to paste into any content field.</p>
      </div>

      <Uploader onUploaded={reload} />

      {loadErr && <p className="mt-8 text-sm text-rosso">{loadErr}</p>}

      <div className="mt-8">
        <p className="text-sm text-ink-muted mb-3">{rows.length} {rows.length === 1 ? "image" : "images"}</p>
        {rows.length === 0 && !loadErr && (
          <div className="frame bg-white p-10 text-center text-ink-muted">
            <ImageIcon size={28} className="mx-auto mb-3 opacity-40" />
            No images yet. Upload your first one above.
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rows.map((m) => <MediaCard key={m.id} m={m} onDelete={() => del(m.id, m.filename)} onSaved={reload} />)}
        </div>
      </div>
    </div>
  );
}

function Uploader({ onUploaded }: { onUploaded: () => void }) {
  const [state, action, pending] = useActionState<MediaSaveState, FormData>(uploadMedia, {});
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    }
  }, [state.ok]); // eslint-disable-line react-hooks/exhaustive-deps

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setPreview(null); return; }
    setPreview({ name: file.name, url: URL.createObjectURL(file) });
  }

  return (
    <form action={action} className="frame bg-cream-2/50 p-6 mt-6">
      <div className="flex items-center gap-5 flex-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview
          ? <img src={preview.url} alt="" className="w-20 h-20 rounded-xl object-cover border border-line shrink-0" />
          : <span className="w-20 h-20 rounded-xl border border-dashed border-line inline-flex items-center justify-center text-ink-soft shrink-0"><ImageIcon size={22} /></span>}

        <div className="flex-1 min-w-[14rem]">
          <label className="btn btn-ghost cursor-pointer py-2!">
            <Upload size={15} /> {preview ? "Choose a different image" : "Choose an image"}
            <input ref={inputRef} type="file" name="file" accept="image/*" onChange={onFile} className="sr-only" required />
          </label>
          <p className="mt-2 text-xs text-ink-muted">PNG, JPG, WEBP, GIF, SVG or AVIF · up to 10 MB.</p>
          {preview && <p className="mt-1 text-xs text-ink-muted truncate">{preview.name}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">
          Description <span className="text-ink-muted font-normal">(alt text — helps accessibility &amp; SEO)</span>
          <input name="alt" placeholder="e.g. Students at a Dante aperitivo night" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </label>
      </div>

      {state.error && <p className="mt-3 text-sm text-rosso">{state.error}</p>}

      <div className="mt-4">
        <button type="submit" disabled={pending || !preview} className="btn btn-primary disabled:opacity-50">
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

function MediaCard({ m, onDelete, onSaved }: { m: MediaRow; onDelete: () => void; onSaved: () => void }) {
  const [copied, setCopied] = useState(false);
  const [alt, setAlt] = useState(m.alt);
  const [editingAlt, setEditingAlt] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(m.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard may be blocked; ignore */ }
  }

  async function saveAlt() {
    setEditingAlt(false);
    if (alt !== m.alt) { await updateMediaAlt(m.id, alt); onSaved(); }
  }

  return (
    <div className="frame bg-white overflow-hidden flex flex-col">
      <div className="aspect-square bg-cream-2 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
        <button type="button" onClick={onDelete} aria-label="Delete image"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-ink-muted hover:text-rosso inline-flex items-center justify-center shadow-sm">
          <Trash2 size={15} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-xs font-medium truncate" title={m.filename}>{m.filename}</p>
        <p className="text-[11px] text-ink-muted">{fmtSize(m.size)}</p>

        {editingAlt ? (
          <input
            autoFocus value={alt} onChange={(e) => setAlt(e.target.value)}
            onBlur={saveAlt} onKeyDown={(e) => { if (e.key === "Enter") saveAlt(); if (e.key === "Escape") { setAlt(m.alt); setEditingAlt(false); } }}
            placeholder="Describe this image…"
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-line bg-white focus:outline-none focus:border-ink"
          />
        ) : (
          <button type="button" onClick={() => setEditingAlt(true)} className="text-left text-[11px] text-ink-muted hover:text-ink truncate">
            {alt ? `“${alt}”` : "+ Add description"}
          </button>
        )}

        <button type="button" onClick={copy} className="mt-1 btn btn-ghost text-xs py-1.5! justify-center">
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy URL</>}
        </button>
      </div>
    </div>
  );
}
