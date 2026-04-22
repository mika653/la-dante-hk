"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Mail } from "lucide-react";
import { addPerson, type EmploymentType, type PersonRole, type SubjectArea } from "@/lib/people-store";

const SUBJECT_OPTIONS: Array<{ v: SubjectArea; l: string }> = [
  { v: "italian", l: "Italian" },
  { v: "latin", l: "Latin" },
  { v: "plida-prep", l: "PLIDA prep" },
  { v: "kids", l: "Kids & teens" },
];

export default function NewPerson() {
  const router = useRouter();
  const [role, setRole] = useState<PersonRole>("teacher");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("freelance");
  const [subjects, setSubjects] = useState<SubjectArea[]>(["italian"]);
  const [startDate, setStartDate] = useState("");
  const [created, setCreated] = useState<{ token: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleSubject(v: SubjectArea) {
    setSubjects((list) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const person = addPerson({
      role, firstName, lastName, email, phone: phone || undefined,
      employmentType, subjects, startDate: startDate || undefined,
    });
    setCreated({ token: person.inviteToken, id: person.id });
  }

  const inviteUrl = created ? (typeof window !== "undefined" ? window.location.origin : "") + `/onboarding/${created.token}` : "";

  function copyLink() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (created) {
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Welcome to La Dante HK — your onboarding link")}&body=${encodeURIComponent(`Benvenuto/a ${firstName},\n\nPlease complete your onboarding here:\n${inviteUrl}\n\nIt takes about 15–20 minutes. You can stop and return any time.\n\nA presto,\nLa Dante HK`)}`;
    return (
      <div className="max-w-2xl">
        <Link href="/admin/people" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All people</Link>
        <div className="frame p-8 md:p-10 bg-white text-center">
          <div className="w-14 h-14 rounded-full bg-sole mx-auto inline-flex items-center justify-center"><Check size={22} /></div>
          <h1 className="mt-6 text-2xl md:text-3xl">Invite created for {firstName}.</h1>
          <p className="mt-3 text-ink-muted">Send them this link — they&apos;ll complete their personal details, documents, agreements, and training. You&apos;ll get a notification when they submit.</p>

          <div className="mt-6 p-4 rounded-xl border border-line bg-cream-2/50 flex items-center gap-3">
            <code className="flex-1 font-mono text-xs text-left truncate">{inviteUrl}</code>
            <button type="button" onClick={copyLink} className="btn btn-ghost !h-9 !px-4 !text-xs"><Copy size={13} /> {copied ? "Copied!" : "Copy"}</button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={mailto} className="btn btn-primary"><Mail size={14} /> Email link to {firstName}</a>
            <Link href={`/onboarding/${created.token}`} target="_blank" rel="noopener" className="btn btn-ghost">Open as hire <ExternalLink size={13} /></Link>
            <Link href={`/admin/people/${created.id}`} className="btn btn-ghost">View record</Link>
          </div>

          <p className="mt-6 text-xs text-ink-muted italic">Demo mode — nothing is actually emailed. The mailto link opens your mail client so you can see the pre-filled message.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/people" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All people</Link>
      <p className="eyebrow">Admin · People · Invite</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Invite a new person.</h1>
      <p className="mt-2 text-ink-muted">Just the essentials — they&apos;ll fill in the rest themselves via the self-service link you&apos;ll share.</p>

      <form onSubmit={submit} className="mt-8 frame p-6 md:p-8 bg-white space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <div className="flex gap-2">
            {(["teacher", "staff", "contractor"] as PersonRole[]).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`px-5 py-2.5 rounded-full border capitalize ${role === r ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm font-medium">First name<input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          <label className="text-sm font-medium">Last name<input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          <label className="text-sm font-medium">Work email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="first.last@ladante.cc" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
          <label className="text-sm font-medium">Phone <span className="text-ink-muted font-normal">(optional)</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+852 …" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Employment type</label>
          <div className="flex gap-2">
            {(["employee", "freelance", "intern"] as EmploymentType[]).map((t) => (
              <button key={t} type="button" onClick={() => setEmploymentType(t)} className={`px-5 py-2.5 rounded-full border capitalize ${employmentType === t ? "bg-ink text-cream border-ink" : "border-line hover:border-ink-muted"}`}>{t}</button>
            ))}
          </div>
        </div>

        {role === "teacher" && (
          <div>
            <label className="block text-sm font-medium mb-2">Subjects / specialties</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((s) => {
                const on = subjects.includes(s.v);
                return <button key={s.v} type="button" onClick={() => toggleSubject(s.v)} className={`px-4 py-2 rounded-full border text-sm ${on ? "bg-azzurro-deep text-cream border-azzurro-deep" : "border-line hover:border-ink-muted"}`}>{s.l}</button>;
              })}
            </div>
          </div>
        )}

        <label className="block text-sm font-medium">Target start date <span className="text-ink-muted font-normal">(optional)</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
        </label>

        <div className="pt-3 border-t border-line flex items-center justify-between">
          <p className="text-xs text-ink-muted">This creates an invite — no email is sent automatically.</p>
          <button type="submit" className="btn btn-primary">Create invite</button>
        </div>
      </form>
    </div>
  );
}
