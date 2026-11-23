import {
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  defaultColorForTextPath,
  defaultFontForTextPath,
} from "@/lib/home-hero";
import { cmsTypoKind, isCmsTypoTextPath } from "@/lib/cms-typography";

export function cmsTypoInlineStyle(textPath: string, values: Record<string, string>) {
  if (!isCmsTypoTextPath(textPath)) return undefined;
  const kind = cmsTypoKind(textPath);
  if (!kind) return undefined;
  const scale = parseHomeScale(values[`${textPath}Scale`]);
  const color = resolveHomeTextColorHex(values[`${textPath}Color`], defaultColorForTextPath(textPath));
  const fontFamily = resolveHomeFontFamily(values[`${textPath}Font`], defaultFontForTextPath(textPath));
  const fontSize =
    kind === "kicker"
      ? homeKickerFontSizeFluid(scale)
      : kind === "title" || kind === "headline"
        ? homeHeadlineFontSizeFluid(scale)
        : homeLedeFontSizeFluid(scale);
  return { fontSize, color, fontFamily };
}

/** next-intl 섹션 t() + 상대 키로 인라인 스타일 생성 */
export function cmsTypoStyleFromT(
  section: string,
  relativeKey: string,
  t: (key: string) => string,
) {
  const textPath = `${section}.${relativeKey}`;
  const values: Record<string, string> = {};
  for (const kind of ["Scale", "Font", "Color"] as const) {
    try {
      const raw = t(`${relativeKey}${kind}`);
      values[`${textPath}${kind}`] = typeof raw === "string" ? raw : "";
    } catch {
      values[`${textPath}${kind}`] = "";
    }
  }
  return cmsTypoInlineStyle(textPath, values);
}
