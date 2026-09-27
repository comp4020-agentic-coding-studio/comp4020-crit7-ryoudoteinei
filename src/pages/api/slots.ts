import type { APIRoute } from "astro";
import { addSavedSlot } from "../../lib/db";
import { parseSlotInput } from "../../lib/timetable";
import { validVisitorId, VISITOR_COOKIE } from "../../lib/visitor";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const owner = cookies.get(VISITOR_COOKIE)?.value;
  if (!validVisitorId(owner)) return redirect("/?error=session", 303);

  const parsed = parseSlotInput(await request.formData());
  if ("error" in parsed) {
    return redirect(`/?error=${encodeURIComponent(parsed.error)}`, 303);
  }

  addSavedSlot(owner, parsed.value);
  return redirect("/?saved=1", 303);
};
