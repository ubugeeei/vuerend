import AboutPage from "./pages/AboutPage.vue";
import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Explicit Routes",
    titleTemplate: "%s | Vuerend",
  },
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/about",
      component: AboutPage,
    }),
  ],
});
