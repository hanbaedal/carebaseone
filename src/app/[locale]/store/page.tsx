import { getTranslations } from "next-intl/server";
import { getApprovedMember } from "@/lib/member-session";
import { listActiveProducts } from "@/lib/products";
import { Link } from "@/i18n/navigation";
import { StoreOrderForm } from "@/components/member/StoreOrderForm";
import { resolveLocale } from "@/lib/locale";

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const [t, tNav] = await Promise.all([getTranslations("store"), getTranslations("nav")]);
  const member = await getApprovedMember();
  const products = await listActiveProducts();

  if (!member) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-brand-ink">{t("title")}</h1>
        <p className="mt-4 text-brand-ink/70">{t("loginRequired")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/member/login" className="rounded-full bg-brand px-5 py-2 text-white">
            {tNav("memberSignIn")}
          </Link>
          <Link href="/member/signup" className="rounded-full border border-brand px-5 py-2 text-brand">
            {t("signup")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">{t("title")}</h1>
      <p className="mt-3 text-sm text-brand-ink/65">
        {member.name} · {t(`tier.${member.tier}`)}
      </p>
      <p className="mt-2 text-sm text-brand-ink/60">{t("orderNote")}</p>
      <StoreOrderForm products={products} member={member} />
      <Link href="/member/orders" className="mt-8 inline-block text-sm text-brand">
        {t("myOrders")}
      </Link>
    </div>
  );
}
