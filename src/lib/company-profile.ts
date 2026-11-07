import { companyProfile, ensureIndexes, type CompanyProfileDoc } from "@/lib/db";
import { formatKoreaDateTimeStorage, mongoUpdated } from "@/lib/korea-time";
import { getCmsMessages } from "@/lib/content";
import { recordActivity } from "@/lib/users";
import type { Role } from "@/lib/session";

export type CompanyProfileInput = Omit<
  CompanyProfileDoc,
  "_id" | "updatedAt" | "updatedAtKst" | "updatedBy"
>;

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
    return rest;
  }
  const messages = (await getCmsMessages("ko")) as { meta?: { site?: string } };
  const base = emptyProfile();
  base.companyName = messages.meta?.site?.trim() || "CAREBASE";
  base.website = "https://carebaseone.com";
  return base;
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
