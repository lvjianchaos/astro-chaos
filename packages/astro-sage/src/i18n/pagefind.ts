import type { UIStrings } from "./types";

/**
 * Pagefind's default UI ships English only (the package doesn't publish its
 * `translations/` folder), so the widget has to be fed our own strings.
 *
 * Pagefind uses `[COUNT]` / `[SEARCH_TERM]` placeholders; ours use `{{}}`,
 * so they are rewritten here.
 */
export function pagefindTranslations(t: UIStrings["search"]) {
  const sub = (s: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
      s
    );
  return {
    placeholder: t.placeholder,
    clear_search: t.clear,
    load_more: t.loadMore,
    search_label: t.label,
    filters_label: t.filters,
    results_label: t.resultsLabel,
    total_zero_results: t.zeroResults,
    total_one_result: sub(t.oneResult, { count: "[COUNT]" }),
    total_many_results: sub(t.manyResults, { count: "[COUNT]" }),
    zero_results: sub(t.noResultsFor, { term: "[SEARCH_TERM]" }),
    one_result: sub(t.oneResultFor, {
      count: "[COUNT]",
      term: "[SEARCH_TERM]",
    }),
    many_results: sub(t.manyResultsFor, {
      count: "[COUNT]",
      term: "[SEARCH_TERM]",
    }),
    searching: sub(t.searching, { term: "[SEARCH_TERM]" }),
  };
}
