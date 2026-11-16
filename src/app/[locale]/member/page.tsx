import { redirect } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";

/** 회원 홈 — 사이트맵 허브로 통일 */
export default async function MemberHomeRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/sitemap", locale: resolveLocale(locale) });
}