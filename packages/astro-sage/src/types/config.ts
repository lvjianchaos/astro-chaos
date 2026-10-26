interface SiteConfig {
  /** Deployed URL of the site, e.g. "https://example.com" */
  url: string;
  /** Blog title shown in header and meta tags */
  title: string;
  /** Short description used in SEO meta and RSS feed */
  description: string;
  /** Default post author name */
  author: string;
  /** Author profile URL (used in structured data) */
  profile?: string;
  /** Link to this site's source repository (shown in the footer). */
  repo?: string;
  /** HTML lang attribute, defaults to "en" */
  lang?: string;
  /** IANA timezone for post dates, e.g. "Asia/Bangkok" */
  timezone?: string;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Google Search Console verification meta tag value */
  googleVerification?: string;
}

interface PostsConfig {
  /** Posts per page on paginated listing pages */
  perPage?: number;
  /** Posts shown on the index/home page */
  perIndex?: number;
  /**
   * Scheduled posts within this window (ms) of their pubDatetime
   * are shown as published. Defaults to 15 minutes.
   */
  scheduledPostMargin?: number;
}

interface FeaturesConfig {
  /** Enable light/dark mode toggle. Defaults to true. */
  lightAndDarkMode?: boolean;
  /** Show the /archives page and link it in nav. Defaults to true. */
  showArchives?: boolean;
  /** Show back button on post detail pages. Defaults to true. */
  showBackButton?: boolean;
  /** "Edit page" link shown on post detail pages. */
  editPost?:
    | {
        enabled: true;
        /** Base URL for the edit link, e.g. GitHub edit URL */
        url: string;
      }
    | { enabled: false };
  /**
   * Search provider. "pagefind" ships in the base template.
   * Set to false to disable search entirely.
   */
  search?: "pagefind" | false;
}

interface SocialLink {
  /**
   * Must match a filename in src/assets/icons/socials/.
   * e.g. "github" → src/assets/icons/socials/github.svg
   */
  name: string;
  url: string;
  /**
   * Accessible label for the icon link (aria-label, title attribute).
   * Auto-generated if omitted: "{site.title} on GitHub", "Send an email to {site.title}", etc.
   * Override when the default wording doesn't fit.
   */
  linkTitle?: string;
}

interface TypographyConfig {
  /**
   * Reading serif for body and headings. Defaults to "newsreader".
   * All bundled faces are variable (optical sizing optional).
   */
  serif?: "source-serif-4" | "literata" | "newsreader";
  /**
   * Ship the optical-size axis (finer headings, sturdier small text).
   * Costs ~70 KB more font per style and ~5 points of mobile Lighthouse
   * performance on slow connections. Defaults to false.
   */
  opticalSizing?: boolean;
  /**
   * System font stacks used if the self-hosted faces can't load. End each
   * with a generic family (serif / monospace). Defaults: see
   * DEFAULT_SERIF_FALLBACKS / DEFAULT_MONO_FALLBACKS.
   */
  fallbacks?: { serif?: string[]; mono?: string[] };
  /**
   * Indent paragraphs by two characters (中文首行缩进). Defaults to false:
   * algorithm write-ups usually separate paragraphs with blank lines.
   */
  paragraphIndent?: boolean;
}

interface HomeConfig {
  /** Heading on the home page. Defaults to site.title. */
  title?: string;
  /** Intro paragraph (plain text or inline HTML) on the home page. */
  intro?: string;
}

export interface SageConfig {
  site: SiteConfig;
  typography?: TypographyConfig;
  home?: HomeConfig;
  posts?: PostsConfig;
  features?: FeaturesConfig;
  /** Social profile links shown in header/footer */
  socials?: SocialLink[];
}

type ResolvedSiteConfig = Required<
  Pick<
    SiteConfig,
    "url" | "title" | "description" | "author" | "lang" | "timezone" | "dir"
  >
> &
  Pick<SiteConfig, "profile" | "repo" | "googleVerification">;

export interface ResolvedSageConfig {
  site: ResolvedSiteConfig;
  typography: Required<Pick<TypographyConfig, "serif">> & TypographyConfig;
  home: HomeConfig;
  posts: Required<PostsConfig>;
  features: Required<FeaturesConfig>;
  socials: SocialLink[];
}

/**
 * Type helper for astro-paper.config.ts.
 * Provides full IntelliSense without any runtime overhead.
 */
export function defineSageConfig(config: SageConfig): SageConfig {
  return config;
}
