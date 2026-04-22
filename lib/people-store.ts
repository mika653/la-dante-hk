"use client";
import { useEffect, useState } from "react";

// -------------- Types --------------
export type PersonRole = "teacher" | "staff" | "contractor";
export type PersonStatus = "invited" | "in-progress" | "submitted" | "approved";
export type EmploymentType = "employee" | "freelance" | "intern";
export type SubjectArea = "italian" | "latin" | "plida-prep" | "kids";

export const AGREEMENT_KEYS = ["contract", "codeOfConduct", "childSafeguarding", "dataPrivacy", "teachingStandards"] as const;
export type AgreementKey = typeof AGREEMENT_KEYS[number];

export const TRAINING_KEYS = ["onboarding", "typhoonPolicy", "studentDataHandling", "plidaExamRules"] as const;
export type TrainingKey = typeof TRAINING_KEYS[number];

export const DOC_KEYS = ["cv", "passport", "workPermit", "teachingCert", "headshot"] as const;
export type DocKey = typeof DOC_KEYS[number];

export const agreementLabels: Record<AgreementKey, string> = {
  contract: "Employment/Engagement agreement",
  codeOfConduct: "Code of conduct",
  childSafeguarding: "Child safeguarding policy",
  dataPrivacy: "Student data & privacy policy",
  teachingStandards: "Teaching standards (Dante method)",
};

export const trainingLabels: Record<TrainingKey, { title: string; minutes: number }> = {
  onboarding: { title: "Welcome to Dante HK (intro video)", minutes: 12 },
  typhoonPolicy: { title: "Typhoon & severe weather protocol", minutes: 6 },
  studentDataHandling: { title: "Student data handling (PDPO)", minutes: 15 },
  plidaExamRules: { title: "PLIDA examination rules & integrity", minutes: 20 },
};

export const docLabels: Record<DocKey, string> = {
  cv: "Current CV",
  passport: "Passport / HKID (photo page)",
  workPermit: "Work visa / right-to-work proof",
  teachingCert: "Teaching certificate(s)",
  headshot: "Professional headshot",
};

export type Person = {
  id: string;
  inviteToken: string;

  // Admin-initiated
  role: PersonRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employmentType: EmploymentType;
  subjects: SubjectArea[];
  startDate?: string;

  // Self-service filled by the new hire
  personal?: {
    nationality?: string;
    dob?: string;
    visaStatus?: "HKID" | "working-visa" | "dependent" | "other";
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
  };
  qualifications?: {
    highestDegree?: string;
    teachingCert?: string;
    plidaCertified?: boolean;
    yearsTeaching?: number;
    languages?: string;
    bio?: string;
  };
  documents?: Partial<Record<DocKey, string>>;        // value = filename
  agreements?: Partial<Record<AgreementKey, string>>; // value = signedAt ISO
  training?: Partial<Record<TrainingKey, string>>;    // value = completedAt ISO

  // Meta
  status: PersonStatus;
  invitedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
};

// -------------- Seed --------------
function newToken() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

