import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
    }),
  ],
});
