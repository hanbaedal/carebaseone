/** 사이트 전체 표시·집계 기준 시간대 */
export const KOREA_TIME_ZONE = "Asia/Seoul";

const localeMap: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
};

export function intlLocale(locale: string) {
  return localeMap[locale] ?? "ko-KR";
}

export function formatKoreaDate(
  value: Date | string | number,
  locale: string = "ko",
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "medium",
) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle,
    timeZone: KOREA_TIME_ZONE,
  }).format(date);
}

export function formatKoreaDateTime(
  value: Date | string | number,
  locale: string = "ko",
) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: KOREA_TIME_ZONE,
  }).format(date);
}

/** 주문번호 등 YYYYMMDD (한국 날짜) */
export function koreaYmd(value: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: KOREA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function startOfKoreaToday() {
  const day = koreaYmd(new Date());
  return new Date(`${day}T00:00:00+09:00`);
}
