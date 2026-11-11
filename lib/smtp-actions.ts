"use server";
// SMTP settings — managed by the school's admins (owner or manager), e.g. Bill.
// DFB deliberately does not hold the mail credentials. The password is encrypted
// at rest (secret-box) and never returned to the browser (the form only learns
// whether one is set).

import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { encryptSecret } from "@/lib/secret-box";
import { normaliseSmtpInput, defaultSmtp, type SmtpInput, type SmtpLoad } from "@/lib/smtp-shared";
import { readSmtpStored, SMTP_KEY, sendMail } from "@/lib/mailer";

export async function getSmtpSettings(): Promise<SmtpLoad> {
  try {
    await requireAdminFresh(); // the school's admins (owner or manager) may manage email
  } catch {
    return { ok: false, reason: "forbidden" };
  }
  try {
    const s = await readSmtpStored();
    return {
      ok: true,
      settings: {
        host: s?.host ?? defaultSmtp.host,
        port: s?.port ?? defaultSmtp.port,
        secure: s?.secure ?? defaultSmtp.secure,
        user: s?.user ?? defaultSmtp.user,
        from: s?.from ?? defaultSmtp.from,
        hasPassword: !!s?.passwordEnc,
        updatedBy: s?.updatedBy ?? "",
        updatedAt: s?.updatedAt ?? null,
      },
    };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function saveSmtpSettings(input: SmtpInput): Promise<{ ok: boolean; error?: string }> {
  let user;
  try {
    user = await requireAdminFresh();
  } catch {
    return { ok: false, error: "You need to be signed in as an admin to change email settings." };
  }
  const clean = normaliseSmtpInput(input);
  const existing = await readSmtpStored();

  // Keep the stored (encrypted) password unless a new, non-empty one was typed.
  let passwordEnc = existing?.passwordEnc ?? "";
  if (clean.password && clean.password.length > 0) passwordEnc = encryptSecret(clean.password);

  const data = {
    host: clean.host,
    port: clean.port,
    secure: clean.secure,
    user: clean.user,
    from: clean.from,
    passwordEnc,
    updatedBy: user.name || user.email || "",
    updatedAt: new Date().toISOString(),
  };

  await db
    .insert(siteConfig)
    .values({ key: SMTP_KEY, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data, updatedAt: new Date() } });

  return { ok: true };
}

export async function sendTestEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  let user;
  try {
    user = await requireAdminFresh();
  } catch {
    return { ok: false, error: "You need to be signed in as an admin to send a test email." };
  }
  const target = (to || user.email || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(target)) {
    return { ok: false, error: "Enter a valid email address to send the test to." };
  }
  return sendMail({
    to: target,
    subject: "La Dante — SMTP test email",
    text: "This is a test email from your La Dante website. If you received it, your SMTP settings are working.",
    html: "<p>This is a test email from your <strong>La Dante</strong> website.</p><p>If you received it, your SMTP settings are working. ✅</p>",
  });
}
