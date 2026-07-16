// Seed the course catalogue from the demo data — once.
//
//   npm run db:seed-courses            insert the demo courses only if the table is empty
//   npm run db:seed-courses -- --force wipe and reload from the demo data
//
// Guarded so a routine run never overwrites courses staff have since edited.
// Reads the same lib/data.ts the site shipped with, via a tiny inline parse so
// this plain .mjs doesn't need the TS toolchain.

import postgres from "postgres";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const force = process.argv.includes("--force");
const sql = postgres(url, { prepare: false });

// Pull the `courses` array literal out of lib/data.ts and eval just that.
const dataSrc = readFileSync(new URL("../lib/data.ts", import.meta.url), "utf8");
const start = dataSrc.indexOf("export const courses");
// Start the array AFTER the "=", so the "[]" in the `Course[]` type annotation
// isn't mistaken for the array itself.
const eq = dataSrc.indexOf("=", start);
const arrStart = dataSrc.indexOf("[", eq);
// find the matching close bracket
let depth = 0, end = -1;
for (let i = arrStart; i < dataSrc.length; i++) {
  if (dataSrc[i] === "[") depth++;
  else if (dataSrc[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const literal = dataSrc.slice(arrStart, end + 1);
const courses = eval(literal); // trusted local source file

const existing = await sql`select count(*)::int as n from courses`;
if (existing[0].n > 0 && !force) {
  console.log(`courses table already has ${existing[0].n} row(s) — leaving them. Use --force to reload.`);
  await sql.end();
  process.exit(0);
}
if (force) { await sql`delete from courses`; console.log("cleared existing courses"); }

for (const c of courses) {
  await sql`
    insert into courses (
      id, language, type, level, title, day_label, start_iso, end_iso, hours,
      location, teacher, price_hkd, seats, enrolled, status,
      course_code, weekday, start_time, end_time, lessons,
      early_bird_due_iso, early_bird_fee_hkd, archived, continuation_of
    ) values (
      ${c.id}, ${c.language}, ${c.type}, ${String(c.level)}, ${c.title}, ${c.dayLabel},
      ${c.startISO}, ${c.endISO}, ${c.hours ?? 0}, ${c.location}, ${c.teacher},
      ${c.priceHKD ?? 0}, ${c.seats ?? 0}, ${c.enrolled ?? 0}, ${c.status ?? "Published"},
      ${c.courseCode ?? null}, ${c.weekday ?? null}, ${c.startTime ?? null}, ${c.endTime ?? null},
      ${c.lessons ?? null}, ${c.earlyBirdDueISO ?? null}, ${c.earlyBirdFeeHKD ?? null},
      ${c.archived ?? false}, ${c.continuationOf ?? null}
    )
    on conflict (id) do nothing`;
}
console.log(`seeded ${courses.length} courses.`);
await sql.end();
