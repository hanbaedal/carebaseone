import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const PAGE_SIZE = 10;
const BLOCK = 10;

export function archivePageSize() {
  return PAGE_SIZE;
}

export function resolveArchivePage(requested: number | undefined, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(Math.max(1, requested ?? 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  return { page, totalPages, start, slice: { start, end: start + PAGE_SIZE } };
}

export async function ArchivePagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  const t = await getTranslations("community");
  if (totalPages <= 1) return null;

  const blockStart = Math.floor((page - 1) / BLOCK) * BLOCK + 1;
  const blockEnd = Math.min(totalPages, blockStart + BLOCK - 1);
  const prevBlock = Math.max(1, page - BLOCK);
  const nextBlock = Math.min(totalPages, page + BLOCK);
  const pages = Array.from({ length: blockEnd - blockStart + 1 }, (_, i) => blockStart + i);

  const linkClass = (active: boolean) =>
    `inline-flex min-w-[2.25rem] items-center justify-center rounded-lg border px-2 py-1.5 text-sm ${
      active
        ? "border-brand bg-brand text-white"
        : "border-line text-brand-ink/70 hover:border-brand/40 hover:text-brand"
    }`;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label={t("archivePagination")}
    >
      <Link href={`${basePath}?page=1`} className={linkClass(false)} aria-label={t("archiveFirst")}>
        {t("archiveFirst")}
      </Link>
      {blockStart > 1 ? (
        <Link href={`${basePath}?page=${prevBlock}`} className={linkClass(false)}>
          {t("archivePrevBlock")}
        </Link>
      ) : null}
      {pages.map((n) => (
        <Link key={n} href={`${basePath}?page=${n}`} className={linkClass(n === page)} aria-current={n === page ? "page" : undefined}>
          {n}
        </Link>
      ))}
      {blockEnd < totalPages ? (
        <Link href={`${basePath}?page=${nextBlock}`} className={linkClass(false)}>
          {t("archiveNextBlock")}
        </Link>
      ) : null}
      <Link
        href={`${basePath}?page=${totalPages}`}
        className={linkClass(false)}
        aria-label={t("archiveLast")}
      >
        {t("archiveLast")}
      </Link>
    </nav>
  );
}
