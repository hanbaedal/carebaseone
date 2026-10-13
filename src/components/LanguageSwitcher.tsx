"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  ko: "KO",
  en: "EN",
  zh: "中文",
};

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-[11px] tracking-[0.16em]">
      {routing.locales.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 ? (
            <span className={light ? "text-cream/35" : "text-ink/25"}>|</span>
          ) : null}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`px-1 py-0.5 transition-colors ${
              locale === code
                ? light
                  ? "text-cream"
                  : "text-forest"
                : light
                  ? "text-cream/50 hover:text-cream"
                  : "text-ink/45 hover:text-ink"
            }`}
          >
            {labels[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
