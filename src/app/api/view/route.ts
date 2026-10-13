import { recordPageView } from "@/lib/stats";
import { getSession } from "@/lib/session";

const locales = new Set(["ko", "en", "zh"]);

export async function POST(request: Request) {
  let body: { path?: unknown; locale?: unknown };
  try {
    body = (await request.json()) as { path?: unknown; locale?: unknown };
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 120) : "";
  const locale = typeof body.locale === "string" ? body.locale : "";
  if (!path.startsWith("/") || path.startsWith("//") || !locales.has(locale)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const agent = request.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider|headless/i.test(agent)) {
    return Response.json({ ok: true });
  }

  const device = /mobile|android|iphone|ipad/i.test(agent) ? "mobile" : "pc";
  const session = await getSession();

  try {
    await recordPageView({
      path,
      locale: locale as "ko" | "en" | "zh",
      device,
      kind: session ? "staff" : "guest",
    });
  } catch {
    return Response.json({ ok: false });
  }

  return Response.json({ ok: true });
}
