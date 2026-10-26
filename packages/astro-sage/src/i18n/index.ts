import type { UIStrings } from "./types";

export { tplStr } from "./format";

const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

const translations: Record<string, UIStrings> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length);
  translations[locale] = mod.default;
}

/**
 * Returns UI strings for the given locale.
 *
 * Exact match first ("zh-CN"), then a match on the base language ("zh-Hans"
 * → "zh-CN"), then English. The base-language step keeps a site configured
 * with `lang: "zh-CN"` working even if the bundle is filed as "zh".
 */
export function useTranslations(locale: string = "en"): UIStrings {
  if (translations[locale]) return translations[locale];
  const base = locale.split("-")[0].toLowerCase();
  const match = Object.keys(translations).find(
    key =>
      key.toLowerCase() === base || key.toLowerCase().split("-")[0] === base
  );
  return match ? translations[match] : translations["en"];
}
