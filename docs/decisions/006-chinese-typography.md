# 006：中文排版与配色

**状态：** 已采纳（2026-10）

AstroSage 的排版系统是按西文设计的：栏宽按"平均字符宽"计算，行高 1.7，正文 18.5px，
数字用 old-style figures，引用块与四级标题用斜体。这些在中文里都不成立。本文记录我们
如何把这一层改造成中文优先，以及为什么。

## 度量：按全角字算，不按字符算

上游把栏宽定义成"正文体的平均字符宽"：

```css
--char: calc(var(--text-body) * 0.487); /* Newsreader 的平均字宽 */
--measure: clamp(calc(var(--char) * 66), 44vw, calc(var(--char) * 71));
```

汉字是**全角 = 1em**，所以 `--char` 应当等于正文字号本身；中英混排时英文词约占 0.5em，
取 0.86 作为折中。每行 30–40 个全角字是最舒服的区间，于是：

```css
--char: calc(var(--text-body) * 0.86);
--measure-min: calc(var(--char) * 36);
--measure-max: calc(var(--char) * 40);
--measure: clamp(var(--measure-min), 46vw, var(--measure-max));
```

17px 正文下约为 550–585px，即每行 36–40 个汉字。西文那一档（66–71 字符 ≈ 640px 宽）
放到中文上会是每行 60+ 字，读起来会跳行。

## 字号、行高、字距

- 正文 **17px**（西文 18.5px 视觉上偏小，汉字 17px 已经足够大）；
- 行高 **1.8**（西文 1.7；汉字字面框满、需要更多行间距）；
- `letter-spacing: 0.01em`（字面率 100% 的汉字挤在一起会显紧）；
- 数字改用 `lining-nums`：`old-style-nums` 在中文正文和算法记号（$O(n\log n)$、$10^9$）里
  都不好看；表格与代码里用 `tabular-nums` 对齐。

## 字体分工

| 角色 | 拉丁 | 中文 |
| --- | --- | --- |
| 正文 | Newsreader | 思源宋体 `Noto Serif SC Variable` |
| 标题 | — | 思源黑体 `Noto Sans SC Variable` |
| 界面/标签 | JetBrains Mono | 思源黑体 |
| 代码 | JetBrains Mono | 思源黑体（中文注释） |

宋体正文 + 黑体标题是中文技术博客的常见搭配：正文耐读，黑体标题在小字号下更清晰。
拉丁字符仍然走原来的西文字体，所以英文段落不受影响。

字体通过 Fontsource 提供的 **unicode-range 分片**自托管：思源宋体整包 6.4MB，但拆成 101 个
分片后每个只有 60–90KB，浏览器只会下载页面真正用到的分片。

## 标点与中西文间距

- `line-break: strict`：避免行首出现 `。，）` 等标点（避头尾）；
- `text-spacing-trim: space-first`（Chrome/Edge 123+）：压缩全角标点后的多余空白；
- `text-autospace: normal`（Chrome 140+ / Safari 18.4+ / Firefox 145+）：自动在中英、中数
  之间插入 1/8 em 间距，相当于"盘古之白"。

后两者都是渐进增强，用 `@supports` 包裹；不支持的浏览器只是标点空隙略大，不影响可读性。

## 斜体

中文没有真正的斜体，浏览器只能合成倾斜，看起来很脏。因此：正文里的引用块不再斜体，
四级标题取消斜体，摘要（`.post-dek`）也不再斜体。

## 首行缩进

`--paragraph-indent` 默认为 `0`（段落之间留白）。中文出版习惯的 2em 首行缩进做成开关，
因为算法题解普遍用空行分段，缩进反而会显得拥挤。

## 配色：宣纸 / 墨 / 朱砂

| Token | 亮色 | 暗色 |
| --- | --- | --- |
| bg / bg-raised | `#f7f3ea` / `#efe8db` | `#1b1917` / `#262320` |
| fg | `#2b2620`（13.5:1） | `#ece3d4`（13.8:1） |
| fg-muted | `#6b6153`（5.5:1） | `#b3a795`（7.4:1） |
| accent（朱砂） | `#a8432a`（5.4:1） | `#e08a63`（6.7:1） |
| sage（黛青） | `#3f6b5f`（5.5:1） | `#9dbfae`（8.8:1） |

正文对比度达到 AAA，次要文字与强调色在两种主题下都 ≥ 4.5:1。callout 的五种颜色也逐一
验证过（亮色最低 4.95:1，暗色最低 6.1:1）。

Mermaid 图表的配色同步更新（`src/diagrams/palette.ts`），并且在构建期把思源黑体注入
headless Chromium——否则没有装中文字体的 CI 机器会把中文节点画成方框。

## 界面语言

上游的 i18n 只带英文包，我们补了 `zh-CN`（并让 `useTranslations` 支持按语言前缀回退，
`zh-Hans` 也能命中 `zh-CN`）。同时把散落在组件里的硬编码英文（"On this page"、"min read"、
"Cite this post"、分享状态提示、callout 标题）全部接入 i18n。
