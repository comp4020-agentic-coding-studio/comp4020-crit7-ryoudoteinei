export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type Day = typeof DAYS[number];

export interface SlotInput {
  courseCode: string;
  activity: string;
  day: Day;
  startMinute: number;
  endMinute: number;
}

export interface TimedSlot {
  id: number;
  day: string;
  startMinute: number;
  endMinute: number;
}

function minutes(raw: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(raw);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function formatTime(value: number): string {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function parseSlotInput(form: FormData): { value: SlotInput } | { error: string } {
  const courseCode = String(form.get("courseCode") ?? "").trim().toUpperCase();
  const activity = String(form.get("activity") ?? "").trim();
  const day = String(form.get("day") ?? "");
  const startMinute = minutes(String(form.get("start") ?? ""));
  const endMinute = minutes(String(form.get("end") ?? ""));

  if (!/^[A-Z]{4}\d{4}$/.test(courseCode)) {
    return { error: "Enter an eight-character ANU course code such as COMP4020." };
  }
  if (activity.length < 2 || activity.length > 60) {
    return { error: "Name the teaching activity in 2–60 characters." };
  }
  if (!DAYS.includes(day as Day)) {
    return { error: "Choose a teaching day from Monday to Friday." };
  }
  if (startMinute === null || endMinute === null || endMinute <= startMinute) {
    return { error: "Enter valid start and end times, with the end after the start." };
  }
  return { value: { courseCode, activity, day: day as Day, startMinute, endMinute } };
}

export function clashingIds(slots: readonly TimedSlot[]): Set<number> {
  const clashes = new Set<number>();
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (overlaps(a, b)) {
        clashes.add(a.id);
        clashes.add(b.id);
      }
    }
  }
  return clashes;
}

export function overlaps(a: TimedSlot, b: TimedSlot): boolean {
  return a.day === b.day && a.startMinute < b.endMinute && b.startMinute < a.endMinute;
}
