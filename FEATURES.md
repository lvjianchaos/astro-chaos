# AstroSage features

> **This is the `io-chaos` fork.** It adds a Chinese-first typography layer, a
> `category` field (article type) on top of `tags`/`series`, and a `zh-CN`
> UI bundle.

A reference for agents and contributors: what the theme supports, how to switch each feature on, and where to find a working example. Keep it accurate: when a feature is added, changed or removed, update this file in the same commit.

Working examples live in the site:

- [`apps/site/src/content/posts/p1002-guo-he-zu.md`](apps/site/src/content/posts/p1002-guo-he-zu.md) — a 题解 with the problem statement in a quote block, KaTeX and a C++ block.
- [`apps/site/src/content/posts/monotonic-stack.md`](apps/site/src/content/posts/monotonic-stack.md) — an 算法 note with a Mermaid diagram and a table.
- [`apps/site/src/content/posts/p3385-negative-cycle.md`](apps/site/src/content/posts/p3385-negative-cycle.md) — a 题目 retrospective with a callout and a highlighted code range.
- [`apps/site/src/content/pages/about.md`](apps/site/src/content/pages/about.md) — a page.
- [`apps/site/sage.config.ts`](apps/site/sage.config.ts), [`apps/site/astro.config.ts`](apps/site/astro.config.ts) — the site configuration.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Astro 7, shipped as an integration (`astroSage(config)`) that injects every route |
| Language | TypeScript (published as source; Astro compiles it) |
| Markdown | Sätteri (`@astrojs/markdown-satteri`) with custom mdast/hast plugins; MDX via `@astrojs/mdx` |
| Styling | Tailwind CSS 4 plus plain CSS with design tokens (`src/styles/theme.css`) |
| Fonts | Astro Fonts API, self-hosted Fontsource: Newsreader (Latin reading face) + 思源宋体 Noto Serif SC Variable (Chinese body) + 思源黑体 Noto Sans SC Variable (Chinese headings/UI) + JetBrains Mono (Latin code/UI) |
| Code | Expressive Code (Gruvbox), line numbers and collapsible sections plugins |
| Math | KaTeX, rendered at build time |
| Diagrams | Mermaid (`mermaid-isomorphic`) and Excalidraw (`@excalidraw/utils`), rendered at build time in headless Chromium (Playwright) |
| Search | Pagefind |
| Comments (optional) | utterances (GitHub Issues) or giscus (GitHub Discussions), client-side embeds |
| Tests | Playwright + axe-core (desktop and mobile), oxlint, Prettier |
| Output | Fully static (SSG): `astro build` writes plain files to `dist/`; no adapter, server or database; any static host |
| Distribution | npm package `astro-sage` (TypeScript source, no build step); any package manager; Node ≥ 22.12. The repo is a pnpm workspace |

## Setup

