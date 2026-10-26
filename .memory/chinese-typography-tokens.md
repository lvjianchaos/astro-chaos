---
name: chinese-typography-tokens
description: 中文正文的排版度量与 CSS 细节（measure 用全角字、--char=1em、text-spacing-trim/text-autospace、行高 1.8）
type: reference
---

给中文站点做排版时的关键结论（astro-sage 原生是西文度量，需改）：

- **度量单位**：西文用"平均字符宽"（astro-sage: `--char = --text-body * 0.487`），
  中文是**全角 = 1em**，所以 `--char` 应为 `var(--text-body)`；
  每行 **30–40 全角字**最舒服 → `--measure: clamp(32em, 40vw, 38em)`（约 34 字/行），而不是西文的 66–71 字符。
- **字号/行高**：正文 17px、行高 **1.8**（中文要比西文 1.7 更松）；段间距 ~0.9em；
  首行缩进 2em 做**可配置开关**（算法博客多用空行分段，默认关）。
- **中文标点**：`text-spacing-trim: space-first`（Chrome/Edge 123+，Firefox/Safari 暂不支持，须 `@supports` 保护）；
  `text-autospace: normal`（Chrome 140+ / Safari 18.4+ / Firefox 145+，2025-11 Baseline 新特性）自动在中英/中数间加间距，
  可替代 pangu.js 的"盘古之白"。
- `line-break: strict` + `overflow-wrap: anywhere` 处理长英文/URL；`hanging-punctuation: allow-end`（Safari）。
- **字体体积**：思源宋体 variable 全包 ~6.4MB（@fontsource-variable/noto-serif-sc），
  必须用 `cn-font-split`（npm 7.4.x）切成 unicode-range 分片自托管；
  代码块里的**中文注释**需要等宽 CJK 回退（如 Sarasa Mono SC / Noto Sans Mono CJK SC），否则中文注释会跳行。
- **搜索**：Pagefind 按 `<html lang="zh-CN">` 自动启用 charabia 中文分词，无需额外配置。

相关：[[io-theme-kickoff]] [[io-taxonomy-model]]
