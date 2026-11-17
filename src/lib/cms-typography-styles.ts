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
import { cmsTypoSlot } from "@/lib/cms-typography";

export function cmsTypoInlineStyle(textPath: string, values: Record<string, string>) {
  const slot = cmsTypoSlot(textPath);
  if (!slot) return undefined;
  const scale = parseHomeScale(values[`${textPath}Scale`]);
  const color = resolveHomeTextColorHex(values[`${textPath}Color`], defaultColorForTextPath(textPath));
  const fontFamily = resolveHomeFontFamily(values[`${textPath}Font`], defaultFontForTextPath(textPath));
  const fontSize =
    slot === "kicker"
      ? homeKickerFontSizeFluid(scale)
      : slot === "title" || slot === "headline"
        ? homeHeadlineFontSizeFluid(scale)
        : homeLedeFontSizeFluid(scale);
  return { fontSize, color, fontFamily };
}