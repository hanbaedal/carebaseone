const targets = {
  en: "en",
  zh: "zh-CN",
} as const;

function pieces(text: string) {
  if (text.length <= 450) return [text];
  const parts = text.split(/(?<=[.!?。])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const part of parts) {
    if (current && current.length + part.length > 450) {
      chunks.push(current);
      current = part;
    } else {
      current = current ? `${current} ${part}` : part;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translatePiece(text: string, target: keyof typeof targets) {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `ko|${targets[target]}`);
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("translate");
  const data = (await response.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };
  const translated = data.responseData?.translatedText?.trim();
  if (
    !translated ||
    data.responseStatus !== 200 ||
    translated.includes("MYMEMORY WARNING")
  ) {
    throw new Error("translate");
  }
  return translated;
}

export async function translateFromKorean(
  text: string,
  target: keyof typeof targets,
) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const translated = [];
  for (const piece of pieces(trimmed)) {
    translated.push(await translatePiece(piece, target));
  }
  return translated.join(target === "zh" ? "" : " ");
}
