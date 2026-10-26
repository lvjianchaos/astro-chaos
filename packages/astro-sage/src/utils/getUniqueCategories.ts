import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  /** Slug used in URLs. */
  category: string;
  /** The original label, for display. */
  categoryName: string;
  /** Number of published posts in this category. */
  count: number;
};

/**
 * Builds a de-duplicated, sorted category list from posts.
 *
 * Mirrors `getUniqueTags` but for the single-valued `category` field:
 * drafts and scheduled posts are excluded, and each post counts once.
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories = new Map<string, Category>();
  for (const post of posts.filter(postFilter)) {
    const name = post.data.category;
    if (!name) continue;
    const category = slugifyStr(name);
    const entry = categories.get(category);
    if (entry) entry.count += 1;
    else categories.set(category, { category, categoryName: name, count: 1 });
  }
  return [...categories.values()].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "zh-Hans-CN")
  );
}
