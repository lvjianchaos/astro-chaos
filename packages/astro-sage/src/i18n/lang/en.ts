import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    series: "Series",
    tags: "Tags",
    categories: "Categories",
    about: "About",
    archives: "Archives",
    search: "Search",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    tagLabel: "Tags",
    categoryLabel: "Category",
    minRead: "{{minutes}} min read",
    seriesPart: "Part {{index}} of {{total}} in",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    socialLinks: "Social Links",
    featured: "Featured",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
    credit: "Source",
  },
  citation: {
    title: "Cite this post",
    intro: "If you found this useful, please cite this write-up as:",
    or: "or",
    copy: "Copy",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",

    archivesTitle: "Archives",
    archivesDesc: "All the articles I've archived.",

    seriesTitle: "Series",
    seriesDesc: "Posts that build on each other, in reading order.",

    categoriesTitle: "Categories",
    categoriesDesc: "Every kind of article on this site.",

    categoryTitle: "Category",
    categoryDesc: "Posts of this category.",

    onThisPage: "On this page",

    searchTitle: "Search",
    searchDesc: "Search any article ...",
  },
  callout: {
    note: "Note",
    tip: "Tip",
    important: "Important",
    warning: "Warning",
    caution: "Caution",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    tableOfContents: "Table of contents",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
