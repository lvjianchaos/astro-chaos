/**
 * Prune the CJK font subsets the site doesn't use, and preload the common ones.
 *
 * The theme self-hosts 思源宋体 / 思源黑体 as ~200 unicode-range subsets
 * (~13 MB in dist). A browser only downloads the slices a page actually
 * renders, but every slice still ships with the site. This post-build step:
 *
 *   1. collects every character the built site can display (HTML, JS, CSS,
 *      XML — the UI strings live in the JS bundles),
 *   2. drops the @font-face rules whose unicode-range covers none of them,
 *      and deletes the now-unused .woff2 files,
 *   3. preloads the most-used subsets per family, so the first Chinese
 *      glyphs don't wait for a round trip.
 *
 * A subset is only dropped when no used character falls in its range, so
 * every character on the site keeps a font.
 *
 * Run after `astro build`: node scripts/prune-fonts.mjs
 */
import { readFile, writeFile, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const dist = resolve(process.cwd(), "dist");
/** How many subsets per family to preload. */
const PRELOAD_PER_FAMILY = 2;
/** Never prune below this many subsets per family (a floor for safety). */
const MIN_PER_FAMILY = 4;

const TEXT_EXT = new Set([
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".xml",
  ".txt",
  ".json",
]);

/** Every file in dist, recursively. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/** Parses a CSS unicode-range into [start, end] code point pairs. */
function parseRanges(css) {
  const ranges = [];
  for (const part of css.split(",")) {
    const token = part.trim().replace(/^U\+/i, "");
    if (!token) continue;
    if (token.includes("-")) {
      const [a, b] = token.split("-");
      ranges.push([parseInt(a, 16), parseInt(b, 16)]);
    } else {
      const n = parseInt(token, 16);
      ranges.push([n, n]);
    }
  }
  return ranges;
}

const used = new Set();
const files = await walk(dist);
for (const file of files) {
  if (!TEXT_EXT.has(extname(file))) continue;
  const { size } = await stat(file);
  if (size > 4 * 1024 * 1024) continue;
  const text = await readFile(file, "utf8");
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code > 0x7f) used.add(code);
  }
}
// Latin letters and digits live in the "latin" subsets; keep them always.
for (let c = 0x20; c < 0x7f; c++) used.add(c);
const usedList = [...used];

let prunedRules = 0;
let prunedFiles = 0;
let bytesSaved = 0;
const preloadByFamily = new Map();

for (const cssFile of files.filter((f) => extname(f) === ".css")) {
  const css = await readFile(cssFile, "utf8");
  const rules = css.match(/@font-face\s*\{[^}]*\}/g);
  if (!rules?.length) continue;

  const parsed = rules.map((rule) => {
    const range = /unicode-range:([^;}]+)/.exec(rule)?.[1];
    const url = /url\((\/[^)]+\.woff2)\)/.exec(rule)?.[1];
    const family = /font-family:([^;}]+)/.exec(rule)?.[1]?.trim() ?? "?";
    const ranges = range ? parseRanges(range) : null;
    const hits = ranges
      ? usedList.filter((c) => ranges.some(([a, b]) => c >= a && c <= b))
          .length
      : Infinity;
    return { rule, url, family, ranges, hits };
  });

  // Keep a rule when it covers at least one used character.
  const keep = new Set(
    parsed.filter((r) => r.hits > 0 || !r.ranges).map((r) => r.rule)
  );

  // Per family: never go below MIN_PER_FAMILY subsets.
  const families = new Map();
  for (const r of parsed) {
    if (!families.has(r.family)) families.set(r.family, []);
    families.get(r.family).push(r);
  }
  for (const list of families.values()) {
    const kept = list.filter((r) => keep.has(r.rule));
    if (kept.length >= MIN_PER_FAMILY) continue;
    const extra = list
      .filter((r) => !keep.has(r.rule))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, MIN_PER_FAMILY - kept.length);
    for (const r of extra) keep.add(r.rule);
  }

  const dropped = parsed.filter((r) => !keep.has(r.rule));
  if (!dropped.length) {
    // Nothing to prune here, but the kept subsets are still preload candidates.
    for (const r of parsed) {
      if (!r.url || !r.ranges) continue;
      const list = preloadByFamily.get(r.family) ?? [];
      list.push({ url: r.url, hits: r.hits });
      preloadByFamily.set(r.family, list);
    }
    continue;
  }

  let out = css;
  for (const r of dropped) out = out.replace(r.rule, "");
  await writeFile(cssFile, out);
  prunedRules += dropped.length;

  // Delete the woff2 files no kept rule references.
  const keptUrls = new Set(
    [...out.matchAll(/url\((\/[^)]+\.woff2)\)/g)].map((m) => m[1])
  );
  for (const r of parsed) {
    if (!r.url || keptUrls.has(r.url)) continue;
    const path = join(dist, r.url.replace(/^\//, ""));
    if (!existsSync(path)) continue;
    bytesSaved += (await stat(path)).size;
    await rm(path);
    prunedFiles++;
  }

  for (const r of parsed) {
    if (!r.url || !r.ranges || !keep.has(r.rule)) continue;
    const list = preloadByFamily.get(r.family) ?? [];
    list.push({ url: r.url, hits: r.hits });
    preloadByFamily.set(r.family, list);
  }
}

// The most-used subsets per family get preloaded.
const preloadUrls = [];
for (const list of preloadByFamily.values()) {
  list.sort((a, b) => b.hits - a.hits);
  preloadUrls.push(...list.slice(0, PRELOAD_PER_FAMILY).map((p) => p.url));
}

// Inject the preload links into every page.
const marker = "astro-chaos:font-preload";
let pages = 0;
for (const file of files.filter((f) => extname(f) === ".html")) {
  let html = await readFile(file, "utf8");
  if (!html.includes("</head>") || html.includes(marker)) continue;
  const links = [
    `<!-- ${marker} -->`,
    ...preloadUrls.map(
      (url) =>
        `<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>`
    ),
  ].join("");
  html = html.replace("</head>", `${links}</head>`);
  await writeFile(file, html);
  pages++;
}

console.log(
  `prune-fonts: 移除 ${prunedRules} 条 @font-face 规则、${prunedFiles} 个字体文件，` +
    `释放 ${(bytesSaved / 1024 / 1024).toFixed(1)} MB；预载 ${preloadUrls.length} 个分片（${pages} 个页面）`
);
