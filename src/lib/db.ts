import { getCollection } from "@/lib/mongodb";
import type { Role } from "@/lib/session";
import type { Json } from "@/lib/text";

export type UserDoc = {
  username: string;
  passwordHash: string;
  /** 가입·변경 시 입력값 그대로(Compass 확인용). 로그인은 passwordHash 만 사용 */
  passwordPlain?: string;
  seedSyncedAt?: Date;
  seedSyncedAtKst?: string;
  role: Role;
  disabled: boolean;
  createdAt: Date;
  createdAtKst?: string;
  createdBy: string;
};

export type MemberStatus = "pending" | "approved" | "held" | "deleted";
export type MemberTier = "general" | "silver" | "gold" | "vip" | "vvip";
export type MemberSignupChannel = "local" | "kakao" | "google";

export type MemberDoc = {
  username: string;
  passwordHash?: string;
  /** 가입·변경 시 입력값 그대로(Compass 확인용) */
  passwordPlain?: string;
  name: string;
  email: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  note: string;
  status: MemberStatus;
  tier: MemberTier;
  signupChannel: MemberSignupChannel;
  oauthId?: string;
  phoneVerified: boolean;
  createdAt: Date;
  createdAtKst?: string;
  updatedAt: Date;
  updatedAtKst?: string;
  approvedAt?: Date;
  approvedAtKst?: string;
  approvedBy?: string;
};

export type PostType = "notice" | "archive" | "gallery";
export type PostVisibility = "public" | "member";

export type PostDoc = {
  slug: string;
  type: PostType;
  visibility: PostVisibility;
  title: Record<"ko" | "en" | "zh", string>;
  body: Record<"ko" | "en" | "zh", string>;
  eventAt?: Date;
  eventAtKst?: string;
  eventPlace?: string;
  mediaIds: string[];
  pinned: boolean;
  published: boolean;
  createdAt: Date;
  createdAtKst?: string;
  updatedAt: Date;
  updatedAtKst?: string;
  createdBy: string;
};

export type MediaCategory =
  | "patent"
  | "certification"
  | "research"
  | "product"
  | "other";

export type MediaAudience = "public" | "member";

export type MediaStorage = "gridfs" | "missing";

export type MediaDoc = {
  slug: string;
  category: MediaCategory;
  audience: MediaAudience;
  title: Record<"ko" | "en" | "zh", string>;
  summary: Record<"ko" | "en" | "zh", string>;
  /** 다운로드 URL — `/api/media/{slug}` */
  filePath: string;
  fileName: string;
  mime: string;
  size: number;
  tags: string[];
  published: boolean;
  storage: MediaStorage;
  gridFsId?: string;
  createdBy: string;
  createdAt: Date;
  createdAtKst?: string;
  updatedAt: Date;
  updatedAtKst?: string;
};

export type ProductDoc = {
  slug: string;
  title: Record<"ko" | "en" | "zh", string>;
  summary: Record<"ko" | "en" | "zh", string>;
  price: number;
  active: boolean;
  createdAt: Date;
  createdAtKst?: string;
  updatedAt: Date;
  updatedAtKst?: string;
};

export type OrderStatus =
  | "received"
  | "preparing"
  | "shipped"
  | "done"
  | "cancelled";

export type OrderDoc = {
  orderNo: string;
  memberUsername: string;
  items: { productSlug: string; title: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  createdAt: Date;
  createdAtKst?: string;
  updatedAt: Date;
  updatedAtKst?: string;
};

export type ContentDoc = {
  locale: "ko" | "en" | "zh";
  messages: Record<string, Json>;
  updatedAt: Date;
  updatedAtKst?: string;
  updatedBy: string;
};

export type PageViewDoc = {
  path: string;
  locale: "ko" | "en" | "zh";
  device: "pc" | "mobile";
  kind: "guest" | "staff";
  createdAt: Date;
  createdAtKst?: string;
};

export type InquiryDoc = {
  name: string;
  organization: string;
  email: string;
  country: string;
  partnerType: string;
  audience: string;
  message: string;
  memberUsername?: string;
  createdAt: Date;
  createdAtKst?: string;
};

export type ActivityDoc = {
  username: string;
  role: Role | "unknown" | "member";
  action: string;
  detail: string;
  createdAt: Date;
  createdAtKst?: string;
};

/** 슈퍼바이저·관리자 공통 — 회사·푸터 SNS (thejohn staff-self-edit 형식) */
export type CompanyProfileDoc = {
  _id: "site";
  companyName: string;
  representativeName: string;
  companyPhone: string;
  companyFax: string;
  companyEmail: string;
  representativePhone: string;
  website: string;
  businessRegistrationNumber: string;
  businessType: string;
  businessItem: string;
  snsFacebook: string;
  snsInstagram: string;
  snsNaverCafe: string;
  snsYoutube: string;
  snsKakao: string;
  updatedAt: Date;
  updatedAtKst?: string;
  updatedBy: string;
};

let indexesReady = false;

export async function ensureIndexes() {
  if (indexesReady) return;
  const usersCol = await getCollection<UserDoc>("users");
  const views = await getCollection<PageViewDoc>("pageviews");
  const activityCol = await getCollection<ActivityDoc>("activity");
  const members = await getCollection<MemberDoc>("members");
  const posts = await getCollection<PostDoc>("posts");
  const media = await getCollection<MediaDoc>("media");
  const products = await getCollection<ProductDoc>("products");
  const orders = await getCollection<OrderDoc>("orders");
  const inquiries = await getCollection<InquiryDoc>("inquiries");

  await usersCol.createIndex({ username: 1 }, { unique: true });
  await members.createIndex({ username: 1 }, { unique: true });
  await members.createIndex({ status: 1, createdAt: -1 });
  await members.createIndex(
    { signupChannel: 1, oauthId: 1 },
    { unique: true, sparse: true },
  );
  await posts.createIndex({ slug: 1 }, { unique: true });
  await posts.createIndex({ type: 1, published: 1, createdAt: -1 });
  await media.createIndex({ slug: 1 }, { unique: true });
  await media.createIndex({ category: 1, published: 1 });
  await products.createIndex({ slug: 1 }, { unique: true });
  await orders.createIndex({ orderNo: 1 }, { unique: true });
  await orders.createIndex({ memberUsername: 1, createdAt: -1 });
  await inquiries.createIndex({ createdAt: -1 });
  await views.createIndex({ createdAt: -1 });
  await views.createIndex({ kind: 1, createdAt: -1 });
  await activityCol.createIndex({ createdAt: -1 });
  indexesReady = true;
}

export function users() {
  return getCollection<UserDoc>("users");
}

export function members() {
  return getCollection<MemberDoc>("members");
}

export function posts() {
  return getCollection<PostDoc>("posts");
}

export function media() {
  return getCollection<MediaDoc>("media");
}

export function products() {
  return getCollection<ProductDoc>("products");
}

export function orders() {
  return getCollection<OrderDoc>("orders");
}

export function contents() {
  return getCollection<ContentDoc>("contents");
}

export function pageviews() {
  return getCollection<PageViewDoc>("pageviews");
}

export function activity() {
  return getCollection<ActivityDoc>("activity");
}

export function inquiries() {
  return getCollection<InquiryDoc>("inquiries");
}

export function companyProfile() {
  return getCollection<CompanyProfileDoc>("company_profile");
}
