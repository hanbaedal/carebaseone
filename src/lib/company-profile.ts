import { companyProfile, ensureIndexes, type CompanyProfileDoc } from "@/lib/db";
import { formatKoreaDateTimeStorage, mongoUpdated } from "@/lib/korea-time";
import { getCmsMessages } from "@/lib/content";
import { recordActivity } from "@/lib/users";
import type { Role } from "@/lib/session";

export type CompanyProfileInput = Omit<
  CompanyProfileDoc,
  "_id" | "updatedAt" | "updatedAtKst" | "updatedBy"
>;

/** DB 비어 있을 때 공개 SNS (관리자 정보 수정 값이 우선) */
export const SITE_SNS_DEFAULTS: Pick<
  CompanyProfileInput,
  "snsFacebook" | "snsInstagram" | "snsYoutube" | "snsNaverCafe"
> = {
  snsFacebook: "https://www.facebook.com/profile.php?id=61596489113854",
  snsInstagram: "https://www.instagram.com/carebase.kr/",
  snsYoutube: "https://www.youtube.com/channel/UCycMxD82rFtJyCT53w8MUZA",
  snsNaverCafe:
    "https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0",
};

function withSiteSnsDefaults(profile: CompanyProfileInput): CompanyProfileInput {
  const out = { ...profile };
  for (const key of Object.keys(SITE_SNS_DEFAULTS) as (keyof typeof SITE_SNS_DEFAULTS)[]) {
    if (!String(out[key] ?? "").trim()) {
      out[key] = SITE_SNS_DEFAULTS[key];
    }
  }
  return out;
}

const emptyProfile = (): CompanyProfileInput => ({
  companyName: "",
  representativeName: "",
  companyPhone: "",
  companyFax: "",
  companyEmail: "",
  representativePhone: "",
  website: "",
  businessRegistrationNumber: "",
  businessType: "",
  businessItem: "",
  snsFacebook: "",
  snsInstagram: "",
  snsNaverCafe: "",
  snsYoutube: "",
  snsKakao: "",
});

export async function getCompanyProfile(): Promise<CompanyProfileInput> {
  await ensureIndexes();
  const doc = await (await companyProfile()).findOne({ _id: "site" });
  if (doc) {
    const { _id, updatedAt, updatedAtKst, updatedBy, ...rest } = doc;
    return withSiteSnsDefaults(rest);
  }
  const messages = (await getCmsMessages("ko")) as { meta?: { site?: string } };
  const base = emptyProfile();
  base.companyName = messages.meta?.site?.trim() || "CAREBASE";
  base.website = "https://carebaseone.com";
  return withSiteSnsDefaults(base);
}

export async function saveCompanyProfile(input: {
  values: CompanyProfileInput;
  username: string;
  role: Role;
}) {
  await ensureIndexes();
  const col = await companyProfile();
  const updated = new Date();
  await col.updateOne(
    { _id: "site" },
    {
      $set: {
        ...input.values,
        _id: "site",
        updatedAt: updated,
        updatedAtKst: formatKoreaDateTimeStorage(updated),
        updatedBy: input.username,
      },
    },
    { upsert: true },
  );
  await recordActivity({
    username: input.username,
    role: input.role,
    action: "save-company-profile",
    detail: input.values.companyName,
  });
  return null;
}
