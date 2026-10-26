import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首页",
    posts: "文章",
    series: "系列",
    tags: "标签",
    categories: "分类",
    about: "关于",
    archives: "归档",
    search: "搜索",
  },
  post: {
    publishedAt: "发布于",
    updatedAt: "更新于",
    tagLabel: "标签",
    categoryLabel: "分类",
    minRead: "阅读约 {{minutes}} 分钟",
    seriesPart: "第 {{index}} 篇，共 {{total}} 篇 ·",
    backToTop: "回到顶部",
    goBack: "返回",
    editPage: "编辑此页",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "页",
  },
  home: {
    socialLinks: "社交链接",
    featured: "精选",
    recentPosts: "最近更新",
    allPosts: "全部文章",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
    credit: "源码",
  },
  citation: {
    title: "引用本文",
    intro: "如果这篇文章对你有帮助，可以按下面的格式引用：",
    or: "或",
    copy: "复制",
  },
  pages: {
    tagTitle: "标签",
    tagDesc: "带有该标签的全部文章",

    tagsTitle: "标签",
    tagsDesc: "文章中使用过的全部标签。",

    postsTitle: "文章",
    postsDesc: "全部文章。",

    archivesTitle: "归档",
    archivesDesc: "全部文章归档。",

    seriesTitle: "系列",
    seriesDesc: "有先后顺序、适合连读的系列文章。",

    categoriesTitle: "分类",
    categoriesDesc: "本站的全部文章类型。",

    categoryTitle: "分类",
    categoryDesc: "该分类下的文章。",

    onThisPage: "本页目录",

    searchTitle: "搜索",
    searchDesc: "搜索文章……",
  },
  callout: {
    note: "注意",
    tip: "提示",
    important: "重要",
    warning: "警告",
    caution: "危险",
  },
  problem: {
    source: "来源",
    difficulty: "难度",
    limits: "时空限制",
    statement: "题目链接",
    tags: "题目标签",
  },
  a11y: {
    skipToContent: "跳到正文",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换主题",
    searchPlaceholder: "搜索文章……",
    noResults: "没有找到结果",
    goToPreviousPage: "前往上一页",
    goToNextPage: "前往下一页",
    tableOfContents: "本页目录",
  },
  notFound: {
    title: "404 未找到",
    message: "页面不存在",
    goHome: "回到首页",
  },
} satisfies UIStrings;
