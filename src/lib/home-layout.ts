import { GUEST_PAGE_GUTTER_X, GUEST_VIEWPORT_BELOW_HEADER } from "@/lib/guest-layout";

/** 헤더 아래 남는 뷰포트 (safe-area 반영) */
export const HOME_VIEWPORT_SHELL = GUEST_VIEWPORT_BELOW_HEADER;

/** 홈 히어로·풋터 좌측 기준선 (키커·헤드라인과 동일) */
export const HOME_CONTENT_GUTTER = `mx-auto w-full max-w-7xl ${GUEST_PAGE_GUTTER_X}`;