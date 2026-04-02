import AboutPage from "./pages/AboutPage.vue";
import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  document: {
    title: "Explicit Routes",
    titleTemplate: "%s | Vue Server",
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
