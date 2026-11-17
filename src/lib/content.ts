import { cache as reactCache } from "react";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { contents, ensureIndexes } from "@/lib/db";
import { mongoUpdated } from "@/lib/korea-time";
import { recordActivity } from "@/lib/users";
import type { Role } from "@/lib/session";
import { translateFromKorean } from "@/lib/translate";
import { deepMerge, flattenStrings, getPath, setPath, type Json } from "@/lib/text";

const files = { ko, en, zh } as const;
export type Locale = keyof typeof files;

const cmsMsgCache = globalThis as typeof globalThis & {
  cmsCache?: { at: number; messages: Partial<Record<Locale, Json>> };
};

/** 공개 사이트 메뉴 순서에 맞춤 (홈·공통 → 헤더 순) */
export const contentSections = [
  { key: "home", label: "홈" },
  { key: "meta", label: "로고·회사명" },
  { key: "nav", label: "메뉴" },
  { key: "about", label: "회사소개" },
  { key: "aboutGreeting", label: "인사말" },
  { key: "aboutFeatures", label: "회사특징" },
  { key: "solution", label: "솔루션" },
  { key: "global", label: "글로벌" },
  { key: "business", label: "사업협력" },
  { key: "product", label: "제품" },
  { key: "technology", label: "기술" },
  { key: "community", label: "커뮤니티" },
  { key: "news", label: "소식" },
  { key: "contact", label: "문의" },
  { key: "cta", label: "버튼" },
  { key: "footer", label: "하단" },
] as const;

export type EditorField = {
  path: string;
  label: string;
  ko: string;
  en: string;
  zh: string;
  multiline: boolean;
};

/** /admin/cms — 한국어 슬롯만 (en/zh 조회 없음) */
export type KoCmsField = {
  path: string;
  label: string;
  ko: string;
  multiline: boolean;
};

export function clearCmsCache() {
  if (cmsMsgCache.cmsCache) cmsMsgCache.cmsCache.at = 0;
}

async function overrides(locale: Locale) {
  const doc = await (await contents()).findOne({ locale });
  return doc?.messages ?? {};
}

async function loadCmsMessages(locale: string) {
  const key: Locale = locale === "en" || locale === "zh" ? locale : "ko";
  const now = Date.now();
  if (cmsMsgCache.cmsCache && now - cmsMsgCache.cmsCache.at < 15000 && cmsMsgCache.cmsCache.messages[key]) {
    return cmsMsgCache.cmsCache.messages[key] as Json;
  }
  const base = files[key] as unknown as Json;
  try {
    const merged = deepMerge(base, await overrides(key));
    cmsMsgCache.cmsCache = {
      at: now,
      messages: { ...(cmsMsgCache.cmsCache?.messages ?? {}), [key]: merged },
    };
    return merged;
  } catch {
    return base;
  }
}

/** 요청당 중복 조회 방지 (layout + cms 페이지) */
export const getCmsMessages = reactCache(loadCmsMessages);

function allowedPaths() {
  return new Set(flattenStrings(ko).map((field) => field.path));
}

/** URL·숫자·스케일 등 — 번역 API 호출 생략 */
function skipAutoTranslate(path: string, koText: string) {
  if (
    path.endsWith("Scale") ||
    path.endsWith("Color") ||
    path.endsWith("Font") ||
    path.endsWith("footerBg") ||
    path.endsWith("heroImage")
  )
    return true;
  if (/\.(heroImage|image)$/i.test(path)) return true;
  if (!/[가-힣]/.test(koText)) return true;
  return false;
}

export async function getKoCmsEditorFields(section: string): Promise<KoCmsField[]> {
  const korean = await getCmsMessages("ko");
  const sectionValue = (korean as Record<string, Json>)[section];
  return flattenStrings(sectionValue, section).map((field) => ({
    path: field.path,
    label: field.path.slice(section.length + 1).replaceAll(".", " · "),
    ko: field.value,
    multiline: field.value.length > 70,
  }));
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
    /** 관리 화면은 한글만 보냄 — en/zh 빈 값이면 직접 수정이 아님 */
    const koOnlySubmit = nextEn === "" && nextZh === "";
    const enChanged = !koOnlySubmit && nextEn !== currentEn;
    const zhChanged = !koOnlySubmit && nextZh !== currentZh;
    if (!koChanged && !enChanged && !zhChanged) continue;

    let englishText = enChanged ? nextEn : currentEn;
    let chineseText = zhChanged ? nextZh : currentZh;
    const autoTranslate =
      koChanged && koOnlySubmit && !skipAutoTranslate(path, nextKo);
    if (autoTranslate) {
      const [enResult, zhResult] = await Promise.allSettled([
        !enChanged || koOnlySubmit
          ? translateFromKorean(nextKo, "en")
          : Promise.resolve(englishText),
        !zhChanged || koOnlySubmit
          ? translateFromKorean(nextKo, "zh")
          : Promise.resolve(chineseText),
      ]);
      if (enResult.status === "fulfilled") englishText = enResult.value;
      else failed += 1;
      if (zhResult.status === "fulfilled") chineseText = zhResult.value;
      else failed += 1;
    } else if (koChanged && koOnlySubmit) {
      englishText = nextKo;
      chineseText = nextKo;
    }

    setPath(koDoc, path, nextKo);
    setPath(enDoc, path, englishText);
    setPath(zhDoc, path, chineseText);
    changed += 1;
  }

  if (changed === 0) return { error: "변경된 내용이 없습니다." };

  await ensureIndexes();
  const collection = await contents();
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
          ...mongoUpdated(),
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
