import AboutPage from "./pages/AboutPage.vue";
import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  document: {
    title: "Explicit Routes",
    titleTemplate: "%s | Vue Server",
    head: '<meta name="theme-color" content="#102033">',
    meta: [
      {
        name: "description",
        content: "A server-first Vue app with explicit routes, shared metadata, and no client router.",
      },
      {
        property: "og:site_name",
        content: "Vue Server Examples",
      },
    ],
    stylesheets: ["/styles/site.css"],
  },
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      head: {
        title: "Home",
        meta: [
          {
            property: "og:title",
            content: "Explicit Routes",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:description",
            content: "What Vue looks like when pages are documents first and routes are explicit.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/about",
      component: AboutPage,
      head: {
        title: "About",
        meta: [
          {
            property: "og:title",
            content: "About Explicit Routes",
          },
          {
            property: "og:description",
            content: "Why explicit route tables can be a feature, not a missing convenience.",
          },
        ],
        stylesheets: ["/styles/about.css"],
      },
    }),
  ],
});
