// Pre-launch test-data cleanup.
//
//   npm run db:cleanup-test          → DRY RUN: lists what would change, touches nothing
//   npm run db:cleanup-test -- --apply → actually deletes / deactivates
//
// Targets are listed explicitly (found by a scan on 2026-11-23) rather than
// pattern-matched, so nothing real is caught by accident. Review the list,
// edit it if needed, then run with --apply. Deleting cannot be undone.
import postgres from "postgres";

const APPLY = process.argv.includes("--apply");

// Test events (and every registration made for them).
const TEST_EVENT_IDS = [
  "e-1795152776824", // "testing testing"
  "e-1795153166531", // blank title / no date
  "e-1795153226823", // "gsgdsgds"
];

// Test sign-ups on real events.
const TEST_REGISTRATION_IDS = [
  "6e8622ff-0207-48c7-8628-323552576dde", // "dante testing" on Italian Wine & Language
  "e18392c6-8170-4f53-8cb6-ec569f1d4190", // "testing" on Christmas Party
  "91d5af99-0f0f-43ea-9a76-704749da167e", // "testing" on Christmas Party
];

// Demo logins: deactivated (not deleted, so history stays consistent) and
// their leave requests removed.
const DEMO_USER_EMAILS = [
  "teacher@ladante.hk", // "Sample Teacher"
  "demo@ladante.hk",    // "Demo Account (Manager)"
];

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL is not set (run via npm so .env.local is loaded)."); process.exit(1); }
const sql = postgres(url, { max: 1 });

const show = (label, rows) => { console.log(`\n${label}: ${rows.length}`); for (const r of rows) console.log("  ", JSON.stringify(r)); };

try {
  const events = await sql`select id, date, title from events where id in ${sql(TEST_EVENT_IDS)}`;
  const eventRegs = await sql`select id, event_title, name, email from event_registrations where event_id in ${sql(TEST_EVENT_IDS)}`;
  const regs = await sql`select id, event_title, name, email from event_registrations where id in ${sql(TEST_REGISTRATION_IDS)}`;
  const users = await sql`select id, email, name, active from users where email in ${sql(DEMO_USER_EMAILS)}`;
  const userIds = users.map((u) => u.id);
  const leave = userIds.length ? await sql`select id, type, start_date::date, status from leave_requests where user_id in ${sql(userIds)}` : [];

  show("Events to delete", events);
  show("Registrations for those events to delete", eventRegs);
  show("Test registrations to delete", regs);
  show("Demo users to deactivate", users);
  show("Their leave requests to delete", leave);

  if (!APPLY) {
    console.log("\nDRY RUN: nothing changed. Re-run with --apply to make these changes.");
  } else {
    await sql.begin(async (tx) => {
      await tx`delete from event_registrations where event_id in ${tx(TEST_EVENT_IDS)} or id in ${tx(TEST_REGISTRATION_IDS)}`;
      await tx`delete from events where id in ${tx(TEST_EVENT_IDS)}`;
      if (userIds.length) {
        await tx`delete from leave_requests where user_id in ${tx(userIds)}`;
        await tx`update users set active = false where id in ${tx(userIds)}`;
      }
    });
    console.log("\nDone. Test data removed and demo users deactivated.");
  }
} finally {
  await sql.end();
}
