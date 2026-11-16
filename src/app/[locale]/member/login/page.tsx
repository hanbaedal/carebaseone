import { redirect } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";

export default async function MemberLoginRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/login", locale: resolveLocale(locale) });
}