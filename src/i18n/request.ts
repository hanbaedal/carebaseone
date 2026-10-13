import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { getCmsMessages } from "@/lib/content";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await getCmsMessages(locale)) as AbstractIntlMessages,
  };
});
