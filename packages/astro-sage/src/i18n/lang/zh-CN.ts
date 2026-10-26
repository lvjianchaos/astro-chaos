import type { UIStrings } from "../types";

export default {
  nav: {
    posts: "文章",
    series: "系列",
    tags: "标签",
    categories: "分类",
    about: "关于",
    archives: "归档",
    search: "搜索",
  },
  post: {
    updatedAt: "更新于",
    tagLabel: "标签",
    minRead: "阅读约 {{minutes}} 分钟",
    seriesPart: "第 {{index}} 篇，共 {{total}} 篇 ·",
    editPage: "编辑此页",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
  },
  home: {
    featured: "精选",
    recentPosts: "最近更新",
    allPosts: "全部文章",
  },
  footer: {
    credit: "源码",
  },
  pages: {
    tagTitle: "标签",
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
  search: {
    placeholder: "搜索文章……",
    clear: "清除",
    label: "站内搜索",
    loadMore: "加载更多结果",
    oneResult: "{{count}} 条结果",
    manyResults: "{{count}} 条结果",
    zeroResults: "没有找到",
    noResultsFor: "没有找到 {{term}}",
    oneResultFor: "{{count}} 条结果与 {{term}} 相关",
    manyResultsFor: "{{count}} 条结果与 {{term}} 相关",
    resultsLabel: "搜索结果",
    filters: "筛选",
    searching: "正在搜索 {{term}}……",
  },
  diagram: {
    open: "在查看器中打开 {{label}}",
    zoom: "缩放（或双击）",
    zoomIn: "放大",
    zoomOut: "缩小",
    select: "选择文本",
    selecting: "正在选择文本",
    close: "关闭查看器",
    hint: "滚轮或双指缩放 · 拖动平移 · 0 适应窗口 · 1 原始大小 · Esc 关闭",
    viewerLabel: "图表查看器",
    controlsLabel: "图表控制",
  },
  a11y: {
    skipToContent: "跳到正文",
    openMenu: "打开菜单",
    toggleTheme: "切换主题",
    goToPreviousPage: "前往上一页",
    goToNextPage: "前往下一页",
    tableOfContents: "本页目录",
    mainNavigation: "主导航",
    pagination: "分页导航",
    linkToSection: "链接到小节：",
  },
  notFound: {
    title: "404 未找到",
    message: "页面不存在",
    goHome: "回到首页",
  },
} satisfies UIStrings;
