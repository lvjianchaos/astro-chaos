---
name: io-theme-kickoff
description: io-chaos-ljc 新站的目标、基座选型与仓库结构（AstroSage fork，中文排版优先）
type: project
---

`D:/my-sites/io-chaos-ljc` 是用户 2026-10 起的**新博客站**（主站 blog-chaos-ljc 用 Fuwari 主题，
两者并列；io 是主站的**算法分站**，因为算法文章太多把主站撑得失衡）。

**三条核心需求**（用户原话）：1. 中文阅读体验（字体、主题色）——核心中的核心；
2. 代码块、数学公式、图表（Mermaid、Excalidraw）；3. 分类、标签、系列（Series）。

**已定的基座**（2026-10-26 拍板）：fork `chintak/astro-sage`（它本身是 satnaing/astro-paper
的重构版，已内建 series / KaTeX / Expressive Code / Mermaid+Excalidraw 构建期渲染 / 固定 TOC /
Pagefind / OG 图）。**不**从 astro-paper 重写，**不**用 npm 依赖装（要改主题内部：schema、路由、
排版 token）。

**仓库结构**：`packages/astro-sage`（主题源码，保留上游目录以便 merge upstream）+ `apps/site`
（本站内容与配置）。remote：`origin` = lvjianchaos/io-chaos，`upstream` = chintak/astro-sage。
命令：`pnpm dev` / `pnpm build`（= astro check + build + pagefind）/ `pnpm format` / `pnpm test`。
截图脚本 `apps/site/scripts/screenshot.mjs`（用本机 Chrome 跑 dist，出 light/dark PNG）。

**已完成**：中文排版层（思源宋体正文 + 思源黑体标题、栏宽按全角字、17px/1.8、宣纸墨朱砂配色）、
category + problem 题目卡、zh-CN 语言包与 i18n 全量接入、Mermaid 构建期注入中文字体。
**待办**：域名 io.chaos-ljc.top 只是占位待确认；字体分片未做产物裁剪（dist 里有 13MB 字体文件，
浏览器只下命中分片）；首屏 CJK 分片未预载；Excalidraw 中文仍是待办（Excalidraw 内置字体不含汉字）。

相关：[[chinese-typography-tokens]] [[io-taxonomy-model]]
