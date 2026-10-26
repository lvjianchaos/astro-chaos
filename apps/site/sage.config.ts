import { defineSageConfig } from "astro-sage";

export default defineSageConfig({
  site: {
    url: "https://io.chaos-ljc.top/",
    title: "IO",
    description: "算法题解、算法笔记与题目归档。",
    author: "lvjianchaos",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
  },
  home: {
    title: "IO",
    intro: "这里记录算法题解、算法笔记，以及一些值得留存的题目。",
  },
  posts: {
    perPage: 10,
    perIndex: 10,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/lvjianchaos/io-chaos/edit/main/apps/site/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/lvjianchaos" },
    { name: "mail", url: "mailto:lvjianchaos@chaos-ljc.top" },
  ],
});
