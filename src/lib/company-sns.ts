import type { CompanyProfileInput } from "@/lib/company-profile";

export type PublicSnsKey = "facebook" | "instagram" | "youtube" | "naverBlog";

export type CompanySnsLink = {
  key: PublicSnsKey;
  href: string;
  labelKo: string;
};

const SNS_DEFS: {
  key: PublicSnsKey;
  field: keyof CompanyProfileInput;
  labelKo: string;
}[] = [
  { key: "facebook", field: "snsFacebook", labelKo: "페이스북" },
  { key: "instagram", field: "snsInstagram", labelKo: "인스타그램" },
  { key: "youtube", field: "snsYoutube", labelKo: "유튜브" },
  { key: "naverBlog", field: "snsNaverCafe", labelKo: "네이버 블로그" },
];

export function companySnsLinks(
  profile: CompanyProfileInput,
  keys: PublicSnsKey[] = SNS_DEFS.map((d) => d.key),
): CompanySnsLink[] {
  const allow = new Set(keys);
  return SNS_DEFS.filter((d) => allow.has(d.key))
    .map((d) => {
      const href = String(profile[d.field] ?? "").trim();
      return { key: d.key, href, labelKo: d.labelKo };
    })
    .filter((item) => item.href.startsWith("http"));
}

export type FooterSnsLink = { href: string; label: string };

/** 푸터용 — 카카오 등 전체 SNS */
export function companySnsLinksAll(profile: CompanyProfileInput): FooterSnsLink[] {
  const main = companySnsLinks(profile).map((item) => ({
    href: item.href,
    label: item.labelKo,
  }));
  const kakao = String(profile.snsKakao ?? "").trim();
  if (kakao.startsWith("http")) {
    main.push({ href: kakao, label: "Kakao" });
  }
  return main;
}
