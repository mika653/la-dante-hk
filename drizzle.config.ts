import type { Config } from "drizzle-kit";

// Migrations run over Neon's direct (unpooled) connection — the pooled URL goes
// through pgbouncer in transaction mode, which can't run every DDL statement.
// The app itself uses the pooled URL at runtime (see lib/db/index.ts).
const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: migrationUrl! },
} satisfies Config;
