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

/** 헤더 hover 서브메뉴 — 한글 6자 + 좌우 px-4(2rem), 긴 라벨은 w-max로 확장 */
export const HEADER_SUBMENU_PANEL =
  "w-max min-w-[calc(6ch+2rem)] text-[13px]";

/** 헤더·사이트맵 링크 — 긴 관리 메뉴명 한 줄 */
export const HEADER_SUBMENU_LINK = "block whitespace-nowrap px-4 py-2";

/** 사이트맵 카드 그리드 — 셀 최소 폭 6자 + 패딩 */
export const SITEMAP_CARD_GRID =
  "grid gap-2 sm:gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,calc(6ch+2.5rem)),1fr))]";

/** 사이트맵·계정 허브 카드 공통 */
export const SITEMAP_CARD_SHELL =
  "flex w-full min-w-0 flex-col rounded-xl border px-3 py-3 shadow-sm transition-all hover:shadow-md sm:px-4 sm:py-3.5";