import type { UIStrings } from "../types";

export default {
  nav: {
    posts: "Posts",
    series: "Series",
    tags: "Tags",
    categories: "Categories",
    about: "About",
    archives: "Archives",
    search: "Search",
  },
  post: {
    updatedAt: "Updated",
    tagLabel: "Tags",
    minRead: "{{minutes}} min read",
    seriesPart: "Part {{index}} of {{total}} in",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
  },
  home: {
    featured: "Featured",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
  },
  footer: {
    credit: "Source",
  },
  pages: {
    tagTitle: "Tag",
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
  search: {
    placeholder: "Search posts...",
    clear: "Clear",
    label: "Search this site",
    loadMore: "Load more results",
    oneResult: "{{count}} result",
    manyResults: "{{count}} results",
    zeroResults: "No results",
    noResultsFor: "No results for [SEARCH_TERM]",
    oneResultFor: "[COUNT] result for [SEARCH_TERM]",
    manyResultsFor: "[COUNT] results for [SEARCH_TERM]",
    resultsLabel: "Search results",
    filters: "Filters",
    searching: "Searching for [SEARCH_TERM]...",
  },
  diagram: {
    open: "Open {{label}} in the viewer",
    zoom: "Zoom (or double-click)",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    select: "Select text",
    selecting: "Selecting text",
    close: "Close viewer",
    hint: "Scroll or pinch to zoom · drag to pan · 0 fit · 1 actual size · Esc close",
    viewerLabel: "Diagram viewer",
    controlsLabel: "Diagram controls",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    toggleTheme: "Toggle theme",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    tableOfContents: "Table of contents",
    mainNavigation: "Main navigation",
    pagination: "Pagination navigation",
    linkToSection: "Link to section: ",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
