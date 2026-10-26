# AGENTS.md

io-chaos：主站的算法分站，基于 [AstroSage](https://github.com/chintak/astro-sage) 的 fork。
**功能、配置、frontmatter、路由的清单见 [FEATURES.md](FEATURES.md)**——任何增删改都要同步更新它。

## 结构

```
packages/astro-sage/   主题源码（fork 自 chintak/astro-sage，保留上游目录结构）
  src/index.ts         integration：注入路由、markdown 管线、字体、Vite 别名（@sage → src）
  src/config.ts        解析后的配置 + 默认值；类型在 src/types/config.ts
  src/content.ts       collections + frontmatter schema
  src/markdown/        Sätteri 插件（callout、KaTeX、链接/wiki-link、代码标签）
  src/routes/          注入的页面与端点
  src/components/, layouts/, styles/, diagrams/, comments/
  src/i18n/lang/       界面文案（en.ts / zh-CN.ts）
apps/site/             本站内容与配置
  sage.config.ts       站点配置
  src/content/posts/   文章
  src/content/pages/   页面
  scripts/             开发脚本（screenshot.mjs）
docs/decisions/        ADR：设计决策与理由
```

## 约定

- 提交前跑通：`pnpm lint && pnpm format:check && pnpm build`。
- **纯 SSG，宿主机无关**：不要引入 adapter、服务端路由、数据库或特定平台的 API。工作放在
  构建期完成，客户端 JS 要小且懒加载。
- 文字与界面颜色在两种主题下都要 ≥ 4.5:1（正文目标 AAA）。只用 `src/styles/theme.css` 里的
  token，不要写死颜色。
- 中文排版改动前先读 [`docs/decisions/006-chinese-typography.md`](docs/decisions/006-chinese-typography.md)：
  栏宽按全角字算、行高 1.8、宋体正文 + 黑体标题、标点处理是渐进增强。
- 新增界面文案必须同时改 `src/i18n/types.ts`、`en.ts` 和 `zh-CN.ts`；不要在组件里硬编码英文。
- MDX 里 mdast 插件要输出 JSX 节点（见 `src/markdown/index.ts` 的 `jsx()` / `rawHtml()`），
  不能直接吐 HTML。
- **提交 `apps/site/.sage-cache/diagrams/`**，这样部署构建不需要浏览器。
- 主题代码源自 [chintak/astro-sage](https://github.com/chintak/astro-sage)（MIT），它又源自
  [satnaing/astro-paper](https://github.com/satnaing/astro-paper)（MIT）；版权声明在 `LICENSE`。
  本仓库是中文本地化与算法特化的改造版本，不回传上游。
- 主题包仍然叫 `astro-sage`，保持与上游的目录一致；本 fork 不发布到 npm。
