import HomePage from "./pages/HomePage.vue";
import LibraryPage from "./pages/LibraryPage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Mixed SFC + JSX",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#173227">',
    meta: [
      {
        name: "description",
        content: "An MPA example that mixes Vue SFC pages, JSX islands, and shared client state.",
      },
      {
        property: "og:site_name",
        content: "Vuerend Examples",
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
          { property: "og:title", content: "Mixed SFC + JSX Home" },
          {
            property: "og:description",
            content: "A server-rendered SFC page with JSX islands layered on top.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/library",
      component: LibraryPage,
      head: {
        title: "Library",
        meta: [
          { property: "og:title", content: "Mixed SFC + JSX Library" },
          {
            property: "og:description",
            content: "A JSX route sharing the same client state island as the SFC route.",
          },
        ],
        stylesheets: ["/styles/library.css"],
      },
      render: { strategy: "ssg" },
    }),
  ],
});
