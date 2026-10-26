import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import { BLOG_PATH } from "./paths";

export { BLOG_PATH };

/**
 * Content collections AstroSage's routes read from. Re-export from your
 * site's `src/content.config.ts`:
 *
 * ```ts
 * import { defineSageCollections } from "astro-sage/content";
 * export const collections = defineSageCollections({ author: "Ada" });
 * ```
 */
export function defineSageCollections({ author }: { author: string }) {
  const posts = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
    schema: () =>
      z.object({
        author: z.string().default(author),
        pubDatetime: z.date(),
        modDatetime: z.date().optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).default(["others"]),
        /**
         * Article type (题解 / 题目 / 算法笔记 …). Single value: it answers
         * "what kind of article is this", while `tags` carry the cross-cutting
         * facts (来源 OJ, 所用算法, 语言) and `series` group ordered reading.
         */
        category: z.string().optional(),
        /** Groups posts into an ordered series (ordered by pubDatetime). */
        series: z.string().optional(),
        description: z.string(),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        timezone: z.string().optional(),
        /** Show the table of contents rail. */
        toc: z.boolean().default(true),
        /**
         * Reading column width: "cjk" counts 全角字 (36–40 per line),
         * "latin" counts characters (66–71 per line). Defaults to detecting
         * it from the post's content.
         */
        measure: z.enum(["cjk", "latin"]).optional(),
        /** Load KaTeX styles. Set false on posts without math. */
        math: z.boolean().default(true),
      }),
  });

  const pages = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      canonicalURL: z.string().optional(),
    }),
  });

  return { posts, pages };
}
