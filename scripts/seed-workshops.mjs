// Seed workshops from the demo data — once (guarded).
import postgres from "postgres";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const force = process.argv.includes("--force");
const sql = postgres(url, { prepare: false });

const src = readFileSync(new URL("../lib/data.ts", import.meta.url), "utf8");
const start = src.indexOf("export const workshops");
const eq = src.indexOf("=", start);
const arrStart = src.indexOf("[", eq);
let depth = 0, end = -1;
for (let i = arrStart; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const items = eval(src.slice(arrStart, end + 1));

const existing = await sql`select count(*)::int as n from workshops`;
if (existing[0].n > 0 && !force) { console.log(`workshops already has ${existing[0].n} row(s) — skipping.`); await sql.end(); process.exit(0); }
if (force) { await sql`delete from workshops`; }

for (const w of items) {
  await sql`insert into workshops (id, title, description, status, date_label, interested, image, published)
    values (${w.id}, ${w.title}, ${w.description}, ${w.status}, ${w.dateLabel ?? null}, ${w.interested ?? null}, ${w.image}, true)
    on conflict (id) do nothing`;
}
console.log(`seeded ${items.length} workshops.`);
await sql.end();
