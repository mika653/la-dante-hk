"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, ExternalLink, Upload } from "lucide-react";
import {
  listPrivileges,
  createPrivilege,
  deletePrivilege,
  type SaveState,
} from "@/lib/privilege-actions";
import type { PrivilegeRow, Social } from "@/lib/db/schema";

const SEED_CATEGORIES = ["Dining", "E-Shop", "Wines", "Shopping", "Culture & travel", "Services"];
const SOCIAL_PLATFORMS = [
  "Facebook", "Instagram", "WhatsApp", "YouTube", "LinkedIn", "X (Twitter)",
  "TikTok", "WeChat", "Threads", "Telegram", "Pinterest", "Snapchat",
  "Weibo", "Xiaohongshu (RED)", "LINE", "Spotify",
];
const OTHER = "Other…";
const MAX_LOGO_BYTES = 1_000_000; // 1 MB before base64

export default function AdminPrivileges() {
  const [rows, setRows] = useState<PrivilegeRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reload = () =>
    listPrivileges()
      .then((r) => { setRows(r); setLoadErr(null); })
      .catch((e) => setLoadErr(/Not authorised/i.test(String(e?.message ?? e))
        ? "Sign in as an owner or manager (via /login) to manage privileges."
        : String(e?.message ?? e)));

  useEffect(() => { reload(); }, []);

  // Categories staff have used before — offered as suggestions, but they can type a new one.
  const knownCategories = useMemo(() => {
    const set = new Set(SEED_CATEGORIES);
    for (const r of rows) if (r.category) set.add(r.category);
    return [...set];
  }, [rows]);

  async function del(id: string, brand: string) {
    if (!confirm(`Remove “${brand}” from member perks?`)) return;
    const res = await deletePrivilege(id);
    if (res.error) alert(res.error);
    else reload();
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Admin · Privileges</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Privileges.</h1>
          <p className="mt-3 text-ink-muted">Partner brands and the discounts members get. These power the perks directory on the membership page.</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn btn-primary shrink-0">
          <Plus size={16} /> Add privilege
        </button>
      </div>

      {showForm && <AddForm categories={knownCategories} onDone={() => { setShowForm(false); reload(); }} onCancel={() => setShowForm(false)} />}

      {loadErr && <p className="mt-8 text-sm text-rosso">{loadErr}</p>}

      <div className="mt-8 grid gap-3">
        {rows.length === 0 && !loadErr && (
          <p className="text-ink-muted text-sm">No privileges yet. Add your first partner with the button above.</p>
        )}
        {rows.map((p) => (
          <div key={p.id} className="frame bg-white p-4 flex items-center gap-4">
            <Logo logo={p.logo} brand={p.brand} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{p.brand}</span>
                <span className="text-[11px] uppercase tracking-wider text-azzurro-deep bg-azzurro-soft rounded px-1.5 py-0.5">{p.category}</span>
              </div>
              <p className="text-sm text-ink-muted truncate">{p.discount}</p>
            </div>
            {p.website && (
              <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-ink" aria-label="Open website">
                <ExternalLink size={16} />
              </a>
            )}
            <button type="button" onClick={() => del(p.id, p.brand)} className="text-ink-muted hover:text-rosso" aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Logo({ logo, brand }: { logo: string | null; brand: string }) {
  const initials = brand.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" className="w-11 h-11 rounded-full object-contain bg-white border border-line shrink-0" />;
  }
  return (
    <span className="w-11 h-11 rounded-full bg-ink text-cream inline-flex items-center justify-center text-xs font-semibold shrink-0">
      {initials}
    </span>
  );
}

function AddForm({ categories, onDone, onCancel }: { categories: string[]; onDone: () => void; onCancel: () => void }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(createPrivilege, {});
  const [logo, setLogo] = useState<string>("");     // data URL
  const [logoErr, setLogoErr] = useState<string | null>(null);
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => { if (state.ok) onDone(); }, [state.ok]); // eslint-disable-line react-hooks/exhaustive-deps

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setLogoErr(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setLogoErr("Please choose an image file."); return; }
    if (file.size > MAX_LOGO_BYTES) { setLogoErr("Image is too large — keep it under 1 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  const addSocial = () => setSocials((s) => [...s, { platform: SOCIAL_PLATFORMS[0], url: "" }]);
  const setSocial = (i: number, patch: Partial<Social>) => setSocials((s) => s.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const removeSocial = (i: number) => setSocials((s) => s.filter((_, idx) => idx !== i));

  const cleanSocials = socials.filter((s) => s.platform.trim() && s.url.trim());

  return (
    <form action={action} className="frame bg-cream-2/50 p-6 mt-6 relative">
      <button type="button" onClick={onCancel} className="absolute top-4 right-4 text-ink-muted hover:text-ink" aria-label="Close"><X size={18} /></button>
      <h2 className="text-lg font-heading font-bold">New privilege</h2>

      {/* Hidden inputs carrying the logo data URL + serialised socials into the action */}
      <input type="hidden" name="logo" value={logo} />
      <input type="hidden" name="socials" value={JSON.stringify(cleanSocials)} />

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        {/* Logo upload */}
        <div className="md:col-span-2">
          <p className="text-sm font-medium">Logo</p>
          <div className="mt-1 flex items-center gap-4">
            <LogoPreview logo={logo} />
            <div>
              <label className="btn btn-ghost cursor-pointer py-2!">
                <Upload size={15} /> {logo ? "Replace" : "Upload logo"}
                <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
              </label>
              {logo && <button type="button" onClick={() => setLogo("")} className="ml-3 text-sm text-ink-muted hover:text-rosso">Remove</button>}
              <p className="mt-1 text-xs text-ink-muted">PNG or JPG, under 1 MB.</p>
            </div>
          </div>
          {logoErr && <p className="mt-2 text-sm text-rosso">{logoErr}</p>}
        </div>

        <Field label="Brand name *" name="brand" required placeholder="Alice Pizza" />
        <CategoryField categories={categories} />

        <Field label="Discount details *" name="discount" required placeholder="10% discount on à la carte menu" className="md:col-span-2" />
        <Field label="Fine print (optional)" name="note" placeholder="The offer cannot be combined with other promotions" className="md:col-span-2" />
        <Field label="Address" name="address" placeholder="G/F, 92 Queen's Road East, Wan Chai" className="md:col-span-2" />
        <Field label="Contact number" name="phone" placeholder="+852 2518 3502" />
        <Field label="Website" name="website" placeholder="https://www.alicepizzahk.com" />

        {/* Social links */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Social media</p>
            <button type="button" onClick={addSocial} className="text-sm text-azzurro-deep hover:underline inline-flex items-center gap-1"><Plus size={14} /> Add social</button>
          </div>
          {socials.length === 0 && <p className="mt-1 text-xs text-ink-muted">Add Facebook, Instagram, or any other platform.</p>}
          <div className="mt-2 space-y-2">
            {socials.map((s, i) => {
              const isCustom = !SOCIAL_PLATFORMS.includes(s.platform);
              return (
                <div key={i} className="flex gap-2 flex-wrap">
                  <select
                    value={isCustom ? OTHER : s.platform}
                    onChange={(e) => setSocial(i, { platform: e.target.value === OTHER ? "" : e.target.value })}
                    className="w-40 h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm"
                  >
                    {SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                    <option value={OTHER}>{OTHER}</option>
                  </select>
                  {isCustom && (
                    <input
                      value={s.platform}
                      onChange={(e) => setSocial(i, { platform: e.target.value })}
                      placeholder="Platform name"
                      className="w-40 h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm"
                    />
                  )}
                  <input
                    value={s.url}
                    onChange={(e) => setSocial(i, { url: e.target.value })}
                    placeholder="https://…"
                    className="flex-1 min-w-[12rem] h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm"
                  />
                  <button type="button" onClick={() => removeSocial(i)} className="text-ink-muted hover:text-rosso px-2" aria-label="Remove social"><X size={16} /></button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {state.error && <p className="mt-4 text-sm text-rosso">{state.error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">{pending ? "Saving…" : "Save privilege"}</button>
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
      </div>
    </form>
  );
}

function LogoPreview({ logo }: { logo: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="Logo preview" className="w-14 h-14 rounded-full object-contain bg-white border border-line shrink-0" />;
  }
  return <span className="w-14 h-14 rounded-full border border-dashed border-line inline-flex items-center justify-center text-ink-soft shrink-0"><Upload size={18} /></span>;
}

const NEW_CATEGORY = "+ Add new category…";

function CategoryField({ categories }: { categories: string[] }) {
  const [value, setValue] = useState(categories[0] ?? "Dining");
  const [adding, setAdding] = useState(false);

  return (
    <label className="text-sm font-medium">
      Category *
      {/* Always submits the resolved category value */}
      <input type="hidden" name="category" value={value} />
      <select
        value={adding ? NEW_CATEGORY : value}
        onChange={(e) => {
          if (e.target.value === NEW_CATEGORY) { setAdding(true); setValue(""); }
          else { setAdding(false); setValue(e.target.value); }
        }}
        className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink"
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        <option value={NEW_CATEGORY}>{NEW_CATEGORY}</option>
      </select>
      {adding && (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="New category name"
          className="mt-2 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink"
        />
      )}
    </label>
  );
}

function Field({ label, name, required, placeholder, className = "" }: { label: string; name: string; required?: boolean; placeholder?: string; className?: string }) {
  return (
    <label className={`text-sm font-medium ${className}`}>
      {label}
      <input name={name} required={required} placeholder={placeholder} className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
    </label>
  );
}
