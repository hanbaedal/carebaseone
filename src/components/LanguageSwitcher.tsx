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
    <div className="flex items-center gap-3 text-[12px] font-medium tracking-[0.08em]">
      {routing.locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`border-b-2 pb-0.5 transition-colors ${
              active
                ? light
                  ? "border-white text-white"
                  : "border-brand text-brand"
                : light
                  ? "border-transparent text-white/65 hover:text-white"
                  : "border-transparent text-brand-ink/45 hover:text-brand"
            }`}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
