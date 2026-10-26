import { defineSageConfig } from "astro-sage";

export default defineSageConfig({
  site: {
    url: "https://io.chaos-ljc.top/",
    title: "CHAOS·IO",
    description: "算法题解、算法笔记与题目归档。",
    author: "chaos",
    repo: "https://github.com/lvjianchaos/astro-chaos",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
  },
  home: {
    title: "CHAOS·IO",
    intro: "这里记录算法题解、算法笔记，以及一些值得留存的题目。",
  },
  posts: {
    perPage: 10,
    perIndex: 10,
  },
  features: {
    lightAndDarkMode: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/lvjianchaos/astro-chaos/edit/main/apps/site/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/lvjianchaos" },
    { name: "mail", url: "mailto:2277146577@qq.com" },
  ],
});
