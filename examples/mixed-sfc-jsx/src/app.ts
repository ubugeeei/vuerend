import GuideHomeRoute from "./routes/GuideHomeRoute.vue";
import ShortlistRoute from "./routes/ShortlistRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Buyer's Guide",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#173227">',
    meta: [
      {
        name: "description",
        content:
          "A commerce-flavored MPA where SFC pages and JSX islands share a saved shortlist across full page loads.",
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
      component: GuideHomeRoute,
      head: {
        title: "Guide Home",
        meta: [
          { property: "og:title", content: "Buyer's Guide Home" },
          {
            property: "og:description",
            content:
              "A server-rendered SFC buying guide page with JSX shortlist islands layered on top.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/library",
      component: ShortlistRoute,
      head: {
        title: "Shortlist",
        meta: [
          { property: "og:title", content: "Buyer's Guide Shortlist" },
          {
            property: "og:description",
            content: "A JSX route sharing the same saved shortlist state as the SFC guide page.",
          },
        ],
        stylesheets: ["/styles/library.css"],
      },
      render: { strategy: "ssg" },
    }),
  ],
});
