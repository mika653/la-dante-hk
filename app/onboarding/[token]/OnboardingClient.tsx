"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Upload, FileText, ShieldCheck, GraduationCap, Sparkles, Clock } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import {
  getPersonByToken, updatePerson, AGREEMENT_KEYS, TRAINING_KEYS, DOC_KEYS,
  agreementLabels, trainingLabels, docLabels, type Person,
} from "@/lib/people-store";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingClient({ token }: { token: string }) {
  const [person, setPerson] = useState<Person | null | undefined>(undefined);
  const [step, setStep] = useState<Step>(1);

  // Personal
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");
  const [visaStatus, setVisaStatus] = useState<"HKID" | "working-visa" | "dependent" | "other">("HKID");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Qualifications
  const [highestDegree, setHighestDegree] = useState("");
  const [teachingCert, setTeachingCert] = useState("");
  const [plidaCertified, setPlidaCertified] = useState(false);
  const [yearsTeaching, setYearsTeaching] = useState<number | "">("");
  const [languages, setLanguages] = useState("");
  const [bio, setBio] = useState("");

  // Docs: just filenames in demo
  const [docs, setDocs] = useState<Partial<Record<(typeof DOC_KEYS)[number], string>>>({});

  // Agreements + Training
  const [agreements, setAgreements] = useState<Partial<Record<(typeof AGREEMENT_KEYS)[number], string>>>({});
  const [training, setTraining] = useState<Partial<Record<(typeof TRAINING_KEYS)[number], string>>>({});

  useEffect(() => {
    const p = getPersonByToken(token);
    setPerson(p ?? null);
    if (p) {
      setNationality(p.personal?.nationality ?? "");
      setDob(p.personal?.dob ?? "");
      setVisaStatus(p.personal?.visaStatus ?? "HKID");
      setEmergencyName(p.personal?.emergencyName ?? "");
      setEmergencyRelation(p.personal?.emergencyRelation ?? "");
      setEmergencyPhone(p.personal?.emergencyPhone ?? "");
      setHighestDegree(p.qualifications?.highestDegree ?? "");
      setTeachingCert(p.qualifications?.teachingCert ?? "");
      setPlidaCertified(!!p.qualifications?.plidaCertified);
      setYearsTeaching(p.qualifications?.yearsTeaching ?? "");
      setLanguages(p.qualifications?.languages ?? "");
      setBio(p.qualifications?.bio ?? "");
      setDocs(p.documents ?? {});
      setAgreements(p.agreements ?? {});
      setTraining(p.training ?? {});
    }
  }, [token]);

  if (person === undefined) return <div className="min-h-screen bg-cream" />;
  if (person === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="frame p-10 bg-white max-w-md text-center">
          <h1 className="text-2xl font-semibold">Invite not found</h1>
          <p className="mt-3 text-ink-muted text-sm">This link may have expired or been revoked. Please contact La Dante HK at <a href="mailto:info@ladante.cc" className="underline">info@ladante.cc</a>.</p>
        </div>
      </div>
    );
  }

  if (person.status === "approved") {
    return (
      <Shell token={token}>
        <div className="frame p-10 md:p-14 bg-white text-center">
          <div className="w-16 h-16 rounded-full bg-sole mx-auto inline-flex items-center justify-center"><Check size={26} /></div>
          <h1 className="mt-6 text-3xl">You&apos;re all set, {person.firstName}.</h1>
          <p className="mt-3 text-ink-muted">Your onboarding is approved. Welcome to La Dante HK.</p>
          <p className="mt-1 text-ink-muted text-sm">If you need to update anything, email <a href="mailto:info@ladante.cc" className="underline">info@ladante.cc</a>.</p>
        </div>
      </Shell>
    );
  }

  if (person.status === "submitted") {
    return (
      <Shell token={token}>
        <div className="frame p-10 md:p-14 bg-white text-center">
          <Sparkles size={32} className="text-azzurro-deep mx-auto" aria-hidden />
          <h1 className="mt-6 text-3xl">Thanks, {person.firstName}.</h1>
          <p className="mt-3 text-ink-muted">Your submission is under review. We&apos;ll email you once everything&apos;s approved — usually within 2 business days.</p>
          <p className="mt-1 text-xs text-ink-muted italic">Demo mode · nothing is actually emailed.</p>
        </div>
      </Shell>
    );
  }

  // Patch helpers that also mark the record as "in-progress"
  function save(patch: Partial<Person>) {
    updatePerson(person!.id, { status: person!.status === "invited" ? "in-progress" : person!.status, ...patch });
  }

  function savePersonalAndNext() {
    save({ personal: { nationality, dob, visaStatus, emergencyName, emergencyRelation, emergencyPhone } });
    setStep(3);
  }
  function saveQualsAndNext() {
    save({ qualifications: { highestDegree, teachingCert, plidaCertified, yearsTeaching: yearsTeaching === "" ? undefined : Number(yearsTeaching), languages, bio } });
    setStep(4);
  }
  function saveDocsAndNext() {
    save({ documents: docs });
    setStep(5);
  }
  function saveAgreementsAndNext() {
    save({ agreements });
    setStep(6);
  }
  function submitFinal() {
    save({ training, status: "submitted", submittedAt: new Date().toISOString() });
    const p = getPersonByToken(token);
    setPerson(p ?? null);
  }

  function toggleAgreement(key: (typeof AGREEMENT_KEYS)[number]) {
    setAgreements((a) => ({ ...a, [key]: a[key] ? undefined : new Date().toISOString() }));
  }
  function toggleTraining(key: (typeof TRAINING_KEYS)[number]) {
    setTraining((t) => ({ ...t, [key]: t[key] ? undefined : new Date().toISOString() }));
  }
  function setDoc(key: (typeof DOC_KEYS)[number], filename: string) {
    setDocs((d) => ({ ...d, [key]: filename || undefined }));
  }

  const steps = [
    { n: 1 as Step, label: "Welcome" },
    { n: 2 as Step, label: "Personal" },
    { n: 3 as Step, label: "Qualifications" },
    { n: 4 as Step, label: "Documents" },
    { n: 5 as Step, label: "Agreements" },
    { n: 6 as Step, label: "Training" },
  ];

  return (
    <Shell token={token}>
      {/* Stepper */}
      <ol className="flex items-center gap-1.5 md:gap-2 mb-8 text-xs md:text-sm">
        {steps.map((s, i) => {
          const active = s.n === step;
          const past = s.n < step;
          return (
            <li key={s.n} className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
              <button type="button" onClick={() => past && setStep(s.n)} className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-heading font-bold shrink-0 ${active ? "bg-ink text-cream" : past ? "bg-sole text-ink" : "border border-line text-ink-muted"}`}>{past ? <Check size={14} /> : s.n}</button>
              <span className={`hidden md:inline font-medium ${active ? "text-ink" : "text-ink-muted"}`}>{s.label}</span>
              {i < steps.length - 1 && <span className="flex-1 h-px bg-line min-w-[6px]" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="frame p-8 md:p-12 bg-white">
          <p className="eyebrow">Benvenuto/a</p>
          <h1 className="mt-2 text-3xl md:text-4xl">Hello, {person.firstName}.</h1>
          <p className="mt-4 text-ink-muted max-w-xl">
            We&apos;re thrilled to have you joining La Dante HK as a{" "}
            <strong className="text-ink">{person.role === "teacher" ? "teacher" : person.role}</strong>.
            This onboarding takes about 15–20 minutes. You can stop and come back any time using the link we sent you.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, title: "What you'll need", body: "Passport/HKID, CV, teaching certificates, a headshot, and your emergency contact details." },
              { icon: Clock, title: "Time estimate", body: "15–20 minutes — including 4 short training videos (total ~50 min) that you can complete later." },
              { icon: ShieldCheck, title: "Privacy", body: "Your data is stored securely and used only for employment/engagement purposes. Covered by our PDPO policy." },
              { icon: GraduationCap, title: "What's next", body: "Once submitted, the director reviews and approves. You'll get login credentials for ScuolaSemplice + the Teacher Portal." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-5 rounded-xl bg-cream-2/50 border border-line">
                <Icon size={18} className="text-azzurro-deep" aria-hidden />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setStep(2)} className="btn btn-primary">Let&apos;s begin <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 2: Personal */}
      {step === 2 && (
        <StepCard title="Personal details" subtitle="Required by Hong Kong law and for any emergency on campus.">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nationality"><input required value={nationality} onChange={(e) => setNationality(e.target.value)} className={inputCls} /></Field>
            <Field label="Date of birth"><input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} /></Field>
            <Field label="Right to work" className="md:col-span-2">
              <select value={visaStatus} onChange={(e) => setVisaStatus(e.target.value as typeof visaStatus)} className={inputCls}>
                <option value="HKID">HK Permanent Resident (HKID)</option>
                <option value="working-visa">Working visa</option>
                <option value="dependent">Dependent visa</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <div className="mt-6 pt-5 border-t border-line">
            <p className="text-sm font-medium mb-3">Emergency contact</p>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Name"><input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className={inputCls} /></Field>
              <Field label="Relationship"><input value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} placeholder="e.g. Spouse" className={inputCls} /></Field>
              <Field label="Phone"><input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+852 …" className={inputCls} /></Field>
            </div>
          </div>

          <StepNav onBack={() => setStep(1)} onNext={savePersonalAndNext} />
        </StepCard>
      )}

      {/* Step 3: Qualifications */}
      {step === 3 && (
        <StepCard title="Qualifications & bio" subtitle="Helps us pair you with the right classes and list you on the site.">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Highest academic degree"><input required value={highestDegree} onChange={(e) => setHighestDegree(e.target.value)} placeholder="e.g. MA Italian Linguistics" className={inputCls} /></Field>
            <Field label="Teaching certificate"><input value={teachingCert} onChange={(e) => setTeachingCert(e.target.value)} placeholder="e.g. DITALS II, CEDILS" className={inputCls} /></Field>
            <Field label="Years of teaching experience"><input type="number" value={yearsTeaching} onChange={(e) => setYearsTeaching(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} /></Field>
            <Field label="PLIDA examiner certified?">
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setPlidaCertified(true)} className={`px-5 h-12 rounded-xl border ${plidaCertified ? "bg-ink text-cream border-ink" : "border-line"}`}>Yes</button>
                <button type="button" onClick={() => setPlidaCertified(false)} className={`px-5 h-12 rounded-xl border ${!plidaCertified ? "bg-ink text-cream border-ink" : "border-line"}`}>No / Not yet</button>
              </div>
            </Field>
            <Field label="Languages you speak (and level)" className="md:col-span-2"><input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. Italian (native), English (C2), Cantonese (A2)" className={inputCls} /></Field>
            <Field label="Short bio for the website" className="md:col-span-2">
              <textarea required rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="2–3 sentences. Where you&apos;re from, what you love to teach, anything distinctive." className={`${inputCls} !h-auto`} />
            </Field>
          </div>
          <StepNav onBack={() => setStep(2)} onNext={saveQualsAndNext} />
        </StepCard>
      )}

      {/* Step 4: Documents */}
      {step === 4 && (
        <StepCard title="Documents" subtitle="Upload a file for each. PDFs, JPEGs, or PNGs up to 10 MB.">
          <ul className="space-y-3">
            {DOC_KEYS.map((k) => {
              const f = docs[k];
              return (
                <li key={k} className="p-4 rounded-xl border border-line flex items-center gap-3 flex-wrap">
                  <div className={`w-10 h-10 rounded-full inline-flex items-center justify-center shrink-0 ${f ? "bg-azzurro-deep text-cream" : "bg-cream-2 text-ink-muted"}`}>
                    {f ? <Check size={16} /> : <Upload size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{docLabels[k]}</p>
                    {f && <p className="text-xs font-mono text-ink-muted truncate">{f}</p>}
                  </div>
                  <label className="btn btn-ghost !h-9 !px-4 !text-xs cursor-pointer">
                    <input type="file" className="hidden" onChange={(e) => setDoc(k, e.target.files?.[0]?.name ?? "")} />
                    {f ? "Replace" : "Upload"}
                  </label>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-ink-muted italic">Demo: we only capture the filename — no file is uploaded.</p>
          <StepNav onBack={() => setStep(3)} onNext={saveDocsAndNext} />
        </StepCard>
      )}

      {/* Step 5: Agreements */}
      {step === 5 && (
        <StepCard title="Agreements" subtitle="Read and tick each document. These replace physical signatures for our internal records.">
          <ul className="space-y-3">
            {AGREEMENT_KEYS.map((k) => {
              const signed = agreements[k];
              return (
                <li key={k} className="p-4 rounded-xl border border-line flex items-start gap-3">
                  <button type="button" role="checkbox" aria-checked={!!signed} onClick={() => toggleAgreement(k)} className={`w-6 h-6 rounded-md border inline-flex items-center justify-center shrink-0 mt-0.5 ${signed ? "bg-azzurro-deep border-azzurro-deep text-cream" : "border-line"}`}>
                    {signed && <Check size={14} />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{agreementLabels[k]}</p>
                    <button type="button" className="text-xs text-azzurro-deep underline mt-1">Read document</button>
                    {signed && <p className="text-xs text-ink-muted mt-1 font-mono">Signed {new Date(signed).toLocaleString()}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <StepNav onBack={() => setStep(4)} onNext={saveAgreementsAndNext} nextDisabled={!AGREEMENT_KEYS.every((k) => !!agreements[k])} />
        </StepCard>
      )}

      {/* Step 6: Training */}
      {step === 6 && (
        <StepCard title="Training modules" subtitle="Short videos — tick each once you&apos;ve watched. Total ~50 min, can be done over multiple sessions.">
          <ul className="space-y-3">
            {TRAINING_KEYS.map((k) => {
              const done = training[k];
              return (
                <li key={k} className="p-4 rounded-xl border border-line flex items-start gap-3">
                  <button type="button" role="checkbox" aria-checked={!!done} onClick={() => toggleTraining(k)} className={`w-6 h-6 rounded-md border inline-flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-azzurro-deep border-azzurro-deep text-cream" : "border-line"}`}>
                    {done && <Check size={14} />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{trainingLabels[k].title}</p>
                    <p className="text-xs text-ink-muted mt-1">{trainingLabels[k].minutes} minute video</p>
                    {done && <p className="text-xs text-ink-muted mt-1 font-mono">Completed {new Date(done).toLocaleString()}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={() => setStep(5)} className="btn btn-ghost"><ArrowLeft size={16} /> Back</button>
            <button type="button" onClick={submitFinal} disabled={!TRAINING_KEYS.every((k) => !!training[k])} className="btn btn-primary disabled:opacity-40">
              Submit for review <ArrowRight size={16} />
            </button>
          </div>
        </StepCard>
      )}
    </Shell>
  );
}

// -------------- Sub-components --------------
const inputCls = "mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink";

function Shell({ children, token }: { children: React.ReactNode; token: string }) {
  return (
    <div className="min-h-screen bg-cream-2 flex flex-col">
      <header className="bg-cream border-b border-line">
        <div className="container-xl h-16 flex items-center justify-between">
          <Wordmark />
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">Onboarding · {token.slice(0, 6)}…</span>
        </div>
      </header>
      <main className="flex-1">
        <div className="container-xl max-w-3xl py-10 md:py-14">
          {children}
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Società Dante Alighieri Hong Kong · Your data is protected under Hong Kong PDPO.
      </footer>
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="frame p-6 md:p-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-ink-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      {children}
    </label>
  );
}

function StepNav({ onBack, onNext, nextDisabled = false }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button type="button" onClick={onBack} className="btn btn-ghost"><ArrowLeft size={16} /> Back</button>
      <button type="button" onClick={onNext} disabled={nextDisabled} className="btn btn-primary disabled:opacity-40">Next <ArrowRight size={16} /></button>
    </div>
  );
}
