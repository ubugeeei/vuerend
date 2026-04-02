import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      render: { strategy: "ssg" },
    }),
  ],
});
