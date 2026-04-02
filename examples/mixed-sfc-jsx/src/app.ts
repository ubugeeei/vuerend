import HomePage from "./pages/HomePage.vue";
import LibraryPage from "./pages/LibraryPage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/library",
      component: LibraryPage,
    }),
  ],
});
