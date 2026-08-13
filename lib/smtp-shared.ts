// SMTP settings — shared types. The password is never sent to the browser;
// the form only reports whether one is stored (hasPassword) and can set a new
// one (password on input, write-only).

export type SmtpSettings = {
  host: string;
  port: number;
  secure: boolean;   // true = implicit TLS (port 465); false = STARTTLS (587/25)
  user: string;
  from: string;      // "Name <email@domain>" or a bare address
};

export type SmtpPublic = SmtpSettings & { hasPassword: boolean; updatedBy: string; updatedAt: string | null };

export type SmtpInput = SmtpSettings & { password?: string }; // password optional — omit to keep the stored one

export const defaultSmtp: SmtpSettings = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  from: "",
};

export function normaliseSmtpInput(parsed: unknown): SmtpInput {
  const p = (parsed ?? {}) as Partial<SmtpInput>;
  const s = (v: unknown, max: number) => (typeof v === "string" ? v : "").trim().slice(0, max);
  let port = Number(p.port);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) port = 587;
  return {
    host: s(p.host, 200),
    port,
    secure: !!p.secure,
    user: s(p.user, 200),
    from: s(p.from, 200),
    password: typeof p.password === "string" ? p.password.slice(0, 400) : undefined,
  };
}
