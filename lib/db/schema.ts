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

// -------------------- Courses --------------------
// The public catalogue. Mirrors the Course shape the site already uses; enum-ish
// fields are plain text so adding a level or course type never needs a migration.
// `seats` is capacity and `enrolled` is taken — "seats left" is the difference,
// which is what staff edit and what students see.
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  language: text("language").notNull(),          // "italian" | "latin"
  type: text("type").notNull(),                  // "adult-group" | "kids" | ...
  level: text("level").notNull(),
  title: text("title").notNull(),
  dayLabel: text("day_label").notNull(),
  startISO: text("start_iso").notNull(),         // "YYYY-MM-DD"
  endISO: text("end_iso").notNull(),
  hours: integer("hours").notNull().default(0),
  location: text("location").notNull(),
  teacher: text("teacher").notNull(),
  priceHKD: integer("price_hkd").notNull().default(0),
  seats: integer("seats").notNull().default(0),
  enrolled: integer("enrolled").notNull().default(0),
  status: text("status").notNull().default("Published"),  // "Published" | "Draft"
  // optional scheduling / continuation fields
  courseCode: text("course_code"),
  weekday: integer("weekday"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  lessons: integer("lessons"),
  earlyBirdDueISO: text("early_bird_due_iso"),
  earlyBirdFeeHKD: integer("early_bird_fee_hkd"),
  archived: boolean("archived").notNull().default(false),
  continuationOf: text("continuation_of"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CourseRow = typeof courses.$inferSelect;
export type NewCourseRow = typeof courses.$inferInsert;

// -------------------- Enquiries --------------------
// One inbox for every "I'm interested" form on the site — course, private, PLIDA,
// workshop, trial class. `type` is plain text so a new form never needs a
// migration; the app validates it. This is what lets the office see and sort
// requests instead of them scattering across inboxes and Excel sheets.
export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),              // course | private | plida | workshop | trial | general
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  level: text("level"),                      // CEFR level they're after, if given
  timing: text("timing"),                    // preferred days/times, if given
  message: text("message"),
  sourcePath: text("source_path"),           // the page the form was on
  status: text("status").notNull().default("new"),  // new | contacted | closed
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EnquiryRow = typeof enquiries.$inferSelect;
export type NewEnquiryRow = typeof enquiries.$inferInsert;

// -------------------- Event registrations --------------------
// Replaces the Google Form for event sign-ups. Keeps a snapshot of the event
// (title + date) alongside the registrant, so an answer sheet stays readable
// even though events themselves live elsewhere. Age group and student status are
// captured because the office wants yearly stats from them; repeat attendance is
// derived from the email across events.
export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull(),
  eventTitle: text("event_title").notNull(),
  eventDate: text("event_date"),             // "YYYY-MM-DD" snapshot
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  ageGroup: text("age_group"),               // "Under 18" | "18-24" | ...
  isStudent: boolean("is_student").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EventRegistrationRow = typeof eventRegistrations.$inferSelect;
export type NewEventRegistrationRow = typeof eventRegistrations.$inferInsert;
