"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShieldAlert, Send, Lock } from "lucide-react";
import { getSmtpSettings, saveSmtpSettings, sendTestEmail } from "@/lib/smtp-actions";
import type { SmtpPublic } from "@/lib/smtp-shared";

export default function EmailSettings() {
  const [s, setS] = useState<SmtpPublic | null>(null);
  const [denied, setDenied] = useState(false);
  const [password, setPassword] = useState("");   // write-only
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [testTo, setTestTo] = useState("");
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    getSmtpSettings()
      .then((v) => setS(v))
      .catch((e) => { if (/Not authorised/i.test(String(e?.message ?? e))) setDenied(true); else setErr("Couldn't load settings."); });
  }, []);

  function set<K extends keyof SmtpPublic>(k: K, v: SmtpPublic[K]) { setS((p) => (p ? { ...p, [k]: v } : p)); setSaved(false); }

  async function save() {
    if (!s) return;
    setSaving(true); setErr(null);
    try {
      const res = await saveSmtpSettings({ host: s.host, port: s.port, secure: s.secure, user: s.user, from: s.from, password: password || undefined });
      if (!res.ok) { setErr(res.error ?? "Couldn't save."); return; }
      setSaved(true);
      setPassword("");
      // reflect that a password now exists without exposing it
      setS((p) => (p ? { ...p, hasPassword: p.hasPassword || password.length > 0 } : p));
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  async function test() {
    setTesting(true); setTestMsg(null);
    try {
      const res = await sendTestEmail(testTo);
      setTestMsg(res.ok ? { ok: true, text: `Test email sent${testTo ? ` to ${testTo}` : ""}. Check the inbox (and spam).` } : { ok: false, text: res.error ?? "Send failed." });
    } finally { setTesting(false); }
  }

  if (denied) {
    return (
      <div className="max-w-3xl">
        <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to settings</Link>
        <div className="frame p-8 bg-white text-center">
          <Lock size={26} className="mx-auto text-ink-muted mb-3" />
          <p className="font-medium">Owner only</p>
          <p className="text-sm text-ink-muted mt-1">Email settings hold sensitive credentials, so only the site owner can view or change them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> Back to settings</Link>
      <p className="eyebrow">Admin · Settings · Email</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Email (SMTP).</h1>
      <p className="mt-3 text-ink-muted">Outgoing email settings for notifications and confirmations.</p>

      <div className="mt-5 frame p-4 bg-cream-2 flex items-start gap-3">
        <ShieldAlert size={18} className="text-azzurro-deep shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm space-y-1.5">
          <p><strong>These are sensitive credentials.</strong> They&apos;re stored <strong>encrypted</strong>, only the <strong>owner</strong> can see this page, and the password is <strong>write-only</strong> (never shown again after saving).</p>
          <p className="text-ink-muted">Use a <strong>dedicated, app-specific</strong> SMTP credential (not a personal mailbox password). For email to actually deliver, your domain also needs <strong>SPF, DKIM and DMARC</strong> DNS records — ask us for the exact values.</p>
        </div>
      </div>

      {!s ? (
        <p className="mt-8 text-sm text-ink-muted">Loading…</p>
      ) : (
        <>
          <div className="mt-6 frame p-6 md:p-8 bg-white space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm font-medium sm:col-span-2">SMTP host
                <input value={s.host} onChange={(e) => set("host", e.target.value)} placeholder="smtp.your-provider.com" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
              </label>
              <label className="text-sm font-medium">Port
                <input type="number" value={s.port} onChange={(e) => set("port", Number(e.target.value))} placeholder="587" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
              </label>
              <label className="text-sm font-medium flex flex-col justify-end">
                <span className="inline-flex items-center gap-2 h-11">
                  <input type="checkbox" checked={s.secure} onChange={(e) => set("secure", e.target.checked)} className="w-4 h-4" />
                  <span className="font-normal">Use SSL/TLS (port 465)</span>
                </span>
              </label>
              <label className="text-sm font-medium">Username
                <input value={s.user} onChange={(e) => set("user", e.target.value)} placeholder="apikey / user@domain" autoComplete="off" className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
              </label>
              <label className="text-sm font-medium">Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={s.hasPassword ? "•••••••• (leave blank to keep)" : "SMTP password / API key"}
                  autoComplete="new-password"
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
              </label>
              <label className="text-sm font-medium sm:col-span-2">From address
                <input value={s.from} onChange={(e) => set("from", e.target.value)} placeholder='La Dante <no-reply@ladante.cc>' className="mt-1 w-full h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink font-normal" />
              </label>
            </div>

            {err && <p className="text-sm text-rosso">{err}</p>}
            <div className="flex items-center gap-3 border-t border-line pt-5">
              <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save settings"}</button>
              <span className={`text-sm inline-flex items-center gap-1 transition-opacity ${saved ? "opacity-100 text-azzurro-deep" : "opacity-0"}`}><Check size={14} /> Saved.</span>
              {s.updatedBy && <span className="text-xs text-ink-muted ml-auto">Last changed by {s.updatedBy}</span>}
            </div>
          </div>

          {/* Test */}
          <div className="mt-4 frame p-6 bg-white">
            <p className="text-sm font-medium">Send a test email</p>
            <p className="text-xs text-ink-muted mt-0.5">Save your settings first, then send a test to confirm they work.</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@email.com (defaults to your account)" className="flex-1 min-w-[14rem] h-11 px-3 rounded-xl border border-line bg-white focus:outline-none focus:border-ink text-sm" />
              <button type="button" onClick={test} disabled={testing} className="btn btn-ghost disabled:opacity-50"><Send size={15} /> {testing ? "Sending…" : "Send test"}</button>
            </div>
            {testMsg && <p className={`mt-3 text-sm ${testMsg.ok ? "text-azzurro-deep" : "text-rosso"}`}>{testMsg.text}</p>}
          </div>
        </>
      )}
    </div>
  );
}
