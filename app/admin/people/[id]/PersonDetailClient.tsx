"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, X, Mail, Copy, ExternalLink, FileText, Clock, ShieldCheck, GraduationCap } from "lucide-react";
import {
  getPersonById, updatePerson, getProgress,
  AGREEMENT_KEYS, TRAINING_KEYS, DOC_KEYS,
  agreementLabels, trainingLabels, docLabels,
  type Person,
} from "@/lib/people-store";

export default function PersonDetailClient({ id }: { id: string }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setPerson(getPersonById(id) ?? null); }, [id]);

  if (!person) {
    return (
      <div className="max-w-2xl">
        <Link href="/admin/people" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All people</Link>
        <div className="frame p-10 bg-white text-center text-ink-muted">Person not found.</div>
      </div>
    );
  }

  const prog = getProgress(person);
  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/onboarding/${person.inviteToken}` : "";

  function refresh() { setPerson(getPersonById(id) ?? null); }

  function approve() {
    updatePerson(id, { status: "approved", approvedAt: new Date().toISOString(), approvedBy: "Director" });
    refresh();
  }
  function reopen() {
    updatePerson(id, { status: "in-progress", approvedAt: undefined, approvedBy: undefined });
    refresh();
  }
  function copyLink() { navigator.clipboard.writeText(inviteUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }

  const sections = [
    { key: "personal", title: "Personal details", icon: FileText,
      done: !!person.personal?.nationality && !!person.personal?.visaStatus,
      content: person.personal ? (
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <li><span className="text-ink-muted">Nationality: </span>{person.personal.nationality || "—"}</li>
          <li><span className="text-ink-muted">Date of birth: </span>{person.personal.dob || "—"}</li>
          <li><span className="text-ink-muted">Right to work: </span>{person.personal.visaStatus || "—"}</li>
          <li><span className="text-ink-muted">Emergency contact: </span>{person.personal.emergencyName ? `${person.personal.emergencyName} (${person.personal.emergencyRelation}) · ${person.personal.emergencyPhone}` : "—"}</li>
        </ul>
      ) : <p className="text-sm text-ink-muted italic">Not yet submitted.</p>,
    },
    { key: "quals", title: "Qualifications & bio", icon: GraduationCap,
      done: !!person.qualifications?.highestDegree && !!person.qualifications?.bio,
      content: person.qualifications ? (
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <li><span className="text-ink-muted">Highest degree: </span>{person.qualifications.highestDegree || "—"}</li>
          <li><span className="text-ink-muted">Teaching cert: </span>{person.qualifications.teachingCert || "—"}</li>
          <li><span className="text-ink-muted">PLIDA certified: </span>{person.qualifications.plidaCertified ? "Yes" : "No"}</li>
          <li><span className="text-ink-muted">Years teaching: </span>{person.qualifications.yearsTeaching ?? "—"}</li>
          <li className="sm:col-span-2"><span className="text-ink-muted">Languages: </span>{person.qualifications.languages || "—"}</li>
          {person.qualifications.bio && <li className="sm:col-span-2 mt-2 p-3 bg-cream-2/50 rounded-lg italic">“{person.qualifications.bio}”</li>}
        </ul>
      ) : <p className="text-sm text-ink-muted italic">Not yet submitted.</p>,
    },
    { key: "docs", title: "Documents", icon: FileText,
      done: DOC_KEYS.every((k) => !!person.documents?.[k]),
      content: (
        <ul className="grid sm:grid-cols-2 gap-y-1 text-sm">
          {DOC_KEYS.map((k) => {
            const f = person.documents?.[k];
            return (
              <li key={k} className="flex items-center gap-2">
                {f ? <Check size={14} className="text-azzurro-deep" /> : <X size={14} className="text-ink-soft" />}
                <span className={f ? "" : "text-ink-muted"}>{docLabels[k]}</span>
                {f && <span className="font-mono text-xs text-ink-muted truncate">· {f}</span>}
              </li>
            );
          })}
        </ul>
      ),
    },
    { key: "agreements", title: "Agreements signed", icon: ShieldCheck,
      done: AGREEMENT_KEYS.every((k) => !!person.agreements?.[k]),
      content: (
        <ul className="grid sm:grid-cols-2 gap-y-1 text-sm">
          {AGREEMENT_KEYS.map((k) => {
            const when = person.agreements?.[k];
            return (
              <li key={k} className="flex items-center gap-2">
                {when ? <Check size={14} className="text-azzurro-deep" /> : <X size={14} className="text-ink-soft" />}
                <span className={when ? "" : "text-ink-muted"}>{agreementLabels[k]}</span>
                {when && <span className="font-mono text-xs text-ink-muted">· {new Date(when).toLocaleDateString()}</span>}
              </li>
            );
          })}
        </ul>
      ),
    },
    { key: "training", title: "Training completed", icon: Clock,
      done: TRAINING_KEYS.every((k) => !!person.training?.[k]),
      content: (
        <ul className="space-y-1 text-sm">
          {TRAINING_KEYS.map((k) => {
            const when = person.training?.[k];
            return (
              <li key={k} className="flex items-center gap-2">
                {when ? <Check size={14} className="text-azzurro-deep" /> : <X size={14} className="text-ink-soft" />}
                <span className={when ? "" : "text-ink-muted"}>{trainingLabels[k].title}</span>
                <span className="text-xs text-ink-muted">({trainingLabels[k].minutes} min)</span>
                {when && <span className="font-mono text-xs text-ink-muted ml-auto">{new Date(when).toLocaleDateString()}</span>}
              </li>
            );
          })}
        </ul>
      ),
    },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin/people" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-azzurro-deep mb-6"><ArrowLeft size={14} /> All people</Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="eyebrow">Admin · People · Detail</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{person.firstName} {person.lastName}</h1>
          <p className="mt-1 text-ink-muted">{person.email} · <span className="capitalize">{person.role}</span> · <span className="capitalize">{person.employmentType}</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {person.status === "submitted" && (
            <button type="button" onClick={approve} className="btn btn-primary"><Check size={16} /> Approve</button>
          )}
          {person.status === "approved" && (
            <button type="button" onClick={reopen} className="btn btn-ghost">Re-open</button>
          )}
        </div>
      </div>

      {/* Progress summary */}
      <div className="frame p-6 bg-white mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="eyebrow">Onboarding progress</p>
            <p className="mt-1 text-sm text-ink-muted">{prog.completed} of {prog.total} sections complete · Status: <span className="font-medium capitalize text-ink">{person.status.replace("-", " ")}</span></p>
          </div>
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-azzurro-deep transition-all" style={{ width: `${prog.pct}%` }} />
            </div>
            <span className="font-mono text-sm text-ink-muted">{prog.pct}%</span>
          </div>
        </div>
      </div>

      {/* Invite link card */}
      <div className="frame p-5 bg-cream-2/50 mb-8 flex flex-wrap items-center gap-3">
        <span className="eyebrow shrink-0">Self-service link</span>
        <code className="flex-1 min-w-[200px] font-mono text-xs truncate">{inviteUrl}</code>
        <button type="button" onClick={copyLink} className="btn btn-ghost !h-9 !px-3 !text-xs"><Copy size={13} /> {copied ? "Copied!" : "Copy"}</button>
        <a href={`mailto:${person.email}?subject=${encodeURIComponent("Your Dante HK onboarding link")}&body=${encodeURIComponent(`Please complete your onboarding here:\n${inviteUrl}`)}`} className="btn btn-ghost !h-9 !px-3 !text-xs"><Mail size={13} /> Email</a>
        <Link href={`/onboarding/${person.inviteToken}`} target="_blank" rel="noopener" className="btn btn-ghost !h-9 !px-3 !text-xs">Open <ExternalLink size={12} /></Link>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((s) => (
          <details key={s.key} open className="frame bg-white">
            <summary className="list-none cursor-pointer p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0 ${s.done ? "bg-azzurro-deep text-cream" : "bg-cream-2 text-ink-muted"}`}>
                  {s.done ? <Check size={14} /> : <s.icon size={14} />}
                </span>
                <h2 className="text-lg font-semibold">{s.title}</h2>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-ink-muted transition-transform details-open:rotate-45">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="border-t border-line p-5">{s.content}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
