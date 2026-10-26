import en from "./lang/en";
import zhCN from "./lang/zh-CN";
import type { UIStrings } from "./types";

/**
 * Bundles available outside the browser.
 *
 * `src/i18n/index.ts` discovers its bundles with `import.meta.glob`, which
 * only exists inside Vite-processed modules. The Astro config context (where
 * the markdown pipeline and the diagram plugin are wired up) has no glob, so
 * these two bundles are imported statically.
 */
const BUNDLES: Record<string, UIStrings> = { en, "zh-CN": zhCN };

/** The UI strings for a locale, without the glob lookup. */
export function staticTranslations(locale: string = "en"): UIStrings {
  return (
    BUNDLES[locale] ?? BUNDLES[locale.split("-")[0].toLowerCase()] ?? BUNDLES.en
  );
}
