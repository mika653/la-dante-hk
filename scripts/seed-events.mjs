// Seed the events catalogue from the demo data — once.
//   npm run db:seed-events            fill an empty table only
//   npm run db:seed-events -- --force wipe and reload
// Guarded so a routine run never clobbers events staff have since edited.

import postgres from "postgres";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const force = process.argv.includes("--force");
const sql = postgres(url, { prepare: false });

// Pull the seedEvents array literal out of lib/events-shared.ts.
const src = readFileSync(new URL("../lib/events-shared.ts", import.meta.url), "utf8");
const start = src.indexOf("export const seedEvents");
const eq = src.indexOf("=", start);
const arrStart = src.indexOf("[", eq);
let depth = 0, end = -1;
for (let i = arrStart; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const events = eval(src.slice(arrStart, end + 1));

const existing = await sql`select count(*)::int as n from events`;
if (existing[0].n > 0 && !force) {
  console.log(`events table already has ${existing[0].n} row(s) — leaving them. Use --force to reload.`);
  await sql.end();
  process.exit(0);
}
if (force) { await sql`delete from events`; console.log("cleared existing events"); }

for (const e of events) {
  await sql`
    insert into events (id, date, title, kind, location, description, booking_url, published)
    values (${e.id}, ${e.date}, ${e.title}, ${e.kind}, ${e.location}, ${e.description ?? null}, ${e.bookingUrl ?? null}, ${e.published})
    on conflict (id) do nothing`;
}
console.log(`seeded ${events.length} events.`);
await sql.end();
