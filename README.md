# io-chaos

主站的**算法分站**：算法题解、算法笔记，以及一些值得留存的题目。

- 站点：`https://io.chaos-ljc.top/`
- 主站（Fuwari 主题）：`https://blog.chaos-ljc.top/`

| 首页 | 文章页 | 分类页 |
| --- | --- | --- |
| ![首页](docs/screenshots/home-light.png) | ![文章页](docs/screenshots/post-light.png) | ![分类页](docs/screenshots/categories-light.png) |

本站基于 [AstroSage](https://github.com/chintak/astro-sage) 开发。AstroSage 本身是
[AstroPaper](https://github.com/satnaing/astro-paper) 的重构版，提供了衬线排版、固定目录、
KaTeX、Expressive Code、Mermaid/Excalidraw 构建期渲染、Series、Pagefind 等能力。

**我们在这个基座上做的四件事**（也就是本站与上游的差异）：

1. **中文阅读体验** —— 中文字体栈、按"全角字"计算的栏宽、中文标点处理、全中文界面与配色。
2. **内容分类模型** —— 在 `tags` 与 `series` 之外新增 `category`（文章类型），并新增题目元信息 `problem`。
3. **算法特化** —— 题目卡、复杂度表格、竞赛模板代码。
4. **做减法** —— 去掉文章分享按钮、选段分享、OG 社交预览图，站点只管阅读。

## 目录结构

```
io-chaos/
├── packages/astro-sage/   # 主题源码（fork 自 chintak/astro-sage）
│   ├── src/styles/        # 设计 token：中文排版、配色
│   ├── src/i18n/lang/     # 界面文案（en / zh-CN）
│   ├── src/routes/        # 主题注入的全部路由（含新增的 /categories）
│   └── src/markdown/      # KaTeX、callout、wiki-link、图表插件
├── apps/site/             # 本站内容与配置
│   ├── sage.config.ts     # 站点配置（标题、域名、社交链接……）
│   ├── src/content/posts/ # 文章（Markdown / MDX）
│   └── src/content/pages/ # 页面（如关于页）
└── scripts/               # 开发辅助脚本
```

## 本地开发

需要 Node ≥ 22.12 与 [pnpm](https://pnpm.io)。

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # 类型检查 + 构建 + Pagefind 索引，产物在 apps/site/dist
pnpm preview
```

构建 Mermaid / Excalidraw 图需要 Chromium：没有 Playwright 自带的浏览器时会回退到系统
安装的 Chrome。CI 里执行 `pnpm --filter @io/site exec playwright install --with-deps chromium`。
渲染结果缓存在 `apps/site/.sage-cache/diagrams/`，**请提交该目录**，这样部署构建就不需要浏览器。

两个开发脚本（在 `apps/site/` 下，需要先 `pnpm build`）：

```bash
pnpm --filter @io/site exec node scripts/screenshot.mjs   # 截图（light/dark，可视回归）
pnpm --filter @io/site test:search                         # 中文搜索烟测
```

## 写一篇题解

```md title="apps/site/src/content/posts/p1002-guo-he-zu.md"
---
title: "「洛谷 P1002」过河卒"
description: "棋盘上的路径计数：从状态设计到空间压缩。"
pubDatetime: 2026-10-18T09:00:00+08:00
category: 题解 # 文章类型：题解 / 题目 / 算法
series: 动态规划入门 # 有先后顺序的一组文章
tags: [动态规划, 洛谷] # 来源 OJ、所用算法、语言……
problem: # 题目元信息，渲染成顶部的"题目卡"
  source: 洛谷
  id: P1002
  url: https://www.luogu.com.cn/problem/P1002
  difficulty: 普及-
  limits: "1s / 128MB"
  tags: [动态规划, 路径计数]
---

正文……$O(n \log n)$……

```cpp title="P1002.cpp"
int main() {}
```

```mermaid title="流程"
flowchart LR
  A["读入"] --> B["处理"]
```
```

### 三个维度的分工

| 维度 | 字段 | 基数 | 例子 | 作用 |
| --- | --- | --- | --- | --- |
| 分类 | `category` | 单选 | 题解 / 题目 / 算法 | 文章类型，主导航 |
| 标签 | `tags` | 多选 | 动态规划 / 洛谷 / C++17 | 横切特征，聚合检索 |
| 系列 | `series` | 有序多篇 | 动态规划入门 | 学习路径，"第 N 篇，共 M 篇" |

分类回答"这是哪类文章"，标签回答"它有什么特征"，系列回答"按什么顺序读"。

## 中文排版的几个关键决定

见 [`docs/decisions/006-chinese-typography.md`](docs/decisions/006-chinese-typography.md)。
要点：

- 栏宽按**全角字**计算（36–40 字/行），而不是西文的 66–71 字符；
- 正文 17px / 行高 1.8，衬线（思源宋体）正文 + 黑体（思源黑体）标题；
- `text-spacing-trim` / `text-autospace` 渐进增强，Chrome 123+ / 140+ 生效；
- 中文字体按 unicode-range 分片自托管，浏览器只下载命中的分片。

## 部署

产物是纯静态文件，`apps/site/dist/` 可以放到任意静态托管。仓库按 [Vercel](https://vercel.com)
配置（Astro 静态站零配置）：

| 项 | 值 |
| --- | --- |
| Build Command | `pnpm --filter @io/site build` |
| Output Directory | `apps/site/dist` |
| Install Command | `pnpm install` |

框架预设选 **Astro** 即可；域名在 Vercel 项目设置里绑定后，记得同步更新
`apps/site/sage.config.ts` 里的 `site.url`（它会写进 canonical 链接、RSS 与 sitemap）。

若要换到别的平台，改构建命令与输出目录即可，站点本身不依赖任何特定平台。

## 出处与致谢

主题代码源自以下两个 MIT 许可的项目，版权声明保留在 [LICENSE](LICENSE)：

- **[AstroSage](https://github.com/chintak/astro-sage)** —— Chintak Sheth。本站的直接来源，
  提供了 series、KaTeX、Expressive Code、Mermaid/Excalidraw 构建期渲染、固定 TOC 等能力。
- **[AstroPaper](https://github.com/satnaing/astro-paper)** —— Sat Naing。更早的基座，
  AstroSage 本身由它重构而来。

本仓库是中文本地化 + 算法特化的改造版本，**不是**上述项目的官方分支，也不回传上游。
`docs/decisions/001`–`005` 是上游的设计决策记录，保留作为背景参考；
`docs/decisions/006` 是本站的中文排版决策。

## 许可

MIT。
