import "server-only";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { decryptSecret } from "@/lib/secret-box";
import { defaultSmtp, type SmtpSettings } from "@/lib/smtp-shared";

export const SMTP_KEY = "smtp";

export type StoredSmtp = SmtpSettings & { passwordEnc?: string; updatedBy?: string; updatedAt?: string };

export async function readSmtpStored(): Promise<StoredSmtp | null> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, SMTP_KEY));
    return row ? (row.data as StoredSmtp) : null;
  } catch {
    return null;
  }
}

export function isSmtpConfigured(s: StoredSmtp | null): boolean {
  return !!(s && s.host && s.user && s.passwordEnc && s.from);
}

// Send an email using the stored SMTP settings. Returns { ok:false } (never
// throws) so callers — including background notifications — can degrade quietly.
export async function sendMail(msg: { to: string; subject: string; text?: string; html?: string }): Promise<{ ok: boolean; error?: string }> {
  const s = await readSmtpStored();
  if (!isSmtpConfigured(s)) {
    return { ok: false, error: "Email isn't configured yet. Add SMTP settings in Admin → Settings → Email." };
  }
  let password = "";
  try {
    password = decryptSecret(s!.passwordEnc!);
  } catch {
    return { ok: false, error: "The stored SMTP password couldn't be read — please re-enter it in Email settings." };
  }
  const transport = nodemailer.createTransport({
    host: s!.host,
    port: s!.port || defaultSmtp.port,
    secure: !!s!.secure,
    auth: { user: s!.user, pass: password },
  });
  try {
    await transport.sendMail({ from: s!.from, to: msg.to, subject: msg.subject, text: msg.text, html: msg.html });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error)?.message?.slice(0, 300) || "The email couldn't be sent." };
  }
}
