import "server-only";
// -----------------------------------------------------------------------------
// ScuolaSemplice Admin API client — READY BUT DORMANT.
//
// This is the "just use the API" half of the course-creation workflow: instead
// of exporting a CSV and re-typing every class into ScuolaSemplice, the school
// pushes a course straight across. The wiring is complete and typed against
// ScuolaSemplice's own Web API; it stays OFF until three env vars are set, so it
// can never fire by accident during the demo.
//
//   SCUOLASEMPLICE_API_BASE      e.g. https://ladantehongkong.scuolasemplice.it/api
//   SCUOLASEMPLICE_API_USER      created in ScuolaSemplice: Configuration ->
//   SCUOLASEMPLICE_API_PASSWORD  Integrations -> API accounts for external systems
//
// TO GO LIVE (once Bill confirms + supplies the above):
//   1) Set the three env vars in Vercel.
//   2) Confirm the production base URL (the published spec points at a dev host).
//   3) Confirm branchid / default locationid for the HK branch (see below).
// Field shapes below follow the published spec (BluCloud "ScuolaSemplice Web API").
// -----------------------------------------------------------------------------

import type { Course } from "@/lib/data";

const BASE = process.env.SCUOLASEMPLICE_API_BASE?.replace(/\/$/, "");
const USER = process.env.SCUOLASEMPLICE_API_USER;
const PASS = process.env.SCUOLASEMPLICE_API_PASSWORD;

// TODO(Bill): the HK branch id and the default classroom/location id in their
// ScuolaSemplice. `editions/create` requires a locationid; `GET /locations/list`
// and `GET /listbranches` return these once the credentials are live.
const DEFAULT_BRANCH_ID = process.env.SCUOLASEMPLICE_BRANCH_ID
  ? Number(process.env.SCUOLASEMPLICE_BRANCH_ID) : undefined;
const DEFAULT_LOCATION_ID = process.env.SCUOLASEMPLICE_LOCATION_ID
  ? Number(process.env.SCUOLASEMPLICE_LOCATION_ID) : undefined;

/** True only when the credentials are present — every call checks this first. */
export function isScuolaSempliceConfigured(): boolean {
  return Boolean(BASE && USER && PASS);
}

class ScuolaSempliceNotConfigured extends Error {
  constructor() {
    super("ScuolaSemplice API is not configured yet — set SCUOLASEMPLICE_API_BASE / _USER / _PASSWORD to enable the direct hand-off.");
    this.name = "ScuolaSempliceNotConfigured";
  }
}

async function call<T = unknown>(method: "GET" | "POST" | "PUT", path: string, body?: unknown): Promise<T> {
  if (!isScuolaSempliceConfigured()) throw new ScuolaSempliceNotConfigured();
  const auth = Buffer.from(`${USER}:${PASS}`).toString("base64");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ScuolaSemplice ${method} ${path} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

// --------------------------- shapes (from the spec) --------------------------

type NewStudent = {
  name: string; surname: string; email: string;
  phone?: string; mobile?: string; datebirth?: string; branchid?: number;
};
type NewModel = {
  name: string; one2one: number; type: string;
  weeklessons?: number; lessons?: number; hours?: number; price?: string;
  minstudents?: number; maxtudents?: number; description?: string; branchid?: number;
};
type NewEdition = {
  name: string; modelid: number; locationid: number; startdate: string;
  code?: string; lessons?: number; hours?: number; description?: string; branchid?: number;
};
type NewSubscription = { courseid: number; studentid: number; enrolldate?: string; cost?: string };

// ------------------------------- reads ---------------------------------------

export function listStudents(email?: string) {
  const q = new URLSearchParams();
  if (DEFAULT_BRANCH_ID) q.set("branchid", String(DEFAULT_BRANCH_ID));
  if (email) q.set("email", email);
  const qs = q.toString();
  return call("GET", `/liststudents${qs ? `?${qs}` : ""}`);
}
export function listClasses() {
  const qs = DEFAULT_BRANCH_ID ? `?branchid=${DEFAULT_BRANCH_ID}` : "";
  return call("GET", `/listclasses${qs}`);
}

// ------------------------------- writes --------------------------------------

export function createStudent(s: NewStudent) {
  return call<{ id: number }>("POST", "/newstudent", { branchid: DEFAULT_BRANCH_ID, ...s });
}
export function createModel(m: NewModel) {
  return call<{ id: number }>("POST", "/models/create", { branchid: DEFAULT_BRANCH_ID, ...m });
}
export function createEdition(e: NewEdition) {
  return call<{ id: number }>("POST", "/editions/create", { branchid: DEFAULT_BRANCH_ID, ...e });
}
export function subscribeStudent(s: NewSubscription) {
  return call("POST", "/subscription/create", s);
}

// ------------------- the one call the dashboard will make --------------------

/**
 * Push one La Dante course into ScuolaSemplice: create the class "model"
 * (template) and then a dated "edition" (the actual running class), reusing our
 * own course code so the two systems share one reference. Returns both ids.
 *
 * A group class in our catalogue is one2one=0; private/corporate map to 1.
 */
export async function pushCourseToScuolaSemplice(course: Course): Promise<{ modelId: number; editionId: number }> {
  if (!isScuolaSempliceConfigured()) throw new ScuolaSempliceNotConfigured();
  if (!DEFAULT_LOCATION_ID) {
    throw new Error("Set SCUOLASEMPLICE_LOCATION_ID (the HK classroom id from GET /locations/list) before pushing courses.");
  }

  const isIndividual = course.type === "private" || course.type === "corporate";

  const model = await createModel({
    name: course.title,
    one2one: isIndividual ? 1 : 0,
    type: course.language, // "italian" | "latin"
    lessons: course.lessons,
    hours: course.hours,
    price: String(course.priceHKD),
    maxtudents: isIndividual ? undefined : course.seats, // spec spelling ("maxtudents")
    description: `${course.level} · ${course.dayLabel}`,
  });

  const edition = await createEdition({
    name: course.title,
    code: course.courseCode,          // our DA032601 becomes their edition code
    modelid: model.id,
    locationid: DEFAULT_LOCATION_ID,
    startdate: course.startISO,       // "YYYY-MM-DD", matches their example format
    lessons: course.lessons,
    hours: course.hours,
    description: `${course.level} — ${course.teacher}`,
  });

  return { modelId: model.id, editionId: edition.id };
}
