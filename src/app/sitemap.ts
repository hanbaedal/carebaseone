import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  communityNavItems,
  evidenceNavItems,
  footerExtraItems,
  navItems,
  siteUrl,
} from "@/lib/site";

const paths = [
  { href: "/", priority: 1 },
  ...navItems.map((item) => ({ href: item.href, priority: 0.8 })),
  ...evidenceNavItems.map((item) => ({ href: item.href, priority: 0.75 })),
  ...communityNavItems.map((item) => ({ href: item.href, priority: 0.7 })),
  ...footerExtraItems
    .filter((item) => !communityNavItems.some((c) => c.href === item.href))
    .filter((item) => !evidenceNavItems.some((e) => e.href === item.href))
    .map((item) => ({ href: item.href, priority: 0.65 })),
  { href: "/member/login", priority: 0.5 },
  { href: "/member/signup", priority: 0.5 },
  { href: "/sitemap", priority: 0.4 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const unique = new Map(paths.map((p) => [p.href, p]));
  return routing.locales.flatMap((locale) =>
    [...unique.values()].map((item) => {
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
