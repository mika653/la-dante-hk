// Official PLIDA Hong Kong exam calendar — the single source for the PLIDA page
// calendar and the homepage "next exam date". Copied from
// https://ladante.cc/language/plida-exam/plida-application/ (Nov 2026).
// The 2027 calendar has not been released by PLIDA headquarters yet; add the
// 2027 rows here when it is. Everything "next" is computed from today's date.

export type PlidaLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PlidaSession = {
  date: string;        // exam day, ISO yyyy-mm-dd
  deadline: string;    // application deadline, ISO yyyy-mm-dd
  levels: PlidaLevel[];
  junior?: boolean;    // PLIDA Juniores (ages 13–18)
};

export const PLIDA_LEVELS: PlidaLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const PLIDA_SESSIONS: PlidaSession[] = [
  { date: "2026-02-11", deadline: "2026-01-28", levels: ["A2", "B1"] },
  { date: "2026-03-18", deadline: "2026-03-04", levels: ["B2", "C1"] },
  { date: "2026-04-15", deadline: "2026-04-01", levels: ["A1"] },
  { date: "2026-05-20", deadline: "2026-05-06", levels: ["A2", "C2"] },
  { date: "2026-06-10", deadline: "2026-05-27", levels: ["B1", "B2", "C1"] },
  { date: "2026-06-20", deadline: "2026-06-06", levels: ["A1", "A2", "B1", "B2"], junior: true },
  { date: "2026-09-09", deadline: "2026-08-26", levels: ["A2", "B1"] },
  { date: "2026-09-30", deadline: "2026-09-16", levels: ["A1"] },
  { date: "2026-10-17", deadline: "2026-10-03", levels: ["A1", "A2", "B1", "B2"], junior: true },
  { date: "2026-11-18", deadline: "2026-11-04", levels: ["A2", "B1"] },
  { date: "2026-11-19", deadline: "2026-11-05", levels: ["B2", "C1", "C2"] },
];

/** Latest year with a published calendar (used for the "next year TBA" note). */
export const PLIDA_LAST_PUBLISHED_YEAR = Math.max(...PLIDA_SESSIONS.map((s) => Number(s.date.slice(0, 4))));

export const PLIDA_FORMS = {
  adult: "/plida/PLIDA-application-form-adult-2026.pdf",
  junior: "/plida/PLIDA-application-form-junior.pdf",
};

/** Sessions on or after `todayISO`, soonest first. */
export function upcomingPlidaSessions(todayISO: string): PlidaSession[] {
  return PLIDA_SESSIONS.filter((s) => s.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date));
}

/** The next exam whose application window is still open, else the next exam at all. */
export function nextPlidaSession(todayISO: string): { session: PlidaSession; open: boolean } | null {
  const upcoming = upcomingPlidaSessions(todayISO);
  const open = upcoming.find((s) => s.deadline >= todayISO);
  if (open) return { session: open, open: true };
  return upcoming[0] ? { session: upcoming[0], open: false } : null;
}

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}
export function fmtPlidaDate(iso: string, locale: "en" | "zh" = "en", withDay = false): string {
  const { y, m, d, dow } = parts(iso);
  if (locale === "zh") return `${y} 年 ${m} 月 ${d} 日${withDay ? `（星期${DAYS_ZH[dow]}）` : ""}`;
  return `${withDay ? `${DAYS_EN[dow]}, ` : ""}${d} ${MONTHS_EN[m - 1]} ${y}`;
}
