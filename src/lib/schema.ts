import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// The schema is the ground truth for the database. To change it: edit here,
// run `pnpm db:generate` to turn the diff into a migration under drizzle/,
// and commit both — the migration applies automatically when the server
// boots (see src/lib/db.ts), locally and deployed. Never edit the database
// by hand: state on the deployed volume outlives every deploy, and the
// migration trail is what keeps old state and new code compatible.
export const messages = sqliteTable("messages", {
  id: int().primaryKey({ autoIncrement: true }),
  body: text().notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Message = typeof messages.$inferSelect;

// A saved draft belongs to one anonymous browser, not a public timetable.
// Keep the starter's messages table and migration intact for existing volumes.
export const savedSlots = sqliteTable("saved_slots", {
  id: int().primaryKey({ autoIncrement: true }),
  owner: text().notNull(),
  courseCode: text("course_code").notNull(),
  activity: text().notNull(),
  day: text().notNull(),
  startMinute: int("start_minute").notNull(),
  endMinute: int("end_minute").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [index("saved_slots_owner_idx").on(table.owner)]);

export type SavedSlot = typeof savedSlots.$inferSelect;
