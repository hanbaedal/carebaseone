import { getCollection } from "@/lib/mongodb";
import type { Role } from "@/lib/session";
import type { Json } from "@/lib/text";

export type UserDoc = {
  username: string;
  passwordHash: string;
  role: Role;
  disabled: boolean;
  createdAt: Date;
  createdBy: string;
};

export type ContentDoc = {
  locale: "ko" | "en" | "zh";
  messages: Record<string, Json>;
  updatedAt: Date;
  updatedBy: string;
};

export type PageViewDoc = {
  path: string;
  locale: "ko" | "en" | "zh";
  device: "pc" | "mobile";
  kind: "guest" | "staff";
  createdAt: Date;
};

export type ActivityDoc = {
  username: string;
  role: Role | "unknown";
  action: "login" | "login-failed" | "save-content" | "create-admin" | "update-admin";
  detail: string;
  createdAt: Date;
};

let indexesReady = false;

export async function ensureIndexes() {
  if (indexesReady) return;
  const users = await getCollection<UserDoc>("users");
  const views = await getCollection<PageViewDoc>("pageviews");
  const activity = await getCollection<ActivityDoc>("activity");
  await users.createIndex({ username: 1 }, { unique: true });
  await views.createIndex({ createdAt: -1 });
  await views.createIndex({ kind: 1, createdAt: -1 });
  await activity.createIndex({ createdAt: -1 });
  indexesReady = true;
}

export function users() {
  return getCollection<UserDoc>("users");
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
