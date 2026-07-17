// Seed reviews from the demo testimonials — once (guarded).
import postgres from "postgres";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const force = process.argv.includes("--force");
const sql = postgres(url, { prepare: false });

const src = readFileSync(new URL("../lib/data.ts", import.meta.url), "utf8");
const start = src.indexOf("export const testimonials");
const eq = src.indexOf("=", start);
const arrStart = src.indexOf("[", eq);
let depth = 0, end = -1;
for (let i = arrStart; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const items = eval(src.slice(arrStart, end + 1));

const existing = await sql`select count(*)::int as n from reviews`;
if (existing[0].n > 0 && !force) { console.log(`reviews already has ${existing[0].n} row(s) — skipping.`); await sql.end(); process.exit(0); }
if (force) { await sql`delete from reviews`; }

let i = 0;
for (const r of items) {
  await sql`insert into reviews (id, quote, name, level, year, published)
    values (${`seed-r-${i}`}, ${r.quote}, ${r.name}, ${r.level}, ${r.year}, true) on conflict (id) do nothing`;
  i++;
}
console.log(`seeded ${items.length} reviews.`);
await sql.end();
