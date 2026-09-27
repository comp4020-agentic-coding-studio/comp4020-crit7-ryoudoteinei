import type { APIRoute } from "astro";
import { removeSavedSlot } from "../../lib/db";
import { validVisitorId, VISITOR_COOKIE } from "../../lib/visitor";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const owner = cookies.get(VISITOR_COOKIE)?.value;
  if (!validVisitorId(owner)) return redirect("/?error=session", 303);

  const form = await request.formData();
  const rawId = String(form.get("id") ?? "");
  const id = Number(rawId);
  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id < 1) {
    return redirect("/?error=slot", 303);
  }

  if (!removeSavedSlot(owner, id)) return redirect("/?error=slot", 303);
  return redirect("/?removed=1", 303);
};
