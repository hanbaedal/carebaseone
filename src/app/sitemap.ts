import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { footerExtraItems, navItems, siteUrl } from "@/lib/site";

const paths = [
  { href: "/", priority: 1 },
  ...navItems.map((item) => ({ href: item.href, priority: 0.8 })),
  ...footerExtraItems.map((item) => ({ href: item.href, priority: 0.6 })),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((item) => {
      const path = item.href === "/" ? "" : item.href;
      return {
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: item.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((code) => [
              code,
              `${siteUrl}/${code}${path}`,
            ]),
          ),
        },
      };
    }),
  );
}