Three files wire a site up (`pnpm add astro-sage`; full versions in the [README](README.md#add-it-to-an-existing-astro-site)):

```ts
// astro.config.ts
integrations: [astroSage(sageConfig)]
// src/content.config.ts
export const collections = defineSageCollections({ author: config.site.author });
// sage.config.ts
export default defineSageConfig({ site: { url, title, description, author } });
```

Package entry points: `astro-sage` (integration, `defineSageConfig`), `astro-sage/content` (`defineSageCollections`), `astro-sage/components/*`, `astro-sage/layouts/*`, `astro-sage/styles/*`, `astro-sage/markdown`.

Content goes in `src/content/posts/` (`.md`, `.mdx`, or a folder with `index.md(x)`; files and folders starting with `_` are skipped) and `src/content/pages/`. A site needs no `src/pages/`.

## 本 fork 移除的功能

| 功能 | 状态 |
|---|---|
| 文章分享按钮条（`shareLinks`） | 已移除，主题不再有 `shareLinks` 配置 |
| 选段分享（浮层工具条、分享为图片） | 已移除，`src/share/` 目录整体删除 |
| OG 社交预览图（每篇 `index.png`、站点 `/og.png`） | 已移除，`utils/ogImage.ts` 删除；`features.dynamicOgImage` 与 `site.ogImage` 配置一并移除 |
| 站点级社交图标、RSS、引用块、搜索 | 保留 |

## Configuration (`sage.config.ts`)

Types: [`packages/astro-sage/src/types/config.ts`](packages/astro-sage/src/types/config.ts). Defaults: [`src/config.ts`](packages/astro-sage/src/config.ts).

| Key | Default | Notes |
|---|---|---|
| `site.url` / `title` / `description` / `author` | required | `url` is the canonical origin |
| `site.profile` | — | Author URL for structured data |
| `site.lang` / `timezone` / `dir` | `"en"` / `"UTC"` / `"ltr"` | |
| `site.googleVerification` | env `PUBLIC_GOOGLE_SITE_VERIFICATION` | |
| `typography.serif` | `"newsreader"` | or `"source-serif-4"`, `"literata"` |
| `typography.opticalSizing` | `false` | Ships the `opsz` axis (~70 KB more per style) |
| `typography.fallbacks` | `{ serif, mono }` system stacks | Used if web fonts fail; end each with a generic family |
| `home.title` / `home.intro` | `site.title` / — | Home page heading and intro (inline HTML allowed) |
| `posts.perPage` / `perIndex` | `4` / `4` | Listing and home page sizes |
| `posts.scheduledPostMargin` | 15 min (ms) | Future posts publish this long before `pubDatetime` |
| `features.lightAndDarkMode` | `true` | Theme toggle |
| `features.showArchives` | `true` | `/archives` and its nav link |
| `features.showBackButton` | `true` | On post pages |
| `features.editPost` | `{ enabled: false }` | `{ enabled: true, url }` adds an "Edit page" link |
| `features.search` | `"pagefind"` | `false` removes search |
| `socials` | `[]` | `{ name, url, linkTitle? }`; `name` is an icon in `src/assets/icons/socials/` |
| `citation.enabled` / `author` / `publication` | `true` / "Last, First" of post author / site host | "Cite this post" block |
| `comments` | `{ provider: false }` | `{ provider: "utterances", repo, issueTerm?, label?, theme? }` or `{ provider: "giscus", repo, repoId, category, categoryId, mapping?, reactions?, inputPosition?, theme? }`; `theme` is `{ light, dark }` |

Social icons available: bluesky, facebook, github, hackernews, linkedin, mail, pinterest, reddit, telegram, whatsapp, x.

## Frontmatter

Schema: [`packages/astro-sage/src/content.ts`](packages/astro-sage/src/content.ts).

| Field | Default | Effect |
|---|---|---|
| `title`, `description`, `pubDatetime` | required | `description` feeds lists, RSS and meta tags |
| `modDatetime` | — | Shows "Updated" |
| `author` | `site.author` | |
| `tags` | `["others"]` | Tag pages with counts |
| `category` | — | Article type (题解 / 题目 / 算法): category pages, a badge on posts and cards |
| `series` | — | Series pages and "Part N of M" navigation |
| `featured` | — | Featured on the home page |
| `draft` | — | Never built |
| `ogImage` | generated | Image import or URL |
| `canonicalURL`, `timezone`, `hideEditPost` | — | |
| `toc` | `true` | Pinned table of contents |
| `math` | `true` | Load KaTeX CSS; set `false` on posts without math |
| `cite` | `true` | "Cite this post" block |
| `comments` | `true` | Comments (when a provider is configured) |
| `slug` | from path | Overrides the URL segment |

## Routes (injected)

`/`, `/posts/[...page]`, `/posts/<slug>/`, `/tags`, `/tags/<tag>/`, `/categories`, `/categories/<category>/`, `/series`, `/series/<name>`, `/archives`, `/search`, `/about`, `/404`, `/rss.xml`, `/robots.txt`, sitemap. All prerendered. Post URLs mirror the folder path; a folder post (`my-post/index.mdx`) is named by its folder.

## Writing features

| Feature | Syntax | Example |
|---|---|---|
| Inline elements | `**bold**`, `<mark>`, `<kbd>`, `H~2~O`, `x^2^`, `<abbr title>`; smart quotes and dashes | Showcase › Inline elements |
| Old-style figures | automatic in prose | Showcase › Old-style figures |
| Quotes | `>`; nested `> >` | Showcase › Quotations |
| Callouts | `> [!NOTE]` (NOTE, TIP, IMPORTANT, WARNING, CAUTION) or `:::warning[Title]` … `:::`; the default title is localized ("注意" in Chinese) | Showcase › Callouts |
| Lists, task lists | `- [x]` renders a round checkbox; done items are struck through | Showcase › Lists |
| Definition lists | HTML `<dl>` | Showcase › Lists |
| Math | `$…$`, `$$…$$` (KaTeX at build time) | Showcase › Mathematics |
| Code | Fenced blocks; meta: `title="file.ts"`, `{1-2}`, `ins={4}`, `del={3}`, `"word"`, `collapse={1-4}`, `showLineNumbers`; `bash`/`sh` get a terminal frame; language shown on the frame | Showcase › Code |
| Diagrams | ` ```mermaid ` or ` ```excalidraw ` (JSON); `![cap](./x.excalidraw)` or an excalidraw.com share link; add `wide` / `full` | Showcase › Diagrams |
| Tables | GFM; wide tables scroll and are keyboard-focusable | Showcase › Tables |
| Figures | `![alt](./x.jpg "wide")` / `"full"`, or `<Figure src alt caption size="column\|wide\|full" />` in MDX | Showcase › Figures |
| Footnotes | `[^1]` | Showcase › Footnotes |
| Wiki-links | `[[slug]]`, `[[slug\|text]]`, `[[slug#Heading]]`, `[[#Heading]]`; match slug, path or title; drafts, scheduled and missing targets render as muted text and warn | Showcase › Inline elements; `colophon.md` |
| Link styles | automatic: external links get ↗ and `rel="noopener"`, internal links a plain underline | Showcase › Inline elements |

Diagrams need Chromium at build time (`pnpm add -D playwright && npx playwright install chromium`) unless `.sage-cache/diagrams/` is committed.

## Reader features

| Feature | Notes | Where |
|---|---|---|
| Typography | 17px body, column held to 36–40 全角字, `text-wrap: pretty` | `src/styles/theme.css`, `prose.css` |
| Chinese typography | `line-break: strict`, `text-spacing-trim: space-first` and `text-autospace: normal` (both progressive), optional 2em 首行缩进, no faux italics | `src/styles/global.css`, `prose.css` |
| Palette | Warm paper (light) and ink (dark) tokens; WCAG-checked | `src/styles/theme.css` |
| Pinned TOC | Right rail ≥ 1280px with scroll-spy; collapsible block below; fades under wide figures | `components/TableOfContents.astro` |
| Series | Index, per-series pages, part navigation; series label links to its page; the Series nav link appears only when a published post has a `series` | `series-part-two.md` |
| Tags | Mono chips with counts, at the top of posts | any post |
| Categories | Article-type pages with counts; badge on posts and cards | any post with a `category` |
| Search | Pagefind at `/search` | — |
| Citation | Folded "Cite this post" with text citation and BibTeX copy | bottom of any post |
| Comments | utterances or giscus (GitHub sign-in), lazy-loaded, follows light/dark; off by default; `comments: false` per post | README › Comments; any demo post |
| SEO | Canonical URLs, Open Graph + Twitter cards (image type matches the file), JSON-LD, sitemap, robots.txt | `layouts/Layout.astro` |
| RSS | `/rss.xml`: full post HTML (absolute links, MathML, inline diagrams; no scripts), tags as categories, `dc:creator`, self link; drafts and scheduled posts excluded; autodiscovery `<link>` and header button | `routes/rss.xml.ts`, `utils/feedContent.ts` |
| Accessibility | Skip link, focus styles, labelled controls | `src/layouts/Layout.astro` |
| Performance | ~2.8 KB gzipped JS per article; fonts with metric-matched fallbacks | — |

## Customising

- Colours, fonts and measure are CSS custom properties in [`src/styles/theme.css`](packages/astro-sage/src/styles/theme.css). Override them in your own CSS.
- Components can be imported from `astro-sage/components/*` (e.g. `Figure.astro` in MDX).
- Code themes live in [`src/markdown/code-themes.ts`](packages/astro-sage/src/markdown/code-themes.ts).
