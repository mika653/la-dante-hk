// Drizzle database client (postgres-js). Uses DATABASE_URL (Vercel Postgres / Neon).
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { _pg?: ReturnType<typeof postgres> };

// Reuse the connection across hot-reloads / serverless invocations. Pooled URL +
// prepare:false is the recommended setup for pgbouncer-fronted Postgres.
const client =
  globalForDb._pg ??
  postgres(process.env.DATABASE_URL ?? "", { prepare: false, max: 1 });

if (process.env.NODE_ENV !== "production") globalForDb._pg = client;

export const db = drizzle(client, { schema });
