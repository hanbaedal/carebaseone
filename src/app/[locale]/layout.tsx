import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

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

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sansKr.variable} ${sansSc.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-cream text-ink"
        style={{
          fontFamily:
            "var(--font-sans-kr), var(--font-sans-sc), sans-serif",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
