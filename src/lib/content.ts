import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { contents, ensureIndexes } from "@/lib/db";
import { recordActivity } from "@/lib/users";
import type { Role } from "@/lib/session";
import { translateFromKorean } from "@/lib/translate";
import { deepMerge, flattenStrings, getPath, setPath, type Json } from "@/lib/text";

const files = { ko, en, zh } as const;
export type Locale = keyof typeof files;

const cache = globalThis as typeof globalThis & {
  cmsCache?: { at: number; messages: Partial<Record<Locale, Json>> };
};

export const contentSections = [
  { key: "nav", label: "메뉴" },
  { key: "home", label: "홈" },
  { key: "technology", label: "기술" },
  { key: "solution", label: "솔루션" },
  { key: "product", label: "제품" },
  { key: "global", label: "글로벌" },
  { key: "business", label: "비즈니스" },
  { key: "news", label: "소식" },
  { key: "contact", label: "문의" },
  { key: "cta", label: "버튼" },
  { key: "footer", label: "하단" },
  { key: "meta", label: "소개문" },
] as const;

export type EditorField = {
  path: string;
  label: string;
  ko: string;
  en: string;
  zh: string;
  multiline: boolean;
};

export function clearCmsCache() {
  if (cache.cmsCache) cache.cmsCache.at = 0;
}

async function overrides(locale: Locale) {
  const doc = await (await contents()).findOne({ locale });
  return doc?.messages ?? {};
}

export async function getCmsMessages(locale: string) {
  const key: Locale = locale === "en" || locale === "zh" ? locale : "ko";
  const now = Date.now();
  if (cache.cmsCache && now - cache.cmsCache.at < 15000 && cache.cmsCache.messages[key]) {
    return cache.cmsCache.messages[key] as Json;
  }
  const base = files[key] as unknown as Json;
  try {
    const merged = deepMerge(base, await overrides(key));
    cache.cmsCache = {
      at: now,
      messages: { ...(cache.cmsCache?.messages ?? {}), [key]: merged },
    };
    return merged;
  } catch {
    return base;
  }
}

function allowedPaths() {
  return new Set(flattenStrings(ko).map((field) => field.path));
}

export async function getEditorFields(section: string): Promise<EditorField[]> {
  const [korean, english, chinese] = await Promise.all([
    getCmsMessages("ko"),
    getCmsMessages("en"),
    getCmsMessages("zh"),
  ]);
  const sectionValue = (korean as Record<string, Json>)[section];
  return flattenStrings(sectionValue, section).map((field) => ({
    path: field.path,
    label: field.path.slice(section.length + 1).replaceAll(".", " · "),
    ko: field.value,
    en: getPath(english, field.path),
    zh: getPath(chinese, field.path),
    multiline: field.value.length > 70,
  }));
}

export async function saveSection(input: {
  section: string;
  username: string;
  role: Role;
  values: Record<string, { ko: string; en: string; zh: string }>;
}) {
  const section = contentSections.find((item) => item.key === input.section);
  if (!section) return { error: "없는 메뉴입니다." };

  const allowed = allowedPaths();
  const [korean, english, chinese] = await Promise.all([
    getCmsMessages("ko"),
    getCmsMessages("en"),
    getCmsMessages("zh"),
  ]);
  const koDoc = structuredClone((await overrides("ko")) as Record<string, Json>);
  const enDoc = structuredClone((await overrides("en")) as Record<string, Json>);
  const zhDoc = structuredClone((await overrides("zh")) as Record<string, Json>);
  let changed = 0;
  let failed = 0;

  for (const [path, value] of Object.entries(input.values)) {
    if (!allowed.has(path) || !path.startsWith(`${section.key}.`)) continue;
    const nextKo = value.ko.trim();
    const nextEn = value.en.trim();
    const nextZh = value.zh.trim();
    if (nextKo.length > 4000) return { error: "한 칸은 4000자까지 저장할 수 있습니다." };
    const currentKo = getPath(korean, path);
    const currentEn = getPath(english, path);
    const currentZh = getPath(chinese, path);
    const koChanged = nextKo !== currentKo;
    const enChanged = nextEn !== currentEn;
    const zhChanged = nextZh !== currentZh;
    if (!koChanged && !enChanged && !zhChanged) continue;

    let englishText = enChanged ? nextEn : currentEn;
    let chineseText = zhChanged ? nextZh : currentZh;
    if (koChanged && !enChanged) {
      try {
        englishText = await translateFromKorean(nextKo, "en");
      } catch {
        failed += 1;
      }
    }
    if (koChanged && !zhChanged) {
      try {
        chineseText = await translateFromKorean(nextKo, "zh");
      } catch {
        failed += 1;
      }
    }

    setPath(koDoc, path, nextKo);
    setPath(enDoc, path, englishText);
    setPath(zhDoc, path, chineseText);
    changed += 1;
  }

  if (changed === 0) return { error: "변경된 내용이 없습니다." };

  await ensureIndexes();
  const collection = await contents();
  const now = new Date();
  for (const [locale, messages] of [
    ["ko", koDoc],
    ["en", enDoc],
    ["zh", zhDoc],
  ] as const) {
    await collection.updateOne(
      { locale },
      {
        $set: {
          messages,
          updatedAt: now,
          updatedBy: input.username,
        },
      },
      { upsert: true },
    );
  }
  clearCmsCache();
  await recordActivity({
    username: input.username,
    role: input.role,
    action: "save-content",
    detail: section.label,
  });
  return { error: failed > 0 ? "partial" : null };
}
