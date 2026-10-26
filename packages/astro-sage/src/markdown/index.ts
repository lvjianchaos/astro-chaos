import katex from "katex";
import type { HastPluginDefinition, MdastPluginDefinition } from "satteri";
import { staticTranslations } from "../i18n/static";
import type { UIStrings } from "../i18n/types";

/** Callout kinds, matching GitHub alert types. Unknown kinds render as `note`. */
export const CALLOUT_TYPES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

const toType = (name: string): CalloutType =>
  (CALLOUT_TYPES as readonly string[]).includes(name)
    ? (name as CalloutType)
    : "note";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * UI bundles, imported statically (not through the glob in ../i18n) because
 * this module also runs in the Astro config context, where import.meta.glob
 * is not available. Only the callout labels are needed here.
 */
/** Callout titles in the site's language. */
function calloutLabels(locale: string): UIStrings["callout"] {
  return staticTranslations(locale).callout;
}

// Sätteri's mdast nodes are plain objects; keep the plugin loosely typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

/** In MDX, custom mdast nodes can't be encoded; emit JSX elements instead. */
function jsx(
  name: string,
  attrs: Record<string, string>,
  children: Node[]
): Node {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: Object.entries(attrs).map(([k, v]) => ({
      type: "mdxJsxAttribute",
      name: k,
      value: v,
    })),
    children,
  };
}

function calloutNode(
  type: CalloutType,
  label: Node[],
  children: Node[],
  mdx: boolean
): Node {
  if (mdx) {
    return jsx("aside", { class: "callout", "data-callout": type }, [
      jsx("p", { class: "callout-title" }, label),
      jsx("div", { class: "callout-body" }, children),
    ]);
  }
  return {
    type: "callout",
    data: {
      hName: "aside",
      hProperties: { className: ["callout"], dataCallout: type },
    },
    children: [
      {
        type: "calloutTitle",
        data: { hName: "p", hProperties: { className: ["callout-title"] } },
        children: label,
      },
      {
        type: "calloutBody",
        data: { hName: "div", hProperties: { className: ["callout-body"] } },
        children,
      },
    ],
  };
}

/**
 * Renders callouts from both syntaxes into the same markup:
 *
 *   :::note[Optional title]          > [!NOTE] Optional title
 *   Body                             > Body
 *   :::
 *
 * `locale` picks the default title of a callout that doesn't carry one
 * ("> [!NOTE]" with no text): "Note" in English, "注意" in Chinese.
 */
export function calloutsPlugin(locale = "en"): MdastPluginDefinition {
  const labels = calloutLabels(locale);
  const title = (type: CalloutType) => labels[type] ?? capitalize(type);

  return {
    name: "astro-sage-callouts",
    containerDirective(node: Node, ctx: Node) {
      const type = toType(node.name);
      const children = [...node.children];
      let label: Node[] = [{ type: "text", value: title(type) }];
      if (children[0]?.data?.directiveLabel) label = children.shift().children;
      ctx.replaceNode(
        node,
        calloutNode(type, label, children, ctx.sourceFormat === "mdx")
      );
    },
    blockquote(node: Node, ctx: Node) {
      const first = node.children[0];
      const text =
        first?.type === "paragraph" && first.children[0]?.type === "text"
          ? first.children[0]
          : null;
      const match = text && /^\[!(\w+)\][^\S\n]*(.*)(?:\n|$)/.exec(text.value);
      if (!match) return;

      const type = toType(match[1].toLowerCase());
      const rest = text.value.slice(match[0].length);
      const firstChildren = [...first.children];
      if (rest) firstChildren[0] = { type: "text", value: rest };
      else firstChildren.shift();

      const children = [...node.children];
      if (firstChildren.length)
        children[0] = { type: "paragraph", children: firstChildren };
      else children.shift();

      const label = [{ type: "text", value: match[2] || title(type) }];
      ctx.replaceNode(
        node,
        calloutNode(type, label, children, ctx.sourceFormat === "mdx")
      );
    },
  };
}

/** Raw HTML that survives both Markdown and MDX pipelines. */
export function rawHtml(html: string, mdx: boolean, inline: boolean): Node {
  if (!mdx) return { type: "html", value: html };
  return {
    type: inline ? "mdxJsxTextElement" : "mdxJsxFlowElement",
    name: "Fragment",
    attributes: [{ type: "mdxJsxAttribute", name: "set:html", value: html }],
    children: [],
  };
}

/**
 * Renders `$…$` and `$$…$$` with KaTeX at build time. Runs on mdast so the
 * math never reaches the code highlighter as a `language-math` block.
 */
export const katexPlugin: MdastPluginDefinition = {
  name: "astro-sage-katex",
  math(node: Node, ctx: Node) {
    const html = katex.renderToString(node.value, {
      displayMode: true,
      throwOnError: false,
      output: "htmlAndMathml",
    });
    ctx.replaceNode(
      node,
      rawHtml(
        `<div class="math-display" tabindex="0">${html}</div>`,
        ctx.sourceFormat === "mdx",
        false
      )
    );
  },
  inlineMath(node: Node, ctx: Node) {
    const html = katex.renderToString(node.value, {
      throwOnError: false,
      output: "htmlAndMathml",
    });
    ctx.replaceNode(node, rawHtml(html, ctx.sourceFormat === "mdx", true));
  },
};

/**
 * Accessibility fixes on the rendered HTML:
 * - GFM task-list checkboxes get an accessible name from their list item.
 * - Tables (which scroll horizontally when wide) become keyboard-focusable.
 */
export const a11yPlugin: HastPluginDefinition = {
  name: "astro-sage-a11y",
  element: {
    filter: ["input", "table"],
    visit(node: Node, ctx: Node) {
      if (node.tagName === "table") {
        ctx.setProperty(node, "tabIndex", 0);
        return;
      }
      if (node.properties?.type !== "checkbox") return;
      const item = ctx.parent(node);
      const label = item ? ctx.textContent(item).trim() : "";
      const done = node.properties?.checked ? "Done" : "To do";
      ctx.setProperty(node, "ariaLabel", label ? `${done}: ${label}` : done);
    },
  },
};

/**
 * Breakout images in plain Markdown: an image alone in a paragraph whose title
 * is `wide` or `full` becomes a figure of that size, captioned with its alt:
 *
 *   ![Hills at dusk](./hills.jpg "full")
 */
export const breakoutImagesPlugin: HastPluginDefinition = {
  name: "astro-sage-breakout-images",
  element: {
    filter: ["p"],
    visit(node: Node, ctx: Node) {
      const kids = (node.children ?? []).filter(
        (c: Node) => !(c.type === "text" && !String(c.value).trim())
      );
      const img = kids.length === 1 ? kids[0] : undefined;
      if (img?.type !== "element" || img.tagName !== "img") return;
      const size = img.properties?.title;
      if (size !== "wide" && size !== "full") return;
      ctx.setProperty(img, "title", null);
      const alt = String(img.properties?.alt ?? "");
      ctx.replaceNode(node, {
        type: "element",
        tagName: "figure",
        properties: { className: [`figure-${size}`] },
        children: [
          img,
          ...(alt
            ? [
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: alt }],
                },
              ]
            : []),
        ],
      });
    },
  },
};
