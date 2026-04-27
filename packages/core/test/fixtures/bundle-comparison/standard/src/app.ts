import { defineApp, defineRoute } from "@vuerend/core";
import HomeRoute from "./routes/HomeRoute";

export default defineApp({
  document: {
    links: [
      {
        href: "data:,",
        rel: "icon",
      },
    ],
    titleTemplate: (title) => (title ? `${title} | Bundle Fixture` : "Bundle Fixture"),
  },
  routes: [
    defineRoute({
      component: HomeRoute,
      head: {
        title: "Standard",
      },
      path: "/",
      prerender: ["/"],
    }),
  ],
});
