import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, inject, it } from "vitest";

const baseUrl = inject("baseUrl");
const visitorTag = String(process.hrtime.bigint());
const firstActivity = `Tutorial ${visitorTag}`;
const secondActivity = `Lab ${visitorTag}`;
const adjacentActivity = `Seminar ${visitorTag}`;

function get(cookie?: string) {
  return fetch(baseUrl, { headers: cookie ? { cookie } : undefined });
}

function post(path: string, cookie: string | undefined, values: Record<string, string>) {
  return fetch(new URL(path, baseUrl), {
    method: "POST",
    redirect: "manual",
    headers: { origin: baseUrl, ...(cookie ? { cookie } : {}) },
    body: new URLSearchParams(values),
  });
}

const slot = (activity: string, start: string, end: string) => ({
  courseCode: "COMP4020", activity, day: "Mon", start, end,
});

describe("a saved timetable draft", () => {
  let firstVisitor: string;
  let secondVisitor: string;

  beforeAll(async () => {
    const first = await get();
    const second = await get();
    firstVisitor = String(first.headers.get("set-cookie")?.split(";")[0]);
    secondVisitor = String(second.headers.get("set-cookie")?.split(";")[0]);
    expect(firstVisitor).toMatch(/^mytt_draft=/);
    expect(secondVisitor).toMatch(/^mytt_draft=/);
    expect(firstVisitor).not.toBe(secondVisitor);
  });

  it("persists a valid time after a new page request", async () => {
    const saved = await post("/api/slots", firstVisitor, slot(firstActivity, "15:30", "17:00"));
    expect(saved.status).toBe(303);
    expect(saved.headers.get("location")).toBe("/?saved=1");
    expect(await (await get(firstVisitor)).text()).toContain(firstActivity);
  });

  it("isolates two browsers, even when one guesses the other's row id", async () => {
    const otherPage = await (await get(secondVisitor)).text();
    expect(otherPage).not.toContain(firstActivity);

    const firstDoc = new JSDOM(await (await get(firstVisitor)).text()).window.document;
    const firstItem = [...firstDoc.querySelectorAll(".slot-card")].find((item) => item.textContent?.includes(firstActivity));
    const id = firstItem?.querySelector<HTMLInputElement>('input[name="id"]')?.value;
    expect(id).toMatch(/^\d+$/);

    const denied = await post("/api/delete-slot", secondVisitor, { id: String(id) });
    expect(denied.status).toBe(303);
    expect(denied.headers.get("location")).toBe("/?error=slot");
    expect(await (await get(firstVisitor)).text()).toContain(firstActivity);
  });

  it("marks real overlaps but not back-to-back times", async () => {
    expect((await post("/api/slots", firstVisitor, slot(secondActivity, "16:00", "17:00"))).status).toBe(303);
    expect((await post("/api/slots", firstVisitor, slot(adjacentActivity, "17:00", "18:00"))).status).toBe(303);

    const doc = new JSDOM(await (await get(firstVisitor)).text()).window.document;
    const conflicting = [...doc.querySelectorAll(".slot-clash")].map((item) => item.textContent ?? "");
    expect(conflicting).toHaveLength(2);
    expect(conflicting.join(" ")).toContain(firstActivity);
    expect(conflicting.join(" ")).toContain(secondActivity);
    expect(conflicting.join(" ")).not.toContain(adjacentActivity);
  });

  it("rejects invalid times and missing browser identity", async () => {
    const invalid = `Invalid ${visitorTag}`;
    expect((await post("/api/slots", firstVisitor, slot(invalid, "18:00", "17:00"))).headers.get("location"))
      .toContain("/?error=");
    expect((await post("/api/slots", undefined, slot(invalid, "15:30", "17:00"))).headers.get("location"))
      .toBe("/?error=session");
    expect(await (await get(firstVisitor)).text()).not.toContain(invalid);
  });

  it("removes only the requested saved entry", async () => {
    const doc = new JSDOM(await (await get(firstVisitor)).text()).window.document;
    const firstItem = [...doc.querySelectorAll(".slot-card")].find((item) => item.textContent?.includes(firstActivity));
    const id = firstItem?.querySelector<HTMLInputElement>('input[name="id"]')?.value;
    expect((await post("/api/delete-slot", firstVisitor, { id: String(id) })).headers.get("location"))
      .toBe("/?removed=1");
    const updated = await (await get(firstVisitor)).text();
    expect(updated).not.toContain(firstActivity);
    expect(updated).toContain(secondActivity);
  });
});
