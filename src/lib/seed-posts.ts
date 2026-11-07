import { ensureIndexes, posts } from "@/lib/db";
import { upsertPost } from "@/lib/posts";

export async function ensurePostSeed() {
  await ensureIndexes();
  const col = await posts();
  if ((await col.countDocuments()) > 0) return;

  const title = { ko: "CAREBASE 홈페이지가 새로 열렸습니다.", en: "CAREBASE website updated.", zh: "CAREBASE 网站已更新。" };
  const body = {
    ko: "특허·인증·연구 자료와 회원 주문 기능이 순차적으로 제공됩니다.",
    en: "Patents, certifications, research files, and member ordering are rolling out.",
    zh: "专利、认证、研究资料与会员订购功能将陆续开放。",
  };

  await upsertPost({
    slug: "welcome-2026",
    type: "notice",
    visibility: "public",
    title,
    body,
    mediaIds: [],
    pinned: true,
    published: true,
    createdBy: "seed",
  });

  await upsertPost({
    slug: "exhibition-placeholder",
    type: "gallery",
    visibility: "public",
    title: {
      ko: "전시회 갤러리",
      en: "Exhibition gallery",
      zh: "展会图集",
    },
    body: {
      ko: "전시회 사진과 영상은 관리자가 등록합니다.",
      en: "Exhibition photos will be added by administrators.",
      zh: "展会图片将由管理员上传。",
    },
    eventPlace: "서울",
    mediaIds: [],
    pinned: false,
    published: true,
    createdBy: "seed",
  });
}
