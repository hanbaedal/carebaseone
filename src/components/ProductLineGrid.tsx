import Image from "next/image";
import { Link } from "@/i18n/navigation";
import catalog from "@/data/product-catalog.json";

type Locale = "ko" | "en" | "zh";

function titleFor(line: (typeof catalog.lines)[number], locale: Locale) {
  if (locale === "ko") return line.titleKo;
  return line.titleKo;
}

function summaryFor(line: (typeof catalog.lines)[number], locale: Locale) {
  if (locale === "ko") return line.summaryKo;
  return line.summaryKo;
}

export function ProductLineGrid({
  locale,
  category,
  heading,
}: {
  locale: string;
  category: "patch" | "cosmetics" | "beverage";
  heading: string;
}) {
  const loc = (locale === "en" || locale === "zh" ? locale : "ko") as Locale;
  const lines = catalog.lines.filter((l) => l.category === category);

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-brand-ink">{heading}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {lines.map((line) => (
          <article
            key={line.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="relative aspect-[16/10] bg-cream/40">
              {line.image ? (
                <Image
                  src={line.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-brand-ink/40">
                  BEONE
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="text-lg font-semibold text-brand-ink">{titleFor(line, loc)}</h3>
              <p className="text-sm leading-relaxed text-brand-ink/70">{summaryFor(line, loc)}</p>
              {line.mediaHrefs && line.mediaHrefs.length > 0 ? (
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {line.mediaHrefs.map((href) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand underline-offset-2 hover:underline"
                    >
                      자료
                    </a>
                  ))}
                  <Link href="/community/archive" className="text-xs text-brand-ink/50">
                    자료실 →
                  </Link>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProductBeoneNote({ locale }: { locale: string }) {
  const loc = (locale === "en" || locale === "zh" ? locale : "ko") as Locale;
  const text = catalog.beoneNote[loc];
  return (
    <p className="max-w-3xl border-l-2 border-sage pl-5 text-sm leading-7 text-ink/70">{text}</p>
  );
}
