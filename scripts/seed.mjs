// Seed the initial staff accounts. Run after `npm run db:push`.
//
//   npm run db:seed              create any missing accounts
//   npm run db:seed -- --rotate  also reset the passwords of existing accounts
//
// Passwords are generated here at run time and written to .seed-credentials.txt,
// which is git-ignored. They are never hardcoded in this file and never printed
// to the terminal: this repo is public, and a password here is a live credential
// for the production database.
//
// Hand each person their line over a private channel, have them sign in, then
// delete the file. Without --rotate, existing accounts keep their password, so a
// routine re-seed can't clobber one someone has already changed.

import postgres from "postgres";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const sql = postgres(url, { prepare: false });
const rotate = process.argv.includes("--rotate");

// [email, name, role, annual days, sick days]
const seedUsers = [
  ["giulia@ladante.hk", "Giulia Capasso", "owner", 20, 14],
  ["bill@ladante.hk", "Bill", "manager", 14, 14],
  ["teacher@ladante.hk", "Sample Teacher", "teacher", 14, 14],
];

/** ~110 bits of entropy, in readable five-character groups. Ambiguous glyphs omitted. */
function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const chars = Array.from(crypto.randomBytes(20), (b) => alphabet[b % alphabet.length]);
  return chars.join("").replace(/(.{5})(?=.)/g, "$1-");
}

const issued = [];

for (const [email, name, role, annual, sick] of seedUsers) {
  const [existing] = await sql`select id from users where email = ${email}`;

  if (existing && !rotate) {
    // Refresh the profile, but never touch a password that is already in use.
    await sql`
      update users set name = ${name}, role = ${role},
        annual_entitlement = ${annual}, sick_entitlement = ${sick}, active = true
      where email = ${email}`;
    console.log(`unchanged  ${email}  (exists — password left alone)`);
    continue;
  }

  const password = generatePassword();
  const hash = await bcrypt.hash(password, 12);

  if (existing) {
    await sql`update users set password_hash = ${hash}, active = true where email = ${email}`;
    console.log(`rotated    ${email}`);
  } else {
    await sql`
      insert into users (email, name, role, password_hash, annual_entitlement, sick_entitlement)
      values (${email}, ${name}, ${role}, ${hash}, ${annual}, ${sick})`;
    console.log(`created    ${email}`);
  }
  issued.push({ email, role, password });
}

await sql.end();

if (issued.length) {
  const body = [
    "La Dante — staff sign-in credentials",
    `Generated ${new Date().toISOString()}`,
    "",
    "Send each person only their own line, over a private channel. Ask them to",
    "sign in, then delete this file. Do not commit it.",
    "",
    ...issued.map((u) => `${u.role.padEnd(8)} ${u.email.padEnd(24)} ${u.password}`),
    "",
  ].join("\n");
  writeFileSync(".seed-credentials.txt", body, { mode: 0o600 });
  console.log(`\nWrote ${issued.length} password(s) to .seed-credentials.txt (git-ignored, chmod 600).`);
  console.log("Open it, share each line privately, then delete it.");
} else {
  console.log("\nNothing to do. Pass --rotate to reset existing passwords.");
}
