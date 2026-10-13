export type Json =
  | string
  | { [key: string]: Json };

export function deepMerge<T>(base: T, override: unknown): T {
  if (typeof base !== "object" || base === null || Array.isArray(base)) {
    return (override as T) ?? base;
  }
  const source =
    override && typeof override === "object"
      ? (override as Record<string, unknown>)
      : {};
  const result: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };
  for (const [key, value] of Object.entries(source)) {
    const current = result[key];
    result[key] =
      current && typeof current === "object" && !Array.isArray(current)
        ? deepMerge(current, value)
        : value;
  }
  return result as T;
}

export function getPath(source: unknown, path: string) {
  let current: unknown = source;
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : "";
}

export function setPath(source: Record<string, Json>, path: string, value: string) {
  const keys = path.split(".");
  let current: Record<string, Json> = source;
  for (const key of keys.slice(0, -1)) {
    const next = current[key];
    if (!next || typeof next !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, Json>;
  }
  current[keys[keys.length - 1]] = value;
}

export function flattenStrings(source: unknown, prefix = "") {
  const fields: { path: string; value: string }[] = [];
  if (typeof source === "string") {
    if (prefix) fields.push({ path: prefix, value: source });
    return fields;
  }
  if (!source || typeof source !== "object") return fields;
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;
    fields.push(...flattenStrings(value, path));
  }
  return fields;
}