const seed: Person[] = [
  {
    id: "p-giulia",
    inviteToken: "demo-giulia",
    role: "teacher",
    firstName: "Giulia",
    lastName: "Marchetti",
    email: "giulia@ladante.cc",
    phone: "+852 9123 4567",
    employmentType: "employee",
    subjects: ["italian", "plida-prep"],
    startDate: "2019-09-01",
    status: "approved",
    invitedAt: "2019-08-10",
    submittedAt: "2019-08-20",
    approvedAt: "2019-08-25",
    approvedBy: "Director",
    personal: { nationality: "Italian", dob: "1988-03-12", visaStatus: "working-visa" },
    qualifications: { highestDegree: "MA Italian Studies, La Sapienza", teachingCert: "DITALS II", plidaCertified: true, yearsTeaching: 7, languages: "Italian (native), English (C2), Cantonese (A2)", bio: "Roman by birth, now 7 years in HK." },
    documents: { cv: "giulia-cv.pdf", passport: "giulia-passport.pdf", workPermit: "giulia-visa.pdf", teachingCert: "ditals.pdf", headshot: "giulia.jpg" },
    agreements: Object.fromEntries(AGREEMENT_KEYS.map((k) => [k, "2019-08-24T10:00:00Z"])),
    training: Object.fromEntries(TRAINING_KEYS.map((k) => [k, "2019-08-24T12:00:00Z"])),
  },
  {
    id: "p-marco",
    inviteToken: "demo-marco",
    role: "teacher",
    firstName: "Marco",
    lastName: "Rossi",
    email: "marco@ladante.cc",
    employmentType: "freelance",
    subjects: ["italian"],
    startDate: "2022-01-15",
    status: "approved",
    invitedAt: "2021-12-10",
    approvedAt: "2022-01-05",
  },
  {
    id: "p-sofia",
    inviteToken: "demo-sofia",
    role: "teacher",
    firstName: "Sofia",
    lastName: "Bianchi",
    email: "sofia.b@gmail.com",
    phone: "+852 9876 5432",
    employmentType: "freelance",
    subjects: ["italian", "kids"],
    startDate: "2026-05-01",
    status: "submitted",
    invitedAt: "2026-04-10",
    submittedAt: "2026-04-19",
    personal: { nationality: "Italian", dob: "1991-07-22", visaStatus: "dependent", emergencyName: "Luca Bianchi", emergencyRelation: "Spouse", emergencyPhone: "+852 5555 0000" },
    qualifications: { highestDegree: "BA Education, Università di Bologna", teachingCert: "CEDILS", plidaCertified: false, yearsTeaching: 4, languages: "Italian (native), English (C1)", bio: "Specialised in teaching kids. Previously at the Italian School in Singapore." },
    documents: { cv: "sofia-cv.pdf", passport: "sofia-passport.pdf", teachingCert: "cedils.pdf", headshot: "sofia.jpg" },
    agreements: { contract: "2026-04-18T14:00:00Z", codeOfConduct: "2026-04-18T14:05:00Z", childSafeguarding: "2026-04-18T14:10:00Z", dataPrivacy: "2026-04-18T14:12:00Z", teachingStandards: "2026-04-18T14:15:00Z" },
    training: { onboarding: "2026-04-19T09:00:00Z", typhoonPolicy: "2026-04-19T09:15:00Z", studentDataHandling: "2026-04-19T09:40:00Z", plidaExamRules: "2026-04-19T10:10:00Z" },
  },
  {
    id: "p-alessio",
    inviteToken: "demo-alessio",
    role: "teacher",
    firstName: "Alessio",
    lastName: "Ferri",
    email: "alessio.ferri@proton.me",
    employmentType: "freelance",
    subjects: ["italian"],
    startDate: "2026-06-01",
    status: "in-progress",
    invitedAt: "2026-04-20",
    personal: { nationality: "Italian" },
    qualifications: { yearsTeaching: 2 },
    agreements: { codeOfConduct: "2026-04-21T18:00:00Z" },
  },
  {
    id: "p-nuova",
    inviteToken: "demo-nuova",
    role: "staff",
    firstName: "Yuki",
    lastName: "Tanaka",
    email: "yuki.tanaka@example.com",
    employmentType: "intern",
    subjects: [],
    startDate: "2026-05-10",
    status: "invited",
    invitedAt: "2026-04-22",
  },
];

// -------------- Store --------------
const KEY = "ladante-people";

function readAll(): Person[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seed;
  } catch { return seed; }
}
function writeAll(list: Person[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function getPeople(): Person[] { return readAll(); }
export function getPersonById(id: string): Person | undefined { return readAll().find((p) => p.id === id); }
export function getPersonByToken(token: string): Person | undefined { return readAll().find((p) => p.inviteToken === token); }

export function addPerson(p: Omit<Person, "id" | "inviteToken" | "invitedAt" | "status"> & { status?: PersonStatus }): Person {
  const person: Person = {
    ...p,
    id: `p-${Date.now()}`,
    inviteToken: newToken(),
    invitedAt: new Date().toISOString(),
    status: p.status ?? "invited",
  };
  writeAll([person, ...readAll()]);
  return person;
}

export function updatePerson(id: string, patch: Partial<Person>) {
  writeAll(readAll().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function removePerson(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function resetPeople() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

// -------------- Progress helpers --------------
export function getProgress(p: Person): { completed: number; total: number; pct: number } {
  const checks: boolean[] = [
    !!p.personal?.nationality && !!p.personal?.visaStatus,
    !!p.qualifications?.highestDegree && !!p.qualifications?.bio,
    DOC_KEYS.every((k) => !!p.documents?.[k]),
    AGREEMENT_KEYS.every((k) => !!p.agreements?.[k]),
    TRAINING_KEYS.every((k) => !!p.training?.[k]),
  ];
  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return { completed, total, pct: Math.round((completed / total) * 100) };
}

// -------------- Hook --------------
export function usePeople(): [Person[], () => void] {
  const [list, setList] = useState<Person[]>([]);
  useEffect(() => { setList(readAll()); }, []);
  const refresh = () => setList(readAll());
  return [list, refresh];
}
