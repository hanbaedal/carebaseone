import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
};

export function SitemapLocaleLinks({
  activeLocale,
  caption,
}: {
  activeLocale: string;
  caption: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
      <span className="text-xs text-brand-ink/50">{caption}</span>
      <div className="flex flex-wrap gap-2">
        {routing.locales.map((code) => {
          const active = code === activeLocale;
          return (
            <Link
              key={code}
              href="/sitemap"
              locale={code}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand text-white"
                  : "bg-brand/5 text-brand-ink/75 hover:bg-brand/10 hover:text-brand"
              }`}
            >
              {localeLabels[code]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
