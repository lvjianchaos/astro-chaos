/**
 * Reading-time estimate that understands Chinese.
 *
 * Latin text is counted in words (~230 wpm); Chinese has no spaces, so Han
 * characters are counted separately (~400 字/min). Counting only
 * whitespace-separated words makes every Chinese article read as "1 minute".
 */
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;

/** Strips code, math and HTML so they don't inflate the count. */
function prose(markdown: string | undefined): string {
  return (markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ");
}

export function readingTime(markdown: string | undefined): number {
  const text = prose(markdown);
  const words = text.split(/\s+/).filter(Boolean).length;
  const han = text.match(HAN)?.length ?? 0;
  return Math.max(1, Math.round(words / 230 + han / 400));
}

/**
 * Which measure a post should use.
 *
 * The Chinese column is counted in 全角字 (36–40 per line); Latin text reads
 * best at 66–71 characters. A post that is mostly Latin would end up with a
 * ~50-character column — too narrow — so it gets the Latin measure instead.
 *
 * "cjk" | "latin" | undefined (auto-detect from the content).
 */
export function detectMeasure(
  markdown: string | undefined
): "cjk" | "latin" | undefined {
  const text = prose(markdown);
  const han = text.match(HAN)?.length ?? 0;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  if (han + latin === 0) return undefined;
  // Below ~15% Han characters the text reads as Latin.
  return han / (han + latin) < 0.15 ? "latin" : "cjk";
}
