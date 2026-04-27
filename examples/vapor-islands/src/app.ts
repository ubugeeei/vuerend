import { defineApp, defineRoute } from "@vuerend/core";
import VaporHomeRoute from "./routes/VaporHomeRoute.vue";

export default defineApp({
  document: {
    titleTemplate: (title) => (title ? `${title} | Vuerend Vapor` : "Vuerend Vapor"),
    stylesheets: ["/styles/site.css"],
    links: [
      {
        rel: "icon",
        href: "data:,",
      },
    ],
  },
  routes: [
    defineRoute({
      path: "/",
      component: VaporHomeRoute,
      head: {
        title: "Vapor Islands",
        meta: [
          {
            name: "description",
            content: "A small Vapor island hydration fixture.",
          },
        ],
      },
    }),
  ],
});
