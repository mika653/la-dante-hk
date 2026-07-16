// Database schema (Drizzle / Postgres) for authentication + staff leave.
import { pgTable, pgEnum, uuid, text, integer, date, timestamp, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "manager", "teacher"]);
export const leaveTypeEnum = pgEnum("leave_type", ["annual", "sick"]);
export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "declined", "cancelled"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("teacher"),
  // yearly leave entitlements (days)
  annualEntitlement: integer("annual_entitlement").notNull().default(14),
  sickEntitlement: integer("sick_entitlement").notNull().default(14),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: leaveTypeEnum("type").notNull(),
  startDate: date("start_date").notNull(),   // "YYYY-MM-DD"
  endDate: date("end_date").notNull(),
  days: integer("days").notNull(),           // working days requested
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull().default("pending"),
  decidedBy: uuid("decided_by").references(() => users.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Role = (typeof roleEnum.enumValues)[number];
export type LeaveType = (typeof leaveTypeEnum.enumValues)[number];
export type LeaveStatus = (typeof leaveStatusEnum.enumValues)[number];
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
