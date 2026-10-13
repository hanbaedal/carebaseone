import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { navItems, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    navItems.map((item) => {
      const path = item.href === "/" ? "" : item.href;
      return {
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: item.href === "/" ? 1 : 0.7,
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
