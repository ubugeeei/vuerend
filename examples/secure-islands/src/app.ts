import LaunchHomeRoute from "./routes/LaunchHomeRoute";
import ProgramsRoute from "./routes/ProgramsRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Launch Week",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#1d2a4a">',
    meta: [
      {
        name: "description",
        content:
          "A launch site that keeps the page static by default and hydrates only the estimator and signup flow.",
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
      component: LaunchHomeRoute,
      head: {
        title: "Launch Site",
        meta: [
          { property: "og:title", content: "Launch Week Site" },
          {
            property: "og:description",
            content: "A mostly static launch page with two narrowly scoped islands.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/pricing",
      component: ProgramsRoute,
      head: {
        title: "Programs",
        meta: [
          { property: "og:title", content: "Launch Week Programs" },
          {
            property: "og:description",
            content: "A pure server-rendered companion page in the same launch app.",
          },
        ],
        stylesheets: ["/styles/pricing.css"],
      },
      render: { strategy: "ssg" },
    }),
  ],
});
