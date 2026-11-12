"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiry-actions";

const SUBJECTS = ["課程查詢", "私人課堂", "企業培訓", "PLIDA 考試", "會員", "其他"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setErr(null);
    try {
      const fd = new FormData();
      fd.set("type", "general");
      fd.set("sourcePath", "/zh/contact");
      fd.set("name", name.trim());
      fd.set("email", email.trim());
      fd.set("message", `主題：${subject}\n\n${message.trim()}`);
      const res = await submitEnquiry({}, fd);
      if (res.ok) setDone(true);
      else setErr(res.error ?? "抱歉，發生錯誤，請直接電郵聯絡我們。");
    } catch {
      setErr("抱歉，發生錯誤，請直接電郵聯絡我們。");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="frame p-8 bg-sole-soft text-center">
        <span className="w-10 h-10 rounded-full bg-azzurro text-cream inline-flex items-center justify-center"><Check size={16} /></span>
        <h3 className="mt-3 text-xl font-semibold">多謝您，我們會盡快聯絡您。</h3>
        <p className="mt-2 text-sm text-ink-muted">您的訊息已送達辦公室,我們會以電郵回覆。</p>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="frame p-6 md:p-8 bg-white space-y-4">
      <h2 className="text-2xl font-semibold">給我們留言</h2>
      <label className="block text-sm font-medium">姓名<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">電郵<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">主題<select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="block text-sm font-medium">訊息<textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      {err && <p className="text-sm text-rosso">{err}</p>}
      <button type="submit" disabled={sending} className="btn btn-primary w-full disabled:opacity-50">{sending ? "發送中…" : "發送訊息"}</button>
    </form>
  );
}
