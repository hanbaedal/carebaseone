import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import catalog from "@/data/product-catalog.json";

export async function ProductLineGrid({
  category,
  heading,
}: {
  category: "patch" | "cosmetics" | "beverage";
  heading: string;
}) {
  const t = await getTranslations("productCatalog");
  const lineText = t as unknown as (key: string) => string;
  const lines = catalog.lines.filter((l) => l.category === category);

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-brand-ink">{heading}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {lines.map((line) => (
          <article
            key={line.slug}
            className="flex flex-col rounded-2xl border border-line bg-white p-5"
          >
            <h3 className="text-lg font-semibold text-brand-ink">
              {lineText(`lines.${line.slug}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
              {lineText(`lines.${line.slug}.summary`)}
            </p>
            {line.mediaHrefs && line.mediaHrefs.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {line.mediaHrefs.map((href) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand underline-offset-2 hover:underline"
                  >
                    {t("doc")}
                  </a>
                ))}
                <Link href="/community/archive" className="text-xs text-brand-ink/50">
                  {t("archiveLink")} →
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export async function ProductBeoneNote() {
  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const text = catalog.beoneNote[loc];
  return (
    <p className="max-w-3xl border-l-2 border-sage pl-5 text-sm leading-7 text-ink/70">{text}</p>
  );
}
