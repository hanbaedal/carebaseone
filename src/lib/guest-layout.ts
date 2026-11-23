/**
 * 게스트(공개 [locale]) 레이아웃 — iOS safe-area·노치 대응
 * @see globals.css `--guest-header-total`, `h-guest-dvh` 등
 */

/** SiteHeader — 상태바·노치 아래로 내용 시작 */
export const GUEST_HEADER_SHELL = "sticky top-0 z-50 border-b border-line bg-white/95 text-brand-ink backdrop-blur-md pt-safe";

/** 헤더 실제 높이(대략 4.5rem + safe-top) — globals.css 변수 */
export const GUEST_STICKY_SUBNAV_TOP = "top-[var(--guest-header-total)]";

/** 홈·한 화면 쉘 (헤더·하단 safe-area 제외) */
export const GUEST_VIEWPORT_BELOW_HEADER =
  "flex h-guest-dvh max-h-guest-dvh flex-col overflow-hidden";

/** 본문 shell — 하단 safe-area는 globals.css `main` 규칙(홈 `h-guest-dvh` 제외) */
export const GUEST_MAIN_SHELL = "flex-1";

/** 가로 — 기존 px-4/sm:px-6 + safe (max로 큰 쪽) */
export const GUEST_PAGE_GUTTER_X = "px-guest-gutter";

/** 공개 홈페이지·게스트 본문 기준 가로폭 */
export const GUEST_CONTENT_WIDTH_PX = 1136;
export const GUEST_CONTENT_MAX = "max-w-[1136px]";

/** 헤더 hover 서브메뉴 — 한글 6자 + 좌우 px-4(2rem), 긴 라벨은 w-max로 확장 */
export const HEADER_SUBMENU_PANEL =
  "w-max min-w-[calc(6ch+2rem)] text-[13px]";

/** 헤더 본문 — 관리자 메뉴 5개 포함 시 한 줄 유지 */
export const GUEST_HEADER_INNER =
  "mx-auto flex w-full items-center justify-between gap-2 px-guest-gutter py-3 lg:gap-3 lg:py-4";

export function guestHeaderMaxWidth(staffRole: boolean) {
  return staffRole ? "max-w-[96rem]" : GUEST_CONTENT_MAX;
}

/** 헤더·사이트맵 링크 — 긴 관리 메뉴명 한 줄 */
export const HEADER_SUBMENU_LINK = "block whitespace-nowrap px-4 py-2";

/** 사이트맵 — 모바일 2열·촘촘, 노트북(lg) 4열·줄간 촘촘, PC(xl+) 간격 확대 */
export const SITEMAP_NAV_GRID =
  "grid grid-cols-2 gap-1.5 sm:gap-3 lg:grid-cols-4 lg:gap-1.5 lg:gap-y-1 xl:gap-3 2xl:gap-4";

/** 사이트맵 페이지 — lg만 세로 밀도 최대(노트북 한 화면), xl·2xl은 여유 */
export const SITEMAP_PAGE =
  "mx-auto w-full max-w-7xl space-y-2 px-guest-gutter py-3 sm:space-y-3 sm:py-4 lg:max-w-[96rem] lg:space-y-1.5 lg:py-2.5 xl:space-y-4 xl:py-6 2xl:space-y-6 2xl:py-8";

export const SITEMAP_SECTION_TITLE =
  "text-[11px] font-semibold leading-none tracking-wide text-brand-ink sm:text-[13px] lg:text-[12px] xl:text-sm xl:leading-normal 2xl:text-base";

export const SITEMAP_SECTION_BODY = "mt-1 sm:mt-1.5 lg:mt-0.5 xl:mt-2 2xl:mt-3";

export const SITEMAP_PAGE_TITLE =
  "text-xs font-semibold text-brand-ink sm:text-sm sm:font-semibold md:text-base xl:text-lg 2xl:text-xl";

export const SITEMAP_PAGE_LEDE =
  "mt-0.5 text-[10px] leading-snug text-brand-ink/55 sm:text-[11px] md:text-xs xl:text-sm 2xl:text-[15px]";

/** 섹션 카드 안쪽 세로 패딩 */
export const SITEMAP_CARD_ARTICLE = "py-2 sm:py-2.5 md:py-3 lg:py-1.5 xl:py-3.5 2xl:py-5";

/** 홈페이지관리 단독 1단 */
export const SITEMAP_ADMIN_HOME_GRID = "grid grid-cols-1 gap-2 sm:gap-3";

/** 사이트맵·계정 허브 카드 공통 */
export const SITEMAP_CARD_SHELL =
  "flex w-full min-w-0 flex-col rounded-lg border px-2 py-2 shadow-sm transition-all hover:shadow-md sm:rounded-xl sm:px-3 sm:py-3 md:px-4 md:py-3.5 lg:px-3 lg:py-2 xl:px-5 xl:py-4 2xl:rounded-2xl 2xl:px-6 2xl:py-5";