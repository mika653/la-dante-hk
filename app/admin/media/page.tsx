"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Trash2, Copy, Check, ImageIcon, FileText, Search, ExternalLink } from "lucide-react";
import { listMedia, recordMedia, updateMediaAlt, deleteMedia } from "@/lib/media-actions";
import type { MediaRow } from "@/lib/db/schema";
import { isImage, fmtSize, type MediaKind } from "@/lib/media-shared";

export default function AdminMedia() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<MediaKind>("all");

  const reload = () =>
    listMedia()
      .then((r) => { setRows(r); setLoadErr(null); })
      .catch((e) => setLoadErr(/Not authorised/i.test(String(e?.message ?? e))
        ? "Sign in as an owner or manager (via /login) to manage media."
        : String(e?.message ?? e)));

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((m) => {
      if (kind === "image" && !isImage(m.contentType)) return false;
      if (kind === "document" && isImage(m.contentType)) return false;
      if (q && !(`${m.filename} ${m.alt}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, query, kind]);

  const counts = useMemo(() => ({
    all: rows.length,
    image: rows.filter((m) => isImage(m.contentType)).length,
    document: rows.filter((m) => !isImage(m.contentType)).length,
  }), [rows]);

  async function del(id: string, name: string) {
    if (!confirm(`Delete “${name}”? This removes it from storage and any page still using it will lose the file.`)) return;
    const res = await deleteMedia(id);
    if (res.error) alert(res.error);
    else reload();
  }

  return (
    <div className="max-w-5xl">
      <div>
        <p className="eyebrow">Admin · Media</p>
        <h1 className="mt-2 text-3xl md:text-4xl">Media Library.</h1>
        <p className="mt-3 text-ink-muted">Upload and manage images and documents (PDFs) once, then reuse them anywhere. Copy a file&apos;s URL to paste into any content field or link.</p>
      </div>

      <Uploader onUploaded={reload} />

      {loadErr && <p className="mt-8 text-sm text-rosso">{loadErr}</p>}

      {/* Toolbar: search + Images/Documents filter */}
      <div className="mt-8 flex flex-wrap items-center gap-3 justify-between">
        <div className="inline-flex rounded-lg border border-line bg-white p-0.5 text-sm">
          {(["all", "image", "document"] as MediaKind[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)}
              className={`px-3 py-1.5 rounded-md capitalize ${kind === k ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"}`}>
              {k === "all" ? "All" : k === "image" ? "Images" : "Documents"} <span className="opacity-60">{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…"
            className="w-56 h-10 pl-9 pr-3 rounded-lg border border-line bg-white focus:outline-none focus:border-ink text-sm" />
        </div>
      </div>

      <div className="mt-5">
        {filtered.length === 0 && !loadErr && (
          <div className="frame bg-white p-10 text-center text-ink-muted">
            <ImageIcon size={28} className="mx-auto mb-3 opacity-40" />
            {rows.length === 0 ? "No files yet. Upload your first one above." : "Nothing matches that filter."}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((m) => <MediaCard key={m.id} m={m} onDelete={() => del(m.id, m.filename)} onSaved={reload} />)}
        </div>
      </div>
    </div>
  );
}

function Uploader({ onUploaded }: { onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setErr(null);
    setFile(f);
    setPreviewUrl(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const blob = await upload(file.name, file, { access: "public", handleUploadUrl: "/api/media/upload" });
      const res = await recordMedia({
        url: blob.url, pathname: blob.pathname, filename: file.name,
        alt, contentType: file.type || blob.contentType || "", size: file.size,
      });
      if (res.error) { setErr(res.error); return; }
      setFile(null); setPreviewUrl(null); setAlt("");
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (e2) {
      const msg = String((e2 as Error)?.message ?? e2);
      setErr(/401|Unauthorized|Not authorised/i.test(msg) ? "Sign in as an owner or manager to upload." : "Upload failed — please try again.");
    } finally { setBusy(false); }
  }

  const isPdf = file && !file.type.startsWith("image/");

  return (
    <form onSubmit={submit} className="frame bg-cream-2/50 p-6 mt-6">
      <div className="flex items-center gap-5 flex-wrap">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-line shrink-0" />
        ) : isPdf ? (
          <span className="w-20 h-20 rounded-xl border border-line bg-white inline-flex items-center justify-center text-azzurro-deep shrink-0"><FileText size={22} /></span>
        ) : (
          <span className="w-20 h-20 rounded-xl border border-dashed border-line inline-flex items-center justify-center text-ink-soft shrink-0"><Upload size={22} /></span>
        )}

        <div className="flex-1 min-w-[14rem]">
          <label className="btn btn-ghost cursor-pointer py-2!">
            <Upload size={15} /> {file ? "Choose a different file" : "Choose a file"}
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif,application/pdf" onChange={onFile} className="sr-only" />
          </label>
          <p className="mt-2 text-xs text-ink-muted">Images (JPG, PNG, WEBP, SVG, GIF, AVIF) or PDF · up to 25 MB.</p>
          {file && <p className="mt-1 text-xs text-ink-muted truncate">{file.name} · {fmtSize(file.size)}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">
          Description <span className="text-ink-muted font-normal">(alt text for images / a label for documents)</span>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Autumn 2026 course brochure" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </label>
      </div>

      {err && <p className="mt-3 text-sm text-rosso">{err}</p>}

      <div className="mt-4">
        <button type="submit" disabled={busy || !file} className="btn btn-primary disabled:opacity-50">
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

function MediaCard({ m, onDelete, onSaved }: { m: MediaRow; onDelete: () => void; onSaved: () => void }) {
  const [copied, setCopied] = useState(false);
  const [alt, setAlt] = useState(m.alt);
  const [editingAlt, setEditingAlt] = useState(false);
  const image = isImage(m.contentType);

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
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
        ) : (
          <a href={m.url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center gap-2 text-azzurro-deep hover:bg-cream-2/70" title="Open document">
            <FileText size={34} />
            <span className="text-[11px] uppercase tracking-wider font-medium">{(m.contentType.split("/")[1] || "file").toUpperCase()}</span>
          </a>
        )}
        <button type="button" onClick={onDelete} aria-label="Delete file"
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
            placeholder={image ? "Describe this image…" : "Label this document…"}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-line bg-white focus:outline-none focus:border-ink"
          />
        ) : (
          <button type="button" onClick={() => setEditingAlt(true)} className="text-left text-[11px] text-ink-muted hover:text-ink truncate">
            {alt ? `“${alt}”` : "+ Add description"}
          </button>
        )}

        <div className="mt-1 flex gap-1.5">
          <button type="button" onClick={copy} className="flex-1 btn btn-ghost text-xs py-1.5! justify-center">
            {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy URL</>}
          </button>
          {!image && (
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs py-1.5! px-2!" aria-label="Open document"><ExternalLink size={13} /></a>
          )}
        </div>
      </div>
    </div>
  );
}
