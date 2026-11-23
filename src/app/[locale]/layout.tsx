import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { ViewTracker } from "@/components/ViewTracker";
import { routing } from "@/i18n/routing";
import { getApprovedMember } from "@/lib/member-session";
import { getSession } from "@/lib/session";
import { siteUrl } from "@/lib/site";
import { GUEST_MAIN_SHELL } from "@/lib/guest-layout";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const sansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-kr",
});

const sansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans-sc",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = `${t("site")} · ${t("tagline")}`;
  const ogLocale =
    locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${t("site")}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("site"),
      title,
      description: t("description"),
      locale: ogLocale,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const [member, staff] = await Promise.all([getApprovedMember(), getSession()]);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sansKr.variable} ${sansSc.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-paper text-brand-ink"
        style={{
          fontFamily:
            "var(--font-sans-kr), var(--font-sans-sc), sans-serif",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <ViewTracker />
          <SiteHeader
            memberName={member?.name ?? null}
            staffRole={staff?.role ?? null}
          />
          <main className={GUEST_MAIN_SHELL}>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
