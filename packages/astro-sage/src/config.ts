/**
 * Internal resolved configuration used throughout the codebase.
 *
 * Prefer editing your site's `sage.config.ts` instead of this file. This module exists to
 * apply defaults and expose a fully-resolved config shape (`ResolvedSageConfig`).
 */
import userConfig from "virtual:astro-sage/user-config";
import type { ResolvedSageConfig } from "./types/config";
import { PUBLIC_GOOGLE_SITE_VERIFICATION } from "astro:env/client";

const config: ResolvedSageConfig = {
  site: {
    ...userConfig.site,
    lang: userConfig.site.lang ?? "en",
    timezone: userConfig.site.timezone ?? "UTC",
    dir: userConfig.site.dir ?? "ltr",
    googleVerification:
      userConfig.site.googleVerification || PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  citation: {
    ...userConfig.citation,
    enabled: userConfig.citation?.enabled ?? true,
  },
  typography: { serif: userConfig.typography?.serif ?? "newsreader" },
  home: userConfig.home ?? {},
  comments: userConfig.comments ?? { provider: false },
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    scheduledPostMargin:
      userConfig.posts?.scheduledPostMargin ?? 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    showArchives: userConfig.features?.showArchives ?? true,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
  },
  socials: userConfig.socials ?? [],
};

export default config;
