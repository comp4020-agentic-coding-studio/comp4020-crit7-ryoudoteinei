import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { type Message, messages, type SavedSlot, savedSlots } from "./schema";
import { DAYS, type Day, type SlotInput } from "./timetable";

// One SQLite file is the app's whole persistent state. In production
// fly.toml points DATABASE_PATH at the machine's volume (/data), which is
// how state survives a reload and a redeploy; locally it defaults to an
// untracked file in .data/.
const path = process.env.DATABASE_PATH ?? "./.data/app.db";
mkdirSync(dirname(path), { recursive: true });

const client = new Database(path);
client.pragma("journal_mode = WAL");

export const db = drizzle(client);

// Migrations run at boot, on whatever machine holds the volume — the
// recommended shape for SQLite on Fly, where there's no separate machine to
// run them from. The flow: edit src/lib/schema.ts, `pnpm db:generate`,
// commit the migration it writes to drizzle/.
migrate(db, { migrationsFolder: "./drizzle" });

export type { Message };

export function listMessages(): Message[] {
  return db.select().from(messages).orderBy(desc(messages.id)).limit(50).all();
}

export function addMessage(body: string): Message {
  return db.insert(messages).values({ body }).returning().get();
}

export function listSavedSlots(owner: string): SavedSlot[] {
  return db.select().from(savedSlots).where(eq(savedSlots.owner, owner)).all()
    .sort((a, b) => DAYS.indexOf(a.day as Day) - DAYS.indexOf(b.day as Day) || a.startMinute - b.startMinute);
}

export function addSavedSlot(owner: string, slot: SlotInput): SavedSlot {
  return db.insert(savedSlots).values({ owner, ...slot }).returning().get();
}

export function removeSavedSlot(owner: string, id: number): boolean {
  return !!db.delete(savedSlots).where(and(eq(savedSlots.owner, owner), eq(savedSlots.id, id))).returning().get();
}
